import type { LocaleCopy } from "./types";

export const koCopy = {
  copyUpdatedAt: "2026-07-12",
  profile: {
    headline: "AI 시스템을 공부하고,\n연구에 필요한 소프트웨어를 만듭니다.",
    shortBio: "요즘은 비전-언어-행동 모델을 비교하기 위한 실험 환경과, 논문을 읽고 다시 꺼내보는 작업 흐름에 관심을 두고 있습니다.",
    aboutIntroduction: "소프트웨어를 전공했고, 현재 대학 연구실에서 AI 기술을 배우며 실험과 도구를 만들고 있습니다.",
    bio: [
      "모델 자체뿐 아니라 실험을 반복하고 결과를 확인하는 과정에도 관심이 있습니다.",
      "논문을 읽거나 코드를 구현하면서 배운 내용을, 나중에 다시 사용할 수 있는 형태로 남기려고 합니다.",
      "이 사이트에는 실제로 만들고 읽은 것 가운데 공개해도 되는 내용을 정리합니다."
    ],
    researcherValues: [
      "모르는 부분은 모른다고 남깁니다.",
      "실험 설정과 결과를 함께 기록합니다.",
      "실패한 시도도 이유가 남아 있다면 보관합니다.",
      "자동화된 결과는 직접 확인합니다."
    ]
  },
  researchAreas: {
    "practical-vla-systems": {
      question: "서로 다른 VLA 모델을 같은 기준에서 비교하려면 어떤 실험 구조가 필요할까?",
      motivation: "VLA 저장소마다 모델과 환경, 결과를 정리하는 방식이 다릅니다. 같은 실험을 여러 모델에서 실행하고 살펴보기 어려운 이유입니다.",
      hypothesis: "공통 실행 구조를 두고 작은 adapter로 모델별 동작을 분리하면 비교 과정을 더 분명하게 만들 수 있는지 확인하고 있습니다.",
      uncertainty: "공통 구조가 정확성에 영향을 주는 모델별 세부사항을 가리지 않아야 합니다.",
      relatedLabels: ["gnaroshi_vla"]
    },
    "efficient-model-execution": {
      question: "계산을 줄이면서도 모델의 동작이 달라지지 않았는지 어떻게 확인할 수 있을까?",
      motivation: "계산을 줄였더라도 동작이 어떻게 달라졌는지 확인할 수 있어야 합니다. 상태 재사용과 근사의 범위를 분명히 두는 일이 필요합니다.",
      hypothesis: "재사용하는 상태와 갱신 경로를 따로 기록하고 여러 실험에서 비교하는 방법을 살펴보고 있습니다.",
      uncertainty: "적절한 경계는 모델과 관찰 이력, action decoder에 따라 달라질 수 있습니다.",
      relatedLabels: ["실험 환경"]
    },
    "human-ai-research-tools": {
      question: "AI 도구가 연구자의 판단을 대신하지 않으면서 어디까지 도움을 줄 수 있을까?",
      motivation: "요약과 점수는 시간을 줄여 주지만 모르는 부분을 가릴 수도 있습니다. 처음 던진 질문과 직접 확인한 내용이 함께 남아야 합니다.",
      hypothesis: "노트를 정리하고 다음 질문을 제안하며 다시 읽을 시점을 알려 주되, 무엇이 맞는지는 대신 결정하지 않는 도구를 살펴보고 있습니다.",
      uncertainty: "얼마나 많은 구조가 실제로 도움이 되는지는 반복해서 써 보며 확인해야 합니다.",
      relatedLabels: ["글", "논문"]
    }
  },
  projects: {
    "gnaroshi-vla": {
      title: "gnaroshi_vla",
      summary: "서로 다른 VLA 모델을 같은 방식으로 실행하고 비교하기 위해 실험 구조를 정리한 작업 공간입니다.",
      statusLabel: "진행 중",
      problem: "VLA 실험에서 모델 코드와 방법 변경, 환경 설정, 실행 스크립트, 결과가 한 저장소 구조에 묶이면 같은 조건으로 비교하기 어렵습니다.",
      designGoals: [
        "모델별 연결 코드는 작고 분명한 adapter 안에 둡니다.",
        "공통 방법을 모델과 환경 설정에서 분리합니다.",
        "각 실행이 어떤 설정으로 진행됐는지 다시 확인할 수 있게 남깁니다.",
        "확인하지 않은 출력을 결론처럼 보여 주지 않고 결과 위치를 분명히 합니다."
      ],
      architecture: [
        "architectures/에는 모델 adapter와 필요한 상위 코드 연결 지점이 있습니다.",
        "methods/에는 여러 모델 연결에서 함께 사용할 수 있는 방법이 있습니다.",
        "configs/는 모델과 방법, 환경, 실험, 노드 설정을 나눕니다.",
        "scripts/와 tools/는 run manifest와 환경 정보, 점검 결과, 결과 위치를 기록합니다."
      ],
      supportedAdapters: [
        "전용 설정과 wrapper를 갖춘 Seer 연결",
        "전용 설정과 wrapper를 갖춘 SimVLA 연결"
      ],
      reproducibility: [
        "조합한 설정에 모델과 방법, 환경, 실험, 노드 선택을 기록합니다.",
        "run manifest와 환경 snapshot으로 나중에 실행 조건을 살펴볼 수 있게 합니다.",
        "결과는 모델과 실험별 디렉터리에 저장합니다."
      ],
      currentState: "공개 저장소에는 Seer와 SimVLA 연결 구조, 공통 방법 모듈, 실행 맥락을 기록하는 도구가 있습니다. 벤치마크 결과는 제시하지 않습니다. 제3자 출처는 저장소에 문서화되어 있습니다.",
      openProblems: [
        "각 모델의 동작을 정확히 나타내는 가장 작은 adapter 범위를 찾습니다.",
        "같은 run manifest와 직접 확인한 결과로 효율화 방법을 비교합니다.",
        "문서화한 상위 구성요소 밖에서 재사용하기 전에 저장소의 라이선스를 분명히 합니다."
      ],
      relatedWriting: [],
      linkLabels: { repository: "저장소" }
    },
    "gnaroshi-dev": {
      title: "gnaroshi.dev",
      summary: "논문과 글을 비공개로 작성하고, 공개하기로 한 내용만 정리해서 보여 주는 개인 웹사이트입니다.",
      statusLabel: "진행 중",
      problem: "완성되지 않은 글과 논문 노트를 웹사이트 저장소에 두지 않으면서, 공개하기로 한 내용은 한곳에서 보여 주고 싶었습니다.",
      designGoals: [
        "완성되지 않은 논문 노트와 글은 공개 웹사이트 저장소 밖에 둡니다.",
        "공개하기로 고른 항목과 필드만 사이트에 보냅니다.",
        "영어와 한국어 페이지의 구조를 같게 유지합니다.",
        "실제 기록이 충분하지 않은 활동 화면은 숨깁니다."
      ],
      architecture: [
        "Gnaroshi Studio가 비공개 논문·글 저장소의 변경을 저장합니다.",
        "발행 도구가 원본 커밋 정보를 담은 정제된 결정론적 공개 콘텐츠 피드를 만듭니다.",
        "프레젠테이션 전용 Astro 웹사이트가 피드를 검증하고 표시합니다.",
        "GitHub Actions가 정적 사이트를 배포하고 가져온 피드 커밋을 확인합니다."
      ],
      supportedAdapters: [],
      reproducibility: [
        "피드 manifest에 원본 커밋과 항목 수, schema version, content hash를 기록합니다.",
        "웹사이트는 정확한 피드 커밋을 metadata와 build-info.json에 기록합니다.",
        "공개 웹사이트 workflow는 비공개 저장소를 checkout하지 않습니다."
      ],
      currentState: "웹사이트는 글과 논문을 공개 콘텐츠 피드에서만 읽습니다. 작성과 리뷰 생성, 비공개 지표, API endpoint는 역할이 분리된 저장소에 있습니다.",
      openProblems: [
        "편집을 마친 첫 글을 공개합니다.",
        "직접 작성하고 확인한 첫 논문 기록을 공개합니다.",
        "기록이 늘어나도 사이트를 이해하기 쉽게 유지합니다."
      ],
      relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
      linkLabels: { repository: "저장소", "live-site": "사이트" }
    }
  },
  now: {
    currentlyReading: [
      "Seer와 SimVLA가 모델 입력과 상태, 행동 출력을 서로 다르게 다루는 방식",
      "근사와 평가 범위를 분명히 하면서 모델 상태를 재사용하는 방법"
    ],
    currentlyBuilding: [
      "모델과 방법, 환경, 결과 설정을 나눠 VLA 모델을 실행하는 공통 실험 구조",
      "오래된 실험의 조건을 다시 확인하기 위한 run manifest와 환경 snapshot"
    ],
    currentQuestions: [
      "VLA 실험에서 어떤 부분을 여러 모델이 함께 쓸 수 있을까?",
      "눈에 띄지 않는 동작 변화 없이 어떤 표현을 재사용할 수 있을까?",
      "나중에 실험을 이해하려면 어느 정도의 맥락을 남겨야 할까?"
    ]
  },
  skillGroups: [
    { title: "연구 작업", skills: ["실험 설정", "실행 맥락", "결과 확인", "재현 계획"] },
    { title: "AI와 ML", skills: ["비전-언어-행동 모델", "모델 평가", "효율적인 실행", "연구 도구"] },
    { title: "소프트웨어", skills: ["Python", "TypeScript", "정적 웹사이트", "Git 작업 흐름"] }
  ]
} satisfies LocaleCopy;
