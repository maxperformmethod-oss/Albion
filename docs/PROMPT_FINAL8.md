# DÁVKA 8 — dobehnúť dávku 5 + uzavretie otázky s ulicou

---

## 1. ÁNO, DOBEHNI CELÚ DÁVKU 5

`docs/PROMPT_FINAL5.md` zapracuj celú, v poradí podľa jej §6:

1. **§5 texty** — prepísané znenia. Body 3 a 4 v „Prečo Albion" už máš, doplň zvyšok: hero mikrotext, záver zoznamu služieb, celá sekcia „Individuálne ocenenie", krok 3 v „Ako to funguje", lead v Kontakte.
   **Pozor:** body 1 a 2 v „Prečo Albion" už platia podľa `PROMPT_FINAL7.md` §4 — tie z dávky 5 sú prekonané, neprepisuj ich späť.
2. **§2 paleta** — teplejšie tokeny + `scripts/check-hero-contrast.mjs`.
3. **§3 svetlé sekcie** — zrno, vinetáž, číslovanie `01`–`08`, veľké čísla krokov, teplé vlasové linky.
4. **§1 mapa** — **preskoč**, mapa je hotová a lepšia, než čo bolo v dávke 5.
5. **§4 zlatý obraz** — stiahni oba varianty, vyber, nasaď do „Individuálne ocenenie". Grading `brightness ~0.78`, nie 0.62.

Po zmene palety over kontrast textu **aj nad zlatým obrazom**, nielen nad hero.

---

## 2. ULICA — MOJA CHYBA, ALE ADRESA PLATÍ

**Priznávam nepresnosť.** V `PROMPT_FINAL5.md` §1 som napísal, že `Kpt. Nálepku` je v OSM vedená ako ~158 m dlhá ulica. To som prevzal z prehľadu vyhľadávača, neoveril priamo v OSM a tvrdil som to príliš isto. Tvoja query je spoľahlivejší dôkaz než môj zdroj — ulica tam pod týmto názvom zjavne nie je.

**Ale samotná adresa je v poriadku.** Overil som znova z iných zdrojov:

- `Kpt. Nálepku` je skutočná ulica v Lučenci, v **predstaničnom priestore**, kde sa križuje s ulicou Železničná. Má číslované budovy — napr. zdravotnícke pracovisko na `kpt. Nálepku 159` je uvádzané ako „oproti železničnej stanici".
- `Ulica mieru` je susedná ulica, na ktorej stojí **autobusová stanica** (Ulica mieru 5705).

Obe ulice teda existujú a v okolí stanice na seba naliehajú. Reverzné geokódovanie vrátilo `Mieru` pravdepodobne preto, že OSM v tom bloku nemá `Kpt. Nálepku` zamapovanú a priradilo najbližšiu pomenovanú cestu.

**Záver: adresu nemeníme.** Je potvrdená majiteľom a zapadá do reality miesta. Chyba je v úplnosti OSM dát, nie v našich údajoch.

**Tvoje rozhodnutie nevypisovať názvy ulíc v mape bolo správne** — nechaj to tak. Radšej mapa bez popisov ulíc než mapa s nesprávnym názvom.

### Jediná vec na dokončenie

Do `docs/OTAZKY.md` pridaj:

> **NAP kontrola pred spustením.** Otvoriť Google profil prevádzky a odpísať adresu **znak po znaku** tak, ako ju tam Google zobrazuje. Ak sa líši od `Kpt. Nálepku 41, 984 01 Lučenec` čo i len skratkou, zjednotiť — na webe má byť presne to, čo je v Google profile. Rovnaký reťazec musí byť v JSON-LD aj vo footeri.

Toto je posledná vec, ktorá môže zraziť lokálne pozície, a vyrieši sa za dve minúty.

---

## 3. POZNÁMKA K MAPE

180 m namiesto 350 m bolo správne rozhodnutie — zmenšiť výrez namiesto kvality je presne to, čo som chcel. A to, že kotva padla dovnútra pôdorysu a budova prevádzky dostala zlatú strechu, je lepší výsledok, než na aký bol predpis.

---

## 4. PORADIE

1. §1 tohto súboru — celá dávka 5 okrem mapy
2. §2 — poznámka do `OTAZKY.md`
3. `git push`

Report do `docs/REPORT_faza14.md`, stručne.

Potom by mala byť stránka obsahovo aj vizuálne hotová. Ďalší krok bude finálny audit — ten si vyžiadam samostatne.
