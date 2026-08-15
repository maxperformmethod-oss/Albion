# REPORT — Fáza 22

Zadanie: `docs/PROMPT_FINAL16.md`, poradie §4. Dátum: 15. 8. 2026.
Náhľady: `docs/mapa-3d-nahlad.png`, `docs/svetla-sekcia-nahlad.png`.

---

## §3 Sekcia „Čo u nás môžete založiť alebo predať"

Blok s nadpisom a leadom začína na **38 %** šírky kontajnera a je široký
**50 %**, takže vpravo zostáva ~12 % voľných. Text v ňom je **zarovnaný
doľava**. Asymetria zostala, ale nadpis sa už nedotýka okraja a nepôsobí,
akoby ho tam odtlačilo.

Pod 1024 px sa blok posunie na plnú šírku a zarovná doľava. Zlatá linka,
mriežka 4 × 2 aj duchové slovo pri pravom okraji zostali bez zmeny.

---

## §1 Značka

Posun je teraz **27 m na sever** (`MARKER_NORTH_M`), teda o ďalších 12 m
oproti dávke 15. Značka je **60,6 m od železničnej stanice** (bolo 72,6 m).

**Koniec trasy ide so značkou** — posledný bod trasy sa prepisuje na jej
polohu. Bod a trasa sa tak nemôžu rozísť, tak ako sa predtým rozišiel bod
a zvýraznená budova.

Priradenie budovy beží po posune a tentoraz **budova padla dovnútra** —
na náhľade má zlatú strechu a rim light priamo pod značkou.

---

## §2 Názvy okolia — čo sa našlo a čo nie

Súradnice sú výhradne z OSM; zoznam z Google slúžil len ako to, čo hľadať.

**Našlo sa v OSM (4):**

| Google | OSM `name` | Na mape |
|---|---|---|
| BILLA | `Billa` | ✅ |
| Pizzeria Hacienda | `Pizzéria Hacienda` | ✅ |
| Autobusová stanica Lučenec | `Lučenec,,AS MHD` | ✅ (už predtým) |
| DOMIREX GROUP s.r.o. | `Domirex` | ❌ stavebniny nie sú v poradí dôležitosti |

**Nenašlo sa v OSM (9):** Lekáreň Dr. Max · LaboraMed Pohotovosť · Domirex
Group Apartments · Vinotéka Limbašský · Vape World · Lekáreň ZDRAVIE ·
LC Taxi NonStop · CITY TAXI Lučenec · G-MEDIC · M&M Caffe.
Nemáme k nim polohu, takže sa nepopisujú.

**Navyše z OSM:** `Lekáreň Mierová` — lekáreň, ktorá v tvojom zozname nie je,
ale v dátach má polohu. Priorita 4 žiadala „Lekáreň Dr. Max **alebo** Lekáreň
ZDRAVIE"; ani jedna v OSM nie je, takže som použil tú, ktorá tam je. Ak to
nie je tá správna prevádzka, stačí povedať a vypadne.

**Výsledok — 5 popisov okrem Albionu:** Železničná stanica · Autobusová
stanica · Billa · Lekáreň Mierová · Pizzéria Hacienda. Šesť je strop, nie
cieľ — nič sa neprekrýva a nič som neskracoval.

Taxi služby a ambulancie sú vylúčené regulárnym výrazom, nie ručne.

---

## §4 Zápis do zoznamu

`docs/LAUNCH_CHECKLIST.md` §F má nový bod **F0**: skontrolovať popisy okolia
raz za rok cez `npm run map -- --refresh`. Stanice a BILLA sú stabilné,
zvyšok nie — je to najkrehkejšia časť mapy.

---

## Overené

`astro check` 0 chýb · `npm test` 23/23 · build 10 stránok · rýchly scroll
bez prázdnych miest · 12 requestov, 0 third-party.

## Otvorené

Doména · právne texty · korektúra HU/EN · potvrdenia B1–B5 · fotky.
