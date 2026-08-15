# REPORT — Fáza 18

Zadanie: `docs/PROMPT_FINAL12.md` (poradie §7) + dobehnutá **dávka 8**
(= `PROMPT_FINAL5.md` okrem mapy). Dátum: 15. 8. 2026.

---

## §1 Mapa commitnutá

Commit `5309383`. Poznatok, ktorý si vypýtal do reportu:

> **Lazy obrázok za animáciou sa nemusí stiahnuť vôbec.** Prehliadač lazy
> obrázok mimo viewportu nesťahuje a s `opacity: 0` nemá dôvod ani potom —
> mapa by ostala bez podkladu a nikto by si to nevšimol, kým by sa niekto
> nepozrel na produkciu. **Pravidlo: každý lazy prvok, ktorý je súčasťou
> animácie, musí ten istý observer aj uvoľniť** (`img.loading = 'eager'`).

---

## §3 Prechody zrušené

`SectionBridge.astro` je zmazaný aj s CSS a šumom. Namiesto neho ostrá hrana
a na predele **1px vlasová linka `--color-gold` pri 0,28** cez celú šírku —
kreslí ju `Section.astro`, animuje sa zľava doprava ako predtým.

Zlatý oddeľovač sa tým presunul z vnútra kontajnera na hornú hranu sekcie,
takže je full-bleed a zároveň ubudlo 3,5 rem odsadenia navrchu každej sekcie.
`WhatWeAccept` linku nekreslí — predel tam už nesie spodná linka pásu pod hero.

---

## §2 Poloha bodu presunutá

Bod je na budove oproti autobusovej stanici, **67 m** od potvrdenej značky,
na hrane pôdorysu privrátenej k ceste. Trasa sa prepočítala na 241 m.

Poistky z dávky 17 som **nezmazal, len parametrizoval**, s komentárom, že ide
o override na výslovný pokyn:

| Poistka | Bolo | Je |
|---|---|---|
| `MAX_MARKER_SHIFT_M` | 40 | **120** |
| `ALLOW_ROOF_ANCHOR` | `false` | **`true`** |

`business.geo` v JSON-LD nemenené — strojová poloha sedí s Google profilom,
vizuálna značka s realitou. Otázka na súradnicu vchodu ostáva otvorená.

---

## Dávka 8 (= `PROMPT_FINAL5.md`)

**§5 texty** — sedem znení vymenených: hero mikrotext, záver zoznamu, celá
sekcia „Individuálne ocenenie", krok 3, lead v Kontakte. Body 1 a 2 v „Prečo
Albion" som nechal podľa dávky 7, ako si písal.

**§2 paleta** — vymenená celá. Všetkých 12 kontrastov zo zadania sedí na
stotinu (bone/ink-900 14,86 · gold/ink-900 8,07 · ink-text/paper 14,91 ·
gold/paper 1,83 ❌ naďalej zakázané). Prepísať sa museli aj `theme-color`,
obe vlasové linky, maska hero a paleta v generátore mapy.

**H1 nad hero** klesol na 11,94:1, takže som podľa pravidla priplusoval krytie
masky (0,93→0,94 a 0,70→0,73) → **12,31:1**.

**§3 svetlé sekcie** — papierové zrno (`feTurbulence`, 0,028, `multiply`),
teplá vinetáž zľava hore, číslovanie `01`–`08` v `gold-ink`, veľké serifové
čísla krokov za textom pri `opacity 0.12`, vlasové linky prehodené na teplý
odtieň zlata `rgba(122,100,56,.18)`.

**§4 zlatý obraz** — z dvoch variantov som vybral **A**: svetlo v ňom plynie
mäkšie a nevzniká ostrý pruh, ktorý má variant B na pravej strane. Ide do
„Individuálne ocenenie", grading `brightness 0.78`, `saturation 0.9`.
7 kB AVIF pri 1100 px.

---

## §4 Zlato na svetlých plochách

Druhý variant (B) ako veľmi tlmená vrstva v pravom hornom rohu: 55 % šírky,
`contain`, `opacity 0.07`, `multiply`, maska bez viditeľnej hrany. Len na
dvoch sekciách, na právnych stránkach nie. **4 kB AVIF** (limit 20), `lazy`.

**Povinné meranie — na skutočných pixeloch, mimo textu a liniek:**

