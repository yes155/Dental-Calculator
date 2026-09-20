import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);

const pages = [
  ['index.html', 'Understand what a dental procedure may cost'],
  ['contact/index.html', 'Contact Dental Cost Calculator'],
  ['privacy/index.html', 'Privacy Policy'],
  ['terms/index.html', 'Terms of Use'],
];

for (const [path, h1] of pages) {
  test(`${path} is preview-safe and publication-clean`, async () => {
    const html = await readFile(resolve(root, 'src', path), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
    assert.match(html, new RegExp(`<h1(?:\\s+[^>]*)?>${h1}</h1>`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /\[SOURCE NEEDED BEFORE PUBLICATION\]|TODO|PLACEHOLDER|EDITOR NOTE/);
  });
}

test('homepage internal page links resolve to source routes', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  const hrefs = [...html.matchAll(/href="(\/[^"]+\/)"/g)].map((match) => match[1]);
  assert.ok(hrefs.length > 10);
  for (const href of new Set(hrefs)) {
    const target = href === '/' ? resolve(root, 'src/index.html') : resolve(root, 'src', href.slice(1), 'index.html');
    await access(target);
  }
});

test('homepage preserves YMYL and reviewer boundaries', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  assert.match(html, /clinical reviewer credit appears only when that exact page version has been reviewed/);
  assert.match(html, /not a dentist's fee and not a guarantee of coverage/);
  assert.match(html, /not a dentist’s fee, diagnosis or treatment recommendation/);
  assert.match(html, /does not invent a coverage percentage or guarantee benefits/);
  assert.doesNotMatch(html, /Reviewed by Juliana Maia Teixeira/i);
  assert.doesNotMatch(html, /class="person-card|\/assets\/people\//i);
});

test('privacy and terms preserve calculator and insurance limits', async () => {
  const privacy = await readFile(resolve(root, 'src/privacy/index.html'), 'utf8');
  const terms = await readFile(resolve(root, 'src/terms/index.html'), 'utf8');
  assert.match(privacy, /not intentionally sent to, stored by or serialized to an external service/);
  assert.match(privacy, /policy and the deployed scripts must be reviewed together before launch/);
  assert.match(terms, /not actual dental quotes or coverage guarantees/);
  assert.match(terms, /appropriately licensed professional/);
});
