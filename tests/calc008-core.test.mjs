import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { evaluateQuote, formatUsd, parseUsdToCents } from "../src/assets/calc008-core.mjs";

const fixtureFile = new URL("./quote-input-fixtures.json", import.meta.url);
const shared = JSON.parse(await readFile(fixtureFile, "utf8"));

function centsToInput(cents) {
  if (cents === null) return "";
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  return `${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`;
}

function validComponents(overrides = {}) {
  return {
    imaging: { state: "not_on_quote", amount: "" },
    sedation: { state: "not_on_quote", amount: "" },
    graft: { state: "not_on_quote", amount: "" },
    other: { state: "not_on_quote", amount: "" },
    ...overrides,
  };
}

function fromFixture(fixture) {
  const insuranceMode = fixture.mode === "no_insurance" ? "none" : fixture.mode;
  return {
    basis: "itemized",
    itemized: fixture.line_totals.map((cents, index) => ({
      label: `Extraction line ${index + 1}`,
      scope: `Tooth ${String.fromCharCode(65 + index)}`,
      amount: centsToInput(cents),
    })),
    components: validComponents(),
    insurance: {
      mode: insuranceMode,
      amount: insuranceMode === "entered_estimate" ? centsToInput(fixture.insurer_estimate) : "",
      sameScopeConfirmed: insuranceMode === "entered_estimate",
    },
  };
}

for (const fixture of shared.fixtures) {
  test(`shared fixture ${fixture.id}: ${fixture.note}`, () => {
    const outcome = evaluateQuote(fromFixture(fixture));
    assert.equal(outcome.totalCents, fixture.expected_total);
    assert.equal(outcome.patientCents, fixture.expected_patient);
    if (fixture.expected_total === null) assert.equal(outcome.status, "invalid");
    else assert.equal(outcome.status, "valid");
  });
}

test("money parser distinguishes blank from explicit zero", () => {
  assert.equal(parseUsdToCents("").ok, false);
  assert.deepEqual(parseUsdToCents("0"), { ok: true, cents: 0 });
  assert.deepEqual(parseUsdToCents("0.00"), { ok: true, cents: 0 });
});

test("money parser rejects malformed, excess-precision and over-limit values", () => {
  for (const value of ["1,000", "1.001", "NaN", "Infinity", "-1", "1000000.01"]) {
    assert.equal(parseUsdToCents(value).ok, false, value);
  }
});

test("bundle mode counts only the bundle and separately billed components", () => {
  const outcome = evaluateQuote({
    basis: "bundle",
    bundle: { label: "Surgical extraction", scope: "Tooth A", amount: "300.00" },
    itemized: [{ label: "Hidden stale line", scope: "Tooth B", amount: "999.00" }],
    components: validComponents({
      imaging: { state: "included", amount: "900.00" },
      sedation: { state: "separately_billed", amount: "50.00" },
    }),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
  });
  assert.equal(outcome.status, "valid");
  assert.equal(outcome.totalCents, 35000);
});

test("unknown component permits only a visibly incomplete subtotal", () => {
  const outcome = evaluateQuote({
    basis: "bundle",
    bundle: { label: "Simple extraction", scope: "Tooth A", amount: "200.00" },
    components: validComponents({ graft: { state: "unknown", amount: "" } }),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
  });
  assert.equal(outcome.status, "incomplete");
  assert.equal(outcome.subtotalCents, 20000);
  assert.equal(outcome.totalCents, null);
  assert.equal(outcome.patientCents, null);
});

test("unknown insurance suppresses patient share without hiding quote total", () => {
  const outcome = evaluateQuote({
    basis: "bundle",
    bundle: { label: "Simple extraction", scope: "Tooth A", amount: "200.00" },
    components: validComponents(),
    insurance: { mode: "unknown", amount: "", sameScopeConfirmed: false },
  });
  assert.equal(outcome.status, "valid");
  assert.equal(outcome.totalCents, 20000);
  assert.equal(outcome.patientCents, null);
});

test("same-scope confirmation is required for entered insurance", () => {
  const outcome = evaluateQuote({
    basis: "bundle",
    bundle: { label: "Simple extraction", scope: "Tooth A", amount: "200.00" },
    components: validComponents(),
    insurance: { mode: "entered_estimate", amount: "100.00", sameScopeConfirmed: false },
  });
  assert.equal(outcome.status, "invalid");
  assert.ok(outcome.errors.some((error) => error.code === "scope_not_confirmed"));
});

test("exact duplicate service/scope rows are rejected", () => {
  const outcome = evaluateQuote({
    basis: "itemized",
    itemized: [
      { label: "Surgical extraction", scope: "Tooth A", amount: "200.00" },
      { label: " surgical  extraction ", scope: " tooth a ", amount: "100.00" },
    ],
    components: validComponents(),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
  });
  assert.equal(outcome.status, "invalid");
  assert.ok(outcome.errors.some((error) => error.code === "duplicate_line"));
});

test("wisdom-tooth labels route away and never calculate", () => {
  const outcome = evaluateQuote({
    basis: "bundle",
    bundle: { label: "Wisdom tooth extraction", scope: "Quoted procedure", amount: "200.00" },
    components: validComponents(),
    insurance: { mode: "none", amount: "", sameScopeConfirmed: false },
  });
  assert.equal(outcome.status, "invalid");
  const error = outcome.errors.find((entry) => entry.code === "wisdom_excluded");
  assert.equal(error.route, "/wisdom-teeth-removal-cost/");
});

test("USD formatting always shows two decimals", () => {
  assert.equal(formatUsd(3), "$0.03");
  assert.equal(formatUsd(10000), "$100.00");
});
