---
name: dx-references
description: "Loads one or more dx shared reference documents by topic (space-separated, one call). Invoked by other dx- skills to pull in shared reference material (change-md, effort-md, progress-format, plan-template, plan-data-model, plan-api-contracts, plan-failure-modes, interview, module-design, design-lenses, knowledge-layer, untrusted-content)."
user-invocable: false
arguments: topics
argument-hint: "[topic...]"
---

Topics: $ARGUMENTS (space-separated). Read `${CLAUDE_SKILL_DIR}/references/<topic>.md` for every topic, in one call, and use their contents to complete the current task.

For any topic whose file does not exist, list the files in `${CLAUDE_SKILL_DIR}/references/` and report that topic as not found, naming the topics that are available. Still return the ones that were found.
