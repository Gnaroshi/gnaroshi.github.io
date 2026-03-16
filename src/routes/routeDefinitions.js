export const ROUTE_DEFINITIONS = [
  { path: "/", tabKey: "home" },
  { path: "/news", tabKey: "news" },
  { path: "/research", tabKey: "research" },
  { path: "/publication", tabKey: "publication" },
  { path: "/people", tabKey: "people" },
  { path: "/photo", tabKey: "photo" },
  { path: "/contact", tabKey: "contact" },
  { path: "/join", tabKey: "join" },
  { path: "/test", tabKey: "test" },
];

export const SSG_ROUTE_PATHS = ROUTE_DEFINITIONS.map((item) => item.path);
