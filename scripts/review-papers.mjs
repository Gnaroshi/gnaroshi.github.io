#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { getChangedPaperLogs, isReviewablePaper, loadAllPaperLogs } from "./lib/paper-content-loader.mjs";
import { hasExistingReview } from "./lib/paper-review-writer.mjs";
import { reviewOnePaper } from "./review-paper.mjs";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const sourcePapers = args.changed ? getChangedPaperLogs() : loadAllPaperLogs();
  const reviewablePapers = sourcePapers.filter(isReviewablePaper);
  const targetPapers = reviewablePapers.filter((paper) => args.force || !hasExistingReview(paper.slug));

  if (args.dryRun) {
    printDryRun({ args, sourcePapers, reviewablePapers, targetPapers });
    return;
  }

  if (sourcePapers.length === 0) {
    console.log(args.changed ? "No changed paper logs found." : "No paper logs found.");
    return;
  }

  if (reviewablePapers.length === 0) {
    console.log("No non-draft paper logs to review.");
    return;
  }

  if (targetPapers.length === 0) {
    console.log(args.force ? "No paper logs to review." : "All non-draft paper logs already have reviews. Use --force to re-review.");
    return;
  }

  for (const paper of targetPapers) {
    console.log(`Reviewing ${paper.slug}...`);
    const result = await reviewOnePaper(paper, { force: args.force });
    console.log(result.message);
  }
}

function parseArgs(argv) {
  return {
    changed: argv.includes("--changed"),
    force: argv.includes("--force"),
    dryRun: argv.includes("--dry-run"),
    help: argv.includes("--help") || argv.includes("-h")
  };
}

function printDryRun({ args, sourcePapers, reviewablePapers, targetPapers }) {
  console.log(args.changed ? "Dry run: changed paper review" : "Dry run: all paper review");
  console.log(`Found paper logs: ${sourcePapers.length}`);
  console.log(`Non-draft reviewable logs: ${reviewablePapers.length}`);
  console.log(`Would review: ${targetPapers.length}`);

  for (const paper of targetPapers) {
    console.log(`- ${paper.slug} (${paper.relativePath})`);
  }
}

function printHelp() {
  console.log(`AI paper batch review

Usage:
  npm run paper:review:all
  npm run paper:review:all -- --dry-run
  npm run paper:review:all -- --force
  npm run paper:review:changed
  npm run paper:review:changed -- --force

Options:
  --changed   Review changed files under src/content/papers/.
  --force     Re-review even when a JSON review already exists.
  --dry-run   Print target papers without calling the OpenAI API.
`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
