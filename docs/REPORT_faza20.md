# REPORT — Fáza 20

Zadanie: `docs/PROMPT_FINAL14.md`, poradie §5. Dátum: 15. 8. 2026.
Náhľady: `docs/mapa-3d-nahlad.png`, `docs/svetla-sekcia-nahlad.png`.

---

## §1 Budova sa určuje zo značky

Nezhoda vznikla presne tak, ako si písal — boli to dva nezávislé výpočty.
Zvýraznená budova sa teraz hľadá **až po tom, čo je značka finálna**, a to
výhradne z nej: budova, do ktorej značka padne, inak najbližšia do 25 m.

Pri súčasnej polohe značka **do žiadneho pôdorysu nepadá a najbližší je ďalej
než 25 m**, takže sa podľa pravidla 3 nezvýrazňuje nič — svieti len bod
a žiara. Zlatý obrys na budove vľavo zmizol.

Otázku na súradnicu vchodu som v `OTAZKY.md` zavrel.

---

## §3 Prepínač jazykov

Tvar zo screenshotu: aktívny jazyk tmavá pilulka `--color-ink-700`, rádius
6 px, text `--color-bone`; neaktívny holý text `--color-bone-muted`, hover na
zlatú. Výška 28 px, odsadenie 10 px, medzera 4 px. Tap target 48 × 48 px cez
neviditeľné `::after`, nie cez väčšiu pilulku.

Vlajky sú **inline SVG**, 18 × 12 px, rádius 2 px, 1px hranica
`rgba(255,255,255,.15)`. Kód jazyka pri nich zostáva, vlajka je `aria-hidden`
a `aria-label` nesie plný názov. EN má vlajku Spojeného kráľovstva.

Prepínanie je jeden riadok: `LOCALE_SWITCHER.style` v `i18n.ts`
(`'flags' | 'text'`). Poznámka o tom, že vlajka označuje štát a nie jazyk,
zostala zapísaná pri tej konštante — rozhodnutie je tvoje a rešpektujem ho.

---

## §4 Svetlé sekcie

| | |
|---|---|
| 4.1 striedavý podklad | „Čo prijímame" `paper`, „Ako to funguje" **`paper-2`** |
| 4.2 zlatý nábeh so scrollom | `translate3d`, rozsah 40 px (mobil 20 px), `IntersectionObserver` + `rAF`, scroll listener `passive`, `prefers-reduced-motion` → bez pohybu |
| 4.3 duchové slovo | **ZLATO** a **DOHODA**, serif 600, `clamp(8rem, 22vw, 18rem)`, orezané okrajom sekcie |
| 4.4 mriežka sa dokreslí | linky nad položkami `scaleX(0→1)`, 420 ms, stagger cez existujúci reveal |

**Meranie kontrastu (povinné):** pri pôvodných hodnotách klesol `ink-text` na
svetlej ploche na **11,41:1** — vinníkom bola kombinácia tmavšieho `paper-2`,
zlatej vrstvy a duchového slova. Stiahol som zlato zo 0,07 na **0,04**
a duchové slovo z 0,035 na **0,02**. Výsledok: **12,06:1** na najtmavšej
papierovej ploche celej stránky. Text má prednosť pred textúrou.

---

## §2 Popisy budov v mape

Len z OSM `name`, len orientačné body (`railway=station`, `bus_station`,
`shop=supermarket`, `hospital|school|place_of_worship`), maximálne štyri
okrem Albionu. Prevádzky typu pizzeria, taxi či lekáreň sa nepopisujú
a konkurencia je vylúčená explicitne (`shop=pawnbroker` sa preskakuje).

V dátach prežil **jeden** popis: **Billa** pri autobusovej stanici — presne
ten supermarket, ktorý si spomínal. Škola vypadla, lebo jej popis by padol
na horný okraj výrezu; popisy sa neposúvajú do nezmyselných pozícií, radšej
sa vynechá menej dôležitý. Ostatné objekty v okolí `name` nemajú a nič som
si nevymýšľal.

Sadzba: `Albion` serif 600 `--color-bone`, ostatné sans `--color-bone-muted`,
orientačné body o dva stupne menšie (15 px), halo pod všetkými.

---

## Overené

`astro check` 0 chýb · `npm test` 23/23 · build 10 stránok · rýchly scroll
bez prázdnych miest · 12 requestov, 0 third-party.

## Otvorené

Tri háčiky čakajú na potvrdenie · korektúra HU a EN rodeným hovorcom ·
e-mail · fotky · doklady · právna kontrola · podsetovanie Interu.
