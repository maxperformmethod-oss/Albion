/**
 * Orientačná mapa okolia z dát OpenStreetMap.
 *
 * Prečo nie Google: ich dlaždice aj 3D sú licencované, vyžadujú platený kľúč,
 * ich vlastný renderer, povinnú atribúciu a znamenali by third-party requesty.
 * Dáta OSM sú otvorené (ODbL), takže z nich smieme vykresliť **vlastnú** mapu,
 * v našich farbách, bez runtime requestov. Podmienkou je atribúcia — vykresľuje
 * ju `LocationMap.astro` v pätke mapy.
 *
 * ## Dve vrstvy
 *
 * **A — zapečený obraz** (`public/images/map-*.avif|webp`): podklad, koľajisko,
 * zeleň, spevnené plochy, vzdialené budovy aj s tieňmi, atmosférický úbytok,
 * vinetáž a zrno. Tiene a rozostrenie by v inline SVG stáli násobne viac než
 * celý tento obrázok.
 *
 * **B — inline SVG** nad ním: cesty, budovy v strede, obe stanice, Albion,
 * trasa, popisy, mierka a severka. Sem patrí všetko, čo sa animuje alebo nesie
 * informáciu.
 *
 * Obe vrstvy sedia na pixel, lebo obe počítajú cez `map-projection.mjs`.
 *
 * ## Spustenie
 *   node scripts/build-map.mjs              — použije cache, prekreslí obe vrstvy
 *   node scripts/build-map.mjs --refresh    — znova stiahne z Overpass
 *
 * Build ho nikdy nevolá automaticky — pravidlá Overpass to zakazujú a build by
 * bol krehký. Výsledky (`src/data/map-raw.json`, SVG aj obrázky) sa commitujú.
 */

import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { business, isConfirmed } from '../src/data/business.ts';
import { LOCALE_ORDER, getContent } from '../src/data/i18n.ts';
import { createProjection, LIGHT } from './map-projection.mjs';

const RAW = 'src/data/map-raw.json';
/**
 * Vrstva B sa generuje pre každý jazyk zvlášť — popisy v nej sú `<text>`,
 * teda súčasť SVG. Do HTML sa vždy vloží len tá jedna správna.
 */
const OUT_SVG = (locale) => `src/components/sections/map.generated.${locale}.svg`;
const OUT_IMAGES = 'public/images';

/** Polomer výrezu v metroch. */
const RADIUS_M = 180;

/** Do tohto polomeru idú budovy do vrstvy B (animujú sa). Zvyšok sa zapečie. */
const NEAR_M = 88;

const VIEW = { w: 1200, h: 700 };

const BUDGET = { svgKb: 35, imageKb: 60, imageMobileKb: 30 };

/** Douglas–Peucker tolerancia v metroch. Vzdialené budovy znesú viac. */
const SIMPLIFY_M = 0.6;
const SIMPLIFY_FAR_M = 1.4;

const MARKER_OFFSET_M = 8;
const MAX_ROUTE_DETOUR = 2.5;

/*
  Poistky na posun značky. Sú parametrizované zámerne — nemažú sa, menia sa
  hodnoty.

  Obe sú **na výslovný pokyn majiteľa** uvoľnené (dávka 12 §2): prevádzka je
  podľa neho hneď cez cestu za autobusovou stanicou. Objekt, ktorý tam
  heuristika našla, je v OSM otagovaný ako `building=roof`, lenže dáta sú
  v tejto časti Lučenca zjavne neúplné — to isté sme videli pri názve ulice.
  Majiteľ pozná svoju prevádzku lepšie než OSM tagy.

  Keď príde súradnica vchodu (docs/OTAZKY.md), obe poistky aj celá heuristika
  idú preč a použije sa priamo.
*/

/** Ako ďaleko od potvrdených súradníc smie skončiť značka. Bolo 40 m. */
const MAX_MARKER_SHIFT_M = 120;

/** Kolmá vzdialenosť značky od osi cesty — teda „cez cestu“. */
const MARKER_ACROSS_M = 10;

/** Dokedy ešte budova pri značke dostane zlatú strechu. */
const MAX_ANCHOR_DISTANCE_M = 25;

/** Smie byť kotvou objekt otagovaný ako prístrešok? Bolo `false`. */
const ALLOW_ROOF_ANCHOR = true;

/** Počet krokov vlny „mesto sa postaví“. */
const STAGGER_STEPS = 24;

/**
 * Paleta. Zapečený obraz rasterizuje librsvg, ktorá o `var(--color-*)` nevie,
 * takže tu musia byť literály. Musia sedieť s `src/styles/global.css`.
 */
const C = {
  ink900: '#1a1d22',
  ink800: '#22262c',
  ink700: '#2c3138',
  gold: '#c9b085',
  boneMuted: '#b8b3a9',
  bone: '#f3f0ea',
};

