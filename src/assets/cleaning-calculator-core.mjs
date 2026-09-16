export const CLEANING_COMPONENTS = [
  { id: "exam", label: "Dental exam" },
  { id: "xray", label: "X-rays" },
  { id: "fluoride", label: "Fluoride treatment" },
  { id: "other", label: "Other charge" },
];

const MAX_CENTS = 100_000_000;
const VALID_STATES = new Set(["included", "separately_quoted", "not_on_quote", "unknown"]);

export function parseCleaningUsd(value) {
  const raw = String(value ?? "").trim();
  if (raw === "") return { ok: false, reason: "blank is different from zero" };
  if (raw.includes(",")) return { ok: false, reason: "no commas" };
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return { ok: false, reason: "invalid money" };
  const [whole, fraction = ""] = raw.split(".");
  const cents = Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_CENTS) return { ok: false, reason: "$0.00 to $1,000,000.00" };
  return { ok: true, cents };
}

export function formatCleaningUsd(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function invalid(field, code, message) {
  return { field, code, message };
}

export function evaluateCleaningQuote(input) {
  const errors = [];
  const mode = input?.quoteMode;
  if (!new Set(["one_total", "separate_charges"]).has(mode)) errors.push(invalid("quoteMode", "missing_quote_mode", "Choose how the quote is written."));

  const baseField = mode === "separate_charges" ? "cleaningFee" : "writtenTotal";
  const baseParsed = parseCleaningUsd(input?.[baseField]);
  if (!baseParsed.ok) errors.push(invalid(baseField, "invalid_amount", baseParsed.reason));

  const componentRows = [];
  let additions = 0;
  let incomplete = false;

  for (const component of CLEANING_COMPONENTS) {
    const entry = input?.components?.[component.id] ?? {};
    const state = entry.state;
    if (!VALID_STATES.has(state)) {
      errors.push(invalid(`components.${component.id}.state`, "missing_component_state", `Choose what the quote says about ${component.label.toLowerCase()}.`));
      continue;
    }
    let amountCents = null;
    if (state === "separately_quoted") {
      const parsed = parseCleaningUsd(entry.amount);
      if (!parsed.ok) errors.push(invalid(`components.${component.id}.amount`, "invalid_amount", parsed.reason));
      else {
        amountCents = parsed.cents;
        additions += parsed.cents;
      }
    }
    if (state === "unknown") incomplete = true;
    componentRows.push({ ...component, state, amountCents });
  }

  const totalCents = baseParsed.ok ? baseParsed.cents + additions : null;
  if (totalCents !== null && totalCents > MAX_CENTS) errors.push(invalid("quoteTotal", "aggregate_over_limit", "The combined quote total is above the calculator's technical limit."));

  const insuranceMode = input?.insurance?.mode;
  if (!new Set(["none", "entered_estimate", "unknown"]).has(insuranceMode)) errors.push(invalid("insurance.mode", "missing_insurance_mode", "Choose what you know about insurance for this quote."));

  let insurerCents = null;
  if (insuranceMode === "none") insurerCents = 0;
  if (insuranceMode === "entered_estimate") {
    const parsed = parseCleaningUsd(input?.insurance?.amount);
    if (!parsed.ok) errors.push(invalid("insurance.amount", "invalid_amount", parsed.reason));
    else insurerCents = parsed.cents;
    if (!input?.insurance?.sameScopeConfirmed) errors.push(invalid("insurance.sameScopeConfirmed", "scope_not_confirmed", "Confirm that the insurance estimate covers the same quote."));
    if (parsed.ok && totalCents !== null && parsed.cents > totalCents) errors.push(invalid("insurance.amount", "insurance_over_total", "The insurance estimate cannot be more than the quote total."));
  }

  if (errors.length) return { status: "invalid", errors, componentRows, totalCents: null, insurerCents: null, patientCents: null };

  let patientCents = null;
  if (!incomplete && totalCents !== null) {
    if (insuranceMode === "none") patientCents = totalCents;
    if (insuranceMode === "entered_estimate") patientCents = totalCents - insurerCents;
  }

  return {
    status: incomplete ? "incomplete" : "complete",
    quoteMode: mode,
    totalCents,
    insurerCents,
    patientCents,
    componentRows,
  };
}
