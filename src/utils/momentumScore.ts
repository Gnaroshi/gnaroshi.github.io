import type {
  BlogPost,
  FormulaRecallAttempt,
  GitHubContributionDay,
  Implementation,
  MomentumComponent,
  MomentumInput,
  MomentumLevel,
  MomentumResult,
  OralExamScore,
  Paper,
  PaperReview,
  Project,
  QuestionPracticeAttempt,
  ReviewDueItem
} from "../types/momentum";

const DAY_MS = 86_400_000;

export const MOMENTUM_COMPONENT_WEIGHTS = {
  readingConsistency: 25,
  understandingQuality: 20,
  retrievalStrength: 20,
  researchOutput: 15,
  revisitDiscipline: 10,
  balanceIntegrity: 10
} as const;

type ComponentKey = keyof typeof MOMENTUM_COMPONENT_WEIGHTS;
type ActivityCategory = "reading" | "review" | "oral-exam" | "revisit" | "implementation" | "writing";

type ScoreContext = {
  today: string;
  papers: Paper[];
  activePapers: Paper[];
  reviews: PaperReview[];
  oralExams: OralExamScore[];
  github: GitHubContributionDay[];
  blogs: BlogPost[];
  projects: Project[];
  implementations: Implementation[];
  reviewDueItems: ReviewDueItem[];
  formulaRecalls: FormulaRecallAttempt[];
  questionPractice: QuestionPracticeAttempt[];
};

export function computeResearchMomentum(input: MomentumInput): MomentumResult {
  const context = normalizeInput(input);
  const antiGamingFlags = collectAntiGamingFlags(context);
  const missingEvidence = collectMissingEvidence(context);

  const preliminary = {
    readingConsistency: computeReadingConsistency(context),
    understandingQuality: computeUnderstandingQuality(context),
    retrievalStrength: computeRetrievalStrength(context),
    researchOutput: computeResearchOutput(context),
    revisitDiscipline: computeRevisitDiscipline(context)
  };
  const components: MomentumResult["components"] = {
    ...preliminary,
    balanceIntegrity: computeBalanceIntegrity(context, preliminary)
  };

  const availableComponents = Object.values(components).filter((component) => component.available);
  const availableWeight = availableComponents.reduce((sum, component) => sum + component.weight, 0);
  const score = availableWeight === 0
    ? 0
    : round(
        availableComponents.reduce((sum, component) => sum + component.score * component.weight, 0) / availableWeight
      );
  const confidence = computeConfidence(context, components, antiGamingFlags);

  return {
    score,
    level: getMomentumLevel(score),
    confidence,
    components,
    antiGamingFlags,
    missingEvidence,
    nextActions: buildNextActions(context, components, antiGamingFlags),
    explanation:
      availableWeight === 0
        ? "This provisional score has no public research evidence yet. Confidence stays low until activity is recorded."
        : `This provisional score uses ${availableComponents.length} of 6 evidence components. Confidence is reported separately so missing data does not silently reduce the score.`
  };
}

function normalizeInput(input: MomentumInput): ScoreContext {
  const papers = input.papers.filter((paper) => !paper.draft && isPublic(paper.visibility));
  const paperSlugs = new Set(papers.map((paper) => paper.slug));
  const activePapers = papers.filter(
    (paper) => Boolean(paper.readDate) && !["planned", "abandoned"].includes(paper.status)
  );

  return {
    today: normalizeDate(input.today) ?? input.today,
    papers,
    activePapers,
    reviews: input.paperReviews.filter(
      (review) => isPublic(review.reviewVisibility) && paperSlugs.has(review.paperSlug)
    ),
    oralExams: input.oralExams.filter((exam) => isPublic(exam.visibility)),
    github: input.githubContributions.filter((day) => isPublic(day.visibility)),
    blogs: input.blogPosts.filter((post) => !post.draft && isPublic(post.visibility)),
    projects: input.projects.filter((project) => isPublic(project.visibility)),
    implementations: input.implementations.filter((attempt) => isPublic(attempt.visibility)),
    reviewDueItems: input.reviewDueItems.filter((item) => isPublic(item.visibility)),
    formulaRecalls: (input.formulaRecallAttempts ?? []).filter((attempt) => isPublic(attempt.visibility)),
    questionPractice: (input.questionPracticeAttempts ?? []).filter((attempt) => isPublic(attempt.visibility))
  };
}

