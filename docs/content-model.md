# Content Model

## Overview

The site should be content-first. Most updates should require editing a Markdown/MDX file or `src/data/profile.ts`.

Primary content locations:

- Blog posts: `src/content/blog/`
- Paper logs: `src/content/papers/`
- Projects: `src/content/projects/`
- Static profile data: `src/data/profile.ts`

## Slug Rules

Prefer explicit slugs in frontmatter when the URL should be stable. Otherwise derive slugs from filenames.

Recommended filename style:

```text
YYYY-MM-DD-short-title.mdx
```

For paper logs, prefer:

```text
YYYY-MM-DD-first-author-short-title.mdx
```

URLs should remain stable after publication. If a slug changes later, add redirects if the site has already been public.

## Blog Post Schema

Recommended frontmatter:

```yaml
title: "Post title"
description: "Short description"
pubDate: 2026-07-09
updatedDate:
draft: false
tags:
  - ai
  - research
series:
seriesOrder:
heroImage:
readingTime:
featured: false
```

Required fields:

- `title`
- `description`
- `pubDate`
- `draft`
- `tags`

Optional fields:

- `updatedDate`
- `series`
- `seriesOrder`
- `heroImage`
- `readingTime`
- `featured`
- `ogImage`
- `canonicalUrl`

Draft behavior:

- `draft: true` posts can appear during local development.
- `draft: true` posts are hidden from production builds.

Tag behavior:

- Tags should remain lowercase kebab-case.
- Tag pages are generated at `/blog/tags/[tag]`.

Blog content supports MDX, equations, code examples, table of contents, series navigation, RSS, and static detail pages.

## Paper Log Schema

Recommended frontmatter:

```yaml
title: "Paper Title"
authors:
  - "Author A"
  - "Author B"
venue: "arXiv"
year: 2026
paperUrl: ""
codeUrl: ""
projectUrl: ""
readDate: 2026-07-09
lastReviewed:
status: "pass1"
depth: "skim"
priority: "medium"
difficulty: 3
readingTimeMinutes: 60
tags:
  - ai
  - paper-reading
relatedTopics:
  - "TODO"
abstract: ""
sourceExcerpt: ""
selfScore:
  overall: 70
  confidence: "medium"
  note: "I think I understood the core idea but not the formula."
selfReflection: ""
reviewVisibility: "public"
oneLineSummary: "One sentence summary in my own words."
coreQuestion: "What problem is this paper trying to solve?"
coreIdea: "What is the key idea?"
mainFormula: ""
formulaInterpretation: ""
experimentTakeaway: ""
strengths:
  - "TODO"
weaknesses:
  - "TODO"
myConnection: ""
nextAction: ""
reviewAfterDays: 7
featured: false
draft: false
```

Required fields:

- `title`
- `authors`
- `venue`
- `year`
- `status`
- `depth`
- `priority`
- `difficulty`
- `readingTimeMinutes`
- `tags`
- `oneLineSummary`
- `coreQuestion`
- `coreIdea`

Optional AI review fields:

- `abstract`: optional source text for review context.
- `sourceExcerpt`: optional manually pasted source excerpt for review context.
- `selfScore`: optional self-assessment object with `overall`, `confidence`, and `note`; legacy numeric 0-100 values are still accepted.
- `selfReflection`: optional reflection before AI review.
- `reviewVisibility`: `public` or `hidden`; defaults to `public`.

`readDate` is required unless `status` is `planned`.

Allowed `status` values:

- `planned`
- `pass1`
- `pass2`
- `pass3`
- `read`
- `implemented`
- `abandoned`

Allowed `depth` values:

- `skim`
- `understand`
- `deep`
- `reproduce`
- `implement`

Allowed `priority` values:

- `low`
- `medium`
- `high`

Allowed `difficulty` values:

- `1`: easy or mostly familiar.
- `2`: moderate.
- `3`: challenging.
- `4`: hard.
- `5`: very hard or requires background study.

## Paper Note Body Structure

Use consistent headings:

```mdx
## Why I Read This

## Pass 1: Skim

## Pass 2: Structure

## Pass 3: Deep Dive

## Questions

## Implementation Notes

## Links
```

Not every section must be complete. Partial progress is valuable.

To create a draft paper log, run:

```bash
npm run paper:new
```

This creates `src/content/papers/YYYY-MM-DD-untitled-paper.mdx` and appends `-2`, `-3`, etc. if needed. Generated logs default to `draft: true`.

## Project Schema

Recommended frontmatter:

```yaml
title: "Project title"
description: "Short project summary."
startedAt: "2026-01-01"
updatedAt: "2026-01-15"
status: "active"
tags:
  - ml-systems
  - visualization
repoUrl: "https://github.com/..."
demoUrl: ""
paperUrl: ""
featured: true
```

Allowed `status` values:

- `active`
- `paused`
- `complete`
- `archived`

Project pages should emphasize:

- Problem.
- Approach.
- Technical decisions.
- Results.
- Lessons.
- Links.

## Profile Data

`src/data/profile.ts` should be the primary editable identity source.

Recommended shape:

```ts
export const profile = {
  siteName: "Gnaroshi",
  domain: "https://gnaroshi.dev",
  name: "Gnaroshi",
  role: "AI/software researcher",
  location: "",
  bio: "",
  interests: [],
  skills: [],
  education: [],
  links: {
    github: "https://github.com/Gnaroshi",
    email: "",
    scholar: "",
    linkedin: "",
  },
};
```

Do not duplicate profile data across many pages. Pages should import from this module.

## Tags

Tags should be lowercase kebab-case:

```text
diffusion-models
robot-learning
ml-systems
paper-reading
```

Tag pages are optional for MVP. Index pages should still expose tags.

## Drafts

Draft content should not be listed or rendered in production builds unless explicitly configured. Prefer `draft: true`.

## Content Acceptance Criteria

The content model is correctly implemented when:

- Build-time schema validation catches missing required fields.
- Blog posts, paper logs, and projects can be added independently.
- Profile identity is editable in one data file.
- Paper stats can be computed from paper frontmatter.
- Incomplete paper notes are valid and useful.
