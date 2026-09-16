# Evidence QA — NLM Implants Cluster v1

Date: 2026-09-16  
Batch: DEN-001 + DEN-003 + DEN-007 + DEN-012  
Input reviewed: `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md`  
Verdict: **FAIL — SOURCE INGESTION FAILURE / NOT PUBLICATION-GRADE**

## Executive finding

The returned NotebookLM pack preserved the frozen page contracts, but it did not have the required external source corpus loaded. Its source inventory marks FDA, ADA, AAP, CMS, CareCredit, Humana, Cigna, Delta Dental and Nobel Biocare as missing/unsupported. Because of that, most factual and numeric evidence blocks were derived from the internal task specification rather than the intended authoritative/public sources.

This pack must **not** be used to populate price tables, calculator defaults, insurance assumptions, clinical definitions, source-register rows or production copy.

## What passed

1. Page ownership largely matches the frozen architecture for DEN-001, DEN-003, DEN-007 and DEN-012.
2. The output distinguishes single-tooth, full-arch, bone-graft and All-on-4 scope conceptually.
3. It preserves important governance rules: no candidacy decisions, no universal insurance percentage, no brand endorsement, no synthetic price range from unlike categories.
4. It identifies evidence gaps instead of fabricating values inside most claim blocks.

## Hard failures

### 1. External corpus not ingested

The source inventory marks every intended external source as missing. Therefore the pack cannot support publication claims.

Required correction: load the public sources into NotebookLM before rerunning the extraction prompt. A valid pack must cite the actual imported source title/organization for every factual claim.

### 2. Internal task specification used as clinical evidence

The pack assigns high-confidence clinical/anatomical statements to the internal architecture/task specification. Architecture controls URL ownership and editorial boundaries; it is **not** evidence for clinical facts.

Examples that require external authority before publication:
- implant system components/anatomy;
- titanium/zirconia material descriptions;
- full-mouth fixed/removable restoration terminology;
- graft material definitions;
- sinus augmentation descriptions;
- Medicare benefit rules.

### 3. Unsupported dollar amounts appear in synthesis

The synthesis introduces figures such as single-arch/full-mouth ranges and graft fee ranges despite the same pack declaring the corresponding cost sources missing. These values have no traceable evidence lineage and must be discarded.

Rule: a value cannot appear anywhere in the Evidence Pack unless a loaded source supports it with geography, date, unit, price type and package scope.

### 4. Unsupported wording is presented as publication-safe

Several blocks are marked `Unsupported: Yes` while still supplying definitive publication-safe clinical wording. Unsupported wording is not publication-safe. The corrected pack must use `SOURCE NEEDED BEFORE PUBLICATION` or omit the claim until a real source supports it.

### 5. Canonical URL error

The ownership section lists DEN-008 as `/dental-extraction-cost/`. The frozen canonical URL is `/tooth-extraction-cost/`.

### 6. Full-arch and All-on-4 unit discipline still needs source proof

The pack correctly states that per-arch and full-mouth prices must not be conflated, but it lacks the external source text needed to establish the actual pricing unit for each cost observation.

## Independent web verification performed by ChatGPT

The following intended public sources were confirmed live on 2026-09-16 and should be loaded into the NotebookLM rerun:

- FDA — `Dental Implants: What You Should Know`
- ADA MouthHealthy — `Implants`
- AAP — `Dental Implant Procedures`
- AAP — `Single Tooth Dental Implants`
- AAP — `Full Mouth Dental Implants`
- AAP — `Ridge Modification`
- CareCredit — `Dental Implants Cost and Procedure Guide`
- CareCredit — `Single Tooth Dental Implants Cost and Procedure Guide`
- CareCredit — `All-on-4® Dental Implant Cost and Procedure Guide`
- CareCredit — `Dental Bone Graft Cost and Procedure Guide`
- CareCredit — `Dentist Prices: Dental Procedure Cost List`
- Humana — `Dental implants: costs and coverage`
- Nobel Biocare — `All-on-4® treatment concept` (manufacturer evidence only)

The CareCredit source pages currently expose broad-US research methodology and current numeric observations, but those values are **not imported into project evidence until NotebookLM returns them with source lineage and ChatGPT re-audits them**.

## Acceptance conditions for v2

The rerun passes only if:

- all required Tier 1 and price-critical Tier 2 sources show as loaded/available;
- no clinical fact cites the internal task specification as its evidentiary source;
- every price has source, date/vintage, geography, unit, price type, inclusions/exclusions and package scope;
- no unsupported number appears anywhere in the output, including synthesis sections;
- All-on-4 manufacturer claims remain clearly separated from independent cost/professional evidence;
- DEN-008 is referenced only by `/tooth-extraction-cost/`;
- unsupported claims are explicitly blocked rather than rewritten as definitive prose;
- conflicts are preserved instead of normalized away.

## Release effect

- DEN-001: BLOCKED
- DEN-003: BLOCKED
- DEN-007: BLOCKED
- DEN-012: BLOCKED
- CALC-001 / CALC-003 / CALC-003-A04: BLOCKED from formula/default-price design
- Gemini drafting: BLOCKED

Next artifact: `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v2.md`
