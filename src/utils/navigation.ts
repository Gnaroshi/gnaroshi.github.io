export const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/papers", label: "Paper Lab" },
  { href: "/about", label: "About" }
] as const;

export const utilityNavigation = [{ href: "/growth", label: "Growth" }] as const;

export const footerNavigation = [
  ...primaryNavigation,
  ...utilityNavigation,
  { href: "/now", label: "Now" },
  { href: "/contact", label: "Links" }
] as const;

export const paperLabNavigation = [
  {
    label: "Overview",
    items: [
      { href: "/papers", label: "Paper Log" },
      { href: "/growth", label: "Growth" }
    ]
  },
  {
    label: "Read",
    items: [
      { href: "/queue", label: "Reading Queue" },
      { href: "/papers#paper-notes", label: "Paper Notes" }
    ]
  },
  {
    label: "Review",
    items: [
      { href: "/reviews", label: "Reviews Due" },
      { href: "/papers#ai-review-workflow", label: "AI Review" }
    ]
  },
  {
    label: "Practice",
    items: [
      { href: "/papers#oral-exam-entry", label: "Oral Exam" },
      { href: "/formula", label: "Formula Recall" },
      { href: "/questions", label: "Question Bank" }
    ]
  },
  {
    label: "Build",
    items: [
      { href: "/implementations", label: "Implementations" },
      { href: "/papers#paper-to-blog", label: "Paper-to-Blog" }
    ]
  },
  {
    label: "Insights",
    items: [
      { href: "/week", label: "Weekly Reviews" },
      { href: "/graph", label: "Research Graph" }
    ]
  }
] as const;

export function isNavigationActive(currentPath: string, href: string): boolean {
  const cleanCurrent = currentPath.replace(/\/$/, "") || "/";
  const cleanHref = href.split("#")[0].replace(/\/$/, "") || "/";
  if (cleanHref === "/") return cleanCurrent === "/";
  return cleanCurrent === cleanHref || cleanCurrent.startsWith(`${cleanHref}/`);
}
