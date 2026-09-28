---
effort_id: refactor-discover-standards
title: dx-refactor-discover works with the project's own standards
status: scoped
created: 2026-09-28
updated: 2026-09-28
archived_at: null
---

## Goal
`dx-refactor-discover` treats a project's `context/standards/` as part of what it checks and what it produces. Existing code that doesn't follow a project rule surfaces as a ranked, promotable refactor finding. When findings keep repeating a pattern that no rule covers, the run suggests a new or amended standard so the same issue doesn't come back. Suggestions are printed with the `/dx-standards-update` command to run, and the skill never writes the standard itself.

## Notes
Created by `/dx-brainstorm` — see `brainstorm.md` for the alternatives, the resolved unknowns, and what is out of scope. Two capabilities that each ship on their own (bundling test): (1) scan code against existing standards, (2) suggest standards based on the findings. The order of the slices is `/dx-roadmap`'s decision; the brainstorm's read is that (1) goes first.
