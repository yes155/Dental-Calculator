export const MAX_CENTS = 100_000_000;

export const COMPONENTS = [
  { id: "imaging", label: "Examination or imaging" },
  { id: "sedation", label: "Sedation or anesthesia" },
  { id: "graft", label: "Bone graft" },
  { id: "other", label: "Other quoted adjunct" },
];

const COMPONENT_STATES = new Set([
  "separately_billed",
  "included",
  "not_on_quote",
  "unknown",
]);

const INSURANCE_MODES = new Set(["none", "entered_estimate", "unknown"]);

export function parseUsdToCents(value) {
  if (typeof value !== "string") return { ok: false, reason: "Enter an amount." };
  const cleaned = value.trim();
  if (cleaned === "") return { ok: false, reason: "Enter an amount; blank is different from zero." };
  if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) {
    return { ok: false, reason: "Use USD with no commas and no more than two decimal places." };
  }

  const [wholeText, decimalText = ""] = cleaned.split(".");
  const whole = Number(wholeText);
  const fraction = Number(decimalText.padEnd(2, "0"));
  if (!Number.isSafeInteger(whole) || !Number.isSafeInteger(fraction)) {
    return { ok: false, reason: "Enter a valid amount." };
  }
  const cents = whole * 100 + fraction;
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_CENTS) {
    return { ok: false, reason: "Enter an amount from $0.00 to $1,000,000.00." };
  }
  return { ok: true, cents };
}

export function formatUsd(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function containsWisdomLabel(label, scope) {
  return /\bwisdom(?:[ -]tooth|[ -]teeth)?\b|\bthird[ -]molar(?:s)?\b/i.test(`${label} ${scope}`);
}

function addError(errors, field, code, message, route = null) {
  errors.push({ field, code, message, route });
}

function readQuoteLine(line, fieldPrefix, errors) {
  const label = String(line?.label ?? "").trim();
  const scope = String(line?.scope ?? "").trim();
  if (!label) addError(errors, `${fieldPrefix}.label`, "missing_label", "Enter the provider's service or category label.");
  if (!scope) addError(errors, `${fieldPrefix}.scope`, "missing_scope", "Enter the tooth identifier or explicitly grouped scope.");
  if (containsWisdomLabel(label, scope)) {
    addError(
      errors,
      `${fieldPrefix}.label`,
      "wisdom_excluded",
      "Wisdom-tooth quotes belong in the wisdom-teeth cost tool.",
      "/wisdom-teeth-removal-cost/",
    );
  }
  const parsed = parseUsdToCents(String(line?.amount ?? ""));
  if (!parsed.ok) addError(errors, `${fieldPrefix}.amount`, "invalid_amount", parsed.reason);
  return { label, scope, cents: parsed.ok ? parsed.cents : null };
}

export function evaluateQuote(input) {
  const errors = [];
  const quoteLines = [];
  const scopeRows = [];
  const basis = input?.basis ?? "";

  if (basis === "bundle") {
    quoteLines.push(readQuoteLine(input.bundle, "bundle", errors));
  } else if (basis === "itemized") {
    const lines = Array.isArray(input.itemized) ? input.itemized : [];
    if (lines.length === 0) {
      addError(errors, "itemized", "missing_lines", "Add at least one provider-quoted extraction line.");
    }
    lines.forEach((line, index) => quoteLines.push(readQuoteLine(line, `itemized.${index}`, errors)));

    const seen = new Set();
    quoteLines.forEach((line, index) => {
      if (!line.label || !line.scope) return;
      const key = `${normalize(line.label)}|${normalize(line.scope)}`;
      if (seen.has(key)) {
        addError(
          errors,
          `itemized.${index}.scope`,
          "duplicate_line",
          "This service and tooth/scope duplicate another line. Keep an explicitly grouped quote as one labeled line.",
        );
      }
      seen.add(key);
    });
  } else {
    addError(errors, "basis", "missing_basis", "Choose a complete bundle or itemized quote lines.");
  }

  let subtotalCents = quoteLines.reduce((sum, line) => sum + (line.cents ?? 0), 0);
  let hasUnknownScope = false;

  for (const component of COMPONENTS) {
    const entry = input?.components?.[component.id] ?? {};
    const state = entry.state ?? "";
    if (!COMPONENT_STATES.has(state)) {
      addError(errors, `components.${component.id}.state`, "missing_component_state", `Choose the quote status for ${component.label.toLowerCase()}.`);
      continue;
    }
    if (state === "separately_billed") {
      const parsed = parseUsdToCents(String(entry.amount ?? ""));
      if (!parsed.ok) {
        addError(errors, `components.${component.id}.amount`, "invalid_amount", parsed.reason);
      } else {
        subtotalCents += parsed.cents;
      }
    }
    if (state === "unknown") hasUnknownScope = true;
    scopeRows.push({ id: component.id, label: component.label, state });
  }

  if (subtotalCents > MAX_CENTS) {
    addError(errors, "quote_total", "total_over_limit", "The combined quote total cannot exceed $1,000,000.00.");
  }

  const insuranceMode = input?.insurance?.mode ?? "";
  let insurerCents = null;
  if (!INSURANCE_MODES.has(insuranceMode)) {
    addError(errors, "insurance.mode", "missing_insurance_mode", "Choose an insurance status.");
  } else if (insuranceMode === "none") {
    insurerCents = 0;
  } else if (insuranceMode === "entered_estimate") {
    if (!input?.insurance?.sameScopeConfirmed) {
      addError(errors, "insurance.sameScopeConfirmed", "scope_not_confirmed", "Confirm that the insurer estimate covers the same quote lines and scope.");
    }
    const parsed = parseUsdToCents(String(input?.insurance?.amount ?? ""));
    if (!parsed.ok) {
      addError(errors, "insurance.amount", "invalid_amount", parsed.reason);
    } else {
      insurerCents = parsed.cents;
      if (!hasUnknownScope && parsed.cents > subtotalCents) {
        addError(errors, "insurance.amount", "insurance_over_total", "The insurer estimate cannot exceed the same-scope quote total.");
      }
    }
  }

  if (errors.length) {
    return {
      status: "invalid",
      errors,
      subtotalCents: null,
      totalCents: null,
      insurerCents: null,
      patientCents: null,
      scopeRows,
    };
  }

  if (hasUnknownScope) {
    return {
      status: "incomplete",
      errors: [],
      subtotalCents,
      totalCents: null,
      insurerCents: insuranceMode === "entered_estimate" ? insurerCents : null,
      patientCents: null,
      scopeRows,
    };
  }

  const patientCents = insuranceMode === "unknown" ? null : subtotalCents - insurerCents;
  return {
    status: "valid",
    errors: [],
    subtotalCents,
    totalCents: subtotalCents,
    insurerCents,
    patientCents,
    scopeRows,
  };
}

