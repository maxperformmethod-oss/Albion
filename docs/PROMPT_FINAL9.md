# DÁVKA 9 — jazykové verzie

> Pre Claude Code. Rob až po dokončení dávky 8.

---

## 1. ROZHODNUTIE: MAĎARČINA ÁNO, ANGLIČTINA S VÝHRADOU

**Maďarčina má zmysel a je to dobrý nápad.** Lučenec leží v regióne so silnou maďarsky hovoriacou komunitou. Časť zákazníkov Albionu maďarsky reálne hovorí a časť z nich hľadá maďarsky. Konkurencia to takmer isto nemá. Toto je skutočná výhoda, nie ozdoba.

**Angličtina je slabší prípad.** Kto je anglicky hovoriaci zákazník záložne v Lučenci? Prakticky nikto. Znamená to tretiu verziu každého textu, tretiu sadu právnych stránok a tretí `hreflang`, a pri každej zmene copy trojnásobnú prácu.

**Odporúčam:** nasadiť **SK + HU** teraz, angličtinu pripraviť technicky, ale **nepublikovať**, kým sa neukáže dopyt. Ak ju chceš aj tak hneď, texty sú v §5 pripravené — len prepni flag.

```ts
export const LOCALES = {
  sk: { enabled: true,  label: "Slovensky", short: "SK" },
  hu: { enabled: true,  label: "Magyarul",  short: "HU" },
  en: { enabled: false, label: "English",   short: "EN" },
};
```

Zakázané v prepínači: **vlajky.** V tomto regióne je vlajka ako symbol jazyka nešťastná — maďarsky hovoriaci zákazník je občan Slovenska a vlajka to vzťahuje k štátu, nie k reči. Používaj len text `SK · HU`.

---

## 2. KDE PREPÍNAČ JE

Nie plávajúce okienko v rohu. Prekrývalo by sticky call bar na mobile a na prémiovom webe pôsobí ako doplnok zvonku.

- **Desktop:** v hlavičke, vpravo od navigácie, **pred** tlačidlom `Zavolať`. Formát `SK · HU`, aktívny jazyk `--color-bone`, neaktívny `--color-bone-muted`, hover `--color-gold`. Oddeľovač tenká bodka.
- **Mobil:** v hamburger menu, ako posledná položka pod odkazmi, oddelená vlasovou linkou. V sticky call bare **nie je** — tam sú len `Zavolať` a `Mapa`.
- Prepnutie vedie na tú istú stránku v druhom jazyku (`/` ↔ `/hu/`, `/ochrana-osobnych-udajov` ↔ `/hu/adatvedelem`), nie na domovskú.
- Tap target 48×48 px aj pri krátkom texte.

---

## 3. TECHNICKÉ

- Astro i18n: `sk` je default bez prefixu (`/`), maďarčina na `/hu/`.
- `<html lang="sk">` / `<html lang="hu">`.
- `hreflang` alternates na každej stránke: `sk`, `hu`, a `x-default` → slovenská verzia.
- Obe verzie v `sitemap.xml`.
- Preklady do `src/data/content.sk.ts` a `content.hu.ts`, rovnaká štruktúra kľúčov. `business.ts` zostáva jeden — adresa, telefón a IČO sa neprekladajú.
- Právne stránky prelož obe. URL: `/hu/adatvedelem`, `/hu/felhasznalasi-feltetelek`.
- Meta description a `<title>` má každá verzia vlastné (§5).
- JSON-LD nechaj len na slovenskej verzii, `name` a `address` sú rovnaké.

**Mesto v maďarčine:** Lučenec je maďarsky **Losonc**. V bežnom texte používaj `Losonc`, ale **adresu nechaj v úradnom tvare** `Kpt. Nálepku 41, 984 01 Lučenec` — musí sedieť s Google profilom a obálkou. V sekcii mapy môžeš napísať `Losonc (Lučenec)`.

---

## 4. UPOZORNENIE K PREKLADU

Slovenské texty sme ladili na ľudský tón. Preklady nižšie som pripravil tak, aby ten tón držali, ale **nie som rodený hovorca** a v maďarčine je rozdiel medzi „správne" a „znie to ako od suseda" veľký — najmä pri odkaze majiteľov.

**Pred spustením nech maďarskú verziu prečíta niekto, kto po maďarsky hovorí od detstva.** Stačí, aby povedal, čo znie kostrbato. Poznač to do `docs/OTAZKY.md`.

Ak majiteľka alebo majiteľ hovoria po maďarsky, je to najlepší korektor — je to ich hlas.

---

## 5. PREKLADY

### 5.1 Maďarčina

**Meta**
```
title:       Staničná Záložňa Albion Losonc | Arany, ékszer és elektronika felvásárlása
description: Családi zálogház Losoncon, az állomásnál, 2001 óta. Arany, ékszer,
             elektronika, szerszám és autó zálogba vétele és felvásárlása.
             Egyedi értékbecslés, személyes megegyezés.
```

**Hlavička**
```
nav:     Szolgáltatások · Hogyan működik · Miért az Albion · Kapcsolat
tlačidlo: Hívjon
```

**Hero**
```
eyebrow: Kpt. Nálepku 41, Losonc — az állomásnál
H1:      Zálogház, ahol meg tudunk egyezni.
lead:    Albion Losoncon. Arany, ékszer, óra, elektronika, szerszám, autó
         és rendhagyó dolgok. Minden tárgyat egyedileg értékelünk,
         és őszintén megmondjuk, mennyit ér.
CTA1:    Hívjon
CTA2:    Felbecsültetném
micro:   Személyesen · Diszkréten · Bejelentkezés nélkül
```

