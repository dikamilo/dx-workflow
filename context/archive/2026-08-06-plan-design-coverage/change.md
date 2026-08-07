---
change_id: plan-design-coverage
title: Close the plan/plan-review design-coverage gap (data model, contracts, edge cases, reversibility)
type: feature
effort: null
slice: null
status: archived
created: 2026-08-06
updated: 2026-08-06
archived_at: 2026-08-06
---

## Notes
Prompted by comparing `dx-plan` against an external spec-writing skill. Most of that skill's
mechanisms don't transfer (project-specific spec format, batched Open-Questions gate dx already
rejected in favor of one-at-a-time interview, market-leader research, emoji severity) — but it
surfaces one real, generic gap with two halves: `plan.md` has no structured place for data
model, API/contract changes, edge cases/failure modes, or reversibility, and nothing forces the
interview to elicit them (authoring side); and `dx-plan-review` has no dimension that checks
those same four concerns once present, so a populated-but-wrong section would pass review
unchallenged (review side). See `brainstorm.md` for the full comparison and the rejected
alternatives.
