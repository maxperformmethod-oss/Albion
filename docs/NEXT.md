# ĎALŠIE KROKY — pre Claude Code (14. 8. 2026)

## Ako komunikujeme od teraz

- Brief je v `docs/BRIEF.md`. Je to **zdroj pravdy**, nemaž ho ani neprepisuj.
- Údaje o firme sú v `docs/FIRMA_UDAJE.md` — **nič odtiaľ nedávaj do `business.ts`**, sú neoverené.
- Po každej fáze napíš `docs/REPORT_faza<N>.md`. Otázky pre mňa daj do `docs/OTAZKY.md`.
- **V chate píš max 5–10 riadkov.** Detaily patria do súborov. Šetríme kredity.

---

## 1. OPRAV TOKENY (prioritne)

Tvoja rekonštrukcia bola blízko, ale nie presná. Nahraď hodnoty v `src/styles/global.css` originálmi z `docs/BRIEF.md` §4 a zmaž všetky značky `⚠ REKONŠTRUOVANÉ`.

Rozdiely oproti tvojej verzii:

| Token | Ty | Správne |
|---|---|---|
| `--color-ink-900` | `#111110` | `#0F1113` |
| `--color-ink-800` | `#1A1A19` | `#171A1D` |
| `--color-paper` | `#F4F2ED` | `#F5F2EC` |
| `--color-bone` | `#EDE9E1` | `#F5F2EC` |
| `--color-hairline-dark` | `#302E2A` | `rgba(245, 242, 236, 0.14)` |
| `--color-hairline-light` | `#E0DCD3` | `rgba(20, 23, 26, 0.12)` |

Chýbajú ti aj: `--color-ink-700`, `--color-paper-2`, `--color-bone-muted`, `--color-ink-text`, `--color-ink-muted`, `--color-gold-hover`, `--color-gold-ink`. Všetky sú v briefe.

Hairliny sú zámerne `rgba`, nie plné farby — musia fungovať nad ink-900 aj ink-800 bez ďalšieho tokenu.

---

## 2. DOKONČI `content.ts`

Texty sú v `docs/BRIEF.md` §7. Použi ich **doslova**. Nepreformulúvaj, nedopĺňaj, neskracuj.

---

## 3. GITHUB — napoj hneď

Repo je vytvorené: `https://github.com/maxperformmethod-oss/Albion.git`

```bash
git remote add origin https://github.com/maxperformmethod-oss/Albion.git
git branch -M main
git push -u origin main
```

Over, že `.gitignore` obsahuje `node_modules/`, `dist/`, `.astro/`, `.env*`, `.DS_Store` a že fonty v `public/fonts/` **sú** commitnuté (potrebujeme stabilné cesty pre preload).

Po každej ďalšej fáze pushni.

---

## 4. VERCEL — až po Fáze 5

Neriešime teraz. Až keď bude web hotový:

- import repa cez Vercel dashboard (nie CLI),
- framework preset Astro, build `npm run build`, output `dist`,
- env `PUBLIC_SITE_URL` = produkčná doména,
- kým nemáme doménu, `PUBLIC_SITE_URL` = pridelená `*.vercel.app` adresa.

Do tej doby **nepridávaj** `@astrojs/vercel` adaptér — ostávame na statickom outpute.

---

## 5. STARÁ ZLOŽKA

Na ploche je starý `Albion` priečinok s `PLAN.md` a `.claude`. Je neaktuálny. Nepracuj s ním. Zmažem ho ručne — nemaž ho ty.

---

## 6. TVOJE ODCHÝLKY — SCHVÁLENÉ

- **Aktuálna verzia Astro namiesto „Astro 5"** — súhlas. Verziu v briefe som prepísal na „aktuálna stabilná".
- **`@astrojs/check`** — súhlas, devDependency.
- **`robots.txt` ako generovaný endpoint** — súhlas, doména musí ísť z env.
- **`--allow` flag namiesto env premennej** — súhlas, lepšie na Windowse.
- **Post-build scan zlyhá aj v draft režime** — súhlas, dobrý úsudok.
- **Lighthouse A11y 100 nie je dôkaz prístupnosti** — máš pravdu, Fáza 6 to už reflektuje.

---

## 7. ČO EŠTE NEMÁM

Telefón, doména, presná adresa prevádzky, PSČ, hodiny, Maps URL. Doháňam od majiteľa, viď otázky v `docs/FIRMA_UDAJE.md`.

**Nečakaj na ne.** Pokračuj Fázou 2 → 3 → 4 → 5 s placeholdermi a `build:draft`. Zastav sa až pred Fázou 6.
