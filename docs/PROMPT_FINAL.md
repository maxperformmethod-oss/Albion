# FINÁLNY PROMPT PRE CLAUDE CODE — dokončenie Albion

> Skopíruj celý tento súbor do Claude Code. Je to posledná dávka zmien pred auditom.
> Zdroj pravdy zostáva `docs/BRIEF.md`. Tento súbor ho dopĺňa, neruší.

---

## KONTEXT

Fázy 1–5 sú hotové (`89a8c8f`). Teraz robíme finálnu vrstvu: potvrdená adresa, ťažšia typografia, hero s obrazom a jeden pamätný animačný moment. Potom audit.

Podrobnosti sú v `docs/ODPOVEDE_v3.md` a `docs/HERO_ASSET.md` — prečítaj oba pred začiatkom.

---

## 1. ADRESA — POTVRDENÁ

Rúbanisko II 76 je **zrušená** prevádzka. Platí jediná:

```
Kapitána Nálepku 41, 984 01 Lučenec
```

- V `business.ts`: `street`, `city`, `postalCode` už **nie sú** `TO_CONFIRM`.
- **Odstráň adresu natvrdo z textov.** Hero eyebrow aj sekcia „Kde nás nájdete" sa skladajú z `business.ts`. Tým zaniká dlh z `OTAZKY.md` #1.
- V `docs/FIRMA_UDAJE.md` označ Rúbanisko ako zrušené.

Stále `TO_CONFIRM`: telefón, e-mail, `mapsUrl`, `geo`, otváracie hodiny, IČO, doména.

## 2. OBEDŇAJŠIA PRESTÁVKA

Doplň do `hours.ts` stav **„Obedňajšia prestávka · otvárame o {čas}"**. Ak prestávku nemajú, stav sa nikdy nevykreslí. (Odpoveď na `OTAZKY.md` #2.)

## 3. MAPA BEZ IFRAME — POTVRDENÉ

