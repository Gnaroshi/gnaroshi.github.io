import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { loadPaperBySlug } from "./lib/paper-content-loader.mjs";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

if (!args.slug) fail("Missing required --slug <paper-slug>.");
if (!args.file) fail("Missing required --file <attempt.json>.");

try {
  const paper = loadPaperBySlug(args.slug);
  const attemptPath = join(root, args.file);
  if (!existsSync(attemptPath)) throw new Error(`Attempt file not found: ${args.file}`);
  const attempt = JSON.parse(readFileSync(attemptPath, "utf8"));
  const result = scoreAttempt(paper, attempt);
  const output = `${JSON.stringify(result, null, 2)}\n`;

  if (args.out) {
    const outputPath = join(root, args.out);
    if (existsSync(outputPath) && !args.force) {
      throw new Error(`${args.out} already exists. Re-run with --force to overwrite.`);
    }
    writeFileSync(outputPath, output, { flag: existsSync(outputPath) ? "w" : "wx" });
    console.log(`Wrote ${relative(root, outputPath)}`);
  } else {
    console.log(output);
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function parseArgs(values) {
  const parsed = {
    slug: "",
    file: "",
    out: "",
    force: false,
    help: false
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--slug") {
      parsed.slug = values[index + 1] ?? "";
      index += 1;
    } else if (value === "--file") {
      parsed.file = values[index + 1] ?? "";
      index += 1;
    } else if (value === "--out") {
      parsed.out = values[index + 1] ?? "";
      index += 1;
    } else if (value === "--force") parsed.force = true;
    else fail(`Unknown argument: ${value}`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Score a local formula recall attempt without an API.

Usage:
  npm run formula:score -- --slug <paper-slug> --file attempt.json
  npm run formula:score -- --slug <paper-slug> --file attempt.json --out src/generated/formula-recall/<slug>.json --force

Options:
  --slug <slug>       Paper slug under src/content/papers/.
  --file <path>       Recall attempt JSON exported from the browser.
  --out <path>        Optional output path. Existing files require --force.
  --force             Allow overwriting --out.
  --help, -h          Show this help message.`);
}

function scoreAttempt(paper, attempt) {
  const savedFormula = normalizeText(paper.frontmatter.mainFormula ?? "");
  const savedInterpretation = normalizeText(paper.frontmatter.formulaInterpretation ?? "");
  const attemptedFormula = normalizeText(attempt.formulaText ?? "");
  const attemptedInterpretation = normalizeText(attempt.interpretation ?? "");
  const formulaOverlap = tokenOverlap(attemptedFormula, savedFormula);
  const interpretationOverlap = tokenOverlap(attemptedInterpretation, savedInterpretation);
  const score = Math.round(((formulaOverlap * 0.55 + interpretationOverlap * 0.45) * 100));

  return {
    schemaVersion: "1.0.0",
    paperSlug: paper.slug,
    scoredAt: new Date().toISOString(),
    score,
    confidence: savedFormula || savedInterpretation ? "medium" : "low",
    checks: {
      formulaOverlap,
      interpretationOverlap,
      attemptedBeforeReveal: Boolean(attempt.selfCheck?.wroteFormulaBeforeReveal),
      confidence: attempt.confidence ?? "unknown"
    },
    nextAction:
      score >= 75
        ? "Revisit this formula later and connect it to the experiment or method."
        : "Rewrite the formula terms and explain the role of each term before the next review."
  };
}

function normalizeText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9_]+/g, " ").trim();
}

function tokenOverlap(candidate, reference) {
  if (!candidate || !reference) return 0;
  const candidateTokens = new Set(candidate.split(/\s+/).filter(Boolean));
  const referenceTokens = new Set(reference.split(/\s+/).filter(Boolean));
  if (referenceTokens.size === 0) return 0;
  let matches = 0;
  for (const token of referenceTokens) {
    if (candidateTokens.has(token)) matches += 1;
  }
  return Number((matches / referenceTokens.size).toFixed(2));
}

function fail(message) {
  console.error(`formula:score: ${message}`);
  console.error("Run npm run formula:score -- --help for usage.");
  process.exit(1);
}
