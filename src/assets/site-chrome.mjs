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


const searchToggle = document.querySelector(".site-search-toggle");
const searchDialog = document.getElementById("site-search-dialog");
const searchClose = searchDialog?.querySelector(".site-search-close");
const searchInput = document.getElementById("site-search-input");
const searchStatus = document.getElementById("site-search-status");
const searchResults = document.getElementById("site-search-results");
let searchIndexPromise;

function loadSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch("/assets/data/site-search.json", { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => Array.isArray(data?.items) ? data.items : []);
  }
  return searchIndexPromise;
}

function normalizeSearch(value) {
  return value.toLowerCase().replace(/[^a-z0-9&+.-]+/g, " ").trim();
}

function scoreSearchItem(item, query, tokens) {
  const title = normalizeSearch(item.title || "");
  const description = normalizeSearch(item.description || "");
  const terms = normalizeSearch(item.terms || "");
  if (!tokens.every((token) => terms.includes(token) || title.includes(token) || description.includes(token))) {
    return -1;
  }

  let score = 0;
  if (title === query) score += 120;
  if (title.startsWith(query)) score += 80;
  if (title.includes(query)) score += 55;
  if (description.includes(query)) score += 20;

  for (const token of tokens) {
    if (title.includes(token)) score += 16;
    if (description.includes(token)) score += 7;
    if (terms.includes(token)) score += 3;
  }

  if (item.group === "Dental procedures") score += 2;
  return score;
}

function clearSearchResults() {
  if (searchResults) searchResults.replaceChildren();
}

function createSearchResult(item) {
  const link = document.createElement("a");
  link.className = "site-search-result";
  link.href = item.url;

  const title = document.createElement("strong");
  title.textContent = item.title;

  const meta = document.createElement("span");
  meta.className = "site-search-result-meta";
  meta.textContent = item.cluster ? `${item.group} · ${item.cluster}` : item.group;

  link.append(title, meta);

  if (item.description) {
    const description = document.createElement("p");
    description.textContent = item.description;
    link.append(description);
  }

  return link;
}

function renderSearchResults(items, query) {
  clearSearchResults();
  if (!searchResults || !searchStatus) return;

  if (!items.length) {
    searchStatus.textContent = `No results for “${query}”. Try a procedure name or a term such as insurance, implant or cleaning.`;
    const empty = document.createElement("p");
    empty.className = "site-search-empty";
    empty.textContent = "No matching page was found.";
    searchResults.append(empty);
    return;
  }

  searchStatus.textContent = `${items.length} result${items.length === 1 ? "" : "s"} for “${query}”.`;
  const groupOrder = ["Dental procedures", "Paying for care", "Trust & methodology"];

  for (const group of groupOrder) {
    const groupItems = items.filter((item) => item.group === group);
    if (!groupItems.length) continue;

    const section = document.createElement("section");
    section.className = "site-search-group";

    const heading = document.createElement("h3");
    heading.textContent = group;
    section.append(heading);

    const list = document.createElement("div");
    list.className = "site-search-group-list";
    for (const item of groupItems) list.append(createSearchResult(item));
    section.append(list);
    searchResults.append(section);
  }
}

async function runSiteSearch() {
  if (!searchInput || !searchStatus) return;
  const rawQuery = searchInput.value.trim();
  const query = normalizeSearch(rawQuery);

  if (query.length < 2) {
    clearSearchResults();
    searchStatus.textContent = rawQuery ? "Type at least 2 characters to search." : "Start typing to search the site.";
    return;
  }

  searchStatus.textContent = "Searching…";

  try {
    const items = await loadSearchIndex();
    const tokens = query.split(/\s+/).filter(Boolean);
    const matches = items
      .map((item) => ({ item, score: scoreSearchItem(item, query, tokens) }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 18)
      .map((entry) => entry.item);

    renderSearchResults(matches, rawQuery);
  } catch {
    clearSearchResults();
    searchStatus.textContent = "Search is temporarily unavailable. You can still browse Procedures from the navigation.";
  }
}

if (searchToggle && searchDialog && searchInput) {
  searchToggle.addEventListener("click", async () => {
    closeMobileMenu();
    if (typeof searchDialog.showModal === "function") searchDialog.showModal();
    else searchDialog.setAttribute("open", "");
    searchInput.focus();

    try {
      await loadSearchIndex();
    } catch {
      if (searchStatus) searchStatus.textContent = "Search is temporarily unavailable. You can still browse Procedures from the navigation.";
    }
  });

  searchClose?.addEventListener("click", () => searchDialog.close());

  searchDialog.addEventListener("click", (event) => {
    if (event.target === searchDialog) searchDialog.close();
  });

  searchDialog.addEventListener("close", () => {
    searchToggle.focus();
  });

  searchInput.addEventListener("input", runSiteSearch);

  searchResults?.addEventListener("click", (event) => {
    if (event.target.closest("a")) searchDialog.close();
  });
}

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
  if (event.key === "/" && !typing && searchToggle && searchDialog) {
    event.preventDefault();
    searchToggle.click();
  }
});
