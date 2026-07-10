import { ApiError } from "../lib/errors.ts";
import { openAiFetch } from "../lib/openai.ts";
import { parseSpeechRequest } from "../lib/validation.ts";
import type { Env, RouteContext } from "../types.ts";

const supportedVoices = new Set(["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse", "marin", "cedar"]);

export async function speech(request: Request, env: Env, context: RouteContext): Promise<Response> {
  const input = await parseSpeechRequest(request);
  const voice = input.voice === "default" ? "marin" : input.voice;
  if (!supportedVoices.has(voice)) throw new ApiError(400, "validation_error", "Unsupported voice.");
  const response = await openAiFetch(
    env,
    "/audio/speech",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_TTS_MODEL,
        input: input.text,
        voice,
        response_format: "mp3",
        instructions: input.language === "ko-KR"
          ? "Speak clear Korean in a supportive but serious academic examiner tone."
          : "Speak clear English in a supportive but serious academic examiner tone."
      })
    },
    context.safetyIdentifier
  );
  const headers = new Headers({
    "Content-Type": response.headers.get("Content-Type") ?? "audio/mpeg",
    "Cache-Control": "no-store",
    "X-AI-Generated-Voice": "true"
  });
  return new Response(response.body, { status: 200, headers });
}
