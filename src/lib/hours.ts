import type { OpeningInterval, Weekday } from '../data/business.ts';

/**
 * Otváracie hodiny v pásme Europe/Bratislava, bez knižnice.
 *
 * Stav sa počíta na klientovi — statický build by ho zamrazil v čase buildu.
 * Ak `openingHours` nie sú potvrdené, indikátor sa nevykreslí vôbec (BRIEF §7).
 *
 * Letný a zimný čas rieši `Intl.DateTimeFormat` s `timeZone`, nie offset natvrdo.
 */

const TIME_ZONE = 'Europe/Bratislava';

const WEEKDAYS: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Poradie dní tak, ako ich číta človek — pondelkom počnúc. */
const DAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

const DAY_LABELS: Record<Weekday, string> = {
  1: 'Po',
  2: 'Ut',
  3: 'St',
  4: 'Št',
  5: 'Pi',
  6: 'So',
  0: 'Ne',
};

/** Tvar do vety „otvárame …“. */
const DAY_LOCATIVE: Record<Weekday, string> = {
  1: 'v pondelok',
  2: 'v utorok',
  3: 'v stredu',
  4: 'vo štvrtok',
  5: 'v piatok',
  6: 'v sobotu',
  0: 'v nedeľu',
};

/** `[1,2,3,4,5]` → `'Po – Pi'`, `[1,3,5]` → `'Po, St, Pi'`. */
export function formatDays(days: readonly Weekday[]): string {
  const indexes = DAY_ORDER.map((day, index) => (days.includes(day) ? index : -1))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);

  const groups: string[] = [];
  let start = 0;

  for (let i = 0; i < indexes.length; i += 1) {
    const isLast = i === indexes.length - 1;
    const breaksRun = !isLast && indexes[i + 1]! !== indexes[i]! + 1;
    if (!isLast && !breaksRun) continue;

    const from = DAY_LABELS[DAY_ORDER[indexes[start]!]!];
    const to = DAY_LABELS[DAY_ORDER[indexes[i]!]!];

    if (i - start >= 2) groups.push(`${from} – ${to}`);
    else if (i - start === 1) groups.push(`${from}, ${to}`);
    else groups.push(from!);

    start = i + 1;
  }

  return groups.join(', ');
}

/** '07:00' → '7:00' — vo vete pôsobí vedúca nula úradne. */
export function formatTime(time: string): string {
  return time.replace(/^0/, '');
}

/** 'HH:MM' → počet minút od polnoci. */
export function toMinutes(time: string): number {
  const [hours = '0', minutes = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

export interface LocalNow {
  day: Weekday;
  minutes: number;
}

/** Aktuálny deň a čas v Lučenci, nezávisle od pásma prehliadača. */
export function localNow(now: Date = new Date()): LocalNow | null {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const day = WEEKDAYS[read('weekday')];
  if (day === undefined) return null;

  // Niektoré enginy vracajú pri polnoci '24' namiesto '00'.
  const hour = Number(read('hour')) % 24;
  const minute = Number(read('minute'));
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  return { day, minutes: hour * 60 + minute };
}

/**
 * Interval, ktorý prechádza cez polnoc (open > close), sa počíta ako otvorený
 * od `open` do polnoci a od polnoci do `close` nasledujúceho dňa.
 */
export function isOpenNow(
  intervals: readonly OpeningInterval[],
  now: Date = new Date()
): boolean {
  const current = localNow(now);
  if (!current) return false;

  const yesterday = ((current.day + 6) % 7) as Weekday;

  return intervals.some((interval) => {
    const open = toMinutes(interval.open);
    const close = toMinutes(interval.close);

    if (open <= close) {
      return (
        interval.days.includes(current.day) &&
        current.minutes >= open &&
        current.minutes < close
      );
    }

    return (
      (interval.days.includes(current.day) && current.minutes >= open) ||
      (interval.days.includes(yesterday) && current.minutes < close)
    );
  });
}

export type OpenState =
  | { state: 'open' }
  /** Medzi dvoma intervalmi toho istého dňa — typicky obedňajšia prestávka. */
  | { state: 'break'; time: string }
  | { state: 'closed'; when: string; time: string }
  /** Zatvorené a v najbližších 7 dňoch sa neotvára. */
  | { state: 'closed-indefinitely' };

/** Najskorší čas otvorenia v daný deň po zadanej minúte. */
function nextOpeningOn(
  intervals: readonly OpeningInterval[],
  day: Weekday,
  afterMinutes: number
): string | null {
  const candidates = intervals
    .filter((interval) => interval.days.includes(day))
    .map((interval) => interval.open)
    .filter((open) => toMinutes(open) > afterMinutes)
    .sort((a, b) => toMinutes(a) - toMinutes(b));

  return candidates[0] ?? null;
}

/** Skončil dnes už nejaký interval? Odlišuje prestávku od „ešte sme neotvorili“. */
function hasClosedIntervalToday(
  intervals: readonly OpeningInterval[],
  day: Weekday,
  minutes: number
): boolean {
  return intervals.some(
    (interval) =>
      interval.days.includes(day) &&
      toMinutes(interval.open) <= toMinutes(interval.close) &&
      toMinutes(interval.close) <= minutes
  );
}

/**
 * Stav pre indikátor v sekcii Kontakt. Keď je zatvorené, povie aj kedy
 * otvárame — zákazníkovi to ušetrí zbytočný telefonát.
 */
export function getOpenState(
  intervals: readonly OpeningInterval[],
  now: Date = new Date()
): OpenState {
  const current = localNow(now);
  if (!current) return { state: 'closed-indefinitely' };

  if (isOpenNow(intervals, now)) return { state: 'open' };

  const todayNext = nextOpeningOn(intervals, current.day, current.minutes);

  if (todayNext) {
    return hasClosedIntervalToday(intervals, current.day, current.minutes)
      ? { state: 'break', time: formatTime(todayNext) }
      : { state: 'closed', when: 'dnes', time: formatTime(todayNext) };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = ((current.day + offset) % 7) as Weekday;
    const opening = nextOpeningOn(intervals, day, -1);
    if (!opening) continue;

    const when = offset === 1 ? 'zajtra' : DAY_LOCATIVE[day];
    return { state: 'closed', when, time: formatTime(opening) };
  }

  return { state: 'closed-indefinitely' };
}
