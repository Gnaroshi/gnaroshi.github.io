import { jsonResponse } from "../lib/errors.ts";
import { createStructuredResponse, isDevelopmentMock } from "../lib/openai.ts";
import { parseExamGenerationRequest } from "../lib/validation.ts";
import {
  examGenerationOutputSchema,
  examQuestionTypes,
  type ExamGenerationResponse,
  type ExamQuestion
} from "../schemas/exam.ts";
import type { Env, RouteContext } from "../types.ts";

export async function examGenerate(request: Request, env: Env, context: RouteContext): Promise<Response> {
  const input = await parseExamGenerationRequest(request);
  const questionCount = input.questionCount ?? 6;
  if (isDevelopmentMock(env)) return jsonResponse(buildMockExam(input, questionCount));

  const generated = await createStructuredResponse<ExamGenerationResponse>(env, {
    schemaName: "oral_exam_questions",
    schema: examGenerationOutputSchema,
    safetyIdentifier: context.safetyIdentifier,
    systemPrompt: [
      "Generate a rigorous but supportive oral paper exam from only the supplied note evidence.",
      "Ask questions that test retrieval and explanation, not intelligence.",
      "Do not reveal answers in the question wording.",
      "Respect the target reading depth: pass1 should not require pass3 derivations.",
      "If source evidence is incomplete, keep expected signals modest and explicit."
    ].join("\n"),
    userPrompt: JSON.stringify({ ...input, questionCount, outputRules: { mock: false, model: env.OPENAI_SCORING_MODEL } })
  });

  return jsonResponse({
    ...generated,
    schemaVersion: "1.0.0",
    examId: generated.examId || crypto.randomUUID(),
    paperSlug: input.paperSlug,
    paperTitle: input.paperTitle,
    targetDepth: input.targetDepth,
    language: input.language,
    generatedAt: new Date().toISOString(),
    model: env.OPENAI_SCORING_MODEL,
    mock: false,
    questions: generated.questions.slice(0, questionCount)
  } satisfies ExamGenerationResponse);
}

function buildMockExam(
  input: Awaited<ReturnType<typeof parseExamGenerationRequest>>,
  questionCount: number
): ExamGenerationResponse {
  const korean = input.language === "ko-KR";
  const prompts: Record<(typeof examQuestionTypes)[number], [string, string]> = {
    retrieval: korean
      ? ["이 논문이 해결하려는 핵심 문제를 기억에서 설명해 주세요.", "그 문제가 왜 중요한지 한 문장으로 덧붙여 주세요."]
      : ["Explain the paper's core problem from memory.", "Add one sentence about why that problem matters."],
    method: korean
      ? ["핵심 아이디어가 입력에서 출력까지 어떻게 작동하는지 설명해 주세요.", "가장 중요한 중간 단계는 무엇인가요?"]
      : ["Explain how the core idea moves from input to output.", "What is the most important intermediate step?"],
    formula: korean
      ? ["주요 수식의 각 항이 어떤 역할을 하는지 설명해 주세요.", "이 수식이 최적화하거나 측정하는 것은 무엇인가요?"]
      : ["Explain the role of each term in the main formula.", "What does this formula optimize or measure?"],
    experiment: korean
      ? ["핵심 주장을 가장 잘 뒷받침하는 실험 증거는 무엇인가요?", "그 실험만으로 결론을 내리기 어려운 점은 무엇인가요?"]
      : ["What experiment best supports the central claim?", "What does that experiment still fail to establish?"],
    "critical-thinking": korean
      ? ["이 논문의 중요한 가정이나 실패 가능성을 하나 말해 주세요.", "그 가정을 검증하려면 어떤 실험이 필요할까요?"]
      : ["Name one important assumption or likely failure mode.", "What experiment would test that assumption?"],
    "research-connection": korean
      ? ["이 논문을 현재 연구 질문이나 구현 작업과 어떻게 연결할 수 있나요?", "가장 작은 다음 행동은 무엇인가요?"]
      : ["How does this paper connect to a current research question or implementation?", "What is the smallest next action?"]
  };
  const availableTypes = input.targetDepth === "pass1"
    ? examQuestionTypes.filter((type) => !["formula", "experiment"].includes(type))
    : input.targetDepth === "pass2"
      ? examQuestionTypes.filter((type) => type !== "formula")
      : examQuestionTypes;
  const questions: ExamQuestion[] = Array.from({ length: questionCount }, (_, index) => {
    const type = availableTypes[index % availableTypes.length];
    const [prompt, followUpPrompt] = prompts[type];
    return {
      id: `q-${index + 1}`,
      type,
      prompt,
      expectedSignals: [],
      difficulty: input.targetDepth === "pass3" ? 4 : input.targetDepth === "pass2" ? 3 : 2,
      followUpPrompt
    };
  });
  return {
    schemaVersion: "1.0.0",
    examId: `mock-${crypto.randomUUID()}`,
    paperSlug: input.paperSlug,
    paperTitle: input.paperTitle,
    targetDepth: input.targetDepth,
    language: input.language,
    generatedAt: new Date().toISOString(),
    model: "development-mock",
    mock: true,
    questions
  };
}
