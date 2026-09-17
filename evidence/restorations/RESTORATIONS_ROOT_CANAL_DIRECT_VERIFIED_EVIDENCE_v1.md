# Direct Verified Evidence — Root Canal, Fillings and Crowns v1

Date verified: 2026-09-17  
Target market: United States  
Target pages: DEN-005 `/root-canal-cost/`, DEN-010 `/dental-filling-cost/`, DEN-022 `/dental-crown-cost/`  
Architecture: frozen 2026-09-15  
Status: DIRECT_VERIFIED / evidence-controlled for first briefs and calculator specifications

## 1. Evidence rules for this batch

1. Preserve the exact priced unit: tooth category, filling material, filling surface/location or crown material.
2. Keep U.S. national/broad publisher research separate from Orlando, Florida examples.
3. Never merge unlike price rows into a synthetic national range.
4. Do not infer a service is included when the source does not state it.
5. Published prices are reference data only. Calculators must operate on written quote amounts entered by the user.
6. Insurance percentages, deductibles, annual maximums, network adjustments, waiting periods and frequency rules are never assumed. GUI-001 owns the shared insurance framework.
7. No symptom-to-treatment logic, diagnosis, material recommendation, treatment need or candidacy decision.
8. If a requested price category is absent from the verified sources, mark it unsupported rather than deriving it from a nearby category.

---

# 2. Shared source inventory

## RRC-001 — CareCredit / Synchrony: Dentist Prices — Dental Procedure Cost List
URL: https://www.carecredit.com/dentistry/costs/  
Publisher type: commercial healthcare-financing / cost-study publisher  
Geography: 50 U.S. states + District of Columbia  
Research lineage: CareCredit/Synchrony cost information attributed to ASQ360° research conducted in 2023–2024  
Price type: publisher-reported average procedural costs; not a provider quote, cash-fee guarantee or insurer allowed amount  
Use: broad cross-checks and clearly named procedure/material rows only.

Verified rows relevant to this batch:
- Root canal, bicuspid: $984 average.
- Root canal, front tooth: $984 average.
- Root canal, molar: $1,337 average.
- Filling, CEREC: $810 average.
- Filling, composite: $226 average.
- Filling, glass ionomer: $152 average.
- Filling, gold: $466 average.
- Filling, porcelain inlay/onlay: $976 average — this row does not make inlay/onlay a filling subtype for site architecture; DEN-004/DEN-013 remain their owners.
- Filling, silver amalgam: $139 average.
- Crown, metallic: $1,211 average.
- Crown, porcelain: $1,399 average.
- Crown, porcelain fused to metal: $1,114 average.
- Crown, resin/temporary: $697 average.
- Broken crown repair: $765 average.
- Recement dislodged crown: $126 average.

Critical limitations:
- Do not convert broken-crown repair or recementing into a replacement-crown benchmark.
- Do not assume these rows share identical inclusion scope.
- Dedicated procedure pages below control more specific ranges/scope where available.

---

# 3. DEN-005 — Root canal evidence

## RRC-005-001 — CareCredit: What Is a Root Canal? Procedure, Cost and Recovery
URL: https://www.carecredit.com/well-u/health-wellness/what-is-a-root-canal/  
Article date observed: 2024-11-15  
Geography: U.S. national research; 50 states + District of Columbia  
Research lineage: 2023–2024 Synchrony Average Procedural Cost Studies conducted by ASQ360°  
Price type: publisher-reported procedural estimates; not a quote or insurer allowed amount

Verified cost observations:
- National average: $1,165.
- Broad reported range: $500–$1,800.
- Front tooth: $776–$1,911.
- Bicuspid: $757–$1,798.
- Molar: $1,030–$2,471.

Scope/limitations:
- Keep tooth-category rows separate; do not turn their minimum/maximum into a synthetic universal range beyond the source's own stated $500–$1,800 broad range.
- State-level values exclude consultation, potential ongoing maintenance/repair and insurance.
- The article discusses final restoration after root-canal treatment, but its root-canal price sentence does not establish that a final crown/restoration is included.
- The article contains secondary insurance and provider-price statements. Do NOT adopt its "30–50%" insurance statement or an endodontist percentage premium as a site default.

Publication-safe wording:
CareCredit reports a U.S. national average of $1,165 for root-canal treatment and separate ranges by tooth category. The final restoration must be checked separately on the written quote because the source does not establish that a crown or filling is included in those root-canal figures.

## RRC-005-002 — Humana: Cost of common dental procedures
URL: https://www.humana.com/dental-insurance/dental-resources/cost-of-dental-procedures  
Article last-updated context observed: 2026-06-01  
Pricing-tool access noted by source: 2026-05-13  
Geography: Orlando, Florida only  
Price type: Humana proprietary Dental Procedure Pricing Tool examples; not U.S.-wide estimates

Verified root-canal examples:
- Molar root canal, excluding final restoration: $1,175.
- Premolar root canal, excluding final restoration: $1,017.
- Anterior root canal, excluding final restoration: $900.

