import { existsSync } from "node:fs";
import { approvedProjectShowcases, getApprovedProjectShowcase } from "../src/data/approvedProjectShowcases.ts";
import { projectFacts } from "../src/data/facts/projects.ts";
import { techCatalog } from "../src/data/facts/techCatalog.ts";
import { projectStories } from "../src/data/projectStories.ts";

const failures = [];
const privateRepositories = new Set(["Gnaroshi/gnaroshi-studio", "Gnaroshi/runshelf", "Gnaroshi/tr-gpu-monitor"]);
const productStatuses = new Set(["prototype", "in-development", "usable-locally", "released", "archived"]);
const integrationStatuses = new Set(["not-planned", "planned", "in-review", "available"]);
const nonEmpty = (value) => typeof value === "string" && value.trim().length > 0;

for (const project of projectFacts) {
  const stories = [projectStories.en[project.id], projectStories.ko[project.id]];
  if (!stories.every(Boolean)) failures.push(`${project.id}: missing EN/KO story`);
  for (const [index, story] of stories.entries()) {
    const locale = index === 0 ? "en" : "ko";
    if (!story || !nonEmpty(story.cardSummary) || !nonEmpty(story.heroSummary)) failures.push(`${project.id}/${locale}: missing card or hero summary`);
    if (!nonEmpty(story?.privacySummary) || !story?.currentLimitations?.length) failures.push(`${project.id}/${locale}: missing privacy summary or limitations`);
    if (!story?.scenario || story.scenario.steps.length < 3 || story.scenario.steps.length > 5) failures.push(`${project.id}/${locale}: scenario must contain 3-5 steps`);
    if (project.scenario.usesDemoData && !nonEmpty(story?.scenario?.demoDisclosure)) failures.push(`${project.id}/${locale}: demo disclosure missing`);
  }

  if (!productStatuses.has(project.productStatus) || project.platforms.length === 0 || project.techStack.length < 3) failures.push(`${project.id}: incomplete product facts`);
  for (const techId of project.techStack) if (!techCatalog[techId]?.source) failures.push(`${project.id}: unverified technology ${techId}`);
  for (const link of project.links) {
    for (const repository of privateRepositories) if (link.href.toLowerCase().includes(repository.toLowerCase())) failures.push(`${project.id}: private repository URL is public`);
  }

  if (project.kind === "application") {
    if (!integrationStatuses.has(project.studioIntegrationStatus)) failures.push(`${project.id}: invalid Studio integration status`);
    if (!/^[0-9a-f]{40}$/.test(project.sourceCommit)) failures.push(`${project.id}: missing full source commit`);
    if (!project.sourceRepository) failures.push(`${project.id}: source provenance missing`);
    const primary = getApprovedProjectShowcase(project.primaryShowcaseId);
    if (!primary && !project.textOnlyExemption) failures.push(`${project.id}: primary approved screenshot missing`);
    if (primary && (primary.applicationId !== project.id || primary.sourceApplicationCommit !== project.sourceCommit)) failures.push(`${project.id}: primary screenshot provenance mismatch`);
    if (project.studioIntegrationStatus === project.productStatus) failures.push(`${project.id}: product and Studio integration status are conflated`);
  }
}

const ids = new Set();
for (const asset of approvedProjectShowcases) {
  if (ids.has(asset.id)) failures.push(`${asset.id}: duplicate approved screenshot ID`);
  ids.add(asset.id);
  if (asset.approval !== "owner-approved" || !asset.privacyReviewed) failures.push(`${asset.id}: approval or privacy review missing`);
  if (asset.usesDemoData && (!nonEmpty(asset.demoDisclosure.en) || !nonEmpty(asset.demoDisclosure.ko))) failures.push(`${asset.id}: demo disclosure missing`);
  for (const width of asset.widths) for (const format of ["avif", "webp"]) {
    if (!existsSync(`public/media/approved/${asset.id}-${width}.${format}`)) failures.push(`${asset.id}: missing ${width}px ${format}`);
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[project-readiness] ${failure}`));
  process.exit(1);
}

console.log(`[project-readiness] passed (${projectFacts.length} projects, ${approvedProjectShowcases.length} approved screenshots)`);
