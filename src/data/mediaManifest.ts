export type MediaAsset = {
  id: string;
  purpose: string;
  route: string;
  alt: { en: string; ko: string };
  aspectRatio: string;
  light: string;
  dark?: string;
  source: string;
  provenance: string;
  focalPoint: string;
  loadingPriority: "high" | "low";
};

const diagramSource = "Original SVG diagram authored for gnaroshi.dev using the shared editorial media palette.";

export const mediaManifest = {
  homeResearchConstellation: {
    id: "home-research-constellation",
    purpose: "Introduce the connected reading, reasoning, and implementation practice behind the site.",
    route: "/",
    alt: {
      en: "Research desk with connected paper notes, diagrams, code, and experiment traces.",
      ko: "논문 노트와 도식, 코드, 실험 기록이 서로 연결된 연구 책상."
    },
    aspectRatio: "5:4",
    light: "/media/home-research-constellation-1200.webp",
    dark: "/media/home-research-constellation-1200.webp",
    source: "Generated from a production prompt describing an editorial overhead research workspace without people, logos, or readable text.",
    provenance: "Original image generated for Gnaroshi with OpenAI image generation on 2026-07-11.",
    focalPoint: "center",
    loadingPriority: "high"
  },
  researchVla: {
    id: "research-vla",
    purpose: "Explain the observation-to-action structure of a vision-language-action system.",
    route: "/research/",
    alt: { en: "Observation, language, state, and action linked through a shared representation.", ko: "관찰과 언어, 상태, 행동이 공통 표현을 통해 연결된 구조." },
    aspectRatio: "4:3", light: "/media/research-vla.svg", dark: "/media/research-vla.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  researchEfficientSystems: {
    id: "research-efficient-systems",
    purpose: "Show reusable model state and lightweight update paths.",
    route: "/research/",
    alt: { en: "Model backbone reusing cached state through small delta updates.", ko: "작은 델타 갱신으로 캐시된 상태를 재사용하는 모델 구조." },
    aspectRatio: "4:3", light: "/media/research-efficient-systems.svg", dark: "/media/research-efficient-systems.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  researchWorkflow: {
    id: "research-workflow",
    purpose: "Summarize the recurring research loop.",
    route: "/research/",
    alt: { en: "A research loop connecting reading, recall, critique, implementation, and revisit.", ko: "읽기와 회상, 비평, 구현, 다시 보기를 잇는 연구 순환." },
    aspectRatio: "4:3", light: "/media/research-workflow.svg", dark: "/media/research-workflow.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  projectGnaroshiDev: {
    id: "project-gnaroshi-dev",
    purpose: "Show the public publishing boundary for gnaroshi.dev.",
    route: "/projects/",
    alt: { en: "Studio publishing private paper and writing repositories through a sanitized public feed to the website.", ko: "Studio가 비공개 논문·글 저장소를 정제된 공개 피드를 거쳐 웹사이트로 발행하는 구조." },
    aspectRatio: "16:10", light: "/media/project-gnaroshi-dev.svg", dark: "/media/project-gnaroshi-dev.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  projectGnaroshiVla: {
    id: "project-gnaroshi-vla",
    purpose: "Show the architecture-neutral separation used by the VLA experiment workspace.",
    route: "/projects/gnaroshi-vla/",
    alt: {
      en: "Observation, language, state, and action interfaces organized around replaceable VLA architecture adapters.",
      ko: "교체 가능한 VLA 아키텍처 어댑터를 중심으로 구성한 관찰, 언어, 상태, 행동 인터페이스."
    },
    aspectRatio: "16:10",
    light: "/media/research-vla.svg",
    dark: "/media/research-vla.svg",
    source: diagramSource,
    provenance: "Original project artwork.",
    focalPoint: "center",
    loadingPriority: "low"
  },
  paperLabCycle: {
    id: "paper-lab-cycle",
    purpose: "Orient new Paper Lab visitors without presenting empty metrics.",
    route: "/papers/",
    alt: { en: "Paper workflow from queue through three reading passes, review, recall, and implementation.", ko: "읽을 논문에서 3단계 읽기와 복습, 회상, 구현으로 이어지는 논문 흐름." },
    aspectRatio: "16:10", light: "/media/paper-lab-cycle.svg", dark: "/media/paper-lab-cycle.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  growthEvidence: {
    id: "growth-evidence",
    purpose: "Explain how distinct public evidence streams form a longitudinal view.",
    route: "/growth/",
    alt: { en: "Reading, recall, coding, and writing evidence converging into a restrained timeline.", ko: "읽기와 회상, 코딩, 글쓰기 근거가 하나의 시간 흐름으로 모이는 구조." },
    aspectRatio: "16:10", light: "/media/growth-evidence.svg", dark: "/media/growth-evidence.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  blogCoverPaperReading: {
    id: "blog-cover-paper-reading",
    purpose: "Identify the paper-reading series without forcing unique artwork onto each note.",
    route: "/blog/",
    alt: { en: "Connected reading passes arranged as an editorial diagram.", ko: "여러 읽기 단계를 연결한 편집형 도식." },
    aspectRatio: "16:9", light: "/media/blog-cover-paper-reading.svg", dark: "/media/blog-cover-paper-reading.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  blogCoverResearchSystems: {
    id: "blog-cover-research-systems",
    purpose: "Identify the research-systems writing series.",
    route: "/blog/",
    alt: { en: "Research inputs connected through a compact systems diagram.", ko: "연구 입력을 잇는 간결한 시스템 도식." },
    aspectRatio: "16:9", light: "/media/blog-cover-research-systems.svg", dark: "/media/blog-cover-research-systems.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  blogCoverImplementationNotes: {
    id: "blog-cover-implementation-notes",
    purpose: "Identify the implementation-notes writing series.",
    route: "/blog/",
    alt: { en: "Code and implementation steps connected in sequence.", ko: "코드와 구현 단계를 순서대로 연결한 도식." },
    aspectRatio: "16:9", light: "/media/blog-cover-implementation-notes.svg", dark: "/media/blog-cover-implementation-notes.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  },
  blogCoverAiWorkflow: {
    id: "blog-cover-ai-workflow",
    purpose: "Identify the AI-workflow writing series.",
    route: "/blog/",
    alt: { en: "Human review checkpoints arranged around an AI workflow.", ko: "AI 작업 흐름 주위에 배치된 사람의 검토 지점." },
    aspectRatio: "16:9", light: "/media/blog-cover-ai-workflow.svg", dark: "/media/blog-cover-ai-workflow.svg", source: diagramSource, provenance: "Original project artwork.", focalPoint: "center", loadingPriority: "low"
  }
} satisfies Record<string, MediaAsset>;

export const blogCoverFamily = [
  mediaManifest.blogCoverPaperReading,
  mediaManifest.blogCoverResearchSystems,
  mediaManifest.blogCoverImplementationNotes,
  mediaManifest.blogCoverAiWorkflow
];
