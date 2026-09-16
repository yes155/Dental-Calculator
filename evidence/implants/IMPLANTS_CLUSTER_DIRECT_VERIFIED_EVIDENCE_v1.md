# Implants Cluster — Direct Verified Evidence v1

Status: CHATGPT SOURCE-VERIFIED  
Date: 2026-09-16  
Pages: DEN-001, DEN-003, DEN-007, DEN-012  
Reason for direct verification: Two NotebookLM returns failed the required source-ingestion preflight. The second return still identified itself as v1 and used an 11-source corpus that omitted most mandatory FDA/ADA/AAP/CareCredit/Humana sources. This file supersedes those NotebookLM returns for factual evidence control.

## Evidence policy

- Architecture/task files control page ownership and exclusions; they are not clinical/price evidence.
- Every material price below is tied to a live source, geography, date/vintage, procedure scope and price type.
- Unlike services are not merged into a synthetic range.
- Local prices remain local examples.
- Insurance statements are conditional and plan-specific.
- No claim below determines treatment need, clinical candidacy or eligibility.

## Verified source inventory

### V-IMP-001 — FDA: Dental Implants: What You Should Know
URL: https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know  
Publisher: U.S. Food and Drug Administration  
Source type: U.S. government / device safety  
Page date: 2021-10-29  
Accessed: 2026-09-16  
Scope: Implant-system components, materials, patient-safety boundary  
Supported facts:
- A dental implant system includes an implant body and abutment and may include an abutment fixation screw.
- The implant body is inserted into the jawbone in place of the tooth root; the abutment extends through the gum to support artificial teeth.
- Most systems are made of titanium or zirconium oxide; other materials are sometimes used.
- Candidacy, risks and healing are clinician-dependent and should not be inferred by a cost tool.
Use: DEN-001 / DEN-003 / DEN-012 terminology and YMYL boundary.  
Do not use: Price claims or material-superiority claims.

### V-IMP-002 — American Academy of Periodontology: Dental Implant Procedures
URL: https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/  
Publisher: American Academy of Periodontology  
Source type: Professional dental association  
Accessed: 2026-09-16  
Scope: Single-tooth, multiple-tooth, full-mouth, ridge modification and sinus-augmentation treatment categories  
Supported facts:
- AAP distinguishes single-tooth, multiple-tooth and full-mouth implant procedures.
- Ridge modification and sinus augmentation are separate clinical procedures and should not be silently folded into an implant price.
Use: Page-boundary terminology only.  
Do not use: Patient-specific treatment selection.

### V-IMP-003 — AAP: Single Tooth Dental Implants
URL: https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/single-tooth-dental-implants/  
Publisher: American Academy of Periodontology  
Source type: Professional dental association  
Accessed: 2026-09-16  
Scope: Single-tooth restoration  
Supported fact: One implant and a crown can replace a single missing tooth.  
Use: DEN-001 scope definition.  
Do not use: Cost or candidacy claims.

### V-IMP-004 — AAP: Full Mouth Dental Implants
URL: https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/full-mouth-dental-implants/  
Publisher: American Academy of Periodontology  
Source type: Professional dental association  
Accessed: 2026-09-16  
Scope: Full-mouth components  
Supported facts: Full-mouth implant treatment is described using implants, prosthetic teeth and abutments.  
Use: DEN-003 component terminology.  
Do not use: Price, fixed-vs-removable suitability or patient eligibility.

### V-IMP-005 — AAP: Ridge Modification
URL: https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/ridge-modification/  
Publisher: American Academy of Periodontology  
Source type: Professional dental association  
Accessed: 2026-09-16  
Scope: Ridge-modification boundary  
Supported facts: Ridge modification can involve filling a bone defect with bone or bone substitute; timing relative to implant placement varies by individual need.  
Use: DEN-007 boundary/terminology only.  
Do not use: Determine whether a reader needs grafting or publish a ridge-modification price unless supported elsewhere.

