import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { loadAllPaperLogs, isReviewablePaper } from "./lib/paper-content-loader.mjs";

const root = process.cwd();
const outputDir = join(root, "src", "generated", "question-bank");
const outputPath = join(outputDir, "question-bank.json");
const reviewDir = join(root, "src", "generated", "paper-reviews");
const oralExamDir = join(root, "src", "generated", "oral-exams");
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

try {
  const questionBank = buildQuestionBank();
  writeQuestionBank(questionBank);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function parseArgs(values) {
  const parsed = { help: false, force: false };
  for (const value of values) {
    if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--force") parsed.force = true;
    else fail(`Unknown argument: ${value}`);
  }
  return parsed;
}

function printHelp() {
  console.log(`Build the generated AI question bank.

Usage:
  npm run questions:build
  npm run questions:build -- --force

Options:
  --force       Overwrite src/generated/question-bank/question-bank.json when content changes.
  --help, -h    Show this help message.

Sources:
  - retrievalQuestions from public AI paper reviews
  - followUpQuestion and missedSignals from oral exam JSON files
  - formulaRecallPrompts from non-draft paper notes`);
}

function buildQuestionBank() {
  const papers = loadAllPaperLogs().filter(isReviewablePaper).filter((paper) => paper.frontmatter.visibility === "public");
  const paperBySlug = new Map(papers.map((paper) => [paper.slug, paper]));
  const questions = [];

  for (const review of loadJsonFiles(reviewDir)) {
    if (!paperBySlug.has(review.paperSlug) || review.reviewVisibility !== "public") continue;
    for (const question of review.retrievalQuestions ?? []) {
      questions.push(
        normalizeQuestion({
          paperSlug: review.paperSlug,
          source: "ai-review",
          type: inferQuestionType(question),
          question,
          expectedSignals: [review.improvementTarget?.oneThingToImprove].filter(Boolean),
          difficulty: inferDifficultyFromScore(review.overallScore)
        })
      );
    }
  }

  for (const exam of loadJsonFiles(oralExamDir)) {
    if (!paperBySlug.has(exam.paperSlug)) continue;
    if (exam.followUpQuestion) {
      questions.push(
        normalizeQuestion({
          paperSlug: exam.paperSlug,
          source: "oral-exam",
          type: "retrieval",
          question: exam.followUpQuestion,
          expectedSignals: exam.missedSignals ?? [],
          difficulty: Number(exam.difficulty) || 3
        })
      );
    }
    for (const signal of exam.missedSignals ?? []) {
      questions.push(
        normalizeQuestion({
          paperSlug: exam.paperSlug,
          source: "oral-exam",
          type: "retrieval",
          question: `Explain this missed signal: ${signal}`,
          expectedSignals: [signal],
          difficulty: Number(exam.difficulty) || 3
        })
      );
    }
  }

  for (const paper of papers) {
    for (const prompt of paper.frontmatter.formulaRecallPrompts ?? []) {
      questions.push(
        normalizeQuestion({
          paperSlug: paper.slug,
          source: "manual",
          type: "formula",
          question: prompt,
          expectedSignals: [paper.frontmatter.mainFormula, paper.frontmatter.formulaInterpretation].filter(Boolean),
          difficulty: Number(paper.frontmatter.difficulty) || 3
        })
      );
    }
  }

  const deduped = dedupeQuestions(questions);
  return {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    questions: deduped
  };
}

function normalizeQuestion(input) {
  const idBase = `${input.paperSlug}-${input.source}-${input.type}-${input.question}`;
  return {
    id: `q_${hashString(idBase)}`,
    paperSlug: input.paperSlug,
    source: input.source,
    type: input.type,
    question: input.question,
    expectedSignals: input.expectedSignals,
    difficulty: Math.min(5, Math.max(1, Number(input.difficulty) || 3)),
    lastAsked: "",
    timesAsked: 0,
    lastScore: null,
    status: "active"
  };
}

function dedupeQuestions(questions) {
  const seen = new Set();
  const deduped = [];

  for (const question of questions) {
    const key = `${question.paperSlug}:${question.question.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(question);
  }

  return deduped.sort((a, b) => a.paperSlug.localeCompare(b.paperSlug) || a.question.localeCompare(b.question));
}

function inferQuestionType(question) {
  const normalized = question.toLowerCase();
  if (normalized.includes("formula") || normalized.includes("term") || normalized.includes("objective")) return "formula";
  if (normalized.includes("experiment") || normalized.includes("benchmark") || normalized.includes("evidence")) return "experiment";
  if (normalized.includes("method") || normalized.includes("model") || normalized.includes("architecture")) return "method";
  if (normalized.includes("assumption") || normalized.includes("weakness") || normalized.includes("fail")) return "critical-thinking";
  if (normalized.includes("research") || normalized.includes("connect")) return "research-connection";
  return "retrieval";
}

function inferDifficultyFromScore(score) {
  if (typeof score !== "number") return 3;
  if (score < 50) return 5;
  if (score < 65) return 4;
  if (score < 80) return 3;
  return 2;
}

function loadJsonFiles(directory) {
  if (!existsSync(directory)) return [];
  return listFiles(directory)
    .filter((filePath) => filePath.endsWith(".json"))
    .map((filePath) => JSON.parse(readFileSync(filePath, "utf8")));
}

function listFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) files.push(...listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function writeQuestionBank(questionBank) {
  mkdirSync(outputDir, { recursive: true });
  const next = `${JSON.stringify(questionBank, null, 2)}\n`;

  if (existsSync(outputPath)) {
    const current = readFileSync(outputPath, "utf8");
    if (normalizeGeneratedAt(current) === normalizeGeneratedAt(next)) {
      console.log(`No question changes in ${relative(root, outputPath)}`);
      return;
    }
    if (!args.force) {
      throw new Error(`${relative(root, outputPath)} already exists and content would change. Re-run with --force to overwrite.`);
    }
  }

  writeFileSync(outputPath, next, { flag: existsSync(outputPath) ? "w" : "wx" });
  console.log(`Wrote ${relative(root, outputPath)} with ${questionBank.questions.length} questions`);
}

function normalizeGeneratedAt(raw) {
  try {
    const parsed = JSON.parse(raw);
    parsed.generatedAt = "<generated>";
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw;
  }
}

function hashString(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function fail(message) {
  console.error(`questions:build: ${message}`);
  console.error("Run npm run questions:build -- --help for usage.");
  process.exit(1);
}
