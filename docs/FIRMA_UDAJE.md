# FIRMA — NÁJDENÉ ÚDAJE (stav 14. 8. 2026)

> ✅ **VYRIEŠENÉ.** Majiteľ údaje potvrdil — platné znenie je v `docs/UDAJE_FINAL.md`
> a v `src/data/business.ts`. Tento súbor zostáva ako záznam o tom, čo sa našlo
> a ako sa rozpor vysvetlil.
>
> **Rúbanisko II 76 je ZRUŠENÁ prevádzka.** Platí jediná adresa
> **Kpt. Nálepku 41, 984 01 Lučenec**. Rozpor nevznikol dvoma firmami, ale jednou,
> ktorá sa presťahovala a premenovala na **Staničná Záložňa Albion**.
>
> Telefón `047 4512 888` ani `047 / 433 44 44` z katalógov sa nepoužil naslepo —
> platné číslo potvrdil majiteľ: **+421 47 433 44 44**.

## Čo som našiel

| Údaj | Hodnota | Zdroj | Istota |
|---|---|---|---|
| Obchodné meno | **ALBION P.M., s.r.o.** | zoznam.sk, azet.sk, finstat | vysoká — jediná záložňa s názvom Albion v Lučenci |
| IČO | **36050814** | zoznam.sk, finstat | vysoká |
| Predmet podnikania | „Prevádzkovanie záložne" | zoznam.sk | vysoká |
| Zápis do OR | **15. 10. 2001**, OS Banská Bystrica | finstat (výsledok vyhľadávania) | stredná — treba overiť na orsr.sk |
| Adresa (katalógová) | ~~Rúbanisko II. 76, 984 03 Lučenec~~ | zoznam.sk, azet.sk | ❌ **zrušená prevádzka** |
| Adresa (iná zmienka) | ~~Jókaiho 21, 984 01 Lučenec~~ | finstat | ❌ neplatná |
| Telefón (katalógový) | ~~047 4512 888~~ | zoznam.sk | ❌ neplatný |
| Telefón (iná zmienka) | 047 / 433 44 44 | polomap.com | ✅ **potvrdený majiteľom** |

## Rozpor, ktorý treba vyriešiť ako prvý

Zadanie hovorí **Kapitána Nálepku 41, pri železničnej stanici**. Ani jeden verejný zdroj túto adresu pri Albione neuvádza. Namiesto toho sa opakuje **Rúbanisko II. 76**, čo je sídlisko, nie okolie stanice. Jeden zdroj dokonca tvrdí, že „Albion Záložňa je presťahovaná na Staničnú záložňu, Rúbanisko II".

**Tri možné vysvetlenia (netuším, ktoré platí):**

1. Kapitána Nálepku 41 je **prevádzka**, Rúbanisko II 76 je **sídlo firmy** — bežný stav, katalógy ťahajú sídlo z registra.
2. Albion má **dve prevádzky**.
3. Katalógové údaje sú **staré** a firma sa medzitým presťahovala k stanici.

**Prečo na tom záleží:** ak sa na web dostane iná adresa alebo telefón než v Google Business Profile, Google to vyhodnotí ako nekonzistentné NAP a lokálne pozície klesnú. Toto je jediný údaj na celom webe, ktorý sa neoplatí odhadnúť.

## Otázky pre majiteľa (odpovede prepíš sem)

1. Presná adresa **prevádzky**, kam chodia zákazníci: ______
2. Je Rúbanisko II 76 stále aktívna prevádzka, alebo len sídlo? ______
3. Telefón, ktorý má byť na webe (jedno číslo, nie dve): ______
4. PSČ prevádzky (984 01 alebo 984 03?): ______
5. Presný odkaz na Google Maps profil prevádzky: ______
6. Otváracie hodiny vrátane obedňajšej prestávky a soboty: ______
7. Je „ALBION P.M., s.r.o." správny prevádzkovateľ a IČO 36050814 správne? ______
8. Rok 2001 — sedí? (zápis do OR je 15. 10. 2001, čo to podporuje) ______
9. E-mail (voliteľné): ______
10. Doména: ______

## Poznámka k roku 2001

Zápis firmy do obchodného registra **15. 10. 2001** je silná nepriama podpora tvrdenia „od roku 2001". Nie je to však dôkaz, že prevádzka fyzicky funguje od vtedy. Flag `foundedYearConfirmed` prepni na `true` až po potvrdení majiteľom.

## Zdroje

- [Albion P.M., s.r.o., Lučenec — Zoznam.sk](https://www.zoznam.sk/firma/2816092/Albion-P-M-Lucenec)
- [ALBION P.M., s.r.o. — Azet.sk](https://www.azet.sk/firma/71536/albion-p-m-s-r-o/)
- [ALBION P.M., s.r.o. — Obchodný register (Finstat)](https://finstat.sk/36050814/obchodny_register)
- [Albion Záložňa — polomap.com](https://sk.polomap.com/lu%C4%8Denec/12215)
