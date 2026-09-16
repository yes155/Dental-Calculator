import {
  IMPLANT_COMPONENTS,
  evaluateImplantQuote,
  formatUsd,
  parseUsdToCents,
} from "./implant-calculators-core.mjs";

const form = document.querySelector("#calculator");
if (!form || form.dataset.calculator !== "calc001") throw new Error("CALC-001 form not found.");

const errorSummary = document.querySelector("#error-summary");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultValues = document.querySelector("#result-values");
const resultContext = document.querySelector("#result-context");
const resultScope = document.querySelector("#result-scope");
const bundleSection = document.querySelector("#bundle-section");
const itemizedSection = document.querySelector("#itemized-section");
const itemizedLines = document.querySelector("#itemized-lines");
const componentRoot = document.querySelector("#components");
const primaryComponents = document.querySelector("#primary-components");
const additionalComponents = document.querySelector("#additional-components-list");
const additionalDetails = document.querySelector("#additional-components");
const markAdditionalNotListed = document.querySelector("#additional-not-listed");
const insuranceEstimateFields = document.querySelector("#insurance-estimate-fields");
const progressItems = [...document.querySelectorAll("[data-step-indicator]")];
const steps = [...document.querySelectorAll(".calc-step[data-step]")];

const PRIMARY_COMPONENT_IDS = new Set(["implant", "abutment", "crown"]);
const ADDITIONAL_COMPONENT_IDS = IMPLANT_COMPONENTS
  .map(({ id }) => id)
  .filter((id) => !PRIMARY_COMPONENT_IDS.has(id));

