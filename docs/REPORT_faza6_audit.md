# REPORT — Fáza 6, audit

Dátum: 14. 8. 2026 · commit: `feat: potvrdene udaje…` + opravy z tohto auditu

## Ako sa meralo

Na **produkčnom builde** (`npm run build`, gate bez `--allow`), nie na dev serveri.

`astro preview` neposiela obsah komprimovaný, čo pri throttlingu skresľuje výsledky
o stovky ms. Merania preto bežali na lokálnom statickom serveri s **gzip**
a `Cache-Control: no-store` (studená cache). Je to bližšie k produkcii než
`astro preview`, ale **stále to nie je produkcia** — chýba HTTP/2, Brotli a CDN edge.

- Prehliadač: Chrome (chrome-devtools-mcp)
- Throttling pre výkon: **Slow 4G + 4× CPU** (rovnaké nastavenie ako Lighthouse mobile)
- Viewport pre výkon: 412 × 915, DPR 2,6

---

## Overené

### Lighthouse (produkčný build)

| Kategória | Mobile | Desktop |
|---|---|---|
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |
| Zlyhané audity | **0** (52 prešlo) | **0** (51 prešlo) |

Skóre v týchto kategóriách nekolíšu medzi behmi, preto nie je uvedený medián.

### axe-core 4.10.2 (wcag2a + wcag2aa + wcag21aa + wcag22aa + best-practice)

- **0 violations**
- 37 passes
- 7 `incomplete` v pravidle `color-contrast` — sú to prvky nad hero obrazom,
  kde axe nevie vypočítať podklad. Zmerané ručne nižšie.

### Kontrast — meraný na skutočných pixeloch, nie na tokenoch

Hero text nad obrazom. Postup: skryť text, odfotiť podklad, nájsť **najsvetlejší
pixel** v ploche daného prvku a porovnať s farbou textu.

| Prvok | Farba textu | Najsvetlejší podklad | Kontrast | Stav |
|---|---|---|---|---|
| Eyebrow | gold `#C6A971` | `rgb(50,50,48)` | **5,70:1** | ✅ AA |
| H1 | bone `#F5F2EC` | `rgb(47,46,44)` | **12,14:1** | ✅ (cieľ z HERO_ASSET.md bol ≥ 12:1) |
| Lead | bone-muted `#B7B2A9` | `rgb(41,39,37)` | **7,05:1** | ✅ AA |
| Micro | bone-muted `#B7B2A9` | `rgb(17,19,20)` | **8,83:1** | ✅ AA |

Priemerný podklad pod H1 dáva 16,59:1; uvedené číslo je najhorší pixel v ploche.

### CLS — po sprísnení typografie

**0,00** vo všetkých troch behoch. Nadpisy v reze 600 layout neposunuli.

`size-adjust` pre Georgiu **nebol potrebný** a nebol pridaný. Dôvod: hero obraz má
`width`/`height`, serifové subsety sa preloadujú a swap prebehne pred prvým
vykreslením nadpisu. Ak by CLS na reálnej doméne prekročil 0,05, ladí sa až vtedy.

### Klávesnica

Prechod celou stránkou, 17 zameraťeľných prvkov v poradí DOM (žiadny `tabindex` > 0).

| Krok | Kde skončil focus |
|---|---|
| Tab 1 | „Preskočiť na obsah" — zobrazí sa vľavo hore, zlatý rám `2px solid #C6A971`, `outline-offset: 2px` |
| Enter | URL `#obsah`, ďalší Tab skočí **dovnútra `<main>`** na hero „Zavolať" ✅ |
| Tab 2–6 | logo (odkaz domov) → Služby → Ako to funguje → Prečo Albion → Kontakt |
| Tab 7–10 | hlavičkové „Zavolať" → hero „Zavolať" → „Chcem oceniť vec" → „Zavolať a opýtať sa" |
| Tab 11–13 | „Otvoriť v Google Mapách" → telefón v Kontakte → telefón v pätičke |
| Tab 14–17 | rýchle odkazy v pätičke |

