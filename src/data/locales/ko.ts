import type { LocalizedData } from "./types";

export const koData = {
  profile: {
    headline: "AI 연구자이자 소프트웨어 엔지니어",
    currentRole: "AI 연구자이자 소프트웨어 엔지니어",
    location: "대한민국",
    shortBio: "AI 시스템과 연구 흐름, 더 깊이 읽고 만들고 생각하도록 돕는 도구를 연구합니다.",
    bio: [
      "AI 시스템과 소프트웨어 엔지니어링, 연구를 꾸준히 이어 가게 하는 실제 작업 흐름을 다룹니다.",
      "이 사이트는 기술 노트와 논문 읽기 기록, 작은 도구, 프로젝트 회고, 오래 생각하고 싶은 질문을 모으는 공개 연구 노트입니다.",
      "읽은 것과 시도한 것, 이해한 것, 다시 살펴봐야 할 것을 실제 작업 가까이에 남기는 기록을 중요하게 생각합니다."
    ],
    researchBackground: [
      "모델을 어떻게 평가하고 논문의 아이디어를 어떻게 소프트웨어로 옮기는지, 반복 가능한 읽기와 구현 흐름을 어떻게 만들 수 있는지에 관심이 있습니다.",
      "현재 공개 노트는 비전-언어 모델과 머신러닝 시스템, 논문을 읽고 추적하고 다시 살펴보는 도구에 초점을 둡니다."
    ],
    researcherValues: [
      "매끄럽지만 모호한 이야기보다 분명한 질문을 택합니다.",
      "불확실성과 실패한 시도를 포함해 부분적인 진전을 솔직하게 기록합니다.",
      "연구 노트를 코드와 논문, 재현 가능한 결과물 가까이에 둡니다.",
      "생각하는 과정을 감추기보다 읽고 판단하는 일을 돕는 도구를 만듭니다."
    ]
  },
  researchAreas: [
    {
      slug: "research-reading-loop",
      question: "논문 읽기를 신뢰할 수 있는 연구 흐름으로 만들려면 무엇이 필요할까?",
      motivation: "유용한 읽기 기록은 완독 여부만이 아니라 관련성 판단과 불확실성, 회상 실패, 구현 아이디어를 보존해야 합니다.",
      hypothesis: "훑어보기, 구조 이해, 회상, 다시 보기의 작은 기록을 이어 가면 모든 논문을 깊이 읽지 않아도 지식을 더 쉽게 되찾을 수 있습니다.",
      currentReading: "논문 읽기 방법과 회상 연습, 가벼운 지식 관리 흐름을 살펴봅니다.",
      currentBuild: "의미 있는 기록이 충분할 때만 활동과 분석을 보여 주는 정적 논문 연구실을 만들고 있습니다.",
      uncertainty: "구조가 너무 적으면 맥락을 잃고, 너무 많으면 매일 기록하기 비싸집니다. 적절한 수준은 아직 분명하지 않습니다.",
      related: [
        { label: "연구 글", href: "/ko/blog/" },
        { label: "논문 연구실", href: "/ko/papers/" }
      ]
    },
    {
      slug: "practical-vlm-systems",
      question: "비전-언어 시스템이 실제로 쓸모 있으려면 무엇이 필요할까?",
      motivation: "벤치마크 점수만으로는 grounding 실패와 데이터 가정, 상호작용 비용, 실제 소프트웨어 흐름에 맞는지를 설명하기 어렵습니다.",
      hypothesis: "모델 행동을 과제 정의와 실패 분석, 구현 제약, 사용자가 내려야 할 결정에 연결할 때 평가가 더 유용해집니다.",
      currentReading: "비전-언어 평가와 grounding, 멀티모달 추론, 실패 분석을 읽고 있습니다.",
      currentBuild: "모델의 주장을 평가 질문과 구현 시도에 연결하는 읽기 지도를 만들고 있습니다.",
      uncertainty: "진짜 멀티모달 능력과 벤치마크에 특화된 prompting, 전처리, 데이터 효과를 분리하기가 여전히 어렵습니다.",
      related: [{ label: "연구 지도", href: "/ko/research/" }]
    },
    {
      slug: "human-ai-research-tools",
      question: "연구자의 판단을 대신하지 않으면서 AI 도구가 연구를 돕는 방법은 무엇일까?",
      motivation: "AI는 요약과 질문 생성을 빠르게 할 수 있지만 연구에는 근거와 조정된 불확실성, 연구자가 검토할 수 있는 결정이 필요합니다.",
      hypothesis: "모든 결과가 원본 노트와 명시적인 신뢰 경계에 연결될 때 AI는 회상 시험관과 비교 도구, 질문 생성기로 가장 유용합니다.",
      currentReading: "사람-AI 작업 흐름과 근거 보정, 회상 연습, 연구 도구를 살펴봅니다.",
      currentBuild: "장기 자격 증명을 노출하지 않고도 동작하는 수동·선택형 API 논문 리뷰와 구술 연습을 만들고 있습니다.",
      uncertainty: "도움이 되는 마찰과 불필요한 작업 부담의 경계는 반복적인 실제 사용을 통해 확인해야 합니다.",
      related: [
        { label: "연구 글", href: "/ko/blog/" },
        { label: "gnaroshi.dev 프로젝트", href: "/ko/projects/gnaroshi-dev/" }
      ]
    }
  ],
  projects: [
    {
      slug: "gnaroshi-dev",
      title: "gnaroshi.dev",
      summary: "기술 글과 논문 노트, 회상 연습, 구현 기록을 하나의 버전 관리 흐름에 두는 정적 개인 연구 사이트입니다.",
      status: "진행 중",
      featured: true,
      contentStage: "working",
      metricEligible: false,
      graphEligible: false,
      weeklyReviewEligible: false,
      updatedAt: "2026-07-10",
      tags: ["astro", "mdx", "research-workflow"],
      problem: "연구 노트는 읽기 목록과 비공개 문서, 코드 저장소, 짧게 쓰는 작업 도구에 흩어지기 쉽습니다. 데이터베이스나 관리 화면 없이 하나의 정적 사이트가 맥락을 보존할 수 있는지 확인합니다.",
      role: "제품 설계, 정보 구조, 구현, 유지 관리",
      decisions: [
        "글과 논문 노트의 오래 남는 원본으로 Markdown과 MDX를 사용합니다.",
        "공개 사이트는 정적으로 유지하고 선택형 AI 기능은 수동 프롬프트로 대체할 수 있게 합니다.",
        "초기 콘텐츠가 연구 지표를 부풀리지 않도록 작업 근거와 seed 콘텐츠를 분리합니다.",
        "React는 필터와 연습 세션처럼 상호작용이 필요한 작은 영역에만 사용합니다."
      ],
      architecture: [
        "Astro가 공개 사이트와 콘텐츠 상세 페이지를 정적으로 생성합니다.",
        "콘텐츠 컬렉션이 글과 논문, queue, 프로젝트, 구현 metadata를 검증합니다.",
        "빌드 시점 유틸리티가 활동과 복습 일정, evidence eligibility, graph 데이터를 계산합니다.",
        "GitHub Actions가 custom domain의 GitHub Pages로 정적 결과물을 배포합니다."
      ],
      implementation: [
        "소개와 연구, 프로젝트, 글에는 typography 중심의 editorial layer를 사용합니다.",
        "읽기와 복습, 회상, 구현에는 간결한 논문 연구실 UI를 사용합니다.",
        "논문 노트 생성과 AI 리뷰 가져오기, 주간·graph 요약 생성을 로컬 스크립트로 처리합니다."
      ],
      result: "API 자격 증명 없이 빌드되며 핵심 글쓰기와 논문 흐름을 버전 관리 파일로 유지하는 사이트를 gnaroshi.dev에 배포했습니다.",
      lessons: [
        "빈 도구는 완성된 dashboard보다 한 가지 유용한 다음 행동을 보여 주어야 합니다.",
        "파생 지표가 공개 주장이 되기 전에 명시적인 eligibility 규칙이 필요합니다.",
        "개인 연구 사이트에는 기능의 밀도보다 editorial hierarchy가 더 중요합니다."
      ],
      relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
      links: [
        { label: "Repository", href: "https://github.com/Gnaroshi/gnaroshi.github.io" },
        { label: "사이트", href: "https://gnaroshi.dev" }
      ]
    }
  ],
  now: {
    lastUpdated: "2026-07-10",
    currentlyReading: [
      "비전-언어 모델과 연구 흐름 도구에 관한 첫 실질적인 논문 노트를 모으고 있습니다.",
      "시간이 지난 뒤 다시 읽을 때 어떤 세부 기록이 실제로 도움이 되는지 비교하고 있습니다."
    ],
    currentlyBuilding: [
      "gnaroshi.dev를 학술 홈페이지와 글 모음, 논문 연구실이 분명하게 구분되는 사이트로 다듬고 있습니다.",
      "초기 콘텐츠와 빈 활동이 공개 연구 주장으로 바뀌지 않게 하는 evidence gate를 만들고 있습니다."
    ],
    currentQuestions: [
      "6개월 뒤에도 논문 노트를 쓸모 있게 만드는 metadata는 무엇일까?",
      "공개 연구 사이트가 자기 자신을 위한 dashboard가 되지 않으면서 솔직한 진전을 보여 주려면 어떻게 해야 할까?",
      "논문 읽기의 어떤 부분은 직접 기록하고 어떤 부분은 계산해야 할까?"
    ]
  },
  skillGroups: [
    { title: "연구 흐름", skills: ["논문 읽기 시스템", "기술 노트", "실험 기록", "재현 계획"] },
    { title: "AI와 ML", skills: ["비전-언어 모델", "모델 평가", "머신러닝 시스템", "응용 AI 도구"] },
    { title: "소프트웨어", skills: ["TypeScript", "Python", "정적 사이트", "연구 도구", "GitHub workflows"] },
    { title: "글쓰기", skills: ["기술 요약", "프로젝트 회고", "논문 노트", "연구 지도"] }
  ]
} satisfies LocalizedData;
