export const evidenceGates = {
  momentum: {
    minimumEvents: 5,
    minimumActiveDates: 3,
    minimumCategories: 2,
    coreCategories: ["reading", "retrieval", "revisit", "implementation"]
  },
  weeklyReview: {
    minimumMeaningfulEvents: 2
  },
  researchGraph: {
    minimumMeaningfulNodes: 5,
    minimumNonTagEdges: 3
  },
  paperLab: {
    filtersAt: 3,
    aiReviewSummaryAt: 2,
    retrievalTrendAt: 3,
    longitudinalWeeksAt: 4
  },
  blog: {
    discoveryToolsAt: 6,
    archiveAt: 12
  }
} as const;

export type EvidenceCategory = "reading" | "review" | "retrieval" | "revisit" | "implementation" | "writing";
