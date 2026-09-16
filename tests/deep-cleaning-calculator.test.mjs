import test from "node:test";
import assert from "node:assert/strict";
import { evaluateDeepCleaningQuote } from "../src/assets/deep-cleaning-calculator-core.mjs";

const adjuncts = (overrides = {}) => ({
  anesthesia: { state: "not_on_quote", amount: "" },
  other: { state: "not_on_quote", amount: "" },
  ...overrides,
});

function base(overrides = {}) {
  return {
    quoteMode: "one_total",
    quadrantCount: "2",
    quadrantCountConfirmed: true,
    writtenTotal: "500",
    quadrantCharges: [],
    adjuncts: adjuncts(),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
    ...overrides,
  };
}

test("C006-01 total 500 over two confirmed quadrants", () => {
  const out = evaluateDeepCleaningQuote(base());
  assert.equal(out.status, "complete");
  assert.equal(out.totalCents, 50000);
  assert.equal(out.averageCents, 25000);
  assert.equal(out.patientCents, 50000);
});

test("C006-02 odd cent division is labeled approximate", () => {
  const out = evaluateDeepCleaningQuote(base({ writtenTotal: "501.01" }));
  assert.equal(out.averageCents, 25051);
  assert.equal(out.averageApproximate, true);
});

test("C006-03 two quadrant lines sum and average", () => {
  const out = evaluateDeepCleaningQuote(base({ quoteMode: "separate_quadrant_charges", writtenTotal: "", quadrantCharges: ["220", "260"] }));
  assert.equal(out.totalCents, 48000);
  assert.equal(out.averageCents, 24000);
});

test("C006-04 four quadrant lines", () => {
  const out = evaluateDeepCleaningQuote(base({ quoteMode: "separate_quadrant_charges", quadrantCount: "4", writtenTotal: "", quadrantCharges: ["200", "200", "200", "200"] }));
  assert.equal(out.totalCents, 80000);
  assert.equal(out.averageCents, 20000);
});

test("C006-05 missing quadrant line is invalid", () => {
  const out = evaluateDeepCleaningQuote(base({ quoteMode: "separate_quadrant_charges", quadrantCount: "4", writtenTotal: "", quadrantCharges: ["200", "200", "200"] }));
  assert.equal(out.status, "invalid");
});

test("C006-06 count outside 1 to 4 invalid", () => {
  assert.equal(evaluateDeepCleaningQuote(base({ quadrantCount: "0" })).status, "invalid");
  assert.equal(evaluateDeepCleaningQuote(base({ quadrantCount: "5" })).status, "invalid");
});

test("C006-07 quadrant count confirmation required", () => {
  assert.equal(evaluateDeepCleaningQuote(base({ quadrantCountConfirmed: false })).status, "invalid");
});

test("C006-08 separate anesthesia adds total but not SRP average", () => {
  const out = evaluateDeepCleaningQuote(base({ adjuncts: adjuncts({ anesthesia: { state: "separately_quoted", amount: "50" } }) }));
  assert.equal(out.totalCents, 55000);
  assert.equal(out.averageCents, 25000);
});

test("C006-09 unknown adjunct keeps subtotal incomplete", () => {
  const out = evaluateDeepCleaningQuote(base({ adjuncts: adjuncts({ other: { state: "unknown", amount: "" } }) }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 50000);
  assert.equal(out.patientCents, null);
});

test("C006-10 same quote insurer estimate subtracts", () => {
  const out = evaluateDeepCleaningQuote(base({ insurance: { mode: "entered_estimate", amount: "150", sameScopeConfirmed: true } }));
  assert.equal(out.patientCents, 35000);
});

test("C006-11 insurer over total invalid", () => {
  assert.equal(evaluateDeepCleaningQuote(base({ insurance: { mode: "entered_estimate", amount: "501", sameScopeConfirmed: true } })).status, "invalid");
});

test("C006-12 published reference is not an input", () => {
  const out = evaluateDeepCleaningQuote(base({ writtenTotal: "643" }));
  assert.equal(out.totalCents, 64300);
});
