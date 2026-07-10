#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentRoot = join(root, "src", "content");
const generatedRoot = join(root, "src", "generated");
const distRoot = join(root, "dist");
const gates = {
  events: 5,
  dates: 3,
  categories: 2,
  core: new Set(["reading", "retrieval", "revisit", "implementation"]),
  weeklyEvents: 2,
  graphNodes: 5,
  graphEdges: 3
};
const defaultEligibility = {
  blog: true,
  papers: true,
  projects: true,
  implementations: true,
  queue: false
};
const failures = [];
const warnings = [];
const records = [];

for (const collection of Object.keys(defaultEligibility)) {
  const directory = join(contentRoot, collection);
  if (!existsSync(directory)) continue;
  for (const file of listFiles(directory).filter((item) => [".md", ".mdx"].includes(extname(item)))) {
    const parsed = matter(readFileSync(file, "utf8"));
    const data = parsed.data;
    const record = {
      collection,
      file,
      slug: basename(file, extname(file)),
      data,
      eligibility: {
        metricEligible: data.metricEligible ?? defaultEligibility[collection],
        graphEligible: data.graphEligible ?? defaultEligibility[collection],
        weeklyReviewEligible: data.weeklyReviewEligible ?? defaultEligibility[collection]
      }
    };
    records.push(record);
    validateRecord(record);
  }
}

const publicMetricRecords = records.filter((record) =>
  record.eligibility.metricEligible &&
  record.data.contentStage !== "seed" &&
  (record.data.visibility ?? "public") === "public" &&
  record.data.draft !== true &&
  !basename(record.file).startsWith("_")
);
const events = buildEvidenceEvents(publicMetricRecords);
const dates = new Set(events.map((event) => event.date));
const categories = new Set(events.map((event) => event.category));
const hasCore = [...categories].some((category) => gates.core.has(category));
const scoreEligible = events.length >= gates.events && dates.size >= gates.dates && categories.size >= gates.categories && hasCore;

validateWeeklyReviews();
validateResearchGraph(records);
validateBuiltScore(scoreEligible);
checkNowFreshness();

if (failures.length > 0) {
  console.error("Content metric integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

for (const warning of warnings) console.warn(`Warning: ${warning}`);
console.log(
  `Content metric integrity check passed (${events.length} meaningful event(s), ${dates.size} active date(s), ` +
  `${categories.size} categor${categories.size === 1 ? "y" : "ies"}; public score ${scoreEligible ? "eligible" : "gated"}).`
);

function validateRecord(record) {
  const rel = relative(root, record.file);
  const flags = Object.entries(record.eligibility).filter(([, value]) => value).map(([key]) => key);
  const systemLike = /(^_|example|sample|demo|template|untitled)/i.test(record.slug) || record.data.contentStage === "seed";
  if (systemLike && flags.length > 0) failures.push(`${rel}: seed/system content enables ${flags.join(", ")}`);
  if ((record.data.visibility === "hidden" || record.data.visibility === "unlisted") && flags.length > 0) {
    failures.push(`${rel}: non-public content enables ${flags.join(", ")}`);
  }
}

function buildEvidenceEvents(items) {
  const events = [];
  for (const item of items) {
    if (item.collection === "papers" && item.data.readDate && !["planned", "abandoned"].includes(item.data.status)) {
      events.push({ category: "reading", date: dateKey(item.data.readDate) });
    }
    if (item.collection === "blog" && item.data.pubDate) events.push({ category: "writing", date: dateKey(item.data.pubDate) });
    if (item.collection === "implementations" && item.data.date && !["planned", "abandoned"].includes(item.data.status)) {
      events.push({ category: "implementation", date: dateKey(item.data.date) });
    }
  }
  return events.filter((event) => /^\d{4}-\d{2}-\d{2}$/.test(event.date));
}

function validateWeeklyReviews() {
  const directory = join(generatedRoot, "weekly-reviews");
  if (!existsSync(directory)) return;
  for (const file of listFiles(directory).filter((item) => extname(item) === ".json")) {
    const review = JSON.parse(readFileSync(file, "utf8"));
    if ((review.visibility ?? "public") !== "public") continue;
    const count = Number(review.meaningfulEventCount ?? 0);
    if (review.status === "complete" && count < gates.weeklyEvents) {
      failures.push(`${relative(root, file)}: completed public week has only ${count} meaningful event(s)`);
    }
    if (count === 0 && (review.metricEligible || review.graphEligible || review.weeklyReviewEligible)) {
      failures.push(`${relative(root, file)}: zero-evidence week is publicly eligible`);
    }
    if (review.status === "in-progress" && (review.strongestDimension || review.weakestDimension)) {
      failures.push(`${relative(root, file)}: in-progress week declares strongest/weakest dimensions`);
    }
  }
}

function validateResearchGraph(contentRecords) {
  const file = join(generatedRoot, "research-graph.json");
  if (!existsSync(file)) return;
  const graph = JSON.parse(readFileSync(file, "utf8"));
  const sourceEligibility = new Map(contentRecords.map((record) => [relative(root, record.file), record]));
  for (const node of graph.nodes ?? []) {
    const record = sourceEligibility.get(node.source);
    if (!record) continue;
    if (!record.eligibility.graphEligible || record.data.contentStage === "seed" || (record.data.visibility ?? "public") !== "public") {
      failures.push(`${relative(root, file)}: graph includes ineligible source ${node.source}`);
    }
  }
  const meaningfulNodes = Number(graph.stats?.meaningfulNodeCount ?? 0);
  const nonTagEdges = Number(graph.stats?.nonTagEdgeCount ?? 0);
  if (graph.eligible && (meaningfulNodes < gates.graphNodes || nonTagEdges < gates.graphEdges)) {
    failures.push(`${relative(root, file)}: graph is eligible with ${meaningfulNodes} meaningful nodes and ${nonTagEdges} non-tag edges`);
  }
}

function validateBuiltScore(scoreEligible) {
  if (!existsSync(distRoot) || scoreEligible) return;
  for (const route of ["index.html", join("growth", "index.html")]) {
    const file = join(distRoot, route);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, "utf8");
    if (!html.includes("Collecting evidence")) failures.push(`${relative(root, file)}: missing evidence collection state`);
    if (html.includes("momentum-score__value")) failures.push(`${relative(root, file)}: exposes a numeric Momentum score before eligibility`);
  }
}

function checkNowFreshness() {
  const file = join(root, "src", "data", "now.ts");
  if (!existsSync(file)) return;
  const match = readFileSync(file, "utf8").match(/lastUpdated:\s*["'](\d{4}-\d{2}-\d{2})["']/);
  if (!match) {
    warnings.push("src/data/now.ts has no parseable lastUpdated date");
    return;
  }
  const age = Math.floor((Date.now() - Date.parse(`${match[1]}T00:00:00Z`)) / 86_400_000);
  if (age > 45) warnings.push(`Now page is stale: lastUpdated is ${match[1]} (${age} days ago)`);
}

function dateKey(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function listFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const target = join(directory, entry);
    if (statSync(target).isDirectory()) files.push(...listFiles(target));
    else files.push(target);
  }
  return files;
}
