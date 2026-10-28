# SETUP_HUMAN.md — for you (not the AI)

## 0. Verify first (I couldn't)
I found no official Sovereign E.G. docs, so these are unverified. Check them in your dashboard before anything else:
- [ ] **Base URL** (must be OpenAI-compatible, usually ends in `/v1`)
- [ ] **Exact model IDs** (I used the IDs shown in your price table: `kimi-k2.5`, `gpt-5-mini`, ...)
- [ ] Test with curl (replace URL/key):
```bash
curl BASE_URL/chat/completions -H "Authorization: Bearer $SOVEREIGN_API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"gpt-5-nano","messages":[{"role":"user","content":"ping"}]}'
```
If this works, OpenCode will work.

## 1. Install
1. Node 20+ and Git.
2. OpenCode: `npm i -g opencode-ai` (or the installer from opencode.ai).
3. Obsidian + a **test vault** (empty, not your real notes). Install community plugins: **Style Settings**, **Pixel Banner**.

## 2. Project layout (simplest, no symlinks)
Put this project folder **inside the test vault's themes folder**:
```
<test-vault>/.obsidian/themes/RetroBrute/   <- this whole folder (opencode runs here)
```
Obsidian reads `manifest.json` + `theme.css` from there. Enable it: Settings → Appearance → Themes → RetroBrute. Create `Sample.md` in the vault with headings, bold/italic/bold-italic, callouts, code, table, tasks, tags (the AI uses it for checks).

Then:
```bash
cd <test-vault>/.obsidian/themes/RetroBrute
git init
mkdir -p docs/ref && cd docs/ref
git clone --depth 1 https://github.com/AnubisNekhet/AnuPpuccin
git clone --depth 1 https://github.com/primary-theme/obsidian primary-theme
git clone --depth 1 https://github.com/PKM-er/Blue-topaz-example
git clone --depth 1 https://github.com/emarpiee/Retroma
mkdir pixel-banner style-settings
```
Copy Pixel Banner's `styles.css` from `<vault>/.obsidian/plugins/pixel-banner/` into `docs/ref/pixel-banner/`. Delete the `.git` folders inside `docs/ref/*` so Git doesn't treat them as submodules. (`docs/ref/` is already gitignored.)
Licenses: skim each repo's LICENSE; the AI only re-implements ideas and credits them.

## 3. API key
Never put the key in the JSON.
- Linux/macOS: `export SOVEREIGN_API_KEY="..."` (add to `~/.bashrc`/`~/.zshrc`)
- Windows PowerShell: `setx SOVEREIGN_API_KEY "..."` then reopen terminal
Alternative: run `opencode`, `/connect` → Other → id `sovereign`, paste key, and delete the `apiKey` line from `opencode.json`.

## 4. Config
`opencode.json` is already in the project. Edit one line: `baseURL`. Then `opencode` → `/models` should list "Sovereign E.G." models. If config errors out:
- `agent.*.permission` rejected → your OpenCode is older; replace with `"tools": { "write": false, "edit": false }` (review) / `"tools": { "edit": false }` (qa).
- `compaction` rejected → delete that line.
- A model shows "not found" → ID mismatch, fix in `provider.sovereign.models` and everywhere it's referenced.

## 5. Model routing (why)
| Job | Agent / model | Price EGP /M in / out |
|---|---|---|
| Main building | `build` kimi-k2.5 | 30.87 / 154.35 |
| Small edits, Style Settings YAML | `fix` gpt-5-mini | 15.44 / 123.48 |
| QA checks | `qa` gemini-3.1-flash-lite | 15.44 / 92.61 |
| Docs, session titles | `docs`, small_model gpt-5-nano | 3.09 / 24.70 |
| Hard CSS bugs | `hard` kimi-k3.1-pro | 123.48 / 617.41 |
| Phase-gate review, planning | `review`/`plan` claude-sonnet-5.5 | 123.48 / 617.41 (cache read 6.17) |
Never use: claude-opus-4.8 (2.5× Sonnet), kimi-k3 (more than K3.1 Pro). Use Sonnet only 3 times total (gates in phases 2, 5, 8) plus planning if you want it.
Switch model inside a session with `/models`; run a subagent with `@fix ...`, `@qa ...`, `@review ...`.

## 6. Workflow (per phase)
1. `git commit` the previous phase.
2. `opencode` → `/new` (fresh context = cheap).
3. Paste the phase prompt from `docs/PLAN.md` (e.g. `Run phase 2 of docs/PLAN.md.`).
4. Let it work; check the theme in Obsidian (light + dark). Obsidian reloads `theme.css` on change; if not, `Ctrl+R`.
5. Problem? Describe it in one line + screenshot path. Same bug fails twice → `@hard`.
6. Commit. Next phase.

## 7. Cost habits
- `AGENTS.md` is sent on every request: keep it short. Don't add to it; add to `docs/`.
- New session per phase; `/compact` if one drags on past ~60k tokens.
- Don't paste whole files into chat; give file + line.
- Ask for diffs, not rewrites. Don't ask for explanations.
- Check balance after phase 1 and 2; if burn is higher than ~25 EGP/phase, something re-reads too much: check the agent isn't running `cat` on big files.
- Rough total: 180–250 EGP.

## 8. Using Style Settings after install
Settings → Style Settings → RetroBrute. Tones, colors, fonts, bold/italic colors, grid, animations are all there. Install the fonts you want first (headings: Space Grotesk / Syne; body: Source Serif 4; mono: JetBrains Mono; optional pixel: "Press Start 2P" or "Silkscreen") and type their names into the font fields.
