# REPORT — fáza 28 (dávka 22)

Zadanie: `docs/PROMPT_FINAL22.md`. Postup podľa §5.

> **Dávka 21 nie je v tomto reporte.** Rozrobil som ju, ale na tvoj pokyn
> („sprav iba posledný prompt“) som ju odložil. V repe z nej nie je nič —
> autá sú stále v mriežke aj v hero, zlato je stále na jednom mieste
> a hero maska je nezmenená. `docs/REPORT_faza27.md` preto neexistuje.

---

## §1 — Tri obrazy

Zdroje už boli stiahnuté. **Obraz C bol poškodený** — súbor sa stiahol neúplne
(6 054 451 B bez koncového `IEND` chunku), `sharp` na ňom padal s
`vipspng: libpng read error`. Stiahol som ho znova, druhýkrát prišiel celý
(6 763 159 B).

Spracované cez `build-images.mjs`. Grading `brightness` 0,70 / `saturation` 0,85
podľa zadania — **s jednou výnimkou, obrazom B**, dôvod je v §2 nižšie.

| | zdroj | AVIF | WebP | rozmer |
|---|---|---|---|---|
| **A** prstene | `gold-rings-1400` | **9,5 kB** | 14,9 kB | 1400×781 |
| | `gold-rings-700` | **4,6 kB** | 5,9 kB | 700×391 |
| **B** retiazky | `gold-chains-1600` | **9,5 kB** | 17,7 kB | 1600×893 |
| | `gold-chains-760` | **4,4 kB** | 6,3 kB | 760×424 |
| **C** prsteň | `gold-ring-1100` | **7,5 kB** | 10,5 kB | 1100×614 |
| | `gold-ring-760` | **4,7 kB** | 6,0 kB | 760×424 |

Strop zo zadania bol 40 kB pri 1600 px a 20 kB pri 760 px. Najväčší súbor má
9,5 kB, teda **štvrtinu rozpočtu**. Rozmery som nedal na plný strop 1600 px
všade — panel v „Zvláštnej veci“ má 42 % šírky a prsteň v „Slove majiteľov“
38 %, tam by plná šírka bola len stiahnutý pixel navyše.

---

## §2 — Nasadenie

| Sekcia | Obraz | Krytie | Poznámka |
|---|---|---|---|
| Zvláštna vec ešte neznamená problém | A | **0,45** (nie 0,85) | pravý panel 42 %, `mask-image`, len desktop |
| Založiť alebo predať? | B | **0,09 / 0,06** (nie 0,13) | full-bleed, `grayscale(0.25)` |
| Slovo majiteľov | C | 0,35 / 0,23 | pravá tretina, `mask-image` |
| Prečo Albion | textúra `wide` | bez zmeny | |
| Kontakt | textúra `contact` | bez zmeny | |
| Svetlé sekcie | žiadny | bez zmeny | |

Všetky tri majú `alt=""` + `aria-hidden="true"`.

**Sekcia predaja („Zlato a šperky aj predávame“) zostala bez obrazu.** Pravidlo
„pozadie, nikdy nie ponuka“ je zapísané v komentári v `SectionTexture.astro`
aj v `build-images.mjs`, nech ho neporuší niekto neskôr.

### Dve odchýlky od zadaných čísel

**A — krytie 0,45 namiesto zdedených 0,85.** Zlatý satén bol abstraktný
a 0,85 uniesol. Makro fotka prsteňov pri tom istom krytí čítala ako produktová
fotka tovaru na predaj — presne to, čo §2 zakazuje — a ťahala pozornosť
z nadpisu. Pri 0,45 z obrazu ostane hĺbka, nie ponuka. Zároveň som predĺžil
nábeh masky (fade od 30 % namiesto 40 %), lebo ostrá kresba potrebuje dlhší
prechod, aby nemala čitateľný obrys.

**B — krytie 0,09 namiesto 0,13 a grading 0,55 namiesto 0,70.** Toto nebolo
estetické rozhodnutie, ale kontrast. Podrobne:

- Pri zadaných hodnotách klesol kontrast `bone` v tejto sekcii na **10,82:1**,
  cieľ je 12:1.
- Samotné krytie to nevytiahlo: ani pri 0,08 sa desktop nedostal nad 11,81:1.
  Strop nad čistým podkladom `ink-800` je 13,36:1, takže priestor je úzky.
- Príčina bola v obraze, nie v CSS. **B prišiel podstatne svetlejší než
  ostatné dva** — priemerná luminancia 0,132 oproti 0,064 (A) a 0,062 (C) —
  a zároveň je jediný full-bleed, teda leží pod všetkým textom sekcie.
- Grading 0,55 + krytie 0,09 dáva **12,15:1**. Obe páky spolu, ani jedna sama.

Navyše na mobile: sekcia je vysoká a úzka, takže `object-fit: cover` z obrazu
16:9 vyrezal úzky zvislý pruh a motív sa niekoľkonásobne zväčšil — retiazky
začali čítať ako obraz, nie ako tón. Nie je to o krytí, ale o mierke, takže sa
to stlmením vyriešiť nedalo. Výrez som pod 768 px posunul na prázdnu pravú
časť kameňa (`object-position: 76% center`).

