# REPORT — Fázy 2–5

Commity: `feat(ui)` · `feat(layout)` · `feat(sections)` · `feat(seo)`

Fázy 2–5 vznikli v jednom behu, preto sú commity delené podľa ciest, nie podľa
času. Zelený build je overený na konci, nie po každom jednom commite.

---

## Overené — reálne zbehlo

| Kontrola | Výsledok |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 0 hints (29 súborov) |
| `npm test` | 8/8 prešlo (`node --test`, bez frameworku) |
| `npm run build:draft` | 2 stránky + `sitemap-index.xml`, prejde |
| `npm run build` | zlyhá exit 1, vypíše 12 nepotvrdených polí |
| post-build scan HTML | 0 výskytov `TO_CONFIRM` |
| konzola prehliadača | 0 chýb, 0 varovaní |

## Overené — v prehliadači (Chrome, `npm run preview`)

Nie je to Fáza 6. Je to sanity check, aby sa nekomitoval rozbitý layout.

| Kontrola | Výsledok |
|---|---|
| 1440 px, celá stránka | všetkých 8 blokov vykreslených, rozloženie sedí |
| 360 px, horizontálny scroll | `scrollWidth === innerWidth`, 0 px pretečenia |
| H1 na 360 px | 2 riadky (limit sú 4) |
| reveal | 33/33 prvkov dostane `.is-revealed` po odscrollovaní |
| sticky call bar | hore skrytý, po opustení hero sa objaví, `body` má `padding-bottom: 64px` |
| hlavička po 24 px | prepne na `ink-900` + hairline |
| mobilné menu | otvorí sa, focus ide na zatváracie tlačidlo, `aria-expanded="true"`, scroll lock aktívny |
| Esc | zavrie menu, uvoľní scroll, focus sa vráti na hamburger |
| focus ring | viditeľný, zlatý, `outline-offset: 2px` |

## Neoverené

Lighthouse, axe-core, celý klávesnicový prechod, 200 % zoom,
`prefers-reduced-motion`, kontrasty zmerané nástrojom, šírky 320/390/768/1024/1920,
kontrola fallbacku fontu pri diakritike. Všetko je to Fáza 6 a tá **čaká na
reálny telefón a doménu**.

Neoverené je aj správanie hlavičky **s potvrdeným telefónom** — variant
`iconOnly="below-480"` sa dnes nevykresľuje, lebo telefón chýba. Trieda existuje,
ale zatiaľ nie je v CSS, keďže Tailwind generuje len použité utility.

---

## Čísla

| Metrika | Hodnota | Limit |
|---|---|---|
| klientský JS (homepage, gzip) | **1,3 kB** | < 20 kB |
| HTML homepage (gzip) | 10,0 kB | — |
| JSON-LD | 375 B | — |
| third-party requesty | 0 | 0 |
| cookies | 0 | 0 |

CSS je inlinované do HTML (`inlineStylesheets: 'always'`), takže v kritickej
ceste nie je žiadny blokujúci externý request okrem dvoch preloadovaných serif
fontov.

---

## Vygenerované JSON-LD (dnešný stav)

```json
{
  "@context": "https://schema.org",
  "@type": "PawnShop",
  "name": "Albion — Záložňa Lučenec",
  "description": "Záložňa Albion v Lučenci pri stanici. …",
  "address": { "@type": "PostalAddress", "addressLocality": "Lučenec", "addressCountry": "SK" },
  "areaServed": { "@type": "City", "name": "Lučenec" }
}
```

Telefón, adresa, PSČ, geo, hodiny, url ani image tam nie sú — a to je správne.
Doplnia sa samé, hneď ako pribudnú do `business.ts`.

---

## Rozhodnutia, ktoré som urobil sám

1. **`Hairline.astro` nevznikol.** Je to jedna `border-t` utilita bez logiky.
   Podľa pravidla o jednorazových komponentoch nemá byť komponentom.
2. **Mobilné menu je v `Header.astro`**, nie ako `MobileMenu.astro`. Zdieľa stav
   s hamburgerom (`aria-expanded`, návrat focusu). Rozdelenie by znamenalo
   prepájať dva komponenty cez DOM, čo je zložitejšie, nie jednoduchšie.
3. **`Button` má varianty `primary | ghost | link`**, nie `primary | secondary | ghost`.
   BRIEF §8 definuje tri úrovne CTA, kde druhá **je** ghost a tretia je textový
   odkaz. Pôvodné názvy by mali štyri mená pre tri veci.
4. **Hover ghost tlačidla na svetlom podklade ide na `gold-ink`, nie `gold`.**
   Brief predpisuje `gold`, ale zlatá na `paper` má 2,02:1 — ako hranica
   ovládacieho prvku by po hoveri spadla pod hranicu 3:1 z WCAG 1.4.11.
   `gold-ink` má 4,95:1. Na tmavom podklade hover na `gold` zostáva.
5. **Sticky bar sa riadi `boundingClientRect.top < 0`, nie `isIntersecting`.**
   Sentinel je na spodku hero; pri hero vyššom ako viewport nie je viditeľný ani
   na vrchu stránky, takže `isIntersecting` by lištu ukázalo hneď po načítaní.
6. **Focus sa po zavretí menu vracia vždy na hamburger**, nie na to, čo bolo
   aktívne pred otvorením. Menu sa nedá otvoriť inak, a testom sa ukázalo, že
   uložený `activeElement` môže byť `body`.
7. **Hlavička pod 480 px bez telefónu skrýva CTA.** S telefónom je CTA ikona
   48×48 podľa briefu. Bez neho znie „Chcem oceniť vec“, na ikonu sa zmenšiť
   nedá a v riadku s logom a hamburgerom sa nezmestí — lámalo hlavičku na dva
   riadky. Tú istú akciu nesie mobilné menu aj sticky call bar.
8. **`.ts` prípony v importoch.** Bez nich sa `src/lib/*` nedá načítať v Node,
   teda ani otestovať. Astro to podporuje (`allowImportingTsExtensions`).
9. **`public/og.png` som vygeneroval jednorazovo cez `sharp`** (už je závislosťou
   Astra) a commitol. Skript v repe nezostal — brief chce statický súbor.
   Písmo je Georgia, teda náš metricky blízky serif fallback; Source Serif nie je
   v systéme a inštalovať kvôli OG obrázku nič nebudem.

---

## Čo ostáva

- Fáza 6 — až s reálnym telefónom a doménou.
- `docs/OTAZKY.md` — tri otvorené body.
