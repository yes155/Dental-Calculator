import { evaluateDeepCleaningQuote, formatDeepCleaningUsd, parseDeepCleaningUsd } from "./deep-cleaning-calculator-core.mjs";

const form = document.querySelector("#calculator");
if (!form) throw new Error("CALC-006 form not found.");
const steps = [...document.querySelectorAll(".calc-step[data-step]")];
const progress = [...document.querySelectorAll("[data-step-indicator]")];
const errorSummary = document.querySelector("#error-summary");
const oneTotalFields = document.querySelector("#one-total-fields");
const quadrantFields = document.querySelector("#quadrant-fields");
const quadrantInputs = document.querySelector("#quadrant-inputs");
const insuranceFields = document.querySelector("#insurance-estimate-fields");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultValues = document.querySelector("#result-values");
const resultScope = document.querySelector("#result-scope");
const stateLabels = { included: "Included", separately_quoted: "Separate charge", not_on_quote: "Not listed", unknown: "Not sure" };

const selected = name => form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value ?? "";
const escapeHtml = value => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);

function clearErrors() {
  errorSummary.hidden = true;
  errorSummary.replaceChildren();
  form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute("aria-invalid"));
}
function fieldFor(error) { return form.querySelector(`[data-field="${CSS.escape(error.field)}"]`) || form.querySelector(`[data-error-field="${CSS.escape(error.field)}"]`); }
function message(error) {
  if (error.code === "invalid_amount") return "Enter a valid dollar amount.";
  if (error.code === "missing_quote_mode") return "Choose how the written quote shows the SRP charges.";
  if (error.code === "invalid_quadrant_count") return "Choose 1 to 4 quadrants exactly as shown on the written quote.";
  if (error.code === "quadrant_scope_not_confirmed") return "Confirm that the quadrant count comes from the written quote.";
  if (error.code === "missing_insurance_mode") return "Choose what you know about insurance for this quote.";
  if (error.code === "scope_not_confirmed") return "Confirm that the insurance estimate covers this same quote.";
  if (error.code === "insurance_over_total") return "The insurance estimate cannot be more than the quote total.";
  return error.message;
}
function renderErrors(errors) {
  const h = document.createElement("h2"); h.textContent = "Check these details";
  const ul = document.createElement("ul");
  for (const error of errors) { fieldFor(error)?.setAttribute("aria-invalid","true"); const li=document.createElement("li"); li.textContent=message(error); ul.append(li); }
  errorSummary.append(h,ul); errorSummary.hidden=false; errorSummary.focus();
}
function setStep(n, focus=true) {
  steps.forEach(s=>{s.hidden=Number(s.dataset.step)!==n;});
  progress.forEach(item=>{const x=Number(item.dataset.stepIndicator); item.classList.toggle("is-current",x===n); item.classList.toggle("is-complete",x<n); x===n?item.setAttribute("aria-current","step"):item.removeAttribute("aria-current");});
  clearErrors();
  if (focus) document.querySelector(`#calc-step-${n}-heading`)?.focus({preventScroll:true});
}
function updateQuoteMode() {
  const mode=selected("quoteMode");
  oneTotalFields.hidden=mode!=="one_total";
  quadrantFields.hidden=mode!=="separate_quadrant_charges";
  document.querySelector("#written-total").disabled=mode!=="one_total";
  renderQuadrantInputs();
}
function renderQuadrantInputs() {
  const count=Number(selected("quadrantCount"));
  quadrantInputs.replaceChildren();
  if (selected("quoteMode")!=="separate_quadrant_charges" || !Number.isInteger(count) || count<1 || count>4) return;
  for(let i=0;i<count;i+=1){
    const wrap=document.createElement("div"); wrap.className="field-money-compact quadrant-line";
    wrap.innerHTML=`<label for="quadrant-${i}">Quadrant charge ${i+1}</label><div class="money"><span aria-hidden="true">$</span><input id="quadrant-${i}" data-quadrant-index="${i}" data-field="quadrantCharges.${i}" inputmode="decimal" autocomplete="off" placeholder="0.00"></div>`;
    quadrantInputs.append(wrap);
  }
}
function buildAdjunct(id,label) {
  const host=document.querySelector(`#${id}-choice`);
  host.dataset.errorField=`adjuncts.${id}.state`;
  host.innerHTML=`<legend>${label}</legend><div class="segmented-options" role="radiogroup" aria-label="${label} status">${Object.entries(stateLabels).map(([v,l])=>`<label class="segment-option"><input type="radio" name="${id}Status" value="${v}"${v==="unknown"?" checked":""}><span>${l}</span></label>`).join("")}</div><div class="component-amount field-money-compact" hidden><label for="${id}-amount">Separate charge amount</label><div class="money"><span aria-hidden="true">$</span><input id="${id}-amount" data-field="adjuncts.${id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00" disabled></div></div>`;
  host.addEventListener("change",e=>{if(e.target.name!==`${id}Status`)return;const show=e.target.value==="separately_quoted";const w=host.querySelector(".component-amount");const inp=host.querySelector(".component-amount input");w.hidden=!show;inp.disabled=!show;if(!show)inp.value="";});
}
function updateInsurance(){const show=selected("insuranceMode")==="entered_estimate";insuranceFields.hidden=!show;document.querySelector("#insurance-amount").disabled=!show;document.querySelector("#same-scope").disabled=!show;}
function validateStepOne(){const errors=[];const mode=selected("quoteMode");if(!mode)errors.push({field:"quoteMode",code:"missing_quote_mode",message:""});const count=Number(selected("quadrantCount"));if(!Number.isInteger(count)||count<1||count>4)errors.push({field:"quadrantCount",code:"invalid_quadrant_count",message:""});if(!document.querySelector("#quadrant-count-confirmed").checked)errors.push({field:"quadrantCountConfirmed",code:"quadrant_scope_not_confirmed",message:""});if(mode==="one_total"&&!parseDeepCleaningUsd(document.querySelector("#written-total").value).ok)errors.push({field:"writtenTotal",code:"invalid_amount",message:""});if(mode==="separate_quadrant_charges"&&Number.isInteger(count)&&count>=1&&count<=4){for(let i=0;i<count;i+=1){const input=document.querySelector(`[data-quadrant-index="${i}"]`);if(!input||!parseDeepCleaningUsd(input.value).ok)errors.push({field:`quadrantCharges.${i}`,code:"invalid_amount",message:""});}}return errors;}
function collect(){return {quoteMode:selected("quoteMode"),quadrantCount:selected("quadrantCount"),quadrantCountConfirmed:document.querySelector("#quadrant-count-confirmed").checked,writtenTotal:document.querySelector("#written-total").value,quadrantCharges:[...quadrantInputs.querySelectorAll("input")].map(i=>i.value),adjuncts:{anesthesia:{state:selected("anesthesiaStatus"),amount:document.querySelector("#anesthesia-amount").value},other:{state:selected("otherStatus"),amount:document.querySelector("#other-amount").value}},insurance:{mode:selected("insuranceMode"),amount:document.querySelector("#insurance-amount").value,sameScopeConfirmed:document.querySelector("#same-scope").checked}};}
function renderResult(out,input){result.hidden=false;result.classList.toggle("result-incomplete",out.status==="incomplete");resultTitle.textContent=out.status==="incomplete"?"Some parts of your quote are still unclear":"Your deep-cleaning quote summary";const avg=`${out.averageApproximate?"About ":""}${formatDeepCleaningUsd(out.averageCents)}`;const patient=out.patientCents===null?"Needs quote details":formatDeepCleaningUsd(out.patientCents);resultValues.innerHTML=`<dl class="result-grid result-grid--guided"><div class="result-primary"><dt>Total from your quote</dt><dd>${formatDeepCleaningUsd(out.totalCents)}</dd></div><div><dt>Average per quoted quadrant</dt><dd>${avg}</dd></div><div><dt>Amount after insurance estimate</dt><dd>${patient}</dd></div></dl>`;resultScope.innerHTML=`<div class="result-chips"><span>${out.quadrantCount} ${out.quadrantCount===1?"quadrant":"quadrants"} confirmed from quote</span><span>${input.quoteMode==="one_total"?"One SRP total":"Separate quadrant charges"}</span></div><h3>Other quote items</h3><ul class="scope-summary">${out.adjunctRows.map(r=>`<li><span>${r.id==="anesthesia"?"Anesthesia":"Other charge"}</span><strong>${escapeHtml(stateLabels[r.state])}${r.amountCents!==null?` · ${formatDeepCleaningUsd(r.amountCents)}`:""}</strong></li>`).join("")}</ul>`;if(out.status==="incomplete")resultScope.insertAdjacentHTML("beforeend",'<p class="notice-inline"><strong>Some details are still unclear:</strong> an item is marked “Not sure.” The total includes only amounts you entered.</p>');result.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}

