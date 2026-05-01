---
status: complete
priority: p3
issue_id: CE-REV-PR3-008
tags: [code-review, frontend, css, quality]
dependencies: []
---

# Problem Statement

Optional polish: redundant CSS / test noise.

## Recommended Action

**Done:** Removed redundant `flex-shrink: 0` on `.pennant-matchup__solari-crease`; removed duplicate `toHaveLength(3)` assertion (array equality already implies three cells).

## Acceptance Criteria

- [x] Redundant declarations removed.

## Work Log

- 2026-04-30: Created from `/ce-review`.
- 2026-04-30: **Completed** — `typography.css` + `LandingOverlay.test.tsx` micro-edits.

## Resources

- PR #3: https://github.com/adam-zel/pennant-landing-page/pull/3
