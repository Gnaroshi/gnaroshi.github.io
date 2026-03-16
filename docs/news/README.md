# 뉴스 운영 가이드

이 문서는 `content/news` 기반 뉴스 운영 방법을 설명합니다.

---

## 1) 뉴스가 의미하는 범위

이 프로젝트의 뉴스는 “논문 승인”만 의미하지 않습니다. 다음 유형을 지원합니다.

- `paper_accepted` (논문 승인)
- `equipment` (장비 도입)
- `new_member` (신규 구성원)
- `graduation` (졸업)
- `seminar` (세미나/토크)
- `award` (수상/성과)
- `visit` (방문/협업 소식)
- `workshop` (워크숍)
- `general` (일반 업데이트)

---

## 2) 파일 위치와 구조

- 원본: `content/news/*.md`
- 생성 데이터: `src/generated/news.generated.json`
- 템플릿: `content/news/_template.md`
- 복붙용 템플릿: `docs/templates/news.template.md`

`_template.md`는 예시 파일입니다. 실제 뉴스는 별도 파일로 만드세요.

---

## 3) 새 뉴스 추가 방법 (로컬 작업)

### Step 1. 파일 생성

예: `content/news/2026-new-lab-seminar.md`

### Step 2. frontmatter 작성

아래 필드를 작성합니다.

#### 필수 필드

- `id` : 고유 ID (중복 금지)
- `type` : 위 지원 타입 중 하나
- `title` : 뉴스 제목
- `summary` : 한 줄 요약
- `date` : `YYYY-MM-DD`

#### 선택 필드

- `related_person` : 관련 인물
- `venue` : 장소/학회/행사명
- `external_url` : 외부 링크
- `is_external` : 외부 링크 뉴스 여부 (`true/false`)
- `featured` : 강조 뉴스 여부 (`true/false`)
- `internal_slug` : 내부 앵커 slug

### Step 3. 동기화/검증

```bash
npm run content:sync
npm run validate:content
```

### Step 4. 화면 확인

- Home 최신 뉴스 섹션
- `/news` 아카이브 페이지

---

## 4) GitHub 웹에서 바로 추가하는 방법

1. 저장소 접속
2. `content/news` 폴더 이동
3. **Add file → Create new file**
4. 파일명 입력 (예: `2026-new-lab-seminar.md`)
5. 템플릿 내용 복붙 후 값 수정
6. Commit to `main` (또는 브랜치/PR)
7. Actions에서 `Content Build Check` 성공 확인
8. Actions에서 `Deploy GitHub Pages` 성공 확인

---

## 5) 외부 링크 뉴스 vs 내부 뉴스

### 외부 뉴스

- `is_external: true`
- `external_url` 필수
- Home/News에서 클릭 시 외부 페이지로 이동

### 내부 뉴스

- `is_external: false` (또는 생략)
- `external_url` 비워도 됨
- Home에서는 `/news` 아카이브로 이동

---

## 6) 예시 파일

```md
---
id: 2026-seminar-efficient-vlm
type: seminar
title: Efficient Multimodal Model 세미나 진행
summary: 연구실 내부 세미나에서 최신 실험 결과와 재현 전략을 공유했습니다.
date: 2026-03-16
related_person: Lab-LVM Seminar Team
venue: Ajou University
external_url: ""
is_external: false
featured: false
internal_slug: seminar-efficient-vlm-2026
---

세부 메모(선택): 발표자, 발표 순서, 후속 액션 등을 기록할 수 있습니다.
```

---

## 7) Home 최신 뉴스 반영 방식

현재 Home은 최신 뉴스를 **최대 5개** 미리보기로 보여줍니다.

- 소스: `src/generated/news.generated.json`
- 정렬: 날짜 최신순
- 표시 위치: Home 상단의 Latest News 섹션

즉, 뉴스 파일을 추가하고 동기화하면 Home/News 모두 반영됩니다.

---

## 8) 뉴스 추가 체크리스트 (운영자용)

1. 파일 생성 위치가 `content/news`인지 확인
2. 파일 확장자가 `.md`인지 확인
3. 필수 필드 입력 확인
   - `id`, `type`, `title`, `summary`, `date`
4. `date` 형식이 `YYYY-MM-DD`인지 확인
5. 외부 링크 뉴스면 `is_external: true` + `external_url` 입력
6. 아래 명령 실행
   ```bash
   npm run content:sync
   npm run validate:content
   ```
7. Home + `/news`에서 실제 노출 확인

---

## 9) 자주 하는 실수

1. 날짜 형식 오류 (`2026/03/16`)  
2. `type` 오타 (`paperaccepted`)  
3. `id` 중복  
4. `is_external: true`인데 `external_url` 없음  
5. generated 파일 직접 편집

오류가 나면 `docs/troubleshooting/README.md`를 참고하세요.
