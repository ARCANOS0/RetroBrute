# DESIGN.md — source of truth

Name (working): **RetroBrute**. Change in `manifest.json` later.

## Look in one line
Neo-brutalism skeleton (thick border + hard offset shadow + saturated fills) + retro OS window chrome (title bars, 3-dot controls, pixel accents, grid paper) + Claude-style warmth (cream paper, terracotta accent, serif-ish headings in dark mode).

## Core tokens (defaults; every one is user-overridable via Style Settings)
```
--rb-border-width: 2px;
--rb-border-color: var(--rb-ink);
--rb-shadow-x: 3px;  --rb-shadow-y: 3px;       /* hard shadow, blur always 0 */
--rb-shadow-hard: var(--rb-shadow-x) var(--rb-shadow-y) 0 var(--rb-shadow-color);
--rb-shadow-hover: 1px 1px 0 var(--rb-shadow-color);   /* "pressed" feel */
--rb-radius-s: 4px; --rb-radius-m: 8px; --rb-radius-pill: 999px;
--rb-grid-size: 24px; --rb-grid-line: 1px;
--rb-anim-speed: 120ms;
```
Press interaction: hover = lift (translate -1px,-1px, shadow grows 1px). Active = press (translate to shadow offset, shadow -> 0). Disabled = 45% opacity, shadow stays, no motion.

## Accent palette (from references; same hue names in every tone)
| name | hex | role |
|---|---|---|
| mint | #7FE8C8 | primary / success |
| orange | #F2A07B | warning |
| red | #F26B7A | danger |
| violet | #8B78E6 | info |
| yellow | #FFD95A | highlight / tabs |
| lime | #D7F25A | accent 2 |
| aqua | #AEF2E8 | accent 3 |
| pink | #FF85AE | accent 4 |
| lavender | #CBB4F8 | soft violet |
| terracotta | #D97757 | Claude accent (default `--interactive-accent`) |
| grey | #4B5057 | secondary |

Each has `--rb-<name>` and `--rb-on-<name>` (readable text on it). Light-on-dark rule: only grey, violet(dark mode), red(dark mode) use light text.

## Tones (default = first)
Light: **cream** (#F5EBD7 paper, ink #1B1B1B) · **mint-paper** (#EAF8F2) · **lavender-fog** (#EFEAFF)
Dark: **charcoal** (#1F1E1D, terracotta accent) · **midnight-violet** (#17152B) · **cocoa** (#241B17)
Implemented as body classes `rb-tone-<name>` set by a Style Settings `class-select` (one for light, one for dark). Tones only redefine surface/ink tokens + default accent; component CSS never changes per tone.

## Surfaces (map to Obsidian vars in 02-base.css)
- `--rb-bg` app background (grid sits on this)
- `--rb-surface` cards, editor, modals
- `--rb-surface-2` sidebars, inputs
- `--rb-ink` text + borders, `--rb-ink-soft` secondary text
- `--rb-shadow-color` = ink in light; near-black or accent-tinted in dark

## Typography
- Headings: wide/geometric display. Default stack `"Space Grotesk","Syne",system-ui,sans-serif`. Variable `--rb-font-heading`.
- Body: `--rb-font-text` default `"Source Serif 4",Georgia,serif` in dark/Claude tones, switchable to mono.
- Mono/UI/retro: `--rb-font-mono` default `"JetBrains Mono","Courier New",monospace`; optional pixel font `--rb-font-pixel` for titles/status bar.
- Do not bundle or @import fonts. User installs fonts; stacks fall back safely.
- Per-style text colors (all via Style Settings color pickers, default = inherit ink):
  `--rb-color-bold`, `--rb-color-italic`, `--rb-color-bolditalic`, `--rb-color-normal`, `--rb-color-highlight-bg`.
  Selectors must cover reading view (`.markdown-rendered strong/em/strong em/em strong`) AND live preview/source (`.cm-strong`, `.cm-em`, element carrying both classes).
- Per-heading toggles: H1–H6 color + size scale + optional underline "marker" bar.

## Components (match the reference images)
1. **Buttons**: filled / stroke × (no icon, left icon, right icon) × states default/hover/disabled × colors primary/warning/danger/info/secondary. Map to `button`, `.mod-cta`, `.mod-warning`, plus helper classes `rb-btn-<color>`, `rb-btn-stroke`.
2. **Window chrome**: modals, code blocks, callouts and embeds get an optional title bar with 3 dots (`rb-window` look, toggle in settings).
3. **Toggles/checkboxes/radios**: square or pill, thick border, filled color when on, task checkboxes colored per status (`[ ]`,`[x]`,`[/]`,`[-]`,`[!]`).
4. **Inputs/search/dropdown/slider**: bordered, hard shadow, focus = accent ring offset; slider thumb square.
5. **Tabs**: active tab = yellow fill + border; inactive flat. Pinned/stacked tabs supported.
6. **Sidebar/file explorer**: flat rows, active file = filled accent chip with border; folders chevron retro.
7. **Tags/chips**: pill, colored by hash-free fixed cycle (6 colors via `:nth-of-type`).
8. **Callouts**: one color per type (note/tip/warning/danger/info/quote...), thick border, hard shadow, header strip.
9. **Tables**: bordered cells, header row filled, zebra optional.
10. **Menus/context/popovers/tooltips/notices**: bordered card + shadow.
11. **Status bar + ribbon**: retro strip, pixel font optional.
12. **Scrollbars**: thick, square thumb, bordered.
13. **Misc**: progress bars (segmented look), blockquote, hr (double-line), code inline (chip), footnotes, embeds, canvas cards, graph colors via variables.

## Effects
- **Grid background**: toggle `rb-grid`; size / line color / opacity variables. Draw with two `linear-gradient`s on `.workspace-leaf-content` background (no images, no JS). Grid tone follows tone (ink at 8% light, white at 6% dark).
- **Animations** (all off when `body.rb-no-anim`): button press, hover lift, tab slide-in, modal pop (scale .96→1), checkbox bounce, callout fold. No `box-shadow` animation on large elements; animate `transform` + `opacity` only (cheap).
- Setting: "Reduce animations" (class-toggle `rb-no-anim`) default OFF; automatically on under `prefers-reduced-motion`.

## Style Settings groups (ids prefixed `rb-`)
General (tone light / tone dark, border width, shadow size, radius, grid on/off+size) · Colors (accents, bold/italic/bolditalic/normal text colors) · Fonts (heading/text/mono/pixel + sizes) · Headings (H1–H6) · Components (window chrome toggle, button style fill/stroke, checkbox shape) · Effects (animations, speed) · Plugins (Pixel Banner offsets, banner border toggle).

## Pixel Banner / plugin compat rules
- Never set `overflow:hidden` or fixed `height` on `.workspace-leaf-content`, `.view-content`, `.markdown-source-view`, `.markdown-reading-view` (banner relies on its own layout).
- Do not restyle `.pixel-banner-*` / banner image containers except: optional border + hard shadow via a class-toggle, and `z-index` safety.
- Grid background must render BEHIND the banner (`background-attachment` on parent, no pseudo-element overlay with positive z-index).
- Get real class names by reading the plugin's `styles.css` in `docs/ref/pixel-banner/` (user copies it there). Do not guess selectors.
- Style Settings itself: theme only needs the `/* @settings */` block in `99-style-settings.css`; plugin renders its UI with Obsidian vars, so just ensure inputs/toggles inside `.style-settings-container` look right.
