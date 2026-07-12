export type MediaCategory = "concept-scene" | "technical-explanation" | "real-project-evidence" | "functional-icon";

export type SemanticScore = {
  semanticClarity: number;
  pageRelevance: number;
  focalHierarchy: number;
  credibility: number;
  responsiveCrop: number;
  visualQuality: number;
};

export type MediaReviewCandidate = {
  id: string;
  section: "hero" | "research-vla" | "technical-diagrams" | "project-evidence";
  category: MediaCategory;
  route: string;
  pageContext:
    | "home"
    | "vla"
    | "efficient"
    | "workflow"
    | "project-vla"
    | "project-site"
    | "project-studio"
    | "project-paperflow"
    | "project-arxiv-discovery"
    | "project-tr-gpu-monitor"
    | "project-runshelf"
    | "project-contentdeck";
  file: string;
  aspectRatio: string;
  focalPoint: string;
  score: SemanticScore;
  rejectionNotes: string[];
};

export const mediaReviewCandidates: MediaReviewCandidate[] = [
  { id:"home-hero-a", section:"hero", category:"concept-scene", route:"/", pageContext:"home", file:"candidates/home-hero-a.webp", aspectRatio:"5:4", focalPoint:"50% 46%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:3, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Reject: the result reads as photography rather than the requested editorial illustration.", "Reject: generated writing and UI details attract attention."] },
  { id:"home-hero-b", section:"hero", category:"concept-scene", route:"/", pageContext:"home", file:"candidates/home-hero-b.webp", aspectRatio:"5:4", focalPoint:"54% 45%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:4, credibility:3, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Reject: pseudo-writing is too prominent across the paper and notebook."] },
  { id:"home-hero-c", section:"hero", category:"concept-scene", route:"/", pageContext:"home", file:"candidates/home-hero-c.webp", aspectRatio:"5:4", focalPoint:"50% 44%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:4, responsiveCrop:5, visualQuality:5 }, rejectionNotes:["Review needed: verify that small interface marks remain unobtrusive at production size."] },
  { id:"research-vla-a", section:"research-vla", category:"concept-scene", route:"/research/#practical-vla-systems", pageContext:"vla", file:"candidates/research-vla-a.webp", aspectRatio:"4:3", focalPoint:"55% 55%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:4, responsiveCrop:4, visualQuality:5 }, rejectionNotes:["Review needed: the trajectory direction is visually ambiguous."] },
  { id:"research-vla-b", section:"research-vla", category:"concept-scene", route:"/research/#practical-vla-systems", pageContext:"vla", file:"candidates/research-vla-b.webp", aspectRatio:"4:3", focalPoint:"55% 52%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:5, visualQuality:5 }, rejectionNotes:[] },
  { id:"research-vla-c", section:"research-vla", category:"concept-scene", route:"/research/#practical-vla-systems", pageContext:"vla", file:"candidates/research-vla-c.webp", aspectRatio:"4:3", focalPoint:"52% 50%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:5, visualQuality:5 }, rejectionNotes:[] },
  { id:"efficient-execution-en", section:"technical-diagrams", category:"technical-explanation", route:"/research/#efficient-model-execution", pageContext:"efficient", file:"exports/efficient-execution-en.png", aspectRatio:"4:3", focalPoint:"50% 50%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:4, visualQuality:5 }, rejectionNotes:["English label version; pair with the Korean export by locale."] },
  { id:"efficient-execution-ko", section:"technical-diagrams", category:"technical-explanation", route:"/ko/research/#efficient-model-execution", pageContext:"efficient", file:"exports/efficient-execution-ko.png", aspectRatio:"4:3", focalPoint:"50% 50%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:4, visualQuality:5 }, rejectionNotes:["Korean label version; pair with the English export by locale."] },
  { id:"research-workflow-en", section:"technical-diagrams", category:"technical-explanation", route:"/research/#human-ai-research-tools", pageContext:"workflow", file:"exports/research-workflow-en.png", aspectRatio:"4:3", focalPoint:"50% 50%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:4, visualQuality:5 }, rejectionNotes:["English label version; tablet readability must be checked before production."] },
  { id:"research-workflow-ko", section:"technical-diagrams", category:"technical-explanation", route:"/ko/research/#human-ai-research-tools", pageContext:"workflow", file:"exports/research-workflow-ko.png", aspectRatio:"4:3", focalPoint:"50% 50%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:4, visualQuality:5 }, rejectionNotes:["Korean label version; tablet readability must be checked before production."] },
  { id:"project-gnaroshi-vla", section:"project-evidence", category:"real-project-evidence", route:"/projects/gnaroshi-vla/", pageContext:"project-vla", file:"exports/project-gnaroshi-vla.png", aspectRatio:"16:10", focalPoint:"50% 50%", score:{ semanticClarity:4, pageRelevance:5, focalHierarchy:4, credibility:5, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Uses a verified lightweight sanity run only; it intentionally makes no benchmark claim."] },
  { id:"project-gnaroshi-dev", section:"project-evidence", category:"real-project-evidence", route:"/projects/gnaroshi-dev/", pageContext:"project-site", file:"exports/project-gnaroshi-dev.png", aspectRatio:"16:10", focalPoint:"50% 45%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:4, credibility:5, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Screenshots must be recaptured if the approved production layout changes."] },
  { id:"project-gnaroshi-studio-review", section:"project-evidence", category:"real-project-evidence", route:"/projects/gnaroshi-studio/", pageContext:"project-studio", file:"candidates/project-gnaroshi-studio-review.webp", aspectRatio:"16:10", focalPoint:"50% 42%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Owner approval required before production.", "Actual Managed Apps unavailable/setup state from the integration review build; no private workspace records are visible.", "Review the in-app Arxiv Crawler label against the public Arxiv Discovery product name before approval."] },
  { id:"project-paperflow-review", section:"project-evidence", category:"real-project-evidence", route:"/projects/paperflow/", pageContext:"project-paperflow", file:"candidates/project-paperflow-review.webp", aspectRatio:"4:3", focalPoint:"58% 42%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:5, credibility:5, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Owner approval required before production.", "Actual Zotero organization screen showing dry-run and explicit apply boundaries; no library records or local paths are visible."] },
  { id:"project-arxiv-discovery-review", section:"project-evidence", category:"real-project-evidence", route:"/projects/arxiv-discovery/", pageContext:"project-arxiv-discovery", file:"candidates/project-arxiv-discovery-review.webp", aspectRatio:"34:25", focalPoint:"42% 32%", score:{ semanticClarity:5, pageRelevance:5, focalHierarchy:4, credibility:5, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Owner approval required before production.", "Actual Flask UI populated from a no-download discovery of public arXiv metadata."] },
  { id:"project-tr-gpu-monitor-review", section:"project-evidence", category:"real-project-evidence", route:"/projects/tr-gpu-monitor/", pageContext:"project-tr-gpu-monitor", file:"candidates/project-tr-gpu-monitor-review.webp", aspectRatio:"2:1", focalPoint:"58% 50%", score:{ semanticClarity:5, pageRelevance:3, focalHierarchy:5, credibility:5, responsiveCrop:3, visualQuality:4 }, rejectionNotes:["Reject for production: this is an actual setup-prerequisite state, not the requested sanitized monitoring screen.", "A privacy-safe real host summary still needs owner-provided evidence."] },
  { id:"project-runshelf-review", section:"project-evidence", category:"real-project-evidence", route:"/projects/runshelf/", pageContext:"project-runshelf", file:"candidates/project-runshelf-review.webp", aspectRatio:"45:26", focalPoint:"50% 42%", score:{ semanticClarity:5, pageRelevance:3, focalHierarchy:4, credibility:3, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Reject for production: the app is real, but the records are checked-in sample fixtures rather than reviewed experiment evidence.", "A sanitized real run view is still required."] },
  { id:"project-contentdeck-review", section:"project-evidence", category:"real-project-evidence", route:"/projects/contentdeck/", pageContext:"project-contentdeck", file:"candidates/project-contentdeck-review.webp", aspectRatio:"11:8", focalPoint:"58% 45%", score:{ semanticClarity:4, pageRelevance:3, focalHierarchy:4, credibility:5, responsiveCrop:4, visualQuality:4 }, rejectionNotes:["Reject for production: this is the actual player in its empty prerequisite state, not playback with a supported provider and subtitle/loop state.", "A rights-safe playback capture is still required."] }
];

export const approvedMediaCandidateIds = [
  "home-hero-c",
  "research-vla-b",
  "efficient-execution-en",
  "efficient-execution-ko",
  "research-workflow-en",
  "research-workflow-ko",
  "project-gnaroshi-vla",
  "project-gnaroshi-dev"
] as const;

export function totalSemanticScore(score: SemanticScore) {
  return Object.values(score).reduce((total, value) => total + value, 0);
}

export function candidatePassesThreshold(candidate: MediaReviewCandidate) {
  return candidate.score.semanticClarity >= 4 && candidate.score.pageRelevance >= 4 && candidate.score.credibility >= 4 && totalSemanticScore(candidate.score) >= 25;
}
