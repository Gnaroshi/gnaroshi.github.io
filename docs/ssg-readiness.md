# SSG Readiness Notes

This project now has a working **SSR + prerender pipeline** that emits route-level static HTML, while preserving existing content and design.

## What currently works

### 1) Route-level prerender output
- `npm run build:static` now generates:
  - `dist/index.html`
  - `dist/news/index.html`
  - `dist/research/index.html`
  - `dist/publication/index.html`
  - `dist/people/index.html`
  - `dist/photo/index.html`
  - `dist/contact/index.html`
  - `dist/join/index.html`
  - `dist/test/index.html`
- Route list is centralized in `src/routes/routeDefinitions.js`.

### 2) Explicit route manifests for client + prerender
- Client (lazy pages): `src/routes/pageManifest.jsx`
- Prerender (eager pages): `src/routes/pageManifest.ssg.jsx`
- Client routes: `src/routes/AppRoutes.jsx`
- Prerender routes: `src/routes/AppRoutes.ssg.jsx`
- Shared base-path helpers: `src/routes/routerBasename.js`

### 3) Server render entry and prerender script
- SSR entry: `src/ssg/entry-server.jsx`
- Prerender tool: `scripts/prerender.mjs`
- Build scripts:
  - `build:client`
  - `build:ssr`
  - `prerender`
  - `build:static`
- `entry-server` applies router `basename` during prerender so generated links stay correct under subpath deployments (for example GitHub Pages repo paths).

### 4) Hydration-safe app bootstrap
- `src/main.jsx` now hydrates when prerendered HTML exists (`hydrateRoot`), and falls back to normal client rendering (`createRoot`) otherwise.

## Current architecture split (SSG-oriented)

### Shared shell/layout
- `App.jsx` / `App.ssg.jsx`
- `src/components/Nav.jsx`
- `src/components/MainContent.jsx`
- `src/components/Footer.jsx`

### Route/page content
- `src/pages/*` wrappers
- `src/components/tabs/*` page bodies

### Local content data (build-time friendly)
- Local JSON under `src/assets/dataset/`
- Data normalization helpers under `src/utils/` (for example `newsData.js`, `peopleData.js`)

### Client-only interactive pieces
- Photo gallery/lightbox behavior
- Scroll reveal observer
- Scroll progress / back-to-top behavior
- Mobile nav open/close state
- Route transition effects

## What still blocks “full static + island hydration”

1. **Hydration is still app-wide**
   - The site hydrates the full React tree at `#root`.
   - This is normal for React SPA + prerender, but not true selective island hydration.

2. **Client-only logic is embedded in React page/components**
   - Interactive modules are isolated by component boundaries, but still mounted within one root app.

3. **Router remains client-first (`BrowserRouter`)**
   - Works with prerendered HTML + client navigation.
   - For framework-level islands and per-page server routing semantics, a dedicated SSG framework is a cleaner long-term path.

## Recommended final path

### Option A (minimal churn, recommended now)
Stay on Vite + React and keep expanding current prerender pipeline:
1. Keep route definitions as the single source of truth.
2. Continue prerendering all non-dynamic routes.
3. Keep interactive features as client modules loaded lazily where practical.

### Option B (true island hydration, next major migration)
Migrate shell/pages into an island-capable SSG framework (for example Astro):
1. Keep existing JSON/content and CSS tokens.
2. Reuse React components as islands for interactive parts.
3. Render static page HTML by default; hydrate only modal/nav/motion widgets.

This is the cleanest path to true selective hydration while preserving current content and design.
