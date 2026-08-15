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

### 4. NAP kontrola — prešla (15. 8. 2026)

Odpísané z Google profilu prevádzky, znak po znaku:

| Údaj | Google profil | Web | |
|---|---|---|---|
| Názov | Staničná Záložňa Albion | rovnako | ✅ |
| Adresa | `Kpt. Nálepku 41, 984 01 Lučenec` | rovnako | ✅ |
| Telefón | `047 433 44 44` | rovnako | ✅ |
| Hodiny | Closed · Opens 7 am Mon | Po–Pi 07:00–17:30 | ✅ |
| Kategória | Pawn shop | JSON-LD `PawnShop` | ✅ |

Adresa teda platí a nemení sa. Že ju OpenStreetMap v tom bloku nemá
zamapovanú (najbližšiu pomenovanú cestu vedie ako „Mieru“), je medzera
v OSM, nie v našich údajoch. **Mapa preto zámerne nevypisuje názvy ulíc** —
adresa je v texte pod ňou, kde je aj tak jediným záväzným nositeľom údaja.

Plus Code prevádzky `8MM9+W2 Lučenec` je v `docs/FIRMA_UDAJE.md`.

### 5. Mapa bez `<iframe>` — potvrdené

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

### ⚠ Maďarčinu a angličtinu má prečítať rodený hovorca

Preklady som pripravil ja, nie som rodený hovorca. V maďarčine je rozdiel
medzi „správne" a „znie to ako od suseda" veľký — najmä pri odkaze majiteľov,
ktorý má znieť ako ich hlas. Stačí, aby niekto povedal, čo znie kostrbato.

Ak majiteľka alebo majiteľ hovoria po maďarsky, sú najlepší korektor.



### ⚠ Presná súradnica vchodu — prvá vec, ktorá odblokuje polohu na mape

V Google Mapách nájsť **vchod do predajne** (nie značku firmy), kliknúť naň
pravým tlačidlom a skopírovať dvojicu čísel, ktorá vyskočí navrchu ponuky.
Poslať sem.

Značka firmy ukazuje na **ťažisko parcely**, preto sedí inde než dvere —
a preto sa bod na mape už trikrát posúval heuristikou. Keď príde súradnica
vchodu, všetky heuristiky sa zahodia a použije sa priamo.

Dovtedy bod stojí tam, kam ho posunulo pravidlo z dávky 10 (kolmý priemet
na cestu smerom k stanici, 8 m späť k budove). Pravidlo z dávky 11 — nájsť
lom cesty pri autobusovej stanici — som naprogramoval a **vyhodilo zlý
výsledok**: trafilo `building=roof`, teda prístrešok nad nástupišťom,
90 m od potvrdených súradníc. Poistka to zachytila a bod sa neposunul.
Podrobne v `docs/REPORT_faza17.md`.

### ⚠ Google profil — dve veci mimo kódu, ktoré spraví len majiteľ

Obe sú lacné a obe zaberú viac než čokoľvek, čo sa ešte dá spraviť na webe.

1. **Profil nemá odkaz na web.** V karte prevádzky je tlačidlo „Add website“ —
   patrí tam produkčná adresa. Je to jeden z najsilnejších lokálnych signálov
   a trvá to minútu.
2. **Profil má 3,0 hviezdy z 2 hodnotení.** Dve recenzie sú štatisticky nič
   a trojka pri takom počte odrádza viac než žiadne hodnotenie. Pár
   skutočných recenzií od pravidelných zákazníkov spraví pre lokálne pozície
   viac než zvyšok webu dokopy. Poprosiť — **nie kupovať, nie vymýšľať.**

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
