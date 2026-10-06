# Plan: plan Policy

## Approach
Ship the built-in `plan` Policy as `skills/dx-init/assets/review-policies/plan.md` (`targets: container`). It moves every check from `dx-plan-review` into the policy template's sections, so `/dx-review plan <change-id>` becomes the pre-implementation gate. Then remove `dx-plan-review` outright with no alias, the same clean break slice 1 made for `dx-impl-review`, along with the whole transitional path slice 1 left for it. That path is the `review-report` reference, triage's `plan-review.md` fallback, and the legacy notes in `dx-archive`, `DESIGN.md` and the docs. After this slice `main` carries one review mechanism.

`dx-init` needs no edit, because it already copies `assets/review-policies/*.md` with a glob, missing files only. `dx-implement` and `dx-tdd` print no plan-review line (slice 1 already repointed them), so the roadmap's mention of them is moot. The only `Next:` line to repoint is `dx-plan`'s.

Interview decisions (2026-10-06):
- **Report shape: template, not legacy.** The `plan` Policy writes per-dimension `## Verdicts` (Substance, Feasibility, Architectural fitness, Standards-fit) and compound tags (`[Feasibility: Blocker]`). The overall **sound / revise / rethink** line is dropped, which is the one named parity deviation, and the changeset says so. `report-template.md` is unchanged.
- **Legacy `plan-review.md` is ignored**, by the same rule slice 1 applied to `impl-review.md`. Triage no longer reads it and points at `/dx-review plan <id>`, `dx-archive` skips it, and `review-report.md` is deleted. Old reports are neither migrated nor read.
- **Upgrade hint.** `dx-review`'s unknown-policy refusal adds that re-running `/dx-init` seeds any missing built-in Policy, so an upgrader whose project predates `plan.md` finds the way out from the error itself.
- Changeset bump: **minor**, consistent with slice 1's call.

**Parity map** (`dx-plan-review` → where it now lives):
- `dx-review` already covers: the guard against archived containers, report-only behaviour, the glossary, fan-out to `Explore`, the overwrite confirmation, and the report file.
- The Policy's `## Preconditions` cover: a container that is a Change with a `plan.md`, else `/dx-plan <change-id>`.
- The Policy's `## Load` covers: `plan.md` in full, plus `change.md` (`type`), `research/`, `frame.md` and `diagnosis.md`; the `plan-template` and `knowledge-layer` references; `context/standards/`; and the three conditional topics, **gated on the change, not on which headers `plan.md` has**.
- The Policy's `## Dimensions` cover the four dimensions with their sub-checks (Reversibility, Scope cohesion, Failure-scenario coverage, Contracts & compatibility). They also cover the rule that a conditional topic which loaded but whose section is missing is a finding, the `Standards: N/A` + `Consider` → `/dx-standards-discover` rule, and the "against itself first, then against reality" ordering.
- The Policy has no `## On pass`, because `dx-plan-review` set no status (parity).
- The Policy's `## Next`: `/dx-implement <change-id>` (`/dx-tdd` for defect/test-first) — proceed as-is.

## Data model
These are persisted file shapes, not a database.
- **New Policy file** `context/workflow/review-policies/plan.md`, in the template's shape. It is additive: a new project gets it from `/dx-init`, and an existing project gets it on a re-run, which never overwrites an edited `implementation.md`.
- **Report** moves from `reviews/plan-review.md` to `reviews/plan.md` in `report-template.md`'s shape: Verdicts block, `F<n>` findings, compound tags, and no closing verdict line.
- **Migration: none.** A legacy `plan-review.md` stays on disk but is no longer read by triage or archive, so PENDING findings in it go unwarned. The changeset tells users to triage those before upgrading, or to re-run `/dx-review plan`.
- **Coexistence: none needed.** The old and new mechanisms don't overlap after this slice, because the old skill is removed in the same release.

