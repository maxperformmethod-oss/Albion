# REPORT — Fáza 9, art direction

Zadanie: `docs/PROMPT_FINAL3.md`, v poradí z §7. Dátum: 14. 8. 2026.

---

## 1. Prázdne sekcie pri scrollovaní — opravené

### Čo to spôsobovalo

Zbehli sa tri veci naraz, presne ako si tipoval:

1. **Reveal trval 420 ms** a spúšťal sa až pri `rootMargin: -48px`. Pri
   normálnom scrollovaní bol nadpis už v strede obrazovky a obsah pod ním ešte
   len začínal nabiehať.
2. **Stagger sa počítal cez index v dávke observera** (`entries.forEach((entry, index))`),
   nie cez odhaľované prvky. V dávke sú aj prvky, ktoré práve **odchádzajú**
   z viewportu, takže pri rýchlom scrollovaní dostal posledný prvok v mriežke
   oneskorenie, ktoré s jeho pozíciou nesúviselo.
3. **Prvky viditeľné hneď po načítaní** čakali na prvý callback observera —
   teda na ďalší rámec, a ešte s prechodom.

### Čo je urobené

| # | Zmena |
|---|---|
| 1 | `rootMargin: '0px 0px -8% 0px'`, `threshold: 0` — prvok sa odhalí, keď sa objaví, nie keď je v strede |
| 2 | `--duration-reveal: 320 ms` (bolo 420 ms), stagger 40 ms zastropovaný na `Math.min(step, 6) * 40` → **max 240 ms na sekciu** |
| 3 | Čo je pri načítaní vo viewporte, sa odhalí **hneď a bez prechodu** (`is-instant` → `transition: none`) |
| 4 | **Poistka:** `setTimeout` 1200 ms po `load` odhalí všetko, čo ešte ostalo skryté |
| 5 | Overené rýchlym preskrolovaním dole aj hore — nižšie |

Stagger ide navyše cez vlastné počítadlo odhaľovaných prvkov, nie cez index
dávky, takže bod 2 sa nemôže vrátiť.

Zásada je zapísaná v `src/styles/global.css` aj v `BaseLayout.astro`:
**animácia nesmie byť podmienkou čitateľnosti.** Obsah je viditeľný, animácia ho
len uvádza. Preto sú tam tri nezávislé cesty, ako sa obsah odhalí, a poistka na
konci.

### Potvrdenie — rýchle preskrolovanie

Chrome headless cez CDP, produkčný build (`astro preview`), `scroll-behavior`
prepnuté na `auto`, aby scroll bol naozaj skokový, nie plynulý.

Test skočí po celej stránke dole a potom naspäť hore a na každej pozícii sa
spýta, či niektorý `[data-reveal]` prvok **vo viewporte** má `opacity < 0.9`.

| Beh | Viewport | Pozícií (dole + hore) | Prázdne miesta |
|---|---|---|---|
| Odstup 400 ms po skoku | 1440 × 900 | 18 | **0** |
| Odstup 60 ms po skoku (najhorší prípad) | 1440 × 900 | 18 | **0** |
| Odstup 400 ms po skoku | 390 × 844 | 20 | **0** |

Po prejdení stránky: **43 prvkov s `data-reveal`, 0 z nich skrytých.**

> **Potvrdzujem: pri rýchlom scrollovaní hore ani dole nikde nezostáva prázdne miesto.**

Aj pri odstupe 60 ms — teda skôr, než by animácia stihla dobehnúť — nebol vo
viewporte ani jeden nedokreslený prvok.

---

## 2. Paleta

Tokeny vymenené podľa §2. Namerané kontrasty (`WCAG 2.1`, sRGB, vlastný výpočet
na tokenoch — nie odčítanie zo screenshotu):

| Dvojica | Nameraný pomer | Zadanie |
|---|---|---|
| bone / ink-900 | **15,66** ✅ | 15.66 |
| bone-muted / ink-900 | **8,24** ✅ | 8.24 |
| gold / ink-900 | **7,89** ✅ | 7.89 |
| gold / ink-800 | **7,27** ✅ | 7.27 |
| ink-text / paper | **14,77** ✅ | 14.77 |
| ink-muted / paper | **5,57** ✅ | 5.57 |
| gold-ink / paper | **4,89** ✅ | 4.89 |
| border-int-dark / ink-800 | **3,13** ✅ | 3.13 |
| border-int-light / paper | **3,53** ✅ | 3.53 |
| ink-900 na zlatom tlačidle | **7,89** ✅ | 7.89 |
| gold / paper | **1,97** ❌ zakázané | 1.97 |
| border-int-dark / ink-900 | **3,39** ✅ | — |
| bone-muted / ink-800 | **7,60** ✅ | — |

Všetkých jedenásť hodnôt zo zadania sedí na stotinu. Doplnil som dve dvojice,
ktoré sa na stránke reálne vyskytujú a v tabuľke neboli.

