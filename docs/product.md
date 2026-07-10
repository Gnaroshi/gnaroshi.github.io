# Product Specification

## Project

- Site name: Gnaroshi
- Domain: https://gnaroshi.dev
- Repository: Gnaroshi/gnaroshi.github.io
- Type: personal homepage, research blog, and paper reading tracker.

## Product Purpose

Gnaroshi should be the public home for one AI/software researcher. It should introduce the person, document research interests, publish serious technical writing, and track daily paper reading activity.

The site should be easy to maintain by committing Markdown or MDX files. It should avoid backend infrastructure, account systems, databases, or complex admin tooling in the MVP.

## Core Goals

1. Introduce Gnaroshi as an AI/software researcher.
2. Serve as the personal homepage for gnaroshi.dev.
3. Publish technical notes, research logs, paper summaries, and project writeups.
4. Track papers read every day.
5. Show GitHub-contribution-style paper reading activity.
6. Support efficient reading through a three-pass paper reading method.
7. Make content updates simple through Markdown or MDX commits.
8. Deploy cleanly through GitHub Pages and the custom domain.

## Audience

Primary audiences:

- AI researchers.
- Lab members.
- Recruiters and collaborators.
- Future self.

The site should assume visitors may be technically fluent. It does not need to over-explain common research or software terms.

## Tone

The writing and interface should be:

- Personal.
- Technical.
- Clean.
- Research-oriented.
- Direct.

Avoid:

- Corporate voice.
- Marketing-heavy copy.
- Lab homepage framing.
- Generic portfolio template language.

## Main Routes

Primary navigation contains Home, Research, Projects, Writing, Paper Lab, and About. Growth is a utility. Now and Links remain public but do not compete in the primary navigation. Existing learning-loop routes are grouped under Paper Lab.

### `/`

Personal landing page.

Must include:

- Short identity statement.
- Current research/software focus.
- Direct links to writing and research, with Now and public links available in the page body or footer.
- Recent blog posts.
- Recent paper notes or reading activity.
- Selected projects or research interests.

### `/about`

Bio, education, research background, skills, and links.

Data should primarily come from `src/data/profile.ts`.

### `/research`

Research interests, current questions, reading map, and open problems.

This page should feel like a working research map rather than a polished lab statement.

### `/projects`

Selected projects and technical case studies.

Do not split one system into several projects unless each item has a distinct repository, artifact, or outcome. Lightweight project metadata can live in `src/data/projects.ts`; substantial writeups should have detail routes or MDX content.

### `/blog`

General blog index.

Must support:

- Tags.
- Series if available.
- Excerpts.
- Dates.
- Reading time.

### `/blog/[slug]`

Blog detail page.

Must support:

- MDX content.
- Table of contents.
- Code highlighting.
- Math support.
- SEO metadata.
- Open Graph metadata.

### `/papers`

Progressive paper reading workspace.

At sufficient data volume it can include:

- Daily activity heatmap.
- Current streak.
- Longest streak.
- Papers this week/month/year.
- Deep reads.
- Implemented/reproduced papers.
- Search.
- Filters.
- Sorting.
- Paper cards or rows.

At zero papers it must not show zero-filled stats, heatmaps, filters, AI aggregates, or hydrated empty islands. It should explain the first useful note and keep the full template collapsed.

### `/papers/[slug]`

Individual paper note.

Must include:

- Bibliographic metadata.
- Reading status and depth.
- Three-pass notes.
- Questions.
- Implementation/reproduction notes if any.
- Related links and tags.

### `/now`

Current focus, current reading, and current projects.

This should be easy to update manually.

### `/contact`

Contact links.

Should include only intentionally public contact channels.

## MVP Scope

MVP includes:

- Astro static site.
- TypeScript.
- MDX content.
- Blog system.
- Paper content collection.
- Paper dashboard from local content.
- Static profile data.
- Responsive layout.
- Design tokens.
- GitHub Pages deployment.
- Custom domain support.

## Explicitly Out Of Scope For MVP

- Backend server.
- Database.
- OAuth.
- User accounts.
- Comments.
- CMS.
- Analytics requiring invasive tracking.
- Search service dependency.
- Heavy animation framework.
- Client-side app shell that replaces static pages.

## Success Criteria

The project is successful when:

- A visitor can understand who Gnaroshi is within 10 seconds of opening `/`.
- A researcher can quickly find interests, papers, projects, and writing.
- Adding a blog post requires one canonical MDX record in `gnaroshi-writing`, validated and published through Studio.
- Adding a paper log requires one canonical MDX record in `gnaroshi-paper-lab`, validated and published through Studio.
- Paper reading activity is derived from committed public reading-session evidence in the generated feed.
- The site builds as a static artifact.
- Deployment to GitHub Pages is reproducible through GitHub Actions.
- Seed, hidden, unlisted, demo, and system content never become public research metrics.
- A numeric Research Momentum score appears only after the evidence gate passes.
- Empty Paper Lab tools remain useful without dominating the public site.
