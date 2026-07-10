import { ApiError, jsonResponse } from "../lib/errors.ts";
import { createRealtimeClientSecret } from "../lib/openai.ts";
import { parseRealtimeSessionRequest, getPositiveInteger } from "../lib/validation.ts";
import type { RealtimeSessionResponse } from "../schemas/realtime.ts";
import type { Env, RouteContext } from "../types.ts";

export async function realtimeSession(request: Request, env: Env, context: RouteContext): Promise<Response> {
  const input = await parseRealtimeSessionRequest(request);
  if (!env.OPENAI_API_KEY) {
    throw new ApiError(503, "realtime_unavailable", "Live voice is unavailable because realtime credentials are not configured.");
  }
  const plan = buildExamPlan(input.targetDepth, input.language, input.questionCount, getPositiveInteger(env.MAX_EXAM_MINUTES, 12, 30));
  const credential = await createRealtimeClientSecret(env, {
    instructions: buildRealtimeInstructions(input, plan.openingPrompt),
    safetyIdentifier: context.safetyIdentifier,
    voice: "marin"
  });
  const response: RealtimeSessionResponse = {
    sessionId: credential.sessionId,
    expiresAt: credential.expiresAt,
    realtime: {
      clientSecret: credential.value,
      model: credential.model
    },
    examPlan: plan
  };
  return jsonResponse(response);
}

function buildExamPlan(
  targetDepth: string,
  language: string,
  questionCount: number,
  maximumMinutes: number
): RealtimeSessionResponse["examPlan"] {
  const baseTypes = ["retrieval", "method", "experiment", "critical-thinking", "research-connection"];
  if (targetDepth === "pass3") baseTypes.splice(2, 0, "formula");
  const openingPrompt = language === "ko-KR"
    ? "이제 논문의 핵심 문제를 기억에서 설명해 주세요. 노트를 보지 않고 답해도 되고, 모르는 부분은 모른다고 말해도 됩니다."
    : "Please explain the paper's core problem from memory. Answer without the note, and say when you do not know yet.";
  return {
    openingPrompt,
    questionTypes: Array.from({ length: questionCount }, (_, index) => baseTypes[index % baseTypes.length]),
    estimatedMinutes: Math.min(maximumMinutes, Math.max(6, questionCount * 2))
  };
}

function buildRealtimeInstructions(
  input: Awaited<ReturnType<typeof parseRealtimeSessionRequest>>,
  openingPrompt: string
): string {
  const language = input.language === "ko-KR" ? "Korean" : "English";
  return [
    `You are a serious but supportive oral examiner. Conduct the exam in ${language}.`,
    `The target reading depth is ${input.targetDepth}. Ask exactly ${input.questionCount} primary questions.`,
    "Ask one question at a time and wait for the learner's answer.",
    "If an answer is vague, ask one concise follow-up before moving on.",
    "Evaluate retrieval evidence, explanation, precision, uncertainty, research connection, formula understanding, experiment evidence, and critical thinking.",
    "Do not describe the learner's intelligence or personal worth.",
    "Do not reveal an ideal answer before the learner responds.",
    "Acknowledge honest uncertainty instead of punishing it harshly.",
    "Do not overclaim correctness because the supplied context may be incomplete.",
    "Finish with a short spoken summary and remind the learner that detailed scoring happens after transcript submission.",
    `Begin with this prompt: ${openingPrompt}`,
    `Paper title: ${input.paperTitle}`,
    `Paper context: ${JSON.stringify(input.paperContext)}`
  ].join("\n");
}
