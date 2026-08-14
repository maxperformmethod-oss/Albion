# ALBION — MASTER BRIEF v2 (zdroj pravdy)

> Toto je zlúčená a **záväzná** verzia: pôvodný MASTER PROMPT v1 + všetky rozhodnutia A–J.
> Kde si čokoľvek odporuje, platí tento súbor. Neuvádzaj tento súbor do zástavy — uprav ho len na moju výslovnú žiadosť.

---

## 0. PRAVIDLÁ PRÁCE

1. **Nemeň strategické rozhodnutia** (farby, typografia, poradie sekcií, CTA hierarchia, tón textov). Ak niečo považuješ za chybu, napíš to a opýtaj sa.
2. **Nevymýšľaj fakty.** Ceny, úroky, poplatky, hodiny, telefón, IČO, právne podmienky, počty klientov — patria do `src/data/business.ts` ako `TO_CONFIRM`.
3. Commituj po fázach (`chore(setup):`, `feat(ui):`, `feat(layout):`, `feat(sections):`, `feat(seo):`, `chore(qa):`).
4. Netvrď, že je niečo hotové, pokým to reálne nezbehlo. Po fáze uveď „overené / neoverené".
5. Žiadne nové závislosti bez zdôvodnenia.
6. Kód a názvy po anglicky, obsah webu po slovensky s diakritikou.
7. **Komunikácia ide cez súbory v `C:\Dev\albion\docs\`.** Odpovede píš do `docs/REPORT_<fáza>.md`, otázky do `docs/OTAZKY.md`. V chate len 5–10 riadkov zhrnutia.

---

## 1. ROZSAH

Statický marketingový web pre **Albion — záložňa v Lučenci**.

**Fáza 1–6 (teraz):** jedna homepage `/` + `404` + SEO základ. Architektúra pripravená na podstránky.
**Neskôr (NEIMPLEMENTUJ):** `/vykup-zlata`, `/auta`, `/kontakt`, sekcia „Vybraný tovar".

**Stack:** Astro (aktuálna stabilná verzia) · Tailwind CSS v4 cez `@tailwindcss/vite` · TypeScript strict · `@astrojs/sitemap` · self-hosted fonty. **Žiadny React/Vue/Svelte, žiadna animačná ani ikonová knižnica.**

**Cieľ webu:** premeniť lokálneho návštevníka na **telefonát alebo osobnú návštevu**. Nič iné nie je konverzia.

---

## 2. BIZNIS KONTEXT

**Názov:** Albion · **Verejné označenie:** Albion — Záložňa Lučenec
**Adresa:** Kapitána Nálepku 41, Lučenec (pri železničnej stanici) — *pozri `docs/FIRMA_UDAJE.md`, adresa čaká na potvrdenie majiteľom*
**Pôsobí:** približne od roku 2001 (nepotvrdené, viď `foundedYearConfirmed`)

**Služby:** záložné služby, výkup cenných vecí, predaj vybraných vecí (sekundárne), individuálne ocenenie, individuálne dohody, veci vyššej hodnoty.

**Prijíma:** zlato, šperky, hodinky, elektronika, telefóny, počítače, náradie, stroje, cennejšie predmety, vozidlá, autá, väčší majetok.

**Kľúčový princíp:** *Ak to má hodnotu, Albion je ochotný sa o tom individuálne baviť.* Kategórie nikdy neprezentuj ako uzavretý zoznam.

**Odlíšenie od reťazcov (Breva a i.):** osobný prístup, individuálna dohoda, flexibilita, dlhá lokálna história, majiteľ rozhoduje osobne, diskrétnosť, netypické a hodnotnejšie veci.

**Pozicioning:** *„Záložňa, kde sa vieme dohodnúť."*

**Cieľová skupina:** ľudia z Lučenca a okolia, prevažne mobil, často zo stresovej finančnej situácie.
**Dôsledok:** vizuál premium, **jazyk obyčajný a teplý**. Nikdy nesmie vzniknúť pocit „sem s bežnou vecou nemôžem ísť".

---

## 3. DIZAJNOVÁ FILOZOFIA — „Diskrétny trezor"

Web pôsobí ako tichá oceňovacia kancelária, nie ako výklad so zlatom.

**Má byť:** usadené, dôveryhodné, diskrétne, zrelé, moderné, hodnotné, lokálne.
**Nesmie byť:** lacné, podozrivé, agresívne, kasíno, prehnaný luxus, kýč, bazár, šablóna.

1. Tmavý grafitový základ, teplá kostená biela pre pokojné sekcie.
2. **Zlato ako podpis, nie ako povrch** — max ~5 % plochy. Žiadne zlaté gradienty, lesky, glow, zlaté pozadia.
3. Typografia nesie dizajn. Veľký serif nadpis + čisté sans telo.
4. Priestor = hodnota. Jedna myšlienka na sekciu.
5. Vlasové linky namiesto kariet a tieňov.
6. Žiadne fotografie v Fáze 1 (reálne neexistujú, stock je zakázaný).

---

## 4. DESIGN SYSTEM — ZÁVÄZNÉ TOKENY

> **Toto sú originálne hodnoty. Nahraď nimi všetky rekonštruované tokeny v `global.css` a odstráň značky `⚠ REKONŠTRUOVANÉ`.**

```css
@theme {
  /* Dark base */
  --color-ink-900: #0F1113;
  --color-ink-800: #171A1D;
  --color-ink-700: #1F2327;

  /* Light base */
  --color-paper:   #F5F2EC;
  --color-paper-2: #EBE6DC;

  /* Text */
  --color-bone:       #F5F2EC;
  --color-bone-muted: #B7B2A9;
  --color-ink-text:   #14171A;
  --color-ink-muted:  #55595E;

  /* Accent — champagne gold */
  --color-gold:       #C6A971;
  --color-gold-hover: #D9C08F;
  --color-gold-ink:   #7E6532;

  /* Decorative hairlines */
  --color-hairline-dark:  rgba(245, 242, 236, 0.14);
  --color-hairline-light: rgba(20, 23, 26, 0.12);

  /* Interactive borders (WCAG 1.4.11 — min 3:1) */
  --color-border-interactive-dark:  #6B675F;
  --color-border-interactive-light: #807B72;

  /* Type */
  --font-serif: "Source Serif 4 Variable", Georgia, "Times New Roman", serif;
  --font-sans:  "Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif;

  --text-display: clamp(2.4rem, 6.2vw, 4.5rem);
  --text-h2:      clamp(1.85rem, 3.6vw, 2.9rem);
  --text-h3:      clamp(1.25rem, 2vw, 1.6rem);
  --text-lead:    clamp(1.05rem, 1.6vw, 1.3rem);
  --text-body:    1.0625rem;
  --text-small:   0.9375rem;
  --text-eyebrow: 0.8125rem;

  /* Space & shape */
  --spacing-section: clamp(4.5rem, 9vw, 8.5rem);
  --radius-sm: 3px;
  --radius-md: 4px;
  --container-max: 1200px;
  --container-text: 720px;

  /* Motion */
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 180ms;
  --duration-base: 420ms;
}
```

**Overené kontrasty (WCAG 2.x):**

| Dvojica | Pomer | Stav |
|---|---|---|
| bone `#F5F2EC` / ink-900 | 16.93:1 | ✅ |
| bone-muted `#B7B2A9` / ink-900 | 8.97:1 | ✅ |
| gold `#C6A971` / ink-900 | 8.39:1 | ✅ |
| gold `#C6A971` / ink-800 | 7.75:1 | ✅ |
| ink-text `#14171A` / paper | 16.10:1 | ✅ |
| ink-muted `#55595E` / paper | 6.31:1 | ✅ |
| gold-ink `#7E6532` / paper | 4.95:1 | ✅ tesne |
| border-interactive-dark / ink-900 | 3.36:1 | ✅ |
| border-interactive-dark / ink-800 | 3.10:1 | ✅ |
| border-interactive-light / paper | 3.76:1 | ✅ |
| **gold `#C6A971` / paper** | **2.02:1** | ❌ **zakázané** |

