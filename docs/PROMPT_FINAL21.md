# DÁVKA 21 — autá preč, zlato dopredu, hero maska

> Nepushuj zatiaľ. Zapracuj toto a pushni všetko naraz aj s fotkou.

---

## 1. AUTÁ A VOZIDLÁ — ODSTRÁNIŤ ZO VŠETKÉHO

Majiteľ potvrdil, že záložňa s autami nerobí. Pôvodné zadanie projektu ich uvádzalo, ale majiteľ má prednosť pred zadaním.

Odstráň **všetky** zmienky:

| Kde | Čo |
|---|---|
| mriežka služieb | celá položka „Autá a vozidlá" aj s podriadkom |
| hero lead | slovo `autá` |
| „Zvláštna vec ešte neznamená problém" | slovo `aute` |
| SEO mapovanie v `docs/BRIEF.md` §12 | `založenie auta Lučenec` |
| `LAUNCH_CHECKLIST.md` §F | plánovaná podstránka `/auta` |
| HU a EN preklady | to isté |

Prejdi to `grep`-om cez `src/` aj `docs/`, nech nikde nezostane. Vypíš do reportu, koľko výskytov si našiel.

---

## 2. ZLATO DOPREDU — MRIEŽKA SA PREROBÍ

Zlato je hlavná činnosť a prstene kupujú často. Zaslúži si dve miesta, nie jedno — a zároveň to zaplní dieru po autách, takže mriežka zostane 4 × 2.

Nové znenie celej mriežky:

```
01  Zlato
    Zlomkové zlato, retiazky, prívesky. Aj poškodené.

02  Prstene a šperky
    Snubné a zásnubné prstene, náramky, náušnice. Aj nenosené.

03  Hodinky
    Značkové aj staršie mechanické. Aj nefunkčné.

04  Mobily a elektronika
    Telefóny, tablety, reproduktory, slúchadlá, herné konzoly.

05  Počítače a notebooky
    Notebooky, monitory, grafické karty.

06  Náradie a stroje
    Aku náradie, brúsky, zváračky, záhradná technika.

07  Zberateľské a cennejšie predmety
    Mince, striebro, medaily, hudobné nástroje.

08  Iné veci s hodnotou
    (bez podriadku, ako doteraz)
```

Hero lead po odstránení áut:

```
Zlato, šperky, elektronika, náradie aj atypické veci.
Oceníme ich pri vás a sumu povieme na rovinu.
```

„Zvláštna vec ešte neznamená problém", opravená veta:

```
Reťazce majú cenník a zoznam povolených kategórií. My sa pozeráme na to,
čo vec naozaj je a v akom je stave — preto sa vieme baviť aj o strojoch
alebo o niečom, čo ste zdedili a netušíte, čo s tým.
```

Prelož do HU a EN. `Zlomkové zlato` = `tört arany` / `scrap gold`, ako doteraz.

---

## 3. HERO — VCHOD NIE JE VIDNO

Maska je nad vchodom príliš hustá. To, že si ju musel otvárať, bol správny inštinkt — ale problém nie je v sile, je v **tvare**.

Vodorovný prechod zľava doprava stmavuje aj stred, a vchod je práve v strede. Text pritom potrebuje kryť len ľavú tretinu.

**Zmeň masku na eliptickú, ukotvenú na text:**

```css
.hero::after {
  background:
    radial-gradient(125% 110% at 12% 50%,
      rgb(26 29 34 / 0.97) 0%,
      rgb(26 29 34 / 0.93) 30%,
      rgb(26 29 34 / 0.60) 58%,
      rgb(26 29 34 / 0.22) 100%),
    linear-gradient(to top, rgb(26 29 34 / 0.85) 0%, rgb(26 29 34 / 0) 38%);
}
```

Krytie tak klesá **od textu smerom von**, nie zľava doprava. Stred a pravá strana sa otvoria, ľavá zostane hustá pod H1.

Ďalej:

1. **`object-position` posuň na `62% center`** — vchod sa tým dostane doprava, mimo textu. Tvoj postreh, že sa do pravej tretiny nedá dostať orezom, je správny; posunieme teda celý obraz, nie orez.
2. **Hero zvýš** na desktope o ~12 % (v rámci `svh`), nech má kompozícia priestor a text netlačí na vchod.
3. **Kontrast H1 premeraj znova.** Máš 13,17:1, cieľ 12:1 — je tam rezerva, tak ju využi na otvorenie obrazu. Ak by klesol pod 12, priplus krytie len v prvých dvoch zastaveniach elipsy, nie v celej maske.
4. Na mobile skontroluj zvlášť — pri 4:5 výreze je vchod inde a maska sa správa inak.

**Ukáž mi náhľad znova pred pushom.**

---

## 4. FOTKA — CHCEME ORIGINÁL

Máš pravdu, že je to snímka obrazovky z telefónu s čiernymi pruhmi. Používame ju dočasne, ale do `docs/OTAZKY.md` pridaj:

> **Originál fotky vchodu.** Súčasná je snímka obrazovky (1290×2796, čierne pruhy), nie pôvodná fotografia. Potrebujeme originál priamo z galérie telefónu, ideálne **nafotený na šírku**, aby sa nemusel orezávať z portrétu. Poslať e-mailom alebo cez Disk, nie cez Messenger.

Rovnako video: `568×320` je na Google profil málo, tam patrí originál z telefónu. Doplň to k tomu istému bodu.

---

## 5. K POČTU SLOV

−22 namiesto −35 je v poriadku. Mal si pravdu, že viac sa vytiahnuť nedá bez zásahu do toho, čo §3.4 chránila. Po odstránení áut z mriežky a hero to klesne o ďalších pár slov samo.

---

## 6. POSTUP

1. §1 autá preč, cez `grep` overiť
2. §2 nová mriežka a texty + preklady
3. §3 hero maska a posun obrazu
4. §4 otázky
5. **náhľad desktop aj mobil → ukáž → potom push**

Report do `docs/REPORT_faza27.md`.
