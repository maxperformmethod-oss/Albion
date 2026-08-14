# Albion — Záložňa Lučenec

Statická jednostránka. Cieľ: rýchlo dostať návštevníka k telefonátu.
Bez trackingu, bez cookies, bez third-party requestov.

Astro · Tailwind CSS v4 (CSS-first) · TypeScript strict · žiadny UI framework.

Plán a rozhodnutia: [PLAN.md](PLAN.md).

---

## Príkazy

```bash
npm run dev          # vývoj, placeholder gate sa nespúšťa
npm run build        # produkčný build — ZLYHÁ, ak chýbajú údaje v business.ts
npm run build:draft  # náhľadový build, placeholdery povolené (nenasadzovať)
npm run preview      # lokálny náhľad dist/
npm run check        # astro check (TypeScript)
npm test             # node --test, unit testy filtra JSON-LD
```

Doména sa nastavuje premennou `PUBLIC_SITE_URL`. Bez nej beží všetko na
`http://localhost:4321`, aby mala sitemap a absolútne OG URL z čoho vychádzať.

```powershell
$env:PUBLIC_SITE_URL = "https://albion-lucenec.sk"; npm run build
```

---

## Štruktúra

```
src/
  data/business.ts       jediný zdroj pravdy o prevádzke (TO_CONFIRM, FEATURES)
  data/content.ts        všetky SK texty
  styles/global.css      @font-face, @theme tokeny, base layer, utility
  layouts/BaseLayout     meta, preload fontov, skip link, reveal observer
  components/ui/         Section, Button, Eyebrow, Icon
  components/brand/      Logo (provizórny wordmark)
  components/layout/     Header (+ mobilné menu), Footer, StickyCallBar
  components/sections/   7 sekcií homepage
  lib/cta.ts             podoba primárneho CTA na jednom mieste
  lib/hours.ts           „Otvorené teraz“ v Europe/Bratislava
  lib/schema.ts          PawnShop JSON-LD + rekurzívny filter placeholderov
  pages/index.astro      homepage
  pages/404.astro        noindex, bez JSON-LD
  pages/robots.txt.ts    generovaný robots.txt
scripts/check-placeholders.mjs
tests/schema.test.mjs
public/
  fonts/                 4× woff2 (latin + latin-ext, serif + sans)
  favicon.svg, og.png    provizórne
```

**Pravidlo:** žiadny údaj o firme a žiadny text sa nepíše priamo do šablóny.
Údaje idú z `business.ts`, texty z `content.ts`.

**Pravidlo rozsahu:** ak sa komponent použije práve raz a nemá vlastnú logiku,
nerobí sa z neho komponent.

---

## Placeholder gate

`business.ts` drží nepotvrdené údaje ako `TO_CONFIRM`. Gate beží dvakrát:

- **pred buildom** — vypíše zoznam nepotvrdených polí; v produkčnom builde skončí chybou;
- **po builde** — prehľadá `dist/**/*.html` na literál `TO_CONFIRM`. Toto zlyhá vždy,
  aj v draft režime: placeholder v HTML nie je chýbajúci údaj, ale chyba v komponente
  (mal daný prvok vynechať, nie vypísať placeholder).

---

## Čo potrebujeme od klienta

Bez týchto údajov produkčný build zámerne neprejde. Zoradené podľa dopadu.

| # | Údaj | Bez neho nefunguje |
|---|---|---|
| 1 | **Telefónne číslo** `+421…` + tvar pre oko | Primárne CTA v hlavičke, hero, sekcii ocenenia, kontakte aj v sticky bare |
| 2 | **Doména / cieľová URL** | `canonical`, absolútna `og:image`, sitemap |
| 3 | Otváracie hodiny | Indikátor „Otvorené teraz", kontaktný blok, `openingHoursSpecification` v JSON-LD |
| 4 | Presná ulica a číslo + **PSČ** Lučenca | Hero eyebrow, kontakt, `PostalAddress` v JSON-LD |
| 5 | Google Maps URL prevádzky | Terciárne CTA v sekcii „Kde nás nájdete" a tlačidlo „Mapa" v sticky bare |
| 6 | GPS súradnice | `geo` v JSON-LD (lokálne SEO) |
| 7 | IČO + presný obchodný názov prevádzkovateľa | Pätička, právny riadok |
| 8 | Potvrdenie roku 2001 | Veta „V Lučenci pôsobíme od roku 2001" v sekcii „Prečo Albion" |
| 9 | E-mail *(voliteľné)* | Kontaktný blok |

Ak telefón chýba, primárne CTA sa **neskrýva** — zmení sa na „Chcem oceniť vec"
s kotvou na `#kontakt`, aby web nikdy neostal bez primárnej akcie.

### Ostatné podklady

- **Fotky** — vo Fáze 1 sa nepoužívajú žiadne. Kde majú neskôr prísť, je v kóde
  komentár `{/* TODO: photo */}`. Každá sekcia je navrhnutá tak, aby bez fotky
  bola kompletná — nie „diera po fotke".
- **Logo** — zatiaľ provizórny typografický wordmark a favicon. Ak existuje
  originál (SVG, prípadne krivky), nahradíme ho.
- **`public/og.png`** — jeden statický obrázok 1200×630 (tmavé pozadie, wordmark,
  adresa). Vzniká vo Fáze 5, žiadny generátor sa nepridáva.

---

## Dokumentácia

| Súbor | Čo je v ňom |
|---|---|
| [docs/BRIEF.md](docs/BRIEF.md) | zdroj pravdy — dizajn, texty, pravidlá. Neprepisovať. |
| [docs/FIRMA_UDAJE.md](docs/FIRMA_UDAJE.md) | nájdené, **neoverené** údaje o firme. Nič odtiaľ nejde do `business.ts`. |
| [docs/NEXT.md](docs/NEXT.md) | aktuálne pokyny |
| [docs/OTAZKY.md](docs/OTAZKY.md) | otvorené otázky |
| `docs/REPORT_faza<N>.md` | čo sa v danej fáze urobilo a čo je overené |
