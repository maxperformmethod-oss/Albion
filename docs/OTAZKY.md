# OTÁZKY

Otvorené body, ktoré potrebujú tvoje alebo majiteľovo rozhodnutie.

---

## ✅ VYRIEŠENÉ

### 1. Adresa natvrdo v textoch — splatené

Odpoveď: `docs/PROMPT_FINAL.md` §1 + `docs/UDAJE_FINAL.md` §2.
Adresa je potvrdená (`Kpt. Nálepku 41, 984 01 Lučenec`), v `business.ts` už nie je
`TO_CONFIRM` a **z textov zmizla natvrdo**. Hero eyebrow aj sekcia „Kde nás nájdete"
sa skladajú z `business.ts` cez zástupný znak `{address}`. Stráži to unit test
`tests/content.test.mjs` — ak sa adresa do textov vráti, testy spadnú.

### 2. Obedňajšia prestávka — implementovaná

Odpoveď: prestávku nemajú, ale kód pre ňu existuje.
`getOpenState()` v `src/lib/hours.ts` vracia `open` / `break` / `closed`.
Stav `break` sa dnes nikdy nevykreslí; keby ju majiteľ zaviedol, stačí pridať
druhý interval do `openingHours`.

Navyše: pri zatvorenom obchode indikátor povie **kedy otvárame**
(`Zatvorené · otvárame zajtra o 7:00`), nielen že je zatvorené.

### 3. Mapa bez `<iframe>` — potvrdené

Zámer, nie opomenutie. Typografický blok + tlačidlo do Google Máp.

---

## ⏳ ZOSTÁVA (nič z toho neblokuje)

| # | Vec | Čo sa stane, keď príde |
|---|---|---|
| 1 | **Doména** | `PUBLIC_SITE_URL` → canonical, OG URL, sitemap a `url`/`image` v JSON-LD. Dovtedy sa `url` a `image` do JSON-LD **nevygenerujú** — localhost tam nepatrí. |
| 2 | **E-mail** | Pribudne riadok v sekcii Kontakt a `email` v JSON-LD. |
| 3 | **GPS súradnice** | Pribudne `geo` v JSON-LD (lokálne SEO). |
| 4 | **Potvrdenie roku 2001** | Prepni `foundedYearConfirmed: true` → do bodu „Dlhoročná miestna firma" pribudne veta `V Lučenci pôsobíme od roku 2001.` |
| 5 | **Priamy odkaz na Google profil** | Nahradí vyhľadávací odkaz — otvorí kartu prevádzky s recenziami namiesto zoznamu výsledkov. |
| 6 | **6 fotiek od majiteľa** | Nahradia abstraktnú textúru v hero. Zoznam je v `README.md`. |
| 7 | **Doklady k založeniu** | `requiredDocuments` → poznámka pod krokmi v sekcii „Ako to funguje". |

---

## Nový otvorený bod

### Fallback font pre nadpisy

Nadpisy sú teraz v reze 600. Georgia (fallback) je v tučnom reze širšia než
Source Serif 4, takže pri načítaní fontu môže nastať posun. Nameraný CLS
a rozhodnutie o `size-adjust` sú v `docs/REPORT_faza6_audit.md`.
