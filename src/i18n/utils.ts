import { defaultLocale } from "./config";
import { en, type TranslationKey } from "./en";
import { ko } from "./ko";
import { locales, type Locale, type TranslationParams } from "./types";

const dictionaries = { en, ko } as const;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === "string" ? new URL(url, "https://gnaroshi.dev").pathname : url.pathname;
  return pathname === "/ko" || pathname.startsWith("/ko/") ? "ko" : defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
  const { path, suffix } = splitPathSuffix(pathname);
  const stripped = path === "/ko" ? "/" : path.startsWith("/ko/") ? path.slice(3) || "/" : path;
  return `${normalizePath(stripped)}${suffix}`;
}

export function getLocalePath(locale: Locale, pathname: string): string {
  const stripped = stripLocalePrefix(pathname);
  const { path, suffix } = splitPathSuffix(stripped);
  if (locale === "en") return `${normalizePath(path)}${suffix}`;
  return path === "/" ? `/ko/${suffix}` : `/ko${normalizePath(path)}${suffix}`;
}

export function getCounterpartUrl(locale: Locale, pathname: string): string {
  return getLocalePath(locale === "en" ? "ko" : "en", pathname);
}

export function translate(locale: Locale, key: TranslationKey, params: TranslationParams = {}): string {
  const value = dictionaries[locale][key] ?? dictionaries.en[key];
  return Object.entries(params).reduce(
    (result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)),
    value
  );
}

export function getLocalizedCollectionIndex(locale: Locale, pathname: string): string {
  const stripped = stripLocalePrefix(pathname).split(/[?#]/)[0];
  const section = stripped.split("/").filter(Boolean)[0] ?? "";
  const indexes = new Set(["blog", "papers", "projects", "queue", "questions", "implementations", "graph", "week"]);
  return getLocalePath(locale, indexes.has(section) ? `/${section}/` : "/");
}

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function splitPathSuffix(value: string): { path: string; suffix: string } {
  const index = value.search(/[?#]/);
  return index < 0 ? { path: value, suffix: "" } : { path: value.slice(0, index), suffix: value.slice(index) };
}
