#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const failures = [];
const warnings = [];
const today = new Date();
const todayKey = today.toISOString().slice(0, 10);
const DAY_MS = 86_400_000;

const { profileFacts } = await loadExports("src/data/facts/profile.ts");
const { projectFacts } = await loadExports("src/data/facts/projects.ts");
const { researchFacts, currentFocusFact } = await loadExports("src/data/facts/research.ts");
const { enCopy } = await loadExports("src/data/locales/en.ts");
const { koCopy } = await loadExports("src/data/locales/ko.ts");

const projectIds = projectFacts.map((project) => project.id);
const researchIds = researchFacts.map((area) => area.id);
checkUnique(projectIds, "project ID");
checkKeyParity(projectIds, enCopy.projects, koCopy.projects, "project");
checkKeyParity(researchIds, enCopy.researchAreas, koCopy.researchAreas, "research area");

for (const project of projectFacts) {
  checkDate(project.updatedAt, `project ${project.id} updatedAt`);
  for (const locale of ["en", "ko"]) {
    const copy = locale === "en" ? enCopy.projects[project.id] : koCopy.projects[project.id];
    for (const field of ["title", "summary", "problem", "currentState"]) {
      if (!copy?.[field]?.trim()) failures.push(`${locale} project ${project.id}: empty ${field}`);
    }
    for (const link of project.links) {
      if (!copy?.linkLabels?.[link.id]?.trim()) failures.push(`${locale} project ${project.id}: missing label for ${link.id}`);
    }
  }
  for (const link of project.links) {
    try {
      const url = new URL(link.href);
      if (!/^https?:$/.test(url.protocol)) throw new Error("unsupported protocol");
    } catch {
      failures.push(`project ${project.id}: broken link ${JSON.stringify(link.href)}`);
    }
  }
}

if (!profileFacts.links.email) warnings.push("No public email is configured; the field remains hidden.");
if (!profileFacts.profileImage) warnings.push("No profile image is configured; the monogram remains in use.");
if (!profileFacts.links.scholar) warnings.push("No Scholar link is configured; the field remains hidden.");

checkDate(currentFocusFact.lastUpdated, "current focus lastUpdated");
const focusAge = dateAgeDays(currentFocusFact.lastUpdated);
if (focusAge > 45) warnings.push(`Current focus is ${focusAge} days old and is hidden from Home.`);
if (focusAge < 0) failures.push(`current focus lastUpdated is in the future: ${currentFocusFact.lastUpdated}`);
if (koCopy.copyUpdatedAt < enCopy.copyUpdatedAt) warnings.push(`Korean copy (${koCopy.copyUpdatedAt}) is older than English copy (${enCopy.copyUpdatedAt}).`);

const publicRoots = ["src/components", "src/data", "src/i18n", "src/layouts", "src/pages", "src/views"];
const publicFiles = (await Promise.all(publicRoots.map((path) => filesUnder(resolve(root, path))))).flat()
  .filter((path) => !path.includes("/_template.") && /\.(?:astro|ts|tsx|md|mdx)$/.test(path));
const forbidden = [
  ["placeholder", /\bplaceholder\b/i],
  ["TODO", /\bTODO\b/],
  ["to be updated", /\bto be updated\b/i],
  ["editable in src", /\beditable in src\b/i],
  ["fake example marker", /\b(?:sample|example)\s*:/i],
  ["unsupported factual claim marker", /\[(?:unsupported|unverified)(?:-claim)?\]|CLAIM_UNVERIFIED/i],
  ["private user path", /(?:^|[\s"'=(])\/(?:Users|home)\/[A-Za-z0-9._-]+/m]
];

for (const file of publicFiles) {
  const source = await readFile(file, "utf8");
  for (const [label, pattern] of forbidden) {
    if (pattern.test(source)) failures.push(`${relative(root, file)}: ${label}`);
  }
}

const feedRoot = resolve(process.env.CONTENT_FEED_PATH || join(root, ".content-feed"));
const feedPapers = await filesUnder(join(feedRoot, "papers"));
const substantivePapers = [];
for (const file of feedPapers.filter((path) => /\.(?:md|mdx)$/.test(path))) {
  const source = await readFile(file, "utf8");
  if (/^contentStage:\s*["']?substantive["']?\s*$/m.test(source)) substantivePapers.push(file);
  for (const match of source.matchAll(/^(?:publishDate|updatedDate|readDate|date):\s*["']?(\d{4}-\d{2}-\d{2})/gm)) {
    checkDate(match[1], `${relative(root, file)} date`);
  }
}
if (substantivePapers.length === 0) warnings.push("No substantive public paper note exists; the homepage paper section remains hidden.");

if (failures.length) {
  console.error("Launch content check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
}
if (warnings.length) {
  console.warn("Launch content warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}
if (failures.length) process.exit(1);
console.log(`Launch content check passed (${projectFacts.length} projects, ${researchFacts.length} research areas, ${publicFiles.length} public source files).`);

function checkUnique(values, label) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  for (const value of new Set(duplicates)) failures.push(`duplicate ${label}: ${value}`);
}

function checkKeyParity(ids, en, ko, label) {
  const expected = [...ids].sort().join("|");
  for (const [locale, values] of [["en", en], ["ko", ko]]) {
    const actual = Object.keys(values).sort().join("|");
    if (actual !== expected) failures.push(`${locale} ${label} IDs do not match facts: expected ${expected}, received ${actual}`);
  }
}

function checkDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))) {
    failures.push(`${label}: invalid date ${JSON.stringify(value)}`);
  } else if (value > todayKey) {
    failures.push(`${label}: future date ${value}`);
  }
}

function dateAgeDays(value) {
  const updated = Date.parse(`${value}T00:00:00.000Z`);
  const current = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.floor((current - updated) / DAY_MS);
}

async function filesUnder(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    }));
    return nested.flat();
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

async function loadExports(path) {
  const source = await readFile(resolve(root, path), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}
