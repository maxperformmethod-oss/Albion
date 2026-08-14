/**
 * Predspracovanie hero obrazu.
 *
 * Surový obraz sa nesmie použiť priamo — má bežnú expozíciu, zrážal by kontrast
 * H1 a bol by príliš veľký. Stmavíme, odsýtime a prekódujeme ho deterministicky,
 * nie ručne v editore, nech sa to dá zopakovať, keď príde reálna fotka.
 *
 * Zdroje v `src/assets/raw/` sa necommitujú. Do repa idú len výstupy
 * v `public/images/`. Ak zdroje chýbajú, skript sa ticho preskočí — hero
 * musí fungovať aj bez obrazu.
 *
 * Používa `sharp`, ktorý už máme cez Astro. Žiadna nová závislosť.
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const DESKTOP_SRC = 'src/assets/raw/hero-raw.png';
const MOBILE_SRC = 'src/assets/raw/hero-raw-mobile.png';
const OUT = 'public/images';

/** Cieľ: priemerná luminancia ≤ 0.12 (0–1). */
const MAX_MEAN_LUMINANCE = 0.12;

// Brightness je per zdroj — mobilný obraz prišiel svetlejší ako desktopový.
const grade = (src, brightness) =>
  sharp(src)
    .modulate({ brightness, saturation: 0.75 })
    .linear(0.92, -10)
    .gamma(1.05);

const sets = [
  {
    src: DESKTOP_SRC,
    brightness: 0.85,
    variants: [
      { w: 1920, avif: 40, webp: 66, name: 'hero-1920', budget: 140 },
      { w: 1280, avif: 42, webp: 68, name: 'hero-1280', budget: 90 },
      { w: 760, avif: 45, webp: 70, name: 'hero-760', budget: 60 },
    ],
  },
  {
    src: MOBILE_SRC,
    brightness: 0.7,
    variants: [
      { w: 760, avif: 45, webp: 70, name: 'hero-m-760', budget: 55 },
      { w: 480, avif: 48, webp: 72, name: 'hero-m-480', budget: 30 },
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

/**
 * `sharp(...).stats()` číta zdrojový súbor, nie výsledok pipeline — merať sa
 * teda musí až na prekódovanom buffri, inak stmavenie kontrolu vôbec neovplyvní.
 */
async function meanLuminance(src, brightness) {
  const processed = await grade(src, brightness).resize({ width: 400 }).png().toBuffer();
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
      console.log(
        `  ${file}  ${info.width}x${info.height}  ${kb} kB${over ? `  ⚠ NAD ROZPOČET (${variant.budget} kB)` : ''}`
      );
    }
  }
}

if (overBudget > 0 || tooBright > 0) {
  console.log(
    '\nZníž `brightness` v grade() a spusti znova. Tmavší obraz je zároveň menší aj čitateľnejší.'
  );
  process.exit(1);
}

console.log('\nhotovo — v rozpočte aj v tmavosti.');
