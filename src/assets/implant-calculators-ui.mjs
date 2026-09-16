import {
  ARCH_COMPONENTS,
  IMPLANT_COMPONENTS,
  evaluateArchQuote,
  evaluateImplantQuote,
  formatUsd,
} from "./implant-calculators-core.mjs";

const form = document.querySelector("#calculator");
if (!form) throw new Error("Calculator form not found.");

const calculatorType = form.dataset.calculator;
const isImplant = calculatorType === "calc001";
const isAllOn4 = calculatorType === "calc003-a04";
const definitions = isImplant ? IMPLANT_COMPONENTS : ARCH_COMPONENTS;
const componentRoot = document.querySelector("#components");
const insuranceMode = document.querySelector("#insurance-mode");
const insuranceFields = document.querySelector("#insurance-estimate-fields");
const errorSummary = document.querySelector("#error-summary");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#result-title");
const resultValues = document.querySelector("#result-values");
const resultScope = document.querySelector("#result-scope");
const bundleSection = document.querySelector("#bundle-section");
const itemizedSection = document.querySelector("#itemized-section");
const itemizedLines = document.querySelector("#itemized-lines");

const stateLabels = {
  included: "Included",
  separately_quoted: "Separately quoted",
  not_on_quote: "Not on quote",
  unknown: "Unknown",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function buildComponents() {
  for (const component of definitions) {
    const row = document.createElement("div");
    row.className = "component-row";
    row.innerHTML = `
      <div>
        <label for="component-${component.id}-state">${escapeHtml(component.label)} status</label>
        <select id="component-${component.id}-state" data-component="${component.id}" data-field="components.${component.id}.state">
          <option value="">Choose one</option>
          <option value="included">Included in entered quote</option>
          <option value="separately_quoted">Separately quoted</option>
          <option value="not_on_quote">Not on quote</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <div class="component-amount" hidden>
        <label for="component-${component.id}-amount">${escapeHtml(component.label)} separate amount (USD)</label>
        <div class="money"><span aria-hidden="true">$</span><input id="component-${component.id}-amount" data-component-amount="${component.id}" data-field="components.${component.id}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00" disabled></div>
      </div>`;
    const select = row.querySelector("select");
    const amountGroup = row.querySelector(".component-amount");
    const amountInput = row.querySelector("input");
    select.addEventListener("change", () => {
      const show = select.value === "separately_quoted";
      amountGroup.hidden = !show;
      amountInput.disabled = !show;
      if (!show) amountInput.value = "";
    });
    componentRoot.append(row);
  }
}

function addItemizedLine() {
  if (!itemizedLines) return;
  const index = itemizedLines.children.length;
  const row = document.createElement("div");
  row.className = "quote-line";
  row.innerHTML = `
    <div class="quote-line-heading"><h4>Quote line ${index + 1}</h4><button type="button" class="remove-line button-link" aria-label="Remove quote line ${index + 1}">Remove</button></div>
    <div class="field-grid">
      <div><label for="line-${index}-label">Provider line-item label</label><input id="line-${index}-label" data-role="line-label" data-field="itemized.${index}.label" autocomplete="off"></div>
      <div><label for="line-${index}-scope">Pricing scope</label><select id="line-${index}-scope" data-role="line-scope" data-field="itemized.${index}.scope"><option value="">Choose one</option><option value="case_total">Case total</option><option value="per_tooth">Per tooth</option><option value="other_explicit_scope">Other explicit multiplier</option></select></div>
      <div><label for="line-${index}-amount">Quoted amount (USD)</label><div class="money"><span aria-hidden="true">$</span><input id="line-${index}-amount" data-role="line-amount" data-field="itemized.${index}.amount" inputmode="decimal" autocomplete="off" placeholder="0.00"></div></div>
    </div>
    <div class="field-grid line-multiplier" hidden>
      <div><label for="line-${index}-quantity">Explicit quantity / multiplier</label><input id="line-${index}-quantity" data-role="line-quantity" data-field="itemized.${index}.quantity" inputmode="numeric" autocomplete="off"></div>
      <label class="check use-tooth-count" hidden><input type="checkbox" data-role="line-use-tooth-count"> Use the confirmed tooth count above for this per-tooth line</label>
    </div>`;

  const scope = row.querySelector('[data-role="line-scope"]');
  const multiplier = row.querySelector(".line-multiplier");
  const quantity = row.querySelector('[data-role="line-quantity"]');
  const useWrap = row.querySelector(".use-tooth-count");
  const useCount = row.querySelector('[data-role="line-use-tooth-count"]');
  scope.addEventListener("change", () => {
    const needsMultiplier = scope.value === "per_tooth" || scope.value === "other_explicit_scope";
    multiplier.hidden = !needsMultiplier;
    useWrap.hidden = scope.value !== "per_tooth";
    if (!needsMultiplier) {
      quantity.value = "";
      useCount.checked = false;
      quantity.disabled = true;
    } else {
      quantity.disabled = false;
    }
  });
  useCount.addEventListener("change", () => {
    quantity.disabled = useCount.checked;
    if (useCount.checked) quantity.value = "";
  });
  quantity.disabled = true;

  row.querySelector(".remove-line").addEventListener("click", () => {
    row.remove();
    reindexLines();
  });
  itemizedLines.append(row);
}

function reindexLines() {
  if (!itemizedLines) return;
  [...itemizedLines.children].forEach((row, index) => {
    row.querySelector("h4").textContent = `Quote line ${index + 1}`;
    row.querySelector(".remove-line").setAttribute("aria-label", `Remove quote line ${index + 1}`);
    for (const [role, suffix] of [["line-label", "label"], ["line-scope", "scope"], ["line-amount", "amount"], ["line-quantity", "quantity"]]) {
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

function updateQuoteMode() {
  if (!isImplant) return;
  const mode = form.elements.quoteMode.value;
  bundleSection.hidden = mode !== "bundle";
  itemizedSection.hidden = mode !== "itemized";
}

function updateInsurance() {
  const show = insuranceMode.value === "entered_estimate";
  insuranceFields.hidden = !show;
  const amount = document.querySelector("#insurance-amount");
  const sameScope = document.querySelector("#same-scope");
  amount.disabled = !show;
  sameScope.disabled = !show;
  if (!show) {
    amount.value = "";
    sameScope.checked = false;
  }
}

function collectComponents() {
  return Object.fromEntries(definitions.map(({ id }) => [id, {
    state: document.querySelector(`#component-${id}-state`).value,
    amount: document.querySelector(`#component-${id}-amount`).value,
  }]));
}

function collectInsurance() {
  return {
    mode: insuranceMode.value,
    amount: document.querySelector("#insurance-amount").value,
    sameScopeConfirmed: document.querySelector("#same-scope").checked,
  };
}

function collectInput() {
  if (isImplant) {
    return {
      quoteMode: form.elements.quoteMode.value,
      toothCount: document.querySelector("#tooth-count").value,
      bundleAmount: document.querySelector("#bundle-amount").value,
      components: collectComponents(),
      itemized: [...itemizedLines.children].map((row) => ({
        label: row.querySelector('[data-role="line-label"]').value,
        scope: row.querySelector('[data-role="line-scope"]').value,
        amount: row.querySelector('[data-role="line-amount"]').value,
        quantity: row.querySelector('[data-role="line-quantity"]').value,
        useToothCount: row.querySelector('[data-role="line-use-tooth-count"]').checked,
      })),
      insurance: collectInsurance(),
    };
  }
  return {
    quotedTotal: document.querySelector("#quoted-total").value,
    archCount: document.querySelector("#arch-count").value,
    archScopeConfirmed: document.querySelector("#arch-scope-confirmed").checked,
    restorationLabel: isAllOn4 ? "all_on_4" : document.querySelector("#restoration-label").value,
    components: collectComponents(),
    insurance: collectInsurance(),
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
  for (const error of errors) {
    const item = document.createElement("li");
    const field = form.querySelector(`[data-field="${CSS.escape(error.field)}"]`) || form.querySelector(`[name="${CSS.escape(error.field)}"]`);
    if (field?.id) {
      field.setAttribute("aria-invalid", "true");
      const link = document.createElement("a");
      link.href = `#${field.id}`;
      link.textContent = error.message;
      item.append(link);
    } else item.textContent = error.message;
    list.append(item);
  }
  errorSummary.append(heading, list);
  errorSummary.hidden = false;
  errorSummary.focus();
}

function scopeList(rows) {
  return `<ul>${rows.map((row) => `<li><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(stateLabels[row.state])}${row.amountCents !== null ? ` — ${formatUsd(row.amountCents)}` : ""}</li>`).join("")}</ul>`;
}

function renderImplantResult(outcome) {
  const insurer = outcome.insurerCents === null ? "Unknown" : formatUsd(outcome.insurerCents);
  const patient = outcome.patientCents === null ? "Not shown" : formatUsd(outcome.patientCents);
  const perTooth = outcome.perToothCents === null ? "Not shown" : `${outcome.perToothApproximate ? "Approx. " : ""}${formatUsd(outcome.perToothCents)}`;
  resultValues.innerHTML = `<dl class="result-grid"><div><dt>Entered quote total</dt><dd>${formatUsd(outcome.totalCents)}</dd></div><div><dt>Per-tooth normalization</dt><dd>${perTooth}</dd></div><div><dt>Estimated patient share</dt><dd>${patient}</dd></div></dl><p class="hint">Insurer estimate: ${insurer}. This is arithmetic on amounts you entered, not a coverage calculation.</p>`;
  resultScope.innerHTML = outcome.componentRows.length ? `<h3>Recorded component scope</h3>${scopeList(outcome.componentRows)}` : `<h3>Entered itemized quote</h3><ul>${outcome.lineRows.map((row) => `<li><strong>${escapeHtml(row.label)}:</strong> ${formatUsd(row.lineTotalCents ?? 0)} (${escapeHtml(row.scope)})</li>`).join("")}</ul>`;
}

function renderArchResult(outcome) {
  const insurer = outcome.insurerCents === null ? "Unknown" : formatUsd(outcome.insurerCents);
  const patient = outcome.patientCents === null ? "Not shown" : formatUsd(outcome.patientCents);
  const perArch = outcome.perArchCents === null ? "Not shown" : `${outcome.perArchApproximate ? "Approx. " : ""}${formatUsd(outcome.perArchCents)}`;
  resultValues.innerHTML = `<dl class="result-grid"><div><dt>Entered quote total</dt><dd>${formatUsd(outcome.totalCents)}</dd></div><div><dt>Normalized per arch</dt><dd>${perArch}</dd></div><div><dt>Estimated patient share</dt><dd>${patient}</dd></div></dl><p class="hint">Insurer estimate: ${insurer}. The calculator does not infer implant count, treatment type, deductible, coinsurance or annual maximum.</p>`;
  resultScope.innerHTML = `<h3>Recorded package scope</h3>${scopeList(outcome.componentRows)}${outcome.prosthesisWarning ? '<p class="notice-inline"><strong>Prosthesis scope warning:</strong> temporary or final prosthesis inclusion is unknown.</p>' : ""}`;
}

function renderResult(outcome) {
  result.hidden = false;
  result.classList.toggle("result-incomplete", outcome.status === "incomplete");
  resultTitle.textContent = outcome.status === "incomplete" ? "Entered quote — scope incomplete" : "Entered quote normalization";
  if (isImplant) renderImplantResult(outcome); else renderArchResult(outcome);
  if (outcome.status === "incomplete") {
    resultValues.insertAdjacentHTML("beforeend", '<p class="notice-inline">At least one quoted component is unknown or separately quoted without an amount. The known total is shown, but do not treat it as all-inclusive.</p>');
  }
  result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

buildComponents();
if (isImplant) {
  addItemizedLine();
  updateQuoteMode();
  document.querySelector("#add-line").addEventListener("click", addItemizedLine);
}
updateInsurance();

form.addEventListener("change", (event) => {
  if (isImplant && event.target.name === "quoteMode") updateQuoteMode();
  if (event.target === insuranceMode) updateInsurance();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  const input = collectInput();
  const outcome = isImplant ? evaluateImplantQuote(input) : evaluateArchQuote(input, { allOn4: isAllOn4 });
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
    if (isImplant) {
      itemizedLines.replaceChildren();
      addItemizedLine();
      updateQuoteMode();
    }
    componentRoot.querySelectorAll(".component-amount").forEach((group) => { group.hidden = true; });
    componentRoot.querySelectorAll("[data-component-amount]").forEach((input) => { input.disabled = true; });
    updateInsurance();
    result.hidden = true;
    resultValues.replaceChildren();
    resultScope.replaceChildren();
  });
});
