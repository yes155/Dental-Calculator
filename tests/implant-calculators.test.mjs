import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCH_COMPONENTS,
  IMPLANT_COMPONENTS,
  evaluateArchQuote,
  evaluateImplantQuote,
  formatUsd,
  parseUsdToCents,
} from "../src/assets/implant-calculators-core.mjs";

function statuses(definitions, overrides = {}) {
  return Object.fromEntries(definitions.map(({ id }) => [id, overrides[id] ?? { state: "not_on_quote", amount: "" }]));
}

function noInsurance() {
  return { mode: "none", amount: "", sameScopeConfirmed: false };
}

function enteredInsurance(amount, sameScopeConfirmed = true) {
  return { mode: "entered_estimate", amount, sameScopeConfirmed };
}

test("shared money parser treats zero as valid and blank as invalid", () => {
  assert.equal(parseUsdToCents("").ok, false);
  assert.deepEqual(parseUsdToCents("0"), { ok: true, cents: 0 });
  assert.deepEqual(parseUsdToCents("0.00"), { ok: true, cents: 0 });
  assert.equal(parseUsdToCents("1,000").ok, false);
  assert.equal(parseUsdToCents("1.001").ok, false);
  assert.equal(parseUsdToCents("-1").ok, false);
  assert.equal(parseUsdToCents("1000000.01").ok, false);
  assert.equal(formatUsd(214300), "$2,143.00");
});

test("CALC-001 blank form is invalid", () => {
  const out = evaluateImplantQuote({});
  assert.equal(out.status, "invalid");
});

test("CALC-001 bundle zero is a valid explicit quote", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "1",
    bundleAmount: "0",
    components: statuses(IMPLANT_COMPONENTS),
    insurance: noInsurance(),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.totalCents, 0);
  assert.equal(out.patientCents, 0);
});

test("CALC-001 bundle 4000 one tooth normalizes to 4000 per tooth", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "1",
    bundleAmount: "4000",
    components: statuses(IMPLANT_COMPONENTS),
    insurance: noInsurance(),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.totalCents, 400000);
  assert.equal(out.perToothCents, 400000);
  assert.equal(out.patientCents, 400000);
});

test("CALC-001 bundle 8000 two teeth normalizes to 4000 per tooth", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "2",
    bundleAmount: "8000",
    components: statuses(IMPLANT_COMPONENTS),
    insurance: noInsurance(),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.perToothCents, 400000);
});

test("CALC-001 itemized implant plus abutment plus crown totals 3700", () => {
  const out = evaluateImplantQuote({
    quoteMode: "itemized",
    toothCount: "1",
    itemized: [
      { label: "Implant body", scope: "case_total", amount: "2000", quantity: "" },
      { label: "Abutment", scope: "case_total", amount: "500", quantity: "" },
      { label: "Crown", scope: "case_total", amount: "1200", quantity: "" },
    ],
    insurance: noInsurance(),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.totalCents, 370000);
});

test("CALC-001 explicit per-tooth amount can multiply by confirmed tooth count", () => {
  const out = evaluateImplantQuote({
    quoteMode: "itemized",
    toothCount: "2",
    itemized: [
      { label: "Implant body", scope: "per_tooth", amount: "2000", useToothCount: true },
    ],
    insurance: noInsurance(),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.totalCents, 400000);
});

test("CALC-001 unknown graft keeps known subtotal but marks incomplete", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "1",
    bundleAmount: "4000",
    components: statuses(IMPLANT_COMPONENTS, { graft: { state: "unknown", amount: "" } }),
    insurance: noInsurance(),
  });
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 400000);
  assert.equal(out.patientCents, null);
});

test("CALC-001 separate graft without amount is incomplete and not guessed", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "1",
    bundleAmount: "4000",
    components: statuses(IMPLANT_COMPONENTS, { graft: { state: "separately_quoted", amount: "" } }),
    insurance: noInsurance(),
  });
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 400000);
});

test("CALC-001 same-scope insurance estimate subtracts only entered amount", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "1",
    bundleAmount: "4000",
    components: statuses(IMPLANT_COMPONENTS),
    insurance: enteredInsurance("1000"),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.patientCents, 300000);
});

test("CALC-001 insurer estimate over subtotal is invalid", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "1",
    bundleAmount: "4000",
    components: statuses(IMPLANT_COMPONENTS),
    insurance: enteredInsurance("5000"),
  });
  assert.equal(out.status, "invalid");
  assert.ok(out.errors.some((e) => e.code === "insurance_over_total"));
});

test("CALC-001 duplicate itemized label and scope is invalid", () => {
  const out = evaluateImplantQuote({
    quoteMode: "itemized",
    toothCount: "1",
    itemized: [
      { label: "Crown", scope: "case_total", amount: "1000" },
      { label: " crown ", scope: "case_total", amount: "500" },
    ],
    insurance: noInsurance(),
  });
  assert.equal(out.status, "invalid");
  assert.ok(out.errors.some((e) => e.code === "duplicate_line"));
});

