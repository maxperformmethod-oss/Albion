# DÁVKA 15 — oprava svetlej sekcie, mapa

---

## 1. SEKCIA „ČO U NÁS MÔŽETE ZALOŽIŤ ALEBO PREDAŤ" — ROZLOŽENIE NEFUNGUJE

Pozrel som si náhľad. Kompozícia, ktorú som zadal v dávke 13, dopadla zle a beriem to na seba. Konkrétne štyri problémy:

1. **Nadpis vpravo a lead vľavo v rovnakej výške si konkurujú.** Oko nevie, kde začať čítať. Nadpis navyše zarovnaný doprava pri texte zarovnanom doľava vyzerá ako chyba sadzby.
2. **Pod nadpisom je obrovská prázdna plocha**, ktorá nič nenesie.
3. **Mriežka 3 × 3 pri 8 položkách** necháva posledné miesto prázdne a celok je odrhnutý.
4. **Duchové slovo `ZLATO` je orezané zdola** uprostred písmen. Nečíta sa ako zámer, ale ako chyba renderovania.

### Nové rozloženie

```
┌─────────────────────────────────────────────────────┐
│                                    Čo u nás môžete  │   nadpis vpravo hore
│                                 založiť alebo predať│   zarovnaný doprava
│                                                     │
│                     Toto sú veci, s ktorými k nám   │   lead POD nadpisom,
│                     ľudia chodia najčastejšie.      │   v tom istom stĺpci,
│                     Zoznam nie je uzavretý.         │   zarovnaný doprava
│                                                     │
├─────────────────────────────────────────────────────┤   zlatá vlasová linka
│                                                     │   cez celú šírku
│  01 Zlato a šperky   02 Hodinky   03 Mobily...      │   mriežka 4 stĺpce,
│  05 Náradie...       06 Autá...   07 Zberateľské... │   2 riadky, plná šírka
│                                                     │
│  Ak tu svoju vec nevidíte, neznamená to nie.        │
└─────────────────────────────────────────────────────┘
```

- Nadpis aj lead sú v **pravom stĺpci** (šírka 46 %), oba zarovnané doprava. Ľavá polovica hore zostáva prázdna zámerne — to je ten priestor, ktorý pôsobí draho.
- Pod nimi **zlatá vlasová linka cez celú šírku** ako predel.
- Mriežka **4 stĺpce × 2 riadky** — 8 položiek sa vyplní presne, žiadna diera.
- Pod 1024 px: 2 stĺpce. Pod 640 px: 1 stĺpec, nadpis a lead zarovnané doľava.

### Duchové slovo — pravidlo umiestnenia

Slovo smie prečnievať **len vodorovne cez jeden bočný okraj**, zvisle musí byť celé vnútri sekcie. Nikdy nesmie byť orezané vodorovnou hranou sekcie.

- `ZLATO` — presuň k **pravému okraju**, prečnieva doprava, základňa písma 64 px nad spodným okrajom sekcie
- `DOHODA` — k ľavému okraju, prečnieva doľava, rovnaké pravidlo

Ak sa slovo pri danej šírke nezmestí celé zvisle, zmenši ho — nie orež.

---

## 2. SVETLÉ SEKCIE — EŠTE ŽIVŠIE

Štyri veci navyše. Všetky lacné, žiadna nesmie zhoršiť kontrast pod 12:1.

### 2.1 Zvislý teplý prechod v ploche

Podklad svetlej sekcie nech nie je jedna farba:

```css
background-image: linear-gradient(to bottom,
  color-mix(in oklab, var(--color-paper) 100%, white 4%) 0%,
  var(--color-paper) 55%,
  var(--color-paper-2) 100%);
```

Hore o čosi svetlejšie, dole o čosi hlbšie. Simuluje to dopad svetla zhora a plocha okamžite prestane byť plochá.

### 2.2 Položky mriežky reagujú

Na desktope, pri prejdení myšou nad položkou:

- vlasová linka nad ňou prejde z teplej šedej na `--color-gold`, 180 ms
- číslo `01`–`08` zosilnie z `--color-gold-ink` na plnú sýtosť
- text položky sa posunie o **2 px doprava**

Nič viac. Žiadne pozadie, žiadny tieň, žiadne zväčšenie. Na dotykových zariadeniach sa hover neaplikuje.

### 2.3 Číslovanie výraznejšie

Čísla `01`–`08` sú teraz príliš potichu. Zväčši ich o dva stupne a daj im `letter-spacing: 0.08em`. Sú to jediné číslice na svetlej ploche a nesú rytmus.

### 2.4 Zlatý nábeh aj do druhého rohu

Okrem pravého horného pridaj **druhý, slabší nábeh v ľavom dolnom rohu**, `opacity` polovičná oproti hornému, zrkadlovo otočený. Plocha tak má dva zdroje tepla namiesto jedného a pôsobí to menej jednostranne.

---

## 3. MAPA

### 3.1 Posunúť značku vyššie

Značku posuň o **15 m na sever** (v izometrii teda vizuálne hore-doprava). Po posune znova spusti priradenie budovy — ak teraz padne do pôdorysu alebo do 25 m, zvýrazni ju. Ak nie, nechaj len bod a žiaru, ako doteraz.

### 3.2 Názvy budov

Chceš mená ako v Google. Urobíme to, ale zo zdroja, ktorý vieme overiť a ktorý sa nemení pod rukami.

**Postup:**

1. Rozšír Overpass query o **všetky pomenované body a plochy** v bboxe:

```overpassql
nwr(area.a)["name"]["shop"];
nwr(area.a)["name"]["amenity"];
nwr(area.a)["name"]["office"];
nwr(area.a)["name"]["tourism"];
```

2. Vypíš mi do reportu **celý zoznam, čo sa našlo**, aj s typom. Chcem vidieť, s čím pracujeme.
3. Z neho vyber **maximálne 6 popisov okrem Albionu**, podľa toho, čo je v Lučenci orientačný bod: stanice, supermarket, lekáreň, drogéria, banka, pošta, kostol, škola.
4. **Vylúč:** záložne a zastavárne (konkurencia), taxi služby, malé prevádzky bez rozpoznateľného mena.

**Prečo nie priamo z Google:** názvy z cudzej mapy nevieme overiť, nemáme k nim súradnice a museli by sme ich umiestňovať odhadom. Celý projekt sme si strážili, aby sme nič neumiestňovali odhadom, a nemá zmysel to porušiť na poslednom prvku. OSM názvy prídu aj so súradnicami.

Ak sa v OSM ukáže, že pomenovaných bodov je málo, napíš to — potom sa rozhodneme, či to za doplnenie stojí.

**Sadzba popisov** zostáva podľa dávky 14: Albion najväčší serifom, ostatné o dva stupne menšie sansom, halo pod všetkými, prekrývajúce sa popisy sa vynechávajú, neposúvajú.

---

## 4. ZOZNAM PRED SPUSTENÍM

Vytvoril som `docs/LAUNCH_CHECKLIST.md` — všetko, čo treba mimo kódu, aby sme mohli ísť online. Prečítaj si ho, nech vieš, čo sa ešte bude diať, a doplň doň, ak niečo z technickej strany chýba.

---

## 5. PORADIE

1. §1 rozloženie sekcie + duchové slovo (najviditeľnejšie)
2. §2 živšie svetlé sekcie + meranie kontrastu
3. §3.1 posun značky
4. §3.2 popisy — najprv vypíš zoznam z OSM, potom vyber
5. `git push`

Report do `docs/REPORT_faza21.md` + náhľad opravenej svetlej sekcie a mapy.
