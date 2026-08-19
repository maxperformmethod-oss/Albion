# DÁVKA 20 — Vercel, súbory z plochy, zjednodušenie

---

## 1. VERCEL — HLÁŠKA „OVERRIDDEN" JE V PORIADKU

To upozornenie nie je chyba. Vzniká preto, že `vercel.json` v repe prepisuje nastavenia z dashboardu — presne tak, ako sme to chceli, aby sa konfigurácia nedala rozhodiť klikaním.

Hláška hovorí len to, že **súčasné produkčné nasadenie bolo postavené so staršími nastaveniami** než sú tie aktuálne.

**Riešenie:** Vercel → Deployments → posledné produkčné nasadenie → **Redeploy**. Po ňom sa produkcia a nastavenia zrovnajú a upozornenie zmizne.

**Nič v dashboarde neprepisuj ručne.** Zdrojom pravdy zostáva `vercel.json`. Ak by si niečo nastavil klikaním, rozíde sa to s repom a o mesiac nikto nebude vedieť prečo.

---

## 2. SÚBORY Z PLOCHY — VEZMI SI ICH SÁM

Fotka vchodu a video sú na ploche používateľa (`image0` a `Video`). Ja k nim prístup nemám, ty áno.

```powershell
Get-ChildItem "$env:USERPROFILE\Desktop" -Include image0.*,Video.* -Recurse
```

Ak tam nie sú, skús aj `$env:USERPROFILE\OneDrive\Desktop`.

**Fotku** skopíruj do `src/assets/raw/hero-entrance.<prípona>` a spracuj podľa `docs/PROMPT_FINAL19.md` §1 — pripomínam kľúčové odchýlky oproti textúre: `brightness` 0,80–0,88, `saturation` 0,88, vchod v pravej tretine, `alt` sa mení na popisný a `aria-hidden` sa odstraňuje. Kontrast H1 premeraj znova, pri fotke bude treba vyššie krytie masky.

**Video na web nedávaj** — ostáva pre Google profil. Neukladaj ho do repa, len napíš do reportu, aký má formát, dĺžku a veľkosť, nech vieme poradiť pri nahrávaní na profil.

**Pred spracovaním fotky mi ju ukáž** ako náhľad po gradingu, rovnako ako pri mape. Ak by bola nepoužiteľná (rozmazaná, nočná, zle orezaná), povedz to rovno — radšej zostane textúra.

---

## 3. ZJEDNODUŠENIE — MENEJ TEXTU, RÝCHLEJŠIA ORIENTÁCIA

Cieľ: aby človek, ktorý na stránku príde prvýkrát a nechce čítať, mal **do troch sekúnd číslo, adresu a to, čo berieme**.

Nepridávame kvôli tomu novú sekciu. Naopak — hero to unesie samo a text sa skráti.

### 3.1 Hero dostane riadok s hodinami a mapou

Pod tlačidlá `Zavolať` a `Chcem oceniť vec`, nad mikrotext, jeden riadok:

```
Po–Pi 7:00–17:30  ·  Otvorené teraz  ·  Ukázať na mape
```

- hodiny sa berú z `business.openingHours`
- `Otvorené teraz` / `Zatvorené · otvárame v pondelok o 7:00` je ten istý komponent, aký už máš v Kontakte — použi ho, nerob druhý
- `Ukázať na mape` je odkaz na `#kde-nas-najdete`, nie na Google — najprv nech vidí, kde to je
- `--text-small`, `--color-bone-muted`, stav otvorené zvýrazni `--color-gold`
- na mobile sa zalomí na dva riadky, to je v poriadku

Tým má prvá obrazovka **telefón, adresu, hodiny, mapu aj zoznam vecí** — bez jediného scrollu a bez novej sekcie.

### 3.2 Skrátiť hero lead

```
bolo:  Albion v Lučenci. Zlato, šperky, hodinky, elektronika, náradie,
       autá aj atypické veci. Každú vec oceníme individuálne a povieme
       vám to na rovinu.

nové:  Zlato, šperky, elektronika, náradie, autá aj atypické veci.
       Oceníme ich pri vás a sumu povieme na rovinu.
```

„Albion v Lučenci" je zbytočné — je v logu aj v eyebrow. „Hodinky" sú v mriežke nižšie.

### 3.3 Skrátiť sekciu „Zvláštna vec ešte neznamená problém"

Dva odseky spoj do jedného:

```
Reťazce majú cenník a zoznam povolených kategórií. My sa pozeráme na to,
čo vec naozaj je a v akom je stave — preto sa vieme baviť aj o strojoch,
aute alebo o niečom, čo ste zdedili a netušíte, čo s tým.
```

Veta o tom, že rozhoduje človek, ktorý za to zodpovedá, sa vypúšťa — to isté hovorí bod „Za pultom stojíme my" v „Prečo Albion".

### 3.4 Čo sa neskracuje

Podriadky v mriežke, blok „Založiť alebo predať?", veta o zmenárni, veta pri telefóne, odkaz manželov. To sú veci, ktoré zákazník potrebuje alebo ktoré nesú dôveru.

**Cieľ tejto dávky je počet slov dole, nie hore.** Očakávam **−35 až −45 slov** oproti súčasnému stavu. Ak vyjde niečo iné, napíš to.

---

## 4. ZASTARANÝ KOMENTÁR

V `src/data/i18n.ts` uprav komentár, ktorý tvrdí „nikdy vlajky" — je v rozpore s `style: 'flags'` o pár riadkov nižšie. Nahraď ho poznámkou, že vlajky sú vedomé rozhodnutie majiteľa a `style: 'text'` je pripravená alternatíva.

Dobrý postreh, že si to nahlásil a nezmenil bez pýtania.

---

## 5. POSTUP

1. §3 zjednodušenie
2. §4 komentár
3. §2 fotka — náhľad **ukáž pred pushom**
4. `git push`
5. §1 redeploy vo Verceli si spraví Maxim

Report do `docs/REPORT_faza26.md`. Uveď počet slov pred a po a údaje o videu.
