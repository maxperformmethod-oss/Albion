/**
 * Kontrast textu nad hero obrazom.
 *
 * Predchádzajúci audit meral 12,14:1 odčítaním pixelov zo screenshotu. To sa
 * nedá zopakovať a po každej zmene palety alebo obrazu je meranie neplatné.
 * Tento skript to počíta z tokenov a z hotového obrazu v `public/images/`:
 * zloží obraz s oboma maskami z `Hero.astro` presne tak, ako to robí prehliadač,
 * a nájde NAJSVETLEJŠÍ pixel v pásme, kde leží text. Výsledok je teda najhorší
 * možný prípad, nie priemer.
 *
 * Cieľ z docs/HERO_ASSET.md: H1 nad obrazom ≥ 12:1.
 *
 * Spustenie: node scripts/check-hero-contrast.mjs
 */

import sharp from 'sharp';
import { existsSync } from 'node:fs';

const SRC = 'public/images/hero-1920.webp';

/** Referenčný desktop. Hero je `min-h-[min(100svh,44rem)]` → 44rem = 704 px. */
const BOX = { w: 1440, h: 704 };

/** Text drží ľavú časť hero, `max-w-[18ch]`. Meriame s rezervou. */
const TEXT_BAND = { x0: 0, x1: 0.6, y0: 0, y1: 1 };

/** Podklad masky — musí sedieť s `--color-ink-900`. */
const OVERLAY = [20, 23, 27];

const TOKENS = {
  bone: '#F2EFE9',
  'bone-muted': '#B4AFA6',
  gold: '#C3A87C',
};

const TARGET = { bone: 12, 'bone-muted': 4.5, gold: 4.5 };

const hex = (h) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const toLinear = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Lineárna interpolácia medzi zarážkami gradientu. */
const stopsAt = (stops, t) => {
  if (t <= stops[0][0]) return stops[0][1];
  const last = stops[stops.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < stops.length; i += 1) {
    const [p0, v0] = stops[i - 1];
    const [p1, v1] = stops[i];
    if (t <= p1) return v0 + ((v1 - v0) * (t - p0)) / (p1 - p0);
  }
  return last[1];
};

/**
 * `linear-gradient(100deg, …)`. V CSS je 0deg „nahor“ a uhly rastú v smere
 * hodinových ručičiek, takže smerový vektor je (sin A, −cos A) pri osi y nadol.
 */
const angledProgress = (x, y, deg) => {
  const a = (deg * Math.PI) / 180;
  const sin = Math.sin(a);
  const cos = Math.cos(a);
  const length = Math.abs(BOX.w * sin) + Math.abs(BOX.h * cos);
  const projected = (x - BOX.w / 2) * sin - (y - BOX.h / 2) * cos;
  return projected / length + 0.5;
};

const MASK_ANGLED = [
  [0, 0.96],
  [0.42, 0.92],
  [1, 0.66],
];

const MASK_BOTTOM = [
  [0, 0.95],
  [0.45, 0],
];

const over = (source, backdrop, alpha) =>
  backdrop.map((c, i) => alpha * source[i] + (1 - alpha) * c);

if (!existsSync(SRC)) {
  console.log(`preskočené — chýba ${SRC}. Spusti najprv \`npm run images\`.`);
  process.exit(0);
}

/*
 * `object-fit: cover` — obraz sa škáluje tak, aby pokryl box, prebytok sa
 * oreže. Pri tomto pomere strán rozhoduje šírka, orezáva sa teda zvisle.
 */
const { data, info } = await sharp(SRC)
  .resize({ width: BOX.w, height: BOX.h, fit: 'cover', position: 'right' })
  .raw()
  .toBuffer({ resolveWithObject: true });

const worst = { pixel: null, luminance: -1, x: 0, y: 0 };

for (let y = Math.round(TEXT_BAND.y0 * BOX.h); y < TEXT_BAND.y1 * BOX.h; y += 2) {
  for (let x = Math.round(TEXT_BAND.x0 * BOX.w); x < TEXT_BAND.x1 * BOX.w; x += 2) {
    const offset = (y * info.width + x) * info.channels;
    const source = [data[offset], data[offset + 1], data[offset + 2]];

    // Poradie vrstiev: obraz → spodná maska → šikmá maska (prvá vrstva je navrchu).
    const bottomProgress = 1 - y / BOX.h;
    let composed = over(OVERLAY, source, stopsAt(MASK_BOTTOM, bottomProgress));
    composed = over(
      OVERLAY,
      composed,
      stopsAt(MASK_ANGLED, angledProgress(x, y, 100))
    );

    const l = luminance(composed);
    if (l > worst.luminance) {
      worst.luminance = l;
      worst.pixel = composed.map(Math.round);
      worst.x = x;
      worst.y = y;
    }
  }
}

console.log(
  `najsvetlejší podklad v textovom pásme: rgb(${worst.pixel.join(', ')})  @ ${worst.x},${worst.y}\n`
);

let failed = 0;
for (const [name, value] of Object.entries(TOKENS)) {
  const ratio = contrast(hex(value), worst.pixel);
  const ok = ratio >= TARGET[name];
  if (!ok) failed += 1;
  console.log(
    `${name.padEnd(12)} ${value}  ${ratio.toFixed(2)}:1  (cieľ ${TARGET[name]}:1)  ${ok ? 'OK' : '⚠ POD CIEĽOM'}`
  );
}

if (failed > 0) {
  console.log('\nPriplus krytie v maske v `Hero.astro`, nezmenšuj text.');
  process.exit(1);
}
