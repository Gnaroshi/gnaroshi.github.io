#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFileSync } from "node:fs";
import { loadPaperBySlug } from "./lib/paper-content-loader.mjs";
import { readExistingReview, writePaperReview } from "./lib/paper-review-writer.mjs";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (!args.slug || !args.file) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const paper = loadPaperBySlug(args.slug);
  const rawReview = JSON.parse(readFileSync(args.file, "utf8"));

  if (rawReview.paperSlug !== args.slug) {
    throw new Error(`Review paperSlug "${rawReview.paperSlug}" does not match --slug "${args.slug}".`);
  }

  const existingReview = readExistingReview(args.slug);
  if (existingReview && !args.force) {
    const confirmed = await confirmOverwrite(args.slug);
    if (!confirmed) {
      console.log("Import cancelled. Existing review was not overwritten.");
      return;
    }
  }

  const result = writePaperReview(rawReview, {
    paper,
    model: rawReview.model || "manual-import",
    force: true
  });

  console.log(result.message);
  console.log(`Score: ${result.review.overallScore} (${result.review.scoreLevel})`);
}

function parseArgs(argv) {
  const args = {
    slug: "",
    file: "",
    force: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--slug") {
      args.slug = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--file") {
      args.file = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

async function confirmOverwrite(slug) {
  if (!process.stdin.isTTY) {
    throw new Error(`Review already exists for ${slug}. Re-run with --force to overwrite and preserve history.`);
  }

  const readline = createInterface({ input, output });
  try {
    const answer = await readline.question(`Review already exists for ${slug}. Type "yes" to overwrite and preserve history: `);
    return answer.trim().toLowerCase() === "yes";
  } finally {
    readline.close();
  }
}

function printHelp() {
  console.log(`Import manual AI paper review

Usage:
  npm run paper:review:import -- --slug <paper-slug> --file review.json
  npm run paper:review:import -- --slug <paper-slug> --file review.json --force

Behavior:
  - Validates and normalizes the JSON review.
  - Ensures paperSlug matches --slug.
  - Writes src/generated/paper-reviews/<paper-slug>.json.
  - Preserves existing score history.
  - Refuses to overwrite existing reviews unless confirmed or --force is used.
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
