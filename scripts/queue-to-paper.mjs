import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const queueDir = join(root, "src", "content", "queue");
const papersDir = join(root, "src", "content", "papers");

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

if (!args.slug) {
  fail("Missing required --slug <queue-slug>.");
}

try {
  const queueItem = loadQueueItem(args.slug);
  const today = getTodayKey();
  const targetPath = getAvailablePaperPath(today, args.slug);
  mkdirSync(papersDir, { recursive: true });
  writeFileSync(targetPath, buildPaperLog(queueItem, today), { flag: "wx" });
  console.log(`Created ${relative(root, targetPath)}`);

  if (args.markConverted) {
    const updated = matter.stringify(queueItem.body, {
      ...queueItem.frontmatter,
      status: "converted"
    });
    writeFileSync(queueItem.filePath, updated);
    console.log(`Marked ${queueItem.relativePath} as converted`);
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function parseArgs(values) {
  const parsed = {
    slug: "",
    markConverted: false,
    help: false
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") {
      parsed.help = true;
    } else if (value === "--slug") {
      parsed.slug = values[index + 1] ?? "";
      index += 1;
    } else if (value === "--mark-converted") {
      parsed.markConverted = true;
    } else {
      fail(`Unknown argument: ${value}`);
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`Create a draft paper log from a queued paper.

Usage:
  npm run paper:from-queue -- --slug <queue-slug>
  npm run paper:from-queue -- --slug <queue-slug> --mark-converted

Options:
  --slug <slug>       Queue item slug under src/content/queue/.
  --mark-converted    Update the queue item status to converted after creating the paper log.
  --help, -h          Show this help message.

The script creates src/content/papers/YYYY-MM-DD-<queue-slug>.mdx and never overwrites an existing file.`);
}

function loadQueueItem(slug) {
  if (slug.startsWith("_")) {
    throw new Error("Template or private queue items cannot be converted.");
  }

  if (!existsSync(queueDir)) {
    throw new Error("No queue directory found at src/content/queue/.");
  }

  const files = listMarkdownFiles(queueDir);
  const filePath = files.find((file) => basename(file, extname(file)) === slug);
  if (!filePath) {
    throw new Error(`No queue item found for slug "${slug}".`);
  }

  const raw = readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  if (parsed.data.visibility === "hidden") {
    throw new Error(`Queue item "${slug}" is hidden. Make it public before conversion.`);
  }

  return {
    slug,
    filePath,
    relativePath: relative(root, filePath),
    frontmatter: parsed.data,
    body: parsed.content.trim()
  };
}

function listMarkdownFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getAvailablePaperPath(dateKey, slug) {
  const baseName = `${dateKey}-${slug}`;
  let candidate = join(papersDir, `${baseName}.mdx`);
  let suffix = 2;

  while (existsSync(candidate)) {
    candidate = join(papersDir, `${baseName}-${suffix}.mdx`);
    suffix += 1;
  }

  return candidate;
}

function buildPaperLog(queueItem, today) {
  const data = queueItem.frontmatter;
  const authors = yamlList(data.authors ?? ["Unknown author"], 2);
  const tags = yamlList(data.tags ?? ["paper-reading"], 2);
  const topics = yamlList(data.relatedTopics ?? [], 2);

  return `---
title: "${escapeYamlString(data.title ?? "Untitled Paper")}"
locale: "${data.locale === "ko" ? "ko" : "en"}"
translationKey: "${escapeYamlString(data.translationKey || queueItem.slug)}"
translationStatus: "source-only"
paperId: "${escapeYamlString(data.translationKey || queueItem.slug)}"
authors:
${authors}
venue: "${escapeYamlString(data.venue ?? "")}"
year: ${Number(data.year) || new Date().getFullYear()}
paperUrl: "${escapeYamlString(data.paperUrl ?? "")}"
codeUrl: "${escapeYamlString(data.codeUrl ?? "")}"
projectUrl: ""
readDate: ${today}
lastReviewed:
status: "pass1"
depth: "skim"
priority: "${normalizePriority(data.priority)}"
difficulty: ${Number(data.estimatedDifficulty) || 3}
readingTimeMinutes: ${Number(data.estimatedReadingTimeMinutes) || 0}
tags:
${tags}
relatedTopics:
${topics.length > 0 ? topics : "  - paper-reading"}
abstract: ""
sourceExcerpt: ""
selfScore:
selfReflection: ""
reviewVisibility: "public"
visibility: "hidden"
oneLineSummary: "First-pass note created from the reading queue."
coreQuestion: "What problem is this paper trying to solve?"
coreIdea: "What is the key idea?"
mainFormula: ""
formulaInterpretation: ""
formulaTerms: []
formulaRecallPrompts: []
experimentTakeaway: ""
strengths: []
weaknesses: []
myConnection: "${escapeYamlString(data.reasonToRead ?? "")}"
nextAction: "Complete pass 1 and decide whether this paper needs a deeper read."
reviewSchedule:
  - 1
  - 7
reviewHistory: []
futureMe:
  oneThingToRemember: ""
  whyItMatters: ""
  whenToUseThis: ""
  whatToRevisit: ""
  warning: ""
reviewAfterDays: 7
featured: false
draft: true
---

## Why I Opened This

${data.reasonToRead ?? "This paper came from the reading queue."}

## Pass 1: Skim

Record the problem, claimed contribution, and whether this paper deserves another pass.

## Pass 2: Structure


## Pass 3: Deep Dive


## Questions


## Implementation Notes


## Links

${data.paperUrl ? `- [Paper](${data.paperUrl})` : ""}
${data.codeUrl ? `- [Code](${data.codeUrl})` : ""}
`;
}

function normalizePriority(value) {
  return ["low", "medium", "high"].includes(value) ? value : value === "urgent" ? "high" : "medium";
}

function yamlList(values, indent) {
  return values.map((value) => `${" ".repeat(indent)}- "${escapeYamlString(String(value))}"`).join("\n");
}

function escapeYamlString(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function getTodayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function fail(message) {
  console.error(`paper:from-queue: ${message}`);
  console.error("Run npm run paper:from-queue -- --help for usage.");
  process.exit(1);
}
