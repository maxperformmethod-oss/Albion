# DÁVKA 13 — poloha definitívne, rytmus stránky, háčiky

---

## 1. POLOHA — PRESNÉ PRAVIDLO Z POPISU MAJITEĽA

Majiteľ to popísal jednoznačne: **prevádzka je tam, kde sa vykreslená trasa láme tretíkrát — priamo cez cestu v mieste, kde mení smer o 90°.**

To sa dá vypočítať, nie odhadnúť. Trasu už máš z Dijkstru:

1. Prejdi lomové body vykreslenej trasy od železničnej stanice.
2. Počítaj len **významné lomy** — zmena smeru o **60° a viac**. Drobné zakrivenia ciest ignoruj.
3. Zober **tretí takýto lom**.
4. Bod Albionu umiestni **na opačnú stranu cesty** než po ktorej trasa vedie, kolmo, ~10 m od osi.
5. Zlatú strechu daj budove, do ktorej tento bod padne. Ak nepadne do žiadnej, tej najbližšej do 25 m.

Ak trasa nemá tri lomy nad 60°, zníž prah na 45° a skús znova. Ak ani tak, nechaj súčasný stav a napíš mi to.

Toto je posledná iterácia polohy. Ak ani teraz nesedí, čakáme na súradnicu vchodu a nič ďalšie nehádame.

---

## 2. ANIMÁCIA MAPY

Over, či animácia z `PROMPT_FINAL11.md` §4 skutočne beží na produkcii — na náhľade to nie je vidieť a je možné, že sa spúšťa, ale je príliš tichá.

Ak beží, zvýrazni tri veci:

1. **Trasa** — po dokreslení nechaj po nej raz prejsť svetlejší zlatý segment (gradient posunutý pozdĺž cesty, 900 ms, jeden prechod, nie slučka). Je to ten moment, ktorý oku povie „takto sa tam dostaneš".
2. **Budova Albionu** — po dosadnutí jednorazovo zosilni zlatú žiaru o 40 % a vráť na pokojnú hodnotu, 700 ms.
3. **Popisy** — nabehnú až na konci, `opacity` + 4 px posun, po 60 ms za sebou v poradí: Železničná stanica → Autobusová stanica → Albion.

`stroke-dashoffset` pri kreslení ciest ponechávam — mal si pravdu, že bez neho z animácie nič nezostane. Je to jediná výnimka z pravidla „len transform a opacity" a stojí za ňu.

Rovnako beriem `svh` namiesto `dvh`. Argument, že `dvh` mení výšku počas scrollovania, je silnejší než môj pôvodný.

---

## 3. RYTMUS STRÁNKY — PREČ SO ŠABLÓNOVITOSŤOU

Každá sekcia má teraz rovnakú stavbu: nadpis vľavo hore, pod ním text, pod ním mriežka. Po treťom opakovaní to oko prestane vnímať a stránka splynie do šablóny — aj keď je každý jednotlivý prvok dobrý.

**Zaveď striedavý rytmus.** Každá sekcia dostane inú kompozíciu:

| Sekcia | Kompozícia |
|---|---|
| Hero | full-bleed obraz, text vľavo dole |
| Pás „Rodinná firma" | jeden riadok na stred, úzky |
| Čo prijímame | nadpis **vpravo**, mriežka vľavo, asymetria 40/60 |
| Individuálne ocenenie | text vľavo 58 %, zlatý obraz vpravo do krvi |
| Ako to funguje | tri kroky **vodorovne s veľkými číslicami**, nadpis nad nimi na stred |
| Prečo Albion | nadpis **sticky** vľavo, štyri body scrollujú popri ňom vpravo |
| Slovo majiteľov | citát na stred, úzky stĺpec 52ch, veľa priestoru okolo |
| Mapa | full-bleed, text pod ňou |
| Kontakt | dva stĺpce — vľavo veľký telefón, vpravo hodiny a adresa |

Sticky nadpis v „Prečo Albion" je jediný prvok, ktorý vyžaduje trochu práce navyše — ale je to presne to miesto, kde návštevník rozhoduje, či ostane. Na mobile sticky vypni, tam sa všetko skladá pod seba.

**Ďalej:** striedaj šírku textového stĺpca. Nie všetko na 68ch. Krátke tvrdenia daj na 44ch, vysvetlenia na 68ch. Nerovnaká šírka je to, čo robí stránku sadzbou a nie výplňou.

---

