export const MAX_MONEY_CENTS = 100_000_000;

export function parseMoneyToCents(raw) {
  const value = String(raw ?? '').trim();
  if (value === '') return { state: 'blank', cents: null };
  if (!/^\d+(?:\.\d{0,2})?$/.test(value)) return { state: 'invalid', cents: null };
  const [whole, fraction = ''] = value.split('.');
  const cents = Number(whole) * 100 + Number((fraction + '00').slice(0, 2));
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_MONEY_CENTS) return { state: 'invalid', cents: null };
  return { state: 'valid', cents };
}

function validCents(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY_CENTS;
}

export function computeOrthodonticQuote({
  treatmentQuoteCents,
  retainerStatus,
  retainerChargeCents = null,
  insuranceMode,
  insurancePaymentCents = null,
  insuranceScopeConfirmed = null,
}) {
  const unresolved = [];
  const warnings = [];

  if (!validCents(treatmentQuoteCents)) unresolved.push('treatment_quote');

  const validRetainerStates = new Set(['included', 'separate_charge', 'not_listed', 'not_sure']);
  if (!validRetainerStates.has(retainerStatus)) unresolved.push('retainer_status');

  let knownTotalCents = validCents(treatmentQuoteCents) ? treatmentQuoteCents : null;
  let quoteScopeComplete = false;

  if (retainerStatus === 'included') {
    quoteScopeComplete = validCents(treatmentQuoteCents);
  } else if (retainerStatus === 'separate_charge') {
    if (!validCents(retainerChargeCents)) {
      unresolved.push('retainer_charge');
    } else if (knownTotalCents !== null) {
      knownTotalCents += retainerChargeCents;
      quoteScopeComplete = true;
    }
  } else if (retainerStatus === 'not_listed' || retainerStatus === 'not_sure') {
    unresolved.push('retainer_scope');
  }

  let patientAmountCents = null;
  let insuranceAppliedCents = null;

  if (insuranceMode === 'none') {
    if (quoteScopeComplete && knownTotalCents !== null) patientAmountCents = knownTotalCents;
  } else if (insuranceMode === 'user_estimate') {
    if (!validCents(insurancePaymentCents)) unresolved.push('insurance_payment');
    if (insuranceScopeConfirmed !== 'same_scope') unresolved.push('insurance_scope');
    if (quoteScopeComplete && knownTotalCents !== null && validCents(insurancePaymentCents) && insuranceScopeConfirmed === 'same_scope') {
      insuranceAppliedCents = insurancePaymentCents;
      patientAmountCents = Math.max(knownTotalCents - insurancePaymentCents, 0);
      if (insurancePaymentCents > knownTotalCents) warnings.push('insurance_exceeds_quote');
    }
  } else if (insuranceMode === 'unknown') {
    unresolved.push('insurance');
  } else {
    unresolved.push('insurance_mode');
  }

  return {
    knownTotalCents,
    quoteScopeComplete,
    insuranceAppliedCents,
    patientAmountCents,
    unresolved: [...new Set(unresolved)],
    warnings,
  };
}

export function formatMoney(cents) {
  if (!validCents(cents)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
