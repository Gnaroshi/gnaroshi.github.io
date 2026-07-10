import type { Locale } from "../i18n/types";

export type LocalizedContentData = {
  locale: Locale;
  translationKey: string;
  translationStatus: "complete" | "partial" | "source-only";
};

export function getContentSlug(id: string): string {
  const segments = id.split("/").filter(Boolean);
  return segments.at(-1) ?? id;
}

export function isContentLocale(entry: { data: LocalizedContentData }, locale: Locale): boolean {
  return entry.data.locale === locale;
}

export function getTranslationEntry<T extends { data: LocalizedContentData }>(
  entries: T[],
  entry: T,
  locale: Locale
): T | undefined {
  return entries.find((candidate) =>
    candidate.data.translationKey === entry.data.translationKey && candidate.data.locale === locale
  );
}

export function deduplicateTranslations<T extends { data: LocalizedContentData }>(entries: T[]): T[] {
  const byKey = new Map<string, T>();
  for (const entry of entries) {
    const current = byKey.get(entry.data.translationKey);
    if (!current || (current.data.locale !== "en" && entry.data.locale === "en")) {
      byKey.set(entry.data.translationKey, entry);
    }
  }
  return [...byKey.values()];
}
