# NotebookLM evidence request — Implants cluster v1

Status: READY_FOR_NOTEBOOKLM  
Created: 2026-09-16  
Target market: United States  
Batch: DEN-001 + DEN-003 + DEN-007 + DEN-012

## Exact task

Build one source-grounded **Evidence Pack** for the four frozen pages below. Use only the sources loaded into the NotebookLM notebook. Do not draft articles, create URLs, change page ownership, design calculator formulas, or infer missing prices.

Required returned filename:

`NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md`

## Frozen page contracts

### DEN-001 — `/dental-implant-cost-calculator/`
- Page entity: Dental implant costs.
- Primary task: Estimate a single-tooth or itemized multi-tooth implant quote with visible components.
- Main scope: Single-tooth implant; implant post/body, abutment and crown; per-tooth quote scope; generic implant cost and calculator queries.
- Derived scope: Insurance scenario; mini and zirconia implant distinctions; same-day/immediate-load quote inclusions; brief bridge comparison.
- Excluded scope: Full-arch/full-mouth totals → DEN-003. All-on-4 → DEN-012. Graft detail → DEN-007. Do not equate a zirconia implant body with a zirconia prosthesis/crown.
- Calculator relationship: CALC-001, not yet specified. Evidence only; do not design formulas.

### DEN-003 — `/full-mouth-dental-implants-cost/`
- Page entity: Full-mouth and full-arch implant costs.
- Primary task: Normalize one-arch and two-arch quotes and distinguish fixed from removable implant restorations.
- Main scope: Per-arch versus full-mouth unit; upper/lower arches; prosthesis and surgery inclusion; fixed/removable quote categories.
- Derived scope: Shared arch quote estimator; exclusions; brief All-on-4 route.
- Excluded scope: Single-tooth itemization → DEN-001. All-on-4 package detail → DEN-012. Conventional dentures → DEN-030.
- Calculator relationship: CALC-003, not yet specified. Evidence only; do not design formulas.

### DEN-007 — `/dental-bone-graft-cost/`
- Page entity: Dental bone graft cost.
- Primary task: Explain site-specific graft fees and what an implant or extraction package may already include.
- Main scope: Graft type/site quote; materials; bundled versus separate fees.
- Derived scope: Implant and extraction cost context.
- Excluded scope: Implant total → DEN-001. Extraction fee → DEN-008. **Sinus surgery pricing and eligibility are excluded.**
- No calculator is assigned.

### DEN-012 — `/all-on-4-dental-implants-cost/`
- Page entity: All-on-4 cost.
- Primary task: Compare the inclusions of All-on-4 quotes using a consistently defined arch unit.
- Main scope: All-on-4 package boundaries; temporary/final prosthesis; quote material and visits.
- Derived scope: Shared arch estimator in All-on-4 quote mode.
- Excluded scope: Generic full-arch comparisons → DEN-003. Single-tooth → DEN-001. No brand endorsement and no clinical eligibility decision.
- Calculator relationship: CALC-003-A04, not yet specified. Evidence only; do not design formulas.

## Claims to research

### Shared clinical/terminology claims
1. Define a dental implant system and distinguish implant body, abutment and prosthetic tooth/crown.
2. Confirm the terminology for single-tooth, multiple-tooth and full-mouth/full-arch implant restorations.
3. Identify authoritative wording for implant materials such as titanium/titanium alloy and zirconium oxide/zirconia without making unsupported superiority claims.
4. Identify which parts of implant treatment may be separately quoted: implant body, abutment, crown/prosthesis, imaging, extraction, grafting, temporary/final prosthesis, visits or other explicitly sourced components.
5. Identify which clinical statements require a dentist/professional review and which should not be published as cost-page advice.

### DEN-001 price and quote-scope claims
6. Extract current national or broad-US price observations for a single/full-size dental implant and state exactly what each figure includes or excludes.
7. Extract any source-supported range/average for the implant body/process when the crown is excluded.
8. Extract any independently stated price for implant + abutment + crown only when the source clearly defines that package and geography.
9. Extract price observations for mini implants, zirconia/ceramic implants or immediate-load implants only when the source clearly identifies the unit and inclusions.
10. Record state/geographic variation data only when the source clearly identifies methodology/scope.
11. Do not combine unlike figures into a synthetic national range.

