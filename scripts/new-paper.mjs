import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const papersDir = join(root, "src", "content", "papers");

function getTodayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getAvailablePath(dateKey) {
  const baseName = `${dateKey}-untitled-paper`;
  let candidate = join(papersDir, `${baseName}.mdx`);
  let suffix = 2;

  while (existsSync(candidate)) {
    candidate = join(papersDir, `${baseName}-${suffix}.mdx`);
    suffix += 1;
  }

  return candidate;
}

const today = getTodayKey();
mkdirSync(papersDir, { recursive: true });

const targetPath = getAvailablePath(today);
const content = `---
title: "Untitled Paper"
authors:
  - "TODO"
venue: "TODO"
year: ${new Date().getFullYear()}
paperUrl: ""
codeUrl: ""
projectUrl: ""
readDate: ${today}
lastReviewed:
status: "planned"
depth: "skim"
priority: "medium"
difficulty: 3
readingTimeMinutes: 0
tags:
  - paper-reading
relatedTopics:
  - "TODO"
oneLineSummary: "TODO"
coreQuestion: "TODO"
coreIdea: "TODO"
mainFormula: ""
formulaInterpretation: ""
experimentTakeaway: ""
strengths:
  - "TODO"
weaknesses:
  - "TODO"
myConnection: ""
nextAction: ""
reviewAfterDays: 7
featured: false
draft: true
---

## Why I Opened This

TODO

## Pass 1: Skim

TODO

## Pass 2: Structure

TODO

## Pass 3: Deep Dive

TODO

## Questions

TODO

## Implementation Notes

TODO

## Links

TODO
`;

writeFileSync(targetPath, content, { flag: "wx" });
console.log(`Created ${targetPath}`);