## 4. HÁČIKY — ČO NAPÍŠEME A ČO NIE

### 4.1 „Najlepšie ponuky v okolí" nenapíšeme

Rozumiem, o čo ide, a tá potreba je správna. Ale túto konkrétnu vetu odmietam z troch dôvodov, v poradí dôležitosti:

1. **Je to nepodložený superlatív s porovnaním.** Na Slovensku spadá pod nekalé obchodné praktiky a klamlivú reklamu. SOI za takéto tvrdenia pokutuje a stačí jedno podanie od konkurencie. Pri firme, ktorú tvoria dvaja ľudia, to nie je riziko, ktoré sa oplatí brať.
2. **Nefunguje.** „Najlepšie ceny" má na dverách každá záložňa v každom meste. Je to veta, ktorú zákazník preskočí, lebo ju čítal stokrát. Neexistuje spôsob, ako ňou vyniknúť.
3. **Zabije to, čo sme stavali.** Celý web stojí na tom, že Albion hovorí na rovinu. Jedna prehnaná veta v hero to spochybní rýchlejšie, než desať pravdivých viet opraví.

### 4.2 Čo napíšeme namiesto toho — a je to silnejšie

**Toto je hlavný háčik. Daj ho do hero, hneď pod tlačidlá, výrazne:**

```
Ak vám inde dajú viac, povedzte nám to. Vieme sa dohodnúť.
```

Prečo je to lepšie než „najlepšie ceny":

- Je to **overiteľné** — je to sľub o správaní, nie tvrdenie o trhu. Nikto ho nemôže vyvrátiť.
- Hovorí zákazníkovi presne to, čo chce počuť („nedostanem menej"), ale bez toho, aby si musel veriť marketingu.
- **Pozýva na rozhovor** — a rozhovor je presne to, čo Albion vyhráva oproti reťazcu s cenníkom.
- Nadväzuje na „Záložňa, kde sa vieme dohodnúť" a uzatvára tú myšlienku.

Konkurencia to okopírovať nemôže, lebo v reťazci to nie je pravda — tam cenu určuje centrála.

### 4.3 Ďalšie tri háčiky do stránky

Krátke, konkrétne, každý na inom mieste. **Všetky tri sú podmienené potvrdením od majiteľa** — pozri §4.4.

```
a) Pod hero tlačidlami, malým písmom vedľa hlavného háčika:
   Ocenenie na počkanie. Zadarmo a nezáväzne.

b) Ako prvý riadok sekcie „Ako to funguje":
   Väčšinu vecí vybavíme, kým na ne čakáte.

c) V sekcii Kontakt, nad telefónom:
   Zavolajte a opýtajte sa. Aj keď si nie ste istí, či to má cenu.
```

Bod (c) je adresovaný presne tomu človeku, ktorý váha, či vôbec ísť — a tých je najviac.

### 4.4 Čo musí majiteľ potvrdiť — do `OTAZKY.md`

Nič z §4.3 nepublikuj, kým nepríde odpoveď:

1. **Je ocenenie naozaj zadarmo a nezáväzné?** (predpokladám áno, ale nesmiem to tvrdiť za vás)
2. **Vybavíte bežnú vec na počkanie?** Ak áno, približne do koľkých minút?
3. **Sedí veta „Ak vám inde dajú viac, povedzte nám to. Vieme sa dohodnúť."?** Je to sľub, ktorý budete musieť dodržať pri pulte — ak ho nechcete dať, nedáme ho.

Bod 3 je dôležitý: háčik funguje, len ak je pravdivý. Keď zákazník príde a povie „inde mi dali viac" a nedostane odpoveď, stratíte ho navždy a povie to ďalej. V malom meste to platí dvojnásobne.

### 4.5 Pravidlo do budúcna

Háčik smie byť odvážny, ale musí byť **splniteľný pri pulte**. Rozdiel medzi dobrým a zlým marketingom pre malú firmu nie je v tom, aký je hlasný, ale v tom, či to, čo sľúbi, zákazník o hodinu naozaj dostane.

---

## 5. PORADIE

1. §1 poloha
2. §4.2 hlavný háčik do hero — jediný, ktorý ide naživo hneď
3. §4.3 tri háčiky za flagom `FEATURES.hooks = false`, plus otázky do `OTAZKY.md`
4. §3 rytmus stránky (najväčší kus)
5. §2 animácia mapy
6. `git push`

Report do `docs/REPORT_faza19.md`, stručne.
