---
targets: container
---

The pre-implementation gate: will this plan actually work? A flawed plan costs hours, a flawed review costs minutes.

## Preconditions
- The container is a Change (under `context/changes/`) with a `plan.md`. Otherwise point at `/dx-plan <change-id>`.

## Load
- `plan.md` in full, plus `change.md` (note its `type`) and any `research/`, `frame.md` and `diagnosis.md` the plan draws on.
- Invoke `dx-references` with `plan-template`, so you know the shape a sound plan should have.
- `context/standards/`, and invoke `dx-references` with `knowledge-layer`. You need the matching heuristic and the real catalog to catch a standard the plan's own checklist missed, not just re-check the ones it listed.
- **Conditional topics, gated on the change — not on which headers `plan.md` already has.** Use the triggers `dx-plan` uses, checked against the change's scope, `change.md`'s `type`, and who or what `frame.md` says it affects. A wrongly omitted section must be as reachable as a present-but-wrong one.
  - The change touches a schema, table or persisted structure → invoke `dx-references` with `plan-data-model`.
  - The change adds or changes an endpoint, function signature, event or message another caller depends on → invoke `dx-references` with `plan-api-contracts`.
  - The change introduces an external call or a migration, or needs an undo path once shipped → invoke `dx-references` with `plan-failure-modes`.

## Dimensions
Tag findings `[<Dimension>: <Severity>]`, e.g. `[Feasibility: Blocker]`. Read the plan against itself first (the cheapest, highest-value pass), then against reality: check its claims (the riskiest file paths, unlisted callers, whether a pattern already exists) against the codebase. If the plan is sound, don't manufacture findings.

A conditional topic that loaded but whose section is **missing from `plan.md` entirely** is itself a finding under the dimension below that covers it. Silence there is exactly what these checks exist to catch.

### Substance
Does the approach actually solve the framed problem? Could every phase pass and the goal still be unmet? Look for any last-mile gap.
- **Reversibility.** If `plan-failure-modes` loaded, is the undo path documented alongside the execute path? "We can revert the commit" isn't enough once data or external state has changed.
- **Scope cohesion.** Is this one independently deployable capability, or does the plan bundle unrelated work that should be separate changes?

### Feasibility
Are the phases realistic, correctly ordered, and each a testable vertical slice? A vague "refactor as needed", a TBD or a missing verification step is a finding.
- **Failure-scenario coverage.** If `plan-failure-modes` loaded, do the external calls and migrations this change introduces have documented failure modes (partial failure, retry and idempotency), not just the happy path?

### Architectural fitness
Does it fit the existing system? Look for a new pattern where one already exists, the wrong dependency direction, or a wide blast radius.
- **Contracts & compatibility.** If `plan-api-contracts` loaded, is a breaking change named as one, with its affected callers and a compatibility path, rather than passing as a plain extension?

### Standards-fit
Are the plan's **Standards to apply** the right matched ones for this change's domain and type? Flag gaps (an applicable standard the plan missed) and mismatches. If `context/standards/` doesn't exist yet, mark this `N/A`, not `PASS`, and add a `Consider` finding that points at `/dx-standards-discover`.

## Next
- `/dx-implement <change-id>` (`/dx-tdd <change-id>` for defect/test-first) — proceed as-is