/** Tri hodnoty na troch plochách — to je to, čo oko číta ako hmotu. */
const SHADE = {
  roof: '#333944',
  roofEdge: '#424a57',
  wallLit: '#2a303b',
  wallDark: '#1e222b',
  roofNear: '#3a414d80',
};

const GROUND = {
  base: C.ink900,
  rail: '#1d2026',
  green: '#202626',
  paved: '#23272d',
  water: '#1b262e',
};

const USER_AGENT = `albion-web/1.0 (${business.siteUrl})`;

const refresh = process.argv.includes('--refresh');

const fail = (message) => {
  console.error(`\n${message}\n`);
  process.exit(1);
};

/* -------------------------------------------------------------------------
   1. Dáta
------------------------------------------------------------------------- */

async function fetchGeometry(center) {
  const { lat, lng } = center;
  const near = `(around:${RADIUS_M},${lat},${lng})`;
  const query = `[out:json][timeout:180];
(
  way["building"]${near};
  way["highway"]${near};
  way["railway"~"^(rail|station|halt)$"]${near};
  node["railway"~"^(station|halt)$"]${near};
  nwr["amenity"="bus_station"]${near};
  way["leisure"~"^(park|garden|pitch)$"]${near};
  way["landuse"~"^(grass|forest|meadow|industrial|railway)$"]${near};
  way["amenity"="parking"]${near};
  way["natural"="water"]${near};
  nwr["shop"="supermarket"]${near};
  nwr["amenity"~"^(hospital|school|place_of_worship)$"]${near};
);
out geom tags;`;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'User-Agent': USER_AGENT },
    body: new URLSearchParams({ data: query }),
  });
  if (!response.ok) fail(`Overpass vrátil ${response.status}.`);

  const json = await response.json();
  if (json.remark) fail(`Overpass: ${json.remark}`);
  return { center, fetchedAt: new Date().toISOString(), elements: json.elements };
}

/* -------------------------------------------------------------------------
   2. Geometria
------------------------------------------------------------------------- */

function simplify(points, tolerance) {
  if (points.length < 3) return points;

  const distance = (p, a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy);
    if (length === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    return Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) / length;
  };

  let index = 0;
  let max = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const d = distance(points[i], points[0], points[points.length - 1]);
    if (d > max) {
      max = d;
      index = i;
    }
  }
  if (max <= tolerance) return [points[0], points[points.length - 1]];

  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ];
}

function nearestOnSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t =
    lengthSq === 0
      ? 0
      : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq));
  const point = { x: a.x + t * dx, y: a.y + t * dy };
  return { point, dist: Math.hypot(p.x - point.x, p.y - point.y) };
}

function nearestOnPolyline(p, points) {
  let best = null;
  for (let i = 1; i < points.length; i += 1) {
    const candidate = nearestOnSegment(p, points[i - 1], points[i]);
    if (!best || candidate.dist < best.dist) best = candidate;
  }
  return best;
}

const centroidOf = (points) => ({
  x: points.reduce((s, p) => s + p.x, 0) / points.length,
  y: points.reduce((s, p) => s + p.y, 0) / points.length,
});

/** Plocha pôdorysu v m². */
const areaOf = (points) => {
  let sum = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    sum += points[j].x * points[i].y - points[i].x * points[j].y;
  }
  return Math.abs(sum) / 2;
};

