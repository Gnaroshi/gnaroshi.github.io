# Design Audit v2

Baseline commit: `2a53402d4a336d15bdefee503925e50f224943ff`

Audit viewports:

- 1440 x 1000
- 1024 x 768
- 390 x 844
- light and dark themes

Temporary screenshots are stored under ignored `artifacts/design-audit-v2/`.

## Baseline Findings

### Information hierarchy

- The homepage opens with a description of the site product and then repeats eight numbered feature sections. The person, current work, and evidence of work are secondary.
- Editorial pages and application tools share the same card-heavy visual grammar, so long-form writing feels like a dashboard.
- Paper Lab features are presented as peer destinations instead of one coherent research workflow.

### Repeated content

- Three public blog posts appear as featured cards, recent cards, and a complete client-side search result list.
- The homepage repeats the reading loop, Paper Log, oral exam, growth, writing, project, and research descriptions as separate product pitches.
- `gnaroshi.dev`, its paper tracker, and its workflow notes are presented as three projects even though they are one system.

### Empty-data problems

- Paper, queue, review, question, formula, implementation, graph, and week pages expose empty dashboards or zero grids before meaningful records exist.
- React islands hydrate empty datasets for papers, queue, reviews, questions, and formula practice.
- Seed blog posts produce a numeric Research Momentum score and a weekly review despite no public paper or retrieval evidence.

### Navigation

- Nine primary destinations wrap across multiple header rows on narrow screens.
- `Now` and `Contact` compete with primary research destinations.
- Paper workflow routes are scattered across page-level action bars rather than grouped in local navigation.

### Mobile behavior

- The existing header relies on wrapping links instead of a controlled mobile menu.
- Dashboard action rows and repeated metric cards produce excessive vertical scanning.
- No page-level horizontal overflow was found in the previous QA, but navigation wrapping is uncontrolled.

### Dark mode

- Contrast is acceptable, but repeated bordered surfaces become visually dense in dark mode.
- Application and editorial modes are not visually distinct.

### Accessibility

- Skip links, focus-visible styles, theme controls, and heatmap keyboard navigation already work and must be preserved.
- The primary navigation has no mobile disclosure pattern, Escape behavior, or focus-return contract.
- Empty interactive islands add controls without useful state or outcomes.

### Misleading metrics

- Research Momentum averages only available components and counts seed site-description posts as research output.
- The current generated week describes three seed blog posts as weekly research progress.
- The graph maps site metadata and seed tags, which overstates the amount of research knowledge represented.

### Routes to gate until meaningful data exists

- `/graph`: onboarding state until at least 5 meaningful nodes and 3 meaningful non-tag edges.
- `/week`: onboarding or in-progress state until at least 2 meaningful events exist.
- Advanced Paper Log stats, heatmap, filters, AI review aggregate, and longitudinal trends: progressively reveal by evidence count.
- Queue, review, formula, question, and implementation dashboards: keep routes, but replace zero dashboards and empty islands with one next action.

## Remediation Decisions

### Resulting information architecture

- Primary navigation now has six destinations: Home, Research, Projects, Writing, Paper Lab, and About.
- Growth remains a utility; Now and Links moved to the footer and contextual page sections.
- Queue, reviews, formula recall, question bank, implementations, weekly reviews, and graph remain available through a grouped Paper Lab navigation.
- Mobile navigation is a controlled disclosure with Escape handling, focus return, focus containment, and body scroll lock.

### Evidence and empty states

- Numeric Momentum is gated behind five meaningful events, three active dates, two categories, and one core research-loop category.
- Seed blog posts and all draft/system content explicitly opt out of metric, graph, and weekly-review eligibility.
- The current week is `In progress`; the generated research graph is empty and ineligible rather than representing seed tags as research knowledge.
- Paper Log reveals onboarding at zero papers, compact activity at one or two, and filters/heatmap at three or more.
- Empty Paper Lab routes render one static next action and do not hydrate React islands.

### Visual system

- Editorial pages use typography, whitespace, and dividers. Application pages use denser semantic surfaces and local workflow navigation.
- The former monolithic stylesheet is split into base, blog, papers, insights, exams, responsive, navigation, application, and homepage modules.
- Tokens now cover elevated/quiet surfaces, text and border tiers, semantic research states, responsive widths, interaction timing, and Korean-ready system font fallbacks.

### Verification

- Baseline and final screenshots cover 17 routes in light/dark mode at 1440x1000, 1024x768, and 390x844. They remain under ignored `artifacts/design-audit-v2/`.
- Playwright verifies routes, browser errors, mobile overflow, navigation behavior, empty states, and visual output.
- axe verifies representative editorial/application routes and visible keyboard focus.
- Build checks validate public copy, evidence eligibility, internal links, and empty shells.

### Remaining factual profile gaps

The site intentionally hides these until the owner provides them: legal or public full name beyond the Gnaroshi alias, affiliation, education history, public email, CV, Scholar profile, LinkedIn, and profile image.
