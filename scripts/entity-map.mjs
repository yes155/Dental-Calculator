const REQUIRED_COLUMNS = [
  "page_id",
  "url",
  "relation",
  "mapping_type",
  "entity_name",
  "wikidata_qid",
  "wikipedia_url",
  "domain_ontology_id",
  "notes",
];

const splitPipe = (value = "") => value.split("|").map((part) => part.trim());

export function parseEntityMap(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const header = (lines.shift() || "").split(",");
  for (const column of REQUIRED_COLUMNS) {
    if (!header.includes(column)) throw new Error(`entity-map.csv is missing ${column}`);
  }

  const index = Object.fromEntries(header.map((column, i) => [column, i]));
  const seenUrls = new Set();

  return lines.filter(Boolean).map((line) => {
    const cells = line.split(",");
    const row = Object.fromEntries(REQUIRED_COLUMNS.map((column) => [column, cells[index[column]] ?? ""]));

    if (!row.page_id || !row.url || !row.entity_name) throw new Error(`Invalid entity mapping row: ${line}`);
    if (!["about", "mentions"].includes(row.relation)) throw new Error(`${row.page_id}: relation must be about or mentions`);
    if (seenUrls.has(row.url)) throw new Error(`${row.url}: duplicate entity mapping route`);
    seenUrls.add(row.url);

    const names = splitPipe(row.entity_name);
    for (const field of ["wikidata_qid", "wikipedia_url", "domain_ontology_id"]) {
      const parts = splitPipe(row[field]);
      if (parts.length > 1 && parts.length !== names.length) {
        throw new Error(`${row.page_id}: ${field} composite count must match entity_name`);
      }
    }

    for (const qid of splitPipe(row.wikidata_qid).filter(Boolean)) {
      if (!/^Q\d+$/.test(qid)) throw new Error(`${row.page_id}: invalid Wikidata QID ${qid}`);
    }
    for (const wikipediaUrl of splitPipe(row.wikipedia_url).filter(Boolean)) {
      if (!/^https:\/\/en\.wikipedia\.org\/wiki\//.test(wikipediaUrl)) {
        throw new Error(`${row.page_id}: invalid English Wikipedia URL ${wikipediaUrl}`);
      }
    }

    return row;
  });
}

function atIndex(parts, index) {
  if (parts.length === 1) return parts[0] || "";
  return parts[index] || "";
}

function ontologyIdentifier(value) {
  if (!value) return null;
  const splitAt = value.indexOf(":");
  if (splitAt === -1) {
    return { "@type": "PropertyValue", propertyID: "External ontology", value };
  }
  return {
    "@type": "PropertyValue",
    propertyID: value.slice(0, splitAt),
    value: value.slice(splitAt + 1),
  };
}

export function buildEntityThings(mapping) {
  if (!mapping) return [];

  const names = splitPipe(mapping.entity_name);
  const qids = splitPipe(mapping.wikidata_qid);
  const wikipediaUrls = splitPipe(mapping.wikipedia_url);
  const ontologyIds = splitPipe(mapping.domain_ontology_id);

  return names.map((name, index) => {
    const qid = atIndex(qids, index);
    const wikipediaUrl = atIndex(wikipediaUrls, index);
    const ontologyId = atIndex(ontologyIds, index);
    const sameAs = [];

    if (qid) sameAs.push(`https://www.wikidata.org/wiki/${qid}`);
    if (wikipediaUrl) sameAs.push(wikipediaUrl);

    const thing = { "@type": "Thing", name };
    if (sameAs.length) thing.sameAs = sameAs;

    const identifier = ontologyIdentifier(ontologyId);
    if (identifier) thing.identifier = identifier;

    return thing;
  });
}

export function attachEntityRelationship(target, mapping) {
  const things = buildEntityThings(mapping);
  if (!things.length) return things;

  const value = things.length === 1 ? things[0] : things;
  if (mapping.relation === "about") target.about = value;
  else if (mapping.relation === "mentions") target.mentions = value;
  else throw new Error(`${mapping.page_id}: unsupported entity relationship ${mapping.relation}`);

  return things;
}
