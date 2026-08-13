---
name: dx-references
description: Loads a dx shared reference document by topic. Invoked by other dx- skills to pull in shared reference material (change-md, effort-md, progress-format, plan-template, plan-data-model, plan-api-contracts, plan-failure-modes, interview, module-design, design-lenses, knowledge-layer, review-report, untrusted-content).
user-invocable: false
arguments: topic
argument-hint: [topic]
---

Read `${CLAUDE_SKILL_DIR}/references/$topic.md` and use its contents to complete the current task.

If that file does not exist, list the files in `${CLAUDE_SKILL_DIR}/references/` and report that topic `$topic` was not found, naming the topics that are available.
