export const MAX_CENTS = 100_000_000;

export const IMPLANT_COMPONENTS = [
  { id: "implant", label: "Implant body / process" },
  { id: "abutment", label: "Abutment" },
  { id: "crown", label: "Final crown / prosthesis" },
  { id: "extraction", label: "Tooth extraction" },
  { id: "graft", label: "Bone graft" },
  { id: "imaging", label: "Exam or imaging" },
  { id: "sedation", label: "Sedation or anesthesia" },
  { id: "other", label: "Other quoted adjunct" },
];

export const ARCH_COMPONENTS = [
  { id: "implant", label: "Implant placement" },
  { id: "abutment", label: "Abutments" },
  { id: "temporary", label: "Temporary / provisional prosthesis" },
  { id: "final", label: "Final prosthesis" },
  { id: "extraction", label: "Extractions" },
  { id: "graft", label: "Bone grafting" },
  { id: "imaging", label: "Exam or imaging" },
  { id: "sedation", label: "Sedation or anesthesia" },
  { id: "followup", label: "Follow-up / adjustment visits" },
  { id: "other", label: "Other quoted component" },
];

const COMPONENT_STATES = new Set(["included", "separately_quoted", "not_on_quote", "unknown"]);
const INSURANCE_MODES = new Set(["none", "entered_estimate", "unknown"]);
const ITEM_SCOPES = new Set(["per_tooth", "case_total", "other_explicit_scope"]);

export function parseUsdToCents(value) {
  if (typeof value !== "string") return { ok: false, reason: "Enter an amount." };
  const text = value.trim();
  if (!text) return { ok: false, reason: "Enter an amount; blank is different from zero." };
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) {
    return { ok: false, reason: "Use USD with no commas and no more than two decimal places." };
  }
  const [wholeText, decimalText = ""] = text.split(".");
  const whole = Number(wholeText);
  const fraction = Number(decimalText.padEnd(2, "0"));
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

function addError(errors, field, code, message) {
  errors.push({ field, code, message });
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function readInteger(value, min, max, field, label, errors) {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) {
    addError(errors, field, "invalid_integer", `${label} must be a whole number from ${min} to ${max}.`);
    return null;
  }
  const number = Number(text);
  if (!Number.isInteger(number) || number < min || number > max) {
    addError(errors, field, "integer_out_of_range", `${label} must be from ${min} to ${max}.`);
    return null;
  }
  return number;
}

function evaluateInsurance(input, subtotalCents, scopeComplete, errors) {
  const mode = input?.mode ?? "";
  if (!INSURANCE_MODES.has(mode)) {
    addError(errors, "insurance.mode", "missing_insurance_mode", "Choose an insurance status.");
    return { mode, insurerCents: null, patientCents: null };
  }
  if (mode === "none") return { mode, insurerCents: 0, patientCents: scopeComplete ? subtotalCents : null };
  if (mode === "unknown") return { mode, insurerCents: null, patientCents: null };

  if (!input?.sameScopeConfirmed) {
    addError(errors, "insurance.sameScopeConfirmed", "scope_not_confirmed", "Confirm that the insurer estimate applies to the same quote scope.");
  }
  const parsed = parseUsdToCents(String(input?.amount ?? ""));
  if (!parsed.ok) {
    addError(errors, "insurance.amount", "invalid_amount", parsed.reason);
    return { mode, insurerCents: null, patientCents: null };
  }
  if (scopeComplete && parsed.cents > subtotalCents) {
    addError(errors, "insurance.amount", "insurance_over_total", "The insurer estimate cannot exceed the same-scope quote total.");
  }
  return {
    mode,
    insurerCents: parsed.cents,
    patientCents: scopeComplete ? subtotalCents - parsed.cents : null,
  };
}

function evaluateComponentRows(components, definitions, errors) {
  const rows = [];
  let addedCents = 0;
  let incomplete = false;
  for (const component of definitions) {
    const entry = components?.[component.id] ?? {};
    const state = entry.state ?? "";
    if (!COMPONENT_STATES.has(state)) {
      addError(errors, `components.${component.id}.state`, "missing_component_state", `Choose the quote status for ${component.label.toLowerCase()}.`);
      continue;
    }
    let amountCents = null;
    if (state === "separately_quoted") {
      const amountText = String(entry.amount ?? "").trim();
      if (!amountText) {
        incomplete = true;
      } else {
        const parsed = parseUsdToCents(amountText);
        if (!parsed.ok) addError(errors, `components.${component.id}.amount`, "invalid_amount", parsed.reason);
        else {
          amountCents = parsed.cents;
          addedCents += parsed.cents;
        }
      }
    }
    if (state === "unknown") incomplete = true;
    rows.push({ id: component.id, label: component.label, state, amountCents });
  }
  return { rows, addedCents, incomplete };
}

function finishResult({ errors, subtotalCents, incomplete, insurance, extra = {} }) {
  if (subtotalCents > MAX_CENTS) {
    addError(errors, "quote_total", "total_over_limit", "The combined quote total cannot exceed $1,000,000.00.");
  }
  if (errors.length) {
    return { status: "invalid", errors, subtotalCents: null, totalCents: null, insurerCents: null, patientCents: null, ...extra };
  }
  if (incomplete) {
    return {
      status: "incomplete",
      errors: [],
      subtotalCents,
      totalCents: subtotalCents,
      insurerCents: insurance.mode === "entered_estimate" ? insurance.insurerCents : null,
      patientCents: null,
      ...extra,
    };
  }
  return {
    status: "valid",
    errors: [],
    subtotalCents,
    totalCents: subtotalCents,
    insurerCents: insurance.insurerCents,
    patientCents: insurance.patientCents,
    ...extra,
  };
}

