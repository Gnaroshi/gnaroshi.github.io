import type { Locale } from "./types";

export const defaultLocale: Locale = "en";
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ko: "한국어"
};
export const localeTags: Record<Locale, string> = {
  en: "en-US",
  ko: "ko-KR"
};
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  ko: "ko_KR"
};