**Pravidlá farieb:**

- `--color-gold` sa **nikdy** nepoužije ako farba textu na svetlom pozadí. Na svetlom je `--color-gold-ink`.
- Zlato nikdy ako výplň veľkej plochy. Len linky, malé ikony, hover, podčiarknutia, mikro-štítky.
- Žiadny `linear-gradient` ani `box-shadow` v zlatej.
- Dekoratívny predel → `hairline-*`. Hranica čohokoľvek klikateľného → `border-interactive-*`. Hover ghost tlačidla → `--color-gold`.
- Žiadne tiene na tmavom. Na svetlom max `0 1px 2px rgba(20,23,26,.06)`.
- Rádiusy len 3–4 px. Žiadne pill tlačidlá.

**Typografia:**

- Nadpisy: serif, `line-height: 1.08–1.15`, `letter-spacing: -0.015em`. Nikdy celé nadpisy uppercase.
- Telo: sans, `line-height: 1.65`, max riadok **68ch**.
- Eyebrow: sans, uppercase, `letter-spacing: 0.14em`, `--color-gold` (tmavé) / `--color-gold-ink` (svetlé).
- Čísla: `font-variant-numeric: tabular-nums`.
- **Preload len serif, oba subsety (latin + latin-ext).** Inter cez `font-display: swap`, bez preloadu. Metricky blízke fallbacky, pri CLS > 0.05 dolaď `size-adjust`.

