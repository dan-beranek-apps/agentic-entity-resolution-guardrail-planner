import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const configPath = path.join(root, "assets/data/distribution-platforms.json");

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
await fs.cp(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
await fs.cp(path.join(root, "demo-for-agensi"), path.join(dist, "demo-for-agensi"), { recursive: true });
await fs.mkdir(path.join(dist, "demo"), { recursive: true });
await fs.copyFile(path.join(root, "demo/index.html"), path.join(dist, "demo/index.html"));

for (const filename of ["robots.txt", "sitemap.xml", "llms.txt"]) {
  await fs.copyFile(path.join(root, filename), path.join(dist, filename));
}

const requiredOutputs = [
  "index.html",
  "demo/index.html",
  "assets/site.css",
  "assets/site.js",
  "assets/data/distribution-platforms.json",
  "assets/branding/agentic-entity-resolution-guardrail-planner-logo.svg",
  "assets/diagrams/investigation-workflow.svg",
  "demo-for-agensi/00-README.md",
  "demo-for-agensi/guardrail-spec.json",
  "robots.txt",
  "sitemap.xml",
  "llms.txt"
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
console.log("Output directory: " + dist);
