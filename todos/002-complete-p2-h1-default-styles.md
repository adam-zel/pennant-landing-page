---
status: complete
priority: p2
issue_id: CE-REV-002
tags: [code-review, frontend, css, a11y]
dependencies: []
---

# Problem Statement

The visual hero is an `<h1 class="pennant-display-stack">`, but the stack container does not reset user-agent `h1` margin and font metrics. Default margins add unpredictable vertical rhythm; flex `gap: 0.12em` resolves against the `h1`’s font size, not the `96px` child spans.

## Findings

- Evidence: `src/components/LandingOverlay.tsx` lines 37–44, `src/styles/typography.css` `.pennant-display-stack`.
- Reported by: `ce-kieran-typescript-reviewer`.

## Proposed Solutions

1. **Reset on `.pennant-display-stack`** — `margin: 0; font-size: inherit; font-weight: inherit; line-height: 1;` (typography on children only).
2. **Replace `h1` wrapper with `div` + `aria-labelledby`** — Keeps one real heading elsewhere; more markup change.
3. **Use explicit `gap` in px/rem** — Decouples spacing from em resolution on `h1`.

**Recommended direction:** (1) plus consider fixed `gap` in `rem` if design specifies absolute rhythm.

## Recommended Action

Applied UA reset on `.pennant-display-stack` and replaced `gap: 0.12em` with fixed `0.72rem` (~0.12×96px).

## Technical Details

- Files: `src/styles/typography.css`, optionally `LandingOverlay.tsx`.

## Acceptance Criteria

- [x] Visual spacing matches design intent after UA reset (screenshot compare).
- [x] No duplicate or skipped heading levels in accessibility tree.

## Work Log

- 2026-04-30: Created from `/ce-review`.
- 2026-04-30: `.pennant-display-stack` margin/font reset + `gap: 0.72rem` in `typography.css`.

## Resources

- Review target: branch `main`.
