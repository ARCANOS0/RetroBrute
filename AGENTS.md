# AGENTS.md — RetroBrute (Obsidian theme)

Loaded every turn. Keep it short. Details live in `docs/` — read only what the task needs.

## Goal
Obsidian theme: neo-brutalist + retro-window + warm Claude-style palette. Light + dark, several tones each, Style Settings + Pixel Banner compatible, desktop only.

## Hard rules (token + quality)
1. Read only the files named in the task. Never read the whole repo. Use Grep, not cat.
2. Edit with diffs. Never rewrite a file to change a few lines. Never re-print a file after editing.
3. No summaries or recaps. Final reply: max 3 lines (what changed, files touched, anything blocked).
4. One phase per session. Start from `docs/PLAN.md` phase text, not from memory.
5. Source files stay under 250 lines. Split by component.
6. Ask nothing unless blocked. Pick the default in `docs/DESIGN.md` and note it.
7. Do not fetch the web. Reference repos are in `docs/ref/` (read-only, grep only).
8. Never copy code from `docs/ref/` blindly: re-implement the idea, check the repo's LICENSE, add credit in `CREDITS.md`.

## Structure
```
manifest.json        theme metadata (do not rename)
theme.css            BUILD OUTPUT. Never edit by hand.
src/
  00-tokens.css      all CSS variables (colors, shadows, radii, fonts)
  01-tones.css       per-tone palettes (light + dark)
  02-base.css        body, typography, markdown elements
  03-ui.css          sidebar, tabs, status bar, modals, menus, settings
  04-components.css  buttons, inputs, toggles, tags, callouts, code, tables
  05-effects.css     grid background, animations, hover/press
  06-plugins.css     Pixel Banner + other plugin fixes
  99-style-settings.css   the /* @settings */ block ONLY
scripts/build.mjs    concatenates src/*.css in filename order -> theme.css
docs/DESIGN.md       tokens + component specs (source of truth)
docs/PLAN.md        phases, acceptance checks, agent assignment
docs/REFERENCES.md   what to take from each reference theme
```

## Conventions
- Prefix every custom variable `--rb-`, every custom class `rb-`.
- Never hardcode a color outside `00-tokens.css` / `01-tones.css`. Use variables.
- Readable names: `--rb-shadow-hard`, not `--s1`. No clever selectors; max 3 levels deep.
- Obsidian's own variables (`--background-primary`, `--text-normal`, `--interactive-accent`...) get mapped FROM `--rb-*` tokens in `02-base.css`.
- Every animation sits behind `body:not(.rb-no-anim)`. Also honor `prefers-reduced-motion`.
- Text on a fill must use the paired `--rb-on-*` token (dark text on light fills, light text on dark fills). Never colored text on a colored fill.
- Style Settings ids are `rb-` prefixed. Toggles = `class-toggle`, pickers = `variable-color` (format hex), fonts = `variable-text`.

## Done check (every phase)
`node scripts/build.mjs` passes, theme loads in `test-vault` in light AND dark with no console errors, acceptance list in the phase is ticked.

Derived tokens (anything that uses var(--rb-ink) or var(--rb-shadow-color)) must be declared on body, not :root