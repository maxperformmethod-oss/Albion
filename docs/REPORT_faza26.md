# REPORT — Dávka 26 (PROMPT_FINAL20)

Poradie podľa §5: §3 zjednodušenie → §4 komentár → §2 fotka.
§1 (redeploy vo Verceli) je na tebe, do kódu nezasahuje.

**Nepushnuté.** Čaká to na tvoje slovo k náhľadu fotky.

---

## §3 — zjednodušenie

### 3.1 Riadok faktov v hero

Pod tlačidlami pribudol jeden riadok: `Po – Pi 7:00–17:30 · Otvorené teraz · Ukázať na mape`.

- hodiny sa skladajú z `business.openingHours` (`formatDays` + `formatTime`), nie sú nikde natvrdo
- stav je **ten istý komponent ako v Kontakte** — vznikol `src/components/ui/OpenState.astro`
  a používajú ho obe miesta. Jeden skript, jeden výpočet; dva by sa vedeli rozísť.
- „Ukázať na mape" vedie na `#kde-nas-najdete`, teda na vlastnú schému, nie na Google
- pod 40 rem sa z riadku stane zoznam pod sebou a oddeľovače zmiznú — inak by
  bodky viseli na koncoch zalomených riadkov

Vedľajší efekt: poznámka pri telefóne z dávky 25 už nepotrebuje vlastný JS.
`OpenState` zapíše stav na `<html data-open-state="…">` a poznámku odteraz
zobrazuje čisté CSS.

### 3.2 Kratší lead · 3.3 Kratšia sekcia „Zvláštna vec ešte neznamená problém"

Presne podľa zadaného znenia, vo všetkých troch jazykoch.

### Počet slov — **cieľ sa nepodaril**

| | pred | po §3 | po §2 |
|---|---|---|---|
| SK | 1005 | **983 (−22)** | 992 (−13) |
| HU | 943 | 928 (−15) | 935 (−8) |
| EN | 1216 | 1190 (−26) | 1199 (−17) |

Očakávanie bolo **−35 až −45**, vyšlo **−22**. Nie je to nedorobené: sú to presne
tie texty, ktoré si zadal. Prepočet:

- lead −5 slov (22 → 17)
- dva odseky v „Zvláštna vec…" do jedného −20 slov (60 → 40)
- `Ukázať na mape` +3

Viac sa z §3 vytiahnuť nedá bez zásahu do toho, čo §3.4 chráni. Ak chceš ísť
nižšie, treba povedať ktorý ďalší blok — sám som do chránených nesiahal.

Druhý stĺpec je po pridaní `alt` textu k fotke (+9 slov v SK). Popis obrázka je
text pre čítačku, nie text na stránke, ale do počtu sa ráta, tak to uvádzam oddelene.

---

## §4 — zastaraný komentár

`src/data/i18n.ts` už netvrdí „nikdy vlajky". Nový komentár hovorí, že vlajky sú
vedomé rozhodnutie majiteľa z dávky 14 a že `style: 'text'` je pripravená
alternatíva na jeden riadok. Dôvod, prečo bol pôvodne odporúčaný text, zostal
zapísaný pri samotnej konštante.

---

## §2 — fotka vchodu

### Čo prišlo

`image0.png`, 1290×2796, PNG, 3,4 MB. **Je to snímka obrazovky z telefónu**, nie
pôvodná fotka — hore aj dole má čierne pruhy (y 0–250 a 2544–2795). Užitočná
plocha je 1290×2293.

Kvalita je v poriadku: denné svetlo, ostré, rovno spredu. Vidno vchod, markízu
s nápisom, banner „PENIAZE IHNEĎ" aj žltú tabuľu ZÁLOŽŇA. Presne to, čo človek
hľadajúci prevádzku prvýkrát potrebuje.

### Tri odchýlky od §1, ktoré si vyžiadala samotná fotka

1. **Vchod nie je v pravej tretine a ani sa tam nedá dostať.** Dvere sú v strede
   až pravom strede, žltá tabuľa je pri pravom okraji. Orezať zľava by dvere
   posunulo ešte viac doľava; orezať sprava by odstrihlo tabuľu. Nechal som
   kompozíciu tak, ako je — dvere aj tabuľa sú v pravej polovici a ľavá polovica,
   kde leží text, je tmavá mreža susedného objektu. Funguje to.

2. **Maska sa musela otvoriť, nie pritvrdiť.** §1 predpokladal, že pri fotke bude
   treba **vyššie** krytie. Opak je pravda: pôvodná maska (pravá strana 0,73)
   fotku úplne zhltla — pozri náhľad. Pravá strana ide na **0,32**, spodok
   z 0,95 na **0,72**, a zlom sa posunul zo 42 % na **62 %**, aby textové pásmo
   zostalo kryté. Ľavá strana, kde leží H1, zostala na 0,96 — tam sa nemenilo nič.

