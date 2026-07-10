import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import worker from "./index.ts";
import { resetLocalRateLimitsForTests } from "./lib/rateLimit.ts";
import type { Env, ExecutionContextLike } from "./types.ts";

const env: Env = {
  OPENAI_REALTIME_MODEL: "gpt-realtime-2.1",
  OPENAI_SCORING_MODEL: "gpt-5.4-mini",
  OPENAI_TRANSCRIBE_MODEL: "gpt-4o-transcribe",
  OPENAI_TTS_MODEL: "gpt-4o-mini-tts",
  ALLOWED_ORIGINS: "https://gnaroshi.dev,http://localhost:4321,http://localhost:8787",
  API_ENV: "development",
  MAX_EXAM_MINUTES: "12",
  MAX_TRANSCRIPT_CHARS: "50000"
};

const context: ExecutionContextLike = { waitUntil() {} };

beforeEach(() => resetLocalRateLimitsForTests());

test("health returns safe service metadata with strict CORS", async () => {
  const response = await worker.fetch(request("/v1/health"), env, context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://gnaroshi.dev");
  const body = await response.json() as Record<string, unknown>;
  assert.equal(body.ok, true);
  assert.equal(body.service, "gnaroshi-research-api");
});

test("config disables key-backed features without exposing secrets", async () => {
  const response = await worker.fetch(request("/v1/config"), env, context);
  const body = await response.json() as Record<string, unknown>;
  assert.equal(body.realtimeEnabled, false);
  assert.equal(body.transcriptionEnabled, false);
  assert.equal(JSON.stringify(body).includes("OPENAI"), false);
});

test("disallowed origins are rejected", async () => {
  const response = await worker.fetch(
    new Request("https://api.gnaroshi.dev/v1/health", { headers: { Origin: "https://example.com" } }),
    env,
    context
  );
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
});

test("allowed preflight returns strict CORS metadata", async () => {
  const response = await worker.fetch(
    request("/v1/exams/score", { method: "OPTIONS" }),
    env,
    context
  );
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://gnaroshi.dev");
  assert.match(response.headers.get("Access-Control-Allow-Headers") ?? "", /Content-Type/);
});

test("development exam generation uses a clearly marked mock", async () => {
  const response = await worker.fetch(
    request("/v1/exams/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(examBase())
    }),
    env,
    context
  );
  assert.equal(response.status, 200);
  const body = await response.json() as { mock: boolean; questions: unknown[]; model: string };
  assert.equal(body.mock, true);
  assert.equal(body.model, "development-mock");
  assert.equal(body.questions.length, 6);
});

test("development score is low-confidence and hidden by default", async () => {
  const generatedResponse = await worker.fetch(
    request("/v1/exams/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(examBase())
    }),
    env,
    context
  );
  const generated = await generatedResponse.json() as { examId: string; questions: unknown[] };
  const response = await worker.fetch(
    request("/v1/exams/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...examBase(),
        examId: generated.examId,
        questions: generated.questions,
        answers: generated.questions.map(() => "I can explain this with specific evidence from my note."),
        transcript: "A local mock transcript for API workflow testing."
      })
    }),
    env,
    context
  );
  assert.equal(response.status, 200);
  const body = await response.json() as { mock: boolean; confidence: string; visibility: string };
  assert.equal(body.mock, true);
  assert.equal(body.confidence, "low");
  assert.equal(body.visibility, "hidden");
});

test("realtime never returns a fake client credential", async () => {
  const response = await worker.fetch(
    request("/v1/realtime/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...examBase(), examMode: "oral", questionCount: 6 })
    }),
    env,
    context
  );
  assert.equal(response.status, 503);
  const body = await response.json() as { error: { code: string } };
  assert.equal(body.error.code, "realtime_unavailable");
});

test("hourly fallback limiter returns a structured 429", async () => {
  let response = new Response();
  for (let index = 0; index < 21; index += 1) {
    response = await worker.fetch(
      request("/v1/exams/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examBase())
      }, "203.0.113.240"),
      env,
      context
    );
  }
  assert.equal(response.status, 429);
  const body = await response.json() as { error: { code: string; message: string } };
  assert.equal(body.error.code, "rate_limited");
  assert.equal(body.error.message, "Too many requests. Try again later.");
});

function request(path: string, init: RequestInit = {}, ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`): Request {
  const headers = new Headers(init.headers);
  headers.set("Origin", "https://gnaroshi.dev");
  headers.set("CF-Connecting-IP", ip);
  return new Request(`https://api.gnaroshi.dev${path}`, { ...init, headers });
}

function examBase() {
  return {
    paperSlug: "example-paper",
    paperTitle: "Example Paper",
    targetDepth: "pass2",
    language: "ko-KR",
    paperContext: {
      oneLineSummary: "A short summary.",
      coreIdea: "A core idea.",
      mainFormula: "",
      formulaInterpretation: "",
      experimentTakeaway: "An experiment takeaway.",
      notesExcerpt: "A bounded public paper note excerpt."
    }
  };
}
