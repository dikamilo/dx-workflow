---
"dx-workflow": minor
---

New built-in review Policy: `/dx-review sessions [instructions…]` is a report-only retrospective that reads agent session transcripts (the current session by default) and prints ranked suggestions for improving the coding agent's environment, then stops. Policies gain an optional `promote: off` line in `## Candidates`: an Explore run then prints its Candidates and stops, with no promote question, no `Next:` line and no lesson offer, and `type:` becomes optional. Default behaviour, including `test-strategy`, is unchanged. Existing projects: re-run `/dx-init` to seed `sessions.md` (missing files only). `/dx-init` never overwrites your `policy-template.md` and `report-template.md`, and a fix to a shipped Policy or template never reaches an existing copy, so compare your `policy-template.md` and your review-policies with the shipped ones in the skill's `assets/review-policies/` and merge `promote: off` by hand.
