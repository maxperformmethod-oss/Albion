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
      'Záložňa Albion v Lučenci pri stanici. Založenie a výkup zlata, šperkov, elektroniky, náradia aj áut. Individuálne ocenenie a osobná dohoda.',
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
    lead: 'Albion v Lučenci. Zlato, šperky, hodinky, elektronika, náradie, autá aj netypické veci. Každú vec oceníme individuálne a povieme vám to na rovinu.',
    ctaPrimary: 'Zavolať',
    ctaSecondary: 'Chcem oceniť vec',
    micro: 'Osobne · Diskrétne · Bez čakania na schválenie z centrály',
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
    outro: 'Nenašli ste svoju vec? To ešte nič neznamená — ozvite sa.',
  },

  valuation: {
    id: 'ocenenie',
    eyebrow: 'Individuálny prístup',
    h2: 'Má to hodnotu? Ozvite sa.',
    paragraphs: [
      'Nie sme reťazec s pevným cenníkom a zoznamom povolených kategórií. Pri každej veci sa pozrieme na jej reálnu hodnotu a stav. Vieme sa baviť aj o veciach vyššej hodnoty a o prípadoch, ktoré inde odmietnu na prvý pohľad.',
      'Rozhoduje tu človek, ktorý za to aj zodpovedá. Preto sa vieme dohodnúť rýchlejšie a férovejšie.',
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
        text: 'Ak vám to sedí, vybavíme to na mieste. Ak nie, nič sa nedeje a nič neplatíte.',
      },
    ] as Step[],
  },

  whyAlbion: {
    id: 'preco-albion',
    h2: 'Prečo ľudia chodia práve k nám',
    /**
     * Predsadí sa pred text bodu „Dlhoročná miestna firma“, ale LEN ak je
     * business.foundedYearConfirmed === true. Inak sa nedopĺňa nič.
     */
    foundedSentence: 'V Lučenci pôsobíme od roku {year}.',
    items: [
      {
        title: 'Rozhoduje tu majiteľ',
        text: 'Nečakáte na schválenie z centrály. Dohodu uzatvárate priamo s tým, kto o nej rozhoduje.',
      },
      {
        title: 'Dlhoročná miestna firma',
        text: 'Albion patrí k najdlhšie fungujúcim záložniam v Lučenci. Nie sme pobočka reťazca — sme miestna firma, ktorá tu chce fungovať aj o desať rokov.',
      },
      {
        title: 'Berieme aj netypické veci',
        text: 'Od šperkov po autá a stroje. Ak to má hodnotu, vieme sa o tom baviť.',
      },
      {
        title: 'Diskrétnosť',
        text: 'Čo sa dohodne u nás, ostáva u nás. Bez zbytočných otázok.',
      },
    ],
  },

  location: {
    id: 'kde-nas-najdete',
    h2: 'Nájdete nás pri stanici',
    /** `{address}` sa skladá z business.ts. */
    text: '{address} — pár krokov od železničnej stanice.',
    cta: 'Otvoriť v Google Mapách',
  },

  contact: {
    id: 'kontakt',
    h2: 'Ozvite sa',
    lead: 'Najrýchlejšie to vyriešime telefonicky alebo osobne.',
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

  notFound: {
    title: 'Stránka sa nenašla',
    text: 'Táto stránka neexistuje alebo sa presunula. Skúste domovskú stránku, alebo nám rovno zavolajte.',
    cta: 'Späť na úvod',
  },

  dev: {
    missingPhoneBadge: 'CHÝBA TELEFÓN',
  },
} as const;
