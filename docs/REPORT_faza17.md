# REPORT — Fáza 17, mapa na plnú úroveň

Zadanie: `docs/PROMPT_FINAL11.md`, poradie §6. Dátum: 15. 8. 2026.
**Náhľad: `docs/mapa-3d-nahlad.png`** (plné rozlíšenie, priamo zo stránky).

---

## §1 Poloha — heuristika zlyhala, bod som neposunul

Pravidlo z §1.2 som naprogramoval celé: nájsť cestu popri autobusovej stanici,
v jej geometrii úsek s dvoma až tromi po sebe idúcimi lomami o 75–105°, a bod
položiť na fasádu budovy oproti.

**Našlo to jeden jednoznačný úsek — a výsledok bol horší než súčasný stav.**

| | |
|---|---|
| Budova pod nájdeným bodom | `building=roof`, `layer=1`, **294 m²** |
| Budova pod potvrdenými súradnicami | `building=yes`, **88 m²** |
| Posun | **90 m** od potvrdených súradníc |
| Vzdialenosť od železničnej stanice | 172 m (predtým 133 m) |

`building=roof` je **prístrešok nad nástupišťom**, nie dom. Prevádzka v ňom
nesídli. Posun by navyše odsunul Albion od železničnej stanice, hoci celý web
tvrdí „pár krokov od stanice“.

Podľa §1.2 bodu 5 som teda **nič neposunul**. Bod stojí tam, kam ho dalo
pravidlo z dávky 10. Pridal som k tomu dve poistky, aby sa to nemohlo stať
potichu:

1. `building=roof` sa na kotvu prevádzky nikdy nepoužije — prístrešok nie je dom.
2. Heuristikou posunutá značka nesmie skončiť ďalej než **40 m** od potvrdených
   súradníc. Google značka je ťažisko parcely; na mestskom pozemku nemôžu byť
   dvere ďalej. Skript to vypíše a vráti sa k predchádzajúcemu pravidlu.

Otázka na **súradnicu vchodu** je v `docs/OTAZKY.md` ako prvá položka. Keď
príde, všetky heuristiky idú preč.

`business.geo` v JSON-LD som nemenil.

---

## §2 Dve vrstvy

| Vrstva | Čo obsahuje | Veľkosť | Limit |
|---|---|---|---|
| **A** — zapečený obraz | podklad, koľajisko, zeleň, spevnené plochy, 124 vzdialených budov s tieňmi, atmosférický úbytok, vinetáž, zrno | **8,1 kB** AVIF @1600 · **4,0 kB** @760 | 60 / 30 kB |
| **B** — inline SVG | cesty, 39 budov v strede, obe stanice, Albion, trasa, popisy, mierka, severka | **33,5 kB** | 35 kB |

Obe počítajú cez `scripts/map-projection.mjs`, takže sedia na pixel. Vrstva A
sa rasterizuje cez `sharp` (librsvg), takže si môže dovoliť rozostrené tiene
a filtre, ktoré by v inline SVG stáli násobne viac.

Vrstva A vyšla desaťkrát pod rozpočtom — je to tmavý obraz s mäkkými
prechodmi, presne to, čo AVIF komprimuje najlepšie.

---

## §3 Čo sa zmenilo vizuálne

- **Svetlo (§3.1)** — jeden smer pre celú scénu, zhora zľava. Tri hodnoty:
  strecha `#2b3039`, prisvietená stena `#232833`, odvrátená `#181c24`, plus
  odlesk na hornej hrane strechy. Toto samo urobilo najväčší rozdiel.
- **Vrhnuté tiene (§3.2)** — posun v smere svetla o `výška × 0,6`, `#000` pri
  0,35 s rozostrením 3 px, pod budovami.
- **Výšky z dát (§3.3)** — `height` → `building:levels` × 3 m → odhad z plochy
  (haly ploché a rozľahlé, bloky vysoké, domy nízke). Uniformná výška bola
  druhý najväčší dôvod, prečo mapa pôsobila ako schéma.
- **Poradie kreslenia (§3.4)** — zoradené podľa `x + y`, odzadu dopredu.
- **Atmosférický úbytok (§3.5)** a **jemnejšia vinetáž (§3.11)** — elipsa,
  nie kruhový výrez.
- **Podklad má vrstvy (§3.6)** — koľajisko ako vlastný tmavší pás, zeleň,
  spevnené plochy. 6 plôch z OSM.
- **Cesty s hierarchiou a lemom (§3.7)** — šírka a jas podľa `highway`, pod
  každou tmavší lem o 2 px širší, chodníky prerušovane.
- **Albion ako ohnisko (§3.8)** — zlatá strecha, zlatý rim light na hranách,
  mäkká zlatá žiara pod budovou, okolité budovy o stupeň svetlejšie.
- **Popisy (§3.9)** — halo cez `paint-order: stroke`, Albion v serif 600
  a väčší, ostatné v sans.
- **Mierka a severka (§3.10)** — 50 m vpravo dole, `S` so šípkou vľavo hore.

Dve umiestnenia som počas kontroly posunul, lebo sa prekrývali: popis
autobusovej stanice je pod jej uzlom (nie nad, kolidoval s „Albion“) a severka
je vľavo hore (kolidovala so „Železničná stanica“).

---

## §4 Animácia

Celé do 2,2 s, raz pri vstupe do viewportu: vrstva A sa objaví (500 ms) →
cesty sa nakreslia (600 ms) → budovy vystúpia odzadu dopredu s ľahkým
prestrelom `cubic-bezier(0.34, 1.3, 0.64, 1)`, stagger 8 ms zastropovaný na
25 krokov → tiene 120 ms po budovách → trasa (500 ms) → zlatá žiara → bod.
`prefers-reduced-motion` → všetko naraz, bez pohybu. Bez JS je mapa hotová.

**Jeden nález pri kontrole:** zapečená vrstva štartuje na `opacity: 0` a mala
`loading="lazy"`. Prehliadač ju v tej kombinácii **vôbec nezačal sťahovať** —
mapa by ostala bez podkladu. Uvoľňuje ju teraz ten istý observer, ktorý spúšťa
animáciu, takže kto sekciu nikdy neuvidí, obrázok nestiahne.

---

## Čísla

| | Desktop | Mobil | Limit |
|---|---|---|---|
| Váha stránky | **299 kB** | **275 kB** | 400 kB |
| Requesty | 11 | 10 | — |
| Third-party / cookies | 0 / 0 | 0 / 0 | 0 |
| JS gzip | bez zmeny, ~2 kB | | ~2 kB |

`astro check` 0 chýb · `npm test` 23/23 · rýchly scroll dole aj hore bez
prázdnych miest.

Jeden test som musel upraviť: `schéma neuvádza vzdialenosť ani čas` padal na
novom reťazci `50 m`. To je popis **mierky mapy**, nie tvrdenie o ceste
k prevádzke, takže sa z kontroly vyníma — zvyšok testu platí ďalej.

---

## Otvorené

1. **Súradnica vchodu** — odblokuje polohu bodu natrvalo.
2. Stále nezapracované **dávky 8 a 9** (dobehnutie dávky 5: paleta, svetlé
   sekcie, zlatý obraz, prepísané texty · jazykové verzie SK + HU).
3. E-mail, fotky, doklady, právna kontrola, podsetovanie Interu.
