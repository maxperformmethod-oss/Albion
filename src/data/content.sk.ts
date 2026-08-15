/**
 * Všetky viditeľné texty webu. Schválené znenie z BRIEF.md §7 a §12.
 *
 * Pravidlá:
 * - V šablónach nesmie byť žiadny reťazec natvrdo. Všetko ide odtiaľto.
 * - Texty sa neprepisujú do „marketingovejšej“ podoby. Ak niečo znie zle,
 *   ohlás to v docs/OTAZKY.md, nemeň to potichu.
 * - Údaje o firme (telefón, adresa, hodiny) sem NEPATRIA — tie sú v business.ts.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface Step {
  title: string;
  text: string;
}

export const content = {
  meta: {
    title:
      'Staničná Záložňa Albion Lučenec | Výkup zlata, šperkov a elektroniky',
    description:
      'Rodinná záložňa v Lučenci pri stanici, od roku 2001. Založenie a výkup zlata, šperkov, elektroniky, náradia aj áut. Individuálne ocenenie a osobná dohoda.',
  },

  /**
   * Vzťahová vrstva — potvrdená majiteľmi (dávka 7). Firmu vedú manžel
   * a manželka, nikto ďalší, preto celá hovorí **„my"**, nie „majiteľ"
   * v tretej osobe.
   *
   * Sú to **tri prvky a nič viac**: pás pod hero, dva body v „Prečo Albion"
   * a osobný odkaz. Spolu ~70 slov. Sila je v tom, že to zaznie trikrát
   * a potom už nie — žiadna sekcia o histórii, časová os ani počítadlo rokov.
   *
   * Meno majiteľov sa nezverejňuje: `ownerName` zostáva nepotvrdené a podpis
   * pod odkazom meno neobsahuje.
   */
  trust: {
    /** `{year}` z business.ts. Vykreslí sa len pri oboch potvrdeniach. */
    band: 'Rodinná firma. V Lučenci od roku {year}.',
    /** Bez potvrdenia rodinnej firmy zostane len rok. */
    bandYearOnly: 'V Lučenci od roku {year}.',

    ownerNote: {
      eyebrow: 'Slovo majiteľov',
      /**
       * Znenie schválené majiteľmi. **Neupravuj ho ani o slovo.**
       * Slovenské úvodzovky sú súčasťou textu, nie sadzby.
       */
      quote:
        '„Za tie roky sem prišlo veľa ľudí. Jedni si potrebovali požičať do výplaty, druhí predať niečo, čo doma roky ležalo. Nikdy sme sa nepýtali, na čo to potrebujú. Možno aj preto sa vracajú.“',
      /** Bez mena — majitelia ho zatiaľ zverejniť nechcú. `{year}` z business.ts. */
      signature: 'manželia, ktorí Albion vedú od roku {year}',
    },
  },

  brand: {
    /** Descriptor pod wordmarkom. Vykresľuje sa verzálkami cez CSS. */
    logoDescriptor: 'Staničná záložňa · Lučenec',
  },

  a11y: {
    skipLink: 'Preskočiť na obsah',
    openMenu: 'Otvoriť menu',
    closeMenu: 'Zavrieť menu',
    /**
     * {phone} sa nahradí zobrazovaným tvarom čísla. Použiteľné len tam, kde je
     * viditeľným textom „Zavolať" alebo samotné číslo — prístupný názov musí
     * obsahovať viditeľný text (WCAG 2.5.3 Label in Name).
     */
    callAriaLabel: 'Zavolať na číslo {phone}',
    /** Pre tlačidlá s vlastným znením, napr. „Zavolať a opýtať sa". */
    callAriaLabelWithAction: '{action} — číslo {phone}',
  },

  header: {
    nav: [
      { label: 'Služby', href: '#sluzby' },
      { label: 'Ako to funguje', href: '#ako-to-funguje' },
      { label: 'Prečo Albion', href: '#preco-albion' },
      { label: 'Kontakt', href: '#kontakt' },
    ] as NavItem[],
    call: 'Zavolať',
  },

  hero: {
    /** `{address}` a `{landmark}` sa skladajú z business.ts. */
    eyebrow: '{address} — {landmark}',
    h1: 'Záložňa, kde sa vieme dohodnúť.',
    /**
     * Rovnaká veta rozdelená na riadky kvôli riadkovému revealu.
     * Spojené medzerou sa musia rovnať `h1` — stráži to unit test.
     */
    h1Lines: ['Záložňa, kde sa', 'vieme dohodnúť.'],
    lead: 'Albion v Lučenci. Zlato, šperky, hodinky, elektronika, náradie, autá aj atypické veci. Každú vec oceníme individuálne a povieme vám to na rovinu.',
    ctaPrimary: 'Zavolať',
    ctaSecondary: 'Chcem oceniť vec',
    micro: 'Osobne · Diskrétne · Bez objednania',
    /**
     * Hlavný háčik. Ide naživo — je to **sľub o správaní, nie tvrdenie o trhu**,
     * takže ho nikto nemôže vyvrátiť a nespadá pod nepodložené superlatívy.
     * Nadväzuje na „Záložňa, kde sa vieme dohodnúť“ a uzatvára tú myšlienku.
     */
    hook: 'Ak vám inde dajú viac, povedzte nám to. Vieme sa dohodnúť.',
  },

  /**
   * Tri kratšie háčiky. **Nepublikujú sa, kým ich majiteľ nepotvrdí** —
   * visia na `FEATURES.hooks`. Háčik smie byť odvážny, ale musí byť
   * splniteľný pri pulte; inak stratíme zákazníka natrvalo.
   */
  hooks: {
    valuation: 'Ocenenie na počkanie. Zadarmo a nezáväzne.',
    howItWorks: 'Väčšinu vecí vybavíme, kým na ne čakáte.',
    contact: 'Zavolajte a opýtajte sa. Aj keď si nie ste istí, či to má cenu.',
  },

  whatWeAccept: {
    id: 'sluzby',
    h2: 'Čo u nás môžete založiť alebo predať',
    lead: 'Toto sú veci, s ktorými k nám ľudia chodia najčastejšie. Zoznam nie je uzavretý.',
    items: [
      'Zlato a šperky',
      'Hodinky',
      'Mobily a elektronika',
      'Počítače a notebooky',
      'Náradie a stroje',
      'Autá a vozidlá',
      'Zberateľské a cennejšie predmety',
      'Iné veci s hodnotou',
    ],
    outro: 'Ak tu svoju vec nevidíte, neznamená to nie. Znamená to, že sa na ňu treba pozrieť.',
  },

  valuation: {
    id: 'ocenenie',
    eyebrow: 'Individuálny prístup',
    h2: 'Zvláštna vec ešte neznamená problém.',
    paragraphs: [
      'Reťazce majú cenník a zoznam povolených kategórií. My máme oči a odchodené roky. Pri každej veci sa pozeráme na to, čo naozaj je a v akom je stave — nie na to, či sa zmestí do kolónky.',
      'Preto sa vieme baviť aj o strojoch, o aute, o veciach vyššej hodnoty, aj o niečom, čo ste zdedili a netušíte, čo s tým.',
    ],
    cta: 'Zavolať a opýtať sa',
  },

  howItWorks: {
    id: 'ako-to-funguje',
    h2: 'Ako to funguje',
    steps: [
      {
        title: 'Ozvite sa alebo prídite',
        text: 'Zavolajte nám alebo prídite priamo do predajne. Netreba sa nikde registrovať.',
      },
      {
        title: 'Vec spoločne oceníme',
        text: 'Pozrieme sa na vec osobne, povieme vám, na akú sumu ju vieme oceniť, a vysvetlíme podmienky zrozumiteľne.',
      },
      {
        title: 'Dohodneme sa',
        text: 'Ak vám to sedí, vybavíme to na mieste. Ak nie, poďakujeme sa a rozídeme sa v dobrom.',
      },
    ] as Step[],
  },

  whyAlbion: {
    id: 'preco-albion',
    h2: 'Prečo ľudia chodia práve k nám',
    /**
     * Body 1 a 2 sú vo vzťahovej vrstve — hovoria „my", nie „majiteľ"
     * v tretej osobe. Rok je priamo v texte bodu 2, nie ako podmienená veta
     * navyše; nevkladaj ho druhýkrát.
     */
    items: [
      {
        title: 'Za pultom stojíme my',
        text: 'Nemusíme nikam volať a na nič sa pýtať. Čo si s nami dohodnete, to platí.',
      },
      {
        title: 'Rodinná firma, nie pobočka',
        text: 'Vedieme ju dvaja a je to naša jediná prevádzka. Nie sme článok reťazca, ktorý sa o rok presunie inam. V Lučenci pôsobíme od roku {year}.',
      },
      {
        title: 'Ide to rýchlo',
        text: 'Prídete, pozrieme sa, dohodneme sa. Bez objednávania a bez čakania, kým to niekto niekde schváli.',
      },
      {
        title: 'Diskrétnosť',
        text: 'Čo sa dohodne u nás, ostáva u nás. Nepýtame sa na to, čo sa nás netýka.',
      },
    ],
  },

  location: {
    id: 'kde-nas-najdete',
    h2: 'Nájdete nás pri stanici',
    cta: 'Otvoriť v Google Mapách',
    /**
     * Popisy vo vlastnej orientačnej schéme. Schéma je zjednodušená, ale nesmie
     * klamať o smere — kým nemáme `business.geo` a potvrdenie od majiteľa, drží
     * sa len dvoch istôt: adresa a blízkosť stanice. Žiadne minúty ani metre.
     *
     * Názov ulice sem nepatrí — skladá sa z business.ts cez `{street}`.
     */
    map: {
      station: 'Železničná stanica',
      /** Pre miestneho rovnako silný orientačný bod ako železničná stanica. */
      busStation: 'Autobusová stanica',
      here: 'Albion',
      /** Aby bolo zrejmé, že to nie je navigačná mapa. */
      note: 'Orientačná schéma',
      /** Mierka a severka — drobné, ale hovoria „toto je skutočná mapa". */
      scale: '50 m',
      north: 'S',
      title: 'Schéma okolia prevádzky Albion',
      desc: 'Schéma okolia — prevádzka Albion sa nachádza na ulici {street}, pár krokov od železničnej stanice v Lučenci.',
      walk: 'Pár krokov od železničnej stanice.',
      /** Povinná atribúcia ODbL. Bez nej sa dáta OSM použiť nesmú. */
      attribution: 'Mapové podklady © prispievatelia OpenStreetMap',
      attributionHref: 'https://www.openstreetmap.org/copyright',
    },
  },

  contact: {
    id: 'kontakt',
    /*
      „Ozvite sa“ bol príkaz. Toto je ponuka rozhovoru a nadväzuje na celý
      pozicioning („záložňa, kde sa vieme dohodnúť“). Posledná veta odstraňuje
      jedinú reálnu obavu — že návšteva k niečomu zaväzuje.
    */
    h2: 'Poďme sa o tom porozprávať.',
    lead: 'Zavolajte alebo jednoducho prídite. Vec si pozrieme pri vás a sumu sa dozviete hneď, nie o dva dni.',
    labels: {
      phone: 'Telefón',
      address: 'Adresa',
      hours: 'Otváracie hodiny',
      email: 'E-mail',
    },
    openNow: 'Otvorené teraz',
    closedNow: 'Momentálne zatvorené',
    /** `{time}` = čas, kedy sa po prestávke otvára. */
    onBreak: 'Obedňajšia prestávka · otvárame o {time}',
    /** `{when}` = „dnes“ / „zajtra“ / „v pondelok“. */
    closedUntil: 'Zatvorené · otvárame {when} o {time}',
  },

  stickyBar: {
    maps: 'Mapa',
    /** Lišta je vlastný landmark, inak by jej obsah stál mimo orientačných bodov. */
    ariaLabel: 'Rýchly kontakt',
  },

  footer: {
    quickLinksHeading: 'Rýchle odkazy',
    /** {year} sa nahradí aktuálnym rokom. */
    copyright: '© {year} Albion',
    /** {ico} a {legalName} sa doplnia len ak sú potvrdené. */
    legal: 'Prevádzkovateľ: {legalName} · IČO: {ico}',
  },

  /**
   * Právne stránky.
   *
   * Obe sú **návrh pripravený neprávnikom** — pred spustením ich má prejsť
   * niekto, kto sa tomu venuje. Miesta, ktoré to potrebujú najviac, sú v
   * `sections` označené `review: true` a sú vypísané v `docs/OTAZKY.md`.
   * Marker sa na stránke nevykresľuje; návštevníkovi do právneho textu nič
   * také nepatrí.
   *
   * Zámerne tu NIE JE: zodpovedná osoba (DPO), lehoty uchovávania, právne
   * základy podľa paragrafov, zoznam sprostredkovateľov a cezhraničné prenosy.
   * Nič z toho nevieme a vymýšľať sa to nesmie.
   *
   * `{legalName}`, `{address}`, `{ico}`, `{phone}` a `{email}` sa skladajú
   * z business.ts. Ak údaj nie je potvrdený, príslušný riadok sa nevykreslí.
   */
  legal: {
    /**
     * Dátum účinnosti je konštanta, nie `new Date()` pri buildu. Dátum
     * účinnosti právneho textu sa nesmie meniť pri každom redeployi —
     * **pri zmene textu ho prepíš ručne.**
     */
    effectiveFrom: '2026-08-14',
    effectiveLabel: 'Účinnosť od {date}',
    operatorLabel: 'Prevádzkovateľ',
    /** Riadok v pätičke, ktorý na tieto stránky odkazuje. */
    footerHeading: 'Právne informácie',

    privacy: {
      slug: '/ochrana-osobnych-udajov',
      title: 'Ochrana osobných údajov',
      description:
        'Tento web nezbiera žiadne osobné údaje, nepoužíva cookies ani analytiku. Zásady ochrany osobných údajov záložne Albion v Lučenci.',
      lead: 'Krátke a pravdivé. Tento web nezbiera osobné údaje, takže nie je čo komplikovať.',
      sections: [
        {
          h2: 'Prevádzkovateľ',
          paragraphs: ['{legalName}', '{address}', 'IČO: {ico}', 'Telefón: {phone}'],
        },
        {
          h2: 'Aké údaje spracúvame cez tento web',
          paragraphs: [
            'Tento web nezbiera žiadne osobné údaje. Nepoužíva cookies, analytické nástroje, sledovacie skripty ani kontaktné formuláre. Nevytvárame účty ani nepracujeme s prihlásením.',
          ],
        },
        {
          h2: 'Serverové logy',
          paragraphs: [
            'Naša stránka je hosťovaná u poskytovateľa Vercel Inc. Ten pri doručovaní stránky spracúva technické údaje vrátane IP adresy v rozsahu bežnom pre prevádzku webu. Neposkytujeme mu žiadne ďalšie údaje o vás.',
          ],
        },
        {
          h2: 'Keď nám zavoláte alebo prídete',
          review: true,
          paragraphs: [
            'Ak nás kontaktujete telefonicky alebo prídete do prevádzky, spracúvame údaje v rozsahu, ktorý vyžaduje zákon pre poskytovanie záložných služieb a výkup. Tieto údaje nezbierame cez tento web.',
          ],
        },
        {
          h2: 'Vaše práva',
          review: true,
          paragraphs: [
            'Máte právo na prístup k svojim údajom, na ich opravu, vymazanie, obmedzenie spracúvania, na prenosnosť údajov a právo namietať proti spracúvaniu.',
            'Uplatniť si ich môžete na kontaktoch nižšie. Ak s vybavením nebudete spokojní, môžete podať sťažnosť na Úrad na ochranu osobných údajov Slovenskej republiky.',
          ],
          link: {
            href: 'https://dataprotection.gov.sk',
            text: 'dataprotection.gov.sk',
          },
        },
        {
          h2: 'Kontakt na uplatnenie práv',
          paragraphs: ['{phone}', '{email}'],
        },
      ],
    },

    terms: {
      slug: '/podmienky-pouzivania',
      title: 'Podmienky používania',
      description:
        'Podmienky používania webu záložne Albion v Lučenci. Obsah má informačný charakter, konkrétne podmienky dohodneme osobne.',
      lead: 'Čo tento web je a čo nie je.',
      sections: [
        {
          h2: 'Informačný charakter',
          review: true,
          paragraphs: [
            'Obsah tohto webu má informačný charakter. Nie je návrhom na uzavretie zmluvy ani záväznou ponukou.',
            'Konkrétne podmienky, ceny a lehoty závisia od individuálneho posúdenia veci a dohodneme sa na nich osobne v prevádzke.',
            'Uvedené kategórie vecí sú príklady, nie úplný zoznam.',
          ],
        },
        {
          h2: 'Prevádzkovateľ',
          paragraphs: ['{legalName}', '{address}', 'IČO: {ico}'],
        },
      ],
    },
  },

  notFound: {
    title: 'Stránka sa nenašla',
    text: 'Táto stránka neexistuje alebo sa presunula. Skúste domovskú stránku, alebo nám rovno zavolajte.',
    cta: 'Späť na úvod',
  },

  dev: {
    missingPhoneBadge: 'CHÝBA TELEFÓN',
  },
} as const;
