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

const homepage = await readFile(resolve(output, "index.html"), "utf8");
for (const token of [
  "home-hero--image",
  "/assets/media/home-dental-cost-hero.webp",
  "/cost-data-methodology/",
  "/calculator-methodology/",
  "<details class=\"nav-dropdown\">",
  "Find out what a dental procedure should cost — before you book it",
  "These are estimates based on your inputs and stated assumptions — not a dentist's fee and not a guarantee of coverage.",
  "/editorial-policy/",
  "/medical-disclaimer/",
  "procedure-finder-form",
  "Published price context",
  "Four things to check on a dental quote",
  "How to use Dental Cost Calculator",
]) {
  if (!homepage.includes(token)) throw new Error(`homepage: required Wave A trust/ownership token missing: ${token}`);
}

const homepageLinks = [...homepage.matchAll(/href="(\/[^"]*\/)"/g)].map((match) => match[1]);
for (const href of new Set(homepageLinks)) {
  const target = href === "/" ? "index.html" : `${href.slice(1)}index.html`;
  await access(resolve(output, target));
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
if (!costMethod.includes("does not merge unrelated local fees, plan copays or differently scoped sources")) {
  throw new Error("cost methodology: source-scope safeguard missing");
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
