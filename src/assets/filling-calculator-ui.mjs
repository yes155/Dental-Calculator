import { evaluateFillingQuote, formatFillingUsd, parseFillingUsd } from "./filling-calculator-core.mjs";

const form = document.querySelector("#calculator");
if (!form) throw new Error("CALC-010 form not found.");

const steps = [...document.querySelectorAll(".calc-step[data-step]")];
const progress = [...document.querySelectorAll("[data-step-indicator]")];
const errorSummary = document.querySelector("#error-summary");
const itemizedFields = document.querySelector("#itemized-fields");
const oneTotalFields = document.querySelector("#one-total-fields");
const restorationInputs = document.querySelector("#restoration-inputs");
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
function fieldFor(error) {
  return form.querySelector(`[data-field="${CSS.escape(error.field)}"]`) || form.querySelector(`[data-error-field="${CSS.escape(error.field)}"]`);
}
function message(error) {
  const map = {
    missing_quote_mode: "Choose how the filling quote is written.",
    invalid_restoration_count: "Enter the number of fillings or restorations shown on the written quote.",
    restoration_scope_not_confirmed: "Confirm that the restoration count comes from the written quote.",
    restoration_count_mismatch: "Enter one amount for each restoration in the itemized quote.",
    invalid_amount: "Enter a valid dollar amount.",
    missing_insurance_mode: "Choose what you know about insurance for this quote.",
    scope_not_confirmed: "Confirm that the insurance estimate covers the same written quote.",
    insurance_over_total: "The insurance estimate cannot be more than the quote total.",
  };
  return map[error.code] ?? error.message;
}
function renderErrors(errors) {
  const h = document.createElement("h2"); h.textContent = "Check these details";
  const ul = document.createElement("ul");
  for (const error of errors) {
    fieldFor(error)?.setAttribute("aria-invalid", "true");
    const li = document.createElement("li"); li.textContent = message(error); ul.append(li);
  }
  errorSummary.append(h, ul); errorSummary.hidden = false; errorSummary.focus();
}
function setStep(n, focus = true) {
  steps.forEach(step => { step.hidden = Number(step.dataset.step) !== n; });
  progress.forEach(item => {
    const x = Number(item.dataset.stepIndicator);
    item.classList.toggle("is-current", x === n);
    item.classList.toggle("is-complete", x < n);
    if (x === n) item.setAttribute("aria-current", "step"); else item.removeAttribute("aria-current");
  });
  clearErrors();
  if (focus) document.querySelector(`#calc-step-${n}-heading`)?.focus({ preventScroll: true });
}
function renderRestorationInputs() {
  restorationInputs.replaceChildren();
  const count = Number(document.querySelector("#restoration-count").value);
  if (selected("quoteMode") !== "itemized_restorations" || !Number.isInteger(count) || count < 1 || count > 32) return;
  for (let i = 0; i < count; i += 1) {
    const wrap = document.createElement("div");
    wrap.className = "field-money-compact";
    wrap.innerHTML = `<label for="restoration-${i}">Restoration ${i + 1} amount</label><div class="money"><span aria-hidden="true">$</span><input id="restoration-${i}" data-restoration-index="${i}" data-field="restorationAmounts.${i}" inputmode="decimal" autocomplete="off" placeholder="0.00"></div>`;
    restorationInputs.append(wrap);
  }
}
function updateQuoteMode() {
  const mode = selected("quoteMode");
  oneTotalFields.hidden = mode !== "one_total";
  itemizedFields.hidden = mode !== "itemized_restorations";
  document.querySelector("#written-total").disabled = mode !== "one_total";
  renderRestorationInputs();
}
function buildComponent(id, label) {
  const host = document.querySelector(`#${id}-choice`);
  host.dataset.errorField = `components.${id}.state`;
  host.innerHTML = `<legend>${label}</legend><div class="segmented-options">${Object.entries(stateLabels).map(([value,text]) => `<label class="segment-option"><input type="radio" name="${id}Status" value="${value}"${value === "unknown" ? " checked" : ""}><span>${text}</span></label>`).join("")}</div><div class="component-amount field-money-compact" hidden><label for="${id}-amount">Separate charge amount</label><div class="money"><span aria-hidden="true">$</span><input id="${id}-amount" data-field="components.${id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00" disabled></div></div>`;
  host.addEventListener("change", event => {
    if (event.target.name !== `${id}Status`) return;
    const show = event.target.value === "separately_quoted";
    const wrap = host.querySelector(".component-amount");
    const input = wrap.querySelector("input");
    wrap.hidden = !show;
    input.disabled = !show;
    if (!show) input.value = "";
  });
}
function updateInsurance() {
  const show = selected("insuranceMode") === "entered_estimate";
  insuranceFields.hidden = !show;
  document.querySelector("#insurance-amount").disabled = !show;
  document.querySelector("#same-scope").disabled = !show;
}
function validateStepOne() {
  const errors = [];
  const mode = selected("quoteMode");
  if (!mode) errors.push({ field: "quoteMode", code: "missing_quote_mode", message: "" });
  const count = Number(document.querySelector("#restoration-count").value);
  if (!Number.isInteger(count) || count < 1 || count > 32) errors.push({ field: "restorationCount", code: "invalid_restoration_count", message: "" });
  if (!document.querySelector("#restoration-count-confirmed").checked) errors.push({ field: "restorationCountConfirmed", code: "restoration_scope_not_confirmed", message: "" });
  if (mode === "one_total" && !parseFillingUsd(document.querySelector("#written-total").value).ok) errors.push({ field: "writtenTotal", code: "invalid_amount", message: "" });
  if (mode === "itemized_restorations" && Number.isInteger(count) && count >= 1 && count <= 32) {
    const inputs = [...restorationInputs.querySelectorAll("input")];
    if (inputs.length !== count) errors.push({ field: "restorationAmounts", code: "restoration_count_mismatch", message: "" });
    inputs.forEach((input, i) => { if (!parseFillingUsd(input.value).ok) errors.push({ field: `restorationAmounts.${i}`, code: "invalid_amount", message: "" }); });
  }
  return errors;
}
function collect() {
  const component = id => ({ state: selected(`${id}Status`), amount: document.querySelector(`#${id}-amount`).value });
  return {
    quoteMode: selected("quoteMode"),
    restorationCount: document.querySelector("#restoration-count").value,
    restorationCountConfirmed: document.querySelector("#restoration-count-confirmed").checked,
    writtenTotal: document.querySelector("#written-total").value,
    restorationAmounts: [...restorationInputs.querySelectorAll("input")].map(input => input.value),
    material: document.querySelector("#material").value,
    surfaceCount: document.querySelector("#surface-count").value,
    toothLocation: document.querySelector("#tooth-location").value,
    components: { examImaging: component("examImaging"), anesthesia: component("anesthesia"), other: component("other") },
    insurance: { mode: selected("insuranceMode"), amount: document.querySelector("#insurance-amount").value, sameScopeConfirmed: document.querySelector("#same-scope").checked },
  };
}
function renderResult(out) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", out.status === "incomplete");
  resultTitle.textContent = out.status === "incomplete" ? "Some parts of your quote are still unclear" : "Your filling quote summary";
  const avg = `${out.averageApproximate ? "About " : ""}${formatFillingUsd(out.averagePerRestorationCents)}`;
  const patient = out.patientCents === null ? "Not shown" : formatFillingUsd(out.patientCents);
  resultValues.innerHTML = `<dl class="result-grid result-grid--guided"><div class="result-primary"><dt>Total from your quote</dt><dd>${formatFillingUsd(out.totalCents)}</dd></div><div><dt>Average per entered restoration</dt><dd>${avg}</dd></div><div><dt>Amount after insurance estimate</dt><dd>${patient}</dd></div></dl>`;
  const material = document.querySelector("#material").selectedOptions[0].textContent;
  const surfaces = document.querySelector("#surface-count").selectedOptions[0].textContent;
  const location = document.querySelector("#tooth-location").selectedOptions[0].textContent;
  resultScope.innerHTML = `<div class="result-chips"><span>${out.restorationCount} ${out.restorationCount === 1 ? "restoration" : "restorations"} confirmed</span><span>${escapeHtml(material)}</span><span>${escapeHtml(surfaces)}</span><span>${escapeHtml(location)}</span></div><h3>Other quote items</h3><ul class="scope-summary">${out.componentRows.map(row => `<li><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(stateLabels[row.state])}${row.amountCents !== null ? ` · ${formatFillingUsd(row.amountCents)}` : ""}</strong></li>`).join("")}</ul>`;
  if (out.status === "incomplete") resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Scope incomplete:</strong> at least one item is marked “Not sure.” The total includes only amounts you entered.</p>');
  result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

