# VERCEL PROJEKTY A DOMÉNA

## 1. Prečo sú projekty dva

To isté GitHub repo bolo do Vercelu naimportované dvakrát. Vznikli:

| Projekt | Adresa | Stav |
|---|---|---|
| `albion` | `albion-rosy-rho.vercel.app` | **zmazať** |
| `albion-bf4w` | `albion-bf4w.vercel.app` | **ponechať** |

Oba sledujú vetvu `main` a pri každom pushi nasadzujú ten istý commit. Nie je to chyba v kóde — je to duplicitný import.

**Prečo to treba vyriešiť:** dve živé adresy s identickým obsahom sú pre Google duplicitný obsah. Kanonická adresa je natvrdo `albion-bf4w.vercel.app`, takže obe verzie ukazujú na tú istú — riziko je zatiaľ malé. Ale nechať to tak znamená platiť dvakrát za buildy a raz sa v tom stratiť.

**Ponechávame `albion-bf4w`**, pretože je zapísaný v kóde ako produkčná adresa. Zmazať ten druhý je bez rizika, zmazať tento by znamenalo zásah do kódu.

### Postup

1. Vercel → projekt **`albion`** (ten s `albion-rosy-rho.vercel.app`)
2. Settings → dole **Delete Project**
3. Potvrdiť názvom projektu
4. Overiť, že `albion-bf4w` stále nasadzuje a stránka beží

Mazať sa má len ten jeden. Ak si nie si istý, ktorý je ktorý, porovnaj adresu — ponecháva sa tá, ktorá je v `business.ts`.

---

## 2. Vlastná doména — treba ju pred spustením

`albion-bf4w.vercel.app` je vývojová adresa. Pre firmu, ktorá stavia celý web na dôveryhodnosti a dvadsiatich piatich rokoch na jednom mieste, je to problém — pôsobí to ako provizórium a človek, ktorý zvažuje, či prísť s rodinným zlatom, si to všimne.

Navyše: adresu na `.vercel.app` sa neoplatí dávať do Google profilu ani na vizitky, lebo ju o pár mesiacov budeme meniť a stratíme odkazy.

### Odporúčanie

Kúpiť **`.sk`** doménu. Je to pre lokálnu firmu silnejší signál než `.com`.

Kandidáti v poradí, ako by som ich skúšal:

1. `zaloznaalbion.sk`
2. `albionlucenec.sk`
3. `stanicnazalozna.sk`
4. `albion-zalozna.sk`

Pravidlá pri výbere: bez pomlčiek ak sa dá, bez diakritiky, čo najkratšie, a musí sa dať prečítať do telefónu bez hláskovania.

Registrácia u ktoréhokoľvek slovenského registrátora, cena rádovo jednotky až nižšie desiatky eur na rok. **Doménu si zaregistruj na majiteľa firmy, nie na seba ani na agentúru** — je to jeho majetok a raz ho môže potrebovať prevziať.

### Keď doména bude

1. Vercel → projekt `albion-bf4w` → Settings → Domains → pridať doménu
2. Nastaviť DNS podľa pokynov Vercelu
3. V kóde zmeniť produkčnú adresu na novú doménu
4. `albion-bf4w.vercel.app` nechať presmerovaný na novú doménu, nie zmazať
5. Až potom doplniť adresu do Google profilu

Toto je posledná vec pred spustením. Kým doménu nemáme, web nikam nepropaguj.
