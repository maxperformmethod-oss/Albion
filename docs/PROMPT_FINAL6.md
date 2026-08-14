# FINÁLNA DÁVKA 6 — súradnice a vzťahová vrstva

> Pre Claude Code. §1 je hotová vec, §2 obsahuje dve tvrdenia, ktoré čakajú na potvrdenie majiteľom — **čítaj §2.0 skôr než čokoľvek napíšeš na stránku.**

---

## 1. SÚRADNICE — POTVRDENÉ, MAPA JE ODBLOKOVANÁ

Z odkazu na Google profil prevádzky:

```ts
geo: { lat: 48.334768, lng: 19.667564 },
```

To je poloha značky, nie stred výrezu. Doplň do `business.ts` — `geo` už **nie je** `TO_CONFIRM` a pridá sa do JSON-LD.

**Vylepši aj `mapsUrl`.** Doteraz to bol vyhľadávací odkaz. Teraz máme priamy odkaz na kartu prevádzky vrátane recenzií a hodín:

```ts
mapsUrl: "https://maps.google.com/?cid=17146046179967197220",
```

### Dôsledky pre mapu

1. Bbox centruj na tieto súradnice, nie na stred ulice.
2. **Bod Albion teraz kresli presne** — máme súradnicu. Zvýraznenie celej ulice z `PROMPT_FINAL5.md` §1.2 už netreba, ale ulicu Kpt. Nálepku nechaj o stupeň svetlejšiu než ostatné.
3. Trasu od stanice veď k tomuto bodu.
4. Over, či nájdená ulica z Overpassu skutočne prechádza pri týchto súradniciach. Ak nie, zastav a napíš mi to.

---

## 2. VZŤAHOVÁ VRSTVA — „RODINNÁ FIRMA"

### 2.0 Najprv to nepríjemné

Padli dve tvrdenia: **rodinná firma** a **prvá záložňa v Lučenci**. Obe sú silné. Obe sú aj rizikové, tak ich rozdelím:

| Tvrdenie | Stav | Rozhodnutie |
|---|---|---|
| Rodinná firma | čaká na potvrdenie | pripravené za flagom, nasadí sa po potvrdení |
| **Prvá záložňa v Lučenci** | **nepoužijeme** | viď nižšie |
| Od roku 2001 | podložené zápisom do OR (15. 10. 2001) | nasadí sa po potvrdení majiteľom |

**Prečo „prvá v Lučenci" nenapíšeme:** je to porovnávacie tvrdenie voči konkurencii. Ak ho niekto spochybní — a Breva má dôvod — nemáme ho čím doložiť. Zadanie projektu to navyše zakazuje explicitne. Riziko nie je len právne: keby to raz niekto verejne vyvrátil, stratíme presne tú dôveryhodnosť, na ktorej celý web stojí.

**Čo je namiesto toho rovnako silné a bezpečné:** „od roku 2001" a „rodinná firma". Konkrétny rok pôsobí presvedčivejšie než superlatív a nikto ho nespochybní. Dvadsaťpäť rokov na jednom mieste povie to isté, čo „prvá", len bez rizika.

### 2.1 Otázky pre majiteľa — do `docs/OTAZKY.md`

1. Je Albion rodinná firma? (Kto v nej pracuje — manžel/manželka, deti, súrodenci?)
2. Potvrdzuje rok 2001 ako začiatok pôsobenia v Lučenci?
3. Súhlasí s osobným odkazom v jeho mene? (znenie v §2.4)
4. Môžeme uviesť jeho meno a krstné meno pri odkaze?

### 2.2 Flag

```ts
export const FEATURES = {
  familyBusiness: false,   // prepnúť na true po potvrdení
  ownerNote: false,        // osobný odkaz majiteľa
};
```

Kým je `familyBusiness: false`, slovo „rodinná" sa nikde nevykreslí. Žiadne dočasné texty na produkcii.

### 2.3 Kde sa vzťah buduje — tri krátke miesta, nie odstavce

Ľudí nechytí dlhé rozprávanie o histórii. Chytí ich **jedna konkrétna veta na správnom mieste**.

**a) Pás pod hero** — nový tenký blok, `ink-800`, výška ~72 px, jeden riadok na stred, zlatá vlasová linka nad aj pod.

```
familyBusiness && foundedYearConfirmed:
   Rodinná firma. V Lučenci od roku 2001.

len foundedYearConfirmed:
   V Lučenci od roku 2001.

ani jedno:
   pás sa nevykreslí vôbec
```

Sadzba: serif 600, `--text-h3`, `letter-spacing: -0.01em`. Nič viac v tom páse nie je.

**b) „Prečo ľudia chodia práve k nám", bod 2** — nahraď znenie z `PROMPT_FINAL5.md`:

```
familyBusiness = true:
   Nadpis: Rodinná firma, nie pobočka
   Text:   Nie sme článok reťazca, ktorý sa o rok presunie inam. Toto
           miesto je naše jediné a stojí za ním rodina, nie centrála.

familyBusiness = false:
   ponechaj znenie z FINAL5 („Jedna prevádzka, nie pobočka")
```

**c) Osobný odkaz majiteľa** — nový blok medzi „Prečo Albion" a „Kde nás nájdete". Podklad `ink-900`, text v ľavých 62 %, vpravo priestor pre fotku majiteľa (zatiaľ prázdny).

### 2.4 Znenie osobného odkazu — NÁVRH, ČAKÁ NA SCHVÁLENIE

⚠ Toto sú slová vložené majiteľovi do úst. **Bez jeho výslovného súhlasu sa nepublikuje** (`ownerNote: false`).

```
eyebrow:  Slovo majiteľa

citát:    „Za tie roky sem prišlo veľa ľudí. Jedni si potrebovali
          požičať do výplaty, druhí predať niečo, čo doma roky ležalo.
          Nikoho som sa nepýtal prečo. Možno aj preto sa vracajú."

podpis:   [meno majiteľa], Albion
```

Sadzba: serif 600, `--text-h3`, kurzíva **nie**. Úvodzovky slovenské („"). Podpis `--text-small`, `--color-bone-muted`, nad ním krátka zlatá linka 40 px.

Ak majiteľ znenie zmení, použi jeho verziu doslova. Je to jeho hlas, nie náš.

### 2.5 Čo do vzťahovej vrstvy NEPATRÍ

Žiadne „sme tu pre vás", „vaša spokojnosť", „ako jedna veľká rodina", žiadne stock fotky usmiatych rodín, žiadny odstavec o histórii firmy, žiadne roky v číselnom počítadle. Vzťah sa buduje konkrétnosťou a stručnosťou, nie dojímaním.

**Strop:** vzťahová vrstva sú **tri prvky spolu do 60 slov**. Ak to prekročíš, je to príbeh o nás namiesto ponuky pre zákazníka.

---

## 3. PORADIE

1. §1 súradnice + `mapsUrl` + JSON-LD `geo`
2. §1 mapa s presným bodom
3. §2.2 flagy + §2.3 tri bloky za flagmi (na produkcii zatiaľ neviditeľné)
4. §2.1 otázky do `OTAZKY.md`
5. `git push`

Report do `docs/REPORT_faza12.md`, stručne.
