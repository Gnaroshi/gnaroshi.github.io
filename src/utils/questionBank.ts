import { readContentFeedJson } from "./contentFeed";

export type QuestionSource = "ai-review" | "oral-exam" | "manual";
export type QuestionType = "formula" | "method" | "experiment" | "critical-thinking" | "research-connection" | "retrieval";

export type QuestionBankItem = {
  id: string;
  paperSlug: string;
  source: QuestionSource;
  type: QuestionType;
  question: string;
  expectedSignals: string[];
  difficulty: number;
  lastAsked: string;
  timesAsked: number;
  lastScore: number | null;
  status: "active" | "paused" | "retired";
};

export type QuestionBank = { schemaVersion: "1.0.0"; generatedAt: string; questions: QuestionBankItem[] };

type FeedQuestion = {
  id: string;
  schemaVersion: number;
  visibility: string;
  paperId?: string;
  questionType: "summary" | "method" | "formula" | "experiment" | "critique" | "connection";
  question: string;
  expectedSignals: string[];
  difficulty: number;
  sourceType: "manual" | "paper-review" | "oral-exam" | "formula-recall";
  updatedAt: string;
};

const questionTypeMap: Record<FeedQuestion["questionType"], QuestionType> = {
  summary: "retrieval",
  method: "method",
  formula: "formula",
  experiment: "experiment",
  critique: "critical-thinking",
  connection: "research-connection"
};

export function getQuestionBank(): QuestionBank {
  const stored = readContentFeedJson<FeedQuestion[] | { questions: FeedQuestion[] }>("data/question-bank/index.json", []);
  const feedQuestions = Array.isArray(stored) ? stored : stored.questions;
  const questions = feedQuestions.filter((item) => item.schemaVersion === 1 && item.visibility === "public").map((item) => ({
    id: item.id,
    paperSlug: item.paperId ?? "",
    source: item.sourceType === "oral-exam" ? "oral-exam" as const : item.sourceType === "paper-review" ? "ai-review" as const : "manual" as const,
    type: questionTypeMap[item.questionType],
    question: item.question,
    expectedSignals: item.expectedSignals,
    difficulty: item.difficulty,
    lastAsked: "",
    timesAsked: 0,
    lastScore: null,
    status: "active" as const
  }));
  return { schemaVersion: "1.0.0", generatedAt: feedQuestions.map((item) => item.updatedAt).sort().at(-1) ?? "", questions };
}

export function getActiveQuestions(): QuestionBankItem[] { return getQuestionBank().questions.filter((question) => question.status === "active"); }
export function getQuestionById(id: string): QuestionBankItem | undefined { return getQuestionBank().questions.find((question) => question.id === id); }
export function getWeakQuestions(questions = getActiveQuestions()): QuestionBankItem[] { return [...questions].sort((a, b) => b.difficulty - a.difficulty || a.question.localeCompare(b.question)); }
export function getFormulaQuestions(questions = getActiveQuestions()): QuestionBankItem[] { return questions.filter((question) => question.type === "formula"); }
export function getDueQuestions(questions = getActiveQuestions()): QuestionBankItem[] { return questions; }
export function getTodayKey(date = new Date()): string { return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-"); }
