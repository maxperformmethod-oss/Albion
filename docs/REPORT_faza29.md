# REPORT — fáza 29 (dávka 23)

Zadanie: `docs/PROMPT_FINAL23.md`. Postup podľa §4.

V tomto pushi ide von aj **dávka 22** (`docs/REPORT_faza28.md`) a predchádzajúci
commit s fotkou vchodu, ktorý ešte nebol na `origin`.

---

## §2 — Dávka 21 naozaj nebola zapracovaná

Mal si pravdu. V repe z nej nebolo **nič** — prerušil si ma pred prvou zmenou
a potom si povedal robiť len dávku 22. Dokončil som ju teraz celú, s jednou
výnimkou, ktorú vysvetľujem nižšie.

### §1 dávky 21 — autá preč

Grep našiel **20 výskytov** v 5 súboroch:

| Súbor | Výskytov | Čo |
|---|---|---|
| `src/data/content.sk.ts` | 4 | meta popis, hero lead, položka mriežky, veta v „Zvláštnej veci“ |
| `src/data/content.hu.ts` | 4 | to isté po maďarsky |
| `src/data/content.en.ts` | 4 | to isté po anglicky |
| `docs/BRIEF.md` | 7 | plánovaná podstránka, zoznam „prijíma“, lead, položky mriežky, bod „netypické veci“, meta popis, SEO mapovanie |
| `docs/LAUNCH_CHECKLIST.md` | 1 | plánovaná podstránka `/auta` |

Po oprave grep nevracia nič okrem dvoch vecí, ktoré tam ostať majú:

- `Autobusová stanica` / `Autóbuszállomás` v mape a v popisoch okolia — je to
  orientačný bod, nie služba.
- Jedna nová veta v `content.sk.ts` a jedna v `BRIEF.md`, ktoré hovoria, že
  **vozidlá NEberieme**. Napísal som ich zámerne: bez nich by niekto o pol roka
  autá podľa pôvodného zadania zase pridal.

V `BRIEF.md` som SEO kľúčové slovo `založenie auta Lučenec` nahradil za
`záložňa zlato Lučenec` — sekcia 3 nejaké kľúčové slovo mať má a zlato je teraz
to, čo je v nej dvakrát.

### §2 dávky 21 — zlato dopredu

Mriežka je nová vo všetkých troch jazykoch, `Zlomkové zlato` = `tört arany`
= `scrap gold` ako doteraz. Zostala 4 × 2 — diera po vozidlách sa zaplnila
rozdelením zlata na dve položky.

Prepísaný je aj hero lead a odsek v „Zvláštna vec ešte neznamená problém“.
Odstránenie áut ubralo ďalších **7 slov**, ako si predpokladal v §5.

### §3 dávky 21 — hero maska: NEROBIL SOM

**Zámerne.** Celá tá sekcia riešila, ako nastaviť masku nad celoplošnou fotkou
— eliptické krytie, `object-position: 62%`, hero vyššie o 12 %, premeranie
kontrastu. §1 tejto dávky to celé ruší: *„Prestávame to riešiť krytím.“*
Zapracovať 21 §3 a hneď nato 23 §1 by znamenalo tú istú vec dvakrát prepísať
a druhýkrát zahodiť.

Čo z 21 §3 stále platí a je splnené: kontrast H1 je premeraný (nižšie) a mobil
je skontrolovaný zvlášť.

### §4 dávky 21 — otázky

Do `docs/OTAZKY.md` pridaný bod **„Originál fotky vchodu a originál videa“**,
vrátane požiadavky nafotiť na šírku a poslať e-mailom alebo cez Disk, nie cez
Messenger. Video `568×320` je v tom istom bode.

Doplnil som k tomu jednu vetu navyše: po tejto dávke je fotka vo vlastnom
paneli a **vidno ju celú a nezakrytú**, takže na jej kvalite záleží viac než
predtým, keď ležala pod maskou.

---

## §1 — Hero na dva panely

Mal si pravdu v diagnóze. Problém nebol v nastavení masky, ale v tom, že vchod
aj text sedeli na tom istom mieste. Dva panely to riešia tým, že sa prestanú
prekrývať.

### Desktop (≥ 1024 px)

- text 52 % vľavo na plnom `ink-900`, fotka 48 % vpravo
- **žiadna maska nad fotkou, žiadny gradient cez text**
- na styku panelov 40 px prechod do tmavej, presne ako v zadaní
- `object-position: center`

