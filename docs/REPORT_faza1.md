# REPORT — Fáza 1 (setup a dátová vrstva)

Commity: `chore(setup): astro + tailwind v4 + typescript baseline` (+ doplnenie tokenov a textov)

## Čo vzniklo

| Súbor | Poznámka |
|---|---|
| `package.json` | `dev`, `build`, `build:draft`, `preview`, `check` |
| `astro.config.mjs` | `output: 'static'`, `site` z `PUBLIC_SITE_URL`, sitemap, Tailwind cez Vite plugin, `inlineStylesheets: 'always'` |
| `tsconfig.json` | `astro/tsconfigs/strict`, alias `@/*` |
| `.gitignore`, `.gitattributes`, `.editorconfig`, `.nvmrc` | `.gitattributes` kvôli LF na Windowse |
| `src/styles/global.css` | 4× `@font-face`, celý `@theme` z BRIEF §4, base layer, `container-page` a `measure`, reveal, reduced-motion |
| `src/data/business.ts` | jediný zdroj pravdy, 12× `TO_CONFIRM`, `FEATURES` |
| `src/data/content.ts` | všetky texty z BRIEF §7 a §12, doslova |
| `scripts/check-placeholders.mjs` | placeholder gate |
| `src/pages/robots.txt.ts` | generovaný `robots.txt` |
| `src/pages/index.astro` | **dočasná** držiaca stránka, Fáza 3 ju prepíše |
| `public/fonts/*.woff2` | 4 súbory: serif + Inter, latin + latin-ext |
| `public/favicon.svg` | provizórny |

## Overené (reálne zbehlo)

- `npm run build:draft` → prejde, 1 stránka + `sitemap-index.xml`
- `npm run build` → **zlyhá exit 1**, vypíše 12 nepotvrdených polí ✅
- post-build scan `dist/**/*.html` → 0 výskytov `TO_CONFIRM`
- `npm run check` → 0 errors, 0 warnings, 0 hints
- `dist/robots.txt` → obsahuje `Sitemap:` odvodené z `site`
- Astro telemetry vypnutá

## Neoverené

Čokoľvek vizuálne, výkonnostné a prístupnostné. To je Fáza 6, ktorá sa nespúšťa
bez reálneho telefónu a domény.

## Tokeny — opravené

Rekonštruované hodnoty nahradené originálmi z BRIEF §4. Všetky značky
`⚠ REKONŠTRUOVANÉ` odstránené. Doplnené chýbajúce: `ink-700`, `paper-2`,
`ink-text`, `gold-hover`, celá typografická škála, spacing, radius, container
a motion tokeny. Hairliny sú `rgba`, ako brief predpisuje.

Premenovanie: `--font-display` → `--font-serif` (podľa briefu).

## Rozhodnutia, ktoré som urobil sám

1. **`requiredDocuments` v `business.ts`** — brief §7/5 hovorí, že poznámka pod
   krokmi sa vykreslí len ak je potvrdená. Potreboval to pole, inak sa nemá čoho
   chytiť. Je `TO_CONFIRM`.
2. **`container-page` a `measure` ako `@utility`** — namiesto `Container.astro`.
   Podľa pravidla „ak sa komponent použije raz a nemá logiku, nerob z neho komponent"
   je kontajner čistá geometria, teda CSS, nie komponent.
3. **`.gitattributes`** — bez neho Git hlásil CRLF konverziu proti `.editorconfig`.
4. **`inlineStylesheets: 'always'`** — CSS je malé a šetrí to jeden request
   v kritickej ceste. Ak by po Fáze 4 narástlo nad ~15 kB, vrátim sa k tomu.
