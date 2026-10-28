// Joins src/*.css (filename order) into theme.css. No dependencies.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const srcDir = "src";
const files = readdirSync(srcDir).filter((name) => name.endsWith(".css")).sort();

const header = "/* RetroBrute - built file. Edit src/*.css, then run: node scripts/build.mjs */\n";
const body = files
  .map((name) => `\n/* ===== ${name} ===== */\n` + readFileSync(join(srcDir, name), "utf8"))
  .join("");

writeFileSync("theme.css", header + body);
console.log(`Built theme.css from ${files.length} files`);
