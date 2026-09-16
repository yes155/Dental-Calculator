# Gemini Implants Cluster Draft QA v1

Date: 2026-09-16  
Input: user-returned `DEN-001_DRAFT_v1.md`, `DEN-003_DRAFT_v1.md`, `DEN-007_DRAFT_v1.md`, `DEN-012_DRAFT_v1.md`  
Controlling briefs: `briefs/DEN-001.md`, `briefs/DEN-003.md`, `briefs/DEN-007.md`, `briefs/DEN-012.md`  
Evidence authority: `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` + `data/source-register.csv`

## Overall verdict

**FAIL AS RECEIVED — SALVAGEABLE.**

The drafts contain useful answer-first phrasing and mostly preserve the major verified price figures, but they do not follow the frozen heading vectors and several sentences overstate what the evidence establishes. They are not production-ready in their returned form.

Decision: preserve only evidence-safe wording, rebuild all four drafts to the frozen H2 vectors, then integrate corrected v2 prose into the existing noindex preview implementation.

## Fresh evidence check performed before correction

Current public-source checks on 2026-09-16 confirmed:
- CareCredit single-tooth implant: $2,143 national average and $1,646–$4,157 on the dedicated single-tooth page; the broader implant guide states that the implant benchmark covers the artificial-root process/material and excludes the crown.
- CareCredit bone graft ranges: allograft $652–$1,575; alloplast $576–$1,375; autograft $2,161–$5,148; xenograft $549–$1,386.
- CareCredit All-on-4: $15,176 average and $11,640–$27,500 range; article context describes upper OR lower jaw treatment, while the price sentence does not independently define a two-arch/full-mouth unit.
- Forbes Advisor continues to report an ADA-attributed $20,000–$45,000 figure for a “mouthful of implants”; exact arch/package scope remains insufficient for a national per-arch default.

## DEN-001 QA

Status: **REWRITE REQUIRED**

Passes:
- Uses the approved CareCredit single-tooth benchmark.
- Keeps immediate-load $3,255 separate.
- Treats Humana Orlando data as local rather than national.
- Describes CALC-001 as a written-quote organizer.

Corrections required:
1. Frozen brief requires nine H2 vectors; returned draft uses only four and omits the core quote-component, adjunct and related-guide sections.
2. “Figures exclusively reflect the implant body itself” is too narrow. CareCredit describes the price as the process/material for implanting the artificial root; use that scope.
3. “Dental insurance rarely provides a fixed percentage” is not the approved formulation. Replace with: there is no universal fixed implant coverage percentage; exact plan terms control.
4. Keep crown exclusion immediately adjacent to the benchmark and do not imply a complete implant + abutment + crown national package price exists.

## DEN-003 QA

Status: **REWRITE REQUIRED**

Passes:
- Preserves the $20,000–$45,000 “mouthful of implants” scope caveat.
- Correctly avoids halving/doubling the range into a per-arch price.
- Describes CALC-003 as a quote normalizer rather than market estimator.

Corrections required:
1. Frozen brief requires nine H2 vectors; returned draft uses only three.
2. “No standardized national per-arch price exists” is too absolute. Approved wording: current evidence does not support a defensible national per-arch default.
3. “Implant dentistry scales based on specific physiological requirements” adds unsupported clinical framing. Replace with explicit quote variables: arch count, restoration/package scope, separately quoted adjuncts, provider/location.
4. Fixed vs removable, temporary/final prosthesis and All-on-4 boundary sections must be restored.

## DEN-007 QA

Status: **REWRITE REQUIRED**

Passes:
- Preserves all four CareCredit graft-type ranges separately.
- Excludes sinus-lift pricing.
- Does not recommend a graft material or determine candidacy.

Corrections required:
1. Frozen brief requires eight H2 vectors; returned draft uses only two.
2. “Each graft origin carries specific processing and surgical requirements that impact the provider’s fee” is broader causal wording than the price evidence requires. State instead that published prices differ by graft type and case/provider factors.
3. The insurance sentence tying coverage to whether grafting supports an implant or another restorative function is not sufficiently established in the approved source set. Keep insurance wording plan-specific and verification-oriented.
4. Restore explicit bundle/separate/unknown quote-scope section and related-page boundaries.

## DEN-012 QA

Status: **REWRITE REQUIRED**

Passes:
- Preserves the CareCredit All-on-4 average/range and 2024 national-study scope.
- Correctly warns against silently doubling the published reference.
- Restricts Nobel Biocare to concept/trademark attribution.
- Describes CALC-003-A04 as user-entered quote normalization.

Corrections required:
1. Frozen brief requires nine H2 vectors; returned draft uses only three.
2. “Baseline cost describes an isolated surgical and restorative scenario” is unsupported wording. The evidence establishes a published All-on-4 benchmark, while individual package inclusions remain unknown.
3. “Quotes will fluctuate based on required preparatory work” should be replaced with explicit supported quote variables and separately quoted items; do not imply preparatory work is universally required.
4. Restore arch-unit, package-inclusion, insurance, generic full-arch comparison and related-guide sections.

## Publication decision

- Gemini v1 drafts: **REJECTED AS PRODUCTION COPY**.
- Corrected v2 drafts: may be integrated after semantic/evidence checks.
- FAQ expansion remains deferred until Main Content is complete.
- Preview remains `noindex,nofollow`.
- No reviewer/clinical-review claim may be added.
