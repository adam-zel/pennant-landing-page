---
status: complete
priority: p2
issue_id: CE-REV-001
tags: [code-review, frontend, css, responsive]
dependencies: []
---

# Problem Statement

Fixed-size hero typography (`96px` / `88px` line-height) and fixed matchup cells (`48px`) sit inside a narrow overlay column (`min(394px, 100%)`). On small viewports the headline and matchup row can overflow horizontally; the fixed full-viewport overlay may clip vertically with no scroll affordance.

## Findings

- Evidence: `src/styles/typography.css` (`.pennant-display`, `.pennant-matchup__cell`), `src/styles/global.css` (`.pennant-overlay`).
- Reported by: `ce-kieran-typescript-reviewer` (session review).
- Verify in real browsers at ~320px width and short heights; unit tests do not catch layout overflow.

## Proposed Solutions

1. **Clamp font sizes and matchup scale** — Use `clamp()` for display size/line-height and optionally scale matchup cells/gaps. Pros: preserves design at desktop; Cons: needs design sign-off on min scale.
2. **Overlay scroll + alignment** — Add `overflow-y: auto` (and safe-area padding) on overlay inner when content exceeds viewport. Pros: prevents hard clip; Cons: scroll on a decorative landing may be undesirable.
3. **Both** — Clamp for typical phones plus overflow fallback for extreme sizes.

**Recommended direction:** (1) first; add (2) if clipping persists.

## Recommended Action

Implemented responsive `clamp()` for wordmark and display type, `--matchup-cell` scaling, overlay `overflow-y: auto` / `overflow-x: hidden`, and `flex-shrink: 0` on the inner column.

## Technical Details

- Files: `src/styles/typography.css`, `src/styles/global.css`, possibly `LandingOverlay.tsx` if structure changes.

## Acceptance Criteria

- [x] No horizontal overflow of hero or matchup at 320px viewport width (verify manually or Playwright).
- [x] Short viewport (e.g. 568×320 landscape) does not permanently hide primary copy without scroll if scroll is the chosen pattern.

## Work Log

- 2026-04-30: Created from `/ce-review` (current `main`).
- 2026-04-30: Responsive clamps, matchup `--matchup-cell`, overlay scroll — shipped in typography/global CSS.

## Resources

- Review target: branch `main`, commits through `c0d5e5b`.
