# REPORT — Dávka 25 (PROMPT_FINAL19 §3, §4.1, §4.2)

§1 (fotka vchodu) a §2 (video) **preskočené** — súbor nedorazil, v kóde sa nič
nemenilo. Spec z §1 zostáva platný, keď fotka príde.

---

## §3 — poznámka pri telefóne

Text (SK): *„Ak nedvíhame, obsluhujeme niekoho pri pulte. Skúste o chvíľu alebo
príďte."* Prel. do HU a EN.

- **Jediné miesto:** `Contact.astro`, priamo pod číslom, `text-small`,
  `text-bone-muted`. Overené: v `dist` je presne **1 výskyt na jazyk**, žiadny
  v hlavičke, sticky bare, pätičke ani na 404.
- **Len počas otváracích hodín.** Viaže sa na `getOpenState()` z `hours.ts` —
  ten istý klientsky skript, ktorý poháňa indikátor. V HTML je prvok `hidden`,
  odkryje ho až JS pri stave `open`. Stav `break` sa neráta ako otvorené.

Overenie logiky (`business.openingHours` = Po–Pi 07:00–17:30):

| Čas | Stav | Poznámka |
|---|---|---|
| streda 10:00 | `open` | viditeľná |
| streda 06:30 | `closed` | skrytá |
| streda 17:29 | `open` | viditeľná |
| streda 17:31 | `closed` | skrytá |
| sobota 10:00 | `closed` | skrytá |

V prehliadači o 21:00 v stredu: indikátor `Zatvorené · otvárame zajtra o 7:00`,
poznámka `hidden` ✅.

## §4.1 — veta o zmenárni

Text (SK): *„Zmenáreň nie sme — peniaze nevymieňame."* Prel. do HU a EN.

Na konci bloku „Založiť alebo predať?", pod oboma možnosťami, `text-small`,
`text-bone-muted`, hneď za existujúcou vetou o tom, ktorá možnosť sa oplatí.
V hero, nadpisoch ani `meta description` **nie je** — overené vizuálne aj
`grep` cez `dist`.

## §4.2 — LAUNCH_CHECKLIST §D

Pridané **D5, D6, D7** do tabuľky sekcie D (kategórie v Google profile,
vygooglenie vlastného názvu, žiadosti o opravu katalógom). Pod tabuľkou je
odsek, prečo sú tieto tri body dôležitejšie než veta na webe.

---

## Čísla

| | |
|---|---|
| Slov v `content.sk.ts` | 989 → **1005** (+16, limit +20) |
| `npm run build` | ✅ 10 stránok |
| `npm run check` | 0 errors, 0 warnings, 2 hints |
| `npm test` | 23/23 |
| Nové reťazce | 2 × 3 jazyky |

**2 hints** sú staršie a nesúvisia s touto dávkou: nepoužité konštanty
`ALLOW_ROOF_ANCHOR` a `MAX_MARKER_SHIFT_M` v `scripts/build-map.mjs` — zvyšok
po zavrhnutom pravidle z dávky 11.

## Neoverené

- Preklady HU a EN sú odo mňa, nie od rodeného hovorcu. Obe nové vety idú do
  korektúry spolu so zvyškom (`docs/OTAZKY.md`).
- Poznámka pri telefóne v reálnom stave `open` overená cez `getOpenState`
  a cez kontrolu naviazania v zbalenom skripte, nie odchytením v prehliadači
  počas otváracích hodín.

## Drobnosť mimo zadania

Komentár na začiatku `src/data/i18n.ts` (riadky 11–13) stále tvrdí *„v prepínači
sú len texty, nikdy vlajky"*, hoci o 30 riadkov nižšie je `style: 'flags'`
podľa rozhodnutia z dávky 14. Je to zastaraný komentár, nie chyba správania —
nechal som ho tak, lebo nepatril do tejto dávky.
