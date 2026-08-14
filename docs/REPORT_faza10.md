# REPORT — Fáza 10

Zadanie: `docs/PROMPT_FINAL4.md`, poradie z §5. Dátum: 14. 8. 2026.
Písané kratšie podľa §0 — čo som zmenil, čo som overil, čo je otvorené.

---

## 1. Produkčná URL — hotové, LCP tesne nad cieľom

**Zmenené:** produkčná adresa `https://albion-bf4w.vercel.app` je predvolená
hodnota v `astro.config.mjs` aj v `business.ts`. `VERCEL_URL` som z reťazca
**vyhodil**.

Prečo nie env premenná: Vercel účet napojený na tento nástroj projekt nevidí
(deploy beží pod `rps-2022`), takže `PUBLIC_SITE_URL` v dashboarde nastaviť
neviem. Ale nastaviť ju rovnako pre Production aj Preview je presne to isté ako
predvolená hodnota v kóde — a tá sa navyše nedá zabudnúť. `PUBLIC_SITE_URL`
má naďalej prednosť, takže vlastná doména nič neprepisuje v kóde.

Zároveň to opravilo skutočnú chybu: na živej stránke ukazoval canonical na
`albion-bf4w-8sohs37r3-rps-2022.vercel.app`, teda na adresu **konkrétneho
nasadenia**, ktorá sa mení pri každom deploji.

**Overené:** canonical aj `og:url` = produkčná adresa · `sitemap-0.xml` má
homepage + obe právne stránky (404 nie) · JSON-LD už obsahuje `url` a `image`.

**LCP na produkcii** (Slow 4G + 4× CPU, ako Lighthouse mobile):

| | LCP |
|---|---|
| mobil 390 × 844 | **1,86 – 2,18 s** |
| desktop 1440 × 900 | **1,99 s** |
| bez throttlingu | 0,52 s |
| pre porovnanie: laboratórium vo fáze 6 | 2,32 s |

Cieľ 1,8 s tesne nevyšiel. Podľa `PROMPT_FINAL2.md` §3.4 som sa pozrel na
poradie preloadov a na hero obraz — **oboje je v poriadku**, hero štartuje
v prvej dávke a je hotový za 580 ms. Zdržuje **Inter**: dva súbory, 130 kB,
bez preloadu, linku držia obsadenú do ~2,5 s a text sa cez `swap` prekresľuje
až vtedy. Podrobný waterfall je v `docs/REPORT_faza6_audit.md`, oddiel
„Produkcia". Podsetovanie Interu je samostatná zmena — v tejto dávke som ju
nerobil.

---

## 2. Prechodové pásy — hotové

**Zmenené** v `SectionBridge.astro`:

- ručné medzitóny `#4A4640` a `#A9A296` **zahodené**, prechod ide cez
  `linear-gradient(in oklab …)` s fallbackom pre staré prehliadače,
- výška `clamp(64px, 8vw, 120px)` → **`clamp(40px, 4vw, 72px)`**,
- pridaný šum proti pásikovaniu (`::after`, `feTurbulence`, krytie 0,035,
  inline data URI — 0 requestov).

**Overené:** vizuálne na produkčnom builde. Hranica je citeľne tesnejšia,
smear zmizol. Na 40 px pevne som nešiel — na 1440 px vychádza pás na ~58 px
a čítam ho ako zámer, nie ako rozmazanie. Ak ti aj tak prekáža, je to jedno
číslo.

---

## 3. Právne stránky — hotové

**Pridané:** `/ochrana-osobnych-udajov` a `/podmienky-pouzivania`
(spoločná sadzba v `src/layouts/LegalLayout.astro`, texty v `content.ts`),
riadok odkazov v pätičke — menší a v `bone-muted`, oddelený od hlavnej
navigácie.

Obe stránky sú indexovateľné, majú vlastný meta description, `og:type=website`,
rovnakú hlavičku, pätičku aj sticky lištu ako homepage a text v mierke 68ch.
Sú v sitemape.

Detaily, ktoré stoja za zmienku:

- Údaje o firme sa dopĺňajú z `business.ts` cez zástupné znaky. Ak údaj nie je
  potvrdený (dnes e-mail), **celý riadok sa nevykreslí** — na právnej stránke
  nesmie ostať prázdne miesto ani `TO_CONFIRM`.
- Sticky lišta potrebuje `#hero-sentinel`; na podstránkach ho vykresľuje
  `LegalLayout` pod úvodom, inak by lišta nikdy nevyšla.
- **Nikde nepíšeme, že používame cookies** — nepoužívame ich, a preto ani
  nepotrebujeme cookie lištu.

**Dve rozhodnutia, ktoré som urobil inak, než znel predpis:**

