import { CLEANING_COMPONENTS, evaluateCleaningQuote, formatCleaningUsd, parseCleaningUsd } from "./cleaning-calculator-core.mjs";

const form = document.querySelector("#calculator");
if (!form) throw new Error("CALC-002 form not found.");

const steps = [...document.querySelectorAll(".calc-step[data-step]")];
const progress = [...document.querySelectorAll("[data-step-indicator]")];
const errorSummary = document.querySelector("#error-summary");
const oneTotalFields = document.querySelector("#one-total-fields");
const separateFields = document.querySelector("#separate-fields");
const insuranceFields = document.querySelector("#insurance-estimate-fields");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultValues = document.querySelector("#result-values");
const resultScope = document.querySelector("#result-scope");
const componentHost = document.querySelector("#component-list");

const stateLabels = { included: "Included", separately_quoted: "Separate charge", not_on_quote: "Not listed", unknown: "Not sure" };

function selected(name) { return form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value ?? ""; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]); }

function clearErrors() {
  errorSummary.hidden = true;
  errorSummary.replaceChildren();
  form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute("aria-invalid"));
}

function friendly(error) {
  if (error.code === "invalid_amount") return "Enter a valid dollar amount.";
  if (error.code === "missing_quote_mode") return "Choose whether your estimate shows one total or separate charges.";
  if (error.code === "missing_insurance_mode") return "Choose what you know about insurance for this quote.";
  if (error.code === "scope_not_confirmed") return "Confirm that the insurance estimate covers this same quote.";
  if (error.code === "insurance_over_total") return "The insurance estimate cannot be more than the quote total.";
  if (error.code === "aggregate_over_limit") return "The combined amount is above this tool's technical limit.";
  return error.message;
}

function fieldFor(error) {
  return form.querySelector(`[data-field="${CSS.escape(error.field)}"]`) || form.querySelector(`[data-error-field="${CSS.escape(error.field)}"]`);
}

function renderErrors(errors) {
  const heading = document.createElement("h2");
  heading.textContent = "Check these details";
  const list = document.createElement("ul");
  for (const error of errors) {
    const field = fieldFor(error);
    field?.setAttribute("aria-invalid", "true");
    const li = document.createElement("li");
    li.textContent = friendly(error);
    list.append(li);
  }
  errorSummary.append(heading, list);
  errorSummary.hidden = false;
  errorSummary.focus();
}

function setStep(number, focus = true) {
  steps.forEach(step => { step.hidden = Number(step.dataset.step) !== number; });
  progress.forEach(item => {
    const n = Number(item.dataset.stepIndicator);
    item.classList.toggle("is-current", n === number);
    item.classList.toggle("is-complete", n < number);
    n === number ? item.setAttribute("aria-current", "step") : item.removeAttribute("aria-current");
  });
  clearErrors();
  if (focus) document.querySelector(`#calc-step-${number}-heading`)?.focus({ preventScroll: true });
}

function buildComponents() {
  for (const component of CLEANING_COMPONENTS) {
    const fs = document.createElement("fieldset");
    fs.className = "component-choice";
    fs.dataset.errorField = `components.${component.id}.state`;
    fs.innerHTML = `<legend>${escapeHtml(component.label)}</legend>
      <div class="segmented-options" role="radiogroup" aria-label="${escapeHtml(component.label)} status on your quote">
        ${Object.entries(stateLabels).map(([value,label]) => `<label class="segment-option"><input type="radio" name="component-${component.id}" value="${value}"${value === "unknown" ? " checked" : ""}><span>${label}</span></label>`).join("")}
      </div>
      <div class="component-amount field-money-compact" hidden>
        <label for="component-${component.id}-amount">Separate charge amount</label>
        <div class="money"><span aria-hidden="true">$</span><input id="component-${component.id}-amount" data-field="components.${component.id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00" disabled></div>
      </div>`;
    fs.addEventListener("change", event => {
      if (event.target.name !== `component-${component.id}`) return;
      const wrap = fs.querySelector(".component-amount");
      const input = fs.querySelector(".component-amount input");
      const show = event.target.value === "separately_quoted";
      wrap.hidden = !show;
      input.disabled = !show;
      if (!show) input.value = "";
    });
    componentHost.append(fs);
  }
}

function updateQuoteMode() {
  const mode = selected("quoteMode");
  oneTotalFields.hidden = mode !== "one_total";
  separateFields.hidden = mode !== "separate_charges";
  document.querySelector("#written-total").disabled = mode !== "one_total";
  document.querySelector("#cleaning-fee").disabled = mode !== "separate_charges";
}

