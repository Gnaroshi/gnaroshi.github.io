import type { ExamBaseRequest } from "./shared.ts";

export type RealtimeSessionRequest = ExamBaseRequest & {
  examMode: "oral";
  questionCount: number;
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
