import { localizedData } from "./locales";

export const researchAreas = localizedData.en.researchAreas;
export const researchQuestions = researchAreas.map((area) => ({
  title: area.question,
  summary: area.motivation
}));