Spolu s tokenmi sa museli prepísať aj tri veci, ktoré na staré hodnoty
ukazovali natvrdo: `theme-color` v `<head>`, obe vlasové linky (boli to `rgba`
odvodené zo starého `bone` a `ink-text`) a maska hero obrazu.

### H1 nad hero obrazom — premerané

Svetlejší `ink-900` zrazil kontrast H1 z **12,14:1 na 11,65:1**, teda pod cieľ.
Podľa §2 som **priplusoval krytie v maske**, nie zmenšoval text:

```
rgb(20 23 27 / 0.96) 0%    (bez zmeny)
rgb(20 23 27 / 0.92) 42%   (bolo 0.88)
rgb(20 23 27 / 0.66) 100%  (bolo 0.58)
```

Výsledok:

| Prvok | Farba | Najsvetlejší podklad pod ním | Pomer |
|---|---|---|---|
| H1 | bone `#F2EFE9` | `rgb(42, 43, 45)` | **12,35:1** ✅ |
| Lead, micro | bone-muted `#B4AFA6` | `rgb(42, 43, 45)` | **6,49:1** ✅ |
| Eyebrow | gold `#C3A87C` | `rgb(42, 43, 45)` | **6,22:1** ✅ |

Meranie je odteraz zopakovateľné: `node scripts/check-hero-contrast.mjs` zloží
obraz s oboma maskami presne tak, ako to robí prehliadač, nájde **najsvetlejší**
pixel v pásme, kde leží text, a spadne, ak kontrast klesne pod cieľ. Predtým to
bolo odčítané zo screenshotu a po každej zmene palety neplatné.

Zarážky masky sú na dvoch miestach (`Hero.astro`, `check-hero-contrast.mjs`) —
je to napísané v komentári na oboch.

---

## 3. Prechodové pásy

`src/components/ui/SectionBridge.astro`, výška `clamp(64px, 8vw, 120px)`,
statický, bez animácie, bez obsahu, `aria-hidden`.

Štyri miesta, kde sa podklad naozaj mení:

| Medzi | Smer |
|---|---|
| Hero (ink-900) → Čo prijímame (paper) | `down` |
| Čo prijímame (paper) → Individuálne ocenenie (ink-900) | `up` |
| Individuálne ocenenie (ink-900) → Ako to funguje (paper) | `down` |
| Ako to funguje (paper) → Prečo Albion (ink-800) | `up`, tmavý koniec `ink-800` |

Medzi Prečo Albion → Kde nás nájdete → Kontakt most nie je — sú to susedné
tmavé sekcie a pás by tam len rozbil rytmus.

Pridal som mostu prop `dark`, lebo posledný prechod končí v `ink-800`, nie
`ink-900`. Bez toho by na hrane sekcie vznikol druhý, jemnejší rez — presne
to, čo most odstraňuje. Teplé medzitóny `#4A4640` a `#A9A296` sú presne podľa
zadania; priamy prechod ink → paper by dal mŕtvy sivý pás.

---

## 4. Hustota

| # | Zmena |
|---|---|
| 1 | `--spacing-section`: `clamp(4.5rem, 9vw, 8.5rem)` → **`clamp(3.75rem, 7vw, 6.5rem)`** |
| 2 | „Čo u nás môžete založiť alebo predať": mriežka **4 stĺpce → 3**, položky ostávajú v `--text-h3` a teraz sa každá zmestí na jeden riadok |
| 3 | „Individuálne ocenenie": text drží ľavých **58 %**, pravých **42 %** zaberá obraz — prázdna pravá polovica zmizla |
| 4 | Odsadenia pred mriežkami a za poslednou položkou stiahnuté z `mt-14` na `mt-12` / `mt-10` |

K bodu 2: mriežka celú šírku kontajnera využívala aj predtým, problém boli
štyri úzke stĺpce, v ktorých sa názvy lámali na drobné riadky. Pri troch
stĺpcoch sa `Zberateľské a cennejšie predmety` láme na dva riadky, zvyšok na
jeden.

---

## 5. Obraz na celej stránke

Pravidlo, ktoré to celé drží: **tmavé sekcie = materiál, svetlé sekcie = jasnosť.**
Je zapísané v `README.md` aj v `scripts/build-images.mjs`, nech sa nestratí.

| Sekcia | Podklad | Obraz | Spracovanie |
|---|---|---|---|
| Hero | ink-900 | variant 0 | full-bleed + maska, bez zmeny |
| Individuálne ocenenie | ink-900 | variant 1 | pravý panel 42 %, `mask-image: linear-gradient(to left, black 40%, transparent)` |
| Prečo Albion | ink-800 | variant 2 | full-bleed, `opacity: 0.10`, `grayscale(0.4)` |
| Kontakt | ink-900 | variant 3 | spodná tretina, `mask-image: linear-gradient(to top, black, transparent)`, `opacity: 0.35` |
| Čo prijímame, Ako to funguje | paper | **žiadny** | zámerne |
| Kde nás nájdete | ink-900 | žiadny | inline SVG schéma |

