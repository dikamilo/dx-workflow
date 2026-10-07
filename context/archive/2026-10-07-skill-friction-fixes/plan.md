# Plan: Fix skill friction found in the 2026-10-07 sessions review

## Approach
Five small, independent edits to existing skills, each traced to evidence in `research/sessions-review-candidates.md` or to the direct requests in `change.md`. Interview decisions: (1) **Manual boxes are labelled at plan time** — `dx-plan` tags each `#### Manual` row `agent-runnable` or `user-only` and aims for a plan the agent can verify end to end (prefer Automated, then `agent-runnable`, `user-only` only for what truly needs a human); implementers run `agent-runnable` rows themselves and tick on evidence; a `user-only` row ticked on the user's bare say-so is recorded `— ticked on say-so`. The sandbox recipe is *not* a deliverable — it was only the example. (2) **`dx-implement --auto`** — default stays one phase per invocation; an explicit `--auto` argument switches to coordinator mode: phases run on subagents and the coordinator owns Progress and commits. **`dx-plan` also designs for parallelism**: each phase declares `Depends on:` and phases with no unmet dependency and disjoint files form a parallel group, which `--auto` runs concurrently on subagents. An already fully-ticked plan with a follow-up request routes to `/dx-new`. (3) **`dx-references` takes several topics per call**; skills that always load several together say to batch. (4) **`dx-roadmap` and `dx-frame` print their result as a table before asking the user to act.**

## Standards to apply
- [ ] skill-authoring / Use skill-creator: make every `skills/dx-*` edit through `skill-creator`; evals skipped, deviation stated below (see Priors).
- [ ] skill-authoring / Token efficiency: terse additions only; apply the no-op test to each added sentence; shared content lives once in `dx-references/references/`.
- [ ] skill-authoring / Accuracy: keep guard clauses and `Done when` intact; no auto-chain.
- [ ] CLAUDE.md house style: update `docs/reference/skills.md` and any tutorial/explanation naming a touched skill, same change; run `npm run lint:skills` after skill edits; one changeset (`npx changeset`) since `skills/**` is touched.

## Priors & gotchas
- Skills ship without evals — no harness exists (lessons, 2026-07-28). Verification is sandboxed headless runs; state the deviation rather than dropping it silently, and note these don't test a user who pushes back.
- `npm run lint:skills` check 4 only recognizes single-topic call sites of the form ``dx-references` with `<topic>` ``; a batched multi-topic phrase is skipped by the lint, so write batched call sites in looser wording and keep the `dx-references` frontmatter topic list accurate.
- Never run global `install-skills` to test; use the project-level sandbox recipe in the personal memory (`--setting-sources project,local`).
- `dx-tdd` is `dx-implement`'s sibling and also says "never the whole plan"; `--auto` is scoped to `dx-implement` as requested — flag, don't silently extend.

## Phases

### Phase 1: Label manual boxes and let agents run the `agent-runnable` ones
End to end: a plan is written with labelled Manual rows, and implementers act on the labels.
- `progress-format.md`: Manual rows carry `(agent-runnable)` or `(user-only)`; `agent-runnable` rows are run by the implementer and ticked on evidence; a `user-only` row ticked on bare say-so gets `— ticked on say-so`. Update the example.
- `plan-template.md`: mention the label in the `## Progress` pointer only if the shape needs it.
- `dx-plan` step 5: label every Manual row; push checks to Automated first, then `agent-runnable`; plan to be fully agent-verifiable, `user-only` only when it truly needs a human.
- `dx-implement` and `dx-tdd` step 2: replace "Manual boxes need a human confirmation" with the label rule.
- Docs: `docs/reference/skills.md` (`/dx-plan`, `/dx-implement`, `/dx-tdd`), `docs/explanation/plan-and-slices.md`, `docs/explanation/implement-vs-tdd.md`, `docs/tutorials/ship-a-change.md` where they describe Manual boxes.

### Phase 2: `dx-implement --auto` and parallel-aware plans
- `dx-plan` step 4 + `plan-template.md`: each phase gets a `Depends on:` line (`none` or phase numbers); plan phases so independent work is separable — disjoint files, no shared Progress rows — where that doesn't make slices horizontal. Serial is fine when the work is serial; don't force parallelism.
- `dx-implement`: add `--auto` to `argument-hint`. Without it: one phase, unchanged. With it: coordinator mode — run phases in dependency order, each on its own subagent; phases whose dependencies are met run concurrently. Subagents implement and verify but do **not** commit or touch Progress; the coordinator flips Progress and makes the per-phase Conventional Commit sequentially (avoids git-index races). Any red check stops the run and reports, never auto-rollback.
- Guard: no `- [ ]` left plus a follow-up request → point at `/dx-new`, don't improvise `dx-new` then `dx-plan`.
- Docs: `/dx-plan` and `/dx-implement` entries in `docs/reference/skills.md`, `docs/explanation/plan-and-slices.md` (parallel phases), `docs/explanation/implement-vs-tdd.md` if it states the one-phase rule; mention `--auto` in `docs/tutorials/ship-a-change.md`.

