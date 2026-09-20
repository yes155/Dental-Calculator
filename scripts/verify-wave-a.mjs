import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const output = resolve(root, "dist");

const waveARoutes = [
  "index.html",
  "dental-cleaning-cost/index.html",
  "dental-inlay-cost/index.html",
  "root-canal-cost/index.html",
  "deep-teeth-cleaning-cost/index.html",
  "tooth-extraction-cost/index.html",
  "dental-filling-cost/index.html",
  "dental-x-ray-cost/index.html",
  "dental-onlay-cost/index.html",
  "dental-crown-cost/index.html",
  "dentist-visit-cost/index.html",
  "dental-insurance-out-of-pocket-costs/index.html",
  "affordable-dental-care/index.html",
  "about/index.html",
  "editorial-policy/index.html",
  "authors/farrukh-abdullah/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "corrections-and-updates/index.html",
  "cost-data-methodology/index.html",
  "calculator-methodology/index.html",
  "disclosures/index.html",
  "medical-disclaimer/index.html",
  "reviewers/juliana-maia-teixeira/index.html",
];

const requiredAssets = [
  "assets/site.css",
  "assets/trust.css",
  "assets/people/juliana-maia-teixeira.webp",
  "assets/media/home-dental-cost-hero.webp",
  "assets/brand/favicon.svg",
  "assets/media/dental-cleaning-cost-hero.svg",
  "assets/site-chrome.mjs",
  "assets/media/home-icons.svg",
  "assets/state-costs.mjs",
  "assets/data/state-dental-costs.json",
];

for (const path of [...waveARoutes, ...requiredAssets]) {
  await access(resolve(output, path));
}

const forbiddenReaderMarkers = /\[SOURCE NEEDED BEFORE PUBLICATION\]|\[EDITOR NOTE[^\]]*\]|\[TODO[^\]]*\]|\[PLACEHOLDER[^\]]*\]|planned but not live|— planned/i;

for (const path of waveARoutes) {
  const html = await readFile(resolve(output, path), "utf8");
  if (!html.includes('<meta name="robots" content="noindex,nofollow">')) {
    throw new Error(`${path}: Wave A preview route must remain noindex,nofollow`);
  }
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) throw new Error(`${path}: expected exactly one H1; found ${h1Count}`);
  if (forbiddenReaderMarkers.test(html)) throw new Error(`${path}: unresolved internal publication marker reached reader copy`);
}

const siteCss = await readFile(resolve(output, "assets/site.css"), "utf8");
for (const token of ["Universal interaction + calculator density contract", "Universal money-input focus contract", "Homepage whitespace correction", "Institutional editorial system", "Homepage semantic color and responsive polish contract", "Unified one-page-per-procedure architecture", "--brand-purple", ".footer-motto", ".calculator-card--guided", ".orthodontic-calculator", ".cosmetic-calculator", ".prosthetic-calculator"]) {
  if (!siteCss.includes(token)) throw new Error(`site css: calculator density contract token missing: ${token}`);
}

const stateScript = await readFile(resolve(output, "assets/state-costs.mjs"), "utf8");
for (const token of ["STANDARD_BANDS", "rankOf", "renderSimilar", "data-state-range-selected", "has-selection", "aria-pressed"]) {
  if (!stateScript.includes(token)) throw new Error(`state costs: information-gain/standardized-scale token missing: ${token}`);
}

const chromeScript = await readFile(resolve(output, "assets/site-chrome.mjs"), "utf8");
for (const token of ["pointerdown", "Escape", "toggle"]) {
  if (!chromeScript.includes(token)) throw new Error(`site chrome: dropdown behavior token missing: ${token}`);
}

const homepage = await readFile(resolve(output, "index.html"), "utf8");
for (const token of [
  "home-hero--image",
  "/assets/media/home-dental-cost-hero.webp",
  "/cost-data-methodology/",
  "/calculator-methodology/",
  "<details class=\"nav-dropdown nav-resource nav-resource--procedures\">",
  "site-brand-bar",
  "site-nav-bar",
  "One procedure page brings the cost evidence and quote-check tools together.",
  "Browse dental procedures",
  "Roboto+Condensed",
  "Know what a dental procedure should cost",
  "These are estimates based on your inputs and stated assumptions — not a dentist's fee and not a guarantee of coverage.",
  "/editorial-policy/",
  "/medical-disclaimer/",
  "home-calculator-entry",
  "procedure-finder-form",
  "Find the right dental cost resource",
  "Open the page for your dental procedure",
  "Open procedure page",
  "Dental procedure pages",
  "Each link opens the single page for that procedure",
  "Published price examples",
  "Three example prices from published sources",
  "Open the dental cleaning page →",
  "data-cost-browser",
  "Choose a type of dental care",
  "What can change the price",
  "Visible sources, authorship and review boundaries",
  "What these dental cost pages can—and cannot—tell you",
  "data-state-costs",
  "How prices can change by state",
  "Open the full state comparison",
  "Compare all 51 jurisdictions in a table",
  "Standardized color scale",
  "Closest published state averages",
  "Same procedure",
  "doorway-icon",
  "finder-help",
  "cost-tab-copy",
  "price-teaser-icon",
  "faq-preview",
]) {
  if (!homepage.includes(token)) throw new Error(`homepage: required Wave A trust/ownership token missing: ${token}`);
}

