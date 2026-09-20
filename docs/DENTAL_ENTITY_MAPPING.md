# Dental Entity Mapping Contract

## Purpose

This file makes external entity grounding an explicit architecture and Semantic SEO requirement for Dental Cost Calculator.

The canonical mapping is stored in `data/entity-map.csv`. The approved Page Registry remains the authority for URL ownership.

## Core rule

**Entity mapping identifies and disambiguates what an existing page is about. It does not create a reason for a new URL.**

A Wikipedia page or Wikidata QID is not evidence that a separate search-intent page should exist. URL ownership still comes from the approved topical map/Page Registry, user task, information gain and cannibalization review.

## Production schema behavior

Production JSON-LD is generated centrally by `scripts/prepare-deploy-seo.mjs`.

- Exact or scoped procedure mappings use `WebPage.about`.
- Broader contextual entities that are not identical to the page task use `WebPage.mentions`.
- The homepage maps the WebSite to the central entity: **Dentistry**.
- External identity links are attached to Schema.org `Thing` nodes through `sameAs`.
- `sameAs` is **not** placed directly on a WebPage merely because the page discusses an external entity.
- Composite intents may contain more than one Thing node when both entities are necessary to disambiguate the task.

## Evidence boundary

Wikipedia and Wikidata are used here for **entity identity and disambiguation**. They are not the publication authority for:

- U.S. dental prices;
- insurance coverage or reimbursement;
- clinical recommendations;
- diagnosis or candidacy;
- treatment outcomes or risk rates.

Those claims continue to follow the site's source register and Dental evidence hierarchy.

## Architecture safeguards

The mapping deliberately preserves cases where multiple URLs share a global entity node but own different user tasks.

Example:

- `/dental-inlay-cost/` → Inlays and onlays → Wikidata Q1389317
- `/dental-onlay-cost/` → Inlays and onlays → Wikidata Q1389317

The shared node does not merge the pages. The frozen architecture keeps them separate because the existing evidence/QA record establishes distinct terminology, coding and quote scope.

## Maintenance

Review a mapping when:

1. page ownership changes;
2. the page entity or scope materially changes;
3. an external identifier is deprecated/redirected;
4. a better exact entity becomes available;
5. a composite or broader-node mapping can be made more precise without changing page intent.

Do not churn entity IDs during ordinary price-data or editorial refreshes.
