import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/tooth-extraction-cost/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

test("DEN-008 keeps internal IDs out of reader-visible copy", () => {
  assert.ok(!visibleText.includes("CALC-008"), "reader copy must not expose CALC-008");
  assert.ok(!visibleText.includes("DEN-008"), "reader copy must not expose DEN-008");
  assert.match(visibleText, /Use your written estimate/);
});

test("DEN-008 uses answer-first source attribution", () => {
  assert.match(visibleText, /Current published U\.S\. benchmarks put a simple tooth extraction at an average of \$177 and a surgical tooth extraction at an average of \$363\s*\. CareCredit is the source for those 2024 study averages\./);
});