export function evaluateImplantQuote(input) {
  const errors = [];
  const toothCount = readInteger(input?.toothCount, 1, 32, "toothCount", "Tooth count", errors);
  const mode = input?.quoteMode ?? "";
  let subtotalCents = 0;
  let incomplete = false;
  let componentRows = [];
  const lineRows = [];

  if (mode === "bundle") {
    const parsed = parseUsdToCents(String(input?.bundleAmount ?? ""));
    if (!parsed.ok) addError(errors, "bundleAmount", "invalid_amount", parsed.reason);
    else subtotalCents = parsed.cents;
    const components = evaluateComponentRows(input?.components, IMPLANT_COMPONENTS, errors);
    subtotalCents += components.addedCents;
    incomplete ||= components.incomplete;
    componentRows = components.rows;
  } else if (mode === "itemized") {
    const lines = Array.isArray(input?.itemized) ? input.itemized : [];
    if (!lines.length) addError(errors, "itemized", "missing_lines", "Add at least one quoted line item.");
    const seen = new Set();
    lines.forEach((line, index) => {
      const label = String(line?.label ?? "").trim();
      const scope = String(line?.scope ?? "").trim();
      const amount = parseUsdToCents(String(line?.amount ?? ""));
      if (!label) addError(errors, `itemized.${index}.label`, "missing_label", "Enter the provider's line-item label.");
      if (!ITEM_SCOPES.has(scope)) addError(errors, `itemized.${index}.scope`, "invalid_scope", "Choose whether this line is per tooth, case total, or another explicit scope.");
      if (!amount.ok) addError(errors, `itemized.${index}.amount`, "invalid_amount", amount.reason);

      let quantity = 1;
      if (scope === "per_tooth") {
        if (line?.useToothCount === true) {
          if (toothCount !== null) quantity = toothCount;
          else quantity = 0;
        } else {
          quantity = readInteger(line?.quantity, 1, 32, `itemized.${index}.quantity`, "Quantity", errors) ?? 0;
        }
      } else if (scope === "other_explicit_scope") {
        quantity = readInteger(line?.quantity, 1, 100, `itemized.${index}.quantity`, "Explicit multiplier", errors) ?? 0;
      }

      if (label && ITEM_SCOPES.has(scope)) {
        const key = `${normalize(label)}|${normalize(scope)}`;
        if (seen.has(key)) addError(errors, `itemized.${index}.scope`, "duplicate_line", "This label and scope duplicate another quoted line.");
        seen.add(key);
      }

      const lineTotalCents = amount.ok ? amount.cents * quantity : null;
      if (lineTotalCents !== null) subtotalCents += lineTotalCents;
      lineRows.push({ label, scope, quantity, amountCents: amount.ok ? amount.cents : null, lineTotalCents });
    });
  } else {
    addError(errors, "quoteMode", "missing_quote_mode", "Choose a total quote or itemized quote.");
  }

  const scopeComplete = !incomplete;
  const insurance = evaluateInsurance(input?.insurance, subtotalCents, scopeComplete, errors);
  const perToothRaw = toothCount && subtotalCents >= 0 ? subtotalCents / toothCount : null;
  const perToothCents = perToothRaw === null ? null : Math.round(perToothRaw);
  const perToothApproximate = perToothRaw !== null && !Number.isInteger(perToothRaw);

  return finishResult({
    errors,
    subtotalCents,
    incomplete,
    insurance,
    extra: { toothCount, perToothCents, perToothApproximate, componentRows, lineRows },
  });
}

export function evaluateArchQuote(input, { allOn4 = false } = {}) {
  const errors = [];
  const quote = parseUsdToCents(String(input?.quotedTotal ?? ""));
  if (!quote.ok) addError(errors, "quotedTotal", "invalid_amount", quote.reason);

  let archCount = null;
  if (input?.archCount === "1" || input?.archCount === 1) archCount = 1;
  else if (input?.archCount === "2" || input?.archCount === 2) archCount = 2;
  else addError(errors, "archCount", "invalid_arch_count", "Choose whether the written quote covers one arch or two arches.");

  if (!input?.archScopeConfirmed) {
    addError(errors, "archScopeConfirmed", "arch_scope_not_confirmed", "Confirm that the written quote explicitly covers the selected number of arches.");
  }

  let restorationLabel = input?.restorationLabel ?? "not_stated";
  if (allOn4) restorationLabel = "all_on_4";
  else if (!new Set(["fixed", "removable", "not_stated"]).has(restorationLabel)) {
    addError(errors, "restorationLabel", "invalid_restoration_label", "Choose fixed, removable, or not stated.");
  }

  const components = evaluateComponentRows(input?.components, ARCH_COMPONENTS, errors);
  const subtotalCents = (quote.ok ? quote.cents : 0) + components.addedCents;
  let incomplete = components.incomplete;
  const temporary = components.rows.find((row) => row.id === "temporary");
  const final = components.rows.find((row) => row.id === "final");
  const prosthesisWarning = temporary?.state === "unknown" || final?.state === "unknown";
  if (prosthesisWarning) incomplete = true;

  const scopeComplete = !incomplete;
  const insurance = evaluateInsurance(input?.insurance, subtotalCents, scopeComplete, errors);
  const perArchRaw = archCount ? subtotalCents / archCount : null;
  const perArchCents = perArchRaw === null ? null : Math.round(perArchRaw);
  const perArchApproximate = perArchRaw !== null && !Number.isInteger(perArchRaw);

  return finishResult({
    errors,
    subtotalCents,
    incomplete,
    insurance,
    extra: {
      archCount,
      perArchCents,
      perArchApproximate,
      restorationLabel,
      componentRows: components.rows,
      prosthesisWarning,
      allOn4,
    },
  });
}
