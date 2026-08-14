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

const RAW = 'src/data/map-raw.json';
/** Cache kontrolného renderu. Necommituje sa — pozri .gitignore. */
const RAW_PREVIEW = 'src/data/map-raw.preview.json';
const OUT = 'src/components/sections/map.generated.svg';
const PREVIEW = 'src/components/sections/map.preview.svg';

/** Polomer výrezu v metroch. Pri prekročení rozpočtu sa zmenšuje, nie kvalita. */
const RADIUS_M = 250;

/** Rozpočet hotového SVG. */
const MAX_KB = 60;

/** Douglas–Peucker tolerancia v metroch. */
const SIMPLIFY_M = 0.6;

const VIEW = { w: 1200, h: 700 };

/** Výška extrúzie v px. Stanica a Albion sú vyššie, aby sa dali nájsť očami. */
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

/* -------------------------------------------------------------------------
   4. Render
------------------------------------------------------------------------- */

/*
  Kompaktný zápis cesty. Pri 432 budovách je formát súradníc väčšia položka
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

function render(data, { anchor }) {
  const project = toMetres(data.center);

  /** Metre → izometria → viewBox. Mierka sa počíta z polomeru výrezu. */
  const scale = (VIEW.w * 0.46) / (RADIUS_M * COS30);
  const toView = (metres) => {
    const iso = isometric(metres);
    return { x: VIEW.w / 2 + iso.x * scale, y: VIEW.h / 2 + iso.y * scale };
  };

  const prepared = (element) =>
    simplify(element.geometry.map(project), SIMPLIFY_M).map(toView);

  const buildings = [];
  const streets = [];
  const rails = [];

  for (const element of data.elements) {
    if (!element.geometry || element.geometry.length < 2) continue;
    const points = prepared(element);
    const depth = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    if (element.tags?.building) buildings.push({ points, depth, tags: element.tags });
    else if (element.tags?.railway === 'rail') rails.push({ points });
    else if (element.tags?.highway) streets.push({ points, tags: element.tags });
  }

  // Maliarov algoritmus: čo je vzadu, kreslí sa prvé.
  buildings.sort((a, b) => a.depth - b.depth);

  const isLandmark = (tags) =>
    tags.building === 'train_station' ||
    tags.railway === 'station' ||
    tags.public_transport === 'station';

  const isAnchor = (tags) =>
    anchor !== null &&
    tags['addr:housenumber'] === anchor.housenumber &&
    (tags['addr:street'] ?? '').includes(anchor.street);

  const wallsAndRoofs = buildings
    .map(({ points, tags }) => {
      const landmark = isLandmark(tags);
      const anchored = isAnchor(tags);
      const height = landmark || anchored ? WALL_H_LANDMARK : WALL_H;
      const top = points.map((p) => ({ x: p.x, y: p.y - height }));

      /*
        Steny sa kreslia len na prednej strane pôdorysu. Zadné sú v axonometrii
        aj tak schované za strechou a telom budovy, takže ich vynechanie nič
        nezmení na vzhľade a ušetrí polovicu dát.

        Kritérium: vnútro budovy (ťažisko) leží nad hranou. Pri pôdorysoch,
        aké sú v OSM — teda prevažne pravouhlých — to sedí.

        Všetky steny jednej budovy idú do jedného `<path>` ako podcesty.
        Samostatný `<path>` na každú hranu bol o tretinu väčší a vyzeral rovnako.
      */
      const centroid =
        points.reduce((sum, p) => sum + p.y, 0) / points.length;

      const walls = points
        .slice(0, -1)
        .map((p, i) => ({ p, q: points[i + 1] }))
        .filter(({ p, q }) => centroid <= (p.y + q.y) / 2)
        .map(
          ({ p, q }) =>
            `${path([p, q, { x: q.x, y: q.y - height }, { x: p.x, y: p.y - height }])}Z`
        )
        .join('');

      const roofClass = anchored ? 'roof roof-anchor' : 'roof';
      return `<path class="wall" d="${walls}"/><path class="${roofClass}" d="${path(top)}Z"/>`;
    })
    .join('\n');

  const streetPaths = streets
    .map(({ points, tags }) => {
      const main = (tags.name ?? '').includes(streetName ?? ' ');
      return `<path class="${main ? 'street street-main' : 'street'}" d="${path(points)}"/>`;
    })
    .join('\n');

  const railPaths = rails
    .map(({ points }) => `<path class="rail" d="${path(points)}"/>`)
    .join('\n');

  return { wallsAndRoofs, streetPaths, railPaths, counts: {
    buildings: buildings.length,
    streets: streets.length,
    rails: rails.length,
  } };
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

const anchor = isConfirmed(business.street)
  ? {
      housenumber: business.street.replace(/^.*?(\d+\w?)$/, '$1'),
      street: streetName ?? '',
    }
  : null;

const { wallsAndRoofs, streetPaths, railPaths, counts } = render(data, { anchor });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" class="map">
<g class="rails">
${railPaths}
</g>
<g class="streets">
${streetPaths}
</g>
<g class="buildings">
${wallsAndRoofs}
</g>
</svg>
`;

const target = previewCenter ? PREVIEW : OUT;
await writeFile(target, svg);

const kb = Buffer.byteLength(svg) / 1024;
console.log(
  `${target}  ${kb.toFixed(1)} kB  ` +
    `(budov ${counts.buildings}, ulíc ${counts.streets}, koľají ${counts.rails})`
);

if (kb > MAX_KB) {
  console.log(
    `\n⚠ NAD ROZPOČET (${MAX_KB} kB). Zmenši RADIUS_M na 250, nie kvalitu.`
  );
  process.exit(1);
}
