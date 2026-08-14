# DÁVKA 12 — commit mapy, poloha, prechody, zlato, jazyky

> Pre Claude Code. Rozhodnutia sú urobené, nič z toho už nie je otvorené.

---

## 1. MAPU COMMITNI

Náhľad je v poriadku. Čísla sú výborné — vrstva A 8,1 kB namiesto povolených 60 je lepší výsledok, než som čakal.

Nález s `opacity: 0` + `loading="lazy"` je dobrý úlovok. Prehliadač lazy obrázok mimo viewportu nesťahuje a s nulovou priehľadnosťou nemal dôvod ani potom — mapa by ostala bez podkladu a nikto by si to nevšimol, kým by sa niekto nepozrel na produkciu. Zapíš to do reportu ako poznatok, nech sa to nezopakuje pri ďalšom lazy prvku za animáciou.

---

## 2. POLOHA — ROZHODNUTÉ, PRESUNÚŤ

**Bod presuň na budovu oproti autobusovej stanici** — tú, ktorú našla heuristika (`building=roof`, 294 m²).

Majiteľ pozná svoju prevádzku lepšie než OSM tagy. To, že je objekt v OSM označený ako prístrešok, znamená pravdepodobne len to, že ho tam niekto zle otagoval — v tejto časti Lučenca sú dáta zjavne neúplné, čo sme videli už pri názve ulice.

**Zruš obe poistky z dávky 17 pre tento konkrétny prípad:**

- `building=roof` sa smie použiť ako kotva, ak ho vybralo pravidlo z `PROMPT_FINAL11.md` §1.2
- limit posunu 40 m zdvihni na **120 m**

Poistky nechaj v kóde, len ich parametrizuj — nemažú sa, menia sa hodnoty. Do komentára napíš, že override je na výslovný pokyn majiteľa.

**`business.geo` v JSON-LD nemeň.** Tam ostávajú súradnice z Google profilu. Vizuálna značka a strojovo čitateľná poloha sa tak budú líšiť o ~90 m — to je v poriadku, JSON-LD má sedieť s Google profilom, schéma má sedieť s realitou.

Bod umiestni na **hranu pôdorysu privrátenú k ceste**, nie do ťažiska.

Otázku na súradnicu vchodu nechaj v `OTAZKY.md` otvorenú — keď príde, nahradí všetky heuristiky naraz.

---

## 3. PRECHODY — ZRUŠIŤ

Gradientové pásy odstráň úplne. `SectionBridge.astro` zmaž aj s CSS a šumovým overlayom.

Bol to môj nápad a po dvoch iteráciách stále vyzerá ako chyba renderovania, nie ako zámer. Rozmazaný pás medzi dvoma farbami nikdy nebude vyzerať draho.

**Náhrada:**

- ostrá hrana medzi sekciami
- na predele **1px vlasová linka** `--color-gold` pri `opacity 0.28`, cez celú šírku
- žiadny gradient, žiadny šum, žiadna výška navyše

Ostrá hrana s tenkou zlatou linkou číta ako typografická úprava. To je presne ten dojem, ktorý chceme.

---

## 4. ZLATO NA SVETLÝCH PLOCHÁCH — JEMNE

Použi **druhý zlatý variant** (ten, ktorý si nevybral do sekcie „Individuálne ocenenie") ako veľmi tlmenú vrstvu na svetlých sekciách.

Špecifikácia — drž ju presne, tu sa dá ľahko prestreliť:

- pozícia: **pravý horný roh** sekcie, ako mäkký nábeh svetla
- veľkosť: ~55 % šírky sekcie, `background-size: contain`, `background-repeat: no-repeat`
- `opacity: 0.07`, `mix-blend-mode: multiply`
- maska: `radial-gradient(ellipse at top right, black 0%, transparent 70%)` — nesmie mať viditeľnú hranu
- **len na dvoch sekciách:** „Čo u nás môžete založiť alebo predať" a „Ako to funguje". Nie na právnych stránkach.
- rozpočet: samostatný AVIF **≤ 20 kB**, `loading="lazy"`

**Povinná kontrola po nasadení:** premeraj `--color-ink-text` proti skutočným pixelom v mieste, kde je zlato najsilnejšie. Ak klesne pod **12:1**, zníž `opacity` na 0.05. Text má vždy prednosť pred textúrou.

Ak by to čo i len trochu pôsobilo ako škvrna, zníž krytie. Cieľ je, aby si to vedome nevšimol a len ti tá plocha prišla teplejšia.

---

## 5. JAZYKY — SPUSTIŤ OBA

`docs/PROMPT_FINAL9.md` zapracuj celý, ale **s jednou zmenou:**

```ts
en: { enabled: true, ... }
```

Angličtina ide naživo tiež. Preklady sú v §5.2, dopíš zvyšné reťazce v rovnakom tóne.

Prepínač bude teda `SK · HU · EN`. Na mobile to znamená tri položky — daj ich na jeden riadok s bodkovými oddeľovačmi, nie pod seba.

Právne stránky prelož do oboch jazykov. URL:

- HU: `/hu/adatvedelem`, `/hu/felhasznalasi-feltetelek`
- EN: `/en/privacy-policy`, `/en/terms-of-use`

`hreflang` bude mať štyri záznamy: `sk`, `hu`, `en`, `x-default` → `sk`.

---

## 6. ANIMÁCIE NA MOBILE — iOS A ANDROID

Požiadavka bola „ľahká animácia, čo sedí na Android aj iOS". Konkrétne pravidlá, ktoré to zabezpečia:

1. Animuj **výhradne `transform` a `opacity`**. Nič iné. Animovaná `width`, `top`, `filter` alebo `background-position` na mobile trhá.
2. **Žiadny `filter: blur()` na animovanom prvku.** Na iOS Safari to znamená prekreslenie celej vrstvy v každom snímku. Rozostrenie patrí do zapečeného obrázka, nie do CSS animácie.
3. `mask-image` **vždy s `-webkit-mask-image`** vedľa. Bez prefixu maska na starších iOS nefunguje a prvok sa zobrazí bez orezania.
4. **`background-attachment: fixed` nepoužívaj** — na iOS je nefunkčné a spôsobuje preskakovanie.
5. Výšku hero rieš cez `100dvh`, nie `100vh`. Na iOS `100vh` počíta so skrytou lištou prehliadača a obsah sa oreže.
6. `will-change` nastav len tesne pred animáciou a po dobehnutí ho odstráň. Trvalé `will-change` na desiatkach prvkov zožerie pamäť grafiky a na starších Androidoch to zhodí plynulosť.
7. Všetky scroll a touch listenery `{ passive: true }`.
8. Pod 768 px **skráť stagger na polovicu** a zníž počet súčasne animovaných prvkov na 8. Mobilné GPU zvládnu menej naraz.
9. Animáciu mapy na mobile skráť z 2,2 s na **1,4 s** — na malej ploche pôsobí dlhá animácia ako čakanie.

Over na reálnom zariadení alebo aspoň v device emulácii so škrtením CPU 4×.

---

## 7. PORADIE

1. §1 commit mapy
2. §3 zrušenie prechodov (najrýchlejšie, hneď vidno)
3. §2 posun bodu
4. §4 zlato na svetlých plochách + meranie kontrastu
5. §6 mobilné pravidlá
6. §5 jazyky (najväčší kus)
7. `git push`

Ak nie je dokončená dávka 8 (paleta, svetlé sekcie, texty, zlatý obraz v „Individuálne ocenenie"), urob ju pred bodom 4 — inak by sa zlato nasádzalo na starú paletu.

Report do `docs/REPORT_faza18.md`, stručne.
