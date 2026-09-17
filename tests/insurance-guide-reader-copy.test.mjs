import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../src/dental-insurance-out-of-pocket-costs/index.html", import.meta.url), "utf8");
const visibleText = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const introMatch = html.match(/<p class="intro">([\s\S]*?)<\/p>/);
const introText = (introMatch?.[1] || "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

test("GUI-001 keeps reader copy free of internal IDs", () => {
  assert.ok(!visibleText.includes("GUI-001"), "reader copy must not expose GUI-001");
  assert.ok(!visibleText.includes("CALC-"), "reader copy must not expose calculator IDs");
  assert.ok(!visibleText.includes("DEN-"), "reader copy must not expose page IDs");
});

test("GUI-001 keeps the opening answer-first", () => {
  assert.match(introText, /^A coverage percentage alone does not tell you what you will pay\./);
  assert.ok(!/^(Delta Dental|CareCredit|Humana|Cigna|Forbes Advisor|ADA)\b/.test(introText), "intro must not start with a source brand");
});
