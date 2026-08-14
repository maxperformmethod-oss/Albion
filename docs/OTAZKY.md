# OTÁZKY

Otvorené body, ktoré potrebujú tvoje alebo majiteľovo rozhodnutie.

---

## ✅ VYRIEŠENÉ

### 1. Adresa natvrdo v textoch — splatené

Odpoveď: `docs/PROMPT_FINAL.md` §1 + `docs/UDAJE_FINAL.md` §2.
Adresa je potvrdená (`Kpt. Nálepku 41, 984 01 Lučenec`), v `business.ts` už nie je
`TO_CONFIRM` a **z textov zmizla natvrdo**. Hero eyebrow aj sekcia „Kde nás nájdete"
sa skladajú z `business.ts` cez zástupný znak `{address}`. Stráži to unit test
`tests/content.test.mjs` — ak sa adresa do textov vráti, testy spadnú.

### 2. Obedňajšia prestávka — implementovaná

Odpoveď: prestávku nemajú, ale kód pre ňu existuje.
`getOpenState()` v `src/lib/hours.ts` vracia `open` / `break` / `closed`.
Stav `break` sa dnes nikdy nevykreslí; keby ju majiteľ zaviedol, stačí pridať
druhý interval do `openingHours`.

Navyše: pri zatvorenom obchode indikátor povie **kedy otvárame**
(`Zatvorené · otvárame zajtra o 7:00`), nielen že je zatvorené.

### 3. Mapa bez `<iframe>` — potvrdené

Zámer, nie opomenutie. Typografický blok + tlačidlo do Google Máp.

---

## ⏳ ZOSTÁVA (nič z toho neblokuje)

| # | Vec | Čo sa stane, keď príde |
|---|---|---|
| 1 | **Doména** | `PUBLIC_SITE_URL` → canonical, OG URL, sitemap a `url`/`image` v JSON-LD. Dovtedy sa `url` a `image` do JSON-LD **nevygenerujú** — localhost tam nepatrí. |
| 2 | **E-mail** | Pribudne riadok v sekcii Kontakt a `email` v JSON-LD. |
| 3 | **GPS súradnice prevádzky** ⚠ **blokuje 3D mapu** | Pribudne `geo` v JSON-LD a **rozbehne sa 3D mapa z OSM** — pozri nový otvorený bod nižšie. |
| 4 | **Potvrdenie roku 2001** | Prepni `foundedYearConfirmed: true` → do bodu „Dlhoročná miestna firma" pribudne veta `V Lučenci pôsobíme od roku 2001.` |
| 5 | **Priamy odkaz na Google profil** | Nahradí vyhľadávací odkaz — otvorí kartu prevádzky s recenziami namiesto zoznamu výsledkov. |
| 6 | **6 fotiek od majiteľa** | Nahradia abstraktnú textúru v hero. Zoznam je v `README.md`. |
| 7 | **Doklady k založeniu** | `requiredDocuments` → poznámka pod krokmi v sekcii „Ako to funguje". |

---

## Nové otvorené body

### ⚠ „Kpt. Nálepku“ v Lučenci nie je v OpenStreetMap — blokuje 3D mapu

Pipeline na 3D mapu z OSM dát je hotová (`scripts/build-map.mjs`) a funguje.
Chýba jediná vec: **kde presne stojí prevádzka.**

Čo som overil (14. 8. 2026):

- Nominatim na `Kpt. Nálepku 41, Lučenec` vráti dve ulice rovnakého mena, ale
  **ani jednu v Lučenci** — sú vo Fiľakove (986 01) a v Haliči (985 11).
  Obe sú v okrese Lučenec, čo je presne tá zámena, na ktorú sa dá naletieť.
- V Overpass som vypísal **všetkých 192 pomenovaných ulíc v okruhu 3 km od
  centra Lučenca**. Ani jedna neobsahuje „Nálepk“ ani „Kpt./Kapitána“.
- V okruhu 500 m od stanice nie je ani jedna budova s `addr:housenumber=41`.
- Jediná záložňa označená v OSM v okolí je bez názvu a je ~800 m od stanice,
  takže ako potvrdenie neposlúži.

**Súradnice si nevymýšľam** — mapa s domom o ulicu vedľa by vyzerala úplne
dôveryhodne a bola by nepravdivá. Sú dve možné vysvetlenia: ulica v OSM chýba,
alebo sa dnes volá inak (premenovanie ulíc s týmto názvom je bežné).

**Čo potrebujem:** stačí otvoriť Google Mapy na prevádzke, kliknúť pravým na
značku a odkopírovať dvojicu čísel (napr. `48.3361, 19.6669`). Prípadne presný
odkaz na Google profil prevádzky (bod 5 v tabuľke vyššie).

Potom: doplniť do `business.geo`, spustiť `npm run map` a mapa je hotová.
Kontrolný render okolia stanice je v `docs/mapa-3d-nahlad.png` — kvalita
sedí, dáta OSM sú v okolí stanice husté (162 budov v okruhu 250 m).

### ⚠ Právne stránky sú návrh pripravený neprávnikom

`/ochrana-osobnych-udajov` a `/podmienky-pouzivania` sú **návrh, nie právne
poradenstvo.** Pred spustením webu ich má prejsť niekto, kto sa tomu venuje.

Texty sú zámerne krátke a pravdivé — web nenastavuje cookies, nemá analytiku,
formuláre ani third-party skripty, takže nepotrebuje ani cookie lištu.

Miesta, ktoré si pýtajú kontrolu najviac (v `content.ts` označené `review: true`):

1. **„Keď nám zavoláte alebo prídete“** — rozsah spracúvania podľa zákona
   o záložniach a výkupe je napísaný všeobecne, bez paragrafov.
2. **„Vaše práva“** — výpočet práv je štandardný, ale bez lehôt a bez právnych
   základov podľa konkrétnych ustanovení.
3. **„Informačný charakter“** v podmienkach používania.

Zámerne tam **nie je**: zodpovedná osoba (DPO), lehoty uchovávania, právne
základy podľa paragrafov, zoznam sprostredkovateľov a cezhraničné prenosy.
Nič z toho nevieme a vymýšľať sa to nesmie.

Dátum účinnosti je konštanta `content.legal.effectiveFrom` — **pri zmene textu
ho treba prepísať ručne.**

### Fallback font pre nadpisy

Nadpisy sú teraz v reze 600. Georgia (fallback) je v tučnom reze širšia než
Source Serif 4, takže pri načítaní fontu môže nastať posun. Nameraný CLS
a rozhodnutie o `size-adjust` sú v `docs/REPORT_faza6_audit.md`.