Focus je viditeľný na každom kroku a nikdy neskončí mimo obrazovky.

**Mobilné menu (390 px):**

| Akcia | Výsledok |
|---|---|
| otvorenie hamburgerom | `aria-expanded="true"`, focus na „Zavrieť menu", `overflow: hidden` na `<html>` |
| Tab z posledného prvku | vráti sa na prvý ✅ |
| Shift+Tab z prvého prvku | skočí na posledný ✅ |
| Esc | zavrie, `aria-expanded="false"`, focus späť na hamburger, scroll uvoľnený ✅ |

### 200 % zoom

Simulované ako 720 × 450 (t. j. 1440 pri 200 %): **0 px** horizontálneho pretečenia,
žiadny orezaný text. H1 má 2 riadky.

### prefers-reduced-motion

Runtime emuláciu tohto media query nástroj neponúka, preto **statický dôkaz**
nad vygenerovaným CSS:

- všetky tri pravidlá, ktoré čokoľvek skrývajú (`.js [data-reveal]{opacity:0}`,
  `.js [data-reveal][data-rule]{clip-path:inset(0 100% 0 0)}`,
  `.hero-title .line-inner{transform:translateY(100%)}`) sú **výhradne** vnútri
  `@media (prefers-reduced-motion: no-preference)`;
- blok `@media (prefers-reduced-motion: reduce)` neobsahuje žiadne z nich;
- praktická kontrola: po odobraní triedy `js` z `<html>` je **0** prvkov
  s `opacity < 0.99`.

Pri zapnutom `reduce` teda nič neostane neviditeľné. Runtime beh je nižšie
v „neoverené".

### Responzívne šírky

| Šírka | Horizontálny scroll | Poznámka |
|---|---|---|
| 320 | 0 px | H1 na 3 riadky (limit 4) |
| 360 | 0 px | H1 na 2 riadky |
| 390 | 0 px | sticky bar funguje |
| 412 | 0 px | |
| 720 | 0 px | ekvivalent 200 % zoomu |
| 768 | 0 px | sticky bar sa už nevykresľuje, `body` bez `padding-bottom` |
| 1024 | 0 px | kontajner 1009 px |
| 1440 | 0 px | |
| 1920 | 0 px | kontajner 1200 px, text 720 px |

### Diakritika

`document.fonts.check` pre reťazec `Záložňa · Lučenec · príležitosť · ďalší · ĺ ŕ ô ä`:

| Font | 400 | 600 |
|---|---|---|
| Source Serif 4 Variable | ✅ | ✅ |
| Inter Variable | ✅ | ✅ |

Načítané sú všetky štyri súbory (latin + latin-ext pre obe rodiny), stav `loaded`.
Žiadny fallback glyf.

### Reveal

Pri plynulom scrollovaní sa odhalí **42 z 42** prvkov, na mobile aj na desktope.

### Sieť, veľkosti, súkromie

| Metrika | Hodnota | Limit |
|---|---|---|
| Klientský JS (homepage, gzip) | **1,72 kB** | < 20 kB |
| Klientský JS (404, gzip) | 0,73 kB | — |
| HTML homepage (gzip) | 12,9 kB | — |
| Requestov na načítanie | **6** | — |
| Third-party requestov | **0** | 0 |
| Cookies | **0** | 0 |
| Hero AVIF desktop | 6 / 9 / 15 kB | ≤ 140 kB |
| Hero AVIF mobil | 8 / 13 kB | ≤ 55 kB |
| Fonty (4× woff2) | 41–83 kB | — |
| `og.png` | 25,4 kB | — |

Priemerná luminancia hero obrazu po spracovaní: **0,098** (desktop) a **0,106**
(mobil), limit 0,12.

### JSON-LD

Vygenerované na produkčnom builde:

