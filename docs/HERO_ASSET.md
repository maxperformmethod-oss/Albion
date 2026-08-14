# HERO OBRAZ — spracovanie a vloženie

## Pôvod

Abstraktná textúra vygenerovaná pre tento projekt (grafitový povrch, jedno teplé svetlo). **Nezobrazuje prevádzku, predmet ani osobu** — je to materiál, nie tvrdenie o realite. Preto ju smieme použiť bez toho, aby sme klamali zákazníka.

Zdrojový PNG ulož ako:

```
src/assets/raw/hero-raw.png     (necommituj do gitu — pridaj do .gitignore)
```

## Prečo sa surový obraz nesmie použiť priamo

Model vygeneroval obraz s bežnou expozíciou. Na hero pozadí by:

1. zrážal kontrast nadpisu pod WCAG,
2. ťahal pozornosť od H1,
3. mal príliš veľa dát pre náš rozpočet.

Preto ho **stmavíme, odsýtime a prekódujeme** deterministickým skriptom. Nie ručne v editore — nech sa to dá zopakovať, keď príde reálna fotka od majiteľa.

## Skript

`scripts/build-hero.mjs` (používa `sharp`, ktorý už máme cez Astro — **žiadna nová závislosť**):

```js
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "src/assets/raw/hero-raw.png";
const OUT = "public/images";
await mkdir(OUT, { recursive: true });

// Stmavenie + odsýtenie. Cieľ: priemerná luminancia <= 0.12 (0-1).
const graded = () =>
  sharp(SRC)
    .modulate({ brightness: 0.62, saturation: 0.75 })
    .linear(0.92, -10)
    .gamma(1.05);

const variants = [
  { w: 1920, avif: 40, webp: 66, name: "hero-1920", budget: 140 },
  { w: 1280, avif: 42, webp: 68, name: "hero-1280", budget: 90 },
  { w: 760,  avif: 45, webp: 70, name: "hero-760",  budget: 60 },
];

for (const v of variants) {
  for (const fmt of ["avif", "webp"]) {
    const file = `${OUT}/${v.name}.${fmt}`;
    const info = await graded()
      .resize({ width: v.w })
      [fmt]({ quality: v[fmt], effort: 6 })
      .toFile(file);
    const kb = Math.round(info.size / 1024);
    const flag = fmt === "avif" && kb > v.budget ? "  ⚠ NAD ROZPOČET" : "";
    console.log(`${file}  ${info.width}x${info.height}  ${kb} kB${flag}`);
  }
}

// Kontrola tmavosti
const { channels } = await graded().stats();
const mean = channels.slice(0, 3).reduce((a, c) => a + c.mean, 0) / 3 / 255;
console.log(`priemerná luminancia: ${mean.toFixed(3)} ${mean <= 0.12 ? "OK" : "⚠ PRÍLIŠ SVETLÉ"}`);
```

Pridaj `"hero": "node scripts/build-hero.mjs"` do `package.json`.

**Ak skript nahlási „NAD ROZPOČET" alebo „PRÍLIŠ SVETLÉ", nezvyšuj kompresiu naslepo** — zníž `brightness` a spusť znova. Tmavší obraz je zároveň menší aj čitateľnejší.

## Vloženie do hero

```html
<picture>
  <source type="image/avif" srcset="/images/hero-760.avif 760w, /images/hero-1280.avif 1280w, /images/hero-1920.avif 1920w" sizes="100vw">
  <source type="image/webp" srcset="/images/hero-760.webp 760w, /images/hero-1280.webp 1280w, /images/hero-1920.webp 1920w" sizes="100vw">
  <img src="/images/hero-1280.webp" width="1920" height="1080" alt="" aria-hidden="true"
       fetchpriority="high" decoding="async" class="hero-bg">
</picture>
```

Pravidlá:

- `alt=""` + `aria-hidden="true"` — je to dekorácia, nie informácia. **Nikdy** nepíš alt typu „predajňa Albion".
- **Bez** `loading="lazy"`. Je to LCP prvok.
- `width`/`height` povinné → CLS 0.
- `object-fit: cover`, `object-position: center right` (svetlo je vpravo hore, text je vľavo).
- Nepoužívaj `astro:assets` — obraz je už predspracovaný a chceme presnú kontrolu nad bajtami.

## Maska nad obrazom (povinná)

Text nesmie závisieť od toho, ako obraz vyzerá:

```css
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background:
    linear-gradient(100deg,
      rgb(15 17 19 / 0.96) 0%,
      rgb(15 17 19 / 0.88) 42%,
      rgb(15 17 19 / 0.58) 100%),
    linear-gradient(to top, rgb(15 17 19 / 0.95) 0%, rgb(15 17 19 / 0) 45%);
}
```

Po nasadení **zmeraj kontrast H1 voči skutočným pixelom pod ním** (screenshot + pipeta), nie voči tokenu. Cieľ ≥ 12:1. Ak nesedí, pridaj krytie v maske — nikdy neriedь farbu textu.

## Mobil — má vlastný zdroj, obraz sa NESKRÝVA

Orezávať 16:9 na úzky vysoký hero dopadá zle. Preto má mobil **vlastný súbor v pomere 4:5**, dogenerovaný z rovnakej textúry:

```
src/assets/raw/hero-raw-mobile.png    (4:5, 928×1152)
```

Do `variants` v skripte pridaj druhú sadu s týmto zdrojom:

```js
const MOBILE_SRC = "src/assets/raw/hero-raw-mobile.png";
// hero-m-760.avif / .webp   (760×950)  rozpočet 55 kB
// hero-m-480.avif / .webp   (480×600)  rozpočet 30 kB
```

A v `<picture>` prepni zdroj cez media query — nie cez `object-position`:

```html
<source media="(max-width: 767px)" type="image/avif"
        srcset="/images/hero-m-480.avif 480w, /images/hero-m-760.avif 760w" sizes="100vw">
<source media="(max-width: 767px)" type="image/webp" srcset="…">
<!-- potom desktopové <source> ako vyššie -->
```

Desktop: `object-position: center right`. Mobil: `object-position: center`.

Obraz na mobile zostáva — ale platí preň rovnaká podmienka ako všade: **ak kontrast H1 klesne pod 12:1, pridaj krytie v maske, nie svetlejší text.**

## Keď prídu reálne fotky

Tento skript zostáva. Zmeníš len `SRC` a `brightness`. Reálna fotka prevádzky nahradí textúru **okamžite** — je to vždy silnejšie.
