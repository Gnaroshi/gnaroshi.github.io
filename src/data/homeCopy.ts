export const homeCopy = {
  seo: {
    title: "Gnaroshi — Research Cockpit",
    description:
      "A public research cockpit for papers, notes, experiments, and AI-assisted reflection.",
    openGraphDescription:
      "Paper logs, research notes, oral exams, implementation attempts, and growth tracking."
  },
  hero: {
    eyebrow: "gnaroshi.dev",
    title:
      "A public research cockpit for papers, notes, experiments, and AI-assisted reflection.",
    subtitle:
      "I study AI systems and build workflows that turn daily reading into reusable technical memory.",
    description:
      "This site is my living workspace: paper logs, research notes, oral exams, implementation attempts, and the small loops that make understanding compound.",
    primaryCta: "Open Paper Log",
    secondaryCta: "View Growth Dashboard",
    links: [
      { label: "Read Blog", href: "/blog" },
      { label: "See Projects", href: "/projects" },
      { label: "GitHub", href: "https://github.com/Gnaroshi" }
    ]
  },
  today: {
    title: "Today’s research loop",
    steps: [
      "Read one paper.",
      "Explain it from memory.",
      "Take an AI oral exam.",
      "Commit the note.",
      "Revisit what was weak."
    ],
    emptyTitle: "The first square is waiting.",
    emptyDescription: "Start with one 20-minute pass."
  },
  growth: {
    title: "Research Momentum",
    subtitle:
      "A combined view of reading consistency, understanding evidence, retrieval strength, and implementation output.",
    empty:
      "Momentum begins with evidence. Add a paper note, review it, and let the dashboard show the loop.",
    cta: "Open Growth Dashboard"
  },
  paperLog: {
    title: "Paper Log",
    subtitle:
      "Not a list of papers I pretended to understand — a record of how I read, question, revisit, and connect them.",
    body:
      "Each note follows a three-pass method: skim for relevance, understand the core structure, then go deeper only when the paper deserves it.",
    cta: "Explore Paper Log"
  },
  oralExam: {
    title: "AI Oral Exams",
    subtitle:
      "After reading, I test whether I can explain the paper without looking.",
    body:
      "The examiner asks about the problem, core idea, method, formula, experiments, limitations, and how the paper connects to my own work.",
    cta: "Start from a Paper Note"
  },
  blog: {
    title: "Notes that survived the loop",
    subtitle:
      "Technical essays, research workflow notes, paper reflections, and build logs.",
    body:
      "The blog is where rough notes become clearer explanations.",
    cta: "Read Blog"
  },
  projects: {
    title: "Projects as experiments",
    subtitle:
      "Small systems, research tools, and implementation attempts built to make ideas concrete.",
    body:
      "I use projects to test whether I understood something deeply enough to build with it.",
    cta: "View Projects"
  },
  research: {
    title: "Research map",
    subtitle: "Questions I am currently orbiting.",
    body:
      "I am interested in AI systems, vision-language models, research tooling, and workflows that help people reason more effectively with machines.",
    cta: "View Research"
  },
  closing: {
    title: "Follow the loop",
    body:
      "The goal is not to look productive. The goal is to leave behind evidence of understanding.",
    cta: "Open Growth Dashboard"
  }
} as const;