function computeReadingConsistency(context: ScoreContext): MomentumComponent {
  const weight = MOMENTUM_COMPONENT_WEIGHTS.readingConsistency;
  if (context.activePapers.length === 0) {
    return unavailableComponent("Reading consistency", weight, "No active public paper reading dates are available.");
  }

  const recentPapers = context.activePapers.filter((paper) => isWithinDays(paper.readDate, context.today, 28));
  const activeDates = new Set(recentPapers.map((paper) => normalizeDate(paper.readDate)).filter(isString));
  const stableDates = new Set(
    context.activePapers
      .filter((paper) => isWithinDays(paper.readDate, context.today, 90))
      .map((paper) => normalizeDate(paper.readDate))
      .filter(isString)
  );
  const activeDaysScore = ratioScore(activeDates.size, 20);
  const streak = getCurrentStreak(activeDates, context.today);
  const streakScore = ratioScore(streak, 14);
  const weeklyDistributionScore = getWeeklyDistributionScore(activeDates, context.today);
  const depthAppropriatenessScore = recentPapers.length > 0
    ? average(recentPapers.map(getDepthAppropriateness))
    : 0;
  const score = weightedAverage([
    [activeDaysScore, 45],
    [streakScore, 25],
    [weeklyDistributionScore, 20],
    [depthAppropriatenessScore, 10]
  ]);

  return component({
    score,
    weight,
    available: true,
    confidence: clamp(ratioScore(activeDates.size, 12) * 0.7 + ratioScore(stableDates.size, 30) * 0.3),
    label: "Reading consistency",
    explanation: "Rewards distributed reading days and an honest match between reading pass and claimed depth.",
    evidence: [
      `${activeDates.size} active day${activeDates.size === 1 ? "" : "s"} in the last 28 days`,
      `${streak}-day current streak, capped at 14 days`,
      `${stableDates.size} active day${stableDates.size === 1 ? "" : "s"} in the last 90 days`
    ]
  });
}

function computeUnderstandingQuality(context: ScoreContext): MomentumComponent {
  const weight = MOMENTUM_COMPONENT_WEIGHTS.understandingQuality;
  const reviews = [...context.reviews]
    .sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt))
    .slice(-10);
  const paperBySlug = new Map(context.papers.map((paper) => [paper.slug, paper]));

  if (reviews.length === 0) {
    if (context.papers.length < 5) {
      return unavailableComponent(
        "Understanding quality",
        weight,
        "Public AI review evidence becomes useful after the first few paper notes."
      );
    }

    const completenessScores = context.activePapers.map((paper) => paper.noteCompleteness ?? estimateCompleteness(paper));
    if (completenessScores.length === 0) {
      return unavailableComponent("Understanding quality", weight, "No review or note-completeness evidence is available.");
    }

    return component({
      score: average(completenessScores),
      weight,
      available: true,
      confidence: 20,
      label: "Understanding quality",
      explanation: "Provisional estimate from note completeness; no public AI review has calibrated the written evidence yet.",
      evidence: [`${completenessScores.length} public note${completenessScores.length === 1 ? "" : "s"} assessed for completeness`]
    });
  }

  const weightedRecentReviewAverage = recencyWeightedAverage(reviews.map((review) => review.overallScore));
  const dimensionCoverageScore = average(
    reviews.map((review) => {
      const paper = paperBySlug.get(review.paperSlug);
      const required = getRequiredDimensions(paper);
      const covered = required.filter((key) => {
        const dimension = review.dimensions?.[key];
        return Boolean(dimension && (dimension.score > 0 || dimension.evidence?.trim()));
      }).length;
      return ratioScore(covered, required.length);
    })
  );
  const difficultyAdjustedEffort = average(
    reviews.map((review) => {
      const difficulty = paperBySlug.get(review.paperSlug)?.difficulty ?? 3;
      return clamp(review.overallScore + Math.max(0, difficulty - 3) * 4);
    })
  );
  const calibrationValues = reviews
    .map((review) => review.selfScoreComparison)
    .filter((comparison): comparison is NonNullable<PaperReview["selfScoreComparison"]> => Boolean(comparison))
    .map((comparison) => calibrationScore(Math.abs(comparison.userScore - comparison.aiScore)));
  const calibration = calibrationValues.length > 0 ? average(calibrationValues) : 50;
  const mismatchCount = reviews.filter((review) => isDeepMismatch(paperBySlug.get(review.paperSlug), review)).length;
  const vagueHighScoreCount = reviews.filter((review) => {
    const paper = paperBySlug.get(review.paperSlug);
    return review.overallScore >= 80 && (paper?.noteCompleteness ?? estimateCompleteness(paper)) < 40;
  }).length;
  const mismatchPenalty = Math.min(24, mismatchCount * 12 + vagueHighScoreCount * 10);
  const score = clamp(
    weightedAverage([
      [weightedRecentReviewAverage, 60],
      [dimensionCoverageScore, 20],
      [difficultyAdjustedEffort, 10],
      [calibration, 10]
    ]) - mismatchPenalty
  );

  return component({
    score,
    weight,
    available: true,
    confidence: clamp(ratioScore(reviews.length, 5) * 0.7 + dimensionCoverageScore * 0.3),
    label: "Understanding quality",
    explanation: "Uses recent public review evidence, depth-aware dimensions, difficulty, and self-score calibration.",
    evidence: [
      `${reviews.length} recent public review${reviews.length === 1 ? "" : "s"}`,
      `${round(dimensionCoverageScore)}% depth-aware dimension coverage`,
      calibrationValues.length > 0
        ? `${calibrationValues.length} self-score comparison${calibrationValues.length === 1 ? "" : "s"}`
        : "No self-score calibration evidence yet",
      ...(mismatchCount > 0 ? [`${mismatchCount} deep-label mismatch${mismatchCount === 1 ? "" : "es"} reduced the score`] : [])
    ]
  });
}

