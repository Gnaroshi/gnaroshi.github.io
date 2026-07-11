import type { Locale } from "./types";
import { getLocalePath, translate } from "./utils";

export function getPrimaryNavigation(locale: Locale) {
  return [
    { href: getLocalePath(locale, "/research"), label: translate(locale, "nav.research") },
    { href: getLocalePath(locale, "/projects"), label: translate(locale, "nav.projects") },
    { href: getLocalePath(locale, "/blog"), label: translate(locale, "nav.writing") },
    { href: getLocalePath(locale, "/papers"), label: translate(locale, "nav.paperLab") },
    { href: getLocalePath(locale, "/about"), label: translate(locale, "nav.about") }
  ];
}

export function getUtilityNavigation(locale: Locale) {
  return [{ href: getLocalePath(locale, "/growth"), label: translate(locale, "nav.growth") }];
}

export function getFooterNavigation(locale: Locale) {
  return [
    { href: getLocalePath(locale, "/"), label: translate(locale, "nav.home") },
    ...getPrimaryNavigation(locale),
    ...getUtilityNavigation(locale),
    { href: getLocalePath(locale, "/now"), label: translate(locale, "nav.now") },
    { href: getLocalePath(locale, "/contact"), label: translate(locale, "nav.links") }
  ];
}

export function getPaperLabNavigation(locale: Locale) {
  const path = (value: string) => getLocalePath(locale, value);
  return [
    { label: translate(locale, "paperLab.overview"), items: [
      { href: path("/papers/"), label: translate(locale, "paperLab.paperLog") },
      { href: path("/growth/"), label: translate(locale, "nav.growth") }
    ] },
    { label: translate(locale, "paperLab.read"), items: [
      { href: path("/queue/"), label: translate(locale, "paperLab.readingQueue") },
      { href: path("/papers/"), label: translate(locale, "paperLab.paperNotes") }
    ] },
    { label: translate(locale, "paperLab.review"), items: [
      { href: path("/reviews/"), label: translate(locale, "paperLab.reviewsDue") },
      { href: path("/reviews/"), label: translate(locale, "paperLab.aiReview") }
    ] },
    { label: translate(locale, "paperLab.practice"), items: [
      { href: path("/papers/"), label: translate(locale, "paperLab.oralExam") },
      { href: path("/formula/"), label: translate(locale, "paperLab.formulaRecall") },
      { href: path("/questions/"), label: translate(locale, "paperLab.questionBank") }
    ] },
    { label: translate(locale, "paperLab.build"), items: [
      { href: path("/implementations/"), label: translate(locale, "paperLab.implementations") },
      { href: path("/blog/"), label: translate(locale, "paperLab.paperToBlog") }
    ] },
    { label: translate(locale, "paperLab.insights"), items: [
      { href: path("/week/"), label: translate(locale, "paperLab.weeklyReviews") },
      { href: path("/graph/"), label: translate(locale, "paperLab.researchGraph") }
    ] }
  ];
}

export function isNavigationActive(currentPath: string, href: string): boolean {
  const cleanCurrent = currentPath.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const cleanHref = href.split("#")[0].replace(/\/$/, "") || "/";
  if (cleanHref === "/" || cleanHref === "/ko") return cleanCurrent === cleanHref;
  return cleanCurrent === cleanHref || cleanCurrent.startsWith(`${cleanHref}/`);
}
