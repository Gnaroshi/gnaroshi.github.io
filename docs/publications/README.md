# 논문(Publications) 운영 가이드

이 문서는 논문 데이터를 코드 수정 없이 업데이트하는 방법을 설명합니다.

---

## 1) 파일 위치와 반영 경로

- 원본: `content/publications/<category>/*.md`
- 생성 데이터: `src/generated/publications.generated.json`
- 템플릿: `content/publications/_template.md`
- 복붙용 템플릿: `docs/templates/publication.template.md`

`<category>`는 아래 4개 중 하나입니다.

- `application`
- `biomedical`
- `core`
- `multi-modal`

---

## 2) 새 논문 추가 방법 (로컬 작업)

### Step 1. 카테고리 폴더 선택

예: 코어 연구 논문이면

- `content/publications/core/`

### Step 2. 파일명 생성

예:

- `core-2026-efficient-vlm-attention.md`

### Step 3. frontmatter 작성

#### 필수 필드

- `id` : 고유 ID
- `category` : 위 4개 중 하나
- `status` : `published` / `working` / `project`
- `title` : 논문 제목
- `date` : `YYYY-MM-DD`
- `authors` : 저자 문자열
- `venue` : 학회/저널

#### 선택 필드

- `paper_url` : 논문 링크
- `source_code_url` : 코드 링크
- `featured` : 강조 여부
- `summary` : 요약

### Step 4. 동기화/검증

```bash
npm run content:sync
npm run validate:content
```

### Step 5. 화면 확인

- `/publication` 목록
- Home의 Publications preview

---

## 3) GitHub 웹에서 바로 수정하는 방법

1. 저장소에서 `content/publications` 이동
2. 카테고리 폴더 진입 (예: `core`)
3. **Add file → Create new file**
4. 템플릿 복붙 후 값 수정
5. Commit
6. Actions `Content Build Check` 확인
7. Actions `Deploy GitHub Pages` 확인

---

## 4) 예시 파일

```md
---
id: core-2026-efficient-vlm-attention
category: core
status: published
title: Efficient Attention Routing for Vision-Language Models
date: 2026-03-16
authors: First Author, Second Author, Corresponding Author
venue: CVPR 2026
paper_url: https://example.org/paper
source_code_url: https://github.com/example/repo
featured: false
summary: 비용을 줄이면서 멀티모달 성능을 유지하는 attention routing 방법을 제안합니다.
---

선택 본문: 초록/운영 메모
```

---

## 5) category / status 규칙

### category (필수)

- `application`, `biomedical`, `core`, `multi-modal`만 허용됩니다.
- 오타가 있으면 검증 단계에서 실패합니다.

### status (필수)

- `published`: 출판/게재된 항목
- `working`: 진행 중
- `project`: 프로젝트 성격

현재 UI는 published 중심으로 보이더라도, 구조적으로는 3개 상태를 허용합니다.

---

## 6) 썸네일/대표 이미지 처리

현재 Publication 카드의 이미지는 **카테고리별 대표 이미지**를 사용합니다.

- 별도 논문별 이미지 파일을 운영자가 넣는 구조는 이번 단계 범위에 포함하지 않았습니다.
- 즉, 논문 추가 시 이미지 파일 작업은 필수가 아닙니다.

---

## 7) Home / Publication 반영 방식

동기화 후:

1. `src/generated/publications.generated.json` 갱신
2. Publication 페이지 필터/검색 대상 갱신
3. Home의 Publications preview(최신 항목) 자동 갱신

---

## 8) 논문 추가 체크리스트 (운영자용)

1. 대상 폴더가 `content/publications/<category>/`인지 확인
2. 파일 확장자가 `.md`인지 확인
3. 필수 필드 입력 확인
   - `id`, `category`, `status`, `title`, `date`, `authors`, `venue`
4. `category` 값이 허용 값인지 확인
   - `application`, `biomedical`, `core`, `multi-modal`
5. `date` 형식 확인 (`YYYY-MM-DD`)
6. 아래 명령 실행
   ```bash
   npm run content:sync
   npm run validate:content
   ```
7. `/publication` + Home preview 확인

---

## 9) 자주 하는 실수

1. `category` 오타  
2. `date` 형식 오류  
3. `id` 중복  
4. `paper_url`에 URL이 아닌 일반 텍스트 입력  
5. generated 파일 직접 편집
