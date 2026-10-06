## Roadmap
> A slice is **done** when its child change is archived (`archived_at` set) — derived by scanning the child, never a hand-checked box.

Ordering: dependency first, then smallest-demoable among equally-eligible slices.

### Slice 1: Generic review skill with the implementation Policy
- change: review-policy-core
- why: Tracer bullet with no dependencies. It proves `dx-init` seeding → container review driven by a Policy file → report from the template → `dx-review-triage` by policy ID, end to end. The `implementation` Policy must match today's behaviour (Progress guard, `status: reviewed`, lesson offer, `dx-diagnose` on regression, per-dimension verdicts). `review-report` leaves `dx-references`, and `dx-impl-review` is removed along with its docs, `skills.sh.json`, and `DESIGN.md` entries.
- next: `/dx-new policy-driven-review 1`

### Slice 2: plan Policy
- change: plan-policy
- why: Needs slice 1's skill and seeding. It is the smallest next step and completes the migration: the `plan` Policy at parity, `dx-plan-review` removed, and the `Next:` lines in `dx-plan`, `dx-implement`, `dx-tdd`, and triage repointed, so `main` doesn't carry two review mechanisms for long.
- next: `/dx-new policy-driven-review 2`

### Slice 3: Repo/folder runs and the test-strategy Policy
- change: test-strategy-policy
- why: Needs slice 1. Adds repo/folder runs (inline Candidates, promoted to a Change or Effort) and Policy-declared pre-review questions. Ships the hybrid `test-strategy` Policy (frontend, e2e, pathological tests) and the policy-authoring template, now that the Policy format has its full shape.
- next: `/dx-new policy-driven-review 3`

### Slice 4: sessions Policy
- change: sessions-policy
- why: Needs slice 3's repo/folder mode. Adds the repo-only retro `sessions` Policy, which reads session evidence and suggests improvements to the agent's environment, each routed to a destination.
- next: `/dx-new policy-driven-review 4`
