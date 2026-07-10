import type { Locale } from "./types";

const tagLabels: Record<string, Record<Locale, string>> = {
  "vision-language-models": { en: "Vision-language models", ko: "비전-언어 모델" },
  "paper-reading": { en: "Paper reading", ko: "논문 읽기" },
  "research-workflow": { en: "Research workflow", ko: "연구 흐름" },
  "research-method": { en: "Research method", ko: "연구 방법" },
  markdown: { en: "Markdown", ko: "Markdown" },
  git: { en: "Git", ko: "Git" },
  notes: { en: "Notes", ko: "노트" },
  "site-notes": { en: "Site notes", ko: "사이트 기록" }
};

export function getLocalizedTagLabel(tagId: string, locale: Locale): string {
  return tagLabels[tagId]?.[locale] ?? tagId.replaceAll("-", " ");
}
