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

**Brainstorm decisions carried forward:**

- **Fidelity:** Full **Approach A** structural parity for **`L1X-0`** — four horizontal slots; middle slot = stacked **O** / horizontal double divider / **O**; single dividers = vertical green pair; reject horizontal five-cell simplification (Approach B) (see brainstorm: [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md)).
- **Authority:** Paper **computed styles** (+ optional **`get_jsx`**, Approach C) over screenshot guesses (see brainstorm: [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md)).
- **A11y:** Keep decorative strip under **`aria-hidden`**; no focusable children inside it (see brainstorm: [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md)).
- **Scope:** No WebGL field changes (see plan [001](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md)).

## Local research summary

| Area | Finding |
|------|--------|
| **Matchup markup** | [`src/components/LandingOverlay.tsx`](../../src/components/LandingOverlay.tsx) — five-letter map + `MatchupDivider`; double variant is two **vertical** columns; must become Paper’s **middle column** + correct divider axes. |
| **Styles** | [`src/styles/typography.css`](../../src/styles/typography.css) — `.pennant-matchup*` uses cream/black divider rgba; replace with **#274434** / **#1A281C** geometry per Paper. |
| **Shell** | [`src/styles/global.css`](../../src/styles/global.css) — `.pennant-matchup-shell` already matches Paper chip closely. |
| **Tests** | [`src/components/LandingOverlay.test.tsx`](../../src/components/LandingOverlay.test.tsx) — asserts **five** `.pennant-matchup__cell` and `matchup-double-divider` shape; **must change** with new DOM (see [001](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md)). |
| **Learnings** | [`docs/solutions/ui-bugs/pennant-landing-ce-review-remediation.md`](../solutions/ui-bugs/pennant-landing-ce-review-remediation.md) — keep **`clamp()`** on matchup scale for narrow viewports; preserve **`main`** landmark and hero `h1` reset patterns; split Clarendon **`wdth`** tokens by role (hero vs matchup). |
| **Meta** | [`index.html`](../../index.html) — policy for parity with hero vs intentional shortening still open in **001** § proposed solution item 4. |

## Research decision (external)

**Skipped** — React/CSS/static HTML only; Paper MCP + **001** + brainstorm provide sufficient grounding. Revisit framework docs only if variable-font axis behavior blocks `wdth` in a target browser.

## SpecFlow highlights (gaps to resolve during implementation)

Incorporated from spec-flow analysis of this feature:

- **Responsive:** Center column adds **vertical** content; verify **320px–desktop** so stacked **O**s + horizontal rules do not collide with body/wordmark when `--matchup-cell` hits its **clamp** minimum (see learning: [pennant-landing-ce-review-remediation.md](../solutions/ui-bugs/pennant-landing-ce-review-remediation.md)).
- **Fonts:** If Clarendon or SF axes are missing, document fallback behavior in CSS comments; avoid silent layout blowouts on matchup row.
- **Meta drift:** Pick one policy in **001** — full string parity vs shortened OG — and document or automate to avoid **title** / **description** / hero divergence (SpecFlow: single canonical copy pipeline optional follow-up).
- **A11y:** Confirm **no** tab stops inside `aria-hidden` strip; optional test assert on shell.
- **Contrast:** Thin green rules are decorative; body at weight **274** on WebGL — spot-check contrast if product requires WCAG beyond decorative exemption.

## Implementation phases

### Phase 1 — Coming Soon / SOON strip (highest visual delta)

1. Refactor [`LandingOverlay.tsx`](../../src/components/LandingOverlay.tsx) to **four** horizontal segments: **S**, **O**, **middle wrapper**, **N**, with **single** dividers between (three divider regions total).
2. Middle wrapper: **flex column** (or Paper-equivalent positioning) with letter **O** → **double divider** (two **horizontal** **1px** bars: **#1A281C** top, **#274434** bottom) → letter **O**.
3. Replace divider CSS: **single** = row of two **vertical** **1px** rects (**#274434**, **#1A281C**); remove cream/black rgba fills from dividers.
4. Reconcile **inner** `.pennant-matchup` **padding/gap** with Paper (**001**: outer `L1X-0` has no padding — inner rhythm after structure).
5. Paper MCP: re-run **`get_computed_styles`** on **`L1X-0`** subtree if file changed since last session; optional **`get_jsx`** for the Coming Soon frame ([Paper link](https://app.paper.design/file/01KNTATP7SHMYK9GWN2TVVXBDA/5-0/L1X-0)).
6. Update [`LandingOverlay.test.tsx`](../../src/components/LandingOverlay.test.tsx): reading order **S-O-O-N**, middle column structure, divider placement; replace five-cell assumption and obsolete double-divider **test id** shape if markup changes.

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
- [ ] Matchup matches Paper **`L1X-0`** structural + divider color/geometry spec.
- [ ] **`index.html`** meta policy explicit and applied.
- [ ] Tests updated for new matchup DOM and copy.
- [ ] Older brainstorm body-copy table noted as superseded where applicable (**001** / [2026-04-29 brainstorm](../brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md)).

## Dependencies & risks

| Risk | Mitigation |
|------|------------|
| Middle column height at min **clamp** | Tune column gap/font size at smallest breakpoint; screenshot 320px (SpecFlow). |
| Test brittleness | Prefer stable **`data-testid`** on middle column or double divider if helpful; avoid pixel tests. |
| Plan duplication drift | When scope changes, edit **001** first, then sync this playbook’s phases. |

## Sources & references

- **Origin brainstorm:** [docs/brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md](../brainstorms/2026-04-30-coming-soon-paper-parity-brainstorm.md) — structural parity decision, Paper URL, divider semantics.
- **Canonical plan:** [docs/plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md](2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md) — overview, acceptance criteria, Paper node table, mermaid.
- **Earlier brainstorm:** [docs/brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md](../brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md) — Paper-as-source, variable-font context (see brainstorm: docs/brainstorms/2026-04-29-pennant-react-web-landing-brainstorm.md).
- **Learnings:** [docs/solutions/ui-bugs/pennant-landing-ce-review-remediation.md](../solutions/ui-bugs/pennant-landing-ce-review-remediation.md) — responsive matchup/hero, tokens, landmark.
- **Paper:** [Coming Soon frame](https://app.paper.design/file/01KNTATP7SHMYK9GWN2TVVXBDA/5-0/L1X-0).