### Phase 3: Multi-topic `dx-references`
- `dx-references/SKILL.md`: read the reference for every topic named in the arguments (space-separated) in one call; report any not found. Check the `arguments: topic` frontmatter still resolves all topics (use `$ARGUMENTS` if needed).
- `dx-plan`, `dx-implement`, `dx-tdd`: where several topics always load together, say to load them in one call.
- Docs: the `dx-references` note in `docs/reference/skills.md`.

### Phase 4: Show before asking in `dx-roadmap` and `dx-frame`
- `dx-roadmap` step 4: print the ordered slices as a table (`#`, change id, why-here, depends on) *before* the confirm question.
- `dx-frame` step 2/3: print the user cases as a table (who, trigger, outcome, source) *before* the confirm-or-edit question; same for slice mode.
- Docs: `/dx-roadmap` and `/dx-frame` entries in `docs/reference/skills.md`; `docs/tutorials/frame-and-research.md` and `docs/tutorials/run-an-effort.md` if they show the prompt.

### Phase 5: Ship
- `npx changeset` (minor — behavior changes across several skills) describing all four fixes; no new/removed skill directories so `skills.sh.json` is unchanged.
- Walk every phase's diff against the changeset.

## Not doing
- Candidate 8 (heavy front-loaded reads, splitting `dx-refactor-discover`) — dropped: not a skill defect, and the split is its own change.
- A repo-hosted sandbox recipe or script — the sandbox was only the example; the fix is the generic label.
- `--auto` / parallel execution for `dx-tdd`.
- Auto-detecting file overlap between phases at run time — the plan declares dependencies; the coordinator trusts them.
- Gating optional references in `dx-plan` — already gated by relevance; the over-loading is a compliance issue.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Label manual boxes and let agents run the `agent-runnable` ones
#### Automated
- [x] 1.1 `npm run lint:skills` passes — 07001f8
- [x] 1.2 `grep -n "agent-runnable" skills/dx-references/references/progress-format.md skills/dx-plan/SKILL.md skills/dx-implement/SKILL.md skills/dx-tdd/SKILL.md` hits all four files — 07001f8
#### Manual
- [x] 1.3 (agent-runnable) Sandbox: headless `/dx-plan` on a scratch change with one Manual check produces labelled Manual rows — 07001f8
- [x] 1.4 (agent-runnable) Sandbox: headless `/dx-implement` runs an `agent-runnable` box itself and stops at a `user-only` one — 07001f8

### Phase 2: `dx-implement --auto` and parallel-aware plans
#### Automated
- [x] 2.1 `npm run lint:skills` passes — 70a941c
- [x] 2.2 `grep` finds `--auto` and the `/dx-new` route in `dx-implement/SKILL.md`, and `Depends on` in `dx-plan/SKILL.md` and `plan-template.md` — 70a941c
#### Manual
- [x] 2.3 (agent-runnable) Sandbox: `/dx-implement <id> --auto` on a scratch plan with two independent phases and one dependent phase runs the first two concurrently, then the third, with one commit per phase — 70a941c
- [x] 2.4 (agent-runnable) Sandbox: `/dx-implement <id>` without `--auto` still runs exactly one phase — 70a941c
- [x] 2.5 (agent-runnable) Sandbox: `/dx-plan` on a change with two independent pieces emits `Depends on:` lines that mark them parallel — 70a941c
- [x] 2.6 (agent-runnable) Sandbox: `/dx-implement` on a fully ticked change with a follow-up request points at `/dx-new` — 70a941c

### Phase 3: Multi-topic `dx-references`
#### Automated
- [x] 3.1 `npm run lint:skills` passes — 2a98683
#### Manual
- [x] 3.2 (agent-runnable) Sandbox: one `dx-references` call with two topics returns both documents; an unknown topic is reported with the available list — 2a98683

### Phase 4: Show before asking in `dx-roadmap` and `dx-frame`
#### Automated
- [x] 4.1 `npm run lint:skills` passes — 2fffa22
#### Manual
- [x] 4.2 (agent-runnable) Sandbox: `/dx-roadmap` prints the slice table before the confirm question — 2fffa22
- [x] 4.3 (agent-runnable) Sandbox: `/dx-frame` prints the user-cases table before the confirm-or-edit question — 2fffa22

### Phase 5: Ship
#### Automated
- [x] 5.1 `.changeset/*.md` exists and covers all four fixes — 9c6ab45
- [x] 5.2 `npm run lint:skills` passes — 9c6ab45
#### Manual
- [x] 5.3 (user-only) Review the docs diff reads correctly for the user-facing behavior changes — ticked on say-so