### DEN-003 full-mouth/full-arch claims
12. Define full-mouth/full-arch implant restoration components and whether authoritative sources distinguish full bridges versus implant-supported dentures/removable options.
13. Find evidence that supports a **per-arch** unit and one-arch versus two-arch normalization.
14. Find current price evidence for generic full-mouth/full-arch implant treatment only if the source clearly defines arch count, prosthesis type and package scope.
15. If no source in the notebook supports a defensible generic full-mouth/full-arch price, return `UNSUPPORTED` rather than substituting All-on-4, 3-on-6, dentures or local-clinic prices.
16. Extract evidence about temporary versus final prostheses only when directly supported.

### DEN-007 bone-graft claims
17. Define dental/implant-related bone graft categories and source terminology for autograft, allograft, xenograft and alloplast where supported.
18. Extract current price observations for graft types such as allograft, alloplast, autograft, ridge expansion, socket graft and xenograft only with unit and scope.
19. Identify whether the source treats a graft as per site, per procedure, or as part of another implant price category.
20. Identify evidence about graft fees being separate from or incorporated into an implant/extraction quote; do not assume inclusion.
21. Use sinus augmentation/ridge-modification sources only to explain boundaries/terminology. **Do not publish sinus-lift pricing or determine graft/sinus-lift eligibility on DEN-007.**

### DEN-012 All-on-4 claims
22. Establish what `All-on-4®` refers to and identify the trademark/manufacturer source separately from independent/consumer cost sources.
23. Establish whether each source-supported All-on-4 price refers to one arch, two arches, a full mouth, or is ambiguous. Never silently assume the unit.
24. Extract current price average/range only when geography, date, unit and package scope can be recorded.
25. Identify whether temporary/final prosthesis, extractions, grafting, imaging or follow-up are explicitly included/excluded; if unclear, mark unknown.
26. Keep manufacturer marketing claims separate from independent or professional evidence. Do not repeat promotional survival/satisfaction claims unless independently needed and supported.
27. Do not imply All-on-4 is clinically preferable, appropriate, graft-free for every patient, or medically indicated.

### Insurance / payment boundary
28. Extract plan-mechanics evidence showing that implant coverage can vary by plan and that exclusions, deductible, coinsurance, waiting periods, annual/lifetime maximums and network/allowed-amount rules may affect patient cost.
29. Never convert plan-specific policy language into a universal coverage percentage.
30. If Medicare evidence is included, distinguish routine dental exclusion from narrow medically linked exceptions and flag this as better owned by GUI-001 unless a procedure page needs a brief bridge.

## Source corpus to add to NotebookLM

### Tier 1 — government / professional dental sources
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

### Tier 2 — transparent/broad cost and insurer sources
9. CareCredit — Dentist Prices: Dental Procedure Cost List  
   https://www.carecredit.com/dentistry/costs/
10. CareCredit — Dental Implants Cost and Procedure Guide  
    https://www.carecredit.com/well-u/health-wellness/dental-implants-cost-dental-implants-financing/
11. CareCredit — Single Tooth Dental Implants Cost and Procedure Guide  
    https://www.carecredit.com/well-u/health-wellness/single-tooth-implant/
12. CareCredit — All-on-4 Dental Implant Cost and Procedure Guide  
    https://www.carecredit.com/well-u/health-wellness/all-on-4-dental-implants-cost/
13. CareCredit — Dental Bone Graft Cost and Procedure Guide  
    https://www.carecredit.com/well-u/health-wellness/bone-grafting-cost/
14. Humana — Costs of Common Dental Procedures  
    https://www.humana.com/dental-insurance/dental-resources/cost-of-dental-procedures
15. Humana — Dental Implants: Costs and Coverage  
    https://www.humana.com/dental-insurance/dental-resources/dental-implant-coverage
16. Cigna — What Are Dental Implants?  
    https://www.cigna.com/knowledge-center/guide-to-dental-implants
