# Lab-LVM 운영 문서 (GitHub Pages 정적 사이트)

이 문서 세트는 **디자인/컴포넌트 코드를 수정하지 않고**, 운영자가 콘텐츠(뉴스/논문/사진)를 지속적으로 업데이트할 수 있도록 만든 가이드입니다.  
대상 독자는 **처음 프로젝트를 인수받은 운영자**이며, 개발 경험이 많지 않아도 바로 운영할 수 있게 구성했습니다.

---

## 1) 이 문서의 목적

1. 운영자가 “어떤 파일을 수정해야 하는지”를 빠르게 파악한다.
2. 코드(`src/components/...`)를 건드리지 않고 콘텐츠만 변경한다.
3. GitHub Pages 정적 배포 흐름에서 안전하게 반영한다.
4. 오류가 발생했을 때 점검 순서와 해결 방법을 즉시 찾는다.

---

## 2) 운영 대상 콘텐츠 (현재 기준)

이번 구조에서 운영자가 직접 관리하는 원본 콘텐츠는 아래 3개입니다.

1. **뉴스**: `content/news/*.md`
2. **논문**: `content/publications/**/*.md`
3. **사진 원본**: `content/photos/raw/**`  
   (선택 메타데이터: `content/photos/metadata.json`)

사이트가 실제로 읽는 값은 사람이 직접 쓰는 원본이 아니라, 동기화 과정에서 생성되는 아래 파일입니다.

- `src/generated/news.generated.json`
- `src/generated/publications.generated.json`
- `src/generated/photos.generated.json`

사진 최적화 출력물은 아래 경로에 생성됩니다.

- `public/uploads/photos/...`

---

## 3) 전체 운영 흐름 (한눈에 보기)

### A. 로컬(내 PC)에서 운영할 때

1. `content/...` 원본 파일 추가/수정
2. `npm run content:sync` 실행 (생성 데이터 갱신)
3. `npm run build` 실행 (검증 포함)
4. 커밋/푸시
5. GitHub Actions의 자동 배포 성공 확인

### B. GitHub 웹에서 바로 운영할 때

1. GitHub 저장소에서 `content/...` 파일 추가/수정
2. Commit to `main`(또는 PR)
3. Actions의 `Content Build Check` 성공 확인
4. Actions의 `Deploy GitHub Pages` 성공 확인
5. 사이트 반영 확인

> 참고: 현재는 `.github/workflows/deploy-pages.yml`로 `main` push 시 자동 배포됩니다.

---

## 4) 어떤 문서를 언제 봐야 하는가

- 뉴스 추가/수정: `docs/news/README.md`
- 논문 추가/수정: `docs/publications/README.md`
- 사진 추가/최적화: `docs/photos/README.md`
- 배포/반영 확인: `docs/deployment/README.md`
- 오류 해결: `docs/troubleshooting/README.md`
- 복붙 템플릿 모음: `docs/templates/README.md`

---

## 5) 처음 운영을 맡았을 때 가장 먼저 할 일

1. 아래 경로 존재 여부 확인
   - `content/news`
   - `content/publications`
   - `content/photos/raw`
   - `src/generated`
2. 로컬 준비
   - `npm install`
3. 운영 파이프라인 점검
   - `npm run validate:content`
   - `npm run content:sync`
4. 생성 결과 확인
   - `src/generated/*.generated.json`
   - `public/uploads/photos/...`
5. 테스트 반영 권장
   - 브랜치에서 1건 샘플 추가 → PR → Actions 확인

### 5-1. 인수인계 첫날(1일차) 권장 루틴

1. 이 문서(`docs/README.md`)를 먼저 끝까지 읽습니다.
2. 이어서 아래 순서로 읽습니다.
   - `docs/news/README.md`
   - `docs/publications/README.md`
   - `docs/photos/README.md`
   - `docs/deployment/README.md`
3. 로컬에서 아래 명령 1회 실행
   ```bash
   npm install
   npm run validate:content
   ```
4. 템플릿을 이용해 “테스트용 뉴스 1건”을 임시로 작성해보고(저장 전 취소 가능),
   실제 입력 위치/필드 구조를 눈으로 확인합니다.
5. 마지막으로 `docs/troubleshooting/README.md`를 읽고 자주 나는 오류를 숙지합니다.

---

## 6) 공통 규칙 (중요)

### 6-1. 날짜 형식

- 반드시 `YYYY-MM-DD`
- 올바른 예: `2026-03-16`
- 잘못된 예: `2026/03/16`, `03-16-2026`, `2026.03.16`

### 6-2. 링크 형식

- 외부 링크는 `http://` 또는 `https://`로 시작
- 링크가 없으면 `""` 또는 필드 미기입
- 뉴스에서 `is_external: true`이면 `external_url` 필수

