import type { Locale } from "./types";
import { getLocalePath, translate } from "./utils";
import { publicFeatureFlags } from "../config/publicFeatureFlags";
import { getPublicCapabilities, type PublicCapabilities } from "../utils/publicCapabilities";

export function getPrimaryNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()) {
  const navigation = [
    { href: getLocalePath(locale, "/research"), label: translate(locale, "nav.research") },
    { href: getLocalePath(locale, "/projects"), label: translate(locale, "nav.projects") },
    ...(capabilities.hasWriting || publicFeatureFlags.writingOnboarding
      ? [{ href: getLocalePath(locale, "/blog"), label: translate(locale, "nav.writing") }]
      : []),
    ...(capabilities.hasPapers || publicFeatureFlags.paperLabOnboarding
      ? [{ href: getLocalePath(locale, "/papers"), label: translate(locale, "nav.paperLab") }]
      : []),
    { href: getLocalePath(locale, "/about"), label: translate(locale, "nav.about") }
  ];
  return navigation;
}

export function getUtilityNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()) {
  return capabilities.hasEligibleGrowth
    ? [{ href: getLocalePath(locale, "/growth"), label: translate(locale, "nav.growth") }]
    : [];
}

export function getFooterNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()) {
  return [
    { href: getLocalePath(locale, "/"), label: translate(locale, "nav.home") },
    ...getPrimaryNavigation(locale, capabilities),
    ...getUtilityNavigation(locale, capabilities),
    { href: getLocalePath(locale, "/now"), label: translate(locale, "nav.now") }
  ];
}

export function getPaperLabNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()) {
  const path = (value: string) => getLocalePath(locale, value);
  return [
    { href: path("/papers/"), label: translate(locale, "paperLab.overview") },
    { href: path("/papers/#reading-method"), label: translate(locale, "papers.method") },
    ...(capabilities.hasPapers
      ? [{ href: path("/papers/#paper-notes"), label: translate(locale, "paperLab.paperNotes") }]
      : []),
    ...(capabilities.hasReviews
      ? [
          { href: path("/reviews/"), label: translate(locale, "paperLab.aiReview") },
          { href: path("/reviews/due/"), label: translate(locale, "paperLab.reviewsDue") }
        ]
      : []),
    ...(capabilities.hasOralExams || capabilities.hasFormulaRecall
      ? [{ href: capabilities.hasFormulaRecall ? path("/formula/") : path("/papers/#paper-notes"), label: translate(locale, "paperLab.practice") }]
      : []),
    ...(capabilities.hasImplementations
      ? [{ href: path("/implementations/"), label: translate(locale, "paperLab.build") }]
      : []),
    ...(capabilities.hasWeeklyReviews || capabilities.hasResearchGraph || capabilities.hasEligibleGrowth
      ? [{
          href: capabilities.hasWeeklyReviews ? path("/week/") : capabilities.hasResearchGraph ? path("/graph/") : path("/growth/"),
          label: translate(locale, "paperLab.insights")
        }]
      : [])
  ];
}

export function isNavigationActive(currentPath: string, href: string): boolean {
  const cleanCurrent = currentPath.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const cleanHref = href.split("#")[0].replace(/\/$/, "") || "/";
  if (cleanHref === "/" || cleanHref === "/ko") return cleanCurrent === cleanHref;
  return cleanCurrent === cleanHref || cleanCurrent.startsWith(`${cleanHref}/`);
}
