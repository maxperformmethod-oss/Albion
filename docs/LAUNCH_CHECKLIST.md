# ČO TREBA, ABY SME MOHLI ÍSŤ ONLINE

Stav k 15. 8. 2026. Web je hotový — toto je zoznam vecí mimo kódu.

---

## A. BLOKUJE SPUSTENIE

| # | Úloha | Kto | Poznámka |
|---|---|---|---|
| A1 | **Kúpiť `.sk` doménu** | Maxim | `zaloznaalbion.sk` · `albionlucenec.sk` · `stanicnazalozna.sk`. Registrovať **na majiteľa firmy**, nie na seba. |
| A2 | Napojiť doménu na Vercel + DNS | Maxim | Postup v `docs/DOMENA_A_VERCEL.md` |
| A3 | Zmeniť produkčnú adresu v kóde na novú doménu | Claude Code | canonical, `og:url`, sitemap, `hreflang` |
| A4 | **Zmazať duplicitný Vercel projekt** `albion` | Maxim | Ponechať `albion-bf4w`, viď `DOMENA_A_VERCEL.md` |
| A5 | **Právne texty dať prečítať právnikovi** | Maxim | `/ochrana-osobnych-udajov` a `/podmienky-pouzivania` písal neprávnik |
| A6 | **HU a EN verziu dať prečítať rodenému hovorcovi** | Maxim | Najmä odkaz manželov — je to ich hlas |

---

## B. POTVRDENIA OD MAJITEĽA

| # | Otázka | Čo to odomkne |
|---|---|---|
| B1 | Je ocenenie zadarmo a nezáväzné? | háčik „Ocenenie na počkanie. Zadarmo a nezáväzne." |
| B2 | Vybavíte bežnú vec na počkanie? Do koľkých minút? | háčik „Väčšinu vecí vybavíme, kým na ne čakáte." |
| B3 | Súhlasí s vetou „Ak vám inde dajú viac, povedzte nám to. Vieme sa dohodnúť."? | **Už je naživo** — ak nesúhlasí, treba ju stiahnuť hneď |
| B5 | Je pri záložnej činnosti potrebný občiansky preukaz? | poznámka pod krokmi v „Ako to funguje" |

Po odpovediach sa `FEATURES.hooks` prepne na `true`.

---

## C. FOTKY — NAJVÄČŠÍ ZOSTÁVAJÚCI ROZDIEL

Web beží na abstraktných textúrach. Reálne fotky ho posunú viac než čokoľvek, čo sa ešte dá nakódovať.

Šesť fotiek mobilom, cez deň, bez blesku:

1. exteriér s vchodom
2. výklad alebo označenie prevádzky
3. pult vnútri, kde sa oceňuje
4. detail zlata alebo šperkov na tmavej podložke
5. záber, kde je v pozadí vidieť stanicu
6. **manželia pri pulte** — najsilnejší prvok, aký môžeme mať

Posielať e-mailom alebo cez Disk, **nie cez Messenger** (skomprimuje ich).

Fotka č. 6 má na stránke pripravené miesto vedľa ich odkazu — teraz je tam prázdno.

---

## D. GOOGLE PROFIL — UROBIŤ V DEŇ SPUSTENIA

| # | Úloha | Prečo |
|---|---|---|
| D1 | **Doplniť odkaz na web** do Google profilu | Jeden z najsilnejších lokálnych signálov. Až po nasadení domény. |
| D2 | Skontrolovať otváracie hodiny v profile | Musia sedieť s webom |
| D3 | Pridať fotky do profilu | Tie isté, čo pôjdu na web |
| D4 | **Poprosiť stálych zákazníkov o recenzie** | Profil má 3,0 z **dvoch** hodnotení. To odrádza viac než žiadne hodnotenie. Poprosiť, nie kupovať, nevymýšľať. |
| D5 | **Skontrolovať kategórie v Google profile** | Ak je medzi vedľajšími kategóriami „Zmenáreň" alebo „Currency exchange service", odstrániť. Hlavná musí zostať „Záložňa / Pawn shop". Najpravdepodobnejší zdroj zámeny, oprava trvá pol minúty. |
| D6 | **Vygoogliť vlastný názov** a zapísať katalógy, kde je firma vedená ako zmenáreň | Hľadať „Staničná Záložňa Albion", „Albion Lučenec", „ALBION P.M.". Najčastejšie: `lucenec.sk`, `virtualne.sk`, `tatradata.sk`, `azet.sk`, `zoznam.sk`. |
| D7 | **Poslať žiadosť o opravu** každému katalógu z D6 | Väčšina má formulár na nahlásenie chyby alebo kontaktný e-mail. Stačí jedna veta: *firma prevádzkuje záložňu, nie zmenáreň, prosíme o preradenie do správnej kategórie.* |
| D8 | **Do Google profilu nedopĺňať e-mail** | Kontaktom je telefón. Ak je tam e-mail už uvedený, odstrániť — nech sa web a profil zhodujú. |

D4 pohne lokálnymi pozíciami viac než zvyšok tohto zoznamu dokopy.

D5–D7 riešia zámenu so zmenárňou **pri zdroji**. Na webe je k tomu jedna vecná
veta v bloku „Založiť alebo predať?", ale tá sama o sebe nestačí: web navštívi
ten, kto firmu už našiel — katalógy formujú to, čo si o nej myslí ten, kto ju
ešte nepozná.

---

## E. PO SPUSTENÍ

| # | Úloha |
|---|---|
| E1 | Google Search Console — pridať doménu, odoslať sitemap |
| E2 | Overiť, že sa indexujú všetky tri jazykové verzie |
| E3 | Finálny audit — Lighthouse, axe-core, klávesnica, mobil na reálnom zariadení |
| E4 | Zmerať LCP na produkčnej doméne (v labe bolo 1,86–2,18 s) |
| E5 | Doplniť rok do zápätia automaticky (over, že sa mení) |

---

## F. NEBLOKUJE, ALE ZVÁŽIŤ NESKÔR

| # | Úloha | Kedy |
|---|---|---|
| F0 | **Skontrolovať popisy okolia v mape** | raz za rok |

Názvy prevádzok sa menia — o dva roky tam Pizzéria Hacienda alebo Lekáreň
Mierová nemusia byť. Sú to popisy z OSM, takže stačí spustiť
`npm run map -- --refresh` a pozrieť sa, čo prežilo. **Stanice a BILLA sú
stabilné, zvyšok nie.** Je to najkrehkejšia časť mapy.

- Podstránka `/vykup-zlata` pre lokálne SEO — silnejšia než jedna dlhá stránka
- Sekcia „Vybraný tovar", ak by ju chceli
- Podsetovanie fontu Inter (drží LCP linku do ~2,5 s)
- Meno majiteľov pri odkaze, ak si to raz rozmyslia

---

## Zhrnutie

**Bez A1–A4 sa spustiť nedá.** A5, A6, B3 a D4 sú veci, ktoré rozhodujú o tom, či to bude fungovať alebo len existovať.
