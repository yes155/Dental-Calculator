# Direct Verified Evidence — DEN-025 Dentist Visit Cost v1

Date verified: 2026-09-17  
Target market: United States  
Target page: DEN-025 `/dentist-visit-cost/`  
Architecture: frozen 2026-09-15  
Registry status: Wave A; no calculator assigned  
Status: DIRECT_VERIFIED / brief-ready with exam-vs-bundle restrictions

## 1. Evidence rules for DEN-025

1. DEN-025 owns dental exam/checkup/visit cost and exam-led appointment bundles.
2. DEN-002 owns cleaning-led pricing. DEN-011 owns imaging-only pricing. Do not duplicate their price depth on DEN-025.
3. Preserve the exact priced unit: exam-only, consultation, problem-focused evaluation, or named visit bundle.
4. Do not relabel an exam + cleaning + X-ray bundle as an exam-only national price.
5. Do not convert plan copays, office-visit copays, plan allowances, local fee schedules, or one provider’s charge into a U.S.-wide market price.
6. No symptom-based diagnosis, treatment recommendation, emergency triage substitute, or assumption that a particular reader needs a comprehensive, periodic, problem-focused, periodontal, or consultation visit type.
7. Insurance coverage is plan-specific. Do not apply a universal coverage percentage, visit frequency, deductible, annual maximum, copay, network rule, or alternate benefit.
8. If a source does not state whether cleaning, X-rays, fluoride, consultation, after-hours office visit, or another service is included, treat inclusion as unknown.

---

## 2. Primary current national price evidence

### DVC-001 — CareCredit / Synchrony: Dentist Prices — Dental Procedure Cost List
URL: https://www.carecredit.com/dentistry/costs/  
Publisher type: commercial healthcare-financing / cost-study publisher  
Geography: 50 U.S. states + District of Columbia  
Research lineage: ASQ360° research conducted for Synchrony/CareCredit in 2023–2024  
Price type: publisher-reported national procedural-cost observation; not a provider quote, guaranteed cash fee, or insurer allowed amount

Verified observation relevant to DEN-025:
- Routine dental exam **including a full dental cleaning and X-rays**: **$203 national average**.
- Reported range for that bundled routine dental exam: **$50–$350**.
- The source publishes state/district averages for this same bundled category.

Critical scope restriction:
- CareCredit explicitly describes this as a routine dental exam that includes a full dental cleaning and X-rays.
- Therefore DEN-025 must **not** publish `$203` or `$50–$350` as an exam-only national fee.
- DEN-025 may use the figure only as clearly labeled current U.S. context for an **exam + cleaning + X-ray bundle**.
- Cleaning-only pricing remains DEN-002. Imaging-only pricing remains DEN-011.

Publication-safe wording:
> A current U.S. cost study reports a **$203 average and $50–$350 range for a routine dental exam that includes a full cleaning and X-rays**. The source does not establish that those figures are the price of an exam alone.

Source limitation:
- Actual cost varies by geography, provider and other variables.
- CareCredit states that its cost information was based on 2023–2024 ASQ360° research across the 50 states and District of Columbia.

---

## 3. Clinical/service-category evidence

### DVC-002 — American Dental Association: Glossary of Dental Terms
URL: https://www.ada.org/publications/cdt/glossary-dental-terms  
Publisher: American Dental Association  
Use: terminology and visit-category boundaries only; no market-price data

Verified scope usable for cost education:
- An **evaluation** is a patient assessment that may include interview, observation, examination and specific tests, allowing a dentist to diagnose existing conditions.
- A **consultation** is a diagnostic service in which a dentist, patient or other parties discuss dental needs and proposed treatment modalities.

Safety boundary:
- DEN-025 may explain that different visit labels can represent different billable services, but it must not determine which category a reader needs.

### DVC-003 — American Dental Association: “6 CDT codes you should know” (2025)
URL: https://adanews.ada.org/new-dentist/2025/march/6-cdt-codes-you-should-know  
Publisher: American Dental Association  
Use: periodic vs comprehensive evaluation distinction; no price data

Verified category distinctions:
- D0150 comprehensive oral evaluation applies to new patients and certain established-patient situations described by ADA.
- D0120 periodic oral evaluation is used for established patients returning to determine changes in dental and medical health status since a prior evaluation.

Restriction:
- Code/category descriptions do not supply a national cash price and do not tell a particular reader which visit type is clinically appropriate.

### DVC-004 — Delta Dental: Dental exams & checkups — what to expect, costs and more
URL: https://www.deltadental.com/protect-my-smile/visiting-the-dentist/what-happens-during-a-dental-checkup/  
Publisher: national dental insurer / consumer education  
Use: visit-bundle context only; no numeric benchmark used

Verified scope usable here:
- A routine dental visit may include both an exam and a cleaning.
- X-rays may be reviewed or taken depending on the visit.
- Delta states that total cost varies with dental coverage and network status and directs users to its cost estimator for individualized estimates.

Use on DEN-025:
- Supports explaining why “dentist visit” and “checkup” prices can refer to different bundles.
- Does not supply a publication-ready national exam-only price.

---

## 4. Problem-focused, consultation and office-visit categories

### DVC-005 — U.S. Office of Personnel Management: Dominion Dental 2026 FEDVIP brochure
URL: https://www.opm.gov/healthcare-insurance/healthcare/plan-information/plans/BrochureJson?brochureNumber=02AP-06&year=2026  
Publisher: U.S. Office of Personnel Management plan document for a named Dominion Dental FEDVIP plan  
Population: members of the named 2026 plan only  
Use: coded service distinctions and plan-specific benefit mechanics; **not** a national market-price benchmark

