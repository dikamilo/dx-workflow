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

## Conditional sections by relevance
Three sections sit right after `## Approach`, each populated only when the change actually touches
that concern (`dx-plan` gates them with a one-line relevance trigger before interviewing):
- `## Data model` — the change adds, removes, or reshapes a schema, table, or persisted structure.
  Load `plan-data-model`.
- `## API & contracts` — the change adds or changes an endpoint, function signature, event, or
  message another caller depends on. Load `plan-api-contracts`.
- `## Failure modes & reversibility` — the change introduces an external call, a migration, or
  needs an undo path once shipped. Load `plan-failure-modes`.

**Omit a section entirely when it doesn't apply — never write `N/A` or a placeholder.** A trivial
plan with none of these concerns in play carries none of these headers.

## Conditional phases by `type`
Read `change.md`'s `type` and activate the matching characteristic in the phases (mirrors the "characteristic per type" rule — not an orchestrator):
- `defect` → **TDD gate**: first phase writes the failing regression test, then the fix.
- `refactor` → **behavior-preserving gate**: tests green before and after; a phase asserts observable behavior is unchanged while depth/locality/testability improve. Load `module-design`.
- `migration` → **rollback phase**: an explicit, user-confirmed rollback step (never auto-rollback).
- `feature` → no extra characteristic.

## Scaling
Plan depth scales to complexity and to what upstream already settled (see `interview` for question-scaling). A trivial change gets a thin, single-phase plan with near-zero questions — `dx-plan` is never skipped (it owns `## Progress`), it just scales down.
