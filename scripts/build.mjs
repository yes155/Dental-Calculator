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
  "assets/calc008-core.mjs",
  "assets/calc008-ui.mjs",
  "assets/implant-calculators-core.mjs",
  "assets/implant-calculators-ui.mjs",
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
      '<h1>Dental implant cost calculator: single-tooth quote components</h1>',
      '[CALCULATOR: CALC-001',
      'data-calculator="calc001"',
      'id="calculator"',
      'aria-live="polite"',
      '$2,143',
      '$1,646–$4,157',
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
  },
];

for (const check of pageChecks) {
  const html = await readFile(resolve(output, check.path), "utf8");
  for (const token of check.tokens) {
    if (!html.includes(token)) throw new Error(`${check.path}: required token missing: ${token}`);
  }
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) throw new Error(`${check.path}: expected exactly one H1; found ${h1Count}`);
}

const files = await readdir(output, { recursive: true });
console.log(`Build complete: ${files.filter((file) => !file.endsWith("/")).length} output entries in dist/`);