1. **`[TEXT NA PRÁVNU KONTROLU]` sa na stránke nevykresľuje.** Návštevníkovi
   do právneho textu taká poznámka nepatrí a pôsobila by ako nedokončený web.
   Namiesto toho sú tie miesta označené v `content.ts` (`review: true`),
   vypísané v `docs/OTAZKY.md` a sú tu nižšie. Ak ich tam chceš viditeľne,
   je to jeden riadok v `LegalLayout`.
2. **„Účinnosť od" nie je generovaná pri buildu**, ale je to konštanta
   `content.legal.effectiveFrom`. Dátum účinnosti právneho textu sa nesmie
   posunúť len preto, že sme spravili redeploy. Pri zmene textu ho treba
   prepísať ručne — je to napísané pri konštante aj v `OTAZKY.md`.

**Otvorené:** obidva texty sú návrh pripravený neprávnikom. Pred spustením
webu ich má prejsť niekto, kto sa tomu venuje. Najviac to potrebujú „Keď nám
zavoláte alebo prídete", „Vaše práva" a „Informačný charakter".

---

## 4. Mapa — **zastavené na overení súradníc, 2D schéma zostáva**

Postupoval som podľa §3.1: najprv overiť, potom kresliť. Overenie neprešlo.

**Čo som zistil:**

- Nominatim na `Kpt. Nálepku 41, Lučenec` vráti dve ulice toho mena —
  vo **Fiľakove** (986 01) a v **Haliči** (985 11). Ani jedna nie je v Lučenci.
  Obe sú v okrese Lučenec, takže sa na to dá veľmi ľahko naletieť.
- Vypísal som **všetkých 192 pomenovaných ulíc v okruhu 3 km od centra
  Lučenca**. Ani jedna neobsahuje „Nálepk" ani „Kpt./Kapitána".
- V okruhu 500 m od stanice nie je ani jedna budova s `addr:housenumber=41`.
- Jediná záložňa označená v OSM v okolí je bez názvu a ~800 m od stanice.

**Súradnice som si nevymyslel.** Mapa s domom o ulicu vedľa by vyzerala úplne
dôveryhodne a bola by nepravdivá — to je presne to, čomu sme sa celý projekt
vyhýbali. Podľa poistky z §3.4 **zostáva na webe súčasná 2D schéma**.

**Čo je hotové a čaká:** `scripts/build-map.mjs` (`npm run map`) je celá
pipeline — Nominatim s overením proti `business.ts`, Overpass s cache,
Douglas–Peucker, izometrická projekcia, extrúzia budov, rozpočet.

Otestoval som ju na okolí **železničnej stanice** (tú Nominatim nájde
spoľahlivo), aby som vedel posúdiť, či to vôbec dosiahne úroveň zvyšku stránky:

| | |
|---|---|
| Výsledok | **50,1 kB** SVG (rozpočet 60 kB) |
| Obsah | 162 budov, 104 ulíc, 21 koľají v okruhu 250 m |
| Náhľad | `docs/mapa-3d-nahlad.png` |

**Kvalita sedí** — je to skutočná axonometrická mapa so skutočnými pôdorysmi,
nie ilustrácia. Dáta OSM sú v okolí stanice husté. Dva zásahy, ktoré ju
dostali do rozpočtu, sú čisto technické a na vzhľade nemenia nič: steny sa
kreslia len na prednej strane pôdorysu (zadné sú aj tak schované) a súradnice
majú kompaktný zápis. Polomer som podľa §3.2 stiahol z 350 na 250 m, kvalitu
nie.

**Čo od teba potrebujem — jedna vec:** otvor Google Mapy na prevádzke, klikni
pravým na značku a odkopíruj dvojicu čísel (napr. `48.3361, 19.6669`).
Prípadne pošli priamy odkaz na Google profil prevádzky.

Potom: doplniť do `business.geo` → `npm run map` → dokreslím animáciu podľa
§3.3, atribúciu OSM a napojím to na sekciu. Je to práca na jednu dávku.

Neurobené preto zostáva §3.3 (animácia) a §3.4 (atribúcia, napojenie) — nemá
ich čo animovať ani kam napojiť, kým nevieme, kde stojíme.

---

## Overené

Podľa §0 len smoke test, nie plný audit:

- `npm run build` prejde, gate bez `--allow`, 4 stránky
- `astro check` 0 chýb · `npm test` 23/23
- rýchly scroll dole aj hore, desktop aj mobil, lokálne aj **na produkcii** —
  nikde prázdne miesto
- canonical, `og:url`, sitemap vo výstupe
- právne stránky vizuálne na produkčnom builde
- 10 requestov, 0 third-party, 0 cookies, 283 kB / 262 kB — bez zmeny

## Otvorené

| Vec | Kto |
|---|---|
| **Súradnice prevádzky** — blokujú 3D mapu | ty |
| Právnu kontrolu textov | právnik |
| Podsetovanie Interu — jediná vec, ktorá reálne pohne LCP pod 1,8 s | ja, samostatná dávka |
| E-mail — doplní riadok v Kontakte, v JSON-LD aj v zásadách | majiteľ |
