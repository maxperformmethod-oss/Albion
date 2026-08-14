# FIX — Vercel deploy zlyháva na „No Next.js version detected"

## Príčina

Nie je to chyba v kóde. Pri importe projektu sa vo Verceli nastavil **Framework Preset = Next.js**. Vercel preto hľadá `next` v `package.json`, nenájde ho a build padne ešte pred spustením Astro.

Build log to potvrdzuje: dependencies sa nainštalovali v poriadku (311 balíkov, 6 s), padlo to až na detekcii frameworku.

## Oprava — urob obe, sú komplementárne

### A. `vercel.json` v koreni repa (aby to bolo v kóde, nie len v dashboarde)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci"
}
```

Nastavenia z `vercel.json` majú prednosť pred dashboardom, takže sa to už nikdy nerozíde — ani keď projekt niekto znovu importuje.

**Pred pushnutím over dve veci:**

1. `package-lock.json` **je commitnutý** — bez neho `npm ci` zlyhá. Ak v repe nie je, buď ho commitni, alebo zmeň `installCommand` na `npm install`.
2. `npm run build` v `package.json` je ten build, ktorý má placeholder gate a **prechádza bez `--allow`**. (Overené v `9231d6e`, ale skontroluj po zmenách.)

### B. Nastavenie vo Vercel dashboarde

Settings → General:

- **Framework Preset:** `Next.js` → **`Astro`**
- **Root Directory:** musí byť koreň repa (prázdne / `./`), nie podpriečinok
- Build Command, Output Directory, Install Command nechaj na `Override: off` — prevezmú sa z `vercel.json`

Potom Deployments → posledný deploy → **Redeploy** (s vypnutou cache pri prvom pokuse).

## Vedľajšie: varovanie o Node verzii

```
Warning: Detected "engines": { "node": ">=22.12.0" } … will automatically upgrade
```

Otvorený rozsah znamená, že Vercel ťa pri vydaní ďalšej major verzie automaticky prehodí a build môže padnúť bez toho, aby si čokoľvek zmenil. Priklincuj major:

```json
"engines": { "node": "22.x" }
```

Nie je to blokujúce, ale je to päť sekúnd práce a ušetrí to jeden nepríjemný výpadok o pol roka.

## Po úspešnom deployi

1. Skopíruj produkčnú URL a nastav `PUBLIC_SITE_URL` v Vercel env pre **Production aj Preview**, potom **redeploy** (env sa aplikuje až pri novom builde).
2. Over na živej stránke: `<link rel="canonical">`, `og:url` a `/sitemap-index.xml` ukazujú na produkčnú doménu.
3. Premeraj LCP na produkcii a dopíš do `docs/REPORT_faza6_audit.md`, oddiel „Produkcia".

## Poradie

Tento fix má prednosť pred `docs/PROMPT_FINAL2.md`. Najprv rozbehni deploy, potom mapa a copy.
