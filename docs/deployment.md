# Deployment Checklist

This site deploys `Gnaroshi/gnaroshi.github.io` to GitHub Pages with the custom domain `gnaroshi.dev`.

## Local Verification

Run these before relying on a deployment:

```bash
gh auth status
gh repo view Gnaroshi/gnaroshi.github.io
npm install
npm run build
```

Preview locally when a browser check is useful:

```bash
npm run preview
```

## GitHub Pages Workflow

Deployment is configured in:

```text
.github/workflows/deploy.yml
```

The workflow:

- Runs on pushes to `main`.
- Can be started manually with `workflow_dispatch`.
- Uses GitHub Pages permissions: `contents: read`, `pages: write`, and `id-token: write`.
- Uses the official Astro GitHub Action to install dependencies, build the site, and upload the Pages artifact.
- Uses `actions/deploy-pages` to publish the artifact.

No secrets are required.

The optional voice oral-exam API is deployed separately and is not required for GitHub Pages. After deploying the Worker, set the repository Actions variable `PUBLIC_AI_API_BASE_URL` to `https://api.gnaroshi.dev` and rerun the Pages workflow. Do not put `OPENAI_API_KEY` in GitHub Pages settings. See `docs/cloudflare-worker-api.md`.

## Required Repository Settings

If GitHub repository settings are not already configured, set them manually:

1. Open `Gnaroshi/gnaroshi.github.io` on GitHub.
2. Go to Settings -> Pages.
3. Under Build and deployment, set Source to GitHub Actions.
4. Under Custom domain, set:

```text
gnaroshi.dev
```

5. Save the domain.
6. Enable Enforce HTTPS after GitHub finishes provisioning the certificate.

## Custom Domain And DNS

The repository includes:

```text
public/CNAME
```

It must contain exactly:

```text
gnaroshi.dev
```

For the apex domain `gnaroshi.dev`, configure DNS with either an `ALIAS`/`ANAME` record to `gnaroshi.github.io` if the DNS provider supports it, or GitHub Pages `A` records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional IPv6 `AAAA` records:

```text
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

For `www.gnaroshi.dev`, create a `CNAME` record pointing to:

```text
gnaroshi.github.io
```

Do not use wildcard DNS records for GitHub Pages.

## Deploy

After local verification:

```bash
git push
```

Then open the GitHub Actions tab and check the latest `Deploy to GitHub Pages` run.

## Troubleshooting 404

If `https://gnaroshi.dev` returns 404:

- Confirm the latest GitHub Actions deployment completed successfully.
- Confirm Settings -> Pages -> Source is GitHub Actions.
- Confirm Settings -> Pages -> Custom domain is `gnaroshi.dev`.
- Confirm `astro.config.mjs` has `site: "https://gnaroshi.dev"` and no `base` value.
- Confirm `public/CNAME` contains only `gnaroshi.dev`.
- Confirm DNS records point to GitHub Pages and allow up to 24 hours for propagation.
- Confirm the site is a user site/custom root domain and is not using `/gnaroshi.github.io/` as a base path.