```json
{
  "@context": "https://schema.org",
  "@type": "PawnShop",
  "name": "Staničná Záložňa Albion",
  "legalName": "ALBION P.M., s.r.o.",
  "description": "Záložňa Albion v Lučenci pri stanici. …",
  "telephone": "+421474334444",
  "identifier": { "@type": "PropertyValue", "name": "IČO", "value": "36050814" },
  "address": { "@type": "PostalAddress", "streetAddress": "Kpt. Nálepku 41",
               "postalCode": "984 01", "addressLocality": "Lučenec", "addressCountry": "SK" },
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "07:00", "closes": "17:30" }],
  "areaServed": { "@type": "City", "name": "Lučenec" }
}
```

`url`, `image`, `geo` a `email` chýbajú **zámerne** — doména ani súradnice nie sú
známe a localhost do JSON-LD nepatrí. `priceRange` sa neuvádza nikdy.
Žiadne vymyslené hodnoty, žiadny `TO_CONFIRM`.

### Indikátor otváracích hodín

V čase merania (piatok ~15:05) zobrazil **„Otvorené teraz"**, stav `open`.
Výpis hodín: `Po – Pi 07:00 – 17:30`.

### Build a testy

| Kontrola | Výsledok |
|---|---|
| `npm run build` **bez `--allow`** | ✅ prejde |
| placeholder gate pred buildom | 3 voliteľné polia nedoplnené (`email`, `geo`, `requiredDocuments`), 0 povinných |
| post-build scan `dist/**/*.html` | 0 výskytov `TO_CONFIRM` |
| `npm run check` | 0 errors, 0 warnings, 0 hints |
| `npm test` | 22/22 |

---

## NEOVERENÉ

1. **LCP na produkcii.** Nameraný medián je nad cieľom — detail nižšie.
2. **`prefers-reduced-motion` za behu.** Dokázané staticky nad CSS, nie zapnutím
   v OS. Nástroj to emulovať nevie.
3. **Rich Results Test.** Vyžaduje verejnú URL. JSON-LD je overený len štruktúrne
   (unit testy + vizuálna kontrola výstupu).
4. **Iné prehliadače.** Merané len v Chrome. Safari a Firefox neoverené —
   pozor najmä na `clip-path` prechod pri zlatých linkách a na `100svh` v hero.
5. **Reálne zariadenia.** Všetko je emulácia.
6. **Hlavička pod 480 px s ikonovým CTA** — teraz už existuje telefón, takže sa
   variant `iconOnly="below-480"` vykresľuje; vizuálne overený, ale nie na
   fyzickom telefóne.

---

## LCP — cieľ nesplnený v laboratóriu

Medián z 3 behov (Slow 4G + 4× CPU, studená cache, gzip):

| Beh | LCP | CLS |
|---|---|---|
| 1 | 1 621 ms | 0,00 |
| 2 | 2 398 ms | 0,00 |
| 3 | 2 320 ms | 0,00 |
| **medián** | **2 320 ms** | **0,00** |

Cieľ je < 1 800 ms. **Nesplnené.** Rozklad posledného behu:

| Časť | Čas | Čo to je |
|---|---|---|
| TTFB | 7 ms | lokálny server |
| Resource load delay | 715 ms | prehliadač musí najprv dostať HTML — jedno RTT Slow 4G (~560 ms) |
| Resource load duration | 708 ms | druhé RTT na samotný obrázok (8 kB, prenos je zanedbateľný) |
| Element render delay | 889 ms | dekód a rozloženie pri 4× spomalenom CPU |

**Zmenšovanie obrazu už nepomáha.** Mobilný variant má 8 kB; jeho prenos trvá
jednotky ms. Čas žerie **latencia (dve RTT) a hlavné vlákno**, nie bajty.

Čo som počas auditu vyskúšal a zmeral:

