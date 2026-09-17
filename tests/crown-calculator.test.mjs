import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCrownQuote } from "../src/assets/crown-calculator-core.mjs";

const known = (overrides = {}) => ({
  buildup: { state: "not_on_quote", amount: "" },
  examImaging: { state: "not_on_quote", amount: "" },
  other: { state: "not_on_quote", amount: "" },
  ...overrides,
});

function base(overrides = {}) {
  return {
    quoteMode: "one_total",
    crownCount: "1",
    crownCountConfirmed: true,
    writtenTotal: "1400",
    crownAmounts: [],
    crownMaterial: "not_stated",
    components: known(),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
    ...overrides,
  };
}

test("C022-01 one total complete no insurance", () => {
  const out = evaluateCrownQuote(base());
  assert.equal(out.status, "complete");
  assert.equal(out.totalCents, 140000);
  assert.equal(out.averagePerCrownCents, 140000);
  assert.equal(out.patientCents, 140000);
});

test("C022-02 itemized crowns sum", () => {
  const out = evaluateCrownQuote(base({ quoteMode: "itemized_crowns", crownCount: "2", writtenTotal: "", crownAmounts: ["1200", "1500"] }));
  assert.equal(out.totalCents, 270000);
  assert.equal(out.averagePerCrownCents, 135000);
});

test("C022-03 separate buildup adds to total but not crown average", () => {
  const out = evaluateCrownQuote(base({ components: known({ buildup: { state: "separately_quoted", amount: "250" } }) }));
  assert.equal(out.totalCents, 165000);
  assert.equal(out.averagePerCrownCents, 140000);
});

test("C022-04 unknown buildup makes scope incomplete", () => {
  const out = evaluateCrownQuote(base({ components: known({ buildup: { state: "unknown", amount: "" } }) }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 140000);
  assert.equal(out.patientCents, null);
});

test("C022-05 separate buildup with blank amount is invalid", () => {
  assert.equal(evaluateCrownQuote(base({ components: known({ buildup: { state: "separately_quoted", amount: "" } }) })).status, "invalid");
});

test("C022-06 itemized count mismatch is invalid", () => {
  assert.equal(evaluateCrownQuote(base({ quoteMode: "itemized_crowns", crownCount: "2", writtenTotal: "", crownAmounts: ["1200"] })).status, "invalid");
});

test("C022-07 crown count must be confirmed", () => {
  assert.equal(evaluateCrownQuote(base({ crownCountConfirmed: false })).status, "invalid");
});

test("C022-08 uneven division produces arithmetic average", () => {
  const out = evaluateCrownQuote(base({ crownCount: "2", writtenTotal: "2801" }));
  assert.equal(out.averagePerCrownCents, 140050);
});

test("C022-09 crown material is descriptive only", () => {
  const porcelain = evaluateCrownQuote(base({ crownMaterial: "porcelain" }));
  const metallic = evaluateCrownQuote(base({ crownMaterial: "metallic" }));
  assert.equal(porcelain.totalCents, metallic.totalCents);
  assert.notEqual(porcelain.crownMaterial, metallic.crownMaterial);
});

test("C022-10 same-scope insurer estimate subtracts", () => {
  const out = evaluateCrownQuote(base({ writtenTotal: "1500", insurance: { mode: "entered_estimate", amount: "500", sameScopeConfirmed: true } }));
  assert.equal(out.patientCents, 100000);
});

test("C022-11 insurer estimate cannot exceed quote", () => {
  assert.equal(evaluateCrownQuote(base({ insurance: { mode: "entered_estimate", amount: "1501", sameScopeConfirmed: true } })).status, "invalid");
});

test("C022-12 repair and recement references do not participate in arithmetic", () => {
  assert.equal(evaluateCrownQuote(base({ writtenTotal: "1377" })).totalCents, 137700);
});

test("C022-13 blank base differs from explicit zero", () => {
  assert.equal(evaluateCrownQuote(base({ writtenTotal: "" })).status, "invalid");
  assert.equal(evaluateCrownQuote(base({ writtenTotal: "0" })).status, "complete");
});

test("C022-14 aggregate technical ceiling is enforced", () => {
  assert.equal(evaluateCrownQuote(base({ writtenTotal: "1000000", components: known({ other: { state: "separately_quoted", amount: "1" } }) })).status, "invalid");
});
