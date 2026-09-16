import { access, cp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const source = resolve(root, "src");
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const required = [
  "tooth-extraction-cost/index.html",
  "dental-implant-cost-calculator/index.html",
  "full-mouth-dental-implants-cost/index.html",
  "dental-bone-graft-cost/index.html",
  "all-on-4-dental-implants-cost/index.html",
  "assets/site.css",
  "assets/calc001-plain.css",
  "assets/calc008-core.mjs",
  "assets/calc008-ui.mjs",
  "assets/implant-calculators-core.mjs",
  "assets/implant-calculators-ui.mjs",
  "assets/calc001-guided-ui.mjs",
  "assets/calc001-charge-select.mjs",
];

for (const path of required) await access(resolve(output, path));

const pageChecks = [
  {
    path: "tooth-extraction-cost/index.html",
    tokens: [
      '<meta name="robots" content="noindex,nofollow">',
      '<h1>Tooth extraction cost by quote type</h1>',
      '[CALCULATOR: CALC-008',
      'id="calculator"',
      'aria-live="polite"',
    ],
  },
  {
    path: "dental-implant-cost-calculator/index.html",
    tokens: [
      '<meta name="robots" content="noindex,nofollow">',
      '<h1>Dental implant cost calculator</h1>',
      'data-calculator-id="CALC-001"',
      'data-calculator="calc001"',
      'id="calculator"',
      'aria-live="polite"',
      'data-step-indicator="1"',
      'data-step-indicator="2"',
      'data-step-indicator="3"',
      '/assets/calc001-guided-ui.mjs',
      '/assets/calc001-charge-select.mjs',
      '/assets/calc001-plain.css',
      'Does your quote show one total or separate charges?',
      'Estimated insurance payment',
      '$2,143',
      '$1,646–$4,157',
    ],
    headings: [
      "How much does a dental implant cost?",
      "Dental implant cost calculator",
      "What does a single-tooth implant quote include?",
      "Why the implant, connector and crown can be separate charges",
      "What changes the price of a dental implant quote?",
      "How insurance can change out-of-pocket cost",
      "How mini, zirconia and immediate-load labels can affect the quote",
      "When tooth removal or bone grafting costs extra",
      "Related dental implant cost guides",
    ],
  },
  {
    path: "full-mouth-dental-implants-cost/index.html",
    tokens: [
      '<meta name="robots" content="noindex,nofollow">',
      '<h1>Full-mouth dental implant cost: per-arch quote guide</h1>',
      '[CALCULATOR: CALC-003',
      'data-calculator="calc003"',
      'id="calculator"',
      'aria-live="polite"',
      '$20,000–$45,000',
      'no national per-arch default',
    ],
    headings: [
      "How much do full-mouth dental implants cost?",
      "Full-arch and full-mouth quotes are not the same unit",
      "What does a full-arch implant quote include?",
      "Fixed and removable implant restorations can be quoted differently",
      "What changes a full-mouth implant quote?",
      "Full-mouth dental implant cost calculator",
      "How insurance can affect the patient estimate",
      "When the quote is specifically All-on-4",
      "Related implant and replacement cost guides",
    ],
  },
  {
    path: "dental-bone-graft-cost/index.html",
    tokens: [
      '<meta name="robots" content="noindex,nofollow">',
      '<h1>Dental bone graft cost by graft type and quote scope</h1>',
      '$652–$1,575',
      '$2,161–$5,148',
      'Sinus-lift pricing is intentionally excluded',
    ],
    headings: [
      "How much does a dental bone graft cost?",
      "Bone graft prices depend on the graft type and quoted site",
      "Autograft, allograft, xenograft and alloplast are different quote categories",
      "Is the bone graft included in an implant or extraction quote?",
      "What can change the bone graft quote?",
      "How insurance can affect the patient cost",
      "What this page does not price or decide",
      "Related dental cost guides",
    ],
  },
  {
    path: "all-on-4-dental-implants-cost/index.html",
    tokens: [
      '<meta name="robots" content="noindex,nofollow">',
      '<h1>All-on-4 dental implant cost: per-arch quote guide</h1>',
      '[CALCULATOR: CALC-003-A04',
      'data-calculator="calc003-a04"',
      'id="calculator"',
      'aria-live="polite"',
      '$15,176',
      '$11,640–$27,500',
    ],
    headings: [
      "How much do All-on-4 dental implants cost?",
      "What does All-on-4 mean in a dental quote?",
      "Is an All-on-4 price per arch or for a full mouth?",
      "What may be included in an All-on-4 package?",
      "What changes an All-on-4 quote?",
      "All-on-4 cost calculator",
      "How insurance can affect out-of-pocket cost",
      "All-on-4 vs. generic full-arch implant quotes",
      "Related dental implant cost guides",
    ],
  },
];

for (const check of pageChecks) {
  const html = await readFile(resolve(output, check.path), "utf8");
  for (const token of check.tokens) {
    if (!html.includes(token)) throw new Error(`${check.path}: required token missing: ${token}`);
  }
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) throw new Error(`${check.path}: expected exactly one H1; found ${h1Count}`);

  if (check.headings) {
    let cursor = -1;
    for (const heading of check.headings) {
      const token = `<h2${heading === "Dental implant cost calculator" ? ' id="calculator-heading"' : ""}>${heading}</h2>`;
      const index = html.indexOf(token, cursor + 1);
      if (index === -1) throw new Error(`${check.path}: frozen H2 missing or out of order: ${heading}`);
      cursor = index;
    }
  }
}

const files = await readdir(output, { recursive: true });
console.log(`Build complete: ${files.filter((file) => !file.endsWith("/")).length} output entries in dist/`);