| Zmena | Výsledok |
|---|---|
| `<link rel="preload">` na hero obraz | bez merateľného rozdielu na lokále (2 411 → 2 438 ms); v repe **ponechané** — na reálnej sieti s vyššou latenciou je to správne |
| externý CSS namiesto inline (`inlineStylesheets: 'auto'`) | **horšie**: +376 ms FCP, LCP 2 572 ms → vrátené na `'always'` |
| menší mobilný variant (`sizes` na 40vw, vyberie 480w namiesto 760w) | −40 ms, v repe ponechané (menej práce pre dekodér, vizuálne nerozoznateľné pod maskou) |
| gzip namiesto nekomprimovaného `astro preview` | **−600 až −800 ms** — najväčší jediný vplyv |

Posledný riadok je podstatný: samotná kompresia posunula LCP o stovky ms.
Produkcia (Vercel) navyše pridá **HTTP/2, Brotli a CDN edge**, čo skracuje obe RTT.

**Odporúčanie:** LCP premerať na reálnej doméne skôr, než sa čokoľvek zmení
v dizajne. Ak bude aj tam nad 1,8 s, ďalšie páky v poradí:

1. mobilný hero vložiť ako `data:` URI priamo do HTML — ušetrí celé druhé RTT
   (~700 ms), cena je ~11 kB v HTML;
2. znížiť počet preloadovaných fontov z dvoch na jeden (latin), latin-ext dotiahnuť
   neskôr — uvoľní pásmo pre obraz, cena je preblik diakritiky v nadpise;
3. až potom siahať na hero obraz.

Animácie sa nerušia — nie sú príčinou.

---

## Chyby nájdené a opravené počas auditu

| # | Chyba | Oprava |
|---|---|---|
| 1 | **WCAG 2.5.3 Label in Name** — odkaz s telefónom v pätičke a v Kontakte mal viditeľný text `+421 47 433 44 44`, ale `aria-label` s tvarom `047 433 44 44` | `callAriaLabelLong` — label sa skladá z toho istého tvaru, ktorý je vidieť |
| 2 | To isté na odkaze loga: `aria-label="Albion — domovská stránka"` vs. viditeľné `ALBION STANIČNÁ ZÁLOŽŇA · LUČENEC` | `aria-label` aj `role="img"` odstránené — wordmark je skutočný text a nesie si prístupný názov sám |
| 3 | To isté na tlačidle „Zavolať a opýtať sa" | nový vzor `callAriaLabelWithAction`: `„{action} — číslo {phone}"` |
| 4 | axe `region`: sticky call bar stál mimo landmarkov | z `<div>` na `<nav aria-label="Rýchly kontakt">` |
| 5 | **Zlaté oddeľovače sekcií sa nikdy neodhalili.** `transform: scaleX(0)` zmenší prvok na nulovú šírku, takže jeho prienik s viewportom je prázdny a `IntersectionObserver` ho neohlási | animácia cez `clip-path: inset(0 100% 0 0)` — clip mení len maľovanie, rozloženie prvku ostáva |
| 6 | `rootMargin: '0px 0px -10% 0px'` — na vysokom viewporte môžu prvky v poslednej desatine stránky zostať navždy skryté | pevných `-48px` namiesto percenta |

Chyby 1–4 by boli prešli aj cez „Lighthouse Accessibility 100" — presne preto
je v pláne aj manuálny axe beh.

---

## Zhrnutie

| Kritérium | Stav |
|---|---|
| Lighthouse A11y / BP / SEO 100 | ✅ mobile aj desktop |
| axe-core bez porušení | ✅ |
| Kontrast textu nad obrazom | ✅ merané na pixeloch |
| CLS < 0,05 | ✅ 0,00 |
| LCP < 1,8 s | ❌ **2,32 s v laboratóriu** — premerať na doméne |
| INP < 200 ms | ⏳ neoverené (bez reálnej interakcie) |
| Klávesnica, focus trap, skip link | ✅ |
| 200 % zoom | ✅ |
| reduced-motion | ✅ staticky |
| Žiadny horizontálny scroll 320–1920 | ✅ |
| JS < 20 kB gzip | ✅ 1,72 kB |
| 0 third-party, 0 cookies | ✅ |
| Žiadny `TO_CONFIRM` vo výstupe | ✅ |
| JSON-LD bez vymyslených hodnôt | ✅ |
| Rich Results Test | ⏳ potrebuje verejnú URL |


---

## Produkcia

> Doplnené 14. 8. 2026 vo fáze 10. Nahrádza pôvodný oddiel, ktorý bol písaný
> ešte bez prístupu k produkčnej adrese.

Produkcia: **https://albion-bf4w.vercel.app**

### Doména

`PUBLIC_SITE_URL` sa nedala nastaviť vo Vercel dashboarde — účet napojený na
tento nástroj (`maximmalovec8-6717's projects`) projekt nevidí, deploy beží pod
iným účtom (`rps-2022`). Riešené v kóde, čo je aj tak trvácnejšie:

