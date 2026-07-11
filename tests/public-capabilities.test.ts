import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { derivePublicCapabilities, type PublicCapabilities, type PublicCapabilityInputs } from "../src/utils/publicCapabilities";
import { getFooterNavigation, getPaperLabNavigation, getPrimaryNavigation, getUtilityNavigation } from "../src/i18n/routes";
import type { Locale } from "../src/i18n/types";

type Fixture = PublicCapabilityInputs & {
  expected: {
    trueCapabilities: Array<keyof PublicCapabilities>;
    primaryIds: string[];
    utilityIds: string[];
    paperLabGroups: string[][];
  };
};

const capabilityKeys: Array<keyof PublicCapabilities> = [
  "hasWriting", "hasPapers", "hasReadingActivity", "hasReviews", "hasOralExams",
  "hasFormulaRecall", "hasImplementations", "hasWeeklyReviews", "hasResearchGraph", "hasEligibleGrowth"
];

const labels: Record<Locale, Record<string, string>> = {
  en: {
    home: "Home", research: "Research", projects: "Projects", writing: "Writing", "paper-lab": "Paper Lab", about: "About", growth: "Growth", "growth-insight": "Growth", now: "Now", contact: "Links",
    overview: "Overview", "reading-method": "Reading method", "paper-notes": "Paper Notes", review: "Review", "ai-review": "AI Review",
    "reviews-due": "Reviews Due", practice: "Practice", "oral-exam": "Oral Exam", "formula-recall": "Formula Recall", build: "Build",
    implementations: "Implementations", insights: "Insights", "weekly-reviews": "Weekly Reviews", "research-graph": "Research Graph"
  },
  ko: {
    home: "홈", research: "연구", projects: "프로젝트", writing: "글", "paper-lab": "논문 연구실", about: "소개", growth: "성장", "growth-insight": "성장", now: "요즘", contact: "링크",
    overview: "개요", "reading-method": "읽기 방법", "paper-notes": "논문 노트", review: "복습", "ai-review": "AI 리뷰",
    "reviews-due": "복습 예정", practice: "연습", "oral-exam": "구술 연습", "formula-recall": "수식 회상", build: "구현",
    implementations: "구현 시도", insights: "분석", "weekly-reviews": "주간 회고", "research-graph": "연구 연결 지도"
  }
};

const hrefs: Record<string, string> = {
  home: "/", research: "/research", projects: "/projects", writing: "/blog", "paper-lab": "/papers", about: "/about", growth: "/growth", now: "/now", contact: "/contact",
  overview: "/papers/", "reading-method": "/papers/#reading-method", "paper-notes": "/papers/#paper-notes",
  "ai-review": "/reviews/", "reviews-due": "/reviews/", "oral-exam": "/papers/#paper-notes", "formula-recall": "/formula/",
  implementations: "/implementations/", "weekly-reviews": "/week/", "research-graph": "/graph/", "growth-insight": "/growth/"
};

const localizedHref = (locale: Locale, href: string) => locale === "ko" ? `/ko${href}` : href;
const fixtureRoot = resolve("tests/fixtures/public-capabilities");
const fixtureFiles = readdirSync(fixtureRoot).filter((file) => file.endsWith(".json")).sort();

for (const file of fixtureFiles) {
  const fixture = JSON.parse(readFileSync(resolve(fixtureRoot, file), "utf8")) as Fixture;
  const capabilities = derivePublicCapabilities(fixture);
  const expectedCapabilities = Object.fromEntries(capabilityKeys.map((key) => [key, fixture.expected.trueCapabilities.includes(key)]));
  assert.deepEqual(capabilities, expectedCapabilities, `${file}: capability result`);

  for (const locale of ["en", "ko"] as const) {
    const primary = getPrimaryNavigation(locale, capabilities);
    const utility = getUtilityNavigation(locale, capabilities);
    const footer = getFooterNavigation(locale, capabilities);
    const paperLab = getPaperLabNavigation(locale, capabilities);

    assert.deepEqual(primary.map((item) => item.id), fixture.expected.primaryIds, `${file}: ${locale} primary IDs`);
    assert.deepEqual(utility.map((item) => item.id), fixture.expected.utilityIds, `${file}: ${locale} utility IDs`);
    assert.deepEqual(footer.map((item) => item.id), ["home", ...fixture.expected.primaryIds, ...fixture.expected.utilityIds, "now", "contact"], `${file}: ${locale} footer IDs`);
    assert.deepEqual(paperLab.map((group) => [group.id, ...group.items.map((item) => item.id)]), fixture.expected.paperLabGroups, `${file}: ${locale} Paper Lab groups`);

    for (const item of [...primary, ...utility, ...footer, ...paperLab.flatMap((group) => group.items)]) {
      assert.equal(item.label, labels[locale][item.id], `${file}: ${locale} label for ${item.id}`);
      assert.equal(item.href, localizedHref(locale, hrefs[item.id]), `${file}: ${locale} href for ${item.id}`);
    }
    for (const group of paperLab) assert.equal(group.label, labels[locale][group.id], `${file}: ${locale} group label for ${group.id}`);
  }
}

console.log(`[public-capabilities] ${fixtureFiles.length} feed fixtures passed in English and Korean`);
