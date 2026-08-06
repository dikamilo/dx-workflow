# Data model — `## Data model`

Populates `plan.md`'s `## Data model` section (see `plan-template`'s conditional-sections block).

## Ask in the interview
- What's the new or changed shape — fields, types, relationships — stated concretely, not "add fields as needed"?
- Is this additive (new column/table) or does it reshape existing data (rename, split, retype, drop)?
- If it reshapes existing data: what's the migration path, and can old and new code read/write concurrently while it rolls out?

## What the section must contain
- The shape itself, concretely: fields/columns/relationships and their types.
- The migration path for existing rows, or an explicit statement that none is needed (additive-only).
- Whether old and new code can coexist mid-rollout, or a cutover is required.

`plan-failure-modes` covers the rollback side of the same migration — cross-reference it there rather than repeating it here.