Overené na štyroch šírkach — panely sa nikde neprekrývajú a medzi textom
a hranou fotky ostáva rezerva:

| šírka okna | koniec textu | začiatok fotky | rezerva |
|---|---|---|---|
| 1024 px | 483 px | 525 px | 41 px |
| 1440 px | 680 px | 741 px | 61 px |
| 1920 px | 935 px | 991 px | 55 px |

**H1 začína presne tam, kde nadpisy sekcií nižšie** — namerané, všetky štyri
na 145 px pri okne 1440. Preto je textový panel v bežnom `container-page`
a nie v stĺpci s odsadením počítaným z `vw`; tam by to o pár pixelov ušlo.

### Mobil (< 1024 px)

Text prvý, fotka pod ním na plnú šírku v pomere **4:3**, nezakrytá. Namerané
390 × 293 px, pomer 1,333. `aspect-ratio` drží miesto ešte pred načítaním,
takže nevzniká posun layoutu.

Fotka je v DOM za textom, takže sa na mobile skladá pod neho prirodzene
a nepotrebuje `order`.

### Výrezy fotky sa prerobili

Toto v zadaní nebolo, ale bez toho by §1 nesplnilo svoj vlastný cieľ.
Doterajšie výrezy boli 16:9 a 4:5, teda podľa breakpointu. Nové panely majú
iné tvary: pravý panel je takmer štvorcový (0,87–1,31 podľa šírky okna),
mobilný blok je 4:3. Starý 16:9 by `cover` v takmer štvorcovom paneli orezal
po stranách a z vchodu by ostal výsek — presne to, čomu sa dávka vyhýba.

Nové výrezy sú **podľa tvaru plochy, nie podľa breakpointu**:

| | výrez | zdroj y | AVIF | rozmer |
|---|---|---|---|---|
| pravý panel, desktop | **1:1** | 945–2235 | `hero-panel-1100` 51 kB · `hero-panel-700` **28 kB** | 1100×1100 · 700×700 |
| pod textom, mobil | **4:3** | 1106–2073 | `hero-wide-760` **26 kB** · `hero-wide-480` 14 kB | 760×570 · 480×360 |

Oba držia celé dôležité pásmo (y 1180–2000): dvere, markízu s nápisom, banner
„PENIAZE IHNEĎ“ aj žltú tabuľu „ZÁLOŽŇA“.

Staré `hero-1280`, `hero-760`, `hero-m-760`, `hero-m-480` som **zmazal** —
už na ne nič neodkazuje. Preload v `BaseLayout.astro` je prepísaný na nové
súbory a jeho hranica posunutá z 768 na **1024 px**, aby sedela s `media`
v `Hero.astro`; inak by si prehliadač preloadol jeden súbor a použil druhý.

### Kontrast

`check-hero-contrast.mjs` je prepísaný podľa zadania — meria text voči podkladu
panela, nie voči fotke. Zo skriptu tým vypadlo skladanie obrazu s dvoma maskami
a hľadanie najsvetlejšieho pixelu; ostala kontrola palety.

| token | predtým (nad fotkou) | teraz (na paneli) | cieľ |
|---|---|---|---|
| `bone` (H1) | 13,17:1 | **14,86:1** | 12:1 |
| `bone-muted` | — | 8,09:1 | 4,5:1 |
| `gold` | — | 8,07:1 | 4,5:1 |

Skript som nechal, hoci je teraz triviálny: je to poistka na paletu. V hlavičke
súboru je napísané, že **keby sa hero niekedy vrátilo k fotke pod textom, tento
skript prestane stačiť** a meranie na pixeloch sa musí vrátiť — dá sa vziať
zo sesterského `check-section-contrast.mjs`.

### Jedna vec, ktorú si zadanie nevšimlo

Po rozdelení na panely sa objavila regresia, ktorú predtým maskovala maska.
Hlavička je hore priehľadná a stmavne až po odscrollovaní. Nad pravým panelom
je ale obloha, takže odkaz `Kontakt` (`bone-muted`) na nej mal kontrast
**1,20:1** — nečitateľný.

Skúsil som najprv gradient cez horný pás fotky. Dvihol to len na **3,59:1**,
stále pod AA, a aby to stačilo, musel by byť taký hustý, že by z neho bol
čierny pruh — a to je zase maska cez fotku.

