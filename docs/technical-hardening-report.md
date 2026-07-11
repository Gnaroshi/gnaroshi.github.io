# Technical Hardening Report

Date: 2026-07-11

## Scope

This pass hardens the existing presentation application without changing its product surface or visual direction. The source remains static Astro, the public feed remains the only blog/paper input, and no backend or analytics dependency was added.

## Route Asset Boundaries

`BaseLayout.astro` imports only design tokens, base/typography/accessibility rules, and navigation. Feature styles are loaded by the routes that use them:

- Writing indexes load `blog.css`.
- Blog details load blog, prose, and code styles. KaTeX is linked only when the source contains math syntax.
- Paper Lab routes load application and paper styles. Formula routes add code styles; paper details add prose and conditional KaTeX.
- Growth loads application and insight styles. Graph and implementation views add their required paper/insight rules.
- Empty application routes do not hydrate search, filter, graph, or chart islands.

The deterministic gzip, initial-image, and island measurements are recorded in [route-budget-report.md](route-budget-report.md). Chromium coverage in `npm run test:performance` reports unused CSS separately.

## Performance Budgets

`performance-budget.json` establishes initial route budgets:

- CSS: 70 KiB gzip maximum.
- JavaScript: 80 KiB gzip maximum.
- Initial eager images: 500 KiB maximum.
- Mobile synthetic LCP: 2.5 seconds.
- CLS: 0.1.
- INP: 200 ms field target.

The static report is deterministic and suitable for blocking CI. Browser coverage/LCP/CLS runs in the manually dispatched `performance.yml` workflow so content-only changes do not depend on unstable network or Lighthouse conditions. INP is not claimed from a local static build; it remains a real-user field target.

## Search And Metadata

- Default social previews are English and Korean 1200x630 PNG files. SVG source files remain only as editable sources.
- Open Graph includes image dimensions and alt text.
- Article pages support published/modified timestamps, tags, and author metadata.
- Home emits factual `Person`, `WebSite`, and `ProfilePage` JSON-LD.
- Blog index/details emit `Blog` and `BlogPosting`.
- Project details emit `SoftwareSourceCode` when a repository exists, otherwise `CreativeWork`.
- Paper notes emit `TechArticle` with a `ScholarlyArticle` citation for the original paper.
- Detail pages emit `BreadcrumbList` through the reusable breadcrumb component.
- Empty tools, diagnostics, unlisted records, aliases, practice subroutes, and 404 pages use `noindex, follow` where appropriate.
- The sitemap is pruned after build using the rendered robots/redirect state, so unlisted/noindex pages cannot leak back into discovery.

Unknown values such as affiliation, email, formal education, and unpublished identity fields are omitted rather than inferred.

## Localized 404

GitHub Pages serves root `404.html` for unknown paths. That document contains English and Korean recovery views, chooses Korean only for a preserved `/ko/` path, updates `lang`, title, and description, and never redirects. `/ko/404/` remains a direct localized QA route. Both are noindex.

## Link And Output Validation

`npm run check:links` parses the built HTML/XML and validates:

- internal route and fragment existence
- canonical and hreflang targets
- RSS and sitemap targets
- stylesheet, script, image, preload, and srcset assets
- alias redirect targets, noindex state, and redirect loops
- JSON-LD parseability and basic shape
- safe URL schemes and `_blank` rel protection
- absence of local user, server, dataset, and workspace paths

The weekly/manual external-link workflow has bounded timeouts and retries. It reports failures by default; `STRICT_EXTERNAL_LINKS=true` makes it blocking when intentionally requested.

## Theme And Accessibility

Theme changes update `data-theme`, the accessible toggle label, icon state, and `meta[name="theme-color"]`. System color-scheme changes are followed only when no explicit local preference exists. Reduced-motion rules remain active.

## Security And Privacy

- Referrer policy is `strict-origin-when-cross-origin`.
- Unsafe `javascript:`, `file:`, and arbitrary `data:` links/assets fail the built-site check.
- Public feed assets remain content-addressed and validated by the canonical feed contract.
- JSON-LD serialization escapes `<` and line-separator characters before inline output.
- MDX is accepted only from the validated public feed. Raw HTML remains part of Astro/MDX's trusted build input and is not accepted from runtime users.

### CSP Decision

No CSP meta tag was added. Astro's inline theme initialization, generated module assets, KaTeX fonts, optional future analytics, and content-addressed images need route-aware directives. A meta policy cannot express all HTTP CSP behavior and would be brittle on GitHub Pages. If the site is placed behind Cloudflare, set and test a report-only `Content-Security-Policy` response header there, then promote it after collecting violations. Do not add a broad `unsafe-inline` policy merely to claim CSP coverage.

## Public Repository Audit

`Gnaroshi/gnaroshi_vla` was audited at commit `85b78603851aeb58cf0bc47e7dbc78baf8c4099b`.

Findings:

- Public README and generated research documentation include `/home/mingyujung/...` workspace, checkpoint, dataset, and generated-image paths.
- Executable YAML includes machine-specific roots. Those values must not be changed as a documentation cleanup because they may be active runtime configuration.
- The copied Seer tree retains its Apache-2.0 `LICENSE`; nested MuJoCo assets retain their BSD license.
- The repository root has no declared license, so the repository's own code has no clear reuse grant. This must be decided by the owner rather than inferred.
- SimVLA is described as an external clean clone and is gitignored in the audited tree; its upstream attribution is present in architecture documentation.

Documentation-only path sanitization was merged separately through [`gnaroshi_vla` PR #1](https://github.com/Gnaroshi/gnaroshi_vla/pull/1). Runtime YAML requires an explicit configuration migration to environment variables such as `$VLA_WORKSPACE_ROOT` and `$LIBERO_ROOT`, followed by experiment smoke tests.

## Runtime And Dependency Maintenance

- `.node-version` and `engines.node` select Node 24.
- Actions use `.node-version` and are pinned to immutable commits with version comments.
- Dependabot groups Astro, test, and Actions updates; major npm upgrades are not automated.
- `linkedom` is a build/test-only DOM parser and is not shipped to clients.

## Known Limits

- Synthetic local LCP and CSS coverage are regression signals, not substitutes for production field data.
- GitHub Pages cannot set CSP, Permissions-Policy, or other HTTP security headers without a proxy.
- Current public feed state is intentionally empty, so application-route budgets represent honest empty states. Feed fixtures cover populated blog, paper, review, implementation, graph, translation, alias, and privacy states.

## Verification Results

- `npm run content:check`: schema-v1 bootstrap feed passed.
- `npm run check`: 207 files, zero diagnostics.
- `npm run build`: 40 static pages; 21 noindex/redirect routes removed from sitemap.
- `npm run check:i18n`: 253 page keys and 341 island keys in exact EN/KO parity.
- `npm run check:links`: 1,863 internal targets and all metadata/asset/privacy checks passed.
- `npm run test:feed-contract`: 11 valid feed builds passed and 5 invalid feeds were rejected.
- `npm run test:e2e`: 58 tests passed.
- `npm run test:a11y`: 31 axe tests passed.
- `npm run test:visual`: 18 desktop/tablet/mobile light/dark tests passed.
- `npm run test:performance`: 7 route budgets passed; observed CLS was 0.000 and no empty route hydrated an island.
- `npm run check:links:external`: 2 external URLs passed the report-only audit.
