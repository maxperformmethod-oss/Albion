# DÁVKA 11 — mapa na plnú úroveň

> Pre Claude Code. Súčasná mapa je funkčná, ale vizuálne je na štvrtine toho, čo z týchto dát ide dostať. Toto je jej finálna podoba.
> **Pred commitom vygeneruj náhľad a ukáž ho.** Túto dávku hodnotíme okom, nie číslami.

---

## 1. POLOHA — TRETIA OPRAVA, TAK JU UZAVRIME NATRVALO

Majiteľ upresnil: **prevádzka je hneď cez cestu za autobusovou stanicou, v mieste, kde sa cesta trikrát láme o 90°.**

Náš bod tam ešte nesedí. Nebudem ho posúvať štvrtýkrát odhadom.

### 1.1 Definitívne riešenie — vypýtaj si súradnicu dverí

Do `docs/OTAZKY.md` napíš ako prvú položku:

> **Presná súradnica vchodu.** V Google Mapách nájsť **vchod do predajne** (nie značku firmy), kliknúť naň pravým tlačidlom a skopírovať dvojicu čísel, ktorá vyskočí navrchu ponuky. Poslať sem. Značka firmy ukazuje na ťažisko parcely, preto sedí inde než dvere.

Kým to príde, použi §1.2. Keď to príde, zahoď všetky heuristiky a použi tú súradnicu priamo.

### 1.2 Dočasné pravidlo z popisu

1. Nájdi uzol autobusovej stanice (už ho máš — `Lučenec,,AS MHD`).
2. Nájdi cestu, ktorá ide medzi autobusovou stanicou a blokom na opačnej strane.
3. V geometrii tejto cesty nájdi úsek s **dvoma až troma po sebe idúcimi zmenami smeru o 75–105°**. To je to miesto, ktoré majiteľ popisuje.
4. Bod umiestni na **fasádu budovy oproti autobusovej stanici** v tomto úseku — teda na hranu pôdorysu privrátenú k ceste, nie do ťažiska.
5. Ak takýto úsek nenájdeš alebo je kandidátov viac, **nič neposúvaj**, nechaj súčasný stav a napíš mi to. Štvrtý odhad je horší než tretí.

`business.geo` v JSON-LD **nemeň** ani teraz. Tam ostávajú potvrdené súradnice z Google profilu.

---

## 2. ARCHITEKTÚRA — DVE VRSTVY MIESTO JEDNEJ

Všetko, čo chcem nižšie, sa do jedného inline SVG nezmestí bez toho, aby narástlo na stovky kB. Rozdeľ mapu na dve vrstvy:

**Vrstva A — zapečený obraz** (`public/images/map-*.avif` + webp, generovaný `npm run map`)
Obsahuje: podklad, koľajisko, zeleň, vzdialené budovy, vrhnuté tiene, atmosférický úbytok, vinetáž, zrno.
Rozpočet: **≤ 60 kB** pri 1600 px, mobilný variant ≤ 30 kB pri 760 px.

**Vrstva B — inline SVG nad ňou**
Obsahuje: cesty v centre, budovu Albionu, obe stanice, trasu, všetky popisy, mierku, severku.
Rozpočet: **≤ 35 kB**.

Spolu ~95 kB za výrazne vyššiu kvalitu. Vrstva A sa dá renderovať s tieňmi a rozostrením, ktoré by v SVG stáli násobne viac.

Obe vrstvy musia byť v presnom súlade — rovnaká projekcia, rovnaký výrez, rovnaké rozmery. Zapíš projekciu do jedného modulu a použi ho pre obe.

---

## 3. ČO ROBÍ 3D MAPU KRÁSNOU — POSTUPNE

### 3.1 Svetlo (najväčší jediný rozdiel)

Zaveď **jeden smer svetla** pre celú scénu, napr. zhora zľava. Potom:

- **strecha** — najsvetlejšia, `--color-ink-700` zosvetlená o ~8 %
- **stena privrátená k svetlu** — stredný tón
- **stena odvrátená** — najtmavšia, blízko podkladu
- **horná hrana strechy** — 1px linka o stupeň svetlejšia než strecha (simuluje odlesk)

Práve tri rôzne hodnoty na troch plochách sú to, čo oko číta ako hmotu. Teraz sú steny aj strechy takmer rovnaké, preto to pôsobí ploché.

### 3.2 Vrhnuté tiene

Každý pôdorys posuň v smere svetla o `výška × 0,6` a vykresli ako polygón v `#000` pri `opacity 0.35`, s rozostrením ~3 px. Kresli **pod** budovy, do vrstvy A.

Ak by tiene rozpočet nafúkli, zlúč ich do jednej cesty s `fill-rule: nonzero` — prekryvy sa vyriešia samy a veľkosť klesne.

### 3.3 Výška budov z dát, nie konštanta

Poradie zdrojov:

1. OSM tag `height`
2. `building:levels` × 3 m
3. odvodená výška z plochy pôdorysu: malé domy 6 m, bloky 9–12 m, veľké haly 5 m (haly sú ploché a rozľahlé)

Uniformná výška je druhý najväčší dôvod, prečo mapa vyzerá ako schéma a nie ako mesto.

Stanica, autobusová stanica a budova Albionu dostanú o stupeň väčšiu výšku, aby čítali ako orientačné body.

### 3.4 Poradie kreslenia

