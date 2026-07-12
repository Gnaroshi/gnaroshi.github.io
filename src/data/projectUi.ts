import type { Locale } from "../i18n/types";

export const projectUi = {
  en: {
    back: "Back to Projects", atGlance: "At a glance", audience: "For", primaryUse: "Primary use", platforms: "Platforms", status: "Product status",
    overview: "Overview", features: "Key features", stack: "Tech stack", privacy: "Data and privacy", relationship: "Studio relationship", state: "Current state",
    limitations: "Current limitations", notes: "Technical notes", milestones: "Next milestones", links: "Links", source: "Source provenance", sourceCommit: "Source commit",
    integration: "Studio integration", updated: "Content reviewed", researchQuestion: "Research question", approach: "Approach", verifiedArtifact: "Verified artifact",
    currentEvidence: "Current evidence", unknowns: "Unknowns", reproducibility: "Reproducibility", problem: "Problem", workflow: "Public workflow",
    boundaries: "Repository boundaries", systemEvidence: "Actual system evidence", verification: "Deployment verification", privateSource: "Private source repository"
  },
  ko: {
    back: "프로젝트로 돌아가기", atGlance: "한눈에 보기", audience: "대상", primaryUse: "주요 용도", platforms: "지원 환경", status: "제품 상태",
    overview: "개요", features: "주요 기능", stack: "기술 구성", privacy: "데이터와 개인정보", relationship: "Studio와의 관계", state: "현재 상태",
    limitations: "현재 한계", notes: "기술 메모", milestones: "다음 단계", links: "링크", source: "소스 출처", sourceCommit: "소스 커밋",
    integration: "Studio 연결 상태", updated: "내용 확인일", researchQuestion: "연구 질문", approach: "접근 방식", verifiedArtifact: "검증된 결과물",
    currentEvidence: "현재 근거", unknowns: "남은 질문", reproducibility: "재현 가능성", problem: "해결하려는 문제", workflow: "공개 흐름",
    boundaries: "저장소 경계", systemEvidence: "실제 시스템 근거", verification: "배포 확인", privateSource: "비공개 소스 저장소"
  }
} as const;

export const integrationLabels = {
  en: { "not-planned": "Not planned", planned: "Planned", "in-review": "Under review", available: "Available" },
  ko: { "not-planned": "계획 없음", planned: "계획됨", "in-review": "검토 중", available: "사용 가능" }
} as const;

export function getProjectUi(locale: Locale) { return projectUi[locale]; }
