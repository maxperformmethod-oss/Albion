# ÚDAJE — FINÁLNE, POTVRDENÉ MAJITEĽOM (14. 8. 2026)

> **Tento súbor nahrádza `docs/UDAJE_UPDATE.md`.** Kde si odporujú, platí tento.
> Zdroj pravdy pre stratégiu zostáva `docs/BRIEF.md`.

---

## 1. NÁZOV — DÔLEŽITÁ ZMENA

Prevádzka sa verejne volá **Staničná Záložňa Albion**. To zároveň vysvetľuje starý rozpor z `FIRMA_UDAJE.md` — nešlo o dve firmy, ale o jednu, ktorá sa premenovala a presťahovala.

**Rozhodnutie o názvoch (rieš presne takto):**

| Kde | Čo použiť |
|---|---|
| JSON-LD `name`, `<title>`, OG title | **Staničná Záložňa Albion** — musí sedieť s Google Business Profile |
| JSON-LD `legalName` | ALBION P.M., s.r.o. |
| Logo wordmark | **ALBION** (bez zmeny) |
| Logo descriptor | `STANIČNÁ ZÁLOŽŇA · LUČENEC` *(zmena z „ZÁLOŽŇA · LUČENEC")* |
| Footer, právny riadok | ALBION P.M., s.r.o. · IČO 36 050 814 |
| Bežný text na stránke | „Albion" |

**Prečo takto:** JSON-LD a `<title>` sa musia zhodovať s GBP, inak Google vníma nekonzistentné NAP. Wordmark ale zostáva krátky — „Staničná Záložňa Albion" je na logo príliš dlhé a v grafike by pôsobilo ťažkopádne.

**Bonus, ktorý treba využiť:** slovo *Staničná* je presne to, na čom staviame pozicioning („pri stanici"). Nie je to len názov, je to orientačný bod. Nemeň kvôli tomu texty, ale v `<title>` a JSON-LD to hraje pre nás.

Aktualizuj `<title>` na:

```
Staničná Záložňa Albion Lučenec | Výkup zlata, šperkov a elektroniky
```

---

## 2. POTVRDENÉ ÚDAJE → `business.ts`

```ts
name:        "Staničná Záložňa Albion",
legalName:   "ALBION P.M., s.r.o.",
street:      "Kpt. Nálepku 41",
city:        "Lučenec",
postalCode:  "984 01",
country:     "SK",
phone:       "+421474334444",
ico:         "36050814",
mapsUrl:     "https://www.google.com/maps/search/?api=1&query=Stani%C4%8Dn%C3%A1+Z%C3%A1lo%C5%BE%C5%88a+Albion+Kpt.+N%C3%A1lepku+41+Lu%C4%8Denec",
openingHours: {
  mon: [["07:00", "17:30"]],
  tue: [["07:00", "17:30"]],
  wed: [["07:00", "17:30"]],
  thu: [["07:00", "17:30"]],
  fri: [["07:00", "17:30"]],
  sat: [],   // zatvorené
  sun: [],   // zatvorené
},
email: TO_CONFIRM,   // NEZOBRAZUJ, kým nepríde
geo:   TO_CONFIRM,   // vynechaj z JSON-LD
```

**Zobrazenie telefónu:**

- `tel:` href → `+421474334444`
- hlavička a sticky bar → `047 433 44 44`
- sekcia Kontakt a footer → `+421 47 433 44 44`
- `aria-label="Zavolať na číslo 047 433 44 44"`

**Adresa v texte:** píš `Kpt. Nálepku 41` (skrátene, tak ako to má majiteľ), nie `Kapitána Nálepku 41`. Uprav aj hero eyebrow — skladá sa z `business.ts`, takže sa to premietne samo.

**IČO v footeri:** zobrazuj s medzerami `36 050 814`, v JSON-LD bez medzier.

---

## 3. TELEFÓN — ZRUŠENIE PREDCHÁDZAJÚCEHO ČÍSLA

Číslo `+421 905 345 107` z `UDAJE_UPDATE.md` bolo dočasné. **Nepoužívaj ho.** Platí jedine pevná linka `+421 47 433 44 44`, ktorá sedí aj s verejnými zdrojmi.

Na webe je **jedno** telefónne číslo. Dve čísla rozdrobia primárne CTA a zákazník musí premýšľať, kam volať — presne to nechceme.

---

## 4. OTVÁRACIE HODINY — ODOMYKAJÚ SA FUNKCIE

Po-Pi 07:00–17:30, So a Ne zatvorené. **Obedňajšia prestávka nie je** — stav „Obedňajšia prestávka" sa teda nikdy nevykreslí, ale kód preň nechaj (majiteľ ju môže neskôr zaviesť).

Odomyká sa:

- indikátor **„Otvorené teraz" / „Momentálne zatvorené"** v sekcii Kontakt (`Europe/Bratislava`),
- `openingHoursSpecification` v JSON-LD,
- výpis hodín v sekcii Kontakt a vo footeri.

**Odporúčam doplniť užitočný stav:** keď je zatvorené, indikátor nech ukáže, kedy sa otvára — napr. `Zatvorené · otvárame v pondelok o 7:00`. Je to jeden riadok kódu navyše a zákazníkovi ušetrí zbytočný telefonát.

**Pozor na letný/zimný čas** — počítaj cez `Intl.DateTimeFormat` s `timeZone: "Europe/Bratislava"`, nie cez offset natvrdo.

---

## 5. GOOGLE MAPS

Dodaný odkaz je vyhľadávací (`/maps/search/?api=1&query=…`), nie priamy odkaz na profil. Funguje a je bezpečný — použi ho tak, ako je.

*Neskoré vylepšenie (neblokuje):* keď majiteľ pošle priamy odkaz na svoj Google profil (cez „Zdieľať" v Mapách), nahradíme ho — priamy odkaz otvorí kartu prevádzky vrátane recenzií a hodín namiesto zoznamu výsledkov.

---

## 6. E-MAIL

`TO_CONFIRM`. **Nezobrazuj, nevymýšľaj, nedávaj do JSON-LD.** Sekcia Kontakt bez neho funguje — telefón a adresa stačia.

---

## 7. STAV — UŽ NIČ NEBLOKUJE

| Pole | Stav |
|---|---|
| názov, právny názov | ✅ |
| adresa, PSČ | ✅ |
| telefón | ✅ |
| otváracie hodiny | ✅ |
| IČO | ✅ |
| Google Maps odkaz | ✅ |
| `siteUrl` | ✅ z `PUBLIC_SITE_URL` → `VERCEL_URL` → localhost |
| e-mail | ⏳ neblokuje |
| `geo` | ⏳ neblokuje (vynechá sa z JSON-LD) |
| rok 2001 | ⏳ `foundedYearConfirmed: false` — veta s rokom sa nezobrazí |
| 6 fotiek | ⏳ neblokuje, beží abstraktná textúra |

**`npm run build` musí od teraz prejsť bez `--allow`.** Ak nie, gate hlási pole, ktoré už nemá byť povinné — uprav zoznam povinných polí (`email` a `geo` sú voliteľné).

---

## 8. PORADIE PRÁCE

1. Zapracuj `docs/PROMPT_FINAL.md` (adresa, typografia, hero, reveal H1, hairline).
2. Zapracuj tento súbor (názvy, telefón, hodiny, IČO, Maps).
3. Over, že `npm run build` prejde bez `--allow`.
4. `git push`.
5. **Spusti Fázu 6** — audit na produkčnom builde (`npm run build && npm run preview`), nie na dev serveri.
6. Report do `docs/REPORT_faza6_audit.md` ako zoznam „overené / neoverené" s číslami.

V chate max 5–10 riadkov, detaily do súborov.
