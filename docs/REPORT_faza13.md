# REPORT — Fáza 13

Zadanie: `docs/PROMPT_FINAL7.md` (poradie §8) + `docs/PROMPT_FINAL6.md` §1.
Dátum: 14. 8. 2026.

---

## Mapa (FINAL6 §1) — hotová

**Súradnice** `48.334768, 19.667564` sú v `business.geo`, teda aj v JSON-LD.
`mapsUrl` je priamy odkaz na kartu prevádzky (`?cid=…`), nie vyhľadávanie.

**Mapa beží** — `src/components/sections/map.generated.svg`, generuje
`npm run map`, commitnutá, inline v HTML, **0 requestov navyše**.

| | |
|---|---|
| Veľkosť SVG | **54,8 kB** (rozpočet 60 kB) |
| Obsah | 163 budov, 84 ulíc, 17 koľají v okruhu 180 m |
| Bod Albion | **presne na potvrdených súradniciach** |
| Budova prevádzky | kotva padla dovnútra pôdorysu → strecha zvýraznená zlatou |
| Trasa | od uzla stanice z Overpassu, prerušovaná zlatá |
| Atribúcia | `Mapové podklady © prispievatelia OpenStreetMap` pod mapou, s odkazom |

Polomer výrezu je 180 m, nie 350. Okolie prevádzky je hustejšie zastavané než
okolie stanice — pri 350 m vyšlo SVG na 186 kB, pri 250 m na 93 kB. Podľa
`PROMPT_FINAL4.md` §3.2 sa zmenšuje výrez, nie kvalita. Stanica je 135 m
od prevádzky, takže v zábere zostala.

Animácia podľa §3.3, raz, celé do 1,6 s: ulice sa nakreslia (600 ms) →
budovy vystúpia zozadu dopredu (stagger 12 ms, 21 krokov, koniec 740 ms) →
trasa (500 ms, koniec 1260 ms) → bod a prstenec (koniec 1600 ms).
`prefers-reduced-motion` → všetko hneď. Bez JS → mapa je hotová, nie prázdna.

### Overenie, ktoré zmenilo zadanie

`PROMPT_FINAL5.md` §1 tvrdil, že ulica `Kpt. Nálepku` v OSM je a hľadalo sa
zle. **Nie je.** Spustil som presne tú query z §1.1 — vrátila **iba uzol
stanice, žiadnu cestu**. Navyše:

- reverzné geokódovanie potvrdených súradníc vráti
  **`6303/7A, Mieru, Opatová, Lučenec, 984 01`** — podľa OSM je prevádzka
  na ulici **Mieru**,
- medzi 192 pomenovanými ulicami v okruhu 3 km od centra Lučenca nie je ani
  jedna s „Nálepk“ či „Kpt./Kapitána“.

Samotné súradnice sú pritom v poriadku: 135 m od stanice a padnú dovnútra
pôdorysu budovy. Rozpor je v **názve ulice**, nie v polohe.

**Ako som to vyriešil:** mapa kreslí skutočnú geometriu a presný bod, ale
**nevypisuje názvy ulíc**. Zvýraznenie ulice z FINAL5 §1.2 odpadlo — už
nie je potrebné, máme bod. Adresa `Kpt. Nálepku 41` je v texte pod mapou.
Takto nič netvrdíme na dátach, ktoré si protirečia.

**Na overenie:** či je `Kpt. Nálepku 41` aktuálna úradná adresa — má sedieť
s Google profilom, s registrom aj s tým, čo je na dverách. Detaily v
`docs/OTAZKY.md`.

---

## Vzťahová vrstva (FINAL7) — hotová