### V-IMP-006 — CareCredit: Dental Implants Cost and Procedure Guide
URL: https://www.carecredit.com/well-u/health-wellness/dental-implants-cost-dental-implants-financing/  
Publisher: Synchrony / CareCredit  
Source type: Commercial healthcare financing publisher using broad procedural-cost research  
Published: 2025-03-14  
Accessed: 2026-09-16  
Geography: 50 U.S. states + District of Columbia  
Data vintage/methodology: 2023–2024 Synchrony Average Procedural Cost Studies, conducted by ASQ360° Market Research  
Price type: Publisher-reported national average/range; not a provider quote or insurer allowed amount  
Supported prices/scope:
- Single-tooth dental implant: $2,143 national average; $1,646–$4,157 range.
- The source explicitly says this covers the process/material for implanting the artificial root and **does not include the dental crown**.
- State/district values likewise exclude the crown, tooth extraction and office-related fees.
- Immediate-load implant average: $3,255.
- All-on-4 average listed in the general table: $15,176 (use dedicated All-on-4 source for DEN-012).
- Endosteal implant with bone augmentation: $5,580; do not reinterpret this as a generic graft price.
Use: DEN-001 main price observation and reference-cost context.  
Do not use: As a complete implant + abutment + crown package price unless the source explicitly supplies that package.

### V-IMP-007 — CareCredit: Single Tooth Dental Implants Cost and Procedure Guide
URL: https://www.carecredit.com/well-u/health-wellness/single-tooth-implant/  
Publisher: Synchrony / CareCredit  
Source type: Commercial healthcare financing / broad cost study  
Published: 2026-02-20  
Accessed: 2026-09-16  
Geography: 50 U.S. states + District of Columbia  
Price type: Publisher-reported national average/range  
Supported price: Full-size single-tooth implant $2,143 average; $1,646–$4,157 range.  
Scope warning: The dedicated page discusses crown material as a cost factor but does not by itself clearly state in the headline price block that the final crown is included; use V-IMP-006 for the explicit crown-exclusion statement.  
Use: Cross-check DEN-001 national/state implant-body/process values.

### V-IMP-008 — CareCredit: All-on-4 Dental Implant Cost and Procedure Guide
URL: https://www.carecredit.com/well-u/health-wellness/all-on-4-dental-implants-cost/  
Publisher: Synchrony / CareCredit  
Source type: Commercial healthcare financing / broad cost study  
Published: 2026-04-24  
Accessed: 2026-09-16  
Geography: 50 U.S. states + District of Columbia  
Data vintage/methodology: 2024 Synchrony Average Procedural Cost Study conducted by ASQ360° Market Research  
Price type: Publisher-reported national average/range  
Supported price: $15,176 national average; $11,640–$27,500 range.  
Unit/scope: The article defines All-on-4 as replacing all teeth in either the upper or lower jaw with a bridge on four implants. The price sentence does not independently say “per arch,” so publication should describe the price as the source's All-on-4 procedure estimate and explicitly tell readers to confirm whether their quote is for one arch or both arches. Do not silently double it.  
Package inclusions: The article describes temporary then permanent bridges in the procedure, but the cost-study price block does not state that extraction, grafting, imaging, temporary bridge, final bridge or follow-up are all included. Mark those inclusion fields UNKNOWN for calculator/reference purposes.  
Use: DEN-012 reference price observation only, with package-scope warning.

### V-IMP-009 — CareCredit: Dental Bone Graft Cost and Procedure Guide
URL: https://www.carecredit.com/well-u/health-wellness/bone-grafting-cost/  
Publisher: Synchrony / CareCredit  
Source type: Commercial healthcare financing / broad cost study  
Published: 2025-02-07  
Accessed: 2026-09-16  
Geography: 50 U.S. states + District of Columbia  
Data vintage/methodology: 2023–2024 Synchrony Average Procedural Cost Studies conducted by ASQ360° Market Research  
Price type: Publisher-reported average ranges by graft type; not a quote  
Supported prices (average cost per graft):
- Allograft: $652–$1,575
- Alloplast: $576–$1,375
- Autograft: $2,161–$5,148
- Xenograft: $549–$1,386
- Source headline states overall observed span $549–$5,148 depending on graft type.
Use: DEN-007 price table, preserving each graft type separately.  
Do not use: The overall span as though every graft type shares one interchangeable range; no sinus-lift price on DEN-007.

### V-IMP-010 — Humana: Dental implants: costs and coverage
URL: https://www.humana.com/dental-insurance/dental-resources/dental-implant-coverage  
Publisher: Humana  
Source type: Major insurer consumer resource / proprietary pricing-tool example  
Last updated: 2026-04-06  
Accessed: 2026-09-16  
Geography: Orlando, Florida example  
Price type: Local proprietary pricing-tool example; not national  
Supported price: One dental implant may range $856–$2,122 in Orlando, Florida.  
Scope warning: Humana lists factors such as extraction, implant placement and fabrication/placement of replacement tooth but does not define the $856–$2,122 range as a complete all-in package.  
Insurance fact: Coverage depends on the individual plan; consultations, X-rays, pre-surgery treatment, anesthesia and crown can affect cost.  
Use: Local contrast / quote-scope example and insurance conditionality.  
Do not use: National default or synthetic merge with CareCredit.

