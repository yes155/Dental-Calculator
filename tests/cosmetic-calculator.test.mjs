import test from 'node:test';
import assert from 'node:assert/strict';
import { computeVeneerQuote, parseMoneyToCents, parseVeneerCount } from '../src/assets/veneer-calculator-core.mjs';

test('veneer parser preserves blank and zero and validates count',()=>{
  assert.deepEqual(parseMoneyToCents(''),{state:'blank',cents:null});
  assert.deepEqual(parseMoneyToCents('0'),{state:'valid',cents:0});
  assert.equal(parseMoneyToCents('-1').state,'invalid');
  assert.deepEqual(parseVeneerCount('1'),{state:'valid',count:1});
  assert.deepEqual(parseVeneerCount('32'),{state:'valid',count:32});
  assert.equal(parseVeneerCount('0').state,'invalid');
  assert.equal(parseVeneerCount('33').state,'invalid');
});

test('total quote with included charges and no insurance returns quote',()=>{
  const out=computeVeneerQuote({quoteBasis:'total_quote',quoteAmountCents:500000,otherChargeStatus:'included',insuranceMode:'none'});
  assert.equal(out.knownTotalCents,500000); assert.equal(out.patientAmountCents,500000);
});

test('per-veneer quote multiplies only user-entered amount and count',()=>{
  const out=computeVeneerQuote({quoteBasis:'per_veneer',quoteAmountCents:100000,veneerCount:6,otherChargeStatus:'included',insuranceMode:'none'});
  assert.equal(out.baseTotalCents,600000); assert.equal(out.patientAmountCents,600000);
});

test('separate charge adds only explicit amount; unknown scope suppresses result',()=>{
  const complete=computeVeneerQuote({quoteBasis:'total_quote',quoteAmountCents:500000,otherChargeStatus:'separate_charge',otherChargeCents:25000,insuranceMode:'none'});
  assert.equal(complete.knownTotalCents,525000);
  for(const status of ['not_listed','not_sure']){
    const out=computeVeneerQuote({quoteBasis:'total_quote',quoteAmountCents:500000,otherChargeStatus:status,insuranceMode:'none'});
    assert.equal(out.patientAmountCents,null); assert.ok(out.unresolved.includes('quote_scope'));
  }
});

test('insurance applies only to same-scope user estimate and clamps at zero',()=>{
  const same=computeVeneerQuote({quoteBasis:'total_quote',quoteAmountCents:500000,otherChargeStatus:'included',insuranceMode:'user_estimate',insurancePaymentCents:100000,insuranceScopeConfirmed:'same_scope'});
  assert.equal(same.patientAmountCents,400000);
  const unclear=computeVeneerQuote({quoteBasis:'total_quote',quoteAmountCents:500000,otherChargeStatus:'included',insuranceMode:'user_estimate',insurancePaymentCents:100000,insuranceScopeConfirmed:'unclear'});
  assert.equal(unclear.patientAmountCents,null);
  const high=computeVeneerQuote({quoteBasis:'total_quote',quoteAmountCents:100000,otherChargeStatus:'included',insuranceMode:'user_estimate',insurancePaymentCents:150000,insuranceScopeConfirmed:'same_scope'});
  assert.equal(high.patientAmountCents,0); assert.ok(high.warnings.includes('insurance_exceeds_quote'));
});
