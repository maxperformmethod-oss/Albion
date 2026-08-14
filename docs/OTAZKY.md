# OTÁZKY

Otvorené body, ktoré potrebujú tvoje alebo majiteľovo rozhodnutie.
Odpoveď píš rovno pod otázku.

---

## 1. Adresa v texte hero a v sekcii „Kde nás nájdete" — kolízia s `business.ts`

**Stav:** otvorené · blokuje: nič, ale je to riziko

Schválené texty v BRIEF §7 majú adresu **napísanú priamo v reťazci**:

- hero eyebrow: `Kapitána Nálepku 41, Lučenec — pri stanici`
- sekcia 7: `Kapitána Nálepku 41, Lučenec — pár krokov od železničnej stanice.`

Pritom `business.street` je `TO_CONFIRM` a `docs/FIRMA_UDAJE.md` hovorí, že táto
adresa je rozporná s verejnými zdrojmi.

Znamená to, že adresa je na webe na dvoch miestach napevno a placeholder gate ju
nezachytí. Ak sa ukáže, že prevádzka je inde, texty sa musia prepísať ručne.

**Čo navrhujem:** nechať texty presne tak, ako sú (sú schválené), ale hneď ako
príde potvrdená adresa, prepísať ich tak, aby sa skladali z `business.ts`.
Do tej doby to beriem ako známy dlh, nie ako chybu.

**Tvoje rozhodnutie:** ______

---

## 2. Otváracie hodiny — obedňajšia prestávka

**Stav:** otvorené · blokuje: `src/lib/hours.ts` (Fáza 4)

`OpeningInterval` v `business.ts` vie viac intervalov na deň, takže prestávku
zvládne (napr. 9:00–12:00 a 13:00–17:00). Potrebujem len vedieť, či ju majú —
ovplyvní to, či indikátor „Otvorené teraz" musí riešiť aj stav „obedňajšia
prestávka, otvárame o 13:00", alebo stačí otvorené/zatvorené.

**Odpoveď:** ______

---

## 3. Google Maps — odkaz, nie vloženie

Brief §13 zakazuje `<iframe>` mapy. Sekcia „Kde nás nájdete" bude teda
typografický blok s adresou + tlačidlo do Google Máp. Bez obrázka mapy,
bez statického screenshotu (bol by to buď platený Static Maps API request,
alebo porušenie licencie).

Len potvrdzujem, že to takto je zámer a nie opomenutie.

**Súhlas?** ______
