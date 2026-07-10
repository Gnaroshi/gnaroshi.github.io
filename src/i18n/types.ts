export const locales = ["en", "ko"] as const;

export type Locale = (typeof locales)[number];

export type TranslationParams = Record<string, string | number>;

export type AlternateUrls = {
  en: string;
  ko: string;
  xDefault?: string;
  translationAvailable?: boolean;
};
