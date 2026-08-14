import { test } from 'node:test';
import assert from 'node:assert/strict';

import { content } from '../src/data/content.ts';
import { business, isConfirmed } from '../src/data/business.ts';

test('riadky H1 zložené dokopy dávajú schválenú vetu', () => {
  assert.equal(content.hero.h1Lines.join(' '), content.hero.h1);
});

test('v textoch nie je adresa natvrdo', () => {
  const serialized = JSON.stringify(content);
  assert.equal(serialized.includes('Nálepku'), false);
  assert.equal(serialized.includes('Kapitána'), false);
});

test('šablóny adresy majú svoj zástupný znak', () => {
  assert.ok(content.hero.eyebrow.includes('{address}'));
  assert.ok(content.location.text.includes('{address}'));
});

test('zakázané frázy sa v textoch nevyskytujú', () => {
  const serialized = JSON.stringify(content).toLowerCase();
  for (const phrase of [
    'vaša spokojnosť',
    'kvalita na prvom mieste',
    'sme tu pre vás',
    'garantujeme',
    'okamžite',
    'najlepšia záložňa',
    'prvá záložňa',
  ]) {
    assert.equal(serialized.includes(phrase), false, `nájdené: ${phrase}`);
  }
});

test('verejný názov sedí s tým, čo ide do title', () => {
  assert.ok(content.meta.title.startsWith(business.name));
});

test('telefón je jedno číslo v tvare E.164', () => {
  assert.ok(isConfirmed(business.phone));
  assert.match(business.phone, /^\+421\d{9}$/);
});
