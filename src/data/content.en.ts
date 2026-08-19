/**
 * Anglická verzia. Štruktúra kľúčov musí sedieť s `content.sk.ts`.
 *
 * Tón je rovnaký ako v slovenčine: vecne, bez marketingových fráz a bez
 * superlatívov. Názov prevádzky, obchodné meno a adresa sa neprekladajú —
 * skladajú sa z `business.ts`.
 */

import type { Item, NavItem, Step } from './content.sk.ts';

export const content = {
  meta: {
    title: 'Staničná Záložňa Albion Lučenec | Gold, Jewellery & Electronics',
    description:
      'Family-run pawnshop in Lučenec by the railway station, since 2001. Pawn and purchase of gold, jewellery, electronics, tools and cars. Individual valuation, agreed in person.',
  },

  trust: {
    band: 'A family business in Lučenec since {year}.',
    bandYearOnly: 'In Lučenec since {year}.',

    ownerNote: {
      eyebrow: 'A word from the owners',
      quote:
        '“Over the years a lot of people have come through that door. Some needed to borrow until payday, others sold something that had been sitting at home for years. We never asked what it was for. Maybe that is why they come back.”',
      signature: 'the couple who have run Albion since {year}',
    },
  },

  brand: {
    logoDescriptor: 'Pawnshop by the station · Lučenec',
  },

  a11y: {
    skipLink: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    callAriaLabel: 'Call {phone}',
    callAriaLabelWithAction: '{action} — {phone}',
  },

  header: {
    nav: [
      { label: 'Services', href: '#sluzby' },
      { label: 'How it works', href: '#ako-to-funguje' },
      { label: 'Why Albion', href: '#preco-albion' },
      { label: 'Contact', href: '#kontakt' },
    ] as NavItem[],
    call: 'Call us',
  },

  hero: {
    eyebrow: '{address} — {landmark}',
    h1: 'A pawnshop where we can work something out.',
    h1Lines: ['A pawnshop where we', 'can work something out.'],
    lead: 'Gold, jewellery, electronics, tools, cars and unusual items. We value them in front of you and tell you the figure straight.',
    /** See the note in content.sk.ts. */
    imageAlt: 'Entrance to Staničná Záložňa Albion at {street} in Lučenec',
    ctaPrimary: 'Call us',
    /** Odkaz na vlastnú schému okolia, nie na Google — najprv nech vidí, kde to je. */
    showOnMap: 'Show on the map',
    ctaSecondary: 'Get an item valued',
    micro: 'In person · Discreet · No appointment needed',
    hook: 'If someone offers you more, tell us. We can work something out.',
  },

  hooks: {
    valuation: 'Valued while you wait. Free and with no obligation.',
    howItWorks: 'Most things we settle while you wait.',
    contact: 'Call and ask. Even if you are not sure it is worth anything.',
  },

  whatWeAccept: {
    id: 'sluzby',
    h2: 'What you can pawn or sell with us',
    lead: 'These are the things people bring us most often. The list is not closed.',
    items: [
      { title: 'Gold and jewellery', detail: 'Scrap gold, damaged and unworn jewellery, chains, rings.' },
      { title: 'Watches', detail: 'Branded and older mechanical ones. Non-working too.' },
      { title: 'Phones and electronics', detail: 'Phones, tablets, speakers, headphones, games consoles.' },
      { title: 'Computers and laptops', detail: 'Laptops, monitors, graphics cards.' },
      { title: 'Tools and machinery', detail: 'Cordless tools, grinders, welders, garden machinery.' },
      { title: 'Cars and vehicles', detail: 'Cars, motorcycles, trailers.' },
      { title: 'Collectibles and higher-value items', detail: 'Coins, silver, medals, musical instruments.' },
      { title: 'Other items of value' },
    ] as Item[],
    outro:
      'If you do not see your item here, that is not a no. It just means we need to look at it.',
  },

  pawnOrSell: {
    eyebrow: 'Two options',
    h2: 'Pawn or sell?',
    pawn: {
      title: 'Pawn loan',
      text: 'You get the money straight away and the item stays yours. Return the sum and you take the item back.',
    },
    sell: {
      title: 'Outright purchase',
      text: 'You sell us the item for good.',
      hook: 'An outright purchase usually pays more than a pawn loan.',
    },
    note: 'Which one is better for you, we will tell you with the item in front of us.',
    /** See the note in content.sk.ts. */
    notExchange: 'We are not a currency exchange — we do not exchange money.',
  },

  selling: {
    eyebrow: 'For sale',
    h2: 'We also sell gold and jewellery',
    text: 'Pieces from purchases, so without a jeweller\'s markup. What we have changes with what comes in — it is worth dropping by.',
    cta: 'Call and ask what we have',
  },

  valuation: {
    id: 'ocenenie',
    eyebrow: 'An individual approach',
    h2: 'An unusual item is not a problem.',
    paragraphs: [
      'Chains have a price list and a set of permitted categories. We look at what the item actually is and what condition it is in — which is why we can talk about machinery, a car, or something you inherited and have no idea what to do with.',
    ],
    cta: 'Call and ask',
  },

  howItWorks: {
    id: 'ako-to-funguje',
    h2: 'How it works',
    steps: [
      {
        title: 'Call or come in',
        text: 'Give us a ring or come straight to the shop. There is nothing to register for.',
      },
      {
        title: 'We value it together',
        text: 'We look at the item in person, tell you the amount we can value it at, and explain the terms in plain words.',
      },
      {
        title: 'We agree',
        text: 'If it suits you, we settle it on the spot. If not, we thank you and part on good terms.',
      },
    ] as Step[],
  },

  whyAlbion: {
    id: 'preco-albion',
    h2: 'Why people come to us',
    items: [
      {
        title: 'We are the ones behind the counter',
        text: 'We do not have to call anyone or ask anyone for approval. What you agree with us is what stands.',
      },
      {
        title: 'A family business, not a branch',
        text: 'The two of us run it and this is our only shop. We are not a link in a chain that moves somewhere else in a year. We have been in Lučenec since {year}.',
      },
      {
        title: 'It is quick',
        text: 'You come in, we take a look, we agree. No appointment and no waiting for someone somewhere to approve it.',
      },
      {
        title: 'Discretion',
        text: 'What is agreed here stays here. We do not ask about things that are none of our business.',
      },
    ],
  },

  location: {
    id: 'kde-nas-najdete',
    h2: 'Find us by the station',
    cta: 'Open in Google Maps',
    map: {
      station: 'Railway station',
      busStation: 'Bus station',
      here: 'Albion',
      note: 'Orientation sketch',
      scale: '50 m',
      north: 'N',
      title: 'Sketch of the area around Albion',
      desc: 'Area sketch — Albion is at {street}, a few steps from the railway station in Lučenec.',
      walk: 'A few steps from the railway station.',
      attribution: 'Map data © OpenStreetMap contributors',
      attributionHref: 'https://www.openstreetmap.org/copyright',
    },
  },

  contact: {
    id: 'kontakt',
    h2: 'Let us talk about it.',
    lead: 'Call us or simply come in. We look at the item in front of you and you get the figure straight away, not in two days.',
    labels: {
      phone: 'Phone',
      address: 'Address',
      hours: 'Opening hours',
      email: 'E-mail',
    },
    /** See the note in content.sk.ts. */
    phoneNote:
      'If we do not pick up, we are serving someone at the counter. Try again shortly or come in.',
    openNow: 'Open now',
    closedNow: 'Currently closed',
    onBreak: 'Lunch break · we open at {time}',
    closedUntil: 'Closed · we open {when} at {time}',
  },

  stickyBar: {
    maps: 'Map',
    ariaLabel: 'Quick contact',
  },

  footer: {
    quickLinksHeading: 'Quick links',
    copyright: '© {year} Albion',
    legal: 'Operator: {legalName} · Company ID (IČO): {ico}',
  },

  legal: {
    effectiveFrom: '2026-08-14',
    effectiveLabel: 'In effect from {date}',
    operatorLabel: 'Operator',
    footerHeading: 'Legal',

    privacy: {
      slug: '/en/privacy-policy',
      title: 'Privacy policy',
      description:
        'This website collects no personal data and uses no cookies or analytics. Privacy policy of the Albion pawnshop in Lučenec.',
      lead: 'Short and true. This site collects no personal data, so there is nothing to complicate.',
      sections: [
        {
          h2: 'Operator',
          paragraphs: ['{legalName}', '{address}', 'Company ID: {ico}', 'Phone: {phone}'],
        },
        {
          h2: 'What data we process through this site',
          paragraphs: [
            'This website collects no personal data. It uses no cookies, analytics tools, tracking scripts or contact forms. We create no accounts and there is no sign-in.',
          ],
        },
        {
          h2: 'Server logs',
          paragraphs: [
            'Our site is hosted by Vercel Inc. In delivering the page it processes technical data including your IP address, to the extent usual for running a website. We pass it no further data about you.',
          ],
        },
        {
          h2: 'When you call or come in',
          review: true,
          paragraphs: [
            'If you contact us by phone or come to the shop, we process data to the extent required by law for providing pawnbroking and purchase services. We do not collect that data through this website.',
          ],
        },
        {
          h2: 'Your rights',
          review: true,
          paragraphs: [
            'You have the right to access your data, to have it corrected or erased, to restrict processing, to data portability, and to object to processing.',
            'You can exercise those rights using the contacts below. If you are not satisfied with how we handle it, you can lodge a complaint with the Office for Personal Data Protection of the Slovak Republic.',
          ],
          link: { href: 'https://dataprotection.gov.sk', text: 'dataprotection.gov.sk' },
        },
        {
          h2: 'Contact for exercising your rights',
          paragraphs: ['{phone}', '{email}'],
        },
      ],
    },

    terms: {
      slug: '/en/terms-of-use',
      title: 'Terms of use',
      description:
        'Terms of use for the website of the Albion pawnshop in Lučenec. The content is informational; specific terms are agreed in person.',
      lead: 'What this site is and what it is not.',
      sections: [
        {
          h2: 'Informational nature',
          review: true,
          paragraphs: [
            'The content of this website is informational. It is neither an offer to conclude a contract nor a binding offer.',
            'Specific terms, prices and periods depend on an individual assessment of the item and are agreed in person at the shop.',
            'The categories listed are examples, not a complete list.',
          ],
        },
        {
          h2: 'Operator',
          paragraphs: ['{legalName}', '{address}', 'Company ID: {ico}'],
        },
      ],
    },
  },

  notFound: {
    title: 'Page not found',
    text: 'This page does not exist or has moved. Try the home page, or just give us a call.',
    cta: 'Back to the home page',
  },

  dev: {
    missingPhoneBadge: 'PHONE MISSING',
  },
} as const;
