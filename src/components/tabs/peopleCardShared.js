import {
  faGithub,
  faGoogleScholar,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export const PERSONAL_LINK_ITEMS = [
  { key: "homepage", label: "Official page", icon: faGlobe },
  { key: "github", label: "GitHub", icon: faGithub },
  { key: "linkedin", label: "LinkedIn", icon: faLinkedin },
  { key: "google_scholar", label: "Google Scholar", icon: faGoogleScholar },
];

export const getPersonalLinkUrl = (key, homepage, links) => {
  if (key === "homepage") {
    return typeof homepage === "string" ? homepage.trim() : "";
  }

  return typeof links?.[key] === "string" ? links[key].trim() : "";
};

export const isValidExternalLink = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
