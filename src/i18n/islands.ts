import type { Locale } from "./types";

export const enIslandMessages = {
  paper: {
    notebook: "Notebook", searchAndFilter: "Search and filter", resetFilters: "Reset filters", search: "Search",
    status: "Status", allStatuses: "All statuses", depth: "Depth", allDepths: "All depths", tag: "Tag", allTags: "All tags",
    year: "Year", allYears: "All years", difficulty: "Difficulty", allLevels: "All levels", sort: "Sort",
    latest: "Latest read date", title: "Title", readingTime: "Reading time", featuredOnly: "Featured only",
    filteringBy: "Filtering by", clearDate: "Clear date", cards: "Paper cards", shown: "{shown} of {total} shown",
    noLogs: "No paper logs yet. Start with one 20-minute pass.", noLogsBody: "Begin with a short note that records the paper's question, core idea, and next reading decision.",
    noMatches: "No papers match these filters.", noMatchesBody: "Adjust the filters or reset them to return to the full paper log.",
    activity: "Activity", last365: "Last 365 days", intensity: "Heatmap intensity legend", less: "Less", more: "More",
    activityByDate: "Paper reading activity by date", papersOnDate: "{date}: {count} papers", aiReview: "AI review", needsReview: "Needs review",
    reviewDue: "Review due", draft: "Draft", featured: "Featured", futureMe: "Future me", read: "read", metadata: "Paper metadata",
    priority: "Priority", minutes: "{count} min", tags: "Paper tags", detail: "Detail page", paper: "Paper", code: "Code", project: "Project",
    statuses: { planned: "Planned", pass1: "Pass 1", pass2: "Pass 2", pass3: "Pass 3", read: "Read", implemented: "Implemented", abandoned: "Abandoned" },
    depths: { skim: "Skim", understand: "Understand", deep: "Deep", reproduce: "Reproduce", implement: "Implement" },
    priorities: { low: "Low", medium: "Medium", high: "High" }
  },
  queue: {
    controls: "Queue controls", filter: "Filter reading queue", search: "Search", status: "Status", allStatuses: "All statuses", priority: "Priority", allPriorities: "All priorities",
    source: "Source", allSources: "All sources",
    topic: "Topic", allTopics: "All topics", tag: "Tag", allTags: "All tags", sort: "Sort", recommended: "Recommended order",
    newest: "Newest added", targetDate: "Target date", difficulty: "Difficulty", readingTime: "Reading time", reset: "Reset",
    results: "Queued papers", shown: "{shown} of {total} shown", empty: "No queue items match these filters.", emptyBody: "Adjust the filters to return to the full reading queue.", open: "Detail page", paper: "Paper", code: "Code",
    copied: "Copied", copyCommand: "Copy conversion command", added: "added", target: "target",
    priorities: { urgent: "Urgent", high: "High", medium: "Medium", low: "Low" },
    statuses: { next: "Next", reading: "Reading", queued: "Queued", converted: "Converted", skipped: "Skipped", archived: "Archived" },
    sources: { advisor: "Advisor", lab: "Lab", citation: "Citation", arxiv: "arXiv", github: "GitHub", blog: "Blog", social: "Social", course: "Course", self: "Self", other: "Other" }
  },
  review: {
    title: "Review session", progress: "{current} of {total}", reveal: "Reveal saved note", remembered: "Remembered", partial: "Partial", missed: "Missed",
    complete: "Complete review", next: "Next paper", done: "Review session complete.", localOnly: "Practice state is stored only in this browser.",
    summary: "Summary", formula: "Formula", question: "Core question", connection: "Research connection", openPaper: "Open paper note",
    empty: "No reviews due right now.", emptyBody: "When a paper reaches its next spaced-review date, it will appear here.", quick: "Quick review",
    recallFirst: "Recall before looking", paper: "Paper", nextReview: "Next review", overdue: "overdue", due: "due",
    rewriteSummary: "Rewrite one-line summary from memory", rewriteFormula: "Rewrite main formula from memory", answerQuestion: "Answer retrieval question",
    markLocal: "Mark reviewed locally", copySnippet: "Copy review update snippet", savedLocal: "Saved locally in this browser. Paste the snippet into the paper note to make it permanent."
  },
  formula: {
    title: "Formula recall", heading: "Reconstruct before revealing", select: "Paper", prompts: "Prompts", prompt: "Prompt",
    defaultPrompt: "Write the main formula from memory and explain what each term does.", answer: "Formula from memory",
    interpretation: "Plain-language interpretation", confidence: "Confidence", low: "Low", medium: "Medium", high: "High",
    reveal: "Show saved formula", hide: "Hide saved formula", save: "Save locally", saved: "Saved locally in this browser. Copy the JSON if you want to commit it later.",
    copied: "Copied recall attempt JSON.", copy: "Copy attempt JSON", copyPrompt: "Copy manual AI scoring prompt", promptCopied: "Copied manual scoring prompt.",
    openPaper: "Open paper note", noMaterial: "No formulas ready for recall yet.", noMaterialBody: "Add a main formula or recall prompt to a paper note, then revisit this trainer.",
    savedFormula: "Saved formula", noFormula: "No formula recorded.", noInterpretation: "No interpretation recorded.", terms: "Terms",
    selfCheck: "Self-check", checks: ["Did I write the formula before revealing it?", "Can I explain each term without rereading?", "Can I say when this formula is useful?", "Can I name one assumption or failure mode?"]
  },
  question: {
    eyebrow: "Practice", title: "Random practice mode", random: "Random question", type: "Type", allTypes: "All types", select: "Question",
    difficulty: "difficulty", answer: "Answer from memory", selfScore: "Self score", evidence: "Expected signals", confidence: "Confidence",
    save: "Save locally", copy: "Copy manual AI quiz prompt", openPaper: "Open paper", saved: "Saved locally in this browser.",
    copied: "Copied manual AI quiz prompt.", blocked: "Automatic copy was blocked. Select the prompt and copy it manually.", noEvidence: "No expected signals recorded yet.",
    empty: "No questions yet.", emptyBody: "Questions will appear here as paper reviews, oral exams, and formula practice accumulate."
  },
  graph: {
    explorer: "Explorer", title: "Search the research graph", search: "Search", nodeType: "Node type", edgeType: "Edge type",
    allNodeTypes: "All node types", allEdgeTypes: "All edge types", reset: "Reset", nodes: "Nodes", shown: "{count} shown",
    noNodes: "No nodes match these filters.", detail: "Node detail", openDetail: "Open detail", noSelection: "No node selected.", edges: "Edges",
    relations: "{count} relations", noRelations: "No relations match these filters.", openPage: "Open connected page", connected: "Connected relations",
    noConnected: "No connected relations yet.", inferred: "inferred", manual: "manual"
  },
  exam: {
    checking: "Checking live voice availability…", unavailable: "Live voice is unavailable in this deployment.", ready: "Live voice is ready.",
    manualAvailable: "Live voice is currently unavailable. Manual practice remains available.", connected: "Live session connected", stopped: "Live session stopped. The transcript remains only in this browser tab.",
    eventError: "The realtime event channel reported an error.", examinerError: "The realtime examiner returned an error event.", unreadable: "A realtime event could not be read.",
    mockLoaded: "Development mock questions loaded.", textLoaded: "Text exam loaded.", promptCopied: "Manual oral exam prompt copied.", copyBlocked: "Automatic copy was blocked. The full prompt is selected; press Ctrl+C or Cmd+C.",
    principlesLabel: "Live oral exam principles", principles: ["This score measures retrieval evidence, not intelligence.", "You can stop anytime and export your transcript.", "The examiner asks one question at a time.", "Use Korean or English."],
    setup: "Exam setup", setupHeading: "Choose the evidence depth", targetDepth: "Target depth", language: "Language", questions: "Questions",
    pass1: "Pass 1 — relevance", pass2: "Pass 2 — structure", pass3: "Pass 3 — deep understanding", korean: "Korean", english: "English",
    startLive: "Start live oral exam", stopLive: "Stop live exam", generateText: "Generate text exam", microphoneReady: "Live voice is available. Microphone access is requested only when the exam starts.",
    textOrManual: "Live voice is currently unavailable. Text or manual practice can still be used.", voiceUnavailable: "Live voice is unavailable in this deployment. Manual practice remains available below.",
    connection: "Realtime connection {state}.", connectedMinutes: "Live session connected · about {minutes} minutes", noOffer: "The browser did not create a WebRTC offer.", rejectedOffer: "OpenAI rejected the WebRTC session offer.",
    microphoneDenied: "Microphone permission was not granted.", startError: "The oral exam could not be started.", voiceLabel: "AI-generated examiner voice",
    privacy: "The examiner voice is AI-generated, not a human voice. Audio and transcript are not persisted by this page.",
    textFallback: "Text fallback", answerMemory: "Answer from memory", developmentMock: "Development mock", scoreText: "Score text answers", scoreStopped: "Score stopped live exam",
    transcript: "Transcript", liveConversation: "Live conversation", recordedLocal: "Recorded locally", turns: "{count} turns", examiner: "Examiner", you: "You", transcriptEmpty: "Transcript events will appear here during a live exam.",
    result: "Exam result", retrievalEvidence: "Retrieval evidence: {score}/100", confidence: "{value} confidence", mockWarning: "Development mock. This score did not evaluate correctness.",
    copyScore: "Copy score JSON", copyTranscript: "Copy transcript", exportScore: "Export score JSON", exportTranscript: "Export transcript", copied: "{label} copied.", copyFailed: "Could not copy {label}. Select it manually below.", prepared: "{filename} prepared locally.",
    keepLocal: "Keep the result local, or add it to the research record before the next update.", reviewJson: "Review score JSON",
    noApi: "No-API workflow", manualTitle: "Run the exam manually", manualBody: "Copy the prompt into ChatGPT or another model. Keep the transcript local, then add returned score JSON to the research record.",
    copyManual: "Copy manual oral exam prompt", manualPrompt: "Manual exam prompt"
  },
  manualReview: {
    rereview: "Re-review manually", hide: "Hide manual prompt", title: "Or copy manual review prompt",
    body: "Paste this into ChatGPT or another model, then save the returned JSON review.", copy: "Copy AI Review Prompt", cli: "CLI option",
    prompt: "Manual review prompt", copied: "Prompt copied.", selected: "Automatic copy was blocked. The full prompt is selected; press Ctrl+C or Cmd+C.",
    failed: "Copy is unavailable. Select the prompt text manually."
  }
} as const;

