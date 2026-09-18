const dropdowns = [...document.querySelectorAll(".nav-dropdown")];

function closeDropdown(dropdown) {
  if (dropdown?.open) dropdown.open = false;
}

for (const dropdown of dropdowns) {
  dropdown.addEventListener("toggle", () => {
    if (!dropdown.open) return;
    for (const other of dropdowns) {
      if (other !== dropdown) closeDropdown(other);
    }
  });

  dropdown.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeDropdown(dropdown));
  });
}

document.addEventListener("pointerdown", (event) => {
  for (const dropdown of dropdowns) {
    if (dropdown.open && !dropdown.contains(event.target)) closeDropdown(dropdown);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const open = dropdowns.find((dropdown) => dropdown.open);
  if (!open) return;
  closeDropdown(open);
  open.querySelector("summary")?.focus();
});

window.addEventListener("pageshow", () => {
  for (const dropdown of dropdowns) closeDropdown(dropdown);
});
