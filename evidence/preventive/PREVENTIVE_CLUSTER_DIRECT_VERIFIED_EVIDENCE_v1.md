# Preventive / cleaning cluster — direct verified evidence v1

Date verified: 2026-09-17  
Target market: United States  
Architecture: frozen registry approved 2026-09-15  
Pages: DEN-002, DEN-006, DEN-011, DEN-025, DEN-032  
Decision authority: direct public-source verification plus audited prior NotebookLM records; raw model outputs are not evidence authority.

## Executive decision

| Page | Decision | Reason |
|---|---|---|
| DEN-002 `/dental-cleaning-cost/` | ADVANCE | Current Delta Dental consumer guidance separates a standard cleaning from specialized periodontal procedures and reports $85–$160 without dental benefits. Cigna separately reports an adult average of about $104, citing the ADA HPI 2022 Survey of Dental Fees. Humana supplies a narrow Orlando no-insurance example. |
| DEN-006 `/deep-teeth-cleaning-cost/` | ADVANCE | Delta Dental reports $180–$295 for scaling and root planing for one quadrant without dental benefits. Humana independently supplies a local Orlando example of $235–$303 per quadrant. ADA MouthHealthy supports SRP/deep-cleaning terminology. |
| DEN-011 `/dental-x-ray-cost/` | ADVANCE | CareCredit publishes 2024 U.S. type-level X-ray averages/ranges across 50 states + DC. ADA MouthHealthy supports dentist-determined need/frequency and no universal every-visit schedule. |
| DEN-025 `/dentist-visit-cost/` | HOLD — KEY PRICE EVIDENCE | Current sources explain exam/checkup scope but no reviewed source establishes a broad U.S. exam-only price suitable for this page. CareCredit's $203 observation is an exam/cleaning/X-ray bundle and must not be relabeled exam-only. |
| DEN-032 `/periodontal-maintenance-cost/` | EVIDENCE CONTROLLED — WAVE B | Delta Dental reports $140–$220 without dental benefits for a whole-mouth periodontal maintenance cleaning and describes it in the context of prior periodontal treatment. No default visit frequency or annual budget is authorized. |

## Source records

### PREV-001 — Delta Dental: Understanding dental cleaning costs and insurance coverage
URL: https://www.deltadental.com/protect-my-smile/procedures/dental-cleanings/cost-and-insurance-coverage/

Publisher: Delta Dental Plans Association / national network consumer site.  
Accessed: 2026-09-17.  
Publication/update date: not stated in the visible article. Copyright footer is 2026; do not treat copyright as the fee data date.  
Geography/methodology: article is on Delta Dental's U.S. national site and presents general average-cost ranges, but the article does not state the exact geographic sample, collection date, weighting or dataset for the static summary ranges. Delta's embedded Cost Estimator terms separately state that estimates labeled “Cost without insurance” use submitted claims data from out-of-network dentists and actual non-discounted billed charges, with geographic estimates based on 3-digit ZIP areas; do not assume without explicit linkage that every static article range uses exactly the same calculation pipeline.

Directly supported price statements:
- Standard dental cleaning: **$85–$160**, described as average cost without dental benefits.
- Full-mouth debridement: **$150–$260** without dental benefits.
- Periodontal scaling and root planing: **$180–$295**, explicitly for **one quadrant / one-fourth of the mouth**, without dental benefits.
- Periodontal maintenance cleaning: **$140–$220**, explicitly covering a **whole-mouth cleaning**, without dental benefits.

Directly supported scope statements:
- Delta distinguishes standard cleaning, full-mouth debridement, SRP and periodontal maintenance as different cleaning categories.
- Periodontal maintenance is described for a patient who has had previous periodontal treatment such as deep cleaning or gum surgery.
- Benefit coverage varies by plan; no universal coverage percentage is authorized.

Publication-safe use:
- Attribute the ranges to Delta Dental.
- Say “without dental benefits” rather than “cash price,” “allowed amount,” or “national fee schedule.”
- Do not call the ranges a 2026 dataset because the underlying data date is not disclosed.
- Do not infer treatment need or how many quadrants a reader needs.

### PREV-002 — Cigna: How Much Does a Teeth Cleaning Cost?
URL: https://www.cigna.com/knowledge-center/dental-cleaning-cost

