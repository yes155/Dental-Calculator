import { COMPONENTS, evaluateQuote, formatUsd } from "./calc008-core.mjs";

const form = document.querySelector("#calculator");
const bundleSection = document.querySelector("#bundle-section");
const itemizedSection = document.querySelector("#itemized-section");
const itemizedLines = document.querySelector("#itemized-lines");
const componentsRoot = document.querySelector("#components");
const insuranceMode = document.querySelector("#insurance-mode");
const insuranceFields = document.querySelector("#insurance-estimate-fields");
const errorSummary = document.querySelector("#error-summary");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultValues = document.querySelector("#result-values");
const resultScope = document.querySelector("#result-scope");

const stateLabels = {
  separately_billed: "Separately billed",
  included: "Included in bundle",
  not_on_quote: "Not on quote",
  unknown: "Unknown",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function addItemizedLine() {
  const index = itemizedLines.children.length;
  const row = document.createElement("div");
  row.className = "quote-line";
  row.innerHTML = `
    <div class="quote-line-heading">
      <h4>Quote line ${index + 1}</h4>
      <button type="button" class="remove-line button-link" aria-label="Remove quote line ${index + 1}">Remove</button>
    </div>
    <div class="field-grid">
      <div><label for="line-${index}-label">Provider's category label</label><input id="line-${index}-label" data-role="line-label" data-field="itemized.${index}.label" autocomplete="off"></div>
      <div><label for="line-${index}-scope">Tooth identifier or grouped scope</label><input id="line-${index}-scope" data-role="line-scope" data-field="itemized.${index}.scope" autocomplete="off"></div>
      <div><label for="line-${index}-amount">Line total (USD)</label><div class="money"><span aria-hidden="true">$</span><input id="line-${index}-amount" data-role="line-amount" data-field="itemized.${index}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00"></div></div>
    </div>`;
  row.querySelector(".remove-line").addEventListener("click", () => {
    row.remove();
    reindexLines();
  });
  itemizedLines.append(row);
}

function reindexLines() {
  [...itemizedLines.children].forEach((row, index) => {
    row.querySelector("h4").textContent = `Quote line ${index + 1}`;
    const removeButton = row.querySelector(".remove-line");
    removeButton.setAttribute("aria-label", `Remove quote line ${index + 1}`);
    for (const [role, suffix] of [["line-label", "label"], ["line-scope", "scope"], ["line-amount", "amount"]]) {
      const input = row.querySelector(`[data-role="${role}"]`);
      const oldId = input.id;
      input.id = `line-${index}-${suffix}`;
      input.dataset.field = `itemized.${index}.${suffix}`;
      row.querySelector(`label[for="${oldId}"]`).htmlFor = input.id;
    }
  });
}

function buildComponents() {
  for (const component of COMPONENTS) {
    const row = document.createElement("div");
    row.className = "component-row";
    row.innerHTML = `
      <div><label for="component-${component.id}-state">${escapeHtml(component.label)} status</label><select id="component-${component.id}-state" data-component="${component.id}" data-field="components.${component.id}.state"><option value="">Choose one</option><option value="separately_billed">Separately billed</option><option value="included">Included in entered bundle</option><option value="not_on_quote">Not on quote</option><option value="unknown">Unknown</option></select></div>
      <div class="component-amount" hidden><label for="component-${component.id}-amount">${escapeHtml(component.label)} line total (USD)</label><div class="money"><span aria-hidden="true">$</span><input id="component-${component.id}-amount" data-component-amount="${component.id}" data-field="components.${component.id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00"></div></div>`;
    const select = row.querySelector("select");
    const amountGroup = row.querySelector(".component-amount");
    const amountInput = row.querySelector("input");
    select.addEventListener("change", () => {
      const enabled = select.value === "separately_billed";
      amountGroup.hidden = !enabled;
      amountInput.disabled = !enabled;
      if (!enabled) amountInput.value = "";
    });
    amountInput.disabled = true;
    componentsRoot.append(row);
  }
}

function updateBasis() {
  const basis = form.elements.basis.value;
  bundleSection.hidden = basis !== "bundle";
  itemizedSection.hidden = basis !== "itemized";
}

function updateInsurance() {
  const visible = insuranceMode.value === "entered_estimate";
  insuranceFields.hidden = !visible;
  document.querySelector("#insurance-amount").disabled = !visible;
  document.querySelector("#same-scope").disabled = !visible;
  if (!visible) {
    document.querySelector("#insurance-amount").value = "";
    document.querySelector("#same-scope").checked = false;
  }
}

function collectInput() {
  const basis = form.elements.basis.value;
  const components = {};
  for (const component of COMPONENTS) {
    components[component.id] = {
      state: document.querySelector(`#component-${component.id}-state`).value,
      amount: document.querySelector(`#component-${component.id}-amount`).value,
    };
  }
  return {
    basis,
    bundle: {
      label: document.querySelector("#bundle-label").value,
      scope: document.querySelector("#bundle-scope").value,
      amount: document.querySelector("#bundle-amount").value,
    },
    itemized: [...itemizedLines.children].map((row) => ({
      label: row.querySelector('[data-role="line-label"]').value,
      scope: row.querySelector('[data-role="line-scope"]').value,
      amount: row.querySelector('[data-role="line-amount"]').value,
    })),
    components,
    insurance: {
      mode: insuranceMode.value,
      amount: document.querySelector("#insurance-amount").value,
      sameScopeConfirmed: document.querySelector("#same-scope").checked,
    },
  };
}

function clearErrors() {
  errorSummary.hidden = true;
  errorSummary.replaceChildren();
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute("aria-invalid"));
}

