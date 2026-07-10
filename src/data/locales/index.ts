import type { Locale } from "../../i18n/types";
import { enData } from "./en";
import { koData } from "./ko";

export const localizedData = { en: enData, ko: koData } as const;

export function getLocalizedData(locale: Locale) {
  return localizedData[locale];
}
