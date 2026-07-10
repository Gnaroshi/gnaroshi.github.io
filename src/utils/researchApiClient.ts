import type {
  ApiErrorPayload,
  ExamScoreRequest,
  GeneratedOralExam,
  RealtimeSessionRequest,
  RealtimeSessionResponse,
  ResearchApiConfig,
  ScoredOralExam
} from "../types/api";

export class ResearchApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ResearchApiError";
    this.status = status;
    this.code = code;
  }
}

export function getResearchApiBaseUrl(): string {
  return String(import.meta.env.PUBLIC_AI_API_BASE_URL ?? "").trim().replace(/\/$/, "");
}

export function getResearchApiConfig(apiBaseUrl: string): Promise<ResearchApiConfig> {
  return requestJson(apiBaseUrl, "/v1/config", { method: "GET" });
}

export function createRealtimeSession(
  apiBaseUrl: string,
  input: RealtimeSessionRequest
): Promise<RealtimeSessionResponse> {
  return requestJson(apiBaseUrl, "/v1/realtime/session", jsonRequest(input));
}

export function generateOralExam(
  apiBaseUrl: string,
  input: Omit<RealtimeSessionRequest, "examMode">
): Promise<GeneratedOralExam> {
  return requestJson(apiBaseUrl, "/v1/exams/generate", jsonRequest(input));
}

export function scoreOralExam(apiBaseUrl: string, input: ExamScoreRequest): Promise<ScoredOralExam> {
  return requestJson(apiBaseUrl, "/v1/exams/score", jsonRequest(input));
}

async function requestJson<T>(apiBaseUrl: string, path: string, init: RequestInit): Promise<T> {
  if (!apiBaseUrl) throw new ResearchApiError(0, "api_not_configured", "The optional research API is not configured.");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { ...init, signal: controller.signal });
    const contentType = response.headers.get("Content-Type") ?? "";
    const body = contentType.includes("application/json") ? await response.json() : undefined;
    if (!response.ok) {
      const error = body as ApiErrorPayload | undefined;
      throw new ResearchApiError(
        response.status,
        error?.error?.code ?? "api_request_failed",
        error?.error?.message ?? "The research API request failed."
      );
    }
    return body as T;
  } catch (error) {
    if (error instanceof ResearchApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ResearchApiError(0, "api_timeout", "The research API did not respond in time.");
    }
    throw new ResearchApiError(0, "api_unreachable", "The research API could not be reached.");
  } finally {
    window.clearTimeout(timeout);
  }
}

function jsonRequest(value: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value)
  };
}
