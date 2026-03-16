Photo 운영 규칙(요약):

1. 원본 이미지는 `content/photos/raw/<category>/<YYYY-MM-DD>__<slug>/` 아래에 넣는다.
2. 파일명은 자유지만 날짜/slug가 폴더명에 포함되면 자동 인식된다.
3. 선택 메타데이터는 `content/photos/metadata.json`에 넣는다.
   - 샘플 형식: `content/photos/metadata.template.json`
4. 동기화 명령:
   - `npm run photos:sync`
   - 또는 전체 동기화 `npm run content:sync`

생성 결과:
- `public/uploads/photos/...` (리사이즈/최적화 산출물)
- `src/generated/photos.generated.json` (갤러리/라이트박스 manifest)
