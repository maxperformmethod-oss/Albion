# DÁVKA 18 — konkrétne služby

> Dve zmeny, nič viac. Cieľ je konkrétnosť, nie viac textu.

---

## 1. NAJPRV ČO NEPRIDÁVAME

Z tvojho zoznamu sú **„okamžitá hotovosť"** a **„diskrétne vybavenie"** už na stránke:

- hotovosť → `Ak vám to sedí, vybavíme to na mieste.` (krok 3) a `Väčšinu vecí vybavíme, kým na ne čakáte.` (háčik)
- diskrétnosť → celý bod 4 v „Prečo Albion" a veta v odkaze manželov

Pridať ich znova by bolo presne to opakovanie, ktoré nechceš. Vynechávame ich.

Zostáva **konkrétnosť v tom, čo berieme**, a **rozdiel medzi zálohou a výkupom** — to na stránke naozaj chýba.

---

## 2. POLOŽKY DOSTANÚ KONKRÉTNY PODRIADOK

Každá položka v mriežke „Čo u nás môžete založiť alebo predať" dostane pod názov jeden riadok, `--text-small`, `--color-ink-muted`, max jeden riadok textu na desktope.

```
01  Zlato a šperky
    Zlomkové zlato, poškodené aj nenosené šperky, retiazky, prstene.

02  Hodinky
    Značkové aj staršie mechanické. Aj nefunkčné.

03  Mobily a elektronika
    Telefóny, tablety, reproduktory, slúchadlá, herné konzoly.

04  Počítače a notebooky
    Notebooky, monitory, grafické karty.

05  Náradie a stroje
    Aku náradie, brúsky, zváračky, záhradná technika.

06  Autá a vozidlá
    Osobné autá, motocykle, prívesy.

07  Zberateľské a cennejšie predmety
    Mince, striebro, medaily, hudobné nástroje.

08  Iné veci s hodnotou
    (bez podriadku — nesie ho záverečná veta sekcie)
```

Položka 08 podriadok **nedostane**. Konkrétny zoznam pod „iné veci" by protirečil vete, že zoznam nie je uzavretý.

Záverečná veta sekcie zostáva nezmenená.

**Sadzba:** podriadok pod názvom, `line-height: 1.5`, medzera 6 px. Pri hoveri sa nemení — reaguje len linka, číslo a názov, ako doteraz.

---

## 3. NOVÝ BLOK: ZÁLOHA ALEBO VÝKUP

Toto je jediná vec, ktorú zákazník naozaj nevie a nikto v okolí mu to nevysvetlí. Patrí **medzi mriežku služieb a sekciu „Zvláštna vec ešte neznamená problém"**.

Kompaktný dvojstĺpec na tmavom podklade `ink-800`, bez obrázka. Celý blok je pod 60 slov.

```
eyebrow:  Dve možnosti
H2:       Založiť alebo predať?

ĽAVÝ STĹPEC
nadpis:   Záloha
text:     Peniaze dostanete hneď a vec zostáva vaša. Keď sumu vrátite,
          vec si zoberiete späť.

PRAVÝ STĹPEC
nadpis:   Výkup
text:     Vec nám predáte natrvalo. Za výkup zvyčajne dostanete viac
          než pri zálohe.

pod stĺpcami, malým:
          Ktorá možnosť sa vám oplatí viac, povieme priamo pri veci.
```

Medzi stĺpcami zvislá vlasová linka `--color-gold` pri 28 %. Pod 768 px pod sebou, linka vodorovne.

**Podmienené potvrdením:** veta `Za výkup zvyčajne dostanete viac než pri zálohe.` musí byť pravdivá. Daj ju za `FEATURES.hooks` spolu s ostatnými háčikmi a do `OTAZKY.md` pridaj otázku:

> Platí, že za výkup zákazník zvyčajne dostane viac než pri zálohe? Ak nie, akým slovom to popísať?

Bez potvrdenia blok funguje aj tak — len ten jeden riadok chýba.

