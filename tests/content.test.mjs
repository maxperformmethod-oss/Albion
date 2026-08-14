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
  // Popis schémy pre čítačku nesie adresu z business.ts, nie natvrdo.
  assert.ok(content.location.map.desc.includes('{street}'));
});

test('schéma neuvádza vzdialenosť ani čas, ktoré nevieme', () => {
  // `map.scale` je popis mierky mapy, nie tvrdenie o ceste k prevádzke —
  // preto sa z kontroly vyníma. Všetko ostatné tvrdí niečo o mieste.
  const { scale, ...claims } = content.location.map;
  const serialized = JSON.stringify({ ...content.location, map: claims }).toLowerCase();
  assert.doesNotMatch(serialized, /\d+\s*(min|minút|metrov|m\b)/);
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
