---
title: "feat: Pennant Paper parity — implementation playbook"
type: feat
status: active
date: 2026-04-30
origin: docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md
parent_plan: docs/plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md
---

# feat: Pennant Paper parity — implementation playbook

## Overview

This document is the **sequenced implementation playbook** for the Paper-aligned landing overlay work already specified in **[2026-04-30-001](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md)**. **Acceptance criteria and problem framing remain authoritative in 001**; use this file for **phase order**, **edge-case coverage**, and **test/refinement prompts** while implementing (see brainstorm: [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md) — full structural parity for the Coming Soon strip, Paper MCP for tokens, single umbrella plan **001**).

**Brainstorm decisions carried forward (updated 2026-04-30):**

- **Fidelity:** **Solari reference** — four columns **S | O | split-flap O | N**; thin **`#1A281C`** vertical dividers; middle **O** = two half-height regions + crease ([PR #3](https://github.com/adam-zel/pennant-landing-page/pull/3)). Paper **`L1X-0`** informs **type tokens**, not literal green divider child tree when it conflicts (see [pennant-soon-strip-solari-reference.md](../solutions/ui-bugs/pennant-soon-strip-solari-reference.md)).
- **Authority:** **Product / reference screenshot** for strip geometry; Paper MCP for Clarendon/SF values where still aligned (see plan [001](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md) implementation note).
- **A11y:** Decorative strip + slot dividers + crease under **`aria-hidden`**; JSX documents intent (see brainstorm: [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md) — implementation update).
- **Scope:** No WebGL field changes (see plan [001](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md)).

## Local research summary

| Area | Finding |
|------|--------|
| **Matchup markup** | [`src/components/LandingOverlay.tsx`](../../src/components/LandingOverlay.tsx) — **shipped:** solari **four-slot** row + `MatchupDivider` + `MatchupSolariO`. |
| **Styles** | [`src/styles/typography.css`](../../src/styles/typography.css) — `.pennant-matchup*` shared letter styles; thin **`#1A281C`** vertical dividers; solari crease. |
| **Shell** | [`src/styles/global.css`](../../src/styles/global.css) — `.pennant-matchup-shell` matches dark chip + inset shadow. |
| **Tests** | [`src/components/LandingOverlay.test.tsx`](../../src/components/LandingOverlay.test.tsx) — scoped strip queries, solari half **`O`** text, divider **`aria-hidden`** (PR #3 follow-up). |
| **Learnings** | [`docs/solutions/ui-bugs/pennant-landing-ce-review-remediation.md`](../solutions/ui-bugs/pennant-landing-ce-review-remediation.md) — keep **`clamp()`** on matchup scale for narrow viewports; preserve **`main`** landmark and hero `h1` reset patterns; split Clarendon **`wdth`** tokens by role (hero vs matchup). |
| **Meta** | [`index.html`](../../index.html) — policy for parity with hero vs intentional shortening still open in **001** § proposed solution item 4. |

## Research decision (external)

**Skipped** — React/CSS/static HTML only; Paper MCP + **001** + brainstorm provide sufficient grounding. Revisit framework docs only if variable-font axis behavior blocks `wdth` in a target browser.

## SpecFlow highlights (gaps to resolve during implementation)

Incorporated from spec-flow analysis of this feature:

- **Responsive:** Solari middle is **two half-heights** inside one cell — verify **320px–desktop** when `--matchup-cell` is minimal (see learning: [pennant-landing-ce-review-remediation.md](../solutions/ui-bugs/pennant-landing-ce-review-remediation.md)).
- **Fonts:** If Clarendon or SF axes are missing, document fallback behavior in CSS comments; avoid silent layout blowouts on matchup row.
- **Meta drift:** Pick one policy in **001** — full string parity vs shortened OG — and document or automate to avoid **title** / **description** / hero divergence (SpecFlow: single canonical copy pipeline optional follow-up).
- **A11y:** Confirm **no** tab stops inside `aria-hidden` strip; optional test assert on shell.
- **Contrast:** Thin green rules are decorative; body at weight **274** on WebGL — spot-check contrast if product requires WCAG beyond decorative exemption.

## Implementation phases

### Phase 1 — Coming Soon / SOON strip (**complete** — solari reference)

1. ~~Refactor~~ **Done:** [`LandingOverlay.tsx`](../../src/components/LandingOverlay.tsx) — **S**, **O**, **`MatchupSolariO`**, **N**; three **`MatchupDivider`**; decorative comment + **`aria-hidden`** shell.
2. ~~Middle~~ **Done:** Split-flap **O** (two halves + crease), not Paper’s green horizontal double rule.
3. ~~Divider CSS~~ **Done:** Single **`#1A281C`** vertical rules; no cream/black rgba pair.
4. **Padding:** `.pennant-matchup` **gap/padding 0** — keep when touching this area.
5. **Paper MCP:** Use for **type** checks only unless product reverts strip to literal **`L1X-0`** divider tree ([Paper link](https://app.paper.design/file/01KNTATP7SHMYK9GWN2TVVXBDA/5-0/L1X-0)).
6. **Tests** — **Done:** Scoped queries, solari **`O`** halves, divider/crease **`aria-hidden`** ([PR #3](https://github.com/adam-zel/pennant-landing-page/pull/3)).

### Phase 2 — Variable typography (Clarendon `wdth` / SF body 274)

1. Extend Clarendon **`font-variation-settings`** / **`font-stretch`** for wordmark, display, matchup per **001** and `@font-face` axis ranges in [`typography.css`](../../src/styles/typography.css).
2. Body: SF Pro **`wght` 274** with documented fallback to **300** where unsupported (**001**).

### Phase 3 — Meta / SEO policy

1. Apply explicit **`index.html`** policy decided in **001** (align or shorten with rationale); add comment or shared constant if implementing **single source** for strings.

### Phase 4 — Verification

1. Visual compare at **394px** column width vs Paper hero column (**001** success metric).
2. CI: full test suite; manual spot **320px** strip height.

## Acceptance criteria (mirror of 001)

Track checkboxes in **[001](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md)** — duplicated here only for agent convenience:

- [ ] Body paragraph matches Paper **`L2K-0`** verbatim (re-verify after edits).
- [ ] Wordmark + display + matchup: Clarendon width behavior matches Paper.
- [ ] Body weight **274** intent + fallback documented.
- [x] **Matchup row** — solari reference (**PR #3**); see **001** implementation note (not literal **`L1X-0`** divider tree).
- [x] **`index.html`** meta policy explicit and applied.
- [x] Tests updated for solari DOM + scoped queries (**PR #3** + todo CE-REV-PR3-006).
- [ ] Older brainstorm body-copy table noted as superseded where applicable (**001** / [2026-04-29 brainstorm](../brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md)).

## Dependencies & risks

| Risk | Mitigation |
|------|------------|
| Middle column height at min **clamp** | Tune column gap/font size at smallest breakpoint; screenshot 320px (SpecFlow). |
| Test brittleness | **Mitigated (2026-04-30):** scoped `within(.pennant-matchup)`, solari half **`O`** asserts, divider **`aria-hidden`** checks. |
| Plan duplication drift | When scope changes, edit **001** first, then sync this playbook’s phases. |

## Sources & references

- **Origin brainstorm:** [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md) — Paper **`L1X-0`** notes + **Implementation update** (solari).
- **Solari decision doc:** [docs/solutions/ui-bugs/pennant-soon-strip-solari-reference.md](../solutions/ui-bugs/pennant-soon-strip-solari-reference.md).
- **Canonical plan:** [docs/plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md) — overview, acceptance criteria, Paper node table, mermaid.
- **Earlier brainstorm:** [docs/brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md](../brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md) — Paper-as-source, variable-font context (see brainstorm: docs/brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md).
- **Learnings:** [docs/solutions/ui-bugs/pennant-landing-ce-review-remediation.md](../solutions/ui-bugs/pennant-landing-ce-review-remediation.md) — responsive matchup/hero, tokens, landmark.
- **Paper:** [Coming Soon frame](https://app.paper.design/file/01KNTATP7SHMYK9GWN2TVVXBDA/5-0/L1X-0).