`scripts/build-hero.mjs` je rozšírený na `scripts/build-images.mjs` — všetky
štyri zdroje idú cez ten istý `grade()`, líši sa len `brightness` podľa expozície
zdroja. Skript si sám stráži rozpočet aj tmavosť a pri prekročení spadne.
`npm run hero` → **`npm run images`**.

### Rozpočet

| Súbor | AVIF | Strop |
|---|---|---|
| `tex-panel-1100` | 9 kB | 45 kB |
| `tex-panel-700` | 5 kB | 28 kB |
| `tex-wide-1376` | 13 kB | 45 kB |
| `tex-wide-900` | 8 kB | 30 kB |
| `tex-contact-1376` | 10 kB | 45 kB |
| `tex-contact-900` | 7 kB | 30 kB |

Zdroje sú 1376 × 768, takže sa neškálujú nahor — strop „45 kB pri 1600 px"
platí s veľkou rezervou. Priemerná luminancia po gradingu je 0,055–0,063 pri
strope 0,12.

Všetky tri majú `loading="lazy"`, `decoding="async"`, `alt=""` a
`aria-hidden="true"`. **`fetchpriority="high"` má len hero** — je to LCP prvok.
Je to napísané aj v komentári v `SectionTexture.astro`, aby to niekto omylom
nepridal.

Panel v sekcii Individuálne ocenenie sa pod `1024 px` nevykresľuje vôbec
(`display: none` + `sizes="… 0px"`) — na mobile sa naozaj nesťahuje, potvrdené
v meraní nižšie.

---

## 6. Čísla

Produkčný build, `astro preview`, Chrome headless, studená cache, bez throttlingu.
Váha je **po prejdení celej stránky**, teda vrátane všetkých lazy textúr.

| Metrika | Desktop 1440×900 | Mobil 390×844 | Strop |
|---|---|---|---|
| **Celková váha stránky** | **282 kB** | **261 kB** | 450 kB ✅ |
| Requesty | 10 | 9 | — |
| **JS gzip** | **1,95 kB** | 1,95 kB | 20 kB ✅ |
| HTML | 66,5 kB raw · 15,4 kB gzip · **13,2 kB brotli** | — | — |
| Inline SVG mapy | 8,76 kB raw · 1,43 kB gzip | — | — |
| Third-party | 0 | 0 | 0 ✅ |
| Cookies | 0 | 0 | 0 ✅ |
| LCP (lokálne, bez throttlingu) | 176–472 ms | 176–368 ms | — |

Z 282 kB sú **221 kB fonty** (štyri woff2). Obraz je 43 kB desktop / 23 kB mobil.
Ak by sa niekedy tlačilo na váhu, začínalo by sa pri fontoch, nie pri obrazoch.

JS narástol z 1,72 na 1,95 kB — 0,23 kB za poistky v reveale a za animáciu mapy.

### LCP na produkcii — **nezmerané, chýba prístup**

Vercel účet napojený na tento nástroj nemá ani jeden projekt, v repe nie je
`.vercel/` a nikde nie je zapísaná produkčná URL. **Nemám čo premerať a odhad
sem nepíšem.**

Aby to bolo na jeden krok, pridal som opravu z `docs/FIX_VERCEL.md`:
`vercel.json` v koreni (framework `astro`, `npm ci`, `dist`) a `engines.node`
priklincované na `22.x`. Postup po nasadení je v `docs/REPORT_faza6_audit.md`,
oddiel „Produkcia".

**Potrebujem od teba produkčnú URL** (alebo prístup k tomu Vercel projektu).
Potom dobehne meranie LCP, `PUBLIC_SITE_URL` aj kontrola canonical a sitemap.

---

## 7. Čo ešte v tejto dávke pribudlo

- Dokončený `docs/PROMPT_FINAL2.md` — copy, inline SVG schéma mapy a systémová
  oprava WCAG 2.5.3 v `Button.astro`. Detaily v `docs/REPORT_faza8_mapa.md`.
- `docs/OTAZKY.md` bod 3 rozšírený o otázku na orientáciu stanice voči
  prevádzke — bez nej sa schéma nedá spresniť bez vymýšľania.
- Dva nové testy v `tests/content.test.mjs`.

## 8. Stav

| Kritérium | Stav |
|---|---|
| Pri rýchlom scrollovaní nikde prázdne miesto | ✅ overené, 3 behy, 0 nálezov |
| Kontrasty podľa §2 | ✅ všetkých 11 sedí |
| H1 nad obrazom ≥ 12:1 | ✅ 12,35:1 po priplusovaní krytia |
| Váha stránky < 450 kB | ✅ 282 kB |
| JS < 20 kB gzip | ✅ 1,95 kB |
| 0 third-party, 0 cookies | ✅ |
| `astro check` | ✅ 0 chýb |
| `npm test` | ✅ 23/23 |
| Produkčný build s gate bez `--allow` | ✅ |
| LCP na produkcii | ⛔ **blokované — chýba produkčná URL** |
