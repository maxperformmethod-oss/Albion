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

### 3. Vzťahová vrstva — potvrdená majiteľmi (dávka 7)

| Otázka | Odpoveď |
|---|---|
| Rodinná firma? | **Áno** — vedú ju manžel a manželka, nikto ďalší |
| Rok 2001? | **Potvrdený** → `foundedYearConfirmed: true` |
| Osobný odkaz? | **Schválený**, znenie je v `content.ts` a nemení sa |
| Mená majiteľov? | **Nie**, zatiaľ nezverejňujeme |

Preto celá vzťahová vrstva hovorí **„my"**, nie „majiteľ" v tretej osobe —
firmu vedú dvaja ľudia.

### 4. Mapa bez `<iframe>` — potvrdené

Zámer, nie opomenutie. Od dávky 6 je na mieste **vlastná axonometrická mapa
zo skutočných dát OpenStreetMap** (licencia ODbL, atribúcia pod mapou) —
skutočné pôdorysy budov, nula third-party requestov. Plus typografický blok
s adresou a tlačidlo do Google Máp.

---

## ⏳ ZOSTÁVA (nič z toho neblokuje)

| # | Vec | Čo sa stane, keď príde |
|---|---|---|
| 1 | **Vlastná doména** | `PUBLIC_SITE_URL` prepíše predvolenú produkčnú adresu. Dovtedy beží všetko na `albion-bf4w.vercel.app`. |
| 2 | **E-mail** | Pribudne riadok v sekcii Kontakt, `email` v JSON-LD a kontakt v zásadách ochrany údajov. |
| 3 | **6 fotiek od majiteľov** | Nahradia abstraktnú textúru v hero. Zoznam je v `README.md`. Jedna z nich patrí aj vpravo do osobného odkazu — miesto je pripravené. |
| 4 | **Doklady k založeniu** | `requiredDocuments` → poznámka pod krokmi v sekcii „Ako to funguje". |
| 5 | **Mená majiteľov** | Zatiaľ zverejniť nechcú. Keby zmenili názor, doplní sa podpis pod osobným odkazom. |
---

## Nové otvorené body

### ⚠ Adresa `Kpt. Nálepku` verzus `Mieru` v OpenStreetMap

Súradnice prevádzky sú potvrdené (`48.334768, 19.667564`) a **3D mapa beží**.
Pri práci s ňou však vyplávalo niečo, čo stojí za overenie.

Overené (14. 8. 2026):

- V OSM **v Lučenci nie je ulica `Kpt. Nálepku`**. Nominatim vracia dve ulice
  toho mena, obe mimo mesta — vo Fiľakove (986 01) a v Haliči (985 11).
  Medzi 192 pomenovanými ulicami v okruhu 3 km od centra Lučenca ani jedna
  neobsahuje „Nálepk“ ani „Kpt./Kapitána“.
- **Reverzné geokódovanie potvrdených súradníc** vráti
  `6303/7A, Mieru, Opatová, Lučenec, 984 01`. Podľa OSM je teda prevádzka
  na ulici **Mieru**.
- Súradnice samotné sedia: sú **135 m od uzla železničnej stanice**, čo
  presne zodpovedá „pár krokov od stanice“, a padnú dovnútra pôdorysu budovy.

Sú dve možné vysvetlenia: ulicu v OSM niekto pomenoval nesprávne alebo
zastaralo, alebo sa ulica premenovala a jeden z oboch zdrojov je pozadu.

**Ako je to vyriešené na webe:** mapa kreslí skutočnú geometriu a presný bod,
ale **nevypisuje názvy ulíc**. Adresa `Kpt. Nálepku 41` je v texte pod mapou,
kde je aj tak jediným záväzným nositeľom údaja. Ani jedno tvrdenie tak
nestojí na dátach, ktoré si protirečia.

**Čo overiť:** či je `Kpt. Nálepku 41` naozaj aktuálna úradná adresa — mala
by sedieť s Google Business Profile, s obchodným registrom aj s tým, čo je
na dverách. Ak sa niekde líši, Google to vyhodnotí ako nekonzistentné NAP
a lokálne pozície klesnú. Je to jediný údaj na webe, ktorý sa neoplatí
nechať tak.
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
