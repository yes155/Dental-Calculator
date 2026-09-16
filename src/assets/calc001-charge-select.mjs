const itemizedLines = document.querySelector("#itemized-lines");

const CHARGE_OPTIONS = [
  ["", "Choose a charge"],
  ["Implant placement", "Implant placement"],
  ["Connector (abutment)", "Connector (abutment)"],
  ["Final crown", "Final crown"],
  ["Temporary crown / tooth", "Temporary crown / tooth"],
  ["Tooth removal (extraction)", "Tooth removal (extraction)"],
  ["Bone graft", "Bone graft"],
  ["Exam / consultation", "Exam / consultation"],
  ["X-rays or scans", "X-rays or scans"],
  ["Sedation / anesthesia", "Sedation / anesthesia"],
  ["Other charge", "Other charge"],
];

function enhanceChargeField(row) {
  const input = row.querySelector('input[data-role="line-label"]');
  if (!input) return;

  const select = document.createElement("select");
  select.id = input.id;
  select.dataset.role = "line-label";
  select.dataset.field = input.dataset.field;
  select.setAttribute("aria-label", "Name of charge");

  for (const [value, label] of CHARGE_OPTIONS) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }

  const previous = input.value.trim();
  if (previous && CHARGE_OPTIONS.some(([value]) => value === previous)) select.value = previous;
  input.replaceWith(select);
}

function enhanceExistingRows() {
  if (!itemizedLines) return;
  itemizedLines.querySelectorAll(".guided-quote-line").forEach(enhanceChargeField);
}

enhanceExistingRows();

if (itemizedLines) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(".guided-quote-line")) enhanceChargeField(node);
        node.querySelectorAll?.(".guided-quote-line").forEach(enhanceChargeField);
      }
    }
  });
  observer.observe(itemizedLines, { childList: true, subtree: true });
}
