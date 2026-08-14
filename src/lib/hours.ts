import type { OpeningInterval, Weekday } from '../data/business.ts';

/**
 * „Otvorené teraz“ v pásme Europe/Bratislava, bez knižnice.
 *
 * Počíta sa na klientovi — statický build by stav zamrazil v čase buildu.
 * Ak `openingHours` nie sú potvrdené, indikátor sa nevykreslí vôbec (BRIEF §7).
 */

const WEEKDAYS: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const TIME_ZONE = 'Europe/Bratislava';

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
