import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pages = [
  ['about','About Dental Calculator'],
  ['editorial-policy','Editorial Policy'],
  ['authors/farrukh-abdullah','Farrukh Abdullah'],
  ['reviewers/juliana-maia-teixeira','Juliana Maia Teixeira'],
  ['corrections-and-updates','Corrections &amp; Updates'],
  ['cost-data-methodology','Cost Data Methodology'],
  ['calculator-methodology','Calculator Methodology'],
  ['disclosures','Disclosures'],
  ['medical-disclaimer','Medical Disclaimer'],
];

for (const [route,h1] of pages) {
  test(`trust route ${route} is preview-safe and has one H1`, async () => {
    const html = await readFile(new URL(`../src/${route}/index.html`, import.meta.url), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
    assert.ok(html.includes(`<h1>${h1}</h1>`));
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert.doesNotMatch(html,/\[SOURCE NEEDED BEFORE PUBLICATION\]|TODO|PLACEHOLDER|EDITOR NOTE/);
  });
}

test('author and reviewer role boundaries are explicit', async () => {
  const author = await readFile(new URL('../src/authors/farrukh-abdullah/index.html', import.meta.url),'utf8');
  const reviewer = await readFile(new URL('../src/reviewers/juliana-maia-teixeira/index.html', import.meta.url),'utf8');
  const editorial = await readFile(new URL('../src/editorial-policy/index.html', import.meta.url),'utf8');
  assert.match(author,/Researcher &amp; Writer/);
  assert.match(author,/not as a dentist or licensed clinical professional/);
  assert.match(reviewer,/Clinical &amp; Scientific Reviewer/);
  assert.match(reviewer,/PhD in Functional and Molecular Biology/);
  assert.match(reviewer,/MSc in Dentistry, Oral Physiology/);
  assert.match(reviewer,/does not describe her as a licensed dentist|not presented.*licensed dentist/);
  assert.match(editorial,/only after that exact article version has actually been reviewed/);
});

test('methodology preserves key cost and calculator safeguards', async () => {
  const cost = await readFile(new URL('../src/cost-data-methodology/index.html', import.meta.url),'utf8');
  const calc = await readFile(new URL('../src/calculator-methodology/index.html', import.meta.url),'utf8');
  assert.match(cost,/does not merge unrelated local fees, plan copays or differently scoped sources/);
  assert.match(cost,/held from publication until appropriate evidence is added/);
  assert.match(calc,/Blank is not zero/);
  assert.match(calc,/not an actual dental quote and not a coverage guarantee/);
  assert.doesNotMatch(calc,/universal.*insurance.*percentage.*\d+%/i);
});
