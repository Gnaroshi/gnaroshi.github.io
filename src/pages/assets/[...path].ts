import { readFileSync } from "node:fs";
import { extname } from "node:path";
import type { APIRoute, GetStaticPaths } from "astro";
import { listContentFeedAssets } from "../../utils/contentFeed";

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

export const getStaticPaths: GetStaticPaths = () => listContentFeedAssets().map((asset) => ({
  params: { path: asset.path },
  props: { absolutePath: asset.absolutePath }
}));

export const GET: APIRoute = ({ props }) => {
  const absolutePath = String(props.absolutePath);
  const body = new Uint8Array(readFileSync(absolutePath));
  return new Response(body, {
    headers: {
      "content-type": contentTypes[extname(absolutePath).toLowerCase()] ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
};