const contains = (polygon, point) => {
  if (!point) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const straddles = a.y > point.y !== b.y > point.y;
    if (straddles && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
};

/**
 * Najkratšia cesta po uliciach (Dijkstra). Graf sa stavia z nezjednodušenej
 * geometrie — Douglas–Peucker vie zahodiť práve ten vrchol, ktorým sa dve
 * ulice stretávajú, a graf by sa ticho rozpadol.
 */
function shortestPath(roads, from, to) {
  const nodes = new Map();
  const nodeAt = (raw, metres) => {
    const key = `${raw.lat},${raw.lon}`;
    if (!nodes.has(key)) nodes.set(key, { metres, edges: [] });
    return nodes.get(key);
  };

  for (const road of roads) {
    for (let i = 1; i < road.raw.length; i += 1) {
      const a = nodeAt(road.raw[i - 1], road.rawMetres[i - 1]);
      const b = nodeAt(road.raw[i], road.rawMetres[i]);
      const weight = Math.hypot(a.metres.x - b.metres.x, a.metres.y - b.metres.y);
      a.edges.push({ to: b, weight });
      b.edges.push({ to: a, weight });
    }
  }

  const nearestNode = (metres) => {
    let best = null;
    for (const node of nodes.values()) {
      const d = Math.hypot(node.metres.x - metres.x, node.metres.y - metres.y);
      if (!best || d < best.d) best = { node, d };
    }
    return best ? best.node : null;
  };

  const start = nearestNode(from);
  const end = nearestNode(to);
  if (!start || !end || start === end) return null;

  const distance = new Map([[start, 0]]);
  const previous = new Map();
  const queue = new Set(nodes.values());

  while (queue.size > 0) {
    let current = null;
    for (const node of queue) {
      const d = distance.get(node);
      if (d === undefined) continue;
      if (current === null || d < distance.get(current)) current = node;
    }
    if (current === null || current === end) break;
    queue.delete(current);
    for (const edge of current.edges) {
      if (!queue.has(edge.to)) continue;
      const candidate = distance.get(current) + edge.weight;
      if (distance.get(edge.to) === undefined || candidate < distance.get(edge.to)) {
        distance.set(edge.to, candidate);
        previous.set(edge.to, current);
      }
    }
  }

  if (distance.get(end) === undefined) return null;
  const points = [];
  for (let node = end; node; node = previous.get(node)) points.unshift(node.metres);
  return { points, length: distance.get(end) };
}

/* -------------------------------------------------------------------------
   3. Zápis SVG
------------------------------------------------------------------------- */

const fmt = (n) => {
  const rounded = (Math.round(n * 10) / 10).toString();
  return rounded.startsWith('0.')
    ? rounded.slice(1)
    : rounded.startsWith('-0.')
      ? `-${rounded.slice(2)}`
      : rounded;
};

const path = (points) => {
  let out = '';
  points.forEach((point, index) => {
    const x = fmt(point.x);
    const y = fmt(point.y);
    if (index === 0) out += `M${x} ${y}`;
    else if (index === 1) out += `L${x}${y.startsWith('-') ? '' : ' '}${y}`;
    else out += `${x.startsWith('-') ? '' : ' '}${x}${y.startsWith('-') ? '' : ' '}${y}`;
  });
  return out;
};

const poly = (points) => `${path(points)}Z`;

/* -------------------------------------------------------------------------
   4. Výška a tieňovanie budov
------------------------------------------------------------------------- */

/**
 * Výška budovy. Poradie zdrojov: `height` → `building:levels` × 3 m →
 * odhad z plochy pôdorysu. Uniformná výška je hlavný dôvod, prečo mapa
 * vyzerá ako schéma a nie ako mesto.
 */
function heightOf(tags, area) {
  const explicit = Number.parseFloat(tags.height ?? '');
  if (Number.isFinite(explicit) && explicit > 0) return explicit;

  const levels = Number.parseFloat(tags['building:levels'] ?? '');
  if (Number.isFinite(levels) && levels > 0) return levels * 3;

  // Haly sú ploché a rozľahlé, bloky vysoké, rodinné domy nízke.
  if (area > 2000) return 5;
  if (area > 200) return 9 + Math.min(3, (area - 200) / 600);
  return 6;
}

/**
 * Vonkajšia normála hrany — tá z dvoch kolmíc, ktorá mieri preč od ťažiska.
 * Nezávisí od toho, ako je pôdorys v OSM navinutý.
 */
function outwardNormal(a, b, centroid) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const n = { x: dy, y: -dx };
  const away = (mid.x - centroid.x) * n.x + (mid.y - centroid.y) * n.y;
  return away >= 0 ? n : { x: -n.x, y: -n.y };
}

/**
 * Jedna budova ako hmota: vrhnutý tieň, steny v dvoch hodnotách, strecha
 * a odlesk na hornej hrane.
 */
function buildingMarkup(building, projection, options = {}) {
  const { toView, zOffset } = projection;
  const { metres, tags, height, isAnchor, isLandmark, near } = building;

  const zone = zOffset(height);
  const base = metres.map(toView);
  const top = base.map((p) => ({ x: p.x, y: p.y - zone }));
  const centroid = centroidOf(metres);

  const walls = { lit: [], dark: [] };

  for (let i = 1; i < metres.length; i += 1) {
    const a = metres[i - 1];
    const b = metres[i];
    const normal = outwardNormal(a, b, centroid);

    // Zadné steny sú v axonometrii schované za telom budovy.
    const p = base[i - 1];
    const q = base[i];
    const frontFacing = centroidOf(base).y <= (p.y + q.y) / 2;
    if (!frontFacing) continue;

    const lit = normal.x * LIGHT.x + normal.y * LIGHT.y < 0;
    const quad = poly([p, q, { x: q.x, y: q.y - zone }, { x: p.x, y: p.y - zone }]);
    walls[lit ? 'lit' : 'dark'].push(quad);
  }

  const roofFill = isAnchor
    ? `${C.gold}38`
    : near
      ? SHADE.roofNear
      : SHADE.roof;

  const pieces = [];
  if (walls.dark.length > 0) {
    pieces.push(`<path class="wd" d="${walls.dark.join('')}"/>`);
  }
  if (walls.lit.length > 0) {
    pieces.push(`<path class="wl" d="${walls.lit.join('')}"/>`);
  }
  pieces.push(
    `<path class="rf${isAnchor ? ' rf-a' : ''}" d="${poly(top)}"${
      options.inlineFill ? ` fill="${roofFill}"` : ''
    }/>`
  );

  return { markup: pieces.join(''), top, base, height, zone, tags, isLandmark };
}