### Kontrast — namerané

Meria sa **na pixeloch**, nie na tokenoch. Zo screenshotu sa to odčítať nedá,
lebo v screenshote je aj samotné písmo — meral by sa text proti textu. Nový
skript `scripts/check-section-contrast.mjs` preto poskladá podklad presne tak,
ako to robí prehliadač (výrez `cover` → `filter` → maska → krytie → podklad
sekcie) a nájde najsvetlejší pixel v pásme, kde naozaj leží text. Je to teda
najhorší možný prípad, nie priemer. Geometria je odmeraná v prehliadači
pri 1440 px a 390 px.

Spustenie: `npm run contrast` (spustí aj pôvodný hero test).

| Sekcia | `bone` (cieľ 12:1) | `bone-muted` (4,5:1) | `gold` (4,5:1) |
|---|---|---|---|
| Zvláštna vec · desktop | **14,86:1** | 8,09:1 | 8,07:1 |
| Založiť alebo predať? · desktop | **12,15:1** | 6,62:1 | 6,60:1 |
| Založiť alebo predať? · mobil | **12,49:1** | 6,80:1 | 6,79:1 |
| Slovo majiteľov · desktop | **13,28:1** | 7,24:1 | 7,22:1 |
| Slovo majiteľov · mobil | **12,65:1** | 6,89:1 | 6,87:1 |

„Zvláštna vec“ vychádza na plných 14,86:1, lebo text drží ľavých 58 % a panel
začína až na 835 px — pod písmom nie je z obrazu nič.

### Váha stránky

Merané z `performance.getEntriesByType('resource')` po prejdení celej stránky,
vrátane mapy.

| | desktop 1440 px | mobil 390 px |
|---|---|---|
| HTML (vrátane inline CSS) | 28,3 kB | 28,3 kB |
| fonty | 222,1 kB | 222,1 kB |
| obrazy | 101,8 kB | 65,8 kB |
| **spolu** | **352,1 kB** | **316,1 kB** |

Strop je 400 kB. **Tri nové obrazy pridali 27,4 kB na desktope a 9,7 kB na
mobile** — pôvodný odhad bol ~100 kB priestoru, minul som z neho tretinu.
Na mobile je to menej, lebo panel A sa pod 1024 px nevykresľuje vôbec.

Najväčšia položka na stránke sú stále fonty (222 kB, 63 %), nie obrazy.

---

## §2b — Štvrtý obraz

Nič som nepredbiehal. Až príde záber s množstvom rôznych prsteňov, nahradí
obraz A v „Zvláštnej veci“ a A sa presunie na miesto C. Tvary prsteňov nie sú
nikde v `content.*.ts` ani v žiadnom inom texte — popisné pomenovanie
(*široké, zdobené, dute tvarované, tenké obrúčky*) som zatiaľ nikam nepísal,
lebo zatiaľ nie je čo popisovať.

Rovnako obraz C v „Slove majiteľov“ **vypadne, keď príde fotka manželov** —
je to zapísané v komentári priamo v `OwnerNote.astro`, aby to nezapadlo.

---

## §3 — Mobilná kompatibilita, bod po bode

**1. `mask-image` vždy s `-webkit-mask-image`.** ✔ Splnené. Nové masky sú
v `OwnerNote.astro` (dva breakpointy, oba s prefixom) a vo `Valuation.astro`.
Prešiel som `grep`-om aj všetky existujúce: `Contact.astro`, `LocationMap.astro`,
`PaperGold.astro` (dve masky) — všade je prefix pri neprefixovanej verzii.
Celkovo 6 miest, 0 bez prefixu.

**2. `filter: grayscale()` statický, nikdy animovaný.** ✔ Splnené. Jediný nový
filter je `grayscale(0.25)` na `.pawn-texture`. Overené v prehliadači:
`transition-duration: 0s`, `animation-name: none`. Existujúci `grayscale(0.4)`
vo `WhyAlbion.astro` je rovnako statický. Varovanie je zapísané v komentári
pri filtri, nech ho niekto neskôr neanimuje.

**3. Žiadny nový `backdrop-filter`.** ✔ Splnené — a **nie je nikde žiadny**,
ani starý. `grep -rn "backdrop-filter\|backdrop-blur" src/` nevracia nič.
Overené aj v prehliadači na všetkých troch vrstvách: `backdrop-filter: none`.

**4. `background-attachment: fixed` nikde.** ✔ Splnené. `grep` na
`background-attachment` aj na tailwindovú `bg-fixed` nevracia nič, počítaná
hodnota na všetkých troch vrstvách je `scroll`.

**5. Každý obraz má vlastný mobilný variant cez `<source media>`.** ✔ Splnené,
ale inak, než by stačilo. `SectionTexture.astro` teraz vie mobilný zdroj
s vlastným `media` a mobilné `<source>` stoja **pred** desktopovými (prehliadač
berie prvý, ktorého `media` aj `type` sedia).

