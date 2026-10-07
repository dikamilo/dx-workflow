## Roadmap
> A slice is **done** when its child change is archived (`archived_at` set) — derived by scanning the child, never a hand-checked box.

Ordering: dependency first, then smallest-demoable among equally-eligible slices.

### Slice 1: Generic review skill with the implementation Policy
- change: review-policy-core
- why: Tracer bullet with no dependencies. It proves `dx-init` seeding → container review driven by a Policy file → report from the template → `dx-review-triage` by policy ID, end to end. It also ships the policy template, which lives in `dx-init`'s assets next to the report template and is copied into the project's `context/` templates, not embedded in the review skill. The template defines the shape every Policy follows (this one, later slices, and user-written ones) and tells users what to do once a policy is created: where the file goes, that the file name is the policy ID, and how to run it. It also defines the `targets` field (`container | explore | both`, output derived from the target, never declared), and the report template states the report path `reviews/<policy-id>.md`. The `implementation` Policy declares `targets: container`, follows the policy template, and must match today's behaviour (Progress guard, `status: reviewed`, lesson offer, `dx-diagnose` on regression, per-dimension verdicts). `review-report` leaves `dx-references`, and `dx-impl-review` is removed along with its docs, `skills.sh.json`, and `DESIGN.md` entries.
- next: `/dx-new policy-driven-review 1`

### Slice 2: plan Policy
- change: plan-policy
- why: Needs slice 1's skill and seeding. It is the smallest next step and completes the migration: the `plan` Policy at parity and in the policy template's shape, `dx-plan-review` removed, and the `Next:` lines in `dx-plan`, `dx-implement`, `dx-tdd`, and triage repointed, so `main` doesn't carry two review mechanisms for long.
- next: `/dx-new policy-driven-review 2`

### Slice 3: Repo/folder runs and the test-strategy Policy
- change: test-strategy-policy
- why: Needs slice 1. Implements Explore runs (the `explore`/`both` targets slice 1's template already defines; inline Candidates, promoted to a Change or Effort) and Policy-declared pre-review questions. Extends slice 1's policy template with the fields that only exist from here on (Candidate fields, pre-review questions), and ships the hybrid `test-strategy` Policy (frontend, e2e, pathological tests) in that shape. Because `dx-init` copies only missing files, a project seeded between the slice 1 and slice 3 releases keeps the older template, so if the slices ship separately, the release notes must tell users to compare their template with the new one.
- next: `/dx-new policy-driven-review 3`

### Slice 4: sessions Policy
- change: sessions-policy
- why: Needs slice 3's repo/folder mode. Adds the repo-only retro `sessions` Policy, written in the policy template's shape, which reads session evidence and suggests improvements to the agent's environment, each routed to a destination.
- next: `/dx-new policy-driven-review 4`
