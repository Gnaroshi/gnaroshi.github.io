# Architecture

## Recommended Stack

- Astro for static site generation.
- TypeScript for application and data code.
- MDX for long-form content.
- React only for dynamic islands that need client interactivity.
- CSS modules or plain CSS with shared design tokens.
- GitHub Actions for GitHub Pages deployment.

Do not add a backend, database, OAuth, or server runtime in the MVP.

## Static-First Model

All core data should be available at build time:

- Blog posts from `src/content/blog/`.
- Paper logs from `src/content/papers/`.
- Project writeups from `src/content/projects/`.
- Profile data from `src/data/profile.ts`.

Astro should generate static HTML for all routes. Client JavaScript should be limited to interactive UI such as paper filters, sorting, theme toggle, and search.

## Target Project Structure

```text
.
├── AGENTS.md
├── docs/
├── public/
│   ├── CNAME
│   ├── favicon.svg
│   └── og/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── blog/
│   │   ├── papers/
│   │   └── shared/
│   ├── content/
│   │   ├── blog/
│   │   ├── papers/
│   │   └── projects/
│   ├── data/
│   │   └── profile.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── BlogPostLayout.astro
│   │   └── PaperLayout.astro
│   ├── lib/
│   │   ├── dates.ts
│   │   ├── readingStats.ts
│   │   ├── readingTime.ts
│   │   ├── seo.ts
│   │   └── tags.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── research.astro
│   │   ├── projects.astro
│   │   ├── blog/
│   │   ├── papers/
│   │   ├── now.astro
│   │   └── contact.astro
│   └── styles/
│       ├── global.css
│       └── tokens.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

This structure is a target for implementation, not something to create during planning.

## Content Collections

Use Astro content collections for:

- `blog`
- `papers`
- `projects`

Define schemas in `src/content/config.ts`. Prefer strict schemas that catch missing metadata at build time.

## Data Flow

1. Markdown/MDX files provide content and frontmatter.
2. Astro content collections validate content.
3. Utility functions in `src/lib/` compute derived values:
   - reading time.
   - normalized tags.
   - paper reading stats.
   - heatmap activity.
   - SEO metadata.
4. Astro pages render static HTML.
5. React islands receive serialized data only when filtering or dynamic interaction is needed.

## React Island Policy

Use React only when interactivity is useful and local:

- Paper dashboard search/filter/sort.
- Theme toggle if implemented.
- Maybe expandable table of contents.

Do not build the whole site as a React app. Do not add global client state management.

## Styling

Use CSS custom properties for design tokens. Keep tokens in `src/styles/tokens.css` and import them globally.

Acceptable approaches:

- Plain CSS with clear class names.
- CSS modules for component-local styles.

Avoid:

- Large UI frameworks.
- Tailwind unless explicitly chosen later.
- Animation-heavy dependencies.
- Styling personal data into many components.

## Routing

Use file-based Astro routes:

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/research.astro`
- `src/pages/projects.astro`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/papers/index.astro`
- `src/pages/papers/[slug].astro`
- `src/pages/now.astro`
- `src/pages/contact.astro`

Use `getStaticPaths` for dynamic blog and paper pages.

## SEO And Feeds

Each public content page should have:

- Title.
- Description.
- Canonical URL.
- Open Graph title, description, type, and URL.
- Reasonable social image fallback.

Add RSS if simple. Blog RSS is higher priority than paper RSS.

## GitHub Pages Deployment

Use GitHub Actions to:

1. Install dependencies.
2. Build Astro.
3. Upload static artifact.
4. Deploy to GitHub Pages.

The custom domain should be represented by `public/CNAME` containing:

```text
gnaroshi.dev
```

Do not add deployment until the app exists.

## Performance Budget

Default target:

- Static HTML first.
- Minimal JavaScript.
- No large client bundles for static pages.
- Avoid heavy font loading.
- Optimize images before committing large assets.

## Architectural Acceptance Criteria

The implementation satisfies this architecture when:

- The site can build without a server.
- Content is editable through Markdown/MDX and profile data.
- Paper dashboard stats are derived from local content.
- React is limited to islands.
- No backend dependency is introduced.
- Deployment works through GitHub Actions and GitHub Pages.
