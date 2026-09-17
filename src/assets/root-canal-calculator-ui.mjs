import { evaluateRootCanalQuote, formatRootCanalUsd, parseRootCanalUsd } from "./root-canal-calculator-core.mjs";

const form = document.querySelector("#calculator");
if (!form) throw new Error("CALC-005 form not found.");

const steps = [...document.querySelectorAll(".calc-step[data-step]")];
const progress = [...document.querySelectorAll("[data-step-indicator]")];
const errorSummary = document.querySelector("#error-summary");
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
    missing_quote_mode: "Choose how the root-canal quote is written.",
    invalid_tooth_count: "Choose the number of treated teeth stated on the written quote.",
    tooth_scope_not_confirmed: "Confirm that the tooth count comes from the written quote.",
    invalid_amount: "Enter a valid dollar amount.",
    missing_insurance_mode: "Choose what you know about insurance for this quote.",
    scope_not_confirmed: "Confirm that the insurance estimate covers the same written quote.",
    insurance_over_total: "The insurance estimate cannot be more than the quote total.",
  };
  return map[error.code] ?? error.message;
}
function renderErrors(errors) {
  const h = document.createElement("h2");
  h.textContent = "Check these details";
  const ul = document.createElement("ul");
  for (const error of errors) {
    fieldFor(error)?.setAttribute("aria-invalid", "true");
    const li = document.createElement("li");
    li.textContent = message(error);
    ul.append(li);
  }
  errorSummary.append(h, ul);
  errorSummary.hidden = false;
  errorSummary.focus();
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
function buildComponent(id, label, withLabel = false) {
  const host = document.querySelector(`#${id}-choice`);
  host.dataset.errorField = `components.${id}.state`;
  const labelControl = withLabel ? `<div class="field-compact"><label for="${id}-label">What does the quote call the final restoration?</label><select id="${id}-label"><option value="not_stated">Not stated</option><option value="crown">Crown</option><option value="filling">Filling</option><option value="other_restoration">Other restoration</option></select></div>` : "";
  host.innerHTML = `<legend>${label}</legend>${labelControl}<div class="segmented-options">${Object.entries(stateLabels).map(([value,text]) => `<label class="segment-option"><input type="radio" name="${id}Status" value="${value}"${value === "unknown" ? " checked" : ""}><span>${text}</span></label>`).join("")}</div><div class="component-amount field-money-compact" hidden><label for="${id}-amount">Separate charge amount</label><div class="money"><span aria-hidden="true">$</span><input id="${id}-amount" data-field="components.${id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00" disabled></div></div>`;
  host.addEventListener("change", event => {
    if (event.target.name !== `${id}Status`) return;
    const show = event.target.value === "separately_quoted";
    const wrap = host.querySelector(".component-amount");
    const input = host.querySelector(".component-amount input");
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
  if (!selected("quoteMode")) errors.push({ field: "quoteMode", code: "missing_quote_mode", message: "" });
  const count = Number(document.querySelector("#tooth-count").value);
  if (!Number.isInteger(count) || count < 1 || count > 32) errors.push({ field: "toothCount", code: "invalid_tooth_count", message: "" });
  if (!document.querySelector("#tooth-count-confirmed").checked) errors.push({ field: "toothCountConfirmed", code: "tooth_scope_not_confirmed", message: "" });
  if (!parseRootCanalUsd(document.querySelector("#root-canal-amount").value).ok) errors.push({ field: "rootCanalAmount", code: "invalid_amount", message: "" });
  return errors;
}
function collect() {
  const component = id => ({
    state: selected(`${id}Status`),
    amount: document.querySelector(`#${id}-amount`)?.value ?? "",
    label: id === "restoration" ? document.querySelector("#restoration-label")?.value ?? "not_stated" : undefined,
  });
  return {
    quoteMode: selected("quoteMode"),
    toothCount: document.querySelector("#tooth-count").value,
    toothCountConfirmed: document.querySelector("#tooth-count-confirmed").checked,
    toothCategory: document.querySelector("#tooth-category").value,
    rootCanalAmount: document.querySelector("#root-canal-amount").value,
    retreatmentFlag: document.querySelector("#retreatment-flag").value,
    components: {
      restoration: component("restoration"),
      buildupPost: component("buildupPost"),
      imagingExam: component("imagingExam"),
      other: component("other"),
    },
    insurance: {
      mode: selected("insuranceMode"),
      amount: document.querySelector("#insurance-amount").value,
      sameScopeConfirmed: document.querySelector("#same-scope").checked,
    },
  };
}
function renderResult(out, input) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", out.status === "incomplete");
  resultTitle.textContent = out.status === "incomplete" ? "Some parts of your quote are still unclear" : "Your root-canal quote summary";
  const avg = `${out.averageApproximate ? "About " : ""}${formatRootCanalUsd(out.averagePerToothCents)}`;
  const patient = out.patientCents === null ? "Not shown" : formatRootCanalUsd(out.patientCents);
  resultValues.innerHTML = `<dl class="result-grid result-grid--guided"><div class="result-primary"><dt>Total from your quote</dt><dd>${formatRootCanalUsd(out.totalCents)}</dd></div><div><dt>Average per confirmed tooth</dt><dd>${avg}</dd></div><div><dt>Amount after insurance estimate</dt><dd>${patient}</dd></div></dl>`;
  const category = document.querySelector("#tooth-category").selectedOptions[0].textContent;
  const retreatment = document.querySelector("#retreatment-flag").selectedOptions[0].textContent;
  resultScope.innerHTML = `<div class="result-chips"><span>${out.toothCount} ${out.toothCount === 1 ? "tooth" : "teeth"} confirmed</span><span>${escapeHtml(category)}</span><span>${escapeHtml(retreatment)}</span></div><h3>What your quote says</h3><ul class="scope-summary">${out.componentRows.map(row => `<li><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(stateLabels[row.state])}${row.amountCents !== null ? ` · ${formatRootCanalUsd(row.amountCents)}` : ""}</strong></li>`).join("")}</ul>`;
  if (out.retreatmentFlag === "retreatment") resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Retreatment:</strong> this calculator totals only the amount you entered. It does not supply or compare against a national retreatment price.</p>');
  if (out.status === "incomplete") resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Scope incomplete:</strong> at least one item is marked “Not sure.” The total includes only amounts you entered.</p>');
  result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

buildComponent("restoration", "Final crown, filling or other restoration", true);
buildComponent("buildupPost", "Build-up or post");
buildComponent("imagingExam", "Exam or imaging");
buildComponent("other", "Other quoted charge");
updateInsurance();
setStep(1, false);

form.addEventListener("change", event => { if (event.target.name === "insuranceMode") updateInsurance(); });
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
  const out = evaluateRootCanalQuote(input);
  if (out.status === "invalid") {
    result.hidden = true;
    renderErrors(out.errors);
    return;
  }
  renderResult(out, input);
});
form.addEventListener("reset", () => requestAnimationFrame(() => {
  clearErrors();
  form.querySelectorAll("input[type=radio]").forEach(input => { input.checked = false; });
  ["restoration","buildupPost","imagingExam","other"].forEach(id => {
    form.querySelector(`input[name="${id}Status"][value="unknown"]`).checked = true;
  });
  document.querySelector("#tooth-count").value = "1";
  document.querySelector("#tooth-count-confirmed").checked = false;
  document.querySelector("#tooth-category").value = "not_stated";
  document.querySelector("#retreatment-flag").value = "not_stated";
  document.querySelector("#root-canal-amount").value = "";
  document.querySelector("#same-scope").checked = false;
  document.querySelector("#insurance-amount").value = "";
  form.querySelectorAll(".component-amount").forEach(wrap => { wrap.hidden = true; });
  form.querySelectorAll(".component-amount input").forEach(input => { input.disabled = true; input.value = ""; });
  updateInsurance();
  result.hidden = true;
  setStep(1, false);
}));
