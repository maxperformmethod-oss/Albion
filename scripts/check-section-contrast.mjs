/**
 * Kontrast textu nad dekoratívnymi obrazmi v tmavých sekciách.
 *
 * Sesterský skript k `check-hero-contrast.mjs` a rovnaká zásada: meria sa na
 * **pixeloch hotového obrazu**, nie na tokenoch. Odčítať farbu zo screenshotu
 * sa nedá — v screenshote je aj samotné písmo, takže by sa meral text proti
 * textu. Skript preto poskladá podklad presne tak, ako to robí prehliadač
 * (výrez `object-fit: cover` → `filter` → maska → krytie → podklad sekcie)
 * a nájde NAJSVETLEJŠÍ pixel v pásme, kde naozaj leží text.
 *
 * Cieľ z docs/PROMPT_FINAL22.md §2: 12:1 pre `bone`. Pre tlmené tokeny platia
 * ich vlastné ciele — `bone-muted` a `gold` sú sekundárny text, tam je hranica
 * 4,5:1 rovnako ako pri hero.
 *
 * Geometria (rozmery sekcií, umiestnenie vrstvy, pásma textu) je odmeraná
 * v prehliadači pri 1440 px a 390 px. Keď sa layout sekcie zmení, čísla sa
 * musia premerať znova — sú to vstupy, nie odhady.
 *
 * Spustenie: node scripts/check-section-contrast.mjs
 */

import sharp from 'sharp';
import { existsSync } from 'node:fs';

const TOKENS = {
  bone: '#F3F0EA',
  'bone-muted': '#B8B3A9',
  gold: '#C9B085',
};

const TARGET = { bone: 12, 'bone-muted': 4.5, gold: 4.5 };

/** Podklady sekcií — musia sedieť s `--color-ink-900` a `--color-ink-800`. */
const INK_900 = [26, 29, 34];
const INK_800 = [34, 38, 44];

/*
 * Každý prípad je jeden obraz v jednom breakpointe.
 *
 * `layer` je vrstva s krytím a maskou v súradniciach sekcie.
 * `text` sú obdĺžniky, kde naozaj leží text — merať celú sekciu by bolo síce
 * prísnejšie, ale nepravdivé: v pravom paneli „Zvláštnej veci“ text nie je.
 */
const CASES = [
  {
    name: 'Zvláštna vec · desktop',
    file: 'public/images/gold-rings-1400.webp',
    backdrop: INK_900,
    layer: { x: 835, y: 0, w: 605, h: 547 },
    objectPosition: [1, 0.5],
    opacity: 0.45,
    grayscale: 0,
    mask: { stops: [[0, 1], [0.3, 1], [1, 0]] },
    text: [
      { x: 152, y: 101, w: 659, h: 21 },
      { x: 152, y: 146, w: 659, h: 104 },
      { x: 152, y: 274, w: 659, h: 84 },
      { x: 152, y: 398, w: 659, h: 48 },
    ],
  },
  /* Na mobile sa panel nevykresľuje (`display: none` pod 64rem), preto tu nie je. */

  {
    name: 'Založiť alebo predať? · desktop',
    file: 'public/images/gold-chains-1600.webp',
    backdrop: INK_800,
    layer: { x: 0, y: 0, w: 1440, h: 525 },
    objectPosition: [0.5, 0.5],
    opacity: 0.09,
    grayscale: 0.25,
    mask: null,
    text: [
      { x: 152, y: 101, w: 1136, h: 21 },
      { x: 152, y: 146, w: 508, h: 52 },
      { x: 152, y: 238, w: 540, h: 29 },
      { x: 152, y: 279, w: 472, h: 56 },
      { x: 805, y: 238, w: 483, h: 29 },
      { x: 805, y: 279, w: 472, h: 28 },
      { x: 152, y: 367, w: 1136, h: 25 },
      { x: 152, y: 400, w: 1136, h: 25 },
    ],
  },
  {
    name: 'Založiť alebo predať? · mobil',
    file: 'public/images/gold-chains-760.webp',
    backdrop: INK_800,
    layer: { x: 0, y: 0, w: 390, h: 615 },
    objectPosition: [0.76, 0.5],
    opacity: 0.06,
    grayscale: 0.25,
    mask: null,
    // Text ide cez celú šírku kontajnera, sekcia je úzka — meriame ju celú.
    text: [{ x: 24, y: 0, w: 342, h: 615 }],
  },

  {
    name: 'Slovo majiteľov · desktop',
    file: 'public/images/gold-ring-1100.webp',
    backdrop: INK_900,
    layer: { x: 893, y: 0, w: 547, h: 588 },
    objectPosition: [1, 0.5],
    opacity: 0.35,
    grayscale: 0,
    mask: { stops: [[0, 1], [0.35, 1], [1, 0]] },
    text: [
      { x: 441, y: 133, w: 558, h: 21 },
      { x: 441, y: 178, w: 558, h: 211 },
      { x: 441, y: 413, w: 558, h: 42 },
    ],
  },
  {
    name: 'Slovo majiteľov · mobil',
    file: 'public/images/gold-ring-760.webp',
    backdrop: INK_900,
    layer: { x: 164, y: 0, w: 226, h: 493 },
    objectPosition: [1, 0.5],
    opacity: 0.23,
    grayscale: 0,
    mask: { stops: [[0, 1], [0.25, 1], [1, 0]] },
    // Citát je vycentrovaný cez celú šírku, teda aj pod vrstvou.
    text: [{ x: 24, y: 0, w: 342, h: 493 }],
  },
];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

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
 * `filter: grayscale(a)` podľa Filter Effects §8.5 — lineárna interpolácia
 * medzi pôvodnou farbou a jasovou zložkou v koeficientoch BT.709.
 */
