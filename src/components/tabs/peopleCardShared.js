import {
  faGithub,
  faGoogleScholar,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export const SOCIAL_ITEMS = [
  { key: "github", label: "GitHub", icon: faGithub },
  { key: "linkedin", label: "LinkedIn", icon: faLinkedin },
  { key: "google_scholar", label: "Google Scholar", icon: faGoogleScholar },
];

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
