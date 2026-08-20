# REPORT — fáza 30 (dávka 24)

Zadanie: `docs/PROMPT_FINAL24.md`, §1 a §2. §3 si výslovne uzavrel, §4 je push,
§5 je zoznam vecí mimo kódu.

Týmto pushom idú von **dávky 22, 23 aj 24** naraz.

---

## §1 — E-mail preč

### Kód

| Súbor | Čo sa stalo |
|---|---|
| `src/data/business.ts` | pole `email` aj jeho typ **zmazané**, nie `TO_CONFIRM`. Na jeho mieste je komentár, prečo tam nie je. |
| `src/data/business.ts` | `OPTIONAL_FIELDS` už neobsahuje `business.email` — zostalo len `business.requiredDocuments` |
| `src/components/sections/Contact.astro` | celá podmienená položka `E-mail` aj premenná preč |
| `src/components/layout/Footer.astro` | `mailto:` odkaz aj premenná preč |
| `src/layouts/LegalLayout.astro` | zástupný znak `{email}` vypadol z tabuľky hodnôt |
| `src/lib/schema.ts` | `email` z JSON-LD preč, na jeho mieste komentár |
| `content.sk/hu/en.ts` | štítok `E-mail` v sekcii Kontakt preč vo všetkých troch jazykoch |

Odstránil som aj **vetvy, ktoré ho podmienene vykresľovali** — nie sú zakomentované,
sú preč. Tým prestal existovať stav „e-mail je, ale nie je potvrdený“, na ktorý
by sa dalo omylom vrátiť.

### Zásady ochrany osobných údajov

Sekcia „Kontakt na uplatnenie práv“ predtým vypisovala `{phone}` a `{email}` ako
dva holé riadky. Teraz je to veta s telefónom a adresou. Overené na hotovom
builde, že sa oba údaje naozaj doplnili:

| | znenie na stránke |
|---|---|
| SK | Práva si môžete uplatniť telefonicky na čísle +421 47 433 44 44 alebo osobne na adrese Kpt. Nálepku 41, 984 01 Lučenec. |
| HU | Jogait telefonon a +421 47 433 44 44 számon vagy személyesen a Kpt. Nálepku 41, 984 01 Lučenec címen érvényesítheti. |
| EN | You can exercise your rights by phone on +421 47 433 44 44 or in person at Kpt. Nálepku 41, 984 01 Lučenec. |

Veta „ak bude e-mail, doplní sa sem“ nikde nebola — to riešila mechanika
zástupných znakov v `LegalLayout.astro`, ktorá riadok s nepotvrdeným údajom
proste nevykreslila. Tá vetva je teraz preč aj s komentárom, ktorý e-mail
uvádzal ako príklad.

### Dokumenty

- `docs/OTAZKY.md` — riadok **E-mail** z tabuľky „ZOSTÁVA“ zmazaný, tabuľka
  prečíslovaná (bola 1, 3, 4, 5).
- `docs/LAUNCH_CHECKLIST.md` §B — bod **B4 zmazaný**.
- `docs/LAUNCH_CHECKLIST.md` §D — pribudol **D8: Do Google profilu nedopĺňať
  e-mail.**
- `docs/FIRMA_UDAJE.md` — riadok 9 preškrtnutý a označený ako neaktuálny.

### Čo v `src/` zostalo a prečo

Grep na `email`, `e-mail`, `mail`, `mailto` cez celé `src/` vracia **dva zásahy,
oba sú komentáre**:

| Miesto | Text | Prečo zostáva |
|---|---|---|
| `src/lib/schema.ts:90` | `// email tu zámerne nie je — firma e-mail neponúka` | Bez tejto vety by niekto pri ďalšom rozširovaní JSON-LD `email` doplnil ako chýbajúci údaj. Do vygenerovaného HTML sa komentár nedostane. |
| `src/data/content.sk.ts:359` | `{email} neexistuje — firma e-mail neponúka` | To isté pri zástupných znakoch v právnych textoch. |

Plus komentár v `business.ts` na mieste, kde pole bývalo. **Vo výstupe v `dist/`
nie je e-mail nikde** — ani ako adresa, ani ako `mailto:`, overené nižšie.

Mimo `src/` zostávajú tri zmienky a všetky sú o niečom inom:

- `OTAZKY.md` a `LAUNCH_CHECKLIST.md` §C — *„poslať e-mailom alebo cez Disk“*.
  To je kanál, ktorým **majiteľ posiela fotky nám**, nie kontakt na webe.
- `LAUNCH_CHECKLIST.md` §D7 — *„kontaktný e-mail“* katalógov typu `azet.sk`,
  kam sa posiela žiadosť o opravu kategórie. Cudzí e-mail, nie náš.

---

## §2 — Hero zarovnaný na mriežku stránky

Mal si pravdu, že obe polohy, ktoré som skúšal, boli vedľa — riešili vodorovnú
polohu bloku a problém bol inde.

Textový stĺpec je teraz **bežný `container-page` na každej šírke**. Nepoužil som
vlastnú triedu, ktorá by ho napodobňovala: keby sa raz zmenilo odsadenie
kontajnera, hero by ticho odbehlo. Takto sa to stať nemôže.

Zmizlo tým aj centrovanie a všetko, čo k nemu patrilo.

### Namerané — jedna zvislá línia

Ľavá hrana v pixeloch od okraja okna:

