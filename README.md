# Pennant landing

Responsive React marketing page with a live WebGL baseball field (see `docs/specs/pennant-field-prompt.md`) and Paper-spec typography/copy.

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production bundle to `dist/`
- `npm run preview` — serve `dist/`
- `npm test` — Vitest

## Fonts

- **Display:** `Job Clarendon Variable` is referenced from `/fonts/JobClarendon-Variable.woff2`. Add your licensed file under `public/fonts/` (see `public/fonts/README.txt`). Until then, **Fraunces** from Google Fonts (linked in `index.html`) is the fallback.
- **Body:** SF Pro on Apple via the system stack; other platforms use `system-ui` / Segoe UI.

## Theme

Day/night is stored under `localStorage['pennant.theme']` and mirrored on `<html data-theme="night">`.

## Deploy on Cloudflare Pages

This site is a static Vite build. Use **[Cloudflare Pages](https://developers.cloudflare.com/pages/)** (the Pages product under the same Cloudflare account as DNS/CDN — not “Cloudflare the homepage” as a host by itself).

1. Push this repo to GitHub or GitLab.
2. In the Cloudflare dashboard: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo and set:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (repository root)
4. Under **Environment variables** (production), add **`NODE_VERSION`** = `22` (or rely on the repo `.nvmrc`).
5. Save and deploy. Assign your domain under the project’s **Custom domains** when ready.

Optional: install [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and run `npx wrangler pages deploy dist` for manual uploads without Git.

`public/_redirects` provides a SPA-style fallback so future client-side routes still serve `index.html`.
