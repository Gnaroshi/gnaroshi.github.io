# Lab-LVM Website

React + Vite single-page app for the Lab-LVM website.

## 운영 문서 (한국어)

콘텐츠 운영 문서는 `docs/`에 분리되어 있습니다.

- 총괄: `docs/README.md`
- 뉴스: `docs/news/README.md`
- 논문: `docs/publications/README.md`
- 사진: `docs/photos/README.md`
- 배포: `docs/deployment/README.md`
- 문제 해결: `docs/troubleshooting/README.md`
- 템플릿: `docs/templates/README.md`

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Content operations (GitHub Pages static workflow)

This project now separates long-lived content from UI code:

- `content/news` (Markdown + frontmatter)
- `content/publications` (Markdown + frontmatter)
- `content/photos/raw` (raw originals)
- `src/generated` (generated manifests consumed by React)
- `public/uploads/photos` (optimized photo outputs)

Core commands:

```bash
npm run content:bootstrap   # one-time migration helper from legacy JSON/assets
npm run content:sync        # regenerate news/publications/photos outputs
npm run validate:content    # schema/date/link validation
npm run photos:sync         # photo resize + manifest only
npm run operator:verify     # operator-friendly check (sync + build)
```

`npm run build` now runs `validate:content` first.

## Static prerender build (SSG-style output)

Generates route-level HTML files (for example `/news/index.html`, `/research/index.html`) while keeping client-side navigation and hydration:

```bash
npm run build:static
```

The route list for prerender is defined in `src/routes/routeDefinitions.js`.

To deploy prerendered output with GitHub Pages:

```bash
npm run deploy:static
```

## GitHub Pages deployment notes (SPA routing safe)

This project now includes a GitHub Pages SPA fallback:

- `public/404.html` redirects unknown routes back to `index.html` using a query token.
- `index.html` restores the original route before React bootstraps.

This fixes:

- direct URL access to nested routes
- refresh on nested routes
- browser back/forward to nested routes that previously caused 404s

### Base path for GitHub Pages

If deploying to a repository path (for example `https://<user>.github.io/<repo>/`), set the base path when building:

```bash
VITE_BASE_PATH=/<repo>/ npm run build
```

For prerendered static output:

```bash
VITE_BASE_PATH=/<repo>/ npm run build:static
```

`src/main.jsx` reads `import.meta.env.BASE_URL` and applies it to `BrowserRouter` `basename`, so app routing stays correct under that base path.

## GitHub Actions (content + deploy)

- `Content Build Check`: validates content sync + build on push/PR
- `Deploy GitHub Pages`: deploys `dist` to `gh-pages` on push to `main`