17. Cigna — Full Coverage Dental Insurance  
    https://www.cigna.com/knowledge-center/full-coverage-dental-insurance
18. Delta Dental — What Is a Dental Insurance Annual Maximum?  
    https://www.deltadental.com/protect-my-smile/dental-insurance-101/what-is-a-dental-insurance-annual-maximum/
19. Delta Dental — Dental Insurance Deductibles Explained  
    https://www.deltadental.com/protect-my-smile/dental-insurance-101/dental-insurance-deductibles/

### Tier 3 — commercial/manufacturer source; use narrowly
20. Nobel Biocare US — All-on-4 Treatment Concept  
    https://www.nobelbiocare.com/en-us/all-on-4-treatment-concept

Use the Nobel Biocare source only for the branded concept/trademark/package terminology it directly supports. Treat promotional comparative, satisfaction, survival or superiority claims as manufacturer claims, not independent facts.

## Required evidence fields

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
12. Price type/context (published average, range, local example, plan-specific allowed/coverage language, etc.)
13. Extracted fact
14. Numeric value/range and units where present
15. Included/excluded components explicitly stated by the source
16. Conditions/assumptions
17. Stable or time-sensitive
18. Confidence: High / Medium / Low
19. Conflicting source? Yes / No
20. Publication-safe wording
21. Unsupported? Yes / No
22. Notes / ownership warning

## Output organization

Return the Evidence Pack in this order:

1. `## Shared implant evidence`
2. `## DEN-001 evidence`
3. `## DEN-003 evidence`
4. `## DEN-007 evidence`
5. `## DEN-012 evidence`
6. `## Insurance/payment evidence`
7. `## Source conflicts and scope mismatches`
8. `## Unsupported claims / publication blockers`
9. `## Freshness concerns`
10. `## Claims needing professional clinical review`
11. `## Evidence that belongs on another canonical owner`

## Master prompt to use in NotebookLM

You are the evidence-research layer for a US dental-cost authority website.

Use ONLY the sources available in this NotebookLM notebook.

PAGE IDS:
DEN-001, DEN-003, DEN-007, DEN-012

APPROVED URL / PAGE OWNERSHIP:
Use the frozen page contracts in this request exactly. Do not create or rename URLs.

PRIMARY USER TASK:
Produce a source-grounded evidence pack for implant, full-mouth/full-arch implant, dental bone graft, and All-on-4 cost pages. Preserve price units, geography, date, package scope, inclusions and exclusions.

CLAIMS TO RESEARCH:
Use the numbered claims in this request.

EXCLUDED SCOPE:
Preserve each page's excluded scope exactly. Do not infer treatment need, candidacy, clinical eligibility, diagnosis, recommended implant type, graft need or insurance entitlement.

For each required claim, return all required evidence fields from this request.

Rules:
- Do not write the articles.
- Do not create new URLs.
- Do not infer missing prices.
- Do not convert one provider/local fee into a US-wide estimate.
- Do not merge unlike price categories into a synthetic range.
- Do not diagnose or recommend treatment.
- Do not infer whether a user needs a graft, implant, full-arch restoration or All-on-4.
- Do not convert plan-specific coverage language into a universal percentage.
- Separate manufacturer claims from independent/professional evidence.
- If a cost source does not clearly identify whether a figure includes the crown/prosthesis, graft, extraction, temporary/final prosthesis or other components, mark that component `UNKNOWN`.
- If a price unit is ambiguous (per implant, per tooth, per arch, per full mouth, per procedure), mark it `AMBIGUOUS` and do not normalize it.
- If evidence is missing, write `UNSUPPORTED`.
- If sources conflict, preserve the disagreement and explain the scope difference.

Finish with:
- unsupported claims
- conflicting evidence
- freshness concerns
- claims needing professional clinical review
- evidence gaps that block publication
- facts that belong on another canonical URL

## Return to ChatGPT

Return `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md` unchanged. ChatGPT will audit source scope, dates, cannibalization, YMYL wording and calculator implications before briefs or drafting begin.
