# Plan: Cut story and planning overhead found in the second sessions review

## Approach
Targeted edits to existing skills and shared references, each traced to a finding in `change.md`; every rule is written generically (no project tools, files or story ids). Interview decisions: (1) **S5 is Next-line and docs only** — skills keep the no-auto-chain rule; the `Next:` line and docs say running the next command in the same session is fine, and `dx-references` doesn't re-read a topic already loaded this session. (2) **R2 lives in the skills, not a shipped standard** — `dx-plan` cuts phase 1 as the tracer and `dx-new`/`dx-roadmap` slice the same way. (3) **S7 is deferred** — no script exists to ship. Everything else took the recommended default and is recorded under *Assumptions*.

## Assumptions
- **S1 wording:** `dx-new` defaults large-but-serial work to one change with a phased plan; an effort only when slices can ship alone. `dx-roadmap` keeps its "one slice should have been a change" check and adds: a slice that only hardens or extends an earlier slice is a phase, not a slice.
- **S2 "ask" test:** the agent decides by default and asks only what truly needs a human — a choice only the user can make (product intent, scope, a trade-off that is theirs to own) or one that is costly to reverse and that upstream and the codebase don't settle. No project-specific item types (spec markers, design or ticket conflicts) are named in the skill. Every decision the agent takes itself — placement, naming, anything with a clear recommended answer — goes in a new optional `## Assumptions` plan section so the user can redirect it at review.
- **S3:** read the nearest sibling plan only; the plan's `## Approach` carries a `Reuse from:` pointer when it borrowed a prior decision.
- **S4:** the plan names the affected test files per phase; phases run only those; the last phase holds the one full run. Applies to `dx-implement`'s verification; `dx-tdd` says "green full suite" — flagged, not edited (out of the request).
- **S6:** when the plan outgrows one shippable unit, `dx-plan` warns and offers to move extras to a later change via `/dx-new`; the user decides.
- **R7:** `## Standards to apply` stays one checklist per plan; per-phase restatement and per-phase unscoped full-suite rows are dropped in favour of one check in the final phase. The "provisional until tested" caveat stays in `change.md`.

## Standards to apply
- [ ] skill-authoring / Use skill-creator: make every `skills/dx-*` edit through `skill-creator`; evals skipped, deviation stated here (see Priors).
- [ ] skill-authoring / Token efficiency: terse additions; apply the no-op test to each sentence; shared content lives once in `dx-references/references/`; the `## Assumptions` and `Reuse from:` shapes live in `plan-template`, not copied into `dx-plan`.
- [ ] skill-authoring / Accuracy: keep guards and `Done when` intact; no auto-chain (S5 must not weaken it).
- [ ] CLAUDE.md house style: update `docs/reference/skills.md` and any tutorial/explanation naming a touched skill in the same change; run `npm run lint:skills` after skill edits; one changeset since `skills/**` is touched. No skill directory is added or removed, so `skills.sh.json` is unchanged.

## Priors & gotchas
- Skills ship without evals — no harness exists (lessons, 2026-07-28). Verify with sandboxed headless runs and state the deviation; these don't test a user who pushes back.
- Use the project-level sandbox recipe (`--setting-sources project,local`) from personal memory; never run global `install-skills` to test.
- `npm run lint:skills` check 4 only recognizes single-topic `dx-references` call sites; keep any new call sites in that form.
- The archived-bound `skill-friction-fixes` change (implemented) already edited `dx-roadmap` step 4 (table before confirm), `dx-plan` steps 4–5 (`Depends on:`, labelled Manual rows) and `dx-implement` (auto default). Edit around those; don't undo them.
- `dx-new` and `dx-implement` carry `skill-auto-worktrees` rules (worktree coordinator); the S4 test-scope rule goes in *The phase* step 2, shared by both modes.

## Phases

### Phase 1: Default a story to one change; tracer-first slicing
Depends on: none
End to end: `dx-new` routes large-but-serial work to one phased change, and `dx-roadmap` refuses to slice what should be phases.
- `dx-new` *Pick the level*: a change is the default; an effort only when slices are independently shippable or parallel; "large" alone isn't a reason; serial work that hardens earlier work is phases of one plan.
- `dx-roadmap` step 2: a slice must be able to ship alone; one that only hardens or extends another is folded in as a phase (say so); the lead slice is the tracer — one happy path and one negative test end to end.
- `docs/explanation/efforts-and-changes.md`, `docs/reference/skills.md` (`/dx-new`, `/dx-roadmap`), `docs/tutorials/run-an-effort.md` where it frames when to use an effort.