/* -------------------------------------------------------------------------
   5. Beh
------------------------------------------------------------------------- */

if (!isConfirmed(business.geo)) {
  fail('business.geo nie je potvrdené. Súradnice sa nevymýšľajú — pozri docs/OTAZKY.md.');
}

const center = business.geo;

let data;
if (!refresh && existsSync(RAW)) {
  data = JSON.parse(await readFile(RAW, 'utf8'));
  console.log(`cache ${RAW} (stiahnuté ${data.fetchedAt})`);
} else {
  data = await fetchGeometry(center);
  await mkdir('src/data', { recursive: true });
  await writeFile(RAW, JSON.stringify(data));
  console.log(`Overpass: ${data.elements.length} prvkov`);
}

const projection = createProjection({ center, radiusM: RADIUS_M, view: VIEW });
const { toMetres, toView, zOffset } = projection;

const anchorMetres = toMetres({ lat: business.geo.lat, lon: business.geo.lng });

/* --- triedenie prvkov ---------------------------------------------------- */

const buildings = [];
const roads = [];
const rails = [];
const areas = [];
let stationRaw = null;
let busRaw = null;

const ROAD_STYLE = {
  primary: { w: 9, tone: 0.18 },
  secondary: { w: 8, tone: 0.16 },
  tertiary: { w: 7, tone: 0.14 },
  residential: { w: 6, tone: 0.12 },
  unclassified: { w: 6, tone: 0.11 },
  service: { w: 4, tone: 0.09 },
  living_street: { w: 5, tone: 0.1 },
  pedestrian: { w: 4, tone: 0.09 },
  footway: { w: 2, tone: 0.08, dashed: true },
  path: { w: 2, tone: 0.07, dashed: true },
  steps: { w: 2, tone: 0.07, dashed: true },
  cycleway: { w: 2, tone: 0.07, dashed: true },
};

for (const element of data.elements) {
  const tags = element.tags ?? {};

  if (element.type === 'node') {
    if (!stationRaw && /^(station|halt)$/.test(tags.railway ?? '')) {
      stationRaw = { lat: element.lat, lon: element.lon };
    }
    if (!busRaw && tags.amenity === 'bus_station') {
      busRaw = { lat: element.lat, lon: element.lon };
    }
    continue;
  }

  if (!element.geometry || element.geometry.length < 2) continue;
  const rawMetres = element.geometry.map(toMetres);

  if (tags.building || tags.amenity === 'bus_station') {
    const centroid = centroidOf(rawMetres);
    const distance = Math.hypot(centroid.x - anchorMetres.x, centroid.y - anchorMetres.y);
    const near = distance <= NEAR_M;
    const metres = simplify(rawMetres, near ? SIMPLIFY_M : SIMPLIFY_FAR_M);
    const area = areaOf(metres);
    const isLandmark =
      tags.building === 'train_station' ||
      tags.railway === 'station' ||
      tags.public_transport === 'station' ||
      tags.amenity === 'bus_station';

    buildings.push({
      metres,
      tags,
      area,
      centroid,
      distance,
      near,
      isLandmark,
      height: heightOf(tags, area) * (isLandmark ? 1.35 : 1),
    });

    if (!busRaw && tags.amenity === 'bus_station') {
      const middle = element.geometry[Math.floor(element.geometry.length / 2)];
      busRaw = { lat: middle.lat, lon: middle.lon };
    }
    continue;
  }

  if (tags.railway === 'rail') {
    rails.push({ metres: simplify(rawMetres, SIMPLIFY_M) });
    continue;
  }

  if (tags.highway) {
    /*
      Neznámy typ cesty sa nezahadzuje, len dostane predvolený štýl. Vypadnutá
      cesta by rozpojila graf, po ktorom sa hľadá trasa — a chýbala by ticho.
    */
    const style = ROAD_STYLE[tags.highway] ?? { w: 4, tone: 0.08 };
    roads.push({
      metres: simplify(rawMetres, SIMPLIFY_M),
      raw: element.geometry,
      rawMetres,
      tags,
      style,
    });
    continue;
  }

  const surface =
    tags.natural === 'water'
      ? GROUND.water
      : tags.leisure || /^(grass|forest|meadow)$/.test(tags.landuse ?? '')
        ? GROUND.green
        : tags.amenity === 'parking' || /^(industrial|railway)$/.test(tags.landuse ?? '')
          ? GROUND.paved
          : null;
  if (surface) areas.push({ metres: simplify(rawMetres, SIMPLIFY_FAR_M), surface });
}