---

## 5. LOGO (provizórne, typografické)

Inline SVG komponent `Logo.astro`, props: `variant: 'full' | 'wordmark'`, `class`.

- Wordmark `ALBION` — Source Serif 4, uppercase, `letter-spacing: 0.16em`, farba `currentColor`.
- Descriptor `ZÁLOŽŇA · LUČENEC` — Inter, uppercase, `letter-spacing: 0.22em`, ~34 % veľkosti wordmarku, farba `--color-gold`.
- Medzi nimi 1px hairline v šírke wordmarku.
- Čitateľné pri výške 24 px, funkčné v monochróme.
- Pod `480px` sa v headeri používa `variant="wordmark"`.

**Zakázané ikony:** kopy peňazí, €, diamanty, zlaté tehličky, bankovky, heraldika, váhy, tri gule.
Budúci monogram (neimplementuj): „A" v tenkom zaoblenom rámiku ako odkaz na puncovú značku.

---

## 6. ŠTRUKTÚRA HOMEPAGE — 8 BLOKOV (poradie záväzné)

| # | Blok | Podklad |
|---|---|---|
| 1 | Header (sticky, transparentný → ink-900 po 24 px) | ink-900 |
| 2 | Hero | ink-900 |
| 3 | Čo môžete založiť alebo predať | paper |
| 4 | Individuálne ocenenie | ink-900 |
| 5 | Ako to funguje (3 kroky) | paper |
| 6 | Prečo Albion (4 body) | ink-800 |
| 7 | Kde nás nájdete | ink-900 |
| 8 | Kontakt | ink-900 |
| — | Footer | ink-900 |
| — | Sticky call bar (len < 768 px) | — |

Samostatná sekcia „História" **neexistuje**. Sekcia „Vybraný tovar" neexistuje — len flag `FEATURES.showcaseEnabled = false`.

---

## 7. SCHVÁLENÉ TEXTY (`src/data/content.ts`) — POUŽI PRESNE

### Header
Nav: `Služby` · `Ako to funguje` · `Prečo Albion` · `Kontakt`
Tlačidlo: `Zavolať`

### Hero
- Eyebrow: `Kapitána Nálepku 41, Lučenec — pri stanici`
- H1: `Záložňa, kde sa vieme dohodnúť.`
- Lead: `Albion v Lučenci. Zlato, šperky, hodinky, elektronika, náradie, autá aj netypické veci. Každú vec oceníme individuálne a povieme vám to na rovinu.`
- CTA 1: `Zavolať` → `tel:`
- CTA 2: `Chcem oceniť vec` → `#kontakt`
- Micro: `Osobne · Diskrétne · Bez čakania na schválenie z centrály`

