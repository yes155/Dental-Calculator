# NotebookLM Evidence Request — Implants Cluster v2

Status: READY_FOR_RERUN  
Date: 2026-09-16  
Pages: DEN-001, DEN-003, DEN-007, DEN-012  
Supersedes: `NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v1.md`

## Why v2 exists

The v1 NotebookLM run failed because the external evidence corpus was not actually loaded. The returned pack marked the intended FDA/ADA/AAP/CMS/CareCredit/insurer/manufacturer sources as missing and then relied too heavily on the internal task specification.

This v2 request adds a strict source-ingestion preflight. Do not run the extraction prompt until the required sources are present in the notebook.

## Step 1 — Load sources first

Add these sources to the NotebookLM notebook before asking for any evidence extraction:

### Tier 1 — authoritative clinical/government sources
1. FDA — Dental Implants: What You Should Know
   https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know
2. ADA MouthHealthy — Implants
   https://www.mouthhealthy.org/all-topics-a-z/implants
3. American Academy of Periodontology — Dental Implant Procedures
   https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/
4. American Academy of Periodontology — Single Tooth Dental Implants
   https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/single-tooth-dental-implants/
5. American Academy of Periodontology — Full Mouth Dental Implants
   https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/full-mouth-dental-implants/
6. American Academy of Periodontology — Ridge Modification
   https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/ridge-modification/
7. American Academy of Periodontology — Sinus Augmentation
   https://www.perio.org/for-patients/periodontal-treatments-and-procedures/dental-implant-procedures/sinus-augmentation/
8. CMS — Medicare Dental Coverage
   https://www.cms.gov/medicare/coverage/dental

### Tier 2 — broad cost / insurer sources
9. CareCredit — Dentist Prices: Dental Procedure Cost List
   https://www.carecredit.com/dentistry/costs/
10. CareCredit — Dental Implants Cost and Procedure Guide
    https://www.carecredit.com/well-u/health-wellness/dental-implants-cost-dental-implants-financing/
11. CareCredit — Single Tooth Dental Implants Cost and Procedure Guide
    https://www.carecredit.com/well-u/health-wellness/single-tooth-implant/
12. CareCredit — All-on-4® Dental Implant Cost and Procedure Guide
    https://www.carecredit.com/well-u/health-wellness/all-on-4-dental-implants-cost/
13. CareCredit — Dental Bone Graft Cost and Procedure Guide
    https://www.carecredit.com/well-u/health-wellness/bone-grafting-cost/
14. Humana — Costs of Common Dental Procedures
    https://www.humana.com/dental-insurance/dental-resources/cost-of-dental-procedures
15. Humana — Dental implants: costs and coverage
    https://www.humana.com/dental-insurance/dental-resources/dental-implant-coverage
16. Cigna — What Are Dental Implants?
    https://www.cigna.com/knowledge-center/guide-to-dental-implants
17. Cigna — Full Coverage Dental Insurance
    https://www.cigna.com/knowledge-center/full-coverage-dental-insurance
18. Delta Dental — What Is a Dental Insurance Annual Maximum?
    https://www.deltadental.com/protect-my-smile/dental-insurance-101/what-is-a-dental-insurance-annual-maximum/
19. Delta Dental — Dental Insurance Deductibles Explained
    https://www.deltadental.com/protect-my-smile/dental-insurance-101/dental-insurance-deductibles/

### Tier 3 — manufacturer source, narrow use only
20. Nobel Biocare US — All-on-4® treatment concept
    https://www.nobelbiocare.com/en-us/all-on-4-treatment-concept

## Step 2 — Run source-ingestion preflight

Before generating the Evidence Pack, ask NotebookLM to return a source inventory table with:
- source title
- organization
- source type/tier
- loaded/available status
- whether NotebookLM can cite it

### Mandatory stop condition

If any of the following are missing, STOP and do not generate the Evidence Pack:
- FDA implant page
- ADA implant page
- AAP dental implant procedures
- AAP single tooth implants
- AAP full mouth implants
- AAP ridge modification
- CareCredit dental implant cost guide
- CareCredit single tooth implant guide
- CareCredit All-on-4 guide
- CareCredit bone graft guide
- CareCredit dental procedure cost list
- Humana implant cost/coverage source

If a noncritical insurance source such as one Cigna or Delta Dental page fails to import, mark it missing and continue only if another authoritative insurer source covers the same mechanics. Do not invent the missing plan detail.

## Step 3 — Frozen page contracts

### DEN-001 — `/dental-implant-cost-calculator/`
Owns single-tooth/per-tooth implant cost, implant body/post, abutment, crown/prosthesis quote scope and CALC-001.

Exclude:
- full-mouth/full-arch totals → DEN-003
- All-on-4 → DEN-012
- bone graft price depth → DEN-007
- bridge/denture depth → DEN-024 / DEN-030

### DEN-003 — `/full-mouth-dental-implants-cost/`
Owns generic full-mouth/full-arch cost, one-arch vs two-arch normalization, fixed vs removable implant restoration quote categories and CALC-003.

Exclude:
- single-tooth itemization → DEN-001
- All-on-4 package specifics → DEN-012
- conventional dentures → DEN-030

### DEN-007 — `/dental-bone-graft-cost/`
Owns dental bone graft cost by graft type/site and bundled-vs-separate fee mechanics.

Exclude:
- implant total → DEN-001
- extraction fee → DEN-008 `/tooth-extraction-cost/`
- sinus surgery pricing and clinical eligibility

### DEN-012 — `/all-on-4-dental-implants-cost/`
Owns All-on-4-specific cost, quote package inclusions, per-arch unit and CALC-003-A04.

