import { localeTags } from "./config";
import type { Locale } from "./types";

export function formatLocalizedDate(value: Date | string, locale: Locale, options: Intl.DateTimeFormatOptions = {}): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(localeTags[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options
  }).format(date);
}

export function formatLocalizedMonth(value: Date | string, locale: Locale): string {
  return formatLocalizedDate(value, locale, { year: "numeric", month: "long", day: undefined });
}

export function formatLocalizedNumber(value: number, locale: Locale, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(localeTags[locale], options).format(value);
}