const grayscale = ([r, g, b], amount) => {
  if (amount === 0) return [r, g, b];
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return [r, g, b].map((c) => c + (l - c) * amount);
};

const over = (source, backdrop, alpha) =>
  backdrop.map((c, i) => alpha * source[i] + (1 - alpha) * c);

let failed = 0;
let missing = 0;

for (const test of CASES) {
  if (!existsSync(test.file)) {
    console.log(`preskočené — chýba ${test.file}. Spusti najprv: npm run images`);
    missing += 1;
    continue;
  }

  /*
   * `object-fit: cover` — obraz sa zväčší tak, aby pokryl vrstvu, prebytok sa
   * oreže podľa `object-position`. `sharp` vie to isté cez `fit: 'cover'`,
   * ale len pre deväť pevných bodov, takže výrez počítame ručne: najprv
   * škálovanie, potom `extract`.
   */
  const meta = await sharp(test.file).metadata();
  const scale = Math.max(test.layer.w / meta.width, test.layer.h / meta.height);
  const scaledW = Math.max(test.layer.w, Math.round(meta.width * scale));
  const scaledH = Math.max(test.layer.h, Math.round(meta.height * scale));
  const left = Math.round((scaledW - test.layer.w) * test.objectPosition[0]);
  const top = Math.round((scaledH - test.layer.h) * test.objectPosition[1]);

  const { data, info } = await sharp(test.file)
    .resize({ width: scaledW, height: scaledH, fit: 'fill' })
    .extract({ left, top, width: test.layer.w, height: test.layer.h })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const worst = {
    pixel: test.backdrop,
    luminance: luminance(test.backdrop),
    x: -1,
    y: -1,
  };

  for (const band of test.text) {
    for (let y = band.y; y < band.y + band.h; y += 2) {
      for (let x = band.x; x < band.x + band.w; x += 2) {
        // Mimo vrstvy je len čistý podklad sekcie — ten je vždy tmavší.
        const lx = x - test.layer.x;
        const ly = y - test.layer.y;
        if (lx < 0 || ly < 0 || lx >= test.layer.w || ly >= test.layer.h) continue;

        const offset = (ly * info.width + lx) * info.channels;
        const source = grayscale(
          [data[offset], data[offset + 1], data[offset + 2]],
          test.grayscale
        );

        // Maska `to left`: postup 0 na pravej hrane vrstvy, 1 na ľavej.
        const maskAlpha = test.mask ? stopsAt(test.mask.stops, 1 - lx / test.layer.w) : 1;
        const composed = over(source, test.backdrop, test.opacity * maskAlpha);

        const l = luminance(composed);
        if (l > worst.luminance) {
          worst.luminance = l;
          worst.pixel = composed.map(Math.round);
          worst.x = x;
          worst.y = y;
        }
      }
    }
  }

  const where = worst.x < 0 ? 'text celý mimo vrstvy' : `@ ${worst.x},${worst.y}`;
  console.log(`\n${test.name}`);
  console.log(`  najsvetlejší podklad v textovom pásme: rgb(${worst.pixel.join(', ')})  ${where}`);

  for (const [name, value] of Object.entries(TOKENS)) {
    const ratio = contrast(hex(value), worst.pixel);
    const ok = ratio >= TARGET[name];
    if (!ok) failed += 1;
    console.log(
      `  ${name.padEnd(12)} ${value}  ${ratio.toFixed(2)}:1  (cieľ ${TARGET[name]}:1)  ${ok ? 'OK' : '⚠ POD CIEĽOM'}`
    );
  }
}

if (failed > 0) {
  console.log('\nZníž krytie vrstvy alebo priplus masku. Text sa nezmenšuje ani nestmavuje.');
  process.exit(1);
}

if (missing > 0) process.exit(0);

console.log('\nhotovo — všetky sekcie nad cieľom.');
