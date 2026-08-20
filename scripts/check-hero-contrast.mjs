/**
 * Kontrast textu v hero.
 *
 * **Od dávky 23 je to triviálne a to je celý zmysel zmeny.** Predtým ležal
 * text nad fotkou vchodu a kontrast závisel od toho, aký pixel bol práve pod
 * písmenom — skript musel skladať obraz s dvoma maskami a hľadať najsvetlejší
 * bod v textovom pásme. Dnes je hero rozdelené na dva panely, ktoré sa
 * neprekrývajú: text sedí na plnom `ink-900`, fotka má vlastný panel vpravo.
 * Merať je teda čo merať — text voči podkladu panela.
 *
 * Skript ostáva, hoci je jednoduchý. Je to poistka na paletu: keby niekto
 * zosvetlil `--color-ink-900` alebo stlmil `--color-bone`, spadne to tu,
 * nie až na živom webe.
 *
 * **Keby sa hero niekedy vrátilo k fotke pod textom, tento skript prestane
 * stačiť** a musí sa vrátiť meranie na pixeloch. Sesterský skript
 * `check-section-contrast.mjs` ho pre dekoratívne obrazy v sekciách robí —
 * odtiaľ sa dá vziať.
 *
 * Cieľ z docs/HERO_ASSET.md: H1 nad podkladom ≥ 12:1.
 *
 * Spustenie: node scripts/check-hero-contrast.mjs
 */

/** Podklad textového panela — musí sedieť s `--color-ink-900`. */
const PANEL = [26, 29, 34];

const TOKENS = {
  bone: '#F3F0EA',
  'bone-muted': '#B8B3A9',
  gold: '#C9B085',
};

/*
 * `bone` nesie H1 a je to jediný token s vlastnou latkou 12:1 z HERO_ASSET.md.
 * `bone-muted` a `gold` sú sekundárny text a eyebrow — tam platí WCAG AA 4,5:1.
 */
const TARGET = { bone: 12, 'bone-muted': 4.5, gold: 4.5 };

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

console.log(
  `podklad textového panela: rgb(${PANEL.join(', ')}) — plný ink-900, bez fotky a bez masky\n`
);

let failed = 0;
for (const [name, value] of Object.entries(TOKENS)) {
  const ratio = contrast(hex(value), PANEL);
  const ok = ratio >= TARGET[name];
  if (!ok) failed += 1;
  console.log(
    `${name.padEnd(12)} ${value}  ${ratio.toFixed(2)}:1  (cieľ ${TARGET[name]}:1)  ${ok ? 'OK' : '⚠ POD CIEĽOM'}`
  );
}

if (failed > 0) {
  console.log('\nUprav paletu v `src/styles/global.css`. Text sa nezmenšuje ani nestmavuje.');
  process.exit(1);
}

console.log('\nhotovo — hero text je nad cieľom.');
