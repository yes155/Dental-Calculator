import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/dental-inlay-cost/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());

const expectedH2s = [
  "How much does a dental inlay cost?",
  "Why the current national price data combines inlays and onlays",
  "What should an inlay quote identify?",
  "Are laboratory and visit costs included in an inlay price?",
  "What can change an inlay quote?",
  "How insurance can affect what you pay",
  "Inlay cost versus onlay and filling cost",
  "Related dental cost guides",
];

test("DEN-004 keeps the frozen page structure", () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('<meta name="robots" content="noindex,nofollow">'));
  assert.ok(html.includes("<h1>Dental inlay cost</h1>"));
  assert.deepEqual(h2s, expectedH2s);
  assert.ok(!html.includes("data-calculator-id="));
  assert.ok(!html.includes('id="calculator"'));
});

test("DEN-004 preserves the combined ceramic inlay/onlay price scope", () => {
  assert.match(visibleText, /\$976 average/);
  assert.match(visibleText, /\$755–\$1,774/);
  assert.match(visibleText, /ceramic inlay or onlay/);
  assert.match(visibleText, /does not establish an inlay-only national average or range/);
  assert.ok(!/inlay-only[^.]{0,80}\$755–\$1,774/i.test(visibleText));
  assert.ok(!/\$250–\$1,500/.test(visibleText), "older secondary range should not appear in first-version reader copy");
});

test("DEN-004 is answer-first and source-second", () => {
  const introMatch = html.match(/<p class="intro">([\s\S]*?)<\/p>/);
  assert.ok(introMatch, "intro must exist");
  const introText = introMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  assert.match(introText, /^Current U\.S\. cost research does not provide a clean inlay-only national range\./);
  assert.ok(!/^(CareCredit|Synchrony|Humana|ADA)\b/.test(introText));
});

test("DEN-004 keeps insurance and clinical boundaries", () => {
  assert.match(visibleText, /There is no universal insurance percentage or copay for an inlay\./);
  assert.match(visibleText, /does not decide whether an inlay, filling, onlay or crown is appropriate/);
  assert.match(visibleText, /included, separately billed, not listed or unclear/);
});

test("DEN-004 does not expose internal IDs in reader copy", () => {
  assert.ok(!visibleText.includes("DEN-004"));
  assert.ok(!visibleText.includes("CALC-"));
});
