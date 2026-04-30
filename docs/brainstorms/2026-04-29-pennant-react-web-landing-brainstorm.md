# Brainstorm: Pennant — React web landing (responsive)

**Date:** 2026-04-29  
**Sources:** Paper file “Pennant” / page “Landing Page”; `pennant-cursor-prompt.txt` (WebGL field spec).

**Note:** Initial exploration mentioned React Native; **stakeholder direction:** this is a **React web** marketing landing, **mobile-responsive** (not a native app shell).

## What we’re building

A **React** (web) **marketing landing** for Pennant (baseball companion for iPhone): Paper-approved copy and typography, **live WebGL field** per `pennant-cursor-prompt.txt` (day/night, grass, chalk, lights, cursor wake), and layouts that **scale cleanly from phone to desktop**.

**Out of scope for this brainstorm:** framework choice (Vite vs Next), component library, and GL wrapper specifics. Those belong in `/ce:plan`.

## Design context from Paper (copy + type)

### Copy (authoritative strings)

| Role | Text |
|------|------|
| Wordmark | `Pennant` |
| Display lines (uppercase in design) | `Baseball` · `Without` · `The Noise.` |
| Supporting paragraph | `Pennant is your new baseball companion. Pick your team once. Open it every day. It tells you what's happening, who's playing, and where your team stands.` *(Paper / `src/siteCopy.ts` — supersedes earlier “for iPhone” draft.)* |
| Team matchup row | Placeholder letterforms in design: `S`, `O`, `O`, `O`, `N` (treat as **visual placeholders** until real assets or team data exist). |

### Color (from computed styles)

- **Primary text / wordmark / display:** `#FEFAE0`
- **Field / page:** dark green artboard treatment (exact fills live on non-text nodes in Paper; match in plan to `#0F1F17` / `#030906` family from the WebGL brief for night/day continuity).

### Typography roles (from Paper computed CSS)

**Display / wordmark — Job Clarendon Variable**

- Wordmark (`Pennant`): 32px, line-height 32px, `fontWeight` 600, `fontStretch` ultra-condensed, `fontFeatureSettings`: `"ss03", "ss04", "ss07"`, color `#FEFAE0`.
- Headlines (`Baseball`, `The Noise.`): 96px, line-height 88px, uppercase, `fontWeight` 600, same stretch + stylistic sets + color.
- Headline (`Without`): same as above but `fontWeight` 300 (light) for contrast within the stack.
- Matchup row glyphs: 40px, line-height 48px, centered, `fontWeight` 500, ultra-condensed, `textShadow` `rgba(0,0,0,0.48) 0 2px 3px` (approx. `#0000007A`).

**Body — SF Pro**

- 16px, line-height 24px, `fontWeight` 274 (Light), color `#FEFAE0`.

### Variable font axes (for parity when implementing)

**Job Clarendon Variable** (from `get_font_family_info`)

| Axis tag | Range | Notes |
|----------|--------|--------|
| `wght` | 1–900 | Paper uses ~300, 500, 600 on key lines. |
| `wdth` | 25–50 | Paper encodes width as `fontStretch: ultra-condensed`; map to axis values in plan (likely low `wdth`). |

**Stylistic sets:** preserve `ss03`, `ss04`, `ss07` on Clarendon blocks where Paper uses them.

**SF Pro** (from `get_font_family_info` — system / Apple)

| Axis tag | Range | Notes |
|----------|--------|--------|
| `wght` | 1–1000 | Body ~274. |
| `wdth` | 30–150 | Default “100” width family in many instances. |
| `opsz` | 17–28 | Optical size; plan should tie 16px body to appropriate `opsz` if variable SF Pro is used. |

**Web responsive note:** On the web, SF Pro is available on Apple platforms via system font stacks; **other browsers/OSes** should get a documented **fallback stack** (e.g. `system-ui` + neo-grotesque) so layout and rhythm stay stable. **Job Clarendon Variable** ships via **`@font-face`** (licensed files) with **`font-variation-settings`** for `wght` / `wdth` and `font-feature-settings` for `ss03`, `ss04`, `ss07`.

## Relationship to the WebGL landing prompt

The prompt file describes a WebGL canvas layer: grass shader, chalk lines, night lights, cursor wake, theme toggle, grain. For this product:

- **Narrative fit:** Paper is **text-forward** over a **nocturnal / pastoral** baseball mood; the shader is the **full-bleed background** (z-index under UI).
- **Stakeholder call:** **Live GL** is in scope (not a static poster for v1).

## Approaches (2–3)

### A — Single page: React + canvas WebGL + HTML/CSS typography (recommended)

**Description:** One responsive document: **canvas** implements `pennant-cursor-prompt.txt`; **HTML/CSS** (or React components) overlay Paper copy. Theme toggle drives both **data-theme** on `html` and shader `u_night`. Pointer events on `window` as in the spec.

**Pros:** Matches existing shader spec closely; SEO-friendly text in the DOM; straightforward responsive reflow for the text column.  
**Cons:** Must tune **mobile performance** (DPR cap, throttle if needed) and **safe areas** for notched phones.

### B — Split bundle: lazy GL + static fallback

**Description:** Ship a lightweight first paint (gradient + grain) and **lazy-load** the full WebGL module; if WebGL fails, degrade to still or CSS-only.

**Pros:** Resilience and perceived performance on low-end devices.  
**Cons:** More moving parts; two visual truths to maintain.

### C — GL inside a dedicated component with layout isolation

**Description:** Same as A but strict boundary: canvas is `position: fixed` full viewport; content is a single scrollable column or sticky hero so shader never fights reflow.

**Pros:** Clear layering model; easier to reason about z-index and accessibility.  
**Cons:** Slightly more layout discipline on long pages if the landing grows.

## Recommendation

**Approach A** as the default architecture: **live WebGL background + React-managed overlay** that implements Paper’s type and copy. Add **B’s** lazy/degrade path only if analytics show a meaningful slice of devices without WebGL or with severe jank.

## Key decisions (proposed)

- **Copy and type scale** follow the **Paper** artboard “Pennant Landing Page” as the single source of truth for strings and hierarchy.
- **Variable fonts (web):** Load **Job Clarendon Variable** with CSS **`font-variation-settings: 'wght' …, 'wdth' …`** aligned to Paper weights (300 / 500 / 600) and width; use **`font-feature-settings: 'ss03', 'ss04', 'ss07'`** on Clarendon blocks. Body: **SF Pro** where available, with a **system fallback** chain for Windows/Android.
- **Responsive:** Use **fluid type** (clamp) from Paper’s **desktop px** values down to **readable mobile** minimums; preserve **line-length** for the paragraph (max-width container).
- **WebGL prompt** is the **authoritative motion layer**; extend the existing HTML spec to include **overlay text** without breaking shader rules (no cursor glow, no idle motion, smootherstep fade, etc.).
- **Matchup row** in Paper is **placeholder**; marketing may swap to **real team marks** or **generic silhouettes** — decide before launch.

## Open questions

*(None blocking — stakeholder answers captured below.)*

## Resolved questions

1. **Surface:** **Marketing** React web landing (not in-app RN). *(2026-04-29)*
2. **Background:** **Live WebGL** per `pennant-cursor-prompt.txt` is required. *(2026-04-29)*
3. **Platforms:** **Web, mobile-responsive** — not a native mobile app deliverable; use responsive CSS + touch/pointer behavior compatible with the shader’s pointer model. *(2026-04-29)*