Zoraď budovy podľa `x + y` v izometrických súradniciach a kresli odzadu dopredu. Ak sa to nerobí, vzdialené budovy prekrývajú bližšie a scéna sa vizuálne rozpadá — býva to hlavná príčina toho „ploché" dojmu.

### 3.5 Atmosférický úbytok

Čím ďalej od stredu, tým nižší kontrast: buduj `opacity` od `1.0` v strede po `0.45` na okraji výrezu, plus mierny posun k farbe podkladu. Oko tak samo nájde stred — teda Albion.

Kombinuj s radiálnou maskou, ktorú už máš, ale masku zjemni — má to byť plynulé, nie kruhový výrez.

### 3.6 Podklad má mať vrstvy

Teraz je všetko rovnaká plocha. Rozlíš:

- **koľajisko** — vlastný tmavší pás, koľaje ako tenké svetlejšie linky, pražce len pri hlavných koľajach
- **zeleň** (`leisure=park`, `landuse=grass|forest`) — veľmi tlmená teplá zelenkastá, sotva odlíšiteľná, ale prítomná
- **spevnené plochy** (`amenity=parking`, `landuse=industrial`) — o stupeň svetlejšie než podklad
- **voda**, ak v okolí je

Nič z toho nemá byť výrazné. Ide o to, aby plocha nebola mŕtva.

### 3.7 Cesty s hierarchiou a lemom

- šírka a jas podľa `highway`: `primary` > `secondary` > `tertiary` > `residential` > `service` > `footway`
- pod každou cestou tmavší **lem** o 2 px širší — to je detail, ktorý odlišuje navrhnutú mapu od vygenerovanej
- chodníky tenkou prerušovanou linkou
- cesta pred prevádzkou o stupeň svetlejšia než ostatné

### 3.8 Albion ako ohnisko

- zlatá strecha zostáva
- **zlatý rim light** na hranách jeho budovy — 1,5px linka `--color-gold`
- pod budovou mäkká zlatá žiara: radiálny gradient, priemer ~60 m, `opacity 0.22`, najsilnejšia pri základni
- budovy do 30 m okolo o niečo svetlejšie než zvyšok — akoby na ne dopadalo to isté svetlo

### 3.9 Popisy

- názvy miest v serif 600, ostatné v sans
- **halo** okolo textu: `paint-order: stroke`, `stroke: var(--color-ink-900)`, `stroke-width: 3px` — bez toho sa text stratí nad budovami
- `Albion` väčší než ostatné popisy, ostatné rovnaké medzi sebou
- vodiaca linka od popisu k bodu, ak popis nesedí priamo nad ním

### 3.10 Dva technické detaily, ktoré pôsobia draho

- **mierka** — diskrétna úsečka s popisom `50 m` v pravom dolnom rohu, v `--color-bone-muted` pri 45 %
- **severka** — malé `S` so šípkou v rohu, rovnako tlmené

Obe sú drobné a nenápadné, ale okamžite hovoria „toto je skutočná mapa".

### 3.11 Zjednotenie so zvyškom webu

Rovnaké zrno a rovnaká vinetáž ako v ostatných tmavých sekciách. Mapa nesmie vyzerať ako vložený cudzí prvok.

---

## 4. ANIMÁCIA

Celé do **2,2 s**, spustí sa raz pri vstupe do viewportu.

1. Vrstva A sa objaví: `opacity 0 → 1`, 500 ms.
2. Cesty sa nakreslia, 600 ms, od stredu von.
3. Budovy vystúpia **odzadu dopredu** (v poradí kreslenia), `translateY(14px → 0)`, stagger 8 ms, zastropovaný, celkovo max 700 ms. Ľahký prestrel `cubic-bezier(0.34, 1.3, 0.64, 1)` — budova sa o 2 px prehupne a sadne.
4. Tiene sa objavia 120 ms po svojich budovách.
5. Trasa sa nakreslí, 500 ms.
6. Zlatá žiara pod Albionom nabehne raz, 600 ms, a zostane.

`prefers-reduced-motion` → všetko naraz v koncovom stave, žiadny pohyb.

---

## 5. ROZPOČET A HRANICE

| Položka | Limit |
|---|---|
| Vrstva A (AVIF 1600 px) | 60 kB |
| Vrstva A (AVIF 760 px) | 30 kB |
| Vrstva B (inline SVG) | 35 kB |
| Celková váha stránky | 400 kB |
| JS gzip | bez zmeny, ~2 kB |

Ak sa nezmestíš: najprv zjednoduš polygóny vzdialených budov, potom zmenš výrez, **až nakoniec uber na efektoch**. Tiene a tri hodnoty stien sú nosné, tie nešetri.

---

## 6. POSTUP

1. §1 poloha — dočasné pravidlo alebo nechať, plus otázka do `OTAZKY.md`
2. §2 rozdelenie na vrstvy
3. §3.1, §3.3, §3.4 — svetlo, výšky, poradie kreslenia (toto samo urobí 60 % rozdielu)
4. §3.2 tiene
5. §3.5, §3.6, §3.7 — atmosféra, podklad, cesty
6. §3.8, §3.9, §3.10 — Albion, popisy, mierka a severka
7. §3.11 zjednotenie
8. §4 animácia
9. **Náhľad → ukáž → až potom commit**

Report do `docs/REPORT_faza17.md` + náhľad v plnom rozlíšení.
