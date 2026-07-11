export type MediaVariant = {
  src: string;
  width: number;
  format: "avif" | "webp";
};

export type MediaAsset = {
  id: string;
  purpose: string;
  route: string;
  alt: { en: string; ko: string };
  width: number;
  height: number;
  aspectRatio: string;
  variants: MediaVariant[];
  fallback: string;
  focalPoint: string;
  sizes: string;
  loadingPriority: "high" | "low";
  generation: {
    tool: string;
    generatedAt: string;
    promptFile: string;
    selectedCandidate: string;
  };
  provenance: string;
};

const generation = (selectedCandidate: string) => ({
  tool: "OpenAI built-in image_gen.imagegen",
  generatedAt: "2026-07-11T12:59:22Z",
  promptFile: "docs/raster-image-prompts.md",
  selectedCandidate
});

const variants = (id: string, largestWidth: number): MediaVariant[] => [
  { src: `/media/${id}-480.avif`, width: 480, format: "avif" },
  { src: `/media/${id}-768.avif`, width: 768, format: "avif" },
  { src: `/media/${id}-1200.avif`, width: 1200, format: "avif" },
  { src: `/media/${id}-1600.avif`, width: largestWidth, format: "avif" },
  { src: `/media/${id}-480.webp`, width: 480, format: "webp" },
  { src: `/media/${id}-768.webp`, width: 768, format: "webp" },
  { src: `/media/${id}-1200.webp`, width: 1200, format: "webp" },
  { src: `/media/${id}-1600.webp`, width: largestWidth, format: "webp" }
];

export const mediaManifest = {
  homeResearchConstellation: {
    id: "home-research-constellation",
    purpose: "Introduce the connected reading, reasoning, building, and revisiting practice behind the site.",
    route: "/",
    alt: { en: "Blank research cards, a notebook, a computation tile, prototype hardware, and translucent tokens arranged as a calm workspace.", ko: "빈 연구 카드와 노트, 연산 타일, 프로토타입 부품, 반투명 토큰을 차분하게 배치한 연구 공간." },
    width: 1600, height: 1280, aspectRatio: "5:4", variants: variants("home-research-constellation", 1400),
    fallback: "/media/home-research-constellation-1200.webp", focalPoint: "center center", sizes: "(min-width: 1024px) 45vw, 100vw", loadingPriority: "high",
    generation: generation("candidate-c"), provenance: "Original native raster artwork generated for Gnaroshi; no prior SVG composition was traced."
  },
  researchVla: {
    id: "research-vla", purpose: "Express observation, language, shared representation, and action as a tactile VLA still-life.", route: "/research/",
    alt: { en: "Observation lens, blank language cards, shared representation block, and robot gripper connected by a material trace.", ko: "관찰 렌즈와 빈 언어 카드, 공통 표현 블록, 로봇 그리퍼를 재료의 흐름으로 연결한 장면." },
    width: 1600, height: 1200, aspectRatio: "4:3", variants: variants("research-vla", 1448), fallback: "/media/research-vla-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 44vw, 100vw", loadingPriority: "low", generation: generation("candidate-b"), provenance: "Original native raster artwork generated for Gnaroshi."
  },
  researchEfficientSystems: {
    id: "research-efficient-systems", purpose: "Communicate stored-state reuse, incremental update, and modularity.", route: "/research/",
    alt: { en: "Matte computation block, cached state layers, and compact update modules arranged for reuse.", ko: "재사용을 위해 배치한 무광 연산 블록과 캐시 상태 레이어, 작은 갱신 모듈." },
    width: 1600, height: 1200, aspectRatio: "4:3", variants: variants("research-efficient-systems", 1448), fallback: "/media/research-efficient-systems-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 44vw, 100vw", loadingPriority: "low", generation: generation("candidate-b"), provenance: "Original native raster artwork generated for Gnaroshi."
  },
  researchWorkflow: {
    id: "research-workflow", purpose: "Represent the recurring reading, recall, critique, implementation, and revisit loop.", route: "/research/",
    alt: { en: "Open blank paper, recall object, pencil, computation module, and prototype arranged along an incomplete loop.", ko: "빈 펼친 종이와 회상 도구, 연필, 연산 모듈, 프로토타입을 열린 순환 형태로 배치한 장면." },
    width: 1600, height: 1200, aspectRatio: "4:3", variants: variants("research-workflow", 1448), fallback: "/media/research-workflow-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 44vw, 100vw", loadingPriority: "low", generation: generation("candidate-a"), provenance: "Original native raster artwork generated for Gnaroshi."
  },
  projectGnaroshiVla: {
    id: "project-gnaroshi-vla", purpose: "Show a modular VLA experiment bench with replaceable architecture adapters.", route: "/projects/gnaroshi-vla/",
    alt: { en: "Robot gripper, replaceable adapter dock, observation tile, blank language cards, and organized experiment tray.", ko: "로봇 그리퍼와 교체형 어댑터 도크, 관찰 타일, 빈 언어 카드, 정돈된 실험 트레이." },
    width: 1600, height: 1000, aspectRatio: "16:10", variants: variants("project-gnaroshi-vla", 1584), fallback: "/media/project-gnaroshi-vla-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 58vw, 100vw", loadingPriority: "low", generation: generation("candidate-b"), provenance: "Original native raster artwork generated specifically for the gnaroshi_vla project."
  },
  projectGnaroshiDev: {
    id: "project-gnaroshi-dev", purpose: "Show private sources passing through a controlled public projection boundary.", route: "/projects/gnaroshi-dev/",
    alt: { en: "Private notebook and paper cards separated from clean public cards by a translucent filtering gate.", ko: "비공개 노트와 종이 카드를 반투명 필터 경계로 정제된 공개 카드와 구분한 장면." },
    width: 1600, height: 1000, aspectRatio: "16:10", variants: variants("project-gnaroshi-dev", 1584), fallback: "/media/project-gnaroshi-dev-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 58vw, 100vw", loadingPriority: "low", generation: generation("candidate-b"), provenance: "Original native raster artwork generated specifically for the gnaroshi.dev project."
  },
  paperLabCycle: {
    id: "paper-lab-cycle", purpose: "Orient new Paper Lab visitors through reading, recall, review, explanation, and implementation objects.", route: "/papers/",
    alt: { en: "Blank paper, question and formula tiles, voice capsule, code module, prototype, and progress cells.", ko: "빈 종이와 질문·공식 타일, 음성 캡슐, 코드 모듈, 프로토타입, 진행 셀을 배치한 장면." },
    width: 1600, height: 1000, aspectRatio: "16:10", variants: variants("paper-lab-cycle", 1584), fallback: "/media/paper-lab-cycle-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 55vw, 100vw", loadingPriority: "low", generation: generation("candidate-b"), provenance: "Original native raster artwork generated for Paper Lab onboarding."
  },
  growthEvidence: {
    id: "growth-evidence", purpose: "Represent reading, recall, implementation, and writing evidence accumulating over time.", route: "/growth/",
    alt: { en: "Paper, memory capsule, implementation module, and writing card converging into a field of timeline cells.", ko: "종이와 기억 캡슐, 구현 모듈, 글쓰기 카드가 시간 셀의 흐름으로 모이는 장면." },
    width: 1600, height: 1000, aspectRatio: "16:10", variants: variants("growth-evidence", 1584), fallback: "/media/growth-evidence-1200.webp", focalPoint: "center center", sizes: "(min-width: 768px) 55vw, 100vw", loadingPriority: "low", generation: generation("candidate-b"), provenance: "Original native raster artwork generated for the evidence-gated Growth view."
  }
} satisfies Record<string, MediaAsset>;