Hranica nie je pre všetky rovnaká — je nastavená tam, kde sa obraz v CSS
naozaj mení:

- B a C: `(max-width: 767px)`, teda tam, kde klesá krytie.
- A: `(max-width: 1023px)`, lebo panel sa pod 64rem nevykresľuje vôbec.
  S jednotnou hranicou 767 px by si tablet stiahol desktopový súbor pre prvok,
  ktorý ani nevidí.

Overené v prehliadači: pri 390 px sa ťahá `gold-chains-760.avif`
a `gold-ring-760.avif`, pri 1440 px `gold-chains-1600.avif` a `gold-ring-1100.avif`.
Panel A sa na mobile nestiahol vôbec.

**6. Všetky nové obrazy `loading="lazy"` a `decoding="async"`.** ✔ Splnené.
Overené na vykreslených prvkoch: všetky tri majú `loading="lazy"`,
`decoding="async"` a **žiadny `fetchpriority`**. `fetchpriority="high"` má
naďalej len hero — overené, že ho má práve jeden obraz na stránke.

**7. Lazy obraz za animáciou musí uvoľniť ten istý observer, čo spúšťa
animáciu.** ✔ Preverené — a **žiadne drôtovanie nebolo treba**. Pasca pri mape
bola v tom, že `.map-base` štartuje na `opacity: 0`; v tej kombinácii
prehliadač lazy obraz vôbec nezačne sťahovať. Tieto tri vrstvy majú **statické
krytie, ktoré nikdy nie je 0** (0,45 / 0,09 / 0,35), nie sú `data-reveal`
a ani nemajú `data-reveal` predka — overil som obidve podmienky programovo.
Načítanie im teda rieši natívny lazy loader a všetky tri sa reálne stiahnu.
Ak by niekto neskôr dal ktorúkoľvek z nich za reveal, musí observer dorobiť.

**8. Pod 768 px zníž krytie o tretinu.** ✔ Splnené pri B a C:

| | desktop | mobil |
|---|---|---|
| B retiazky | 0,09 | 0,06 |
| C prsteň | 0,35 | 0,23 |

Krytie je písané mobile-first a **základ je tá nižšia hodnota** — desktop ju
zdvíha. Pri A to neplatí: panel sa pod 1024 px nevykresľuje, takže nie je čo
stlmovať. To je pôvodné rozhodnutie z čias zlatého saténu („na úzkom displeji
by z neho ostal len pruh“) a nechal som ho, lebo §2 hovorí, že A satén
*nahradí* — nie že zmení jeho správanie.

**9. Emulácia so škrtením CPU 4×, iOS aj Android.** ✔ Otestované, **scroll
zostal plynulý na oboch**.

| profil | viewport | dlhé úlohy počas celého scrollu |
|---|---|---|
| iOS 17 Safari UA | 390×844, DPR 3 | **0** |
| Android 13 Chrome UA | 412×915, DPR 2,6 | **0** |

Merané cez `PerformanceObserver` na `longtask` počas prejdenia celej stránky
dole aj späť hore. Nula dlhých úloh je očakávaný výsledok: vrstvy sú statické,
nič sa pri scrolle neprepočítava — žiadny `backdrop-filter`, žiadny animovaný
filter, žiadny scroll listener, ktorý by niečo kreslil.

Doplnkovo z trace pri 4× škrtení: **LCP 850 ms, CLS 0,00.**

Jedna vec za zmienku: pri 4× škrtení posúva prehliadač prah lazy loadingu
bližšie k viewportu, takže tón sekcie nabehne o kúsok neskôr než pri plnom
výkone. Pri krytí 0,06–0,09 to nie je vidieť.

---

## §4 — Náhľady

Ukázané pred pushom: desktop celá stránka, mobil celá stránka, detail
„Zvláštna vec“ a detail „Slovo majiteľov“.

Znížené krytie som pri prehliadaní upravil dvakrát, obe zmeny sú vysvetlené
v §2: **A z 0,85 na 0,45** (čítalo ako produktová fotka) a **B z 0,13 na 0,09**
(kontrast) plus posun výrezu na mobile (mierka motívu).

---

## Čo som pridal navyše

- **`scripts/check-section-contrast.mjs`** — meranie sa dá zopakovať. Bez neho
  by čísla v tomto reporte platili len dnes.
- **`npm run contrast`** — spustí hero aj sekciový test naraz.

## Čo zostalo nedoriešené

- **Textúra `tex-gold-*` (zlatý satén) sa už nikde nepoužíva** — nahradil ju
  obraz A. Súbory aj kľúč `gold` som nechal ako zálohu, na stránku sa
  nesťahujú. Ak ich chceš preč, je to jeden commit; nechal som to na teba,
  lebo §2b ráta s ďalším presúvaním obrazov.
- **`tex-panel-*` je nepoužitá už dlhšie**, nie mojou zmenou. To isté platí.
- **Dávka 21** čaká celá.
