import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/dental-crown-cost/index.html", import.meta.url), "utf8");

const requiredTokens = [
  '<meta name="robots" content="noindex,nofollow">',
  '<h1>Dental crown cost by material</h1>',
  'data-calculator-id="CALC-022"',
  'data-calculator="calc022"',
  'id="calculator"',
  'aria-live="polite"',
  'data-step-indicator="1"',
  'data-step-indicator="2"',
  'data-step-indicator="3"',
  '/assets/crown-calculator-ui.mjs',
  '$1,399', '$915–$3,254',
  '$1,114', '$770–$2,454',
  '$1,211', '$821–$2,861',
  '$697', '$488–$1,593',
  '$765 average for broken crown repair',
  '$126 average for recementing a dislodged crown',
];

test("DEN-022 keeps required crown evidence and calculator markers", () => {
  for (const token of requiredTokens) assert.ok(html.includes(token), `missing token: ${token}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(!html.includes("[CALCULATOR:"), "internal calculator ID must not be visible");
});

test("DEN-022 keeps the frozen H2 sequence", () => {
  const headings = [
    "Dental crown cost calculator",
    "How much does a dental crown cost?",
    "Dental crown prices by material",
    "What may be separate in a crown quote?",
    "What changes a dental crown quote?",
    "Crown repair and recementing are different price categories",
    "How insurance can affect the patient amount",
    "Crown cost after a root canal or dental implant",
    "Related dental procedure pages",
  ];
  let cursor = -1;
  for (const heading of headings) {
    const token = `>${heading}</h2>`;
    const index = html.indexOf(token, cursor + 1);
    assert.notEqual(index, -1, `missing or out-of-order heading: ${heading}`);
    cursor = index;
  }
});

test("DEN-022 keeps the calculator before educational price detail", () => {
  const calculator = html.indexOf('<h2 id="calculator-heading">Dental crown cost calculator</h2>');
  const answer = html.indexOf('<h2>How much does a dental crown cost?</h2>');
  const detail = html.indexOf('>Dental crown prices by material</h2>');
  assert.ok(calculator !== -1 && answer > calculator && detail > answer);
});

test("DEN-022 does not collapse or relabel crown price categories", () => {
  assert.ok(!html.includes("$488–$3,254 crown range"), "must not create a synthetic all-material crown range");
  assert.ok(!html.includes("$697–$1,399 full crown range"), "average comparison must not be presented as the full range");
  assert.ok(!html.includes("$765 replacement crown"), "broken-crown repair must not be relabeled as replacement pricing");
  assert.ok(!html.includes("$126 replacement crown"), "recementing must not be relabeled as replacement pricing");
  assert.ok(!html.includes("data-default-buildup"), "build-up must not receive a hidden default price");
});

test("DEN-022 does not expose internal page or calculator IDs in reader copy", () => {
  const readerVisible = html
    .replace(/data-calculator-id="[^"]+"/g, "")
    .replace(/data-calculator="[^"]+"/g, "");
  assert.ok(!readerVisible.includes("CALC-022"), "CALC-022 must remain implementation metadata only");
  assert.ok(!readerVisible.includes("DEN-022"), "DEN-022 must remain implementation metadata only");
});
