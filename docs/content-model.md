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
description: "Short summary for index pages and SEO."
publishedAt: "2026-01-15"
updatedAt: "2026-01-20"
draft: false
tags:
  - deep-learning
  - systems
series: "Optional series name"
seriesOrder: 1
canonicalUrl: ""
ogImage: ""
```

Required fields:

- `title`
- `description`
- `publishedAt`
- `draft`
- `tags`

Optional fields:

- `updatedAt`
- `series`
- `seriesOrder`
- `canonicalUrl`
- `ogImage`

Blog content should support MDX components for callouts, equations, figures, and code examples.

## Paper Log Schema

Recommended frontmatter:

```yaml
title: "Paper title"
slug: "optional-stable-slug"
authors:
  - "Author One"
  - "Author Two"
venue: "NeurIPS"
year: 2026
paperUrl: "https://arxiv.org/abs/..."
pdfUrl: "https://arxiv.org/pdf/..."
codeUrl: "https://github.com/..."
projectUrl: ""
readStartedAt: "2026-01-15"
lastReadAt: "2026-01-15"
status: "pass-1"
depth: 1
difficulty: 3
readingMinutes: 45
implemented: false
reproduced: false
tags:
  - diffusion
  - robotics
summary: "One or two sentence summary."
keyTakeaway: "The main thing worth remembering."
```

Required fields:

- `title`
- `authors`
- `year`
- `readStartedAt`
- `lastReadAt`
- `status`
- `depth`
- `difficulty`
- `readingMinutes`
- `implemented`
- `reproduced`
- `tags`
- `summary`

Allowed `status` values:

- `queued`
- `pass-1`
- `pass-2`
- `pass-3`
- `paused`
- `done`
- `revisit`

Allowed `depth` values:

- `0`: queued or metadata only.
- `1`: pass 1 skim.
- `2`: pass 2 structure understanding.
- `3`: pass 3 deep dive.
- `4`: implemented, reproduced, or extended.

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
