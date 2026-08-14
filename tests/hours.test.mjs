import { test } from 'node:test';
import assert from 'node:assert/strict';

import { formatDays, getOpenState, isOpenNow } from '../src/lib/hours.ts';

// Po–Pi 07:00–17:30, víkend zatvorené — reálne hodiny prevádzky.
const WORKWEEK = [{ days: [1, 2, 3, 4, 5], open: '07:00', close: '17:30' }];

// 2026 je v auguste letný čas, Europe/Bratislava = UTC+2.
const at = (iso) => new Date(iso);

test('formatDays zlúči súvislé dni', () => {
  assert.equal(formatDays([1, 2, 3, 4, 5]), 'Po – Pi');
  assert.equal(formatDays([1, 3, 5]), 'Po, St, Pi');
  assert.equal(formatDays([6, 0]), 'So, Ne');
  assert.equal(formatDays([1]), 'Po');
});

test('isOpenNow rešpektuje pásmo Europe/Bratislava, nie pásmo stroja', () => {
  // pondelok 10:00 v Lučenci
  assert.equal(isOpenNow(WORKWEEK, at('2026-08-17T08:00:00Z')), true);
  // pondelok 06:00 v Lučenci
  assert.equal(isOpenNow(WORKWEEK, at('2026-08-17T04:00:00Z')), false);
  // pondelok 17:30 presne — zatvárací čas už otvorený nie je
  assert.equal(isOpenNow(WORKWEEK, at('2026-08-17T15:30:00Z')), false);
});

test('pred otvorením hlási, že otvárame dnes', () => {
  const state = getOpenState(WORKWEEK, at('2026-08-17T04:00:00Z'));
  assert.deepEqual(state, { state: 'closed', when: 'dnes', time: '7:00' });
});

test('po zatvorení v pracovný deň hlási zajtra', () => {
  const state = getOpenState(WORKWEEK, at('2026-08-17T16:00:00Z'));
  assert.deepEqual(state, { state: 'closed', when: 'zajtra', time: '7:00' });
});

test('v sobotu hlási najbližší pracovný deň menom', () => {
  // sobota 15. 8. 2026, 12:00 v Lučenci
  const state = getOpenState(WORKWEEK, at('2026-08-15T10:00:00Z'));
  assert.deepEqual(state, { state: 'closed', when: 'v pondelok', time: '7:00' });
});

test('otvorené je otvorené', () => {
  assert.deepEqual(getOpenState(WORKWEEK, at('2026-08-17T08:00:00Z')), {
    state: 'open',
  });
});

test('obedňajšia prestávka sa odlíši od zatvorenia', () => {
  const withBreak = [
    { days: [1], open: '07:00', close: '12:00' },
    { days: [1], open: '13:00', close: '17:00' },
  ];

  // pondelok 12:30 — medzi intervalmi
  assert.deepEqual(getOpenState(withBreak, at('2026-08-17T10:30:00Z')), {
    state: 'break',
    time: '13:00',
  });

  // pondelok 06:00 — ešte sme neotvorili, to nie je prestávka
  assert.deepEqual(getOpenState(withBreak, at('2026-08-17T04:00:00Z')), {
    state: 'closed',
    when: 'dnes',
    time: '7:00',
  });
});

test('bez intervalov sa stav nedá určiť', () => {
  assert.deepEqual(getOpenState([], at('2026-08-17T08:00:00Z')), {
    state: 'closed-indefinitely',
  });
});
