// Lints the /* @settings */ blocks in theme.css. No dependencies.
// Usage: node scripts/check-settings.mjs   (run after node scripts/build.mjs)
import { readFileSync } from "node:fs";

const css = readFileSync("theme.css", "utf8");
const blockPattern = /\/\*\s*@settings([\s\S]*?)\*\//g;
const blocks = [...css.matchAll(blockPattern)];
const cssWithoutBlocks = css.replace(blockPattern, "");
const cssNoComments = cssWithoutBlocks.replace(/\/\*[\s\S]*?\*\//g, "");

// Bodies of every rule whose selector mentions .className
const ruleBodiesFor = (className) => {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`([^{}]*\\.${escaped}(?![\\w-])[^{}]*)\\{([^{}]*)\\}`, "g");
  return [...cssNoComments.matchAll(pattern)].map((m) => m[2]);
};

const requiredKeys = {
  heading: ["title"],
  "class-toggle": ["title"],
  "class-select": ["title", "default", "options"],
  "variable-text": ["title", "default"],
  "variable-number": ["title", "default"],
  "variable-number-slider": ["title", "default", "min", "max", "step"],
  "variable-select": ["title", "default", "options"],
  "variable-color": ["title", "default", "format"],
};

const problems = [];
const seenIds = new Map();
const toggleIds = [];
const report = (message) => problems.push(message);

if (blocks.length === 0) report("No @settings block found in theme.css");

blocks.forEach((match, blockIndex) => {
  const label = `block ${blockIndex + 1}`;
  const lines = match[1].split("\n");

  if (match[1].includes("\t")) report(`${label}: contains a TAB character (YAML needs spaces)`);
  if (!/^\s*name:\s*\S+/m.test(match[1])) report(`${label}: missing top-level "name:"`);
  if (!/^\s*id:\s*\S+/m.test(match[1])) report(`${label}: missing top-level "id:"`);
  const settingsKeyCount = (match[1].match(/^\s*settings:\s*$/gm) || []).length;
  if (settingsKeyCount === 0) report(`${label}: missing "settings:" list`);
  if (settingsKeyCount > 1) {
    report(`${label}: NESTED "settings:" found (${settingsKeyCount}). Style Settings ignores nested lists: keep ONE flat list, headings first, their settings right after at the same indent.`);
  }

  let item = null;
  const finishItem = () => {
    if (!item) return;
    const needed = requiredKeys[item.type];
    if (!needed) {
      report(`${label}: item "${item.id}" has unknown type "${item.type}"`);
    } else {
      needed.forEach((key) => {
        if (!(key in item.keys)) report(`${label}: item "${item.id}" (${item.type}) is missing "${key}"`);
      });
    }
    if (seenIds.has(item.id)) report(`${label}: duplicate id "${item.id}" (also in ${seenIds.get(item.id)})`);
    seenIds.set(item.id, label);

    // Orphan check: the CSS must actually use the setting.
    if (item.type === "class-toggle") {
      const bodies = ruleBodiesFor(item.id);
      if (bodies.length === 0) {
        report(`ORPHAN: class-toggle "${item.id}" is never used as a selector (.${item.id})`);
      } else if (bodies.every((body) => !body.includes(":"))) {
        report(`EMPTY: class-toggle "${item.id}" only appears in rules with no declarations, so it does nothing`);
      }
      toggleIds.push(item.id);
    }
    if (item.type.startsWith("variable-") && !cssWithoutBlocks.includes(`--${item.id}`)) {
      report(`ORPHAN: variable "${item.id}" is never used as var(--${item.id})`);
    }
  };

  lines.forEach((line) => {
    const itemStart = line.match(/^\s*-\s+id:\s*(\S+)/);
    if (itemStart) {
      finishItem();
      item = { id: itemStart[1], type: "", keys: {} };
      return;
    }
    if (!item) return;
    const keyLine = line.match(/^\s+([A-Za-z][\w-]*):\s*(.*)$/);
    if (keyLine) {
      item.keys[keyLine[1]] = keyLine[2];
      if (keyLine[1] === "type") item.type = keyLine[2].trim();
    }
  });
  finishItem();
});

// An animation toggle is pointless if the theme has no transitions/animations to turn off.
const animToggle = toggleIds.find((id) => /anim/.test(id));
if (animToggle) {
  // Drop only the "off switch" rules (body.rb-no-anim ...), keep body:not(.rb-no-anim) ... rules.
  const withoutGuard = cssNoComments.replace(/([^{}]+)\{([^{}]*)\}/g, (rule, selector) =>
    selector.includes("rb-no-anim") && !selector.includes(":not(.rb-no-anim)") ? "" : rule
  );
  const motionCount = (withoutGuard.match(/transition\s*:|animation\s*:|@keyframes/g) || []).length;
  if (motionCount === 0) {
    report(`NO MOTION: "${animToggle}" exists but the theme has no transition/animation/@keyframes rules outside the guard`);
  }
}

if (problems.length === 0) {
  console.log(`OK: ${blocks.length} @settings block(s), ${seenIds.size} settings, no problems.`);
} else {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((message) => console.log(" - " + message));
  process.exit(1);
}