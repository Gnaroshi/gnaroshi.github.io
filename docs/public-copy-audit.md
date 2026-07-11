# Public Copy Audit

Audit date: 2026-07-12

This audit records the public English and Korean voice before the rewrite. It covers route copy, navigation, metadata, structured data, RSS, empty states, and interactive labels. The site is currently using the bootstrap-empty public feed, so content-authored post and paper prose is outside this website-owned copy audit.

## Cross-Site Findings

- `AI researcher and software engineer` and its Korean equivalents appear in profile data, the footer, Home metadata, About metadata, and Person structured data. The claim is broader than the verified public facts.
- `South Korea` and `대한민국` are used as decorative Hero metadata and repeated in About and Person JSON-LD without helping the reader understand the work.
- Facts and prose are mixed: `currentRole` and `location` exist only to fill profile presentation, while localized files duplicate them independently.
- Home, About, Research, Projects, and Paper pages repeat the same VLA infrastructure, evidence, and private/public publishing explanation.
- Korean frequently follows English technical noun structure instead of using ordinary verbs. Examples include `아키텍처 중립 작업실`, `근거 중심의 공개 표현`, and `결정론적인 공개용 데이터`.
- Application routes explain scoring eligibility and feed mechanics before they explain what a visitor can actually do or see.
- `Paper Lab` and `Growth` sound like product areas. Public navigation should use `Papers` / `논문` and `Activity` / `활동 기록`.

## Route Audit

| Route | Current headline / introduction | Repetition and tone problems | Proposed change |
| --- | --- | --- | --- |
| `/` | `AI researcher and software engineer working on vision-language-action systems`; the Korean version makes the same professional claim. | Location eyebrow is contextless. The page explains architecture-neutral experiments, canonical repositories, evidence, and public projection before introducing a person. | Use the approved activity-based Hero. Keep Home to identity, current interests, research questions, one project, and available writing/paper records. Remove publishing architecture from the overview. |
| `/about/` | Name plus the same role/location/short bio as Home. | Repeats identity, VLA focus, private/public boundary, and evidence policy. The Korean prose reads like a project specification. | Use the approved background statement, two personal paragraphs, practical skills, and `How I work` / `일하는 방식`. Remove role and location rows. |
| `/research/` | `Questions under active investigation`; Korean `지금 탐구하는 질문`. | Introduction and all three topics repeat architecture-neutral infrastructure and evidence vocabulary. Hypothesis labels sound like a formal proposal. | Use the approved three questions and concise 2–3 sentence motivation, current thinking, and remaining question. Prefer `What I am testing` and `What remains` where labels are needed. |
| `/projects/` | `Research infrastructure and software`. | Intro advertises reproducible context and evidence-aware presentation. Status `Active infrastructure work` is inflated. | Use the approved Projects introduction and short summaries. Use simple statuses: Active/In progress, Archived, Complete. |
| `/projects/gnaroshi-vla/` | Architecture-neutral workspace summary. | The overview repeats the Research page, although adapter/run-manifest terminology is legitimate in technical sections. | Use a plain one-sentence summary; keep precise terms only in Problem, Structure, Reproducibility, and Open questions. |
| `/projects/gnaroshi-dev/` | Deterministic public projection presentation layer. | Accurate implementation language is used as the public summary. | Use the approved personal-site summary. Keep repository separation, feed validation, and deployment mechanics only in this technical detail page. |
| `/blog/` | `Technical notes and research logs`. | Treats all writing as research output and repeats workflow categories. | Use `Writing` / `글` and the approved direct introduction about papers, implementation problems, and ideas worth revisiting. |
| `/blog/archive/`, tags, post detail | Archive/search labels are mostly functional. | Some labels call entries notes regardless of content; translation-unavailable copy is terse. | Refer to each item as a post unless its own metadata is more specific. Keep functional labels concise and natural in each language. |
| `/papers/` | `Paper Log` and a system-oriented subtitle. | `Paper Lab` branding makes a personal reading record sound like an application. Empty state begins with a prescribed workflow instead of permission to start small. | Rename public navigation to Papers/논문 and use `Paper Notes` / `논문 기록`. Apply the approved introduction and empty state; retain a shortened three-pass method. |
| `/queue/` | `Paper Reading Queue`, described as a triage board. | Product vocabulary is heavier than the empty state needs. | Use a plain reading-list description and one next action. Keep filter labels only when data exists. |
| `/reviews/` | `Review Due System`, described as a spaced revisit loop. | Sounds like product documentation. | Use `Reviews due` / `복습할 논문` and explain that papers appear when it is time to revisit a note. |
| `/formula/` | `Formula Recall Trainer`. | `Trainer` and implementation instructions dominate the empty state. | Use `Formula recall` / `수식 다시 쓰기`; state what to add to a paper note in one sentence. |
| `/questions/` | `AI Question Bank`. | `AI` overstates the source and turns a personal question list into a feature. | Use `Questions` / `질문` and describe questions gathered from reading and review. |
| `/implementations/` | `Paper-to-code attempts`. | Mostly concrete, but `shipped research tools` reads like a product ledger. | Use `Implementation notes` / `구현 기록`; keep reproduced, partial, failed, and completed states factual. |
| `/graph/` | `Connected research outputs`. | Talks about eligibility, meaningful items, and seed exclusion in public empty copy. | Use `Connections` / `연결` and a short empty message. Keep thresholds out of public prose. |
| `/week/` | `Research weeks` and a quantified eligibility explanation. | Public copy exposes the rule used to qualify a weekly review. | Use `Weekly notes` / `주간 기록`; say there is no completed weekly note yet without explaining thresholds. |
| `/growth/` | `Research momentum`; Korean `연구 흐름`. | Presented as self-evaluation, with evidence gates, confidence, public-feed snapshots, and score qualification. | Keep `/growth/`, rename presentation to Activity/활동 기록 and Research Activity/연구 활동. Use the approved simple introduction and insufficient-data state. Put source methodology in secondary technical details only. |
| `/now/` | `Current focus`; Korean `현재 초점`. | Repeats Research questions and VLA architecture phrasing. | Use `Now` / `요즘 하는 일`; keep only timely reading, building, and questions in ordinary sentences. |
| `/contact/` | `Public links`. | `Public channels` is impersonal but otherwise truthful. | Use a short invitation and render only populated links. Do not imply unavailable contact methods. |
| `/404` | Suggests continuing through `Paper Lab`. | Product label appears in a basic recovery message. | Use a concise error explanation and links to Research, Writing, and Papers. |

