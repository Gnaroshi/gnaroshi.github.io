import type { Locale } from "../i18n/types";
import type { ProductStatus } from "./facts/projects";

export type LocalizedScenario = {
  title: string;
  context: string;
  demoDisclosure: string;
  steps: readonly { id: string; title: string; description: string }[];
};

export type ProjectStory = {
  title: string;
  cardSummary: string;
  heroSummary: string;
  overview: string;
  audience: string;
  primaryUse: string;
  keyFeatures: readonly string[];
  privacySummary: string;
  currentState: string;
  currentLimitations: readonly string[];
  nextMilestones: readonly string[];
  technicalNotes: readonly string[];
  studioRelationship: string;
  scenario: LocalizedScenario;
  detail: Readonly<Record<string, string | readonly string[]>>;
  linkLabels: Readonly<Record<string, string>>;
};

export const productStatusLabels: Readonly<Record<Locale, Record<ProductStatus, string>>> = {
  en: { prototype:"Prototype", "in-development":"In development", "usable-locally":"Usable locally", released:"Released", archived:"Archived" },
  ko: { prototype:"프로토타입", "in-development":"개발 중", "usable-locally":"로컬에서 사용 가능", released:"배포됨", archived:"보관됨" }
};

const en = {
  "gnaroshi-vla": {
    title:"gnaroshi_vla", cardSummary:"A shared experiment workspace for configuring, checking, and comparing different VLA model integrations.",
    heroSummary:"This workspace separates model adapters, methods, environments, and result locations so a VLA run can be inspected later.",
    overview:"The project explores how much experiment structure can be shared across VLA implementations without hiding model-specific behavior.", audience:"Researchers comparing VLA implementations", primaryUse:"Configure a model and method combination, run a small check, and preserve the run context.",
    keyFeatures:["Separate model, method, environment, and experiment configuration","Small adapter boundary for Seer and SimVLA","Run manifests and environment snapshots","Explicit result directories"],
    privacySummary:"The public repository contains structure and lightweight evidence, not private datasets, credentials, or unpublished benchmark claims.", currentState:"The repository contains Seer and SimVLA integration structure, shared method modules, and run-context tools. It does not present benchmark results.",
    currentLimitations:["The common adapter boundary is still being refined.","Cross-model result comparisons need reviewed runs before publication."], nextMilestones:["Complete consistent sanity checks across adapters.","Record reviewed comparison runs without overstating their scope."],
    technicalNotes:["Python owns orchestration and adapters.","YAML keeps model, method, environment, and node choices explicit."], studioRelationship:"",
    scenario:{title:"Example experiment",context:"Configure a small example run and inspect the evidence it leaves behind.",demoDisclosure:"The shown sanity run is example evidence, not a benchmark result.",steps:[{id:"configure",title:"Choose the run",description:"Select an architecture, method, environment, and experiment configuration."},{id:"sanity-check",title:"Run a sanity check",description:"Verify composition and launch wiring with a deliberately small check."},{id:"inspect-manifest",title:"Inspect the manifest",description:"Review the resolved configuration and environment snapshot."},{id:"open-results",title:"Open the result directory",description:"Follow the explicit result path without treating unchecked output as a conclusion."}]},
    detail:{researchQuestion:"Which parts of a VLA experiment can be shared without erasing differences that matter?",approach:["Keep model-specific behavior behind explicit adapters.","Separate reusable methods from environment and launch details."],verifiedArtifact:"The public evidence shows repository structure, a real configuration, a generated run manifest, and a redacted sanity-run result.",reproducibility:["Composed configuration records every selected layer.","Run manifests and environment snapshots preserve context."],currentEvidence:"The current evidence establishes the experiment structure and a lightweight execution check only.",unknowns:["Whether the same adapter boundary remains useful across more VLA families.","Which efficiency comparisons remain fair across implementations."]}, linkLabels:{repository:"Repository"}
  },
  "gnaroshi-dev": {
    title:"gnaroshi.dev", cardSummary:"A bilingual personal research site that publishes selected writing and paper-reading notes from a separate public feed.",
    heroSummary:"Private authoring stays outside the website. The static Astro site validates and renders only the public projection, then records exactly what was deployed.",
    overview:"The system separates private paper and writing sources, local publishing tools, a sanitized public feed, and the replaceable presentation site.", audience:"Readers of the public site and the person maintaining it", primaryUse:"Publish reviewed public material without moving private drafts into the website repository.",
    keyFeatures:["English and Korean routes","Public-feed validation","Evidence-gated navigation and metrics","Exact GitHub Pages build provenance"],
    privacySummary:"The website workflow never checks out private paper or writing repositories and receives no cross-repository secret.", currentState:"The site builds from the public content feed, deploys through GitHub Actions, and verifies the live website and feed commits.",
    currentLimitations:["Public writing and reading sections stay intentionally sparse until reviewed records are published."], nextMilestones:["Publish the first reviewed writing and paper-reading note.","Keep public navigation useful as the feed grows."],
    technicalNotes:["Astro produces a static site with minimal client islands.","Playwright, link, localization, media, and feed-contract checks gate deployment."], studioRelationship:"Studio prepares and publishes the feed; it does not write the website repository.",
    scenario:{title:"Example publication flow",context:"Follow one reviewed record from private editing to the verified public build.",demoDisclosure:"The workflow uses illustrative repository states and does not expose private content.",steps:[{id:"write-private",title:"Write privately",description:"Edit the canonical record in its private source repository."},{id:"preview-fields",title:"Preview public fields",description:"Select and review only the fields intended for the public feed."},{id:"publish-feed",title:"Publish the feed",description:"Build, validate, diff, and push the sanitized public projection."},{id:"verify-deploy",title:"Verify the site",description:"Confirm build-info.json matches the expected website and feed commits."}]},
    detail:{problem:"A public website should not become the storage location for unfinished research notes and drafts.",publicWorkflow:["Private sources are checkpointed separately.","The publisher creates a deterministic public feed.","The website validates, builds, deploys, and verifies the exact feed commit."],repositoryBoundaries:["Paper Lab and Writing own private source files.","Studio owns authoring and publishing.","Content Feed owns generated public records.","gnaroshi.dev owns presentation only."],deploymentVerification:["GitHub Actions builds the static artifact.","The deployed build-info record is compared with the expected commits."]}, linkLabels:{repository:"Repository","live-site":"Live site"}
  },
  "gnaroshi-studio": {
    title:"Gnaroshi Studio", cardSummary:"A local macOS workspace for research authoring, Git checkpoints, public previews, and explicit publishing.",
    heroSummary:"Studio keeps paper notes and writing in their owning repositories while coordinating review, checkpoint, and publish steps from one local app.",
    overview:"The app combines a Tauri desktop interface and shared CLI packages around the same contracts. Saving, committing, and publishing remain separate actions.", audience:"A local research and writing workflow", primaryUse:"Review work, checkpoint source repositories, preview the public diff, and publish only after confirmation.",
    keyFeatures:["Local paper and writing editors","Managed Apps availability and health checks","Separate Git checkpoints","Preview-first public feed publishing","Deployment monitoring and provenance verification"],
    privacySummary:"New records are private by default. Tokens are not stored in app data, and showcase screens contain only deterministic example records.", currentState:"Authoring, repository checkpoints, public preview, feed publishing, deployment monitoring, and Managed Apps foundations are implemented for local development.",
    currentLimitations:["Distributed macOS signing and notarization are not configured.","Several managed-app provider releases remain under review."], nextMilestones:["Complete signed distribution decisions.","Finish provider compatibility checks before advertising more managed actions."],
    technicalNotes:["React and TypeScript render the Tauri desktop UI.","Rust commands and shared packages keep filesystem, Git, and publishing boundaries typed.","The private repository URL is intentionally not public."], studioRelationship:"Studio is the control plane; each companion app still owns its data and full workflow.",
    scenario:{title:"Example workflow",context:"Review companion apps and one paper candidate without publishing it.",demoDisclosure:"All candidate titles and app activity in these screenshots are deterministic example data.",steps:[{id:"review-apps",title:"Review managed apps",description:"Confirm PaperFlow and Arxiv Discovery are available before starting a handoff."},{id:"review-candidates",title:"Inspect candidates",description:"Review a small list of clearly labeled example paper metadata."},{id:"preview-handoff",title:"Preview the handoff",description:"Check exactly which public metadata would be sent to PaperFlow."},{id:"checkpoint-preview",title:"Inspect the checkpoint",description:"Review the pending local change and stop before commit or publication."}]},
    detail:{}, linkLabels:{}
  },
  paperflow: {
    title:"PaperFlow", cardSummary:"A macOS app and Python CLI for scanning Zotero read-only and reviewing organization plans before apply.",
    heroSummary:"PaperFlow separates library inspection and planning from the explicit write boundary, so proposed collection and duplicate changes can be reviewed first.",
    overview:"The CLI owns Zotero parsing and safety rules. The SwiftUI app presents scan, plan, report, import, and review workflows without rewriting those rules.", audience:"People maintaining a local Zotero paper library", primaryUse:"Scan, generate an organization plan, inspect every proposed change, and decide whether to apply it.",
    keyFeatures:["Read-only Zotero Local API scan","Organization and duplicate plans","Dry-run reports","Explicit confirmation before supported writes","Local PDF vault workflows"],
    privacySummary:"Showcase mode never opens a real Zotero library. Normal credentials stay in Keychain and are redacted from logs.", currentState:"Scanning, planning, reports, import previews, and local vault workflows work locally. Studio handoff contracts remain under review.",
    currentLimitations:["Final packaged-app and appearance checks remain.","Write-capable workflows still require careful manual review."], nextMilestones:["Complete packaged macOS verification.","Keep apply confirmations visible as integrations mature."],
    technicalNotes:["Python is the canonical planning engine.","SwiftUI and AppKit provide the macOS interface.","Zotero remains the owner of library metadata."], studioRelationship:"Studio may open PaperFlow or preview a selected-paper handoff. PaperFlow alone owns Zotero access and apply decisions.",
    scenario:{title:"Example workflow",context:"Plan a deterministic synthetic library reorganization without writing to Zotero.",demoDisclosure:"The library counts and proposed changes are example data; no real Zotero library is opened.",steps:[{id:"scan-library",title:"Scan read-only",description:"Inspect a synthetic library through the same read-only workflow."},{id:"generate-plan",title:"Generate a plan",description:"Prepare collection moves and duplicate groups without applying them."},{id:"review-changes",title:"Review each proposal",description:"Check scope and records before any write-capable action."},{id:"stop-before-apply",title:"Stop at apply",description:"Keep the apply control disabled in showcase mode and preserve the explicit boundary."}]}, detail:{}, linkLabels:{repository:"Repository"}
  },
  "arxiv-discovery": {
    title:"Arxiv Discovery", cardSummary:"A native macOS app for finding recent arXiv papers, narrowing candidates, and choosing when to save, translate, or download.",
    heroSummary:"Arxiv Discovery keeps recent-paper discovery, candidate review, and explicit follow-up actions in one local macOS window.",
    overview:"The SwiftUI app fetches public arXiv metadata directly and keeps review state on the Mac. The Python CLI remains as a compatibility path without running a local web server.", audience:"People reviewing recent arXiv candidates", primaryUse:"Find papers from the last one, three, or seven days, inspect one candidate, and choose the next action explicitly.",
    keyFeatures:["One-, three-, and seven-day discovery windows","Subject filters and local search","Saved-paper metadata","Explicit PDF download","Optional per-paper Korean translation with a Keychain-stored API key","Legacy JSON import"],
    privacySummary:"Public arXiv metadata and saved state remain local. Gemini receives only a selected public title and abstract after an explicit translation action; its API key stays in Keychain, and PDFs are never downloaded automatically.", currentState:"The native app is built, Developer ID signed, installed in Applications, discoverable through Spotlight, and verified against live public arXiv metadata. Its read-only integration helper reports only safe counts and freshness.",
    currentLimitations:["A native showcase capture still needs explicit owner approval.","The candidate handoff contract and a notarized public release are not complete."], nextMilestones:["Review a native macOS capture for public use.","Define the candidate handoff schema and prepare a notarized tagged release."],
    technicalNotes:["SwiftUI provides the native macOS interface and talks to arXiv directly.","Application Support JSON stores local paper metadata and preferences.","Python remains a CLI compatibility layer, while a fixed status helper exposes safe read-only integration state."], studioRelationship:"Studio may discover, open, and read safe counts or freshness from Arxiv Discovery. Abstracts, credentials, PDF downloads, translation, and saved-paper ownership remain inside the app.",
    scenario:{title:"Review recent candidates",context:"Move from a time window to one paper while keeping save, translation, and download choices explicit.",demoDisclosure:"This workflow describes the product flow; it does not present activity counts or paper results as personal research.",steps:[{id:"choose-window",title:"Choose a time window",description:"Select the last one, three, or seven days and the relevant arXiv subjects."},{id:"discover",title:"Discover candidates",description:"Fetch public metadata and narrow the results with filters or search."},{id:"inspect-candidate",title:"Inspect one paper",description:"Read the title, authors, abstract, subjects, and source link in the detail pane."},{id:"save-or-act",title:"Choose the next action",description:"Save the metadata or explicitly request translation, the source page, or a PDF."}]}, detail:{}, linkLabels:{repository:"Repository"}
  },
  runshelf: {
    title:"RunShelf", cardSummary:"A local experiment ledger for finding runs, inspecting failures, and keeping large artifacts at their source.",
    heroSummary:"RunShelf brings configuration, source context, selected metrics, and artifact references together without copying checkpoints into another service.",
    overview:"The macOS app and Python package treat files as the source of truth. Run records remain inspectable without requiring a cloud backend.", audience:"Researchers revisiting local and remote experiment records", primaryUse:"Find a failed run, inspect its context, and follow references back to the original artifacts.",
    keyFeatures:["Completed, running, and failed run states","Configuration and source context","Selected metric summaries","External artifact references","Local file-backed records"],
    privacySummary:"The approved screenshots use Example data and reference:// identifiers. The private repository URL and real remote paths are omitted.", currentState:"Run records, metadata, metrics, ideas, and artifact references are available in the standalone local app. Studio summaries remain under review.",
    currentLimitations:["A stable selected-run route is not yet available for Studio.","Distribution and app identity still need final review."], nextMilestones:["Add a stable selected-run route.","Complete local distribution checks."],
    technicalNotes:["Python owns the file-backed run model and CLI.","SwiftUI presents the macOS browser.","Checkpoints remain references rather than copied assets."], studioRelationship:"Studio may show a compact recent-run summary and open RunShelf; it does not own run indexing.",
    scenario:{title:"Example workflow",context:"Use an example workspace to inspect one failed run without exposing remote infrastructure.",demoDisclosure:"Run names, commits, metrics, and reference URIs are deterministic example data.",steps:[{id:"open-runs",title:"Open the run list",description:"Compare completed, running, and failed example records."},{id:"filter-failed",title:"Choose the failure",description:"Focus on one failed run that needs inspection."},{id:"inspect-context",title:"Review run context",description:"Check configuration, example source commit, and selected metrics."},{id:"review-references",title:"Follow references",description:"Inspect privacy-safe artifact references without copying a checkpoint."}]}, detail:{}, linkLabels:{}
  },
  "tr-gpu-monitor": {
    title:"TR GPU Monitor", cardSummary:"A macOS monitor for comparing remote NVIDIA GPU hosts while keeping SSH details inside the app.",
    heroSummary:"The monitor makes availability, memory pressure, stale data, and detailed GPU state visible without exposing host credentials to another application.",
    overview:"The SwiftUI app polls configured hosts, owns notifications and persistence, and can provide a sanitized summary to Studio after compatibility review.", audience:"People checking remote GPU capacity before starting a run", primaryUse:"Compare hosts, identify memory pressure, and open detailed state before training.",
    keyFeatures:["Multi-host availability overview","GPU utilization and memory detail","Stale and unreachable states","Local notifications","Sanitized summary boundary"],
    privacySummary:"The approved scenario uses demo-gpu-01 through demo-gpu-03. It contains no SSH configuration, username, hostname, process argument, or credential.", currentState:"Standalone host monitoring, GPU detail, persistence, notifications, and error states work locally. Studio status sharing remains under review.",
    currentLimitations:["A full local Xcode build requires selecting the complete Xcode developer directory.","Final package and menu-bar identity checks remain."], nextMilestones:["Complete full Xcode and packaged-app verification.","Review the sanitized provider contract with Studio."],
    technicalNotes:["SwiftUI owns the presentation layer.","SQLite or UserDefaults can store local state.","SSH credentials and detailed processes remain inside the monitor."], studioRelationship:"Studio may receive a short sanitized summary and open the monitor; it never receives SSH credentials or full process arguments.",
    scenario:{title:"Example workflow",context:"Compare three synthetic hosts before choosing capacity for a training run.",demoDisclosure:"All host names, GPU values, and warning timestamps are deterministic example data.",steps:[{id:"check-hosts",title:"Check the overview",description:"See one available host, one high-memory host, and one stale host."},{id:"spot-pressure",title:"Find memory pressure",description:"Identify demo-gpu-02 before starting another workload."},{id:"compare-hosts",title:"Compare details",description:"Review utilization and memory for two synthetic A100 hosts."},{id:"review-warning",title:"Inspect the stale state",description:"Confirm the unreachable warning without attempting a real connection."}]}, detail:{}, linkLabels:{}
  },
  contentdeck: {
    title:"ContentDeck", cardSummary:"A web and Electron player for subtitle-based practice with full or selected-segment repeat.",
    heroSummary:"ContentDeck keeps provider detection, subtitles, segment boundaries, and repeat state in one focused playback workspace.",
    overview:"The React interface supports web and Electron execution. A local service handles bounded media resolution while remote pages stay outside Node and shell access.", audience:"People practicing short passages from supported media", primaryUse:"Open rights-safe media, confirm subtitles, select a short segment, and repeat it.",
    keyFeatures:["Provider detection","Subtitle display","Full and segment repeat","Saved segment context","Web and Electron modes"],
    privacySummary:"The approved scenario uses a generated local clip with synthetic audio. It includes no commercial frame, user history, remote URL, or credential.", currentState:"Provider detection, full and segment repeat, subtitle handling, web mode, and Electron mode are implemented locally.",
    currentLimitations:["The packaged Electron app still needs a complete local verification pass.","Provider behavior depends on the source and available subtitle metadata."], nextMilestones:["Complete packaged Electron verification.","Keep provider failures and subtitle availability explicit."],
    technicalNotes:["React and TypeScript share the player state.","Electron provides the local desktop shell.","Vite builds the web renderer; the bounded local service uses Fastify."], studioRelationship:"Studio may open a validated media URL in ContentDeck, but playback and subtitle state remain in ContentDeck.",
    scenario:{title:"Example workflow",context:"Practice one short segment from a generated rights-safe local clip.",demoDisclosure:"The clip, audio, subtitles, and session values are generated example data.",steps:[{id:"open-media",title:"Open the media",description:"Load a local rights-safe test clip without a network request."},{id:"confirm-subtitles",title:"Confirm subtitles",description:"Check that the subtitle track is visible during playback."},{id:"select-segment",title:"Select 16 seconds",description:"Mark a short 00:12–00:28 practice segment."},{id:"repeat",title:"Enable repeat",description:"Loop the selected segment while keeping the subtitle visible."}]}, detail:{}, linkLabels:{repository:"Repository"}
  }
} satisfies Record<string, ProjectStory>;