/*
  Popisy orientačných bodov. Len z OSM `name` — čo si prečítam na cudzej mape,
  nie je overený údaj a nemá sa čo objaviť v našej. Ak objekt meno nemá,
  nevymýšľa sa.

  Maximálne štyri okrem Albionu; viac je zoznam firiem, nie orientácia.
  Prevádzky typu pizzeria, taxi či lekáreň sa nepopisujú — zaplnili by mapu
  a zobrali pozornosť Albionu. Konkurencia nikdy.
*/
const LANDMARK_RANK = { supermarket: 1, hospital: 2, school: 3, place_of_worship: 4 };

const landmarks = [];
for (const element of data.elements) {
  const tags = element.tags ?? {};
  const name = tags.name;
  if (!name || tags.shop === 'pawnbroker') continue;

  const kind =
    tags.shop === 'supermarket'
      ? 'supermarket'
      : tags.amenity === 'hospital'
        ? 'hospital'
        : tags.amenity === 'school'
          ? 'school'
          : tags.amenity === 'place_of_worship'
            ? 'place_of_worship'
            : null;
  if (!kind) continue;

  const point =
    element.type === 'node'
      ? toMetres({ lat: element.lat, lon: element.lon })
      : element.geometry
        ? centroidOf(element.geometry.map(toMetres))
        : null;
  if (!point) continue;
  if (landmarks.some((l) => l.name === name)) continue;

  landmarks.push({ name, point, rank: LANDMARK_RANK[kind] });
}

landmarks.sort((a, b) => a.rank - b.rank);
const stationMetres = stationRaw ? toMetres(stationRaw) : null;
const busMetres = busRaw ? toMetres(busRaw) : null;

/* --- §1 poloha značky ---------------------------------------------------- */



let markerMetres = anchorMetres;
let projectionMetres = null;
let markerNote = '';

/*
  Základ: kolmý priemet potvrdených súradníc na cestu smerom k stanici.
  Slúži ako koncový bod pre prvý výpočet trasy — samotnú polohu značky určí
  až tretí lom tejto trasy (nižšie).
*/
if (roads.length > 0) {
  const toStation = stationMetres
    ? { x: stationMetres.x - anchorMetres.x, y: stationMetres.y - anchorMetres.y }
    : null;
  const candidates = roads
    .map((road) => nearestOnPolyline(anchorMetres, road.metres))
    .filter(Boolean);
  const pool = toStation
    ? candidates.filter(
        (c) =>
          (c.point.x - anchorMetres.x) * toStation.x +
            (c.point.y - anchorMetres.y) * toStation.y >
          0
      )
    : candidates;
  const nearest = (pool.length > 0 ? pool : candidates).reduce((best, c) =>
    c.dist < best.dist ? c : best
  );
  projectionMetres = nearest.point;
  const dx = anchorMetres.x - nearest.point.x;
  const dy = anchorMetres.y - nearest.point.y;
  const length = Math.hypot(dx, dy) || 1;
  const offset = Math.min(MARKER_OFFSET_M, length);
  markerMetres = {
    x: nearest.point.x + (dx / length) * offset,
    y: nearest.point.y + (dy / length) * offset,
  };
}

/* --- budova Albionu ------------------------------------------------------ */

/* --- trasa --------------------------------------------------------------- */

let routeMetres = null;
let routeLength = null;
if (stationMetres && projectionMetres && roads.length > 0) {
  const found = shortestPath(roads, stationMetres, projectionMetres);
  const direct = Math.hypot(
    stationMetres.x - projectionMetres.x,
    stationMetres.y - projectionMetres.y
  );
  if (found && found.length <= direct * MAX_ROUTE_DETOUR) {
    routeMetres = [stationMetres, ...found.points, projectionMetres, markerMetres];
    routeLength = found.length;
  }
}

/* --- §1 poloha z tretieho lomu trasy ------------------------------------- */

/**
 * Majiteľ to popísal jednoznačne: prevádzka je tam, kde sa trasa láme
 * **tretíkrát**, priamo cez cestu. To sa dá vypočítať, nie odhadnúť.
 *
 * Významný lom = zmena smeru o 60° a viac; drobné zakrivenia ciest sa
 * ignorujú. Ak trasa tri také lomy nemá, prah klesne na 45°. Ak ani tak,
 * značka zostane tam, kde bola, a je to v reporte.
 *
 * Bod ide na vonkajšiu stranu zákruty, kolmo ~10 m od osi — teda cez cestu,
 * nie do jej stredu.
 */
function bendAt(points, minAngle) {
  const bends = [];
  for (let i = 1; i < points.length - 1; i += 1) {
    const a = { x: points[i].x - points[i - 1].x, y: points[i].y - points[i - 1].y };
    const b = { x: points[i + 1].x - points[i].x, y: points[i + 1].y - points[i].y };
    const angle =
      (Math.abs(Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y)) * 180) /
      Math.PI;
    if (angle >= minAngle) bends.push({ point: points[i], a, b });
  }
  return bends.length >= 3 ? bends[2] : null;
}

