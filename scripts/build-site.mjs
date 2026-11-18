import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const base = "https://dan-beranek.github.io/agentic-entity-resolution-guardrail-planner";
const configPath = path.join(root, "assets/data/distribution-platforms.json");
const artifactMetadataPath = path.join(root, "assets/data/artifact-metadata.json");
const resolvedArtifactMetadataPath = path.join(dist, "assets/data/resolved-artifact-metadata.json");
const socialPreviewRelativePath = "assets/branding/social-preview.png";
const socialPreviewUrl = "https://dan-beranek.github.io/agentic-entity-resolution-guardrail-planner/" + socialPreviewRelativePath;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const artifactMetadata = JSON.parse(await fs.readFile(artifactMetadataPath, "utf8"));
const registrySource = artifactMetadata.registry_source;
async function loadRegistryResource(filePath, snapshotPath) {
  const url = `https://raw.githubusercontent.com/${registrySource.repository}/${registrySource.ref}/${filePath}`;
  try {
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return { text: await response.text(), fetched_from: url, url };
  } catch (error) {
    const localPath = path.join(root, snapshotPath);
    if (!(await exists(localPath))) throw new Error("Unable to fetch registry " + filePath + " and no snapshot fallback exists: " + error.message);
    return { text: await fs.readFile(localPath, "utf8"), fetched_from: snapshotPath, url };
  }
}

const keywordResource = await loadRegistryResource(registrySource.file, registrySource.snapshot_path);
const worksResource = await loadRegistryResource(registrySource.works_file, registrySource.works_snapshot_path);
const relationsResource = await loadRegistryResource(registrySource.relations_file, registrySource.relations_snapshot_path);
const registryText = keywordResource.text;
const keywordRegistrySha256 = createHash("sha256").update(registryText).digest("hex");
const keywordRegistry = JSON.parse(registryText);
const worksRegistry = JSON.parse(worksResource.text);
const relationsRegistry = JSON.parse(relationsResource.text);
const worksRegistrySha256 = createHash("sha256").update(worksResource.text).digest("hex");
const relationsRegistrySha256 = createHash("sha256").update(relationsResource.text).digest("hex");
if (!Array.isArray(worksRegistry.works) || !worksRegistry.registry_version) throw new Error("The DIO/ODI works registry is malformed.");
if (!Array.isArray(relationsRegistry.relations) || !relationsRegistry.registry_version) throw new Error("The DIO/ODI relations registry is malformed.");
function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value ?? "");
  if (!match) throw new Error("Invalid semantic version in keyword registry: " + value);
  return match.slice(1).map(Number);
}
function compareVersions(left, right) {
  for (let index = 0; index < 3; index++) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}
const registryVersion = parseVersion(keywordRegistry.registry_version);
const minimumRegistryVersion = parseVersion(registrySource.minimum_registry_version);
if (keywordRegistry.status !== registrySource.status_required || registryVersion[0] !== registrySource.compatible_major || compareVersions(registryVersion, minimumRegistryVersion) < 0) {
  throw new Error("Expected canonical-approved keyword registry >=" + registrySource.minimum_registry_version + " within compatible major " + registrySource.compatible_major + "; received " + keywordRegistry.registry_version + " (" + keywordRegistry.status + ").");
}
if (!Array.isArray(artifactMetadata.artifacts) || artifactMetadata.artifacts.length !== 3) {
  throw new Error("Expected exactly three registered public artefacts.");
}

const keywordOrder = keywordRegistry.export_policy?.chunk_order;
if (!Array.isArray(keywordOrder) || keywordOrder.length !== 7) throw new Error("Canonical keyword chunk order is missing or incomplete.");

