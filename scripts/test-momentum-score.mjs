import assert from "node:assert/strict";
import { computeResearchMomentum } from "../src/utils/momentumScore.ts";

const TODAY = "2026-07-10";

function emptyInput(overrides = {}) {
  return {
    today: TODAY,
    papers: [],
    paperReviews: [],
    oralExams: [],
    githubContributions: [],
    blogPosts: [],
    projects: [],
    implementations: [],
    reviewDueItems: [],
    formulaRecallAttempts: [],
    questionPracticeAttempts: [],
    ...overrides
  };
}

function dateDaysAgo(days) {
  const date = new Date(`${TODAY}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function paper(index, overrides = {}) {
  return {
    slug: `paper-${index}`,
    title: `Paper ${index}`,
    readDate: dateDaysAgo(index),
    status: "pass2",
    depth: "understand",
    difficulty: 3,
    visibility: "public",
    noteCompleteness: 72,
    noteWordCount: 320,
    ...overrides
  };
}

function review(index, overrides = {}) {
  return {
    paperSlug: `paper-${index}`,
    reviewedAt: `${dateDaysAgo(index)}T09:00:00.000Z`,
    overallScore: 80,
    reviewVisibility: "public",
    confidence: "high",
    dimensions: {
      problemFraming: { score: 8, evidence: "Clear problem statement." },
      coreIdea: { score: 8, evidence: "Own explanation of the core idea." },
      methodUnderstanding: { score: 8, evidence: "Method inputs and outputs." },
      formulaUnderstanding: { score: 8, evidence: "Terms and objective explained." },
      experimentUnderstanding: { score: 8, evidence: "Exact experiment takeaway." },
      criticalThinking: { score: 8, evidence: "Assumption identified." },
      researchConnection: { score: 8, evidence: "Connected to a project." },
      retrievalReadiness: { score: 8, evidence: "Recall questions included." },
      threePassDiscipline: { score: 8, evidence: "Depth is honestly recorded." },
      noteQuality: { score: 8, evidence: "Structured note." }
    },
    selfScoreComparison: { userScore: 78, aiScore: 80, difference: -2 },
    ...overrides
  };
}

function oralExam(index, score, questionTypeScore = score) {
  return {
    paperSlug: `paper-${index}`,
    date: `${dateDaysAgo(index)}T10:00:00.000Z`,
    overallScore: score,
    uncertaintyScore: 8,
    completed: true,
    questionTypeScores: { method: questionTypeScore },
    visibility: "public"
  };
}

const noData = computeResearchMomentum(emptyInput());
assert.equal(noData.score, 0, "No data should produce a zero provisional score.");
assert.equal(noData.confidence.label, "low", "No data must have low confidence.");
assert.equal(noData.components.readingConsistency.available, false);

const paperOnly = computeResearchMomentum(emptyInput({ papers: [0, 2, 5, 9].map((index) => paper(index)) }));
assert.equal(paperOnly.components.readingConsistency.available, true);
assert.equal(paperOnly.components.understandingQuality.available, false);
assert.equal(paperOnly.components.retrievalStrength.available, false);
assert.equal(paperOnly.confidence.label, "low", "A few paper logs alone must remain provisional.");

const commitSpam = computeResearchMomentum(
  emptyInput({
    papers: [paper(0)],
    githubContributions: [{ date: TODAY, count: 40, visibility: "public" }]
  })
);
assert.ok(commitSpam.antiGamingFlags.some((flag) => flag.includes("four contribution units")));
assert.ok(commitSpam.components.researchOutput.score < 40, "One spammy day must not create a strong output score.");

const consistentReading = computeResearchMomentum(
  emptyInput({ papers: Array.from({ length: 16 }, (_, index) => paper(index)) })
);
assert.ok(consistentReading.components.readingConsistency.score >= 55);
assert.equal(consistentReading.components.researchOutput.score, 0, "Reading alone is not research output.");
assert.ok(consistentReading.missingEvidence.some((item) => item.includes("implementation")));

const balanced = computeResearchMomentum(
  emptyInput({
    papers: Array.from({ length: 14 }, (_, index) => paper(index, { projectUrl: index < 4 ? "https://example.com/project" : undefined })),
    paperReviews: Array.from({ length: 7 }, (_, index) => review(index, { overallScore: 84 })),
    oralExams: [oralExam(3, 72, 45), oralExam(2, 78, 58), oralExam(1, 84, 70), oralExam(0, 88, 78)],
    githubContributions: Array.from({ length: 12 }, (_, index) => ({ date: dateDaysAgo(index * 2), count: 2, visibility: "public" })),
    blogPosts: Array.from({ length: 4 }, (_, index) => ({
      slug: `post-${index}`,
      pubDate: dateDaysAgo(index * 5),
      sourcePaper: `paper-${index}`,
      visibility: "public"
    })),
    projects: [{ slug: "project", updatedAt: dateDaysAgo(4), status: "active", visibility: "public" }],
    implementations: Array.from({ length: 4 }, (_, index) => ({
      slug: `attempt-${index}`,
      date: dateDaysAgo(index * 4),
      status: index === 3 ? "failed" : "reproduced",
      lessons: ["Recorded what changed."],
      relatedPapers: [`paper-${index}`],
      relatedProjects: ["project"],
      visibility: "public"
    })),
    reviewDueItems: Array.from({ length: 4 }, (_, index) => ({
      paperSlug: `paper-${index}`,
      dueDate: dateDaysAgo(index + 1),
      completedAt: dateDaysAgo(index),
      visibility: "public"
    })),
    formulaRecallAttempts: Array.from({ length: 4 }, (_, index) => ({ paperSlug: `paper-${index}`, date: dateDaysAgo(index), score: 75, visibility: "public" })),
    questionPracticeAttempts: Array.from({ length: 6 }, (_, index) => ({ questionId: `q-${index}`, date: dateDaysAgo(index), score: 4, visibility: "public" }))
  })
);
assert.ok(balanced.score >= 75, `Balanced evidence should reach strong momentum; received ${balanced.score}.`);
assert.equal(balanced.confidence.label, "high");
assert.ok(balanced.components.balanceIntegrity.score >= 75);

const shallowDeepPapers = Array.from({ length: 5 }, (_, index) =>
  paper(index, { status: "pass3", depth: "deep", difficulty: 4, noteCompleteness: 22, noteWordCount: 80 })
);
const deepLabelsWithShallowNotes = computeResearchMomentum(
  emptyInput({
    papers: shallowDeepPapers,
    paperReviews: Array.from({ length: 5 }, (_, index) =>
      review(index, {
        overallScore: 85,
        dimensions: {
          ...review(index).dimensions,
          methodUnderstanding: { score: 3, evidence: "Vague method note." },
          formulaUnderstanding: { score: 2, evidence: "No derivation." }
        }
      })
    )
  })
);
assert.ok(deepLabelsWithShallowNotes.antiGamingFlags.some((flag) => flag.includes("deep label")));
assert.ok(deepLabelsWithShallowNotes.components.understandingQuality.score < 75);
assert.ok(deepLabelsWithShallowNotes.components.balanceIntegrity.score < balanced.components.balanceIntegrity.score);

const matureWithoutOralExam = computeResearchMomentum(
  emptyInput({
    papers: Array.from({ length: 10 }, (_, index) => paper(index)),
    paperReviews: Array.from({ length: 5 }, (_, index) => review(index))
  })
);
assert.ok(matureWithoutOralExam.missingEvidence.some((item) => item.includes("Ten or more")));
assert.notEqual(matureWithoutOralExam.confidence.label, "high");

const stagnantRetrieval = computeResearchMomentum(
  emptyInput({
    papers: [paper(0), paper(1)],
    oralExams: [oralExam(1, 70, 4), oralExam(0, 72, 4)]
  })
);
const improvingRetrieval = computeResearchMomentum(
  emptyInput({
    papers: [paper(0), paper(1)],
    oralExams: [oralExam(1, 70, 4), oralExam(0, 72, 7)]
  })
);
assert.ok(
  improvingRetrieval.components.retrievalStrength.score > stagnantRetrieval.components.retrievalStrength.score,
  "Improvement in a previously weak question type should increase retrieval strength."
);

console.log("Research Momentum Score v2 scenarios passed:");
for (const [name, result] of [
  ["no data", noData],
  ["paper logs only", paperOnly],
  ["commit spam", commitSpam],
  ["consistent reading", consistentReading],
  ["balanced loop", balanced],
  ["deep labels with shallow notes", deepLabelsWithShallowNotes],
  ["mature log without oral exam", matureWithoutOralExam],
  ["improved weak dimension", improvingRetrieval]
]) {
  console.log(`- ${name}: ${result.score} (${result.level}), confidence ${result.confidence.score}`);
}
