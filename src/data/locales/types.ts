import type { projectFacts } from "../facts/projects";
import type { researchFacts } from "../facts/research";

export type LocalizedProfileCopy = {
  headline: string;
  currentRole: string;
  location: string;
  shortBio: string;
  bio: readonly string[];
  researchBackground: readonly string[];
  researcherValues: readonly string[];
};

export type LocalizedResearchCopy = {
  question: string;
  motivation: string;
  hypothesis: string;
  uncertainty: string;
  relatedLabels: readonly string[];
};

export type LocalizedProjectCopy = {
  title: string;
  summary: string;
  statusLabel: string;
  problem: string;
  designGoals: readonly string[];
  architecture: readonly string[];
  supportedAdapters: readonly string[];
  reproducibility: readonly string[];
  currentState: string;
  openProblems: readonly string[];
  relatedWriting: readonly string[];
  linkLabels: Readonly<Record<string, string>>;
};

export type LocalizedNowCopy = {
  currentlyReading: readonly string[];
  currentlyBuilding: readonly string[];
  currentQuestions: readonly string[];
};

export type LocalizedSkillGroup = {
  title: string;
  skills: readonly string[];
};

export type LocaleCopy = {
  copyUpdatedAt: string;
  profile: LocalizedProfileCopy;
  researchAreas: Readonly<Record<(typeof researchFacts)[number]["id"], LocalizedResearchCopy>>;
  projects: Readonly<Record<(typeof projectFacts)[number]["id"], LocalizedProjectCopy>>;
  now: LocalizedNowCopy;
  skillGroups: readonly LocalizedSkillGroup[];
};

type ProjectFactWithoutLinks<T> = T extends unknown ? Omit<T, "links"> : never;

export type LocalizedProject = ProjectFactWithoutLinks<(typeof projectFacts)[number]> & LocalizedProjectCopy & {
  links: readonly { id: string; label: string; href: string }[];
};

export type LocalizedResearchArea = (typeof researchFacts)[number] & LocalizedResearchCopy & {
  related: readonly { label: string; href: string }[];
};

export type LocalizedData = {
  profile: LocalizedProfileCopy;
  researchAreas: readonly LocalizedResearchArea[];
  projects: readonly LocalizedProject[];
  now: LocalizedNowCopy & { lastUpdated: string };
  skillGroups: readonly LocalizedSkillGroup[];
};
