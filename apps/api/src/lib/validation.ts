import { ApiError } from "./errors.ts";
import { MAX_JSON_BODY_BYTES, assertContentLength } from "./security.ts";
import {
  examQuestionTypes,
  type ExamGenerationRequest,
  type ExamQuestion,
  type ExamScoreRequest
} from "../schemas/exam.ts";
import type { RealtimeSessionRequest } from "../schemas/realtime.ts";
import {
  languageValues,
  targetDepthValues,
  type ExamBaseRequest,
  type ExamLanguage,
  type PaperContext,
  type TargetDepth
} from "../schemas/shared.ts";

export async function parseRealtimeSessionRequest(request: Request): Promise<RealtimeSessionRequest> {
  const value = await parseJsonObject(request);
  return {
    ...parseExamBase(value),
    examMode: readLiteral(value, "examMode", ["oral"] as const),
    questionCount: readInteger(value, "questionCount", 3, 12)
  };
}

export async function parseExamGenerationRequest(request: Request): Promise<ExamGenerationRequest> {
  const value = await parseJsonObject(request);
  return {
    ...parseExamBase(value),
    questionCount: value.questionCount === undefined ? undefined : readInteger(value, "questionCount", 3, 12)
  };
}

export async function parseExamScoreRequest(request: Request, maxTranscriptCharacters: number): Promise<ExamScoreRequest> {
  const value = await parseJsonObject(request);
  const questions = readArray(value, "questions", 0, 20).map((question, index) => parseExamQuestion(question, index));
  const answers = readArray(value, "answers", 0, 20).map((answer, index) =>
    assertString(answer, `answers[${index}]`, 0, 12_000)
  );
  return {
    ...parseExamBase(value),
    examId: readString(value, "examId", 1, 160),
    questions,
    answers,
    transcript: readString(value, "transcript", 0, maxTranscriptCharacters)
  };
}

export async function parseSpeechRequest(request: Request): Promise<{
  text: string;
  voice: string;
  language: ExamLanguage;
}> {
  const value = await parseJsonObject(request);
  return {
    text: readString(value, "text", 1, 4_000),
    voice: readString(value, "voice", 1, 40),
    language: readLiteral(value, "language", languageValues)
  };
}

export function getPositiveInteger(value: string | undefined, fallback: number, maximum: number): number {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? Math.min(number, maximum) : fallback;
}

async function parseJsonObject(request: Request): Promise<Record<string, unknown>> {
  assertContentLength(request, MAX_JSON_BODY_BYTES);
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new ApiError(415, "unsupported_media_type", "Content-Type must be application/json.");
  }
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_JSON_BODY_BYTES) {
    throw new ApiError(413, "request_too_large", "The request body is too large.");
  }
  try {
    return assertObject(JSON.parse(body), "request body");
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "invalid_json", "The request body must be valid JSON.");
  }
}

function parseExamBase(value: Record<string, unknown>): ExamBaseRequest {
  return {
    paperSlug: readString(value, "paperSlug", 1, 180),
    paperTitle: readString(value, "paperTitle", 1, 300),
    targetDepth: readLiteral(value, "targetDepth", targetDepthValues) as TargetDepth,
    language: readLiteral(value, "language", languageValues) as ExamLanguage,
    paperContext: parsePaperContext(value.paperContext)
  };
}

function parsePaperContext(value: unknown): PaperContext {
  const context = assertObject(value, "paperContext");
  return {
    oneLineSummary: readString(context, "oneLineSummary", 0, 2_000),
    coreIdea: readString(context, "coreIdea", 0, 4_000),
    mainFormula: readString(context, "mainFormula", 0, 4_000),
    formulaInterpretation: readString(context, "formulaInterpretation", 0, 4_000),
    experimentTakeaway: readString(context, "experimentTakeaway", 0, 4_000),
    notesExcerpt: readString(context, "notesExcerpt", 0, 12_000)
  };
}

function parseExamQuestion(value: unknown, index: number): ExamQuestion {
  const question = assertObject(value, `questions[${index}]`);
  return {
    id: readString(question, "id", 1, 160),
    type: readLiteral(question, "type", examQuestionTypes),
    prompt: readString(question, "prompt", 1, 4_000),
    expectedSignals: readArray(question, "expectedSignals", 0, 20).map((signal, signalIndex) =>
      assertString(signal, `questions[${index}].expectedSignals[${signalIndex}]`, 0, 1_000)
    ),
    difficulty: readInteger(question, "difficulty", 1, 5),
    followUpPrompt: readString(question, "followUpPrompt", 0, 2_000)
  };
}

function assertObject(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "validation_error", `${path} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function readString(
  object: Record<string, unknown>,
  key: string,
  minimumLength: number,
  maximumLength: number
): string {
  return assertString(object[key], key, minimumLength, maximumLength);
}

function assertString(value: unknown, path: string, minimumLength: number, maximumLength: number): string {
  if (typeof value !== "string" || value.length < minimumLength || value.length > maximumLength) {
    throw new ApiError(
      400,
      "validation_error",
      `${path} must be a string between ${minimumLength} and ${maximumLength} characters.`
    );
  }
  return value;
}

function readInteger(object: Record<string, unknown>, key: string, minimum: number, maximum: number): number {
  const value = object[key];
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) {
    throw new ApiError(400, "validation_error", `${key} must be an integer between ${minimum} and ${maximum}.`);
  }
  return value as number;
}

function readArray(
  object: Record<string, unknown>,
  key: string,
  minimumLength: number,
  maximumLength: number
): unknown[] {
  const value = object[key];
  if (!Array.isArray(value) || value.length < minimumLength || value.length > maximumLength) {
    throw new ApiError(400, "validation_error", `${key} must contain between ${minimumLength} and ${maximumLength} items.`);
  }
  return value;
}

function readLiteral<const T extends readonly string[]>(
  object: Record<string, unknown>,
  key: string,
  allowed: T
): T[number] {
  const value = object[key];
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new ApiError(400, "validation_error", `${key} must be one of: ${allowed.join(", ")}.`);
  }
  return value as T[number];
}
