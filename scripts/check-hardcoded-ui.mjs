#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const audited = [
  "src/components/papers/PaperFilters.tsx",
  "src/components/papers/PaperHeatmap.tsx",
  "src/components/papers/PaperCard.tsx",
  "src/components/queue/QueueDashboard.tsx",
  "src/components/reviews/ReviewSession.tsx",
  "src/components/formula/FormulaRecallTrainer.tsx",
  "src/components/questions/QuestionPractice.tsx",
  "src/components/graph/ResearchGraphExplorer.tsx",
  "src/components/exams/LiveOralExam.tsx",
  "src/components/exams/RealtimeExamSetup.tsx",
  "src/components/exams/ExamTranscriptPanel.tsx",
  "src/components/exams/ExamExportResult.tsx",
  "src/components/papers/ManualReviewPrompt.tsx"
];
const failures = [];

for (const relative of audited) {
  const source = readFileSync(join(root, relative), "utf8");
  if (!/messages\s*:\s*IslandMessages/.test(source)) failures.push(`${relative}: missing typed localized messages prop`);
}

const forbiddenSourcePhrases = [
  "No formulas ready for recall yet.",
  "Random practice mode</h2>",
  "Search the research graph</h2>",
  "Live oral exam principles\">",
  "Copy AI Review Prompt</button>"
];
for (const relative of audited) {
  const source = readFileSync(join(root, relative), "utf8");
  for (const phrase of forbiddenSourcePhrases) {
    if (source.includes(phrase)) failures.push(`${relative}: hardcoded public UI phrase ${JSON.stringify(phrase)}`);
  }
}

const koreanDist = join(root, "dist", "ko");
if (existsSync(koreanDist)) {
  const forbiddenRenderedPhrases = [
    "Skip to content",
    "Primary navigation",
    "Switch to dark theme",
    "Switch to light theme",
    "No results found.",
    "Back to writing",
    "Reading Queue",
    "Reviews Due",
    "Question Bank"
  ];
  for (const file of walk(koreanDist)) {
    if (extname(file) !== ".html") continue;
    const html = readFileSync(file, "utf8");
    for (const phrase of forbiddenRenderedPhrases) {
      if (html.includes(phrase)) failures.push(`${file.slice(root.length + 1)}: rendered English UI ${JSON.stringify(phrase)}`);
    }
  }
}

if (failures.length) {
  console.error("Hardcoded UI check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Hardcoded UI check passed (${audited.length} interactive components audited).`);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
