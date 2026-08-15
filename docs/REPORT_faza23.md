# REPORT — Fáza 23

Zadanie: `docs/PROMPT_FINAL17.md`, poradie §5. Dátum: 15. 8. 2026.
Náhľad: `docs/mapa-3d-nahlad.png`. **Necommitnuté do vzdialeného repa** —
čakám na tvoj pohľad podľa §5 bodu 5.

---

## §1 Posuny vrátené

`MARKER_NORTH_M` je späť na **0** (bolo 27). Konštanta v kóde zostala, aby
sa dalo porovnať. Značka je späť na polohe spred dávky 15: **87,5 m od
železničnej stanice**, 104 m od autobusovej.

---

## §2 Pravidlo lomu 140° — **nenašlo kandidáta**

Uhly **všetkých** lomov vypočítanej trasy, v poradí od železničnej stanice:

```
57°, 3°, 0°, 88°, 4°, 90°, 0°, 0°, 0°, 2°,
86°, 9°, 22°, 20°, 31°, 21°, 14°, 1°, 178°, 92°
```

- V rozsahu **120–160°** nie je ani jeden vrchol.
- Po rozšírení na **110–170°** tiež nie.
- Najbližšie k 140° je **178°** — a ten je mimo oboch rozsahov.

Podľa §2 bodu 5 som teda nechal stav po vrátení posunov a píšem ti to.
Prakticky to znamená, že koniec trasy určuje **pravidlo tretieho lomu**
z dávky 13 (tretí vrchol nad 60°: 57 → 88 → 90), čo je presne tá poloha,
ktorú si v §1 označil za správnu.

**Pravidlo 140° je v kóde a je aktívne** — len nemá čo chytiť. Ak by sa
geometria trasy zmenila, prevezme riadenie automaticky; pravidlo tretieho
lomu beží ako záloha, nie je zmazané.

**Poznámka k tomu 178°:** je to jediný takmer vratný zlom v celej trase, čo
sedí s popisom „ostrý, takmer vratný zlom, ktorý je v celej trase výnimočný".
Leží však **za** miestom, kde teraz značka je — trasa by sa predĺžila, nie
skrátila. Rozsah 120–160° som nerozširoval sám; ak chceš, aby sa bral aj
178°, stačí zmeniť jedno číslo a poviem ti, kam sa bod presunie.

---

## §3 Značka a budova z jedného bodu

- Polomer priradenia budovy zväčšený z 25 m na **40 m**.
- Pri viacerých kandidátoch vyhráva **najväčšia plocha pôdorysu**.
- Značka aj koniec trasy sú v tom istom vrchole, posunuté 10 m kolmo.

**Výsledok:** zlatý obrys má **budova v tvare L vľavo od trasy** — presne tá,
ktorú si označil za správnu. Predtým vypadla, lebo bola tesne za polomerom
25 m.

---

## §4 Lekáreň Mierová vyhodená

Zostali **štyri popisy okrem Albionu**: Železničná stanica · Autobusová
stanica · Billa · Pizzéria Hacienda.

---

## Overené

`astro check` 0 chýb · build 10 stránok · mapa 33,6 kB.

## Otvorené

Doména · právne texty · korektúra HU/EN · potvrdenia B1–B5 · fotky.
