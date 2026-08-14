# REPORT — Fáza 8, mapa a copy

Zadanie: `docs/PROMPT_FINAL2.md`. Dátum: 14. 8. 2026.

---

## 1. Copy

| Miesto | Bolo | Je |
|---|---|---|
| Hero lead | `… autá aj netypické veci.` | `… autá aj atypické veci.` |
| Prečo Albion, bod 3 | `Berieme aj netypické veci` | `Berieme aj atypické veci` |
| Kontakt H2 | `Ozvite sa` | `Poďme sa o tom porozprávať.` |
| Kontakt lead | `Najrýchlejšie to vyriešime telefonicky alebo osobne.` | `Zavolajte alebo jednoducho prídite. Pozrieme sa na vec, povieme vám sumu a rozhodnete sa vy. Opýtať sa nič nestojí.` |

Všetko v `src/data/content.ts`, v šablónach nepribudol žiadny reťazec natvrdo.

---

## 2. Mapa — `src/components/sections/LocationMap.astro`

Vlastná orientačná schéma ako inline SVG, `viewBox="0 0 1200 700"`. Žiadny embed,
žiadny screenshot, žiadny third-party request. Sekcia `Location.astro` je nahradená.

### Veľkosť

| Vec | Hodnota |
|---|---|
| Inline SVG | **8,76 kB** raw · **1,43 kB** gzip |
| JS gzip (celá stránka, všetky inline skripty) | **1,95 kB** (bolo 1,72 kB) |
| Nové requesty | **0** — SVG je inline, animáciu spúšťa existujúci vzor s `IntersectionObserver` |

Prírastok JS je 0,23 kB: pozorovanie obalu, odčítanie dĺžky cesty a jedna trieda.

### Kontrast popisov

Merané na tokenoch, nie na screenshote. Podklad popisov nie je čistý `ink-800` —
leží na ňom mriežka ulíc `rgba(242,239,233,0.07)`, ktorá ho zosvetlí na
`rgb(42, 46, 49)`. Meria sa teda voči nej, nie voči holému tokenu.

| Popis | Farba | Podklad | Pomer |
|---|---|---|---|
| `Kpt. Nálepku`, `Orientačná schéma` | bone-muted `#B4AFA6` | ink-800 + mriežka | **6,30:1** ✅ |
| `Železničná stanica` | bone-muted `#B4AFA6` | ink-900 (budova) | **8,24:1** ✅ |
| `Albion` | bone `#F2EFE9` | ink-800 + mriežka | **11,99:1** ✅ |

Najsvetlejšie miesto v schéme je samotná ulica (`rgba(242,239,233,0.18)`, teda
`4,46:1` voči bone-muted). **Žiadny popis na nej neleží** — `Kpt. Nálepku` má
základňu 30 px nad jej hornou hranou. Keby sa popis niekedy posúval, toto je
hranica, na ktorú si treba dať pozor.

### Animácia

1. Trasa sa **nakreslí** — `stroke-dashoffset` z dĺžky cesty na 0, `1100 ms`,
   `--ease-out-quint`.
2. Bod Albion: `opacity 0→1` + `scale(0.85→1)`, `300 ms`, delay `900 ms`.
3. Prstenec: jednorazovo `scale(1→1.35)` + `opacity 0.6→0`, `700 ms`, delay
   `1150 ms`. **Jeden raz, nie slučka.**
4. Spúšťa `IntersectionObserver`, `threshold: 0.35`, raz, na **obale figúry** —
   nie na ceste. Prvok s nulovou plochou observer neohlási, a `<path>` bez
   výplne je presne taký.

Dve veci, ktoré si zaslúžia poznámku:

- **Dashovanú linku sa nedá nakresliť cez `stroke-dashoffset`** — ten je už
  obsadený samotným vzorom čiarok (`8 10`). Kreslí sa preto cez `<mask>`,
  v ktorej je tá istá cesta plnou bielou a offsetuje sa maska.
- **Presnú dĺžku cesty (427 px) dopočíta skript** cez `getTotalLength()`.
  Kým to neurobí, CSS drží zámerne nadsadených `1200` — trasa tak nepreblikne.
  Počiatočný stav visí na triede `js`, takže bez JS je schéma rovno v koncovom
  stave, nie prázdna.

`prefers-reduced-motion: reduce` — nekreslí sa nič, všetko je hneď hotové.

### Prístupnosť

- `<svg role="img" aria-labelledby="mapTitle mapDesc">` s `<title>` a `<desc>`.
- Popisy sú `<text>`, nie obrysy — sú v DOM a dajú sa vyhľadať.
- Adresa je pod schémou aj ako text. **Schéma nie je jediným nositeľom údaja.**
- `<desc>` si adresu skladá z `business.ts` cez `{street}`, takže sa nemôže
  rozísť s tým, čo je vidieť. Stráži to `tests/content.test.mjs`.

### Geometria — čo tam zámerne nie je

Schéma stojí len na dvoch istotách: adresa `Kpt. Nálepku 41` a blízkosť
železničnej stanice. **Žiadna svetová strana, mierka, počet minút ani metrov.**
`Pár krokov` je pravdivé, `2 minúty pešo` by bol výmysel. Nový test
`schéma neuvádza vzdialenosť ani čas, ktoré nevieme` to drží.

Otázka na presné súradnice **a na to, ktorým smerom je stanica od prevádzky**,
je v `docs/OTAZKY.md`, bod 3.

---

## 3. Doména a LCP na produkcii — **neurobené, chýba prístup**

Vercel účet napojený na tento nástroj nemá ani jeden projekt, v repe nie je
`.vercel/` a nikde nie je zapísaná produkčná URL. `PUBLIC_SITE_URL` sa teda
nedá nastaviť a LCP na produkcii sa nedá premerať.

Čo som namiesto toho urobil, aby to bolo na jeden krok:

- `vercel.json` v koreni (framework `astro`, `npm ci`, `dist`) — oprava z
  `docs/FIX_VERCEL.md`,
- `engines.node` priklincované na `22.x`.

Podrobne aj s postupom je to v `docs/REPORT_faza6_audit.md`, oddiel „Produkcia".

**Potrebujem od teba produkčnú URL** (alebo prístup k tomu Vercel projektu).

---

## 4. WCAG 2.5.3 — systémová oprava, nie tretia záplata

Poznámka z `PROMPT_FINAL2.md` §5 sedela. `aria-label` sa skladal na troch
miestach použitia, zakaždým trochu inak, a nič nekontrolovalo, či obsahuje
viditeľný text.

Teraz si prístupný názov skladá **`Button.astro` sám** zo svojho vlastného
viditeľného textu (`Astro.slots.render`) a z čísla, ktoré dostane cez `phone`.
Miesto použitia už nemá ako pokaziť. Navyše je v ňom dev-only poistka: keď
niekto odovzdá vlastný `label`, ktorý neobsahuje viditeľný text, build to
vypíše do konzoly.

Výsledok vo výstupnom HTML:

- `Zavolať — číslo 047 433 44 44`
- `Zavolať a opýtať sa — číslo 047 433 44 44`
- `Zavolať na číslo +421 47 433 44 44` (odkazy, kde je viditeľné samotné číslo)

Každý z nich obsahuje presne ten text, ktorý je vidieť.
