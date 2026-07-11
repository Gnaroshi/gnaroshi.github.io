export const projectFacts = [
  {
    id: "gnaroshi-vla",
    slug: "gnaroshi-vla",
    status: "active",
    featured: true,
    contentStage: "working",
    metricEligible: false,
    graphEligible: false,
    weeklyReviewEligible: false,
    updatedAt: "2026-07-11",
    tags: ["vision-language-action", "research-infrastructure", "reproducibility"],
    artworkId: "projectGnaroshiVla",
    codeLanguages: ["Python", "Shell", "YAML"],
    verifiedProperties: [
      "architecture-neutral-workspace",
      "architecture-method-environment-results-separation",
      "seer-adapter",
      "simvla-adapter",
      "explicit-run-context",
      "explicit-result-directories"
    ],
    links: [
      { id: "repository", href: "https://github.com/Gnaroshi/gnaroshi_vla" }
    ]
  },
  {
    id: "gnaroshi-dev",
    slug: "gnaroshi-dev",
    status: "active",
    featured: false,
    contentStage: "working",
    metricEligible: false,
    graphEligible: false,
    weeklyReviewEligible: false,
    updatedAt: "2026-07-11",
    tags: ["astro", "content-projection", "research-workflow"],
    artworkId: "projectGnaroshiDev",
    codeLanguages: ["TypeScript", "Astro"],
    verifiedProperties: [
      "private-canonical-sources",
      "deterministic-public-feed",
      "presentation-only-astro",
      "bilingual-routes",
      "evidence-gated-metrics",
      "github-pages-deployment"
    ],
    links: [
      { id: "repository", href: "https://github.com/Gnaroshi/gnaroshi.github.io" },
      { id: "live-site", href: "https://gnaroshi.dev" }
    ]
  }
] as const;

export type ProjectFact = (typeof projectFacts)[number];
