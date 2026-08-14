# PLAN.md — Albion, Záložňa Lučenec (v2)

Stav: **schválené, Fáza 1 sa realizuje.**
Platí `ALBION_MASTER_PROMPT_v1.md` + `ROZHODNUTIA v1`. Kde si odporujú, platí `ROZHODNUTIA v1`.

Koreň projektu: `C:\Dev\albion` (mimo OneDrive)
Cieľ Fázy 1: technický základ + dátová vrstva. Cieľ projektu: **jednoduchá, moderná,
pekná a kompatibilná stránka, ktorá rýchlo dovedie človeka k telefonátu.**

Pravidlo rozsahu: *ak sa komponent použije práve raz a nemá vlastnú logiku, nerobíme
z neho komponent.*

---

## 1. Homepage — 8 blokov

`Header · Hero · Čo prijímame · Individuálne ocenenie · Ako to funguje · Prečo Albion ·
Kde nás nájdete · Kontakt · Footer`

Sekcia „Od roku 2001 / História" **neexistuje**. Jej obsah žije ako jeden bod v „Prečo Albion".

---

## 2. Rozpis fáz

Každá fáza = commit. Po každej fáze zhrnutie „overené / neoverené".

### Fáza 1 — setup a dátová vrstva
`chore(setup): astro + tailwind v4 + typescript baseline`

| Súbor | Obsah |
|---|---|
| `package.json` | `dev`, `build`, `build:draft`, `preview`, `check` |
| `astro.config.mjs` | `output: 'static'`, `@tailwindcss/vite`, `@astrojs/sitemap`, `site` z `PUBLIC_SITE_URL` |
| `tsconfig.json` | `astro/tsconfigs/strict` + alias `@/*` |
| `.gitignore`, `.editorconfig`, `.nvmrc` | |
| `src/styles/global.css` | `@theme` tokeny + `@font-face` + base layer + reduced-motion |
| `src/data/business.ts` | jediný zdroj pravdy, `TO_CONFIRM`, `FEATURES` |
| `src/data/content.ts` | všetky SK texty, typované |
| `scripts/check-placeholders.mjs` | placeholder gate (pre + post build) |
| `src/pages/robots.txt.ts` | generovaný z `site` (nie statický súbor — doména je z env) |
| `public/favicon.svg`, `public/fonts/*.woff2` | |
| `README.md` | vrátane sekcie **Čo potrebujeme od klienta** |

Závislosti — kompletný zoznam:

| Balík | Prečo |
|---|---|
| `astro` | framework |
| `tailwindcss` + `@tailwindcss/vite` | v4 CSS-first |
| `@astrojs/sitemap` | požiadavka 13.4 |
| `@fontsource-variable/inter` | zdroj woff2 (telo) |
| `@fontsource-variable/source-serif-4` | zdroj woff2 (nadpisy) |
| `typescript` (dev) | strict |
| `@astrojs/check` (dev) | nutné pre `npm run check` |

`check-placeholders.mjs`:
1. **pred buildom** naimportuje `business.ts` (natívne type-stripping v Node ≥ 22.18),
   rekurzívne nájde všetky `TO_CONFIRM` a vypíše ich cesty; bez `--allow`
   / `ALLOW_PLACEHOLDERS=1` skončí exit 1;
2. **po builde** prehľadá `dist/**/*.html` na literál `TO_CONFIRM` — poistka.

`npm run build` = gate zapnutý. `npm run build:draft` = gate varuje, ale prejde
(používa `--allow`, nie env premennú — funguje rovnako v PowerShell aj bash).
`astro dev` gate nespúšťa.

---

### Fáza 2 — UI primitíva + logo
`feat(ui): design system primitives and provisional wordmark`

`src/components/ui/`: `Container.astro`, `Section.astro` (`tone: 'ink' | 'ink-soft' | 'paper'`),
`Button.astro` (`variant: 'primary' | 'secondary' | 'ghost'`, `tone: 'dark' | 'light'`),
`Eyebrow.astro`, `Hairline.astro`, `Icon.astro`.

`src/components/brand/Logo.astro` — provizórny wordmark, inline SVG, `currentColor`,
`variant: 'full' | 'wordmark'`, čitateľný pri 24 px.