function computeRetrievalStrength(context: ScoreContext): MomentumComponent {
  const weight = MOMENTUM_COMPONENT_WEIGHTS.retrievalStrength;
  const exams = [...context.oralExams]
    .filter((exam) => normalizeDate(exam.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  if (exams.length === 0) {
    return unavailableComponent("Retrieval strength", weight, "No public oral exam evidence is available.");
  }

  const examScores = exams.map(getOralExamScore);
  const recentOralExamAverage = recencyWeightedAverage(examScores);
  const examCompletionRate = average(
    exams.map((exam) => {
      if (typeof exam.questionsAnswered === "number" && typeof exam.totalQuestions === "number" && exam.totalQuestions > 0) {
        return ratioScore(exam.questionsAnswered, exam.totalQuestions);
      }
      return exam.completed === false ? 0 : 100;
    })
  );
  const weakQuestionImprovement = getWeakQuestionImprovement(exams);
  const uncertaintyScores = exams
    .map((exam) => exam.uncertaintyScore)
    .filter((value): value is number => typeof value === "number")
    .map(normalizeScore);
  const uncertaintyQuality = uncertaintyScores.length > 0 ? average(uncertaintyScores) : 50;
  const score = weightedAverage([
    [recentOralExamAverage, 55],
    [examCompletionRate, 20],
    [weakQuestionImprovement.score, 15],
    [uncertaintyQuality, 10]
  ]);

  return component({
    score,
    weight,
    available: true,
    confidence: clamp(ratioScore(exams.length, 7) * 0.75 + ratioScore(uncertaintyScores.length, 3) * 0.25),
    label: "Retrieval strength",
    explanation: "Measures recent closed-book explanation, precision, completion, uncertainty quality, and recovery in weak question types.",
    evidence: [
      `${exams.length} recent oral exam${exams.length === 1 ? "" : "s"}`,
      `${round(examCompletionRate)}% exam completion evidence`,
      weakQuestionImprovement.evidence
    ]
  });
}

function computeResearchOutput(context: ScoreContext): MomentumComponent {
  const weight = MOMENTUM_COMPONENT_WEIGHTS.researchOutput;
  const subcomponents: Array<[number, number, string]> = [];
  const evidence: string[] = [];

  if (context.github.length > 0) {
    const recent = context.github.filter((day) => isWithinDays(day.date, context.today, 28) && day.count > 0);
    const activeDays = new Set(recent.map((day) => normalizeDate(day.date)).filter(isString)).size;
    const intensity = recent.length > 0
      ? average(recent.map((day) => (Math.sqrt(Math.min(4, Math.max(0, day.count))) / 2) * 100))
      : 0;
    const githubScore = weightedAverage([[ratioScore(activeDays, 12), 75], [intensity, 25]]);
    subcomponents.push([githubScore, 35, "GitHub active days"]);
    evidence.push(`${activeDays} GitHub active day${activeDays === 1 ? "" : "s"} in the last 28 days`);
  }

  if (context.implementations.length > 0 || context.projects.some((project) => project.updatedAt)) {
    const recentAttempts = context.implementations.filter((attempt) => isWithinDays(attempt.date, context.today, 90));
    const attemptUnits = recentAttempts.reduce((sum, attempt) => sum + getImplementationUnits(attempt), 0);
    const recentProjects = context.projects.filter((project) => isWithinDays(project.updatedAt, context.today, 90));
    const implementationScore = ratioScore(attemptUnits + recentProjects.length * 0.75, 4);
    subcomponents.push([implementationScore, 25, "Implementation attempts"]);
    evidence.push(
      `${recentAttempts.length} implementation attempt${recentAttempts.length === 1 ? "" : "s"} and ${recentProjects.length} dated project update${recentProjects.length === 1 ? "" : "s"} in 90 days`
    );
  }

  if (context.blogs.length > 0) {
    const recentPosts = context.blogs.filter((post) => isWithinDays(post.pubDate, context.today, 90));
    const writingUnits = recentPosts.reduce((sum, post) => sum + (post.sourcePaper ? 1.25 : 1), 0);
    subcomponents.push([ratioScore(writingUnits, 4), 20, "Writing output"]);
    evidence.push(`${recentPosts.length} public post${recentPosts.length === 1 ? "" : "s"} in the last 90 days`);
  }

  if (context.papers.length > 0 || context.blogs.length > 0 || context.implementations.length > 0) {
    const promotedPosts = context.blogs.filter((post) => Boolean(post.sourcePaper)).length;
    const connectedAttempts = context.implementations.filter(
      (attempt) => (attempt.relatedPapers?.length ?? 0) > 0 || (attempt.relatedProjects?.length ?? 0) > 0
    ).length;
    const projectLinkedPapers = context.papers.filter((paper) => Boolean(paper.projectUrl)).length;
    const connections = promotedPosts + connectedAttempts + projectLinkedPapers;
    subcomponents.push([ratioScore(connections, 4), 20, "Paper-to-project connections"]);
    evidence.push(`${connections} explicit paper-to-output connection${connections === 1 ? "" : "s"}`);
  }

  if (subcomponents.length === 0) {
    return unavailableComponent("Research output", weight, "No dated public output evidence is available.");
  }

  const availableSubweight = subcomponents.reduce((sum, [, subweight]) => sum + subweight, 0);
  const outputEvents = countRecentOutputEvents(context);
  return component({
    score: weightedAverage(subcomponents.map(([score, subweight]) => [score, subweight])),
    weight,
    available: true,
    confidence: clamp((availableSubweight / 100) * 70 + ratioScore(outputEvents, 8) * 0.3),
    label: "Research output",
    explanation: "Rewards active contribution days, written lessons, public writing, and explicit paper-to-project connections.",
    evidence
  });
}

function computeRevisitDiscipline(context: ScoreContext): MomentumComponent {
  const weight = MOMENTUM_COMPONENT_WEIGHTS.revisitDiscipline;
  const subcomponents: Array<[number, number]> = [];
  const evidence: string[] = [];

  if (context.reviewDueItems.length > 0) {
    const due = context.reviewDueItems.filter((item) => item.dueDate && item.dueDate <= context.today);
    const completedDue = due.filter((item) => Boolean(item.completedAt));
    const overdue = due.filter((item) => !item.completedAt && item.dueDate && item.dueDate < context.today);
    const recovered = completedDue.filter((item) => item.dueDate && item.completedAt && item.completedAt > item.dueDate);
    const completionRate = due.length > 0 ? ratioScore(completedDue.length, due.length) : 70;
    const recoveryScore = overdue.length > 0
      ? clamp(60 - overdue.length * 15 + recovered.length * 10)
      : recovered.length > 0
        ? 100
        : 75;
    subcomponents.push([completionRate, 45], [recoveryScore, 10]);
    evidence.push(
      due.length > 0
        ? `${completedDue.length} of ${due.length} due review${due.length === 1 ? "" : "s"} completed`
        : "Review dates exist, but none are due yet"
    );
    if (overdue.length > 0) evidence.push(`${overdue.length} review${overdue.length === 1 ? " is" : "s are"} overdue`);
  }

  if (context.formulaRecalls.length > 0) {
    const recent = context.formulaRecalls.filter(
      (attempt) => attempt.completed !== false && isWithinDays(attempt.date, context.today, 28)
    );
    subcomponents.push([ratioScore(recent.length, 4), 25]);
    evidence.push(`${recent.length} formula recall attempt${recent.length === 1 ? "" : "s"} in 28 days`);
  }

  if (context.questionPractice.length > 0) {
    const recent = context.questionPractice.filter((attempt) => isWithinDays(attempt.date, context.today, 28));
    subcomponents.push([ratioScore(recent.length, 6), 20]);
    evidence.push(`${recent.length} question practice attempt${recent.length === 1 ? "" : "s"} in 28 days`);
  }

  if (subcomponents.length === 0) {
    return unavailableComponent("Revisit discipline", weight, "No committed review, formula recall, or question practice evidence is available.");
  }

  return component({
    score: weightedAverage(subcomponents),
    weight,
    available: true,
    confidence: clamp(ratioScore(context.reviewDueItems.length + context.formulaRecalls.length + context.questionPractice.length, 8)),
    label: "Revisit discipline",
    explanation: "Rewards due-review completion, formula recall, question practice, and recovery from overdue reviews.",
    evidence
  });
}

function computeBalanceIntegrity(
  context: ScoreContext,
  preliminary: Record<Exclude<ComponentKey, "balanceIntegrity">, MomentumComponent>
): MomentumComponent {
  const weight = MOMENTUM_COMPONENT_WEIGHTS.balanceIntegrity;
  const categoryDates = getRecentActivityCategoryDates(context);
  const activeCategories = [...categoryDates.values()].filter((dates) => dates.size > 0).length;
  const eventsByDate = getEventsByDate(categoryDates);
  const totalEvents = [...eventsByDate.values()].reduce((sum, count) => sum + count, 0);

  if (totalEvents === 0 && !Object.values(preliminary).some((item) => item.available)) {
    return unavailableComponent("Balance & integrity", weight, "No activity evidence is available to assess balance.");
  }

  const activityDiversityScore = ratioScore(activeCategories, 6);
  const deepPapers = context.activePapers.filter(isDeepPaper);
  const reviewBySlug = new Map(context.reviews.map((review) => [review.paperSlug, review]));
  const depthHonestyScore = deepPapers.length === 0
    ? 75
    : average(
        deepPapers.map((paper) => {
          const completeness = paper.noteCompleteness ?? estimateCompleteness(paper);
          const review = reviewBySlug.get(paper.slug);
          if (!review) return completeness;
          const method = normalizeDimensionScore(review.dimensions?.methodUnderstanding?.score);
          const formula = normalizeDimensionScore(review.dimensions?.formulaUnderstanding?.score);
          return average([completeness, method, formula]);
        })
      );
  const antiBurstScore = getAntiBurstScore(eventsByDate);
  const availableCoreWeight = Object.values(preliminary)
    .filter((item) => item.available)
    .reduce((sum, item) => sum + item.weight, 0);
  const evidenceCompletenessScore = ratioScore(availableCoreWeight, 90);
  const score = weightedAverage([
    [activityDiversityScore, 35],
    [depthHonestyScore, 25],
    [antiBurstScore, 20],
    [evidenceCompletenessScore, 20]
  ]);

  return component({
    score,
    weight,
    available: true,
    confidence: clamp(activityDiversityScore * 0.6 + ratioScore(totalEvents, 12) * 0.4),
    label: "Balance & integrity",
    explanation: "Checks activity diversity, honest depth labels, burstiness, and how much evidence supports the dashboard.",
    evidence: [
      `${activeCategories} of 6 activity categories represented in 28 days`,
      `${totalEvents} category-day evidence point${totalEvents === 1 ? "" : "s"}`,
      `${round(evidenceCompletenessScore)}% weighted component coverage before balance`
    ]
  });
}

function computeConfidence(
  context: ScoreContext,
  components: MomentumResult["components"],
  antiGamingFlags: string[]
): MomentumResult["confidence"] {
  const availableWeight = Object.values(components)
    .filter((item) => item.available)
    .reduce((sum, item) => sum + item.weight, 0);
  const evidenceCoverage = ratioScore(availableWeight, 100);
  const categories = getRecentActivityCategoryDates(context);
  const activeCategories = [...categories.values()].filter((dates) => dates.size > 0).length;
  const recencyCoverage = ratioScore(activeCategories, 6);
  const activityDiversityCoverage = recencyCoverage;
  const sampleSizeCoverage = average([
    ratioScore(context.papers.length, 10),
    ratioScore(context.reviews.length, 5),
    ratioScore(context.oralExams.length, 4),
    ratioScore(countRecentOutputEvents(context), 8),
    ratioScore(context.reviewDueItems.length + context.formulaRecalls.length + context.questionPractice.length, 8)
  ]);
  let score = weightedAverage([
    [evidenceCoverage, 35],
    [recencyCoverage, 25],
    [activityDiversityCoverage, 20],
    [sampleSizeCoverage, 20]
  ]);

  if (context.papers.length >= 5 && context.reviews.length === 0) score -= 10;
  if (context.papers.length >= 10 && context.oralExams.length === 0) score -= 18;
  score -= Math.min(12, antiGamingFlags.length * 3);
  score = round(clamp(score));

  const reasons = [
    `${Object.values(components).filter((item) => item.available).length} of 6 components have usable public evidence.`,
    `${activeCategories} of 6 research-loop categories have activity in the last 28 days.`
  ];
  if (context.papers.length < 5) reasons.push("The paper sample is still small, so the score is provisional.");
  if (context.papers.length >= 5 && context.reviews.length === 0) reasons.push("Understanding has no public AI review calibration.");
  if (context.papers.length >= 10 && context.oralExams.length === 0) reasons.push("A mature paper log without oral exam evidence substantially lowers confidence.");
  if (antiGamingFlags.length > 0) reasons.push("Capped or mismatched activity reduced confidence in the raw evidence.");

  return {
    score,
    label: score < 50 ? "low" : score < 75 ? "medium" : "high",
    reasons
  };
}

function collectAntiGamingFlags(context: ScoreContext): string[] {
  const flags: string[] = [];
  const paperCounts = countByDate(
    context.activePapers
      .filter((paper) => isWithinDays(paper.readDate, context.today, 28))
      .map((paper) => paper.readDate)
  );
  if ([...paperCounts.values()].some((count) => count > 2)) {
    flags.push("Paper volume above two logs per day was capped for consistency evidence.");
  }
  if (context.github.some((day) => isWithinDays(day.date, context.today, 28) && day.count > 4)) {
    flags.push("High single-day GitHub volume was capped at four contribution units.");
  }

  const reviewBySlug = new Map(context.reviews.map((review) => [review.paperSlug, review]));
  const deepMismatchCount = context.activePapers.filter((paper) => isDeepMismatch(paper, reviewBySlug.get(paper.slug))).length;
  if (deepMismatchCount > 0) {
    flags.push(`${deepMismatchCount} deep label${deepMismatchCount === 1 ? " lacks" : "s lack"} matching method, formula, or note evidence.`);
  }

  const highVagueReviews = [...context.reviews]
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt))
    .slice(0, 10)
    .filter((review) => {
      const paper = context.papers.find((item) => item.slug === review.paperSlug);
      return review.overallScore >= 80 && (paper?.noteCompleteness ?? estimateCompleteness(paper)) < 40;
    }).length;
  if (highVagueReviews > 0) {
    flags.push(`${highVagueReviews} high review score${highVagueReviews === 1 ? " has" : "s have"} limited note evidence.`);
  }

  const categoryDates = getRecentActivityCategoryDates(context);
  const eventsByDate = getEventsByDate(categoryDates);
  const totalEvents = [...eventsByDate.values()].reduce((sum, value) => sum + value, 0);
  const maximum = Math.max(0, ...eventsByDate.values());
  if (totalEvents >= 4 && maximum / totalEvents > 0.5) {
    flags.push("More than half of recent category activity is concentrated on one day.");
  }

  return flags;
}

