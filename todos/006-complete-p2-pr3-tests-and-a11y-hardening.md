---
status: complete
priority: p2
issue_id: CE-REV-PR3-006
tags: [code-review, frontend, testing, accessibility, pennant]
dependencies: []
---

# Problem Statement

PR **#3** (`feat/paper-soon-structural-parity`) ships the solari split-flap **SOON** strip. Review agents flagged **test brittleness** and an **ambiguous a11y contract** for the decorative matchup row.

## Findings

_(Addressed — see Work Log.)_

## Proposed Solutions

_(As per original todo.)_

## Recommended Action

**Done:** Hardened `LandingOverlay.test.tsx` (null guard, `within(strip)`, solari half **`O`** asserts, divider + crease **`aria-hidden`**). Documented **decorative** intent in `LandingOverlay.tsx` JSX comment above `pennant-matchup-shell`.

## Technical Details

- Files: `src/components/LandingOverlay.test.tsx`, `src/components/LandingOverlay.tsx`.

## Acceptance Criteria

- [x] No non-null assertion on `querySelector` without prior `expect` guard.
- [x] Strip/solari queries scoped to `container` / `within(strip)`.
- [x] Both solari halves assert letter **`O`**.
- [x] Decorative vs informative decision recorded in JSX comment.

## Work Log

- 2026-04-30: Created from `/ce-review` on PR #3.
- 2026-04-30: **Completed** — tests + decorative `aria-hidden` comment shipped in workspace.

## Resources

- [pennant-landing-ce-review-remediation.md](../docs/solutions/ui-bugs/pennant-landing-ce-review-remediation.md)
