export type ApiTargetDepth = "pass1" | "pass2" | "pass3";
export type ApiExamLanguage = "ko-KR" | "en-US";

export type ApiPaperContext = {
  oneLineSummary: string;
  coreIdea: string;
  mainFormula: string;
  formulaInterpretation: string;
  experimentTakeaway: string;
  notesExcerpt: string;
};

export type ResearchApiConfig = {
  realtimeEnabled: boolean;
  transcriptionEnabled: boolean;
  ttsEnabled: boolean;
  maxExamMinutes: number;
  allowedLanguages: ApiExamLanguage[];
};

export type RealtimeSessionRequest = {
  paperSlug: string;
  paperTitle: string;
  targetDepth: ApiTargetDepth;
  language: ApiExamLanguage;
  examMode: "oral";
  questionCount: number;
  paperContext: ApiPaperContext;
};

export type RealtimeSessionResponse = {
  sessionId: string;
  expiresAt: string;
  realtime: {
    clientSecret: string;
    model: string;
  };
  examPlan: {
    openingPrompt: string;
    questionTypes: string[];
    estimatedMinutes: number;
  };
};

export type OralExamQuestionType =
  | "retrieval"
  | "method"
  | "formula"
  | "experiment"
  | "critical-thinking"
  | "research-connection";

export type OralExamQuestion = {
  id: string;
  type: OralExamQuestionType;
  prompt: string;
  expectedSignals: string[];
  difficulty: number;
  followUpPrompt: string;
};

export type GeneratedOralExam = {
  schemaVersion: "1.0.0";
  examId: string;
  paperSlug: string;
  paperTitle: string;
  targetDepth: ApiTargetDepth;
  language: ApiExamLanguage;
  generatedAt: string;
  model: string;
  mock: boolean;
  questions: OralExamQuestion[];
};

export type ScoredOralExam = {
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
  scores: Record<string, { score: number; evidence: string; feedback: string }>;
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

export type ExamScoreRequest = {
  paperSlug: string;
  paperTitle: string;
  examId: string;
  targetDepth: ApiTargetDepth;
  language: ApiExamLanguage;
  questions: OralExamQuestion[];
  answers: string[];
  transcript: string;
  paperContext: ApiPaperContext;
};

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
  };
};
