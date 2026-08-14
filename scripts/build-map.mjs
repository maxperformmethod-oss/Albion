/**
 * Orientačná mapa okolia z dát OpenStreetMap.
 *
 * Prečo nie Google: ich dlaždice aj 3D sú licencované, vyžadujú platený kľúč,
 * ich vlastný renderer, povinnú atribúciu a znamenali by third-party requesty.
 * Dáta OSM sú otvorené (ODbL), takže z nich smieme vykresliť **vlastnú** mapu
 * so skutočnými pôdorysmi budov a skutočnou geometriou ulíc, v našich farbách,
 * ako statické SVG bez jediného runtime requestu. Jediná podmienka je atribúcia
 * — vykresľuje ju `LocationMap.astro` v pätke mapy.
 *
 * Spustenie:
 *   node scripts/build-map.mjs              — použije cache, prekreslí SVG
 *   node scripts/build-map.mjs --refresh    — znova stiahne z Overpass
 *   node scripts/build-map.mjs --preview=48.336,19.668
 *                                           — kontrolný render okolo daného
 *                                             bodu do súboru `*.preview.svg`;
 *                                             NIKDY neprepíše ostrú mapu
 *
 * Build ho nikdy nevolá automaticky — pravidlá Overpass to zakazujú a build by
 * bol krehký. Výsledok (`src/data/map-raw.json` aj hotové SVG) sa commituje.
 *
 * Kotva mapy je `business.geo`. Kým nie je potvrdená, skript ostrú mapu
 * odmietne vykresliť. Súradnice sa nevymýšľajú — pozri docs/OTAZKY.md.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { business, isConfirmed, streetName } from '../src/data/business.ts';
import { content } from '../src/data/content.ts';

const RAW = 'src/data/map-raw.json';
/** Cache kontrolného renderu. Necommituje sa — pozri .gitignore. */
const RAW_PREVIEW = 'src/data/map-raw.preview.json';
const OUT = 'src/components/sections/map.generated.svg';
const PREVIEW = 'src/components/sections/map.preview.svg';

/**
 * Polomer výrezu v metroch. Okolie prevádzky je hustejšie zastavané než okolie
 * stanice, takže 350 aj 250 m prekročilo rozpočet. Pri 180 m sa vojde, a obe
 * stanice — železničná (135 m) aj autobusová (61 m) — sú v zábere.
 */
const RADIUS_M = 180;

/** Rozpočet hotového SVG. Mapa je nosný prvok sekcie a stojí to za to. */
const MAX_KB = 75;

/** Douglas–Peucker tolerancia v metroch. */
const SIMPLIFY_M = 0.6;

/** O koľko metrov od cesty stojí značka, smerom k budove. */
const MARKER_OFFSET_M = 8;

/** Koľkonásobok vzdušnej vzdialenosti ešte znesie trasa po uliciach. */
const MAX_ROUTE_DETOUR = 2.5;

const VIEW = { w: 1200, h: 700 };

/** Počet krokov vlny „mesto sa postaví“. 21 × 12 ms = max 252 ms. */
const STAGGER_STEPS = 20;

/** Výška extrúzie v px. Stanice a Albion sú vyššie, aby sa dali nájsť očami. */
const WALL_H = 12;
const WALL_H_LANDMARK = 18;

const USER_AGENT = `albion-web/1.0 (${business.siteUrl})`;

const args = process.argv.slice(2);
const refresh = args.includes('--refresh');
const previewArg = args.find((a) => a.startsWith('--preview='));

const fail = (message) => {
  console.error(`\n${message}\n`);
  process.exit(1);
};

/* -------------------------------------------------------------------------
   1. Kotva
------------------------------------------------------------------------- */

/**
 * Geokóduje adresu cez Nominatim a **overí** výsledok proti `business.ts`.
 * Nominatim vracia aj vzdialené zhody s rovnakým názvom ulice v inom meste —
 * bez tejto kontroly by mapa ukázala úplne iné mesto a vyzerala by pritom
 * úplne v poriadku. Preto sa vyžaduje zhoda mesta aj ulice.
 *
 * Dnes sa nepoužije: `business.geo` je potvrdené z Google profilu. Zostáva
 * pre prípad, že by sa prevádzka presťahovala.
 */