### Phase 2: Lean `dx-plan`: default-and-proceed, one sibling, scope cap, tracer phase
Depends on: 1
- `plan-template.md`: optional `## Assumptions` section (omit when none), a `Reuse from:` line under `## Approach`, a rule that Standards/full-suite checks are stated once (R7), and that the plan names affected test files per phase with one full run in the final phase (S4's template half).
- `dx-plan` step 1: Explore reads the nearest sibling plan only; step 2: decide by default and ask only what truly needs a human (the S2 test above), recording every self-made decision as an assumption; step 4: phase 1 is the tracer (happy path + one negative test), hardening in later phases; scope cap — warn when the plan outgrows one shippable unit and offer to move extras to a later change.
- `docs/reference/skills.md` (`/dx-plan`), `docs/explanation/plan-and-slices.md` (Assumptions, tracer-first, scoped tests, scope cap), `docs/tutorials/ship-a-change.md` where it shows the interview.

### Phase 3: `dx-implement` honours scoped test runs
Depends on: 2
- `dx-implement` *The phase* step 2: run only the test files the phase names; the one full run is the final phase's; an unscoped run mid-plan needs a stated reason. Note `dx-tdd` is not changed.
- `docs/explanation/implement-vs-tdd.md` and `docs/reference/skills.md` (`/dx-implement`).

### Phase 4: Same-session hand-off between phases (S5)
Depends on: 3
- Skills that print `Next:` (`dx-new`, `dx-plan`) keep printing and stopping; add the note that the next command can run in this session — no `/clear` needed. `dx-references` skips a topic already loaded this session.
- `docs/README.md`/`docs/explanation/workflow-overview.md`: say same-session is fine and chaining is still the user's call.

### Phase 5: Ship
Depends on: 4
- `npx changeset` (minor) covering S1–S6, R2, R7; S5 and S7 stated as noted.
- Walk every phase's diff against the changeset and the docs.

## Not doing
- S7 (metrics script for the sessions policy) — deferred; no script supplied. Revisit once it exists.
- Any auto-chain flag or amendment to the no-auto-chain standard.
- A shipped R2 standard in `dx-init` assets.
- Changing `dx-tdd`'s "green full suite" rule — flag for a follow-up.
- Project-specific content (tools, files, ticket systems, story ids) from the review evidence.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Default a story to one change; tracer-first slicing
#### Automated
- [ ] 1.1 `npm run lint:skills` passes
- [ ] 1.2 `grep -n "ship alone" skills/dx-new/SKILL.md skills/dx-roadmap/SKILL.md` hits both files
#### Manual
- [ ] 1.3 (agent-runnable) Sandbox: `/dx-new` on a large idea whose parts are strictly serial creates one change, not an effort
- [ ] 1.4 (agent-runnable) Sandbox: `/dx-roadmap` on an effort whose second slice only hardens the first folds it into a phase and says so

### Phase 2: Lean `dx-plan`: default-and-proceed, one sibling, scope cap, tracer phase
#### Automated
- [ ] 2.1 `npm run lint:skills` passes
- [ ] 2.2 `grep -n "Assumptions\|Reuse from" skills/dx-references/references/plan-template.md` hits both
#### Manual
- [ ] 2.3 (agent-runnable) Sandbox: `/dx-plan` on a change with an implementation-placement choice records it under `## Assumptions` without asking, and still asks about a planted product-intent choice only the user can make
- [ ] 2.4 (agent-runnable) Sandbox: `/dx-plan` with several sibling plans present reads only the nearest and writes a `Reuse from:` line
- [ ] 2.5 (agent-runnable) Sandbox: `/dx-plan` on an oversized request warns and offers to move extras to a later change
- [ ] 2.6 (agent-runnable) Sandbox: the plan's phase 1 is a happy path plus one negative test; hardening sits in later phases

### Phase 3: `dx-implement` honours scoped test runs
#### Automated
- [ ] 3.1 `npm run lint:skills` passes
#### Manual
- [ ] 3.2 (agent-runnable) Sandbox: `/dx-implement --manual` on a scratch plan with named test files runs only those and not the full suite until the final phase

### Phase 4: Same-session hand-off between phases (S5)
#### Automated
- [ ] 4.1 `npm run lint:skills` passes
- [ ] 4.2 `grep -rn "auto-chain" skills/dx-new/SKILL.md skills/dx-plan/SKILL.md` still shows the stop rule intact
#### Manual
- [ ] 4.3 (user-only) The same-session wording in the docs reads as permission, not as an instruction to chain

### Phase 5: Ship
#### Automated
- [ ] 5.1 `.changeset/*.md` exists and covers S1–S6, R2, R7
- [ ] 5.2 `npm run lint:skills` passes
#### Manual
- [ ] 5.3 (user-only) The docs diff reads correctly for the user-facing behaviour changes
