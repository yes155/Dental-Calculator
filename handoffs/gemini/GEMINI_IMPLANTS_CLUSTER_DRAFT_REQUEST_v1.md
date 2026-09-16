# Gemini Production Draft Request — Implants Cluster v1

Status: READY_FOR_GEMINI  
Date: 2026-09-16  
Pages: DEN-001, DEN-003, DEN-007, DEN-012

## Role

You are the production drafting layer for a U.S.-focused dental-cost education website. Draft from the frozen briefs and verified evidence below. Do not change architecture, URLs, calculator formulas, source ownership, page boundaries or evidence decisions.

ChatGPT owns final QA and implementation. Your job is prose only.

## Controlling inputs

1. `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`
2. `briefs/DEN-001.md`
3. `briefs/DEN-003.md`
4. `briefs/DEN-007.md`
5. `briefs/DEN-012.md`
6. `data/calculator-specs/CALC-001.md`
7. `data/calculator-specs/CALC-003.md`
8. `data/calculator-specs/CALC-003-A04.md`

Do not use the rejected NotebookLM v1 outputs as evidence.

## Global drafting rules

- U.S. market only.
- Cost education, not diagnosis or personalized dental advice.
- Answer first: answer → conditions → evidence → exceptions → implications.
- No filler introductions.
- Keep entity and predicate close together.
- One main contextual vector per H2.
- Do not create headings merely for keyword variants.
- Do not invent a price, range, insurance percentage, coverage promise, procedure inclusion, treatment indication or clinical recommendation.
- Every material price must preserve source, geography, data vintage, procedure/package scope and price type.
- Never merge unlike price categories into a synthetic range.
- Never convert a local/example price into a U.S.-wide estimate.
- Never turn a published reference price into a patient quote.
- Insurance wording must remain conditional: deductible, annual/lifetime maximum, waiting period, network/allowed amount, exclusions and exact plan terms may matter.
- Do not say insurance “usually pays X%” as a general implant rule.
- No candidacy determination, graft-need determination, implant-material recommendation, All-on-4 suitability decision or diagnosis.
- Do not claim dental/medical review. Author is Farrukh Abdullah only unless later approved.
- Use internal links only to the frozen canonical owners in each brief.
- Calculator copy must describe the existing quote-input tool; do not invent inputs/formulas.
- Do not output schema, metadata or HTML. Markdown article prose only.

## DEN-001 — `/dental-implant-cost-calculator/`

Use `briefs/DEN-001.md` exactly for page ownership and heading order.

Key approved evidence:
- CareCredit national implant/artificial-root process: $2,143 average; $1,646–$4,157 range.
- Geography: 50 U.S. states + District of Columbia.
- Data vintage: 2023–2024 Synchrony studies conducted by ASQ360°.
- Critical scope: crown excluded; state values also exclude extraction and office-related fees.
- CareCredit immediate-load implant average: $3,255, kept separate from standard implant range.
- Humana $856–$2,122 is Orlando, Florida local context only; do not merge into national range.
- FDA supports implant-body/abutment/material terminology.
- Complete implant + abutment + crown national package price remains unsupported as a clean default.

Calculator: describe CALC-001 as a written-quote organizer. It may total bundle/itemized inputs, normalize by confirmed tooth count, show inclusion status and subtract only a same-scope insurer estimate entered by the user.

## DEN-003 — `/full-mouth-dental-implants-cost/`

Use `briefs/DEN-003.md` exactly for ownership and heading order.

Evidence decision:
- Forbes Advisor reports an ADA-attributed $20,000–$45,000 figure for a “mouthful of implants.”
- This is secondary broad context only.
- The source does not define exact arch count, implant count, fixed/removable type or package inclusions.
- Therefore NO national per-arch price is authorized.
- Never halve/double this range to manufacture an arch price.
- Never substitute All-on-4 pricing for generic full-arch pricing.
- AAP/FDA support component and full-mouth terminology.

Calculator: CALC-003 only normalizes the user’s written total by user-confirmed 1- or 2-arch scope and package statuses. It does not estimate a market price.

## DEN-007 — `/dental-bone-graft-cost/`

Use `briefs/DEN-007.md` exactly for ownership and heading order.

Approved CareCredit ranges, average cost per graft:
- Allograft: $652–$1,575
- Alloplast: $576–$1,375
- Autograft: $2,161–$5,148
- Xenograft: $549–$1,386

Methodology: 2023–2024 Synchrony Average Procedural Cost Studies, ASQ360°, 50 states + DC.

Keep all four ranges separate. Do not publish the overall $549–$5,148 span as though all grafts are interchangeable.

Sinus-lift pricing is excluded from DEN-007 even if another source contains it. Do not determine whether a reader needs grafting or which material is suitable.

No calculator is assigned.

## DEN-012 — `/all-on-4-dental-implants-cost/`

Use `briefs/DEN-012.md` exactly for ownership and heading order.

Approved CareCredit evidence:
- $15,176 national average
- $11,640–$27,500 reported range
- 2024 Synchrony Average Procedural Cost Study by ASQ360°, 50 states + DC

Critical unit/package caveat:
- Source context describes treatment of either the upper or lower jaw with four implants and a bridge.
- The price sentence itself does not independently label the figure “per arch.”
- Do not silently double the reference for two arches.
- Do not claim extraction, grafting, imaging, temporary bridge, final bridge or follow-up are included unless explicitly stated.

Nobel Biocare may be used only for trademark/concept attribution. No manufacturer superiority, graft-free, success-rate or candidacy claims.

Calculator: CALC-003-A04 normalizes a user-entered written All-on-4 quote by confirmed arch count; the CareCredit reference card never changes the arithmetic.

## Required output

Return four separate Markdown drafts in this order:

1. `DEN-001_DRAFT_v1.md`
2. `DEN-003_DRAFT_v1.md`
3. `DEN-007_DRAFT_v1.md`
4. `DEN-012_DRAFT_v1.md`

For each draft include:
- H1
- answer-first opening
- all H2s from the brief in the same order
- concise calculator-introduction copy where assigned
- internal-link anchor suggestions inline in parentheses, without changing URLs
- final plain-text Sources section naming the sources actually used

Do not add FAQ sections yet. Main Content must be complete before supplementary FAQ content.

## Final self-check before returning

For each page verify:
- no unsupported number appears;
- every price has its source/scope nearby;
- no synthetic range was created;
- no local fee was generalized nationally;
- no fixed insurance percentage is promised;
- no clinical decision/recommendation appears;
- no canonical-owner boundary is crossed;
- no fake reviewer/credential is stated;
- calculator behavior matches the frozen spec exactly.
