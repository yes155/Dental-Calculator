# External Model Handoff Manifest

| Handoff ID | Page ID/Batch | Model | Task | Input Files / Sources | Request File | Expected Output | Status | Returned File | QA Status |
|---|---|---|---|---|---|---|---|---|---|
| NLM-IMPLANTS-001 | DEN-001; DEN-003; DEN-007; DEN-012 | NotebookLM | Extract claim-level clinical, price, scope, insurance and conflict evidence for the implant cluster | Frozen Page Registry contracts plus 20-source corpus listed in request | `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v1.md` | `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md` | RETURNED | User-returned v1 pack | **FAIL — external source corpus not ingested; unsupported synthesis values present** |
| NLM-IMPLANTS-002 | DEN-001; DEN-003; DEN-007; DEN-012 | NotebookLM | Rerun implants evidence extraction with mandatory source-ingestion preflight and external-source-only factual support | 20-source corpus verified/required by v2 request | `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v2.md` | `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v2.md` | READY_FOR_NOTEBOOKLM | — | — |

QA for v1: `evidence/qa/NLM_IMPLANTS_CLUSTER_EVIDENCE_QA_v1.md`
