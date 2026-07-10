#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { loadPaperBySlug } from "./lib/paper-content-loader.mjs";

const root = process.cwd();
const blogDir = join(root, "src", "content", "blog", "en");
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

if (!args.slug) {
  fail("Missing required --slug <paper-slug>.");
}

try {
  const paper = loadPaperBySlug(args.slug);
  const today = getTodayKey();
  const targetPath = join(blogDir, `${today}-${paper.slug}-notes.mdx`);

  if (existsSync(targetPath) && !args.force) {
    throw new Error(`${relative(root, targetPath)} already exists. Re-run with --force to overwrite.`);
  }

  mkdirSync(blogDir, { recursive: true });
  writeFileSync(targetPath, buildBlogDraft(paper, today), { flag: args.force ? "w" : "wx" });
  console.log(`${args.force ? "Updated" : "Created"} ${relative(root, targetPath)}`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function parseArgs(values) {
  const parsed = { slug: "", force: false, help: false };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--force") parsed.force = true;
    else if (value === "--slug") {
      parsed.slug = values[index + 1] ?? "";
      index += 1;
    } else fail(`Unknown argument: ${value}`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Promote a structured paper note into a draft blog post.

Usage:
  npm run paper:promote -- --slug <paper-slug>
  npm run paper:promote -- --slug <paper-slug> --force

Options:
  --slug <slug>  Paper slug under src/content/papers/.
  --force        Overwrite the generated draft if it already exists.
  --help, -h     Show this help message.

The script creates src/content/blog/YYYY-MM-DD-<paper-slug>-notes.mdx with draft: true.`);
}

function buildBlogDraft(paper, today) {
  const data = paper.frontmatter;
  const tags = unique([...(data.tags ?? []), "paper-notes"]);

  return `---
title: "Notes on ${escapeYamlString(data.title)}"
locale: "en"
translationKey: "${today}-${paper.slug}-notes"
translationStatus: "source-only"
contentStage: "working"
metricEligible: false
graphEligible: false
weeklyReviewEligible: false
description: "${escapeYamlString(data.oneLineSummary || `A paper note on ${data.title}.`)}"
pubDate: ${today}
updatedDate:
draft: true
tags:
${yamlList(tags, 2)}
visibility: "hidden"
series: "Paper Notes"
seriesOrder:
sourcePaper: "${escapeYamlString(paper.slug)}"
heroImage:
readingTime:
featured: false
canonicalUrl:
ogImage:
---

Source paper note: [${data.title}](/papers/${paper.slug}/)

## Why This Paper Matters

${data.myConnection || data.coreQuestion || "Write why this paper is worth explaining beyond the reading log."}

## Core Idea

${data.coreIdea || "Explain the core idea in your own words."}

## Method

Describe the method, assumptions, and moving parts that matter.

## Formula Intuition

${data.formulaInterpretation || "Explain the main equation or formal object without copying the paper."}

## Experiments

${data.experimentTakeaway || "Summarize the experiment evidence and what it does or does not prove."}

## What I Learned

Turn the reading note into one durable research lesson.

## Open Questions

${data.nextAction || "List the questions that should guide the next read, implementation, or critique."}
`;
}

function yamlList(values, indent) {
  return values.map((value) => `${" ".repeat(indent)}- "${escapeYamlString(String(value))}"`).join("\n");
}

function unique(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
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
  console.error(`paper:promote: ${message}`);
  console.error("Run npm run paper:promote -- --help for usage.");
  process.exit(1);
}
