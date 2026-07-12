export const englishQaRoutes = [
  "/",
  "/about",
  "/research",
  "/projects",
  "/projects/gnaroshi-dev/",
  "/blog",
  "/papers",
  "/growth",
  "/queue",
  "/reviews",
  "/formula",
  "/questions",
  "/implementations",
  "/graph",
  "/week",
  "/404"
] as const;

export const koreanQaRoutes = [
  "/ko/",
  "/ko/about",
  "/ko/research",
  "/ko/projects",
  "/ko/projects/gnaroshi-dev/",
  "/ko/blog",
  "/ko/papers",
  "/ko/growth",
  "/ko/queue",
  "/ko/reviews",
  "/ko/formula",
  "/ko/questions",
  "/ko/implementations",
  "/ko/graph",
  "/ko/week",
  "/ko/404"
] as const;

export const qaRoutes = [...englishQaRoutes, ...koreanQaRoutes] as const;

export const qaViewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-360", width: 360, height: 800 }
] as const;
