# AKTUALIZÁCIA ÚDAJOV (14. 8. 2026)

> Pre Claude Code. Zapracuj do `business.ts` a `docs/FIRMA_UDAJE.md`.

## 1. TELEFÓN — DOPLNENÝ

```
+421 905 345 107
```

Ulož v tvaroch:

- `business.phone = "+421905345107"` — zdroj pravdy, bez medzier (JSON-LD `telephone` a `tel:` href)
- zobrazenie na webe: `0905 345 107` v hlavičke a sticky bare, `+421 905 345 107` v sekcii Kontakt a footeri
- `aria-label="Zavolať na číslo 0905 345 107"`

Odstráň DEV badge `CHÝBA TELEFÓN` a fallback logiku, ktorá prepínala primárne CTA na „Chcem oceniť vec". Primárne CTA je od teraz `Zavolať` všade.

⚠ **Poznámka:** číslo je dodané ako „zatiaľ toto". Kým ho majiteľ výslovne nepotvrdí ako verejné, drž ho v `business.ts` s komentárom `// dočasné, potvrdiť pred spustením`. Na živý web sa nesmie dostať číslo, ktoré niekto nechce mať verejne.

## 2. DOMÉNA — RIEŠI SA CEZ VERCEL, PRESTÁVA BYŤ BLOKÁTOR

Nečakáme na vlastnú doménu. Uprav `siteUrl` tak, aby sa odvodil v tomto poradí:

```ts
const siteUrl =
  process.env.PUBLIC_SITE_URL                                  // vlastná doména, keď bude
  ?? (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)  // automaticky na Verceli
  ?? "http://localhost:4321";                                  // lokálny vývoj
```

`VERCEL_URL` dopĺňa Vercel sám pri každom builde, takže canonical, `og:url` aj `sitemap.xml` budú správne hneď po prvom deployi bez toho, aby sme čokoľvek nastavovali.

Dôsledky:

- `siteUrl` už **nie je** `TO_CONFIRM` a nemá blokovať `npm run build`,
- v `astro.config.mjs` nastav `site` z tej istej funkcie,
- keď príde vlastná doména, nastaví sa `PUBLIC_SITE_URL` v Vercel env a nič v kóde sa nemení.

## 3. STAV ÚDAJOV

| Pole | Stav |
|---|---|
| `street`, `city`, `postalCode` | ✅ Kapitána Nálepku 41, 984 01 Lučenec |
| `phone` | ✅ +421905345107 *(dočasné, potvrdiť)* |
| `siteUrl` | ✅ z env / `VERCEL_URL` |
| `foundedYear` | 2001, `foundedYearConfirmed: false` |
| `openingHours` | ❌ `TO_CONFIRM` — indikátor „Otvorené teraz" sa nevykreslí, `openingHoursSpecification` sa nedostane do JSON-LD |
| `mapsUrl` | ❌ `TO_CONFIRM` — tlačidlo „Otvoriť v Google Mapách" zatiaľ neexistuje |
| `geo` | ❌ `TO_CONFIRM` |
| `email` | ❌ `TO_CONFIRM` |
| `ico` | ❌ `TO_CONFIRM` — riadok v footeri sa nevykreslí |

## 4. AUDIT SA ODOMYKÁ

S telefónom a funkčným `siteUrl` už **môžeš spustiť Fázu 6** po dokončení prác z `PROMPT_FINAL.md`.

Lighthouse spusti na produkčnom builde lokálne (`npm run build && npm run preview`), nie na dev serveri — dev server má iné výsledky a nie je to meranie, ale odhad.

Report do `docs/REPORT_faza6_audit.md` ako zoznam **„overené / neoverené"** s číslami.

## 5. ČO EŠTE CHÝBA OD MAJITEĽA

Otváracie hodiny (vrátane obedňajšej prestávky a soboty) · odkaz na Google Maps profil · e-mail · IČO · potvrdenie roku 2001 · potvrdenie, že telefón môže byť verejný · 6 fotiek.
