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

export function parseVeneerCount(raw) {
  const value = String(raw ?? '').trim();
  if (!/^\d+$/.test(value)) return { state: value === '' ? 'blank' : 'invalid', count: null };
  const count = Number(value);
  if (!Number.isInteger(count) || count < 1 || count > 32) return { state: 'invalid', count: null };
  return { state: 'valid', count };
}

function validCents(value) { return Number.isInteger(value) && value >= 0 && value <= MAX_MONEY_CENTS; }

export function computeVeneerQuote({ quoteBasis, quoteAmountCents, veneerCount = null, otherChargeStatus, otherChargeCents = null, insuranceMode, insurancePaymentCents = null, insuranceScopeConfirmed = null }) {
  const unresolved = [];
  const warnings = [];
  let baseTotalCents = null;

  if (!validCents(quoteAmountCents)) unresolved.push('quote_amount');
  if (quoteBasis === 'total_quote' && validCents(quoteAmountCents)) baseTotalCents = quoteAmountCents;
  else if (quoteBasis === 'per_veneer') {
    if (!Number.isInteger(veneerCount) || veneerCount < 1 || veneerCount > 32) unresolved.push('veneer_count');
    else if (validCents(quoteAmountCents)) {
      const multiplied = quoteAmountCents * veneerCount;
      if (Number.isSafeInteger(multiplied) && multiplied <= MAX_MONEY_CENTS) baseTotalCents = multiplied;
      else unresolved.push('quote_total_limit');
    }
  } else if (quoteBasis !== 'total_quote') unresolved.push('quote_basis');

  const validOther = new Set(['included','separate_charge','not_listed','not_sure']);
  if (!validOther.has(otherChargeStatus)) unresolved.push('other_charge_status');
  let knownTotalCents = baseTotalCents;
  let quoteScopeComplete = false;
  if (otherChargeStatus === 'included') quoteScopeComplete = baseTotalCents !== null;
  else if (otherChargeStatus === 'separate_charge') {
    if (!validCents(otherChargeCents)) unresolved.push('other_charge');
    else if (baseTotalCents !== null && baseTotalCents + otherChargeCents <= MAX_MONEY_CENTS) { knownTotalCents = baseTotalCents + otherChargeCents; quoteScopeComplete = true; }
    else if (baseTotalCents !== null) unresolved.push('quote_total_limit');
  } else if (otherChargeStatus === 'not_listed' || otherChargeStatus === 'not_sure') unresolved.push('quote_scope');

  let patientAmountCents = null;
  if (insuranceMode === 'none') {
    if (quoteScopeComplete && knownTotalCents !== null) patientAmountCents = knownTotalCents;
  } else if (insuranceMode === 'user_estimate') {
    if (!validCents(insurancePaymentCents)) unresolved.push('insurance_payment');
    if (insuranceScopeConfirmed !== 'same_scope') unresolved.push('insurance_scope');
    if (quoteScopeComplete && knownTotalCents !== null && validCents(insurancePaymentCents) && insuranceScopeConfirmed === 'same_scope') {
      patientAmountCents = Math.max(knownTotalCents - insurancePaymentCents, 0);
      if (insurancePaymentCents > knownTotalCents) warnings.push('insurance_exceeds_quote');
    }
  } else if (insuranceMode === 'unknown') unresolved.push('insurance');
  else unresolved.push('insurance_mode');

  return { baseTotalCents, knownTotalCents, quoteScopeComplete, patientAmountCents, unresolved: [...new Set(unresolved)], warnings };
}

export function formatMoney(cents) {
  if (!validCents(cents)) return '—';
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
}
