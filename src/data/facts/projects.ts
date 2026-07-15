export type ProjectKind = "research" | "application" | "infrastructure";
export type ProductStatus = "prototype" | "in-development" | "usable-locally" | "released" | "archived";
export type PlatformId = "web" | "macos" | "cli" | "static-site";
export type TechId =
  | "python" | "shell" | "yaml" | "astro" | "typescript" | "github-actions" | "playwright"
  | "react" | "rust" | "tauri" | "swift" | "swiftui" | "zotero-local-api" | "flask"
  | "jinja" | "sqlite" | "electron" | "vite" | "fastify";

export type ProjectLink = { id: "repository" | "live-site"; href: string };
export type ProjectScenario = {
  id: string;
  stepIds: readonly string[];
  mediaIds: readonly string[];
  usesDemoData: boolean;
};

export type CommonProjectFacts = {
  id: string;
  slug: string;
  kind: ProjectKind;
  productStatus: ProductStatus;
  contentStage: "seed" | "working" | "substantive";
  platforms: readonly PlatformId[];
  techStack: readonly TechId[];
  links: readonly ProjectLink[];
  updatedAt: string;
  tags: readonly string[];
  portfolio: "selected-projects" | "managed-applications";
  scenario: ProjectScenario;
};

type ApplicationEvidence =
  | { primaryShowcaseId: string; textOnlyExemption: null }
  | { primaryShowcaseId: null; textOnlyExemption: string };

export type ApplicationProjectFacts = CommonProjectFacts & {
  kind: "application";
  applicationGroup: "research-workflow" | "system-utilities" | "learning-tools";
  applicationFeatured: boolean;
  studioIntegrationStatus: "not-planned" | "planned" | "in-review" | "available";
  distribution: "local-development" | "packaged" | "release";
  dataOwner: string;
  sourceRepository: string;
  sourceCommit: string;
} & ApplicationEvidence;

export type ResearchProjectFacts = CommonProjectFacts & {
  kind: "research";
  applicationGroup: null;
  applicationFeatured: false;
  primaryMediaId: "project-gnaroshi-vla";
};

export type InfrastructureProjectFacts = CommonProjectFacts & {
  kind: "infrastructure";
  applicationGroup: null;
  applicationFeatured: false;
  primaryMediaId: "project-gnaroshi-dev";
};

export type ProjectFact = ResearchProjectFacts | InfrastructureProjectFacts | ApplicationProjectFacts;

