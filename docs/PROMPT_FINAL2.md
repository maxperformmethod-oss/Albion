# FINÁLNA DÁVKA 2 — mapa, copy, doména

> Pre Claude Code. Platí spolu s `docs/BRIEF.md`. Tri zmeny, potom sme hotoví.

---

## 1. COPY — DVE ZMENY

### 1.1 „netypické" → „atypické"

Zmeň **na oboch miestach**, nech to nie je raz tak a raz tak:

- Hero lead: `… náradie, autá aj atypické veci.`
- Prečo Albion, bod 3, nadpis: `Berieme aj atypické veci`

### 1.2 Sekcia Kontakt — nový nadpis a lead

Bolo:

```
H2:   Ozvite sa
Lead: Najrýchlejšie to vyriešime telefonicky alebo osobne.
```

Nové (použi presne):

```
H2:   Poďme sa o tom porozprávať.
Lead: Zavolajte alebo jednoducho prídite. Pozrieme sa na vec, povieme
      vám sumu a rozhodnete sa vy. Opýtať sa nič nestojí.
```

Dôvod: „Ozvite sa" je príkaz. Toto je ponuka rozhovoru a nadväzuje na celý pozicioning („záložňa, kde sa vieme dohodnúť"). Posledná veta odstraňuje jedinú reálnu obavu — že návšteva k niečomu zaväzuje.

---

## 2. MAPA V SEKCII „KDE NÁS NÁJDETE"

Požiadavka bola: veľká mapa, Street View alebo satelit, s prechodom alebo animáciou.

**Nerobíme embed Google Máp ani satelitné snímky.** Dôvody, v poradí dôležitosti:

1. **Licencia.** Snímky Google (Street View aj satelit) sú licencovaný obsah. Legálne sa dajú použiť len cez oficiálne Google API s API kľúčom, povinnou atribúciou a v ich prehliadači — nie ako stiahnutý obrázok.
2. **Rozpočet.** Embed je third-party iframe s cookies a stovkami kB skriptov. Práve sme dosiahli 6 requestov, 0 third-party, 0 cookies a JS 1,72 kB. Jeden embed to celé zruší a LCP, ktoré je už teraz na 2,32 s, sa zhorší.
3. **Vzhľad.** Screenshot z Máp na prémiovom webe vyzerá lacno. Je to jediný prvok, ktorý by vyzeral ako šablóna za 300 €.

**Namiesto toho:** nakreslíme **vlastnú orientačnú schému ako inline SVG.** Je to lepšie riešenie, nie kompromis — bude v našich farbách, váži pár kB, animuje sa krásne a nikomu nepatrí okrem nás.

### 2.1 Špecifikácia

Komponent `src/components/sections/LocationMap.astro`, inline SVG, `viewBox="0 0 1200 700"`, šírka 100 % sekcie.

Obsah, odspodu nahor:

| Vrstva | Vzhľad |
|---|---|
| Podklad | `--color-ink-800`, jemná mriežka ulíc `rgba(245,242,236,0.07)`, 1px |
| Železnica | dvojitá linka `--color-bone-muted` pri 25 % + priečne pražce á 14 px |
| Budova stanice | obdĺžnik s hairline hranicou, popis `Železničná stanica` |
| Ulica Kpt. Nálepku | linka `rgba(245,242,236,0.18)`, o niečo hrubšia, popis pozdĺž nej |
| Trasa stanica → Albion | prerušovaná linka `--color-gold`, `stroke-width: 2.5`, `stroke-dasharray: 8 10` |
| Bod Albion | zlatý plný krúžok r=9 + hairline prstenec r=18, popis `Albion` v serif 600 |
| Pätka | malým písmom `Orientačná schéma` — aby bolo zrejmé, že to nie je navigačná mapa |

Pod SVG:

- veľký typografický blok: `Kpt. Nálepku 41` / `984 01 Lučenec`
- riadok `Pár krokov od železničnej stanice.`
- tlačidlo `Otvoriť v Google Mapách` → `business.mapsUrl`

### 2.2 Animácia

Toto je druhý (a posledný) väčší animačný moment na webe:

1. Trasa sa **nakreslí**: `stroke-dashoffset` z dĺžky cesty na 0, `1100ms`, `--ease-out-quint`.
2. Bod Albion sa objaví až po dokreslení trasy: `opacity 0→1` + `scale(0.85→1)`, `300ms`, delay `900ms`.
3. Prstenec okolo bodu: jednorazové `scale(1→1.35)` + `opacity 0.6→0`, `700ms`, delay `1150ms`. **Jeden raz, nie slučka.** Pulzujúci bod je gýč.
4. Spúšťa `IntersectionObserver`, `threshold: 0.35`, raz.

**Pozor na pascu, ktorú si už raz našiel:** prvok s nulovým rozmerom IntersectionObserver neohlási. Pozoruj obal sekcie, nie SVG cestu.

`prefers-reduced-motion`: nič sa nekreslí, všetko je hneď v koncovom stave.

### 2.3 Prístupnosť

- `<svg role="img" aria-labelledby="mapTitle mapDesc">` s `<title>` a `<desc>`.
- `<desc>`: `Schéma okolia — prevádzka Albion sa nachádza na ulici Kpt. Nálepku 41, pár krokov od železničnej stanice v Lučenci.`
- Textový blok pod mapou obsahuje tú istú informáciu — mapa nesmie byť jediný nositeľ údaja.
- Popisy v SVG rob ako `<text>`, nie ako obrysy — musia byť v DOM a vyhľadateľné.
- Kontrast popisov voči podkladu min 4.5:1.

### 2.4 Geometria — čo NEVYMÝŠĽAŤ

Schéma smie byť zjednodušená, ale **nesmie klamať o smere**. Kým nemáme `geo` súradnice a potvrdenie od majiteľa, drž sa len týchto dvoch istôt: prevádzka je na Kpt. Nálepku 41 a je blízko železničnej stanice.

**Nikde neuvádzaj počet minút ani metrov** — to zatiaľ nevieme. `Pár krokov` je pravdivé, `2 minúty pešo` by bol výmysel.

Do `docs/OTAZKY.md` pridaj otázku na presné súradnice a orientáciu (stanica je od prevádzky ktorým smerom?), nech vieme schému neskôr upresniť.

### 2.5 Ak by si trval na skutočnej mape

Jediná legálna cesta bez iframe je **statická mapa od poskytovateľa s voľnou licenciou** (MapTiler, Mapbox, Geoapify), vyrenderovaná raz pri buildu do obrázka, s povinnou atribúciou v pätke. Neimplementuj to teraz — je to horší vzhľad aj väčší súbor. Uvádzam to len ako doloženú alternatívu.

---

## 3. DOMÉNA A LCP

Web je nasadený na Verceli.

1. Zisti produkčnú URL a nastav `PUBLIC_SITE_URL` v Vercel env (Production aj Preview).
2. Over, že canonical, `og:url` a `sitemap.xml` ukazujú na ňu, nie na `*.vercel.app` náhradu.
3. **Premeraj LCP znova na produkčnej doméne**, nie lokálne. Tvoja analýza sedí — 2,32 s lokálne bolo o latencii a hlavnom vlákne, nie o veľkosti obrazu (8 kB mobilný variant je mimo podozrenia). Vercel pridá HTTP/2, Brotli a CDN.
4. Ak by LCP na produkcii aj tak presiahlo 1,8 s, **neriešime to zmenšovaním obrazu ani rušením animácií.** Pozri sa najprv na poradie preloadov fontov a na to, či hero obraz štartuje v prvej dávke requestov.
5. Výsledok dopíš do `docs/REPORT_faza6_audit.md` ako samostatný oddiel „Produkcia".

---

## 4. PORADIE

1. Copy (§1) → 2. Mapa (§2) → 3. `PUBLIC_SITE_URL` + meranie na produkcii (§3) → 4. `git push`.

Report do `docs/REPORT_faza8_mapa.md`: veľkosť SVG v kB, nová hodnota JS gzip, LCP na produkcii, kontrast popisov v mape.

V chate max 5–10 riadkov.

---

## 5. POCHVALA A JEDNA POZNÁMKA

Nález so `scaleX(0)` a IntersectionObserverom bol dobrý — to je presne ten typ chyby, ktorý Lighthouse 100 nikdy nechytí a na produkcii by ostal navždy. Rovnako 12,14:1 meraný na pixeloch namiesto na tokenoch.

Poznámka: `WCAG 2.5.3 Label in Name` sa nám objavilo 3×, čo naznačuje systémový problém v tom, ako skladáme `aria-label` z textu tlačidla. Skontroluj, či sa to nedá vyriešiť raz v `Button.astro` namiesto trikrát na mieste použitia.
