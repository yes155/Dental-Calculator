import { access, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const source = resolve(root, "src");
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const sharedHeader = `<header class="site-header site-header--nav" data-site-chrome="shared-v1">
  <div class="site-brand-bar">
    <div class="site-header-inner site-header-inner--brand">
      <a class="site-brand site-brand--with-icon" href="/">
        <img class="site-brand-mark" src="/assets/brand/favicon.svg" alt="" width="34" height="34">
        <span>Dental Cost Calculator</span>
      </a>
      <span class="site-utility">Independent U.S. dental cost education</span>
    </div>
  </div>
  <div class="site-nav-bar">
    <div class="site-header-inner site-header-inner--nav">
      <nav class="site-nav" aria-label="Primary">
      <a href="/#common-costs">Cost guides</a>
      <details class="nav-dropdown">
        <summary>Calculators</summary>
        <div class="nav-dropdown-panel">
          <div>
            <strong>Everyday &amp; restorative</strong>
            <a href="/dental-cleaning-cost/">Dental cleaning</a>
            <a href="/deep-teeth-cleaning-cost/">Deep cleaning</a>
            <a href="/dental-filling-cost/">Dental filling</a>
            <a href="/root-canal-cost/">Root canal</a>
            <a href="/dental-crown-cost/">Dental crown</a>
            <a href="/tooth-extraction-cost/">Tooth extraction</a>
            <a href="/wisdom-teeth-removal-cost/">Wisdom teeth removal</a>
          </div>
          <div>
            <strong>Implants &amp; replacement</strong>
            <a href="/dental-implant-cost-calculator/">Dental implant</a>
            <a href="/all-on-4-dental-implants-cost/">All-on-4</a>
            <a href="/full-mouth-dental-implants-cost/">Full-mouth implants</a>
            <a href="/dental-bridge-cost/">Dental bridge</a>
            <a href="/dentures-cost/">Dentures</a>
          </div>
          <div>
            <strong>Orthodontic &amp; cosmetic</strong>
            <a href="/invisalign-cost-calculator/">Invisalign</a>
            <a href="/braces-cost/">Braces</a>
            <a href="/dental-veneers-cost/">Veneers</a>
          </div>
        </div>
      </details>
      <a href="/about/">About</a>
      <a href="/contact/">Contact</a>
      </nav>
    </div>
  </div>
</header>`;

const sharedFooter = `<footer class="site-footer site-footer--expanded" data-site-chrome="shared-v1">
  <div class="footer-motto">
    <span>Compare a published benchmark with the scope of your written quote.</span>
    <a href="/#common-costs">Browse dental cost guides</a>
  </div>
  <div class="site-footer-inner">
    <div class="footer-brand-block">
      <a class="footer-brand" href="/"><img src="/assets/brand/favicon.svg" alt="" width="38" height="38"><span>Dental Cost Calculator</span></a>
      <p>U.S. dental cost guides and quote-based calculators.</p>
    </div>
    <div class="footer-grid">
      <section>
        <h2>Cost guides</h2>
        <a href="/dental-cleaning-cost/">Dental cleaning</a>
        <a href="/root-canal-cost/">Root canal</a>
        <a href="/dental-crown-cost/">Dental crown</a>
        <a href="/tooth-extraction-cost/">Tooth extraction</a>
        <a href="/dental-implant-cost-calculator/">Dental implants</a>
      </section>
      <section>
        <h2>Calculators</h2>
        <a href="/dental-implant-cost-calculator/">Implant calculator</a>
        <a href="/dental-cleaning-cost/">Cleaning calculator</a>
        <a href="/deep-teeth-cleaning-cost/">Deep cleaning calculator</a>
        <a href="/invisalign-cost-calculator/">Invisalign calculator</a>
      </section>
      <section>
        <h2>How we work</h2>
        <a href="/editorial-policy/">Editorial Policy</a>
        <a href="/cost-data-methodology/">Cost Data Methodology</a>
        <a href="/calculator-methodology/">Calculator Methodology</a>
        <a href="/corrections-and-updates/">Corrections &amp; Updates</a>
        <a href="/medical-disclaimer/">Medical Disclaimer</a>
      </section>
      <section>
        <h2>About this site</h2>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy/">Privacy</a>
        <a href="/terms/">Terms</a>
        <a href="/disclosures/">Disclosures</a>
      </section>
    </div>
    <div class="footer-bottom">
      <p>© 2026 DentalCostCalculator.site</p>
      <p>Cost education only; not a diagnosis, dental quote or insurance guarantee.</p>
    </div>
  </div>
</footer>`;

const htmlPaths = (await readdir(output, { recursive: true })).filter((path) => path.endsWith(".html"));
for (const path of htmlPaths) {
  const target = resolve(output, path);
  let html = await readFile(target, "utf8");


  html = html.replace(/Research and written by/gi, "Written by");
  html = html.replace(/Evidence checked/gi, "Last updated");
  html = html.replace(
    /<p class="byline">Written by Farrukh Abdullah<\/p>\s*<p class="updated">Last updated ([^<]+)<\/p>/gi,
    '<p class="article-meta"><span class="byline">Written by <a href="/authors/farrukh-abdullah/">Farrukh Abdullah</a></span><span class="updated">Last updated $1</span></p>'
  );
  html = html.replace(
    /<p class="byline">Written by <a href="\/authors\/farrukh-abdullah\/"[^>]*>Farrukh Abdullah<\/a><\/p>\s*<p class="updated">Last updated ([^<]+)<\/p>/gi,
    '<p class="article-meta"><span class="byline">Written by <a href="/authors/farrukh-abdullah/">Farrukh Abdullah</a></span><span class="updated">Last updated $1</span></p>'
  );

  html = html.replace(
    /<div class="procedure-meta">\s*<span>Written by (?:<a[^>]*>)?Farrukh Abdullah(?:<\/a>)?<\/span>\s*<span>Last updated ([^<]+)<\/span>\s*<\/div>/gi,
    '<p class="article-meta"><span class="byline">Written by <a href="/authors/farrukh-abdullah/">Farrukh Abdullah</a></span><span class="updated">Last updated $1</span></p>'
  );

  html = html.replace(/<link rel="icon"[^>]*>\s*/gi, "");
  html = html.replace("</head>", '  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;600;700&display=swap" rel="stylesheet">\n  <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg">\n  <script type="module" src="/assets/site-chrome.mjs"></script>\n</head>');

  const headerPattern = /<header class="site-header[^"]*"[^>]*>[\s\S]*?<\/header>/i;
  if (headerPattern.test(html)) html = html.replace(headerPattern, sharedHeader);

  const footerPattern = /<footer class="site-footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i;
  if (footerPattern.test(html)) html = html.replace(footerPattern, sharedFooter);

  html = html
    .replace(/<nav[^>]*class="[^"]*breadcrumbs?[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<div[^>]*class="[^"]*breadcrumbs?[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

  await writeFile(target, html);
}

for (const path of htmlPaths) {
  const html = await readFile(resolve(output, path), "utf8");
  if (!html.includes('data-site-chrome="shared-v1"')) throw new Error(`${path}: shared site chrome missing`);
  if (!html.includes('/assets/brand/favicon.svg')) throw new Error(`${path}: universal favicon missing`);
}


const required = [
  "tooth-extraction-cost/index.html",
  "dental-implant-cost-calculator/index.html",
  "full-mouth-dental-implants-cost/index.html",
  "dental-bone-graft-cost/index.html",
  "dental-inlay-cost/index.html",
  "dental-onlay-cost/index.html",
  "dentist-visit-cost/index.html",
  "affordable-dental-care/index.html",
  "all-on-4-dental-implants-cost/index.html",
  "dental-x-ray-cost/index.html",
  "dental-cleaning-cost/index.html",
  "deep-teeth-cleaning-cost/index.html",
  "dental-insurance-out-of-pocket-costs/index.html",
  "assets/site.css",
  "assets/inlay-page.css",
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
    headings: ["Dental implant cost calculator","How much does a dental implant cost?","What does a single-tooth implant quote include?","Why the implant, connector and crown can be separate charges","What changes the price of a dental implant quote?","How insurance can change out-of-pocket cost","How mini, zirconia and immediate-load labels can affect the quote","When tooth removal or bone grafting costs extra","Related dental implant cost guides"],
  },
  {
    path: "full-mouth-dental-implants-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Full-mouth dental implants cost</h1>','data-calculator-id="CALC-003"','data-calculator="calc003"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/arch-calculators-guided-ui.mjs','/assets/arch-calculators-guided.css','How many arches does this quote cover?','Estimated insurance payment','Published prices stay separate','$20,000–$45,000','not a per-arch price'],
    headings: ["Full-mouth dental implants cost calculator","How much do full-mouth dental implants cost?","Full-arch and full-mouth quotes are not the same unit","What does a full-arch implant quote include?","Fixed and removable implant restorations can be quoted differently","What changes a full-mouth implant quote?","How insurance can affect the patient estimate","When the quote is specifically All-on-4","Related implant and replacement cost guides"],
  },
  {
    path: "dental-bone-graft-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental bone graft cost by graft type and quote scope</h1>','$652–$1,575','$2,161–$5,148','Sinus-lift pricing is intentionally excluded'],
    headings: ["How much does a dental bone graft cost?","Bone graft prices depend on the graft type and quoted site","Autograft, allograft, xenograft and alloplast are different quote categories","Is the bone graft included in an implant or extraction quote?","What can change the bone graft quote?","How insurance can affect the patient cost","What this page does not price or decide","Related dental cost guides"],
  },
  {
    path: "dental-inlay-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental inlay cost</h1>','$976 average','$755–$1,774','ceramic inlay or onlay','does not provide a clean inlay-only national range','There is no universal insurance percentage or copay for an inlay.'],
    headings: ["How much does a dental inlay cost?","Why the current national price data combines inlays and onlays","What should an inlay quote identify?","Are laboratory and visit costs included in an inlay price?","What can change an inlay quote?","How insurance can affect what you pay","Inlay cost versus onlay and filling cost","Related dental cost guides"],
  },
  {
    path: "dental-onlay-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental onlay cost</h1>','$976 average','$755–$1,774','ceramic inlay or onlay','does not provide a clean onlay-only national range','There is no universal insurance percentage or copay for an onlay.','onlay repair'],
    headings: ["How much does a dental onlay cost?","Why the current national price data combines onlays and inlays","What makes an onlay a distinct restoration?","What should an onlay quote identify?","Are laboratory and related service costs included in an onlay price?","What can change an onlay quote?","Onlay repair is not the same price category as a new onlay","How insurance can affect what you pay","Onlay cost versus inlay, filling and crown cost","Related dental cost guides"],
  },
  {
    path: "dentist-visit-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dentist visit cost</h1>','$203 average','$50–$350','includes a full cleaning and X-rays','There is no universal insurance percentage, copay or number of covered exams'],
    headings: ["How much does a dentist visit cost?","Why the current national price is a bundled visit, not an exam-only fee","What kind of dental visit is on the quote?","What should a dentist-visit quote identify?","Are cleaning and X-rays included in a dental checkup price?","What can change a dentist-visit quote?","How insurance can affect what you pay for a dental visit","Dentist visit cost versus cleaning and X-ray cost","Related dental cost guides"],
  },
  {
    path: "affordable-dental-care/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Affordable dental care</h1>','Availability, fees, eligibility and services vary','sliding-fee eligibility is based on income and family size','Adult Medicaid dental benefits are different: states decide','does not maintain a local clinic directory'],
    headings: ["Where can I look for lower-cost dental care?","Dental and dental-hygiene school clinics","Federally funded health centers and sliding fees","Medicaid and CHIP dental coverage","State, local and community resources","What to verify before booking lower-cost care","Compare the written quote, not just the advertised discount","What this guide does not promise","Related dental cost guides"],
  },
  {
    path: "all-on-4-dental-implants-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>All-on-4 dental implant cost</h1>','data-calculator-id="CALC-003-A04"','data-calculator="calc003-a04"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/arch-calculators-guided-ui.mjs','/assets/arch-calculators-guided.css','How many arches does this quote cover?','Estimated insurance payment','Published prices stay separate','$15,176','$11,640–$27,500'],
    headings: ["All-on-4 dental implants cost calculator","How much do All-on-4 dental implants cost?","What does All-on-4 mean in a dental quote?","Is an All-on-4 price per arch or for a full mouth?","What may be included in an All-on-4 package?","What changes an All-on-4 quote?","How insurance can affect out-of-pocket cost","All-on-4 vs. generic full-arch implant quotes","Related dental implant cost guides"],
  },
  {
    path: "dental-x-ray-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental X-ray costs by type</h1>','$65','$52–$120','$226','$175–$428','$466','$361–$879','CareCredit','2024 Synchrony','no universal X-ray coverage percentage'],
    headings: ["How much do dental X-rays cost?","Dental X-ray costs by type","Bitewing, periapical and full-mouth series are different price units","Panoramic, cephalometric and cone-beam CT costs","Are dental X-rays included in an exam or cleaning visit?","What can change the price of dental X-rays?","How insurance and frequency limits can affect what you pay","How often you need X-rays is not a cost-calculator decision","Related dental cost guides"],
  },
  {
    path: "dental-cleaning-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental cleaning cost</h1>','data-calculator-id="CALC-002"','data-calculator="calc002"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/cleaning-calculator-ui.mjs','/assets/cleaning-calculator.css','$85–$160','without dental benefits','$104','$80–$109','Orlando, Florida','$203','broader bundle'],
    headings: ["Dental cleaning cost calculator","How much does a dental cleaning cost?","What does a standard dental cleaning price include?","Are the exam and X-rays included in a cleaning quote?","What can change a dental cleaning quote?","How insurance can change what you pay","Routine cleaning, deep cleaning and periodontal maintenance are different","Related dental cost guides"],
  },
  {
    path: "deep-teeth-cleaning-cost/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Deep teeth cleaning cost by quadrant</h1>','data-calculator-id="CALC-006"','data-calculator="calc006"','id="calculator"','aria-live="polite"','data-step-indicator="1"','data-step-indicator="2"','data-step-indicator="3"','/assets/deep-cleaning-calculator-ui.mjs','$180–$295','per quadrant','$235–$303','Orlando, Florida','do not automatically multiply either observation by four','Published prices stay separate'],
    headings: ["Deep cleaning cost calculator","How much does deep teeth cleaning cost?","What does “per quadrant” mean in a deep cleaning quote?","What can be included or charged separately?","What changes a scaling and root planing quote?","Routine cleaning, deep cleaning, debridement and maintenance are not the same","How insurance can affect the patient amount","Related dental cost guides"],
  },
  {
    path: "dental-insurance-out-of-pocket-costs/index.html",
    tokens: ['<meta name="robots" content="noindex,nofollow">','<h1>Dental insurance and out-of-pocket costs</h1>','A coverage percentage alone does not tell you what you will pay.','2026 Delta Dental Federal Employees Dental Program (FEDVIP)','Every dollar amount and percentage below is invented for education.','This is an unnamed service under an imaginary plan','$1,000','$800','$50','20%','Patient responsibility','pretreatment estimate is nonbinding','Explanation of Benefits (EOB)'],
    headings: ["What determines your dental out-of-pocket cost?","Billed fees, allowed amounts and network status","Deductibles, coinsurance and copays","Annual maximums, exclusions and waiting periods","A worked example with hypothetical numbers","What changes for orthodontic benefits?","What to check before treatment and after a claim","Find the cost guide for your procedure"],
  },
];

