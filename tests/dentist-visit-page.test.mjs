import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/dentist-visit-cost/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--([\s\S]*?)-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
const expectedH2s = [
  "How much does a dentist visit cost?",
  "Why the current national price is a bundled visit, not an exam-only fee",
  "What kind of dental visit is on the quote?",
  "What should a dentist-visit quote identify?",
  "Are cleaning and X-rays included in a dental checkup price?",
  "What can change a dentist-visit quote?",
  "How insurance can affect what you pay for a dental visit",
  "Dentist visit cost versus cleaning and X-ray cost",
  "Related dental cost guides",
];

test("DEN-025 keeps the frozen structure and no calculator", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('<meta name="robots" content="noindex,nofollow">'));
  assert.ok(html.includes("<h1>Dentist visit cost</h1>"));
  assert.deepEqual(h2s, expectedH2s);
  assert.ok(!html.includes("data-calculator-id="));
  assert.ok(!html.includes('id="calculator"'));
});

test("DEN-025 preserves bundled price scope", () => {
  assert.match(visibleText, /\$203 average/);
  assert.match(visibleText, /\$50–\$350/);
  assert.match(visibleText, /includes a full cleaning and X-rays/);
  assert.ok(!/exam-only[^.]{0,80}\$203/i.test(visibleText));
  assert.ok(!/exam-only[^.]{0,80}\$50–\$350/i.test(visibleText));
});

test("DEN-025 preserves ownership and insurance boundaries", () => {
  assert.match(visibleText, /There is no universal insurance percentage, copay or number of covered exams/);
  assert.ok(html.includes('/dental-cleaning-cost/'));
  assert.ok(html.includes('/dental-x-ray-cost/'));
  assert.ok(html.includes('/affordable-dental-care/'));
  assert.match(visibleText, /does not determine which evaluation a particular person needs/);
});

test("DEN-025 keeps internal IDs out of reader copy", () => {
  assert.ok(!visibleText.includes("DEN-025"));
  assert.ok(!visibleText.includes("CALC-"));
});