function collectMissingEvidence(context: ScoreContext): string[] {
  const missing: string[] = [];
  if (context.activePapers.length === 0) missing.push("No active public paper reading dates are available.");
  if (context.reviews.length === 0) {
    missing.push(
      context.papers.length >= 5
        ? "No public AI reviews are available for a mature enough paper sample; understanding remains weakly calibrated."
        : "No public AI review evidence is available yet."
    );
  }
  if (context.oralExams.length === 0) {
    missing.push(
      context.papers.length >= 10
        ? "Ten or more paper logs exist without oral exam evidence; retrieval confidence is significantly reduced."
        : "No public oral exam evidence is available yet."
    );
  }
  if (context.github.length === 0) missing.push("No day-level GitHub contribution evidence is connected.");
  if (context.implementations.length === 0) missing.push("No public implementation attempts are recorded.");
  if (context.reviewDueItems.length + context.formulaRecalls.length + context.questionPractice.length === 0) {
    missing.push("No committed revisit, formula recall, or question practice evidence is available.");
  }
  return missing;
}

function buildNextActions(
  context: ScoreContext,
  components: MomentumResult["components"],
  antiGamingFlags: string[]
): string[] {
  const actions: string[] = [];
  if (context.activePapers.length === 0) {
    actions.push("Log one honest 20-minute pass with a read date, core question, and next action.");
  }
  if (context.papers.length >= 5 && context.reviews.length === 0) {
    actions.push("Review one representative paper note to calibrate written understanding evidence.");
  }
  if (context.papers.length >= 10 && context.oralExams.length === 0) {
    actions.push("Run one short oral recall session and record uncertainty explicitly.");
  }
  if (antiGamingFlags.some((flag) => flag.includes("deep label"))) {
    actions.push("Repair one deep note with concrete method, formula, or experiment evidence before adding more depth labels.");
  }

  const weakest = Object.values(components)
    .filter((item) => item.available)
    .sort((a, b) => a.score - b.score)[0];
  if (weakest) actions.push(actionForComponent(weakest.label));

  const missingPriority: Array<[ComponentKey, string]> = [
    ["retrievalStrength", "Add one closed-book oral exam or retrieval record."],
    ["revisitDiscipline", "Complete one due review, formula recall, or question practice attempt."],
    ["researchOutput", "Turn one reading note into a written implementation lesson or short post."],
    ["understandingQuality", "Add review evidence to one paper note without changing its honest reading depth."],
    ["readingConsistency", "Schedule the next short reading pass on a different day this week."]
  ];
  for (const [key, action] of missingPriority) {
    if (!components[key].available) actions.push(action);
  }

  return [...new Set(actions)].slice(0, 3);
}

