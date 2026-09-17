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
  "dental-x-ray-cost/index.html",
  "dental-cleaning-cost/index.html",
  "deep-teeth-cleaning-cost/index.html",
  "assets/site.css",
  "assets/calc001-plain.css",
  "assets/arch-calculators-guided.css",
  "assets/cleaning-calculator.css",
  "assets/calc008-core.mjs",
  "assets/calc008-ui.mjs",
  "assets/implant-calculators-core.mjs",
  "assets/implant-calculators-ui.mjs",
  "assets/calc001-guided-ui.mjs",
  "assets/calc001-charge-select.mjs",
  "assets/arch-calculators-guided-ui.mjs",
  "assets/cleaning-calculator-core.mjs",
  "assets/cleaning-calculator-ui.mjs",
  "assets/deep-cleaning-calculator-core.mjs",
  "assets/deep-cleaning-calculator-ui.mjs",
];

for (const path of required) await access(resolve(output, path));

const pageChecks = [
  {
    path: "tooth-extraction-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Tooth extraction cost by quote type</h1>','[CALCULATOR: CALC-008','id="calculator"','aria-live="polite"'],
  },
  {
    path: "dental-implant-cost-calculator/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental implant cost calculator</h1>','data-calculator-id="CALC-001"','data-calculator="calc001"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/calc001-guided-ui.mjs','/assets/calc001-charge-select.mjs','/assets/calc001-plain.css','Does your quote show one total or separate charges?','Estimated insurance payment','$2,143','$1,646–$4,157'],
    headings: ["How much does a dental implant cost?","Dental implant cost calculator","What does a single-tooth implant quote include?","Why the implant, connector and crown can be separate charges","What changes the price of a dental implant quote?","How insurance can change out-of-pocket cost","How mini, zirconia and immediate-load labels can affect the quote","When tooth removal or bone grafting costs extra","Related dental implant cost guides"],
  },
  {
    path: "full-mouth-dental-implants-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Full-mouth dental implants cost</h1>','data-calculator-id="CALC-003"','data-calculator="calc003"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/arch-calculators-guided-ui.mjs','/assets/arch-calculators-guided.css','How many arches does this quote cover?','Estimated insurance payment','Broad U.S. context — reference only','$20,000–$45,000','not a per-arch price'],
    headings: ["Full-mouth dental implant cost calculator","How much do full-mouth dental implants cost?","Full-arch and full-mouth quotes are not the same unit","What does a full-arch implant quote include?","Fixed and removable implant restorations can be quoted differently","What changes a full-mouth implant quote?","How insurance can affect the patient estimate","When the quote is specifically All-on-4","Related implant and replacement cost guides"],
  },
  {
    path: "dental-bone-graft-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental bone graft cost by graft type and quote scope</h1>','$652–$1,575','$2,161–$5,148','Sinus-lift pricing is intentionally excluded'],
    headings: ["How much does a dental bone graft cost?","Bone graft prices depend on the graft type and quoted site","Autograft, allograft, xenograft and alloplast are different quote categories","Is the bone graft included in an implant or extraction quote?","What can change the bone graft quote?","How insurance can affect the patient cost","What this page does not price or decide","Related dental cost guides"],
  },
  {
    path: "all-on-4-dental-implants-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>All-on-4 dental implant cost</h1>','data-calculator-id="CALC-003-A04"','data-calculator="calc003-a04"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/arch-calculators-guided-ui.mjs','/assets/arch-calculators-guided.css','How many arches does this quote cover?','Estimated insurance payment','U.S. price reference — reference only','$15,176','$11,640–$27,500'],
    headings: ["All-on-4 cost calculator","How much do All-on-4 dental implants cost?","What does All-on-4 mean in a dental quote?","Is an All-on-4 price per arch or for a full mouth?","What may be included in an All-on-4 package?","What changes an All-on-4 quote?","How insurance can affect out-of-pocket cost","All-on-4 vs. generic full-arch implant quotes","Related dental implant cost guides"],
  },
  {
    path: "dental-x-ray-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental X-ray costs by type</h1>','$65','$52–$120','$226','$175–$428','$466','$361–$879','CareCredit','2024 Synchrony','no universal X-ray coverage percentage'],
    headings: ["How much do dental X-rays cost?","Dental X-ray costs by type","Bitewing, periapical and full-mouth series are different price units","Panoramic, cephalometric and cone-beam CT costs","Are dental X-rays included in an exam or cleaning visit?","What can change the price of dental X-rays?","How insurance and frequency limits can affect what you pay","How often you need X-rays is not a cost-calculator decision","Related dental cost guides"],
  },
  {
    path: "dental-cleaning-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental cleaning cost</h1>','data-calculator-id="CALC-002"','data-calculator="calc002"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/cleaning-calculator-ui.mjs','/assets/cleaning-calculator.css','$85–$160','without dental benefits','$104','$80–$109','Orlando, Florida','$203','broader bundle'],
    headings: ["How much does a dental cleaning cost?","Dental cleaning cost calculator","What does a standard dental cleaning price include?","Are the exam and X-rays included in a cleaning quote?","What can change a dental cleaning quote?","How insurance can change what you pay","Routine cleaning, deep cleaning and periodontal maintenance are different","Related dental cost guides"],
  },
  {
    path: "deep-teeth-cleaning-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Deep teeth cleaning cost by quadrant</h1>','data-calculator-id="CALC-006"','data-calculator="calc006"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/deep-cleaning-calculator-ui.mjs','$180–$295','per quadrant','$235–$303','Orlando, Florida','not a default full-mouth total','Published reference — not a calculator default'],
    headings: ["How much does deep teeth cleaning cost?","Deep cleaning cost calculator","What does “per quadrant” mean in a deep cleaning quote?","What can be included or charged separately?","What changes a scaling and root planing quote?","Routine cleaning, deep cleaning, debridement and maintenance are not the same","How insurance can affect the patient amount","Related dental cost guides"],
  },
];

