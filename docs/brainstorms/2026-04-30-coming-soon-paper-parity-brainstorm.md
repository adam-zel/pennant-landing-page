---
title: "Brainstorm: Coming Soon (SOON) strip — Paper parity"
date: 2026-04-30
status: complete
---

# Brainstorm: Coming Soon (SOON) strip — Paper parity

## What we're building

Bring the landing-page **Coming Soon** team-matchup strip in line with the **Paper** design the user has selected (frame **Coming Soon** on artboard **Pennant Landing Page**, file **Pennant**). Paper MCP supplies hierarchy and computed CSS; the codebase implements this today as `LandingOverlay` + `.pennant-matchup*` styles.

## Why this matters

The strip is a branded “hero accessory”: typography, divider geometry, and the dark pill chrome should read as **the same object** on Paper and on the live page. Drift undermines the “Paper is source of truth” workflow already called out in [2026-04-29-pennant-react-web-landing-brainstorm.md](./2026-04-29-pennant-react-web-landing-brainstorm.md) and the active plan [2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md](../plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md).

## Paper MCP design context (selection + subtree)

**Canvas:** Page **Landing Page**; primary artboard **Pennant Landing Page** (1440×1024). Fonts in file include **Job Clarendon Variable** and **SF Pro**.

**Selection:** Frame **Coming Soon** — roughly **199×49**, **7** direct children, parent is the hero column frame.

**Horizontal rhythm (left → right):**

| Slot | Role |
|------|------|
| Letter **S** | 48×48 cell, Clarendon **500**, **40px** / **48px** line-height, **ultra-condensed**, cream fill, text-shadow **#0000007A 0 2px 3px** |
| **Divider** | Single divider: **row** of two **vertical** **1px** rects — **#274434** (“Divider Light”), **#1A281C** (“Divider Dark”), stretch vertically |
| Letter **O** | Same letter styling as **S** |
| **Divider** | Same single-divider pattern |
| Middle **O** group | Outer **48×48** cell contains an inner **column** (**absolute** position, ~**48×49**, vertical offset) with: **O** (text) → **Double Divider** → **O** (text). The **double divider** is a **column** of two **horizontal** **1px** bars: **#1A281C** (top), **#274434** (bottom) |
| **Divider** | Single divider |
| Letter **N** | Same letter styling |

**Shell (outer frame):** Background **#0F1F17**, **0.5px** border **#FEFAE01F**, radius **4px**, inset shadow **#0000008F -1px 2px 2px**. Outer flex uses **align-items: start** (Paper export).

## Current implementation (repo snapshot)

- **`LandingOverlay.tsx`:** Maps `["S","O","O","O","N"]` in one horizontal flex row; inserts a **single** divider component between cells and a **double** divider between the third and fourth letters (two **vertical** divider columns side-by-side).
- **`typography.css`:** Matchup cells already target Clarendon variable weight **500**, ultra-condensed, cream, shadow in the same ballpark as Paper. **Single dividers** are implemented as a **vertical column** of two spans using **cream/black rgba**, not Paper’s **green pair**. **Double divider** is **two vertical strips** in a row — **orthogonal** to Paper’s **stacked horizontal hairlines**.
- **`global.css`:** `.pennant-matchup-shell` already tracks the Paper shell closely (dark fill, hairline border, inset shadow, radius).

## Gap summary

1. **Middle “OO” treatment:** Paper = **one horizontal slot** with **vertically stacked** O glyphs and a **horizontal** double rule; web = **two separate horizontal** letter cells.
2. **Divider semantics:** Paper **single** = side-by-side **vertical** greens; Paper **double** = stacked **horizontal** greens; web double **≠** Paper double (different axis).
3. **Divider colors:** Web uses rgba cream/black approximations; Paper uses **#274434** / **#1A281C** for these marks.
4. **Padding / alignment:** Inner `.pennant-matchup` uses gap and padding; Paper frame shows **no padding** on the outer matchup frame — inner rhythm should be reconciled after structure matches.

## Approaches

### Approach A — Full structural parity (**recommended**)

Rebuild the matchup markup so it mirrors Paper: **four** horizontal slots (**S**, **O**, middle column group, **N**) with **three** single dividers in the Paper configuration; middle slot implements the **column** of O / horizontal double rule / O with positioning derived from Paper (`get_computed_styles`, optionally `get_jsx`). Swap divider CSS to the green pair and correct horizontal-vs-vertical geometry.

- **Pros:** Matches design reviews and screenshots; aligns with “Paper is authoritative.”
- **Cons:** Larger React/CSS change; snapshot/tests that assume five `.pennant-matchup__cell` nodes may need revision.

### Approach B — Horizontal simplification (faster)

Keep the **five-across** row; tighten typography and shell only; retune single-divider colors toward Paper greens; accept that the **center pair** and **double divider** will not match Paper’s vertical stacking.

- **Pros:** Small diff, quick ship.
- **Cons:** Still visibly wrong vs Paper on the center treatment — fails “match the design” if interpreted strictly.

### Approach C — JSX-informed pass

After locking structure (A or B), use Paper **`get_jsx`** for the Coming Soon frame and translate into existing BEM-style classes / tokens rather than eyeballing screenshots.

- **Pros:** Reduces missed measurements.
- **Cons:** Does not remove the need to choose A vs B for middle layout.

## Key decisions (draft)

- Treat the selected **Coming Soon** frame as the **scope contract** for this strip (same subtree as “Team Matchup Logos” in the 2026-04-30 plan; layer name may differ).
- Prefer **computed styles + JSX** from Paper MCP over screenshot guesses for colors and dimensions.
- Preserve **`aria-hidden`** on the decorative strip unless product asks for accessible spelling of “SOON.”

## Open questions

*(None — proceed to planning / implementation.)*

---

## Paper reference URL

[Coming Soon frame on Landing Page](https://app.paper.design/file/01KNTATP7SHMYK9GWN2TVVXBDA/5-0/L1X-0) — deep link to file/page/node context.

---

## Resolved questions

- **Fidelity bar (2026-04-30):** **Full structural parity** — rebuild markup/CSS to match Paper’s vertical middle pair, correct single vs double divider geometry, and green divider colors from Paper.
- **Plan consolidation (2026-04-30):** Use **[2026-04-30-001](../plans/2026-04-30-001-feat-align-landing-text-soon-paper-parity-plan.md)** as the single execution document; extend its checklist and Paper notes rather than spinning a separate plan.
- **Visual authority (2026-04-30, superseding fidelity row above for strip layout):** Shipped UI follows the **solari / split-flap reference** ([PR #3](https://github.com/adam-zel/pennant-landing-page/pull/3)); Paper **`L1X-0`** remains reference for **typography** where still aligned. See [pennant-soon-strip-solari-reference.md](../solutions/ui-bugs/pennant-soon-strip-solari-reference.md) and plan **001** “Implementation note”.

## Implementation update (2026-04-30)

The repo **SOON** strip is **not** the Paper-green nested-divider column described in “Paper MCP design context” / “Gap summary” above; those sections document the **Paper file state** at brainstorm time. **Production** matches the **four-column solari** reference (split middle **O**, thin **`#1A281C`** verticals). Treat **plans + this brainstorm +** [pennant-soon-strip-solari-reference.md](../solutions/ui-bugs/pennant-soon-strip-solari-reference.md) together when reconciling design source.
