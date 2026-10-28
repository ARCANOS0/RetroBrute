# REFERENCES.md

Repos live in `docs/ref/` (shallow clones, gitignored). Grep for the specific feature; never read whole files. Re-implement ideas, don't paste code. Check each LICENSE; credit in `CREDITS.md`.

| Repo | Take | Look for (grep) |
|---|---|---|
| AnubisNekhet/AnuPpuccin | Style Settings structure (nested groups, class-select tones), color/font setting patterns, plugin-compat selectors | `@settings`, `class-select`, `variable-color` |
| primary-theme/obsidian | Background grid feature, bold colorful palette, how grid is drawn + toggled | `grid`, `background-image`, `linear-gradient` |
| PKM-er/Blue-topaz-example | Pixel Banner / banner-related layout fixes, broad plugin coverage, callout set | `banner`, `pixel`, `callout` |
| emarpiee/Retroma | Retro window/chrome ideas, pixel font usage, retro callouts/code | `font-family`, `title`, `window` |

Plugin sources (copy their `styles.css` into `docs/ref/` for exact selectors):
- `docs/ref/pixel-banner/styles.css`
- `docs/ref/style-settings/` (README only; the `@settings` YAML syntax is: `name`, `id`, `settings:` list of `{id,title,type,default,...}`; types used: `heading`, `class-toggle`, `class-select`, `variable-color` (needs `format`), `variable-text`, `variable-number-slider` (needs `min,max,step`, optional `format`), `variable-select`).