### 3 — Čo môžete založiť alebo predať
- H2: `Čo u nás môžete založiť alebo predať`
- Lead: `Toto sú veci, s ktorými k nám ľudia chodia najčastejšie. Zoznam nie je uzavretý.`
- Položky: `Zlato a šperky` · `Hodinky` · `Mobily a elektronika` · `Počítače a notebooky` · `Náradie a stroje` · `Autá a vozidlá` · `Zberateľské a cennejšie predmety` · `Iné veci s hodnotou`
- Záver: `Nenašli ste svoju vec? To ešte nič neznamená — ozvite sa.`

### 4 — Individuálne ocenenie
- Eyebrow: `Individuálny prístup`
- H2: `Má to hodnotu? Ozvite sa.`
- P1: `Nie sme reťazec s pevným cenníkom a zoznamom povolených kategórií. Pri každej veci sa pozrieme na jej reálnu hodnotu a stav. Vieme sa baviť aj o veciach vyššej hodnoty a o prípadoch, ktoré inde odmietnu na prvý pohľad.`
- P2: `Rozhoduje tu človek, ktorý za to aj zodpovedá. Preto sa vieme dohodnúť rýchlejšie a férovejšie.`
- CTA: `Zavolať a opýtať sa`

### 5 — Ako to funguje
- H2: `Ako to funguje`
1. `Ozvite sa alebo prídite` — `Zavolajte nám alebo prídite priamo do predajne. Netreba sa nikde registrovať.`
2. `Vec spoločne oceníme` — `Pozrieme sa na vec osobne, povieme vám, na akú sumu ju vieme oceniť, a vysvetlíme podmienky zrozumiteľne.`
3. `Dohodneme sa` — `Ak vám to sedí, vybavíme to na mieste. Ak nie, nič sa nedeje a nič neplatíte.`
- Poznámka pod krokmi sa vykreslí len ak je potvrdená (`TO_CONFIRM`: potrebné doklady).

### 6 — Prečo Albion
- H2: `Prečo ľudia chodia práve k nám`
1. `Rozhoduje tu majiteľ` — `Nečakáte na schválenie z centrály. Dohodu uzatvárate priamo s tým, kto o nej rozhoduje.`
2. `Dlhoročná miestna firma` — `Albion patrí k najdlhšie fungujúcim záložniam v Lučenci. Nie sme pobočka reťazca — sme miestna firma, ktorá tu chce fungovať aj o desať rokov.`
   *Ak `business.foundedYearConfirmed === true`, na začiatok textu sa doplní veta:* `V Lučenci pôsobíme od roku {foundedYear}.`
3. `Berieme aj netypické veci` — `Od šperkov po autá a stroje. Ak to má hodnotu, vieme sa o tom baviť.`
4. `Diskrétnosť` — `Čo sa dohodne u nás, ostáva u nás. Bez zbytočných otázok.`

### 7 — Kde nás nájdete
- H2: `Nájdete nás pri stanici`
- P: `Kapitána Nálepku 41, Lučenec — pár krokov od železničnej stanice.`
- CTA: `Otvoriť v Google Mapách` → `business.mapsUrl`

### 8 — Kontakt
- H2: `Ozvite sa`
- Lead: `Najrýchlejšie to vyriešime telefonicky alebo osobne.`
- Blok: telefón (veľký `tel:`), adresa, otváracie hodiny, e-mail (len ak potvrdený)
- Indikátor `Otvorené teraz` / `Momentálne zatvorené` — klientsky, `Europe/Bratislava`. Ak sú hodiny `TO_CONFIRM`, indikátor sa **nezobrazí vôbec**.

### Footer
NAP blok, rýchle odkazy, `© {rok} Albion`, riadok s IČO a prevádzkovateľom (len ak potvrdené).

### Zakázané frázy
`Vaša spokojnosť je našou prioritou` · `Kvalita na prvom mieste` · `Sme tu pre vás` · `Najlepšie služby za najlepšie ceny` · superlatívy typu „najlepšia záložňa" · `okamžite` · `garantujeme` · `100 %` · akékoľvek tvrdenie, že Albion bol **prvá** záložňa v Lučenci · akékoľvek priame porovnanie s konkurenciou · akékoľvek číslo o počte klientov alebo vecí.