async function geocode() {
  const query = new URLSearchParams({
    street: business.street,
    city: business.city,
    country: 'Slovakia',
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${query}`,
    { headers: { 'User-Agent': USER_AGENT } }
  );
  if (!response.ok) fail(`Nominatim vrátil ${response.status}.`);

  const results = await response.json();
  const wanted = (streetName ?? '').toLowerCase();

  const match = results.find((result) => {
    const town = (
      result.address?.town ??
      result.address?.city ??
      result.address?.village ??
      ''
    ).toLowerCase();
    const road = (result.address?.road ?? '').toLowerCase();
    return town === business.city.toLowerCase() && road.includes(wanted);
  });

  if (!match) {
    fail(
      `Nominatim nenašiel „${business.street}, ${business.city}“.\n` +
        `Vrátil ${results.length} výsledkov, ani jeden nie je v meste ${business.city}:\n` +
        results.map((r) => `  · ${r.display_name}`).join('\n') +
        `\n\nSúradnice si nevymýšľam. Doplň ich ručne do business.geo` +
        ` (napr. z odkazu v business.mapsUrl) a spusti znova.`
    );
  }

  return { lat: Number(match.lat), lng: Number(match.lon) };
}

/* -------------------------------------------------------------------------
   2. Geometria
------------------------------------------------------------------------- */

async function fetchGeometry(center) {
  const { lat, lng } = center;
  const query = `[out:json][timeout:120];
(
  way["building"](around:${RADIUS_M},${lat},${lng});
  way["highway"](around:${RADIUS_M},${lat},${lng});
  way["railway"~"^(rail|station|halt)$"](around:${RADIUS_M},${lat},${lng});
  node["railway"~"^(station|halt)$"](around:${RADIUS_M},${lat},${lng});
  nwr["amenity"="bus_station"](around:${RADIUS_M},${lat},${lng});
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
   3. Projekcia a zjednodušenie
------------------------------------------------------------------------- */

/** Lokálna rovinná projekcia okolo stredu. Metre, x na východ, y na juh. */
const toMetres = (center) => (point) => ({
  x: (point.lon - center.lng) * 111320 * Math.cos((center.lat * Math.PI) / 180),
  y: (center.lat - point.lat) * 110540,
});

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/** Izometrické skosenie. */
const isometric = ({ x, y }) => ({
  x: (x - y) * COS30,
  y: (x + y) * SIN30,
});

/** Douglas–Peucker. Body sú v metroch, takže tolerancia je v metroch. */
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

/** Najbližší bod na úsečke a jeho vzdialenosť. */
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

/** Kolmý priemet bodu na lomenú čiaru. */
function nearestOnPolyline(p, points) {
  let best = null;
  for (let i = 1; i < points.length; i += 1) {
    const candidate = nearestOnSegment(p, points[i - 1], points[i]);
    if (!best || candidate.dist < best.dist) best = candidate;
  }
  return best;
}

/**
 * Najkratšia cesta po uliciach (Dijkstra).
 *
 * Graf sa stavia z **nezjednodušenej** geometrie — Douglas–Peucker vie zahodiť
 * práve ten vrchol, ktorým sa dve ulice stretávajú, a graf by sa rozpadol.
 * Uzly sa kľúčujú surovými súradnicami z OSM, takže križovatky sadnú na seba
 * presne: je to fyzicky ten istý uzol v tých istých dátach.
 */
function shortestPath(roads, fromMetres, toMetres_) {
  const nodes = new Map();

  const nodeAt = (raw, metres) => {
    const key = `${raw.lat},${raw.lon}`;
    if (!nodes.has(key)) nodes.set(key, { metres, edges: [] });
    return nodes.get(key);
  };

  for (const road of roads) {
    for (let i = 0; i < road.raw.length; i += 1) {
      const node = nodeAt(road.raw[i], road.rawMetres[i]);
      if (i === 0) continue;
      const previous = nodeAt(road.raw[i - 1], road.rawMetres[i - 1]);
      const weight = Math.hypot(
        node.metres.x - previous.metres.x,
        node.metres.y - previous.metres.y
      );
      node.edges.push({ to: previous, weight });
      previous.edges.push({ to: node, weight });
    }
  }

  const nearestNode = (metres) => {
    let best = null;
    for (const node of nodes.values()) {
      const distance = Math.hypot(node.metres.x - metres.x, node.metres.y - metres.y);
      if (!best || distance < best.distance) best = { node, distance };
    }
    return best ? best.node : null;
  };

  const start = nearestNode(fromMetres);
  const end = nearestNode(toMetres_);
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
   4. Render
------------------------------------------------------------------------- */

/*
  Kompaktný zápis cesty. Pri stovkách budov je formát súradníc väčšia položka
  než ich počet: jedno desatinné miesto, bez nuly pred desatinnou čiarkou,
  `L` sa neopakuje (implicitné lineto) a pred záporným číslom netreba medzeru.
  Je to čisto zápis — na geometrii sa nemení nič.
*/
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

/** Leží bod vnútri pôdorysu? Ray casting. */
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

function render(data, { anchor }) {
  const project = toMetres(data.center);

  /** Metre → izometria → viewBox. Mierka sa počíta z polomeru výrezu. */
  const scale = (VIEW.w * 0.46) / (RADIUS_M * COS30);
  const toView = (metres) => {
    const iso = isometric(metres);
    return { x: VIEW.w / 2 + iso.x * scale, y: VIEW.h / 2 + iso.y * scale };
  };

  const buildings = [];
  const roads = [];
  const rails = [];
  let stationRaw = null;
  let busRaw = null;

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

    const rawMetres = element.geometry.map(project);
    const metres = simplify(rawMetres, SIMPLIFY_M);

    if (tags.building || tags.amenity === 'bus_station') {
      buildings.push({ metres, tags });
      if (!busRaw && tags.amenity === 'bus_station') {
        const middle = element.geometry[Math.floor(element.geometry.length / 2)];
        busRaw = { lat: middle.lat, lon: middle.lon };
      }
    } else if (tags.railway === 'rail') {
      rails.push({ metres });
    } else if (tags.highway) {
      roads.push({ metres, raw: element.geometry, rawMetres, tags });
    }
  }

  const stationMetres = stationRaw ? project(stationRaw) : null;
  const busMetres = busRaw ? project(busRaw) : null;
  const anchorMetres = anchor ? project(anchor) : null;

  /*
    Poloha značky.

    Google značka ukazuje na ťažisko parcely, nie na vchod — na schéme potom bod
    sedel vnútri bloku, hoci prevádzka stojí priamo pri ceste oproti stanici.
    Posun je preto deterministický, nie odhadnutý:

      1. spomedzi ciest sa vezme tá, ktorej najbližší bod leží smerom
         k stanici (polrovina daná vektorom prevádzka → stanica),
      2. z potvrdených súradníc sa spraví kolmý priemet na jej geometriu,
      3. značka sa posunie 8 m od cesty späť smerom k pôvodným súradniciam,
         teda medzi cestu a budovu.

    `business.geo` sa tým **nemení** — v JSON-LD zostávajú pôvodné potvrdené
    súradnice z Google profilu. Posun je len vizuálny, kvôli čitateľnosti.
  */
  let markerMetres = anchorMetres;
  let projectionMetres = null;

  if (anchorMetres && roads.length > 0) {
    const toStation = stationMetres
      ? { x: stationMetres.x - anchorMetres.x, y: stationMetres.y - anchorMetres.y }
      : null;

    const candidates = roads
      .map((road) => nearestOnPolyline(anchorMetres, road.metres))
      .filter(Boolean);

    const towardStation = toStation
      ? candidates.filter(
          (candidate) =>
            (candidate.point.x - anchorMetres.x) * toStation.x +
              (candidate.point.y - anchorMetres.y) * toStation.y >
            0
        )
      : candidates;

    const pool = towardStation.length > 0 ? towardStation : candidates;
    const nearest = pool.reduce((best, c) => (c.dist < best.dist ? c : best));

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

  /*
    Zlatá strecha ide na budovu, v ktorej značka leží. Ak značka po posune
    padne mimo pôdorysu (na chodník alebo do dvora), dostane ju budova, ktorá
    je k nej najbližšia — nie žiadna. Prevádzka niekde stojí.
  */
  let anchorIndex = buildings.findIndex((b) => contains(b.metres, markerMetres));
  const markerInsideBuilding = anchorIndex >= 0;

  if (!markerInsideBuilding && markerMetres) {
    let best = Infinity;
    buildings.forEach((building, index) => {
      const nearest = nearestOnPolyline(markerMetres, building.metres);
      if (nearest && nearest.dist < best) {
        best = nearest.dist;
        anchorIndex = index;
      }
    });
  }

  if (anchorIndex >= 0) buildings[anchorIndex].isAnchor = true;

  const isLandmark = (tags) =>
    tags.building === 'train_station' ||
    tags.railway === 'station' ||
    tags.public_transport === 'station' ||
    tags.amenity === 'bus_station';

  // Maliarov algoritmus: čo je vzadu, kreslí sa prvé.
  const drawn = buildings
    .map((building) => {
      const points = building.metres.map(toView);
      return {
        ...building,
        points,
        depth: points.reduce((sum, p) => sum + p.y, 0) / points.length,
      };
    })
    .sort((a, b) => a.depth - b.depth);

  const wallsAndRoofs = drawn
    .map(({ points, tags, isAnchor }, index) => {
      const height = isLandmark(tags) || isAnchor ? WALL_H_LANDMARK : WALL_H;
      const top = points.map((p) => ({ x: p.x, y: p.y - height }));

      /*
        Steny sa kreslia len na prednej strane pôdorysu. Zadné sú v axonometrii
        aj tak schované za strechou a telom budovy, takže ich vynechanie nič
        nezmení na vzhľade a ušetrí polovicu dát.

        Všetky steny jednej budovy idú do jedného `<path>` ako podcesty.
      */
      const centroid = points.reduce((sum, p) => sum + p.y, 0) / points.length;

      const walls = points
        .slice(0, -1)
        .map((p, i) => ({ p, q: points[i + 1] }))
        .filter(({ p, q }) => centroid <= (p.y + q.y) / 2)
        .map(
          ({ p, q }) =>
            `${path([p, q, { x: q.x, y: q.y - height }, { x: p.x, y: p.y - height }])}Z`
        )
        .join('');

      /*
        Vlna „mesto sa postaví“ ide odzadu dopredu. Stagger je zastropovaný na
        21 krokov po 12 ms — pri stovke budov by inline `transition-delay`
        na každej z nich stál viac než celá geometria a trval by dve sekundy.
      */
      const step = Math.min(
        STAGGER_STEPS,
        Math.floor((index / drawn.length) * (STAGGER_STEPS + 1))
      );

      const roofClass = isAnchor ? 'roof roof-anchor' : 'roof';

      return (
        `<g class="b" style="--d:${step}">` +
        `<path class="wall" d="${walls}"/>` +
        `<path class="${roofClass}" d="${path(top)}Z"/>` +
        `</g>`
      );
    })
    .join('\n');

  /*
    Názvy ulíc sa nevypisujú. OSM v tomto bloku nemá `Kpt. Nálepku` zamapovanú
    a najbližšiu pomenovanú cestu vedie ako „Mieru“ — písať k nej našu adresu
    by znamenalo tvrdiť niečo, čo dáta nepodporujú. Adresa je v texte pod
    mapou. Pozri docs/OTAZKY.md.

    `pathLength="1"` normalizuje dĺžku, takže sa všetky ulice nakreslia rovnako
    rýchlo bez ohľadu na to, aké sú dlhé.
  */
  const streetPaths = roads
    .map(
      ({ metres }) =>
        `<path class="street" pathLength="1" d="${path(metres.map(toView))}"/>`
    )
    .join('\n');

  const railPaths = rails
    .map(({ metres }) => `<path class="rail" d="${path(metres.map(toView))}"/>`)
    .join('\n');

  /*
    Trasa vedie po skutočnej geometrii ulíc, nie vzdušnou čiarou — rovná čiara
    cez bloky domov vyzerá ako letecká vzdialenosť, nie ako cesta pešo.
    Ak by cesta po uliciach vyšla nezmyselne dlhá (rozpadnutý graf, obchádzka
    cez pol mesta), radšej sa nekreslí vôbec: rovná čiara cez domy je horšia
    než žiadna.
  */
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

  return {
    wallsAndRoofs,
    streetPaths,
    railPaths,
    markerView: markerMetres ? toView(markerMetres) : null,
    stationView: stationMetres ? toView(stationMetres) : null,
    busView: busMetres ? toView(busMetres) : null,
    routePath: routeMetres ? path(routeMetres.map(toView)) : null,
    routeLength,
    markerInsideBuilding,
    markerMoved:
      anchorMetres && markerMetres
        ? Math.hypot(anchorMetres.x - markerMetres.x, anchorMetres.y - markerMetres.y)
        : 0,
    counts: {
      buildings: buildings.length,
      streets: roads.length,
      rails: rails.length,
    },
  };
}

/* -------------------------------------------------------------------------
   5. Beh
------------------------------------------------------------------------- */

const previewCenter = previewArg
  ? (([lat, lng]) => ({ lat: Number(lat), lng: Number(lng) }))(
      previewArg.split('=')[1].split(',')
    )
  : null;

let center;
if (previewCenter) {
  console.log(
    `kontrolný render okolo ${previewCenter.lat}, ${previewCenter.lng} — ostrá mapa sa neprepíše`
  );
  center = previewCenter;
} else if (isConfirmed(business.geo)) {
  center = business.geo;
} else {
  center = await geocode();
  console.log(`Nominatim: ${center.lat}, ${center.lng} — over a doplň do business.geo`);
}

// Aj kontrolný render má vlastnú cache — Overpass sa nesmie volať pri každom
// prekreslení, ich pravidlá to zakazujú a pri záťaži vracia 504.
const cacheFile = previewCenter ? RAW_PREVIEW : RAW;

let data;
if (!refresh && existsSync(cacheFile)) {
  data = JSON.parse(await readFile(cacheFile, 'utf8'));
  console.log(`cache ${cacheFile} (stiahnuté ${data.fetchedAt})`);
} else {
  data = await fetchGeometry(center);
  await mkdir('src/data', { recursive: true });
  await writeFile(cacheFile, JSON.stringify(data));
  console.log(`Overpass: ${data.elements.length} prvkov`);
}

/*
  Kotva je potvrdená poloha prevádzky z Google profilu. Pri kontrolnom renderi
  kotva nie je — vtedy sa nekreslí ani bod, ani trasa. Nikdy sa neodhaduje.
*/
const anchor =
  !previewCenter && isConfirmed(business.geo)
    ? { lat: business.geo.lat, lon: business.geo.lng }
    : null;

const {
  wallsAndRoofs,
  streetPaths,
  railPaths,
  markerView,
  stationView,
  busView,
  routePath,
  routeLength,
  markerInsideBuilding,
  markerMoved,
  counts,
} = render(data, { anchor });

const map = content.location.map;

/*
  Dashovaná linka sa nedá nakresliť cez `stroke-dashoffset` — ten je už
  obsadený vzorom čiarok. Kreslí ju preto maska s tou istou cestou; na maske
  `pathLength="1"` normalizuje dĺžku, takže netreba nič dopočítavať.
*/
const routeMarkup = routePath
  ? `<defs><mask id="routeMask"><path class="route-mask" pathLength="1" d="${routePath}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/></mask></defs>` +
    `<path class="route" mask="url(#routeMask)" d="${routePath}"/>`
  : '';

const label = (point, text, cls, dy) =>
  point
    ? `<text class="${cls}" x="${fmt(point.x)}" y="${fmt(point.y + dy)}" text-anchor="middle">${text}</text>`
    : '';

const circle = (point, r, cls) =>
  `<circle cx="${fmt(point.x)}" cy="${fmt(point.y)}" r="${r}" class="${cls}"/>`;

const here = markerView
  ? `<g class="here">${circle(markerView, 18, 'halo')}${circle(markerView, 18, 'pulse')}${circle(markerView, 9, 'dot')}</g>`
  : '';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" class="map" role="img" aria-labelledby="mapTitle mapDesc">
<title id="mapTitle">${map.title}</title>
<desc id="mapDesc">${map.desc.replace('{street}', business.street)}</desc>
<g class="rails">
${railPaths}
</g>
<g class="streets">
${streetPaths}
</g>
<g class="buildings">
${wallsAndRoofs}
</g>
${routeMarkup}
${here}
${label(stationView, map.station, 'label', -26)}
${label(busView, map.busStation, 'label', -26)}
${label(markerView, map.here, 'here-label', -34)}
<text class="note" x="${VIEW.w - 24}" y="${VIEW.h - 28}" text-anchor="end">${map.note}</text>
</svg>
`;

const target = previewCenter ? PREVIEW : OUT;
await writeFile(target, svg);

const kb = Buffer.byteLength(svg) / 1024;
console.log(
  `${target}  ${kb.toFixed(1)} kB  ` +
    `(budov ${counts.buildings}, ulíc ${counts.streets}, koľají ${counts.rails})`
);

if (anchor) {
  console.log(`značka posunutá o ${markerMoved.toFixed(1)} m ku ceste`);
  console.log(
    markerInsideBuilding
      ? 'značka leží v pôdoryse budovy — strecha je zvýraznená zlatou'
      : 'značka je mimo pôdorysu — zlatú dostala najbližšia budova'
  );
  console.log(
    busView ? 'autobusová stanica v zábere' : '⚠ autobusová stanica mimo výrezu'
  );
  console.log(
    routePath
      ? `trasa vedie po uliciach, ${Math.round(routeLength)} m`
      : '⚠ trasa sa nekreslí — po cestách sa nedala nájsť rozumná'
  );
}

if (kb > MAX_KB) {
  console.log(`\n⚠ NAD ROZPOČET (${MAX_KB} kB). Zjednoduš polygóny, nie výrez.`);
  process.exit(1);
}
