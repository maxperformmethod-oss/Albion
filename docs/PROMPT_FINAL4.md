# FINÁLNA DÁVKA 4 — 3D mapa, prechody, právne stránky

> Pre Claude Code. Predchádzajúca dávka bola odvedená dobre — čísla sedia a nález s troma príčinami revealu naraz bol presný.

---

## 0. NOVÉ PRAVIDLO PRÁCE — MENEJ AUDITU

Prestaň pri každej dávke prechádzať a auditovať celú stránku. Od teraz:

- **Over len to, čo si zmenil**, plus jeden rýchly smoke test (`npm run build` prejde · konzola bez chýb · rýchly scroll bez prázdnych miest).
- **Plný audit** (Lighthouse, axe-core, klávesnica, 200 % zoom, všetky šírky) spusti len keď o to výslovne požiadam, alebo pred finálnym spustením webu.
- Report píš kratšie: čo si zmenil, čo si overil, čo je otvorené. Netreba opakovať čísla, ktoré sa nezmenili.

---

## 1. PRODUKČNÁ URL

```
https://albion-bf4w.vercel.app
```

Nastav ju ako `PUBLIC_SITE_URL` (Production aj Preview), redeploy, over canonical / `og:url` / sitemap a premeraj LCP na produkcii. Dopíš do `docs/REPORT_faza6_audit.md`, oddiel „Produkcia".

---

## 2. PRECHODOVÉ PÁSY — OPRAVA

Prechody fungujú, ale pôsobia rozmazane a bijú do očí. Príčina je môj predpis — ten ručný teplý medzitón vytvára viditeľný smear.

**Oprava:**

1. **Zahoď ručné medzistupne.** Použi interpoláciu v `oklab`, ktorá prejde medzi tmavou a svetlou bez sivého prepadu sama:

```css
.bridge-down {
  background: linear-gradient(to bottom, var(--color-ink-900), var(--color-paper));
  background: linear-gradient(in oklab to bottom, var(--color-ink-900), var(--color-paper));
}
```

   Prvý riadok je fallback pre staré prehliadače, druhý ho v moderných prepíše.

2. **Skráť pás** z `clamp(64px, 8vw, 120px)` na **`clamp(40px, 4vw, 72px)`**. Dlhý prechod vyzerá ako rozmazanie, krátky ako zámer.

3. **Pridaj jemný šum proti pásikovaniu** — na 8-bitovom displeji vzniká v dlhom gradiente banding, ktorý oko číta ako „rozmazané":

