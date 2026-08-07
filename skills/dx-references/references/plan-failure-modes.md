# Failure modes & reversibility — `## Failure modes & reversibility`

Populates `plan.md`'s `## Failure modes & reversibility` section (see `plan-template`'s conditional-sections block).

## Ask in the interview
- What external calls, migrations, or side effects does this change introduce, and what happens when each one fails partway (timeout, partial write, dependency down)?
- Is each step idempotent/retryable, or does a partial failure leave the system in a state that needs manual cleanup?
- If this needs to be undone after shipping — a bad deploy, a migration that turns out wrong — what's the undo path? Is it a revert, a flag flip, or does it need its own migration?
- Is the undo path safe to run **after** real traffic/data has flowed through the new behavior, or only before?

## What the section must contain
- The failure modes of each external call or migration this change introduces, and what happens on partial failure.
- The undo path alongside the execute path — not just "we can revert the commit" when data or external state has already changed.
- Whether the undo path stays safe once real traffic has hit the new behavior, or is time-boxed to before that.

For a `migration`-type change this is where the plan-template's rollback-phase characteristic and this section meet: the phase is the *step*, this section is the *reasoning* for why it's safe.