| § | Čo | Kde |
|---|---|---|
| 1 | `foundedYearConfirmed: true`, `FEATURES.familyBusiness`, `FEATURES.ownerNote` | `business.ts` |
| 3 | Pás pod hero: `Rodinná firma. V Lučenci od roku 2001.` | `TrustBand.astro` |
| 4 | Body 1 a 2 v „Prečo ľudia chodia práve k nám“ | `content.ts` |
| 5 | Osobný odkaz medzi „Prečo Albion“ a „Kde nás nájdete“ | `OwnerNote.astro` |
| 6 | Meta description s „Rodinná záložňa … od roku 2001“ | `content.ts` |

Podrobnosti, ktoré stoja za zmienku:

- Celá vrstva hovorí **„my"**. Tretiu osobu som zmenil aj v bode 1, kde
  predtým bola („Rozhoduje tu majiteľ“ → „Za pultom stojíme my“).
- Pás sa vykreslí len pri `familyBusiness && foundedYearConfirmed`, osobný
  odkaz len pri `ownerNote`. Bez potvrdenia sa nezobrazí nič — žiadne dočasné
  znenie na produkcii.
- Rok je **priamo v texte bodu 2**, nie ako podmienená veta navyše. Pôvodné
  vkladanie `foundedSentence` som odstránil, inak by tam rok bol dvakrát.
- Podpis pod odkazom **meno neobsahuje** — `ownerName` zostáva nepotvrdené
  a nikde sa nepoužíva.
- Vpravo v osobnom odkaze je pripravených 38 % šírky na fotku (`{/* TODO: photo */}`).
- Do JSON-LD som o rodine nepridal nič — `PawnShop` na to pole nemá.

Strop z §7 dodržaný: päť prvkov, ~70 slov, žiadna sekcia o histórii ani
počítadlo rokov. Slovo „rodina“ zaznie trikrát a potom už nie.

---

## Overené

Smoke test podľa pravidla §0 z dávky 4:

- `npm run build` prejde, gate bez `--allow`, 4 stránky
- `astro check` 0 chýb · `npm test` 23/23
- rýchly scroll dole aj hore — nikde prázdne miesto
- vo výstupnom HTML sedia všetky nové reťazce, žiadny nerozvinutý `{year}`
- `geo` a nový `mapsUrl` v JSON-LD
- mapa, pás pod hero aj osobný odkaz vizuálne na produkčnom builde
- 10 requestov, 0 third-party, 0 cookies · váha 297 kB (bolo 283 kB)

HTML narástlo z 15,7 na 29,9 kB gzip — celé je to inline mapa. Za nula
requestov navyše a skutočnú geometriu to stojí.

---

## Otvorené

**Nezapracované zostávajú celé dávky 5 a 6 §2** — v tomto behu som robil len
to, čo si zadal (mapa + dávka 7). Konkrétne čaká:

| Z dávky | Čo |
|---|---|
| FINAL5 §2 | teplejšia paleta (`ink-900` → `#1A1D22` atď.) + prepočet kontrastu hero |
| FINAL5 §3 | svetlé sekcie — papierové zrno, vinetáž, číslovanie položiek, teplé vlasové linky |
| FINAL5 §4 | zlatý obraz do „Individuálne ocenenie“ (URL v dávke 5 už sú) |
| FINAL5 §5 | prepísané texty — hero micro, outro zoznamu, celá sekcia „Individuálne ocenenie“, krok 3, lead v Kontakte |

Body 3 a 4 v „Prečo Albion“ som podľa FINAL5 §5 zapracoval už teraz — bez
nich by sekcia miešala nové a staré znenie. Zvyšok textov z FINAL5 §5 je
**nedotknutý**, takže napr. hero micro stále hovorí „Bez čakania na schválenie
z centrály“, čo sa s novým bodom 1 čiastočne prekrýva.

Povedz, či mám dávku 5 dobehnúť — je to jedna dávka práce.

Ďalej otvorené: e-mail, fotky od majiteľov (jedna patrí do osobného odkazu),
doklady k založeniu, právna kontrola oboch právnych stránok, podsetovanie
Interu kvôli LCP.
