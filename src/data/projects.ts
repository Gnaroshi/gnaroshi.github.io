export const projects = [
  {
    slug: "gnaroshi-dev",
    title: "gnaroshi.dev",
    summary:
      "A static personal research site that keeps technical writing, paper notes, retrieval practice, and implementation logs in one versioned workflow.",
    status: "active",
    featured: true,
    contentStage: "working",
    metricEligible: false,
    graphEligible: false,
    weeklyReviewEligible: false,
    updatedAt: "2026-07-10",
    tags: ["astro", "mdx", "research-workflow"],
    problem:
      "Research notes are easy to scatter across reading lists, private documents, code repositories, and short-lived task trackers. The project tests whether one static, versioned site can preserve that context without adding a database or admin system.",
    role: "Product design, information architecture, implementation, and maintenance.",
    decisions: [
      "Use Markdown and MDX as the durable source for writing and paper notes.",
      "Keep the public site static and make optional AI features degrade to manual prompts.",
      "Separate evidence of work from seed content so early scaffolding cannot inflate research metrics.",
      "Use React only for focused interactions such as filters, practice sessions, and mobile navigation."
    ],
    architecture: [
      "Astro generates the public site and content detail pages.",
      "Content collections validate blog, paper, queue, project, and implementation metadata.",
      "Build-time utilities derive activity, review schedules, evidence eligibility, and graph data.",
      "GitHub Actions publishes the static output to GitHub Pages at the custom domain."
    ],
    implementation: [
      "A typography-led editorial layer for identity, research, projects, and writing.",
      "A compact Paper Lab for reading, review, retrieval, and implementation workflows.",
      "Local-first scripts for creating paper notes, importing AI reviews, and generating weekly or graph summaries."
    ],
    result:
      "The site is deployed at gnaroshi.dev, builds without API credentials, and keeps its core publishing and paper workflows in version-controlled files.",
    lessons: [
      "An empty tool should reveal one useful next action instead of a complete dashboard shell.",
      "Derived metrics need explicit eligibility rules before they become public claims.",
      "A personal research site benefits from editorial hierarchy more than from feature density."
    ],
    relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
    links: [
      { label: "Repository", href: "https://github.com/Gnaroshi/gnaroshi.github.io" },
      { label: "Live site", href: "https://gnaroshi.dev" }
    ]
  }
] as const;

export type Project = (typeof projects)[number];
