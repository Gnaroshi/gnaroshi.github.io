# Public System Workflow

## Purpose

The website explains how private work becomes public without exposing the current state of private repositories. Home shows a compact, stable description of repository roles. The `gnaroshi.dev` project detail shows the complete public architecture.

Gnaroshi Studio owns operational status such as uncommitted changes, source diffs, validation failures, publish confirmation, and deployment monitoring. Those details change frequently and can include private information, so they do not belong on the public website.

## Information Boundary

The public workflow includes only stable facts about six repositories:

- `gnaroshi-paper-lab`: private paper notes and reading work.
- `gnaroshi-writing`: private drafts, translations, and writing assets.
- `gnaroshi-studio`: private authoring, validation, Git, and publishing control.
- `gnaroshi-api`: private optional AI request service.
- `gnaroshi-content-feed`: public generated publication data.
- `gnaroshi.github.io`: public presentation and deployment.

Private repository cards are never links. The public feed and website cards link only to their public GitHub repositories. The workflow never shows private URLs, branch names, dirty state, unpublished commits, private CI state, API health, credentials, or file counts.

## Ownership

`src/data/facts/systemArchitecture.ts` is website-owned. Repository roles and connections exist even when the public content feed is in `bootstrap-empty` state, so they are not publication records and do not belong in `gnaroshi-content-feed`.

Localized titles, descriptions, responsibilities, and exclusions live in `src/data/locales/en.ts` and `src/data/locales/ko.ts`. The facts file contains no localized prose.

## Variants

`SystemWorkflow.astro` renders both variants from the same facts and localized copy. `SystemFlowDiagram.astro` uses `@dagrejs/dagre` at build time to place the directed graph and emits static SVG only:

- `compact`: replaces the former Home Research Loop section. It shows one directed graph and one link to the full architecture.
- `full`: appears at `/projects/gnaroshi-dev/#repository-workflow` and its Korean counterpart. The directed graph remains primary; repository responsibilities, exclusions, and public links are in one collapsed secondary section, followed by optional public build provenance.

The graph uses localized SVG titles/descriptions and a screen-reader-only ordered text fallback. Connectors are decorative. Step numbers use explicit center coordinates, `text-anchor="middle"`, and `dominant-baseline="central"`.

## Responsive Behavior

Mobile receives a Dagre top-to-bottom layout; tablet and desktop receive a left-to-right layout. Both are built statically from the same facts. No route hydrates a graph island or requires horizontal scrolling.

## Public Build Details

The collapsed build details use the existing static `getWebsiteBuildInfo()` mechanism. They may display only:

- website commit
- public content-feed commit
- UTC build time
- feed schema version

No browser-side GitHub request is made. Private source commits from the feed manifest are intentionally excluded.