const stateLabels = {
  included: "Included",
  separately_quoted: "Separate fee",
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

function renderErrors(errors) {
  const heading = document.createElement("h2");
  heading.textContent = "Check these details";
  const list = document.createElement("ul");
  for (const error of errors) {
    const item = document.createElement("li");
    const field = focusErrorField(error);
    if (field) {
      field.setAttribute("aria-invalid", "true");
      if (field.id) {
        const link = document.createElement("a");
        link.href = `#${field.id}`;
        link.textContent = error.message;
        item.append(link);
      } else item.textContent = error.message;
    } else item.textContent = error.message;
    list.append(item);
  }
  errorSummary.append(heading, list);
  errorSummary.hidden = false;
  errorSummary.focus();
}

function setStep(stepNumber, { focus = true } = {}) {
  const mode = selectedValue("quoteMode");
  steps.forEach((step) => { step.hidden = Number(step.dataset.step) !== stepNumber; });
  progressItems.forEach((item) => {
    const number = Number(item.dataset.stepIndicator);
    item.classList.toggle("is-current", number === stepNumber);
    item.classList.toggle("is-complete", number < stepNumber);
    item.classList.toggle("is-skipped", mode === "itemized" && number === 2 && stepNumber === 3);
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

function updateQuoteMode() {
  const mode = selectedValue("quoteMode");
  bundleSection.hidden = mode !== "bundle";
  itemizedSection.hidden = mode !== "itemized";
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

function createComponentChoice(component, target) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "component-choice";
  fieldset.dataset.errorField = `components.${component.id}.state`;
  fieldset.innerHTML = `
    <legend>${escapeHtml(component.label)}</legend>
    <div class="segmented-options" role="radiogroup" aria-label="${escapeHtml(component.label)} quote status">
      ${Object.entries(stateLabels).map(([value, label]) => `
        <label class="segment-option">
          <input type="radio" name="component-${component.id}" value="${value}">
          <span>${label}</span>
        </label>`).join("")}
    </div>
    <div class="component-amount compact-money" hidden>
      <label for="component-${component.id}-amount">Separate ${escapeHtml(component.label.toLowerCase())} amount</label>
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
  for (const component of IMPLANT_COMPONENTS) {
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

function addItemizedLine() {
  const index = itemizedLines.children.length;
  const row = document.createElement("fieldset");
  row.className = "quote-line guided-quote-line";
  row.innerHTML = `
    <legend>Quote line ${index + 1}</legend>
    <button type="button" class="remove-line button-link" aria-label="Remove quote line ${index + 1}">Remove</button>
    <div class="line-grid">
      <div class="line-label-field"><label for="line-${index}-label">Provider line-item label</label><input id="line-${index}-label" data-role="line-label" data-field="itemized.${index}.label" autocomplete="off" placeholder="e.g. implant placement"></div>
      <div><label for="line-${index}-amount">Quoted amount</label><div class="money compact-money-input"><span aria-hidden="true">$</span><input id="line-${index}-amount" data-role="line-amount" data-field="itemized.${index}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00"></div></div>
      <div><label for="line-${index}-scope">How is this amount priced?</label><select id="line-${index}-scope" data-role="line-scope" data-field="itemized.${index}.scope"><option value="">Choose one</option><option value="case_total">Case total</option><option value="per_tooth">Per tooth</option><option value="other_explicit_scope">Other explicit multiplier</option></select></div>
      <div class="line-quantity" hidden><label for="line-${index}-quantity">Quantity / multiplier</label><input id="line-${index}-quantity" data-role="line-quantity" data-field="itemized.${index}.quantity" inputmode="numeric" autocomplete="off" disabled></div>
    </div>
    <label class="check use-tooth-count" hidden><input type="checkbox" data-role="line-use-tooth-count"> Use the tooth count entered above for this per-tooth line</label>`;

  const scope = row.querySelector('[data-role="line-scope"]');
  const quantityWrap = row.querySelector(".line-quantity");
  const quantity = row.querySelector('[data-role="line-quantity"]');
  const useWrap = row.querySelector(".use-tooth-count");
  const useCount = row.querySelector('[data-role="line-use-tooth-count"]');

  scope.addEventListener("change", () => {
    const needsQuantity = scope.value === "per_tooth" || scope.value === "other_explicit_scope";
    quantityWrap.hidden = !needsQuantity;
    useWrap.hidden = scope.value !== "per_tooth";
    quantity.disabled = !needsQuantity || useCount.checked;
    if (!needsQuantity) {
      quantity.value = "";
      useCount.checked = false;
    }
  });
  useCount.addEventListener("change", () => {
    quantity.disabled = useCount.checked;
    if (useCount.checked) quantity.value = "";
  });
  row.querySelector(".remove-line").addEventListener("click", () => {
    if (itemizedLines.children.length === 1) return;
    row.remove();
    reindexLines();
  });
  itemizedLines.append(row);
  reindexLines();
}

function reindexLines() {
  [...itemizedLines.children].forEach((row, index) => {
    row.querySelector("legend").textContent = `Quote line ${index + 1}`;
    const remove = row.querySelector(".remove-line");
    remove.setAttribute("aria-label", `Remove quote line ${index + 1}`);
    remove.hidden = itemizedLines.children.length === 1;
    for (const [role, suffix] of [["line-label", "label"], ["line-amount", "amount"], ["line-scope", "scope"], ["line-quantity", "quantity"]]) {
      const field = row.querySelector(`[data-role="${role}"]`);
      if (!field) continue;
      const oldId = field.id;
      field.id = `line-${index}-${suffix}`;
      field.dataset.field = `itemized.${index}.${suffix}`;
      const label = row.querySelector(`label[for="${oldId}"]`);
      if (label) label.htmlFor = field.id;
    }
  });
}

function validateStepOne() {
  const errors = [];
  const toothText = document.querySelector("#tooth-count").value.trim();
  const toothCount = Number(toothText);
  if (!/^\d+$/.test(toothText) || toothCount < 1 || toothCount > 32) {
    errors.push({ field: "toothCount", message: "Enter a whole-number tooth count from 1 to 32." });
  }

  const mode = selectedValue("quoteMode");
  if (!mode) errors.push({ field: "quoteMode", message: "Choose whether your quote has one total or itemized lines." });

  if (mode === "bundle") {
    const parsed = parseUsdToCents(document.querySelector("#bundle-amount").value);
    if (!parsed.ok) errors.push({ field: "bundleAmount", message: parsed.reason });
  }

  if (mode === "itemized") {
    [...itemizedLines.children].forEach((row, index) => {
      const label = row.querySelector('[data-role="line-label"]').value.trim();
      const amount = row.querySelector('[data-role="line-amount"]').value;
      const scope = row.querySelector('[data-role="line-scope"]').value;
      if (!label) errors.push({ field: `itemized.${index}.label`, message: `Enter a label for quote line ${index + 1}.` });
      const parsed = parseUsdToCents(amount);
      if (!parsed.ok) errors.push({ field: `itemized.${index}.amount`, message: `Quote line ${index + 1}: ${parsed.reason}` });
      if (!scope) errors.push({ field: `itemized.${index}.scope`, message: `Choose the pricing scope for quote line ${index + 1}.` });
      if (scope === "per_tooth" || scope === "other_explicit_scope") {
        const useCount = row.querySelector('[data-role="line-use-tooth-count"]').checked;
        const quantity = row.querySelector('[data-role="line-quantity"]').value.trim();
        if (!(scope === "per_tooth" && useCount) && !/^\d+$/.test(quantity)) {
          errors.push({ field: `itemized.${index}.quantity`, message: `Enter the explicit quantity for quote line ${index + 1}.` });
        }
      }
    });
  }
  return errors;
}

function validateStepTwo() {
  const errors = [];
  for (const id of PRIMARY_COMPONENT_IDS) {
    const component = IMPLANT_COMPONENTS.find((entry) => entry.id === id);
    if (!selectedValue(`component-${id}`)) {
      errors.push({
        field: `components.${id}.state`,
        message: `Choose whether ${component.label.toLowerCase()} is included, separate, not listed, or not sure.`,
      });
    }
  }
  return errors;
}

function collectComponents() {
  return Object.fromEntries(IMPLANT_COMPONENTS.map(({ id }) => [id, {
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
    quoteMode: selectedValue("quoteMode"),
    toothCount: document.querySelector("#tooth-count").value,
    bundleAmount: document.querySelector("#bundle-amount").value,
    components: collectComponents(),
    itemized: [...itemizedLines.children].map((row) => ({
      label: row.querySelector('[data-role="line-label"]').value,
      amount: row.querySelector('[data-role="line-amount"]').value,
      scope: row.querySelector('[data-role="line-scope"]').value,
      quantity: row.querySelector('[data-role="line-quantity"]').value,
      useToothCount: row.querySelector('[data-role="line-use-tooth-count"]').checked,
    })),
    insurance: collectInsurance(),
  };
}

function insuranceLabel(mode) {
  if (mode === "none") return "No insurer contribution entered";
  if (mode === "entered_estimate") return "Same-scope insurer estimate entered";
  return "Insurance amount not known";
}

function renderScopeList(rows) {
  return `<ul class="scope-summary">${rows.map((row) => `<li><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(stateLabels[row.state])}${row.amountCents !== null ? ` · ${formatUsd(row.amountCents)}` : ""}</strong></li>`).join("")}</ul>`;
}

function renderResult(outcome, input) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", outcome.status === "incomplete");
  resultTitle.textContent = outcome.status === "incomplete" ? "Your entered quote — scope incomplete" : "Your entered quote summary";

  const insurer = outcome.insurerCents === null ? "Unknown" : formatUsd(outcome.insurerCents);
  const patient = outcome.patientCents === null ? "Not shown" : formatUsd(outcome.patientCents);
  const perTooth = outcome.perToothCents === null ? "Not shown" : `${outcome.perToothApproximate ? "Approx. " : ""}${formatUsd(outcome.perToothCents)}`;

  resultValues.innerHTML = `
    <dl class="result-grid result-grid--guided">
      <div class="result-primary"><dt>Entered quote total</dt><dd>${formatUsd(outcome.totalCents)}</dd></div>
      <div><dt>Per-tooth normalization</dt><dd>${perTooth}</dd></div>
      <div><dt>Estimated patient amount</dt><dd>${patient}</dd></div>
    </dl>
    <p class="result-note">Insurer estimate: ${insurer}. The calculator uses only amounts you entered; it does not calculate plan benefits.</p>`;

  resultContext.innerHTML = `
    <div class="result-chips" aria-label="Quote context">
      <span>${outcome.toothCount} ${outcome.toothCount === 1 ? "tooth" : "teeth"}</span>
      <span>${input.quoteMode === "bundle" ? "One total / bundle" : "Itemized quote"}</span>
      <span>${escapeHtml(insuranceLabel(input.insurance.mode))}</span>
    </div>`;

  if (input.quoteMode === "bundle") {
    resultScope.innerHTML = `<h3>What your quote says it includes</h3>${renderScopeList(outcome.componentRows)}`;
  } else {
    resultScope.innerHTML = `<h3>Your itemized quote lines</h3><ul class="scope-summary">${outcome.lineRows.map((row) => `<li><span>${escapeHtml(row.label)}</span><strong>${formatUsd(row.lineTotalCents ?? 0)}</strong></li>`).join("")}</ul>`;
  }

  if (outcome.status === "incomplete") {
    resultScope.insertAdjacentHTML("beforeend", '<p class="notice-inline"><strong>Scope warning:</strong> at least one component is not confirmed or has a separate fee without an amount. The known total is shown, but do not treat it as all-inclusive.</p>');
  }

  result.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

buildComponents();
setAdditionalState("unknown");
addItemizedLine();
updateQuoteMode();
updateInsurance();
setStep(1, { focus: false });

form.addEventListener("change", (event) => {
  if (event.target.name === "quoteMode") updateQuoteMode();
  if (event.target.name === "insuranceMode") updateInsurance();
});

markAdditionalNotListed?.addEventListener("click", () => {
  setAdditionalState("not_on_quote");
  clearErrors();
});

document.querySelector("#add-line").addEventListener("click", addItemizedLine);

document.querySelector("#step-1-next").addEventListener("click", () => {
  clearErrors();
  const errors = validateStepOne();
  if (errors.length) return renderErrors(errors);
  setStep(selectedValue("quoteMode") === "itemized" ? 3 : 2);
});

document.querySelector("#step-2-back").addEventListener("click", () => setStep(1));
document.querySelector("#step-2-next").addEventListener("click", () => {
  clearErrors();
  const errors = validateStepTwo();
  if (errors.length) return renderErrors(errors);
  setStep(3);
});
document.querySelector("#step-3-back").addEventListener("click", () => setStep(selectedValue("quoteMode") === "itemized" ? 1 : 2));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const input = collectInput();
  const outcome = evaluateImplantQuote(input);
  if (outcome.status === "invalid") {
    renderErrors(outcome.errors);
    return;
  }
  renderResult(outcome, input);
});

form.addEventListener("reset", () => {
  requestAnimationFrame(() => {
    clearErrors();
    itemizedLines.replaceChildren();
    addItemizedLine();
    componentRoot.querySelectorAll("input[type=radio]").forEach((input) => { input.checked = false; });
    componentRoot.querySelectorAll(".component-amount").forEach((group) => { group.hidden = true; });
    componentRoot.querySelectorAll("[data-component-amount]").forEach((input) => {
      input.value = "";
      input.disabled = true;
    });
    setAdditionalState("unknown");
    additionalDetails.open = false;
    updateQuoteMode();
    updateInsurance();
    result.hidden = true;
    resultValues.replaceChildren();
    resultContext.replaceChildren();
    resultScope.replaceChildren();
    setStep(1, { focus: false });
  });
});