`Icon.astro` — **presne 4 ikony**: `phone`, `map-pin`, `menu`, `close`.
`aria-hidden="true"`, `stroke: currentColor`, 1.5 px.

Zrušené oproti v1: `Reveal.astro`, `MediaSlot.astro`, ikony `arrow-up-right` a `check`.
Kde bude neskôr fotka, je v kóde `{/* TODO: photo */}`.

---

### Fáza 3 — layout
`feat(layout): base layout, header, mobile menu, footer, sticky call bar`

`src/layouts/BaseLayout.astro` — `<html lang="sk">`, skip link, preload fontov,
landmarky, **meta priamo cez props** (title/description/canonical/OG — žiadny `src/lib/seo.ts`),
komentovaný slot pre analytics.

V `BaseLayout` je aj **reveal observer** — ~10 riadkov, jeden `IntersectionObserver`
nad `[data-reveal]`, pridáva `.is-revealed`. Bez JS je obsah plne viditeľný.

`src/components/layout/`: `Header.astro`, `MobileMenu.astro`, `Footer.astro`,
`StickyCallBar.astro`.

- Header: transparentný → `ink-900` + hairline po 24 px scrollu (passive listener, rAF throttle).
- Header `< 480 px`: CTA je **icon-only** 48×48 px, `aria-label="Zavolať na číslo {phone}"`,
  a logo prepína na `variant="wordmark"` (bez descriptoru). Od `480 px` ikona + text
  a `variant="full"`.
- MobileMenu: fullscreen overlay, `aria-expanded` / `aria-controls`, focus trap, Esc, scroll lock,
  návrat focusu na spúšťač.
- StickyCallBar: `IntersectionObserver` na hero sentinel, `fixed bottom`, 64 px, len `< 768 px`.

---

### Fáza 4 — sekcie
`feat(sections): homepage sections`

`Hero` → `WhatWeAccept` → `IndividualValuation` → `HowItWorks` → `WhyAlbion` →
`Location` → `Contact`.

Všetky texty z `content.ts`, žiadny string v šablóne. Každá sekcia `aria-labelledby`.
Presne jeden `<h1>`.

**Prečo Albion — bod „Dlhoročná miestna firma":**
> Albion patrí k najdlhšie fungujúcim záložniam v Lučenci. Nie sme pobočka reťazca —
> sme miestna firma, ktorá tu chce fungovať aj o desať rokov.

Ak `business.foundedYearConfirmed === true`, na začiatok textu sa doplní
`V Lučenci pôsobíme od roku {foundedYear}.` Inak sa nedoplní nič — žiadna diera v layoute.

Hero eyebrow: adresa + „pri stanici". **Bez roku.**

`src/lib/hours.ts` — „Otvorené teraz" v `Europe/Bratislava` cez `Intl.DateTimeFormat`,
bez knižnice. Ak sú hodiny `TO_CONFIRM`, indikátor sa nevykreslí vôbec.

---

### Fáza 5 — SEO, schema, OG, 404
`feat(seo): metadata, json-ld, sitemap, og image, 404 page`

- Meta rieši `BaseLayout` cez props (bez `src/lib/seo.ts`).
- `src/lib/schema.ts` — `PawnShop` JSON-LD s rekurzívnym filtrom: každé pole, ktoré je
  `TO_CONFIRM`, `undefined` alebo prázdny objekt, z výstupu vypadne. Unit-test cez `node --test`.
- `public/og.png` — **jeden statický súbor** 1200×630 (ink pozadie, wordmark, adresa).
  Žiadny generátor, žiadny `sharp`.
- `404.astro` — rovnaký layout, krátky text, odkaz domov + telefón.

---

### Fáza 6 — audit
`chore(qa): accessibility, performance and responsive audit`

**Fáza 6 sa nespúšťa, kým nie je známy reálny telefón a doména.**

Report bude zoznam „overené / neoverené", nie tvrdenie „hotovo":
- Lighthouse mobile + desktop, medián z 3 behov.
- axe-core manuálny beh.
- Celý prechod klávesnicou (Tab / Shift+Tab / Enter / Esc) so slovným popisom, kde focus skončil.
- Test pri 200 % zoome.
- `prefers-reduced-motion` zapnuté.
- Kontrasty všetkých reálne použitých kombinácií, zmerané nástrojom (vrátane
  `border-interactive-*` — hodnoty nižšie sú vypočítané, nie namerané).
