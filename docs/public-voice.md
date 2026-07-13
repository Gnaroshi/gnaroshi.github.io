# Public Voice

## Voice

Gnaroshi sounds like one person describing what they study, build, read, and still need to understand. The voice is modest, concrete, natural, concise, calm, and technically accurate.

Use first person when the sentence describes an interest, action, or decision. Prefer a direct verb over a professional identity label.

## Prefer

English:

- I study
- I build
- I’m exploring
- I’m working on
- I write
- I record
- I compare
- notes, records, experiments, projects
- what I learned, what remains

Korean:

- 공부합니다
- 만들고 있습니다
- 살펴보고 있습니다
- 기록합니다
- 글, 기록, 실험, 프로젝트
- 배운 것, 남은 문제

## Avoid

- unsupported professional titles or affiliations
- startup, lab, product, grant, or self-evaluation language
- `public projection`, `canonical source`, `evidence eligibility`, and similar implementation terms on overview pages
- `공개 projection`, `결정론적 공개 데이터`, `자격 규칙`, `근거 중심의 공개 표현`
- marketing words such as cutting-edge, innovative, seamless, transformative, or powerful
- Korean strings built from three or more stacked technical nouns
- a repeated explanation of the private/public publishing architecture

Precise technical terms such as VLA, adapter, run manifest, inference, and checkpoint remain in detailed technical context. Explain what they do in the surrounding sentence.

## Page Ownership

- Home: who Gnaroshi is through current activities and interests
- About: background, working habits, skills, and available links
- Research: current questions and what remains uncertain
- Projects: project summaries; architecture belongs on each detail page
- Writing: why and what Gnaroshi writes
- Reading: paper-reading notes and the three-pass method
- Activity: a simple longitudinal view when enough published activity exists
- `gnaroshi.dev` project detail: publishing architecture and repository boundaries

Do not repeat project architecture on Home, About, Research, or Writing.

## English And Korean

English and Korean communicate the same facts and intent, but they do not mirror sentence structure. Korean should be written independently with ordinary verbs and readable sentence endings. English should use short sentences and direct verbs.

Technical proper nouns remain unchanged unless an official Korean name exists. Dates and counts use locale-aware formatters.

## Titles And Privacy

- The brand is only `Gnaroshi`.
- Do not place a profession or role under the brand.
- Do not call the owner an AI researcher or software engineer without explicit approval.
- Do not show location as decorative metadata.
- Do not infer a university, lab, degree, job, affiliation, publication, award, or contact method.
- Optional facts and links stay hidden when absent.
- Person structured data uses only verified name, URL, description, and public links.

## Examples

Avoid:

> An architecture-neutral VLA research infrastructure layer.

Prefer:

> A workspace for running and comparing different VLA models through a clearer, shared experiment structure.

Avoid:

> 아키텍처 중립 VLA 실험 인프라를 구축합니다.

Prefer:

> 서로 다른 VLA 모델을 같은 구조에서 실행하고 비교할 수 있게 정리합니다.

Avoid:

> Public evidence appears after eligibility rules pass.

Prefer:

> There is not enough activity to show a meaningful overview yet.

## Review

Run `npm run check:public-tone` after changing public copy. Read the built English and Korean pages in context; passing phrase checks does not make awkward writing acceptable.
