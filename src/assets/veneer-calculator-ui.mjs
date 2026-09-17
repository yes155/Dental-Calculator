import { computeVeneerQuote, formatMoney, parseMoneyToCents, parseVeneerCount } from './veneer-calculator-core.mjs';

const checked = (form,name) => form.querySelector(`[name="${name}"]:checked`)?.value ?? null;
const hide = (el,value) => { if (el) el.hidden = value; };

function sync(form) {
  hide(form.querySelector('[data-veneer-count]'), form.elements.quote_basis?.value !== 'per_veneer');
  hide(form.querySelector('[data-other-charge]'), checked(form,'other_charge_status') !== 'separate_charge');
  hide(form.querySelector('[data-insurance-fields]'), checked(form,'insurance_mode') !== 'user_estimate');
}

function money(form,name) {
  const input = form.elements[name];
  const out = parseMoneyToCents(input?.value ?? '');
  if (input) input.setAttribute('aria-invalid', out.state === 'invalid' ? 'true' : 'false');
  return out;
}

for (const form of document.querySelectorAll('[data-veneer-calculator]')) {
  sync(form);
  form.addEventListener('change',()=>sync(form));
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const quote = money(form,'quote_amount');
    const count = parseVeneerCount(form.elements.veneer_count?.value ?? '');
    const other = money(form,'other_charge');
    const insurance = money(form,'insurance_payment');
    const basis = form.elements.quote_basis?.value ?? null;
    const otherStatus = checked(form,'other_charge_status');
    const insuranceMode = checked(form,'insurance_mode');
    const insuranceScope = checked(form,'insurance_scope_confirmed');
    const resultBox = form.querySelector('[data-result]');
    const known = form.querySelector('[data-known-total]');
    const patient = form.querySelector('[data-patient-amount]');
    const note = form.querySelector('[data-result-note]');
    const summary = form.querySelector('[data-result-summary]');

    const invalid = quote.state !== 'valid' || (basis === 'per_veneer' && count.state !== 'valid') || (otherStatus === 'separate_charge' && other.state !== 'valid') || (insuranceMode === 'user_estimate' && insurance.state !== 'valid');
    if (invalid) {
      resultBox.hidden = false; resultBox.classList.add('result-incomplete');
      summary.textContent = 'Check the quote fields before estimating.'; known.textContent = '—'; patient.textContent = '—';
      note.textContent = 'Money fields accept $0 to $1,000,000 with up to two decimals. Per-veneer quotes also need a veneer count from 1 to 32. Blank is not treated as $0.';
      resultBox.focus(); return;
    }

    const out = computeVeneerQuote({ quoteBasis:basis, quoteAmountCents:quote.cents, veneerCount:count.state === 'valid' ? count.count : null, otherChargeStatus:otherStatus, otherChargeCents:other.state === 'valid' ? other.cents : null, insuranceMode, insurancePaymentCents:insurance.state === 'valid' ? insurance.cents : null, insuranceScopeConfirmed:insuranceScope });
    resultBox.hidden = false; resultBox.classList.toggle('result-incomplete', out.patientAmountCents === null);
    known.textContent = formatMoney(out.knownTotalCents);
    patient.textContent = out.patientAmountCents === null ? 'Not calculated' : formatMoney(out.patientAmountCents);
    summary.textContent = out.patientAmountCents === null ? 'Quote scope is still unresolved' : 'Estimate from your written quote';
    if (out.patientAmountCents === null) note.textContent = 'A precise patient amount is suppressed because quote or insurance scope is unresolved. Missing charges are never treated as $0.';
    else if (out.warnings.includes('insurance_exceeds_quote')) note.textContent = 'The insurance estimate exceeds the known quoted scope, so the patient amount is clamped to $0. Verify that both amounts cover the same services.';
    else note.textContent = 'Educational estimate based only on the quote and insurance information you entered. It is not an actual dental quote, treatment recommendation or coverage guarantee.';
    resultBox.focus();
  });
}
