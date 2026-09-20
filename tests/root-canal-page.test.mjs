import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const path = new URL("../src/root-canal-cost/index.html", import.meta.url);
const html = await readFile(path, "utf8");

test("DEN-005 keeps preview and calculator controls", () => {
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.match(html, /<h1>Root canal cost by tooth type<\/h1>/);
  assert.match(html, /data-calculator-id="CALC-005"/);
  assert.match(html, /data-calculator="calc005"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /\/assets\/root-canal-calculator-ui\.mjs/);
});

test("DEN-005 preserves evidence scope", () => {
  for (const token of ["$1,165", "$500–$1,800", "$776–$1,911", "$757–$1,798", "$1,030–$2,471", "$900", "$1,017", "$1,175", "excluding final restoration"]) {
    assert.ok(html.includes(token), `missing evidence token: ${token}`);
  }
  assert.ok(!html.includes("30–50%"), "must not adopt source insurance percentage as a default");
  assert.ok(!html.includes("endodontist premium"), "must not invent a specialist premium");
});

test("DEN-005 keeps the calculator before educational price detail", () => {
  const calculator = html.indexOf('<h2 id="calculator-heading">Root canal cost calculator</h2>');
  const answer = html.indexOf("<h2>How much does a root canal cost?</h2>");
  const detail = html.indexOf(">Root canal prices by tooth type</h2>");
  assert.ok(calculator !== -1 && answer > calculator && detail > answer);
});

test("DEN-005 keeps retreatment benchmark unsupported", () => {
  assert.match(html, /does <strong>not<\/strong> provide a defensible national retreatment price/);
  assert.match(html, /does not generate or compare against a retreatment benchmark/);
});

test("DEN-005 does not leak internal page or calculator IDs into reader copy", () => {
  assert.ok(!html.includes("Use CALC-005"));
  assert.ok(!html.includes("CALC-005 can total"));
  assert.ok(!html.includes("DEN-005 owns"));
  assert.match(html, /Published prices stay separate/);
});

test("DEN-005 has one H1 and controlled H2 order", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const headings = [
    "Root canal cost calculator",
    "How much does a root canal cost?",
    "Root canal prices by tooth type",
    "Is the crown or final filling included in a root canal quote?",
    "What can change a root canal quote?",
    "What if the quote says retreatment?",
    "How insurance can affect the patient amount",
    "Root canal cost versus crown cost",
    "Related dental procedure pages",
  ];
  let cursor = -1;
  for (const heading of headings) {
    const token = `>${heading}</h2>`;
    const index = html.indexOf(token, cursor + 1);
    assert.ok(index !== -1, `missing or out-of-order H2: ${heading}`);
    cursor = index;
  }
});
