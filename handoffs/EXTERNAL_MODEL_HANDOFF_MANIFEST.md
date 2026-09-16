# External Model Handoff Manifest

| Handoff ID | Page ID/Batch | Model | Task | Input Files / Sources | Request File | Expected Output | Status | Returned File | QA Status |
|---|---|---|---|---|---|---|---|---|---|
| NLM-IMPLANTS-001 | DEN-001; DEN-003; DEN-007; DEN-012 | NotebookLM | Extract claim-level clinical, price, scope, insurance and conflict evidence for the implant cluster | Frozen Page Registry contracts plus 20-source corpus listed in request | `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v1.md` | `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md` | RETURNED | User-returned v1 pack | **FAIL — external source corpus not ingested; unsupported synthesis values present** |
| NLM-IMPLANTS-002 | DEN-001; DEN-003; DEN-007; DEN-012 | NotebookLM | Rerun implants evidence extraction with mandatory source-ingestion preflight | 20-source corpus required by v2 request | `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v2.md` | `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v2.md` | RETURNED | User-returned second pack (still labeled v1) | **FAIL — v2 preflight not followed; required ADA/AAP/CareCredit/Humana corpus absent** |
| DIRECT-IMPLANTS-001 | DEN-001; DEN-003; DEN-007; DEN-012 | ChatGPT direct verification | Replace failed NotebookLM extraction with claim-level live-source verification and source-register migration | FDA; AAP; CareCredit; Humana; Cigna; Delta Dental; CMS; Nobel Biocare; Forbes secondary context | n/a | `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` | COMPLETE | GitHub evidence file | **PASS — scope/price/insurance limitations recorded; no synthetic ranges** |
| GEMINI-IMPLANTS-001 | DEN-001; DEN-003; DEN-007; DEN-012 | Gemini | Produce production prose drafts from frozen evidence-final briefs without changing URLs, calculator logic or evidence decisions | Direct verified evidence + four final briefs + CALC-001/CALC-003/CALC-003-A04 specs | `handoffs/gemini/GEMINI_IMPLANTS_CLUSTER_DRAFT_REQUEST_v1.md` | `DEN-001_DRAFT_v1.md`; `DEN-003_DRAFT_v1.md`; `DEN-007_DRAFT_v1.md`; `DEN-012_DRAFT_v1.md` | RETURNED | User pasted four Gemini drafts in chat | **FAIL AS RECEIVED — incomplete frozen H2 vectors and evidence overstatements; salvageable** |
| CHATGPT-IMPLANTS-CORRECTION-001 | DEN-001; DEN-003; DEN-007; DEN-012 | ChatGPT | Rebuild returned Gemini drafts to frozen heading vectors, correct evidence/YMYL wording, integrate v2 copy | Gemini drafts + direct verified evidence + briefs + semantic/correction guides | `evidence/qa/GEMINI_IMPLANTS_CLUSTER_DRAFT_QA_v1.md` | Four corrected v2 drafts + integrated HTML | COMPLETE | `content/implants/DEN-001_DRAFT_v2.md`; `DEN-003_DRAFT_v2.md`; `DEN-007_DRAFT_v2.md`; `DEN-012_DRAFT_v2.md` | **PASS FOR CONTENT INTEGRATION — rendered/accessibility/final release gates remain open** |

QA lineage:
- NotebookLM first return: `evidence/qa/NLM_IMPLANTS_CLUSTER_EVIDENCE_QA_v1.md`
- Gemini return: `evidence/qa/GEMINI_IMPLANTS_CLUSTER_DRAFT_QA_v1.md`

Current evidence authority for this cluster: `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` plus `data/source-register.csv`.

Current implant HTML in `src/` now contains the corrected v2 editorial copy and remains `noindex,nofollow` pending rendered/accessibility/site-level release QA.
