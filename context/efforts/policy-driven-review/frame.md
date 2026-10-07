# Frame — policy-driven-review

## The real problem
Review is not extensible: what a review checks is hard-coded into one skill per review type, so every new kind of review costs a new skill (plus docs, `skills.sh.json`, a changeset) and grows the skill count, while users can't adapt what a review checks to their own project.

## Who / what it affects
- **Developers using dx in a target project** — they run reviews, triage reports, and (new) write or edit their own Policies under `context/`.
- **Skills:** `dx-plan-review` and `dx-impl-review` (removed outright, no aliases), one new generic review skill, `dx-review-triage` (name kept; it now takes a policy ID instead of `plan|impl`), `dx-init` (ships policies + templates from its assets; already idempotent by contract, so "re-runnable" is existing behaviour extended to new artifacts).
- **Shared references:** `review-report` leaves `dx-references` and becomes a user-editable report template in the workflow context.
- **Maintainer surface:** `DESIGN.md` (§3 gates, cross-skill format table), `docs/`, `skills.sh.json`, glossary entries for Plan-review / Impl-review / Review-triage, changesets.

## User cases
Headline flows for slicing — a sketch, all settled in this interview:
1. Developer reviews a change's plan before implementing (`plan` + change id) → report → triage.
2. Developer reviews finished work (`implementation` + change id) → report + pass/`reviewed` status → triage.
3. Developer runs `test-strategy` on a change/effort (report) or on the repo/folders (inline findings) — covering frontend and e2e testing and detecting/eliminating pathological tests.
4. Developer runs the `sessions` retro on the repo → suggestions to improve the coding agent's environment → promotes the ones they pick.
5. Developer writes a new Policy from the policy template, or edits a shipped one, and runs it with no skill change.
6. Developer re-runs `dx-init` in an existing project → missing policies/templates appear, their own edits stay untouched.
7. Developer passes an unknown policy id → the skill names it; if no policies exist at all, it points to `dx-init`.
8. Developer adds custom instructions to any run to narrow or steer it.

## Alternatives considered
- **Keep one skill per review type** — rejected: it is the cost being removed; each new review type keeps adding a skill and the criteria stay out of the user's reach.
- **Policies inside the skill (bundled references)** — rejected: users couldn't edit or extend them without forking the skill.
- **Rename `dx-review-triage` to `dx-triage`** — rejected: one more removal/addition for no behaviour gain; the skill keeps its name.
- **Policy as any user rulebook (not only review)** — rejected: it would blur into Standard. A Policy defines one kind of review; anything else that later lands next to it needs its own term.
- **Policy IDs `plan-review` / `implementation-review`**: rejected in favour of `plan` / `implementation`. Every Policy defines a review, so the `-review` suffix adds length and no meaning.
- **Chosen:** one review skill plus file-based Policies that live in `context/` and are seeded by `dx-init`.

## Scope of shipped policies
- `plan`, `implementation` — container only; today's behaviour unchanged (parity is the success criterion).
- `test-strategy` — hybrid (container or repo/folders), extended to frontend, e2e, and pathological-test detection; content grounded in this effort's research.
- `sessions` — repo/folders only; a retrospective that suggests improvements to the coding agent's environment for future runs; content grounded in this effort's research. Name was chosen during framing (it was `workflow` in the original idea) and can still be revisited.

## Out of scope
- Folding `dx-refactor-discover`, `dx-standards-discover`, `dx-domain-discover` into policies — revisit as its own effort once the model is proven.
- Non-review policies.
- Propagating later updates of shipped policies into existing projects — copies are never overwritten (accepted trade-off).
- Security, retro-per-container, and other policies beyond the four above.

## Caveats (from the adversarial pass)
- **Shipped fixes don't reach existing projects.** Once a project has copied a built-in Policy, later improvements to it reach that project only if the user copies them by hand. This trade-off is accepted; the docs should say it plainly.
- **Parity covers more than the checks.** Today's gates also do things a Policy file must still express or the skill must keep. Examples: the unfinished-`## Progress` guard, setting `status: reviewed`, the offer to record a lesson, invoking `dx-diagnose` on a regression, conditional reference loading, and the per-dimension verdicts. Count it as drift if any of these silently disappears.
- **Policies sit outside the lint gate.** `npm run lint:skills` checks `skills/dx-*`. Policies and templates are assets that become user-owned, so nothing mechanical checks their shape yet.
- **Two kinds of output.** A container run writes durable, numbered Findings. A repo or folder run shows temporary Candidates (see glossary). Each mode keeps its own vocabulary.
