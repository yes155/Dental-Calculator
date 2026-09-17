import test from "node:test";
import assert from "node:assert/strict";
import { evaluateRootCanalQuote } from "../src/assets/root-canal-calculator-core.mjs";

const known = (overrides = {}) => ({
  restoration: { state: "not_on_quote", amount: "", label: "not_stated" },
  buildupPost: { state: "not_on_quote", amount: "" },
  imagingExam: { state: "not_on_quote", amount: "" },
  other: { state: "not_on_quote", amount: "" },
  ...overrides,
});

function base(overrides = {}) {
  return {
    quoteMode: "one_total",
    toothCount: "1",
    toothCountConfirmed: true,
    toothCategory: "not_stated",
    rootCanalAmount: "1100",
    components: known(),
    retreatmentFlag: "initial",
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
    ...overrides,
  };
}

test("C005-01 one root canal complete no insurance", () => {
  const out = evaluateRootCanalQuote(base());
  assert.equal(out.status, "complete");
  assert.equal(out.totalCents, 110000);
  assert.equal(out.patientCents, 110000);
  assert.equal(out.averagePerToothCents, 110000);
});

test("C005-02 separate crown adds to total", () => {
  const out = evaluateRootCanalQuote(base({ components: known({ restoration: { state: "separately_quoted", amount: "1300", label: "crown" } }) }));
  assert.equal(out.totalCents, 240000);
});

test("C005-03 included filling does not add amount", () => {
  const out = evaluateRootCanalQuote(base({ components: known({ restoration: { state: "included", amount: "", label: "filling" } }) }));
  assert.equal(out.totalCents, 110000);
});

test("C005-04 unknown restoration keeps subtotal but marks incomplete", () => {
  const out = evaluateRootCanalQuote(base({ components: known({ restoration: { state: "unknown", amount: "", label: "crown" } }) }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 110000);
  assert.equal(out.patientCents, null);
});

test("C005-05 separate restoration with blank amount is invalid", () => {
  const out = evaluateRootCanalQuote(base({ components: known({ restoration: { state: "separately_quoted", amount: "", label: "crown" } }) }));
  assert.equal(out.status, "invalid");
});

test("C005-06 two confirmed teeth normalize arithmetic average", () => {
  const out = evaluateRootCanalQuote(base({ toothCount: "2", rootCanalAmount: "2200" }));
  assert.equal(out.averagePerToothCents, 110000);
});

test("C005-07 fractional-cent division is marked approximate", () => {
  const out = evaluateRootCanalQuote(base({ toothCount: "3", rootCanalAmount: "2200" }));
  assert.equal(out.averageApproximate, true);
});

test("C005-08 retreatment flag does not create a price default", () => {
  const out = evaluateRootCanalQuote(base({ rootCanalAmount: "1500", retreatmentFlag: "retreatment" }));
  assert.equal(out.totalCents, 150000);
  assert.equal(out.retreatmentFlag, "retreatment");
});

test("C005-09 same-scope insurer estimate subtracts", () => {
  const out = evaluateRootCanalQuote(base({ rootCanalAmount: "1500", insurance: { mode: "entered_estimate", amount: "500", sameScopeConfirmed: true } }));
  assert.equal(out.patientCents, 100000);
});

test("C005-10 insurer estimate cannot exceed quote", () => {
  const out = evaluateRootCanalQuote(base({ insurance: { mode: "entered_estimate", amount: "2000", sameScopeConfirmed: true } }));
  assert.equal(out.status, "invalid");
});

test("C005-11 published references do not participate in arithmetic", () => {
  const out = evaluateRootCanalQuote(base({ rootCanalAmount: "1377" }));
  assert.equal(out.totalCents, 137700);
});

test("C005-12 blank base differs from explicit zero", () => {
  assert.equal(evaluateRootCanalQuote(base({ rootCanalAmount: "" })).status, "invalid");
  assert.equal(evaluateRootCanalQuote(base({ rootCanalAmount: "0" })).status, "complete");
});

test("C005-13 aggregate technical ceiling is enforced", () => {
  const out = evaluateRootCanalQuote(base({ rootCanalAmount: "1000000", components: known({ other: { state: "separately_quoted", amount: "1" } }) }));
  assert.equal(out.status, "invalid");
});

test("C005 tooth count must be confirmed", () => {
  assert.equal(evaluateRootCanalQuote(base({ toothCountConfirmed: false })).status, "invalid");
});