if (routeMetres) {
  const bend = bendAt(routeMetres, 60) ?? bendAt(routeMetres, 45);

  if (bend) {
    const norm = (v) => {
      const l = Math.hypot(v.x, v.y) || 1;
      return { x: v.x / l, y: v.y / l };
    };
    const incoming = norm({ x: -bend.a.x, y: -bend.a.y });
    const outgoing = norm(bend.b);
    // Vnútro zákruty je súčet oboch ramien; prevádzka je na opačnej strane.
    const inward = norm({ x: incoming.x + outgoing.x, y: incoming.y + outgoing.y });
    markerMetres = {
      x: bend.point.x - inward.x * MARKER_ACROSS_M,
      y: bend.point.y - inward.y * MARKER_ACROSS_M,
    };
    projectionMetres = bend.point;
    markerNote = `značka z tretieho lomu trasy, ${fmt(
      Math.hypot(markerMetres.x - anchorMetres.x, markerMetres.y - anchorMetres.y)
    )} m od potvrdenej značky`;

    const again = shortestPath(roads, stationMetres, projectionMetres);
    if (again) {
      routeMetres = [stationMetres, ...again.points, projectionMetres, markerMetres];
      routeLength = again.length;
    }
  } else {
    markerNote = 'trasa nemá tri lomy ani pri 45° — značka zostáva na priemete';
  }
} else {
  markerNote = 'trasa sa nevykreslila — značka zostáva na priemete';
}

/* --- zvýraznená budova ---------------------------------------------------- */

/*
  Budova sa určuje **výhradne zo značky**, a to až keď je značka finálna.
  Predtým to boli dva nezávislé výpočty a zlatý obrys skončil na inej budove,
  než kde stál bod. Ak značka nemá budovu do 25 m, nezvýrazní sa nič —
  samotný bod stačí.
*/
let anchorIndex = buildings.findIndex((b) => contains(b.metres, markerMetres));
if (anchorIndex < 0) {
  let best = MAX_ANCHOR_DISTANCE_M;
  buildings.forEach((building, index) => {
    const nearest = nearestOnPolyline(markerMetres, building.metres);
    if (nearest && nearest.dist < best) {
      best = nearest.dist;
      anchorIndex = index;
    }
  });
}
if (anchorIndex >= 0) {
  buildings[anchorIndex].isAnchor = true;
  buildings[anchorIndex].near = true;
  buildings[anchorIndex].height = Math.max(buildings[anchorIndex].height, 11) * 1.15;
}

for (const building of buildings) {
  if (building.isAnchor) continue;
  const d = Math.hypot(
    building.centroid.x - markerMetres.x,
    building.centroid.y - markerMetres.y
  );
  building.lifted = d <= 30;
}

/* --- poradie kreslenia --------------------------------------------------- */

/*
  Maliarov algoritmus. Bez neho vzdialené budovy prekrývajú bližšie a scéna sa
  vizuálne rozpadne — býva to hlavná príčina „plochého“ dojmu.
*/
const ordered = [...buildings].sort(
  (a, b) => a.centroid.x + a.centroid.y - (b.centroid.x + b.centroid.y)
);

const far = ordered.filter((b) => !b.near && !b.isAnchor);
const near = ordered.filter((b) => b.near || b.isAnchor);

/* -------------------------------------------------------------------------
   6. Vrstva A — zapečený obraz
------------------------------------------------------------------------- */

const shadowOf = (building) => {
  const drop = zOffset(building.height) * 0.6;
  const shifted = building.metres
    .map(toView)
    .map((p) => ({ x: p.x + drop * 0.5, y: p.y + drop * 0.55 }));
  return poly(shifted);
};

const roadPath = (road, lift = 0) =>
  path(road.metres.map((m) => toView(m)).map((p) => ({ x: p.x, y: p.y - lift })));

const layerA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}">
<defs>
  <radialGradient id="fade" cx="50%" cy="50%" r="62%">
    <stop offset="0%" stop-color="${GROUND.base}" stop-opacity="0"/>
    <stop offset="55%" stop-color="${GROUND.base}" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="${GROUND.base}" stop-opacity="0.86"/>
  </radialGradient>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
  <filter id="grain">
    <feTurbulence baseFrequency="0.8"/>
  </filter>
</defs>

<rect width="${VIEW.w}" height="${VIEW.h}" fill="${GROUND.base}"/>

<g>${areas.map((a) => `<path d="${poly(a.metres.map(toView))}" fill="${a.surface}"/>`).join('')}</g>

<g fill="none" stroke="${GROUND.rail}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
${rails.map((r) => `<path d="${path(r.metres.map(toView))}"/>`).join('')}
</g>
<g fill="none" stroke="${C.boneMuted}" stroke-opacity="0.22" stroke-width="1.4">
${rails.map((r) => `<path d="${path(r.metres.map(toView))}"/>`).join('')}
</g>

