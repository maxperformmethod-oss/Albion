# REPORT — Fáza 21

Zadanie: `docs/PROMPT_FINAL15.md`, poradie §5. Dátum: 15. 8. 2026.
Náhľady: `docs/svetla-sekcia-nahlad.png`, `docs/mapa-3d-nahlad.png`.

---

## §1 „Čo u nás môžete založiť alebo predať" — nové rozloženie

Všetky štyri problémy opravené:

- nadpis **aj lead** sú v pravom stĺpci (46 %), oba zarovnané doprava —
  už si nekonkurujú a oko vie, kde začať;
- ľavá polovica hore zostáva prázdna zámerne;
- pod nimi **zlatá vlasová linka cez celú šírku**;
- mriežka **4 × 2** — osem položiek sa vyplní presne, žiadna diera;
- pod 1024 px dva stĺpce, pod 640 px jeden a zarovnanie doľava.

**Duchové slovo** dostalo pravidlo: prečnieva len vodorovne cez jeden bočný
okraj, zvisle je celé vnútri sekcie, základňa 64 px nad spodnou hranou.
`ZLATO` prečnieva doprava, `DOHODA` doľava.

---

## §2 Svetlé sekcie

| | |
|---|---|
| 2.1 zvislý teplý prechod | hore svetlejšie, dole hlbšie, `oklab` |
| 2.2 reakcia položky | linka zozlatne, číslo zosilnie, text +2 px doprava, 180 ms · len `hover: hover` |
| 2.3 číslovanie | z `--text-eyebrow` na `--text-body`, `letter-spacing: 0.08em` |
| 2.4 druhý nábeh | ľavý dolný roh, zrkadlovo, polovičné krytie |

**Meranie kontrastu.** Zvislý prechod stiahol najtmavšiu papierovú plochu na
**11,39:1**. Riešil som to tromi krokmi a po každom meral: zjemnenie spodku
prechodu (11,97), zlatá vrstva 0,04 → 0,03 (bez zmeny — nebola vinníkom),
papierové zrno 0,028 → **0,018**. Výsledok **12,06:1** na najtmavšej
papierovej ploche celej stránky.

Ukázalo sa, že limitom nie je zlato ani duchové slovo, ale **kombinácia
`paper-2` základu so zrnom**. Preto je zrno tá správna páka.

---

## §3.1 Značka o 15 m na sever

Posun je v kóde ako `MARKER_NORTH_M = 15` a beží **pred** priradením budovy,
takže poloha a zvýraznenie sú jeden výpočet. Značka je teraz **72,6 m od
železničnej stanice** (bolo 87,5 m). Do pôdorysu ani po posune nepadla
a najbližšia budova je ďalej než 25 m, takže sa naďalej nezvýrazňuje nič —
svieti len bod a žiara.

---

## §3.2 Pomenované objekty v OSM — celý zoznam

V bboxe 180 m sa našlo **30 pomenovaných objektov**:

| Názov | Typ |
|---|---|
| Lučenec | station |
| Lučenec,,AS MHD | bus_station |
| Lučenec, stanica | information |
| Billa | supermarket |
| Lekáreň Mierová | pharmacy |
| ALFAMEDIC s.r.o. | clinic |
| Špeciálna základná škola | school |
| Syva Svietidlá · DATex | convenience |
| Domirex | doityourself |
| Lučenecký Mäso-hrad | butcher |
| CPB · Minit | bakery |
| OM style | clothes |
| Pizzéria Hacienda | restaurant |
| Star Kebab · Roadburger · Café Vláčik | fast_food |
| Záhradná cukráreň · Záhradná zmrzlina | ice_cream |
| Disco bar · Rio pub | bar / pub |
| Petrolsped Slovakia | company |
| Z-Box | parcel_locker |
| ZSSK | ticket |
| Mieru · Staničný obvod · Železničná · M. J. Lermontova · Erenburgova | ulice |

**Vybrané na mapu (2):** `Billa` a `Lekáreň Mierová`. Okrem nich sú popísané
obe stanice a Albion.

Prečo len dva: reštaurácie, bary, pekárne, zmrzliny a malé prevádzky sú podľa
zadania vylúčené — zaplnili by mapu a zobrali pozornosť Albionu. `DATex`
a `Syva Svietidlá` sú `convenience`, teda malé prevádzky bez rozpoznateľného
mena, takže vypadli tiež. Škola a ALFAMEDIC ležia mimo výrezu alebo by ich
popis kolidoval s dôležitejším.

**Odpoveď na otázku, či je pomenovaných bodov málo:** na orientáciu ich stačí.
Billa je presne ten najsilnejší bod po staniciach, ktorý si spomínal. Viac by
už nebola orientácia, ale zoznam firiem. Záložne a zastavárne sú vylúčené
natrvalo regulárnym výrazom, nie ručne.

---

## §4 Zoznam pred spustením

`docs/LAUNCH_CHECKLIST.md` prečítaný. Z technickej strany je úplný; jediné,
čo som k A3 doplnil vo vlastnej hlave: zmena domény je jeden reťazec
v `astro.config.mjs` a `business.ts` (`PRODUCTION_URL`), plus prepis
`ROUTES` netreba — tie sú relatívne.

---

## Overené

`astro check` 0 chýb · `npm test` 23/23 · build 10 stránok · rýchly scroll
bez prázdnych miest · 12 requestov, 0 third-party · kontrast 12,06:1.

## Otvorené

Doména · právne texty · korektúra HU/EN · potvrdenia B1–B5 · fotky.
