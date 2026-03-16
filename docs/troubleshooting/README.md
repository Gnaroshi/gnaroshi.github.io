# 문제 해결 가이드 (Troubleshooting)

이 문서는 운영 중 자주 발생하는 오류를 빠르게 해결하기 위한 점검표입니다.  
대상은 **비개발자 운영자**이며, “어디를 먼저 확인해야 하는지”에 집중합니다.

---

## 1) 가장 먼저 하는 공통 점검 5단계

1. 수정한 파일이 `content/...` 아래에 있는지 확인  
   (`src/generated/...` 수정은 반영되지 않습니다)
2. 파일명/폴더명 규칙이 맞는지 확인
3. 날짜 형식이 `YYYY-MM-DD`인지 확인
4. 아래 명령을 로컬에서 실행해 로그 확인
   ```bash
   npm run content:sync
   npm run validate:content
   npm run build
   ```
5. GitHub Actions `Content Build Check` 성공 여부 확인

---

## 2) “뉴스/논문이 안 보입니다”

### 증상

- Home 최신 항목에 새 데이터가 안 뜸
- `/news`, `/publication`에서 새 항목이 안 뜸

### 원인 후보

1. 파일을 잘못된 폴더에 추가
2. frontmatter 필수 필드 누락
3. 날짜 형식/타입 값 오타
4. `id` 중복

### 해결 절차

1. 파일 경로 확인
   - 뉴스: `content/news/*.md`
   - 논문: `content/publications/<category>/*.md`
2. frontmatter 구분자 `---`가 맨 위/아래에 정확히 있는지 확인
3. `npm run validate:content` 실행 후 오류 메시지 확인
4. 수정 후 `npm run content:sync` 다시 실행

---

## 3) “사진이 안 뜨거나 일부만 뜹니다”

### 증상

- `/photo`에 새 사진이 보이지 않음
- 썸네일은 나오는데 확대 이미지가 깨짐

### 원인 후보

1. 원본 사진이 `content/photos/raw` 밖에 있음
2. 폴더명 규칙 오류 (`YYYY-MM-DD__slug` 미준수)
3. 이미지 처리 도구 미설치 (`magick`/`convert`/`sips`)
4. `photos:sync` 미실행

### 해결 절차

1. 원본 경로 확인
   - 예: `content/photos/raw/events/2026-03-16__spring-seminar/*.jpg`
2. `npm run photos:sync` 실행
3. 생성물 확인
   - `public/uploads/photos/...`
   - `src/generated/photos.generated.json`
4. 필요 시 `content/photos/metadata.json` 값 보정

---

## 4) frontmatter/JSON 형식 오류

### 증상

- validate 단계에서 파싱 오류
- build 실패

### 자주 하는 실수

1. frontmatter 시작/종료 `---` 누락
2. `key: value`에서 콜론/공백 형식 오타
3. 문자열 따옴표 처리 실수
4. JSON 마지막 쉼표(trailing comma)

### 빠른 해결 팁

1. 템플릿 파일 복붙 후 값만 바꿉니다.
   - `content/news/_template.md`
   - `content/publications/_template.md`
   - `content/photos/metadata.template.json`
2. 파일 인코딩은 UTF-8 권장

---

## 5) 날짜 형식 오류

### 증상

- `date must be YYYY-MM-DD` 오류

### 해결

- 반드시 `2026-03-16` 형태 사용
- `/`, `.`, 월/일 한 자리 표기(예: `2026-3-6`) 금지

---

## 6) 링크 오류

### 증상

- 클릭 시 링크 동작 안 함
- 외부 뉴스가 내부 뉴스처럼 동작함

### 체크리스트

1. URL이 `http://` 또는 `https://`로 시작하는지
2. 뉴스에서 `is_external: true`이면 `external_url`이 있는지
3. 빈 링크면 `""` 또는 필드 생략 처리했는지

---

## 7) 빌드 실패 (로컬/GitHub Actions)

### 로컬에서 실패할 때

1. `npm install`을 다시 실행
2. Node 버전 확인(워크플로우는 Node 20 사용)
3. `npm run content:sync` → `npm run validate:content` 순서로 재실행

### GitHub Actions에서 실패할 때

1. 저장소 `Actions` 탭 진입
2. 실패한 `Content Build Check` 실행 열기
3. 실패 단계 확인
   - Sync Content
   - Validate Content
   - Build Site
4. 오류 메시지 기준으로 해당 콘텐츠 파일 수정 후 재푸시

---

## 8) 배포 워크플로우(`Deploy GitHub Pages`) 실패

### 증상

- `Content Build Check`는 성공인데 사이트 반영이 안 됨
- `Deploy GitHub Pages`가 실패

### 원인 후보

1. GitHub Actions 권한 문제(`GITHUB_TOKEN` write 권한)
2. 빌드 단계에서 콘텐츠 오류 발생
3. gh-pages 브랜치 푸시 충돌

### 해결 절차

1. Actions 로그에서 실패 단계 확인
   - `Build Site` 실패인지
   - `Deploy to gh-pages` 실패인지
2. 권한 오류라면 저장소 설정에서 Actions 권한 확인
3. 콘텐츠 오류라면 `docs/troubleshooting`의 2~6번 항목 순서대로 점검
4. 다시 push해서 재실행 확인

---

## 9) 배포했는데 사이트 반영이 안 됩니다

### 원인 후보

1. push는 했지만 `Deploy GitHub Pages`가 실패/미실행
2. 브라우저 캐시
3. 잘못된 브랜치/리포지토리에 배포

### 해결 절차

1. Actions에서 `Deploy GitHub Pages` 성공 여부 확인
2. GitHub Pages 설정(브랜치/폴더) 확인
3. 브라우저 강력 새로고침
   - Windows: `Ctrl + F5`
   - macOS: `Cmd + Shift + R`

---

## 10) 운영자가 꼭 기억할 원칙

1. 편집 대상은 `content/...`만
2. `src/generated/...`는 자동 생성 결과물
3. “오류가 나면 템플릿으로 되돌려 비교”가 가장 빠름
4. 반영 확인은 항상 Home + 개별 탭(`/news`, `/publication`, `/photo`)까지 확인
