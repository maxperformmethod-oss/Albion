# REPORT — Fáza 24

Zadanie: `docs/PROMPT_FINAL18.md`, poradie §7 vrátane §4b. Dátum: 15. 8. 2026.

---

## Počet slov — **narástol o 105**, teda nad tvoj strop 60

| | Slov na homepage (SK, bez SVG mapy) |
|---|---|
| Pred | **513** |
| Po | **618** |
| Rozdiel | **+105** |

Rozpis, aby bolo vidieť, kde to je:

| Pridané | Slov |
|---|---|
| 7 podriadkov v mriežke (§2) | ~45 |
| Blok „Založiť alebo predať?" (§3) | ~40 |
| Blok „Predaj" (§4b) | ~20 |

**Nič sa nevymklo — je to súčet toho, čo zadanie žiadalo.** Strop „pod 60
slov" v §3 platil pre ten jeden blok a ten ho drží (40). Podriadky a §4b
prišli navyše a v strope neboli. Nič som nepridal nad rámec zadania a nič
neopakuje to, čo už na stránke bolo.

Ak chceš späť pod +60, najlacnejšie je skrátiť podriadky na 3–4 slová
(napr. `Zlomkové zlato, poškodené šperky, retiazky.`) — ušetrí to ~20 slov
a konkrétnosť zostane.

---

## §2 Podriadky položiek

Každá položka má pod názvom jeden riadok konkrétnych vecí, `--text-small`,
`--color-ink-muted`, `line-height: 1.5`, medzera 6 px. Pri hoveri sa nemení —
reaguje len linka, číslo a názov, ako doteraz.

Položka **08 podriadok nemá**: konkrétny zoznam pod „iné veci s hodnotou" by
protirečil vete, že zoznam nie je uzavretý.

Štruktúra `items` sa zmenila z poľa reťazcov na `{ title, detail? }` — typ
`Item` je v `content.sk.ts` a `astro check` ho vynucuje vo všetkých troch
jazykoch.

---

## §3 Blok „Založiť alebo predať?"

Nový `PawnOrSell.astro` medzi mriežkou služieb a sekciou „Zvláštna vec ešte
neznamená problém". Tmavý `ink-800`, bez obrázka, dva stĺpce so zvislou
zlatou vlasovou linkou pri 28 %; pod 768 px pod sebou a linka vodorovne.

Veta `Za výkup zvyčajne dostanete viac než pri zálohe.` je **za
`FEATURES.hooks`** — overené, že v produkčnom HTML nie je. Bez nej blok
funguje rovnako.

---

## §4b Blok „Predaj"

Nový `Selling.astro` hneď za ním, na svetlom podklade. Je **vizuálne
najtichší na stránke**: nadpis v `--text-h3` (nie `h2`), jeden riadok textu,
CTA ako textový odkaz na `tel:`, nie na kotvu.

Žiadny katalóg, žiadne fotky tovaru, žiadne ceny — `FEATURES.showcaseEnabled`
zostáva `false`.

„Bez marže klenotníctva" je vecný dôvod, nie superlatív — presne ten rozdiel,
o ktorý v §4b išlo.

---

## §6 Preklady

Podriadky aj oba bloky sú v HU a EN. Odborné výrazy podľa tabuľky:
`tört arany` / `scrap gold`, `zálog` / `pawn loan`, `felvásárlás` /
`outright purchase`, `akkus szerszám` / `cordless tools`.

Overené vo výstupe: HU aj EN verzia obsahuje podriadky aj oba nové bloky.

---

## §4 + §4b Otázky

Do `docs/OTAZKY.md` pribudli tri: vyššia suma za výkup · investičné zlato ·
či sa predáva pravidelne alebo len občas. Plus poznámka, že nové reťazce idú
do korektúry rodeným hovorcom.

---

## §5 SEO

Meta description nezmenená. Výrazy `zlomkové zlato`, `poškodené šperky`,
`aku náradie` sú v texte prirodzene, nikde sa neopakujú v nadpisoch.

---

## Overené

`astro check` 0 chýb · `npm test` 23/23 · build 10 stránok · rýchly scroll
bez prázdnych miest · háčik za flagom naozaj nie je vo výstupe.

Opravil som aj poškodený komentár v `PaperGold.astro`, ktorý zostal po
predchádzajúcej dávke.
