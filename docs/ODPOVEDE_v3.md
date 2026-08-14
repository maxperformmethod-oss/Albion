# ODPOVEDE + SMER „WOW" (14. 8. 2026)

> Platí spolu s `docs/BRIEF.md`. Kde si odporujú, platí tento súbor.

---

## ČASŤ A — ODPOVEDE NA `OTAZKY.md`

### 1. Adresa — POTVRDENÉ, dlh splať hneď

**Rúbanisko II 76 je stará a zrušená prevádzka.** Platí jediná adresa:

```
Kapitána Nálepku 41, 984 01 Lučenec
```

Urob teraz:

- v `business.ts` nastav `street: "Kapitána Nálepku 41"`, `city: "Lučenec"`, `postalCode: "984 01"` — už **nie** `TO_CONFIRM`,
- **odstráň adresu natvrdo zo všetkých textov.** Hero eyebrow aj sekcia 7 sa skladajú z `business.ts`,
- v `docs/FIRMA_UDAJE.md` označ Rúbanisko II ako zrušené.

Zostáva `TO_CONFIRM`: telefón, e-mail, `mapsUrl`, `geo`, hodiny, IČO, doména.

### 2. Obedňajšia prestávka — implementuj ju

Nevieme, či ju majú. Dátový model to už zvláda, tak doplň aj stav **„Obedňajšia prestávka · otvárame o {čas}"**. Ak prestávku nemajú, stav sa jednoducho nikdy nevykreslí. Lacnejšie teraz než dorábať neskôr.

### 3. Mapa bez `<iframe>` — potvrdené

Áno, je to zámer. Typografický blok + tlačidlo do Google Máp. Žiadny screenshot, žiadny Static Maps request.

---

## ČASŤ B — ČO ZNAMENÁ „WOW" NA TOMTO PROJEKTE

Najprv nesúhlas, aby sme si nerozbili stratégiu:

**WOW tu nesmie byť efekt.** Človek, ktorý hľadá záložňu, rieši peniaze — nie zábavu. Efektný web (particles, parallax, kurzorové hračky, video pozadie) by pôsobil ako fintech startup a **znížil** by dôveru. Prišli by sme presne o to, na čom Albion stojí.

**WOW tu znamená:** za 3 sekundy musí byť zjavné, že tento web je drahší a serióznejší než čokoľvek iné v Lučenci. To sa dosahuje **remeselnou kvalitou, nie počtom efektov.**

Preto: **tri veci, nie desať.** Ak by si chcel pridať štvrtú, opýtaj sa.

### B1. Ťažšia typografia — schválené, urob to

| Prvok | Bolo | Nové |
|---|---|---|
| H1 | serif 400 | **serif 600**, `letter-spacing: -0.022em`, `line-height: 1.04` |
| H2 | serif 400 | **serif 600**, `letter-spacing: -0.018em` |
| H3 / názvy krokov a bodov | serif 400 | **serif 600** |
| Eyebrow | Inter 500 | **Inter 600** |
| Telo | Inter 400 | bez zmeny |
| Tlačidlá | Inter 500 | **Inter 600** |

Source Serif 4 Variable to zvládne bez ďalšieho súboru (variabilná os `wght`). **Ale:** ťažší nadpis mení metriky, takže po zmene **znova zmeraj CLS** a v prípade potreby dolaď `size-adjust` fallbacku. Georgia je v tučnom reze širšia než Source Serif.

### B2. Hero s obrazom — hlavný nositeľ dojmu

Hero prestáva byť čisto typografický. Skladba:

1. Full-bleed tmavý obraz na pozadí (abstraktná textúra, dodám ju — viď časť C),
2. cez neho `linear-gradient` maska z `--color-ink-900` (zľava/zdola ~92 % → hore ~55 % krytie), aby text mal vždy 16:1 kontrast bez ohľadu na obraz,
3. typografia nad tým, bez boxu a bez podfarbenia,
4. tenká zlatá hairline pod eyebrow, šírka ~64 px.

**Výkonový rozpočet — nepohyblivý:**

- obraz je `<img>` (nie CSS background), `fetchpriority="high"`, `decoding="async"`, **bez** `loading="lazy"`,
- AVIF + WebP fallback, max šírka 1920, správne `sizes`,
- **cieľ ≤ 140 kB** pre najväčší variant, mobilný variant ≤ 60 kB,
- obraz sa stane LCP prvkom — to je v poriadku, ale LCP musí zostať **< 1.8 s**. Ak ho prekročíš, obraz zmenši, nie odstraňuj animácie.
- `width`/`height` povinné, CLS 0.

### B3. Jeden pamätný moment — riadkový reveal H1

Presne **jeden** prvok na celom webe dostane výnimočnú animáciu: `<h1>`.

- Každý riadok v samostatnom `<span>` s `overflow: hidden`, vnútro `translateY(100%) → 0`,
- `700ms`, `--ease-out-quint`, stagger 90 ms medzi riadkami,
- spúšťa sa raz, po `load`, nie cez `IntersectionObserver`,
- pri `prefers-reduced-motion` sa nespustí vôbec a text je hneď na mieste,
- bez JS je text viditeľný (animačná trieda sa pridáva skriptom).

