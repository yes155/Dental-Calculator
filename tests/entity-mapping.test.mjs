import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { attachEntityRelationship, buildEntityThings, parseEntityMap } from "../scripts/entity-map.mjs";

const root = resolve(new URL("..", import.meta.url).pathname);
const registryCsv = await readFile(resolve(root, "data/page-registry.csv"), "utf8");
const entityCsv = await readFile(resolve(root, "data/entity-map.csv"), "utf8");

function parseRegistry(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = (lines.shift() || "").split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

const registry = parseRegistry(registryCsv);
const approved = registry.filter((row) => row.status.startsWith("APPROVED"));
const approvedDental = approved.filter((row) => row.page_id.startsWith("DEN-"));
const mappings = parseEntityMap(entityCsv);
const byPageId = new Map(mappings.map((row) => [row.page_id, row]));
const byUrl = new Map(mappings.map((row) => [row.url, row]));

test("entity map covers the central site entity and every approved dental procedure page", () => {
  assert.equal(approvedDental.length, 24, "frozen architecture should still contain 24 approved DEN procedure pages");
  assert.equal(byPageId.get("HOM-001")?.entity_name, "Dentistry");
  for (const row of approvedDental) {
    assert.ok(byPageId.has(row.page_id), `${row.page_id} ${row.url}: missing entity mapping`);
  }
});

test("entity mapping never creates or reactivates routes", () => {
  const approvedUrls = new Set(approved.map((row) => row.url));
  for (const mapping of mappings) {
    assert.ok(approvedUrls.has(mapping.url), `${mapping.page_id}: entity map route is not approved: ${mapping.url}`);
    const registryRow = approved.find((row) => row.page_id === mapping.page_id);
    assert.equal(registryRow?.url, mapping.url, `${mapping.page_id}: entity URL must match the frozen registry`);
  }
  for (const row of registry.filter((item) => item.status.startsWith("DEFERRED"))) {
    assert.equal(byUrl.has(row.url), false, `${row.page_id}: deferred route must not receive a production entity mapping`);
  }
});

test("shared external entity nodes do not collapse distinct canonical page owners", () => {
  const inlay = byPageId.get("DEN-004");
  const onlay = byPageId.get("DEN-013");
  assert.equal(inlay.wikidata_qid, "Q1389317");
  assert.equal(onlay.wikidata_qid, "Q1389317");
  assert.equal(inlay.mapping_type, "FAMILY-SUBTYPE");
  assert.equal(onlay.mapping_type, "FAMILY-SUBTYPE");
  assert.notEqual(inlay.url, onlay.url);
  assert.equal(inlay.url, "/dental-inlay-cost/");
  assert.equal(onlay.url, "/dental-onlay-cost/");
});

test("composite and broader-node relationships stay explicit", () => {
  const wisdom = byPageId.get("DEN-018");
  assert.equal(wisdom.mapping_type, "COMPOSITE");
  assert.deepEqual(buildEntityThings(wisdom).map((thing) => thing.name), ["Dental extraction", "Wisdom tooth"]);

  assert.equal(byPageId.get("DEN-025").relation, "mentions");
  assert.equal(byPageId.get("DEN-032").relation, "mentions");
  assert.equal(byPageId.get("DEN-025").mapping_type, "BROADER-NODE");
  assert.equal(byPageId.get("DEN-032").mapping_type, "BROADER-NODE");
});

test("canonical and no-invented-ID safeguards are preserved", () => {
  assert.equal(byPageId.get("DEN-030").wikidata_qid, "Q143567", "dentures must use the canonical Wikidata item");
  assert.notEqual(byPageId.get("DEN-030").wikidata_qid, "Q19391951");
  assert.equal(byPageId.get("DEN-023").wikidata_qid, "", "dental bonding must not invent an unverified QID");
  assert.match(byPageId.get("DEN-023").wikipedia_url, /^https:\/\/en\.wikipedia\.org\/wiki\//);
});

test("schema relationship helper puts sameAs on Thing nodes not on the WebPage", () => {
  for (const mapping of mappings) {
    const target = { "@type": "WebPage" };
    const things = attachEntityRelationship(target, mapping);
    assert.equal("sameAs" in target, false, `${mapping.page_id}: page itself must not receive entity sameAs`);
    assert.ok(target[mapping.relation], `${mapping.page_id}: expected ${mapping.relation} relationship`);
    for (const thing of things) {
      assert.equal(thing["@type"], "Thing");
      assert.ok(Array.isArray(thing.sameAs) && thing.sameAs.length >= 1, `${mapping.page_id}: Thing needs at least one external identity link`);
    }
  }
});
