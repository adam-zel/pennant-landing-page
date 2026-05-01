---
title: Pennant SOON matchup — solari layout, design authority, and review hardening
category: ui-bugs
date: 2026-04-30
tags:
  - pennant
  - LandingOverlay
  - solari
  - design-source
  - testing
  - accessibility
related_docs:
  - docs/solutions/ui-bugs/pennant-soon-strip-solari-reference.md
  - docs/solutions/ui-bugs/pennant-landing-ce-review-remediation.md
---

## Problem (symptom)

The hero **SOON** matchup strip looked **wrong in production** compared to the intended **split-flap (solari)** reference: four equal columns, thin vertical dividers, and a middle **O** shown as **top/bottom halves** with a dark crease—not two full letters with bright horizontal “double divider” bars. Separately, **Paper MCP** described a different **node tree** (`L1X-0`: stacked Os + green twin verticals + horizontal rules), which conflicted with the signed-off reference. After shipping solari, **code review** flagged brittle tests (`strip!`, unscoped `document.querySelector*`), missing assertions on solari glyph text, and unclear **decorative vs informative** semantics for `aria-hidden`.

## Root cause

1. **Design source:** An intermediate implementation treated **Paper’s exported structure** as the pixel target for dividers and middle column, while product/design expected the **reference screenshot** (solari).
2. **Tests:** Assertions did not guard `querySelector` nullability, scoped queries to the strip root, or verify both solari halves still render **`O`**.
3. **Semantics:** The strip was `aria-hidden` without an explicit **decorative** rationale next to the markup.

## Solution (what we shipped)

- **Layout:** `S | divider | O | divider | MatchupSolariO | divider | N` with **`MatchupDivider`** as a single **`#1A281C`** vertical rule and **`MatchupSolariO`** as two flex halves (`align-items: flex-end` / `flex-start`) + **`pennant-matchup__solari-crease`**. Shared letter styles on **`.pennant-matchup__cell`** and **`.pennant-matchup__solari-half`** in `typography.css`; **`.pennant-matchup`** uses **`overflow: hidden`** for a clean chip.
- **Authority:** Record which source wins when Paper and reference diverge — see [pennant-soon-strip-solari-reference.md](./pennant-soon-strip-solari-reference.md) and the **Implementation note** in `docs/plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md`.
- **Review follow-through:** `LandingOverlay.test.tsx` now uses **`expect(strip).not.toBeNull()`**, **`within(stripEl)`**, asserts **two** halves each **`"O"`**, and **`aria-hidden`** on dividers + crease; **`LandingOverlay.tsx`** includes a short JSX comment that the strip is **decorative** and hero copy carries messaging.

Key files: `src/components/LandingOverlay.tsx`, `src/styles/typography.css`, `src/components/LandingOverlay.test.tsx`, plans/brainstorm updates, `todos/006-complete-*` through `008-complete-*`.

## Prevention

When **Figma/Paper MCP** and a **reference image** disagree on layout, **write the decision the same day** under `docs/solutions/` or the active plan (implementation note) so the next engineer does not “fix” the UI back to the wrong tree. For **decorative** `aria-hidden` regions, add a **one-line comment** at the shell so a11y reviews do not stall on intent.

## Compact-safe note

This doc was produced in **compact-safe** `/ce-compound` mode (single pass, no parallel subagents). For deeper cross-links or post-hoc review agents, re-run in a fresh session if needed.
