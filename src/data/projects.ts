export const projects = [
  {
    title: "gnaroshi.dev",
    summary:
      "Personal academic homepage, research blog, and paper reading tracker. This is the live site scaffold and will evolve with real notes.",
    status: "active",
    featured: true,
    tags: ["astro", "mdx", "research-notebook"],
    links: [
      { label: "Repository", href: "https://github.com/Gnaroshi/gnaroshi.github.io" },
      { label: "Website", href: "https://gnaroshi.dev" }
    ]
  },
  {
    title: "Paper reading tracker",
    summary:
      "Planned static-first system for tracking daily paper reading, three-pass notes, revisits, and implementation attempts.",
    status: "planned sample",
    featured: true,
    tags: ["paper-reading", "research-workflow", "static-data"],
    links: [{ label: "Paper log", href: "/papers" }]
  },
  {
    title: "Research workflow notes",
    summary:
      "Placeholder project area for technical notes about reading workflows, experiment logs, and software systems for research.",
    status: "placeholder",
    featured: false,
    tags: ["notes", "workflow", "tools"],
    links: [{ label: "Blog", href: "/blog" }]
  }
] as const;