Publisher: Cigna Healthcare.  
Accessed: 2026-09-17.  
Publication/update date: not visible in reviewed page.  
Underlying cited source: American Dental Association Health Policy Institute, **2022 Survey of Dental Fees**, accessed by Cigna in 2023.

Directly supported:
- Cigna reports an adult teeth-cleaning average of **about $104**.
- Cigna says insurance cost depends on plan terms such as deductible, coinsurance and network status.

Limitations:
- This is secondary reporting of an older ADA fee survey, not a current 2026 fee survey.
- ADA states its Survey of Dental Fees was discontinued in 2023, so this figure should be treated as older corroborating context rather than the sole current benchmark.
- Cigna's “deep cleaning can add $150–$350” is sourced to a third-party dental site, not ADA; do not use it as the controlling DEN-006 price.

### PREV-003 — Humana: How Much Does a Dental Cleaning Cost?
URL: https://www.humana.com/dental-insurance/dental-resources/how-much-does-dental-cleaning-cost

Publisher: Humana.  
Accessed: 2026-09-17.  
Geography: **Orlando, Florida area** only.  
Pricing context: adult routine cleaning without insurance; Humana proprietary Dental Procedure Pricing Tool.

Directly supported:
- Adult routine cleaning in Orlando: **$80–$109 without insurance**.

Limitations:
- Local example only; never generalize to a U.S. range.
- Exam/X-ray inclusion is not clearly established for this price statement.

### PREV-004 — Humana: How much does scaling and root planing cost?
URL: https://www.humana.com/dental-insurance/dental-resources/scaling-root-planing-cost

Publisher: Humana.  
Accessed: 2026-09-17.  
Geography: **Orlando, Florida** only.  
Pricing unit: **per quadrant**.  
Pricing context: Humana proprietary Dental Procedure Pricing Tool local example.

Directly supported:
- Scaling and root planing: **$235–$303 per quadrant** in Orlando.
- A quadrant is one of four equal sections of the mouth.

Limitations:
- Local example only; not a national range.
- Do not infer how many quadrants a reader needs.
- Exact adjunct inclusions and fee basis beyond the source wording remain unclear.

### PREV-005 — ADA MouthHealthy: Scaling and Root Planing
URL: https://www.mouthhealthy.org/all-topics-a-z/scaling-and-root-planing

Publisher: American Dental Association consumer resource.  
Accessed: 2026-09-17.  
Use: clinical terminology/boundary only; no price data.

Directly supported:
- Scaling and root planing is a deep cleaning below the gumline used to treat gum disease.
- Scaling removes plaque/tartar above and below the gumline; root planing smooths tooth roots.
- It may take more than one visit and may involve local anesthetic.

Safety boundary:
- Use this only to explain terminology and why SRP is not the same quote unit as a routine cleaning.
- Do not use symptoms to determine whether a reader needs SRP.

### PREV-006 — CareCredit: How Much Do Dental X-Rays Cost? Prices by Type and Location
URL: https://www.carecredit.com/well-u/health-wellness/dental-x-ray-cost/

Publisher: CareCredit / Synchrony.  
Article date: **2025-01-31**.  
Underlying cost research: **2024**, conducted by ASQ360° on behalf of Synchrony/CareCredit.  
Geography: 50 U.S. states + District of Columbia.  
Pricing context: publisher-reported average procedural costs; not provider quote, insurer allowed amount or guaranteed cash fee.

Type-level values:
- Bitewing: **$65 average; $52–$120 range**.
- Periapical: **$55 average; $42–$102 range**.
- Full-mouth series: **$226 average; $175–$428 range**.
- Occlusal: **$55 average; $43–$103 range**.
- Panoramic: **$200 average; $157–$343 range**.
- Cephalometric: **$141 average; $110–$274 range**.
- Cone-beam CT: **$466 average; $361–$879 range**.

Unit rules:
- Keep each named modality separate.
- Do not assume a bitewing image count from the price row unless the source explicitly supplies it for that price unit.
- Full-mouth series is a named series, not one image.

### PREV-007 — ADA MouthHealthy: X-rays
URL: https://www.mouthhealthy.org/all-topics-a-z/x-rays

Publisher: American Dental Association consumer resource.  
Accessed: 2026-09-17.  
Use: clinical/frequency boundary only; no price data.