| šírka okna | logo | H1 | lead | nadpisy sekcií | pätka |
|---|---|---|---|---|---|
| 1024 px | 32 | **32** | 32 | 32 | 32 |
| 1280 px | 65 | **65** | 65 | 65 | 65 |
| 1440 px | 145 | **145** | 145 | 145 | 145 |
| 1900 px | 375 | **375** | 375 | 375 | 375 |

Šírka textového bloku je 520 px podľa zadania, voľné miesto vpravo od neho
zostáva prázdne.

### Jedna vec, ktorá sa pritom ukázala

Pri **presne 1024 px** sa text zabiehal **27 px pod fotku**. Blok široký 520 px
plus odsadenie kontajnera je vtedy širší než ľavý panel — na širších oknách sa
to neprejaví, lebo panel rastie rýchlejšie než odsadenie.

Strop je preto `min(32.5rem, calc(52vw - 6rem))`. Druhý člen sa uplatní len tesne
nad breakpointom; `52vw` je hrana panela a `6rem` je rezerva, ktorá pokryje aj
to, že `vw` počíta so scrollbarom, kým percentuálna šírka fotky nie.

| šírka okna | šírka textu | rezerva k fotke |
|---|---|---|
| 1024 px | 436 px | 56 px |
| 1100 px | 476 px | 56 px |
| 1280 px | 520 px | 73 px |
| 1440 px | 520 px | 77 px |
| 1900 px | 520 px | 86 px |

Nikde sa neprekrývajú. Pod 1024 px sa nemení nič — tam je text na plnú šírku.

---

## §4 — Kontroly pred pushom

| Kontrola | Výsledok |
|---|---|
| `npm run build` **bez `--allow`** | prešiel, „žiadny placeholder v HTML“ |
| `astro check` | **0 errors**, 0 warnings, 2 hints (obe sú nepoužité konštanty v `build-map.mjs`, staré) |
| `npm test` | **23 / 23** |
| `TO_CONFIRM` v `dist/` | **žiadny** |
| E-mailová adresa v `dist/` | **žiadna** — regex `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}` nevracia nič |
| `mailto:` v `dist/` | **žiadny** |

K bodu „nikde v `dist` nie je `@`“: doslovne to splniť nejde, `@` je v CSS
syntaxi. Prešiel som teda všetky výskyty a **každý jeden je at-pravidlo alebo
kľúč JSON-LD**:

```
306 @property   132 @media   30 @layer   24 @supports
 24 @font-face   18 @type     9 @keyframes  3 @context
```

Žiadny z nich nie je adresa.

### Rýchly prechod SK, HU, EN

Prešiel som šesť stránok programovo — hľadal som prázdne nadpisy, odseky,
položky zoznamov a definičných zoznamov, teda presne tie diery, ktoré po
odstránení podmieneného obsahu zostávajú:

| stránka | stav | prázdne prvky | e-mail | `TO_CONFIRM` | položky mriežky |
|---|---|---|---|---|---|
| `/` | 200 | 0 | nie | nie | 8 |
| `/hu` | 200 | 0 | nie | nie | 8 |
| `/en` | 200 | 0 | nie | nie | 8 |
| `/ochrana-osobnych-udajov` | 200 | 0 | nie | nie | — |
| `/hu/adatvedelem` | 200 | 0 | nie | nie | — |
| `/en/privacy-policy` | 200 | 0 | nie | nie | — |

Sekcia Kontakt má po odstránení e-mailu tri položky — `Telefón`, `Adresa`,
`Otváracie hodiny` — a v pätičke zostal jediný odkaz, telefónne číslo.

### Váha stránky

| | desktop 1440 px | mobil 390 px |
|---|---|---|
| **spolu** | **342,8 kB** | **323,0 kB** |

Strop 400 kB. Oproti fáze 29 sa nezmenilo nič — odstránenie e-mailu je pár
bajtov v HTML.

---

## §3 — Mapa

Neriešil som ďalej, ako si napísal. Nález so `stroke-dasharray` aj prekryv fáz
sú popísané v dodatku k `docs/REPORT_faza29.md`. Meranie fps z telefónu ostáva
ako bod **E3** v `LAUNCH_CHECKLIST.md`.

---

## Čo ide v tomto pushi

Tri dávky naraz:

- **22** — tri makro zábery zlata do pozadia troch tmavých sekcií, mobilná
  kompatibilita, nový `check-section-contrast.mjs` (`docs/REPORT_faza28.md`)
- **23** — dávka 21 dokončená (autá preč, zlato dopredu), hero na dva panely,
  poriadok v priečinku a `albion.code-workspace` (`docs/REPORT_faza29.md`)
- **24** — e-mail preč, hero zarovnaný na mriežku (tento report)

## Čo zostáva pred spustením

Všetko mimo kódu, presne ako v §5 zadania a v `LAUNCH_CHECKLIST.md`:

1. Doména (A1–A3)
2. Zmazať duplicitný Vercel projekt (A4)
3. Právne texty právnikovi (A5)
4. HU a EN rodenému hovorcovi (A6)
5. Google profil (D1–**D8**, vrátane nového bodu o e-maile)
6. Fotky od majiteľov (C) — vrátane originálu fotky vchodu, ktorá je dnes
   snímka obrazovky

A dve veci, ktoré čakajú na tvoje slovo:

- **Nepoužité textúry `tex-gold-*` a `tex-panel-*`** ležia v repe a nesťahujú
  sa. Jeden commit a sú preč.
- **Starý priečinok `C:\Users\Maxim\OneDrive\Počítač\Albion`** — preverený,
  nie je v ňom nič, čo by v repe nebolo, a `.git` v ňom nie je vôbec.
