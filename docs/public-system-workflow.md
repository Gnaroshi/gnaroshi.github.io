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

`SystemWorkflow.astro` renders both variants from the same facts and localized copy:

- `compact`: replaces the former Home Research Loop section. It groups private sources, Studio and its optional AI sidecar, the public feed, and the website into four ordered stages. It contains one link to the full architecture.
- `full`: appears at `/projects/gnaroshi-dev/#repository-workflow` and its Korean counterpart. It adds repository roles, responsibilities, collapsed exclusions, public links, and optional public build provenance.

The workflow uses semantic sections, an ordered list, headings, text badges, and repository names. CSS connectors are decorative and hidden from assistive technology; the DOM order retains the complete meaning when CSS is unavailable.

## Responsive Behavior

On mobile, the four stages form a vertical source-to-output sequence. The API appears after Studio as an indented optional sidecar. At tablet and desktop widths, the two private sources share a row, Studio and the API share a row, and later stages can use available columns without changing DOM order. No stage requires horizontal scrolling.

## Public Build Details

The collapsed build details use the existing static `getWebsiteBuildInfo()` mechanism. They may display only:

- website commit
- public content-feed commit
- UTC build time
- feed schema version

No browser-side GitHub request is made. Private source commits from the feed manifest are intentionally excluded.
