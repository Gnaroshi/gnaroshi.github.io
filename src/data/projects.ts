export const projects = [
  {
    title: "gnaroshi.dev",
    summary:
      "Personal academic homepage, research blog, and paper reading tracker for keeping research notes close to papers and code.",
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
      "Static-first system for tracking daily paper reading, three-pass notes, revisits, and implementation attempts.",
    status: "active",
    featured: true,
    tags: ["paper-reading", "research-workflow", "static-data"],
    links: [{ label: "Paper log", href: "/papers" }]
  },
  {
    title: "Research workflow notes",
    summary:
      "Technical notes about reading workflows, experiment logs, and software systems for research.",
    status: "writing",
    featured: false,
    tags: ["notes", "workflow", "tools"],
    links: [{ label: "Blog", href: "/blog" }]
  }
] as const;
