import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCleaningQuote } from "../src/assets/cleaning-calculator-core.mjs";

const known = (overrides = {}) => ({
  exam: { state: "included", amount: "" },
  xray: { state: "not_on_quote", amount: "" },
  fluoride: { state: "not_on_quote", amount: "" },
  other: { state: "not_on_quote", amount: "" },
  ...overrides,
});

function base(overrides = {}) {
  return {
    quoteMode: "one_total",
    writtenTotal: "120",
    cleaningFee: "",
    components: known(),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
    ...overrides,
  };
}

test("C002-01 one total complete no insurance", () => {
  const out = evaluateCleaningQuote(base());
  assert.equal(out.status, "complete");
  assert.equal(out.totalCents, 12000);
  assert.equal(out.patientCents, 12000);
});

test("C002-02 separate x-ray charge adds to total", () => {
  const out = evaluateCleaningQuote(base({ components: known({ xray: { state: "separately_quoted", amount: "60" } }) }));
  assert.equal(out.totalCents, 18000);
});

test("C002-03 separate-charge mode sums cleaning, exam, x-rays", () => {
  const out = evaluateCleaningQuote(base({
    quoteMode: "separate_charges",
    writtenTotal: "",
    cleaningFee: "100",
    components: known({
      exam: { state: "separately_quoted", amount: "40" },
      xray: { state: "separately_quoted", amount: "60" },
    }),
  }));
  assert.equal(out.totalCents, 20000);
});

test("C002-04 zero separate fluoride amount is valid", () => {
  const out = evaluateCleaningQuote(base({
    quoteMode: "separate_charges",
    writtenTotal: "",
    cleaningFee: "100",
    components: known({ fluoride: { state: "separately_quoted", amount: "0" } }),
  }));
  assert.equal(out.status, "complete");
  assert.equal(out.totalCents, 10000);
});

test("C002-05 separate charge with blank amount is invalid", () => {
  const out = evaluateCleaningQuote(base({ components: known({ xray: { state: "separately_quoted", amount: "" } }) }));
  assert.equal(out.status, "invalid");
});

test("C002-06 unknown component preserves total but suppresses patient amount", () => {
  const out = evaluateCleaningQuote(base({ writtenTotal: "150", components: known({ exam: { state: "unknown", amount: "" } }) }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 15000);
  assert.equal(out.patientCents, null);
});

test("C002-07 same-scope insurer estimate subtracts", () => {
  const out = evaluateCleaningQuote(base({ writtenTotal: "150", insurance: { mode: "entered_estimate", amount: "50", sameScopeConfirmed: true } }));
  assert.equal(out.patientCents, 10000);
});

test("C002-08 insurer estimate cannot exceed quote", () => {
  const out = evaluateCleaningQuote(base({ writtenTotal: "150", insurance: { mode: "entered_estimate", amount: "200", sameScopeConfirmed: true } }));
  assert.equal(out.status, "invalid");
});

test("C002-09 blank base differs from zero", () => {
  assert.equal(evaluateCleaningQuote(base({ writtenTotal: "" })).status, "invalid");
  assert.equal(evaluateCleaningQuote(base({ writtenTotal: "0" })).status, "complete");
});

test("C002-10 published reference is not an input", () => {
  const out = evaluateCleaningQuote(base({ writtenTotal: "137" }));
  assert.equal(out.totalCents, 13700);
});

test("C002-11 aggregate technical ceiling is enforced", () => {
  const out = evaluateCleaningQuote(base({
    quoteMode: "separate_charges",
    writtenTotal: "",
    cleaningFee: "1000000",
    components: known({ exam: { state: "separately_quoted", amount: "1" } }),
  }));
  assert.equal(out.status, "invalid");
});