- Šírky 320 / 360 / 390 / 768 / 1024 / 1440 / 1920 + kontrola horizontálneho scrollu.
- Veľkosť klientského JS v gzip zo `dist`.
- Diakritika `ľťďĺŕčšžýáíéôäúňó` + `document.fonts.check`.
- 0 third-party requestov, 0 cookies.

---

## 3. Fonty — bez nového balíka

- Preload **len serif** (Source Serif 4 Variable), oba subsety `latin` + `latin-ext`
  = presne 2 preloadované súbory. Pokrývajú LCP prvok (`<h1>`).
- Inter sa nepreloaduje, `font-display: swap`.
- Fallback stacky (metricky blízke, kvôli CLS):
  - serif → `Georgia, 'Times New Roman', serif`
  - sans → `system-ui, -apple-system, 'Segoe UI', sans-serif`
  - ak CLS > 0.05, doladiť `size-adjust` v `@font-face`.
- Žiadny `subset-font`, žiadny build-time subsetting. Ak Fáza 6 nameria LCP > 1,8 s
  kvôli fontom, vrátim sa s číslami.

woff2 sú skopírované z `@fontsource-variable/*` do `public/fonts/` a commitnuté —
kvôli stabilným cestám pre `<link rel="preload">`.

---

## 4. Hranice a kontrast

| Token | Hodnota | Kontrast |
|---|---|---|
| `--color-border-interactive-dark` | `#6B675F` | 3,36:1 na `ink-900`, 3,10:1 na `ink-800` |
| `--color-border-interactive-light` | `#807B72` | 3,76:1 na `paper` |

Pravidlo použitia:
- dekoratívny predel medzi sekciami / pod nadpismi → `hairline-dark` / `hairline-light`;
- hranica **čohokoľvek klikateľného** (ghost tlačidlo, sticky bar, pole, hamburger) →
  `border-interactive-*`;
- hover ghost tlačidla → hranica prechádza na `--color-gold` (8,39:1).

---

## 5. Chýbajúce údaje

Do `business.ts` idú ako `TO_CONFIRM`. Fázy 1–5 sa robia s `build:draft`.

| # | Údaj |
|---|---|
| 1 | telefónne číslo (`+421…`) |
| 2 | doména / cieľová URL |
| 3 | otváracie hodiny |
| 4 | PSČ Lučenca pre danú adresu (+ presná ulica a č.) |
| 5 | Google Maps URL prevádzky |
| 6 | IČO + presný obchodný názov prevádzkovateľa |
| 7 | potvrdenie roku 2001 |
| 8 | e-mail (voliteľné) |

`siteUrl`: `PUBLIC_SITE_URL` ak existuje, inak `http://localhost:4321`
(kvôli sitemape a absolútnym OG URL).

**Chýbajúci telefón — zmena oproti briefu:** primárne CTA sa v produkcii **neskrýva**.
Zmení sa na **„Chcem oceniť vec"** s kotvou na `#kontakt`. Web tak nikdy neostane bez
primárnej akcie. V DEV navyše červený badge.

---

## 6. Odchýlky od briefu — zoznam

1. `astro dev` nespúšťa placeholder gate (`build` = prísny, `build:draft` = povolené).
2. `@astrojs/check` je devDependency navyše — bez neho `npm run check` neexistuje.
3. `robots.txt` je generovaný endpoint, nie statický súbor (doména prichádza z env).
4. Verzia Astro: **7.x (aktuálna)**, nie 5.x. Astro 5 je z roku 2024; konfiguračná plocha,
   ktorú projekt používa (`site`, `output: 'static'`, integrácie, Vite pluginy), je
   medzi 5 a 7 nezmenená.
5. „Lighthouse Accessibility 100" nie je dôkaz prístupnosti — Fáza 6 obsahuje aj manuálny audit.

Farby, typografia, poradie sekcií, CTA hierarchia ani tón textov sa nemenia.