## API & contracts
The change is **breaking**: a clean break with no alias, as decided in the effort frame. The changeset names every replacement.
- **Removed:** `/dx-plan-review <change-id>`, replaced by `/dx-review plan <change-id>`.
- **Changed:** `/dx-review-triage <id> plan` resolves only `reviews/plan.md`. The fallback to `plan-review.md` is gone. A lone legacy `plan-review.md` counts as no report: triage says it is superseded and points at `/dx-review plan <id>`, as it already does for `impl-review.md`. The legacy `Next:` lines (`/dx-plan-review`, `/dx-implement`) are removed.
- **Changed:** the `dx-archive` PENDING scan also skips `plan-review.md`.
- **Changed:** `dx-plan` prints `Next: /dx-review plan <change-id>   — optional pre-implementation gate`.
- **Changed:** `dx-review`'s unknown-ID refusal adds the `/dx-init` hint.
- **Removed:** the `review-report` topic of `dx-references`. Lint check 4 fails any `SKILL.md` call site that still names it, which is the mechanical proof that no caller is left.
- Affected callers: users' typed commands, the docs, and existing `plan-review.md` files (see Data model). No skill invokes `dx-plan-review` programmatically.

## Standards to apply
- [ ] global/skill-authoring — Edit `dx-plan`, `dx-review`, `dx-review-triage`, `dx-archive` and `dx-references` through `skill-creator`. Keep the read-vs-write split: the `plan` Policy reports and never edits `plan.md`. **Deviation (per lesson below):** there is no eval harness, so verification uses sandboxed runs with scripted answers, as recorded under Manual.
- [ ] global/skill-authoring, shared reference rule — deleting `review-report` leaves `report-template.md` (a user-owned `dx-init` asset) as the only report schema. Nothing is duplicated across skills.
- [ ] CLAUDE.md (maintainer) — run `npm run lint:skills` after every edit under `skills/dx-*`. In the same change, remove `dx-plan-review` from `skills.sh.json` and `docs/reference/skills.md` and update the tutorials and explanations. Add a changeset.

## Priors & gotchas
- **Skills ship without evals (2026-07-28):** the eval deviation is stated above. The refusal paths are the untested half, so the manual runs include them (no `plan.md`, unknown ID before `/dx-init`).
- **Parity is the success criterion** (effort frame caveat). The parity map above is checked line by line in Phase 1. The only allowed loss is the sound/revise/rethink line, which the user chose. Any other loss counts as drift.
- **Conditional loads are gated on the change, not on `plan.md`'s headers** (from the archived `plan-design-coverage` change). If this is paraphrased away, a section that was wrongly left out becomes unreachable in review. Keep that wording in the Policy.
- **Shipped Policies never reach existing copies** (frame caveat). A project seeded by slice 1 has no `plan.md` until it re-runs `/dx-init`, hence the hint and the changeset line.
- **Policies sit outside the lint gate**, so nothing checks `plan.md`'s shape mechanically. The parity read-through is the check.
- **Test setup:** the repo has none beyond `lint:skills`, so user cases are verified by sandbox runs. No harness is introduced.
- **Sandbox runs:** use `--setting-sources project,local` so the globally installed dx skills don't shadow the sandbox copies.

## Phases

### Phase 1: Tracer — the plan Policy runs end to end
- Add `skills/dx-init/assets/review-policies/plan.md` per the parity map.
- Repoint `dx-plan`'s `Next:` line to `/dx-review plan <change-id>`.
- Add the `/dx-init` hint to `dx-review`'s unknown-ID refusal.

### Phase 2: Retire dx-plan-review and the legacy path
- Delete `skills/dx-plan-review/` and remove it from `skills.sh.json` and `docs/reference/skills.md`.
- In `dx-review-triage`: drop the `plan-review.md` fallback, the `review-report` load and the legacy `Next:` lines, and treat `plan-review.md` like `impl-review.md`. In `dx-archive`: skip `plan-review.md`.
- Delete `skills/dx-references/references/review-report.md` and drop the topic from the `dx-references` description.
- Repoint the mentions in `plan-template.md` ("read by `/dx-review plan`") and in `context/standards/global/skill-authoring.md`.
- Update `DESIGN.md`: §2 (gates), §3 (skill-based gates and the known limitation), §5 tree (the references list), and the §7.6 table row.

### Phase 3: Docs, changeset, dogfood
- Update docs with the documentation skill:
  - `docs/reference/skills.md`: the `dx-plan`, `dx-review`, `dx-review-triage`, `dx-archive` and `dx-references` entries (twelve topics)
  - `docs/reference/glossary.md` (Review gate, Review triage)
  - `review-and-triage.md` (steps 1–2 become `/dx-review plan`, with a Verdicts block instead of the single verdict)
  - `ship-a-change.md`, `find-refactors.md`
  - `workflow-overview.md` (text and mermaid), `plan-and-slices.md`, `directory-layout.md`, `policy-driven-review.md` (name both built-in Policies)
