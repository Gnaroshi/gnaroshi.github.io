import { ApiError } from "./errors.ts";
import type { Env, RateLimitBinding } from "../types.ts";

export type RateLimitedRoute =
  | "realtime-session"
  | "exam-generate"
  | "exam-score"
  | "audio-transcribe"
  | "speech-synthesize";

const routePolicy: Record<RateLimitedRoute, { hourlyLimit: number; binding: keyof Env }> = {
  "realtime-session": { hourlyLimit: 10, binding: "REALTIME_SESSION_RATE_LIMITER" },
  "exam-generate": { hourlyLimit: 20, binding: "EXAM_GENERATE_RATE_LIMITER" },
  "exam-score": { hourlyLimit: 20, binding: "EXAM_SCORE_RATE_LIMITER" },
  "audio-transcribe": { hourlyLimit: 10, binding: "TRANSCRIBE_RATE_LIMITER" },
  "speech-synthesize": { hourlyLimit: 20, binding: "SPEECH_RATE_LIMITER" }
};

type Counter = { count: number; resetAt: number };
const localHourlyCounters = new Map<string, Counter>();

export async function enforceRateLimit(
  env: Env,
  route: RateLimitedRoute,
  clientIdentifier: string,
  now = Date.now()
): Promise<void> {
  const policy = routePolicy[route];
  const key = `${route}:${clientIdentifier}`;
  const binding = env[policy.binding] as RateLimitBinding | undefined;

  if (binding) {
    const result = await binding.limit({ key });
    if (!result.success) throw rateLimitedError();
  }

  cleanupExpiredCounters(now);
  const current = localHourlyCounters.get(key);
  if (!current || current.resetAt <= now) {
    localHourlyCounters.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return;
  }
  if (current.count >= policy.hourlyLimit) throw rateLimitedError();
  current.count += 1;
}

export function resetLocalRateLimitsForTests(): void {
  localHourlyCounters.clear();
}

function cleanupExpiredCounters(now: number): void {
  if (localHourlyCounters.size < 500) return;
  for (const [key, counter] of localHourlyCounters) {
    if (counter.resetAt <= now) localHourlyCounters.delete(key);
  }
}

function rateLimitedError(): ApiError {
  return new ApiError(429, "rate_limited", "Too many requests. Try again later.");
}
