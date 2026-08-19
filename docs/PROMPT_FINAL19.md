# DÁVKA 19 — fotka vchodu, video, telefón, zmenáreň

---

## 0. K POČTU SLOV

+105 namiesto +60 je v poriadku — strop platil pre jeden blok a ten ho dodržal. Ostatné som zadal navyše a nespočítal si to. Chyba je moja, nie tvoja. **Podriadky neskracuj**, konkrétnosť je práve to, čo sme chceli.

---

## 1. FOTKA VCHODU — SPEC JE PRIPRAVENÝ, SÚBOR EŠTE NEDORAZIL

Fotka vchodu do priečinka neprišla, rovnako ani video. Až budú, platí toto.

### Fotka vchodu nahradí abstraktnú textúru v hero

Je to najväčší jednorazový skok kvality, aký nás ešte čaká. Skutočný vchod povie o firme viac než akákoľvek generovaná plocha — a hlavne pomôže človeku, ktorý ju hľadá prvýkrát: uvidí, čo má na ulici hľadať.

Spracovanie cez existujúci `scripts/build-hero.mjs`, ale s inými hodnotami než pri textúre:

- `brightness` **0,80–0,88** (nie 0,62) — fotka nesmie stmavnúť na nečitateľnosť
- `saturation` **0,88** — mierne odsýtiť, aby sadla do palety
- ak je fotka fotená za dňa a je príliš studená, priplus teplotu: `.tint({ r: 255, g: 250, b: 240 })`
- **kompozícia je dôležitejšia než textúra:** vchod má byť v pravej tretine, ľavá polovica zostáva na text. Ak fotka nesedí, orež ju — neposúvaj text.
- maska nad ňou zostáva, ale **prever kontrast H1 znova** cez `check-hero-contrast.mjs`. Cieľ 12:1. Pri fotke bude potrebné vyššie krytie než pri textúre.
- mobilný variant 4:5 vyrež zo stredu na vchod, nie zo širokouhlej kompozície

**`alt` sa mení.** Doteraz bola textúra dekorácia s `alt=""`. Fotka vchodu je informácia:

```
alt="Vchod do Staničnej Záložne Albion na Kpt. Nálepku 41 v Lučenci"
```

a `aria-hidden` sa odstráni.

### Ostatné fotky

Ak s vchodom prídu aj ďalšie zo zoznamu v `LAUNCH_CHECKLIST.md` §C, nasadzuj ich v tomto poradí prínosu:

1. vchod → hero
2. manželia pri pulte → prázdne miesto vedľa ich odkazu
3. detail zlata → nahradí zlatý satén v „Zvláštna vec ešte neznamená problém"
4. pult vnútri → nahradí textúru v „Prečo Albion"

Generované textúry sú náhrada za obdobie, kým fotky nie sú. Každá skutočná fotka jednu z nich vytláča.

---

## 2. VIDEO — NA WEB HO NEDÁVAME, PATRÍ NA GOOGLE PROFIL

Odporúčam nechať ho na Google profile a na web ho nedávať. Dôvody:

1. **Na Google profile má video reálnu hodnotu** — profily s fotkami a videom dostávajú viac zobrazení a interakcií než profily bez nich. A práve Google profil je pre záložňu v Lučenci silnejší kanál než web.
2. **Na webe by stálo výkon.** Aj krátke video je stovky kB až jednotky MB. Práve držíme stránku na ~300 kB a LCP okolo 2 s. Video by to zhodilo a na mobilných dátach je to voči zákazníkovi neslušné.
3. Autoplay video na pozadí sme zakázali hneď na začiatku a stále si za tým stojím — pôsobí ako reklamný web, nie ako usadená firma.

**Ak by si ho na webe chcel aj tak**, jediná prijateľná podoba: krátky nemý klip do 8 sekúnd, **bez autoplay**, spustí sa až na kliknutie, plagát je statická fotka, súbor pod 1,5 MB, `preload="none"`. Nie v hero, ale v sekcii mapy ako doplnok k orientácii. Povedz, ak to chceš, a doplním presnú špecifikáciu.

---

## 3. „AK NEDVÍHAME, OBSLUHUJEME ZÁKAZNÍKA"

Toto je výborný detail. Je konkrétny, ľudský a rieši reálnu frustráciu — človek, ktorému nezdvihnú, si väčšinou myslí, že firma nefunguje.

**Umiestnenie:** v sekcii Kontakt, priamo pod telefónnym číslom, `--text-small`, `--color-bone-muted`.

```
Ak nedvíhame, obsluhujeme niekoho pri pulte. Skúste o chvíľu alebo príďte.
```

Pravidlá:

- **len na jednom mieste.** Nie v hlavičke, nie v sticky bare, nie vo footeri — inak z toho bude ospravedlnenie a nie informácia.
- vykresli sa len počas otváracích hodín (máš `hours.ts`, vieš to). Mimo hodín nedáva zmysel a mätie.
- prelož do HU a EN.

---

## 4. „NIE SME ZMENÁREŇ" — DVE ČASTI

Ľudia si Albion mýlia so zmenárňou. To treba riešiť na webe **aj pri zdroji**, inak to web sám neopraví.

### 4.1 Na webe — jedna vecná veta

Na koniec bloku „Založiť alebo predať?", pod obe možnosti, `--text-small`, `--color-bone-muted`:

```
Zmenáreň nie sme — peniaze nevymieňame.
```

Vecne, bez obhajoby, bez výkričníka. Je to miesto, kde si zákazník ujasňuje, čo firma robí, takže tam veta patrí prirodzene.

**Nepridávaj** ju do hero, nadpisov ani meta description. Negatívne vymedzenie nesmie byť to prvé, čo o firme povieme.

Prelož do HU a EN.

### 4.2 Pri zdroji — do `LAUNCH_CHECKLIST.md`, sekcia D

Pridaj tieto body, sú pre majiteľa:

> **D5 — Skontrolovať kategórie v Google profile.** Google umožňuje hlavnú a vedľajšie kategórie. Ak je medzi vedľajšími niečo ako „Zmenáreň" alebo „Currency exchange service", odstrániť. Hlavná musí zostať „Záložňa / Pawn shop". Toto je najpravdepodobnejší zdroj zámeny a oprava trvá pol minúty.
>
> **D6 — Vygooglovať vlastný názov** („Staničná Záložňa Albion", „Albion Lučenec", „ALBION P.M.") a zapísať si každý katalóg, kde je firma vedená ako zmenáreň. Adresáre, kde sa to objavuje najčastejšie: `lucenec.sk`, `virtualne.sk`, `tatradata.sk`, `azet.sk`, `zoznam.sk`. Väčšina má formulár na nahlásenie chyby alebo kontaktný e-mail.
>
> **D7 — Poslať žiadosť o opravu** každému katalógu zo zoznamu D6. Stačí jedna veta: firma prevádzkuje záložňu, nie zmenáreň, prosíme o preradenie do správnej kategórie.

**Toto je dôležitejšie než veta na webe.** Web navštívi ten, kto vás už našiel — katalógy formujú to, čo si o vás myslí ten, kto vás ešte nepozná.

---

## 5. POSTUP

1. §3 veta k telefónu
2. §4.1 veta o zmenárni
3. §4.2 body D5–D7 do `LAUNCH_CHECKLIST.md`
4. §1 fotka — **až keď súbor dorazí**, dovtedy nič nemeň
5. `git push`

Report do `docs/REPORT_faza25.md`, stručne. Počet slov by mal narásť o menej než 20.
