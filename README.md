Projekt žije v C:\Dev\albion a nikde inde.
Otvárať cez albion.code-workspace, nie cez File > Open Folder.
Priečinok Albion na ploche je starý a nepoužíva sa.

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

Produkcia beží na `https://albion-bf4w.vercel.app`. Táto adresa je predvolená
v `astro.config.mjs` aj v `business.ts` — **nie** cez `VERCEL_URL`, ktorý nesie
adresu konkrétneho nasadenia a canonical by sa pri každom deploji menil.

Keď príde vlastná doména, prepíše ju premenná `PUBLIC_SITE_URL` bez zásahu do kódu:

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
  components/ui/         Section, SectionBridge, SectionTexture, Button, Eyebrow, Icon
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
scripts/build-images.mjs        hero + 3 dekoratívne textúry, rovnaký grading
scripts/check-hero-contrast.mjs kontrast textu nad hero obrazom, zopakovateľne
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

## Čo ešte potrebujeme od klienta

Kľúčové údaje sú **doplnené a potvrdené** (názov, adresa, telefón, hodiny, IČO,
Google Maps). Produkčný build prechádza. Zvyšok neblokuje.

| # | Údaj | Čo pribudne, keď príde |
|---|---|---|
| 1 | **Doména / cieľová URL** | `canonical`, absolútna `og:image`, sitemap a `url`/`image` v JSON-LD |
| 2 | E-mail | Riadok v sekcii Kontakt a `email` v JSON-LD |
| 3 | GPS súradnice | `geo` v JSON-LD (lokálne SEO) |
| 4 | Potvrdenie roku 2001 | Veta „V Lučenci pôsobíme od roku 2001" v sekcii „Prečo Albion" |
| 5 | Priamy odkaz na Google profil | Nahradí vyhľadávací odkaz — otvorí kartu prevádzky s recenziami |
| 6 | Doklady k založeniu | Poznámka pod krokmi v sekcii „Ako to funguje" |

Ak by telefón niekedy chýbal, primárne CTA sa **neskrýva** — zmení sa na
„Chcem oceniť vec" s kotvou na `#kontakt`, aby web nikdy neostal bez primárnej akcie.

### Fotky od majiteľa — 6 kusov

Z mobilu, na výšku aj na šírku, denné svetlo, bez blesku:

1. **exteriér** prevádzky s viditeľným vchodom,
2. **výklad / označenie**,
3. **interiér — pult**, kde sa oceňuje,
4. **detail zlata alebo šperkov** na tmavom podklade,
5. **okolie so stanicou** v zábere (dokazuje „pri stanici"),
6. **majiteľ pri pulte** (ak súhlasí — najsilnejší trust prvok, aký môžeme mať).

Hero dnes beží na abstraktnej textúre (grafitový povrch, jedno teplé svetlo).
Nezobrazuje prevádzku, predmet ani osobu — je to materiál, nie tvrdenie o realite,
preto má `alt=""` a `aria-hidden`. **Reálna fotka ju nahradí okamžite**, je vždy
silnejšia. Stačí vymeniť zdroj v `scripts/build-images.mjs` a spustiť `npm run images`.

Tá istá textúra sa v troch ďalších variantoch objavuje aj v sekciách Individuálne
ocenenie, Prečo Albion a Kontakt. Platí pritom jedno pravidlo art direction:
**tmavé sekcie = materiál, svetlé sekcie = jasnosť.** Svetlé sekcie sú zámerne
bez obrazu — ten striedavý rytmus nesie celý dojem. Všetky štyri zdroje idú cez
rovnaký grading v jednom skripte, ktorý si sám stráži rozpočet aj tmavosť.

### Ostatné podklady

- **Logo** — zatiaľ provizórny typografický wordmark a favicon. Ak existuje
  originál (SVG, prípadne krivky), nahradíme ho.
- **`public/og.png`** — jeden statický obrázok 1200×630 (tmavé pozadie, wordmark,
  adresa). Žiadny generátor v repe.

---

## Dokumentácia

| Súbor | Čo je v ňom |
|---|---|
| [docs/BRIEF.md](docs/BRIEF.md) | zdroj pravdy — dizajn, texty, pravidlá. Neprepisovať. |
| [docs/UDAJE_FINAL.md](docs/UDAJE_FINAL.md) | **potvrdené údaje o firme** — čo je v `business.ts` a prečo |
| [docs/FIRMA_UDAJE.md](docs/FIRMA_UDAJE.md) | záznam o pátraní v katalógoch a o tom, ako sa vyriešil rozpor s adresou |
| [docs/HERO_ASSET.md](docs/HERO_ASSET.md) | spracovanie hero obrazu |
| [docs/NEXT.md](docs/NEXT.md), [docs/PROMPT_FINAL.md](docs/PROMPT_FINAL.md), [docs/ODPOVEDE_v3.md](docs/ODPOVEDE_v3.md) | pokyny a rozhodnutia |
| [docs/OTAZKY.md](docs/OTAZKY.md) | otvorené otázky |
| `docs/REPORT_faza<N>.md` | čo sa v danej fáze urobilo a čo je overené |
