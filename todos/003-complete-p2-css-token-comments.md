---
status: complete
priority: p2
issue_id: CE-REV-003
tags: [code-review, css, maintainability]
dependencies: []
---

# Problem Statement

Previously Clarendon `wdth` mixed one token with hero hard-codes and stale comments; resolved via split hero/matchup tokens and updated overlay comment (see Recommended Action).

## Findings

- Evidence: `src/styles/typography.css` lines 4–5, 16–17, 37–40, 71–82, 127–130; `src/styles/global.css` line 80.
- Reported by: `ce-code-simplicity-reviewer`.

## Proposed Solutions

1. **Split named tokens** — e.g. `--pennant-clarendon-wdth-hero: 50` and `--pennant-clarendon-wdth-matchup: 35`, use in `font-variation-settings`; update top-of-file comment.
2. **Single token** — If design intends one width everywhere, set variable to `50` and use `var()` for all Clarendon instances.
3. **Comments only** — Clarify in comments why hero differs from matchup; weakest if values drift again.

**Recommended direction:** (1) if intentional split; (2) if design unified.

## Recommended Action

Introduced `--pennant-clarendon-wdth-hero` (50) and `--pennant-clarendon-wdth-matchup` (35); wired all `font-variation-settings` to these; refreshed file header and `global.css` overlay comment.

## Technical Details

- Files: `src/styles/typography.css`, `src/styles/global.css`.

## Acceptance Criteria

- [x] No contradictory comments vs `font-variation-settings` values.
- [x] Future width tweaks require changing one obvious place per role (hero vs matchup).

## Work Log

- 2026-04-30: Created from `/ce-review`.
- 2026-04-30: Tokens + comments updated in `typography.css` and `global.css`.

## Resources

- Review target: branch `main`.
