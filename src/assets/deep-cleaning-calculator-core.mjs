const MAX_CENTS = 100_000_000;
const VALID_STATES = new Set(["included", "separately_quoted", "not_on_quote", "unknown"]);

export function parseDeepCleaningUsd(value) {
  const raw = String(value ?? "").trim();
  if (raw === "") return { ok: false, reason: "blank is different from zero" };
  if (raw.includes(",")) return { ok: false, reason: "no commas" };
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return { ok: false, reason: "invalid money" };
  const [whole, fraction = ""] = raw.split(".");
  const cents = Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_CENTS) return { ok: false, reason: "$0.00 to $1,000,000.00" };
  return { ok: true, cents };
}

export function formatDeepCleaningUsd(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function error(field, code, message) { return { field, code, message }; }

export function evaluateDeepCleaningQuote(input) {
  const errors = [];
  const mode = input?.quoteMode;
  if (!new Set(["one_total", "separate_quadrant_charges"]).has(mode)) errors.push(error("quoteMode", "missing_quote_mode", "Choose how the written quote is organized."));

  const count = Number(input?.quadrantCount);
  if (!Number.isInteger(count) || count < 1 || count > 4) errors.push(error("quadrantCount", "invalid_quadrant_count", "Choose 1 to 4 quadrants exactly as stated on the written quote."));
  if (!input?.quadrantCountConfirmed) errors.push(error("quadrantCountConfirmed", "quadrant_scope_not_confirmed", "Confirm that the quadrant count comes from the written quote."));

  let baseCents = null;
  let averageCents = null;
  let averageApproximate = false;

  if (mode === "one_total") {
    const parsed = parseDeepCleaningUsd(input?.writtenTotal);
    if (!parsed.ok) errors.push(error("writtenTotal", "invalid_amount", parsed.reason));
    else {
      baseCents = parsed.cents;
      if (Number.isInteger(count) && count >= 1 && count <= 4) {
        averageCents = Math.round(baseCents / count);
        averageApproximate = baseCents % count !== 0;
      }
    }
  }

  if (mode === "separate_quadrant_charges") {
    let sum = 0;
    if (Number.isInteger(count) && count >= 1 && count <= 4) {
      for (let i = 0; i < count; i += 1) {
        const parsed = parseDeepCleaningUsd(input?.quadrantCharges?.[i]);
        if (!parsed.ok) errors.push(error(`quadrantCharges.${i}`, "invalid_amount", parsed.reason));
        else sum += parsed.cents;
      }
      if (!errors.some(e => e.field.startsWith("quadrantCharges."))) {
        baseCents = sum;
        averageCents = Math.round(sum / count);
        averageApproximate = sum % count !== 0;
      }
    }
  }

  let incomplete = false;
  let adjunctCents = 0;
  const adjunctRows = [];
  for (const id of ["anesthesia", "other"]) {
    const entry = input?.adjuncts?.[id] ?? {};
    if (!VALID_STATES.has(entry.state)) {
      errors.push(error(`adjuncts.${id}.state`, "missing_adjunct_state", `Choose what the quote says about ${id === "anesthesia" ? "anesthesia" : "other charges"}.`));
      continue;
    }
    let amountCents = null;
    if (entry.state === "separately_quoted") {
      const parsed = parseDeepCleaningUsd(entry.amount);
      if (!parsed.ok) errors.push(error(`adjuncts.${id}.amount`, "invalid_amount", parsed.reason));
      else { amountCents = parsed.cents; adjunctCents += parsed.cents; }
    }
    if (entry.state === "unknown") incomplete = true;
    adjunctRows.push({ id, state: entry.state, amountCents });
  }

  const totalCents = baseCents === null ? null : baseCents + adjunctCents;
  if (totalCents !== null && totalCents > MAX_CENTS) errors.push(error("quoteTotal", "aggregate_over_limit", "The combined quote total is above the calculator's technical limit."));

  const insuranceMode = input?.insurance?.mode;
  if (!new Set(["none", "entered_estimate", "unknown"]).has(insuranceMode)) errors.push(error("insurance.mode", "missing_insurance_mode", "Choose what you know about insurance for this quote."));

  let insurerCents = null;
  if (insuranceMode === "none") insurerCents = 0;
  if (insuranceMode === "entered_estimate") {
    const parsed = parseDeepCleaningUsd(input?.insurance?.amount);
    if (!parsed.ok) errors.push(error("insurance.amount", "invalid_amount", parsed.reason));
    else insurerCents = parsed.cents;
    if (!input?.insurance?.sameScopeConfirmed) errors.push(error("insurance.sameScopeConfirmed", "scope_not_confirmed", "Confirm that the insurance estimate covers this same quote."));
    if (parsed.ok && totalCents !== null && parsed.cents > totalCents) errors.push(error("insurance.amount", "insurance_over_total", "The insurance estimate cannot be more than the quote total."));
  }

  if (errors.length) return { status: "invalid", errors, totalCents: null, baseCents: null, averageCents: null, patientCents: null, insurerCents: null, adjunctRows: [] };

  let patientCents = null;
  if (!incomplete && totalCents !== null) {
    if (insuranceMode === "none") patientCents = totalCents;
    if (insuranceMode === "entered_estimate") patientCents = totalCents - insurerCents;
  }

  return { status: incomplete ? "incomplete" : "complete", quoteMode: mode, quadrantCount: count, baseCents, totalCents, averageCents, averageApproximate, insurerCents, patientCents, adjunctRows };
}