export const projectFacts = [
  {
    id: "gnaroshi-vla", slug: "gnaroshi-vla", kind: "research", productStatus: "in-development", contentStage: "working",
    platforms: ["cli"], techStack: ["python", "shell", "yaml"], links: [{ id: "repository", href: "https://github.com/Gnaroshi/gnaroshi_vla" }],
    updatedAt: "2026-07-11", tags: ["VLA", "experiments", "reproducibility"], portfolio: "selected-projects", applicationGroup: null,
    applicationFeatured: false, primaryMediaId: "project-gnaroshi-vla",
    scenario: { id: "configure-and-check-run", stepIds: ["configure", "sanity-check", "inspect-manifest", "open-results"], mediaIds: ["project-gnaroshi-vla"], usesDemoData: true }
  },
  {
    id: "gnaroshi-dev", slug: "gnaroshi-dev", kind: "infrastructure", productStatus: "usable-locally", contentStage: "substantive",
    platforms: ["static-site", "web"], techStack: ["astro", "typescript", "github-actions", "playwright"],
    links: [{ id: "repository", href: "https://github.com/Gnaroshi/gnaroshi.github.io" }, { id: "live-site", href: "https://gnaroshi.dev" }],
    updatedAt: "2026-07-12", tags: ["Astro", "publishing", "i18n"], portfolio: "selected-projects", applicationGroup: null,
    applicationFeatured: false, primaryMediaId: "project-gnaroshi-dev",
    scenario: { id: "private-to-public-release", stepIds: ["write-private", "preview-fields", "publish-feed", "verify-deploy"], mediaIds: ["project-gnaroshi-dev"], usesDemoData: true }
  },
  {
    id: "gnaroshi-studio", slug: "gnaroshi-studio", kind: "application", productStatus: "in-development", contentStage: "working",
    platforms: ["macos", "cli"], techStack: ["typescript", "react", "rust", "tauri"], links: [], updatedAt: "2026-07-12",
    tags: ["authoring", "publishing", "local-first"], portfolio: "managed-applications", applicationGroup: "research-workflow", applicationFeatured: true,
    studioIntegrationStatus: "available", distribution: "local-development", dataOwner: "Gnaroshi Studio and canonical Markdown repositories",
    sourceRepository: "Gnaroshi/gnaroshi-studio", sourceCommit: "e6115c90ab866adde9ed1ea2cecda178fca96cdd", primaryShowcaseId: "gnaroshi-studio-managed-apps", textOnlyExemption: null,
    scenario: { id: "managed-paper-handoff", stepIds: ["review-apps", "review-candidates", "preview-handoff", "checkpoint-preview"], mediaIds: ["gnaroshi-studio-managed-apps", "gnaroshi-studio-candidate-review", "gnaroshi-studio-handoff-preview"], usesDemoData: true }
  },
  {
    id: "paperflow", slug: "paperflow", kind: "application", productStatus: "usable-locally", contentStage: "working",
    platforms: ["macos", "cli"], techStack: ["python", "swift", "swiftui", "zotero-local-api"], links: [{ id: "repository", href: "https://github.com/Gnaroshi/paperflow" }], updatedAt: "2026-07-12",
    tags: ["Zotero", "planning", "local-first"], portfolio: "managed-applications", applicationGroup: "research-workflow", applicationFeatured: true,
    studioIntegrationStatus: "in-review", distribution: "local-development", dataOwner: "PaperFlow and Zotero",
    sourceRepository: "Gnaroshi/paperflow", sourceCommit: "7c7bd013d171e2e58e0a5cee97faacd0c02ee8a8", primaryShowcaseId: "paperflow-plan-review", textOnlyExemption: null,
    scenario: { id: "zotero-plan-before-apply", stepIds: ["scan-library", "generate-plan", "review-changes", "stop-before-apply"], mediaIds: ["paperflow-scan-summary", "paperflow-plan-review", "paperflow-apply-boundary"], usesDemoData: true }
  },
  {
    id: "arxiv-discovery", slug: "arxiv-discovery", kind: "application", productStatus: "usable-locally", contentStage: "working",
    platforms: ["macos", "cli"], techStack: ["swift", "swiftui", "python"], links: [{ id: "repository", href: "https://github.com/Gnaroshi/Arxiv-newest-paper-crawler" }], updatedAt: "2026-07-15",
    tags: ["arXiv", "discovery", "papers"], portfolio: "managed-applications", applicationGroup: "research-workflow", applicationFeatured: true,
    studioIntegrationStatus: "in-review", distribution: "local-development", dataOwner: "Arxiv Discovery",
    sourceRepository: "Gnaroshi/Arxiv-newest-paper-crawler", sourceCommit: "1f87f235e2bef334980c19e019c016bb2a60ef0c", primaryShowcaseId: "arxiv-discovery-discovery-list", textOnlyExemption: null,
    scenario: { id: "native-recent-paper-review", stepIds: ["choose-window", "discover", "inspect-candidate", "save-or-act"], mediaIds: ["arxiv-discovery-discovery-list"], usesDemoData: true }
  },
  {
    id: "runshelf", slug: "runshelf", kind: "application", productStatus: "in-development", contentStage: "working",
    platforms: ["macos", "cli"], techStack: ["python", "swift", "swiftui"], links: [], updatedAt: "2026-07-12",
    tags: ["experiments", "runs", "local-first"], portfolio: "managed-applications", applicationGroup: "research-workflow", applicationFeatured: false,
    studioIntegrationStatus: "in-review", distribution: "local-development", dataOwner: "RunShelf workspace files",
    sourceRepository: "Gnaroshi/runshelf", sourceCommit: "7657067cfeae56259a5a7a714a046d2b57308b79", primaryShowcaseId: "runshelf-run-list", textOnlyExemption: null,
    scenario: { id: "inspect-failed-run", stepIds: ["open-runs", "filter-failed", "inspect-context", "review-references"], mediaIds: ["runshelf-run-list", "runshelf-failed-run", "runshelf-artifact-references"], usesDemoData: true }
  },
  {
    id: "tr-gpu-monitor", slug: "tr-gpu-monitor", kind: "application", productStatus: "usable-locally", contentStage: "working",
    platforms: ["macos"], techStack: ["swift", "swiftui", "sqlite"], links: [], updatedAt: "2026-07-12",
    tags: ["GPU", "monitoring", "SSH"], portfolio: "managed-applications", applicationGroup: "system-utilities", applicationFeatured: false,
    studioIntegrationStatus: "in-review", distribution: "local-development", dataOwner: "TR GPU Monitor",
    sourceRepository: "Gnaroshi/tr-gpu-monitor", sourceCommit: "3a2fa8173f3bb9d09ef67be66933070e1d350adc", primaryShowcaseId: "tr-gpu-monitor-host-overview", textOnlyExemption: null,
    scenario: { id: "compare-gpu-hosts", stepIds: ["check-hosts", "spot-pressure", "compare-hosts", "review-warning"], mediaIds: ["tr-gpu-monitor-host-overview", "tr-gpu-monitor-gpu-detail", "tr-gpu-monitor-warning-state"], usesDemoData: true }
  },
  {
    id: "contentdeck", slug: "contentdeck", kind: "application", productStatus: "usable-locally", contentStage: "working",
    platforms: ["web", "macos"], techStack: ["typescript", "react", "electron", "vite", "fastify"], links: [{ id: "repository", href: "https://github.com/Gnaroshi/content-looper" }], updatedAt: "2026-07-12",
    tags: ["media", "subtitles", "looping"], portfolio: "managed-applications", applicationGroup: "learning-tools", applicationFeatured: false,
    studioIntegrationStatus: "in-review", distribution: "local-development", dataOwner: "ContentDeck local session state",
    sourceRepository: "Gnaroshi/content-looper", sourceCommit: "5c6e2f94d1e1a18b6381ad65ee443609356426df", primaryShowcaseId: "contentdeck-active-loop", textOnlyExemption: null,
    scenario: { id: "subtitle-loop-practice", stepIds: ["open-media", "confirm-subtitles", "select-segment", "repeat"], mediaIds: ["contentdeck-loaded-player", "contentdeck-segment-selection", "contentdeck-active-loop"], usesDemoData: true }
  }
] as const satisfies readonly ProjectFact[];