function updateInsurance() {
  const show = selected("insuranceMode") === "entered_estimate";
  insuranceFields.hidden = !show;
  document.querySelector("#insurance-amount").disabled = !show;
  document.querySelector("#same-scope").disabled = !show;
}

function collect() {
  return {
    quoteMode: selected("quoteMode"),
    writtenTotal: document.querySelector("#written-total").value,
    cleaningFee: document.querySelector("#cleaning-fee").value,
    components: Object.fromEntries(CLEANING_COMPONENTS.map(c => [c.id, { state: selected(`component-${c.id}`), amount: document.querySelector(`#component-${c.id}-amount`).value }])),
    insurance: { mode: selected("insuranceMode"), amount: document.querySelector("#insurance-amount").value, sameScopeConfirmed: document.querySelector("#same-scope").checked },
  };
}

function validateStepOne() {
  const mode = selected("quoteMode");
  if (!mode) return [{ field: "quoteMode", code: "missing_quote_mode", message: "" }];
  const field = mode === "one_total" ? "writtenTotal" : "cleaningFee";
  const id = mode === "one_total" ? "#written-total" : "#cleaning-fee";
  const parsed = parseCleaningUsd(document.querySelector(id).value);
  return parsed.ok ? [] : [{ field, code: "invalid_amount", message: parsed.reason }];
}

function renderResult(outcome, input) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", outcome.status === "incomplete");
  resultTitle.textContent = outcome.status === "incomplete" ? "Some parts of your quote are still unclear" : "Your cleaning quote summary";
  const patient = outcome.patientCents === null ? "Needs quote details" : formatCleaningUsd(outcome.patientCents);
  resultValues.innerHTML = `<dl class="result-grid result-grid--guided">
    <div class="result-primary"><dt>Total from your quote</dt><dd>${formatCleaningUsd(outcome.totalCents)}</dd></div>
    <div><dt>Insurance estimate entered</dt><dd>${outcome.insurerCents === null ? "Not known" : formatCleaningUsd(outcome.insurerCents)}</dd></div>
    <div><dt>Amount after insurance estimate</dt><dd>${patient}</dd></div>
  </dl>`;
  resultScope.innerHTML = `<h3>What your written quote says</h3><ul class="scope-summary">${outcome.componentRows.map(row => `<li><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(stateLabels[row.state])}${row.amountCents !== null ? ` · ${formatCleaningUsd(row.amountCents)}` : ""}</strong></li>`).join("")}</ul>`;
  if (outcome.status === "incomplete") resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Some details are still unclear:</strong> an item is marked “Not sure.” The total above includes only the amounts you entered.</p>');
  result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

buildComponents();
updateQuoteMode();
updateInsurance();
setStep(1, false);
form.addEventListener("change", event => {
  if (event.target.name === "quoteMode") updateQuoteMode();
  if (event.target.name === "insuranceMode") updateInsurance();
});

document.querySelector("#step-1-next").addEventListener("click", () => {
  clearErrors();
  const errors = validateStepOne();
  if (errors.length) return renderErrors(errors);
  setStep(2);
});
document.querySelector("#step-2-back").addEventListener("click", () => setStep(1));
document.querySelector("#step-2-next").addEventListener("click", () => setStep(3));
document.querySelector("#step-3-back").addEventListener("click", () => setStep(2));

form.addEventListener("submit", event => {
  event.preventDefault();
  clearErrors();
  const input = collect();
  const outcome = evaluateCleaningQuote(input);
  if (outcome.status === "invalid") {
    result.hidden = true;
    renderErrors(outcome.errors);
    return;
  }
  renderResult(outcome, input);
});

form.addEventListener("reset", () => requestAnimationFrame(() => {
  clearErrors();
  form.querySelectorAll("input[type=radio]").forEach(input => { input.checked = false; });
  for (const component of CLEANING_COMPONENTS) form.querySelector(`input[name="component-${component.id}"][value="unknown"]`).checked = true;
  form.querySelectorAll(".component-amount").forEach(el => { el.hidden = true; });
  form.querySelectorAll(".component-amount input").forEach(input => { input.value = ""; input.disabled = true; });
  ["written-total","cleaning-fee","insurance-amount"].forEach(id => { document.querySelector(`#${id}`).value = ""; });
  document.querySelector("#same-scope").checked = false;
  updateQuoteMode();
  updateInsurance();
  result.hidden = true;
  resultValues.replaceChildren();
  resultScope.replaceChildren();
  setStep(1, false);
}));
