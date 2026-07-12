import type { Locale } from "../i18n/types";

export type ApprovedMediaAsset = {
  id: string;
  width: number;
  height: number;
  widths: readonly number[];
  focalPoint: string;
  alt: Readonly<Record<Locale, string>>;
};

export const approvedMedia = {
  homeHero: {
    id: "home-research-workspace",
    width: 1600,
    height: 1280,
    widths: [640, 1200, 1600],
    focalPoint: "50% 44%",
    alt: {
      en: "Generated illustration of a robot-arm experiment beside a paper, notebook, overhead camera, and model traces on a laptop.",
      ko: "로봇 팔 실험 장치 옆에 논문과 노트, 상단 카메라, 모델 실행 화면이 놓인 생성 일러스트레이션."
    }
  },
  researchVla: {
    id: "research-vla-task",
    width: 1600,
    height: 1200,
    widths: [640, 1200, 1600],
    focalPoint: "55% 52%",
    alt: {
      en: "Generated illustration of a robot arm using a camera and a visual instruction to reach for a red block among several objects.",
      ko: "카메라와 시각 지시를 참고해 여러 물체 중 빨간 블록으로 손을 뻗는 로봇 팔을 표현한 생성 일러스트레이션."
    }
  },
  efficientExecutionEn: {
    id: "efficient-execution-en",
    width: 1600,
    height: 1200,
    widths: [640, 1200, 1600],
    focalPoint: "50% 50%",
    alt: {
      en: "Diagram comparing full recomputation with a smaller update path that reuses cached model state.",
      ko: "저장한 모델 상태를 재사용하는 작은 갱신 경로와 전체 재계산을 비교한 영문 도식."
    }
  },
  efficientExecutionKo: {
    id: "efficient-execution-ko",
    width: 1600,
    height: 1200,
    widths: [640, 1200, 1600],
    focalPoint: "50% 50%",
    alt: {
      en: "Korean diagram comparing full recomputation with a smaller update path that reuses cached model state.",
      ko: "저장한 모델 상태를 재사용하는 작은 갱신 경로와 전체 재계산을 비교한 국문 도식."
    }
  },
  researchWorkflowEn: {
    id: "research-workflow-en",
    width: 1600,
    height: 1200,
    widths: [640, 1200, 1600],
    focalPoint: "50% 50%",
    alt: {
      en: "Diagram of a research loop: read, explain from memory, check what was missed, revisit, then implement or write.",
      ko: "읽기, 기억에서 설명하기, 놓친 부분 확인, 다시 보기, 구현 또는 글쓰기로 이어지는 영문 연구 흐름 도식."
    }
  },
  researchWorkflowKo: {
    id: "research-workflow-ko",
    width: 1600,
    height: 1200,
    widths: [640, 1200, 1600],
    focalPoint: "50% 50%",
    alt: {
      en: "Korean diagram of a research loop from reading and retrieval through checking, revisiting, and concrete output.",
      ko: "읽기와 회상에서 확인, 다시 보기, 구체적인 결과물로 이어지는 국문 연구 흐름 도식."
    }
  },
  projectVla: {
    id: "project-gnaroshi-vla",
    width: 1600,
    height: 1000,
    widths: [640, 1200, 1600],
    focalPoint: "50% 50%",
    alt: {
      en: "Verified gnaroshi_vla repository evidence showing the directory structure, an actual configuration, a generated run manifest, and a redacted sanity-run terminal result.",
      ko: "gnaroshi_vla 저장소의 디렉터리 구조와 실제 설정, 생성된 run manifest, 경로를 가린 sanity 실행 결과를 함께 보여 주는 검증 자료."
    }
  },
  projectSite: {
    id: "project-gnaroshi-dev",
    width: 1600,
    height: 1000,
    widths: [640, 1200, 1600],
    focalPoint: "50% 45%",
    alt: {
      en: "Verified gnaroshi.dev evidence combining the rendered English desktop page, Korean mobile page, and public build provenance.",
      ko: "영문 데스크톱 화면과 국문 모바일 화면, 공개 빌드 출처를 함께 보여 주는 gnaroshi.dev 검증 자료."
    }
  }
} as const satisfies Record<string, ApprovedMediaAsset>;

export function getResearchMedia(areaId: string, locale: Locale): ApprovedMediaAsset {
  if (areaId === "practical-vla-systems") return approvedMedia.researchVla;
  if (areaId === "efficient-model-execution") return locale === "ko" ? approvedMedia.efficientExecutionKo : approvedMedia.efficientExecutionEn;
  return locale === "ko" ? approvedMedia.researchWorkflowKo : approvedMedia.researchWorkflowEn;
}

export function getProjectMedia(projectId: string): ApprovedMediaAsset | undefined {
  if (projectId === "gnaroshi-vla") return approvedMedia.projectVla;
  if (projectId === "gnaroshi-dev") return approvedMedia.projectSite;
  return undefined;
}
