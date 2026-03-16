export const normalizeRouterBasename = (baseUrl) => {
  if (!baseUrl || baseUrl === "/") {
    return undefined;
  }

  const withLeadingSlash = baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
};

export const getRouterBasename = () => normalizeRouterBasename(import.meta.env.BASE_URL);

export const joinBasenameWithPath = (basename, routePath = "/") => {
  if (!basename) {
    return routePath || "/";
  }

  if (!routePath || routePath === "/") {
    return basename;
  }

  const normalizedRoutePath = routePath.startsWith("/") ? routePath : `/${routePath}`;
  return `${basename}${normalizedRoutePath}`;
};
