import { test } from 'node:test';
import assert from 'node:assert/strict';

import { prune, buildPawnShopSchema } from '../src/lib/schema.ts';
import { TO_CONFIRM } from '../src/data/business.ts';

test('prune odstráni TO_CONFIRM, null, undefined aj prázdny reťazec', () => {
  assert.deepEqual(
    prune({ a: 'ok', b: TO_CONFIRM, c: null, d: undefined, e: '' }),
    { a: 'ok' }
  );
});

test('prune zahodí objekt, z ktorého ostane len @type', () => {
  assert.equal(
    prune({ '@type': 'PostalAddress', streetAddress: TO_CONFIRM }),
    undefined
  );
});

test('prune ponechá objekt, ktorý má aspoň jedno reálne pole', () => {
  assert.deepEqual(
    prune({ '@type': 'PostalAddress', streetAddress: TO_CONFIRM, addressLocality: 'Lučenec' }),
    { '@type': 'PostalAddress', addressLocality: 'Lučenec' }
  );
});

test('prune vyčistí polia a zahodí tie, čo ostanú prázdne', () => {
  assert.deepEqual(prune({ list: [TO_CONFIRM, 'a', null] }), { list: ['a'] });
  assert.equal(prune({ list: [TO_CONFIRM, null] }), undefined);
});

test('prune nechá čísla a false na pokoji', () => {
  assert.deepEqual(prune({ lat: 48.33, open: false, zero: 0 }), {
    lat: 48.33,
    open: false,
    zero: 0,
  });
});

test('JSON-LD neobsahuje TO_CONFIRM ani prázdne hodnoty', () => {
  const schema = buildPawnShopSchema();
  const serialized = JSON.stringify(schema);

  assert.ok(schema, 'schéma sa má vygenerovať');
  assert.equal(serialized.includes(TO_CONFIRM), false);
  assert.equal(serialized.includes('""'), false);
  assert.equal(serialized.includes('null'), false);
});

test('JSON-LD nikdy neuvádza priceRange', () => {
  assert.equal(JSON.stringify(buildPawnShopSchema()).includes('priceRange'), false);
});

test('JSON-LD má vždy typ PawnShop a názov', () => {
  const schema = buildPawnShopSchema();
  assert.equal(schema['@type'], 'PawnShop');
  assert.equal(typeof schema.name, 'string');
});