buildComponent("examImaging", "Exam or imaging");
buildComponent("anesthesia", "Anesthesia");
buildComponent("other", "Other quoted charge");
updateQuoteMode(); updateInsurance(); setStep(1, false);

form.addEventListener("change", event => {
  if (event.target.name === "quoteMode") updateQuoteMode();
  if (event.target.id === "restoration-count") renderRestorationInputs();
  if (event.target.name === "insuranceMode") updateInsurance();
});
document.querySelector("#restoration-count").addEventListener("input", renderRestorationInputs);
document.querySelector("#step-1-next").addEventListener("click", () => { clearErrors(); const errors = validateStepOne(); if (errors.length) return renderErrors(errors); setStep(2); });
document.querySelector("#step-2-back").addEventListener("click", () => setStep(1));
document.querySelector("#step-2-next").addEventListener("click", () => setStep(3));
document.querySelector("#step-3-back").addEventListener("click", () => setStep(2));
form.addEventListener("submit", event => {
  event.preventDefault(); clearErrors(); const out = evaluateFillingQuote(collect());
  if (out.status === "invalid") { result.hidden = true; renderErrors(out.errors); return; }
  renderResult(out);
});
form.addEventListener("reset", () => requestAnimationFrame(() => {
  clearErrors();
  form.querySelectorAll("input[type=radio]").forEach(input => { input.checked = false; });
  ["examImaging","anesthesia","other"].forEach(id => { form.querySelector(`input[name="${id}Status"][value="unknown"]`).checked = true; });
  document.querySelector("#restoration-count").value = "1";
  document.querySelector("#restoration-count-confirmed").checked = false;
  document.querySelector("#written-total").value = "";
  ["material","surface-count","tooth-location"].forEach(id => { document.querySelector(`#${id}`).selectedIndex = 0; });
  document.querySelector("#same-scope").checked = false;
  document.querySelector("#insurance-amount").value = "";
  restorationInputs.replaceChildren();
  form.querySelectorAll(".component-amount").forEach(wrap => { wrap.hidden = true; });
  form.querySelectorAll(".component-amount input").forEach(input => { input.disabled = true; input.value = ""; });
  updateQuoteMode(); updateInsurance(); result.hidden = true; setStep(1, false);
}));