Directly supported:
- The dentist reviews history and examines the mouth to determine whether X-rays are needed.
- Frequency depends on present oral health, age, disease risk, signs and symptoms.
- A patient may not need an X-ray at every visit; ADA's 2024 recommendation is to take X-rays when they provide necessary diagnostic information.

Safety boundary:
- DEN-011 explains price by X-ray type. It does not recommend imaging or a universal repeat schedule.

### PREV-008 — CareCredit: Dentist Prices — Dental Procedure Cost List
URL: https://www.carecredit.com/dentistry/costs/

Publisher: CareCredit / Synchrony.  
Accessed: 2026-09-17.  
Underlying data: 2023–2024 Synchrony Average Procedural Cost Study across 50 states + DC.

Relevant limitation:
- CareCredit labels a **$203** average as “Dental exam (cleaning and x-rays).” This is a bundled visit observation and must not be used as a standalone routine-cleaning fee on DEN-002 or an exam-only fee on DEN-025.
- The separate CareCredit cleaning article also uses $203 for “routine teeth cleaning,” creating scope ambiguity within the same publisher/data lineage. Do not treat the two pages as independent corroboration.

### PREV-009 — Delta Dental: Dental exams & checkups
URL: https://www.deltadental.com/protect-my-smile/visiting-the-dentist/what-happens-during-a-dental-checkup/

Publisher: Delta Dental Plans Association.  
Accessed: 2026-09-17.

Directly supported:
- A dental exam and a cleaning are distinct procedures even though together they are commonly referred to as a checkup.
- The page directs users to Delta's cost estimator for local exam/cleaning estimates.

Evidence gap:
- The page does **not** supply a broad exam-only price. DEN-025 remains blocked for its key price answer.

## Page-specific publication controls

### DEN-002 — routine dental cleaning
Allowed direct answer:
- “Delta Dental reports **$85–$160** as the average cost of a standard dental cleaning without dental benefits.”
- Optional context: “Cigna reports an adult average of about **$104**, citing the ADA's 2022 Survey of Dental Fees.”
- Humana's **$80–$109** Orlando example may appear only as a labeled local comparison.

Do not:
- use CareCredit's $203 as the standalone cleaning benchmark;
- subtract an exam or X-ray average from a bundle to manufacture a cleaning-only number;
- state that insurance pays 100% or that two visits are universally free/covered.

### DEN-006 — deep cleaning / SRP
Allowed direct answer:
- “Delta Dental reports **$180–$295 per quadrant** for periodontal scaling and root planing without dental benefits.”
- Humana's Orlando **$235–$303 per quadrant** may appear as local comparison only.

Do not:
- multiply the range by four as a default full-mouth treatment cost;
- infer quadrant count, treatment need, anesthesia need or visit count;
- merge debridement, SRP and periodontal maintenance into one price range.

### DEN-011 — dental X-rays
Allowed direct answer:
- Publish the seven CareCredit 2024 named modality rows separately with article/data date and geography.
- State that prices are reference averages/ranges, not guaranteed provider fees.

Do not:
- choose an X-ray type for the reader;
- create a universal imaging schedule;
- merge bitewing, panoramic, full-mouth series, cephalometric, periapical, occlusal and CBCT into one synthetic range.

### DEN-025 — dentist visit
Status: **BLOCKED**.
- Exam/checkup terminology is supported.
- Broad U.S. exam-only price is not.
- CareCredit $203 bundle cannot be relabeled exam-only.
- Local clinic or ZIP-specific estimator figures are examples only unless the page explicitly scopes them as such.

### DEN-032 — periodontal maintenance
Allowed direct answer:
- “Delta Dental reports **$140–$220** without dental benefits for periodontal maintenance cleaning and says the price covers a whole-mouth cleaning.”

Do not:
- prescribe visit frequency;
- multiply by a default number of yearly visits;
- generalize a named plan's frequency or coinsurance terms to all insurance plans.

## Calculator controls

CALC-002 and CALC-006 must remain **quote-input / quote-normalization tools**. Published price ranges may be shown as reference cards only and must never auto-fill or alter user-entered arithmetic.

Insurance may only be subtracted when the user enters an insurer estimate for the same written quote. No default preventive coverage percentage, deductible, annual maximum or visit frequency is allowed.

## Freshness

Price sources: review at least every 6 months and on material source change.  
Clinical terminology: annual/material-change review.  
Plan-specific insurance examples: review for the named plan year only and never generalize.
