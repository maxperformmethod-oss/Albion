# DÁVKA 22 — zlaté obrazy do pozadí, mobilná kompatibilita

> Rob až po dávke 21. Nepushuj bez náhľadu.

---

## 1. TRI NOVÉ OBRAZY — SÚ VYGENEROVANÉ

Tmavé makro zábery zlata, 2752×1536, v našej palete:

```powershell
$b = "https://d8j0ntlcm91z4.cloudfront.net/user_3GopSFcHY8NWG3H4F9dFL9Yn8d6/"
# A — dva snubné prstene na tmavom kameni
Invoke-WebRequest -OutFile src\assets\raw\gold-rings.png "$b`hf_20260819_194711_2d1017eb-e8a3-4f78-8f64-e39bb0199d06.png"
# B — zlaté retiazky
Invoke-WebRequest -OutFile src\assets\raw\gold-chains.png "$b`hf_20260819_194711_ce15e161-6f13-4925-8fba-177355912667.png"
# C — jeden prsteň nastojato s dlhým tieňom
Invoke-WebRequest -OutFile src\assets\raw\gold-ring-single.png "$b`hf_20260819_194711_1ac13863-14de-41a4-a75c-6a13e811066c.png"
```

Spracuj cez `build-images.mjs`, `brightness` **0,70**, `saturation` **0,85**. Sú už tmavé, netreba ich tlačiť na 0,62.

---

## 2. KDE ICH POUŽIŤ — A JEDNO TVRDÉ PRAVIDLO

**Pravidlo: tieto obrazy sú pozadie, nikdy nie ponuka.**

Nesmú sa objaviť v bloku „Zlato a šperky aj predávame" ani nikde, kde by ich zákazník mohol pochopiť ako tovar, ktorý máte na sklade. Sú generované — keby si ich niekto prišiel kúpiť, klamali by. V sekcii predaja zostáva len text.

| Sekcia | Obraz | Krytie a spracovanie |
|---|---|---|
| Zvláštna vec ešte neznamená problém | **A — prstene** | nahradí súčasný zlatý satén, pravý panel 42 %, mäkký okraj cez `mask-image` |
| Založiť alebo predať? | **B — retiazky** | full-bleed, `opacity: 0.13`, `filter: grayscale(0.25)` — len tón pod textom |
| Slovo majiteľov | **C — prsteň s tieňom** | pravá tretina, `opacity: 0.35`, mäkký okraj. **Vypadne, keď príde fotka manželov** — tá má prednosť |
| Prečo Albion | textúra, ktorá tam je | bez zmeny |
| Kontakt | textúra, ktorá tam je | bez zmeny |
| Svetlé sekcie | žiadny | bez zmeny |

Tri nové obrazy, tri staré textúry zostávajú. **Viac ich už nepridávaj** — každá tmavá sekcia má jeden a to je strop. Keby ich bolo viac, prestanú fungovať ako akcent a stanú sa tapetou.

Všetky `alt=""` + `aria-hidden="true"`. Sú dekorácia, nie informácia.

### Rozpočet

- každý obraz **≤ 40 kB** v AVIF pri 1600 px, mobilný variant ≤ 20 kB pri 760 px
- **celková váha stránky nesmie prekročiť 400 kB** — teraz je okolo 300 kB, takže máš ~100 kB priestoru na tri obrazy vrátane mobilných variantov
- ak sa nezmestíš, uber krytie a zmenši rozmery, nie počet sekcií

Po nasadení premeraj kontrast textu nad každým z nich. Cieľ 12:1, meraj na pixeloch, nie na tokenoch.

---

## 2b. ŠTVRTÝ OBRAZ — ZATIAĽ SA NEPODARIL

Skúšal som k tomu dogenerovať záber s **množstvom rôznych prsteňov naraz** — široké zdobené, dute tvarované, tenké obrúčky, točené. Generátor to trikrát odmietol spracovať, zjavne dočasný výpadok na ich strane. Skúsim to znova neskôr.

Až príde, nahradí **obraz A** v sekcii „Zvláštna vec ešte neznamená problém" — je tam vhodnejší, lebo tá sekcia je práve o pestrosti toho, čo Albion berie. Obraz A sa potom presunie na miesto obrazu C, ak fotka manželov ešte nebude.

Do `content.ts` ani nikam do textu **nepíš obchodný slang pre tie tvary prsteňov**. V hovorenej reči v obchode je bežný, ale napísaný na webe vyznie úplne inak, než ako sa myslí — a je to prvá vec, ktorú by niekto vytrhol zo súvislosti. Popisujeme ich vzhľadom: *široké, zdobené, dute tvarované, tenké obrúčky*.

---

## 3. MOBILNÁ KOMPATIBILITA — ZNOVA A DÔSLEDNE

Pribúdajú tri obrazy s maskami a to je presne to, čo na starších telefónoch padá. Prejdi tento zoznam a v reporte odpíš každý bod zvlášť.

1. **`mask-image` vždy s `-webkit-mask-image`.** Bez prefixu sa na starších iOS maska neaplikuje a obraz sa zobrazí s ostrou hranou cez pol sekcie.
2. **`filter: grayscale()` je statický, nikdy animovaný.** Statický filter je v poriadku, animovaný na iOS prekresľuje vrstvu v každom snímku.
3. **Žiadny nový `backdrop-filter`.** Na strednej triede Androidov to zhodí plynulosť scrollu. Ak ho niekde máš, napíš kde.
4. **`background-attachment: fixed` nikde.** Na iOS nefunguje.
5. **Každý obraz má vlastný mobilný variant** cez `<source media="(max-width: 767px)">`. Nesmie sa stiahnuť desktopový a zmenšiť v prehliadači.
6. **Všetky nové obrazy `loading="lazy"` a `decoding="async"`.** `fetchpriority="high"` má naďalej len hero.
7. **Lazy obraz za animáciou musí uvoľniť ten istý observer, ktorý spúšťa animáciu** — presne ako pri mape. Toto je opakovaná pasca, over ju pri každom novom obraze.
8. **Pod 768 px zníž krytie o tretinu** pri všetkých troch. Na malej ploche pôsobí rovnaké krytie výraznejšie a text sa horšie číta.
9. **Otestuj v emulácii so škrtením CPU 4×** na iOS aj Android profile a napíš, či scroll zostal plynulý.

---

## 4. NÁHĽAD

Pred pushom ukáž **štyri náhľady**: desktop celá stránka, mobil celá stránka, a detail sekcií „Zvláštna vec" a „Slovo majiteľov".

Ak by ktorýkoľvek obraz pôsobil ako tapeta alebo bral pozornosť textu, **zníž krytie sám** a napíš o koľko. Máš na to lepší odhad než ja z popisu.

---

## 5. POSTUP

1. Stiahnuť a spracovať obrazy (§1)
2. Nasadiť do troch sekcií (§2)
3. Prejsť mobilný zoznam (§3)
4. Náhľady → ukázať → push

Report do `docs/REPORT_faza28.md`: veľkosti obrazov, celková váha stránky, namerané kontrasty, a odpočet všetkých deviatich bodov z §3.
