export const TAB_KEYS = [
  "home",
  "news",
  "research",
  "publication",
  "people",
  "photo",
  "contact",
  "join",
  "test",
];

const TAB_KEY_SET = new Set(TAB_KEYS);

export const resolveTabFromPath = (pathname = "/") => {
  if (!pathname || pathname === "/") {
    return "home";
  }

  const segment = pathname.replace(/^\/+/, "").split("/")[0] ?? "";
  return TAB_KEY_SET.has(segment) ? segment : "home";
};
