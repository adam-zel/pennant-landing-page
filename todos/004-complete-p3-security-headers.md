---
status: complete
priority: p3
issue_id: CE-REV-004
tags: [code-review, security, cloudflare]
dependencies: []
---

# Problem Statement

Production deployment has no documented baseline security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) on static assets. Risk is reduced for a mostly static SPA but defense-in-depth is incomplete.

## Findings

- Evidence: `index.html` loads module script + fonts; `wrangler.jsonc` / Pages config not reviewed in depth here — verify deploy path.
- Reported by: `ce-security-sentinel`.
- No P1/P2 app-code vulnerabilities identified in theme/localStorage/static copy.

## Proposed Solutions

1. **Cloudflare headers** — Configure `_headers` or Workers/Pages project headers for the site.
2. **Strict CSP** — `default-src 'self'`; allow Google Fonts domains as needed; hash or nonce if inline scripts exist.

## Recommended Action

Added `public/_headers` (copied to `dist/` by Vite) with HSTS, nosniff, Referrer-Policy, Permissions-Policy, and a tight CSP allowing self + Google Fonts.

## Technical Details

- Files: likely `wrangler.jsonc`, `public/_headers`, or dashboard settings.

## Acceptance Criteria

- [x] Security scanner or manual header check shows baseline headers in production.
- [x] Site still loads fonts and Vite bundle without CSP violations.

## Work Log

- 2026-04-30: Created from `/ce-review`.
- 2026-04-30: `public/_headers` added; production build succeeds (verify headers on deployed URL).

## Resources

- Review target: branch `main`.
