import { ApiError } from "./errors.ts";
import type { Env } from "../types.ts";

export const MAX_JSON_BODY_BYTES = 128 * 1024;
export const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
export const MAX_SPEECH_TEXT_CHARS = 4_000;

export function enforceOptionalSharedSecret(request: Request, env: Env): void {
  if (!env.ORAL_EXAM_API_SHARED_SECRET) return;
  const supplied = request.headers.get("X-Gnaroshi-Client") ?? "";
  if (!constantTimeEqual(supplied, env.ORAL_EXAM_API_SHARED_SECRET)) {
    throw new ApiError(401, "client_guard_failed", "The optional client guard rejected this request.");
  }
}

export function assertContentLength(request: Request, maximumBytes: number): void {
  const header = request.headers.get("Content-Length");
  if (!header) return;
  const length = Number(header);
  if (Number.isFinite(length) && length > maximumBytes) {
    throw new ApiError(413, "request_too_large", "The request body is too large.");
  }
}

export async function getClientIdentifiers(request: Request): Promise<{ clientIdentifier: string; safetyIdentifier: string }> {
  const raw =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "local-development";
  const digest = await sha256(raw);
  return {
    clientIdentifier: digest,
    safetyIdentifier: `gnaroshi-${digest.slice(0, 48)}`
  };
}

export function redactHeaders(headers: Headers): Record<string, string> {
  const redacted: Record<string, string> = {};
  for (const [key, value] of headers.entries()) {
    redacted[key] = ["authorization", "x-gnaroshi-client", "cookie"].includes(key.toLowerCase()) ? "[REDACTED]" : value;
  }
  return redacted;
}

function constantTimeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
