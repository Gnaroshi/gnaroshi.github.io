export type RateLimitResult = { success: boolean };

export type RateLimitBinding = {
  limit(options: { key: string }): Promise<RateLimitResult>;
};

export interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_REALTIME_MODEL: string;
  OPENAI_SCORING_MODEL: string;
  OPENAI_TRANSCRIBE_MODEL: string;
  OPENAI_TTS_MODEL: string;
  ALLOWED_ORIGINS: string;
  API_ENV: string;
  MAX_EXAM_MINUTES: string;
  MAX_TRANSCRIPT_CHARS: string;
  ORAL_EXAM_API_SHARED_SECRET?: string;
  REALTIME_SESSION_RATE_LIMITER?: RateLimitBinding;
  EXAM_GENERATE_RATE_LIMITER?: RateLimitBinding;
  EXAM_SCORE_RATE_LIMITER?: RateLimitBinding;
  TRANSCRIBE_RATE_LIMITER?: RateLimitBinding;
  SPEECH_RATE_LIMITER?: RateLimitBinding;
}

export type ExecutionContextLike = {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException?(): void;
};

export type RouteContext = {
  clientIdentifier: string;
  safetyIdentifier: string;
};

export type RouteHandler = (request: Request, env: Env, context: RouteContext) => Promise<Response> | Response;

export type WorkerHandler = {
  fetch(request: Request, env: Env, context: ExecutionContextLike): Promise<Response>;
};

export type JsonSchema = Record<string, unknown>;
