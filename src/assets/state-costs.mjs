const root = document.querySelector("[data-state-costs]");

if (root) {
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const procedureSelect = root.querySelector("[data-state-procedure]");
  const stateSelect = root.querySelector("[data-state-select]");
  const map = root.querySelector("[data-state-map]");
  const label = root.querySelector("[data-state-summary-label]");
  const price = root.querySelector("[data-state-summary-price]");
  const unit = root.querySelector("[data-state-summary-unit]");
  const dollar = root.querySelector("[data-state-summary-dollar]");
  const rank = root.querySelector("[data-state-summary-rank]");
  const narrative = root.querySelector("[data-state-summary-narrative]");
  const study = root.querySelector("[data-state-summary-study]");
  const scope = root.querySelector("[data-state-scope]");
  const guide = root.querySelector("[data-state-guide]");
  const tbody = root.querySelector("[data-state-table-body]");
  const caption = root.querySelector("[data-state-table-caption]");
  const sortButtons = [...root.querySelectorAll("[data-state-sort]")];
  const error = root.querySelector("[data-state-error]");
  const usAverage = root.querySelector("[data-state-us-average]");
  const usUnit = root.querySelector("[data-state-us-unit]");
  const lowest = root.querySelector("[data-state-lowest]");
  const highest = root.querySelector("[data-state-highest]");
  const selectedRank = root.querySelector("[data-state-rank]");
  const selectedRankNote = root.querySelector("[data-state-rank-note]");
  const rangeMin = root.querySelector("[data-state-range-min]");
  const rangeMax = root.querySelector("[data-state-range-max]");
  const rangeAverage = root.querySelector("[data-state-range-average]");
  const rangeSelected = root.querySelector("[data-state-range-selected]");
  const similar = root.querySelector("[data-state-similar]");
  let data;
  let sortMode = "az";

  const STANDARD_BANDS = [
    { max: -20, color: "#2166ac", text: "#ffffff", label: "20%+ below U.S. average" },
    { max: -10, color: "#67a9cf", text: "#17323a", label: "10–20% below U.S. average" },
    { max: -5, color: "#d1e5f0", text: "#17323a", label: "5–10% below U.S. average" },
    { max: 5, color: "#f7f7f2", text: "#17323a", label: "within 5% of U.S. average" },
    { max: 10, color: "#fddbc7", text: "#17323a", label: "5–10% above U.S. average" },
    { max: 20, color: "#ef8a62", text: "#17323a", label: "10–20% above U.S. average" },
    { max: Infinity, color: "#b2182b", text: "#ffffff", label: "20%+ above U.S. average" },
  ];

  const getProcedure = () => data.procedures[procedureSelect.value];
  const getState = () => data.states.find((row) => row.abbr === stateSelect.value) || null;
  const pctDiff = (value, national) => ((value - national) / national) * 100;
  const bandFor = (value, national) => STANDARD_BANDS.find((band) => pctDiff(value, national) <= band.max);

  const rankedRows = (key) => [...data.states].sort((a, b) => a[key] - b[key] || a.name.localeCompare(b.name));
  const rankOf = (row, key) => rankedRows(key).findIndex((candidate) => candidate.abbr === row.abbr) + 1;

  const pctText = (value, national) => {
    const pct = pctDiff(value, national);
    if (Math.abs(pct) < .5) return "about the same";
    return `${Math.abs(pct).toFixed(0)}% ${pct > 0 ? "above" : "below"}`;
  };

  const dollarText = (value, national) => {
    const diff = value - national;
    if (Math.abs(diff) < 1) return "About the same";
    return `${money.format(Math.abs(diff))} ${diff > 0 ? "higher" : "lower"}`;
  };

  const getStats = (key, meta) => {
    const rows = rankedRows(key);
    return { rows, min: rows[0], max: rows[rows.length - 1], national: meta.national_average };
  };

  const positionPct = (value, min, max) => max === min ? 50 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const renderInsights = () => {
    const key = procedureSelect.value;
    const meta = getProcedure();
    const stats = getStats(key, meta);
    const selected = getState();

    usAverage.textContent = money.format(meta.national_average);
    usUnit.textContent = meta.unit;
    lowest.textContent = `${stats.min.name} · ${money.format(stats.min[key])}`;
    highest.textContent = `${stats.max.name} · ${money.format(stats.max[key])}`;

    if (selected) {
      const position = rankOf(selected, key);
      selectedRank.textContent = `${position} of 51`;
      selectedRankNote.textContent = "From lower to higher published average";
    } else {
      selectedRank.textContent = "Select a state";
      selectedRankNote.textContent = "See its national position";
    }
  };

  const renderMap = () => {
    const key = procedureSelect.value;
    const meta = getProcedure();
    map.innerHTML = "";

    for (const row of data.states) {
      const band = bandFor(row[key], meta.national_average);
      const position = rankOf(row, key);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "state-tile";
      button.textContent = row.abbr;
      button.style.gridColumn = String(row.col + 1);
      button.style.gridRow = String(row.row + 1);
      button.style.backgroundColor = band.color;
      button.style.color = band.text;
      button.dataset.abbr = row.abbr;
      button.dataset.band = band.label;
      button.setAttribute("aria-label", `${row.name}: ${money.format(row[key])}, ${pctText(row[key], meta.national_average)}, position ${position} of 51 from lower to higher`);
      button.title = `${row.name}: ${money.format(row[key])} · ${pctText(row[key], meta.national_average)}`;
      const isSelected = stateSelect.value === row.abbr;
      if (isSelected) button.classList.add("is-selected");
      button.setAttribute("aria-pressed", String(isSelected));
      button.addEventListener("click", () => {
        stateSelect.value = row.abbr;
        update();
      });
      map.append(button);
    }
  };

  const renderRange = (selected, key, meta) => {
    const stats = getStats(key, meta);
    rangeMin.textContent = `${stats.min.abbr} ${money.format(stats.min[key])}`;
    rangeMax.textContent = `${stats.max.abbr} ${money.format(stats.max[key])}`;
    rangeAverage.style.left = `${positionPct(meta.national_average, stats.min[key], stats.max[key])}%`;

    if (selected) {
      rangeSelected.hidden = false;
      rangeSelected.style.left = `${positionPct(selected[key], stats.min[key], stats.max[key])}%`;
    } else {
      rangeSelected.hidden = true;
    }
  };

  const renderSimilar = (selected, key) => {
    if (!selected) {
      similar.innerHTML = "<span>Choose a state to compare.</span>";
      return;
    }
    const matches = data.states
      .filter((row) => row.abbr !== selected.abbr)
      .sort((a, b) => Math.abs(a[key] - selected[key]) - Math.abs(b[key] - selected[key]) || a.name.localeCompare(b.name))
      .slice(0, 3);

    similar.innerHTML = matches.map((row) =>
      `<button type="button" data-compare-state="${row.abbr}"><span>${row.name}</span><strong>${money.format(row[key])}</strong></button>`
    ).join("");

    similar.querySelectorAll("[data-compare-state]").forEach((button) => {
      button.addEventListener("click", () => {
        stateSelect.value = button.dataset.compareState;
        update();
      });
    });
  };

  const renderTable = () => {
    const key = procedureSelect.value;
    const meta = getProcedure();
    const rankMap = new Map(rankedRows(key).map((row, index) => [row.abbr, index + 1]));
    const rows = [...data.states];

    if (sortMode === "az") rows.sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "low") rows.sort((a, b) => a[key] - b[key] || a.name.localeCompare(b.name));
    if (sortMode === "high") rows.sort((a, b) => b[key] - a[key] || a.name.localeCompare(b.name));

    tbody.innerHTML = rows.map((row) => `
      <tr${row.abbr === stateSelect.value ? ' class="is-selected"' : ""}>
        <td>${rankMap.get(row.abbr)}</td>
        <th scope="row">${row.name}</th>
        <td>${money.format(row[key])}</td>
        <td>${dollarText(row[key], meta.national_average)} · ${pctText(row[key], meta.national_average)}</td>
      </tr>`).join("");

    caption.textContent = `${meta.label}: published averages across 50 states and Washington, D.C.`;
  };

  const update = () => {
    const key = procedureSelect.value;
    const meta = getProcedure();
    const selected = getState();
    root.classList.toggle("has-selection", Boolean(selected));

    label.textContent = selected ? `${selected.name} published average` : "U.S. published average";
    price.textContent = money.format(selected ? selected[key] : meta.national_average);
    unit.textContent = meta.unit;
    study.textContent = meta.study_vintage;
    scope.textContent = meta.scope_note;
    guide.href = meta.page_url;
    guide.textContent = `Open ${meta.short_label.toLowerCase()} guide →`;

    if (selected) {
      const position = rankOf(selected, key);
      dollar.textContent = dollarText(selected[key], meta.national_average);
      rank.textContent = `${position} of 51, lower → higher`;
      narrative.textContent = `${selected.name}'s published average is ${money.format(selected[key])}, ${pctText(selected[key], meta.national_average)} the published U.S. average of ${money.format(meta.national_average)}.`;
    } else {
      dollar.textContent = "—";
      rank.textContent = "—";
      narrative.textContent = "Choose a state to see its dollar difference, percentage difference and position among all 51 jurisdictions.";
    }

    renderInsights();
    renderMap();
    renderRange(selected, key, meta);
    renderSimilar(selected, key);
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