Nikde inde na stránke sa tento typ animácie neopakuje. To je celý vtip — je to jediný raz.

### B4. Zlatá hairline, ktorá sa nakreslí

Oddeľovače medzi sekciami: `transform: scaleX(0) → scaleX(1)`, `transform-origin: left`, 500 ms, pri vstupe do viewportu, raz. Farba `--color-gold` pri 40 % krytí. Nič viac.

### Naďalej zakázané

Parallax · karusel · počítadlá čísel · kurzorové efekty · particles · 3D · scroll-jacking · autoplay video pozadie · typewriter · lesk cez text · hover efekty, ktoré posúvajú layout.

---

## ČASŤ C — FOTKY (dôležité, čítaj celé)

### Čo NEROBÍME

1. **Fotky z Google Maps ani Street View.** Sú licencované a ich stiahnutie a použitie na komerčnom webe porušuje podmienky Google. Toto nie je opatrnosť, je to jasné porušenie. Ani ako dočasný placeholder.
2. **AI fotka výkladu, interiéru alebo majiteľa Albionu.** To by bola vymyslená realita — zákazník príde a nájde niečo iné. Je to proti pravidlu 2 celého briefu a poškodilo by to presne tú dôveru, ktorú budujeme.
3. Stock fotky peňazí, zlatých tehličiek, podania rúk.

### Čo je v poriadku a čo dodám

**Abstraktná textúra**, ktorá nezobrazuje žiadne konkrétne miesto, predmet ani osobu — len grafitový povrch s jedným teplým svetlom. To nie je tvrdenie o realite, je to materiál. Generujem ju teraz.

Súbor uložím ako:

```
src/assets/hero-texture.avif   (+ .webp fallback)
```

Kým ho tam nemám, postav hero tak, aby fungoval **aj bez obrazu** — čistý `ink-900` podklad. Obraz je vrstva navyše, nie podmienka.

### Čo potrebujeme od majiteľa (napíš to do README)

6 fotiek z mobilu, na výšku aj šírku, denné svetlo, bez blesku:

1. exteriér prevádzky s viditeľným vchodom,
2. výklad / označenie,
3. interiér — pult, kde sa oceňuje,
4. detail zlata alebo šperkov na tmavom podklade,
5. okolie so stanicou v zábere (dokazuje „pri stanici"),
6. majiteľ pri pulte (ak súhlasí — najsilnejší trust prvok, aký môžeme mať).

Reálna fotka majiteľa a prevádzky prekoná akúkoľvek generovanú grafiku. To je to, čo Breva nemá.

---

## ČASŤ D — KONTAKTNÉ „OKNO" — NEODPORÚČAM

Návrh bol dať kontakt do modálneho okna. **Nesúhlasím, pretože** modal pridá JS, focus management a horšie správanie na mobile, a hlavne vloží jeden klik navyše pred konverziu. Kontakt v sekcii je priamo v scrolle, indexovateľný a funguje aj bez JS.

**Odporúčam:** kontakt zostáva sekcia. Rýchly prístup už riešime sticky call barom na mobile a tlačidlom v hlavičke na desktope. To je rýchlejšie než modal.

**Riziko tvojho postupu:** menej telefonátov, horšie lokálne SEO (kontaktné údaje v skrytom `dialog` majú menšiu váhu).

Všetko na jednej stránke — **súhlasím**, tak to aj zostáva. Žiadne podstránky v tejto fáze.

---

## ČASŤ E — NAINŠTALOVANÉ SKILLS

V mojej relácii ich nevidím, takže ich posúď ty. Pravidlo:

- **Použi skill, ak zlepší remeslo** (accessibility audit, image optimalizácia, CSS review, testovanie).
- **Nepouži skill, ktorý ťahá runtime do webu.**

Konkrétne k **Remotion**: je to React framework na renderovanie videa. **Do Astro webu nepatrí** — priniesol by React runtime a rozbil rozpočet 20 kB JS. Legitímne použitie je len offline: vyrenderovať krátke video na sociálne siete alebo animovaný OG obrázok, ako samostatný artefakt mimo `src/`. Ak by skill navrhol video pozadie hero sekcie, **odmietni to** a napíš mi prečo.

---

## ČASŤ F — ČO UROBIŤ TERAZ (v tomto poradí)

1. Adresa z `business.ts` do textov, `postalCode` `984 01`, Rúbanisko označiť za zrušené.
2. Obedňajšia prestávka v `hours.ts`.
3. Typografia B1 + premeranie CLS.
4. Hero prestavba B2 (funkčná aj bez obrazu).
5. H1 reveal B3.
6. Hairline B4.
7. `README.md` — zoznam 6 fotiek od majiteľa.
8. `git push`.
9. Report do `docs/REPORT_faza7_wow.md` — čo si overil, čo nie, aké čísla ti vyšli pre CLS a veľkosť JS.

**Fázu 6 (audit) stále nespúšťaj** — chýba telefón a doména.

Chýbajúce údaje: telefón, e-mail, `mapsUrl`, `geo`, otváracie hodiny, IČO, doména.
