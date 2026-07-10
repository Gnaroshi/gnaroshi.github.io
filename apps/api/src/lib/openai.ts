import { ApiError } from "./errors.ts";
import type { JsonSchema, Env } from "../types.ts";

const OPENAI_API_BASE = "https://api.openai.com/v1";

export function isDevelopmentMock(env: Env): boolean {
  return !env.OPENAI_API_KEY && env.API_ENV.toLowerCase() !== "production";
}

export async function createRealtimeClientSecret(
  env: Env,
  options: {
    instructions: string;
    safetyIdentifier: string;
    voice?: string;
  }
): Promise<{ value: string; expiresAt: string; sessionId: string; model: string }> {
  const model = env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1";
  const response = await openAiFetch(
    env,
    "/realtime/client_secrets",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model,
          instructions: options.instructions,
          output_modalities: ["audio"],
          audio: {
            input: {
              transcription: { model: env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-transcribe" },
              turn_detection: {
                type: "semantic_vad",
                eagerness: "medium",
                create_response: true
              }
            },
            output: { voice: options.voice ?? "marin" }
          },
          max_output_tokens: 800
        }
      })
    },
    options.safetyIdentifier
  );
  const data = await response.json() as Record<string, unknown>;
  const clientSecret = readString(data.value) ?? readNestedString(data, "client_secret", "value");
  if (!clientSecret) throw new ApiError(502, "invalid_openai_response", "OpenAI did not return a usable realtime client secret.");
  const expiresAtSeconds = readNumber(data.expires_at) ?? readNestedNumber(data, "client_secret", "expires_at");
  const sessionId = readString(data.id) ?? readNestedString(data, "session", "id") ?? crypto.randomUUID();

  return {
    value: clientSecret,
    expiresAt: expiresAtSeconds
      ? new Date(expiresAtSeconds * 1000).toISOString()
      : new Date(Date.now() + 60_000).toISOString(),
    sessionId,
    model
  };
}

export async function createStructuredResponse<T>(
  env: Env,
  options: {
    schemaName: string;
    schema: JsonSchema;
    systemPrompt: string;
    userPrompt: string;
    safetyIdentifier: string;
    maxOutputTokens?: number;
  }
): Promise<T> {
  const response = await openAiFetch(
    env,
    "/responses",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_SCORING_MODEL,
        store: false,
        input: [
          { role: "system", content: options.systemPrompt },
          { role: "user", content: options.userPrompt }
        ],
        max_output_tokens: options.maxOutputTokens ?? 4_000,
        text: {
          format: {
            type: "json_schema",
            name: options.schemaName,
            strict: true,
            schema: options.schema
          }
        }
      })
    },
    options.safetyIdentifier
  );
  const data = await response.json() as Record<string, unknown>;
  const outputText = extractOutputText(data);
  if (!outputText) throw new ApiError(502, "invalid_openai_response", "OpenAI returned no structured output text.");
  try {
    return JSON.parse(outputText) as T;
  } catch {
    throw new ApiError(502, "invalid_openai_response", "OpenAI returned malformed structured output.");
  }
}

export async function openAiFetch(
  env: Env,
  path: string,
  init: RequestInit,
  safetyIdentifier?: string
): Promise<Response> {
  if (!env.OPENAI_API_KEY) {
    throw new ApiError(503, "openai_not_configured", "The OpenAI-backed API is not configured.");
  }
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${env.OPENAI_API_KEY}`);
  if (safetyIdentifier) headers.set("OpenAI-Safety-Identifier", safetyIdentifier);
  const response = await fetch(`${OPENAI_API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    await response.body?.cancel();
    throw new ApiError(502, "openai_upstream_error", "The upstream AI request failed.");
  }
  return response;
}

function extractOutputText(data: Record<string, unknown>): string | undefined {
  if (typeof data.output_text === "string") return data.output_text;
  if (!Array.isArray(data.output)) return undefined;
  for (const item of data.output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const record = part as Record<string, unknown>;
      if ((record.type === "output_text" || record.type === "text") && typeof record.text === "string") return record.text;
    }
  }
  return undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readNestedString(object: Record<string, unknown>, key: string, nestedKey: string): string | undefined {
  const nested = object[key];
  return nested && typeof nested === "object" ? readString((nested as Record<string, unknown>)[nestedKey]) : undefined;
}

function readNestedNumber(object: Record<string, unknown>, key: string, nestedKey: string): number | undefined {
  const nested = object[key];
  return nested && typeof nested === "object" ? readNumber((nested as Record<string, unknown>)[nestedKey]) : undefined;
}
