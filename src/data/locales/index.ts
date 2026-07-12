import type { Locale } from "../../i18n/types";
import { projectFacts } from "../facts/projects";
import { currentFocusFact, researchFacts } from "../facts/research";
import { enCopy } from "./en";
import { koCopy } from "./ko";
import type { LocaleCopy, LocalizedData } from "./types";

function routeHref(locale: Locale, route: string): string {
  const routes: Record<string, string> = {
    writing: "/blog/",
    "paper-lab": "/papers/",
    "gnaroshi-vla": "/projects/gnaroshi-vla/"
  };
  const path = routes[route];
  if (!path) throw new Error(`Unknown research route: ${route}`);
  return locale === "ko" ? `/ko${path}` : path;
}

function buildLocalizedData(locale: Locale, copy: LocaleCopy): LocalizedData {
  return {
    profile: copy.profile,
    researchAreas: researchFacts.map((fact) => ({
      ...fact,
      ...copy.researchAreas[fact.id],
      related: fact.relatedRoutes.map((route, index) => ({
        label: copy.researchAreas[fact.id].relatedLabels[index]!,
        href: routeHref(locale, route)
      }))
    })),
    projects: projectFacts.map((fact) => ({
      ...fact,
      ...copy.projects[fact.id],
      links: fact.links.map((link) => ({
        ...link,
        label: copy.projects[fact.id].linkLabels[link.id]!
      }))
    })),
    now: { lastUpdated: currentFocusFact.lastUpdated, ...copy.now },
    skillGroups: copy.skillGroups,
    systemArchitecture: copy.systemArchitecture
  };
}

export const localizedData = {
  en: buildLocalizedData("en", enCopy),
  ko: buildLocalizedData("ko", koCopy)
} as const;

export function getLocalizedData(locale: Locale) {
  return localizedData[locale];
}
