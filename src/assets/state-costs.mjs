const root = document.querySelector("[data-state-costs]");

if (root) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const procedureSelect = root.querySelector("[data-state-procedure]");
  const stateSelect = root.querySelector("[data-state-select]");
  const map = root.querySelector("[data-state-map]");
  const label = root.querySelector("[data-state-summary-label]");
  const price = root.querySelector("[data-state-summary-price]");
  const unit = root.querySelector("[data-state-summary-unit]");
  const delta = root.querySelector("[data-state-summary-delta]");
  const study = root.querySelector("[data-state-summary-study]");
  const scope = root.querySelector("[data-state-scope]");
  const guide = root.querySelector("[data-state-guide]");
  const tbody = root.querySelector("[data-state-table-body]");
  const caption = root.querySelector("[data-state-table-caption]");
  const sortButtons = [...root.querySelectorAll("[data-state-sort]")];
  const error = root.querySelector("[data-state-error]");
  let data;
  let sortMode = "az";

  const mix = (a, b, t) => {
    const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  };

  const getProcedure = () => data.procedures[procedureSelect.value];
  const getState = () => data.states.find((row) => row.abbr === stateSelect.value) || null;

  const deltaText = (value, national) => {
    const pct = ((value - national) / national) * 100;
    if (Math.abs(pct) < .5) return "About the same";
    return `${Math.abs(pct).toFixed(0)}% ${pct > 0 ? "higher" : "lower"}`;
  };

  const renderMap = () => {
    const key = procedureSelect.value;
    const vals = data.states.map((row) => row[key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    map.innerHTML = "";
    for (const row of data.states) {
      const t = max === min ? .5 : (row[key] - min) / (max - min);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "state-tile";
      button.textContent = row.abbr;
      button.style.gridColumn = String(row.col + 1);
      button.style.gridRow = String(row.row + 1);
      button.style.backgroundColor = mix([224, 245, 241], [10, 104, 98], t);
      button.style.color = t > .58 ? "#fff" : "#17323a";
      button.dataset.abbr = row.abbr;
      button.setAttribute("aria-label", `${row.name}: ${money.format(row[key])}`);
      if (stateSelect.value === row.abbr) button.classList.add("is-selected");
      button.addEventListener("click", () => {
        stateSelect.value = row.abbr;
        update();
      });
      map.append(button);
    }
  };

  const renderTable = () => {
    const key = procedureSelect.value;
    const meta = getProcedure();
    const rows = [...data.states];
    if (sortMode === "az") rows.sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "low") rows.sort((a, b) => a[key] - b[key]);
    if (sortMode === "high") rows.sort((a, b) => b[key] - a[key]);
    tbody.innerHTML = rows.map((row) => `
      <tr${row.abbr === stateSelect.value ? ' class="is-selected"' : ""}>
        <th scope="row">${row.name}</th>
        <td>${money.format(row[key])}</td>
        <td>${deltaText(row[key], meta.national_average)}</td>
      </tr>`).join("");
    caption.textContent = `${meta.label}: published averages by state and District of Columbia`;
  };

  const update = () => {
    const key = procedureSelect.value;
    const meta = getProcedure();
    const selected = getState();
    label.textContent = selected ? `${selected.name} published average` : "U.S. published average";
    price.textContent = money.format(selected ? selected[key] : meta.national_average);
    unit.textContent = meta.unit;
    delta.textContent = selected ? deltaText(selected[key], meta.national_average) : "Baseline";
    study.textContent = meta.study_vintage;
    scope.textContent = meta.scope_note;
    guide.href = meta.page_url;
    guide.textContent = `Open ${meta.short_label.toLowerCase()} guide →`;
    renderMap();
    renderTable();
  };

  fetch("/assets/data/state-dental-costs.json")
    .then((response) => {
      if (!response.ok) throw new Error("state data request failed");
      return response.json();
    })
    .then((json) => {
      data = json;
      stateSelect.insertAdjacentHTML("beforeend", data.states
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((row) => `<option value="${row.abbr}">${row.name}</option>`)
        .join(""));
      procedureSelect.addEventListener("change", update);
      stateSelect.addEventListener("change", update);
      sortButtons.forEach((button) => button.addEventListener("click", () => {
        sortMode = button.dataset.stateSort;
        sortButtons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
        renderTable();
      }));
      update();
    })
    .catch(() => {
      error.hidden = false;
      root.classList.add("state-costs-unavailable");
      price.textContent = "Unavailable";
    });
}