### 6-3. 파일명/슬러그

- 영문 소문자 + 숫자 + 하이픈(`-`) 권장
- 공백 대신 하이픈 사용
- 특수문자 최소화

### 6-4. 절대 하지 말아야 할 것

1. `src/generated/*.generated.json` 직접 수정
2. `src/components/...`에 콘텐츠 하드코딩
3. 날짜 형식 임의 변경
4. 사진 원본을 `src/assets/images/photo`에 직접 넣기  
   (운영 입력 경로는 `content/photos/raw`로 통일)

---

## 7) 운영 명령어 요약

```bash
# (보통 1회) 기존 데이터에서 content 구조 초기 생성
npm run content:bootstrap

# 뉴스/논문/사진 전체 동기화 + generated 갱신
npm run content:sync

# 사진만 동기화(리사이즈 + manifest)
npm run photos:sync

# 형식/스키마 검증
npm run validate:content

# 빌드(자동으로 validate:content 선행)
npm run build

# 운영자 권장 1줄 검증(동기화 + 빌드)
npm run operator:verify
```

---

## 8) 운영자가 실제로 수정하는 파일 요약

운영자는 기본적으로 아래만 수정하면 됩니다.

1. 뉴스: `content/news/*.md`
2. 논문: `content/publications/**/*.md`
3. 사진: `content/photos/raw/**` (+ 필요 시 `content/photos/metadata.json`)

그 외 `src/generated/*`, `public/uploads/photos/*`는 자동 생성 결과물이므로 직접 편집하지 않습니다.

---

## 9) 운영자 시나리오 점검 결과 (실검증)

다음 4개 시나리오를 기준으로 실제 동작을 점검했습니다.

1. 새 뉴스 1개 추가
2. 새 논문 1개 추가
3. 새 행사 사진 여러 장 추가(샘플 1장으로 흐름 검증)
4. GitHub push 후 배포 확인

검증 결과 요약:

- 임시 콘텐츠를 추가한 상태에서 `npm run validate:content` 통과 확인
  - 뉴스: 10 -> 11
  - 논문: 6 -> 7
  - 사진: 13 -> 14
- 임시 콘텐츠 제거 후 재검증
  - 뉴스: 10
  - 논문: 6
  - 사진: 13
- 즉, 현재 콘텐츠 스키마/자동화 스크립트는 운영 시나리오 기준으로 정상 작동합니다.

---

## 10) 최종 운영 체크리스트

### 10-1. 뉴스 추가 체크리스트

1. `content/news/`에 새 `.md` 파일 생성
2. 필수 필드 입력 (`id`, `type`, `title`, `summary`, `date`)
3. 날짜 형식 `YYYY-MM-DD` 확인
4. 외부 뉴스면 `is_external: true` + `external_url` 입력
5. `npm run content:sync`
6. `npm run validate:content`
7. Home 최신 뉴스 + `/news` 페이지 확인

### 10-2. 논문 추가 체크리스트

1. `content/publications/<category>/`에 새 `.md` 파일 생성
2. 필수 필드 입력 (`id`, `category`, `status`, `title`, `date`, `authors`, `venue`)
3. `category` 값 확인 (`application`, `biomedical`, `core`, `multi-modal`)
4. `paper_url`, `source_code_url` 입력 여부 점검
5. `npm run content:sync`
6. `npm run validate:content`
7. `/publication` + Home preview 확인

### 10-3. 사진 추가 체크리스트

1. 원본 파일을 `content/photos/raw/<category>/<YYYY-MM-DD>__<slug>/`에 추가
2. 필요 시 `content/photos/metadata.json`에 제목/설명/순서 보정
3. `npm run photos:sync` 또는 `npm run content:sync`
4. `npm run validate:content`
5. `public/uploads/photos/...` 생성 여부 확인
6. `/photo`에서 썸네일/확대보기 확인

### 10-4. 배포 확인 체크리스트

1. 변경사항 push
2. GitHub Actions에서 `Content Build Check` 성공 확인
3. GitHub Actions에서 `Deploy GitHub Pages` 성공 확인
4. 실제 사이트에서 아래 경로 확인
   - `/news`
   - `/publication`
   - `/photo`
   - Home 최신 미리보기
5. 반영이 안 보이면 강력 새로고침 후 재확인

---

## 11) 문서 업데이트 원칙

- 운영 구조가 바뀌면 코드보다 먼저 `docs/`를 갱신합니다.
- “실제 경로/실제 명령/실제 오류 메시지” 기준으로 작성합니다.
- 추측성 문장 대신 검증된 동작만 문서화합니다.
