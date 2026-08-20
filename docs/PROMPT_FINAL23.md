# DÁVKA 23 — hero na dva panely, poriadok v priečinku

---

## 1. HERO — FOTKA SA PRESTANE PREKRÝVAŤ TEXTOM

Dvakrát sme skúšali masku a dvakrát to nevyšlo. Príčina nie je v nastavení masky: **vchod je v strede fotky a text je tiež v strede-vľavo.** Kým budú nad sebou, jedno vždy zakryje druhé.

Prestávame to riešiť krytím. **Hero sa rozdelí na dva panely, ktoré sa neprekrývajú.**

### Desktop (≥ 1024 px)

```
┌───────────────────────────┬──────────────────────┐
│                           │                      │
│  eyebrow (adresa)         │                      │
│  H1                       │      FOTKA           │
│  lead                     │      VCHODU          │
│  [Zavolať] [Oceniť vec]   │   celá, nezakrytá    │
│  hodiny · stav · mapa     │                      │
│  háčik                    │                      │
│  mikrotext                │                      │
│                           │                      │
│  podklad: ink-900         │  object-fit: cover   │
└───────────────────────────┴──────────────────────┘
        52 %                        48 %
```

- Panely sa **nikde neprekrývajú.** Žiadna maska nad fotkou, žiadny gradient cez text.
- Na styku panelov jemný prechod do tmavej **len 40 px široký**, aby hrana nebola tvrdá — nie cez celú fotku.
- Fotka `object-position: center` — vchod je v strede, tak nech tam aj zostane.
- Kontrast textu je odteraz triviálny: text je na plnom `ink-900`. `check-hero-contrast.mjs` uprav tak, aby meral text voči podkladu panela, nie voči fotke.

### Mobil (< 1024 px)

Pod seba, **text prvý, fotka pod ním**:

1. textový panel na `ink-900`
2. pod ním fotka na plnú šírku, pomer **4:3**, nezakrytá

Na mobile je fotka pod prvým „záhybom" a to je v poriadku — najprv číslo a adresa, potom obrázok.

### Čo tým získame

- vchod je **konečne vidieť celý** a to je jediný dôvod, prečo tam fotka je
- odpadá celý problém s kontrastom aj s krytím masky
- vyzerá to ako redakčná dvojstrana, nie ako fotka s textom po vrchu

### Čo tým strácame

Celoplošný filmový hero. Beriem to — účel tej fotky je, aby človek spoznal dvere, keď k nim príde. Funkcia je tu dôležitejšia než efekt.

---

## 2. DÁVKA 21 ZJAVNE EŠTE NIE JE VONKU

Na živej stránke je v hero lead stále `Zlato, šperky, elektronika, náradie, autá aj atypické veci`. Autá tam už byť nemajú.

Skontroluj, či je `docs/PROMPT_FINAL21.md` naozaj zapracovaný celý, a ak nie, dokonči ho pred touto dávkou.

---

## 3. VŠETKO V JEDNOM PRIEČINKU + GIT GRAPH

Projekt je v `C:\Dev\albion` a git repo je tam. Že sa Git Graph neotvára, znamená, že VS Code má otvorený **iný priečinok** — pravdepodobne starý `Albion` z plochy, kde `.git` nie je.

Urob tieto kroky a výsledok napíš do reportu:

1. Over, že `C:\Dev\albion\.git` existuje a `git log --oneline -5` v ňom niečo vypíše.
2. Vypíš obsah starého priečinka `Albion` na ploche (`Get-ChildItem -Force`). Chcem vedieť, či v ňom je niečo, čo nemáme v repe — hlavne či tam nie je `.git` s inou históriou.
3. **Ak v ňom nie je nič užitočné**, napíš to a ja ho zmažem. Ty ho nemaž.
4. Vytvor v koreni repa súbor **`albion.code-workspace`**:

```json
{
  "folders": [{ "path": "." }],
  "settings": {
    "files.exclude": { "**/.astro": true, "**/node_modules": true },
    "git.autofetch": true
  },
  "extensions": {
    "recommendations": [
      "astro-build.astro-vscode",
      "mhutchie.git-graph",
      "dbaeumer.vscode-eslint"
    ]
  }
}
```

Odteraz sa projekt otvára dvojklikom na tento súbor a VS Code sa už nemôže chytiť zlého priečinka.

5. Do `README.md` pridaj hneď na začiatok tri riadky:

```
Projekt žije v C:\Dev\albion a nikde inde.
Otvárať cez albion.code-workspace, nie cez File > Open Folder.
Priečinok Albion na ploche je starý a nepoužíva sa.
```

**Pre Maxima:** ak sa Git Graph neobjaví ani po otvorení workspace súboru, znamená to, že rozšírenie nie je nainštalované — v paneli Extensions vyhľadaj `Git Graph` od `mhutchie` a nainštaluj.

---

## 4. POSTUP

1. Dokončiť dávku 21, ak nie je (§2)
2. Hero na dva panely (§1)
3. Poriadok v priečinku a workspace súbor (§3)
4. Náhľad desktop aj mobil — **ukáž mi ho**
5. **Potom pushni** aj s dávkou 22, ktorá čaká

Report do `docs/REPORT_faza29.md`.