Produkčná adresa je predvolená hodnota v `astro.config.mjs` aj v
`src/data/business.ts`. **`VERCEL_URL` sa už nepoužíva** — nesie adresu
konkrétneho nasadenia, takže canonical, `og:url` aj sitemap ukazovali pri
každom deploji inam:

```
<link rel="canonical" href="https://albion-bf4w-8sohs37r3-rps-2022.vercel.app/">
```

Toto Google vyhodnotí ako duplicitu. Canonical musí ukazovať na produkciu aj
z preview nasadenia. `PUBLIC_SITE_URL` má naďalej prednosť, takže vlastná
doména sa neskôr nastaví bez zásahu do kódu.

Overené vo výstupe: canonical aj `og:url` = `https://albion-bf4w.vercel.app/`,
`sitemap-0.xml` obsahuje homepage a obe právne stránky (404 správne nie).
JSON-LD už obsahuje `url` aj `image` — dovtedy ich `isLocalSiteUrl` vyhadzoval.

### LCP na produkcii

Chrome cez CDP, studená cache, **Slow 4G + 4× CPU** — rovnaké nastavenie ako
Lighthouse mobile, teda porovnateľné s pôvodnými 2,32 s z laboratória.

| Prostredie | Viewport | LCP |
|---|---|---|
| Produkcia (Vercel, HTTP/2 + Brotli + CDN) | 390 × 844 | **1,86 – 2,18 s** |
| Produkcia | 1440 × 900 | **1,99 s** |
| Lokálne laboratórium (fáza 6) | 412 × 915 | 2,32 s |
| Produkcia, bez throttlingu | 390 × 844 | 0,52 s |

**Cieľ < 1,8 s tesne nevyšiel.** Tvoja analýza z `PROMPT_FINAL2.md` §3 sedela —
produkcia oproti laboratóriu ubrala ~0,4 s a nebolo to o veľkosti obrazu.

Waterfall na mobile (throttled, ms od navigácie):

```
hero-m-480.avif                        304 →  580
source-serif-4-latin.woff2             310 →  951
source-serif-4-latin-ext.woff2         312 →  916
inter-latin.woff2            (47 kB)   599 → 2372
inter-latin-ext.woff2        (83 kB)   719 → 2546
```

Hero obraz **štartuje v prvej dávke** a je hotový za 580 ms — preload funguje
a obraz nie je podozrivý (8 kB). Poradie preloadov je tiež v poriadku.

Zdržuje **Inter**: dva súbory, 130 kB, nie sú preloadované a linku držia
obsadenú do ~2,5 s. Kým dobehnú, text v Inter (lead, micro) sa prekresľuje cez
`font-display: swap` a LCP sa posúva s ním.

**Ďalší krok — neurobené v tejto dávke, je to samostatná zmena:** zúžiť Inter.
Používame z neho rezy 400–600, nie celý rozsah 100–900, a `latin-ext` súbor
(83 kB) nesie celú stredoeurópsku sadu kvôli hŕstke znakov. Podsetovanie na
skutočne použité znaky a rezy je tu jediná vec s reálnym dopadom. Rozhodne
o tom viac než čokoľvek na strane obrazu.