| Sekcia | Najtmavšia plocha | Kontrast `ink-text` |
|---|---|---|
| Čo u nás môžete založiť alebo predať | `rgb(226, 221, 212)` | **12,64:1** |
| Ako to funguje | `rgb(227, 222, 214)` | **12,77:1** |

Obe nad hranicou 12:1, takže krytie ostáva na 0,07.

---

## §6 Mobilné pravidlá

| # | Stav |
|---|---|
| 1 animovať len `transform`/`opacity` | ✅ okrem `stroke-dashoffset` pri kreslení ciest — pozri nižšie |
| 2 žiadny `blur` na animovanom prvku | ✅ tiene mapy sa fadeujú len od 768 px, na mobile sú rovno na mieste |
| 3 `-webkit-mask-image` všade | ✅ 4 miesta |
| 4 `background-attachment: fixed` | ✅ nepoužité |
| 5 výška hero | ⚠ ostáva `100svh` — odôvodnenie nižšie |
| 6 `will-change` | ✅ jediný výskyt zmizol so `SectionBridge` |
| 7 scroll/touch listenery `passive` | ✅ |
| 8 pod 768 px polovičný stagger, menej prvkov naraz | ✅ reveal 40→20 ms, strop 6→4; mapa stagger 8→4 ms |
| 9 animácia mapy na mobile 1,4 s | ✅ |

**Dve odchýlky, obe vedomé:**

1. `stroke-dashoffset` pri kreslení ciest a trasy nie je `transform` ani
   `opacity`. Je to však vykresľovanie SVG cesty, nie prepočet rozloženia,
   a bez neho by z §4 dávky 11 nezostalo nič. Na mobile je celá sekvencia
   kratšia, čím sa expozícia znižuje.
2. **Hero ostáva na `100svh`, nie `100dvh`.** Cieľ pravidla — aby iOS obsah
   neorezal — `svh` spĺňa, lebo počíta s **viditeľnou** lištou. `dvh` sa
   naopak počas scrollovania mení, ako sa lišta skrýva, takže by hero pri
   každom scrolle menil výšku a obsah by poskakoval. To je horšia chyba než
   tá, ktorú pravidlo rieši.

---

## §5 Jazyky — SK · HU · EN naživo

- Astro i18n: `sk` bez prefixu, `hu` na `/hu/`, `en` na `/en/`.
- Texty rozdelené na `content.sk.ts` / `content.hu.ts` / `content.en.ts`,
  typ je odvodený zo slovenčiny cez `Widen<>`, takže **chýbajúci kľúč
  v preklade neprejde cez `astro check`**.
- `business.ts` zostal jeden — adresa, telefón a IČO sa neprekladajú.
- Prepínač `SK · HU · EN` v hlavičke pred tlačidlom Zavolať, na mobile
  v menu **v jednom riadku s bodkami**. Žiadne vlajky.
- Prepnutie vedie na **tú istú stránku** v druhom jazyku (`ROUTES` v `i18n.ts`).
- `hreflang` × 4 vrátane `x-default` → SK. Overené vo výstupe.
- Právne stránky v troch jazykoch: `/hu/adatvedelem`,
  `/hu/felhasznalasi-feltetelek`, `/en/privacy-policy`, `/en/terms-of-use`.
- JSON-LD len na SK — tri kópie tej istej entity by boli šum.
- Mapa sa generuje **pre každý jazyk zvlášť** (popisy sú `<text>` v SVG),
  do HTML ide vždy len jedna.

Sitemap má 9 URL, build 10 stránok.

⚠ **Maďarčinu ani angličtinu nepísal rodený hovorca.** Pred spustením ich má
prečítať niekto, kto po maďarsky hovorí od detstva — najmä odkaz majiteľov.
Je to v `docs/OTAZKY.md`.

---

## Overené

`astro check` 0 chýb · `npm test` 23/23 · build 10 stránok, gate bez `--allow`
· rýchly scroll SK aj HU, desktop aj mobil, nikde prázdne miesto ·
12 requestov, 0 third-party, 0 cookies, **304 kB** (limit 400).

## Otvorené

Súradnica vchodu · korektúra HU a EN rodeným hovorcom · e-mail · fotky ·
doklady · právna kontrola · podsetovanie Interu kvôli LCP.
