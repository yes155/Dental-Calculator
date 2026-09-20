import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/affordable-dental-care/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--([\s\S]*?)-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
const expectedH2s = [
  "Where can I look for lower-cost dental care?",
  "Dental and dental-hygiene school clinics",
  "Federally funded health centers and sliding fees",
  "Medicaid and CHIP dental coverage",
  "State, local and community resources",
  "What to verify before booking lower-cost care",
  "Compare the written quote, not just the advertised discount",
  "What this guide does not promise",
  "Related dental procedure pages",
];

test("GUI-002 keeps the frozen structure and no calculator", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('<meta name="robots" content="noindex,nofollow">'));
  assert.ok(html.includes("<h1>Affordable dental care</h1>"));
  assert.deepEqual(h2s, expectedH2s);
  assert.ok(!html.includes("data-calculator-id="));
  assert.ok(!html.includes('id="calculator"'));
});

test("GUI-002 preserves access and eligibility boundaries", () => {
  assert.match(visibleText, /Availability, fees, eligibility and services vary/);
  assert.match(visibleText, /does not determine eligibility/);
  assert.match(visibleText, /does not maintain a local clinic directory/);
  assert.match(visibleText, /does not.*guarantee free care/i);
  assert.match(visibleText, /Adult Medicaid dental benefits are different: states decide/);
});

test("GUI-002 uses official access pathways without procedure-price duplication", () => {
  assert.match(visibleText, /dental schools often operate clinics/i);
  assert.match(visibleText, /sliding-fee eligibility is based on income and family size/i);
  assert.match(visibleText, /2-1-1/);
  assert.ok(!/\$\d/.test(visibleText), "GUI-002 must not introduce procedure-price dollar benchmarks");
  assert.ok(html.includes('/dental-insurance-out-of-pocket-costs/'));
  assert.ok(html.includes('/dentist-visit-cost/'));
});

test("GUI-002 keeps internal IDs out of reader copy", () => {
  assert.ok(!visibleText.includes("GUI-002"));
  assert.ok(!visibleText.includes("CALC-"));
});
