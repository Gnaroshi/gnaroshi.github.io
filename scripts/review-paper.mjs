#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { config as loadEnv } from "dotenv";
import OpenAI from "openai";
import { loadPaperBySlug } from "./lib/paper-content-loader.mjs";
import { PAPER_REVIEW_SCHEMA } from "./lib/paper-review-schema.mjs";
import { PAPER_REVIEW_SYSTEM_PROMPT, buildPaperReviewUserPrompt } from "./lib/paper-review-prompt.mjs";
import { writePaperReview } from "./lib/paper-review-writer.mjs";

loadEnv({ path: ".env.local", override: false, quiet: true });
loadEnv({ override: false, quiet: true });

export async function reviewOnePaper(paper, { force = false } = {}) {
  assertReviewEnvironment();

  const model = process.env.OPENAI_MODEL;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model,
    input: [
      { role: "system", content: PAPER_REVIEW_SYSTEM_PROMPT },
      { role: "user", content: buildPaperReviewUserPrompt(paper) }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "paper_reading_review",
        schema: PAPER_REVIEW_SCHEMA,
        strict: true
      }
    }
  });

  const outputText = response.output_text;
  if (!outputText) {
    throw new Error("OpenAI returned no output_text. The review was not written.");
  }

  const rawReview = JSON.parse(outputText);
  return writePaperReview(rawReview, { paper, model, force });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (!args.slug) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const paper = loadPaperBySlug(args.slug);
  if (args.dryRun) {
    console.log("Dry run: single paper review");
    console.log(`Would review: ${paper.slug} (${paper.relativePath})`);
    console.log("No API call made. No files written.");
    return;
  }

  const result = await reviewOnePaper(paper, { force: args.force });
  console.log(result.message);
  console.log(`Score: ${result.review.overallScore} (${result.review.scoreLevel})`);
}

function assertReviewEnvironment() {
  const missing = ["OPENAI_API_KEY", "OPENAI_MODEL"].filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  throw new Error(
    [
      `Missing required environment variable(s): ${missing.join(", ")}`,
      "AI paper review runs only from local CLI or GitHub Actions.",
      "For local use, create .env.local with:",
      "OPENAI_API_KEY=...",
      "OPENAI_MODEL=...",
      "Do not expose these values in client-side code."
    ].join("\n")
  );
}

function parseArgs(argv) {
  const args = {
    slug: "",
    force: false,
    dryRun: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--slug") {
      args.slug = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

function printHelp() {
  console.log(`AI paper review

Usage:
  npm run paper:review -- --slug <paper-slug>
  npm run paper:review -- --slug <paper-slug> --force
  npm run paper:review -- --slug <paper-slug> --dry-run

Required environment variables for actual review:
  OPENAI_API_KEY
  OPENAI_MODEL

The script reads src/content/papers/<paper-slug>.mdx and writes:
  src/generated/paper-reviews/<paper-slug>.json
`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
