export type LocalizedProfile = {
  headline: string;
  currentRole: string;
  location: string;
  shortBio: string;
  bio: readonly string[];
  researchBackground: readonly string[];
  researcherValues: readonly string[];
};

export type LocalizedResearchArea = {
  slug: string;
  question: string;
  motivation: string;
  hypothesis: string;
  currentReading: string;
  currentBuild: string;
  uncertainty: string;
  related: readonly { label: string; href: string }[];
};

export type LocalizedProject = {
  slug: string;
  title: string;
  summary: string;
  status: string;
  featured: boolean;
  contentStage: "seed" | "working" | "substantive";
  metricEligible: boolean;
  graphEligible: boolean;
  weeklyReviewEligible: boolean;
  updatedAt: string;
  tags: readonly string[];
  problem: string;
  role: string;
  decisions: readonly string[];
  architecture: readonly string[];
  implementation: readonly string[];
  result: string;
  lessons: readonly string[];
  relatedWriting: readonly string[];
  links: readonly { label: string; href: string }[];
};

export type LocalizedNow = {
  lastUpdated: string;
  currentlyReading: readonly string[];
  currentlyBuilding: readonly string[];
  currentQuestions: readonly string[];
};

export type LocalizedSkillGroup = {
  title: string;
  skills: readonly string[];
};

export type LocalizedData = {
  profile: LocalizedProfile;
  researchAreas: readonly LocalizedResearchArea[];
  projects: readonly LocalizedProject[];
  now: LocalizedNow;
  skillGroups: readonly LocalizedSkillGroup[];
};
