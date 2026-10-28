# PLAN.md — phases, agents, acceptance

Rule: one phase = one fresh OpenCode session (`/new`). Paste only the phase's "Prompt" line. Agent = which OpenCode agent/model runs it (see `opencode.json`). Commit after every phase.

Agents: `build` kimi-k2.5 (bulk CSS) · `fix` gpt-5-mini (small edits, YAML) · `qa` gemini-3.1-flash-lite (checks) · `docs` gpt-5-nano · `hard` kimi-k3.1-pro (escalation only) · `review` claude-sonnet-5.5 (gates only, read-only) · `plan` claude-sonnet-5.5 (read-only planning).

| # | Phase | Files | Agent | Gate |
|---|---|---|---|---|
| 0 | Scaffold check | build.mjs, manifest | fix | — |
| 1 | Tokens + tones | 00, 01 | build | — |
| 2 | Base + typography + markdown | 02 | build | **review** |
| 3 | App chrome | 03 | build (hard if stuck) | — |
| 4a | Buttons, inputs, toggles, tags | 04 (part 1) | build | — |
| 4b | Callouts, code, tables, misc | 04 (part 2) | build | — |
| 5 | Grid + animations | 05 | build | **review** |
| 6 | Style Settings block | 99 | fix | — |
| 7 | Pixel Banner + plugin compat | 06 | build → hard | — |
| 8 | QA sweep + polish | any | qa → fix | **review** |
| 9 | README, credits, release | docs | docs | — |

Rough cost (EGP, from Sovereign price table): build phase ≈ 10–18, fix ≈ 3–6, qa ≈ 2–4, review ≈ 10–15, docs ≈ 1–2. Whole project ≈ 180–250 EGP. Same work on Sonnet only ≈ 4–5× more.

---
## Phase 0 — Scaffold check  (`fix`)
Prompt: `Run phase 0 of docs/PLAN.md.`
- Run `node scripts/build.mjs`; make sure it creates `theme.css` from `src/*.css`.
- Create empty-but-valid `src/00..06` and `99` files with a one-line header comment each.
- Add minimal `99-style-settings.css` with one test toggle (`rb-no-anim`).
- Accept: build passes; theme listed + selectable in `test-vault`; Style Settings shows "RetroBrute".

## Phase 1 — Tokens + tones  (`build`)
Prompt: `Run phase 1 of docs/PLAN.md. Use docs/DESIGN.md.`
- `00-tokens.css`: all `--rb-*` core tokens, accent palette + `--rb-on-*`, font stacks.
- `01-tones.css`: 3 light + 3 dark tones as `body.theme-light.rb-tone-<n>` / `body.theme-dark.rb-tone-<n>`; defaults apply when no tone class is set.
- Accept: switching tone class in devtools changes surfaces/ink only; every accent keeps readable `--rb-on-*` (contrast ≥ 4.5:1).

## Phase 2 — Base + typography + markdown  (`build`) → review
Prompt: `Run phase 2 of docs/PLAN.md.`
- Map `--rb-*` → Obsidian vars (`--background-*`, `--text-*`, `--interactive-*`, `--color-*`, `--font-*`).
- Headings H1–H6, paragraphs, links, lists, blockquote, hr, inline code, highlight.
- Bold / italic / bold-italic / normal colors for reading view AND live preview (`.cm-strong`, `.cm-em`, combined).
- Accept: sample note (`test-vault/Sample.md`) renders correctly in both views; bold-italic color applies in both.
- Then run `@review` on `src/00-02` (one pass, list defects only).

## Phase 3 — App chrome  (`build`)
Prompt: `Run phase 3 of docs/PLAN.md.`
- Sidebars, file explorer, tabs (yellow active), status bar, ribbon, title bar, modals, menus, tooltips, notices, scrollbars, settings window.
- Accept: no layout shift vs default theme; sidebars collapse/expand cleanly; 1080p, 1440p, ultrawide and a narrow 1000px window all fine.

## Phase 4a/4b — Components  (`build`, two sessions)
Prompt: `Run phase 4a of docs/PLAN.md.` / `4b`
- 4a: buttons (fill/stroke × icon left/right × 3 states × 5 colors), inputs, search, dropdown, slider, toggles, checkboxes, tags.
- 4b: callouts (all built-in types), code blocks (window chrome), tables, embeds, footnotes, progress, canvas cards.
- Accept: matches the reference images' spacing, border, shadow; one shared mixin-like pattern (same variables) across all.

## Phase 5 — Grid + animations  (`build`) → review
Prompt: `Run phase 5 of docs/PLAN.md.`
- `rb-grid` background (size/line/opacity vars). Hover/press/modal/checkbox animations behind `body:not(.rb-no-anim)`. Transform/opacity only.
- Accept: with `rb-no-anim` there are zero transitions/animations (`grep -c transition` only inside the guarded block); CPU idle when nothing moves.
- Then `@review` on `src/05`.

## Phase 6 — Style Settings block  (`fix`)
Prompt: `Run phase 6 of docs/PLAN.md.`
- Write `99-style-settings.css` for every group in DESIGN.md. Every setting id maps to an existing variable/class (grep to verify; no orphans).
- Accept: every control changes something visibly; reset restores defaults.

## Phase 7 — Pixel Banner + plugins  (`build`, escalate to `hard`)
Prompt: `Run phase 7 of docs/PLAN.md. Selectors come from docs/ref/pixel-banner/styles.css.`
- Fix conflicts only; follow the compat rules in DESIGN.md.
- Accept: banner shows full-width, correct height, grid behind it, header/title not clipped, works in light+dark.

## Phase 8 — QA sweep  (`qa` → `fix` → `review`)
Prompt: `Run phase 8 of docs/PLAN.md.`
- `qa`: build, check for hardcoded colors outside tokens, missing `--rb-on-*` pairs, `!important` count, unguarded animations, files > 250 lines. Output a short defect list.
- `fix`: apply fixes from the list, diffs only.
- `review`: final read-only pass on the defect list + diff summary.

## Phase 9 — Docs/release  (`docs`)
Prompt: `Run phase 9 of docs/PLAN.md.`
- README (install, settings, screenshots slots), CREDITS.md, CHANGELOG, `manifest.json` version. For the Obsidian community theme list, repo needs `manifest.json`, `theme.css`, `README`, a screenshot.

## Escalation rule
Same bug unfixed after 2 attempts → stop, switch that task to `@hard`. Not Sonnet/Opus. Opus is never used.
