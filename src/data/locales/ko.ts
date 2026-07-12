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
  systemArchitecture: {
    eyebrow: "이 사이트의 구조",
    title: "기록이 공개되기까지",
    fullTitle: "발행 작업 흐름: 기록이 공개되기까지",
    description: "논문과 글은 비공개로 작성합니다. Studio에서 공개할 내용을 확인한 뒤, 공개용 데이터로 정리해 이 사이트에 반영합니다.",
    stages: {
      sources: "비공개 원본",
      control: "확인하고 발행",
      projection: "공개 기록",
      presentation: "화면과 배포"
    },
    badges: {
      private: "비공개",
      public: "공개",
      optional: "선택 사항"
    },
    repositories: {
      "paper-lab": {
        title: "논문 기록",
        role: "비공개 논문 작업 공간",
        description: "논문 노트와 읽기 세션, 복습과 구술 연습을 보관합니다.",
        responsibilities: ["논문 노트", "읽기 세션", "리뷰", "구술 연습 원본", "구현 시도"],
        exclusions: ["웹사이트 UI", "글 초안", "공개 배포"]
      },
      writing: {
        title: "글",
        role: "비공개 글 작업 공간",
        description: "글 초안과 영문·국문 번역, 글에 사용할 자료를 보관합니다.",
        responsibilities: ["글 초안", "번역", "글 자료", "시리즈 정보"],
        exclusions: ["논문 리뷰 기록", "공개 웹사이트 UI", "생성된 피드 출력"]
      },
      studio: {
        title: "Gnaroshi Studio",
        role: "검토와 발행 제어",
        description: "논문과 글을 작성하고, 변경사항을 확인해 공개할 내용을 발행합니다.",
        responsibilities: ["macOS 앱", "CLI", "공유 계약", "Git 작업", "검증", "발행 도구"],
        exclusions: ["원본 노트", "웹사이트 화면", "Worker 런타임"]
      },
      api: {
        title: "AI 기능",
        role: "선택형 AI 요청 서비스",
        description: "논문 리뷰와 구술 연습에 필요한 AI 요청을 선택적으로 처리합니다.",
        responsibilities: ["AI 요청 처리", "세션 생성", "점수 계산", "요청 제한", "CORS"],
        exclusions: ["원본 콘텐츠", "웹사이트 렌더링", "발행"]
      },
      "content-feed": {
        title: "공개 콘텐츠",
        role: "자동 생성 공개 기록",
        description: "공개하기로 선택한 내용만 담는 자동 생성 데이터입니다.",
        responsibilities: ["공개 생성 기록", "공개 자산", "manifest", "공개 snapshot"],
        exclusions: ["초안", "비공개 노트", "전체 대화 기록", "수동 편집"]
      },
      website: {
        title: "웹사이트",
        role: "화면과 배포",
        description: "공개 콘텐츠를 영문·국문 화면으로 표시하고 gnaroshi.dev에 배포합니다.",
        responsibilities: ["경로", "화면", "다국어", "SEO", "접근성", "GitHub Pages 배포"],
        exclusions: ["원본 작성", "AI 생성", "비공개 저장소 접근"]
      }
    },
    responsibilityLabel: "이곳에 두는 것",
    exclusionsLabel: "다른 곳에 두는 것",
    repositoryLinkLabel: "공개 저장소 열기",
    boundariesTitle: "저장소별 역할과 경계",
    cta: "전체 구조 보기",
    buildDetails: {
      title: "현재 공개 빌드",
      websiteCommit: "웹사이트 커밋",
      contentFeedCommit: "콘텐츠 피드 커밋",
      builtAt: "빌드 시각",
      feedSchema: "피드 스키마",
      unavailable: "확인할 수 없음"
    }
  },
  managedApplications: {
    eyebrow: "Studio 앱",
    title: "Studio가 연결하는 독립 실행 앱",
    description: "이 앱들은 웹사이트 발행 흐름의 저장소가 아닙니다. Studio가 상태를 확인하고 열거나 전달 내용을 미리 볼 수 있지만, 각 앱은 독립적으로 실행되며 자체 data를 유지합니다.",
    caption: "관리 앱 연결은 versioned status, launch, preview contract를 사용합니다. Private database를 공유하거나 다른 앱의 전체 화면을 embed하지 않습니다.",
    studio: { title: "Gnaroshi Studio", role: "탐색, 상태, 실행, 전달 미리보기" },
    applications: {
      paperflow: { title: "PaperFlow", role: "논문 library 계획과 import preview" },
      "arxiv-discovery": { title: "Arxiv Discovery", role: "최근 논문 후보" },
      runshelf: { title: "RunShelf", role: "실험 run 요약" },
      "tr-gpu-monitor": { title: "TR GPU Monitor", role: "정제된 compute 상태" },
      contentdeck: { title: "ContentDeck", role: "Media와 듣기 session" }
    }
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
      studioRelationship: "",
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
      studioRelationship: "",
      currentState: "웹사이트는 글과 논문을 공개 콘텐츠 피드에서만 읽습니다. 작성과 리뷰 생성, 비공개 지표, API endpoint는 역할이 분리된 저장소에 있습니다.",
      openProblems: [
        "편집을 마친 첫 글을 공개합니다.",
        "직접 작성하고 확인한 첫 논문 기록을 공개합니다.",
        "기록이 늘어나도 사이트를 이해하기 쉽게 유지합니다."
      ],
      relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
      linkLabels: { repository: "저장소", "live-site": "사이트" }
    },
    "gnaroshi-studio": {
      title: "Gnaroshi Studio",
      summary: "연구 자료를 확인하고 공개할 작업을 발행하며, 독립 실행되는 보조 앱의 상태를 살피는 로컬 작성·조정 앱입니다.",
      statusLabel: "연결 검토 중",
      problem: "논문 기록과 글, 발행, 보조 도구의 경계가 분명해야 하나의 제어 화면이 모든 앱 데이터의 두 번째 원본이 되지 않습니다.",
      designGoals: ["논문과 글 작성은 로컬에서 명시적으로 진행합니다.", "보조 앱을 쓸 수 있는지와 다음에 할 수 있는 일을 보여 줍니다.", "앱 데이터를 직접 쓰지 않고 먼저 넘길 내용을 확인합니다.", "모든 관리 앱을 독립적으로 실행할 수 있게 유지합니다."],
      architecture: ["데스크톱 앱과 CLI가 앱 탐색, 상태, 건강, 실행, 안전한 전달 미리보기를 위한 typed contract를 공유합니다.", "adapter는 앱을 쓸 수 없거나 버전이 맞지 않아도 Studio의 나머지 기능을 막지 않습니다.", "발행 저장소와 관리 앱은 서로 다른 관계로 유지합니다."],
      supportedAdapters: [],
      reproducibility: ["버전이 있는 manifest가 비밀 정보나 기기 경로 없이 앱과 진입점을 선언합니다.", "fixture test가 앱 없음, 잘못된 manifest, timeout, 잘못된 응답, 실행 중 upgrade를 확인합니다."],
      studioRelationship: "이 그룹에서 Studio는 탐색과 상태 확인, 실행, 전달 미리보기를 맡습니다. 각 앱은 자체 데이터와 전체 작업 흐름을 계속 소유합니다.",
      currentState: "작성과 발행 역할은 정해져 있고 Managed Apps layer에는 typed contract, adapter, CLI 명령, 앱 없음 상태 test가 있습니다. Provider release와 최종 화면·package 확인이 끝나야 공개 release로 이어집니다.",
      openProblems: ["Studio에서 capability를 켜기 전에 provider contract를 먼저 release합니다.", "앱 screenshot과 역할 icon을 owner가 확인합니다.", "package와 light/dark appearance를 수동으로 확인합니다."],
      relatedWriting: [],
      linkLabels: {}
    },
    paperflow: {
      title: "PaperFlow",
      summary: "Zotero library를 살펴보고 정리 변경을 계획하며, 적용 전에 논문 가져오기를 미리 확인하는 macOS 앱과 CLI입니다.",
      statusLabel: "연결 검토 중",
      problem: "제안된 변경과 database 쓰기, 이름 변경, 삭제가 한데 섞이면 논문 library를 안전하게 정리하기 어렵습니다.",
      designGoals: ["zotero.sqlite를 수정하지 않고 Zotero Local API로 읽습니다.", "scan, plan, report, import preview를 독립적으로 이해할 수 있게 둡니다.", "자동 삭제나 자동 이름 변경을 하지 않습니다.", "검토한 계획을 적용하기 전에 명시적으로 경계를 넘도록 합니다."],
      architecture: ["Python CLI가 사람이 읽는 명령과 versioned JSON status, doctor, scan, plan, dry-run import 응답을 함께 제공합니다.", "SwiftUI/AppKit 앱은 같은 안전 규칙 위에서 독립 실행되는 macOS interface입니다.", "선택한 파일, URL, arXiv ID, metadata 후보를 받고 typed preview 결과를 돌려줍니다."],
      supportedAdapters: [],
      reproducibility: ["기계용 출력은 stdout에, 진단은 stderr에 두고 error에는 0이 아닌 status를 반환합니다.", "Regression fixture가 명령 출력과 dry-run/apply 경계를 기록합니다."],
      studioRelationship: "Studio는 scan을 요청하거나 PaperFlow를 열고 선택한 논문 전달을 미리 확인할 수 있습니다. Zotero를 읽고 검토한 변경을 적용하는 주체는 PaperFlow뿐입니다.",
      currentState: "Library scan, 정리 plan, report, import preview는 독립적으로 작동합니다. Studio용 manifest, JSON 명령, handoff contract가 검토 단계에 있으며 최종 release와 화면 확인이 남았습니다.",
      openProblems: ["최종 macOS package와 appearance를 확인합니다.", "연결이 배포된 뒤에도 명시적 apply 경계를 눈에 띄게 유지합니다.", "production screenshot과 앱 역할 icon을 승인합니다."],
      relatedWriting: [],
      linkLabels: { repository: "저장소" }
    },
    "arxiv-discovery": {
      title: "Arxiv Discovery",
      summary: "최근 논문을 찾고 필요하면 번역하며, download나 전달 전에 후보를 확인하는 command-line·로컬 web 도구입니다.",
      statusLabel: "연결 검토 중",
      problem: "가져오기와 번역, 검토가 묶이면 원하지 않는 PDF를 받거나 한 사람의 일정 가정이 숨어들 수 있습니다.",
      designGoals: ["기존 process, serve, all 명령을 유지합니다.", "새 discovery는 기본적으로 download 없이 후보를 반환합니다.", "category, 기간, cutoff, 결과 수를 설정할 수 있게 합니다.", "다른 논문 도구로 보내기 전에 후보를 미리 확인합니다."],
      architecture: ["typed Python package가 discover, translate, serve, export, doctor 명령을 제공하고 main.py는 호환 wrapper로 남습니다.", "기존 Flask interface가 독립 실행되는 로컬 검토 화면으로 남습니다.", "Versioned candidate JSON은 download를 요청하지 않으면 로컬 PDF 경로를 넣지 않습니다."],
      supportedAdapters: [],
      reproducibility: ["none, selected, all download mode로 파일 생성 시점을 드러냅니다.", "test가 기존 명령과 candidate schema, 설정 가능한 discovery, preview-only handoff를 확인합니다."],
      studioRelationship: "Studio는 discovery를 시작하고 후보를 걸러 arXiv를 열거나 PaperFlow·Paper Lab 전달을 미리 확인할 수 있습니다. 논문 탐색과 명시적 download는 crawler의 책임입니다.",
      currentState: "기존 명령과 Flask UI는 그대로 쓸 수 있습니다. Package CLI는 download 없이 versioned candidate를 반환하고 명시적 download mode도 test로 확인했습니다. Release와 UI review가 남았습니다.",
      openProblems: ["Studio가 discovery를 제공하기 전에 provider를 release합니다.", "로컬 web UI의 theme와 workflow state를 확인합니다.", "대표 discovery screenshot을 승인합니다."],
      relatedWriting: [],
      linkLabels: { repository: "저장소" }
    },
    runshelf: {
      title: "RunShelf",
      summary: "실험 기록을 찾고 일부 metadata와 metric을 살피며, 큰 artifact는 원래 위치에 두는 로컬 run ledger입니다.",
      statusLabel: "연결 검토 중",
      problem: "Run metadata와 결과, 큰 artifact 위치가 함께 색인되지 않으면 지난 실험을 다시 살펴보기 어렵습니다.",
      designGoals: ["Checkpoint를 다른 앱에 복사하지 않고 투명한 로컬 run 기록을 유지합니다.", "실행 중, 실패, 완료, 오래됨, 불완전 상태를 구분합니다.", "Artifact reference를 RunShelf의 로컬 문맥에 둡니다.", "실험 launcher가 아니라 run browser로 남습니다."],
      architecture: ["독립 실행 desktop 앱이 run을 색인하고 metadata, metric, lineage, artifact reference를 보여 줍니다.", "Read-only provider 응답은 private remote path 없이 최근 run과 선택 run 요약을 제공합니다.", "큰 파일과 checkpoint는 원래 위치에 남습니다."],
      supportedAdapters: [],
      reproducibility: ["Run summary에 stable ID, source commit 맥락, 시간, 상태, 존재할 때의 선택 metric을 둡니다.", "Integration fixture가 artifact를 옮기지 않고 최근 run과 unavailable 상태를 확인합니다."],
      studioRelationship: "Studio는 작은 최근 run 요약을 보여 주고 RunShelf를 열 수 있습니다. Run 색인과 artifact reference의 소유자이자 전체 browser는 RunShelf입니다.",
      currentState: "Run discovery와 화면, metadata, metric, artifact reference는 독립 앱에 남아 있습니다. Read-only status와 summary provider가 구현됐지만 Studio에서 특정 run을 바로 여는 기능은 아직 없습니다.",
      openProblems: ["Studio에 Open run 동작을 내기 전에 stable selected-run route를 추가합니다.", "Release, package, 앱 identity review를 마칩니다.", "민감하지 않은 실제 run view screenshot을 승인합니다."],
      relatedWriting: [],
      linkLabels: {}
    },
    "tr-gpu-monitor": {
      title: "TR GPU Monitor",
      summary: "Host credential과 자세한 process 정보는 monitor 안에 둔 채 SSH로 NVIDIA GPU host를 확인하는 macOS 앱입니다.",
      statusLabel: "연결 검토 중",
      problem: "SSH key, password, raw shell, 민감한 command line을 조정 앱에 넘기지 않고 remote compute 상태를 보여 줘야 합니다.",
      designGoals: ["Host 인증과 저장 설정을 monitor 안에 둡니다.", "연결, 오래된 data, 사용률, memory, 온도, 전력, workload 상태를 분명히 보여 줍니다.", "Studio에는 행동할 수 있는 정제된 요약만 보냅니다.", "첫 연결에는 process 제어와 임의 remote 명령을 넣지 않습니다."],
      architecture: ["SwiftUI macOS 앱이 설정된 remote NVIDIA host를 SSH로 poll하며 알림과 자세한 monitoring을 소유합니다.", "JSON status provider는 credential과 민감한 process 인자를 제거합니다.", "Studio 동작은 refresh, host 열기, 전체 monitor 열기로 제한됩니다."],
      supportedAdapters: [],
      reproducibility: ["정제된 fixture가 연결됨, 끊김, 오래됨, warning, no-data 상태를 확인합니다.", "Provider validation이 credential과 private path field를 거부합니다."],
      studioRelationship: "Studio는 짧은 health summary를 받고 전체 monitor를 열 수 있습니다. Host 설정과 credential, 자세한 process, 알림은 TR GPU Monitor에 남습니다.",
      currentState: "독립 앱의 host·GPU monitoring, 알림, error 상태는 유지됩니다. 정제된 read-only status provider와 manifest가 검토 단계에 있으며 release와 package 확인이 남았습니다.",
      openProblems: ["최종 monitor package와 menu-bar identity를 확인합니다.", "Private host data 없이 대표 remote-host 상태를 확인합니다.", "실제 정제 monitoring screenshot을 승인합니다."],
      relatedWriting: [],
      linkLabels: {}
    },
    contentdeck: {
      title: "ContentDeck",
      summary: "지원하는 media를 열고 전체나 선택 구간을 반복하며, 듣기 연습에 subtitle을 쓰는 web·Electron player입니다.",
      statusLabel: "연결 검토 중",
      problem: "Provider 확인과 subtitle 사용 가능 여부, loop 경계가 여러 도구에 흩어지면 반복 듣기가 번거롭습니다.",
      designGoals: ["기존 web과 Electron 작업 흐름을 유지합니다.", "외부 media input을 검증하고 remote page가 Node나 shell에 접근하지 못하게 합니다.", "Playback, loop, subtitle 상태는 ContentDeck이 소유합니다.", "Studio handoff는 HTTPS media link만 받습니다."],
      architecture: ["React web interface와 Electron 앱이 provider detection과 playback state를 공유합니다.", "Local Fastify service가 범위가 제한된 yt-dlp 연결을 다룹니다.", "검증된 deep link가 임의 scheme이나 명령을 노출하지 않고 지원 media를 엽니다."],
      supportedAdapters: [],
      reproducibility: ["Regression test가 지원 provider, loop, subtitle, web mode, Electron boundary, yt-dlp 선택을 확인합니다.", "Integration은 playback state를 Studio로 옮기지 않고 status와 recent-session summary를 돌려줍니다."],
      studioRelationship: "Studio는 ContentDeck을 열고 검증한 HTTPS media URL을 보내거나 최근 session 요약을 요청할 수 있습니다. Player를 embed하지 않으며 playback과 subtitle state는 ContentDeck에 남습니다.",
      currentState: "YouTube, X, TikTok 탐지와 전체·구간 loop, subtitle, web mode, Electron mode, yt-dlp 연결이 유지됩니다. Status와 안전한 media handoff가 검토 단계에 있습니다.",
      openProblems: ["Light theme와 packaged Electron을 확인합니다.", "저장소 이름 결정은 owner에게 남겨 두고 ContentDeck 제품 이름을 유지합니다.", "실제 media-player screenshot과 역할 icon을 승인합니다."],
      relatedWriting: [],
      linkLabels: { repository: "저장소" }
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
