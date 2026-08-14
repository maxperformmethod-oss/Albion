# FINÁLNA DÁVKA 5 — mapa odblokovaná, teplejšia paleta, prepísané texty

> Pre Claude Code. Pravidlo §0 z `PROMPT_FINAL4.md` platí — over len to, čo meníš.

---

## 1. MAPA — ULICA V OSM EXISTUJE, HĽADALO SA ZLE

Tvoj záver, že si súradnice nevymyslíš, bol správny. Ale ulica v OSM **je** — len ju Nominatim nenašiel, lebo si hľadal celú adresu s číslom domu.

Overené: `Kpt. Nálepku` je v OSM v Lučenci vedená ako ulica dlhá **~158 m**, a železničná stanica Lučenec má uzol **`node/8294228024`**. Číslo domu 41 zamapované nie je — preto zlyhalo hľadanie adresy, nie ulice.

### 1.1 Ako dáta získať

Nepoužívaj Nominatim na adresu. Choď priamo na Overpass a hľadaj **pomenovanú cestu**:

```overpassql
[out:json][timeout:30];
area["name"="Lučenec"]["boundary"="administrative"]->.a;
(
  way(area.a)["highway"]["name"~"Nálepku"];
  node(8294228024);
);
out geom;
```

Ak by regex nesadol, skús varianty názvu: `Kpt. Nálepku`, `Kapitána Nálepku`, `Nálepkova`. Vypíš, čo Overpass vrátil, a **až potom** kresli.

Stred bboxu = stred nájdenej ulice. Bbox 350 m ako predtým.

### 1.2 Ako označiť Albion bez vymýšľania

Súradnice čísla 41 nemáme. **Nekresli teda bodovú značku na odhadnuté miesto.** Namiesto toho:

- **Zvýrazni celú ulicu Kpt. Nálepku** zlatou farbou po celej dĺžke, výraznejšie než ostatné ulice.
- Popis pri nej: `Kpt. Nálepku 41` v serif 600.
- Trasa od stanice sa nakreslí **k začiatku tejto ulice**, nie k bodu.

Ulica má 158 m — zvýraznenie celej ulice je presné a pre návštevníka rovnako použiteľné ako pin. A hlavne nič neklame.

Keď mi majiteľ pošle presné súradnice, doplníme bod a `business.geo` do JSON-LD. Dovtedy `geo` v JSON-LD vynechaj.

### 1.3 Zvyšok

