import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (route) => readFile(new URL(`../src/${route}/index.html`, import.meta.url), 'utf8');

for (const [route,h1] of [['invisalign-cost-calculator','Invisalign cost calculator'],['braces-cost','Braces cost'],['dental-retainer-cost','Dental retainer cost']]) {
  test(`${route} keeps preview and publication safeguards`, async () => {
    const html = await read(route);
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
    assert.ok(html.includes(`<h1>${h1}</h1>`));
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert.doesNotMatch(html,/\[SOURCE NEEDED BEFORE PUBLICATION\]|TODO|PLACEHOLDER|EDITOR NOTE/);
    assert.doesNotMatch(html,/Reviewed by Juliana Maia Teixeira/);
  });
}

test('DEN-017 keeps clear-aligner benchmark distinct from Invisalign-only evidence', async () => {
  const html = await read('invisalign-cost-calculator');
  assert.match(html,/\$5,108 average/);
  assert.match(html,/\$1,800–\$8,100 range/);
  assert.match(html,/clear aligner treatment/);
  assert.match(html,/not Invisalign alone/);
  assert.match(html,/data-orthodontic-calculator/);
  assert.doesNotMatch(html,/Invisalign-only national (average|range) is \$|Invisalign costs \$1,800–\$8,100/);
});

test('DEN-020 keeps brace-type price evidence separate', async () => {
  const html = await read('braces-cost');
  for (const token of ['$6,343','$2,500–$10,000','$5,834','$4,480–$11,312','$9,221','$7,321–$17,411']) assert.ok(html.includes(token));
  assert.match(html,/separate treatment categories, not one combined braces price range/);
  assert.match(html,/data-orthodontic-calculator/);
  assert.doesNotMatch(html,/\$2,500–\$17,411 range for braces/);
});

test('DEN-027 has no calculator and does not turn averages into replacement fees', async () => {
  const html = await read('dental-retainer-cost');
  for (const token of ['$344','$181','$302']) assert.ok(html.includes(token));
  assert.doesNotMatch(html,/data-orthodontic-calculator|orthodontics-calculator-ui/);
  assert.match(html,/fee for a replacement retainer is determined by the orthodontist/);
  assert.doesNotMatch(html,/replacement retainer costs \$(181|302|344)/i);
});
