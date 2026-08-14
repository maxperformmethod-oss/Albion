/**
 * Placeholder gate.
 *
 *   --pre    pred buildom: nájde všetky TO_CONFIRM v src/data/business.ts.
 *            Bez --allow (alebo ALLOW_PLACEHOLDERS=1) skončí exit 1.
 *   --post   po builde: prehľadá dist/**\/*.html na literál TO_CONFIRM.
 *            Zlyhá vždy — placeholder v HTML nie je chýbajúci údaj, ale chyba
 *            v komponente.
 *
 * Node ≥ 22.18 vie .ts importovať priamo (natívny type-stripping), takže
 * kontrolujeme reálne dáta, nie regex nad zdrojákom.
 */

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUSINESS = join(ROOT, 'src', 'data', 'business.ts');
const DIST = join(ROOT, 'dist');

const args = process.argv.slice(2);
const mode = args.includes('--post') ? 'post' : 'pre';
const allow = args.includes('--allow') || process.env.ALLOW_PLACEHOLDERS === '1';

const paint = (code) => (s) => `[${code}m${s}[0m`;
const bold = paint(1);
const dim = paint(2);
const red = paint(31);
const green = paint(32);
const yellow = paint(33);

/** Rekurzívne pozbiera cesty ku všetkým hodnotám rovným TO_CONFIRM. */
function collect(value, path, sentinel, out) {
  if (value === sentinel) {
    out.push(path);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => collect(item, `${path}[${i}]`, sentinel, out));
    return out;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collect(item, path ? `${path}.${key}` : key, sentinel, out);
    }
  }
  return out;
}

async function checkPre() {
  const mod = await import(pathToFileURL(BUSINESS).href);
  const optional = new Set(mod.OPTIONAL_FIELDS ?? []);

  const all = collect(mod.business, 'business', mod.TO_CONFIRM, []);
  const missing = all.filter((path) => !optional.has(path));
  const skipped = all.filter((path) => optional.has(path));

  if (skipped.length > 0) {
    console.log(
      `${dim('·')} voliteľné a zatiaľ nedoplnené: ${skipped.join(', ')}`
    );
  }

  if (missing.length === 0) {
    console.log(green('✓ business.ts — všetky povinné údaje sú doplnené.'));
    return 0;
  }

  const label = allow ? yellow('PLACEHOLDERY') : red('CHÝBAJÚCE ÚDAJE');
  console.log(`\n${bold(label)}  ${missing.length} nepotvrdených polí:\n`);
  for (const path of missing) {
    console.log(`  ${dim('·')} ${path}`);
  }

  if (allow) {
    console.log(
      `\n${yellow('→')} Beží draft build (--allow). Tento výstup sa NESMIE nasadiť.\n`
    );
    return 0;
  }

  console.log(
    `\n${red('→')} Produkčný build zastavený. Doplň údaje v ${bold('src/data/business.ts')},\n` +
      `  alebo pre náhľad spusti ${bold('npm run build:draft')}.\n`
  );
  return 1;
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

async function checkPost() {
  if (!existsSync(DIST)) {
    console.log(red('✗ dist/ neexistuje — build zrejme neprebehol.'));
    return 1;
  }

  const hits = [];
  for await (const file of htmlFiles(DIST)) {
    const html = await readFile(file, 'utf8');
    if (html.includes('TO_CONFIRM')) hits.push(relative(ROOT, file));
  }

  if (hits.length === 0) {
    console.log(green('✓ dist/ — žiadny placeholder v HTML.'));
    return 0;
  }

  console.log(`\n${bold(red('PLACEHOLDER V HTML'))}  ${hits.length} súborov:\n`);
  for (const file of hits) console.log(`  ${dim('·')} ${file}`);
  console.log(
    `\n${red('→')} Komponent vypisuje TO_CONFIRM namiesto toho, aby daný prvok\n` +
      `  vynechal. Toto je chyba v šablóne, nie chýbajúci údaj.\n`
  );
  return 1;
}

process.exit(mode === 'post' ? await checkPost() : await checkPre());
