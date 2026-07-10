# Implementation Tracker

The implementation tracker records attempts to turn papers and research ideas into code. Failed and partial attempts are first-class because they preserve assumptions, constraints, and next actions.

## Routes

- `/implementations`: public implementation attempt index.
- `/implementations/[slug]`: one implementation attempt.

Paper detail pages show related implementation attempts when an attempt lists the paper slug in `relatedPapers`.

Project pages show related implementation attempts when an attempt lists a project slug in `relatedProjects`.

## Content Location

```text
src/content/implementations/
```

Use `_template.mdx` as the starting structure. Files beginning with `_` are not published.

## Frontmatter

```yaml
title: "Implementation Attempt Title"
date: 2026-07-10
status: "in-progress"
relatedPapers:
  - "paper-slug"
relatedProjects:
  - "paper-reading-tracker"
repoUrl: ""
demoUrl: ""
paperUrl: ""
goal: "What should this implementation test or reproduce?"
result: ""
failureReason: ""
lessons:
  - "What should future me remember?"
tags:
  - implementation
visibility: "public"
```

Allowed statuses:

- `planned`
- `in-progress`
- `reproduced`
- `partially-reproduced`
- `failed`
- `abandoned`
- `shipped`

## Visibility

Use `visibility: "hidden"` for private or unfinished attempts. Use `visibility: "unlisted"` when the detail page should build but the attempt should stay out of public indexes and graph generation.

Do not commit proprietary code, credentials, private experiment logs, or confidential dataset details.

## Project Slugs

Lightweight project card slugs currently live in:

```text
src/data/projects.ts
```

Use those slugs in `relatedProjects`.
