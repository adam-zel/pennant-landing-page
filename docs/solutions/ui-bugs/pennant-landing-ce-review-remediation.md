---
title: Pennant landing — CE review remediation (type, a11y, headers, tokens)
category: ui-bugs
date: 2026-04-30
tags:
  - pennant
  - landing-page
  - css
  - accessibility
  - cloudflare
  - security-headers
  - vite
  - variable-fonts
related_commits:
  - "0f4c43e"
---

## Problem

A multi-step `/ce-review` pass flagged issues on the Pennant marketing overlay: fixed `96px` / `88px` Clarendon hero lines and fixed `48px` matchup cells could overflow narrow viewports; the hero `<h1>` kept user-agent margins and an `em`-based `gap` tied to the wrong font size; hero Clarendon `wdth` was hard-coded while matchup used a different token, with stale comments; there was no `<main>` landmark; production had no baseline security headers; typography was center-aligned then switched to left-aligned per design.

## Root cause

1. **Layout:** Absolute px sizes and a non-scrolling full-viewport flex overlay gave no responsive escape hatch on small screens.
2. **Semantics:** The stack wrapper was an `<h1>` without explicit reset, so UA styles and `gap: 0.12em` did not track the display spans’ computed size.
3. **Tokens:** A single `--pennant-clarendon-wdth` (35) conflicted with hero spec (`wdth` 50) and invited comment drift.
4. **Deploy:** Vite builds static assets; headers are not added unless configured at the edge (e.g. Cloudflare `_headers` in `public/`).

## Solution

### Responsive hero and matchup

- Display: `font-size: clamp(2rem, 5vw + 2rem, 6rem)` with `line-height: 0.917` (preserves 96/88 ratio at the top end).
- Wordmark: `clamp(1rem, 2vw + 0.75rem, 2rem)`, `line-height: 1`.
- Matchup row: `--matchup-cell: clamp(36px, 10vw, 48px)` on `.pennant-matchup`, reused for cells and divider heights.
- Overlay: `overflow-y: auto`, `overflow-x: hidden`; inner column `flex-shrink: 0`.

### `h1` stack

On `.pennant-display-stack`: `margin: 0`, `font-size: inherit`, `font-weight: inherit`, `line-height: 1`, and `gap: 0.72rem` (~`0.12em` at 96px display size).

### Clarendon width tokens

```css
:root {
  --pennant-clarendon-wdth-hero: 50;
  --pennant-clarendon-wdth-matchup: 35;
}
```

Hero `font-variation-settings` use `--pennant-clarendon-wdth-hero`; matchup cells use `--pennant-clarendon-wdth-matchup`. Comments at top of `typography.css` and overlay comment in `global.css` describe current behavior (not old translate-based framing).

### Landmark

`LandingOverlay` root is `<main className="pennant-overlay">`. Tests assert `getByRole("main")`.

### Security headers (Cloudflare static output)

`public/_headers` is emitted to `dist/_headers` by Vite’s `public/` copy. It sets HSTS (conservative `max-age` only), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and CSP allowing `self` plus Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`), `data:` / `blob:` where needed for assets/CSS patterns.

Verify after deploy:

```bash
curl -sI "https://<your-host>/" | sort
```

## Prevention

- When matching Paper/spec **px** values, pair them with **clamp** or container-aware scaling before signing off mobile.
- Any time an `<h1>` is a **flex wrapper** for styled children, reset UA margins and prefer **rem** gaps tied to design math, not parent `em`.
- Split **variable-font axes** by role (hero vs chrome) with named tokens instead of mixing magic numbers and one shared variable.
- For **Cloudflare + Vite**, treat `public/_headers` as part of the contract for production CSP and sanity-check with `curl -I` post-deploy.

## Note

This document was produced in **compact-safe** `/ce-compound` mode (single pass, no parallel research subagents). For deeper cross-links to issues and extended prevention content, re-run compound in a fresh session.