const procedureDoorwayIndex = homepage.indexOf("doorway-card--procedure");
const procedureFinderIndex = homepage.indexOf('id="procedure-finder"');
if (!(procedureDoorwayIndex >= 0 && procedureFinderIndex > procedureDoorwayIndex)) {
  throw new Error("homepage: procedure doorway must lead into the unified procedure finder");
}
const heroIndex = homepage.indexOf("home-hero--image");
const doorwayIndex = homepage.indexOf("Find the right dental cost resource");
const categoryIndex = homepage.indexOf("Choose a type of dental care");
const priceIndex = homepage.indexOf("Three example prices from published sources");
const stateIndex = homepage.indexOf("How prices can change by state");
if (!(heroIndex >= 0 && doorwayIndex > heroIndex && categoryIndex > doorwayIndex && priceIndex > categoryIndex && stateIndex > priceIndex)) {
  throw new Error("homepage: expected order is hero → doorways → category browser → price teaser → state teaser");
}

const homepageLinks = [...homepage.matchAll(/href="(\/[^"]*\/)"/g)].map((match) => match[1]);
for (const href of new Set(homepageLinks)) {
  const target = href === "/" ? "index.html" : `${href.slice(1)}index.html`;
  await access(resolve(output, target));
}

const cleaningMeta = await readFile(resolve(output, "dental-cleaning-cost/index.html"), "utf8");
for (const token of ["Written by", "Last updated", "/authors/farrukh-abdullah/"]) {
  if (!cleaningMeta.includes(token)) throw new Error(`cleaning metadata: expected authority-style metadata token missing: ${token}`);
}
if (cleaningMeta.includes("Evidence checked") || cleaningMeta.includes("Research and written by")) {
  throw new Error("cleaning metadata: legacy metadata wording must not reach reader copy");
}

const contact = await readFile(resolve(output, "contact/index.html"), "utf8");
for (const token of ["f.abdullah79@gmail.com", "We cannot diagnose symptoms", "/corrections-and-updates/"]) {
  if (!contact.includes(token)) throw new Error(`contact: required trust token missing: ${token}`);
}

const privacy = await readFile(resolve(output, "privacy/index.html"), "utf8");
for (const token of [
  "Quote values are not intentionally sent to, stored by or serialized to an external service by the calculator logic.",
  "current prelaunch source does not intentionally rely on advertising or analytics cookies",
]) {
  if (!privacy.includes(token)) throw new Error(`privacy: required behavior disclosure missing: ${token}`);
}

const terms = await readFile(resolve(output, "terms/index.html"), "utf8");
for (const token of [
  "not actual dental quotes or coverage guarantees",
  "does not provide diagnosis, treatment planning, eligibility decisions",
]) {
  if (!terms.includes(token)) throw new Error(`terms: required limitation missing: ${token}`);
}

const author = await readFile(resolve(output, "authors/farrukh-abdullah/index.html"), "utf8");
if (!author.includes("Researcher &amp; Writer") || !author.includes("not as a dentist or licensed clinical professional")) {
  throw new Error("author profile: research/writer role boundary missing");
}

const reviewer = await readFile(resolve(output, "reviewers/juliana-maia-teixeira/index.html"), "utf8");
for (const token of ["Clinical &amp; Scientific Reviewer", "PhD in Functional and Molecular Biology", "MSc in Dentistry, Oral Physiology", "only after the exact page version has actually been reviewed"]) {
  if (!reviewer.includes(token)) throw new Error(`reviewer profile: required verified role/credential token missing: ${token}`);
}

const calcMethod = await readFile(resolve(output, "calculator-methodology/index.html"), "utf8");
if (!calcMethod.includes("Blank is not zero") || !calcMethod.includes("not an actual dental quote and not a coverage guarantee")) {
  throw new Error("calculator methodology: required estimator safeguards missing");
}

const costMethod = await readFile(resolve(output, "cost-data-methodology/index.html"), "utf8");
for (const token of [
  "does not merge unrelated local fees, plan copays or differently scoped sources",
  "State-by-state price comparisons",
  "does not create state-specific indexable URLs",
]) {
  if (!costMethod.includes(token)) throw new Error(`cost methodology: required geographic/source-scope token missing: ${token}`);
}

const trustPrefixes = [
  "about/", "editorial-policy/", "authors/", "contact/", "privacy/", "terms/",
  "corrections-and-updates/", "cost-data-methodology/", "calculator-methodology/",
  "disclosures/", "medical-disclaimer/", "reviewers/",
];
for (const path of waveARoutes) {
  if (trustPrefixes.some((prefix) => path.startsWith(prefix))) continue;
  const html = await readFile(resolve(output, path), "utf8");
  if (html.includes("Reviewed by Juliana Maia Teixeira")) {
    throw new Error(`${path}: page-specific reviewer credit requires exact-version review approval`);
  }
}

console.log(`Wave A build gate passed: ${waveARoutes.length} required routes + ${requiredAssets.length} trust assets.`);
