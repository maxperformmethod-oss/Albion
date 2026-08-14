# FINÁLNA DÁVKA 3 — art direction celej stránky

> Pre Claude Code. Pozrel som si nasadenú stránku v prehliadači. Toto je najdôležitejšia dávka — mení dojem z celej stránky.
> Poradie je záväzné: **§1 je chyba, ktorú treba opraviť ako prvú.**

---

## 1. CHYBA: SEKCIE SÚ PRI SCROLLOVANÍ PRÁZDNE

Toto som videl na živej stránke a je to vážnejšie než čokoľvek iné v tomto dokumente.

Pri normálnom scrollovaní vidím **nadpis sekcie a pod ním niekoľko sto pixelov prázdna**. Obsah dobehne až po chvíli. V sekcii „Má to hodnotu? Ozvite sa." bola celá plocha pod nadpisom prázdna. Rovnako v „Čo u nás môžete založiť alebo predať" — nadpis bol, zoznam nie.

Používateľ to nečíta ako animáciu. Číta to ako **rozbitú stránku**. Je to horšie, než keby tam animácia nebola vôbec.

**Príčina** (over, ktorá platí — možno viacero naraz):

- `IntersectionObserver` sa spúšťa až keď je prvok hlboko vo viewporte,
- stagger sa sčítava, takže posledné položky v mriežke idú s veľkým oneskorením,
- prvky, ktoré sú po načítaní už vo viewporte, sa nikdy neohlásia.

**Oprava — urob všetko z tohto:**

1. `rootMargin: "0px 0px -8% 0px"`, `threshold: 0` — prvok sa odhalí, keď sa **objaví**, nie keď je v strede.
2. Skráť trvanie revealu z `420ms` na **`320ms`** a stagger z 60 ms na **max 40 ms**, celkovo **nikdy viac než 240 ms** na celú sekciu (stagger zastropuj — nie `index * 40`, ale `Math.min(index, 6) * 40`).
3. Po `DOMContentLoaded` **okamžite odhaľ všetko, čo je už vo viewporte**, bez animácie.
4. **Poistka:** `setTimeout` na 1200 ms po `load`, ktorý pridá triedu `is-revealed` všetkému, čo ju ešte nemá. Ak sa čokoľvek pokazí, stránka je čitateľná.
5. Over to tak, že rýchlo preskroluješ celú stránku dole a hore — nikde nesmie ostať prázdne miesto.

**Princíp, ktorý si zapíš:** animácia nesmie byť podmienkou čitateľnosti. Obsah je viditeľný, animácia ho len uvádza.

---

## 2. JEMNEJŠIA PALETA

Súčasná paleta je príliš tvrdá — čierna je takmer absolútna a zlato ťahá do horčicovej. Nahraď tokeny týmito. Kontrasty som prepočítal, všetky prechádzajú AA.

```css
@theme {
  /* Dark base — svetlejšie a teplejšie */
  --color-ink-900: #14171B;   /* bolo #0F1113 */
  --color-ink-800: #1B1F23;   /* bolo #171A1D */
  --color-ink-700: #242830;   /* bolo #1F2327 */

  /* Light base — teplejšie, menej biele */
  --color-paper:   #F2EEE6;   /* bolo #F5F2EC */
  --color-paper-2: #E7E1D6;   /* bolo #EBE6DC */

  /* Text */
  --color-bone:       #F2EFE9;
  --color-bone-muted: #B4AFA6;
  --color-ink-text:   #191C20;  /* mäkšia čierna, nie uhlíková */
  --color-ink-muted:  #5A5F65;

  /* Zlato — menej sýte, viac šampanské */
  --color-gold:       #C3A87C;  /* bolo #C6A971 */
  --color-gold-hover: #D6C09B;
  --color-gold-ink:   #7A6438;

  /* Hranice */
  --color-border-interactive-dark:  #6F6B63;
  --color-border-interactive-light: #827D74;
}
```

**Namerané kontrasty:**

| Dvojica | Pomer |
|---|---|
| bone / ink-900 | 15.66 ✅ |
| bone-muted / ink-900 | 8.24 ✅ |
| gold / ink-900 | 7.89 ✅ |
| gold / ink-800 | 7.27 ✅ |
| ink-text / paper | 14.77 ✅ |
| ink-muted / paper | 5.57 ✅ |
| gold-ink / paper | 4.89 ✅ |
| border-int-dark / ink-800 | 3.13 ✅ |
| border-int-light / paper | 3.53 ✅ |
| ink-900 text na zlatom tlačidle | 7.89 ✅ |
| gold / paper | 1.97 ❌ — naďalej zakázané |

Po zmene **premeraj znova kontrast H1 nad hero obrazom** (bol 12,14:1). Ak klesol pod 12:1, priplus krytie v maske.

---

## 3. PRECHODY MEDZI FAREBNÝMI SEKCIAMI

Teraz je medzi tmavou a svetlou sekciou **ostrý rez**. Vyzerá to ako dva zlepené weby.

Vytvor komponent `src/components/ui/SectionBridge.astro` — pás vysoký `clamp(64px, 8vw, 120px)`, ktorý sa vkladá medzi susedné sekcie s rôznym podkladom.

```css
/* tmavá -> svetlá */
.bridge-down {
  background: linear-gradient(to bottom,
    var(--color-ink-900) 0%,
    #4A4640 46%,      /* teplý medzitón, inak vznikne sivý pás */
    #A9A296 72%,
    var(--color-paper) 100%);
}
/* svetlá -> tmavá */
.bridge-up {
  background: linear-gradient(to bottom,
    var(--color-paper) 0%,
    #A9A296 28%,
    #4A4640 54%,
    var(--color-ink-900) 100%);
}
```

