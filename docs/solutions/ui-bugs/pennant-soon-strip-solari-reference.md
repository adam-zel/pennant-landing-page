---
title: Pennant SOON matchup strip — solari reference vs Paper node tree
category: ui-bugs
date: 2026-04-30
tags:
  - pennant
  - landing-page
  - LandingOverlay
  - design-source
related_pr:
  - "https://github.com/adam-zel/pennant-landing-page/pull/3"
---

## Decision

The live **SOON** strip (`LandingOverlay` + `.pennant-matchup*`) follows the **solari / split-flap reference** (four columns, thin **`#1A281C`** vertical dividers, middle **O** as top/bottom halves + dark crease). **Paper** file **Pennant → Landing Page → Coming Soon (`L1X-0`)** remains useful for **typography** (Clarendon axes, cream, text shadow) and **shell** chrome; its **divider child geometry** (stacked **O**s + green vertical pair + horizontal double rule) is **not** reimplemented literally when it conflicts with the signed-off reference.

## Why

Product/design chose the **reference screenshot** over a literal Paper MCP export for the strip’s **layout semantics**. Plans and brainstorms dated **2026-04-30** that still describe only the Paper tree should be read together with [2026-04-30-001 plan](../../plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md) **Implementation note** section.

## Implementation pointers

- Code: `src/components/LandingOverlay.tsx`, `src/styles/typography.css` (matchup block).
- **Accessibility:** Strip is **`aria-hidden`** as **decorative**; hero copy carries substantive messaging (see JSX comment on shell).

## Prevention

When “match Paper” and “match reference image” diverge, record **which source wins** in a plan or `docs/solutions/` note the same day the UI ships so future passes do not regress to the wrong tree.
