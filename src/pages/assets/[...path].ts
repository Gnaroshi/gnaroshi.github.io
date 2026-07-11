import { readFileSync } from "node:fs";
import type { APIRoute, GetStaticPaths } from "astro";
import { listContentFeedAssets } from "../../utils/contentFeed";

export const getStaticPaths: GetStaticPaths = () => listContentFeedAssets().map((asset) => ({
  params: { path: asset.path },
  props: { absolutePath: asset.absolutePath, mediaType: asset.mediaType }
}));

export const GET: APIRoute = ({ props }) => {
  const absolutePath = String(props.absolutePath);
  const body = new Uint8Array(readFileSync(absolutePath));
  return new Response(body, {
    headers: {
      "content-type": String(props.mediaType),
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
};