const calculatorHeadings = new Set(["Dental implant cost calculator","Full-mouth dental implant cost calculator","All-on-4 cost calculator","Dental cleaning cost calculator","Deep cleaning cost calculator"]);

for (const check of pageChecks) {
  const html = await readFile(resolve(output, check.path), "utf8");
  for (const token of check.tokens) if (!html.includes(token)) throw new Error(`${check.path}: required token missing: ${token}`);
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) throw new Error(`${check.path}: expected exactly one H1; found ${h1Count}`);

  if (check.path !== "tooth-extraction-cost/index.html" && html.includes("[CALCULATOR:")) throw new Error(`${check.path}: internal calculator ID must not be visible in rendered copy`);

  if (check.headings) {
    let cursor = -1;
    for (const heading of check.headings) {
      const token = `<h2${calculatorHeadings.has(heading) ? ' id="calculator-heading"' : ""}>${heading}</h2>`;
      const index = html.indexOf(token, cursor + 1);
      if (index === -1) throw new Error(`${check.path}: frozen H2 missing or out of order: ${heading}`);
      cursor = index;
    }
  }

  if (["full-mouth-dental-implants-cost/index.html", "all-on-4-dental-implants-cost/index.html"].includes(check.path)) {
    const calculatorIndex = html.indexOf('id="calculator-heading"');
    const firstDetailIndex = html.indexOf('<h2>How much do ');
    if (calculatorIndex === -1 || firstDetailIndex === -1 || calculatorIndex > firstDetailIndex) throw new Error(`${check.path}: calculator must appear immediately after the answer-first header and before detailed H2 content`);
  }

  if (check.path === "dental-x-ray-cost/index.html") {
    if (html.includes("$52–$120 range for dental X-rays")) throw new Error("DEN-011: bitewing-specific range must not be generalized to all dental X-rays");
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("DEN-011: no calculator is assigned in the frozen registry");
  }

  if (check.path === "dental-cleaning-cost/index.html") {
    const priceIndex = html.indexOf('<h2>How much does a dental cleaning cost?</h2>');
    const calculatorIndex = html.indexOf('id="calculator-heading"');
    const nextDetailIndex = html.indexOf('<h2>What does a standard dental cleaning price include?</h2>');
    if (!(priceIndex !== -1 && calculatorIndex > priceIndex && calculatorIndex < nextDetailIndex)) throw new Error("DEN-002: calculator must immediately follow the answer-first cleaning price section");
    if (html.includes("$203 standard cleaning")) throw new Error("DEN-002: CareCredit $203 bundle must not be relabeled as cleaning-only");
  }

  if (check.path === "deep-teeth-cleaning-cost/index.html") {
    const priceIndex = html.indexOf('<h2>How much does deep teeth cleaning cost?</h2>');
    const calculatorIndex = html.indexOf('id="calculator-heading"');
    const nextDetailIndex = html.indexOf('<h2>What does “per quadrant” mean in a deep cleaning quote?</h2>');
    if (!(priceIndex !== -1 && calculatorIndex > priceIndex && calculatorIndex < nextDetailIndex)) throw new Error("DEN-006: calculator must immediately follow the answer-first per-quadrant price section");
    if (html.includes("$720–$1,180") || html.includes("$940–$1,212")) throw new Error("DEN-006: published per-quadrant references must not be multiplied into a four-quadrant default");
    if (html.includes("data-default-quadrants")) throw new Error("DEN-006: calculator must not infer or default the quadrant count");
  }
}

const files = await readdir(output, { recursive: true });
console.log(`Build complete: ${files.filter((file) => !file.endsWith("/")).length} output entries in dist/`);
