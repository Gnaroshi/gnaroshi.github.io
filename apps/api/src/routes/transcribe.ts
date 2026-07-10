import { ApiError, jsonResponse } from "../lib/errors.ts";
import { openAiFetch } from "../lib/openai.ts";
import { MAX_AUDIO_BYTES, assertContentLength } from "../lib/security.ts";
import { getPositiveInteger } from "../lib/validation.ts";
import type { Env, RouteContext } from "../types.ts";

const supportedAudioTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "video/mp4",
  "video/webm"
]);

export async function transcribe(request: Request, env: Env, context: RouteContext): Promise<Response> {
  assertContentLength(request, MAX_AUDIO_BYTES + 64 * 1024);
  if (!(request.headers.get("Content-Type") ?? "").toLowerCase().includes("multipart/form-data")) {
    throw new ApiError(415, "unsupported_media_type", "Content-Type must be multipart/form-data.");
  }
  const form = await request.formData();
  const audio = form.get("audio");
  if (!(audio instanceof File)) throw new ApiError(400, "validation_error", "An audio file is required.");
  if (audio.size > MAX_AUDIO_BYTES) throw new ApiError(413, "audio_too_large", "Audio must be 20 MB or smaller.");
  if (audio.type && !supportedAudioTypes.has(audio.type)) {
    throw new ApiError(415, "unsupported_audio_type", "Unsupported audio file type.");
  }
  const language = stringField(form.get("language"), "ko-KR", 10);
  if (!new Set(["ko-KR", "en-US"]).has(language)) throw new ApiError(400, "validation_error", "language must be ko-KR or en-US.");
  const prompt = stringField(form.get("prompt"), "", 1_000);
  const duration = Number(form.get("durationSeconds"));
  const maximumSeconds = getPositiveInteger(env.MAX_EXAM_MINUTES, 12, 30) * 60;
  if (Number.isFinite(duration) && duration > maximumSeconds) {
    throw new ApiError(413, "audio_too_long", "Audio exceeds the configured exam duration.");
  }
  const upstream = new FormData();
  upstream.set("file", audio, audio.name || "exam-audio.webm");
  upstream.set("model", env.OPENAI_TRANSCRIBE_MODEL);
  upstream.set("response_format", "json");
  upstream.set("language", language === "ko-KR" ? "ko" : "en");
  if (prompt) upstream.set("prompt", prompt);
  const response = await openAiFetch(
    env,
    "/audio/transcriptions",
    { method: "POST", body: upstream },
    context.safetyIdentifier
  );
  const result = await response.json() as Record<string, unknown>;
  if (typeof result.text !== "string") throw new ApiError(502, "invalid_openai_response", "Transcription returned no text.");
  return jsonResponse({ text: result.text, durationSeconds: Number.isFinite(duration) ? duration : null, language });
}

function stringField(value: FormDataEntryValue | null, fallback: string, maximumLength: number): string {
  if (value === null) return fallback;
  if (typeof value !== "string" || value.length > maximumLength) {
    throw new ApiError(400, "validation_error", "Invalid multipart field.");
  }
  return value;
}
