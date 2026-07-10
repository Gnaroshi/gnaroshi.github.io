import { evidenceGates, type EvidenceCategory } from "../config/evidenceGates";
import type { MomentumInput } from "../types/momentum";

export type EvidenceEvent = {
  category: EvidenceCategory;
  date: string;
  source: string;
};

export type EvidenceCriterion = {
  label: string;
  current: number;
  required: number;
  complete: boolean;
};

export type EvidenceEligibility = {
  eligible: boolean;
  eventCount: number;
  activeDateCount: number;
  categories: EvidenceCategory[];
  coreCategories: EvidenceCategory[];
  events: EvidenceEvent[];
  criteria: EvidenceCriterion[];
  missingEvidence: string[];
};

export function getEvidenceEligibility(input: MomentumInput): EvidenceEligibility {
  const events = collectMeaningfulEvidenceEvents(input);
  const dates = new Set(events.map((event) => event.date));
  const categories = [...new Set(events.map((event) => event.category))].sort();
  const coreCategories = categories.filter((category) =>
    evidenceGates.momentum.coreCategories.includes(
      category as (typeof evidenceGates.momentum.coreCategories)[number]
    )
  );
  const criteria: EvidenceCriterion[] = [
    {
      label: "Meaningful evidence events",
      current: events.length,
      required: evidenceGates.momentum.minimumEvents,
      complete: events.length >= evidenceGates.momentum.minimumEvents
    },
    {
      label: "Distinct active dates",
      current: dates.size,
      required: evidenceGates.momentum.minimumActiveDates,
      complete: dates.size >= evidenceGates.momentum.minimumActiveDates
    },
    {
      label: "Activity categories",
      current: categories.length,
      required: evidenceGates.momentum.minimumCategories,
      complete: categories.length >= evidenceGates.momentum.minimumCategories
    },
    {
      label: "Core research-loop category",
      current: coreCategories.length,
      required: 1,
      complete: coreCategories.length > 0
    }
  ];

  return {
    eligible: criteria.every((criterion) => criterion.complete),
    eventCount: events.length,
    activeDateCount: dates.size,
    categories,
    coreCategories,
    events,
    criteria,
    missingEvidence: criteria
      .filter((criterion) => !criterion.complete)
      .map((criterion) => `${criterion.label}: ${criterion.current} of ${criterion.required}`)
  };
}

export function collectMeaningfulEvidenceEvents(input: MomentumInput): EvidenceEvent[] {
  const publicPapers = input.papers.filter(isMetricEligible);
  const paperSlugs = new Set(publicPapers.map((paper) => paper.slug));
  const events: EvidenceEvent[] = [];

  for (const paper of publicPapers) {
    if (paper.draft || !isPublic(paper.visibility) || !paper.readDate || ["planned", "abandoned"].includes(paper.status)) continue;
    events.push(event("reading", paper.readDate, `paper:${paper.slug}`));
  }
  for (const review of input.paperReviews.filter(isMetricEligible)) {
    if (!isPublic(review.reviewVisibility) || !paperSlugs.has(review.paperSlug)) continue;
    events.push(event("review", review.reviewedAt, `review:${review.paperSlug}`));
  }
  for (const exam of input.oralExams.filter(isMetricEligible)) {
    if (!isPublic(exam.visibility)) continue;
    events.push(event("retrieval", exam.date, `oral-exam:${exam.paperSlug ?? exam.date}`));
  }
  for (const attempt of input.implementations.filter(isMetricEligible)) {
    if (!isPublic(attempt.visibility) || ["planned", "abandoned"].includes(attempt.status)) continue;
    events.push(event("implementation", attempt.date, `implementation:${attempt.slug}`));
  }
  for (const project of input.projects.filter(isMetricEligible)) {
    if (!isPublic(project.visibility) || !project.updatedAt) continue;
    events.push(event("implementation", project.updatedAt, `project:${project.slug}`));
  }
  for (const post of input.blogPosts.filter(isMetricEligible)) {
    if (post.draft || !isPublic(post.visibility)) continue;
    events.push(event("writing", post.pubDate, `blog:${post.slug}`));
  }
  for (const day of input.githubContributions.filter(isMetricEligible)) {
    if (!isPublic(day.visibility) || day.count <= 0) continue;
    events.push(event("implementation", day.date, `github:${day.date}`));
  }
  for (const review of input.reviewDueItems.filter(isMetricEligible)) {
    if (!isPublic(review.visibility) || !review.completedAt) continue;
    events.push(event("revisit", review.completedAt, `revisit:${review.paperSlug}:${review.completedAt}`));
  }
  for (const recall of (input.formulaRecallAttempts ?? []).filter(isMetricEligible)) {
    if (!isPublic(recall.visibility) || recall.completed === false) continue;
    events.push(event("revisit", recall.date, `formula:${recall.paperSlug ?? recall.date}`));
  }
  for (const practice of (input.questionPracticeAttempts ?? []).filter(isMetricEligible)) {
    if (!isPublic(practice.visibility)) continue;
    events.push(event("revisit", practice.date, `question:${practice.questionId ?? practice.date}`));
  }

  return events
    .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date))
    .sort((a, b) => a.date.localeCompare(b.date) || a.source.localeCompare(b.source));
}

function event(category: EvidenceCategory, value: string, source: string): EvidenceEvent {
  return { category, date: value.slice(0, 10), source };
}

function isMetricEligible(value: { metricEligible?: boolean; contentStage?: string }): boolean {
  return value.metricEligible !== false && value.contentStage !== "seed";
}

function isPublic(visibility?: string): boolean {
  return (visibility ?? "public") === "public";
}