Exclude:
- generic full-arch comparisons → DEN-003
- single-tooth → DEN-001
- brand endorsement
- clinical eligibility/candidacy

## Step 4 — Extraction rules

For every factual claim:
- cite an imported external source;
- never cite the internal architecture/task specification as clinical or price evidence;
- preserve source title, organization, publication/update date if shown, access date, geography, procedure/package scope and pricing unit;
- mark inclusions/exclusions exactly as stated or `UNKNOWN`;
- never merge unlike categories into a synthetic national range;
- never convert a local/example fee into a U.S. national estimate;
- never assume a price is per arch, per mouth, per tooth or per procedure if the source does not say so;
- if unit is unclear, mark `AMBIGUOUS`;
- if evidence is missing, write `UNSUPPORTED` and do not supply replacement wording as though it were sourced;
- do not use any number anywhere in the output unless its source is explicitly cited in the same claim block;
- keep manufacturer claims separate from professional/independent evidence;
- do not infer diagnosis, candidacy, graft need, implant system preference, treatment recommendation or insurance entitlement.

## Step 5 — Required evidence fields

For every claim return:
1. Claim ID
2. Target Page ID(s)
3. Claim/question
4. Source title
5. Source organization
6. Source type/tier
7. Publication/update date if shown
8. Access date
9. Exact geography
10. Procedure/package scope
11. Pricing unit
12. Price type/context
13. Extracted fact
14. Numeric value/range and units where present
15. Explicit inclusions/exclusions
16. Conditions/assumptions
17. Stable or time-sensitive
18. Confidence
19. Conflicting source? Yes/No
20. Publication-safe wording
21. Unsupported? Yes/No
22. Notes / ownership warning

## Step 6 — Claims to research

### Shared implant evidence
1. FDA/AAP/ADA definition of implant body/post, abutment and prosthetic tooth/crown.
2. Single-tooth vs multiple-tooth vs full-mouth/full-arch terminology.
3. Implant material terminology including titanium/titanium alloy and zirconium oxide/zirconia without superiority claims.
4. Which quote components may be separate or bundled.
5. Which clinical statements should be excluded from a cost page or reserved for professional review.

### DEN-001
6. Current broad-US/national single full-size implant price observation.
7. Exact scope of that price: implant body/process only vs complete restored tooth.
8. Price for a complete implant + abutment + crown package only if a source clearly defines that bundle.
9. Immediate-load, mini or zirconia/ceramic implant prices only if unit and inclusions are explicit.
10. State/geographic variation where methodology is disclosed.
11. Do not synthesize one national range from unlike services.

### DEN-003
12. Full-mouth/full-arch restoration components and fixed/removable distinctions.
13. Evidence for one-arch vs two-arch normalization.
14. Generic full-mouth/full-arch price only if arch count, restoration type and package scope are explicit.
15. If no defensible generic full-arch price exists, return `UNSUPPORTED`; do not substitute All-on-4 or clinic prices.
16. Temporary vs final prosthesis evidence only when directly sourced.

### DEN-007
17. Graft material terminology: autograft, allograft, xenograft, alloplast.
18. Current graft-type price observations with exact unit/scope.
19. Per-site/per-procedure/bundled unit classification.
20. Evidence for graft fees as separate vs included in an implant/extraction quote.
21. Sinus/ridge sources are boundary/context only; no sinus-lift price on DEN-007.

### DEN-012
22. What All-on-4® refers to and manufacturer/trademark attribution.
23. For each price source, classify unit as per arch, two arches/full mouth or ambiguous.
24. Current All-on-4 price only with geography, date/vintage, unit and package scope.
25. Explicit temporary/final prosthesis, extraction, graft, imaging and follow-up inclusion/exclusion.
26. Keep Nobel Biocare marketing claims separate from independent/professional evidence.
27. Do not imply universal graft-free status, medical indication, clinical superiority or candidacy.

### Insurance/payment
28. Plan mechanics: deductible, coinsurance, annual/lifetime maximums, waiting periods, exclusions and network/allowed-amount rules.
29. Never convert plan-specific coverage language into a universal percentage.
30. Medicare detail belongs primarily on GUI-001; only brief bridging facts may appear on procedure pages.

## Step 7 — Required output organization

Return exactly:

1. `## Source Ingestion Preflight`
2. `## Shared implant evidence`
3. `## DEN-001 evidence`
4. `## DEN-003 evidence`
5. `## DEN-007 evidence`
6. `## DEN-012 evidence`
7. `## Insurance/payment evidence`
8. `## Source conflicts and scope mismatches`
9. `## Unsupported claims / publication blockers`
10. `## Freshness concerns`
11. `## Claims needing professional clinical review`
12. `## Evidence that belongs on another canonical owner`

## Master NotebookLM prompt

Use only the sources loaded into this notebook.

First perform the Source Ingestion Preflight from this request. If any mandatory source is missing, STOP and return only the missing-source list. Do not generate an Evidence Pack from the task specification alone.

If preflight passes, produce a claim-level evidence pack for DEN-001, DEN-003, DEN-007 and DEN-012 using the frozen page contracts and extraction rules in this request.

The internal task specification controls architecture and editorial boundaries only. It is not an evidentiary source for clinical facts, prices, insurance rules or manufacturer claims.

Every number must have an imported source in the same claim block. Every cost must preserve date/vintage, geography, unit, price type and inclusion/exclusion scope. Do not create synthetic ranges. Do not normalize ambiguous units. If evidence is missing, write `UNSUPPORTED` and stop at that claim.

Return filename:
`NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v2.md`
