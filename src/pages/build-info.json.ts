import type { APIRoute } from "astro";
import { getWebsiteBuildInfo } from "../utils/contentFeed";

export const prerender = true;

export const GET: APIRoute = () => new Response(
  `${JSON.stringify(getWebsiteBuildInfo(), null, 2)}\n`,
  { headers: { "content-type": "application/json; charset=utf-8" } }
);