---

## 8. CTA STRATÉGIA

1. **Primárne `Zavolať`** (`tel:`) — header, hero, sekcia 4, sekcia 8, sticky bar.
2. **Sekundárne `Chcem oceniť vec`** → kotva `#kontakt`. Ghost tlačidlo s `border-interactive-*`.
3. **Terciárne `Otvoriť v Google Mapách`** — textový odkaz.

**Ak telefón chýba:** primárne CTA sa **neskrýva**, ale zmení sa na `Chcem oceniť vec` → `#kontakt`. V DEV navyše červený badge `CHÝBA TELEFÓN`.

**Sticky mobile bar:** objaví sa po odscrollovaní hero (`IntersectionObserver`), fixed bottom, 64 px, `Zavolať` + `Mapa`, `padding-bottom` na `body`. Na desktope neexistuje.

**Zakázané CTA:** registrácia, košík, dlhé formuláre, chatbot, newsletter, pop-up, cookie wall.

---

## 9. RESPONZÍVNE SPRÁVANIE

Mobile-first. Breakpointy `sm 640 · md 768 · lg 1024 · xl 1280`.

- `< 480px`: logo `variant="wordmark"`, tlačidlo `Zavolať` icon-only 48×48 s `aria-label`.
- `< 768px`: jeden stĺpec, hamburger (fullscreen overlay, focus trap, `Esc`, scroll lock), sticky call bar. H1 max 4 riadky na 360 px.
- `768–1023px`: 2 stĺpce, bez sticky baru.
- `≥ 1024px`: kontajner 1200 px, text 720 px.
- Tap target min 48×48 px, medzera min 8 px.
- Testuj 320 · 360 · 390 · 768 · 1024 · 1440 · 1920. **Žiadny horizontálny scroll.**

---

## 10. ANIMÁCIE

Jeden `IntersectionObserver` blok (~10 riadkov) v `BaseLayout` nad prvkami s `data-reveal`.

- `opacity 0→1` + `translateY(12px→0)`, `--duration-base`, `--ease-out-quint`, stagger max 60 ms, **iba raz** (`unobserve`).
- Hover: farba/hranica za `--duration-fast`.
- Header: prechod na `ink-900` + hairline po 24 px.
- Bez JS musí byť obsah viditeľný (trieda sa pridáva JS-om).

**Zakázané:** parallax, počítadlá, karusely, typewriter, scroll-jacking, lesk cez text, animácie > 600 ms, GSAP/Framer/AOS/Lenis.

**Povinné:** `@media (prefers-reduced-motion: reduce)` — všetko na `0.01ms`, nič neostáva neviditeľné.

---

## 11. PRÍSTUPNOSŤ (WCAG 2.2 AA)

`<html lang="sk">` · sémantické landmarky · `section` s `aria-labelledby` · presne jeden `<h1>` · hierarchia bez preskakovania · skip link `Preskočiť na obsah` · focus `outline: 2px solid var(--color-gold); outline-offset: 2px` (nikdy `outline: none` bez náhrady) · `tel:` s `aria-label` · ikony `aria-hidden` · menu s `aria-expanded`/`aria-controls`/focus trap/návrat focusu · plná ovládateľnosť klávesnicou · čitateľnosť pri 200 % zoome.

---

## 12. SEO

- `<title>`: `Záložňa Lučenec — Albion | Výkup zlata, šperkov a elektroniky`
- `<meta description>`: `Záložňa Albion v Lučenci pri stanici. Založenie a výkup zlata, šperkov, elektroniky, náradia aj áut. Individuálne ocenenie a osobná dohoda.`
- Canonical, `og:*`, `og:locale=sk_SK`, `twitter:card=summary_large_image`. Meta rieš priamo v `BaseLayout` cez props.
- Jeden statický `public/og.png` (1200×630, ink pozadie, wordmark, adresa).
- `sitemap.xml` + generovaný `robots.txt` (doména z env).