Áno, je to zámer, nie opomenutie. (Odpoveď na `OTAZKY.md` #3.)

---

## 4. TYPOGRAFIA — ŤAŽŠIE REZY

| Prvok | Nové |
|---|---|
| H1 | serif **600**, `letter-spacing: -0.022em`, `line-height: 1.04` |
| H2 | serif **600**, `letter-spacing: -0.018em` |
| H3 / názvy krokov a bodov | serif **600** |
| Eyebrow | Inter **600** |
| Tlačidlá | Inter **600** |
| Telo | Inter 400 — bez zmeny |

Source Serif 4 Variable to zvládne bez ďalšieho súboru (os `wght`).

**Povinné po zmene:** znova zmeraj CLS. Georgia je v tučnom reze širšia než Source Serif, takže fallback treba pravdepodobne dolaďiť cez `size-adjust`. Číslo mi nahlás.

---

## 5. HERO S OBRAZOM

Postupuj podľa `docs/HERO_ASSET.md` — je tam hotový skript aj markup.

Zhrnutie:

- **Zdrojové obrazy si stiahni sám** (sú to naše vlastné vygenerované assety), do `src/assets/raw/`:

```powershell
New-Item -ItemType Directory -Force -Path src\assets\raw
# desktop 16:9 — 3856×2160
Invoke-WebRequest -OutFile src\assets\raw\hero-raw.png `
  "https://d8j0ntlcm91z4.cloudfront.net/user_3GopSFcHY8NWG3H4F9dFL9Yn8d6/hf_20260814_090937_bbf45973-89de-4110-ae9f-7ff876b2d8d2.png"
# mobil 4:5 — 1856×2304
Invoke-WebRequest -OutFile src\assets\raw\hero-raw-mobile.png `
  "https://d8j0ntlcm91z4.cloudfront.net/user_3GopSFcHY8NWG3H4F9dFL9Yn8d6/hf_20260814_090944_75b6bd3a-9421-46d3-be24-87851defeeaf.png"
```

  Over rozmery po stiahnutí (`3856×2160` a `1856×2304`). Pridaj `src/assets/raw/` do `.gitignore` — do repa idú len prekódované výstupy v `public/images/`.
- `scripts/build-hero.mjs` cez `sharp` (**žiadna nová závislosť**) vygeneruje AVIF+WebP v troch desktopových a dvoch mobilných šírkach a sám skontroluje rozpočty a tmavosť.
- `<picture>` s `media`-prepínaním desktop/mobil, `fetchpriority="high"`, bez `loading="lazy"`, `width`/`height` povinné.
- `alt=""` + `aria-hidden="true"`. **Nikdy** alt typu „predajňa Albion" — je to dekoratívna textúra, nie fotka prevádzky.
- Povinná gradientová maska nad obrazom (CSS v `HERO_ASSET.md`).
- Nepoužívaj `astro:assets` — obraz je predspracovaný, chceme kontrolu nad bajtami.

**Hero musí fungovať aj bez obrazu.** Kým zdroje nie sú v repe, postav ho na čistom `ink-900` a skript preskoč.

**Rozpočet sa nemení:** LCP < 1.8 s, CLS < 0.05. Ak obraz rozpočet prekročí, zmenši obraz — nie animácie.

---

## 6. JEDEN PAMÄTNÝ MOMENT — REVEAL H1

Presne **jeden** prvok na celom webe dostane výnimočnú animáciu.

- Každý riadok H1 v `<span>` s `overflow: hidden`, vnútro `translateY(100%) → 0`.
- `700ms`, `--ease-out-quint`, stagger 90 ms medzi riadkami.
- Spúšťa sa raz po `load`, **nie** cez `IntersectionObserver`.
- `prefers-reduced-motion` → nespustí sa vôbec, text je hneď na mieste.
- Bez JS je text viditeľný (trieda sa pridáva skriptom).

Tento typ animácie sa nikde inde neopakuje. To je celý zmysel.

## 7. ZLATÁ HAIRLINE

Oddeľovače sekcií: `scaleX(0) → scaleX(1)`, `transform-origin: left`, 500 ms, raz pri vstupe do viewportu. `--color-gold` pri 40 % krytí.

---

## 8. ČO SA NEMENÍ

Farby · poradie 8 blokov · CTA hierarchia · schválené texty · zákaz iframe mapy · zákaz stock fotiek · 20 kB JS strop · žiadne cookies · žiadny third-party request.

**Kontakt zostáva sekcia, nie modálne okno.** Modal by pridal klik pred konverziu a zhoršil SEO.

**Naďalej zakázané:** parallax · karusel · počítadlá · kurzorové efekty · particles · 3D · scroll-jacking · autoplay video · typewriter.

**K nainštalovaným skills:** použi tie, čo zlepšia remeslo (a11y audit, optimalizácia obrázkov, CSS review). Nepouži žiadny, ktorý ťahá runtime do webu. Remotion je React video framework — **do stránky nepatrí**, rozbil by rozpočet JS. Legitímne je len offline video na sociálne siete mimo `src/`. Ak by skill navrhol video pozadie hero, odmietni to a napíš prečo.

---

## 9. README

Doplň zoznam 6 fotiek, ktoré potrebujeme od majiteľa:

1. exteriér s vchodom, 2. výklad/označenie, 3. pult vnútri, 4. detail zlata na tmavom podklade, 5. záber so stanicou v pozadí, 6. majiteľ pri pulte.

Reálna fotka nahradí textúru okamžite — je vždy silnejšia.

---

## 10. PORADIE PRÁCE

1. Adresa (§1) → 2. Prestávka (§2) → 3. Typografia (§4) + meranie CLS → 4. Hero (§5) → 5. Reveal H1 (§6) → 6. Hairline (§7) → 7. README (§9) → 8. `git push`.

Potom napíš `docs/REPORT_faza7_wow.md`: čo si overil, čo nie, namerané CLS, veľkosť JS, veľkosti obrázkov.

**Fázu 6 (audit) nespúšťaj** — stále chýba telefón a doména.

**V chate píš max 5–10 riadkov.** Detaily do súborov.
