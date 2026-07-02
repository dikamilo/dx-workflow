# `plan.md` — shape

`plan.md` is the solution design for one change. It carries the matched knowledge layer, the phase breakdown, and owns `## Progress` (see `progress-format`). Written by `dx-plan`, read by `dx-plan-review` and the implementers.

## Sections

```markdown
# Plan: <title>

## Approach
<the chosen solution in a few sentences — what and why, drawn from the interview>

## Standards to apply
> Matched from context/standards/ by domain + topic. A checklist the implementer follows and impl-review verifies.
- [ ] <standard>: <one-line how it applies here>

## Priors & gotchas
> From foundation/lessons.md — decisions already made and scar tissue not to relitigate.
- <lesson that bears on this change>

## Phases
### Phase N: <name>   — vertical slice where practical
<what this phase delivers end-to-end>

## Progress
<see progress-format — the execution single-source-of-truth>
```

## Conditional phases by `type`
Read `change.md`'s `type` and activate the matching characteristic in the phases (mirrors the "characteristic per type" rule — not an orchestrator):
- `defect` → **TDD gate**: first phase writes the failing regression test, then the fix.
- `refactor` → **behavior-preserving gate**: tests green before and after; a phase asserts observable behavior is unchanged while depth/locality/testability improve. Load `module-design`.
- `migration` → **rollback phase**: an explicit, user-confirmed rollback step (never auto-rollback).
- `feature` → no extra characteristic.

## Scaling
Plan depth scales to complexity and to what upstream already settled (see `interview` for question-scaling). A trivial change gets a thin, single-phase plan with near-zero questions — `dx-plan` is never skipped (it owns `## Progress`), it just scales down.