```css
.bridge::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  opacity: .035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

4. Ak by aj po tomto pás rušil, **zmenši ho ešte na 40 px pevne**. Cieľ nie je efektný prechod, ale to, aby si hranicu nevšimol.

---

## 3. MAPA — SKUTOČNÉ BUDOVY A ULICE, 3D, ALE NIE Z GOOGLE

Požiadavka: reálne domy a cesty, 3D, animované.

**Google Maps ani ich 3D dlaždice použiť nemôžeme** — sú licencované, vyžadujú platený kľúč, ich vlastný renderer a povinnú atribúciu, a znamenali by third-party requesty. Toto stanovisko sa nemení.

**Ale existuje riešenie, ktoré dá presne to, čo chceš:** **OpenStreetMap dáta**. Sú otvorené (licencia ODbL), takže z nich smieme vykresliť **vlastnú** mapu — so skutočnými pôdorysmi budov a skutočnou geometriou ulíc, v našich farbách, ako statické SVG bez jediného runtime requestu. Jediná podmienka je atribúcia.

Je to lepšie než screenshot z Google: reálna geometria **a** náš vizuál.

### 3.1 Získanie dát (raz, pri buildu, výsledok sa commitne)

`scripts/build-map.mjs`:

1. **Súradnice prevádzky** zisti cez Nominatim (`nominatim.openstreetmap.org/search`) pre `Kpt. Nálepku 41, Lučenec`. Nastav `User-Agent` s názvom projektu (vyžaduje ich pravidlá). **Výsledok ručne over** proti `business.mapsUrl` — ak sa nezhoduje, zastav a napíš mi to. Súradnice si nevymýšľaj.
2. Ulož ich do `business.geo` — tým sa doplní aj `geo` v JSON-LD.
3. **Geometriu** stiahni z Overpass API pre bbox ~350 m okolo prevádzky:
   - `way["building"]` — pôdorysy budov
   - `way["highway"]` — ulice
   - `way["railway"="rail"]` a `railway=station`/`halt` — železnica a stanica
4. Odpoveď ulož do `src/data/map-raw.json` a **commitni**. Overpass sa volá len keď súbor neexistuje alebo pri `npm run map -- --refresh`. Žiadny build ho nesmie volať automaticky — ich pravidlá to zakazujú a build by bol krehký.

### 3.2 Vykreslenie — axonometrické 3D

Skript vygeneruje statické `src/components/sections/map.generated.svg`:

1. Súradnice prepočítaj na metre (lokálna rovinná projekcia okolo stredu), potom aplikuj **izometrické skosenie**: `x' = (x - y) * cos(30°)`, `y' = (x + y) * sin(30°)`.
2. **Budovy extruduj:** pre každý pôdorys vykresli bočné steny (polygóny medzi spodnou a hornou hranou, výška `12 px`, resp. `18 px` pre budovu stanice a budovu Albionu) a navrch strechu.
   - steny `--color-ink-700`, strechy `--color-ink-800`, obrys `--color-hairline-dark`
   - budova Albionu: strecha `--color-gold` pri 22 % krytí, obrys plné zlato
3. **Ulice** ako pásy `rgba(242,239,233,0.10)`, Kpt. Nálepku o stupeň svetlejšie.
4. **Železnica** dvojitá linka + pražce, `--color-bone-muted` pri 25 %.
5. Popisy `Železničná stanica`, `Kpt. Nálepku`, `Albion` ako `<text>` — musia byť v DOM.
6. Okraje mapy nechaj vyblednúť do podkladu cez `mask-image: radial-gradient(ellipse at center, black 55%, transparent 100%)` — inak vznikne ostrý štvorec, ktorý vyzerá lacno.

**Rozpočet:** hotové SVG **max 60 kB**. Zjednoduš polygóny (Douglas–Peucker, tolerancia ~0,6 m) a zaokrúhli súradnice na jedno desatinné miesto. Ak sa nezmestíš, zmenši bbox na 250 m — nie kvalitu.

### 3.3 Animácia

Pri vstupe do viewportu, raz, celé do **1,6 s**:

1. Ulice sa nakreslia (`stroke-dashoffset`), 600 ms.
2. Budovy vystúpia — `translateY(10px → 0)` + `opacity 0 → 1`, stagger 12 ms, zastropovaný na 20 prvkov, celkovo max 500 ms. Efekt „mesto sa postaví".
3. Trasa od stanice k Albionu sa nakreslí zlatou prerušovanou linkou, 500 ms.
4. Bod Albion + prstenec, jednorazovo.

`prefers-reduced-motion` → všetko hneď v koncovom stave.

### 3.4 Povinnosti a poistka

- V pätke mapy malým písmom: `Mapové podklady © prispievatelia OpenStreetMap` s odkazom na `https://www.openstreetmap.org/copyright`. **Bez toho to použiť nesmieme.**
- Zachovaj tlačidlo `Otvoriť v Google Mapách` — na navigáciu.
- Textový blok s adresou pod mapou zostáva; mapa nesmie byť jediným nositeľom informácie.
- `role="img"` + `<title>`/`<desc>` ako doteraz.

**Poistka:** ak výsledok nedosiahne úroveň zvyšku stránky (napr. Lučenec nemá v OSM zamapované budovy v dostatočnom detaile), **nechaj súčasnú 2D schému** a napíš mi to. Neposielaj von niečo, čo vyzerá horšie než to, čo tam je teraz. Ako druhú alternatívu vieme dať vygenerovanú ilustráciu, ale tá nebude geograficky presná — a keďže sme sa celý projekt držali pravidla nevymýšľať, radšej presnú jednoduchú než peknú vymyslenú.

---

## 4. PRÁVNE STRÁNKY

Web zatiaľ nemá nič z povinnej agendy. Doplň dve podstránky a odkazy v pätke.

