---
"dx-workflow": minor
---

Close the `dx-plan` / `dx-plan-review` design-coverage gap. `dx-plan` now gates three new conditional
`plan.md` sections — `## Data model`, `## API & contracts`, `## Failure modes & reversibility` — behind
one-line relevance triggers, and authors the ones that apply (omitting the rest entirely, never `N/A`).
`dx-plan-review` loads the same triggers keyed on the change itself, so a wrongly-absent section is as
reachable as a present-but-wrong one, and folds four new checks (reversibility, contracts &
compatibility, failure-scenario coverage, scope cohesion) into its existing four dimensions.
`dx-impl-review`'s Plan-drift check now also verifies the diff against any conditional sections a plan
carries.
