import { getAllowedRequestOrigin, preflightResponse, withCors } from "./lib/cors.ts";
import { ApiError, errorResponse, jsonResponse } from "./lib/errors.ts";
import { enforceRateLimit, type RateLimitedRoute } from "./lib/rateLimit.ts";
import { enforceOptionalSharedSecret, getClientIdentifiers } from "./lib/security.ts";
import { examGenerate } from "./routes/examGenerate.ts";
import { examScore } from "./routes/examScore.ts";
import { config, health } from "./routes/health.ts";
import { realtimeSession } from "./routes/realtimeSession.ts";
import { speech } from "./routes/speech.ts";
import { transcribe } from "./routes/transcribe.ts";
import type { RouteHandler, WorkerHandler } from "./types.ts";

type RouteDefinition = {
  method: "GET" | "POST";
  path: string;
  handler: RouteHandler;
  protected?: boolean;
  rateLimit?: RateLimitedRoute;
};

const routes: RouteDefinition[] = [
  { method: "GET", path: "/v1/health", handler: () => health() },
  { method: "GET", path: "/v1/config", handler: config },
  { method: "POST", path: "/v1/realtime/session", handler: realtimeSession, protected: true, rateLimit: "realtime-session" },
  { method: "POST", path: "/v1/exams/generate", handler: examGenerate, protected: true, rateLimit: "exam-generate" },
  { method: "POST", path: "/v1/exams/score", handler: examScore, protected: true, rateLimit: "exam-score" },
  { method: "POST", path: "/v1/audio/transcribe", handler: transcribe, protected: true, rateLimit: "audio-transcribe" },
  { method: "POST", path: "/v1/speech/synthesize", handler: speech, protected: true, rateLimit: "speech-synthesize" }
];

const worker: WorkerHandler = {
  async fetch(request, env): Promise<Response> {
    let origin: string | undefined;
    try {
      origin = getAllowedRequestOrigin(request, env);
      if (request.method === "OPTIONS") return preflightResponse(origin);

      const url = new URL(request.url);
      const route = routes.find((candidate) => candidate.method === request.method && candidate.path === url.pathname);
      if (!route) throw new ApiError(404, "not_found", "API route not found.");

      if (route.protected) enforceOptionalSharedSecret(request, env);
      const identifiers = await getClientIdentifiers(request);
      if (route.rateLimit) await enforceRateLimit(env, route.rateLimit, identifiers.clientIdentifier);
      const response = await route.handler(request, env, identifiers);
      return withCors(response, origin);
    } catch (error) {
      return withCors(errorResponse(error), origin);
    }
  }
};

export default worker;

export function notFound(): Response {
  return jsonResponse({ error: { code: "not_found", message: "API route not found." } }, 404);
}
