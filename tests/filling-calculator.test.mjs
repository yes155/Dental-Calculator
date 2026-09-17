import test from "node:test";
import assert from "node:assert/strict";
import { evaluateFillingQuote } from "../src/assets/filling-calculator-core.mjs";

const known = (overrides = {}) => ({
  examImaging: { state: "not_on_quote", amount: "" },
  anesthesia: { state: "not_on_quote", amount: "" },
  other: { state: "not_on_quote", amount: "" },
  ...overrides,
});

function base(overrides = {}) {
  return {
    quoteMode: "one_total",
    restorationCount: "1",
    restorationCountConfirmed: true,
    writtenTotal: "250",
    restorationAmounts: [],
    material: "not_stated",
    surfaceCount: "not_stated",
    toothLocation: "not_stated",
    components: known(),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
    ...overrides,
  };
}

test("C010-01 one total complete no insurance", () => {
  const out = evaluateFillingQuote(base());
  assert.equal(out.status, "complete");
  assert.equal(out.totalCents, 25000);
  assert.equal(out.averagePerRestorationCents, 25000);
  assert.equal(out.patientCents, 25000);
});

test("C010-02 itemized restorations sum", () => {
  const out = evaluateFillingQuote(base({ quoteMode: "itemized_restorations", restorationCount: "2", writtenTotal: "", restorationAmounts: ["180", "220"] }));
  assert.equal(out.totalCents, 40000);
  assert.equal(out.averagePerRestorationCents, 20000);
});

test("C010-03 separate exam imaging adds to total but not restoration average", () => {
  const out = evaluateFillingQuote(base({ components: known({ examImaging: { state: "separately_quoted", amount: "60" } }) }));
  assert.equal(out.totalCents, 31000);
  assert.equal(out.averagePerRestorationCents, 25000);
});

test("C010-04 unknown adjunct makes scope incomplete", () => {
  const out = evaluateFillingQuote(base({ components: known({ anesthesia: { state: "unknown", amount: "" } }) }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 25000);
  assert.equal(out.patientCents, null);
});

test("C010-05 separate adjunct with blank amount is invalid", () => {
  assert.equal(evaluateFillingQuote(base({ components: known({ other: { state: "separately_quoted", amount: "" } }) })).status, "invalid");
});

test("C010-06 itemized count mismatch is invalid", () => {
  assert.equal(evaluateFillingQuote(base({ quoteMode: "itemized_restorations", restorationCount: "2", writtenTotal: "", restorationAmounts: ["180"] })).status, "invalid");
});

test("C010-07 restoration count must be confirmed", () => {
  assert.equal(evaluateFillingQuote(base({ restorationCountConfirmed: false })).status, "invalid");
});

test("C010-08 uneven division is marked approximate", () => {
  const out = evaluateFillingQuote(base({ restorationCount: "2", writtenTotal: "501" }));
  assert.equal(out.averagePerRestorationCents, 25050);
});

test("C010-09 descriptive material does not change arithmetic", () => {
  const gold = evaluateFillingQuote(base({ material: "gold" }));
  const composite = evaluateFillingQuote(base({ material: "composite_resin" }));
  assert.equal(gold.totalCents, composite.totalCents);
  assert.notEqual(gold.material, composite.material);
});

test("C010-10 same-scope insurer estimate subtracts", () => {
  const out = evaluateFillingQuote(base({ writtenTotal: "500", insurance: { mode: "entered_estimate", amount: "150", sameScopeConfirmed: true } }));
  assert.equal(out.patientCents, 35000);
});

test("C010-11 insurer estimate cannot exceed quote", () => {
  assert.equal(evaluateFillingQuote(base({ insurance: { mode: "entered_estimate", amount: "300", sameScopeConfirmed: true } })).status, "invalid");
});

test("C010-12 published references do not participate in arithmetic", () => {
  assert.equal(evaluateFillingQuote(base({ writtenTotal: "137" })).totalCents, 13700);
});

test("C010-13 blank base differs from explicit zero", () => {
  assert.equal(evaluateFillingQuote(base({ writtenTotal: "" })).status, "invalid");
  assert.equal(evaluateFillingQuote(base({ writtenTotal: "0" })).status, "complete");
});

test("C010-14 aggregate technical ceiling is enforced", () => {
  assert.equal(evaluateFillingQuote(base({ writtenTotal: "1000000", components: known({ other: { state: "separately_quoted", amount: "1" } }) })).status, "invalid");
});
