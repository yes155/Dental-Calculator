import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/dental-onlay-cost/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());

const expectedH2s = [
  "How much does a dental onlay cost?",
  "Why the current national price data combines onlays and inlays",
  "What makes an onlay a distinct restoration?",
  "What should an onlay quote identify?",
  "Are laboratory and related service costs included in an onlay price?",
  "What can change an onlay quote?",
  "Onlay repair is not the same price category as a new onlay",
  "How insurance can affect what you pay",
  "Onlay cost versus inlay, filling and crown cost",
  "Related dental procedure pages",
];

test("DEN-013 keeps the frozen page structure", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('<meta name="robots" content="noindex,nofollow">'));
  assert.ok(html.includes("<h1>Dental onlay cost</h1>"));
  assert.deepEqual(h2s, expectedH2s);
  assert.ok(!html.includes("data-calculator-id="));
  assert.ok(!html.includes('id="calculator"'));
  assert.ok(html.includes('/assets/inlay-page.css'));
});

test("DEN-013 preserves the combined ceramic inlay/onlay price scope", () => {
  assert.match(visibleText, /\$976 average/);
  assert.match(visibleText, /\$755–\$1,774/);
  assert.match(visibleText, /ceramic inlay or onlay/);
  assert.match(visibleText, /does not provide a clean onlay-only national range/);
  assert.ok(!/onlay-only[^.]{0,80}\$755–\$1,774/i.test(visibleText));
  assert.ok(!/\$350–\$1,500/.test(visibleText), "older secondary onlay-only range should not appear in first-version reader copy");
});

test("DEN-013 is answer-first and source-second", () => {
  const introMatch = html.match(/<p class="intro">([\s\S]*?)<\/p>/);
  assert.ok(introMatch, "intro must exist");
  const introText = introMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  assert.match(introText, /^Current U\.S\. cost research does not provide a clean onlay-only national range\./);
  assert.ok(!/^(CareCredit|Synchrony|Humana|ADA)\b/.test(introText));
});

test("DEN-013 keeps repair, insurance and clinical boundaries", () => {
  assert.match(visibleText, /onlay repair[^.]*separate service category/i);
  assert.match(visibleText, /There is no universal insurance percentage or copay for an onlay\./);
  assert.match(visibleText, /does not decide which restoration is appropriate/);
  assert.match(visibleText, /included, billed separately, not listed or unclear/);
});

test("DEN-013 does not expose internal IDs in reader copy", () => {
  assert.ok(!visibleText.includes("DEN-013"));
  assert.ok(!visibleText.includes("CALC-"));
});