**Pás pod hero**
```
Családi vállalkozás. Losoncon 2001 óta.
```

**Čo prijímame**
```
H2:   Mit zálogosíthat el vagy adhat el nálunk
lead: Ezekkel a dolgokkal jönnek hozzánk a leggyakrabban. A lista nem zárt.

Arany és ékszer · Órák · Mobil és elektronika · Számítógépek és laptopok ·
Szerszámok és gépek · Autók és járművek · Gyűjtői és értékesebb tárgyak ·
Egyéb értékes dolgok

záver: Ha nem látja itt a tárgyát, az nem nemet jelent. Csak azt, hogy meg
       kell néznünk.
```

**Individuálne ocenenie**
```
eyebrow: Egyedi hozzáállás
H2:      A szokatlan tárgy még nem probléma.
P1:      A láncoknak árlistájuk és engedélyezett kategóriáik vannak. Nekünk
         szemünk van és ledolgozott éveink. Minden tárgynál azt nézzük, mi az
         valójában és milyen állapotban van — nem azt, hogy belefér-e
         egy rubrikába.
P2:      Ezért tudunk beszélni gépekről, autóról, nagyobb értékű dolgokról,
         és arról is, amit örökölt és fogalma sincs, mit kezdjen vele.
CTA:     Hívjon és kérdezzen
```

**Ako to funguje**
```
H2: Hogyan működik
1.  Hívjon vagy jöjjön be
    Hívjon minket, vagy jöjjön be egyenesen az üzletbe. Sehol nem kell
    regisztrálni.
2.  Együtt felbecsüljük
    Személyesen megnézzük a tárgyat, megmondjuk, mekkora összegre tudjuk
    értékelni, és érthetően elmagyarázzuk a feltételeket.
3.  Megegyezünk
    Ha megfelel, helyben elintézzük. Ha nem, megköszönjük és jóban válunk el.
```

**Prečo Albion**
```
H2: Miért hozzánk járnak az emberek
1.  A pult mögött mi állunk
    Nem kell sehová telefonálnunk és senkitől engedélyt kérnünk. Amiben
    velünk megegyezik, az érvényes.
2.  Családi vállalkozás, nem fiók
    Ketten visszük, és ez az egyetlen üzletünk. Nem egy lánc tagjai vagyunk,
    amely egy év múlva máshová költözik. Losoncon 2001 óta működünk.
3.  Gyorsan megy
    Bejön, megnézzük, megegyezünk. Bejelentkezés nélkül, és anélkül, hogy
    várni kellene, míg valaki valahol jóváhagyja.
4.  Diszkréció
    Ami nálunk elhangzik, az nálunk marad. Nem kérdezünk olyat, ami nem
    tartozik ránk.
```

**Odkaz majiteľov**
```
eyebrow: A tulajdonosok szava
citát:   „Az évek alatt sok ember jött be ide. Egyeseknek fizetésig kellett
         kölcsön, mások eladtak valamit, ami évek óta otthon hevert. Soha nem
         kérdeztük, mire kell. Talán ezért is térnek vissza."
podpis:  a házaspár, akik 2001 óta viszik az Albiont
```

**Kde nás nájdete**
```
H2:   Az állomásnál talál meg minket
text: Kpt. Nálepku 41, Losonc (Lučenec) — pár lépésre a vasútállomástól.
CTA:  Megnyitás a Google Térképen
pod mapou: Térképadatok © OpenStreetMap közreműködők
```

**Kontakt**
```
H2:   Beszéljünk róla.
lead: Hívjon, vagy egyszerűen jöjjön be. A tárgyat ön előtt nézzük meg,
      és az összeget rögtön megtudja, nem két nap múlva.
stav: Most nyitva / Jelenleg zárva
```

**Footer**
```
Gyorslinkek · Adatvédelem · Felhasználási feltételek
Üzemeltető: ALBION P.M., s.r.o. · Cégjegyzékszám (IČO): 36 050 814
```

### 5.2 Angličtina (pripraviť, nepublikovať)

```
title:       Staničná Záložňa Albion Lučenec | Gold, Jewellery & Electronics
description: Family-run pawnshop in Lučenec by the railway station, since 2001.
             Pawn and purchase of gold, jewellery, electronics, tools and cars.
             Individual valuation, agreed in person.

nav:     Services · How it works · Why Albion · Contact
hero H1: A pawnshop where we can work something out.
hero lead: Albion in Lučenec. Gold, jewellery, watches, electronics, tools,
           cars and unusual items. We value every item individually and tell
           you straight what it is worth.
CTA:     Call us / Get an item valued
band:    A family business in Lučenec since 2001.
H2 §4:   An unusual item is not a problem.
H2 §5:   How it works
H2 §6:   Why people come to us
H2 §7:   Find us by the station
H2 §8:   Let's talk about it.
podpis:  the couple who have run Albion since 2001
```

Zvyšné anglické reťazce dopíš v rovnakom tóne — vecne, bez marketingových fráz, bez superlatívov.

---

## 6. ČO SA NEPREKLADÁ

Názov `Staničná Záložňa Albion`, `ALBION P.M., s.r.o.`, adresa v úradnom tvare, telefón, IČO, `alt` texty (sú prázdne).

---

## 7. PORADIE

1. i18n routing + prepínač + `hreflang` + sitemap
2. `content.hu.ts` podľa §5.1
3. Právne stránky v HU
4. `content.en.ts` pripraviť, `enabled: false`
5. Poznámka o korektúre do `OTAZKY.md`
6. `git push`

Report do `docs/REPORT_faza15.md`, stručne.
