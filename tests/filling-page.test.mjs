import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const path = new URL("../src/dental-filling-cost/index.html", import.meta.url);
const html = await readFile(path, "utf8");

test("DEN-010 keeps preview and calculator controls", () => {
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  assert.match(html, /<h1>Dental filling cost by material<\/h1>/);
  assert.match(html, /data-calculator-id="CALC-010"/);
  assert.match(html, /data-calculator="calc010"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /\/assets\/filling-calculator-ui\.mjs/);
});

test("DEN-010 preserves separate material price ranges", () => {
  for (const token of ["$108–$256", "$173–$439", "$361–$817", "$755–$1,774", "$116–$285", "$226 national average for composite"]) {
    assert.ok(html.includes(token), `missing evidence token: ${token}`);
  }
  assert.ok(!html.includes("$108–$1,774"), "must not merge material extremes into one generic range");
});

test("DEN-010 calculator immediately follows direct answer section", () => {
  const answer = html.indexOf("<h2>How much does a dental filling cost?</h2>");
  const calculator = html.indexOf('<h2 id="calculator-heading">Dental filling cost calculator</h2>');
  const detail = html.indexOf("<h2>Dental filling prices by material</h2>");
  assert.ok(answer !== -1 && calculator > answer && calculator < detail);
});

test("DEN-010 keeps Orlando examples local", () => {
  assert.match(html, /Orlando, Florida examples/);
  assert.match(html, /These figures are local examples only/);
  for (const token of ["$199", "$217", "$274", "$333", "$229"]) assert.ok(html.includes(token));
});

test("DEN-010 has one H1 and controlled H2 order", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const headings = [
    "How much does a dental filling cost?",
    "Dental filling cost calculator",
    "Dental filling prices by material",
    "How surface count and tooth location can change a quote",
    "What may be separate in a filling quote?",
    "What changes a dental filling quote?",
    "How insurance can affect the patient amount",
    "Fillings, bonding, inlays and onlays are different quote categories",
    "Related dental cost guides",
  ];
  let cursor = -1;
  for (const heading of headings) {
    const token = heading === "Dental filling cost calculator" ? `<h2 id="calculator-heading">${heading}</h2>` : `<h2>${heading}</h2>`;
    const index = html.indexOf(token, cursor + 1);
    assert.ok(index !== -1, `missing or out-of-order H2: ${heading}`);
    cursor = index;
  }
});