Ostatné (izometrická extrúzia, animácia „mesto sa postaví", atribúcia OSM, rozpočet 60 kB, poistka) platí podľa `PROMPT_FINAL4.md` §3. Pipeline máš hotovú a náhľad si sám vyhodnotil ako dostatočný — tak ju nasaď.

Zachovaj tlačidlo `Otvoriť v Google Mapách` aj textovú adresu pod mapou.

---

## 2. PALETA — MENEJ ČIERNA, VIAC LUXUS

Tmavé sekcie sú stále príliš uhlíkové. Zdvihni ich a oteplí zlato. Prepočítané, všetko prechádza AA.

```css
@theme {
  --color-ink-900: #1A1D22;   /* bolo #14171B */
  --color-ink-800: #22262C;   /* bolo #1B1F23 */
  --color-ink-700: #2C3138;   /* bolo #242830 */

  --color-paper:   #F3EFE7;
  --color-paper-2: #E8E2D7;

  --color-bone:       #F3F0EA;
  --color-bone-muted: #B8B3A9;
  --color-ink-text:   #191C20;
  --color-ink-muted:  #585D63;

  --color-gold:       #C9B085;   /* teplejšie, plnšie */
  --color-gold-hover: #DCC7A3;
  --color-gold-ink:   #7A6438;

  --color-border-interactive-dark:  #77736A;
  --color-border-interactive-light: #827D74;
}
```

| Dvojica | Pomer |
|---|---|
| bone / ink-900 | 14.86 ✅ |
| bone-muted / ink-900 | 8.09 ✅ |
| gold / ink-900 | 8.07 ✅ |
| gold / ink-800 | 7.26 ✅ |
| bone / ink-700 | 11.51 ✅ |
| ink-text / paper | 14.91 ✅ |
| ink-muted / paper | 5.79 ✅ |
| gold-ink / paper | 4.94 ✅ |
| border-dark / ink-800 | 3.22 ✅ |
| border-light / paper | 3.57 ✅ |
| ink-900 na zlatom tlačidle | 8.07 ✅ |
| gold / paper | 1.83 ❌ naďalej zakázané |

Po zmene prebehni `scripts/check-hero-contrast.mjs` — ak H1 klesne pod 12:1, priplus krytie masky.

---

## 3. SVETLÉ SEKCIE — MUSIA VYZERAŤ ROVNAKO DRAHO

Svetlé sekcie sú teraz čistý plochý podklad a pôsobia prázdnejšie než tmavé. Upresňujem predchádzajúce pravidlo: **fotografie do svetlých sekcií naďalej nepatria, ale materiál áno.**

1. **Papierové zrno.** Na `.section--paper` pridaj rovnaký `feTurbulence` overlay ako v prechodoch, `opacity: .028`, `mix-blend-mode: multiply`. Nevidno ho vedome, ale plocha prestane pôsobiť ako prázdny div.
2. **Teplý vinetáž zhora.** `background-image: radial-gradient(120% 80% at 20% 0%, rgba(255,252,245,.7) 0%, transparent 60%)` nad `--color-paper`. Simuluje svetlo dopadajúce zľava hore — to je to, čo robí papier drahým.
3. **Číslovanie položiek.** V „Čo u nás môžete založiť alebo predať" daj nad každú položku malý index `01`–`08` v štýle eyebrow, farba `--color-gold-ink`. Okamžite to vyzerá ako katalóg, nie ako zoznam.
4. **Kroky v „Ako to funguje"** dostanú veľké serifové číslo `1 · 2 · 3` v `--text-display` s `opacity: .12`, položené za textom kroku.
5. **Vlasové linky v svetlých sekciách** prehoď z neutrálnej na `rgba(122,100,56,.18)` — teplý odtieň zlata namiesto sivej. Rozdiel je nenápadný a zásadný.
6. Kde je v svetlej sekcii veľa prázdna, použi panel `--color-paper-2` s rádiusom 4 px namiesto nič.

---

## 4. ZLATÝ OBRAZ

Teplá zlatá textúra je hotová — satén, tlmené svetlo, nie žltá a nie lesklá. Dva varianty:

```powershell
$b = "https://d8j0ntlcm91z4.cloudfront.net/user_3GopSFcHY8NWG3H4F9dFL9Yn8d6/"
# variant A
Invoke-WebRequest -OutFile src\assets\raw\tex-gold-a.png "$b`hf_20260814_210508_52927646-9143-48e8-b154-c809315aa1e5.png"
# variant B
Invoke-WebRequest -OutFile src\assets\raw\tex-gold-b.png "$b`hf_20260814_210508_2dd317ac-1f02-4be9-87c4-1441479a08c1.png"
```

Stiahni oba, sprav z oboch náhľad po gradingu a **vyber ten, kde svetlo plynie mäkšie a nevzniká ostrý pruh**. Rozhodni sám — sú z rovnakého promptu, rozdiel bude malý.

Grading tohto obrazu je iný než u ostatných textúr: **nestmavuj ho na 0.62.** Má zostať svetlejší a teplejší (`brightness ~0.78`, `saturation 0.9`), aby si zlato zachovalo. Kontrast textu nad ním rieš maskou, nie stmavením obrazu.

Použije sa **na jednom mieste**: sekcia „Individuálne ocenenie", kde je teraz variant 1. Zlato tam patrí obsahovo aj vizuálne a bude to najvýraznejší bod stránky po hero.

Ostatné textúry zostávajú, kde sú. **Nepridávaj zlatý obraz na viac miest** — jeho sila je v tom, že je jeden.

---

## 5. TEXTY — PREPÍSANÉ, BEZ OPAKOVANIA

Našiel som päť miest, kde sa tá istá myšlienka hovorí druhýkrát. Znie to potom ako text generovaný strojom, ktorý nevie, čo už povedal.

Konkrétne sa opakovalo: „ozvite sa" 3×, „nič neplatíte" 2×, „schválenie z centrály" 2×, „rozhoduje majiteľ" 2×, „ak to má hodnotu" 2×.

**Nahraď tieto reťazce v `content.ts` presne takto. Nič neupravuj a nič nepridávaj.**

### Hero — mikrotext pod CTA
```
bolo:  Osobne · Diskrétne · Bez čakania na schválenie z centrály
nové:  Osobne · Diskrétne · Bez objednania
```

### „Čo u nás môžete založiť alebo predať" — záverečný riadok
```
bolo:  Nenašli ste svoju vec? To ešte nič neznamená — ozvite sa.
nové:  Ak tu svoju vec nevidíte, neznamená to nie. Znamená to, že sa
       na ňu treba pozrieť.
```

### „Individuálne ocenenie" — celá sekcia
```
eyebrow: Individuálny prístup
H2:      Zvláštna vec ešte neznamená problém.

P1: Reťazce majú cenník a zoznam povolených kategórií. My máme oči
    a odchodené roky. Pri každej veci sa pozeráme na to, čo naozaj je
    a v akom je stave — nie na to, či sa zmestí do kolónky.

P2: Preto sa vieme baviť aj o strojoch, o aute, o veciach vyššej
    hodnoty, aj o niečom, čo ste zdedili a netušíte, čo s tým.

CTA: Zavolať a opýtať sa
```

### „Ako to funguje" — krok 3
```
bolo:  Ak vám to sedí, vybavíme to na mieste. Ak nie, nič sa nedeje
       a nič neplatíte.
nové:  Ak vám to sedí, vybavíme to na mieste. Ak nie, poďakujeme sa
       a rozídeme sa v dobrom.
```

### „Prečo ľudia chodia práve k nám" — všetky štyri body
```
1. Za pultom stojí majiteľ
   Nemusí nikam volať a na nič sa pýtať. Čo si s ním dohodnete, to platí.

2. Jedna prevádzka, nie pobočka
   Nie sme článok reťazca, ktorý sa o rok presunie inam. Toto miesto je
   naše jediné a chceme v ňom stáť aj o desať rokov.
   [ak foundedYearConfirmed === true, pred prvú vetu vlož:
    V Lučenci pôsobíme od roku {foundedYear}.]

3. Ide to rýchlo
   Prídete, pozrieme sa, dohodneme sa. Bez objednávania a bez čakania,
   kým to niekto niekde schváli.

4. Diskrétnosť
   Čo sa dohodne u nás, ostáva u nás. Nepýtame sa na to, čo sa nás netýka.
```

### Kontakt — lead
```
bolo:  Zavolajte alebo jednoducho prídite. Pozrieme sa na vec, povieme
       vám sumu a rozhodnete sa vy. Opýtať sa nič nestojí.
nové:  Zavolajte alebo jednoducho prídite. Vec si pozrieme pri vás
       a sumu sa dozviete hneď, nie o dva dni.
```

H2 `Poďme sa o tom porozprávať.` zostáva.

### Pravidlo pre budúcnosť

Každá sekcia má povedať **jednu vec, ktorú ostatné nepovedali**. Hero = čo a kde. Zoznam = šírka. Ocenenie = zvláštne prípady. Postup = priebeh. Prečo = rozdiel oproti reťazcom. Kontakt = pozvanie. Ak vetu vieš presunúť do inej sekcie bez straty, patrí len do jednej z nich.

---

## 6. PORADIE

1. §5 texty (najrýchlejšie, najviditeľnejšie)
2. §2 paleta + kontrola kontrastu hero
3. §3 svetlé sekcie
4. §1 mapa
5. §4 zlatý obraz, keď pošlem URL
6. `git push`

Report do `docs/REPORT_faza11.md` — stručne.