function actionForComponent(label: string): string {
  const actions: Record<string, string> = {
    "Reading consistency": "Spread the next two paper passes across separate days instead of increasing same-day volume.",
    "Understanding quality": "Strengthen one note with exact method or experiment evidence at its current reading depth.",
    "Retrieval strength": "Explain one paper from memory and record what remains uncertain.",
    "Research output": "Connect one paper to a small implementation attempt or concise technical post.",
    "Revisit discipline": "Clear the oldest due review before opening another deep reading loop.",
    "Balance & integrity": "Choose a next action from a research-loop category that was absent this month."
  };
  return actions[label] ?? "Choose one small action that adds stronger evidence to the weakest research loop.";
}

function getMomentumLevel(score: number): MomentumLevel {
  if (score <= 39) return "seed";
  if (score <= 59) return "building";
  if (score <= 74) return "steady";
  if (score <= 89) return "strong";
  return "compounding";
}

function getDepthAppropriateness(paper: Paper): number {
  const scores: Record<Paper["status"], Partial<Record<Paper["depth"], number>>> = {
    planned: { skim: 100 },
    pass1: { skim: 100, understand: 85, deep: 50, reproduce: 35, implement: 35 },
    pass2: { skim: 70, understand: 100, deep: 85, reproduce: 65, implement: 65 },
    pass3: { skim: 40, understand: 70, deep: 100, reproduce: 100, implement: 95 },
    read: { skim: 60, understand: 90, deep: 100, reproduce: 100, implement: 100 },
    implemented: { skim: 35, understand: 55, deep: 80, reproduce: 100, implement: 100 },
    abandoned: { skim: 100, understand: 100, deep: 100, reproduce: 100, implement: 100 }
  };
  return scores[paper.status][paper.depth] ?? 60;
}