Verified visit/evaluation categories in the plan document:
- D0120 periodic oral evaluation — established patient.
- D0140 limited oral evaluation — problem focused.
- D0150 comprehensive oral evaluation — new or established patient.
- D0160 detailed and extensive oral evaluation — problem focused, by report.
- D0180 comprehensive periodontal evaluation — new or established patient.

Verified plan-specific mechanics:
- The plan applies its own frequency limits and member cost-sharing.
- The brochure also separates an office-visit copay from procedure-level cost sharing.

Critical restriction:
- Do not use this plan’s `$0`, `$10`, `$30` or any other member copay as the U.S. price of a dental exam or visit.
- Do not generalize its frequency limits or network rules to other plans.

### DVC-006 — U.S. Office of Personnel Management: Delta Dental 2026 FEDVIP brochure
URL: https://www.opm.gov/healthcare-insurance/healthcare/plan-information/plans/BrochureJson?brochureNumber=02AP-05&year=2026  
Publisher: U.S. Office of Personnel Management plan document for Delta Dental’s named 2026 FEDVIP plan  
Use: consultation/office-visit category distinction; **not** a market-price benchmark

Verified separate categories:
- D9310 consultation — diagnostic service provided by a dentist or physician other than the requesting dentist or physician.
- D9440 office visit — after regularly scheduled hours.

Use on DEN-025:
- Supports keeping consultation and after-hours office visits distinct from a routine periodic/comprehensive exam.
- A second-opinion/consultation query should not be assigned the routine exam bundle price unless the written quote actually uses that service scope.

---

## 5. Insurance evidence / limitations

### DVC-007 — U.S. Office of Personnel Management 2026 FEDVIP plan documents
Representative sources:
- Dominion Dental 2026 FEDVIP brochure: https://www.opm.gov/healthcare-insurance/healthcare/plan-information/plans/BrochureJson?brochureNumber=02AP-06&year=2026
- Humana Dental 2026 FEDVIP brochure: https://www.opm.gov/healthcare-insurance/healthcare/plan-information/plans/BrochureJson?brochureNumber=02AP-10&year=2026
- MetLife 2026 FEDVIP brochure: https://www.opm.gov/healthcare-insurance/healthcare/plan-information/plans/BrochureJson?brochureNumber=02AP-11&year=2026

Verified general conclusion:
- Current named-plan documents distinguish multiple oral-evaluation categories and apply plan-specific frequency, network and member cost-sharing rules.
- Current plans can treat periodic, comprehensive, limited/problem-focused and consultation services differently.

Publication restriction:
- DEN-025 must not state that dental insurance universally covers a fixed number of exams per year or pays a fixed percentage.
- It may explain that frequency limits, network status, deductible/cost share and plan-specific classification can change patient responsibility.
- Full insurance mechanics belong to GUI-001.

---

## 6. Evidence gaps to preserve

No current high-confidence source in this verified set supplies a clean U.S. national **exam-only** cash-price average/range for all dental visits.

Therefore the following are UNSUPPORTED / BLOCKED for first-version publication:
- `$203` as an exam-only average.
- `$50–$350` as an exam-only national range.
- One universal dentist-visit price combining periodic, comprehensive, problem-focused, consultation and after-hours services.
- A national second-opinion/consultation price.
- A national emergency-exam price.
- A universal office-visit fee.
- A universal insurance percentage or frequency such as “two exams are always covered.”
- Any assumption that cleaning or X-rays are included in every exam quote.

---

## 7. DEN-025 approved evidence conclusions

SUPPORTED:
- DEN-025 is the canonical owner for exam/checkup/visit cost and exam-led bundles.
- A current national CareCredit/Synchrony study supports **$203 average / $50–$350 range for a routine dental exam that includes a full cleaning and X-rays**.
- That national figure is a **bundle**, not an exam-only benchmark.
- Periodic, comprehensive, limited/problem-focused and periodontal evaluations are distinct service categories.
- Consultation and after-hours office visits are separate service categories from a routine exam.
- Cleaning-only pricing belongs DEN-002; imaging-only pricing belongs DEN-011.
- Insurance frequency and member cost can vary by plan and visit category.

UNSUPPORTED / BLOCKED:
- Current clean national exam-only range from the verified source set.
- Relabeling the CareCredit bundle as exam-only.
- National second-opinion, consultation or emergency-exam prices without additional evidence.
- Using named-plan copays as market prices.
- Any clinical decision about what exam type a reader needs.

---

## 8. First-version page direction

DEN-025 should be an **evidence-led cost guide, not a calculator**.

Recommended answer-first framing:
- Lead with the scope limitation rather than inventing an exam-only national number.
- State the current bundled national reference accurately: **$203 average / $50–$350 for a routine exam that includes a full cleaning and X-rays**.
- Explain that exam-only, problem-focused and consultation charges can be separate service categories and must be read from the written estimate.
- Keep cleaning-only cost depth on DEN-002 and X-ray cost depth on DEN-011.
- Keep emergency-treatment advice out of scope; a problem-focused or after-hours visit category is not a diagnosis or treatment recommendation.

Suggested lead:
> Current U.S. cost research does not give us a clean exam-only national range. The strongest current published benchmark reports a **$203 average and $50–$350 range for a routine dental exam that includes a full cleaning and X-rays**. Because that source prices a bundle, this page will not relabel the figure as the cost of an exam alone.

This evidence packet is sufficient to draft DEN-025 conservatively. A stronger current exam-only national fee dataset would improve the page later but is not required for a transparent first version.