### V-IMP-011 — Cigna: Guide to Dental Implants
URL: https://www.cigna.com/knowledge-center/guide-to-dental-implants  
Publisher: Cigna Healthcare  
Source type: Major insurer educational resource  
Accessed: 2026-09-16  
Scope: Quote itemization and coverage variability  
Supported facts:
- Implant processes can involve multiple separately priced steps.
- Readers should obtain an itemized breakdown and check plan limitations/exclusions.
- Some plans cover part of implants; many exclude them.
- A named Cigna plan example has a $2,000 lifetime implant maximum; this is plan-specific and must never become a universal rule.
Use: GUI-001 and short insurance bridge on implant pages.

### V-IMP-012 — Cigna: Full Coverage Dental Insurance
URL: https://www.cigna.com/knowledge-center/full-coverage-dental-insurance  
Publisher: Cigna Healthcare  
Source type: Major insurer educational resource  
Accessed: 2026-09-16  
Scope: General dental-insurance mechanics  
Supported facts: Implant benefits are not standard; plans can include deductible, waiting period, percentage coverage and lifetime maximum. “Full coverage” does not mean 100% of all costs.  
Use: GUI-001/general mechanics only.

### V-IMP-013 — Delta Dental: Annual Maximum
URL: https://www.deltadental.com/protect-my-smile/dental-insurance-101/what-is-a-dental-insurance-annual-maximum/  
Publisher: Delta Dental  
Source type: Major dental insurer educational resource  
Accessed: 2026-09-16  
Scope: Annual maximum definition  
Supported fact: Annual maximum is the maximum dollar amount the plan pays during a benefit period; Delta states it usually ranges $1,000–$2,000, but the exact plan controls.  
Use: GUI-001 and conditional calculator explanation; never assume an amount for a user.

### V-IMP-014 — Delta Dental: Dental Insurance Deductibles Explained
URL: https://www.deltadental.com/protect-my-smile/dental-insurance-101/dental-insurance-deductibles/  
Publisher: Delta Dental  
Source type: Major dental insurer educational resource  
Accessed: 2026-09-16  
Scope: Deductible sequencing  
Supported fact: A deductible is the amount paid for covered services before the plan begins to pay; coinsurance is applied under plan rules after the deductible.  
Use: GUI-001 / calculator-methodology mechanics only.

### V-IMP-015 — CMS: Medicare Dental Coverage
URL: https://www.cms.gov/medicare/coverage/dental  
Publisher: Centers for Medicare & Medicaid Services  
Source type: U.S. government  
Accessed: 2026-09-16  
Scope: Original Medicare dental exclusion and limited exceptions  
Supported facts: Medicare generally excludes items/services connected with care, treatment, removal or replacement of teeth, but Part A/B may pay for qualifying dental services that are inextricably linked to the clinical success of another Medicare-covered service.  
Use: GUI-001 canonical detail; at most a brief bridge on procedure pages.  
Do not use: “0% coverage” as a blanket statement for every medically linked dental circumstance.

### V-IMP-016 — Nobel Biocare: All-on-4 Treatment Concept / trademark terms
URLs:
- https://www.nobelbiocare.com/en-us/all-on-4-treatment-concept
- https://www.nobelbiocare.com/en-us/global-terms-and-conditions-of-use
Publisher: Nobel Biocare  
Source type: Manufacturer / trademark owner  
Accessed: 2026-09-16  
Scope: Brand/trademark attribution and manufacturer description only  
Supported facts: All-on-4 is a Nobel Biocare trademark; manufacturer describes a fixed full-arch prosthesis supported by four implants, with two posterior implants tilted in its concept.  
Use: DEN-012 attribution/definition only.  
Do not use: Manufacturer claims of superiority, graft-free suitability, survival or candidacy as independent evidence.

### V-IMP-017 — Forbes Advisor: Best Dental Insurance for Implants 2026
URL: https://www.forbes.com/advisor/health-insurance/dental-insurance/best-dental-insurance-for-implants/  
Publisher: Forbes Advisor  
Source type: Secondary consumer/insurance publisher  
Updated: 2026-08-13  
Accessed: 2026-09-16  
Geography: U.S. national, attributed by Forbes to American Dental Association  
Price type: Secondary reported broad out-of-pocket benchmark; package methodology not supplied on the Forbes page  
Supported observations:
- Forbes reports an ADA-attributed $3,000–$4,500 per-tooth implant cost without insurance.
- Forbes reports an ADA-attributed $20,000–$45,000 figure for a “mouthful of implants.”
Scope limitation: The page also says extraction, implant/placement, abutment, crown and graft/sinus lift can each carry costs. It does not define the $3,000–$4,500 or $20,000–$45,000 values with enough component/arch detail to use as calculator defaults.  
Use: Secondary comparison/context only, especially DEN-003 when explaining why full-mouth figures need unit/package scrutiny.  
Do not use: As a per-arch default or as proof that all listed components are included in the range.

