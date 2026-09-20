const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
const menuToggle = document.querySelector(".site-menu-toggle");
const primaryNav = document.getElementById("primary-navigation");
const backToTop = document.querySelector(".back-to-top");

function closeDropdown(dropdown) {
  if (dropdown?.open) dropdown.open = false;
}

function closeMobileMenu({ restoreFocus = false } = {}) {
  if (!menuToggle || !primaryNav) return;
  primaryNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("mobile-menu-open");
  for (const dropdown of dropdowns) closeDropdown(dropdown);
  if (restoreFocus) menuToggle.focus();
}

function openMobileMenu() {
  if (!menuToggle || !primaryNav) return;
  primaryNav.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("mobile-menu-open");
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 760px)").matches) closeMobileMenu();
    });
  });
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

  if (
    menuToggle &&
    primaryNav &&
    primaryNav.classList.contains("is-open") &&
    !primaryNav.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const openDropdown = dropdowns.find((dropdown) => dropdown.open);
  if (openDropdown) {
    closeDropdown(openDropdown);
    openDropdown.querySelector("summary")?.focus();
    return;
  }

  if (primaryNav?.classList.contains("is-open")) {
    closeMobileMenu({ restoreFocus: true });
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMobileMenu();
});

window.addEventListener("pageshow", () => {
  for (const dropdown of dropdowns) closeDropdown(dropdown);
  closeMobileMenu();
});

if (backToTop) {
  const syncBackToTop = () => {
    backToTop.hidden = window.scrollY < 700;
  };

  window.addEventListener("scroll", syncBackToTop, { passive: true });
  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  syncBackToTop();
}
