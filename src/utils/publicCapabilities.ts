import { evidenceGates } from "../config/evidenceGates";
import { getContentFeedManifest, readContentFeedJson, type ContentFeedManifest } from "./contentFeed";

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

type GrowthSnapshot = {
  metricEligible?: boolean;
  score?: number | null;
} | null;

type ResearchGraph = {
  eligible?: boolean;
  eligibilityThreshold?: number;
  nodes?: unknown[];
  edges?: Array<{ relation?: string }>;
} | null;

export type PublicCapabilityInputs = {
  manifest: Pick<ContentFeedManifest, "counts" | "metricEligible" | "graphEligible" | "weeklyReviewEligible">;
  growthSnapshot: GrowthSnapshot;
  researchGraph: ResearchGraph;
};

const countAboveZero = (counts: Record<string, number>, key: string) => (counts[key] ?? 0) > 0;

export function derivePublicCapabilities({ manifest, growthSnapshot, researchGraph }: PublicCapabilityInputs): PublicCapabilities {
  const meaningfulEdges = researchGraph?.edges?.filter((edge) => !["tagged", "relates-to"].includes(edge.relation ?? "")).length ?? 0;
  const graphEdgeThreshold = Math.max(
    evidenceGates.researchGraph.minimumNonTagEdges,
    researchGraph?.eligibilityThreshold ?? 0
  );

  return {
    hasWriting: countAboveZero(manifest.counts, "blogPosts"),
    hasPapers: countAboveZero(manifest.counts, "papers"),
    hasReadingActivity: countAboveZero(manifest.counts, "readingSessions"),
    hasReviews: countAboveZero(manifest.counts, "reviews"),
    hasOralExams: countAboveZero(manifest.counts, "oralExams"),
    hasFormulaRecall: countAboveZero(manifest.counts, "formulaRecalls"),
    hasImplementations: countAboveZero(manifest.counts, "implementations"),
    hasWeeklyReviews: countAboveZero(manifest.counts, "weeklyReviews") && manifest.weeklyReviewEligible,
    hasResearchGraph: Boolean(
      manifest.graphEligible
      && researchGraph?.eligible
      && (researchGraph.nodes?.length ?? 0) >= evidenceGates.researchGraph.minimumMeaningfulNodes
      && meaningfulEdges >= graphEdgeThreshold
    ),
    hasEligibleGrowth: Boolean(
      manifest.metricEligible
      && growthSnapshot?.metricEligible
      && typeof growthSnapshot.score === "number"
      && Number.isFinite(growthSnapshot.score)
    )
  };
}

export function getPublicCapabilities(): PublicCapabilities {
  return derivePublicCapabilities({
    manifest: getContentFeedManifest(),
    growthSnapshot: readContentFeedJson<GrowthSnapshot>("data/growth-snapshot.json", null),
    researchGraph: readContentFeedJson<ResearchGraph>("data/research-graph.json", null)
  });
}
