# REPORT — Fáza 16

Zadanie: `docs/PROMPT_FINAL10.md`, poradie §6. Dátum: 15. 8. 2026.
Náhľad mapy: `docs/mapa-3d-nahlad.png` (aktualizovaný).

---

## §2 Poloha bodu — opravená

Bod už nesedí vnútri bloku. Pravidlo je deterministické, nič sa neodhaduje:

1. spomedzi ciest sa vezme tá, ktorej najbližší bod leží **smerom k stanici**
   (polrovina daná vektorom prevádzka → stanica),
2. z potvrdených súradníc sa spraví **kolmý priemet** na jej geometriu,
3. značka sa posunie **8 m od cesty** späť smerom k pôvodným súradniciam.

Výsledok: **značka sa posunula o 31,3 m ku ceste** a **stále leží v pôdoryse
budovy**, takže zlatú strechu má tá istá budova ako predtým. Bod teraz stojí
pri ceste oproti stanici, presne ako to popisuje majiteľ.

`business.geo` som **nemenil** — v JSON-LD zostávajú pôvodné potvrdené
súradnice z Google profilu. Posun je len vizuálny.

Jedna drobnosť oproti predpisu: budovu pre zlatú strechu hľadám podľa
**značky**, nie podľa priemetu. Priemet leží z definície na ceste, takže by
nikdy nepadol dovnútra pôdorysu a pravidlo „zostáva na tej istej budove“ by
sa nikdy neuplatnilo. Fallback (najbližšia budova) zostal.

---

## §3 Trasa — vedie po ceste

Trasa už nie je rovná čiara cez bloky. Hľadá sa **Dijkstrom po skutočnom
grafe ulíc** z OSM: od uzla stanice po cestách k priemetu, odtiaľ k značke.
Skutočné lomové body, žiadne umelé zaobľovanie.

**Dĺžka trasy 185 m** proti 135 m vzdušnou čiarou — pomer 1,37, čo je na
mestský blok normálne.

Dve poistky:

- Graf sa stavia z **nezjednodušenej** geometrie. Douglas–Peucker vie zahodiť
  práve ten vrchol, ktorým sa dve ulice stretávajú, a graf by sa ticho
  rozpadol na kusy.
- Ak by trasa vyšla dlhšia než 2,5× vzdušná vzdialenosť (rozpadnutý graf,
  obchádzka cez pol mesta), **nekreslí sa vôbec**. Rovná čiara cez domy je
  horšia než žiadna.

---

## §4 Autobusová stanica — pridaná

V OSM je to uzol `amenity=bus_station` (`Lučenec,,AS MHD`), **61 m** od
prevádzky. Pôdorys nemá, takže sa neextruduje — je tam len popis
`Autobusová stanica` v rovnakom štýle ako `Železničná stanica`.

Výrez rozširovať netreba, 180 m stačí na obe stanice. Trasa vedie naďalej len
od železničnej stanice — druhá by schému zahltila.

---

## §1 + §5 Zápisy

- `docs/OTAZKY.md` — **NAP kontrola prešla** a presunul som ju medzi vyriešené
  (zhoda znak po znaku). Zároveň som tam zapísal dve veci, ktoré spraví len
  majiteľ: **doplniť odkaz na web do Google profilu** a **poprosiť
  o recenzie** (3,0 z 2 hodnotení).
- `docs/FIRMA_UDAJE.md` — Plus Code `8MM9+W2 Lučenec`, CID a súradnice ako
  doplnkové identifikátory.

Poznámku o rozpore `Kpt. Nálepku` verzus `Mieru` som z otvorených bodov
odstránil — adresa je overená proti Google profilu, takže je to medzera
v OSM, nie otázka pre majiteľa. Mapa preto naďalej nevypisuje názvy ulíc.

---

## Mapa — čísla

| | Predtým | Teraz |
|---|---|---|
| SVG | 54,8 kB | **55,3 kB** (rozpočet 75 kB) |
| Budovy / ulice / koľaje | 163 / 84 / 17 | rovnako |
| Bod Albion | v strede bloku | **pri ceste, 8 m od nej** |
| Trasa | rovná cez bloky | **po uliciach, 185 m** |
| Orientačné body | železničná stanica | + **autobusová stanica** |

---

## Overené

- `npm run build` prejde, `astro check` 0 chýb, `npm test` 23/23
- rýchly scroll dole aj hore — nikde prázdne miesto
- 10 requestov, 0 third-party, 0 cookies, 297 kB
- mapa vizuálne na produkčnom builde — náhľad v `docs/mapa-3d-nahlad.png`

## Otvorené

Stále nezapracované sú **dávky 8 a 9**:

| Dávka | Čo |
|---|---|
| 8 | dobehnúť celú dávku 5 — paleta, svetlé sekcie, zlatý obraz, prepísané texty (okrem mapy, tá je hotová a lepšia) |
| 9 | jazykové verzie SK + HU, prepínač v hlavičke, `hreflang`, právne stránky v HU |

Ďalej: e-mail, fotky od majiteľov, doklady k založeniu, právna kontrola
právnych stránok, podsetovanie Interu kvôli LCP, korektúra maďarčiny rodeným
hovorcom (až po dávke 9).
