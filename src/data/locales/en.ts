import { now } from "../now";
import { profile } from "../profile";
import { projects } from "../projects";
import { researchAreas } from "../research";
import { skillGroups } from "../skills";
import type { LocalizedData } from "./types";

export const enData = {
  profile: {
    headline: profile.headline,
    currentRole: profile.currentRole,
    location: profile.location,
    shortBio: profile.shortBio,
    bio: [...profile.bio],
    researchBackground: [...profile.researchBackground],
    researcherValues: [...profile.researcherValues]
  },
  researchAreas,
  projects,
  now,
  skillGroups
} satisfies LocalizedData;