## Page-level evidence decisions

### DEN-001 — `/dental-implant-cost-calculator/`
PASS for drafting/reference evidence with limits.
- Primary cost observation: CareCredit $2,143 average; $1,646–$4,157 range for the artificial-root implantation process/material, crown excluded.
- Crown, extraction and office-related fees are not included in the CareCredit state-level implant values.
- Humana Orlando $856–$2,122 remains a local example only and must not be merged with the national CareCredit study.
- Forbes $3,000–$4,500 per tooth is secondary context with package ambiguity; not a calculator default.
- Complete implant + abutment + crown national package: still UNSUPPORTED as a clean, independently scoped default.

### DEN-003 — `/full-mouth-dental-implants-cost/`
PARTIAL PASS.
- AAP supports full-mouth component terminology.
- Forbes reports $20,000–$45,000 for a “mouthful of implants,” attributed to ADA, but arch count, implant count, prosthesis type and package inclusions are not defined.
- Therefore the figure may be cited only as a broad reported full-mouth benchmark with explicit limitations; it is **not** authorized as a per-arch calculator default.
- CALC-003 should remain quote-input/normalization based unless a stronger per-arch dataset is sourced.

### DEN-007 — `/dental-bone-graft-cost/`
PASS for drafting/reference evidence.
- CareCredit supplies separate national ranges for allograft, alloplast, autograft and xenograft; keep them separate.
- Do not publish sinus-lift pricing on DEN-007.
- Do not infer the reader needs a graft.

### DEN-012 — `/all-on-4-dental-implants-cost/`
PASS for drafting/reference evidence with package caveat.
- CareCredit: $15,176 average; $11,640–$27,500 range, 2024 ASQ360 study across 50 states + DC.
- Article context describes treatment replacing the upper or lower jaw, but the cost sentence does not independently label the value “per arch.” Treat unit as **procedure-context one-arch/upper-or-lower-jaw, confirm quote arch count** rather than silently doubling.
- Cost-study package inclusions for extraction, graft, imaging, temporary/final bridge and follow-up are not explicit; mark UNKNOWN.
- Nobel Biocare is used only for trademark/concept attribution.

## Insurance/calculator evidence decision

General mechanics are sufficiently supported for methodology pages: deductible, coinsurance, annual maximum, waiting period, exclusions/limitations, network/allowed amount and plan-specific lifetime maximum can affect patient responsibility. **No universal implant coverage percentage is authorized.**

Calculator implementation should not assume a benefit percentage, annual maximum or deductible. Those values must be user-entered from the user's plan/estimate, or left unknown. When unknown, patient responsibility should not be presented as guaranteed coverage.

## Rejected claims from the second NotebookLM return

The user-returned second pack is not accepted as the evidence record because it failed the v2 source-ingestion preflight. Specifically:
- It labels itself `IMPLANTS_CLUSTER_v1` rather than v2.
- It used 11 sources rather than the required corpus and omitted the key CareCredit cost pages plus ADA/AAP/Humana sources required by the preflight.
- It introduced irrelevant preventive/SRP material into an implants-cluster conflict section.
- It referenced a nonexistent/wrong canonical root-canal owner (`DEN-015`); the frozen root-canal owner is DEN-005.
- It described DEN-008 as “Dental Extractions” instead of preserving the canonical route `/tooth-extraction-cost/`.
- It overstates some plan examples and clinical/coding details beyond what is needed for a cost-education page.
- It treats a generic Forbes/ADA “mouthful of implants” figure as high-confidence while the package unit remains insufficiently specified for a calculator.

## Publication blockers remaining

- DEN-001: complete restored single-tooth package (implant + abutment + crown) is not cleanly supported as one national default; use separate/quote-input scope.
- DEN-003: no defensible per-arch generic full-mouth price dataset yet; calculator must normalize user-entered quote(s), not invent a per-arch national default.
- DEN-012: package inclusion fields remain UNKNOWN unless a quote/source explicitly states them.
- All insurance outputs remain estimates, not guarantees.
