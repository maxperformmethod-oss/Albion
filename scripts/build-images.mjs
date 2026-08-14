/**
 * Predspracovanie všetkých obrazov webu — hero aj dekoratívnych textúr.
 *
 * Surový obraz sa nesmie použiť priamo — má bežnú expozíciu, zrážal by kontrast
 * textu a bol by príliš veľký. Stmavíme, odsýtime a prekódujeme ho deterministicky,
 * nie ručne v editore, nech sa to dá zopakovať, keď príde reálna fotka.
 *
 * Všetky štyri zdroje idú cez ten istý `grade()` — jediné, čo sa líši, je
 * `brightness`, pretože každý zdroj prišiel inak exponovaný. Rovnaký grading je
 * dôvod, prečo textúry v rôznych sekciách pôsobia ako jeden materiál.
 *
 * Art direction (docs/PROMPT_FINAL3.md §4): textúra patrí LEN do tmavých sekcií.
 * Svetlé sekcie sú zámerne čisté — ten striedavý rytmus nesie celý dojem.
 *
 * Zdroje v `src/assets/raw/` sa necommitujú. Do repa idú len výstupy
 * v `public/images/`. Ak zdroje chýbajú, skript sa ticho preskočí — stránka
 * musí fungovať aj bez obrazu.
 *
 * Používa `sharp`, ktorý už máme cez Astro. Žiadna nová závislosť.
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const RAW = 'src/assets/raw';
const OUT = 'public/images';

/** Cieľ: priemerná luminancia ≤ 0.12 (0–1). */
const MAX_MEAN_LUMINANCE = 0.12;

// Brightness je per zdroj — mobilný obraz prišiel svetlejší ako desktopový
// a dekoratívne textúry musia ísť ešte nižšie, lebo ležia pod textom.
const grade = (src, brightness) =>
  sharp(src)
    .modulate({ brightness, saturation: 0.75 })
    .linear(0.92, -10)
    .gamma(1.05);

const sets = [
  {
    src: `${RAW}/hero-raw.png`,
    brightness: 0.85,
    variants: [
      { w: 1920, avif: 40, webp: 66, name: 'hero-1920', budget: 140 },
      { w: 1280, avif: 42, webp: 68, name: 'hero-1280', budget: 90 },
      { w: 760, avif: 45, webp: 70, name: 'hero-760', budget: 60 },
    ],
  },
  {
    src: `${RAW}/hero-raw-mobile.png`,
    brightness: 0.7,
    variants: [
      { w: 760, avif: 45, webp: 70, name: 'hero-m-760', budget: 55 },
      { w: 480, avif: 48, webp: 72, name: 'hero-m-480', budget: 30 },
    ],
  },

  /*
    Dekoratívne textúry. Zdroje sú 1376×768, takže sa neškálujú nahor —
    rozpočet z §4 (45 kB pri 1600 px) tým platí s rezervou. Sú tmavé,
    rozmazané a ležia pod krytím 0,10–0,35, takže nižšia kvalita nie je vidieť.
  */
  {
    src: `${RAW}/tex-1.png`,
    brightness: 0.62,
    variants: [
      { w: 1100, avif: 40, webp: 62, name: 'tex-panel-1100', budget: 45 },
      { w: 700, avif: 42, webp: 64, name: 'tex-panel-700', budget: 28 },
    ],
  },
  {
    src: `${RAW}/tex-2.png`,
    brightness: 0.5,
    variants: [
      { w: 1376, avif: 38, webp: 60, name: 'tex-wide-1376', budget: 45 },
      { w: 900, avif: 40, webp: 62, name: 'tex-wide-900', budget: 30 },
    ],
  },
  {
    src: `${RAW}/tex-3.png`,
    brightness: 0.6,
    variants: [
      { w: 1376, avif: 38, webp: 60, name: 'tex-contact-1376', budget: 45 },
      { w: 900, avif: 40, webp: 62, name: 'tex-contact-900', budget: 30 },
    ],
  },
];

const missing = sets.filter((set) => !existsSync(set.src));
if (missing.length > 0) {
  console.log(
    `preskočené — chýbajú zdroje: ${missing.map((s) => s.src).join(', ')}`
  );
  process.exit(0);
}

await mkdir(OUT, { recursive: true });

let overBudget = 0;
let tooBright = 0;
let totalAvifKb = 0;

/**
 * `sharp(...).stats()` číta zdrojový súbor, nie výsledok pipeline — merať sa
 * teda musí až na prekódovanom buffri, inak stmavenie kontrolu vôbec neovplyvní.
 */
async function meanLuminance(src, brightness) {
  const processed = await grade(src, brightness)
    .resize({ width: 400 })
    .png()
    .toBuffer();
  const { channels } = await sharp(processed).stats();
  return channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / 3 / 255;
}

for (const set of sets) {
  const mean = await meanLuminance(set.src, set.brightness);
  const bright = mean > MAX_MEAN_LUMINANCE;
  if (bright) tooBright += 1;
  console.log(
    `${set.src}  priemerná luminancia ${mean.toFixed(3)}  ${bright ? '⚠ PRÍLIŠ SVETLÉ' : 'OK'}`
  );

  for (const variant of set.variants) {
    for (const format of ['avif', 'webp']) {
      const file = `${OUT}/${variant.name}.${format}`;
      const info = await grade(set.src, set.brightness)
        .resize({ width: variant.w })
        [format]({ quality: variant[format], effort: 6 })
        .toFile(file);

      const kb = Math.round(info.size / 1024);
      const over = format === 'avif' && kb > variant.budget;
      if (over) overBudget += 1;
      if (format === 'avif') totalAvifKb += kb;
      console.log(
        `  ${file}  ${info.width}x${info.height}  ${kb} kB${over ? `  ⚠ NAD ROZPOČET (${variant.budget} kB)` : ''}`
      );
    }
  }
}

console.log(`\nAVIF spolu (všetky varianty): ${totalAvifKb} kB`);

if (overBudget > 0 || tooBright > 0) {
  console.log(
    '\nZníž `brightness` v grade() a spusti znova. Tmavší obraz je zároveň menší aj čitateľnejší.'
  );
  process.exit(1);
}

console.log('\nhotovo — v rozpočte aj v tmavosti.');
