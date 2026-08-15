# DÁVKA 17 — mapa: vrátiť značku a určiť koniec trasy podľa lomu 140°

> Krátka, jednoúčelová dávka. Týka sa len mapy.

---

## 1. ČO SA POKAZILO

Posuny na sever z dávok 15 a 16 (spolu 27 m) boli chybné — moje zadanie, nie tvoja chyba. Značka aj s koncom trasy sa presunula mimo miesta, ktoré majiteľ myslel, a zvýraznila sa iná budova. Predchádzajúci stav — ten, kde mala zlatý obrys **budova v tvare L vľavo od trasy** — bol správny.

**Vráť oba posuny.** Značka sa vracia na polohu spred dávky 15.

---

## 2. NOVÉ PRAVIDLO PRE KONIEC TRASY

Doteraz sme hľadali „tretí lom nad 60°". Majiteľ to teraz upresnil presnejšie: **trasa má končiť tam, kde sa láme o približne 140°** — teda v ostrom, takmer vratnom zlome, ktorý je v celej trase výnimočný.

**Postup:**

1. Prejdi všetky vrcholy vypočítanej trasy a pre každý spočítaj zmenu smeru.
2. Vyber vrchol, ktorého zmena smeru je **najbližšie k 140°**, v rozsahu **120–160°**.
3. Ak je takýchto vrcholov viac, zober ten **najbližší k železničnej stanici** — trasa má končiť pri prevádzke, nie za ňou.
4. Trasu **orež** v tomto vrchole. Nič za ním sa nekreslí.
5. Ak žiadny vrchol do rozsahu 120–160° nespadne, **rozšír na 110–170°**. Ak ani tak, nechaj stav po vrátení posunov z §1 a napíš mi to.

Uprednostni toto pravidlo pred pravidlom tretieho lomu. Staré pravidlo z kódu nemaž, len ho odstav — nech sa dá porovnať, ak by to nesedelo.

---

## 3. ZNAČKA A BUDOVA — JEDEN VÝPOČET

Zostáva zásada z dávky 14: **jeden bod, z neho všetko ostatné.**

1. Značka leží v tom istom vrchole, kde končí trasa, posunutá kolmo na cestu o **10 m na tú stranu, kde je budova**.
2. Zvýraznená budova sa hľadá **zo značky**, s polomerom zväčšeným na **40 m** — pri predchádzajúcom dobrom stave bola budova mimo 25 m a preto vypadla.
3. Ak sa nájde viac budov, zober tú s **najväčšou plochou pôdorysu** — L-tvar vľavo je väčší než okolité prístavby a je to ten správny objekt.

`business.geo` v JSON-LD naďalej **nemeň**.

---

## 4. LEKÁREŇ

`Lekáreň Mierová` v OSM polohu má, ale nie je to ani jedna z tých, ktoré som uvádzal, a nevieme, či je to reálne orientačný bod pre zákazníka Albionu.

**Vyhoď ju.** Zostanú štyri popisy okrem Albionu — obe stanice, BILLA a Pizzeria Hacienda. Štyri dobre umiestnené sú lepšie než päť, z ktorých jeden nikto nepozná.

---

## 5. POSTUP

1. Vrátiť posuny z dávok 15 a 16 (§1)
2. Nové pravidlo lomu 140° (§2)
3. Značka a budova z jedného bodu, polomer 40 m (§3)
4. Vyhodiť Lekáreň Mierovú (§4)
5. Náhľad → ukáž → až potom push

Report do `docs/REPORT_faza23.md`. Do reportu napíš **uhly všetkých lomov trasy**, nech vidím, s čím pravidlo pracovalo.
