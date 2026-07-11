# Public Copy Before And After

## Summary

The previous public voice described a professional title, repository boundaries, metric rules, and technical abstractions before it described the person. The new voice starts from current activities and keeps implementation details on the relevant project page.

No degree, university, lab name, job, affiliation, publication, award, or specific location was inferred.

## Major Changes

| Area | Before | After |
| --- | --- | --- |
| Header | Brand plus role copy elsewhere in the shell | `Gnaroshi` only; no profession under the brand |
| Home identity | `AI researcher and software engineer...` | `I study AI systems and build software for research.` |
| Home Korean | `비전-언어-행동 시스템을 다루는 AI 연구자이자...` | `AI 시스템을 공부하고, 연구에 필요한 소프트웨어를 만듭니다.` |
| Location | `South Korea` / `대한민국` Hero eyebrow and profile fact | Removed from UI, metadata, facts, and JSON-LD |
| About | Repeated title, location, evidence policy, and project architecture | Background in software, current learning through lab experiments and tools, practical working habits |
| Research | Abstract infrastructure and evidence language | Three direct questions with concise current thinking and remaining uncertainty |
| Projects | `Research infrastructure and software` | `Projects`; plain summaries of what each project does |
| Writing | Every entry framed as technical research output | Notes from papers, implementations, and questions worth returning to |
| Papers | `Paper Lab` / `논문 연구실` | `Papers` / `논문`; `Paper Notes` / `논문 기록` |
| Activity | `Growth`, momentum, eligibility, and evidence-gate copy | `Activity` / `활동 기록`; a simple view that remains quiet when data is insufficient |
| Footer | Unsupported professional role | `Notes on AI, software, and research.` and its natural Korean counterpart |
| Structured data | `jobTitle` and `homeLocation` | Verified name, URL, description, and GitHub link only |
| SEO | Profession-led titles and descriptions | `Gnaroshi` with concise notes/projects/papers descriptions |

## Repetition Removed

- Personal background now belongs to About.
- Current questions now belong to Research.
- VLA repository structure now belongs to the project detail page.
- Writing motivation belongs to Writing.
- The three-pass method belongs to Papers.
- Private/public repository separation belongs to the `gnaroshi.dev` project detail.

## Korean Decisions

- Korean was rewritten independently instead of matching English clause order.
- Abstract nominal phrases were replaced with ordinary sentences and verbs.
- Technical nouns remain only where they name a real implementation concept.
- Buttons and navigation use short labels that remain readable at 360px.

## Validation

`scripts/check-public-tone.mjs` checks the built site for unsupported titles, location presentation, internal vocabulary outside the technical project route, unapproved Person JSON-LD fields, duplicate page introductions, future dates, placeholders, locale-route structure, Korean button length, and the approved Hero line breaks.
