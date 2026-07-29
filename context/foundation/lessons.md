# Lessons — accrued warnings and load-bearing decisions (append-only)

## Skills ship without evals — no harness exists — 2026-07-28
`dx-brainstorm` was authored through `skill-creator` but shipped with **no evals**, deviating from the
`skill-authoring` standard's eval requirement: this repo has no eval harness (`package.json` ships only
`lint:skills`), and the "does it fire" half is moot for a `disable-model-invocation: true` skill anyway.
Verification fell back to sandboxed subagent runs with scripted user answers, which test routing given
good answers but **not** the interview under a user who pushes back. **Why:** the standard is unmeetable
as written, so every skill change silently deviates from it — and the untested half (adversarial
interviewing) is precisely where these skills are most likely to be wrong. **How to apply:** state the
deviation in the plan's `## Standards to apply` rather than dropping it silently, and treat eval infra as
a candidate future slice of `sdlc-hardening`; once a harness exists, the deviation stops being available.
