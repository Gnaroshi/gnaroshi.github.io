import { ApiError } from "./errors.ts";
import type { Env } from "../types.ts";

export function getAllowedRequestOrigin(request: Request, env: Env): string | undefined {
  const origin = request.headers.get("Origin");
  if (!origin) return undefined;
  const allowed = new Set(
    env.ALLOWED_ORIGINS.split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  );
  if (!allowed.has(origin)) {
    throw new ApiError(403, "origin_not_allowed", "This origin is not allowed to use the research API.");
  }
  return origin;
}

export function preflightResponse(origin: string | undefined): Response {
  if (!origin) throw new ApiError(403, "origin_required", "An allowed Origin header is required for preflight requests.");
  return withCors(new Response(null, { status: 204 }), origin);
}

export function withCors(response: Response, origin?: string): Response {
  const headers = new Headers(response.headers);
  headers.set("Vary", appendVary(headers.get("Vary"), "Origin"));
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, X-Gnaroshi-Client");
    headers.set("Access-Control-Max-Age", "86400");
    headers.set("Access-Control-Expose-Headers", "Content-Type, Content-Length");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function appendVary(current: string | null, value: string): string {
  const values = new Set((current ?? "").split(",").map((item) => item.trim()).filter(Boolean));
  values.add(value);
  return [...values].join(", ");
}
