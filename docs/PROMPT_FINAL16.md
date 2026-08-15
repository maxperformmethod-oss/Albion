# DÁVKA 16 — značka, názvy okolia, rozloženie sekcie

---

## 1. ZNAČKA — POSUN NAHOR

Bod má zostať tam, kde končí prerušovaná trasa, len o kúsok vyššie.

- Posuň značku o **ďalších 12 m na sever** oproti súčasnému stavu (spolu teda ~27 m od pozície pred dávkou 15).
- Koniec trasy posuň s ňou — trasa a bod musia končiť v tom istom mieste. Nesmú sa rozísť, ako sa predtým rozišiel bod a zvýraznená budova.
- Po posune znova spusti priradenie budovy. Ak padne do pôdorysu alebo do 25 m, zvýrazni ju; inak len bod a žiara.

Zvýraznená budova na náhľade vyzerá dobre — ak po posune vypadne, nevadí, bod a žiara stačia.

---

## 2. NÁZVY OKOLIA — ZDROJ MÁM, PRIRADENIE UROB TY

Pozrel som Google Maps priamo. Toto sú názvy prevádzok, ktoré som odčítal v okolí prevádzky (stav 15. 8. 2026). **Sú to fakty o tom, aké firmy tam sídlia — nie mapové podklady.**

Zoznam s hrubou orientáciou voči Albionu:

| Názov | Typ | Poloha voči Albionu |
|---|---|---|
| Lekáreň Dr. Max | lekáreň | severovýchodne, blízko |
| LaboraMed Pohotovosť | zdravotníctvo | severne, blízko |
| DOMIREX GROUP s.r.o. | stavebniny | severozápadne |
| Domirex Group Apartments | ubytovanie | severozápadne |
| Vinotéka Limbašský | vinotéka | severozápadne, ďalej |
| Pizzeria Hacienda | reštaurácia | juhozápadne |
| Vape World | obchod | juhozápadne, ďalej |
| Lekáreň ZDRAVIE | lekáreň | západne, pri Železničnej |
| LC Taxi NonStop | taxi | severovýchodne |
| CITY TAXI Lučenec | taxi | východne |
| G-MEDIC, s.r.o. | zdravotníctvo | juhovýchodne |
| Autobusová stanica Lučenec | doprava | juhovýchodne |
| BILLA | supermarket | juhovýchodne, ďalej |
| M&M Caffe | kaviareň | juhovýchodne, ďalej |

### Ako to použiť

1. **Súradnice ber z OSM, nie odo mňa.** Pre každý názov z tabuľky skús nájsť zhodu v OSM POI dátach, ktoré si už stiahol (porovnávaj `name` voľne — veľké/malé písmená, diakritika, `s.r.o.` navyše).
2. **Popíš len tie, ktoré sa v OSM nájdu.** Ktoré tam nie sú, vynechaj — nemáme k nim polohu a odhadovať ju nebudeme.
3. **Vyber maximálne 6 popisov okrem Albionu**, v tomto poradí dôležitosti:
   1. Železničná stanica
   2. Autobusová stanica
   3. BILLA
   4. Lekáreň Dr. Max *alebo* Lekáreň ZDRAVIE (tá, ktorá je bližšie)
   5. Pizzeria Hacienda
   6. M&M Caffe
4. **Taxi služby a zdravotnícke ambulancie nepopisuj** — nie sú to orientačné body a je ich veľa.
5. Do reportu vypíš, ktoré názvy sa v OSM našli a ktoré nie.

### Poznámka, ktorú treba vedieť

Názvy prevádzok sa menia — o dva roky tam Vape World alebo Pizzeria Hacienda nemusia byť. Popisy okolia sú preto najkrehkejšia časť mapy. Zapíš do `docs/LAUNCH_CHECKLIST.md` do sekcie F, že popisy okolia treba raz za rok skontrolovať. Stanice a BILLA sú stabilné, zvyšok nie.

Ak niektorý názov na mape vyzerá tesne alebo sa prekrýva, **radšej ho vynechaj** než skracuj alebo posúvaj. Šesť je strop, nie cieľ — štyri dobre umiestnené sú lepšie než šesť natlačených.

---

## 3. SEKCIA „ČO U NÁS MÔŽETE ZALOŽIŤ ALEBO PREDAŤ" — MENEJ DOPRAVA

Máš pravdu, pri okraji to vyzerá divne. Nadpis prilepený k pravému kraju pôsobí, akoby ho tam odtlačilo, nie akoby tam patril.

**Uprav takto:**

- Blok s nadpisom a leadom začína na **38 % šírky kontajnera** a je široký **50 %**. Zostáva teda ~12 % voľných vpravo — nedotýka sa okraja.
- Text v ňom je **zarovnaný doľava**, nie doprava. Zarovnanie doprava pri ostatnom texte zarovnanom doľava bolo to, čo pôsobilo najviac cudzo.
- Asymetria zostáva — blok nezačína vľavo — ale už nie je vytlačený do rohu.
- Pod 1024 px sa blok posunie na plnú šírku a zarovná doľava, ako doteraz.

Zvyšok sekcie (zlatá linka cez celú šírku, mriežka 4 × 2, duchové slovo pri pravom okraji) nechaj tak, ako je.

---

## 4. PORADIE

1. §3 rozloženie sekcie
2. §1 posun značky a konca trasy
3. §2 názvy okolia — najprv vypíš, čo sa našlo v OSM, potom vyber
4. Zápis do `LAUNCH_CHECKLIST.md` §F
5. `git push`

Report do `docs/REPORT_faza22.md` + náhľad mapy a sekcie.
