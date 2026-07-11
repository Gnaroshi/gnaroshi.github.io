import { profileFacts } from "./facts/profile";
import { enCopy } from "./locales/en";

export const profile = {
  ...profileFacts,
  ...enCopy.profile,
  location: enCopy.profile.location,
  interests: [
    "Vision-language-action systems",
    "Efficient model execution",
    "Research infrastructure",
    "Evidence-aware research tools"
  ]
} as const;