test("CALC-001 fractional per-tooth normalization is marked approximate", () => {
  const out = evaluateImplantQuote({
    quoteMode: "bundle",
    toothCount: "3",
    bundleAmount: "1000",
    components: statuses(IMPLANT_COMPONENTS),
    insurance: noInsurance(),
  });
  assert.equal(out.status, "valid");
  assert.equal(out.perToothCents, 33333);
  assert.equal(out.perToothApproximate, true);
});

function archInput(overrides = {}) {
  return {
    quotedTotal: "20000",
    archCount: "1",
    archScopeConfirmed: true,
    restorationLabel: "not_stated",
    components: statuses(ARCH_COMPONENTS),
    insurance: noInsurance(),
    ...overrides,
  };
}

test("CALC-003 blank is invalid", () => {
  const out = evaluateArchQuote({});
  assert.equal(out.status, "invalid");
});

test("CALC-003 20000 one arch normalizes to 20000", () => {
  const out = evaluateArchQuote(archInput());
  assert.equal(out.status, "valid");
  assert.equal(out.perArchCents, 2000000);
});

test("CALC-003 40000 two arches normalizes to 20000", () => {
  const out = evaluateArchQuote(archInput({ quotedTotal: "40000", archCount: "2" }));
  assert.equal(out.status, "valid");
  assert.equal(out.perArchCents, 2000000);
});

test("CALC-003 fractional cent division is approximate", () => {
  const out = evaluateArchQuote(archInput({ quotedTotal: "30001.01", archCount: "2" }));
  assert.equal(out.status, "valid");
  assert.equal(out.perArchCents, 1500051);
  assert.equal(out.perArchApproximate, true);
});

test("CALC-003 unknown final prosthesis yields incomplete warning", () => {
  const out = evaluateArchQuote(archInput({
    components: statuses(ARCH_COMPONENTS, { final: { state: "unknown", amount: "" } }),
  }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.prosthesisWarning, true);
});

test("CALC-003 separately quoted graft is added only when entered", () => {
  const out = evaluateArchQuote(archInput({
    quotedTotal: "25000",
    components: statuses(ARCH_COMPONENTS, { graft: { state: "separately_quoted", amount: "2000" } }),
  }));
  assert.equal(out.status, "valid");
  assert.equal(out.totalCents, 2700000);
});

test("CALC-003 separate graft without amount is incomplete", () => {
  const out = evaluateArchQuote(archInput({
    components: statuses(ARCH_COMPONENTS, { graft: { state: "separately_quoted", amount: "" } }),
  }));
  assert.equal(out.status, "incomplete");
  assert.equal(out.totalCents, 2000000);
});

test("CALC-003 insurance unknown suppresses patient estimate", () => {
  const out = evaluateArchQuote(archInput({ insurance: { mode: "unknown", amount: "", sameScopeConfirmed: false } }));
  assert.equal(out.status, "valid");
  assert.equal(out.patientCents, null);
});

test("CALC-003 same-scope insurer estimate subtracts", () => {
  const out = evaluateArchQuote(archInput({ quotedTotal: "30000", insurance: enteredInsurance("5000") }));
  assert.equal(out.status, "valid");
  assert.equal(out.patientCents, 2500000);
});

test("CALC-003 requires explicit arch-scope confirmation", () => {
  const out = evaluateArchQuote(archInput({ archScopeConfirmed: false }));
  assert.equal(out.status, "invalid");
  assert.ok(out.errors.some((e) => e.code === "arch_scope_not_confirmed"));
});

test("CALC-003 does not infer a restoration category", () => {
  const out = evaluateArchQuote(archInput({ restorationLabel: "not_stated" }));
  assert.equal(out.status, "valid");
  assert.equal(out.restorationLabel, "not_stated");
});

test("CALC-003-A04 uses same arithmetic but fixes descriptive mode to All-on-4", () => {
  const out = evaluateArchQuote(archInput({ quotedTotal: "15000" }), { allOn4: true });
  assert.equal(out.status, "valid");
  assert.equal(out.restorationLabel, "all_on_4");
  assert.equal(out.perArchCents, 1500000);
});

test("CALC-003-A04 two-arch quote is normalized from user input, not reference data", () => {
  const out = evaluateArchQuote(archInput({ quotedTotal: "30000", archCount: "2" }), { allOn4: true });
  assert.equal(out.status, "valid");
  assert.equal(out.perArchCents, 1500000);
});

test("CALC-003-A04 unknown final bridge produces high-priority prosthesis warning", () => {
  const out = evaluateArchQuote(archInput({
    components: statuses(ARCH_COMPONENTS, { final: { state: "unknown", amount: "" } }),
  }), { allOn4: true });
  assert.equal(out.status, "incomplete");
  assert.equal(out.prosthesisWarning, true);
});
