import type { Locale } from "./types";
import { getLocalePath, translate } from "./utils";
import { publicFeatureFlags } from "../config/publicFeatureFlags";
import { getPublicCapabilities, type PublicCapabilities } from "../utils/publicCapabilities";

export type NavigationItem = { id: string; href: string; label: string };
export type PaperLabNavigationGroup = { id: string; label: string; items: NavigationItem[] };

export function getPrimaryNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()): NavigationItem[] {
  const navigation: NavigationItem[] = [
    { id: "research", href: getLocalePath(locale, "/research"), label: translate(locale, "nav.research") },
    { id: "projects", href: getLocalePath(locale, "/projects"), label: translate(locale, "nav.projects") }
  ];
  if (capabilities.hasWriting || publicFeatureFlags.writingEmptyLanding) {
    navigation.push({ id: "writing", href: getLocalePath(locale, "/blog"), label: translate(locale, "nav.writing") });
  }
  if (capabilities.hasPapers || publicFeatureFlags.paperLabOnboarding) {
    navigation.push({ id: "paper-lab", href: getLocalePath(locale, "/papers"), label: translate(locale, "nav.paperLab") });
  }
  navigation.push({ id: "about", href: getLocalePath(locale, "/about"), label: translate(locale, "nav.about") });
  return navigation;
}

export function getUtilityNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()): NavigationItem[] {
  return capabilities.hasEligibleGrowth
    ? [{ id: "growth", href: getLocalePath(locale, "/growth"), label: translate(locale, "nav.growth") }]
    : [];
}

export function getFooterNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()): NavigationItem[] {
  return [
    { id: "home", href: getLocalePath(locale, "/"), label: translate(locale, "nav.home") },
    ...getPrimaryNavigation(locale, capabilities),
    ...getUtilityNavigation(locale, capabilities),
    { id: "now", href: getLocalePath(locale, "/now"), label: translate(locale, "nav.now") },
    { id: "contact", href: getLocalePath(locale, "/contact"), label: translate(locale, "nav.links") }
  ];
}

export function getPaperLabNavigation(locale: Locale, capabilities: PublicCapabilities = getPublicCapabilities()): PaperLabNavigationGroup[] {
  const path = (value: string) => getLocalePath(locale, value);
  const overview: PaperLabNavigationGroup = {
    id: "overview",
    label: translate(locale, "paperLab.overview"),
    items: [
      { id: "overview", href: path("/papers/"), label: translate(locale, "paperLab.overview") },
      { id: "reading-method", href: path("/papers/#reading-method"), label: translate(locale, "paperLab.readingMethod") }
    ]
  };
  if (capabilities.hasPapers) {
    overview.items.push({ id: "paper-notes", href: path("/papers/#paper-notes"), label: translate(locale, "paperLab.paperNotes") });
  }

  const groups: PaperLabNavigationGroup[] = [overview];
  if (capabilities.hasReviews) {
    groups.push({ id: "review", label: translate(locale, "paperLab.review"), items: [
      { id: "ai-review", href: path("/reviews/"), label: translate(locale, "paperLab.aiReview") },
      { id: "reviews-due", href: path("/reviews/"), label: translate(locale, "paperLab.reviewsDue") }
    ] });
  }
  if (capabilities.hasOralExams || capabilities.hasFormulaRecall) {
    const items: NavigationItem[] = [];
    if (capabilities.hasOralExams) items.push({ id: "oral-exam", href: path("/papers/#paper-notes"), label: translate(locale, "paperLab.oralExam") });
    if (capabilities.hasFormulaRecall) items.push({ id: "formula-recall", href: path("/formula/"), label: translate(locale, "paperLab.formulaRecall") });
    groups.push({ id: "practice", label: translate(locale, "paperLab.practice"), items });
  }
  if (capabilities.hasImplementations) {
    groups.push({ id: "build", label: translate(locale, "paperLab.build"), items: [
      { id: "implementations", href: path("/implementations/"), label: translate(locale, "paperLab.implementations") }
    ] });
  }
  if (capabilities.hasWeeklyReviews || capabilities.hasResearchGraph || capabilities.hasEligibleGrowth) {
    const items: NavigationItem[] = [];
    if (capabilities.hasWeeklyReviews) items.push({ id: "weekly-reviews", href: path("/week/"), label: translate(locale, "paperLab.weeklyReviews") });
    if (capabilities.hasResearchGraph) items.push({ id: "research-graph", href: path("/graph/"), label: translate(locale, "paperLab.researchGraph") });
    if (capabilities.hasEligibleGrowth) items.push({ id: "growth-insight", href: path("/growth/"), label: translate(locale, "nav.growth") });
    groups.push({ id: "insights", label: translate(locale, "paperLab.insights"), items });
  }
  return groups;
}

export function isNavigationActive(currentPath: string, href: string): boolean {
  const hrefFragment = href.split("#")[1];
  if (hrefFragment && !currentPath.includes(`#${hrefFragment}`)) return false;
  const cleanCurrent = currentPath.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const cleanHref = href.split("#")[0].replace(/\/$/, "") || "/";
  if (cleanHref === "/" || cleanHref === "/ko") return cleanCurrent === cleanHref;
  return cleanCurrent === cleanHref || cleanCurrent.startsWith(`${cleanHref}/`);
}
