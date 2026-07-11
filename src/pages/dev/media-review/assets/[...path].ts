import type { APIRoute, GetStaticPaths } from "astro";
import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const heroRoot = resolve("artifacts/media-review/hero");

export const getStaticPaths: GetStaticPaths = () => {
  if (process.env.NODE_ENV === "production" || !existsSync(heroRoot)) return [];
  return readdirSync(heroRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(png|jpe?g|webp|avif)$/i.test(entry.name))
    .map((entry) => ({ params: { path: `hero/${entry.name}` }, props: { filePath: join(heroRoot, entry.name) } }));
};

export const GET: APIRoute = async ({ props }) => {
  const filePath = props.filePath as string;
  const contentType = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif"
  }[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  return new Response(await readFile(filePath), {
    headers: { "Content-Type": contentType, "Cache-Control": "no-store" }
  });
};
