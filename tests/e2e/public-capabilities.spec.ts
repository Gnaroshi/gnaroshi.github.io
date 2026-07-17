import { expect, test } from "@playwright/test";
import { getPaperLabNavigation, getPrimaryNavigation, getUtilityNavigation } from "../../src/i18n/routes";
import { derivePublicCapabilities, type PublicCapabilityEvidence } from "../../src/utils/publicCapabilities";

const emptyEvidence: PublicCapabilityEvidence = {
  counts: {},
  metricEligible: false,
  graphEligible: false,
  weeklyReviewEligible: false,
  growthScore: null,
  graph: null
};

const graph = {
  eligible: true,
  eligibilityThreshold: 1,
  nodes: [{ id: "paper" }, { id: "post" }],
  edges: [{ source: "post", target: "paper" }]
};

const fixtures: Array<{ name: string; evidence: PublicCapabilityEvidence; localCount: number; writing: boolean; growth: boolean }> = [
  { name: "bootstrap empty", evidence: emptyEvidence, localCount: 2, writing: false, growth: false },
  { name: "writing only", evidence: { ...emptyEvidence, counts: { blogPosts: 1 } }, localCount: 2, writing: true, growth: false },
  { name: "one paper", evidence: { ...emptyEvidence, counts: { papers: 1 } }, localCount: 3, writing: false, growth: false },
  { name: "paper and review", evidence: { ...emptyEvidence, counts: { papers: 1, reviews: 1 } }, localCount: 5, writing: false, growth: false },
  { name: "paper and oral exam", evidence: { ...emptyEvidence, counts: { papers: 1, oralExams: 1 } }, localCount: 4, writing: false, growth: false },
  { name: "paper and implementation", evidence: { ...emptyEvidence, counts: { papers: 1, implementations: 1 } }, localCount: 4, writing: false, growth: false },
  { name: "eligible growth", evidence: { ...emptyEvidence, counts: { papers: 1, readingSessions: 4 }, metricEligible: true, growthScore: 61 }, localCount: 4, writing: false, growth: true },
  { name: "eligible graph", evidence: { ...emptyEvidence, counts: { papers: 1, graphNodes: 2, graphEdges: 1 }, graphEligible: true, graph }, localCount: 4, writing: false, growth: false },
  {
    name: "full public system",
    evidence: {
      counts: { blogPosts: 2, papers: 3, readingSessions: 6, reviews: 2, oralExams: 1, formulaRecalls: 1, implementations: 1, weeklyReviews: 1, graphNodes: 2, graphEdges: 1 },
      metricEligible: true,
      graphEligible: true,
      weeklyReviewEligible: true,
      growthScore: 72,
      graph
    },
    localCount: 8,
    writing: true,
    growth: true
  }
];

for (const fixture of fixtures) {
  test(`${fixture.name} reveals the same capabilities in English and Korean`, () => {
    const capabilities = derivePublicCapabilities(fixture.evidence);
    const enPrimary = getPrimaryNavigation("en", capabilities);
    const koPrimary = getPrimaryNavigation("ko", capabilities);
    const enLocal = getPaperLabNavigation("en", capabilities);
    const koLocal = getPaperLabNavigation("ko", capabilities);

    expect(enPrimary.some((item) => item.href === "/blog/")).toBe(fixture.writing);
    expect(koPrimary.some((item) => item.href === "/ko/blog/")).toBe(fixture.writing);
    expect(getUtilityNavigation("en", capabilities).length > 0).toBe(fixture.growth);
    expect(getUtilityNavigation("ko", capabilities).length > 0).toBe(fixture.growth);
    expect(enLocal).toHaveLength(fixture.localCount);
    expect(koLocal).toHaveLength(fixture.localCount);
    expect(koLocal.map((item) => item.href.replace(/^\/ko/, ""))).toEqual(enLocal.map((item) => item.href));
  });
}
