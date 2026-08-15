# DÁVKA 14 — mapa: budova a popisy, prepínač jazykov, živšie svetlé sekcie

---

## 1. POLOHA JE VYRIEŠENÁ — ZLATÁ STRECHA JE NA ZLEJ BUDOVE

Dobrá správa: majiteľ na náhľade ukázal na **bod, ktorý si vypočítal pravidlom tretieho lomu**. Poloha teda sedí a viac ju neposúvame. Otázku na súradnicu vchodu v `OTAZKY.md` môžeš zavrieť.

Nesedí len zvýraznenie budovy:

- zlatý obrys má teraz budova **vľavo**, mimo značky
- značka s popisom `Albion` je **vpravo**, kde trasa končí

**Oprava:**

1. Zlaté zvýraznenie (strecha, rim light, žiara) **odober** budove vľavo.
2. **Prideľ ho budove, v ktorej leží značka.** Ak značka nepadne priamo do žiadneho pôdorysu, zober najbližší do 25 m.
3. Zviaž to natrvalo: zvýraznená budova sa **vždy** určuje zo značky, nikdy samostatným hľadaním. Ak by značka nemala budovu, nezvýrazňuj nič — samotný bod stačí.

Tá nezhoda vznikla preto, že sa budova hľadala nezávisle od bodu. Sú to dva výpočty tam, kde má byť jeden.

To, že si pri rozpore dvoch popisov majiteľa išiel podľa toho, ktorý sa dá vypočítať, bolo správne rozhodnutie.

---

## 2. POPISY BUDOV V MAPE

Doplň názvy, ale **len z OSM `name` tagov**, ktoré už v dátach máš. Nie z Google — to, čo si prečítam na cudzej mape, nie je overený údaj a nemá sa čo objaviť v našej.

**Pravidlá:**

- Popíš len **orientačné body**, teda objekty s tagmi `railway=station`, `amenity=bus_station`, `shop=supermarket`, `amenity=hospital|school|pharmacy`, `place_of_worship`.
- **Maximálne štyri popisy okrem Albionu.** Viac je zoznam firiem, nie orientácia.
- Ak je v okolí supermarket (v Lučenci pri autobusovej stanici je), je to najsilnejší orientačný bod po staniciach — ten tam patrí.
- Popisy prevádzok typu pizzeria, taxi, lekáreň, obchod s náradím **nepridávaj**. Zaplnia mapu a zoberú pozornosť Albionu.
- **Konkurenciu nepopisuj nikdy**, ani keby v dátach bola.

**Sadzba:**

- `Albion` zostáva najväčší, serif 600, `--color-bone`
- ostatné popisy o dva stupne menšie, sans, `--color-bone-muted`
- halo pod všetkými (`paint-order: stroke`), ako doteraz
- ak by sa dva popisy prekrývali, vynechaj ten menej dôležitý — neposúvaj ich do nezmyselných pozícií

Ak objekt v OSM `name` nemá, **nevymýšľaj ho**. Radšej menej popisov.

---

## 3. PREPÍNAČ JAZYKOV

Tvar zo screenshotu je dobrý — prevezmi ho:

- neaktívny jazyk: samotný text, `--color-bone-muted`, bez pozadia
- aktívny jazyk: **tmavá pilulka** `--color-ink-700`, `border-radius: 6px`, text `--color-bone`
- výška 28 px, vnútorné odsadenie 10 px, medzera medzi položkami 4 px
- hover na neaktívnom: text prejde na `--color-gold`
- tap target aj tak minimálne 48×48 px cez neviditeľné odsadenie

### Vlajky

Chceš vlajky, tak ich urobíme — s jednou poznámkou, ktorú poviem raz a potom to nechám na tebe.

Vlajka označuje štát, nie jazyk. Maďarsky hovoriaci zákazník v Lučenci je občan Slovenska a maďarská vlajka to v tomto regióne vzťahuje k inému štátu — časť ľudí to môže vnímať citlivo, a to v oboch smeroch. Preto som pôvodne odporúčal len text. **Ty poznáš Lučenec lepšie než ja, takže rozhodnutie rešpektujem.**

Implementácia nech je prepínateľná jedným riadkom, aby sa to dalo kedykoľvek zmeniť bez zásahu do komponentov:

```ts
export const LOCALE_SWITCHER = {
  style: "flags",   // "flags" | "text"
};
```

Pri `flags`:

- vlajky ako **inline SVG**, nie emoji — emoji vlajky sa na Windowse nevykresľujú a zobrazí sa `SK` v obdĺžniku
- rozmer 18×12 px, `border-radius: 2px`, 1px hranica `rgba(255,255,255,.15)` aby svetlé vlajky nesplynuli s pozadím
- vedľa vlajky **zostáva kód jazyka** (`SK`, `HU`, `EN`) — samotná vlajka nie je prístupná pre čítačku ani jednoznačná
- `aria-label` vždy plný názov jazyka: `Slovensky`, `Magyarul`, `English`
- vlajka je `aria-hidden="true"`, nesie ju text

EN použi vlajku Spojeného kráľovstva.

---

## 4. SVETLÉ SEKCIE — VIAC ŽIVOTA PRI SCROLLOVANÍ

Svetlé plochy sú stále staticky ploché. Štyri zásahy, každý lacný:

### 4.1 Striedaj základný odtieň

Dve svetlé sekcie za sebou nesmú mať rovnaký podklad. Prvá `--color-paper`, druhá `--color-paper-2`, tretia zase `--color-paper`. Rozdiel je malý, ale scroll prestane pôsobiť ako jedna dlhá plocha.

### 4.2 Zlatý nábeh sa hýbe so scrollom

Zlatá vrstva v pravom hornom rohu dostane pohyb naviazaný na scroll v rámci sekcie:

- posun **výhradne `translate3d`**, rozsah max **40 px** zvisle po celej výške sekcie
- počítaj cez `IntersectionObserver` + `requestAnimationFrame`, nie cez `scroll` listener bez škrtenia
- na mobile rozsah zníž na 20 px
- `prefers-reduced-motion` → bez pohybu

Nie je to parallax obsahu, len veľmi pomalý posun svetla. Oko to nezachytí vedome, ale plocha prestane byť mŕtva.

### 4.3 Veľké duchové slovo v pozadí

Do každej svetlej sekcie jedno slovo v pozadí, serif 600, obrovské (`clamp(8rem, 22vw, 18rem)`), farba `--color-ink-text` pri `opacity: 0.035`, orezané okrajom sekcie.

- „Čo u nás môžete založiť alebo predať" → **ZLATO**
- „Ako to funguje" → **DOHODA**

`aria-hidden="true"`, `user-select: none`, nesmie nikde znížiť kontrast textu pod 12:1 — over meraním, ako pri zlatej vrstve.

### 4.4 Hairline mriežka, ktorá sa dokreslí

Vlasové linky nad položkami v mriežke nech sa pri vstupe sekcie **nakreslia zľava doprava** (`scaleX`), stagger 40 ms. Máš to už na predeloch sekcií, len to použi aj tu.

---

## 5. PORADIE

1. §1 budova pod značkou (rýchle, hneď vidno)
2. §3 prepínač jazykov
3. §4 svetlé sekcie
4. §2 popisy v mape
5. `git push`

Report do `docs/REPORT_faza20.md` + náhľad mapy a jednej svetlej sekcie.
