import { projectFacts } from "../src/data/facts/projects.ts";
import { projectStories } from "../src/data/projectStories.ts";

const expectedIds = ["gnaroshi-vla","gnaroshi-dev","gnaroshi-studio","paperflow","arxiv-discovery","runshelf","tr-gpu-monitor","contentdeck"];
const failures = [];
const warnings = [];
const sentenceCount = (value) => value.split(/[.!?]+(?:\s|$)/).filter((part) => part.trim()).length;
const present = (value) => typeof value === "string" && value.trim().length > 0;

if (projectFacts.map((project) => project.id).join("|") !== expectedIds.join("|")) failures.push("projectFacts must contain exactly the eight registered projects in portfolio order");

for (const project of projectFacts) {
  if (!project.platforms.length) failures.push(`${project.id}: platforms must not be empty`);
  if (!project.techStack.length) failures.push(`${project.id}: verified tech stack must not be empty`);
  if (project.scenario.stepIds.length < 3 || project.scenario.stepIds.length > 5) failures.push(`${project.id}: fact scenario must contain 3-5 steps`);
  for (const locale of ["en","ko"]) {
    const story = projectStories[locale][project.id];
    const prefix = `${project.id}/${locale}`;
    for (const field of ["cardSummary","heroSummary","overview","audience","primaryUse","privacySummary","currentState"]) if (!present(story[field])) failures.push(`${prefix}: ${field} is required`);
    if (sentenceCount(story.cardSummary) !== 1) failures.push(`${prefix}: cardSummary must be one sentence`);
    if (sentenceCount(story.heroSummary) > 2) failures.push(`${prefix}: heroSummary must be at most two sentences`);
    if (story.scenario.steps.length < 3 || story.scenario.steps.length > 5) failures.push(`${prefix}: scenario must contain 3-5 steps`);
    if (story.keyFeatures.length < 3 || story.keyFeatures.length > 6) failures.push(`${prefix}: keyFeatures must contain 3-6 items`);
    if (["prototype","working","active-development"].includes(project.productStatus) && story.currentLimitations.length === 0) failures.push(`${prefix}: current limitations are required for unfinished work`);
    if (project.scenario.usesDemoData && !present(story.scenario.demoDisclosure)) failures.push(`${prefix}: demo scenario disclosure is required`);
    if (story.scenario.steps.map((step) => step.id).join("|") !== project.scenario.stepIds.join("|")) failures.push(`${prefix}: localized scenario step IDs drifted from shared facts`);
    if (!present(story.overview) || !present(story.primaryUse) || story.keyFeatures.length === 0) failures.push(`${prefix}: public copy cannot contain only architecture or integration detail`);
    const length = [...story.cardSummary].length;
    if (locale === "en" && (length < 90 || length > 160)) warnings.push(`${prefix}: English cardSummary is ${length} characters; practical target is 90-160`);
    if (locale === "ko" && (length < 45 || length > 90)) warnings.push(`${prefix}: Korean cardSummary is ${length} characters; practical target is 45-90`);
  }
}

warnings.forEach((warning) => console.warn(`[project-copy] warning: ${warning}`));
if (failures.length) {
  failures.forEach((failure) => console.error(`[project-copy] ${failure}`));
  process.exit(1);
}
console.log(`[project-copy] passed (${projectFacts.length} projects, ${warnings.length} advisory length warnings)`);
