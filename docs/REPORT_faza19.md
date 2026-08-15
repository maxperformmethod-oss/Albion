# REPORT — Fáza 19

Zadanie: `docs/PROMPT_FINAL13.md`, poradie §5. Dátum: 15. 8. 2026.
Náhľad celej stránky: `docs/rytmus-nahlad.png`.

---

## §1 Poloha z tretieho lomu trasy

Pravidlo naprogramované presne podľa popisu: prejsť lomové body vykreslenej
trasy od stanice, počítať len zmeny smeru **≥ 60°**, zobrať **tretí** taký lom
a bod položiť kolmo **10 m na vonkajšiu stranu zákruty** — teda cez cestu.

Trasa tri lomy nad 60° má, prah 45° sa nepoužil.

| | |
|---|---|
| Posun od potvrdenej značky | **47,6 m** |
| Od železničnej stanice | **87,5 m** (bolo 133 m) |
| Od autobusovej stanice | 104 m |
| Trasa | 90 m (bola 241 m) |
| Zlatá strecha | budova, do ktorej bod padol |

Bod je teraz **bližšie k železničnej stanici** než pri všetkých predchádzajúcich
pokusoch, čo sedí s „pár krokov od stanice“. Zároveň je ďalej od autobusovej
stanice, než naznačoval predchádzajúci popis — tie dva popisy si odporujú a ja
som išiel podľa toho, ktorý sa dá vypočítať. **Toto bola posledná iterácia**;
ďalej sa čaká na súradnicu vchodu.

`business.geo` v JSON-LD nemenené.

---

## §4 Háčiky

**Hlavný ide naživo**, v hero hneď pod tlačidlami, serif `--text-h3`, stĺpec
44ch:

> Ak vám inde dajú viac, povedzte nám to. Vieme sa dohodnúť.

Preložený do HU aj EN. Nadväzuje na „Záložňa, kde sa vieme dohodnúť“ a je to
sľub o správaní, nie tvrdenie o trhu — nedá sa vyvrátiť a nespadá pod
nepodložené superlatívy.

**Tri kratšie háčiky sú za `FEATURES.hooks: false`** a na produkcii nie sú
vidieť. Otázky pre majiteľa sú v `docs/OTAZKY.md`: je ocenenie naozaj zadarmo
a nezáväzné · vybavíte bežnú vec na počkanie · beriete ten sľub o cene.

---

## §3 Rytmus stránky

Každá sekcia má inú kompozíciu, aby stránka nesplynula do šablóny:

| Sekcia | Čo sa zmenilo |
|---|---|
| Čo prijímame | nadpis **vpravo**, lead vľavo, asymetria 40/56 |
| Ako to funguje | nadpis aj úvodný riadok **na stred**, kroky vodorovne s veľkými číslicami |
| Prečo Albion | nadpis **sticky** vľavo (od 1024 px), štyri body scrollujú popri ňom |
| Slovo majiteľov | citát **na stred**, 52ch, priestor okolo |
| Kontakt | dva stĺpce, vľavo veľký telefón |

Šírka textového stĺpca sa strieda: krátke tvrdenia 44ch, vysvetlenia 68ch.
Sticky je vypnuté pod 1024 px — tam sa všetko skladá pod seba.

---

## §2 Animácia mapy

Animácia beží (overené v prehliadači), bola len tichá. Pridané tri akcenty:

1. **Trasa** — po dokreslení po nej raz prejde svetlejší zlatý tón, 900 ms,
   jeden prechod.
2. **Budova Albionu** — žiara sa jednorazovo zosilní a vráti, 700 ms.
3. **Popisy** — nabehnú až na konci, `opacity` + 4 px posun, po 60 ms
   za sebou: Železničná stanica → Autobusová stanica → Albion.

Všetko `transform`/`opacity`, `prefers-reduced-motion` naďalej vypína všetko.

---

## Overené

`astro check` 0 chýb · `npm test` 23/23 · build 10 stránok · rýchly scroll
bez prázdnych miest · 12 requestov, 0 third-party, **305 kB**.

## Otvorené

Súradnica vchodu · tri háčiky čakajú na potvrdenie · korektúra HU a EN
rodeným hovorcom · e-mail · fotky · doklady · právna kontrola · Inter.
