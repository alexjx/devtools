# Devtools

Static Devtools SPA scaffolded with Vite, React, TypeScript, and hash routing for GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

The dev server runs on `http://127.0.0.1:5173`.

## Test

```bash
npm run test
npm run e2e
```

`npm run test` runs the Vitest unit suite. `npm run e2e` runs the Playwright smoke tests against the local dev server.

## Build

```bash
npm run build
```

For the GitHub Pages deployment path, build with:

```bash
GITHUB_PAGES=true npm run build
```

That switches the Vite base to `/devtools/`, which matches the Pages site path.

## GitHub Pages

Published site:

```text
https://alexjx.github.io/devtools/
```

The workflow in `.github/workflows/pages.yml`:

1. installs dependencies with `npm ci`
2. builds with `GITHUB_PAGES=true`
3. uploads `dist/`
4. deploys the artifact to GitHub Pages

It runs on pushes to `main` and can also be triggered manually from the Actions tab.