function resolveCanonicalProfile(profileId, profile, requireAllRationales) {
  if (!profile) throw new Error("Missing keyword profile: " + profileId);
  const selections = profile.chunks ?? {};
  if (selections.C0_identity_invariant !== "all") throw new Error(profileId + ": C0 must be exported in full.");
  const c1 = selections.C1_reconstruction_environments;
  if (!Array.isArray(c1)) throw new Error(profileId + ": C1 must be an explicit ordered subset, never 'all'.");
  const rationale = profile.term_rationales ?? {};
  const resolved = [];
  const byChunk = {};
  const seen = new Set();

  for (const chunkName of keywordOrder) {
    const sourceTerms = keywordRegistry.chunks?.[chunkName]?.terms;
    if (!Array.isArray(sourceTerms)) throw new Error("Canonical chunk " + chunkName + " has no term list.");
    const selected = selections[chunkName];
    let terms;
    if (selected === "all") {
      terms = sourceTerms;
    } else if (selected === "none" || selected === undefined) {
      terms = [];
    } else if (Array.isArray(selected)) {
      terms = selected;
      if (chunkName !== "C2_work_positioning") {
        const positions = terms.map((term) => sourceTerms.indexOf(term));
        if (positions.some((position) => position < 0) || positions.some((position, index) => index > 0 && positions[index - 1] >= position)) {
          throw new Error(profileId + ": " + chunkName + " must be a unique subsequence of the canonical chunk order.");
        }
      } else if (new Set(terms.map((term) => term.toLowerCase())).size !== terms.length) {
        throw new Error(profileId + ": duplicate C2 terms are not permitted.");
      }
    } else {
      throw new Error(profileId + ": invalid selector for " + chunkName + ".");
    }
    byChunk[chunkName] = terms;
    for (const term of terms) {
      const folded = term.toLowerCase();
      if (!seen.has(folded)) { seen.add(folded); resolved.push(term); }
    }
  }

  if (Array.isArray(profile.resolved_keywords) && profile.resolved_keywords.join("\\u0000") !== resolved.join("\\u0000")) {
    throw new Error(profileId + ": resolved_keywords does not match the ordered canonical chunk projection.");
  }
  if (requireAllRationales && profile.resolved_keywords !== undefined) {
    throw new Error(profileId + ": derived surface profiles must generate their keyword sequence from selectors, not store a duplicate resolved list.");
  }
  if (!requireAllRationales && !Array.isArray(profile.resolved_keywords)) {
    throw new Error(profileId + ": canonical work profiles must include a resolved_keywords sequence.");
  }
  const c0 = new Set(keywordRegistry.chunks.C0_identity_invariant.terms);
  const requiredRationales = requireAllRationales ? new Set(resolved.filter((term) => !c0.has(term))) : new Set(c1);
  if (Object.keys(rationale).length !== requiredRationales.size || [...requiredRationales].some((term) => !rationale[term]?.trim())) {
    throw new Error(profileId + ": selected keyword rationale coverage is incomplete.");
  }
  if (Object.keys(rationale).some((term) => !requiredRationales.has(term))) throw new Error(profileId + ": rationale exists for an unselected keyword.");
  if (selections.C4_k6 !== "all" && selections.C4_k6 !== "none") throw new Error(profileId + ": K6 must be complete or absent.");
  return { profile, keywords: resolved, chunks: byChunk };
}

function resolveKeywordProfile(profileId) {
  const profile = keywordRegistry.surface_profiles?.[profileId];
  if (!profile || profile.status !== "canonical-approved") throw new Error("Missing or unapproved keyword surface profile: " + profileId);
  return resolveCanonicalProfile(profileId, profile, true);
}

function resolveWorkKeywordProfile(workId, work) {
  if (work.keyword_profile_status !== "canonical-approved") throw new Error(workId + ": work keyword profile is not canonical-approved.");
  const profileId = work.keyword_profile;
  const profile = keywordRegistry.work_profiles?.[profileId];
  if (!profile) throw new Error(workId + ": missing canonical work keyword profile " + profileId);
  return resolveCanonicalProfile(profileId, profile, false);
}

const resolvedArtifacts = artifactMetadata.artifacts.map((artifact) => {
  if (!artifact.id || !artifact.page || !artifact.url || !artifact.schema_type || !artifact.keyword_profile_id) {
    throw new Error("Each artefact needs id, page, URL, schema type and keyword profile ID.");
  }
  const projection = resolveKeywordProfile(artifact.keyword_profile_id);
  return { ...artifact, keyword_chunks: projection.chunks, keywords: projection.keywords, keyword_rationales: projection.profile.term_rationales };
});

