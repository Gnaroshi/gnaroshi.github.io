import type { JsonSchema } from "../types.ts";

export const targetDepthValues = ["pass1", "pass2", "pass3"] as const;
export const languageValues = ["ko-KR", "en-US"] as const;

export type TargetDepth = (typeof targetDepthValues)[number];
export type ExamLanguage = (typeof languageValues)[number];

export type PaperContext = {
  oneLineSummary: string;
  coreIdea: string;
  mainFormula: string;
  formulaInterpretation: string;
  experimentTakeaway: string;
  notesExcerpt: string;
};

export const paperContextSchema: JsonSchema = {
  type: "object",
  properties: {
    oneLineSummary: { type: "string" },
    coreIdea: { type: "string" },
    mainFormula: { type: "string" },
    formulaInterpretation: { type: "string" },
    experimentTakeaway: { type: "string" },
    notesExcerpt: { type: "string" }
  },
  required: [
    "oneLineSummary",
    "coreIdea",
    "mainFormula",
    "formulaInterpretation",
    "experimentTakeaway",
    "notesExcerpt"
  ],
  additionalProperties: false
};

export type ExamBaseRequest = {
  paperSlug: string;
  paperTitle: string;
  targetDepth: TargetDepth;
  language: ExamLanguage;
  paperContext: PaperContext;
};
