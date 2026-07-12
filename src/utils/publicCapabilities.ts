import { getContentFeedManifest, readContentFeedJson } from "./contentFeed";

export type PublicCapabilities = {
  hasWriting: boolean;
  hasPapers: boolean;
  hasReadingActivity: boolean;
  hasReviews: boolean;
  hasOralExams: boolean;
  hasFormulaRecall: boolean;
  hasImplementations: boolean;
  hasWeeklyReviews: boolean;
  hasResearchGraph: boolean;
  hasEligibleGrowth: boolean;
};

export type PublicCapabilityEvidence = {
  counts: Partial<Record<
    | "blogPosts"
    | "papers"
    | "readingSessions"
    | "reviews"
    | "oralExams"
    | "formulaRecalls"
    | "implementations"
    | "weeklyReviews"
    | "graphNodes"
    | "graphEdges",
    number
  >>;
  metricEligible?: boolean;
  graphEligible?: boolean;
  weeklyReviewEligible?: boolean;
  growthScore?: number | null;
  graph?: { eligible?: boolean; eligibilityThreshold?: number; nodes?: unknown[]; edges?: unknown[] } | null;
};

function count(evidence: PublicCapabilityEvidence, key: keyof PublicCapabilityEvidence["counts"]): number {
  return Math.max(0, evidence.counts[key] ?? 0);
}

export function derivePublicCapabilities(evidence: PublicCapabilityEvidence): PublicCapabilities {
  const graphNodes = count(evidence, "graphNodes");
  const graphEdges = count(evidence, "graphEdges");
  const graphThreshold = Math.max(1, evidence.graph?.eligibilityThreshold ?? 1);
  const graphHasEvidence =
    evidence.graphEligible === true &&
    evidence.graph?.eligible === true &&
    graphNodes >= graphThreshold &&
    graphNodes === (evidence.graph?.nodes?.length ?? 0) &&
    graphEdges > 0 &&
    graphEdges === (evidence.graph?.edges?.length ?? 0);

  return {
    hasWriting: count(evidence, "blogPosts") > 0,
    hasPapers: count(evidence, "papers") > 0,
    hasReadingActivity: count(evidence, "readingSessions") > 0,
    hasReviews: count(evidence, "reviews") > 0,
    hasOralExams: count(evidence, "oralExams") > 0,
    hasFormulaRecall: count(evidence, "formulaRecalls") > 0,
    hasImplementations: count(evidence, "implementations") > 0,
    hasWeeklyReviews: count(evidence, "weeklyReviews") > 0 && evidence.weeklyReviewEligible === true,
    hasResearchGraph: graphHasEvidence,
    hasEligibleGrowth: evidence.metricEligible === true && typeof evidence.growthScore === "number"
  };
}

export function getPublicCapabilities(): PublicCapabilities {
  const manifest = getContentFeedManifest();
  const growth = readContentFeedJson<{ metricEligible?: boolean; score?: number | null } | null>("data/growth-snapshot.json", null);
  const graph = readContentFeedJson<PublicCapabilityEvidence["graph"]>("data/research-graph.json", null);

  return derivePublicCapabilities({
    counts: manifest.counts,
    metricEligible: manifest.metricEligible === true && growth?.metricEligible === true,
    graphEligible: manifest.graphEligible,
    weeklyReviewEligible: manifest.weeklyReviewEligible,
    growthScore: growth?.score ?? null,
    graph
  });
}
