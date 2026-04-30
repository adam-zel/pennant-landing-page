---
status: complete
priority: p3
issue_id: CE-REV-005
tags: [code-review, a11y]
dependencies: []
---

# Problem Statement

Primary marketing content lives in generic `<div>` wrappers without a `<main>` landmark. Screen reader users lose a quick jump target to primary content on this single-page experience.

## Findings

- Evidence: `src/components/LandingOverlay.tsx` root `.pennant-overlay` / inner column.
- Reported by: `ce-kieran-typescript-reviewer`.

## Proposed Solutions

1. **`<main className="pennant-overlay">`** — Map landmark to outer overlay (ensure one `main` per page).
2. **Wrap inner column** — `<main className="pennant-overlay__inner">` if outer should remain non-semantic.

## Recommended Action

Replaced overlay root `<div className="pennant-overlay">` with `<main className="pennant-overlay">`; asserted in `LandingOverlay.test.tsx`.

## Technical Details

- Files: `src/components/LandingOverlay.tsx`, possibly tests if querying roles.

## Acceptance Criteria

- [x] Exactly one `main` in document after render.
- [x] Existing visual layout unchanged.

## Work Log

- 2026-04-30: Created from `/ce-review`.
- 2026-04-30: `<main>` in `LandingOverlay.tsx`; test coverage for `getByRole("main")`.

## Resources

- Review target: branch `main`.
