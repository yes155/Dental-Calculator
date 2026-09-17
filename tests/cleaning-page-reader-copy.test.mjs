import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/dental-cleaning-cost/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

test("DEN-002 does not expose internal page or calculator IDs in reader copy", () => {
  assert.ok(!visibleText.includes("CALC-002"), "reader copy must not expose CALC-002");
  assert.ok(!visibleText.includes("DEN-002"), "reader copy must not expose DEN-002");
  assert.match(visibleText, /The calculator does not calculate deductibles, coinsurance, network allowed amounts, annual maximums or frequency limits\./);
});