buildAdjunct("anesthesia","Anesthesia"); buildAdjunct("other","Other quoted charge"); updateQuoteMode(); updateInsurance(); setStep(1,false);
form.addEventListener("change",e=>{if(e.target.name==="quoteMode")updateQuoteMode();if(e.target.name==="quadrantCount")renderQuadrantInputs();if(e.target.name==="insuranceMode")updateInsurance();});
document.querySelector("#step-1-next").addEventListener("click",()=>{clearErrors();const errors=validateStepOne();if(errors.length)return renderErrors(errors);setStep(2);});
document.querySelector("#step-2-back").addEventListener("click",()=>setStep(1));document.querySelector("#step-2-next").addEventListener("click",()=>setStep(3));document.querySelector("#step-3-back").addEventListener("click",()=>setStep(2));
form.addEventListener("submit",e=>{e.preventDefault();clearErrors();const input=collect();const out=evaluateDeepCleaningQuote(input);if(out.status==="invalid"){result.hidden=true;renderErrors(out.errors);return;}renderResult(out,input);});
form.addEventListener("reset",()=>requestAnimationFrame(()=>{clearErrors();form.querySelectorAll("input[type=radio]").forEach(i=>i.checked=false);form.querySelector('input[name="anesthesiaStatus"][value="unknown"]').checked=true;form.querySelector('input[name="otherStatus"][value="unknown"]').checked=true;document.querySelector("#quadrant-count-confirmed").checked=false;document.querySelector("#same-scope").checked=false;["written-total","anesthesia-amount","other-amount","insurance-amount"].forEach(id=>document.querySelector(`#${id}`).value="");quadrantInputs.replaceChildren();form.querySelectorAll(".component-amount").forEach(w=>w.hidden=true);form.querySelectorAll(".component-amount input").forEach(i=>i.disabled=true);updateQuoteMode();updateInsurance();result.hidden=true;setStep(1,false);}));
