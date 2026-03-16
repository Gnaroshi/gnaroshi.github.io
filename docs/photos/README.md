# 사진 운영 가이드 (자동 리사이즈/최적화/manifest)

이 문서는 사진 운영자가 “원본 파일 추가” 중심으로 작업할 수 있도록 설명합니다.

---

## 1) 핵심 개념

운영자가 직접 관리하는 것은 **원본 사진**입니다.

- 원본 입력: `content/photos/raw/...`
- 자동 생성:
  - `public/uploads/photos/...` (썸네일/큰 이미지)
  - `src/generated/photos.generated.json` (갤러리 데이터)

즉, 운영자는 보통 **원본 파일 추가 + (선택) 메타데이터 수정**만 하면 됩니다.

---

## 2) 폴더 구조 규칙 (중요)

권장 구조:

```text
content/photos/raw/<category>/<YYYY-MM-DD>__<slug>/<image files>
```

예시:

```text
content/photos/raw/events/2026-03-16__spring-seminar/
  seminar-room-01.jpg
  seminar-room-02.jpg
  group-photo-01.jpeg
```

### 규칙 설명

1. `<category>`  
   - 예: `events`, `seminar`, `graduation`
   - 영문 소문자 권장

2. `<YYYY-MM-DD>__<slug>`  
   - 날짜와 슬러그를 `__`로 구분
   - 예: `2026-03-16__spring-seminar`

3. 파일명  
   - 자유롭게 가능하지만, 영문/숫자/하이픈 권장
   - 확장자: `.jpg`, `.jpeg`, `.png`, `.webp`

---

## 3) 사진 동기화 명령

### 사진만 처리

```bash
npm run photos:sync
```

### 뉴스/논문/사진 전체 동기화

```bash
npm run content:sync
```

---

## 4) 자동으로 생성되는 것

사진 동기화 시 자동으로:

1. 원본 → 큰 이미지(라이트박스용)
2. 원본 → 썸네일(갤러리 목록용)
3. `src/generated/photos.generated.json` 생성

결과 예시:

```text
public/uploads/photos/events/2026-03-16__spring-seminar/
  seminar-room-01--thumb.jpg
  seminar-room-01--large.jpg
  seminar-room-02--thumb.jpg
  seminar-room-02--large.jpg
```

---

## 5) 갤러리용 vs 확대보기용 이미지

현재 Photo 페이지는 아래 방식으로 동작합니다.

1. 목록(갤러리): `thumbnail` 경로 사용
2. 클릭 후 라이트박스: `full` 경로 사용

즉, 첫 로딩은 가벼운 썸네일로 진행되고, 확대할 때 큰 이미지를 불러옵니다.

---

## 6) 메타데이터(선택) 사용법

파일:

- 실제 사용: `content/photos/metadata.json`
- 샘플: `content/photos/metadata.template.json`
- 복붙용 템플릿: `docs/templates/photos.metadata.template.json`

메타데이터를 쓰면 제목/설명/날짜/순서를 직접 보정할 수 있습니다.

예시:

```json
{
  "defaults": {
    "category": "events",
    "description": ""
  },
  "items": {
    "seminar-room-01": {
      "title": "Spring Seminar",
      "caption": "Spring Seminar",
      "description": "발표 및 토론 세션",
      "date": "2026-03-16",
      "category": "events",
      "slug": "spring-seminar",
      "order": 1,
      "alt": "세미나실 발표 장면"
    }
  }
}
```

### metadata 없이도 동작

metadata가 없어도 최소 동작합니다.

- 폴더명/파일명에서 날짜/슬러그/순서를 최대한 추론
- 추론 불가능하면 기본값 사용

---

## 7) 로컬 작업 절차 (권장)

1. 원본 파일 추가 (`content/photos/raw/...`)
2. 필요 시 `metadata.json` 보정
3. `npm run photos:sync`
4. `npm run validate:content`
5. `npm run dev` 또는 `npm run build`로 확인

한 번에 점검하려면:

```bash
npm run operator:verify
```

---

## 8) GitHub 웹에서 작업하는 경우

1. `content/photos/raw/...` 경로로 이미지 업로드
2. 필요 시 `content/photos/metadata.json` 수정
3. Commit
4. Actions 성공 여부 확인
   - `Content Build Check`
   - `Deploy GitHub Pages`

> 주의: GitHub 웹 업로드 시 폴더명을 정확히 맞추지 않으면 날짜/슬러그 추론이 깨질 수 있습니다.

---

## 9) 이미지 처리 도구(환경)

스크립트는 아래 순서로 사용 가능한 도구를 찾습니다.

1. `magick` (ImageMagick)
2. `convert` + `identify` (ImageMagick)
3. `sips` (macOS)

아무 도구도 없으면 사진 동기화가 실패합니다.

- 로컬 macOS는 기본적으로 `sips`가 있어 동작 가능
- GitHub Actions는 workflow에서 ImageMagick 설치 후 실행

---

## 10) 자주 하는 실수

1. 폴더명을 `YYYY-MM-DD__slug` 규칙으로 안 만듦  
2. 날짜를 `YYYY/MM/DD`로 작성  
3. metadata key를 실제 파일명/상대경로와 다르게 입력  
4. `photos:sync` 없이 바로 배포  
5. `src/generated/photos.generated.json` 수동 수정

---

## 11) 사진 추가 체크리스트 (운영자용)

1. 원본 추가 위치 확인
   - `content/photos/raw/<category>/<YYYY-MM-DD>__<slug>/`
2. 파일 형식 확인 (`.jpg`, `.jpeg`, `.png`, `.webp`)
3. (선택) `content/photos/metadata.json`에 제목/설명/순서 보정
4. 아래 중 하나 실행
   - `npm run photos:sync`
   - `npm run content:sync`
5. `npm run validate:content`
6. `/photo`에서 썸네일 + 라이트박스 확인