function getRequiredDimensions(paper?: Paper): string[] {
  const pass1 = ["problemFraming", "coreIdea", "threePassDiscipline", "noteQuality"];
  if (!paper || paper.status === "pass1" || paper.depth === "skim") return pass1;
  const pass2 = [...pass1, "methodUnderstanding", "experimentUnderstanding"];
  if (paper.status === "pass2" || paper.depth === "understand") return pass2;
  return [...pass2, "formulaUnderstanding", "criticalThinking", "researchConnection", "retrievalReadiness"];
}

function isDeepPaper(paper: Paper): boolean {
  return paper.status === "pass3" || paper.status === "implemented" || ["deep", "reproduce", "implement"].includes(paper.depth);
}

function isDeepMismatch(paper?: Paper, review?: PaperReview): boolean {
  if (!paper || !isDeepPaper(paper)) return false;
  const completeness = paper.noteCompleteness ?? estimateCompleteness(paper);
  if (!review) return completeness < 55;
  const method = normalizeDimensionScore(review.dimensions?.methodUnderstanding?.score);
  const formula = normalizeDimensionScore(review.dimensions?.formulaUnderstanding?.score);
  return completeness < 55 || method < 50 || formula < 45;
}

function getOralExamScore(exam: OralExamScore): number {
  if (typeof exam.overallScore === "number") return normalizeScore(exam.overallScore);
  const scores = [exam.retrievalScore, exam.explanationScore, exam.precisionScore]
    .filter((value): value is number => typeof value === "number")
    .map(normalizeScore);
  return scores.length > 0 ? average(scores) : 0;
}

