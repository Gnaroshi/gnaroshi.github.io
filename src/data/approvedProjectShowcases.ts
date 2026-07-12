import type { ApprovedMediaAsset } from "./approvedMedia";

export type ShowcaseTheme = "light" | "dark";

export type ApprovedProjectShowcase = ApprovedMediaAsset & {
  applicationId: string;
  screenshotId: string;
  sourceRepository: string;
  sourceApplicationCommit: string;
  sourceFile: string;
  stepId: string;
  theme: ShowcaseTheme;
  usesDemoData: true;
  demoDisclosure: { en: string; ko: string };
  caption: { en: string; ko: string };
  privacyReviewed: true;
  approval: "owner-approved";
};

type Source = {
  applicationId: string;
  repository: string;
  commit: string;
  width: number;
  height: number;
  disclosure: { en: string; ko: string };
};

const sources = {
  studio: { applicationId: "gnaroshi-studio", repository: "Gnaroshi/gnaroshi-studio", commit: "e6115c90ab866adde9ed1ea2cecda178fca96cdd", width: 3200, height: 2000, disclosure: { en: "The titles and app activity shown are deterministic demo data.", ko: "화면의 제목과 앱 활동은 결정적으로 만든 데모 자료입니다." } },
  paperflow: { applicationId: "paperflow", repository: "Gnaroshi/paperflow", commit: "7c7bd013d171e2e58e0a5cee97faacd0c02ee8a8", width: 1120, height: 904, disclosure: { en: "The library counts and proposed changes are demo data; no real Zotero library was opened.", ko: "라이브러리 수와 변경 제안은 데모 자료이며 실제 Zotero 라이브러리를 열지 않았습니다." } },
  arxiv: { applicationId: "arxiv-discovery", repository: "Gnaroshi/Arxiv-newest-paper-crawler", commit: "e48da6e1434adbeee8d6570816141d0f393a0fda", width: 3200, height: 2000, disclosure: { en: "Titles, authors, dates, and summaries are synthetic demo metadata.", ko: "제목과 저자, 날짜, 요약은 모두 합성 데모 메타데이터입니다." } },
  runshelf: { applicationId: "runshelf", repository: "Gnaroshi/runshelf", commit: "7657067cfeae56259a5a7a714a046d2b57308b79", width: 1180, height: 904, disclosure: { en: "Run names, commits, metrics, and reference URIs are deterministic demo data.", ko: "실행 이름과 커밋, 지표, 참조 URI는 모두 결정적으로 만든 데모 자료입니다." } },
  gpu: { applicationId: "tr-gpu-monitor", repository: "Gnaroshi/tr-gpu-monitor", commit: "3a2fa8173f3bb9d09ef67be66933070e1d350adc", width: 1180, height: 904, disclosure: { en: "Host names, GPU values, and warning times are synthetic demo data.", ko: "호스트 이름과 GPU 값, 경고 시간은 모두 합성 데모 자료입니다." } },
  deck: { applicationId: "contentdeck", repository: "Gnaroshi/content-looper", commit: "5c6e2f94d1e1a18b6381ad65ee443609356426df", width: 3200, height: 2000, disclosure: { en: "The clip, audio, subtitles, and session values are generated demo data.", ko: "클립과 오디오, 자막, 세션 값은 모두 생성한 데모 자료입니다." } }
} as const satisfies Record<string, Source>;

function showcase(source: Source, screenshotId: string, stepId: string, theme: ShowcaseTheme, alt: { en: string; ko: string }, caption: { en: string; ko: string }): ApprovedProjectShowcase {
  const id = `${source.applicationId}-${screenshotId}`;
  return {
    id,
    applicationId: source.applicationId,
    screenshotId,
    sourceRepository: source.repository,
    sourceApplicationCommit: source.commit,
    sourceFile: `screenshots/${screenshotId}.png`,
    width: source.width,
    height: source.height,
    widths: [640, 960, 1200, 1600].filter((width) => width <= source.width),
    focalPoint: "50% 50%",
    alt,
    caption,
    stepId,
    theme,
    usesDemoData: true,
    demoDisclosure: source.disclosure,
    privacyReviewed: true,
    approval: "owner-approved"
  };
}