Critical value:
The source explicitly labels these root-canal examples as excluding the final restoration. This supports separating the root-canal line from a later crown/filling line in DEN-005 and CALC-005.

Do not generalize these Orlando values nationally.

## RRC-005-003 — ADA MouthHealthy: Root Canals
URL: https://www.mouthhealthy.org/all-topics-a-z/root-canals  
Publisher: American Dental Association consumer education  
Use: clinical terminology and component boundary only; no price data

Verified facts usable for cost education:
- Root-canal treatment may be provided by a dentist or referred to an endodontist.
- A temporary filling may be used during treatment.
- The tooth later receives a definitive restoration, which may be a permanent filling or crown; a post may be used in some cases.

Safety boundary:
Do not infer that a particular reader needs a crown, post or specialist.

## RRC-005-004 — American Association of Endodontists: What Is a Root Canal?
URL: https://www.aae.org/patients/root-canal-treatment/what-is-a-root-canal/  
Publisher: professional specialty association  
Use: procedure terminology and cost-driver context only

Verified facts usable here:
- Root-canal treatment involves removing inflamed/infected pulp, cleaning/disinfecting, filling and sealing the inside of the tooth.
- Cost varies with complexity and tooth; molars generally cost more.
- The tooth is restored afterward with a crown or filling.

No treatment recommendation or diagnostic criteria should be imported.

## RRC-005-005 — American Association of Endodontists: Endodontic Retreatment
URL: https://www.aae.org/patients/root-canal-treatment/endodontic-treatment-options/endodontic-retreatment/  
Use: retreatment category distinction only

Verified scope:
Retreatment is a distinct later procedure when a previously treated tooth requires additional endodontic treatment.

Evidence gap:
- No verified national retreatment price was obtained in this source set.
- DEN-005 may explain that a quote labeled retreatment is not the same pricing category as initial treatment, but must not publish or calculate a retreatment default.

### DEN-005 approved evidence conclusions
SUPPORTED:
- U.S. broad/national average and category ranges from CareCredit.
- Local Orlando examples explicitly excluding final restoration.
- Tooth category as a valid quote label/cost dimension.
- Crown/filling/restoration should be recorded separately when separately quoted.
- Retreatment is a distinct procedure category.

UNSUPPORTED / BLOCKED:
- National retreatment price.
- Universal endodontist price premium.
- Universal insurance percentage.
- Any assumption that crown, build-up, post, imaging or consultation is included in a root-canal figure without quote/source confirmation.
- Symptom-based treatment selection.

---

# 4. DEN-010 — Dental filling evidence

## RRC-010-001 — CareCredit: Dental Tooth Fillings Cost and Procedure Guide
URL: https://www.carecredit.com/well-u/health-wellness/dental-tooth-fillings-cost-dental-fillings-financing/  
Article date observed: 2025-01-10  
Geography: 50 U.S. states + District of Columbia  
Research lineage: 2024 Synchrony / ASQ360° procedural-cost research  
Price type: publisher-reported estimates by material

Verified per-tooth/material ranges:
- Silver amalgam: $108–$256.
- Composite resin: $173–$439.
- Gold: $361–$817.
- Porcelain/ceramic: $755–$1,774.
- Glass ionomer: $116–$285.
- Composite national average: $226.

Critical limitations:
- Keep material categories separate.
- Do not publish $108–$1,774 as though it were one interchangeable standard-filling range; those endpoints come from different materials.
- The page contains clinical/material-selection and insurance statements that are not needed as universal claims. Material choice remains a dentist/patient decision, not calculator logic.

Publication-safe wording:
Published filling prices vary substantially by material. The site should show material-specific ranges rather than one synthetic filling range.

## RRC-010-002 — Humana: Cost of common dental procedures
URL: https://www.humana.com/dental-insurance/dental-resources/cost-of-dental-procedures  
Geography: Orlando, Florida only  
Price type: proprietary pricing-tool examples

Verified filling examples:
- Amalgam, two surfaces, primary/permanent tooth: $229.
- Composite, one surface, anterior: $199.
- Composite, one surface, posterior: $217.
- Composite, two surfaces, posterior: $274.
- Composite, three surfaces, posterior: $333.

Use:
These local examples support surface count and anterior/posterior quote labels as meaningful price-scope fields.

Critical limitation:
Do not present these Orlando examples as national benchmarks or merge them into the national material ranges.

## RRC-010-003 — ADA MouthHealthy: Dental Filling Options
URL: https://www.mouthhealthy.org/all-topics-a-z/dental-filling-options  
Publisher: American Dental Association consumer education  
Use: material terminology / decision boundary only

Verified scope usable here:
- Common filling materials include composite, amalgam and gold.
- Material selection depends on case-specific factors and should be discussed with the dentist.

Safety boundary:
The page/calculator may record the material stated on a quote but must not choose or recommend a material.