function getWeakQuestionImprovement(exams: OralExamScore[]): { score: number; evidence: string } {
  const byType = new Map<string, Array<{ date: string; score: number }>>();
  for (const exam of exams) {
    for (const [type, value] of Object.entries(exam.questionTypeScores ?? {})) {
      byType.set(type, [...(byType.get(type) ?? []), { date: exam.date, score: normalizeScore(value) }]);
    }
  }

  const improvements = [...byType.entries()]
    .map(([type, values]) => {
      const sorted = [...values].sort((a, b) => a.date.localeCompare(b.date));
      if (sorted.length < 2 || sorted[0].score >= 70) return undefined;
      return { type, delta: sorted.at(-1)!.score - sorted[0].score };
    })
    .filter((item): item is { type: string; delta: number } => Boolean(item));

  if (improvements.length === 0) {
    return { score: 50, evidence: "Not enough repeated weak-question evidence to measure improvement" };
  }

  const best = [...improvements].sort((a, b) => b.delta - a.delta)[0];
  return {
    score: clamp(50 + average(improvements.map((item) => item.delta)) * 2),
    evidence: `${best.type} improved by ${round(best.delta)} points across recorded exams`
  };
}

function getImplementationUnits(attempt: Implementation): number {
  if (["planned", "abandoned"].includes(attempt.status)) return 0;
  if (["reproduced", "shipped"].includes(attempt.status)) return 1.25;
  if (attempt.status === "failed") {
    return (attempt.lessons?.length ?? 0) > 0 || Boolean(attempt.result || attempt.failureReason) ? 1 : 0.25;
  }
  return 1;
}

function getRecentActivityCategoryDates(context: ScoreContext): Map<ActivityCategory, Set<string>> {
  const categories = new Map<ActivityCategory, Set<string>>([
    ["reading", new Set()],
    ["review", new Set()],
    ["oral-exam", new Set()],
    ["revisit", new Set()],
    ["implementation", new Set()],
    ["writing", new Set()]
  ]);
  addRecentDates(categories.get("reading")!, context.activePapers.map((paper) => paper.readDate), context.today);
  addRecentDates(categories.get("review")!, context.reviews.map((review) => review.reviewedAt), context.today);
  addRecentDates(categories.get("oral-exam")!, context.oralExams.map((exam) => exam.date), context.today);
  addRecentDates(
    categories.get("revisit")!,
    [
      ...context.reviewDueItems.map((item) => item.completedAt),
      ...context.formulaRecalls.map((attempt) => attempt.date),
      ...context.questionPractice.map((attempt) => attempt.date)
    ],
    context.today
  );
  addRecentDates(categories.get("implementation")!, context.implementations.map((attempt) => attempt.date), context.today);
  addRecentDates(categories.get("writing")!, context.blogs.map((post) => post.pubDate), context.today);
  return categories;
}

