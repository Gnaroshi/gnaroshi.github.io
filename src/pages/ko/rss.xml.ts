import type { APIContext } from "astro";
import { buildLocalizedRss } from "../../utils/localizedRss";
export function GET(context: APIContext) { return buildLocalizedRss(context, "ko"); }
