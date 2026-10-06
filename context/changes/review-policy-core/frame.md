# Frame — review-policy-core (slice 1 of policy-driven-review)

Problem, scope, and alternatives are inherited from `context/efforts/policy-driven-review/frame.md`. This file adds only this slice's user cases, additive to the effort's flows 2, 5, 6, 7, 8.

## User cases
All discovered in this slice's interview (2026-10-06); the effort's sketch named the flows but not these behaviours.

1. Developer runs the `implementation` review on a change whose `plan.md` `## Progress` still has a `- [ ]` → the run is refused and points at `/dx-implement <change-id>` (parity with today's guard).
2. Developer's `implementation` review turns up a regression → `dx-diagnose` is invoked on it directly, not only logged as a finding (parity).
3. Developer's `implementation` review passes with no unresolved critical finding → `change.md` gets `status: reviewed`, and a recurring or non-obvious finding is offered as a `/dx-lesson` (parity).
4. Developer runs `/dx-review-triage <change-id> implementation` → triage locates the policy report from that pair and walks its findings (triage by policy ID).
5. Between the slice 1 and slice 2 releases, a developer still runs `dx-plan-review` → it writes `reviews/plan-review.md` as before, and `dx-review-triage` must still triage it (transition: two mechanisms coexist until slice 2).
6. An upgrading developer types `/dx-impl-review` → the skill is gone (no alias); the changeset and docs name the new command.
7. A developer with a change in flight that holds an old `reviews/impl-review.md` with PENDING findings → re-runs the `implementation` review to get a report in the new shape; old reports are neither migrated nor read by triage, and the changeset says so.
8. Developer runs a Policy on a target it doesn't accept (e.g. `implementation` with no Change id, which would be an Explore run) → the run is refused, naming the Policy and the targets it accepts. Slice 1 ships only `targets: container`; the `explore` and `both` values are defined now but implemented in slice 3.
9. Developer writes or edits a Policy from the policy template → the template documents `targets: container | explore | both` and states that output follows from the target and is never declared (a Change or Effort gets a report, an Explore run presents Candidates). The report template states where a report lands, `context/{changes|efforts}/<id>/reviews/<policy-id>.md`, and that a re-run overwrites it, so triage needs only the policy ID plus the container ID.