function renderErrors(errors) {
  const heading = document.createElement("h2");
  heading.textContent = "Correct these fields";
  const list = document.createElement("ul");
  errors.forEach((error) => {
    const item = document.createElement("li");
    const field = form.querySelector(`[data-field="${CSS.escape(error.field)}"]`);
    if (field?.id) {
      field.setAttribute("aria-invalid", "true");
      const link = document.createElement("a");
      link.href = `#${field.id}`;
      link.textContent = error.message;
      item.append(link);
    } else {
      item.textContent = error.message;
    }
    if (error.route) {
      item.append(" ");
      const route = document.createElement("a");
      route.href = error.route;
      route.textContent = "Open wisdom-teeth costs";
      item.append(route);
    }
    list.append(item);
  });
  errorSummary.append(heading, list);
  errorSummary.hidden = false;
  errorSummary.focus();
}

function renderResult(outcome) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", outcome.status === "incomplete");
  if (outcome.status === "incomplete") {
    resultTitle.textContent = "Incomplete quote scope";
    resultValues.innerHTML = `<dl class="result-grid"><div><dt>Known entered subtotal</dt><dd>${formatUsd(outcome.subtotalCents)}</dd></div><div><dt>Patient share</dt><dd>Not shown</dd></div></dl><p class="notice-inline">At least one component is marked unknown. Resolve its inclusion before treating the subtotal as a complete quote total.</p>`;
  } else {
    resultTitle.textContent = "Entered quote estimate";
    const insurer = outcome.insurerCents === null ? "Unknown" : formatUsd(outcome.insurerCents);
    const patient = outcome.patientCents === null ? "Not shown" : formatUsd(outcome.patientCents);
    resultValues.innerHTML = `<dl class="result-grid"><div><dt>Entered quote total</dt><dd>${formatUsd(outcome.totalCents)}</dd></div><div><dt>Insurer estimate</dt><dd>${insurer}</dd></div><div><dt>Estimated patient share</dt><dd>${patient}</dd></div></dl>`;
  }
  resultScope.innerHTML = `<h3>Recorded component scope</h3><ul>${outcome.scopeRows.map((row) => `<li><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(stateLabels[row.state])}</li>`).join("")}</ul>`;
  result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

buildComponents();
addItemizedLine();
updateBasis();
updateInsurance();

form.addEventListener("change", (event) => {
  if (event.target.name === "basis") updateBasis();
  if (event.target === insuranceMode) updateInsurance();
});

document.querySelector("#add-line").addEventListener("click", addItemizedLine);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const outcome = evaluateQuote(collectInput());
  if (outcome.status === "invalid") {
    result.hidden = true;
    renderErrors(outcome.errors);
    return;
  }
  renderResult(outcome);
});

form.addEventListener("reset", () => {
  requestAnimationFrame(() => {
    clearErrors();
    itemizedLines.replaceChildren();
    addItemizedLine();
    componentsRoot.querySelectorAll(".component-amount").forEach((group) => { group.hidden = true; });
    componentsRoot.querySelectorAll("[data-component-amount]").forEach((input) => { input.disabled = true; });
    updateBasis();
    updateInsurance();
    result.hidden = true;
    resultValues.replaceChildren();
    resultScope.replaceChildren();
  });
});
