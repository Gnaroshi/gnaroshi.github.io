# Lab-LVM Website

React + Vite single-page app for the Lab-LVM website.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
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

`src/main.jsx` reads `import.meta.env.BASE_URL` and applies it to `BrowserRouter` `basename`, so app routing stays correct under that base path.