<g fill="#000" opacity="0.35" filter="url(#soft)">
${far.map((b) => `<path d="${shadowOf(b)}"/>`).join('')}
</g>

<g>
${far
  .map((b) => {
    // librsvg nepozná naše triedy — vo vrstve A sa preto menia na atribúty.
    const { markup } = buildingMarkup(b, projection);
    return markup
      .replace(/class="wd"/g, `fill="${SHADE.wallDark}"`)
      .replace(/class="wl"/g, `fill="${SHADE.wallLit}"`)
      .replace(
        /class="rf"/g,
        `fill="${SHADE.roof}" stroke="${SHADE.roofEdge}" stroke-width="0.6"`
      );
  })
  .join('')}
</g>

<rect width="${VIEW.w}" height="${VIEW.h}" fill="url(#fade)"/>
<rect width="${VIEW.w}" height="${VIEW.h}" filter="url(#grain)" opacity="0.035"/>
</svg>`;

await mkdir(OUT_IMAGES, { recursive: true });

const raster = async (width, quality, name) => {
  const buffer = Buffer.from(layerA);
  const avif = await sharp(buffer, { density: (width / VIEW.w) * 96 })
    .resize({ width })
    .avif({ quality, effort: 6 })
    .toFile(`${OUT_IMAGES}/${name}.avif`);
  const webp = await sharp(buffer, { density: (width / VIEW.w) * 96 })
    .resize({ width })
    .webp({ quality: quality + 20, effort: 6 })
    .toFile(`${OUT_IMAGES}/${name}.webp`);
  return { avif: avif.size / 1024, webp: webp.size / 1024 };
};

const big = await raster(1600, 46, 'map-1600');
const small = await raster(760, 50, 'map-760');

/* -------------------------------------------------------------------------
   7. Vrstva B — inline SVG
------------------------------------------------------------------------- */


const nearMarkup = near
  .map((building, index) => {
    const { markup } = buildingMarkup(building, projection);
    const step = Math.min(
      STAGGER_STEPS,
      Math.floor((index / Math.max(1, near.length)) * (STAGGER_STEPS + 1))
    );
    const classes = ['b'];
    if (building.isAnchor) classes.push('b-a');
    if (building.lifted) classes.push('b-n');
    return `<g class="${classes.join(' ')}" style="--d:${step}">${markup}</g>`;
  })
  .join('\n');

const nearShadows = near
  .map((b) => `<path d="${shadowOf(b)}"/>`)
  .join('');

const roadMarkup = roads
  .map((road) => {
    const d = roadPath(road);
    const { w, tone, dashed } = road.style;
    return (
      `<path class="rc" d="${d}" stroke-width="${w + 2}"/>` +
      `<path class="rr${dashed ? ' rr-d' : ''}" d="${d}" stroke-width="${w}" stroke-opacity="${tone}" pathLength="1"/>`
    );
  })
  .join('\n');

const markerView = toView(markerMetres);

/*
  Popis sa vykreslí, len ak sa doň zmestí a nekoliduje s dôležitejším.
  Prekrývajúce sa popisy sa nepresúvajú do nezmyselných pozícií — vynechá sa
  ten menej dôležitý.
*/
const landmarkLabels = [];
{
  const taken = [stationMetres, busMetres, markerMetres]
    .filter(Boolean)
    .map(toView);
  for (const landmark of landmarks) {
    const view = toView(landmark.point);
    if (view.x < 90 || view.x > VIEW.w - 90 || view.y < 60 || view.y > VIEW.h - 70) continue;
    if (taken.some((t) => Math.hypot(t.x - view.x, t.y - view.y) < 110)) continue;
    taken.push(view);
    landmarkLabels.push(landmark);
    if (landmarkLabels.length === 4) break;
  }
}

const stationView = stationMetres ? toView(stationMetres) : null;
const busView = busMetres ? toView(busMetres) : null;
const glowRadius = 30 * projection.scale;

const label = (point, text, cls, dy) =>
  point
    ? `<text class="${cls}" x="${fmt(point.x)}" y="${fmt(point.y + dy)}" text-anchor="middle">${text}</text>`
    : '';

const routePath = routeMetres ? path(routeMetres.map(toView)) : null;

/** Mierka: 50 m pozdĺž východnej osi, teda po izometrickej vodorovnej. */
const scaleBar = 50 * projection.scale * Math.cos(Math.PI / 6);
const scaleX = VIEW.w - 40 - scaleBar;
const scaleY = VIEW.h - 60;

/** Severka: sever je v tomto skosení vpravo hore. */
const northX = 64;
const northY = 48;

let svgKbMax = 0;
for (const locale of LOCALE_ORDER) {
  const map = getContent(locale).location.map;

  const layerB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" class="map" role="img" aria-labelledby="mapTitle mapDesc">
  <title id="mapTitle">${map.title}</title>
  <desc id="mapDesc">${map.desc.replace('{street}', business.street)}</desc>
  <defs>
  <radialGradient id="albionGlow">
  <stop offset="0%" stop-color="${C.gold}" stop-opacity="0.22"/>
  <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
  </radialGradient>
  <filter id="nearShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
  ${routePath ? `<mask id="routeMask"><path class="route-mask" pathLength="1" d="${routePath}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/></mask>` : ''}
  </defs>

  <g class="roads">
  ${roadMarkup}
  </g>

  <ellipse class="glow" cx="${fmt(markerView.x)}" cy="${fmt(markerView.y)}" rx="${fmt(glowRadius)}" ry="${fmt(glowRadius * 0.5)}" fill="url(#albionGlow)"/>

  <g class="shadows" filter="url(#nearShadow)">${nearShadows}</g>

  <g class="buildings">
  ${nearMarkup}
  </g>

  ${routePath ? `<path class="route" mask="url(#routeMask)" d="${routePath}"/>` : ''}

  <g class="here">
  <circle cx="${fmt(markerView.x)}" cy="${fmt(markerView.y)}" r="18" class="halo"/>
  <circle cx="${fmt(markerView.x)}" cy="${fmt(markerView.y)}" r="18" class="pulse"/>
  <circle cx="${fmt(markerView.x)}" cy="${fmt(markerView.y)}" r="9" class="dot"/>
  </g>

  ${label(stationView, map.station, 'label', -30)}
  ${label(busView, map.busStation, 'label', 40)}
