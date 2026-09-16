# Gemini production handoff — Preventive / cleaning cluster v1

## Task
Produce first-draft Main Content for the three **Wave-A pages that have passed evidence control**:

1. DEN-002 — `/dental-cleaning-cost/`
2. DEN-006 — `/deep-teeth-cleaning-cost/`
3. DEN-011 — `/dental-x-ray-cost/`

Do **not** draft DEN-025 `/dentist-visit-cost/`; its key exam-only price is still blocked.  
Do **not** draft DEN-032 in this batch; it is evidence-controlled but remains Wave B.

## Authority order
Use these files as the production packet:

1. `evidence/preventive/PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`
2. `briefs/DEN-002.md`
3. `briefs/DEN-006.md`
4. `briefs/DEN-011.md`
5. `data/calculator-specs/CALC-002.md`
6. `data/calculator-specs/CALC-006.md`
7. `data/source-register.csv`
8. Project writing/safety rules supplied below

The direct-verified evidence file and source register control factual/numeric claims. The briefs control structure/ownership. Calculator specs control tool description only; do not invent formulas or UI.

## Required output files
Return exactly three Markdown drafts:

- `DEN-002_DRAFT_v1.md`
- `DEN-006_DRAFT_v1.md`
- `DEN-011_DRAFT_v1.md`

No fourth page. No combined article.

---

# Shared drafting rules

- U.S.-focused cost education only.
- Answer first: answer → scope/conditions → evidence → exceptions → implications.
- Preserve each page's frozen H2 vector exactly and in order.
- Do not add headings merely for keyword variants.
- Complete Main Content before FAQs. **Do not add FAQs in this batch.**
- Use plain consumer language. Define unavoidable technical terms on first use.
- Do not diagnose, decide treatment need, determine eligibility, recommend a procedure, or create a universal visit/X-ray schedule.
- Do not claim a dentist/clinical reviewer reviewed the page.
- Author attribution may only say: `Research and written by Farrukh Abdullah.`
- Numeric claims must preserve source, unit, geography, data vintage/unknown vintage, and price context.
- Do not invent or mathematically manufacture prices from bundles.
- Do not convert local examples into U.S. ranges.
- Do not average different sources into a synthetic range.
- Insurance is conditional. Never state that a plan always pays 100%, always covers two cleanings, always treats SRP as a particular benefit tier, or uses a universal percentage.
- Calculator references are **published reference context only** and never defaults or formulas.
- Do not create new URLs.
- Use canonical sibling URLs supplied in the briefs.
- If you believe a claim needs evidence not present in the packet, write `[SOURCE NEEDED BEFORE PUBLICATION]` rather than inventing it.

---

# DEN-002 production contract

URL: `/dental-cleaning-cost/`  
Page entity: Standard/routine dental cleaning cost.  
Primary task: Separate the standard cleaning charge from exam, X-ray, fluoride and other visit charges.

## Approved direct-answer evidence
- Delta Dental: **$85–$160** average cost for a **standard dental cleaning without dental benefits**. The article does not disclose an exact underlying data date/sample for this static range; do not call it a 2026 national fee survey.
- Cigna: adult teeth cleaning average **about $104**, citing ADA HPI **2022 Survey of Dental Fees**. Use as older corroborating context only.
- Humana: **$80–$109 without insurance in Orlando, Florida**. Local comparison only.
- CareCredit $203: **DO NOT present as cleaning-only**. Its cost list labels $203 as `Dental exam (cleaning and x-rays)`, and the separate cleaning article uses the same figure from the same publisher/data lineage. Treat as scope ambiguity, not independent confirmation.

## Exact H2 vector
1. `## How much does a dental cleaning cost?`
2. `## Dental cleaning cost calculator`
3. `## What does a standard dental cleaning price include?`
4. `## Are the exam and X-rays included in a cleaning quote?`
5. `## What can change a dental cleaning quote?`
6. `## How insurance can change what you pay`
7. `## Routine cleaning, deep cleaning and periodontal maintenance are different`
8. `## Related dental cost guides`

## Calculator description boundary
CALC-002 organizes a written quote. It may total user-entered cleaning/separate charges and subtract a user-entered insurer estimate only when it applies to the same quote. It does not choose the cleaning type, generate a market quote, apply a coverage percentage, or auto-fill the $85–$160 reference.