const ko: Record<keyof typeof en, ProjectStory> = {
  "gnaroshi-vla": {
    ...en["gnaroshi-vla"],
    title: "gnaroshi_vla",
    cardSummary: "서로 다른 VLA 모델을 한 실험 구조에서 설정하고 점검하며 비교하기 위한 작업 공간입니다.",
    heroSummary: "모델 어댑터와 방법, 환경, 결과 위치를 나눠 VLA 실행 맥락을 나중에도 다시 확인할 수 있게 합니다.",
    overview: "모델마다 다른 동작을 감추지 않으면서 VLA 실험 구조를 어디까지 함께 쓸 수 있는지 살펴보는 프로젝트입니다.",
    audience: "VLA 구현을 비교하는 연구자",
    primaryUse: "모델과 방법을 설정하고 작은 점검을 실행한 뒤 실행 맥락을 남깁니다.",
    keyFeatures: ["모델·방법·환경·실험 설정 분리", "Seer와 SimVLA용 어댑터 경계", "실행 매니페스트와 환경 스냅샷", "명확한 결과 디렉터리"],
    privacySummary: "공개 저장소에는 구조와 가벼운 검증 자료만 있습니다. 비공개 데이터셋, 인증 정보, 검토하지 않은 벤치마크 주장은 포함하지 않습니다.",
    currentState: "Seer와 SimVLA 연결 구조, 공통 방법 모듈, 실행 맥락 도구가 있습니다. 벤치마크 결과는 공개하지 않습니다.",
    currentLimitations: ["공통 어댑터 경계를 계속 다듬고 있습니다.", "모델 간 비교 결과는 검토한 실행이 쌓인 뒤 공개해야 합니다."],
    nextMilestones: ["어댑터별 기본 동작 점검을 같은 기준으로 맞춥니다.", "범위를 과장하지 않는 비교 기록을 남깁니다."],
    technicalNotes: ["Python이 실행 조정과 어댑터를 담당합니다.", "YAML에 모델, 방법, 환경, 노드 선택을 명시합니다."],
    scenario: { title: "작은 실행 점검", context: "작은 실행을 설정하고 어떤 근거가 남는지 확인합니다.", demoDisclosure: "표시된 기본 동작 점검은 설명용 검증 자료이며 벤치마크 결과가 아닙니다.", steps: [
      { id: "configure", title: "실행 조건 선택", description: "아키텍처와 방법, 환경, 실험 설정을 고릅니다." },
      { id: "sanity-check", title: "작은 점검 실행", description: "설정 조합과 실행 연결이 맞는지 작은 실행으로 확인합니다." },
      { id: "inspect-manifest", title: "매니페스트 확인", description: "해석된 설정과 환경 스냅샷을 살펴봅니다." },
      { id: "open-results", title: "결과 위치 열기", description: "결과 경로를 확인하되 검토하지 않은 출력을 결론으로 다루지 않습니다." }
    ] },
    detail: { researchQuestion: "중요한 모델 차이를 지우지 않으면서 VLA 실험의 어느 부분까지 함께 쓸 수 있을까?", approach: ["모델별 동작은 명시적인 어댑터 뒤에 둡니다.", "재사용할 방법과 환경·실행 세부사항을 나눕니다."], verifiedArtifact: "공개 검증 자료에는 저장소 구조와 실제 설정, 생성된 실행 매니페스트, 경로를 가린 기본 동작 점검 결과가 있습니다.", reproducibility: ["조합된 설정이 선택한 계층을 모두 기록합니다.", "실행 매니페스트와 환경 스냅샷이 실행 맥락을 보존합니다."], currentEvidence: "현재 근거는 실험 구조와 가벼운 실행 점검까지만 보여 줍니다.", unknowns: ["더 많은 VLA 계열에서도 같은 어댑터 경계가 유용한지는 아직 알 수 없습니다.", "구현마다 공정한 효율 비교 기준을 더 확인해야 합니다."] },
    linkLabels: { repository: "저장소" }
  },
  "gnaroshi-dev": {
    ...en["gnaroshi-dev"],
    title: "gnaroshi.dev",
    cardSummary: "선택한 글과 논문 읽기 기록만 별도 공개 피드에서 가져오는 한·영 개인 연구 사이트입니다.",
    heroSummary: "비공개 작성 자료는 웹사이트 밖에 둡니다. Astro 사이트는 공개용 자료만 검증해 표시하고 실제 배포 상태를 기록합니다.",
    overview: "비공개 논문·글 저장소, 로컬 발행 도구, 정제된 공개 피드, 표시 계층을 역할별로 나눈 구조입니다.",
    audience: "공개 사이트 독자와 사이트를 관리하는 사람",
    primaryUse: "비공개 초안을 웹사이트 저장소로 옮기지 않고 검토한 내용만 공개합니다.",
    keyFeatures: ["영문·국문 경로", "공개 피드 검증", "근거가 있을 때만 보이는 탐색과 지표", "GitHub Pages 배포 출처 기록"],
    privacySummary: "웹사이트 빌드는 비공개 논문·글 저장소를 체크아웃하지 않으며 저장소 간 비밀 정보도 받지 않습니다.",
    currentState: "공개 콘텐츠 피드로 빌드하고 GitHub Actions로 배포하며 실제 웹사이트와 피드 커밋을 확인합니다.",
    currentLimitations: ["검토한 기록이 공개되기 전까지 글과 논문 읽기 영역은 의도적으로 작게 유지됩니다."],
    nextMilestones: ["검토한 첫 글과 논문 읽기 기록을 공개합니다.", "공개 자료가 늘어도 탐색을 단순하게 유지합니다."],
    technicalNotes: ["Astro가 클라이언트 자바스크립트를 최소화한 정적 사이트를 만듭니다.", "Playwright, 링크, 번역, 미디어, 피드 계약 검사가 배포 전에 실행됩니다."],
    studioRelationship: "Studio가 공개 피드를 준비하고 발행하지만 웹사이트 저장소를 직접 쓰지는 않습니다.",
    scenario: { title: "공개까지의 흐름", context: "검토한 기록 하나가 비공개 작성에서 배포 확인까지 가는 과정을 봅니다.", demoDisclosure: "설명용 저장소 상태를 사용하며 비공개 내용은 노출하지 않습니다.", steps: [
      { id: "write-private", title: "비공개로 작성", description: "원본 기록을 역할에 맞는 비공개 저장소에서 편집합니다." },
      { id: "preview-fields", title: "공개 항목 확인", description: "공개 피드에 넣을 항목만 골라 다시 확인합니다." },
      { id: "publish-feed", title: "피드 발행", description: "정제한 공개 자료를 만들고 검증한 뒤 차이를 확인해 푸시합니다." },
      { id: "verify-deploy", title: "사이트 확인", description: "build-info.json의 웹사이트와 피드 커밋이 예상값과 같은지 확인합니다." }
    ] },
    detail: { problem: "공개 웹사이트가 미완성 기록과 초안의 저장소가 되어서는 안 됩니다.", publicWorkflow: ["비공개 원본 저장소를 따로 체크포인트합니다.", "발행 도구가 같은 입력에서 같은 공개 피드를 만듭니다.", "웹사이트가 피드를 검증하고 빌드한 뒤 배포 결과를 확인합니다."], repositoryBoundaries: ["Paper Lab과 Writing이 비공개 원본을 소유합니다.", "Studio가 작성과 발행을 맡습니다.", "Content Feed가 생성된 공개 기록을 소유합니다.", "gnaroshi.dev는 표시만 맡습니다."], deploymentVerification: ["GitHub Actions가 정적 결과물을 만듭니다.", "배포된 build-info와 예상 커밋을 비교합니다."] },
    linkLabels: { repository: "저장소", "live-site": "사이트" }
  },
  "gnaroshi-studio": {
    ...en["gnaroshi-studio"],
    cardSummary: "연구 기록 작성과 Git 체크포인트, 공개 미리보기, 명시적 발행을 한곳에서 다루는 로컬 macOS 작업 공간입니다.",
    heroSummary: "논문 기록과 글은 역할에 맞는 저장소에 둔 채, 검토와 체크포인트, 발행 단계를 하나의 로컬 앱에서 조정합니다.",
    overview: "Tauri 데스크톱 UI와 CLI 패키지가 같은 계약을 사용합니다. 저장, 커밋, 발행은 서로 다른 동작으로 유지됩니다.",
    audience: "로컬 연구·글쓰기 작업 흐름을 관리하는 사람",
    primaryUse: "작업을 검토하고 원본 저장소를 체크포인트한 뒤 공개 차이를 확인해 명시적으로 발행합니다.",
    keyFeatures: ["로컬 논문·글 편집", "관리 앱 상태 확인", "분리된 Git 체크포인트", "공개 피드 미리보기와 발행", "배포 상태와 출처 확인"],
    privacySummary: "새 기록은 기본적으로 비공개입니다. 토큰을 앱 데이터에 저장하지 않으며 시연 화면에는 정해진 설명용 기록만 사용합니다.",
    currentState: "로컬 개발 환경에서 작성, 저장소 체크포인트, 공개 미리보기, 피드 발행, 배포 확인, 관리 앱 기반 기능을 사용할 수 있습니다.",
    currentLimitations: ["배포용 macOS 서명과 공증은 아직 설정하지 않았습니다.", "일부 관리 앱 연결은 배포 전 검토가 더 필요합니다."],
    nextMilestones: ["서명된 배포 방식을 결정합니다.", "관리 동작을 늘리기 전에 앱 연결 호환성을 확인합니다."],
    technicalNotes: ["React와 TypeScript가 Tauri 데스크톱 UI를 표시합니다.", "Rust 명령과 공통 패키지가 파일, Git, 발행 경계를 형식이 정해진 계약으로 유지합니다.", "비공개 저장소 URL은 공개하지 않습니다."],
    studioRelationship: "Studio는 조정 역할만 하며 보조 앱은 자체 데이터와 전체 작업 흐름을 계속 소유합니다.",
    scenario: { title: "후보를 검토하는 흐름", context: "발행하지 않은 채 보조 앱과 논문 후보 하나를 검토합니다.", demoDisclosure: "화면의 후보 제목과 앱 활동은 모두 정해진 설명용 데이터입니다.", steps: [
      { id: "review-apps", title: "관리 앱 확인", description: "전달을 시작하기 전에 PaperFlow와 Arxiv Discovery를 쓸 수 있는지 봅니다." },
      { id: "review-candidates", title: "후보 살펴보기", description: "설명용으로 표시된 소수의 논문 메타데이터를 확인합니다." },
      { id: "preview-handoff", title: "전달 미리보기", description: "PaperFlow로 넘길 공개 메타데이터 범위를 확인합니다." },
      { id: "checkpoint-preview", title: "체크포인트 확인", description: "보류 중인 로컬 변경을 보고 커밋이나 발행 전에 멈춥니다." }
    ] },
    detail: {},
    linkLabels: {}
  },
  paperflow: {
    ...en.paperflow,
    cardSummary: "Zotero를 읽기 전용으로 살피고 적용 전에 정리 계획을 검토하는 macOS 앱과 Python CLI입니다.",
    heroSummary: "라이브러리 확인과 계획을 실제 쓰기 단계에서 분리해 컬렉션 이동과 중복 제안을 먼저 검토할 수 있게 합니다.",
    overview: "CLI가 Zotero 분석과 안전 규칙을 담당하고 SwiftUI 앱이 스캔, 계획, 보고서, 가져오기 검토 흐름을 보여 줍니다.",
    audience: "로컬 Zotero 논문 라이브러리를 관리하는 사람",
    primaryUse: "라이브러리를 살펴보고 정리 계획을 만든 뒤 모든 제안을 확인해 적용 여부를 결정합니다.",
    keyFeatures: ["Zotero Local API 읽기 전용 스캔", "정리·중복 계획", "시험 실행 보고서", "지원되는 쓰기 전 명시적 확인", "로컬 PDF 보관함 흐름"],
    privacySummary: "시연 모드는 실제 Zotero 라이브러리를 열지 않습니다. 일반 실행의 인증 정보는 Keychain에 두고 로그에서 가립니다.",
    currentState: "스캔, 계획, 보고서, 가져오기 미리보기, 로컬 보관함 흐름이 로컬에서 작동합니다. Studio 전달 계약은 검토 중입니다.",
    currentLimitations: ["최종 패키지 앱과 화면 모양 확인이 남았습니다.", "쓰기가 가능한 흐름은 계속 수동 검토가 필요합니다."],
    nextMilestones: ["패키지된 macOS 앱을 확인합니다.", "연결이 늘어도 적용 확인을 눈에 띄게 유지합니다."],
    technicalNotes: ["Python이 정리 계획의 기준 구현입니다.", "SwiftUI와 AppKit이 macOS 인터페이스를 제공합니다.", "라이브러리 메타데이터의 소유자는 Zotero입니다."],
    studioRelationship: "Studio는 PaperFlow를 열거나 선택한 논문 전달을 미리 볼 수 있습니다. Zotero 접근과 적용 판단은 PaperFlow만 맡습니다.",
    scenario: { title: "정리 계획을 검토하는 흐름", context: "합성 라이브러리의 정리 계획을 만들되 Zotero에는 쓰지 않습니다.", demoDisclosure: "라이브러리 수와 변경 제안은 설명용 데이터이며 실제 Zotero 라이브러리를 열지 않습니다.", steps: [
      { id: "scan-library", title: "읽기 전용 스캔", description: "같은 읽기 전용 흐름으로 합성 라이브러리를 살펴봅니다." },
      { id: "generate-plan", title: "계획 만들기", description: "적용하지 않고 컬렉션 이동과 중복 그룹을 준비합니다." },
      { id: "review-changes", title: "제안 확인", description: "쓰기가 가능한 동작 전에 범위와 항목을 확인합니다." },
      { id: "stop-before-apply", title: "적용 전에 멈추기", description: "시연 모드에서는 적용을 끄고 명시적 경계를 유지합니다." }
    ] },
    detail: {},
    linkLabels: { repository: "저장소" }
  },
  "arxiv-discovery": {
    ...en["arxiv-discovery"],
    cardSummary: "최근 arXiv 논문을 찾고 후보를 좁힌 뒤 저장·번역·다운로드 시점을 직접 고르는 네이티브 macOS 앱입니다.",
    heroSummary: "최근 논문 탐색과 후보 검토, 명시적인 후속 동작을 하나의 로컬 macOS 창에 모았습니다.",
    overview: "SwiftUI 앱이 공개 arXiv 메타데이터를 직접 가져오고 검토 상태를 Mac에 보관합니다. Python CLI는 로컬 웹 서버 없이 호환 경로로 남아 있습니다.",
    audience: "최근 arXiv 후보를 검토하는 사람",
    primaryUse: "최근 1일·3일·7일 범위에서 논문을 찾고 후보 하나를 살핀 뒤 다음 동작을 직접 선택합니다.",
    keyFeatures: ["1일·3일·7일 탐색 범위", "주제 필터와 로컬 검색", "논문 메타데이터 저장", "명시적 PDF 다운로드", "키체인 API 키를 쓰는 논문별 한국어 번역", "기존 JSON 가져오기"],
    privacySummary: "공개 arXiv 메타데이터와 저장 상태는 로컬에 남습니다. Gemini에는 번역을 직접 요청한 공개 제목과 초록만 전달하며 API 키는 키체인에 보관하고 PDF는 자동으로 받지 않습니다.",
    currentState: "네이티브 앱을 빌드하고 Developer ID로 서명해 응용 프로그램에 설치했으며 Spotlight와 실제 공개 arXiv 메타데이터로 확인했습니다. 읽기 전용 연동 도우미는 안전한 개수와 최신 시각만 반환합니다.",
    currentLimitations: ["네이티브 공개 화면은 소유자 승인이 아직 필요합니다.", "후보 전달 계약과 공증된 공개 릴리스는 아직 완성되지 않았습니다."],
    nextMilestones: ["네이티브 macOS 캡처의 공개 사용 여부를 검토합니다.", "후보 전달 스키마를 정하고 공증된 태그 릴리스를 준비합니다."],
    technicalNotes: ["SwiftUI가 네이티브 macOS 화면을 제공하고 arXiv와 직접 통신합니다.", "Application Support의 JSON에 로컬 논문 메타데이터와 환경설정을 보관합니다.", "Python은 CLI 호환 계층으로 남고 고정된 상태 도우미는 안전한 읽기 전용 연동 상태만 제공합니다."],
    studioRelationship: "Studio는 Arxiv Discovery를 찾고 열며 안전한 개수와 최신 시각만 읽을 수 있습니다. 초록, 자격 증명, PDF 다운로드, 번역, 저장 논문의 소유권은 앱 안에 남습니다.",
    scenario: { title: "최근 후보 검토", context: "탐색 기간에서 논문 하나까지 이동하며 저장·번역·다운로드를 각각 직접 선택합니다.", demoDisclosure: "이 흐름은 제품 사용 순서를 설명하며 활동 수나 논문 결과를 개인 연구 성과로 제시하지 않습니다.", steps: [
      { id: "choose-window", title: "탐색 기간 선택", description: "최근 1일·3일·7일과 필요한 arXiv 주제를 고릅니다." },
      { id: "discover", title: "후보 찾기", description: "공개 메타데이터를 가져와 필터나 검색으로 목록을 좁힙니다." },
      { id: "inspect-candidate", title: "논문 하나 확인", description: "상세 영역에서 제목, 저자, 초록, 주제, 원문 링크를 읽습니다." },
      { id: "save-or-act", title: "다음 동작 선택", description: "메타데이터를 저장하거나 번역, 원문 페이지, PDF를 명시적으로 요청합니다." }
    ] },
    detail: {},
    linkLabels: { repository: "저장소" }
  },
  runshelf: {
    ...en.runshelf,
    cardSummary: "실험 기록을 찾고 실패 원인을 살피며 큰 결과물은 원래 위치에 두는 로컬 실험 원장입니다.",
    heroSummary: "체크포인트를 다른 서비스로 복사하지 않고 설정과 소스 맥락, 일부 지표, 결과물 참조를 함께 보여 줍니다.",
    overview: "macOS 앱과 Python 패키지가 파일을 원본으로 사용합니다. 클라우드 백엔드 없이도 실행 기록을 살펴볼 수 있습니다.",
    audience: "로컬·원격 실험 기록을 다시 살펴보는 연구자",
    primaryUse: "실패한 실행을 찾고 맥락을 확인한 뒤 원래 결과물 참조를 따라갑니다.",
    keyFeatures: ["완료·실행 중·실패 상태", "설정과 소스 맥락", "일부 지표 요약", "외부 결과물 참조", "파일 기반 로컬 기록"],
    privacySummary: "승인된 화면은 설명용 데이터와 reference:// 식별자를 사용합니다. 비공개 저장소 URL과 실제 원격 경로는 표시하지 않습니다.",
    currentState: "독립 로컬 앱에서 실행 기록과 메타데이터, 지표, 아이디어, 결과물 참조를 볼 수 있습니다. Studio 요약은 검토 중입니다.",
    currentLimitations: ["Studio가 쓸 안정적인 선택 실행 경로가 아직 없습니다.", "배포와 앱 식별 정보 검토가 남았습니다."],
    nextMilestones: ["안정적인 선택 실행 경로를 추가합니다.", "로컬 배포 확인을 마칩니다."],
    technicalNotes: ["Python이 파일 기반 실행 모델과 CLI를 맡습니다.", "SwiftUI가 macOS 탐색 화면을 표시합니다.", "체크포인트는 복사하지 않고 참조로 남깁니다."],
    studioRelationship: "Studio는 최근 실행 요약을 보여 주고 RunShelf를 열 수 있지만 실행 색인은 소유하지 않습니다.",
    scenario: { title: "실패한 실행 살펴보기", context: "원격 환경을 드러내지 않고 설명용 작업 공간의 실패 실행 하나를 살펴봅니다.", demoDisclosure: "실행 이름과 커밋, 지표, 참조 URI는 모두 정해진 설명용 데이터입니다.", steps: [
      { id: "open-runs", title: "실행 목록 열기", description: "완료, 실행 중, 실패 기록을 비교합니다." },
      { id: "filter-failed", title: "실패 실행 선택", description: "확인이 필요한 실패 기록 하나에 집중합니다." },
      { id: "inspect-context", title: "실행 맥락 확인", description: "설정과 설명용 소스 커밋, 일부 지표를 봅니다." },
      { id: "review-references", title: "참조 확인", description: "체크포인트를 복사하지 않고 민감한 경로를 가린 결과물 참조를 살펴봅니다." }
    ] },
    detail: {},
    linkLabels: {}
  },
  "tr-gpu-monitor": {
    ...en["tr-gpu-monitor"],
    cardSummary: "SSH 세부 정보는 앱 안에 둔 채 원격 NVIDIA GPU 호스트를 비교하는 macOS 모니터입니다.",
    heroSummary: "다른 앱에 호스트 인증 정보를 넘기지 않고 사용 가능 상태와 메모리 압박, 오래된 데이터, GPU 상세를 확인합니다.",
    overview: "SwiftUI 앱이 설정한 호스트를 주기적으로 확인하고 알림과 상태 저장을 맡습니다. 호환성 확인 뒤 Studio에는 정제된 요약만 전달할 수 있습니다.",
    audience: "학습 전에 원격 GPU 여유를 확인하는 사람",
    primaryUse: "호스트를 비교하고 메모리 압박을 찾아 학습 전 상세 상태를 확인합니다.",
    keyFeatures: ["여러 호스트 상태 요약", "GPU 사용률·메모리 상세", "오래됨·연결 불가 상태", "로컬 알림", "정제된 요약 경계"],
    privacySummary: "승인된 흐름은 demo-gpu-01부터 03까지 사용합니다. SSH 설정, 사용자 이름, 실제 호스트 이름, 프로세스 인자, 인증 정보는 없습니다.",
    currentState: "독립 앱의 호스트 모니터링, GPU 상세, 상태 저장, 알림, 오류 상태가 로컬에서 작동합니다. Studio 상태 공유는 검토 중입니다.",
    currentLimitations: ["전체 Xcode 개발자 디렉터리를 선택해야 완전한 로컬 Xcode 빌드를 확인할 수 있습니다.", "최종 패키지와 메뉴 막대 식별 정보 확인이 남았습니다."],
    nextMilestones: ["전체 Xcode·패키지 앱을 확인합니다.", "Studio와 정제된 상태 계약을 검토합니다."],
    technicalNotes: ["SwiftUI가 화면을 담당합니다.", "SQLite 또는 UserDefaults에 로컬 상태를 저장합니다.", "SSH 인증 정보와 자세한 프로세스는 모니터 안에 둡니다."],
    studioRelationship: "Studio는 짧은 정제 요약을 받고 모니터를 열 수 있지만 SSH 인증 정보와 전체 프로세스 인자는 받지 않습니다.",
    scenario: { title: "GPU 호스트 비교", context: "학습에 쓸 여유를 고르기 전에 합성 호스트 세 대를 비교합니다.", demoDisclosure: "호스트 이름과 GPU 값, 경고 시간은 모두 정해진 설명용 데이터입니다.", steps: [
      { id: "check-hosts", title: "전체 상태 확인", description: "사용 가능, 메모리 사용 높음, 오래됨 상태를 각각 봅니다." },
      { id: "spot-pressure", title: "메모리 압박 찾기", description: "새 작업을 시작하기 전에 demo-gpu-02를 확인합니다." },
      { id: "compare-hosts", title: "호스트 상세 비교", description: "합성 A100 호스트 두 대의 사용률과 메모리를 비교합니다." },
      { id: "review-warning", title: "오래된 상태 확인", description: "실제 연결을 시도하지 않고 연결 불가 경고를 봅니다." }
    ] },
    detail: {},
    linkLabels: {}
  },
  contentdeck: {
    ...en.contentdeck,
    cardSummary: "전체 또는 선택 구간을 반복하며 자막으로 연습하는 웹·Electron 재생기입니다.",
    heroSummary: "미디어 유형 확인과 자막, 구간 경계, 반복 상태를 하나의 집중된 재생 공간에 모읍니다.",
    overview: "React 인터페이스가 웹과 Electron에서 작동합니다. 제한된 로컬 서비스가 미디어 해석을 맡고 원격 페이지는 Node와 셸에 접근하지 못합니다.",
    audience: "지원 미디어의 짧은 구간을 연습하는 사람",
    primaryUse: "사용 권한이 분명한 미디어를 열고 자막을 확인한 뒤 짧은 구간을 선택해 반복합니다.",
    keyFeatures: ["미디어 유형 확인", "자막 표시", "전체·구간 반복", "저장한 구간 맥락", "웹·Electron 모드"],
    privacySummary: "승인된 흐름은 합성 오디오가 있는 생성 로컬 클립을 씁니다. 상업 영상 프레임, 사용자 기록, 원격 URL, 인증 정보는 없습니다.",
    currentState: "미디어 유형 확인과 전체·구간 반복, 자막, 웹 모드, Electron 모드가 로컬에서 구현되어 있습니다.",
    currentLimitations: ["패키지된 Electron 앱을 로컬에서 완전히 확인해야 합니다.", "미디어 제공 방식과 자막 메타데이터에 따라 가능한 동작이 달라집니다."],
    nextMilestones: ["패키지된 Electron 앱을 확인합니다.", "미디어를 열 수 없는 경우와 자막 사용 가능 여부를 분명히 보여 줍니다."],
    technicalNotes: ["React와 TypeScript가 재생기 상태를 공유합니다.", "Electron이 로컬 데스크톱 셸을 제공합니다.", "Vite가 웹 렌더러를 빌드하고 제한된 로컬 서비스는 Fastify를 사용합니다."],
    studioRelationship: "Studio는 검증한 미디어 URL을 ContentDeck에서 열 수 있지만 재생과 자막 상태는 ContentDeck에 남습니다.",
    scenario: { title: "짧은 구간 반복", context: "사용 권한이 분명한 생성 로컬 클립의 짧은 구간을 연습합니다.", demoDisclosure: "클립과 오디오, 자막, 세션 값은 모두 생성한 설명용 데이터입니다.", steps: [
      { id: "open-media", title: "미디어 열기", description: "네트워크 요청 없이 사용 권한이 분명한 로컬 테스트 클립을 엽니다." },
      { id: "confirm-subtitles", title: "자막 확인", description: "재생 중 자막 트랙이 보이는지 확인합니다." },
      { id: "select-segment", title: "16초 선택", description: "00:12–00:28 구간을 연습 범위로 정합니다." },
      { id: "repeat", title: "반복 켜기", description: "자막을 보면서 선택한 구간을 반복합니다." }
    ] },
    detail: {},
    linkLabels: { repository: "저장소" }
  }
};

export const projectStories = { en, ko } as const;
export function getProjectStory(locale: Locale, projectId: keyof typeof en): ProjectStory { return projectStories[locale][projectId]; }
