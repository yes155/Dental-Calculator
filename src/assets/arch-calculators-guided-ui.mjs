import {
  ARCH_COMPONENTS,
  evaluateArchQuote,
  formatUsd,
  parseUsdToCents,
} from "./implant-calculators-core.mjs";

const form = document.querySelector("#calculator");
if (!form) throw new Error("Arch calculator form not found.");

const calculatorType = form.dataset.calculator;
const isAllOn4 = calculatorType === "calc003-a04";
if (!new Set(["calc003", "calc003-a04"]).has(calculatorType)) throw new Error("Unsupported arch calculator.");

const errorSummary = document.querySelector("#error-summary");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultValues = document.querySelector("#result-values");
const resultContext = document.querySelector("#result-context");
const resultScope = document.querySelector("#result-scope");
const primaryComponents = document.querySelector("#primary-components");
const additionalComponents = document.querySelector("#additional-components-list");
const additionalDetails = document.querySelector("#additional-components");
const markAdditionalNotListed = document.querySelector("#additional-not-listed");
const insuranceEstimateFields = document.querySelector("#insurance-estimate-fields");
const progressItems = [...document.querySelectorAll("[data-step-indicator]")];
const steps = [...document.querySelectorAll(".calc-step[data-step]")];

const PRIMARY_COMPONENT_IDS = new Set(["implant", "temporary", "final"]);
const ADDITIONAL_COMPONENT_IDS = ARCH_COMPONENTS.map(({ id }) => id).filter((id) => !PRIMARY_COMPONENT_IDS.has(id));

const componentNames = {
  implant: "Implant placement",
  abutment: "Connectors (abutments)",
  temporary: "Temporary teeth / bridge",
  final: "Final teeth / bridge",
  extraction: "Tooth removal (extractions)",
  graft: "Bone grafting",
  imaging: "Exam or X-rays / scans",
  sedation: "Sedation / anesthesia",
  followup: "Follow-up / adjustment visits",
  other: "Another charge",
};

const stateLabels = {
  included: "Included",
  separately_quoted: "Separate charge",
  not_on_quote: "Not listed",
  unknown: "Not sure",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function selectedValue(name) {
  return form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value ?? "";
}

function clearErrors() {
  errorSummary.hidden = true;
  errorSummary.replaceChildren();
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute("aria-invalid"));
}

function focusErrorField(error) {
  return form.querySelector(`[data-field="${CSS.escape(error.field)}"]`) ||
    form.querySelector(`[name="${CSS.escape(error.field)}"]`) ||
    form.querySelector(`[data-error-field="${CSS.escape(error.field)}"]`);
}

function friendlyAmountError(reason) {
  if (reason.includes("blank is different from zero")) return "Enter an amount.";
  if (reason.includes("no commas")) return "Enter dollars and cents, for example 25000 or 25000.00.";
  if (reason.includes("$0.00 to $1,000,000.00")) return "Enter an amount between $0 and $1,000,000.";
  return "Enter a valid dollar amount.";
}

function friendlyCoreError(error) {
  if (error.code === "invalid_amount") return friendlyAmountError(error.message);
  if (error.code === "missing_insurance_mode") return "Choose what you know about insurance for this quote.";
  if (error.code === "scope_not_confirmed") return "Confirm that the insurance estimate covers the same quote.";
  if (error.code === "insurance_over_total") return "The insurance estimate cannot be more than the quote total.";
  return error.message;
}

function renderErrors(errors) {
  const heading = document.createElement("h2");
  heading.textContent = "Check these details";
  const list = document.createElement("ul");
  for (const error of errors) {
    const item = document.createElement("li");
    const field = focusErrorField(error);
    const message = friendlyCoreError(error);
    if (field) {
      field.setAttribute("aria-invalid", "true");
      if (field.id) {
        const link = document.createElement("a");
        link.href = `#${field.id}`;
        link.textContent = message;
        item.append(link);
      } else item.textContent = message;
    } else item.textContent = message;
    list.append(item);
  }
  errorSummary.append(heading, list);
  errorSummary.hidden = false;
  errorSummary.focus();
}

