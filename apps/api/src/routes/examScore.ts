import { jsonResponse } from "../lib/errors.ts";
import { createStructuredResponse, isDevelopmentMock } from "../lib/openai.ts";
import { parseExamScoreRequest } from "../lib/validation.ts";
import { examScoreOutputSchema, type ScoredExamResponse, type ScoreDimension } from "../schemas/exam.ts";
import type { Env, RouteContext } from "../types.ts";

export async function examScore(request: Request, env: Env, context: RouteContext): Promise<Response> {
  const maximumCharacters = Math.min(100_000, Math.max(1_000, Number(env.MAX_TRANSCRIPT_CHARS) || 50_000));
  const input = await parseExamScoreRequest(request, maximumCharacters);
  if (isDevelopmentMock(env)) return jsonResponse(buildMockScore(input));

  const scored = await createStructuredResponse<ScoredExamResponse>(env, {
    schemaName: "oral_exam_score",
    schema: examScoreOutputSchema,
    safetyIdentifier: context.safetyIdentifier,
    maxOutputTokens: 5_000,
    systemPrompt: [
      "Score only evidence of understanding present in the submitted oral exam answers and transcript.",
      "This score measures retrieval evidence, not intelligence, talent, or personal worth.",
      "Reward honest uncertainty when the learner clearly marks what is not known.",
      "Do not overclaim factual correctness unless the supplied paper context directly supports it.",
      "For pass1, do not require pass3-level formulas or reproduction details.",
      "Use exact answer excerpts as evidence and provide constructive next actions.",
      "Use low confidence when answers are short, missing, or the paper context is incomplete."
    ].join("\n"),
    userPrompt: JSON.stringify({ ...input, outputRules: { mock: false, model: env.OPENAI_SCORING_MODEL, visibility: "hidden" } })
  });

  return jsonResponse({
    ...scored,
    schemaVersion: "1.0.0",
    examId: input.examId,
    paperSlug: input.paperSlug,
    paperTitle: input.paperTitle,
    scoredAt: new Date().toISOString(),
    model: env.OPENAI_SCORING_MODEL,
    mock: false,
    visibility: "hidden",
    transcriptMetadata: {
      characterCount: input.transcript.length,
      questionCount: input.questions.length
    }
  } satisfies ScoredExamResponse);
}

function buildMockScore(input: Awaited<ReturnType<typeof parseExamScoreRequest>>): ScoredExamResponse {
  const answered = input.answers.filter((answer) => answer.trim().length >= 20).length;
  const coverage = input.questions.length > 0 ? Math.round((answered / input.questions.length) * 100) : 0;
  const base = Math.min(65, Math.max(20, Math.round(coverage * 0.6 + Math.min(input.transcript.length / 100, 20))));
  const dimension = (name: string): ScoreDimension => ({
    score: base,
    evidence: "Development mock: no model evaluated answer correctness.",
    feedback: `Record more specific ${name} evidence before using a real scoring model.`
  });
  const scores = {
    retrieval: dimension("retrieval"),
    explanation: dimension("explanation"),
    precision: dimension("precision"),
    uncertainty: dimension("uncertainty"),
    researchConnection: dimension("research connection"),
    formulaUnderstanding: dimension("formula"),
    experimentEvidence: dimension("experiment"),
    criticalThinking: dimension("critical thinking")
  };
  return {
    schemaVersion: "1.0.0",
    examId: input.examId,
    paperSlug: input.paperSlug,
    paperTitle: input.paperTitle,
    scoredAt: new Date().toISOString(),
    model: "development-mock",
    mock: true,
    visibility: "hidden",
    overallScore: base,
    confidence: "low",
    retrievalScore: base,
    explanationScore: base,
    precisionScore: base,
    uncertaintyScore: base,
    scores,
    summary: "Development mock score based on answer presence and length only.",
    strengths: answered > 0 ? ["At least one answer contains enough text for workflow testing."] : [],
    gaps: ["No AI model checked correctness in development mock mode."],
    missedSignals: [],
    followUpQuestion: "Which answer should be strengthened with exact evidence from the paper note?",
    nextActions: ["Configure OPENAI_API_KEY in Worker secrets before treating any score as an evidence review."],
    limitations: [
      "This is a deterministic development mock, not an evaluation of paper understanding.",
      "The full paper was not independently verified."
    ],
    transcriptMetadata: {
      characterCount: input.transcript.length,
      questionCount: input.questions.length
    }
  };
}