function addRecentDates(target: Set<string>, values: Array<string | undefined>, today: string) {
  for (const value of values) {
    const date = normalizeDate(value);
    if (date && isWithinDays(date, today, 28)) target.add(date);
  }
}

function getEventsByDate(categories: Map<ActivityCategory, Set<string>>): Map<string, number> {
  const events = new Map<string, number>();
  for (const dates of categories.values()) {
    for (const date of dates) events.set(date, (events.get(date) ?? 0) + 1);
  }
  return events;
}

function getAntiBurstScore(eventsByDate: Map<string, number>): number {
  const total = [...eventsByDate.values()].reduce((sum, value) => sum + value, 0);
  if (total === 0) return 0;
  if (total <= 2) return 55;
  const maximumShare = Math.max(...eventsByDate.values()) / total;
  return clamp(100 - (Math.max(0, maximumShare - 0.25) / 0.75) * 100);
}

function countRecentOutputEvents(context: ScoreContext): number {
  return (
    new Set(context.github.filter((day) => day.count > 0 && isWithinDays(day.date, context.today, 28)).map((day) => normalizeDate(day.date))).size +
    context.blogs.filter((post) => isWithinDays(post.pubDate, context.today, 90)).length +
    context.implementations.filter((attempt) => isWithinDays(attempt.date, context.today, 90)).length +
    context.projects.filter((project) => isWithinDays(project.updatedAt, context.today, 90)).length
  );
}

function getWeeklyDistributionScore(activeDates: Set<string>, today: string): number {
  const weeklyActiveDays = [0, 0, 0, 0];
  for (const date of activeDates) {
    const age = differenceInDays(today, date);
    if (age >= 0 && age < 28) weeklyActiveDays[Math.floor(age / 7)] += 1;
  }
  return average(weeklyActiveDays.map((days) => ratioScore(days, 4)));
}

function getCurrentStreak(activeDates: Set<string>, today: string): number {
  let cursor = today;
  if (!activeDates.has(cursor)) cursor = addDays(cursor, -1);
  let streak = 0;
  while (activeDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function estimateCompleteness(paper?: Paper): number {
  if (!paper) return 0;
  const wordScore = ratioScore(paper.noteWordCount ?? 0, isDeepPaper(paper) ? 500 : paper.status === "pass2" ? 250 : 100);
  const depthScore = getDepthAppropriateness(paper);
  return clamp(wordScore * 0.8 + depthScore * 0.2);
}

function normalizeDimensionScore(score?: number): number {
  return typeof score === "number" ? normalizeScore(score) : 0;
}

function normalizeScore(score: number): number {
  return clamp(score <= 10 ? score * 10 : score);
}

function calibrationScore(difference: number): number {
  if (difference <= 5) return 100;
  if (difference <= 10) return 85;
  if (difference <= 20) return 65;
  if (difference <= 30) return 40;
  return 15;
}

function countByDate(values: Array<string | undefined>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const date = normalizeDate(value);
    if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return counts;
}

function component(input: MomentumComponent): MomentumComponent {
  return {
    ...input,
    score: round(clamp(input.score)),
    confidence: round(clamp(input.confidence))
  };
}

function unavailableComponent(label: string, weight: number, explanation: string): MomentumComponent {
  return {
    score: 0,
    weight,
    available: false,
    confidence: 0,
    label,
    explanation,
    evidence: []
  };
}

function weightedAverage(values: Array<[number, number]>): number {
  const totalWeight = values.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight === 0) return 0;
  return values.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight;
}

function recencyWeightedAverage(values: number[]): number {
  return weightedAverage(values.map((value, index) => [value, index + 1]));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ratioScore(value: number, target: number): number {
  if (target <= 0) return 0;
  return clamp((value / target) * 100);
}

function isWithinDays(value: string | undefined, today: string, days: number): boolean {
  const date = normalizeDate(value);
  if (!date) return false;
  const difference = differenceInDays(today, date);
  return difference >= 0 && difference < days;
}

function differenceInDays(later: string, earlier: string): number {
  return Math.floor((dateKeyToTime(later) - dateKeyToTime(earlier)) / DAY_MS);
}

function addDays(dateKey: string, days: number): string {
  const date = new Date(dateKeyToTime(dateKey));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateKeyToTime(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function normalizeDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
}

function isPublic(visibility?: string): boolean {
  return (visibility ?? "public") === "public";
}

function isString(value: string | undefined): value is string {
  return typeof value === "string";
}

function clamp(value: number, minimum = 0, maximum = 100): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number): number {
  return Math.round(value);
}
