import { jsonResponse } from "../lib/errors.ts";
import { getPositiveInteger } from "../lib/validation.ts";
import type { Env } from "../types.ts";

export function health(): Response {
  return jsonResponse({
    ok: true,
    service: "gnaroshi-research-api",
    version: "0.1.0",
    time: new Date().toISOString()
  });
}

export function config(_request: Request, env: Env): Response {
  const openAiReady = Boolean(env.OPENAI_API_KEY);
  return jsonResponse({
    realtimeEnabled: openAiReady,
    transcriptionEnabled: openAiReady,
    ttsEnabled: openAiReady,
    maxExamMinutes: getPositiveInteger(env.MAX_EXAM_MINUTES, 12, 30),
    allowedLanguages: ["ko-KR", "en-US"]
  });
}
