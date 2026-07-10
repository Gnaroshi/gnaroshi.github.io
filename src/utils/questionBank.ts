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

export type QuestionBank = {
  schemaVersion: "1.0.0";
  generatedAt: string;
  questions: QuestionBankItem[];
};

const questionBankModules = import.meta.glob("../generated/question-bank/*.json", { eager: true });

export function getQuestionBank(): QuestionBank {
  const banks = Object.values(questionBankModules)
    .map(unwrapJsonModule)
    .filter(isQuestionBank);

  return (
    banks[0] ?? {
      schemaVersion: "1.0.0",
      generatedAt: "",
      questions: []
    }
  );
}

export function getActiveQuestions(): QuestionBankItem[] {
  return getQuestionBank().questions.filter((question) => question.status === "active");
}

export function getQuestionById(id: string): QuestionBankItem | undefined {
  return getQuestionBank().questions.find((question) => question.id === id);
}

export function getWeakQuestions(questions = getActiveQuestions()): QuestionBankItem[] {
  return [...questions]
    .filter((question) => question.lastScore === null || question.lastScore <= 3 || question.timesAsked === 0)
    .sort((a, b) => b.difficulty - a.difficulty || a.question.localeCompare(b.question));
}

export function getFormulaQuestions(questions = getActiveQuestions()): QuestionBankItem[] {
  return questions.filter((question) => question.type === "formula");
}

export function getDueQuestions(questions = getActiveQuestions(), today = getTodayKey()): QuestionBankItem[] {
  return questions.filter((question) => {
    if (!question.lastAsked) return true;
    const intervalDays = Math.min(30, Math.max(1, question.difficulty * 2 + question.timesAsked));
    return addDays(question.lastAsked, intervalDays) <= today;
  });
}

export function getTodayKey(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function unwrapJsonModule(module: unknown): unknown {
  if (module && typeof module === "object" && "default" in module) return (module as { default: unknown }).default;
  return module;
}

function isQuestionBank(value: unknown): value is QuestionBank {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as QuestionBank).schemaVersion === "1.0.0" &&
      Array.isArray((value as QuestionBank).questions)
  );
}

function addDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}