- No new tutorial or explanation: this is a migration onto the existing mechanism, which slice 1 already documented.
- `npx changeset` (minor). It names `/dx-review plan`, the dropped sound/revise/rethink line, re-running `/dx-init` to seed `plan.md`, and that legacy `plan-review.md` files are ignored, so their findings should be triaged or the review re-run.
- Re-run `/dx-init` in this repo so `context/workflow/review-policies/plan.md` exists here.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Tracer — the plan Policy runs end to end
#### Automated
- [x] 1.1 `skills/dx-init/assets/review-policies/plan.md` added (`targets: container`, template shape, parity map) — 5fa62bb
- [x] 1.2 `dx-plan` `Next:` repointed to `/dx-review plan <change-id>`; `dx-review` unknown-ID refusal adds the `/dx-init` hint (via skill-creator) — 5fa62bb
- [x] 1.3 `npm run lint:skills` passes — 5fa62bb
#### Manual
- [x] 1.4 Sandbox: `/dx-init` seeds `plan.md` into a project that already holds an edited `implementation.md`, and leaves that file untouched
- [x] 1.5 Sandbox: `/dx-review plan <id>` on a change without `plan.md` is refused and points at `/dx-plan`. With no container it is refused, naming `targets: container`. In a project not yet re-seeded, `plan` is named as unknown, with the `/dx-init` hint
- [x] 1.6 Sandbox: on a planned change it writes `reviews/plan.md` with four Verdicts and compound tags, plus `Standards: N/A` and a `Consider` finding when `context/standards/` is absent. It prints the triage line and `/dx-implement`, and leaves `plan.md` unchanged
- [x] 1.7 Sandbox: a change that adds an API contract but whose `plan.md` lacks `## API & contracts` gets a finding (conditional load gated on the change, not the headers)
- [x] 1.8 Sandbox: `/dx-review-triage <id> plan` walks `reviews/plan.md`, applies a fix to `plan.md`, and commits nothing
- [x] 1.9 Parity read-through: every rule in `dx-plan-review/SKILL.md` maps to `dx-review` or `plan.md`; sound/revise/rethink is the only rule not carried over

### Phase 2: Retire dx-plan-review and the legacy path
#### Automated
- [x] 2.1 `skills/dx-plan-review/` deleted; `skills.sh.json` and `docs/reference/skills.md` entries removed — b817287
- [x] 2.2 `dx-review-triage` drops the `plan-review.md` fallback and treats it as superseded; `dx-archive` skips it (via skill-creator) — b817287
- [x] 2.3 `review-report.md` deleted; `dx-references` description updated; `plan-template.md` and `context/standards/global/skill-authoring.md` repointed — b817287
- [x] 2.4 `DESIGN.md` §2, §3, §5, §7.6 updated — b817287
- [x] 2.5 `npm run lint:skills` passes; `grep -rn 'dx-plan-review\|review-report' skills DESIGN.md context/standards` returns nothing; `grep -rn 'plan-review.md' skills` returns only the legacy-ignore lines in `dx-review-triage` and `dx-archive` — b817287
#### Manual
- [x] 2.6 Sandbox: with only a legacy `plan-review.md`, `/dx-review-triage <id> plan` says it's superseded and points at `/dx-review plan <id>`; `/dx-archive` doesn't warn on its PENDING findings
- [x] 2.7 A fresh install of the skills doesn't install `dx-plan-review`, and `/dx-plan-review` doesn't resolve

### Phase 3: Docs, changeset, dogfood
#### Automated
- [x] 3.1 Reference, glossary, tutorials and explanations listed in Phase 3 updated (documentation skill) — 90d8f56
- [x] 3.2 Changeset (minor) added naming `/dx-review plan`, the dropped single verdict, re-running `/dx-init`, and that legacy `plan-review.md` files are ignored — 90d8f56
- [x] 3.3 `grep -rn 'dx-plan-review\|review-report' docs README.md` returns nothing; `npm run lint:skills` passes — 90d8f56
#### Manual
- [x] 3.4 `/dx-init` re-run in this repo seeds `context/workflow/review-policies/plan.md` and leaves the other files untouched