function normalizeWorkIdentifier(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim().replace(/[),.;]+$/, "");
  const doiMatch = trimmed.match(/^(?:https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[^?#\s]+)$/i);
  if (doiMatch) return "doi:" + doiMatch[1].replace(/\/+$/, "").toLowerCase();
  const arxivMatch = trimmed.match(/^(?:https?:\/\/)?arxiv\.org\/abs\/([0-9]+\.[0-9]{4,5}(?:v[0-9]+)?)$/i);
  if (arxivMatch) return "arxiv:" + arxivMatch[1].toLowerCase();
  return trimmed.replace(/\/+$/, "").toLowerCase();
}

function identifiersForWork(work) {
  const values = [
    work.version_doi, work.concept_doi, work.current_version_doi, work.preferred_relation_identifier,
    work.canonical_url, work.endpoint, work.repository, work.reference_vocabulary_uri, work.namespace_document, work.site_homepage,
    work.reference_model_concept_doi, work.reference_model_concept_doi_url,
    work.current_release?.doi, work.current_release?.url,
    work.arxiv?.concept_url, work.arxiv?.version_url, work.arxiv?.pdf_url, work.arxiv?.html_url,
    work.arxiv?.id ? "https://arxiv.org/abs/" + work.arxiv.id : null,
    ...(work.versions ?? []).flatMap((version) => [version.doi, version.url, version.concept_url]),
    ...(work.releases ?? []).flatMap((release) => [release.doi, release.url])
  ];
  return [...new Set(values.map(normalizeWorkIdentifier).filter(Boolean))];
}

const workById = new Map(worksRegistry.works.map((work) => [work.id, work]));
const workIdsByIdentifier = new Map();
for (const work of worksRegistry.works) {
  for (const identifier of identifiersForWork(work)) {
    const owners = workIdsByIdentifier.get(identifier) ?? [];
    if (!owners.includes(work.id)) owners.push(work.id);
    workIdsByIdentifier.set(identifier, owners);
  }
}

function matchRegistryWork(identifier, context) {
  const normalized = normalizeWorkIdentifier(identifier);
  if (!normalized) return null;
  const owners = workIdsByIdentifier.get(normalized) ?? [];
  if (owners.length > 1) throw new Error("Ambiguous DIO/ODI work identifier " + identifier + " in " + context + ": " + owners.join(", "));
  return owners[0] ?? null;
}

function expandDerivedLineage(seedIds) {
  const result = new Set(seedIds);
  const queue = [...seedIds];
  while (queue.length) {
    const current = queue.shift();
    for (const edge of relationsRegistry.relations) {
      if (edge.subject === current && edge.relation === "isDerivedFrom" && workById.has(edge.object) && !result.has(edge.object)) {
        result.add(edge.object);
        queue.push(edge.object);
      }
    }
  }
  return [...result];
}

function resolveWorkIdSet(items, context) {
  const ids = new Set();
  for (const item of items ?? []) {
    const workId = matchRegistryWork(item.id, context);
    if (workId) ids.add(workId);
    else if (/^(?:https?:\\/\\/)?(?:dx\\.)?doi\\.org\\/10\\.|^(?:https?:\\/\\/)?arxiv\\.org\\/abs\\//i.test(item.id)) {
      throw new Error(context + ": external research identifier does not resolve to a DIO/ODI work: " + item.id);
    }
  }
  return ids;
}

const artifactRelations = [];
for (const artifact of resolvedArtifacts) {
  const citationIds = resolveWorkIdSet(artifact.citations, artifact.id + " citations");
  const basedOnIds = resolveWorkIdSet(artifact.based_on, artifact.id + " isBasedOn");
  const technologyIds = new Set();
  for (const technology of artifact.technologies ?? []) {
    const candidate = technology.endpoint ?? technology.url ?? technology.repository;
    const workId = matchRegistryWork(candidate, artifact.id + " technology " + technology.name);
    if (workId) technologyIds.add(workId);
  }
  const runtimeEndpoint = artifact.reference_run?.endpoint;
  const runtimeWorkId = matchRegistryWork(runtimeEndpoint, artifact.id + " reference run");
  if (runtimeWorkId) technologyIds.add(runtimeWorkId);
  const directWorkIds = new Set([...citationIds, ...basedOnIds]);
  const derivedClosure = new Set(expandDerivedLineage([...directWorkIds]));
  const derivedSourceIds = new Set([...derivedClosure].filter((id) => !directWorkIds.has(id)));
  const relatedWorkIds = new Set([...directWorkIds, ...derivedSourceIds, ...technologyIds]);
  artifact.cited_work_ids = [...citationIds];
  artifact.declared_based_on_work_ids = [...basedOnIds];
  artifact.upstream_derivation_work_ids = [...derivedSourceIds];
  artifact.technology_work_ids = [...technologyIds];
  artifact.referenced_work_ids = [...relatedWorkIds];
  artifact.keyword_inheritance = "none";
  for (const id of citationIds) artifactRelations.push({ subject: artifact.id, predicate: "cites", object: id });
  for (const id of basedOnIds) artifactRelations.push({ subject: artifact.id, predicate: "isBasedOn", object: id });
  for (const id of technologyIds) artifactRelations.push({ subject: artifact.id, predicate: "usesTechnology", object: id });
}

const allReferencedWorkIds = new Set(resolvedArtifacts.flatMap((artifact) => artifact.referenced_work_ids));
const referencedBy = new Map();
for (const artifact of resolvedArtifacts) {
  for (const workId of artifact.referenced_work_ids) {
    const ids = referencedBy.get(workId) ?? [];
    ids.push(artifact.id);
    referencedBy.set(workId, ids);
  }
}
const referencedWorkProfiles = [...allReferencedWorkIds].map((workId) => {
  const work = workById.get(workId);
  if (!work) throw new Error("Missing referenced DIO/ODI work: " + workId);
  const projection = resolveWorkKeywordProfile(workId, work);
  return {
    id: workId,
    title: work.title,
    artifact_type: work.type,
    lifecycle_status: work.status ?? work.keyword_profile_status,
    keyword_profile_id: work.keyword_profile,
    referenced_by_artifact_ids: referencedBy.get(workId) ?? [],
    keywords: projection.keywords,
    keyword_chunks: projection.chunks,
    keyword_rationales: projection.profile.term_rationales ?? {},
    source_record: work
  };
});
const referenceRelations = relationsRegistry.relations.filter((edge) => allReferencedWorkIds.has(edge.subject) && allReferencedWorkIds.has(edge.object));

const reconstructionTaxonomyTerms = new Set(keywordRegistry.chunks.C5_failures_robustness.terms.filter((term) => term !== "entity resolution"));
for (const artifact of resolvedArtifacts) {
  const leakedTerms = artifact.keywords.filter((term) => reconstructionTaxonomyTerms.has(term));
  if (leakedTerms.length && artifact.keyword_policy?.allow_reconstruction_taxonomy !== true) {
    throw new Error(artifact.id + ": DIO Reconstruction Failure taxonomy terms require an explicit substantive-coverage exception; found " + leakedTerms.join(", "));
  }
}
if (!referencedWorkProfiles.some((profile) => profile.id === "taxonomic-note" && profile.keywords.includes("Reconstruction Failure Modes"))) {
  throw new Error("The cited Reconstruction Failure Modes taxonomic note must remain independently discoverable with its own canonical keyword profile.");
}

const pages = resolvedArtifacts.map((artifact) => artifact.page);
if (new Set(pages).size !== pages.length || pages.slice().sort().join("|") !== ["demo/index.html","index.html","methodology/index.html"].sort().join("|")) {
  throw new Error("Artifact metadata must cover each public page exactly once.");
}
if (!Array.isArray(config.platforms) || config.platforms.length === 0) {
  throw new Error("Add at least one platform to assets/data/distribution-platforms.json.");
}

const allIds = new Set();
for (const platform of config.platforms) {
  if (!platform.id || allIds.has(platform.id)) {
    throw new Error("Distribution platform IDs must be present and unique.");
  }
  allIds.add(platform.id);
  if (!["available", "planned", "disabled"].includes(platform.availability)) {
    throw new Error("Platform availability must be available, planned or disabled.");
  }
  if (platform.availability === "available") {
    if (platform.affiliate !== true) {
      throw new Error("Every available distribution platform must use an affiliate link.");
    }
    const url = new URL(platform.url);
    if (url.protocol !== "https:") {
      throw new Error("Available platform URLs must use HTTPS.");
    }
    if (!platform.name || !platform.button_label) {
      throw new Error("Available platforms need a name and button label.");
    }
  }
}

const agensi = config.platforms.find((platform) => platform.id === "agensi");
const expectedAgensiUrl = "https://www.agensi.io/r/DANIELBERANEK?to=/skills/agentic-entity-resolution-guardrail-planner";
if (!agensi || agensi.availability !== "available" || agensi.url !== expectedAgensiUrl || agensi.affiliate !== true) {
  throw new Error("Agensi must remain available through the configured affiliate route.");
}

const platforms = config.platforms
  .filter((platform) => platform.availability === "available")
  .sort((a, b) => {
    if (Boolean(a.primary) !== Boolean(b.primary)) return a.primary ? -1 : 1;
    return (a.order ?? 100) - (b.order ?? 100);
  });

if (platforms.length === 0) throw new Error("No available distribution platforms are configured.");

const platformMarkup = platforms.map((platform, index) => {
  const style = index === 0 ? "platform-link-primary" : "platform-link-secondary";
  const aria = "Get Agentic Entity Resolution Guardrail Planner on " + platform.name;
  return '<a class="platform-link ' + style + '" href="' + escapeHtml(platform.url) +
    '" target="_blank" rel="sponsored nofollow noopener noreferrer" aria-label="' + escapeHtml(aria) + '">' +
    escapeHtml(platform.button_label) + ' <span aria-hidden="true">↗</span><span class="platform-name">' +
    escapeHtml(platform.name) + '</span></a>';
}).join("\n");

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

let html = await fs.readFile(path.join(root, "index.html"), "utf8");
const marker = "<!-- PLATFORM_LINKS -->";
const markerCount = html.split(marker).length - 1;
if (markerCount !== 3) {
  throw new Error("Expected exactly three distribution-platform insertion points; found " + markerCount + ".");
}
html = html.split(marker).join(platformMarkup);
if (html.includes(marker)) throw new Error("Unresolved distribution-platform insertion point.");

if (/href=["']https:\/\/www\.agensi\.io\/skills\//i.test(html)) {
  throw new Error("A direct Agensi Skill URL was found. Purchase links must use the affiliate route.");
}
if (/(?:\$|€)\s?\d|(?:USD|EUR|CZK)\s?\d/i.test(html)) {
  throw new Error("A fixed price was found in the product page. Pricing belongs on the distribution platform.");
}
if (!html.includes('rel="sponsored nofollow noopener noreferrer"')) {
  throw new Error("Affiliate links must carry sponsored and safe external-link attributes.");
}

const ctaUrlCount = html.split(expectedAgensiUrl).length - 1;
if (ctaUrlCount !== markerCount) {
  throw new Error("Expected one Agensi affiliate URL per CTA placement; found " + ctaUrlCount + ".");
}

await fs.writeFile(path.join(dist, "index.html"), html, "utf8");
await fs.mkdir(path.join(dist, "methodology"), { recursive: true });
await fs.copyFile(path.join(root, "methodology/index.html"), path.join(dist, "methodology/index.html"));
await fs.cp(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
await fs.cp(path.join(root, "demo-for-agensi"), path.join(dist, "demo-for-agensi"), { recursive: true });
await fs.mkdir(path.join(dist, "demo"), { recursive: true });
await fs.copyFile(path.join(root, "demo/index.html"), path.join(dist, "demo/index.html"));

for (const filename of ["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"]) {
  await fs.copyFile(path.join(root, filename), path.join(dist, filename));
}

const requiredOutputs = [
  "index.html",
  "methodology/index.html",
  "demo/index.html",
  "assets/site.css",
  "assets/site.js",
  "assets/data/distribution-platforms.json",
  "assets/data/artifact-metadata.json",
  "assets/data/keyword-registry.snapshot.json",
  "assets/data/works-registry.snapshot.json",
  "assets/data/relations-registry.snapshot.json",
  "assets/branding/agentic-entity-resolution-guardrail-planner-logo.svg",
  "assets/branding/social-preview.png",
  "assets/diagrams/investigation-workflow.svg",
  "demo-for-agensi/00-README.md",
  "demo-for-agensi/guardrail-spec.json",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt"
];

for (const relativePath of requiredOutputs) {
  if (!(await exists(path.join(dist, relativePath)))) {
    throw new Error("Missing build output: " + relativePath);
  }
}

console.log("Static site built successfully.");
console.log("Available platforms: " + platforms.map((platform) => platform.name).join(", "));
console.log("Affiliate CTA placements: " + markerCount);
console.log("Fixed prices on website: none");

const socialImage = await fs.readFile(path.join(dist, socialPreviewRelativePath));
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (!socialImage.subarray(0, 8).equals(pngSignature) || socialImage.readUInt32BE(16) !== 1200 || socialImage.readUInt32BE(20) !== 630) {
  throw new Error("Social preview must be a valid 1200x630 PNG.");
}
await fs.mkdir(path.dirname(resolvedArtifactMetadataPath), { recursive: true });
const resolvedMetadata = {
  schema_version: "1.1.0",
  registry_source: {
    repository: registrySource.repository,
    discovery: registrySource.registry_discovery,
    keyword_registry: {
      file: registrySource.file,
      fetched_from: keywordResource.fetched_from,
      registry_version: keywordRegistry.registry_version,
      registry_status: keywordRegistry.status,
      sha256: keywordRegistrySha256,
      chunk_order: keywordOrder
    },
    works_registry: {
      file: registrySource.works_file,
      fetched_from: worksResource.fetched_from,
      registry_version: worksRegistry.registry_version,
      registry_status: worksRegistry.status,
      sha256: worksRegistrySha256
    },
    relations_registry: {
      file: registrySource.relations_file,
      fetched_from: relationsResource.fetched_from,
      registry_version: relationsRegistry.registry_version,
      sha256: relationsRegistrySha256
    }
  },
  artifacts: resolvedArtifacts,
  referenced_work_profiles: referencedWorkProfiles,
  artifact_relations: artifactRelations,
  reference_relations: referenceRelations
};
await fs.writeFile(resolvedArtifactMetadataPath, JSON.stringify(resolvedMetadata, null, 2) + "\n", "utf8");
if (!(await exists(resolvedArtifactMetadataPath))) throw new Error("Resolved artifact metadata JSON was not generated.");

const websiteNode = {
  "@type": "WebSite",
  "@id": artifactMetadata.site.id,
  url: artifactMetadata.site.url,
  name: artifactMetadata.site.name,
  inLanguage: artifactMetadata.site.in_language,
  creator: { "@id": artifactMetadata.author.id }
};
const authorNode = {
  "@type": "Person",
  "@id": artifactMetadata.author.id,
  name: artifactMetadata.author.name,
  url: artifactMetadata.author.url,
  sameAs: artifactMetadata.author.same_as
};
const productArtifact = resolvedArtifacts.find((artifact) => artifact.id === "planner-product");
const productNode = {
  "@type": "SoftwareApplication",
  "@id": productArtifact.url + "#product",
  name: productArtifact.name,
  description: productArtifact.description,
  url: productArtifact.url,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Agent Skill — design-time entity-resolution planning",
  operatingSystem: "Compatible AI agent environment",
  softwareVersion: productArtifact.version,
  softwareRequirements: "A compatible AI agent environment that supports Agent Skills. The DIO/ODI Reference MCP connection is optional.",
  isAccessibleForFree: false,
  installUrl: productArtifact.distribution[0].url,
  featureList: productArtifact.features,
  creator: { "@id": artifactMetadata.author.id },
  about: productArtifact.about_concepts.map((id) => ({ "@id": id })),
  isBasedOn: productArtifact.based_on.map((item) => ({ "@id": item.id })),
  citation: productArtifact.citations.map((item) => ({ "@id": item.id })),
  subjectOf: [{ "@id": base + "/methodology/#webpage" }],
  workExample: [{ "@id": base + "/demo/#case-study" }],
  additionalProperty: [
    { "@type": "PropertyValue", propertyID: "artifactRole", name: "Artifact role", value: productArtifact.artifact_role },
    { "@type": "PropertyValue", propertyID: "lifecycleStatus", name: "Lifecycle status", value: productArtifact.lifecycle_status },
    { "@type": "PropertyValue", propertyID: "deliveryFormat", name: "Core delivery format", value: productArtifact.technologies.find((item) => item.name === "Agent Skill").name },
    { "@type": "PropertyValue", propertyID: "optionalIntegration", name: "Optional integration", value: "Model Context Protocol (MCP); public read-only DIO/ODI Reference MCP over Streamable HTTP" },
    { "@type": "PropertyValue", propertyID: "outputFormats", name: "Output formats", value: productArtifact.output_formats.join(", ") },
    { "@type": "PropertyValue", propertyID: "executionBoundary", name: "Execution boundary", value: productArtifact.limitations.join("; ") },
    { "@type": "PropertyValue", propertyID: "keywordProfile", name: "DIO/ODI keyword profile", value: productArtifact.keyword_profile_id }
  ]
};
const referenceNodes = new Map();
const referencedWorkById = new Map(referencedWorkProfiles.map((profile) => [profile.id, profile]));
function schemaTypeForWork(work) {
  if (work.type === "software") return "SoftwareSourceCode";
  if (work.type === "publication-preprint") return "ScholarlyArticle";
  if (work.type === "dataset") return "Dataset";
  if (work.type === "web-publication") return "WebPage";
  return "CreativeWork";
}
for (const profile of referencedWorkProfiles) {
  const work = workById.get(profile.id);
  const uri = canonicalWorkUri(work);
  if (!uri) continue;
  const parents = referenceRelations.filter((edge) => edge.subject === profile.id && edge.relation === "isDerivedFrom")
    .map((edge) => canonicalWorkUri(workById.get(edge.object))).filter(Boolean).map((id) => ({ "@id": id }));
  referenceNodes.set(uri, {
    "@id": uri,
    "@type": schemaTypeForWork(work),
    name: work.title,
    url: uri,
    keywords: profile.keywords,
    isBasedOn: parents,
    additionalProperty: [
      { "@type": "PropertyValue", propertyID: "registryWorkId", name: "DIO/ODI registry work ID", value: profile.id },
      { "@type": "PropertyValue", propertyID: "keywordProfile", name: "DIO/ODI keyword profile", value: profile.keyword_profile_id },
      { "@type": "PropertyValue", propertyID: "artifactType", name: "Artifact type", value: profile.artifact_type },
      { "@type": "PropertyValue", propertyID: "registryStatus", name: "Keyword profile status", value: work.keyword_profile_status }
    ]
  });
}
function canonicalWorkUri(work) {
  const candidate = work.arxiv?.concept_url || work.canonical_url || work.reference_model_concept_doi_url ||
    work.preferred_relation_identifier || work.current_version_doi || work.version_doi || work.concept_doi;
  if (!candidate) return null;
  return /^https?:\/\//i.test(candidate) ? candidate : "https://doi.org/" + candidate;
}
for (const artifact of resolvedArtifacts) {
  for (const item of [...(artifact.citations ?? []), ...(artifact.based_on ?? [])]) {
    if (!referenceNodes.has(item.id)) {
      const workId = matchRegistryWork(item.id, artifact.id + " JSON-LD");
      const workProfile = workId ? referencedWorkById.get(workId) : null;
      const work = workId ? workById.get(workId) : null;
      const parentWorkIds = workId ? referenceRelations
        .filter((edge) => edge.subject === workId && edge.relation === "isDerivedFrom")
        .map((edge) => edge.object) : [];
      const isBasedOn = parentWorkIds.map((id) => canonicalWorkUri(workById.get(id))).filter(Boolean).map((id) => ({ "@id": id }));
      referenceNodes.set(item.id, {
        "@id": item.id,
        "@type": item.type || "CreativeWork",
        name: item.name || work?.title,
        url: item.id,
        ...(workProfile ? { keywords: workProfile.keywords } : {}),
        ...(workId ? {
          isBasedOn,
          additionalProperty: [
            { "@type": "PropertyValue", propertyID: "registryWorkId", name: "DIO/ODI registry work ID", value: workId },
            { "@type": "PropertyValue", propertyID: "keywordProfile", name: "DIO/ODI keyword profile", value: workProfile.keyword_profile_id },
            { "@type": "PropertyValue", propertyID: "artifactType", name: "Artifact type", value: workProfile.artifact_type }
          ]
        } : {})
      });
    }
  }
}
const graphFor = (artifact) => {
  const pageId = artifact.url + "#webpage";
  const isDemo = artifact.id === "planner-demo";
  const isProduct = artifact.id === "planner-product";
  const pageNode = {
    "@type": isDemo ? ["WebPage", "TechArticle"] : "WebPage",
    "@id": pageId,
    url: artifact.url,
    name: artifact.name,
    description: artifact.description,
    inLanguage: "en",
    isPartOf: { "@id": artifactMetadata.site.id },
    creator: { "@id": artifactMetadata.author.id },
    keywords: artifact.keywords,
    about: artifact.about_concepts.map((id) => ({ "@id": id })),
    citation: (artifact.citations ?? []).map((item) => ({ "@id": item.id })),
    isBasedOn: (artifact.based_on ?? []).map((item) => ({ "@id": item.id })),
    mentions: (artifact.technology_work_ids ?? []).map((id) => canonicalWorkUri(workById.get(id))).filter(Boolean).map((id) => ({ "@id": id })),
    additionalProperty: [
      { "@type": "PropertyValue", propertyID: "artifactRole", name: "Artifact role", value: artifact.artifact_role },
      { "@type": "PropertyValue", propertyID: "lifecycleStatus", name: "Lifecycle status", value: artifact.lifecycle_status },
      { "@type": "PropertyValue", propertyID: "keywordProfile", name: "DIO/ODI keyword profile", value: artifact.keyword_profile_id },
      { "@type": "PropertyValue", propertyID: "keywordRegistryVersion", name: "Keyword registry version", value: keywordRegistry.registry_version },
      { "@type": "PropertyValue", propertyID: "keywordRegistrySha256", name: "Keyword registry SHA-256", value: keywordRegistrySha256 },
      ...(artifact.technologies ?? []).map((technology) => ({
        "@type": "PropertyValue",
        propertyID: "technology",
        name: technology.name,
        value: [technology.role, technology.status, technology.endpoint, technology.transport, technology.formats?.join(", ")].filter(Boolean).join("; ")
      })),
      ...(artifact.output_formats ?? []).map((format) => ({
        "@type": "PropertyValue", propertyID: "outputFormat", name: "Output format", value: format
      }))
    ]
  };
  if (isProduct) pageNode.mainEntity = { "@id": productArtifact.url + "#product" };
  else if (isDemo) pageNode.mainEntity = { "@id": artifact.url + "#case-study" };
  else pageNode.mainEntity = { "@id": productArtifact.url + "#product" };

  const extraNodes = [];
  if (isDemo) {
    extraNodes.push({
      "@type": "TechArticle",
      "@id": artifact.url + "#case-study",
      name: artifact.name,
      description: artifact.description,
      url: artifact.url,
      version: artifact.generated_with.version,
      isBasedOn: artifact.based_on.map((item) => ({ "@id": item.id })),
      about: artifact.about_concepts.map((id) => ({ "@id": id })),
      encodingFormat: artifact.output_formats,
      hasPart: artifact.deliverables.map((item) => ({
        "@type": "CreativeWork",
        "@id": artifact.url + "#" + item.id,
        name: item.name,
        url: base + "/" + item.path,
        encodingFormat: item.format
      })),
      additionalProperty: [
        { "@type": "PropertyValue", propertyID: "generatedWith", name: "Generating Skill version", value: artifact.generated_with.version },
        { "@type": "PropertyValue", propertyID: "referenceMode", name: "Reference mode", value: artifact.reference_run.mode },
        { "@type": "PropertyValue", propertyID: "referenceStack", name: "Reference stack", value: "DIO/ODI MCP " + artifact.reference_run.mcp_server + "; Reference Model " + artifact.reference_run.reference_model_version + "; Reference Vocabulary " + artifact.reference_run.reference_vocabulary_version + "; Agentic ER mapping " + artifact.reference_run.agentic_er_mapping_version },
        { "@type": "PropertyValue", propertyID: "implementationReady", name: "Implementation readiness", value: String(artifact.validation.implementation_ready) },
        { "@type": "PropertyValue", propertyID: "proposedTests", name: "Proposed test scenarios (not executed)", value: String(artifact.validation.proposed_test_scenarios) },
        { "@type": "PropertyValue", propertyID: "blockingCustomerDecisions", name: "Blocking customer decisions", value: String(artifact.validation.customer_decisions_blocking) }
      ]
    });
  }
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode, authorNode, productNode, pageNode, ...extraNodes, ...referenceNodes.values()]
  };
};

for (const artifact of resolvedArtifacts) {
  const target = path.join(dist, artifact.page);
  let pageHtml = await fs.readFile(target, "utf8");
  const keywordMarker = "<!-- DIO_KEYWORD_METADATA -->";
  const structuredMarker = "<!-- ARTIFACT_STRUCTURED_DATA -->";
  if (pageHtml.split(keywordMarker).length - 1 !== 1) throw new Error("Expected exactly one DIO keyword metadata marker in " + artifact.page);
  if (pageHtml.split(structuredMarker).length - 1 !== 1) throw new Error("Expected exactly one structured-data marker in " + artifact.page);
  const keywordMarkup = [
    "<!-- Generated from the canonical DIO/ODI keyword registry; do not edit manually. -->",
    '<meta name="keywords" content="' + escapeHtml(artifact.keywords.join(", ")) + '">',
    '<meta name="dio-odi-keyword-profile" content="' + escapeHtml(artifact.keyword_profile_id) + '">',
    '<meta name="dio-odi-keyword-registry-version" content="' + escapeHtml(keywordRegistry.registry_version) + '">',
    '<meta name="dio-odi-keyword-registry-sha256" content="' + keywordRegistrySha256 + '">'
  ].join("\n  ");
  const jsonLd = "<script type=\"application/ld+json\">\n" +
    JSON.stringify(graphFor(artifact), null, 2).replaceAll("<", "\\u003c") +
    "\n</script>";
  pageHtml = pageHtml.replace(keywordMarker, keywordMarkup).replace(structuredMarker, jsonLd);
  const expectedKeywords = artifact.keywords.join(", ");
  const keywordMatch = pageHtml.match(/<meta name="keywords" content="([^"]*)">/);
  if (!keywordMatch || keywordMatch[1] !== expectedKeywords) throw new Error("Generated keyword sequence mismatch in " + artifact.page);
  if (!pageHtml.includes('<meta name="dio-odi-keyword-profile" content="' + artifact.keyword_profile_id + '">')) throw new Error("Missing object-specific keyword profile in " + artifact.page);
  if (!pageHtml.includes('application/ld+json')) throw new Error("Missing JSON-LD output in " + artifact.page);
  for (const marker of [
    '<meta property="og:image" content="' + socialPreviewUrl + '">',
    '<meta name="twitter:image" content="' + socialPreviewUrl + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">'
  ]) if (!pageHtml.includes(marker)) throw new Error("Missing required social metadata marker in " + artifact.page + ": " + marker);
  await fs.writeFile(target, pageHtml, "utf8");
}
console.log("Social preview: 1200x630 PNG, referenced by Open Graph and Twitter metadata on all pages.");
console.log("DIO/ODI Keywords: " + resolvedArtifacts.map((artifact) => artifact.keyword_profile_id + "=" + artifact.keywords.length).join("; ") + " (registry " + keywordRegistry.registry_version + ").");
console.log("Referenced DIO/ODI work profiles: " + referencedWorkProfiles.length + "; artefact relations: " + artifactRelations.length + "; work relations: " + referenceRelations.length + ".");
console.log("Machine-readable artifact metadata: assets/data/resolved-artifact-metadata.json.");
console.log("Output directory: " + dist);
