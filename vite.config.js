import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const normalizeBasePath = (basePath) => {
  if (!basePath) {
    return "/";
  }

  const withLeadingSlash = basePath.startsWith("/")
    ? basePath
    : `/${basePath}`;

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

const ghPagesBasePath = process.env.VITE_BASE_PATH;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: normalizeBasePath(ghPagesBasePath),
});
