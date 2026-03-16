# 배포/반영 가이드 (GitHub Pages 정적 사이트)

이 문서는 콘텐츠 수정 후 실제 사이트 반영까지의 흐름을 설명합니다.

---

## 1) 현재 배포 전제

이 프로젝트는 정적 사이트이며 GitHub Pages를 사용합니다.

### 1-1. 로컬 스크립트

- `npm run build`
- `npm run deploy` (`gh-pages -d dist`)
- `npm run build:static`
- `npm run deploy:static`
- `npm run operator:verify` (운영자 점검용)

### 1-2. GitHub Actions 워크플로우

- `.github/workflows/content-build.yml`
  - 콘텐츠 동기화/검증/빌드 체크
- `.github/workflows/deploy-pages.yml`
  - `main` push 시 GitHub Pages 자동 배포

즉, 운영자는 `main`에 push하면 자동 배포까지 진행됩니다.

---

## 2) 운영자가 변경 후 해야 하는 일

### 2-1. 로컬에서 수정할 때

1. 콘텐츠 수정 (`content/...`)
2. 아래 명령 실행
   ```bash
   npm run operator:verify
   ```
3. 커밋/푸시
4. Actions에서 아래 2개 성공 확인
   - `Content Build Check`
   - `Deploy GitHub Pages`

### 2-2. GitHub 웹에서 직접 수정할 때

1. GitHub에서 `content/...` 파일 수정
2. Commit
3. Actions에서 아래 2개 성공 확인
   - `Content Build Check`
   - `Deploy GitHub Pages`
4. 실제 사이트 반영 확인

---

## 3) 자동/수동 역할 분리

### 자동(워크플로우)

- 콘텐츠 동기화
- 스키마/형식 검증
- 빌드
- gh-pages 배포

### 수동(운영자)

- 콘텐츠 원본(`content/...`) 입력/수정
- 배포 결과 확인
- 오타/링크/날짜 오류 수정

---

## 4) 배포 후 반영 확인 방법

1. 사이트 메인 접속
2. 아래 페이지 순서대로 확인
   - `/news`
   - `/publication`
   - `/photo`
3. Home 프리뷰(최신 뉴스/논문/사진) 반영 확인
4. 외부/내부 링크 동작 확인

---

## 5) GitHub Actions 확인 절차

1. 저장소 상단 **Actions** 탭
2. 최근 실행에서 아래 워크플로우 확인
   - `Content Build Check`
   - `Deploy GitHub Pages`
3. 실패 시 로그에서 실패 단계 확인
   - Sync Content
   - Validate Content
   - Build Site
   - Deploy to gh-pages

---

## 6) 반영이 안 될 때 우선 점검

1. 콘텐츠 파일이 `content/...`에 들어갔는지
2. 날짜/타입/카테고리 형식이 맞는지
3. 사진 폴더명이 규칙을 따르는지
4. Actions 실패가 있었는지
5. `Deploy GitHub Pages` 권한 오류가 있는지
6. 브라우저 강력 새로고침(`Cmd + Shift + R` / `Ctrl + F5`) 했는지

---

## 7) 배포 확인 체크리스트 (운영자용)

1. 변경 파일이 `content/...`에만 있는지 확인
2. push 후 Actions 2개가 모두 성공인지 확인
3. 사이트에서 News/Publication/Photo/Home 프리뷰 확인
4. 링크 클릭(외부 링크 포함) 확인
5. 문제 있으면 `docs/troubleshooting/README.md` 순서대로 점검
