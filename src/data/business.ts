/**
 * Jediný zdroj pravdy o prevádzke.
 *
 * Pravidlo: žiadny údaj o firme sa nikde v kóde nepíše natvrdo. Čo tu nie je,
 * to na web nepatrí. Čo tu je ako TO_CONFIRM, to zatiaľ nepoznáme — build
 * v produkčnom režime zámerne neprejde, kým sa to nedoplní.
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
  /** Obchodná značka tak, ako ju používame v textoch. */
  name: string;
  /** Presný obchodný názov prevádzkovateľa do pätičky a právneho riadku. */
  legalName: Confirmable<string>;
  ico: Confirmable<string>;

  /** E.164, do `tel:` odkazu. */
  phone: Confirmable<string>;
  /** Formát pre oko, napr. '0905 123 456'. */
  phoneDisplay: Confirmable<string>;
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

  foundedYear: number;
  /**
   * Rok 2001 zatiaľ nie je potvrdený. Kým je `false`, veta s rokom sa nikde
   * nevypisuje — sekcia „Prečo Albion“ stojí aj bez nej. Pozri PLAN.md §2/Fáza 4.
   */
  foundedYearConfirmed: boolean;

  /** Absolútna URL webu. Bez nej nie je canonical, OG ani sitemap. */
  siteUrl: Confirmable<string>;
}

const runtimeEnv = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env;

const siteUrlFromEnv =
  import.meta.env?.PUBLIC_SITE_URL ?? runtimeEnv?.PUBLIC_SITE_URL;

export const business: Business = {
  name: 'Albion',
  legalName: TO_CONFIRM,
  ico: TO_CONFIRM,

  phone: TO_CONFIRM,
  phoneDisplay: TO_CONFIRM,
  email: TO_CONFIRM,

  street: TO_CONFIRM,
  city: 'Lučenec',
  postalCode: TO_CONFIRM,
  countryCode: 'SK',
  landmark: 'pri stanici',

  geo: TO_CONFIRM,
  mapsUrl: TO_CONFIRM,

  openingHours: TO_CONFIRM,

  foundedYear: 2001,
  foundedYearConfirmed: false,

  siteUrl: siteUrlFromEnv ?? TO_CONFIRM,
};

/**
 * Prepínače správania, ktoré nie sú odvoditeľné z dát vyššie.
 * Všetko ostatné (napr. či ukázať „Otvorené teraz“) sa rozhoduje podľa toho,
 * či je príslušný údaj potvrdený — nie podľa flagu.
 */
export const FEATURES = {
  /** Sticky call bar na mobile (< 768 px). */
  stickyCallBar: true,
  /** Jemné odhalenie sekcií pri scrollovaní. Bez JS je obsah vždy viditeľný. */
  revealOnScroll: true,
  /** Červený DEV badge pri chýbajúcom telefóne. */
  devPlaceholderBadges: true,
} as const;

/** Máme funkčné telefónne CTA? Ak nie, primárne CTA vedie na #kontakt. */
export const hasPhone = isConfirmed(business.phone);
