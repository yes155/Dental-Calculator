import { computeOrthodonticQuote, formatMoney, parseMoneyToCents } from './orthodontics-calculator-core.mjs';

function checked(form, name) {
  return form.querySelector(`[name="${name}"]:checked`)?.value ?? null;
}

function setHidden(element, hidden) {
  if (!element) return;
  element.hidden = hidden;
}

function syncConditionalFields(form) {
  setHidden(form.querySelector('[data-retainer-charge]'), checked(form, 'retainer_status') !== 'separate_charge');
  const insuranceMode = checked(form, 'insurance_mode');
  setHidden(form.querySelector('[data-insurance-fields]'), insuranceMode !== 'user_estimate');
}

function moneyField(form, name) {
  const input = form.elements[name];
  const parsed = parseMoneyToCents(input?.value ?? '');
  if (input) input.setAttribute('aria-invalid', parsed.state === 'invalid' ? 'true' : 'false');
  return parsed;
}

function textForRetainer(status) {
  return {
    included: 'Retainer shown as included',
    separate_charge: 'Retainer shown as a separate charge',
    not_listed: 'Retainer is not listed in the quote',
    not_sure: 'Retainer scope is unclear',
  }[status] ?? 'Retainer scope not selected';
}

for (const form of document.querySelectorAll('[data-orthodontic-calculator]')) {
  syncConditionalFields(form);
  form.addEventListener('change', () => syncConditionalFields(form));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const treatment = moneyField(form, 'treatment_quote');
    const retainer = moneyField(form, 'retainer_charge');
    const insurance = moneyField(form, 'insurance_payment');
    const retainerStatus = checked(form, 'retainer_status');
    const insuranceMode = checked(form, 'insurance_mode');
    const insuranceScopeConfirmed = checked(form, 'insurance_scope_confirmed');

    const resultBox = form.querySelector('[data-result]');
    const summary = form.querySelector('[data-result-summary]');
    const known = form.querySelector('[data-known-total]');
    const patient = form.querySelector('[data-patient-amount]');
    const note = form.querySelector('[data-result-note]');

    const invalid = [treatment, ...(retainerStatus === 'separate_charge' ? [retainer] : []), ...(insuranceMode === 'user_estimate' ? [insurance] : [])].some((item) => item.state === 'invalid');
    if (invalid || treatment.state !== 'valid') {
      resultBox.hidden = false;
      resultBox.classList.add('result-incomplete');
      summary.textContent = 'Check the highlighted amount fields before estimating.';
      known.textContent = '—';
      patient.textContent = '—';
      note.textContent = 'Amounts must be between $0 and $1,000,000 with no more than two decimal places. Blank is not treated as $0.';
      resultBox.focus();
      return;
    }

    const computed = computeOrthodonticQuote({
      treatmentQuoteCents: treatment.cents,
      retainerStatus,
      retainerChargeCents: retainer.state === 'valid' ? retainer.cents : null,
      insuranceMode,
      insurancePaymentCents: insurance.state === 'valid' ? insurance.cents : null,
      insuranceScopeConfirmed,
    });

    resultBox.hidden = false;
    resultBox.classList.toggle('result-incomplete', computed.patientAmountCents === null);
    known.textContent = formatMoney(computed.knownTotalCents);
    patient.textContent = computed.patientAmountCents === null ? 'Not calculated' : formatMoney(computed.patientAmountCents);
    summary.textContent = textForRetainer(retainerStatus);

    if (computed.patientAmountCents === null) {
      note.textContent = 'A precise patient amount is suppressed because the quote or insurance scope is still unresolved. No missing item is treated as $0.';
    } else if (computed.warnings.includes('insurance_exceeds_quote')) {
      note.textContent = 'The entered insurance estimate exceeds the known quoted scope, so the patient amount is clamped to $0. Verify that the insurance estimate covers the same services.';
    } else {
      note.textContent = 'Educational estimate based only on the amounts and scope you entered. This is not an actual dental quote, treatment recommendation or coverage guarantee.';
    }
    resultBox.focus();
  });
}
