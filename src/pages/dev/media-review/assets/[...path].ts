import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { mediaReviewCandidates } from "../../../../data/mediaReview";

export function getStaticPaths() {
  if (process.env.NODE_ENV === "production") return [];
  return mediaReviewCandidates.map((candidate) => ({ params: { path: candidate.file } }));
}

const types: Record<string, string> = { ".png": "image/png", ".avif": "image/avif", ".webp": "image/webp" };

export async function GET({ params }: { params: { path?: string } }) {
  const requested = params.path ?? "";
  const allowed = new Set(mediaReviewCandidates.map((candidate) => candidate.file));
  if (!allowed.has(requested)) return new Response("Not found", { status: 404 });
  const root = resolve("media-sources");
  const path = resolve(root, requested);
  if (!path.startsWith(`${root}${sep}`)) return new Response("Not found", { status: 404 });
  return new Response(await readFile(path), { headers: { "Content-Type": types[extname(path)] ?? "application/octet-stream", "Cache-Control": "no-store" } });
}
