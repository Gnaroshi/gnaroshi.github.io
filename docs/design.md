# Design Direction

## Identity

Gnaroshi is a personal academic and research site for an AI/software researcher. It should feel personal, technical, clean, and research-oriented. It is not a company site, not a lab homepage, and not a portfolio template.

The design should make writing, reading, and research activity feel primary. Visual style should support dense technical content without feeling crowded.

## Audience

- AI researchers who want to understand research interests and technical depth.
- Lab members who want to read notes, logs, and project writeups.
- Recruiters and collaborators who need a concise signal of background, work, and contact links.
- Future self, using the site as an external memory for papers, questions, experiments, and progress.

## Principles

1. Blog-first and research-note friendly.
2. Minimal academic homepage, not marketing.
3. Dense but readable.
4. Fast page loads and low JavaScript.
5. Clear hierarchy for long-form technical writing.
6. Mobile friendly without hiding important content.
7. Accessible by default.
8. Static-export compatible.

## Visual Language

Use a restrained academic interface:

- Neutral background.
- High-contrast text.
- One quiet accent color for links, active filters, and focus states.
- Strong typography over decoration.
- Thin dividers and whitespace instead of heavy cards.
- Subtle code and math styling.
- No heavy animation.
- No decorative gradient blobs, oversized hero art, or corporate landing-page sections.

The homepage may have personality, but it should remain text-forward and direct.

## Layout

Use a global shell with:

- Header with site name and primary navigation.
- Main content area with a readable max width.
- Wider layout option for dashboards such as `/papers`.
- Footer with links, RSS if implemented, and small metadata.

Suggested widths:

- Standard prose: `min(100% - 32px, 760px)`.
- Research/project index: `min(100% - 32px, 1040px)`.
- Paper dashboard: `min(100% - 32px, 1180px)`.

The first viewport of `/` should immediately identify:

- Name/site identity.
- Research/software focus.
- Current interests.
- Links to blog, papers, research, projects, GitHub, and contact.

Avoid generic hero copy. The homepage should read like a concise personal academic page.

### Information Architecture

Primary navigation is limited to six destinations:

- Home
- Research
- Projects
- Writing
- Paper Lab
- About

Growth is a utility destination. Now and public links belong in the homepage, About, and footer. Paper workflow tools stay grouped under a local Paper Lab navigation instead of competing in the global header.

### Visual Modes

Editorial mode covers Home, About, Research, Projects, Writing, and long-form detail pages. It uses narrative hierarchy, generous whitespace, narrow prose, and dividers before cards.

Application mode covers Paper Lab workflows and Growth. It uses compact controls, explicit state, one primary action, semantic surfaces, and progressive disclosure. It must not turn empty routes into zero-filled dashboards.

## Typography

Typography is the main visual asset.

Recommended direction:

- Use system fonts first unless a font dependency is intentionally chosen.
- Body: readable sans-serif or serif; prioritize rendering speed.
- Code: system monospace.
- Line height: generous for prose, tighter for metadata.
- Headings: compact and descriptive.
- Avoid negative letter spacing.
- Do not scale font sizes directly with viewport width.

Long-form pages need:

- Clear heading hierarchy.
- Table of contents where useful.
- Legible inline code and code blocks.
- Good spacing around equations, figures, callouts, and lists.

## Color And Theme

Keep design tokens in one place, likely `src/styles/tokens.css`.

Token categories:

- Backgrounds: page, muted, elevated.
- Text: primary, secondary, muted, inverse.
- Border: default, strong.
- Accent: link, hover, active.
- Status: skim, structured, deep, implemented, blocked.
- Heatmap levels: 0 through 4.

Light/dark theme support is desirable if it does not complicate MVP. Prefer CSS custom properties and `prefers-color-scheme`. If adding a manual theme toggle, implement it as a small isolated island.

## Components

Expected components:

- `SiteHeader`
- `SiteFooter`
- `PageTitle`
- `Prose`
- `TagList`
- `MetadataLine`
- `PostList`
- `ProjectCard`
- `PaperCard`
- `PaperHeatmap`
- `PaperFilters`
- `ReadingStats`
- `TableOfContents`

Component boundaries should reflect behavior and content type. Do not put content-specific personal data inside reusable UI components.

## Paper Dashboard UI

The `/papers` page grows with the record:

- At 0 papers, show one onboarding action, a short reading method, and a collapsed note template.
- At 1-2 papers, show a compact note list and activity summary.
- At 3+ papers, reveal the heatmap and basic filters.
- At 2+ AI reviews, reveal review aggregates.
- At 3+ oral exams, reveal retrieval trends.
- At 4+ weeks, reveal longitudinal analysis.

The dashboard can use React islands for filtering and sorting. The content source remains static MDX/Markdown.

## Evidence States

Public metrics require evidence, not merely available fields. Before eligibility, use honest labels such as `Collecting evidence`, `In progress`, and `Not ready yet`. Never use seed writing, hidden content, demo records, or empty generated files as achievements. Empty application pages should render static guidance with one next action and no unnecessary island hydration.

## Accessibility

Minimum requirements:

- Semantic HTML landmarks.
- Keyboard-accessible navigation and filters.
- Visible focus states.
- Sufficient color contrast in both themes.
- Correct heading order.
- Descriptive link text.
- Avoid interaction that requires hover only.
- Respect reduced motion.

## Animation

Use little to no animation. Acceptable uses:

- Small focus or hover transitions.
- Theme transition if subtle.
- Heatmap hover states.

Avoid page-load animation, scroll animation, parallax, and motion-heavy effects.

## Design Acceptance Criteria

A future implementation satisfies this document when:

- The site loads fast and remains mostly static.
- The homepage clearly introduces Gnaroshi as an AI/software researcher.
- Blog and paper pages are more prominent than decorative presentation.
- Technical writing is comfortable to read on desktop and mobile.
- The paper dashboard reveals density only when data supports it and offers focused onboarding when empty.
- Styling decisions are centralized through tokens.
- No corporate or lab-homepage visual pattern dominates the site.
