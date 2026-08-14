import { business, isConfirmed } from '../data/business.ts';
import { content } from '../data/content.ts';

/**
 * Jediné miesto, kde sa rozhoduje, ako vyzerá primárne CTA.
 *
 * BRIEF §8: ak telefón chýba, primárne CTA sa NESKRÝVA — zmení sa na
 * „Chcem oceniť vec“ s kotvou na #kontakt. Web nikdy neostane bez primárnej akcie.
 */

/** Krátky tvar — hlavička, sticky bar, aria-label. */
export const phoneDisplay = isConfirmed(business.phoneDisplay)
  ? business.phoneDisplay
  : null;

/** Medzinárodný tvar — sekcia Kontakt a pätička. */
export const phoneDisplayLong = isConfirmed(business.phoneDisplayLong)
  ? business.phoneDisplayLong
  : phoneDisplay;

export const phoneHref = isConfirmed(business.phone)
  ? `tel:${business.phone}`
  : null;

export const hasPhone = phoneHref !== null;

export const callAriaLabel = phoneDisplay
  ? content.a11y.callAriaLabel.replace('{phone}', phoneDisplay)
  : undefined;

export interface Cta {
  href: string;
  text: string;
  icon?: 'phone';
  label?: string;
}

/** Primárne CTA v hlavičke, hero, sekcii ocenenia, kontakte a sticky bare. */
export const primaryCta: Cta = phoneHref
  ? {
      href: phoneHref,
      text: content.header.call,
      icon: 'phone',
      label: callAriaLabel,
    }
  : { href: '#kontakt', text: content.hero.ctaSecondary };

/** Terciárne CTA — mapa. Ak URL nie je potvrdená, odkaz sa nevykreslí vôbec. */
export const mapsUrl = isConfirmed(business.mapsUrl) ? business.mapsUrl : null;
