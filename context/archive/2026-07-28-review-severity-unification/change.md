---
change_id: review-severity-unification
title: Review severity unification
type: refactor
effort: sdlc-hardening
slice: 4
status: archived
created: 2026-07-28
updated: 2026-07-28
archived_at: 2026-07-28
---

## Notes
Replace the two divergent severity scales used by `dx-plan-review` (`[Blocker]`/`[Consider]`) and `dx-impl-review` (`PASS`/`WARNING`/`FAIL`) with a single scale shared via `review-report.md`. Add a rule that every finding must carry a location, why it matters, and an actionable fix. Higher blast radius than slices 2-3 since `review-report.md` is consumed by both review skills — sequenced after the lower-risk additive edits.

Inherits effort `sdlc-hardening`'s research/frame in place; no separate research/frame for this change.
