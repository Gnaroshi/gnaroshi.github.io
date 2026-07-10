import type { ExamBaseRequest, ExamLanguage, TargetDepth } from "./shared.ts";
import { paperContextSchema } from "./shared.ts";
import type { JsonSchema } from "../types.ts";

export const examQuestionTypes = [
  "retrieval",
  "method",
  "formula",
  "experiment",
  "critical-thinking",
  "research-connection"
] as const;

export type ExamQuestionType = (typeof examQuestionTypes)[number];

export type ExamQuestion = {
  id: string;
  type: ExamQuestionType;
  prompt: string;
  expectedSignals: string[];
  difficulty: number;
  followUpPrompt: string;
};

export type ExamGenerationRequest = ExamBaseRequest & {
  questionCount?: number;
};

export type ExamGenerationResponse = {
  schemaVersion: "1.0.0";
  examId: string;
  paperSlug: string;
  paperTitle: string;
  targetDepth: TargetDepth;
  language: ExamLanguage;
  generatedAt: string;
  model: string;
  mock: boolean;
  questions: ExamQuestion[];
};

export type ExamScoreRequest = ExamBaseRequest & {
  examId: string;
  questions: ExamQuestion[];
  answers: string[];
  transcript: string;
};

export type ScoreDimension = {
  score: number;
  evidence: string;
  feedback: string;
};

export type ScoredExamResponse = {
  schemaVersion: "1.0.0";
  examId: string;
  paperSlug: string;
  paperTitle: string;
  scoredAt: string;
  model: string;
  mock: boolean;
  visibility: "hidden";
  overallScore: number;
  confidence: "low" | "medium" | "high";
  retrievalScore: number;
  explanationScore: number;
  precisionScore: number;
  uncertaintyScore: number;
  scores: Record<string, ScoreDimension>;
  summary: string;
  strengths: string[];
  gaps: string[];
  missedSignals: string[];
  followUpQuestion: string;
  nextActions: string[];
  limitations: string[];
  transcriptMetadata: {
    characterCount: number;
    questionCount: number;
  };
};

const examQuestionSchema: JsonSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    type: { type: "string", enum: examQuestionTypes },
    prompt: { type: "string" },
    expectedSignals: { type: "array", items: { type: "string" } },
    difficulty: { type: "integer", minimum: 1, maximum: 5 },
    followUpPrompt: { type: "string" }
  },
  required: ["id", "type", "prompt", "expectedSignals", "difficulty", "followUpPrompt"],
  additionalProperties: false
};

export const examGenerationOutputSchema: JsonSchema = {
  type: "object",
  properties: {
    schemaVersion: { type: "string", const: "1.0.0" },
    examId: { type: "string" },
    paperSlug: { type: "string" },
    paperTitle: { type: "string" },
    targetDepth: { type: "string", enum: ["pass1", "pass2", "pass3"] },
    language: { type: "string", enum: ["ko-KR", "en-US"] },
    generatedAt: { type: "string" },
    model: { type: "string" },
    mock: { type: "boolean" },
    questions: { type: "array", items: examQuestionSchema }
  },
  required: [
    "schemaVersion",
    "examId",
    "paperSlug",
    "paperTitle",
    "targetDepth",
    "language",
    "generatedAt",
    "model",
    "mock",
    "questions"
  ],
  additionalProperties: false
};

const scoreDimensionSchema: JsonSchema = {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    evidence: { type: "string" },
    feedback: { type: "string" }
  },
  required: ["score", "evidence", "feedback"],
  additionalProperties: false
};

const scoreDimensionNames = [
  "retrieval",
  "explanation",
  "precision",
  "uncertainty",
  "researchConnection",
  "formulaUnderstanding",
  "experimentEvidence",
  "criticalThinking"
];

export const examScoreOutputSchema: JsonSchema = {
  type: "object",
  properties: {
    schemaVersion: { type: "string", const: "1.0.0" },
    examId: { type: "string" },
    paperSlug: { type: "string" },
    paperTitle: { type: "string" },
    scoredAt: { type: "string" },
    model: { type: "string" },
    mock: { type: "boolean" },
    visibility: { type: "string", const: "hidden" },
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    retrievalScore: { type: "integer", minimum: 0, maximum: 100 },
    explanationScore: { type: "integer", minimum: 0, maximum: 100 },
    precisionScore: { type: "integer", minimum: 0, maximum: 100 },
    uncertaintyScore: { type: "integer", minimum: 0, maximum: 100 },
    scores: {
      type: "object",
      properties: Object.fromEntries(scoreDimensionNames.map((name) => [name, scoreDimensionSchema])),
      required: scoreDimensionNames,
      additionalProperties: false
    },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    gaps: { type: "array", items: { type: "string" } },
    missedSignals: { type: "array", items: { type: "string" } },
    followUpQuestion: { type: "string" },
    nextActions: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
    transcriptMetadata: {
      type: "object",
      properties: {
        characterCount: { type: "integer", minimum: 0 },
        questionCount: { type: "integer", minimum: 0 }
      },
      required: ["characterCount", "questionCount"],
      additionalProperties: false
    }
  },
  required: [
    "schemaVersion",
    "examId",
    "paperSlug",
    "paperTitle",
    "scoredAt",
    "model",
    "mock",
    "visibility",
    "overallScore",
    "confidence",
    "retrievalScore",
    "explanationScore",
    "precisionScore",
    "uncertaintyScore",
    "scores",
    "summary",
    "strengths",
    "gaps",
    "missedSignals",
    "followUpQuestion",
    "nextActions",
    "limitations",
    "transcriptMetadata"
  ],
  additionalProperties: false
};

export const examScoreRequestSchema: JsonSchema = {
  type: "object",
  properties: {
    paperSlug: { type: "string" },
    paperTitle: { type: "string" },
    examId: { type: "string" },
    targetDepth: { type: "string", enum: ["pass1", "pass2", "pass3"] },
    language: { type: "string", enum: ["ko-KR", "en-US"] },
    questions: { type: "array", items: examQuestionSchema },
    answers: { type: "array", items: { type: "string" } },
    transcript: { type: "string" },
    paperContext: paperContextSchema
  },
  required: ["paperSlug", "paperTitle", "examId", "targetDepth", "language", "questions", "answers", "transcript", "paperContext"],
  additionalProperties: false
};