function setStep(stepNumber, { focus = true } = {}) {
  steps.forEach((step) => { step.hidden = Number(step.dataset.step) !== stepNumber; });
  progressItems.forEach((item) => {
    const number = Number(item.dataset.stepIndicator);
    item.classList.toggle("is-current", number === stepNumber);
    item.classList.toggle("is-complete", number < stepNumber);
    if (number === stepNumber) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  clearErrors();
  if (focus) {
    document.querySelector(`#calc-step-${stepNumber}-heading`)?.focus({ preventScroll: true });
    document.querySelector("#calculator-heading")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }
}

function createComponentChoice(component, target) {
  const fieldset = document.createElement("fieldset");
  const displayName = componentNames[component.id] ?? component.label;
  fieldset.className = "component-choice";
  fieldset.dataset.errorField = `components.${component.id}.state`;
  fieldset.innerHTML = `
    <legend>${escapeHtml(displayName)}</legend>
    <div class="segmented-options" role="radiogroup" aria-label="${escapeHtml(displayName)} status on your quote">
      ${Object.entries(stateLabels).map(([value, label]) => `
        <label class="segment-option">
          <input type="radio" name="component-${component.id}" value="${value}"${value === "unknown" ? " checked" : ""}>
          <span>${label}</span>
        </label>`).join("")}
    </div>
    <div class="component-amount compact-money" hidden>
      <label for="component-${component.id}-amount">Separate charge amount</label>
      <div class="money"><span aria-hidden="true">$</span><input id="component-${component.id}-amount" data-component-amount="${component.id}" data-field="components.${component.id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00" disabled></div>
    </div>`;

  fieldset.addEventListener("change", (event) => {
    if (event.target.name !== `component-${component.id}`) return;
    const amountWrap = fieldset.querySelector(".component-amount");
    const amount = fieldset.querySelector("[data-component-amount]");
    const show = event.target.value === "separately_quoted";
    amountWrap.hidden = !show;
    amount.disabled = !show;
    if (!show) amount.value = "";
  });
  target.append(fieldset);
}

function buildComponents() {
  for (const component of ARCH_COMPONENTS) {
    createComponentChoice(component, PRIMARY_COMPONENT_IDS.has(component.id) ? primaryComponents : additionalComponents);
  }
}

function setAdditionalState(value) {
  for (const id of ADDITIONAL_COMPONENT_IDS) {
    const radio = form.querySelector(`input[name="component-${CSS.escape(id)}"][value="${CSS.escape(value)}"]`);
    if (radio) radio.checked = true;
    const amount = document.querySelector(`#component-${id}-amount`);
    const amountWrap = amount?.closest(".component-amount");
    if (amount) {
      amount.value = "";
      amount.disabled = value !== "separately_quoted";
    }
    if (amountWrap) amountWrap.hidden = value !== "separately_quoted";
  }
}

function collectComponents() {
  return Object.fromEntries(ARCH_COMPONENTS.map(({ id }) => [id, {
    state: selectedValue(`component-${id}`),
    amount: document.querySelector(`#component-${id}-amount`).value,
  }]));
}

function collectInsurance() {
  return {
    mode: selectedValue("insuranceMode"),
    amount: document.querySelector("#insurance-amount").value,
    sameScopeConfirmed: document.querySelector("#same-scope").checked,
  };
}

function collectInput() {
  return {
    quotedTotal: document.querySelector("#quoted-total").value,
    archCount: selectedValue("archCount"),
    archScopeConfirmed: document.querySelector("#arch-scope-confirmed").checked,
    restorationLabel: isAllOn4 ? "all_on_4" : selectedValue("restorationLabel") || "not_stated",
    components: collectComponents(),
    insurance: collectInsurance(),
  };
}

function validateStepOne() {
  const errors = [];
  const parsed = parseUsdToCents(document.querySelector("#quoted-total").value);
  if (!parsed.ok) errors.push({ field: "quotedTotal", code: "invalid_amount", message: parsed.reason });
  if (!new Set(["1", "2"]).has(selectedValue("archCount"))) {
    errors.push({ field: "archCount", code: "invalid_arch_count", message: "Choose whether this quote covers one arch or both arches." });
  }
  if (!document.querySelector("#arch-scope-confirmed").checked) {
    errors.push({ field: "archScopeConfirmed", code: "arch_scope_not_confirmed", message: "Confirm that the arch count comes from the written quote." });
  }
  return errors;
}

function updateInsurance() {
  const mode = selectedValue("insuranceMode");
  const show = mode === "entered_estimate";
  insuranceEstimateFields.hidden = !show;
  const amount = document.querySelector("#insurance-amount");
  const sameScope = document.querySelector("#same-scope");
  amount.disabled = !show;
  sameScope.disabled = !show;
  if (!show) {
    amount.value = "";
    sameScope.checked = false;
  }
}

function insuranceLabel(mode) {
  if (mode === "none") return "No insurance amount subtracted";
  if (mode === "entered_estimate") return "Insurance estimate entered";
  return "Insurance amount not known";
}

function renderScopeList(rows) {
  return `<ul class="scope-summary">${rows.map((row) => `<li><span>${escapeHtml(componentNames[row.id] ?? row.label)}</span><strong>${escapeHtml(stateLabels[row.state])}${row.amountCents !== null ? ` · ${formatUsd(row.amountCents)}` : ""}</strong></li>`).join("")}</ul>`;
}

function renderResult(outcome, input) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", outcome.status === "incomplete");
  resultTitle.textContent = outcome.status === "incomplete" ? "Some parts of your quote are still unclear" : "Your quote summary";

  const insurer = outcome.insurerCents === null ? "Not known" : formatUsd(outcome.insurerCents);
  const patient = outcome.patientCents === null ? "Not shown" : formatUsd(outcome.patientCents);
  const perArch = outcome.perArchCents === null ? "Not shown" : `${outcome.perArchApproximate ? "About " : ""}${formatUsd(outcome.perArchCents)}`;
  const patientLabel = input.insurance.mode === "entered_estimate"
    ? "Quote amount after insurance estimate"
    : input.insurance.mode === "none"
      ? "Total with no insurance amount"
      : "After insurance";

  resultValues.innerHTML = `
    <dl class="result-grid result-grid--guided">
      <div class="result-primary"><dt>Total from your quote</dt><dd>${formatUsd(outcome.totalCents)}</dd></div>
      <div><dt>Cost per arch from this quote</dt><dd>${perArch}</dd></div>
      <div><dt>${patientLabel}</dt><dd>${patient}</dd></div>
    </dl>
    <p class="result-note">Insurance estimate: ${insurer}. We only use amounts you enter; we do not calculate your plan benefits.</p>`;

  resultContext.innerHTML = `
    <div class="result-chips" aria-label="Quote details">
      <span>${outcome.archCount} ${outcome.archCount === 1 ? "arch" : "arches"}</span>
      <span>${isAllOn4 ? "All-on-4 quote" : input.restorationLabel === "fixed" ? "Fixed teeth" : input.restorationLabel === "removable" ? "Removable teeth" : "Restoration type not stated"}</span>
      <span>${escapeHtml(insuranceLabel(input.insurance.mode))}</span>
    </div>`;

  resultScope.innerHTML = `<h3>What your quote says is included</h3>${renderScopeList(outcome.componentRows)}`;
  if (outcome.prosthesisWarning) {
    resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Check the teeth/bridge details:</strong> the quote does not clearly confirm whether temporary or final teeth are included.</p>');
  }
  if (outcome.status === "incomplete") {
    resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Some details are still unclear:</strong> an item is marked “Not sure,” or a separate charge has no amount. The total above includes only the amounts you entered.</p>');
  }

  result.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

buildComponents();
updateInsurance();
setStep(1, { focus: false });

form.addEventListener("change", (event) => {
  if (event.target.name === "insuranceMode") updateInsurance();
});

markAdditionalNotListed?.addEventListener("click", () => {
  setAdditionalState("not_on_quote");
  clearErrors();
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const input = collectInput();
  const outcome = evaluateArchQuote(input, { allOn4: isAllOn4 });
  if (outcome.status === "invalid") {
    result.hidden = true;
    renderErrors(outcome.errors);
    return;
  }
  renderResult(outcome, input);
});

form.addEventListener("reset", () => {
  requestAnimationFrame(() => {
    clearErrors();
    form.querySelectorAll("input[type=radio]").forEach((input) => { input.checked = false; });
    for (const component of ARCH_COMPONENTS) {
      const unknown = form.querySelector(`input[name="component-${component.id}"][value="unknown"]`);
      if (unknown) unknown.checked = true;
    }
    form.querySelectorAll(".component-amount").forEach((group) => { group.hidden = true; });
    form.querySelectorAll("[data-component-amount]").forEach((input) => {
      input.value = "";
      input.disabled = true;
    });
    document.querySelector("#quoted-total").value = "";
    document.querySelector("#arch-scope-confirmed").checked = false;
    if (!isAllOn4) {
      const notStated = form.querySelector('input[name="restorationLabel"][value="not_stated"]');
      if (notStated) notStated.checked = true;
    }
    additionalDetails.open = false;
    updateInsurance();
    result.hidden = true;
    resultValues.replaceChildren();
    resultContext.replaceChildren();
    resultScope.replaceChildren();
    setStep(1, { focus: false });
  });
});