**Kľúčové slová — mapovanie (bez stuffingu):** hero → *záložňa Lučenec, pri stanici* · sekcia 3 → *výkup zlata / šperkov / elektroniky Lučenec, založenie auta Lučenec* · sekcia 4 → *ocenenie veci* · sekcia 7 + footer → *Kapitána Nálepku 41, Lučenec, železničná stanica*. Ak by veta znela neprirodzene, kľúčové slovo vypusti.

**JSON-LD `PawnShop`** z `business.ts`: `name`, `description`, `address`, `geo`, `telephone`, `openingHoursSpecification`, `url`, `image`, `areaServed: Lučenec`. **`priceRange` vynechaj.**
**Kritické:** pole s hodnotou `TO_CONFIRM` sa do JSON-LD **nesmie vygenerovať vôbec** — ani prázdne, ani vymyslené.

---

## 13. VÝKON

Ciele (Lighthouse mobile, 4G throttling): Performance ≥ 95 · Accessibility 100 · Best Practices ≥ 95 · SEO 100 · LCP < 1.8 s · CLS < 0.05 · INP < 200 ms · klientský JS **< 20 KB gzip**.

- Žiadne blokujúce externé requesty. Žiadny third-party request pri načítaní. Žiadne cookies.
- Ikony: presne 4 inline SVG (phone, map-pin, menu, close).
- **Žiadny `<iframe>` Google Maps** — statický blok + tlačidlo do Máp.
- Analytics: neinštaluj nič. Len komentovaný slot v `BaseLayout`.

---

## 14. PLACEHOLDERY

`src/data/business.ts` je jediný zdroj pravdy. Pravidlá:

1. Reťazec `TO_CONFIRM` sa **nikdy** neobjaví vo výstupnom HTML (post-build scan to vynucuje).
2. `npm run build` zlyhá pri nepotvrdených poliach; `build:draft` (`--allow`) prejde.
3. Nikdy neuvádzaj: úroky, poplatky, provízie, lehoty, výšku pôžičky, právne podmienky, licencie, certifikáty, počty klientov, záruky, hodnotenia — ani ako príklad.
4. Zoznam chýbajúcich údajov drž v `README.md`.

---

## 15. ČO NEROBIŤ

E-shop · košík · ceny · filtre · registrácia · slider v hero · stock fotky (peniaze, tehličky, podanie rúk) · žiarivé zlato, gradienty, glow, 3D, neón · chatbot · pop-up · newsletter · počítadlá · React · animačná knižnica · ikonová knižnica · prepisovanie schválených textov do „marketingovejšej" podoby · uzavretý zoznam prijímaných vecí bez vety o nekonečnosti zoznamu · tvrdenie o „prvej záložni" · anglická verzia · `<iframe>` mapy · viac ako 8 blokov na homepage.

**Nové pravidlo:** ak sa komponent použije práve raz a nemá vlastnú logiku, nerob z neho komponent.

---

## 16. FÁZA 6 — AUDIT

Nespúšťaj bez reálneho telefónu a domény. Report ako zoznam **„overené / neoverené"**, nie „hotovo":

1. Lighthouse mobile + desktop (čísla)
2. `axe-core` beh
3. celý prechod klávesnicou (Tab / Shift+Tab / Enter / Esc) so slovným popisom, kde focus skončil
4. 200 % zoom
5. `prefers-reduced-motion` zapnuté
6. kontrola diakritiky (žiadny fallback glyf) — testovacie slovo: `Záložňa · Lučenec · príležitosť · ďalší · ĺ ŕ ô ä`
7. šírky 320–1920 bez horizontálneho scrollu

**Definícia hotového:** všetky body vyššie + JSON-LD prejde Rich Results Testom bez vymyslených hodnôt + nikde reťazec `TO_CONFIRM` + 0 third-party requestov + 0 cookies.

**Latka kvality:** custom projekt za 5 000–10 000 €. Ak niečo nevieš spraviť na tejto úrovni, radšej to vynechaj a napíš to. Prázdny priestor je lepší ako lacný prvok.
