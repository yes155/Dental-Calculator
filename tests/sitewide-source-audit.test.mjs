import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const src = resolve(root, 'src');
const registryText = await readFile(resolve(root, 'data/page-registry.csv'), 'utf8');

function parseRegistry(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
  });
}

function routeToFile(route) {
  if (route === '/') return resolve(src, 'index.html');
  return resolve(src, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function normalizeInternalHref(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return '/';
  return clean.endsWith('/') ? clean : `${clean}/`;
}

const approved = parseRegistry(registryText).filter((row) => row.status.startsWith('APPROVED'));
const approvedRoutes = new Set(approved.map((row) => row.url));
const siblingProjectDomains = /(?:skinkpedia\.online|myaxolotl\.us|bettafish\.website)/i;

test('every approved registry route has a source index.html', async () => {
  assert.equal(approved.length, 39, 'expected the frozen registry plus controlled reviewer addition to contain 39 approved routes');
  for (const row of approved) {
    await assert.doesNotReject(access(routeToFile(row.url)), `${row.page_id} ${row.url} is missing its source page`);
  }
});

test('every approved page has basic preview metadata and publication-clean copy', async () => {
  // Match editorial workflow markers in reader/source copy without flagging legitimate HTML attributes such as placeholder="0.00".
  const forbidden = /\[SOURCE NEEDED BEFORE PUBLICATION\]|\[EDITOR NOTE[^\]]*\]|\[TODO[^\]]*\]|\[PLACEHOLDER[^\]]*\]|planned but not live|— planned/gi;
  for (const row of approved) {
    const html = await readFile(routeToFile(row.url), 'utf8');
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${row.url}: expected exactly one H1`);
    assert.equal((html.match(/<title>[^<]+<\/title>/gi) || []).length, 1, `${row.url}: expected one non-empty title`);
    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/i, `${row.url}: missing meta description`);
    assert.match(html, /<meta\s+name="robots"\s+content="noindex,nofollow"/i, `${row.url}: preview robots must remain noindex,nofollow`);
    assert.doesNotMatch(html, forbidden, `${row.url}: unresolved or stale publication wording`);
    assert.doesNotMatch(html, siblingProjectDomains, `${row.url}: cross-project domain reference is not allowed`);
  }
});

test('approved people images stay local to the dental site', async () => {
  await assert.doesNotReject(access(resolve(src, 'assets/people/farrukh-abdullah.webp')), 'Farrukh author photo asset is missing');
  await assert.doesNotReject(access(resolve(src, 'assets/people/juliana-maia-teixeira.webp')), 'Reviewer photo asset is missing');

  const homepage = await readFile(resolve(src, 'index.html'), 'utf8');
  const about = await readFile(routeToFile('/about/'), 'utf8');
  const author = await readFile(routeToFile('/authors/farrukh-abdullah/'), 'utf8');

  for (const [label, html] of Object.entries({ homepage, about, author })) {
    assert.match(html, /src="\/assets\/people\/farrukh-abdullah\.webp"/i, `${label}: Farrukh author photo must use the local asset`);
  }
});

test('all root-relative internal page links resolve to an implemented approved route or asset', async () => {
  const broken = [];
  for (const row of approved) {
    const html = await readFile(routeToFile(row.url), 'utf8');
    for (const match of html.matchAll(/href="(\/[^"]*)"/gi)) {
      const href = match[1];
      if (href.startsWith('/assets/')) continue;
      const route = normalizeInternalHref(href);
      if (!approvedRoutes.has(route)) broken.push(`${row.url} -> ${href}`);
    }
  }
  assert.deepEqual(broken, [], `broken/unregistered internal links:\n${broken.join('\n')}`);
});

test('non-trust pages do not claim page-specific reviewer credit without documented approval', async () => {
  for (const row of approved) {
    if (row.cluster === 'Trust and methodology') continue;
    const html = await readFile(routeToFile(row.url), 'utf8');
    assert.doesNotMatch(html, /Reviewed by Juliana Maia Teixeira/i, `${row.url}: reviewer credit requires exact-version approval`);
  }
});