### DEN-010 approved evidence conclusions
SUPPORTED:
- Material-specific U.S. ranges.
- Composite average.
- Local surface-count/anterior-posterior quote examples.
- Material and surface/location as quote fields.

UNSUPPORTED / BLOCKED:
- One universal filling range created by merging material extremes.
- Material recommendation or suitability logic.
- A universal insurance payment percentage.
- A claim that cavity removal, X-rays, anesthesia or other adjuncts are included unless the quote/source says so.

---

# 5. DEN-022 — Dental crown evidence

## RRC-022-001 — CareCredit: Dental Crown Cost and Procedure Guide
URL: https://www.carecredit.com/well-u/health-wellness/dental-crown-cost-dental-crown-financing/  
Article date observed: 2024-11-15  
Geography: 50 U.S. states + District of Columbia  
Research lineage: 2024 Synchrony / ASQ360° procedural-cost research  
Price type: publisher-reported estimates by crown material/type

Verified averages/ranges:
- Porcelain: $1,399 average; $915–$3,254 range.
- Porcelain fused to metal (non-gold): $1,114 average; $770–$2,454 range.
- Metallic: $1,211 average; $821–$2,861 range.
- Resin/temporary: $697 average; $488–$1,593 range.

Scope and limitations:
- The article headline `$697–$1,399` compares average prices across types; it is NOT the full price range across all crown observations. Prefer the material table.
- The cost does not establish inclusion of the initial office visit, extraction or postoperative fees.
- State-level porcelain pricing also excludes consultation, extraction, potential maintenance/repair and insurance.
- The source explains that extra tooth structure/material may sometimes be needed as a foundation/build-up, but does not provide a verified build-up price.

## RRC-022-002 — Humana: Cost of common dental procedures
URL: https://www.humana.com/dental-insurance/dental-resources/cost-of-dental-procedures  
Geography: Orlando, Florida only  
Price type: proprietary pricing-tool examples

Verified crown examples:
- Porcelain/ceramic: $1,387.
- Porcelain fused to high noble metal: $1,192.
- Full cast high noble metal: $1,440.
- Porcelain fused to noble metal: $1,248.
- Porcelain fused to predominantly base metal: $1,091.

Use:
Local examples only; useful for demonstrating that exact material/metal category matters on a quote.

## RRC-022-003 — ADA MouthHealthy: Crowns
URL: https://www.mouthhealthy.org/all-topics-a-z/crowns  
Publisher: American Dental Association consumer education  
Use: high-level crown definition only

Verified scope:
A crown covers/restores the tooth's shape, size and function.

Architecture boundary:
ADA also discusses crowns associated with implants, but implant-supported crown pricing belongs to DEN-001 and must not be absorbed by DEN-022.

## RRC-022-004 — CareCredit general procedure list: repair/recement distinction
URL: https://www.carecredit.com/dentistry/costs/  
Verified separate categories:
- Broken crown repair: $765 average.
- Recement dislodged crown: $126 average.

Critical restriction:
These are repair/recement categories, not replacement-crown prices. Do not relabel either as the cost of replacing a crown.

### DEN-022 approved evidence conclusions
SUPPORTED:
- Material-specific national averages/ranges.
- Local material-specific examples.
- A build-up/foundation may be a separate quote component, but its price is user-entered only unless later evidence supplies a valid benchmark.
- Repair and recement are distinct from a new/replacement crown.

UNSUPPORTED / BLOCKED:
- National replacement-crown benchmark distinct from new crown categories.
- Default build-up price.
- Implant-supported crown price on DEN-022.
- Universal insurance percentage.
- Material recommendation/suitability logic.

---

# 6. Shared calculator evidence boundary

CALC-005, CALC-010 and CALC-022 may:
- total only user-entered written quote amounts;
- record source-defined/descriptive quote labels such as tooth category, filling material, surface count/location, crown material and restoration status;
- record included / separate charge / not listed / not sure states;
- subtract a user-entered insurer estimate only when the user confirms it applies to the same written quote scope;
- display published price evidence in a separate reference area that never affects arithmetic.

They must not:
- generate treatment need, material choice or eligibility;
- infer tooth category, surfaces, crown material or restoration type from symptoms/images;
- use a published average/range as an auto-filled quote amount;
- create a retreatment, build-up or replacement-crown default price from missing evidence;
- apply a universal coverage percentage, deductible, annual maximum or network adjustment.

---

# 7. Evidence gaps to preserve

1. DEN-005 retreatment national price: UNSUPPORTED in current verified set.
2. DEN-005 endodontist premium percentage: NOT APPROVED as a default.
3. DEN-022 replacement-crown benchmark distinct from repair/recement: UNSUPPORTED.
4. DEN-022 build-up benchmark: UNSUPPORTED.
5. Universal dental insurance percentage for any of the three pages: PROHIBITED / plan-specific.
6. Any clinical material/treatment recommendation: OUT OF SCOPE.

These gaps do not block first-page/cost-calculator development because the calculators are quote organizers. They do block publishing unsupported default values for those fields.