### 4.1 Naša výhoda — pomenuj ju

Stránka **nenastavuje žiadne cookies, nemá analytiku, formuláre ani third-party skripty.** Preto **nepotrebuje cookie lištu** a zásady sú krátke a pravdivé. Nikde nepíš, že cookies používame.

### 4.2 `/ochrana-osobnych-udajov`

Nová stránka, rovnaký `BaseLayout`, `noindex` **nie** — nech je indexovateľná. H1 `Ochrana osobných údajov`.

Obsah (použi presne, dopĺňaj len z `business.ts`):

- **Prevádzkovateľ** — `ALBION P.M., s.r.o.`, `Kpt. Nálepku 41, 984 01 Lučenec`, IČO `36 050 814`, tel. `+421 47 433 44 44`.
- **Aké údaje spracúvame cez tento web** — `Tento web nezbiera žiadne osobné údaje. Nepoužíva cookies, analytické nástroje, sledovacie skripty ani kontaktné formuláre. Nevytvárame účty ani nepracujeme s prihlásením.`
- **Serverové logy** — `Naša stránka je hosťovaná u poskytovateľa Vercel Inc. Ten pri doručovaní stránky spracúva technické údaje vrátane IP adresy v rozsahu bežnom pre prevádzku webu. Neposkytujeme mu žiadne ďalšie údaje o vás.`
- **Keď nám zavoláte alebo prídete** — `Ak nás kontaktujete telefonicky alebo prídete do prevádzky, spracúvame údaje v rozsahu, ktorý vyžaduje zákon pre poskytovanie záložných služieb a výkup. Tieto údaje nezbierame cez tento web.` **[TEXT NA PRÁVNU KONTROLU]**
- **Vaše práva** — právo na prístup, opravu, vymazanie, obmedzenie, prenosnosť a namietanie; kontakt na uplatnenie a možnosť podať sťažnosť na Úrad na ochranu osobných údajov SR (`dataprotection.gov.sk`).
- **Kontakt na uplatnenie práv** — telefón. **Ak bude e-mail, doplní sa sem.**
- **Účinnosť od** — dátum publikovania, generovaný pri buildu.

### 4.3 `/podmienky-pouzivania`

Krátka stránka. H1 `Podmienky používania`.

- `Obsah tohto webu má informačný charakter. Nie je návrhom na uzavretie zmluvy ani záväznou ponukou.`
- `Konkrétne podmienky, ceny a lehoty závisia od individuálneho posúdenia veci a dohodneme sa na nich osobne v prevádzke.`
- `Uvedené kategórie vecí sú príklady, nie úplný zoznam.`
- Prevádzkovateľ + IČO.
- **[TEXT NA PRÁVNU KONTROLU]**

### 4.4 Odkazy a technické

- V pätke nový riadok: `Ochrana osobných údajov` · `Podmienky používania`. Odlíš ich vizuálne od hlavných odkazov — menšie, `--color-bone-muted`.
- Obe stránky pridaj do `sitemap.xml`.
- Meta description pre obe, `og:type=website`.
- Rovnaký header, footer a sticky call bar ako homepage.
- Sadzba textu: max **68ch**, `--text-body`, nadpisy H2 serif 600. Nech to nevyzerá ako odpad — aj právna stránka je súčasť dojmu.

### 4.5 Čo tam NEPÍSAŤ

Nevymýšľaj: zodpovednú osobu (DPO), lehoty uchovávania, právne základy podľa konkrétnych paragrafov, zoznam sprostredkovateľov, cezhraničné prenosy. Ak sa niečo z toho vyžaduje, doplní to právnik.

**Označ v `docs/OTAZKY.md`:** obidva texty sú návrh pripravený neprávnikom a pred spustením ich má prejsť niekto, kto sa tomu venuje. Toto nie je právne poradenstvo.

---

## 5. PORADIE

1. §1 produkčná URL + LCP
2. §2 prechody
3. §4 právne stránky
4. §3 mapa (najväčší kus, rob ju poslednú)
5. `git push`

Report do `docs/REPORT_faza10.md` — stručne podľa §0.
