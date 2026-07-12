import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { extname, resolve } from "node:path";
import sharp from "sharp";
import { approvedMediaCandidateIds, candidatePassesThreshold, mediaReviewCandidates, totalSemanticScore } from "../src/data/mediaReview.ts";
import { approvedProjectShowcases } from "../src/data/approvedProjectShowcases.ts";

const failures = [];

const candidateIds = new Set();
for (const candidate of mediaReviewCandidates) {
  if (candidateIds.has(candidate.id)) failures.push(`duplicate candidate ID: ${candidate.id}`);
  candidateIds.add(candidate.id);
  if (!candidate.category) failures.push(`${candidate.id}: missing media category`);
  for (const [dimension, value] of Object.entries(candidate.score)) {
    if (!Number.isInteger(value) || value < 0 || value > 5) failures.push(`${candidate.id}: invalid ${dimension} score ${value}`);
  }
  const shouldPass = candidate.score.semanticClarity >= 4 && candidate.score.pageRelevance >= 4 && candidate.score.credibility >= 4 && totalSemanticScore(candidate.score) >= 25;
  if (candidatePassesThreshold(candidate) !== shouldPass) failures.push(`${candidate.id}: threshold calculation drift`);
}

for (const id of approvedMediaCandidateIds) {
  const candidate = mediaReviewCandidates.find((item) => item.id === id);
  if (!candidate) failures.push(`approved candidate is missing from review registry: ${id}`);
  else if (!candidatePassesThreshold(candidate)) failures.push(`approved candidate does not pass the semantic threshold: ${id}`);
}

async function walk(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const expected = [
  ...["a", "b", "c"].map((suffix) => ({ path: `media-sources/candidates/home-hero-${suffix}.webp`, width: 2000, height: 1600 })),
  ...["a", "b", "c"].map((suffix) => ({ path: `media-sources/candidates/research-vla-${suffix}.webp`, width: 1600, height: 1200 })),
  ...["efficient-execution-en", "efficient-execution-ko", "research-workflow-en", "research-workflow-ko"].flatMap((id) => ["png", "avif", "webp"].map((format) => ({ path: `media-sources/exports/${id}.${format}`, width: 1600, height: 1200 }))),
  ...["project-gnaroshi-vla", "project-gnaroshi-dev"].flatMap((id) => ["png", "avif", "webp"].map((format) => ({ path: `media-sources/exports/${id}.${format}`, width: 1600, height: 1000 })))
];

const approvedOutputs = [
  { id: "home-research-workspace", ratio: 5 / 4 },
  { id: "research-vla-task", ratio: 4 / 3 },
  { id: "efficient-execution-en", ratio: 4 / 3 },
  { id: "efficient-execution-ko", ratio: 4 / 3 },
  { id: "research-workflow-en", ratio: 4 / 3 },
  { id: "research-workflow-ko", ratio: 4 / 3 },
  { id: "project-gnaroshi-vla", ratio: 16 / 10 },
  { id: "project-gnaroshi-dev", ratio: 16 / 10 }
].flatMap((asset) => [640, 1200, 1600].flatMap((width) => ["avif", "webp"].map((format) => ({ ...asset, width, format }))));

approvedOutputs.push(...approvedProjectShowcases.flatMap((asset) => asset.widths.flatMap((width) => ["avif", "webp"].map((format) => ({ id: asset.id, ratio: asset.width / asset.height, width, format })))));

for (const item of expected) {
  if (!existsSync(item.path)) {
    failures.push(`missing candidate output: ${item.path}`);
    continue;
  }
  const metadata = await sharp(item.path).metadata();
  if (metadata.width !== item.width || metadata.height !== item.height) failures.push(`${item.path}: expected ${item.width}x${item.height}, found ${metadata.width}x${metadata.height}`);
}

for (const item of approvedOutputs) {
  const path = `public/media/approved/${item.id}-${item.width}.${item.format}`;
  if (!existsSync(path)) {
    failures.push(`missing approved production asset: ${path}`);
    continue;
  }
  const metadata = await sharp(path).metadata();
  const expectedHeight = Math.round(item.width / item.ratio);
  if (metadata.width !== item.width || metadata.height !== expectedHeight) failures.push(`${path}: expected ${item.width}x${expectedHeight}, found ${metadata.width}x${metadata.height}`);
}

for (const sheet of ["home-hero", "research-vla", "technical-diagrams", "project-evidence"]) {
  if (!existsSync(`media-sources/contact-sheets/${sheet}.png`)) failures.push(`missing contact sheet: ${sheet}`);
}

for (const source of [
  "media-sources/diagrams/efficient-execution.html",
  "media-sources/diagrams/research-workflow.html",
  "media-sources/project-evidence/gnaroshi-vla.html",
  "media-sources/project-evidence/gnaroshi-dev.html"
]) {
  if (!existsSync(source)) failures.push(`missing editable source: ${source}`);
}

const productionSources = (await walk("src")).filter((path) => [".astro", ".ts", ".tsx", ".css"].includes(extname(path)) && !path.endsWith("mediaManifest.ts") && !path.includes("/dev/media-review/") && !path.endsWith("mediaReview.ts"));
const productionText = (await Promise.all(productionSources.map((path) => readFile(path, "utf8")))).join("\n");
for (const path of [
  "/media/home-research-constellation-",
  "/media/research-vla.svg",
  "/media/research-efficient-systems.svg",
  "/media/research-workflow.svg",
  "/media/project-gnaroshi-dev.svg",
  "/media/paper-lab-cycle.svg",
  "/media/growth-evidence.svg"
]) {
  if (productionText.includes(path)) failures.push(`legacy ambiguous media remains referenced by production source: ${path}`);
}

const distFiles = await walk("dist/dev/media-review");
if (distFiles.length) failures.push(`development media review emitted ${distFiles.length} production files`);

const evidenceText = (await Promise.all((await walk("media-sources/evidence")).filter((path) => extname(path) !== ".png").map((path) => readFile(path, "utf8")))).join("\n");
for (const pattern of [/\/Users\//, /\/home\/[^\[]/, /ghp_[A-Za-z0-9]+/, /sk-[A-Za-z0-9]+/]) {
  if (pattern.test(evidenceText)) failures.push(`evidence source contains a forbidden private pattern: ${pattern}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[media:check] ${failure}`));
  process.exit(1);
}

console.log(`[media:check] passed (${expected.length} review outputs, ${approvedOutputs.length} approved production outputs, ${productionSources.length} production source files scanned)`);
