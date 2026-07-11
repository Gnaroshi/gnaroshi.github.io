import { profileFacts } from "./facts/profile";
import { enCopy } from "./locales/en";

export const profile = {
  ...profileFacts,
  ...enCopy.profile
} as const;
