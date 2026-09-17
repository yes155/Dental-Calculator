import test from 'node:test';
import assert from 'node:assert/strict';
import { computeOrthodonticQuote, parseMoneyToCents } from '../src/assets/orthodontics-calculator-core.mjs';

test('money parser preserves blank versus zero and enforces ceiling', () => {
  assert.deepEqual(parseMoneyToCents(''), { state: 'blank', cents: null });
  assert.deepEqual(parseMoneyToCents('0'), { state: 'valid', cents: 0 });
  assert.deepEqual(parseMoneyToCents('12.34'), { state: 'valid', cents: 1234 });
  assert.equal(parseMoneyToCents('-1').state, 'invalid');
  assert.equal(parseMoneyToCents('1000000.01').state, 'invalid');
});

test('included retainer with no insurance returns quoted amount', () => {
  const result = computeOrthodonticQuote({ treatmentQuoteCents: 500000, retainerStatus: 'included', insuranceMode: 'none' });
  assert.equal(result.knownTotalCents, 500000);
  assert.equal(result.patientAmountCents, 500000);
});

test('separate retainer is added only when an explicit amount exists', () => {
  const complete = computeOrthodonticQuote({ treatmentQuoteCents: 500000, retainerStatus: 'separate_charge', retainerChargeCents: 30000, insuranceMode: 'none' });
  assert.equal(complete.knownTotalCents, 530000);
  assert.equal(complete.patientAmountCents, 530000);
  const incomplete = computeOrthodonticQuote({ treatmentQuoteCents: 500000, retainerStatus: 'separate_charge', retainerChargeCents: null, insuranceMode: 'none' });
  assert.equal(incomplete.patientAmountCents, null);
  assert.ok(incomplete.unresolved.includes('retainer_charge'));
});

test('not listed or not sure never becomes zero', () => {
  for (const status of ['not_listed','not_sure']) {
    const result = computeOrthodonticQuote({ treatmentQuoteCents: 500000, retainerStatus: status, insuranceMode: 'none' });
    assert.equal(result.knownTotalCents, 500000);
    assert.equal(result.patientAmountCents, null);
    assert.ok(result.unresolved.includes('retainer_scope'));
  }
});

test('insurance applies only when user estimate matches quote scope', () => {
  const same = computeOrthodonticQuote({ treatmentQuoteCents: 500000, retainerStatus: 'included', insuranceMode: 'user_estimate', insurancePaymentCents: 100000, insuranceScopeConfirmed: 'same_scope' });
  assert.equal(same.patientAmountCents, 400000);
  const unclear = computeOrthodonticQuote({ treatmentQuoteCents: 500000, retainerStatus: 'included', insuranceMode: 'user_estimate', insurancePaymentCents: 100000, insuranceScopeConfirmed: 'unclear' });
  assert.equal(unclear.patientAmountCents, null);
});

test('insurance greater than quote clamps to zero and warns', () => {
  const result = computeOrthodonticQuote({ treatmentQuoteCents: 100000, retainerStatus: 'included', insuranceMode: 'user_estimate', insurancePaymentCents: 150000, insuranceScopeConfirmed: 'same_scope' });
  assert.equal(result.patientAmountCents, 0);
  assert.ok(result.warnings.includes('insurance_exceeds_quote'));
});