const calculatorHeadings = new Set(["Dental implant cost calculator","Full-mouth dental implants cost calculator","All-on-4 dental implants cost calculator","Dental cleaning cost calculator","Deep cleaning cost calculator"]);

for (const check of pageChecks) {
  const html = await readFile(resolve(output, check.path), "utf8");
  for (const token of check.tokens) if (!html.includes(token)) throw new Error(`${check.path}: required token missing: ${token}`);
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) throw new Error(`${check.path}: expected exactly one H1; found ${h1Count}`);

  if (check.path !== "tooth-extraction-cost/index.html" && html.includes("[CALCULATOR:")) throw new Error(`${check.path}: internal calculator ID must not be visible in rendered copy`);

  if (check.headings) {
    let cursor = -1;
    for (const heading of check.headings) {
      const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const headingPattern = new RegExp(`<h2\\b([^>]*)>${escapedHeading}</h2>`, "i");
      const match = headingPattern.exec(html.slice(cursor + 1));
      if (!match) throw new Error(`${check.path}: frozen H2 missing or out of order: ${heading}`);
      if (calculatorHeadings.has(heading) && !/\\bid="calculator-heading"/i.test(match[1])) {
        throw new Error(`${check.path}: calculator H2 is missing id="calculator-heading": ${heading}`);
      }
      cursor += 1 + match.index;
    }
  }

  if (calculatorHeadings.has(check.headings?.[0])) {
    const h1Index = html.indexOf("<h1");
    const calculatorIndex = html.indexOf('id="calculator-heading"');
    const firstDetailHeading = check.headings[1];
    const firstDetailIndex = html.indexOf(`<h2>${firstDetailHeading}</h2>`);
    if (!(h1Index !== -1 && calculatorIndex > h1Index && firstDetailIndex > calculatorIndex)) {
      throw new Error(`${check.path}: calculator must appear after the H1 and before detailed cost education`);
    }
  }

  if (check.path === "dental-inlay-cost/index.html") {
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("DEN-004: no calculator is assigned in the frozen registry");
    if (html.includes("$250–$1,500")) throw new Error("DEN-004: older secondary inlay-only range must not appear in first-version reader copy");
    if (html.includes("$755–$1,774 inlay-only") || html.includes("inlay-only range of $755–$1,774")) throw new Error("DEN-004: combined ceramic inlay/onlay range must not be relabeled as inlay-only");
  }

  if (check.path === "dental-onlay-cost/index.html") {
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("DEN-013: no calculator is assigned in the frozen registry");
    if (html.includes("$350–$1,500")) throw new Error("DEN-013: older secondary onlay-only range must not appear in first-version reader copy");
    if (html.includes("$755–$1,774 onlay-only") || html.includes("onlay-only range of $755–$1,774")) throw new Error("DEN-013: combined ceramic inlay/onlay range must not be relabeled as onlay-only");
    if (html.includes("$141") || html.includes("$315") || html.includes("$342") || html.includes("$362")) throw new Error("DEN-013: named-plan copays must not be published as onlay price benchmarks");
  }

  if (check.path === "dentist-visit-cost/index.html") {
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("DEN-025: no calculator is assigned in the frozen registry");
    if (html.includes("$203 exam-only") || html.includes("exam-only price of $203") || html.includes("exam-only range of $50–$350")) throw new Error("DEN-025: bundled exam/cleaning/X-ray reference must not be relabeled as exam-only");
  }

  if (check.path === "affordable-dental-care/index.html") {
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("GUI-002: no calculator is assigned in the frozen registry");
    if (/\$\d/.test(html)) throw new Error("GUI-002: access guide must not introduce procedure-price dollar benchmarks");
    if (html.includes("guaranteed free dental care") || html.includes("you qualify")) throw new Error("GUI-002: must not guarantee assistance or determine eligibility");
  }

  if (check.path === "dental-x-ray-cost/index.html") {
    if (html.includes("$52–$120 range for dental X-rays")) throw new Error("DEN-011: bitewing-specific range must not be generalized to all dental X-rays");
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("DEN-011: no calculator is assigned in the frozen registry");
  }

  if (check.path === "dental-cleaning-cost/index.html") {
    const h1Index = html.indexOf("<h1>Dental cleaning cost</h1>");
    const calculatorIndex = html.indexOf('id="calculator-heading"');
    const priceIndex = html.indexOf('<h2>How much does a dental cleaning cost?</h2>');
    if (!(h1Index !== -1 && calculatorIndex > h1Index && priceIndex > calculatorIndex)) throw new Error("DEN-002: calculator must sit directly after the procedure hero and before repeated price education");
    if (html.includes("$203 standard cleaning")) throw new Error("DEN-002: CareCredit $203 bundle must not be relabeled as cleaning-only");
  }

  if (check.path === "deep-teeth-cleaning-cost/index.html") {
    const h1Index = html.indexOf("<h1>Deep teeth cleaning cost by quadrant</h1>");
    const calculatorIndex = html.indexOf('id="calculator-heading"');
    const priceIndex = html.indexOf('<h2>How much does deep teeth cleaning cost?</h2>');
    if (!(h1Index !== -1 && calculatorIndex > h1Index && priceIndex > calculatorIndex)) throw new Error("DEN-006: calculator must sit directly after the procedure hero and before repeated price education");
    if (html.includes("$720–$1,180") || html.includes("$940–$1,212")) throw new Error("DEN-006: published per-quadrant references must not be multiplied into a four-quadrant default");
    if (html.includes("data-default-quadrants")) throw new Error("DEN-006: calculator must not infer or default the quadrant count");
  }

  if (check.path === "dental-insurance-out-of-pocket-costs/index.html") {
    if (html.includes("data-calculator-id=") || html.includes('id="calculator"')) throw new Error("GUI-001: no calculator is assigned in the frozen registry");
    if (!html.includes("hypothetical") && !html.includes("imaginary plan")) throw new Error("GUI-001: worked numbers must remain explicitly hypothetical");
    if (html.includes("average dental cost") || html.includes("national dental cost range")) throw new Error("GUI-001: cross-procedure insurance guide must not introduce a generic procedure-price benchmark");
  }
}

const files = await readdir(output, { recursive: true });
console.log(`Build complete: ${files.filter((file) => !file.endsWith("/")).length} output entries in dist/`);