Dôležité: **nikdy nemiešaj priamo ink → paper.** Lineárny prechod medzi nimi vytvorí mŕtvy sivý pás. Ten teplý medzitón je dôvod, prečo to bude vyzerať draho.

Pridaj `will-change: auto` a nič neanimuj — most je statický. Text ani obsah doň nepatrí.

---

## 4. OBRAZ NA CELEJ STRÁNKE, NIE LEN V HERO

Máme štyri varianty tej istej textúry. Použijeme tri z nich, ale **len v tmavých sekciách**.

### Pravidlo art direction — drž sa ho

> **Tmavé sekcie = materiál. Svetlé sekcie = jasnosť.**

Tmavé sekcie majú textúru. Svetlé sú čisté, bez obrazu, len typografia a vlasové linky. Ten striedavý rytmus je to, čo spraví stránku exkluzívnou. Keby sme dali obraz všade, vznikne šum a stránka spľasne do priemeru.

### Kde a ako

| Sekcia | Podklad | Obraz | Krytie / spracovanie |
|---|---|---|---|
| Hero | ink-900 | variant 0 (už je) | full-bleed + maska, bez zmeny |
| Individuálne ocenenie | ink-900 | **variant 1** | pravý panel, šírka 42 %, mäkký okraj cez `mask-image: linear-gradient(to left, black 40%, transparent)` |
| Prečo Albion | ink-800 | **variant 2** | full-bleed, `opacity: 0.10`, `filter: grayscale(0.4)` — len tón, nie obrázok |
| Kontakt | ink-900 | **variant 3** | spodná tretina, `mask-image: linear-gradient(to top, black, transparent)`, `opacity: 0.35` |
| Čo prijímame, Ako to funguje | paper | **žiadny** | zámerne |
| Kde nás nájdete | ink-900 | žiadny | tam ide SVG schéma z `PROMPT_FINAL2.md` |

### Stiahnutie zdrojov

```powershell
$b = "https://d8j0ntlcm91z4.cloudfront.net/user_3GopSFcHY8NWG3H4F9dFL9Yn8d6/"
Invoke-WebRequest -OutFile src\assets\raw\tex-1.png "$b`hf_20260814_090038_1168eac7-803e-4911-ac34-d23ffa9607b5.png"
Invoke-WebRequest -OutFile src\assets\raw\tex-2.png "$b`hf_20260814_090258_0985d982-a244-4fbc-948e-31e6802498ad.png"
Invoke-WebRequest -OutFile src\assets\raw\tex-3.png "$b`hf_20260814_090258_0eb76ba1-a032-471d-9dbd-ccfb0ef03c06.png"
```

Rozšír `scripts/build-hero.mjs` na `scripts/build-images.mjs`, ktorý spracuje všetky štyri rovnakým gradingom.

### Rozpočet — nepohyblivý

- Každá dekoratívna textúra **max 45 kB** v AVIF pri 1600 px. Sú tmavé a rozmazané, AVIF ich zvládne veľmi malé.
- Všetky tri majú `loading="lazy"` a `decoding="async"`. **Len hero má `fetchpriority="high"`.**
- Všetky sú `alt=""` + `aria-hidden="true"`.
- Ak by celková váha stránky presiahla **450 kB**, uber krytie a zmenši rozmery — needstraňuj sekcie.

---

## 5. PRÍLIŠ VEĽA PRÁZDNEHO MIESTA

Sekcie sú predimenzované na výšku. Pri prázdnej pravej polovici to nepôsobí vzdušne, ale nedokončene.

1. `--spacing-section`: `clamp(4.5rem, 9vw, 8.5rem)` → **`clamp(3.75rem, 7vw, 6.5rem)`**
2. Sekcia „Čo u nás môžete založiť alebo predať": mriežka nech využije celú šírku kontajnera a položky nech dostanú väčší text (`--text-h3`), nie drobné riadky v štyroch úzkych stĺpcoch.
3. Sekcia „Individuálne ocenenie": text drž v ľavých 58 %, pravých 42 % zaberie obraz z §4. Tým zmizne prázdna pravá polovica.
4. Za poslednou položkou sekcie nenechávaj viac než jeden `--spacing-section`.

---

## 6. STÁLE NEZAPRACOVANÉ Z PREDCHÁDZAJÚCEJ DÁVKY

Na živej stránke som videl `netypické veci` a `Ozvite sa`. `docs/PROMPT_FINAL2.md` teda ešte nie je hotový — dokonči ho: copy (§1), SVG schéma mapy (§2), `PUBLIC_SITE_URL` a meranie LCP (§3).

---

## 7. PORADIE PRÁCE

1. §1 reveal — a hneď over rýchlym preskrolovaním
2. §2 paleta + premeranie kontrastu H1 nad obrazom
3. §3 prechodové pásy
4. §5 hustota
5. §4 obrazy v tmavých sekciách
6. Dokončiť `PROMPT_FINAL2.md`
7. `git push`

Report do `docs/REPORT_faza9_art.md`: nové kontrasty, celková váha stránky v kB, veľkosť JS gzip, LCP na produkcii, a **potvrdenie, že pri rýchlom scrollovaní nikde nezostáva prázdne miesto**.

V chate max 5–10 riadkov.