type DeepStrings<T> = { [K in keyof T]: T[K] extends readonly string[] ? readonly string[] : T[K] extends string ? string : DeepStrings<T[K]> };
export type IslandMessages = DeepStrings<typeof enIslandMessages>;

export const koIslandMessages = {
  paper: {
    notebook: "논문 노트", searchAndFilter: "검색과 필터", resetFilters: "필터 초기화", search: "검색",
    status: "상태", allStatuses: "모든 상태", depth: "읽기 깊이", allDepths: "모든 깊이", tag: "태그", allTags: "모든 태그",
    year: "연도", allYears: "모든 연도", difficulty: "난이도", allLevels: "모든 난이도", sort: "정렬",
    latest: "최근 읽은 날짜", title: "제목", readingTime: "읽은 시간", featuredOnly: "선택한 논문만",
    filteringBy: "선택한 날짜", clearDate: "날짜 해제", cards: "논문 노트", shown: "전체 {total}개 중 {shown}개",
    noLogs: "논문 기록이 아직 없습니다. 20분 읽기부터 시작하세요.", noLogsBody: "논문의 질문과 핵심 아이디어, 다음 읽기 결정을 짧게 남깁니다.",
    noMatches: "조건에 맞는 논문이 없습니다.", noMatchesBody: "필터를 조정하거나 초기화해 전체 기록으로 돌아갑니다.",
    activity: "활동", last365: "최근 365일", intensity: "읽기 활동 강도", less: "적음", more: "많음",
    activityByDate: "날짜별 논문 읽기 활동", papersOnDate: "{date}: 논문 {count}편", aiReview: "AI 리뷰", needsReview: "리뷰 필요",
    reviewDue: "복습 예정", draft: "초안", featured: "선택", futureMe: "미래의 나", read: "읽음", metadata: "논문 정보",
    priority: "우선순위", minutes: "{count}분", tags: "논문 태그", detail: "상세 노트", paper: "논문", code: "코드", project: "프로젝트",
    statuses: { planned: "읽을 예정", pass1: "1차 읽기", pass2: "2차 읽기", pass3: "3차 읽기", read: "읽음", implemented: "구현 완료", abandoned: "중단" },
    depths: { skim: "훑어보기", understand: "구조 이해", deep: "깊이 읽기", reproduce: "재현", implement: "구현" },
    priorities: { low: "낮음", medium: "보통", high: "높음" }
  },
  queue: {
    controls: "읽을 논문 필터", filter: "읽을 논문 추리기", search: "검색", status: "상태", allStatuses: "모든 상태", priority: "우선순위", allPriorities: "모든 우선순위",
    source: "출처", allSources: "모든 출처",
    topic: "주제", allTopics: "모든 주제", tag: "태그", allTags: "모든 태그", sort: "정렬", recommended: "추천 순서",
    newest: "최근 추가", targetDate: "목표 날짜", difficulty: "난이도", readingTime: "예상 읽기 시간", reset: "초기화",
    results: "읽을 논문", shown: "전체 {total}개 중 {shown}개", empty: "조건에 맞는 논문이 없습니다.", emptyBody: "필터를 조정해 전체 읽기 목록으로 돌아갑니다.", open: "상세 보기", paper: "논문", code: "코드",
    copied: "복사됨", copyCommand: "변환 명령 복사", added: "추가", target: "목표",
    priorities: { urgent: "긴급", high: "높음", medium: "보통", low: "낮음" },
    statuses: { next: "다음", reading: "읽는 중", queued: "대기", converted: "노트로 변환", skipped: "건너뜀", archived: "보관" },
    sources: { advisor: "지도자", lab: "연구실", citation: "인용", arxiv: "arXiv", github: "GitHub", blog: "글", social: "소셜", course: "수업", self: "직접 발견", other: "기타" }
  },
  review: {
    title: "복습 세션", progress: "{total}개 중 {current}번째", reveal: "저장한 노트 보기", remembered: "기억함", partial: "일부 기억", missed: "놓침",
    complete: "복습 완료", next: "다음 논문", done: "복습을 마쳤습니다.", localOnly: "연습 상태는 이 브라우저에만 저장됩니다.",
    summary: "요약", formula: "수식", question: "핵심 질문", connection: "연구 연결", openPaper: "논문 노트 열기",
    empty: "지금 예정된 복습이 없습니다.", emptyBody: "논문이 다음 간격 복습 날짜에 도달하면 여기에 나타납니다.", quick: "빠른 복습",
    recallFirst: "노트를 보기 전에 떠올리기", paper: "논문", nextReview: "다음 복습", overdue: "기한 지남", due: "예정",
    rewriteSummary: "한 줄 요약을 기억에서 다시 쓰기", rewriteFormula: "핵심 수식을 기억에서 다시 쓰기", answerQuestion: "회상 질문에 답하기",
    markLocal: "브라우저에서 복습 완료", copySnippet: "복습 업데이트 조각 복사", savedLocal: "이 브라우저에 저장했습니다. 영구 기록으로 남기려면 이 조각을 논문 노트에 붙여 넣으세요."
  },
  formula: {
    title: "수식 회상", heading: "정답을 보기 전에 다시 쓰기", select: "논문", prompts: "회상 질문", prompt: "회상 질문",
    defaultPrompt: "핵심 수식을 기억에서 쓰고 각 항이 무엇을 하는지 설명하세요.", answer: "기억에서 쓴 수식",
    interpretation: "자연어 해석", confidence: "확신", low: "낮음", medium: "보통", high: "높음",
    reveal: "저장한 수식 보기", hide: "저장한 수식 닫기", save: "브라우저에 저장", saved: "이 브라우저에 저장했습니다. 나중에 커밋하려면 JSON을 복사하세요.",
    copied: "회상 시도 JSON을 복사했습니다.", copy: "시도 JSON 복사", copyPrompt: "수동 AI 채점 프롬프트 복사", promptCopied: "수동 채점 프롬프트를 복사했습니다.",
    openPaper: "논문 노트 열기", noMaterial: "회상할 수식이 아직 없습니다.", noMaterialBody: "논문 노트에 핵심 수식이나 회상 질문을 추가한 뒤 다시 연습하세요.",
    savedFormula: "저장한 수식", noFormula: "기록한 수식이 없습니다.", noInterpretation: "기록한 해석이 없습니다.", terms: "기호 설명",
    selfCheck: "스스로 확인하기", checks: ["수식을 보기 전에 먼저 썼는가?", "다시 읽지 않고 각 항을 설명할 수 있는가?", "이 수식이 언제 유용한지 말할 수 있는가?", "가정이나 실패 조건을 하나 말할 수 있는가?"]
  },
  question: {
    eyebrow: "연습", title: "무작위 질문 연습", random: "질문 무작위 선택", type: "유형", allTypes: "모든 유형", select: "질문",
    difficulty: "난이도", answer: "기억에서 답하기", selfScore: "자기 평가", evidence: "답변에 포함할 근거", confidence: "확신",
    save: "브라우저에 저장", copy: "수동 AI 퀴즈 프롬프트 복사", openPaper: "논문 열기", saved: "이 브라우저에 저장했습니다.",
    copied: "수동 AI 퀴즈 프롬프트를 복사했습니다.", blocked: "자동 복사가 차단되었습니다. 프롬프트를 선택해 직접 복사하세요.", noEvidence: "기록한 평가 근거가 아직 없습니다.",
    empty: "질문이 아직 없습니다.", emptyBody: "논문 리뷰와 구술시험, 수식 연습이 쌓이면 질문이 이곳에 나타납니다."
  },
  graph: {
    explorer: "탐색", title: "연구 연결 지도 검색", search: "검색", nodeType: "노드 유형", edgeType: "연결 유형",
    allNodeTypes: "모든 노드 유형", allEdgeTypes: "모든 연결 유형", reset: "초기화", nodes: "노드", shown: "{count}개",
    noNodes: "조건에 맞는 노드가 없습니다.", detail: "노드 상세", openDetail: "상세 열기", noSelection: "선택한 노드가 없습니다.", edges: "연결",
    relations: "연결 {count}개", noRelations: "조건에 맞는 연결이 없습니다.", openPage: "연결된 페이지 열기", connected: "연결 관계",
    noConnected: "연결 관계가 아직 없습니다.", inferred: "자동 추론", manual: "직접 연결"
  },
  exam: {
    checking: "실시간 음성 기능을 확인하는 중…", unavailable: "이 배포에서는 실시간 음성을 사용할 수 없습니다.", ready: "실시간 음성을 사용할 수 있습니다.",
    manualAvailable: "현재 실시간 음성을 사용할 수 없습니다. 수동 연습은 계속할 수 있습니다.", connected: "실시간 세션 연결됨", stopped: "실시간 세션을 멈췄습니다. 대화 기록은 이 탭에만 남습니다.",
    eventError: "실시간 이벤트 채널에서 오류가 발생했습니다.", examinerError: "실시간 시험관이 오류 이벤트를 반환했습니다.", unreadable: "실시간 이벤트를 읽지 못했습니다.",
    mockLoaded: "개발용 질문을 불러왔습니다.", textLoaded: "텍스트 시험을 불러왔습니다.", promptCopied: "수동 구술 연습 프롬프트를 복사했습니다.", copyBlocked: "자동 복사가 차단되었습니다. 전체 프롬프트를 선택했으니 Ctrl+C 또는 Cmd+C를 누르세요.",
    principlesLabel: "실시간 구술시험 원칙", principles: ["이 점수는 지능이 아니라 기억에서 꺼내 설명한 근거를 봅니다.", "언제든 멈추고 대화 기록을 내보낼 수 있습니다.", "시험관은 한 번에 질문 하나를 합니다.", "한국어나 영어를 사용할 수 있습니다."],
    setup: "시험 설정", setupHeading: "확인할 이해 깊이 선택", targetDepth: "목표 깊이", language: "언어", questions: "질문 수",
    pass1: "1차 읽기 — 관련성", pass2: "2차 읽기 — 구조", pass3: "3차 읽기 — 깊은 이해", korean: "한국어", english: "영어",
    startLive: "실시간 구술시험 시작", stopLive: "실시간 시험 중지", generateText: "텍스트 시험 만들기", microphoneReady: "실시간 음성을 사용할 수 있습니다. 시험을 시작할 때만 마이크 권한을 요청합니다.",
    textOrManual: "현재 실시간 음성을 사용할 수 없습니다. 텍스트 또는 수동 연습은 계속할 수 있습니다.", voiceUnavailable: "이 배포에서는 실시간 음성을 사용할 수 없습니다. 아래 수동 연습은 계속할 수 있습니다.",
    connection: "실시간 연결 상태: {state}", connectedMinutes: "실시간 세션 연결됨 · 약 {minutes}분", noOffer: "브라우저가 WebRTC 연결 요청을 만들지 못했습니다.", rejectedOffer: "OpenAI가 WebRTC 세션 연결을 거부했습니다.",
    microphoneDenied: "마이크 사용 권한이 허용되지 않았습니다.", startError: "구술시험을 시작하지 못했습니다.", voiceLabel: "AI가 생성한 시험관 음성",
    privacy: "시험관 음성은 사람이 아닌 AI가 생성합니다. 이 페이지는 오디오와 대화 기록을 저장하지 않습니다.",
    textFallback: "텍스트 대안", answerMemory: "기억에서 답하기", developmentMock: "개발용 모의 시험", scoreText: "텍스트 답변 채점", scoreStopped: "중지한 실시간 시험 채점",
    transcript: "대화 기록", liveConversation: "실시간 대화", recordedLocal: "브라우저에 기록", turns: "{count}개 발화", examiner: "시험관", you: "나", transcriptEmpty: "실시간 시험 중 대화가 이곳에 나타납니다.",
    result: "시험 결과", retrievalEvidence: "기억에서 꺼낸 근거: {score}/100", confidence: "확신도 {value}", mockWarning: "개발용 모의 결과이며 정확성을 평가하지 않았습니다.",
    copyScore: "점수 JSON 복사", copyTranscript: "대화 기록 복사", exportScore: "점수 JSON 내보내기", exportTranscript: "대화 기록 내보내기", copied: "{label} 복사 완료", copyFailed: "{label}을 복사하지 못했습니다. 아래에서 직접 선택하세요.", prepared: "{filename} 파일을 브라우저에서 준비했습니다.",
    keepLocal: "결과를 로컬에 보관하거나 다음 업데이트 전에 연구 기록에 추가하세요.", reviewJson: "점수 JSON 확인",
    noApi: "API 없는 방식", manualTitle: "수동으로 시험 진행", manualBody: "프롬프트를 ChatGPT나 다른 모델에 붙여 넣으세요. 대화 기록은 로컬에 두고 반환된 점수 JSON만 연구 기록에 추가합니다.",
    copyManual: "수동 구술시험 프롬프트 복사", manualPrompt: "수동 시험 프롬프트"
  },
  manualReview: {
    rereview: "수동으로 다시 리뷰", hide: "수동 프롬프트 닫기", title: "또는 수동 리뷰 프롬프트 복사",
    body: "ChatGPT나 다른 모델에 붙여 넣은 뒤 반환된 JSON 리뷰를 저장하세요.", copy: "AI 리뷰 프롬프트 복사", cli: "CLI 명령",
    prompt: "수동 리뷰 프롬프트", copied: "프롬프트를 복사했습니다.", selected: "자동 복사가 차단되었습니다. 전체 프롬프트를 선택했으니 Ctrl+C 또는 Cmd+C를 누르세요.",
    failed: "복사 기능을 사용할 수 없습니다. 프롬프트를 직접 선택하세요."
  }
} satisfies IslandMessages;

export function getIslandMessages(locale: Locale): IslandMessages {
  return locale === "ko" ? koIslandMessages : enIslandMessages;
}