## Excluded scope
- SRP/deep cleaning depth → DEN-006
- periodontal maintenance → DEN-032
- dentist exam/checkup primary pricing → DEN-025
- X-ray type-level prices → DEN-011

---

# DEN-006 production contract

URL: `/deep-teeth-cleaning-cost/`  
Page entity: Scaling and root planing / deep cleaning cost.  
Primary task: Explain a written SRP quote by explicit quadrant count without assuming treatment extent.

## Approved direct-answer evidence
- Delta Dental: **$180–$295 without dental benefits per quadrant** for periodontal scaling and root planing. A quadrant is one-fourth of the mouth.
- Humana local example: **$235–$303 per quadrant in Orlando, Florida**. Local only.
- ADA MouthHealthy: scaling and root planing is a deep cleaning below the gumline; use terminology only, not as a treatment recommendation.

Critical rule: **Never multiply the published range by four to create a default full-mouth cost.** The number of quadrants is a clinical/treatment-plan question and must not be inferred.

## Exact H2 vector
1. `## How much does deep teeth cleaning cost?`
2. `## Deep cleaning cost calculator`
3. `## What does “per quadrant” mean in a deep cleaning quote?`
4. `## What can be included or charged separately?`
5. `## What changes a scaling and root planing quote?`
6. `## Routine cleaning, deep cleaning, debridement and maintenance are not the same`
7. `## How insurance can affect the patient amount`
8. `## Related dental cost guides`

## Calculator description boundary
CALC-006 uses only a user's written quote and confirmed quadrant count. It may sum written quadrant lines or divide a written SRP total by the confirmed quadrant count to show an arithmetic average from that quote. It never infers treatment need or quadrant count and never uses $180–$295 as a computational default.

## Excluded scope
- routine cleaning → DEN-002
- ongoing periodontal maintenance → DEN-032
- broad periodontal surgery/laser pricing
- diagnosis, treatment extent, visit prescription

---

# DEN-011 production contract

URL: `/dental-x-ray-cost/`  
Page entity: Dental X-ray cost by named modality/series.  
Primary task: Compare price by X-ray type without choosing imaging for the reader.

## Approved price table
CareCredit article dated **2025-01-31**, using **2024 ASQ360° research** across all **50 states + DC**:

| Type | Average | Range |
|---|---:|---:|
| Bitewing | $65 | $52–$120 |
| Periapical | $55 | $42–$102 |
| Full-mouth series | $226 | $175–$428 |
| Occlusal | $55 | $43–$103 |
| Panoramic | $200 | $157–$343 |
| Cephalometric | $141 | $110–$274 |
| Cone-beam CT | $466 | $361–$879 |

Do not merge these into one synthetic “dental X-rays cost $X–$Y” range. Preserve each type.

ADA MouthHealthy boundary:
- dentist reviews history/exam to decide whether X-rays are needed;
- frequency varies by oral health, age, risk and signs/symptoms;
- X-rays may not be needed at every visit.

## Exact H2 vector
1. `## How much do dental X-rays cost?`
2. `## Dental X-ray costs by type`
3. `## Bitewing, periapical and full-mouth series are different price units`
4. `## Panoramic, cephalometric and cone-beam CT costs`
5. `## Are dental X-rays included in an exam or cleaning visit?`
6. `## What can change the price of dental X-rays?`
7. `## How insurance and frequency limits can affect what you pay`
8. `## How often you need X-rays is not a cost-calculator decision`
9. `## Related dental cost guides`

## Calculator boundary
DEN-011 has **no calculator**. Do not add one or describe one.

## Excluded scope
- exam/checkup primary pricing → DEN-025
- cleaning-led bundles → DEN-002
- recommending X-ray type or frequency

---

# Output quality check before returning

For each file confirm internally that:
- every H2 appears exactly once and in the supplied order;
- all dollar amounts match the packet exactly;
- local examples retain geography;
- old-vintage or unknown-vintage limitations are preserved;
- no CareCredit $203 standalone cleaning claim appears;
- no default 4-quadrant SRP total appears;
- no universal insurance percentage/frequency appears;
- no new URL appears;
- no FAQ section appears;
- no reviewer credential/approval is invented.

Return only the three complete Markdown files, clearly separated by filename headings.