---

## 4. INVESTIČNÉ ZLATO — NEPÍŠEME ZATIAĽ

Zámerne som ho vynechal z položky 01. Investičné zlato (tehličky, mince s certifikátom) je iná služba než výkup šperkov a **nevieme, či ho Albion naozaj robí**.

Do `OTAZKY.md`:

> Vykupujete alebo predávate investičné zlato — tehličky, mince s certifikátom? Ak áno, doplníme to do položky „Zlato a šperky".

Keď to potvrdí, pridá sa do podriadku 01 ako `…, prstene, investičné zlato.`

---

## 4b. PREDAJ — CHÝBA NA STRÁNKE ÚPLNE

Dobrý postreh. Celá stránka hovorí o tom, čo od zákazníka **berieme**, ale Albion aj **predáva** — a nikde to nie je. To je diera, nie doplnok.

### „Najférovejšie ceny" nepoužijeme

Rovnaký problém ako pri „najlepších ponukách": je to nepodložený superlatív s porovnaním, spadá pod klamlivú reklamu a hlavne ho má na webe každý.

**Ale pri predaji zlata máme niečo omnoho silnejšie — vecný dôvod, prečo je u nás lacnejšie.** Zlato z výkupu nemá maržu klenotníctva. To nie je tvrdenie o tom, akí sme dobrí, ale vysvetlenie, ktoré si zákazník overí sám. Presvedčí viac než akýkoľvek superlatív.

### Nový blok

Kompaktný pás na svetlom podklade, **hneď za blokom „Založiť alebo predať?"**. Jeden riadok textu, žiadna galéria, žiadne ceny.

```
eyebrow:  Predaj
H2:       Zlato a šperky aj predávame
text:     Kusy z výkupu, preto bez marže klenotníctva. Ponuka sa mení
          podľa toho, čo práve máme — oplatí sa prísť pozrieť.
CTA:      Zavolať a opýtať sa, čo máme
```

Pravidlá:

- **žiadny katalóg, žiadne fotky tovaru, žiadne ceny.** `FEATURES.showcaseEnabled` zostáva `false`.
- blok je vizuálne najtichší na stránke — je to sekundárna činnosť a nesmie prekryť záložné služby
- CTA vedie na `tel:`, nie na kotvu

### Do `OTAZKY.md`

> Predávate zlato a šperky pravidelne, alebo len občas podľa toho, čo je na sklade? Ak len občas, preformulujeme, aby to nebudilo očakávanie predajne.

Bez odpovede blok pokojne nasaď — súčasné znenie hovorí „ponuka sa mení", takže nič nesľubuje.

---

## 5. SEO

Nové podriadky prinášajú presne tie výrazy, ktoré ľudia hľadajú — `zlomkové zlato`, `výkup poškodených šperkov`, `výkup mobilov`, `výkup náradia`. Nechaj ich tak, ako sú, **nikde ich nezhusťuj a neopakuj v nadpisoch.** Sú v texte prirodzene a to stačí.

Meta description **nemeň**.

---

## 6. PREKLADY

Podriadky a nový blok prelož do HU a EN v existujúcom tóne. Odborné výrazy, na ktorých záleží:

| SK | HU | EN |
|---|---|---|
| zlomkové zlato | tört arany | scrap gold |
| záloha | zálog | pawn loan |
| výkup | felvásárlás | outright purchase |
| aku náradie | akkus szerszám | cordless tools |

Zvyšok prelož sám. Do `OTAZKY.md` doplň, že aj tieto nové reťazce idú do korektúry rodeným hovorcom.

---

## 7. POSTUP

1. §2 podriadky
2. §3 nový blok
3. §6 preklady
4. §4 otázky do `OTAZKY.md`
5. `git push`

Report do `docs/REPORT_faza24.md`. Do reportu napíš **počet slov na celej stránke pred a po** — ak narástla o viac než 60 slov, niečo sa mi vymklo a chcem to vedieť.
