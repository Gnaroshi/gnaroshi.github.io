# Content Ops Outline (Draft)

이번 단계는 구조/자동화 코드만 정리한 상태입니다.

- 원본 콘텐츠: `content/news`, `content/publications`, `content/photos/raw`
- 자동 생성 데이터: `src/generated/*.generated.json`
- 사진 최적화 산출물: `public/uploads/photos/...`

명령:

- `npm run content:bootstrap` (기존 데이터 1회 마이그레이션 보조)
- `npm run content:sync` (news/publications/photos 동기화 + generated 갱신)
- `npm run validate:content` (스키마/형식 검증)
- `npm run photos:sync` (사진만 리사이즈/manifest 생성)

다음 단계에서 운영 문서를 한국어로 확장할 예정입니다.