## Shared UI And Metadata

| Area | Current issue | Proposed change |
| --- | --- | --- |
| Header | Brand itself is already name-only, but accessibility signatures and navigation use `Paper Lab` and `Growth`. | Keep only `Gnaroshi` in the brand; rename visible destinations to Papers and Activity. |
| Footer | Repeats the unsupported professional role. | Use `Notes on AI, software, and research.` / `AI와 소프트웨어, 연구에 관한 기록.` |
| Home SEO / Open Graph | Includes professional title and VLA/research-infrastructure positioning. | Title `Gnaroshi`; use the approved concise EN/KO descriptions. |
| Default SEO | Falls back to English `profile.shortBio` on pages that omit a description. | Use locale-aware, activity-based defaults. |
| Person JSON-LD | Emits `jobTitle` and `homeLocation`. | Keep name, URL, description, and verified GitHub link only. |
| RSS | Title is acceptable; description inherits the overtechnical Writing introduction. | Use the rewritten Writing introduction. |
| Buttons | `View research`, `Read writing`, and `View paper log` vary unnecessarily. | Use direct nouns where approved: Research, Writing, Papers. |
| Empty states | Several describe eligibility thresholds, feed state, or authoring mechanics. | State what is absent, why the page is still useful, and one next action. |
| Island copy | Mostly functional, but score/evidence language is overused and some Korean strings are literal. | Preserve required scoring semantics inside detailed tools while making labels direct and avoiding intelligence/self-evaluation framing in overview copy. |

## Facts And Ownership

- Keep shared facts such as IDs, slugs, links, dates, status, tags, code languages, and verified technical properties in `src/data/facts/`.
- Remove `locationCode`; it has no approved public use.
- Remove localized `currentRole` and `location`; neither is needed to render a truthful page.
- Keep English and Korean prose independent in `src/data/locales/` and `src/i18n/`.
- Do not infer a degree, university, lab name, affiliation, job, publication, award, or more specific location.

## Approval Basis

The replacement Home, About, Research, Projects, Writing, Papers, Activity, footer, and SEO copy comes directly from the owner-supplied brief. Supporting labels and empty states follow the same modest, concrete voice without adding facts.
