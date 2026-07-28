#!/usr/bin/env node
// Mechanical enforcement of CLAUDE.md's "Authoring rules" over skills/dx-*.
// See context/standards/global/skill-authoring.md for the rules this checks.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SKILLS_DIR = join(ROOT, "skills");
const DOCS_FILE = join(ROOT, "docs/reference/skills.md");
const REFERENCES_DIR = join(SKILLS_DIR, "dx-references/references");

let failed = false;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed = true;
}

function parseFrontmatter(text) {
  const lines = text.split("\n");
  if (lines[0].trim() !== "---") return null;
  const end = lines.indexOf("---", 1);
  if (end === -1) return null;
  const fields = {};
  for (const line of lines.slice(1, end)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fields, body: lines.slice(end + 1) };
}

function isFullyQuoted(value) {
  return (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  );
}

const skillNames = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith("dx-"))
  .map((d) => d.name)
  .sort();

const referenceTopics = new Set(
  readdirSync(REFERENCES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
);

// Checks 1-3: frontmatter shape, description quoting, body size (advisory).
const bodySizes = [];
for (const name of skillNames) {
  const skillPath = join(SKILLS_DIR, name, "SKILL.md");
  if (!existsSync(skillPath)) {
    fail(`${name}: missing SKILL.md`);
    continue;
  }
  const text = readFileSync(skillPath, "utf8");
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    fail(`${name}/SKILL.md: no valid frontmatter block (must open and close with '---')`);
    continue;
  }
  const { fields, body } = parsed;
  const loc = `${name}/SKILL.md`;

  if (!fields.name) {
    fail(`${loc}: missing required frontmatter key 'name'`);
  } else if (fields.name !== name) {
    fail(`${loc}: frontmatter name '${fields.name}' does not match folder '${name}'`);
  }

  if (!fields.description) {
    fail(`${loc}: missing required frontmatter key 'description'`);
  } else if (!isFullyQuoted(fields.description) && fields.description.includes(": ")) {
    fail(`${loc}: description contains unquoted ': ' — quote the whole value or remove the colon`);
  }

  if ("disable-model-invocation" in fields && "user-invocable" in fields) {
    fail(`${loc}: sets both 'disable-model-invocation' and 'user-invocable' — pick one shape`);
  }

  const bodyText = body.join("\n").trim();
  bodySizes.push([name, bodyText ? bodyText.split("\n").length : 0]);
}

// Check 4: every `dx-references` call site resolves to an existing reference topic.
// Only call sites of the form "dx-references` with [topic ]`<topic>`" are recognized —
// looser phrasing (e.g. "with each topic") isn't mechanically checkable and is skipped.
const callSitePattern = /dx-references`\s*\*{0,2}\s*with\s+(?:topic\s+)?`([a-z][a-z-]*)`/g;
for (const name of skillNames) {
  if (name === "dx-references") continue;
  const skillPath = join(SKILLS_DIR, name, "SKILL.md");
  if (!existsSync(skillPath)) continue;
  const text = readFileSync(skillPath, "utf8");
  for (const match of text.matchAll(callSitePattern)) {
    const topic = match[1];
    if (!referenceTopics.has(topic)) {
      fail(`${name}/SKILL.md: invokes dx-references with topic '${topic}', which has no skills/dx-references/references/${topic}.md`);
    }
  }
}

// Check 5: docs-sync between skills/dx-* and docs/reference/skills.md headings.
const docsText = existsSync(DOCS_FILE) ? readFileSync(DOCS_FILE, "utf8") : "";
const docHeadings = new Set(
  [...docsText.matchAll(/^### `\/?(dx-[a-z-]+)`/gm)].map((m) => m[1])
);

for (const name of skillNames) {
  if (!docHeadings.has(name)) {
    fail(`${name}: no matching heading in docs/reference/skills.md`);
  }
}
for (const heading of docHeadings) {
  if (!skillNames.includes(heading)) {
    fail(`docs/reference/skills.md: heading for '${heading}' has no matching skills/${heading} folder`);
  }
}

// Report body sizes (advisory only — no cap exists yet).
console.log("Body size (lines), advisory only:");
for (const [name, size] of bodySizes.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${size}\t${name}`);
}

if (failed) {
  process.exit(1);
} else {
  console.log("OK: all skill lint checks passed.");
}
