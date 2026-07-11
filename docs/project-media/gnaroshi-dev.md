# Project Media Brief: gnaroshi.dev

## Purpose

Show a presentation-only bilingual Astro site consuming a sanitized public feed with verifiable build provenance.

## Available Real Artifacts

- The live and local website UI.
- `/build-info.json` provenance output with public commit identifiers.
- GitHub Actions deployment summary and public feed validation result.
- Repository-owned Astro route and content adapter structure.

No external repository inspection is required because this project is the current website repository.

## Screenshot Needed

Primary: a real 16:10 crop of the homepage or project detail page in the approved production visual state.

Supporting option: a clean terminal capture of `npm run content:check` and `npm run build`, only if paths and local identity are removed. Do not expose a fake terminal or combine unrelated commands.

## Capture Plan

- Retina capture at 2880x1800, export at 1440x900 and responsive 1200/768 derivatives.
- Browser-free crop; no fake laptop/browser frame.
- Use the real EN page for English and the real KO page for Korean when text is visible.
- Prefer a state with meaningful project content rather than an empty tool route.

## Redaction And Privacy

- Remove local file paths, local usernames, terminal prompts, and private checkout names.
- Public website/feed commit SHAs may remain because they are already exposed in build metadata.
- Do not show private repository URLs, tokens, workflow secrets, or unreviewed metrics.

## Alt Text

English: `The bilingual gnaroshi.dev project page rendered by the presentation-only Astro website.`

Korean: `프레젠테이션 전용 Astro 웹사이트에 표시된 이중 언어 gnaroshi.dev 프로젝트 화면.`

## Final Route Usage

Home Selected Work, `/projects/`, `/projects/gnaroshi-dev/`, and Korean equivalents. One screenshot may serve these related routes because they refer to the same project.

Status: capture deferred until Stage 2 and final production layout approval.
