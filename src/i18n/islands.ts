import type { Locale } from "./types";

export const enIslandMessages = {
  paper: {
    notebook: "Reading notes", searchAndFilter: "Search and filter", resetFilters: "Reset filters", search: "Search",
    status: "Status", allStatuses: "All statuses", tag: "Tag", allTags: "All tags",
    year: "Year", allYears: "All years", difficulty: "Difficulty", allLevels: "All levels", sort: "Sort",
    latest: "Latest read date", title: "Title", readingTime: "Reading time", featuredOnly: "Featured only",
    filteringBy: "Filtering by", clearDate: "Clear date", cards: "Reading note cards", shown: "{shown} of {total} shown",
    noLogs: "No reading notes have been published yet.", noLogsBody: "A first note can be short: record why the paper matters and one question to revisit.",
    noMatches: "No reading notes match these filters.", noMatchesBody: "Adjust the filters or reset them to return to all reading notes.",
    activity: "Activity", last365: "Last 365 days", intensity: "Heatmap intensity legend", less: "Less", more: "More",
    activityByDate: "Reading activity by date", papersOnDate: "{date}: {count} reading sessions", aiReview: "Note review", needsReview: "Area to revisit",
    reviewDue: "Review due", draft: "Draft", featured: "Featured", futureMe: "Future me", read: "read", metadata: "Reading note metadata",
    priority: "Priority", minutes: "{count} min", tags: "Reading note tags", detail: "Reading note", paper: "Original paper", code: "Code", project: "Project",
    statistics: "Reading activity statistics", sessionsToday: "Sessions today", papersTouchedToday: "Papers touched today", minutesToday: "Minutes today",
    currentStreak: "Current active-day streak", distinctPapersThisMonth: "Distinct papers this month", deepSessions: "Deep sessions", implementations: "Implementations",
    publicNotes: "Reading notes: {count}. More activity views appear after three notes.", readingProcessEvidence: "Review summary",
    scoreScope: "Review results describe evidence in the published note; they do not measure intelligence or personal worth.", average: "Average", averageAi: "Average review result",
    averageSelf: "Average self-review", averageGap: "Average review difference", reviewsDue: "Reviews due", scoreTrend: "Review results over time",
    weakDimension: "Area to revisit", dimensionAverage: "{label}: {score}/10 average.", paperNotes: "Reading notes",
    trendLabel: "Note-review results over time", trendPoint: "{title}: {score} on {date}", noTrend: "No public review history yet.",
    scoreLevels: { seed: "Seed", developing: "Developing", solid: "Solid", strong: "Strong", excellent: "Excellent" },
    statuses: { planned: "Planned", pass1: "Reading", pass2: "Reading", pass3: "Reading", read: "Read", implemented: "Implemented", abandoned: "Abandoned" },
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
  graph: {
    explorer: "Explorer", title: "Search the research graph", search: "Search", nodeType: "Node type", edgeType: "Edge type",
    allNodeTypes: "All node types", allEdgeTypes: "All edge types", reset: "Reset", nodes: "Nodes", shown: "{count} shown",
    noNodes: "No nodes match these filters.", detail: "Node detail", openDetail: "Open detail", noSelection: "No node selected.", edges: "Edges",
    relations: "{count} relations", noRelations: "No relations match these filters.", openPage: "Open connected page", connected: "Connected relations",
    noConnected: "No connected relations yet.", inferred: "inferred", manual: "manual"
  },
  implementation: {
    statuses: { planned: "Planned", inProgress: "In progress", reproduced: "Reproduced", partiallyReproduced: "Partially reproduced", failed: "Failed", abandoned: "Abandoned", shipped: "Shipped" },
    repo: "Repo", demo: "Demo", paper: "Paper", failed: "What failed", tags: "Implementation tags", read: "Read attempt"
  }
} as const;

type DeepStrings<T> = { [K in keyof T]: T[K] extends readonly string[] ? readonly string[] : T[K] extends string ? string : DeepStrings<T[K]> };
export type IslandMessages = DeepStrings<typeof enIslandMessages>;

export const koIslandMessages = {
  paper: {
    notebook: "읽기 기록", searchAndFilter: "검색과 필터", resetFilters: "필터 초기화", search: "검색",
    status: "상태", allStatuses: "모든 상태", tag: "태그", allTags: "모든 태그",
    year: "연도", allYears: "모든 연도", difficulty: "난이도", allLevels: "모든 난이도", sort: "정렬",
    latest: "최근 읽은 날짜", title: "제목", readingTime: "읽은 시간", featuredOnly: "선택한 논문만",
    filteringBy: "선택한 날짜", clearDate: "날짜 해제", cards: "읽기 기록", shown: "전체 {total}개 중 {shown}개",
    noLogs: "아직 공개한 읽기 기록이 없습니다.", noLogsBody: "첫 기록은 짧아도 됩니다. 이 논문을 읽는 이유와 다시 볼 질문 하나를 남깁니다.",
    noMatches: "조건에 맞는 읽기 기록이 없습니다.", noMatchesBody: "필터를 조정하거나 초기화해 전체 읽기 기록으로 돌아갑니다.",
    activity: "활동", last365: "최근 365일", intensity: "읽기 활동 강도", less: "적음", more: "많음",
    activityByDate: "날짜별 읽기 활동", papersOnDate: "{date}: 읽기 세션 {count}회", aiReview: "노트 검토", needsReview: "다시 볼 부분",
    reviewDue: "복습 예정", draft: "초안", featured: "선택", futureMe: "미래의 나", read: "읽음", metadata: "읽기 기록 정보",
    priority: "우선순위", minutes: "{count}분", tags: "읽기 기록 태그", detail: "읽기 기록", paper: "논문 원문", code: "코드", project: "프로젝트",
    statistics: "논문 읽기 통계", sessionsToday: "오늘 읽기 세션", papersTouchedToday: "오늘 읽은 논문", minutesToday: "오늘 읽은 시간",
    currentStreak: "현재 연속 활동일", distinctPapersThisMonth: "이번 달 읽은 논문", deepSessions: "깊이 읽기 세션", implementations: "구현 시도",
    publicNotes: "읽기 기록 {count}개. 기록이 3개 이상 쌓이면 활동 보기가 열립니다.", readingProcessEvidence: "검토 결과",
    scoreScope: "검토 결과는 공개한 기록에 남은 근거를 설명하며 지능이나 개인의 가치를 평가하지 않습니다.", average: "평균", averageAi: "검토 결과 평균",
    averageSelf: "자기 검토 평균", averageGap: "검토 결과 차이", reviewsDue: "복습 예정", scoreTrend: "기록의 변화",
    weakDimension: "다시 볼 부분", dimensionAverage: "{label}: 평균 {score}/10", paperNotes: "읽기 기록",
    trendLabel: "시간에 따른 노트 검토 결과", trendPoint: "{title}: {date}에 {score}점", noTrend: "공개한 검토 이력이 아직 없습니다.",
    scoreLevels: { seed: "시작", developing: "발전 중", solid: "탄탄함", strong: "강함", excellent: "매우 탄탄함" },
    statuses: { planned: "읽을 예정", pass1: "읽는 중", pass2: "읽는 중", pass3: "읽는 중", read: "읽음", implemented: "구현 완료", abandoned: "중단" },
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
  graph: {
    explorer: "탐색", title: "연구 연결 지도 검색", search: "검색", nodeType: "노드 유형", edgeType: "연결 유형",
    allNodeTypes: "모든 노드 유형", allEdgeTypes: "모든 연결 유형", reset: "초기화", nodes: "노드", shown: "{count}개",
    noNodes: "조건에 맞는 노드가 없습니다.", detail: "노드 상세", openDetail: "상세 열기", noSelection: "선택한 노드가 없습니다.", edges: "연결",
    relations: "연결 {count}개", noRelations: "조건에 맞는 연결이 없습니다.", openPage: "연결된 페이지 열기", connected: "연결 관계",
    noConnected: "연결 관계가 아직 없습니다.", inferred: "자동 추론", manual: "직접 연결"
  },
  implementation: {
    statuses: { planned: "계획", inProgress: "진행 중", reproduced: "재현 완료", partiallyReproduced: "일부 재현", failed: "실패", abandoned: "중단", shipped: "배포 완료" },
    repo: "저장소", demo: "데모", paper: "논문", failed: "실패한 부분", tags: "구현 태그", read: "구현 기록 읽기"
  }
} satisfies IslandMessages;

export function getIslandMessages(locale: Locale): IslandMessages {
  return locale === "ko" ? koIslandMessages : enIslandMessages;
}