export const approvedProjectShowcases = [
  showcase(sources.studio, "managed-apps", "review-apps", "dark", { en: "Gnaroshi Studio Managed Apps overview with PaperFlow and Arxiv Discovery available.", ko: "PaperFlow와 Arxiv Discovery를 사용할 수 있다고 표시한 Gnaroshi Studio 관리 앱 개요." }, { en: "Check companion-app availability before a handoff.", ko: "전달 전에 보조 앱을 사용할 수 있는지 확인합니다." }),
  showcase(sources.studio, "candidate-review", "review-candidates", "dark", { en: "Gnaroshi Studio review list with three demo VLA paper candidates.", ko: "데모 VLA 논문 후보 세 개를 보여 주는 Gnaroshi Studio 검토 목록." }, { en: "Review candidate metadata before selecting a next action.", ko: "다음 동작을 고르기 전에 후보 메타데이터를 검토합니다." }),
  showcase(sources.studio, "handoff-preview", "preview-handoff", "dark", { en: "Gnaroshi Studio PaperFlow handoff and local checkpoint preview before commit or publication.", ko: "커밋이나 발행 전 Gnaroshi Studio의 PaperFlow 전달 및 로컬 체크포인트 미리보기." }, { en: "Inspect the handoff and checkpoint boundary before publishing.", ko: "발행 전에 전달 내용과 체크포인트 경계를 확인합니다." }),
  showcase(sources.studio, "managed-apps-light", "review-apps", "light", { en: "Light-theme Gnaroshi Studio Managed Apps overview.", ko: "라이트 테마의 Gnaroshi Studio 관리 앱 개요." }, { en: "Light appearance verification of the same managed-app state.", ko: "같은 관리 앱 상태를 라이트 화면에서 확인한 모습입니다." }),

  showcase(sources.paperflow, "scan-summary", "scan-library", "dark", { en: "PaperFlow read-only scan summary with zero Zotero writes.", ko: "Zotero 쓰기 0회를 표시한 PaperFlow 읽기 전용 스캔 요약." }, { en: "Scan the library through the read-only path.", ko: "읽기 전용 경로로 라이브러리를 살펴봅니다." }),
  showcase(sources.paperflow, "plan-review", "generate-plan", "dark", { en: "PaperFlow plan with proposed collection moves and duplicate review.", ko: "컬렉션 이동 제안과 중복 검토를 보여 주는 PaperFlow 계획." }, { en: "Generate and inspect an organization plan without applying it.", ko: "적용하지 않고 정리 계획을 만들고 살펴봅니다." }),
  showcase(sources.paperflow, "apply-boundary", "stop-before-apply", "dark", { en: "PaperFlow apply control disabled in showcase mode before any Zotero write.", ko: "Zotero 쓰기 전 쇼케이스 모드에서 적용 기능이 비활성화된 PaperFlow 화면." }, { en: "Stop at the explicit write boundary.", ko: "명시적인 쓰기 경계에서 멈춥니다." }),
  showcase(sources.paperflow, "scan-summary-light", "scan-library", "light", { en: "Light-theme PaperFlow library scan summary.", ko: "라이트 테마의 PaperFlow 라이브러리 스캔 요약." }, { en: "Light appearance verification of the read-only scan.", ko: "읽기 전용 스캔을 라이트 화면에서 확인한 모습입니다." }),

  showcase(sources.arxiv, "discovery-list", "discover", "dark", { en: "Arxiv Discovery list of demo VLA candidates in no-download mode.", ko: "다운로드 없는 모드에서 데모 VLA 후보를 보여 주는 Arxiv Discovery 목록." }, { en: "Discover a bounded candidate list without downloading PDFs.", ko: "PDF를 받지 않고 범위를 제한한 후보 목록을 찾습니다." }),
  showcase(sources.arxiv, "candidate-detail", "inspect-candidate", "dark", { en: "Arxiv Discovery candidate detail with reviewed metadata and PDF download disabled.", ko: "메타데이터를 검토하고 PDF 다운로드는 끈 Arxiv Discovery 후보 상세 화면." }, { en: "Inspect one candidate while download remains disabled.", ko: "다운로드를 끈 채 후보 하나를 살펴봅니다." }),
  showcase(sources.arxiv, "handoff-preview", "preview-handoff", "dark", { en: "Arxiv Discovery PaperFlow handoff preview containing public metadata and no PDF.", ko: "공개 메타데이터만 있고 PDF는 없는 Arxiv Discovery의 PaperFlow 전달 미리보기." }, { en: "Preview the public-metadata-only handoff.", ko: "공개 메타데이터만 넘기는 전달 내용을 미리 봅니다." }),
  showcase(sources.arxiv, "discovery-list-light", "discover", "light", { en: "Light-theme Arxiv Discovery candidate list.", ko: "라이트 테마의 Arxiv Discovery 후보 목록." }, { en: "Light appearance verification of the candidate list.", ko: "후보 목록을 라이트 화면에서 확인한 모습입니다." }),

  showcase(sources.runshelf, "run-list", "open-runs", "dark", { en: "RunShelf list of completed, failed, and running demo records.", ko: "완료, 실패, 실행 중인 데모 기록을 보여 주는 RunShelf 목록." }, { en: "Compare recent run states in one local ledger.", ko: "하나의 로컬 원장에서 최근 실행 상태를 비교합니다." }),
  showcase(sources.runshelf, "failed-run", "inspect-context", "dark", { en: "RunShelf failed demo run with configuration, source context, and selected metrics.", ko: "설정과 소스 맥락, 일부 지표를 보여 주는 RunShelf 실패 데모 실행." }, { en: "Inspect the context around one failed run.", ko: "실패한 실행 하나의 맥락을 살펴봅니다." }),
  showcase(sources.runshelf, "artifact-references", "review-references", "dark", { en: "RunShelf artifact references without copied checkpoints or remote paths.", ko: "복사한 체크포인트나 원격 경로 없이 참조만 보여 주는 RunShelf 화면." }, { en: "Follow privacy-safe references without moving large artifacts.", ko: "큰 산출물을 옮기지 않고 개인정보에 안전한 참조를 확인합니다." }),
  showcase(sources.runshelf, "run-list-light", "open-runs", "light", { en: "Light-theme RunShelf run list.", ko: "라이트 테마의 RunShelf 실행 목록." }, { en: "Light appearance verification of the run ledger.", ko: "실행 원장을 라이트 화면에서 확인한 모습입니다." }),

  showcase(sources.gpu, "host-overview", "check-hosts", "dark", { en: "TR GPU Monitor overview of available, high-memory, and stale demo hosts.", ko: "사용 가능, 메모리 사용 높음, 오래됨 상태의 데모 호스트를 보여 주는 TR GPU Monitor 개요." }, { en: "Compare host state before choosing compute capacity.", ko: "컴퓨팅 자원을 고르기 전에 호스트 상태를 비교합니다." }),
  showcase(sources.gpu, "gpu-detail", "compare-hosts", "dark", { en: "TR GPU Monitor comparison of two demo A100 hosts.", ko: "데모 A100 호스트 두 대를 비교하는 TR GPU Monitor 상세 화면." }, { en: "Compare utilization and memory details across hosts.", ko: "호스트별 사용률과 메모리 상세를 비교합니다." }),
  showcase(sources.gpu, "warning-state", "review-warning", "dark", { en: "TR GPU Monitor stale warning for a demo host with retry disabled.", ko: "재시도를 끈 데모 호스트의 오래된 상태 경고를 보여 주는 TR GPU Monitor." }, { en: "Review stale data without attempting a real connection.", ko: "실제 연결을 시도하지 않고 오래된 데이터를 확인합니다." }),
  showcase(sources.gpu, "host-overview-light", "check-hosts", "light", { en: "Light-theme TR GPU Monitor host overview.", ko: "라이트 테마의 TR GPU Monitor 호스트 개요." }, { en: "Light appearance verification of the host overview.", ko: "호스트 개요를 라이트 화면에서 확인한 모습입니다." }),

  showcase(sources.deck, "loaded-player", "open-media", "dark", { en: "ContentDeck loaded with a generated local clip and visible subtitles.", ko: "생성한 로컬 클립과 자막을 표시한 ContentDeck 재생 화면." }, { en: "Open a rights-safe local clip and confirm subtitles.", ko: "권리 안전한 로컬 클립을 열고 자막을 확인합니다." }),
  showcase(sources.deck, "segment-selection", "select-segment", "dark", { en: "ContentDeck with a 16-second segment selected from a local test clip.", ko: "로컬 테스트 클립에서 16초 구간을 선택한 ContentDeck 화면." }, { en: "Choose a short practice segment.", ko: "연습할 짧은 구간을 고릅니다." }),
  showcase(sources.deck, "active-loop", "repeat", "dark", { en: "ContentDeck repeating a selected segment with subtitles enabled.", ko: "자막을 켜고 선택 구간을 반복하는 ContentDeck 화면." }, { en: "Repeat the selected segment with subtitles visible.", ko: "자막을 보며 선택한 구간을 반복합니다." }),
  showcase(sources.deck, "active-loop-light", "repeat", "light", { en: "Light-theme ContentDeck with a selected segment repeating.", ko: "선택한 구간을 반복하는 라이트 테마 ContentDeck 화면." }, { en: "Light appearance verification of the active loop.", ko: "활성 반복 상태를 라이트 화면에서 확인한 모습입니다." })
] as const satisfies readonly ApprovedProjectShowcase[];

export function getApprovedProjectShowcase(id: string): ApprovedProjectShowcase | undefined {
  return approvedProjectShowcases.find((item) => item.id === id);
}

export function getProjectShowcases(applicationId: string, theme: ShowcaseTheme = "dark"): ApprovedProjectShowcase[] {
  return approvedProjectShowcases.filter((item) => item.applicationId === applicationId && item.theme === theme);
}
