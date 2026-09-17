export const CROWN_COMPONENTS = [
  { id: "buildup", label: "Build-up or foundation" },
  { id: "examImaging", label: "Exam or imaging" },
  { id: "other", label: "Other charge" },
];

const MAX_CENTS = 100_000_000;
const VALID_STATES = new Set(["included", "separately_quoted", "not_on_quote", "unknown"]);
const VALID_MODES = new Set(["one_total", "itemized_crowns"]);
const VALID_INSURANCE = new Set(["none", "entered_estimate", "unknown"]);

export function parseCrownUsd(value) {
  const raw = String(value ?? "").trim();
  if (raw === "") return { ok: false, reason: "blank is different from zero" };
  if (raw.includes(",")) return { ok: false, reason: "no commas" };
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return { ok: false, reason: "invalid money" };
  const [whole, fraction = ""] = raw.split(".");
  const cents = Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_CENTS) return { ok: false, reason: "$0.00 to $1,000,000.00" };
  return { ok: true, cents };
}

export function formatCrownUsd(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

const invalid = (field, code, message) => ({ field, code, message });

export function evaluateCrownQuote(input) {
  const errors = [];
  const mode = input?.quoteMode;
  if (!VALID_MODES.has(mode)) errors.push(invalid("quoteMode", "missing_quote_mode", "Choose how the crown quote is written."));

  const count = Number(input?.crownCount);
  if (!Number.isInteger(count) || count < 1 || count > 32) errors.push(invalid("crownCount", "invalid_crown_count", "Choose the number of crowns shown on the written quote."));
  if (!input?.crownCountConfirmed) errors.push(invalid("crownCountConfirmed", "crown_scope_not_confirmed", "Confirm that the crown count comes from the written quote."));

  let baseCents = null;
  if (mode === "one_total") {
    const parsed = parseCrownUsd(input?.writtenTotal);
    if (!parsed.ok) errors.push(invalid("writtenTotal", "invalid_amount", parsed.reason));
    else baseCents = parsed.cents;
  }
  if (mode === "itemized_crowns") {
    const amounts = Array.isArray(input?.crownAmounts) ? input.crownAmounts : [];
    if (Number.isInteger(count) && amounts.length !== count) errors.push(invalid("crownAmounts", "crown_count_mismatch", "Enter one amount for each crown shown on the quote."));
    let sum = 0;
    for (let i = 0; i < amounts.length; i += 1) {
      const parsed = parseCrownUsd(amounts[i]);
      if (!parsed.ok) errors.push(invalid(`crownAmounts.${i}`, "invalid_amount", parsed.reason));
      else sum += parsed.cents;
    }
    if (!errors.some(error => error.field === "crownAmounts" || error.field.startsWith("crownAmounts."))) baseCents = sum;
  }

  let additions = 0;
  let incomplete = false;
  const componentRows = [];
  for (const component of CROWN_COMPONENTS) {
    const entry = input?.components?.[component.id] ?? {};
    const state = entry.state;
    if (!VALID_STATES.has(state)) {
      errors.push(invalid(`components.${component.id}.state`, "missing_component_state", `Choose what the quote says about ${component.label.toLowerCase()}.`));
      continue;
    }
    let amountCents = null;
    if (state === "separately_quoted") {
      const parsed = parseCrownUsd(entry.amount);
      if (!parsed.ok) errors.push(invalid(`components.${component.id}.amount`, "invalid_amount", parsed.reason));
      else {
        amountCents = parsed.cents;
        additions += parsed.cents;
      }
    }
    if (state === "unknown") incomplete = true;
    componentRows.push({ ...component, state, amountCents });
  }

  const totalCents = baseCents === null ? null : baseCents + additions;
  if (totalCents !== null && totalCents > MAX_CENTS) errors.push(invalid("quoteTotal", "aggregate_over_limit", "The combined quote total is above the calculator's technical limit."));

  const insuranceMode = input?.insurance?.mode;
  if (!VALID_INSURANCE.has(insuranceMode)) errors.push(invalid("insurance.mode", "missing_insurance_mode", "Choose what you know about insurance for this quote."));

  let insurerCents = null;
  if (insuranceMode === "none") insurerCents = 0;
  if (insuranceMode === "entered_estimate") {
    const parsed = parseCrownUsd(input?.insurance?.amount);
    if (!parsed.ok) errors.push(invalid("insurance.amount", "invalid_amount", parsed.reason));
    else insurerCents = parsed.cents;
    if (!input?.insurance?.sameScopeConfirmed) errors.push(invalid("insurance.sameScopeConfirmed", "scope_not_confirmed", "Confirm that the insurance estimate covers this same written quote."));
    if (parsed.ok && totalCents !== null && parsed.cents > totalCents) errors.push(invalid("insurance.amount", "insurance_over_total", "The insurance estimate cannot be more than the quote total."));
  }

  if (errors.length) return { status: "invalid", errors, totalCents: null, patientCents: null, insurerCents: null, componentRows };

  const averagePerCrownCents = Math.round(baseCents / count);
  const averageApproximate = baseCents % count !== 0;
  let patientCents = null;
  if (!incomplete) {
    if (insuranceMode === "none") patientCents = totalCents;
    if (insuranceMode === "entered_estimate") patientCents = totalCents - insurerCents;
  }

  return {
    status: incomplete ? "incomplete" : "complete",
    quoteMode: mode,
    crownCount: count,
    crownMaterial: input?.crownMaterial ?? "not_stated",
    totalCents,
    baseCents,
    averagePerCrownCents,
    averageApproximate,
    insurerCents,
    patientCents,
    componentRows,
  };
}
