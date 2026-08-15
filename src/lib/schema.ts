import {
  business,
  isConfirmed,
  isLocalSiteUrl,
  TO_CONFIRM,
} from '../data/business.ts';
import type { OpeningInterval, Weekday } from '../data/business.ts';
import { content } from '../data/content.sk.ts';

/**
 * JSON-LD `PawnShop`. BRIEF §12.
 *
 * Kritické pravidlo: pole s hodnotou TO_CONFIRM sa do výstupu nesmie dostať
 * vôbec — ani prázdne, ani vymyslené. Preto sa celý objekt pred serializáciou
 * rekurzívne prečistí.
 *
 * `priceRange` je zámerne vynechané.
 */

const SCHEMA_DAYS: Record<Weekday, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/**
 * Odstráni TO_CONFIRM, undefined, null, prázdne reťazce, prázdne polia
 * a objekty, z ktorých po čistení nezostalo nič okrem `@type`.
 */
export function prune(value: unknown): unknown {
  if (
    value === TO_CONFIRM ||
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const items = value.map(prune).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value)) {
      const cleaned = prune(item);
      if (cleaned !== undefined) result[key] = cleaned;
    }

    const meaningful = Object.keys(result).filter(
      (key) => key !== '@type' && key !== '@context'
    );

    return meaningful.length > 0 ? result : undefined;
  }

  return value;
}

function toOpeningHoursSpecification(intervals: readonly OpeningInterval[]) {
  return intervals.map((interval) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: interval.days.map((day) => SCHEMA_DAYS[day]),
    opens: interval.open,
    closes: interval.close,
  }));
}

export function buildPawnShopSchema(): Record<string, unknown> | undefined {
  // Localhost do JSON-LD nepatrí — radšej pole vynechať než publikovať nezmysel.
  const siteUrl = isLocalSiteUrl ? undefined : business.siteUrl;

  const raw = {
    '@context': 'https://schema.org',
    '@type': 'PawnShop',
    // Musí sedieť s Google Business Profile, inak je NAP nekonzistentné.
    name: business.name,
    legalName: business.legalName,
    description: content.meta.description,
    url: siteUrl,
    image: siteUrl ? new URL('/og.png', siteUrl).href : undefined,
    telephone: business.phone,
    email: business.email,
    // IČO v JSON-LD bez medzier; v pätičke s medzerami.
    identifier: isConfirmed(business.ico)
      ? { '@type': 'PropertyValue', name: 'IČO', value: business.ico }
      : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      postalCode: business.postalCode,
      addressLocality: business.city,
      addressCountry: business.countryCode,
    },
    geo: isConfirmed(business.geo)
      ? {
          '@type': 'GeoCoordinates',
          latitude: business.geo.lat,
          longitude: business.geo.lng,
        }
      : undefined,
    openingHoursSpecification: isConfirmed(business.openingHours)
      ? toOpeningHoursSpecification(business.openingHours)
      : undefined,
    areaServed: {
      '@type': 'City',
      name: 'Lučenec',
    },
  };

  return prune(raw) as Record<string, unknown> | undefined;
}