Riešenie: **fotka začína až pod hlavičkou** (`top: 5rem`). Hlavička sa tým celá
vráti na plný `ink-900` (8,09:1) a cez fotku nejde nič. Je to bližšie k duchu
§1 než akýkoľvek gradient.

---

## §3 — Poriadok v priečinku

**1. Repo je tam, kde má byť.** `C:\Dev\albion\.git` existuje, `git log` beží:

```
64a9654 feat: fotka vchodu v hero, riadok faktov, kratsie texty
e0bb9eb feat: poznamka pri telefone a vymedzenie voci zmenarni
16ea00a feat: konkretne podriadky sluzieb, zaloha vs vykup, predaj
eb6dacd fix(mapa): citatelnejsia severka, Pizzeria Hacienda von
b608c85 fix(mapa): vratene posuny, pravidlo lomu 140, budova z 40 m
```

**2. Starý priečinok nie je na ploche.** Na ploche nie je vôbec — je v OneDrive:

```
C:\Users\Maxim\OneDrive\Počítač\Albion
```

`Get-ChildItem -Force` vrátil dve položky, spolu 20,1 kB:

```
d-----  14. 8. 2026 15:35   .claude
-a----  14. 8. 2026  9:24   PLAN.md   14 258 B
        \.claude\settings.json          6 334 B
```

**`.git` tam NIE JE.** Žiadna iná história teda neexistuje — to je aj odpoveď
na to, prečo sa Git Graph neotvára.

**3. Nie je tam nič užitočné — môžeš ho zmazať.** Ja som ho nemazal.
Porovnal som oba súbory proti repu:

- **`PLAN.md`** je pôvodný návrh v1 *(„Stav: návrh, čaká na potvrdenie“,
  koreň projektu `C:\Users\Maxim\OneDrive\Počítač\Albion`)*. V repe je jeho
  schválený nástupca v2 *(„Stav: schválené, Fáza 1 sa realizuje“, koreň
  `C:\Dev\albion` (mimo OneDrive))*. Prešiel som všetky súbory, ktoré starý
  plán spomína — **každý jeden v repe existuje**, čiže nič neimplementované
  v ňom nevisí.
- **`.claude\settings.json`** má 70 položiek, repo 108. Všetkých 68 rozdielov
  sú jednorazové povolenia príkazov z prvých sedení — odkazujú na starú
  OneDrive cestu a na `scripts/build-hero.mjs`, ktorý už neexistuje. Nič
  z projektu.

**4. `albion.code-workspace`** vytvorený v koreni repa presne podľa zadania.

**5. `README.md`** má tri riadky na úplnom začiatku, pred nadpisom.

> **Pre Maxima:** ak sa Git Graph neobjaví ani po otvorení workspace súboru,
> rozšírenie nie je nainštalované — v paneli Extensions vyhľadaj `Git Graph`
> od `mhutchie`.

---

## Kontroly

| | výsledok |
|---|---|
| `npm run check` | 0 errors, 0 warnings |
| `npm test` | 23/23 prešlo |
| `npm run build` | prešiel, žiadny placeholder v HTML |
| `npm run contrast` | hero aj všetkých 5 sekcií nad cieľom |

### Váha stránky

Merané v čistom izolovanom kontexte prehliadača, s vypnutou cache, po prejdení
celej stránky.

| | desktop 1440 px | mobil 390 px |
|---|---|---|
| HTML (vrátane inline CSS) | 28,3 kB | 28,3 kB |
| fonty | 222,1 kB | 222,1 kB |
| obrazy | 92,3 kB | 72,6 kB |
| **spolu** | **342,7 kB** | **323,0 kB** |

Strop je 400 kB. Desktop **klesol** z 352,1 kB po dávke 22 — nový štvorcový
výrez v paneli je pri 1440 px menší (28 kB) než bývalý celoplošný 16:9 (37 kB).

Najväčšia položka sú stále fonty, 222 kB čiže 65 %. Obrazy sú dokopy tretina
toho.

---

## Čo zostáva otvorené

- **Originál fotky a videa** — nový bod v `OTAZKY.md`. Fotka je teraz vidieť
  celá a nezakrytá, takže na jej kvalite záleží viac než predtým.
- **Textúry `tex-gold-*` a `tex-panel-*` sú nepoužité.** Nesťahujú sa, ale
  ležia v repe. Píšem to druhý raz, lebo to stále platí — jeden commit a sú
  preč, keď povieš.
- **Starý priečinok v OneDrive** čaká na tvoje zmazanie.
