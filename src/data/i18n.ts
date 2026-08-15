/**
 * Jazykové verzie.
 *
 * Slovenčina je predvolená a beží bez prefixu (`/`), maďarčina na `/hu/`
 * a angličtina na `/en/`.
 *
 * **Maďarčina nie je ozdoba.** Lučenec leží v regióne so silnou maďarsky
 * hovoriacou komunitou a časť zákazníkov maďarsky reálne hľadá. Angličtina
 * je slabší prípad, ale ide naživo na výslovné rozhodnutie.
 *
 * V prepínači sú **len texty `SK · HU · EN`, nikdy vlajky.** V tomto regióne
 * je vlajka ako symbol jazyka nešťastná — maďarsky hovoriaci zákazník je
 * občan Slovenska a vlajka to vzťahuje k štátu, nie k reči.
 *
 * Čo sa neprekladá: názov prevádzky, obchodné meno, adresa v úradnom tvare,
 * telefón, IČO. Tie sú v `business.ts` a sú pre všetky verzie rovnaké — musia
 * sedieť s Google profilom.
 */

import { content as sk } from './content.sk.ts';
import { content as hu } from './content.hu.ts';
import { content as en } from './content.en.ts';

export type Locale = 'sk' | 'hu' | 'en';

export const DEFAULT_LOCALE: Locale = 'sk';

export const LOCALES = {
  sk: { enabled: true, label: 'Slovensky', short: 'SK', htmlLang: 'sk', ogLocale: 'sk_SK' },
  hu: { enabled: true, label: 'Magyarul', short: 'HU', htmlLang: 'hu', ogLocale: 'hu_HU' },
  en: { enabled: true, label: 'English', short: 'EN', htmlLang: 'en', ogLocale: 'en_GB' },
} as const;

/** Poradie v prepínači. Nemenné — SK je domáci jazyk, potom HU, potom EN. */
export const LOCALE_ORDER: Locale[] = ['sk', 'hu', 'en'];

export const ENABLED_LOCALES = LOCALE_ORDER.filter((code) => LOCALES[code].enabled);

/**
 * Texty sú per jazyk, ale **štruktúra kľúčov je rovnaká** — typ je odvodený
 * zo slovenčiny, takže chýbajúci kľúč v preklade neprejde cez `astro check`.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

/*
  Texty sú `as const`, takže bez rozšírenia by TypeScript porovnával doslovné
  reťazce a maďarský nadpis by nesedel so slovenským. `Widen` nechá štruktúru
  a odstráni doslovnosť — chýbajúci kľúč v preklade tak stále neprejde.
*/
export type Content = Widen<typeof sk>;

const CONTENT: Record<Locale, Content> = { sk, hu, en };

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && value in CONTENT;

/**
 * Texty pre danú verziu. Berie `Astro.currentLocale`, ktoré je `string | undefined` —
 * pri neznámej hodnote radšej slovenčina než prázdna stránka.
 */
export const getContent = (locale?: string): Content =>
  isLocale(locale) ? CONTENT[locale] : CONTENT[DEFAULT_LOCALE];

export const getLocale = (locale?: string): Locale =>
  isLocale(locale) ? locale : DEFAULT_LOCALE;

/**
 * Mapa stránok. Kľúč je logická stránka, hodnota cesta v danom jazyku.
 *
 * Prepnutie jazyka vedie na **tú istú stránku v druhom jazyku**, nie na
 * domovskú — preto tu musia byť všetky cesty pohromade.
 */
export const ROUTES = {
  home: { sk: '/', hu: '/hu', en: '/en' },
  privacy: {
    sk: '/ochrana-osobnych-udajov',
    hu: '/hu/adatvedelem',
    en: '/en/privacy-policy',
  },
  terms: {
    sk: '/podmienky-pouzivania',
    hu: '/hu/felhasznalasi-feltetelek',
    en: '/en/terms-of-use',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Ktorá logická stránka to je? Podľa cesty, nie podľa jazyka. */
export const routeKeyOf = (pathname: string): RouteKey => {
  const path = pathname.replace(/\/$/, '') || '/';
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    if (Object.values(ROUTES[key]).some((route) => route === path)) return key;
  }
  return 'home';
};

/** `hreflang` alternatívy vrátane `x-default`, ktorý ukazuje na slovenčinu. */
export const alternatesFor = (routeKey: RouteKey) => [
  ...ENABLED_LOCALES.map((code) => ({
    hreflang: LOCALES[code].htmlLang,
    path: ROUTES[routeKey][code],
  })),
  { hreflang: 'x-default', path: ROUTES[routeKey][DEFAULT_LOCALE] },
];
