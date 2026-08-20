# DÁVKA 24 — e-mail preč, zarovnanie hero, push

> Posledná dávka pred spustením.

---

## 1. E-MAIL — ODSTRÁNIŤ ÚPLNE, NIE ODLOŽIŤ

Rozhodnutie: **kontakt je telefón a osobná návšteva. E-mail neponúkame nikde.**

Je to konzistentné s celým webom — primárne CTA je `Zavolať`, a e-mail by bol jediný kanál, ktorý sľubuje odpoveď, na ktorú nikto nemá čas. Lepšie ho nemať než ho mať a nereagovať naň.

Urob:

1. `business.ts` — pole `email` **zmaž**. Nie `TO_CONFIRM`, ale preč. Odstráň aj typ a všetky vetvy, ktoré ho podmienene vykresľovali.
2. `docs/OTAZKY.md` — otázku na e-mail zmaž.
3. `LAUNCH_CHECKLIST.md` §B — bod **B4 (e-mailová adresa) zmaž**.
4. `docs/FIRMA_UDAJE.md` — riadok s e-mailom označ ako neaktuálny: *e-mail sa vedome nepoužíva*.
5. `grep` cez `src/` na `email`, `mail`, `@` — vypíš do reportu, čo zostalo a prečo.

### Zásady ochrany osobných údajov

Sekcia „Kontakt na uplatnenie práv" musí fungovať **bez e-mailu**. Uprav ju tak, aby uvádzala telefón a adresu prevádzky:

```
Práva si môžete uplatniť telefonicky na čísle +421 47 433 44 44
alebo osobne na adrese Kpt. Nálepku 41, 984 01 Lučenec.
```

Vetu typu „ak bude e-mail, doplní sa sem" odstráň. Prelož do HU a EN.

### Do `LAUNCH_CHECKLIST.md` §D

> **D8 — Do Google profilu nedopĺňať e-mail.** Kontaktom je telefón. Ak je tam e-mail už uvedený, odstrániť — nech sa web a profil zhodujú.

---

## 2. HERO — ZAROVNAŤ NA MRIEŽKU STRÁNKY, NIE NA STRED PANELA

Tvoj rozbor bol presný a tá výmena, ktorú si popísal, sa dá obísť. Ani jedna z dvoch možností, ktoré si skúšal, nie je správna — obe riešia horizontálnu polohu textu v paneli, ale problém je inde.

**Text v hero má začínať na tej istej zvislej línii ako logo a všetky nadpisy sekcií.**

- ľavá hrana textového bloku = ľavá hrana `container-page`
- **žiadne centrovanie v paneli**, ani pôvodné centrovanie v okne
- šírka textového bloku max ~520 px, zvyšok panela je voľný priestor vpravo
- pod 1024 px sa nič nemení, tam už je text na plnú šírku

Pri 1900 px teda text začne na ~350 px, presne pod logom. Pri 1440 na ~120 px, tiež pod logom.

Jedna zvislá línia cez celú stránku — logo, H1, nadpisy sekcií, pätka. To je to, čo oko číta ako poriadok, a je to silnejší signál kvality než vycentrovaný blok. Voľné miesto vpravo od textu nie je chyba, je to priestor.

---

## 3. MAPA — DOBRÝ NÁLEZ

Tá chyba so `stroke-dasharray: 1`, ktorá špecificitou prebíjala `.rr-d`, je presne ten typ, čo prežije roky. Čiarkované cesty vyzerali čiarkovane len s vypnutým JS — teda nikdy. Dobre chytené.

To, že si zmenu overil porovnaním priemerného jasu výrezu (35,047 vs 35,050) namiesto tvrdenia „vyzerá rovnako", je správny postup. Rovnako to, že si nezmeral fps a **napísal si to** namiesto toho, aby si dodal číslo, ktorému sa nedá veriť. Nechaj to tak — skutočné meranie príde z telefónu po spustení, je to bod E3.

Prekryv fáz namiesto série krokov je správna úvaha. Neriešime ďalej.

---

## 4. PUSHNI

Po §1 a §2 pushni **všetko naraz** — dávky 22, 23 aj 24.

Predtým over:

- `npm run build` prejde **bez `--allow`**
- `astro check` 0 chýb
- testy prejdú
- nikde v `dist` nie je `TO_CONFIRM` ani `@`
- rýchly scroll SK, HU aj EN bez prázdnych miest

Report do `docs/REPORT_faza30.md`.

---

## 5. ČO ZOSTÁVA PRED SPUSTENÍM

Po pushi je web hotový. Ostáva to, čo je mimo kódu — celé v `LAUNCH_CHECKLIST.md`:

1. **Doména** (A1–A3) — kúpiť `.sk`, napojiť na Vercel, prepísať produkčnú adresu v kóde
2. **Zmazať duplicitný Vercel projekt** `albion` (A4)
3. **Právne texty na kontrolu právnikovi** (A5)
4. **HU a EN na korektúru rodenému hovorcovi** (A6)
5. **Google profil** (D1–D8) — odkaz na web, kategórie, recenzie, žiadny e-mail
6. **Fotky od majiteľov** (C) — hlavne tá spoločná pri pulte

Bod 6 spraví pre dôveryhodnosť viac než čokoľvek, čo sme za tie dávky nakódovali.