3. **Najväčší desktopový variant je 1280 px, nie 1920.** Zdroj má 1290 px na
   šírku, takže `hero-1920` by bolo len rozmazané zväčšenie bez detailu navyše.
   Variant je zrušený aj z `srcset` aj z preloadu v `BaseLayout.astro`.

### Výrezy

| | výrez zo zdroja | výsledok |
|---|---|---|
| desktop 16:9 | `top 1080, 1290×726` | 1280×720 |
| mobil 4:5 | `top 931, 1290×1612` | 760×950, 480×600 |

Grading podľa §1: `brightness 0.84`, `saturation 0.88`. Strop priemernej
luminancie som pre fotku zdvihol z 0,12 na **0,26** — textúra je rozmazaná plocha,
fotka má oblohu a svetlú fasádu a pri 0,12 by z nej ostala čierňava.

### Kontrast H1 — premeraný

```
najsvetlejší podklad v textovom pásme: rgb(36, 39, 44)

bone       #F3F0EA   13,17:1   (cieľ 12:1)   OK
bone-muted #B8B3A9    7,18:1   (cieľ 4,5:1)  OK
gold       #C9B085    7,16:1   (cieľ 4,5:1)  OK
```

Medzikrok pri zlome na 46 % dával 11,56:1, teda tesne pod cieľom. Posun zlomu
na 62 % to vyriešil bez toho, aby sa pravá strana znova zatemnila.

### `alt` a prístupnosť

Fotka už nie je dekorácia: `aria-hidden` je preč a `alt` znie
*„Vchod do Staničnej Záložne Albion na Kpt. Nálepku 41 v Lučenci"*.

Ulica sa doň dopĺňa z `business.ts` cez `{street}` — natvrdo v texte byť nesmie
a unit test to stráži. Znenie z §1 tým zostáva zachované doslova.

### Váha

| súbor | AVIF | WebP |
|---|---|---|
| `hero-1280` | 37 kB | 54 kB |
| `hero-760` | 19 kB | 28 kB |
| `hero-m-760` | 34 kB | 49 kB |
| `hero-m-480` | 19 kB | 24 kB |

Rozpočet zo §1 (140 kB pre najväčší, 55 kB pre mobil) je splnený s rezervou.
Oproti textúre (9 kB a 8 kB) je to viac — fotka má detail, ktorý textúra nemala.
**LCP treba premerať na produkcii**, v labe som ho po tejto zmene nemeral.

---

## §2 — video

Na web som ho nedal a do repa neuložil, ostáva pre Google profil.

| | |
|---|---|
| súbor | `Video.mov` |
| kontajner | QuickTime (`qt`) |
| kodeky | H.264 (`avc1`) + AAC (`mp4a`) |
| dĺžka | **6,6 s** |
| rozmery | **568×320** (16:9) |
| veľkosť | **0,99 MB** |
| dátový tok | ~1 260 kbit/s |

**Poznámka pri nahrávaní na Google profil:** 568×320 je veľmi málo. Google
odporúča minimálne 720p a v karte prevádzky sa video zobrazuje väčšie, takže
takto pôjde rozmazané. Ak existuje originál z telefónu, nahrávaj ten — toto
vyzerá ako zmenšená kópia. Dĺžka aj formát sú v poriadku (Google berie do 30 s).

---

## Čísla

| | |
|---|---|
| `npm run check` | 0 errors, 0 warnings, 2 hints |
| `npm test` | 23/23 |
| `npm run build` | ✅ 10 stránok |
| `npm run images` | ✅ v rozpočte aj v tmavosti |
| kontrast H1 | 13,17:1 |
| klientský JS (gzip) | 2,14 kB |
| HTML homepage (gzip) | 27,6 kB |

**2 hints** sú staršie a nesúvisia s touto dávkou: nepoužité konštanty
`ALLOW_ROOF_ANCHOR` a `MAX_MARKER_SHIFT_M` v `scripts/build-map.mjs`.

## Neoverené

- **LCP na produkcii po výmene textúry za fotku.** Obrázok narástol z 9 kB na
  37 kB (AVIF, desktop) a z 8 kB na 19 kB (mobil 480). Je to stále hlboko pod
  rozpočtom, ale LCP prvok je to isté `<img>`, takže sa to prejaví.
- Preklady HU a EN vrátane nového `alt` a `showOnMap` sú odo mňa, nie od rodeného
  hovorcu. Idú do korektúry so zvyškom.
- Fotka nie je overená na fyzickom telefóne, len v emulácii.
