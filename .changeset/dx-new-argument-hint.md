---
"dx-workflow": patch
---

Fix `/dx-new` not installing via `npx skills add`: its `argument-hint` frontmatter was invalid YAML, so the installer silently skipped the skill.
