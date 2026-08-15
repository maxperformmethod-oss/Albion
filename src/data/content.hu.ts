/**
 * Maďarská verzia. Štruktúra kľúčov musí sedieť s `content.sk.ts` — typ je
 * odvodený zo slovenčiny, takže chýbajúci kľúč neprejde cez `astro check`.
 *
 * ⚠ **Preklad nie je od rodeného hovorcu.** Pred spustením ho má prečítať
 * niekto, kto po maďarsky hovorí od detstva — najmä odkaz majiteľov, kde je
 * rozdiel medzi „správne" a „znie to ako od suseda" najväčší.
 * Pozri `docs/OTAZKY.md`.
 *
 * Mesto je v bežnom texte `Losonc`, ale **adresa zostáva v úradnom tvare**
 * `Kpt. Nálepku 41, 984 01 Lučenec` — musí sedieť s Google profilom
 * a s obálkou. Adresa sa preto skladá z `business.ts`, nie odtiaľto.
 */

import type { Item, NavItem, Step } from './content.sk.ts';

export const content = {
  meta: {
    title: 'Staničná Záložňa Albion Losonc | Arany, ékszer és elektronika felvásárlása',
    description:
      'Családi zálogház Losoncon, az állomásnál, 2001 óta. Arany, ékszer, elektronika, szerszám és autó zálogba vétele és felvásárlása. Egyedi értékbecslés, személyes megegyezés.',
  },

  trust: {
    band: 'Családi vállalkozás. Losoncon {year} óta.',
    bandYearOnly: 'Losoncon {year} óta.',

    ownerNote: {
      eyebrow: 'A tulajdonosok szava',
      quote:
        '„Az évek alatt sok ember jött be ide. Egyeseknek fizetésig kellett kölcsön, mások eladtak valamit, ami évek óta otthon hevert. Soha nem kérdeztük, mire kell. Talán ezért is térnek vissza.“',
      signature: 'a házaspár, akik {year} óta viszik az Albiont',
    },
  },

  brand: {
    logoDescriptor: 'Állomási zálogház · Losonc',
  },

  a11y: {
    skipLink: 'Ugrás a tartalomra',
    openMenu: 'Menü megnyitása',
    closeMenu: 'Menü bezárása',
    callAriaLabel: 'Hívás erre a számra: {phone}',
    callAriaLabelWithAction: '{action} — telefonszám: {phone}',
  },

  header: {
    nav: [
      { label: 'Szolgáltatások', href: '#sluzby' },
      { label: 'Hogyan működik', href: '#ako-to-funguje' },
      { label: 'Miért az Albion', href: '#preco-albion' },
      { label: 'Kapcsolat', href: '#kontakt' },
    ] as NavItem[],
    call: 'Hívjon',
  },

  hero: {
    eyebrow: '{address} — {landmark}',
    h1: 'Zálogház, ahol meg tudunk egyezni.',
    h1Lines: ['Zálogház, ahol meg', 'tudunk egyezni.'],
    lead: 'Albion Losoncon. Arany, ékszer, óra, elektronika, szerszám, autó és rendhagyó dolgok. Minden tárgyat egyedileg értékelünk, és őszintén megmondjuk, mennyit ér.',
    ctaPrimary: 'Hívjon',
    ctaSecondary: 'Felbecsültetném',
    micro: 'Személyesen · Diszkréten · Bejelentkezés nélkül',
    hook: 'Ha máshol többet adnak, mondja meg nekünk. Meg tudunk egyezni.',
  },

  hooks: {
    valuation: 'Értékbecslés helyben. Ingyen és kötelezettség nélkül.',
    howItWorks: 'A legtöbb dolgot elintézzük, amíg megvárja.',
    contact: 'Hívjon és kérdezzen. Akkor is, ha nem biztos benne, hogy megéri.',
  },

  whatWeAccept: {
    id: 'sluzby',
    h2: 'Mit zálogosíthat el vagy adhat el nálunk',
    lead: 'Ezekkel a dolgokkal jönnek hozzánk a leggyakrabban. A lista nem zárt.',
    items: [
      { title: 'Arany és ékszer', detail: 'Tört arany, sérült és nem hordott ékszerek, láncok, gyűrűk.' },
      { title: 'Órák', detail: 'Márkás és régebbi mechanikus órák. Nem működő is.' },
      { title: 'Mobil és elektronika', detail: 'Telefonok, tabletek, hangszórók, fejhallgatók, játékkonzolok.' },
      { title: 'Számítógépek és laptopok', detail: 'Laptopok, monitorok, videokártyák.' },
      { title: 'Szerszámok és gépek', detail: 'Akkus szerszám, csiszolók, hegesztők, kerti technika.' },
      { title: 'Autók és járművek', detail: 'Személyautók, motorok, utánfutók.' },
      { title: 'Gyűjtői és értékesebb tárgyak', detail: 'Érmék, ezüst, érdemérmek, hangszerek.' },
      { title: 'Egyéb értékes dolgok' },
    ] as Item[],
    outro:
      'Ha nem látja itt a tárgyát, az nem nemet jelent. Csak azt, hogy meg kell néznünk.',
  },

  pawnOrSell: {
    eyebrow: 'Két lehetőség',
    h2: 'Zálogba adni vagy eladni?',
    pawn: {
      title: 'Zálog',
      text: 'A pénzt rögtön megkapja, a tárgy pedig az öné marad. Ha az összeget visszahozza, a tárgyat visszaviheti.',
    },
    sell: {
      title: 'Felvásárlás',
      text: 'A tárgyat véglegesen eladja nekünk.',
      hook: 'Felvásárlásnál általában többet kap, mint zálognál.',
    },
    note: 'Hogy melyik éri meg jobban, a tárgy fölött megmondjuk.',
  },

  selling: {
    eyebrow: 'Eladás',
    h2: 'Aranyat és ékszert el is adunk',
    text: 'Felvásárlásból származó darabok, ezért ékszerbolti árrés nélkül. A kínálat aszerint változik, mi van éppen nálunk — érdemes benézni.',
    cta: 'Hívjon és kérdezze meg, mink van',
  },

  valuation: {
    id: 'ocenenie',
    eyebrow: 'Egyedi hozzáállás',
    h2: 'A szokatlan tárgy még nem probléma.',
    paragraphs: [
      'A láncoknak árlistájuk és engedélyezett kategóriáik vannak. Nekünk szemünk van és ledolgozott éveink. Minden tárgynál azt nézzük, mi az valójában és milyen állapotban van — nem azt, hogy belefér-e egy rubrikába.',
      'Ezért tudunk beszélni gépekről, autóról, nagyobb értékű dolgokról, és arról is, amit örökölt és fogalma sincs, mit kezdjen vele.',
    ],
    cta: 'Hívjon és kérdezzen',
  },

  howItWorks: {
    id: 'ako-to-funguje',
    h2: 'Hogyan működik',
    steps: [
      {
        title: 'Hívjon vagy jöjjön be',
        text: 'Hívjon minket, vagy jöjjön be egyenesen az üzletbe. Sehol nem kell regisztrálni.',
      },
      {
        title: 'Együtt felbecsüljük',
        text: 'Személyesen megnézzük a tárgyat, megmondjuk, mekkora összegre tudjuk értékelni, és érthetően elmagyarázzuk a feltételeket.',
      },
      {
        title: 'Megegyezünk',
        text: 'Ha megfelel, helyben elintézzük. Ha nem, megköszönjük és jóban válunk el.',
      },
    ] as Step[],
  },

  whyAlbion: {
    id: 'preco-albion',
    h2: 'Miért hozzánk járnak az emberek',
    items: [
      {
        title: 'A pult mögött mi állunk',
        text: 'Nem kell sehová telefonálnunk és senkitől engedélyt kérnünk. Amiben velünk megegyezik, az érvényes.',
      },
      {
        title: 'Családi vállalkozás, nem fiók',
        text: 'Ketten visszük, és ez az egyetlen üzletünk. Nem egy lánc tagjai vagyunk, amely egy év múlva máshová költözik. Losoncon {year} óta működünk.',
      },
      {
        title: 'Gyorsan megy',
        text: 'Bejön, megnézzük, megegyezünk. Bejelentkezés nélkül, és anélkül, hogy várni kellene, míg valaki valahol jóváhagyja.',
      },
      {
        title: 'Diszkréció',
        text: 'Ami nálunk elhangzik, az nálunk marad. Nem kérdezünk olyat, ami nem tartozik ránk.',
      },
    ],
  },

  location: {
    id: 'kde-nas-najdete',
    h2: 'Az állomásnál talál meg minket',
    cta: 'Megnyitás a Google Térképen',
    map: {
      station: 'Vasútállomás',
      busStation: 'Autóbuszállomás',
      here: 'Albion',
      note: 'Tájékoztató vázlat',
      scale: '50 m',
      north: 'É',
      title: 'Az Albion környékének vázlata',
      desc: 'Környékvázlat — az Albion a {street} címen található, pár lépésre a losonci vasútállomástól.',
      walk: 'Pár lépésre a vasútállomástól.',
      attribution: 'Térképadatok © OpenStreetMap közreműködők',
      attributionHref: 'https://www.openstreetmap.org/copyright',
    },
  },

  contact: {
    id: 'kontakt',
    h2: 'Beszéljünk róla.',
    lead: 'Hívjon, vagy egyszerűen jöjjön be. A tárgyat ön előtt nézzük meg, és az összeget rögtön megtudja, nem két nap múlva.',
    labels: {
      phone: 'Telefon',
      address: 'Cím',
      hours: 'Nyitvatartás',
      email: 'E-mail',
    },
    openNow: 'Most nyitva',
    closedNow: 'Jelenleg zárva',
    onBreak: 'Ebédszünet · {time} órakor nyitunk',
    closedUntil: 'Zárva · {when} {time} órakor nyitunk',
  },

  stickyBar: {
    maps: 'Térkép',
    ariaLabel: 'Gyors kapcsolat',
  },

  footer: {
    quickLinksHeading: 'Gyorslinkek',
    copyright: '© {year} Albion',
    legal: 'Üzemeltető: {legalName} · Cégjegyzékszám (IČO): {ico}',
  },

  legal: {
    effectiveFrom: '2026-08-14',
    effectiveLabel: 'Hatályos {date} óta',
    operatorLabel: 'Üzemeltető',
    footerHeading: 'Jogi információk',

    privacy: {
      slug: '/hu/adatvedelem',
      title: 'Adatvédelem',
      description:
        'Ez a weboldal nem gyűjt személyes adatokat, nem használ sütiket és analitikát. A losonci Albion zálogház adatvédelmi tájékoztatója.',
      lead: 'Rövid és igaz. Ez az oldal nem gyűjt személyes adatokat, így nincs mit bonyolítani.',
      sections: [
        {
          h2: 'Üzemeltető',
          paragraphs: ['{legalName}', '{address}', 'IČO: {ico}', 'Telefon: {phone}'],
        },
        {
          h2: 'Milyen adatokat kezelünk ezen az oldalon',
          paragraphs: [
            'Ez a weboldal nem gyűjt személyes adatokat. Nem használ sütiket, analitikai eszközöket, követőszkripteket és kapcsolatfelvételi űrlapokat. Nem hozunk létre fiókokat és nincs bejelentkezés.',
          ],
        },
        {
          h2: 'Szervernaplók',
          paragraphs: [
            'Az oldalunkat a Vercel Inc. szolgáltatja. Az oldal kiszolgálásakor technikai adatokat kezel, köztük az IP-címet, a webes üzemeltetésben szokásos mértékben. Semmilyen további adatot nem adunk át róla.',
          ],
        },
        {
          h2: 'Ha felhív minket vagy bejön',
          review: true,
          paragraphs: [
            'Ha telefonon keres minket vagy bejön az üzletbe, azokat az adatokat kezeljük, amelyeket a zálogszolgáltatásra és felvásárlásra vonatkozó jogszabály előír. Ezeket az adatokat nem ezen a weboldalon gyűjtjük.',
          ],
        },
        {
          h2: 'Az Ön jogai',
          review: true,
          paragraphs: [
            'Joga van hozzáférni az adataihoz, kérni azok helyesbítését, törlését, a kezelés korlátozását, az adathordozhatóságot, és tiltakozhat a kezelés ellen.',
            'Ezeket az alábbi elérhetőségeken érvényesítheti. Ha az ügyintézéssel nem elégedett, panaszt tehet a Szlovák Köztársaság adatvédelmi hivatalánál.',
          ],
          link: { href: 'https://dataprotection.gov.sk', text: 'dataprotection.gov.sk' },
        },
        {
          h2: 'Kapcsolat a jogok érvényesítéséhez',
          paragraphs: ['{phone}', '{email}'],
        },
      ],
    },

    terms: {
      slug: '/hu/felhasznalasi-feltetelek',
      title: 'Felhasználási feltételek',
      description:
        'A losonci Albion zálogház weboldalának felhasználási feltételei. A tartalom tájékoztató jellegű, a konkrét feltételekben személyesen egyezünk meg.',
      lead: 'Mi ez az oldal, és mi nem.',
      sections: [
        {
          h2: 'Tájékoztató jelleg',
          review: true,
          paragraphs: [
            'Ennek a weboldalnak a tartalma tájékoztató jellegű. Nem szerződéses ajánlat és nem kötelező érvényű ajánlat.',
            'A konkrét feltételek, árak és határidők a tárgy egyedi megítélésétől függenek, és személyesen, az üzletben egyezünk meg bennük.',
            'A felsorolt kategóriák példák, nem teljes lista.',
          ],
        },
        {
          h2: 'Üzemeltető',
          paragraphs: ['{legalName}', '{address}', 'IČO: {ico}'],
        },
      ],
    },
  },

  notFound: {
    title: 'Az oldal nem található',
    text: 'Ez az oldal nem létezik, vagy elköltözött. Próbálja a főoldalt, vagy hívjon minket egyenesen.',
    cta: 'Vissza a főoldalra',
  },

  dev: {
    missingPhoneBadge: 'HIÁNYZIK A TELEFONSZÁM',
  },
} as const;
