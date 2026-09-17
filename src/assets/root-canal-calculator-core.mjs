export const ROOT_CANAL_COMPONENTS = [
  { id: "restoration", label: "Final restoration" },
  { id: "buildupPost", label: "Build-up or post" },
  { id: "imagingExam", label: "Exam or imaging" },
  { id: "other", label: "Other charge" },
];

const MAX_CENTS = 100_000_000;
const VALID_STATES = new Set(["included", "separately_quoted", "not_on_quote", "unknown"]);
const VALID_MODES = new Set(["one_total", "itemized"]);
const VALID_INSURANCE = new Set(["none", "entered_estimate", "unknown"]);

export function parseRootCanalUsd(value) {
  const raw = String(value ?? "").trim();
  if (raw === "") return { ok: false, reason: "blank is different from zero" };
  if (raw.includes(",")) return { ok: false, reason: "no commas" };
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return { ok: false, reason: "invalid money" };
  const [whole, fraction = ""] = raw.split(".");
  const cents = Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_CENTS) return { ok: false, reason: "$0.00 to $1,000,000.00" };
  return { ok: true, cents };
}

export function formatRootCanalUsd(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

const invalid = (field, code, message) => ({ field, code, message });

export function evaluateRootCanalQuote(input) {
  const errors = [];
  const mode = input?.quoteMode;
  if (!VALID_MODES.has(mode)) errors.push(invalid("quoteMode", "missing_quote_mode", "Choose how the root-canal quote is written."));

  const count = Number(input?.toothCount);
  if (!Number.isInteger(count) || count < 1 || count > 32) errors.push(invalid("toothCount", "invalid_tooth_count", "Choose the number of treated teeth shown on the written quote."));
  if (!input?.toothCountConfirmed) errors.push(invalid("toothCountConfirmed", "tooth_scope_not_confirmed", "Confirm that the tooth count comes from the written quote."));

  const baseParsed = parseRootCanalUsd(input?.rootCanalAmount);
  if (!baseParsed.ok) errors.push(invalid("rootCanalAmount", "invalid_amount", baseParsed.reason));

  let additions = 0;
  let incomplete = false;
  const componentRows = [];

  for (const component of ROOT_CANAL_COMPONENTS) {
    const entry = input?.components?.[component.id] ?? {};
    const state = entry.state;
    if (!VALID_STATES.has(state)) {
      errors.push(invalid(`components.${component.id}.state`, "missing_component_state", `Choose what the quote says about ${component.label.toLowerCase()}.`));
      continue;
    }
    let amountCents = null;
    if (state === "separately_quoted") {
      const parsed = parseRootCanalUsd(entry.amount);
      if (!parsed.ok) errors.push(invalid(`components.${component.id}.amount`, "invalid_amount", parsed.reason));
      else {
        amountCents = parsed.cents;
        additions += parsed.cents;
      }
    }
    if (state === "unknown") incomplete = true;
    componentRows.push({ ...component, state, amountCents, labelValue: entry.label ?? null });
  }

  const totalCents = baseParsed.ok ? baseParsed.cents + additions : null;
  if (totalCents !== null && totalCents > MAX_CENTS) errors.push(invalid("quoteTotal", "aggregate_over_limit", "The combined quote total is above the calculator's technical limit."));

  const insuranceMode = input?.insurance?.mode;
  if (!VALID_INSURANCE.has(insuranceMode)) errors.push(invalid("insurance.mode", "missing_insurance_mode", "Choose what you know about insurance for this quote."));

  let insurerCents = null;
  if (insuranceMode === "none") insurerCents = 0;
  if (insuranceMode === "entered_estimate") {
    const parsed = parseRootCanalUsd(input?.insurance?.amount);
    if (!parsed.ok) errors.push(invalid("insurance.amount", "invalid_amount", parsed.reason));
    else insurerCents = parsed.cents;
    if (!input?.insurance?.sameScopeConfirmed) errors.push(invalid("insurance.sameScopeConfirmed", "scope_not_confirmed", "Confirm that the insurance estimate covers this same written quote."));
    if (parsed.ok && totalCents !== null && parsed.cents > totalCents) errors.push(invalid("insurance.amount", "insurance_over_total", "The insurance estimate cannot be more than the quote total."));
  }

  if (errors.length) return { status: "invalid", errors, totalCents: null, patientCents: null, insurerCents: null, componentRows };

  const averagePerToothCents = Math.round(totalCents / count);
  const averageApproximate = totalCents % count !== 0;
  let patientCents = null;
  if (!incomplete) {
    if (insuranceMode === "none") patientCents = totalCents;
    if (insuranceMode === "entered_estimate") patientCents = totalCents - insurerCents;
  }

  return {
    status: incomplete ? "incomplete" : "complete",
    quoteMode: mode,
    toothCount: count,
    toothCategory: input?.toothCategory ?? "not_stated",
    retreatmentFlag: input?.retreatmentFlag ?? "not_stated",
    totalCents,
    averagePerToothCents,
    averageApproximate,
    insurerCents,
    patientCents,
    componentRows,
  };
}
