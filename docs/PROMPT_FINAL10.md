# DÁVKA 10 — poloha bodu, autobusová stanica, trasa

> Pre Claude Code. Pozrel som si Google profil prevádzky priamo v prehliadači.

---

## 1. NAP KONTROLA — HOTOVÁ, VŠETKO SEDÍ

Odpísané z Google profilu prevádzky:

| Údaj | Google profil | Náš web | |
|---|---|---|---|
| Názov | Staničná Záložňa Albion | rovnako | ✅ |
| Adresa | `Kpt. Nálepku 41, 984 01 Lučenec` | rovnako | ✅ |
| Telefón | `047 433 44 44` | rovnako | ✅ |
| Hodiny | „Closed · Opens 7 am Mon" | Po–Pi 07:00–17:30 | ✅ |
| Kategória | Pawn shop | JSON-LD `PawnShop` | ✅ |

Adresa sa zhoduje **znak po znaku**. Otázku NAP z `PROMPT_FINAL8.md` §2 môžeš v `OTAZKY.md` uzavrieť.

Plus Code prevádzky: `8MM9+W2 Lučenec` — poznač do `docs/FIRMA_UDAJE.md` ako doplnkový identifikátor.

---

## 2. BOD ALBIONU JE ZLE UMIESTNENÝ

Majiteľ hovorí: **prevádzka je priamo pri ceste, oproti stanici.** Na našej schéme bod sedí vnútri bloku, ďaleko od cesty. Google značka ukazuje na ťažisko parcely, nie na vchod — preto ten posun.

**Oprava — deterministické pravidlo, nie odhad:**

1. Nájdi v stiahnutých OSM dátach cestu, ktorá vedie pozdĺž východnej strany bloku smerom k stanici (v Google je pomenovaná `Kpt. Nálepku`; ak v OSM názov nemá, ber najbližšiu cestu triedy `highway` medzi prevádzkou a stanicou).
2. Z potvrdených súradníc `48.334768, 19.667564` sprav **kolmý priemet na túto cestu** — nájdi najbližší bod na jej geometrii.
3. Bod Albionu umiestni **8 m od cesty na stranu budovy** (teda medzi cestu a pôvodné súradnice).
4. Zlatá strecha zostáva na tej istej budove ako doteraz, ak priemet padne do jej pôdorysu alebo na jeho hranu. Ak padne mimo, zlatú strechu daj budove, ktorá je priemetu najbližšia.

Výsledok: bod stojí pri ceste oproti stanici, presne ako to popisuje majiteľ, a stále vychádza z potvrdených súradníc — nič si nevymýšľaš.

**`business.geo` v JSON-LD nemeň.** Tam patria pôvodné potvrdené súradnice z Google profilu. Posun je len vizuálny, kvôli čitateľnosti schémy.

---

## 3. TRASA MUSÍ VIESŤ PO CESTE

Teraz je trasa rovná prerušovaná čiara, ktorá pretína bloky budov. Vyzerá to ako letecká vzdialenosť, nie ako cesta pešo.

Veď ju **po geometrii ulice**: od uzla stanice po ceste ku Kpt. Nálepku a po nej k bodu Albionu. Použi skutočné lomové body z OSM, nezaobľuj ich umelo.

Ak by trasa po ceste vyšla neprehľadne, radšej ju **vynechaj úplne** a nechaj len oba body — rovná čiara cez domy je horšia než žiadna.

---

## 4. PRIDAŤ AUTOBUSOVÚ STANICU

V okolí je aj autobusová stanica (v Google `Autobusová stanica Lučenec`, juhovýchodne od prevádzky, pri obchode BILLA, adresa `Ulica mieru 5705`). Pre miestneho je to rovnako silný orientačný bod ako železničná stanica.

Overpass — pridaj do existujúcej query:

```overpassql
(
  node(area.a)["amenity"="bus_station"];
  way(area.a)["amenity"="bus_station"];
  nwr(area.a)["name"~"Autobusová stanica"];
);
out geom;
```

Vykreslenie:

- rovnaký štýl popisu ako `Železničná stanica`, farba `--color-bone-muted`
- popis `Autobusová stanica`
- ak má budova v OSM pôdorys, extruduj ju o stupeň vyššie ako okolité domy (ako pri železničnej stanici)
- **žiadna druhá trasa** — trasa vedie len od železničnej stanice. Dve trasy schému zahltia.

Ak by sa autobusová stanica nezmestila do výrezu 180 m, **rozšír výrez len toľko, aby sa zmestila** (odhadom ~240 m). Rozpočet SVG posúvam na **75 kB** — mapa je nosný prvok sekcie a stojí to za to. Ak by presiahla, zjednoduš polygóny, nie výrez.

---

## 5. DVE VECI MIMO KÓDU — POVEDZ ICH MAXIMOVI

Zapíš do `docs/OTAZKY.md`:

1. **Google profil nemá odkaz na web.** V karte je tlačidlo „Add website" — treba tam doplniť produkčnú adresu. Je to jeden z najsilnejších lokálnych signálov a trvá to minútu.
2. **Profil má 3,0 hviezdy z 2 hodnotení.** Dve recenzie sú štatisticky nič a trojka pri takom počte odrádza viac než žiadne hodnotenie. Niekoľko skutočných recenzií od spokojných zákazníkov spraví pre lokálne pozície viac než čokoľvek, čo ešte urobíme na webe. Odporúčam poprosiť pravidelných zákazníkov — nie kupovať, nie vymýšľať.

---

## 6. PORADIE

1. §2 poloha bodu
2. §3 trasa po ceste
3. §4 autobusová stanica
4. §1 a §5 zápisy do `OTAZKY.md` a `FIRMA_UDAJE.md`
5. `git push`

Report do `docs/REPORT_faza16.md`, stručne. Prilož náhľad mapy ako doteraz.