${landmarkLabels.map((l) => label(toView(l.point), l.name, 'label label-sm', -24)).join('\n')}
  ${label(markerView, map.here, 'here-label', -38)}

  <g class="chrome">
  <path d="M${fmt(scaleX)} ${scaleY}h${fmt(scaleBar)}M${fmt(scaleX)} ${scaleY - 4}v8M${fmt(scaleX + scaleBar)} ${scaleY - 4}v8"/>
  <text class="chrome-text" x="${fmt(scaleX + scaleBar / 2)}" y="${scaleY - 10}" text-anchor="middle">${map.scale}</text>
  <path d="M${northX} ${northY + 16}L${northX + 14} ${northY + 8}"/>
  <path d="M${northX + 14} ${northY + 8}l-5 -1 1 5Z" class="chrome-fill"/>
  <text class="chrome-text" x="${northX - 4}" y="${northY + 22}" text-anchor="end">${map.north}</text>
  </g>

  <text class="note" x="24" y="${VIEW.h - 24}" text-anchor="start">${map.note}</text>
  </svg>
  `;

  await writeFile(OUT_SVG(locale), layerB);
  svgKbMax = Math.max(svgKbMax, Buffer.byteLength(layerB) / 1024);
}


/* -------------------------------------------------------------------------
   8. Výpis
------------------------------------------------------------------------- */

const svgKb = svgKbMax;

console.log(`\nvrstva A  map-1600.avif  ${big.avif.toFixed(1)} kB  (webp ${big.webp.toFixed(1)} kB)`);
console.log(`vrstva A  map-760.avif   ${small.avif.toFixed(1)} kB  (webp ${small.webp.toFixed(1)} kB)`);
console.log(`vrstva B  map.generated.<jazyk>.svg  ${svgKb.toFixed(1)} kB (najväčšia verzia)`);
console.log(
  `\nbudov ${buildings.length} (v strede ${near.length}, zapečených ${far.length}), ` +
    `ulíc ${roads.length}, koľají ${rails.length}, plôch ${areas.length}`
);
console.log(markerNote);
console.log(
  `značka: ${fmt(markerMetres.x)}, ${fmt(markerMetres.y)} m od stredu · ` +
    `od autobusovej stanice ${
      busMetres
        ? fmt(Math.hypot(markerMetres.x - busMetres.x, markerMetres.y - busMetres.y))
        : '?'
    } m · od železničnej ${
      stationMetres
        ? fmt(Math.hypot(markerMetres.x - stationMetres.x, markerMetres.y - stationMetres.y))
        : '?'
    } m`
);
console.log(
  routePath ? `trasa po uliciach, ${Math.round(routeLength)} m` : '⚠ trasa sa nekreslí'
);

const over = [];
if (big.avif > BUDGET.imageKb) over.push(`obraz 1600 (${big.avif.toFixed(1)} > ${BUDGET.imageKb})`);
if (small.avif > BUDGET.imageMobileKb) over.push(`obraz 760 (${small.avif.toFixed(1)} > ${BUDGET.imageMobileKb})`);
if (svgKb > BUDGET.svgKb) over.push(`SVG (${svgKb.toFixed(1)} > ${BUDGET.svgKb})`);

if (over.length > 0) {
  console.log(`\n⚠ NAD ROZPOČET: ${over.join(', ')}`);
  console.log('Najprv zjednoduš polygóny vzdialených budov, potom zmenši výrez.');
  process.exit(1);
}
