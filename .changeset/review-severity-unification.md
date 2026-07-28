---
"dx-workflow": patch
---

Unify `dx-plan-review` and `dx-impl-review` onto one severity vocabulary (`Blocker`/`Consider`) in the shared `review-report` reference, instead of `impl-review`'s separate `PASS`/`WARNING`/`FAIL` dimension scale. `impl-review` findings now tag with the compound `<Dimension>: <Severity>` form (e.g. `Safety: Blocker`); every finding in either report must carry a location, a **Why it matters** line, and an actionable fix.
