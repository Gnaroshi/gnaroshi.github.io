import type { APIRoute } from "astro";
import { getContentFeedBuildInfo } from "../utils/contentFeed";

export const prerender = true;

export const GET: APIRoute = () => new Response(
  `${JSON.stringify(getContentFeedBuildInfo(), null, 2)}\n`,
  { headers: { "content-type": "application/json; charset=utf-8" } }
);
