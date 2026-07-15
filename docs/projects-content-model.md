# Projects content model

Projects are website-owned public portfolio records. The registry contains exactly eight entries: two selected projects and six managed applications. Adding a GitHub repository does not add it to the public portfolio automatically.

## Shared facts

`src/data/facts/projects.ts` owns stable, non-localized facts:

- `id`, `slug`, and discriminated `kind`
- product status and content stage
- platforms and verified technology IDs
- public links and portfolio grouping
- scenario ID, stable step IDs, media IDs, and demo-data state
- application-only distribution, data owner, Studio integration state, and source provenance

The three project kinds are `research`, `application`, and `infrastructure`. Application-only fields cannot appear on research or infrastructure records. Private repository URLs are never valid public links.

The index keeps selected work separate from applications. Application cards use the shared `applicationGroup` fact to distinguish research workflow, system utility, and learning tool roles without duplicating that classification in localized prose.

Application evidence is a discriminated pair. A current owner-approved capture uses a non-null `primaryShowcaseId` and a null `textOnlyExemption`. When an interface changes before a new capture is approved, the record instead uses a null `primaryShowcaseId` and an internal non-empty `textOnlyExemption`; the page omits stale media and renders the verified text workflow. The exemption is validation context and is never public copy.

## Localized stories

`src/data/projectStories.ts` owns prose only. English and Korean each provide `cardSummary`, `heroSummary`, `overview`, audience, primary use, key features, privacy, current state, limitations, milestones, scenario copy, and kind-specific detail copy.

Stable scenario IDs and step IDs remain in shared facts. `npm run check:project-copy` rejects translation drift and incomplete stories.

## Presentation

`ProjectDetailView.astro` owns route lookup, metadata, structured data, related writing, and public links. It delegates the body to exactly one component according to `project.kind`:

- `ResearchProjectDetail.astro`
- `ApplicationProjectDetail.astro`
- `InfrastructureProjectDetail.astro`

This prevents application integration copy from forcing research and infrastructure pages into the same outline.
