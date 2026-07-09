# gnaroshi.dev

Personal research homepage, blog, and paper reading tracker for [gnaroshi.dev](https://gnaroshi.dev).

This site is built as a static Astro project with TypeScript, MDX, and small React islands only where interactivity is useful.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Check

```bash
npm run check
```

## Deploy

The site is configured for static output with `site` set to `https://gnaroshi.dev`.

GitHub Pages deployment should build the Astro site and publish the generated `dist/` directory. The custom domain is set by `public/CNAME`.

## Edit Profile Data

Primary identity data lives in:

```text
src/data/profile.ts
```

Edit that file for display name, headline, short bio, interests, location, and public links.

