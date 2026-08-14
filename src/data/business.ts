/**
 * Jediný zdroj pravdy o prevádzke.
 *
 * Pravidlo: žiadny údaj o firme sa nikde v kóde nepíše natvrdo. Čo tu nie je,
 * to na web nepatrí. Čo tu je ako TO_CONFIRM a nie je v OPTIONAL_FIELDS,
 * to zastaví produkčný build.
 *
 * Súbor musí zostať bez importov a bez neodstrániteľnej TS syntaxe (enum,
 * namespace, parameter properties) — načítava ho aj `scripts/check-placeholders.mjs`
 * priamo v Node cez natívny type-stripping.
 */

export const TO_CONFIRM = 'TO_CONFIRM';

export type ToConfirm = typeof TO_CONFIRM;

/** Hodnota, ktorú ešte nemáme od klienta. */
export type Confirmable<T> = T | ToConfirm;

export const isConfirmed = <T,>(value: Confirmable<T>): value is T =>
  value !== TO_CONFIRM;

/** 0 = nedeľa … 6 = sobota (rovnako ako `Date.getDay()`). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface OpeningInterval {
  days: Weekday[];
  /** 'HH:MM', lokálny čas Europe/Bratislava */
  open: string;
  /** 'HH:MM', lokálny čas Europe/Bratislava */
  close: string;
}

export interface Business {
  /**
   * Verejné označenie prevádzky. Musí sedieť s Google Business Profile,
   * inak Google vyhodnotí NAP ako nekonzistentné.
   */
  name: string;
  /** Krátky tvar do bežného textu a do wordmarku. */
  shortName: string;
  /** Presný obchodný názov prevádzkovateľa do pätičky a JSON-LD. */
  legalName: Confirmable<string>;
  /** Bez medzier — do JSON-LD. */
  ico: Confirmable<string>;
  /** S medzerami — pre oko v pätičke. */
  icoDisplay: Confirmable<string>;

  /** E.164, do `tel:` odkazu. */
  phone: Confirmable<string>;
  /** Krátky tvar do hlavičky a sticky baru. */
  phoneDisplay: Confirmable<string>;
  /** Medzinárodný tvar do sekcie Kontakt a pätičky. */
  phoneDisplayLong: Confirmable<string>;
  email: Confirmable<string>;

  street: Confirmable<string>;
  city: string;
  postalCode: Confirmable<string>;
  countryCode: string;
  /** Krátky orientačný bod do hero eyebrow. */
  landmark: string;

  geo: Confirmable<{ lat: number; lng: number }>;
  mapsUrl: Confirmable<string>;

  openingHours: Confirmable<OpeningInterval[]>;

  /**
   * Doklady, ktoré si zákazník má priniesť. Poznámka pod krokmi v sekcii
   * „Ako to funguje“ sa vykreslí len ak je toto potvrdené.
   */
  requiredDocuments: Confirmable<string>;

  foundedYear: number;
  /**
   * Zápis do OR je 15. 10. 2001, ale majiteľ rok zatiaľ nepotvrdil. Kým je
   * `false`, veta s rokom sa nikde nevypisuje.
   */
  foundedYearConfirmed: boolean;

  /** Absolútna URL webu. Vždy má hodnotu — pozri `resolveSiteUrl`. */
  siteUrl: string;
}

const runtimeEnv = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env;

const readEnv = (key: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined> | undefined)?.[key] ??
  runtimeEnv?.[key];

/**
 * PUBLIC_SITE_URL → VERCEL_URL → localhost. Doména ešte nie je známa, ale
 * sitemap a absolútne OG URL potrebujú z čoho vychádzať.
 */
function resolveSiteUrl(): string {
  const explicit = readEnv('PUBLIC_SITE_URL');
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = readEnv('VERCEL_URL');
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

  return 'http://localhost:4321';
}

export const business: Business = {
  name: 'Staničná Záložňa Albion',
  shortName: 'Albion',
  legalName: 'ALBION P.M., s.r.o.',
  ico: '36050814',
  icoDisplay: '36 050 814',

  phone: '+421474334444',
  phoneDisplay: '047 433 44 44',
  phoneDisplayLong: '+421 47 433 44 44',
  email: TO_CONFIRM,

  street: 'Kpt. Nálepku 41',
  city: 'Lučenec',
  postalCode: '984 01',
  countryCode: 'SK',
  landmark: 'pri stanici',

  geo: TO_CONFIRM,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Stani%C4%8Dn%C3%A1+Z%C3%A1lo%C5%BE%C5%88a+Albion+Kpt.+N%C3%A1lepku+41+Lu%C4%8Denec',

  // Po–Pi 07:00–17:30. So a Ne zatvorené. Obedňajšia prestávka nie je,
  // ale dátový model aj `hours.ts` ju zvládnu, keby ju majiteľ zaviedol.
  openingHours: [{ days: [1, 2, 3, 4, 5], open: '07:00', close: '17:30' }],

  requiredDocuments: TO_CONFIRM,

  foundedYear: 2001,
  foundedYearConfirmed: false,

  siteUrl: resolveSiteUrl(),
};

/**
 * Polia, ktoré smú zostať `TO_CONFIRM` bez toho, aby zastavili produkčný build.
 * Web bez nich funguje — príslušný prvok sa jednoducho nevykreslí.
 */
export const OPTIONAL_FIELDS = [
  'business.email',
  'business.geo',
  'business.requiredDocuments',
];

/**
 * Prepínače správania, ktoré nie sú odvoditeľné z dát vyššie.
 * Všetko ostatné (napr. či ukázať „Otvorené teraz“) sa rozhoduje podľa toho,
 * či je príslušný údaj potvrdený — nie podľa flagu.
 */
export const FEATURES = {
  /** Sekcia „Vybraný tovar“ — neimplementovaná, BRIEF.md §6. */
  showcaseEnabled: false,
  /** Sticky call bar na mobile (< 768 px). */
  stickyCallBar: true,
  /** Jemné odhalenie sekcií pri scrollovaní. Bez JS je obsah vždy viditeľný. */
  revealOnScroll: true,
  /** Červený DEV badge pri chýbajúcom telefóne. */
  devPlaceholderBadges: true,
} as const;

/** Máme funkčné telefónne CTA? Ak nie, primárne CTA vedie na #kontakt. */
export const hasPhone = isConfirmed(business.phone);

/** `Kpt. Nálepku 41, Lučenec` */
export const addressLine = isConfirmed(business.street)
  ? `${business.street}, ${business.city}`
  : business.city;

/**
 * Ulica bez orientačného čísla — popis pozdĺž ulice v orientačnej schéme.
 * Číslo tam nepatrí, do mapy sa píše názov ulice; celá adresa je pod schémou.
 */
export const streetName = isConfirmed(business.street)
  ? business.street.replace(/\s+\d+(\s*\/\s*\d+)?[a-zA-Z]?$/, '')
  : null;

/** `Kpt. Nálepku 41, 984 01 Lučenec` */
export const addressWithPostalCode =
  isConfirmed(business.street) && isConfirmed(business.postalCode)
    ? `${business.street}, ${business.postalCode} ${business.city}`
    : addressLine;

/** Localhost sa nesmie dostať do JSON-LD ani do OG URL. */
export const isLocalSiteUrl = business.siteUrl.startsWith('http://localhost');
