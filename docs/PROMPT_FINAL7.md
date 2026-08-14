# FINÁLNA DÁVKA 7 — vzťahová vrstva POTVRDENÁ, nasadiť

> Pre Claude Code. Majiteľ potvrdil všetko okrem mena. Toto je hotové znenie, netreba naň už čakať.

---

## 1. POTVRDENÉ

| Otázka | Odpoveď |
|---|---|
| Rodinná firma? | **Áno** — vedú ju manžel a manželka, nikto ďalší |
| Rok 2001? | **Potvrdený** |
| Osobný odkaz? | **Schválený** |
| Meno majiteľa? | **Nie**, zatiaľ nezverejňujeme |

```ts
foundedYear: 2001,
foundedYearConfirmed: true,

export const FEATURES = {
  familyBusiness: true,
  ownerNote: true,
};
```

`ownerName` zostáva `TO_CONFIRM` a **nikde sa nepoužíva** — podpis pod odkazom meno neobsahuje.

---

## 2. HLAS: PRVÁ OSOBA MNOŽNÉHO ČÍSLA

Keďže firmu vedú dvaja ľudia, celá vzťahová vrstva hovorí **„my"** — nie „majiteľ" v tretej osobe. Je to pravdivejšie aj bližšie. Tretiu osobu preto meníme aj tam, kde už je.

---

## 3. PÁS POD HERO

Nový blok, `ink-800`, výška ~72 px, jeden riadok na stred, zlatá vlasová linka nad aj pod. Serif 600, `--text-h3`, `letter-spacing: -0.01em`. Nič iné v ňom nie je.

```
Rodinná firma. V Lučenci od roku 2001.
```

Podmienka vykreslenia: `FEATURES.familyBusiness && business.foundedYearConfirmed`. Obe sú teraz `true`.

---

## 4. „PREČO ĽUDIA CHODIA PRÁVE K NÁM" — BODY 1 A 2

Nahraď znenie z `PROMPT_FINAL5.md`. Body 3 a 4 zostávajú, ako sú.

```
1. Za pultom stojíme my
   Nemusíme nikam volať a na nič sa pýtať. Čo si s nami dohodnete,
   to platí.

2. Rodinná firma, nie pobočka
   Vedieme ju dvaja a je to naša jediná prevádzka. Nie sme článok
   reťazca, ktorý sa o rok presunie inam. V Lučenci pôsobíme od
   roku 2001.
```

Pôvodná podmienená veta `V Lučenci pôsobíme od roku {foundedYear}.` je teraz priamo v texte bodu 2 — nevkladaj ju druhýkrát.

---

## 5. OSOBNÝ ODKAZ — SCHVÁLENÉ ZNENIE

Nový blok medzi „Prečo Albion" a „Kde nás nájdete". Podklad `ink-900`, text v ľavých 62 %, vpravo priestor pre fotku (zatiaľ prázdny, `{/* TODO: photo */}`).

```
eyebrow:  Slovo majiteľov

citát:    „Za tie roky sem prišlo veľa ľudí. Jedni si potrebovali
          požičať do výplaty, druhí predať niečo, čo doma roky
          ležalo. Nikdy sme sa nepýtali, na čo to potrebujú.
          Možno aj preto sa vracajú."

podpis:   manželia, ktorí Albion vedú od roku 2001
```

Sadzba:

- citát serif 600, `--text-h3`, **bez kurzívy**, slovenské úvodzovky „ "
- podpis `--text-small`, `--color-bone-muted`, nad ním zlatá linka 40 px, `margin-top: 1.5rem`
- šírka citátu max **52ch** — kratší riadok než bežný text, aby vyzeral ako výrok, nie ako odstavec
- žiadne veľké dekoratívne úvodzovky ako grafika

**Znenie je schválené majiteľom. Neupravuj ho ani o slovo.**

---

## 6. SEO — VYUŽIŤ „RODINNÁ"

Nová meta description (nahraď súčasnú):

```
Rodinná záložňa v Lučenci pri stanici, od roku 2001. Založenie a výkup
zlata, šperkov, elektroniky, náradia aj áut. Individuálne ocenenie
a osobná dohoda.
```

`<title>` zostáva bez zmeny. Do JSON-LD nič o rodine nepridávaj — `PawnShop` na to nemá pole a vymýšľať vlastné nebudeme.

---

## 7. STROP

Vzťahová vrstva je **týchto päť prvkov a nič viac**: pás pod hero, body 1 a 2 v „Prečo Albion", osobný odkaz, meta description. Spolu ~70 slov.

Nepridávaj sekciu o histórii, časovú os, počítadlo rokov, ani slovo „rodina" do ďalších sekcií. Sila je v tom, že to zaznie trikrát a potom už nie.

Naďalej zakázané: akékoľvek tvrdenie, že Albion bol **prvá** záložňa v Lučenci, a akékoľvek porovnanie s konkurenciou menovite.

---

## 8. PORADIE

1. Flagy a `foundedYearConfirmed` (§1)
2. Pás pod hero (§3)
3. Body 1 a 2 (§4)
4. Osobný odkaz (§5)
5. Meta description (§6)
6. `git push`

Ak si ešte nedokončil mapu z `PROMPT_FINAL6.md` §1, urob ju pred týmto.

Report do `docs/REPORT_faza13.md`, stručne.
