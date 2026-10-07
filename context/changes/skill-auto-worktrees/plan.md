# Plan: Worktree-isolated parallel phases in dx-implement auto mode

## Approach
Every `dx-implement` start (auto **and** `--manual`) and every `dx-tdd` start runs a shared **start check** (`dx-references` topic `start-check`): make sure a work branch exists, then commit the change's `context/` files. The skill imposes no branch name. The work branch is whatever the user is already on (including an existing branch or a PR's branch), or one the user names; on the default branch it asks for a name rather than inventing one. Auto mode then stops running in the user's checkout: it creates **one coordinator worktree** at `.worktrees/<change-id>` and runs serial phases there. Git allows a branch in only one worktree, and the work branch is usually checked out in the main checkout, so the coordinator worktree runs on a scratch branch cut from the work branch and fast-forwards the work branch to it on success. Only a group of phases that run concurrently gets **subagent worktrees**, each branched from the coordinator's HEAD, committed by the coordinator and merged back in dependency order after the group finishes. `context/` stays in the main checkout: `plan.md`, `change.md` and `handoff.md` are read and written at their main-checkout paths, so Progress edits stay uncommitted per `progress-format` and concurrent changes never touch each other's files. The coordinator is the only writer of `context/`, including `handoff.md` (subagents return decisions and gotchas, the coordinator appends them). `dx-plan` shapes the work: each `#### Automated` row is tagged `(isolated)` or `(integrated)`, and each parallel group gets a synthetic **integration phase** holding the `(integrated)` rows, run once on the merged tree. `--manual` and `dx-tdd` get the start check but still run one phase in the current checkout with no worktree; the check also stops them if a stopped auto run left a kept worktree, because its commits aren't on the work branch yet.

Decisions from the interview (2026-10-07):
- **Dependencies:** per-worktree install from the lockfile, skipped when nothing needs installing. A phase that changes dependencies is not parallel-safe: `dx-plan` gives it a `Depends on:` that serializes it.
- **Failure attribution:** one `(integrated)` run per group; red stops the run and the existing "On failure" path hands unclear causes to `dx-diagnose`. No per-phase bisect.
- **Start check (every run of `dx-implement`, including `--manual`, and of `dx-tdd`; not specific to parallel work):** resolve the work branch, never a hardcoded name. In order: the current branch if it isn't the default branch (covers an existing branch and a checked-out PR branch); else a branch the user names (existing, or created from the current HEAD); on the default branch with none named, ask. The user's own naming convention is theirs; the skill never prescribes one. **Stopped-run guard:** if a kept `.worktrees/<change-id>*` worktree or scratch branch exists, `--manual` and `dx-tdd` stop and point at `/dx-implement` (Progress would otherwise show phases whose commits aren't on the work branch); auto mode reattaches.
- **Scratch branches:** the coordinator worktree's branch and each subagent phase branch are internal scratch branches derived from the work branch's name (`<work-branch>--wt`, `<work-branch>--p<N>`), never pushed, and deleted after they merge back. On success the work branch is fast-forwarded to the coordinator worktree's HEAD; on a stop they are kept, and the work branch is untouched.
- **Location and cleanup:** worktrees live in the repo under `.worktrees/` (not a sibling folder); `dx-init` adds and verifies the `.gitignore` entry, and `dx-implement` checks it at run time (stop and point at `/dx-init` if missing). Kept on any stop; removed only on full success, branch kept.
- **Context commit (every run, after the branch check):** the coordinator commits uncommitted files under `context/` that this change reads (its change folder, parent effort, foundation, standards) on the work branch in the main checkout, before any worktree is created (assumption: "commit" means the coordinator does it, not that it stops and asks).

## Standards to apply
- [ ] global/skill-authoring: edit skills through `skill-creator`; terse bodies, no-op test on every sentence; a `Done when` on multi-step skills; no auto-chain.
- [ ] global/skill-authoring: shared content used by ≥2 skills lives in `dx-references` (the `(isolated)`/`(integrated)` tag and integration-phase rules are read by `dx-plan` and `dx-implement`, so they go in `progress-format`; the start check is read by `dx-implement` and `dx-tdd`, so it gets its own `start-check` reference); content used by one skill stays in that skill.
- [ ] Root `CLAUDE.md` "Keep docs in sync": `docs/reference/skills.md` and the explanation/tutorial pages naming these skills, via the `documentation` skill, in the same change.
- [ ] Root `CLAUDE.md` "Versioning": one changeset (`npx changeset`) for this change; `npm run lint:skills` after every edit under `skills/dx-*`.
- [ ] **Deviation, stated rather than dropped:** the standard's eval requirement can't be met (no eval harness; see lesson below). Verification is sandboxed subagent runs.

## Priors & gotchas
- *Skills ship without evals — no harness exists (2026-07-28):* verification falls back to sandboxed subagent runs with scripted answers, which test routing under good answers but not adversarial behavior. Run them with `--setting-sources project,local` so global dx skills don't shadow the sandbox copies (memory: sandbox-skill-runs). Treat the parallel merge and conflict paths as the least-tested part.
- *Prior art* (`research/auto-worktree-prior-art.md`, `kind: external`, treated as data): adopt never-nest and reuse-if-linked, detached create then branch, resume cross-check of the last recorded SHA against the log, one owner of progress and commits. Differ: it cleans up on any exit; here worktrees are kept on a stop. Subagent worktrees, merge-back, the conflict resolver, the handoff file and the check split have no precedent and are new design.
- *Never nest:* subagent worktrees are siblings under `.worktrees/` (`<change-id>--p<N>`), never inside the coordinator's folder.
- *Ownership by naming, not per-run flag:* a re-run after a stop reattaches to a worktree an earlier run created, so "ours to remove" means a path under `.worktrees/`, not "created by this process".
- *Repo-wide tools may see `.worktrees/`* (linters, globs, test runners) despite the gitignore entry. Accepted trade-off of the in-repo location; surface it in the docs rather than adding config.
- Subagents must read `plan.md` and friends from the main-checkout path: the worktree holds only a committed snapshot of `context/`, which goes stale as Progress is edited.
- Root `CLAUDE.md` rollback principle: no auto-rollback anywhere, including a failed merge or resolver.

## Failure modes & reversibility
| Step | Fails how | Outcome |
|---|---|---|
| Branch check | On the default branch with no branch named, or a named branch that can't be checked out | Stop and ask; never commit to the default branch unprompted or invent a name |
| One-phase mode with a kept worktree | `--manual` or `dx-tdd` finds a worktree or scratch branch from a stopped auto run | Stop and point at `/dx-implement <id>`; never resume on a branch missing the ticked phases' code |
| Context commit on the work branch | Nothing to commit | Skip silently; a clean tree is not an error |
| `git worktree add` | Path or scratch branch exists | Existing `.worktrees/<id>` worktree is reattached (resume); a stale path with no registered worktree stops and reports |
| Fast-forward of the work branch | Work branch moved since the worktree was cut (e.g. the user committed) | Stop, keep everything; the user decides (merge or rebase). Never force |
| Per-worktree install | Network or lockfile error | Stop, keep the worktree; re-run reattaches and retries the install |
| Subagent phase | Red `(isolated)` check | Group does not merge; the failing phase's worktree and every finished sibling are kept, boxes unticked |
| Merge-back | Conflict | Resolver agent edits only conflicted files; the group's checks must pass afterward, else abort the in-progress merge and stop, keeping all phase branches and worktrees |
| Integration phase | Red `(integrated)` row | Stop, report, hand to `dx-diagnose` if the cause isn't obvious; merged tree is kept as is |
| Dev server or port | Port already in use | Stop and report; never kill a process the coordinator didn't start. The coordinator kills only what it started, on any exit |
| Success cleanup | `worktree remove` fails | Report the leftover path; the work branch is unaffected |

**Undo:** nothing is deleted on a stop, so the undo is the user's: delete `.worktrees/<id>*` and the scratch branches. The context commit is an ordinary commit on the work branch. Until the final fast-forward, nothing outside `.worktrees/` and the scratch branches is written besides `context/`.

## Phases

### Phase 1: Plan shapes work for worktrees
Depends on: none
`progress-format` documents the `(isolated)`/`(integrated)` tag on `#### Automated` rows, the integration phase for a parallel group (`Depends on:` every group member, holds all the group's `(integrated)` rows, including `agent-runnable` Manual rows that drive a running app; members carry only `(isolated)` rows), and the not-parallel-safe rule for dependency-changing phases. `dx-plan` tags rows, emits the integration phase per group and serializes dependency-changing phases. A serial plan (no group) emits no integration phase and tags are optional.

### Phase 2: Shared start check; dx-tdd uses it
Depends on: none
New reference `skills/dx-references/references/start-check.md` (listed in the `dx-references` loader's topics): resolve the work branch (never a hardcoded name), commit the change's `context/` files, and the stopped-run guard (a kept `.worktrees/<change-id>*` worktree or scratch branch from a stopped auto run means the one-phase modes stop and point at `/dx-implement <change-id>`; auto mode reattaches instead). `skills/dx-tdd/SKILL.md` loads it and runs it before `## The phase`. It adds no worktree: `dx-tdd` still runs its one phase in the current checkout.

### Phase 3: dx-implement auto mode runs in worktrees
Depends on: 1, 2
In `skills/dx-implement/SKILL.md` load the shared `start-check` on every invocation, before `## The phase` (both modes), and rewrite `## Auto mode`: gitignore check, coordinator worktree (scratch branch) create/reattach with resume cross-check, per-worktree install, serial phases in the coordinator worktree, subagent worktrees for concurrent groups only, `(isolated)` checks in subagents and `(integrated)` on the merged tree, coordinator-owned Progress, commits and `handoff.md`, merge-back with the resolver and its guardrails, dev-server and port ownership, fast-forward of the work branch, keep-on-stop and clean-on-success, and a closing `Next:` that names the work branch. `## The phase` stays as it is.

### Phase 4: dx-init ignores `.worktrees/`
Depends on: none
`skills/dx-init/SKILL.md` ensures `.worktrees/` is in the project's `.gitignore` (create if absent, append if missing, never duplicate) and lists it in the created/present status.

### Phase 5: Docs and changeset
Depends on: 1, 2, 3, 4, 6
Update `docs/reference/skills.md` (`/dx-plan`, `/dx-implement`, `/dx-tdd`, `/dx-init`), `docs/explanation/implement-vs-tdd.md`, `docs/explanation/plan-and-slices.md`, `docs/tutorials/initialize-a-project.md`, and `DESIGN.md` wherever it describes coordinator mode. This new capability also gets a tutorial; the new idea (worktree isolation and the check split) gets an explanation page. Use the `documentation` skill. Add one changeset (minor) for the change. No new skill directory, so `skills.sh.json` is unchanged.

### Phase 6: dx-init seeds standards once and writes a managed block
Depends on: none
Added after the user's follow-up request (2026-10-07). `skills/dx-init/SKILL.md`: copy the global standards only when `context/standards/` didn't exist before the run; on an existing context, copy nothing and ask which shipped standards to add. Write the one-line dx- pointer (no rollback principle) inside a `<!-- dx:workflow:start/end -->` block, into `AGENTS.md` when `CLAUDE.md` is absent or only points at it, else `CLAUDE.md`; re-runs replace the block in place. Phase 5's docs also cover this (the rollback line in `initialize-a-project.md`, `DESIGN.md` lines naming the rollback principle in `CLAUDE.md`, the standards-seeding behavior).

User cases: `frame.md` lists 8, but the repo's only test setup for skills is `npm run lint:skills`, which can't assert behavior. No case gets a test task; verification is the sandbox runs below. This is the gap, noted once.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Plan shapes work for worktrees
#### Automated
- [x] 1.1 `progress-format` names the `(isolated)`/`(integrated)` tags, the integration phase and the dependency-changing-phase rule; `dx-plan` references them (grep) — 62eb457
- [x] 1.2 `npm run lint:skills` passes — 62eb457
#### Manual
- [x] 1.3 (agent-runnable) Sandbox `/dx-plan` on a fixture change with two independent phases emits tagged rows and one integration phase `Depends on:` both; a single-phase fixture emits no integration phase — 62eb457

### Phase 2: Shared start check; dx-tdd uses it
#### Automated
- [x] 2.1 `start-check.md` exists, is listed in the `dx-references` loader, names no hardcoded branch, and covers the branch resolution, the context commit and the stopped-run guard (grep) — b601448
- [x] 2.2 `skills/dx-tdd/SKILL.md` loads `start-check` before `## The phase` and adds no worktree text (grep) — b601448
- [x] 2.3 `npm run lint:skills` passes — b601448
#### Manual
- [x] 2.4 (agent-runnable) Sandbox `/dx-tdd` from an existing feature branch commits the context files first and works in the current checkout; with a kept `.worktrees/<id>` left by a stopped auto run it stops and points at `/dx-implement` — b601448

### Phase 3: dx-implement auto mode runs in worktrees
#### Automated
- [x] 3.1 `skills/dx-implement/SKILL.md` covers every row of the failure-modes table and user cases 1–8, the start check precedes both modes, and no branch name is hardcoded (grep for `dx/`) — 8fd3cdd
- [x] 3.2 `npm run lint:skills` passes — 8fd3cdd
#### Manual
- [x] 3.3 (agent-runnable) Sandbox `/dx-implement` and `--manual` start from (i) an existing feature branch, (ii) a branch the user names, (iii) the default branch with none named: (i) and (ii) proceed without renaming, (iii) asks; each commits the context files first — 8fd3cdd
- [x] 3.4 (agent-runnable) Sandbox `/dx-implement` on a fixture with a serial plan: runs in `.worktrees/<id>`, main checkout tree untouched apart from `context/`, context committed first on the current branch, work branch fast-forwarded and worktree and scratch branches removed on success — 8fd3cdd
- [x] 3.5 (agent-runnable) Sandbox run with a parallel group: concurrent phases get `<id>--p<N>` worktrees, merge back in order, integration phase runs once on the merged tree, `handoff.md` holds the subagents' notes — 8fd3cdd
- [x] 3.6 (agent-runnable) Sandbox run with a forced conflict and one with a red check: each stops, keeps all worktrees and branches, ticks nothing, rolls back nothing; re-run reattaches and resumes from Progress — 8fd3cdd
- [x] 3.7 (agent-runnable) Two sandbox runs on two fixture changes at once do not interfere (separate worktrees, branches, ports) — ticked on say-so

### Phase 4: dx-init ignores `.worktrees/`
#### Automated
- [x] 4.1 `skills/dx-init/SKILL.md` adds the ignore step, idempotent, and lists it in the status output (grep) — 33ea889
- [x] 4.2 `npm run lint:skills` passes — 33ea889
#### Manual
- [x] 4.3 (agent-runnable) Sandbox `/dx-init` twice in a temp repo: `.gitignore` gains `.worktrees/` once and a pre-existing entry is not duplicated — 33ea889

### Phase 6: dx-init seeds standards once and writes a managed block
#### Automated
- [x] 6.1 `skills/dx-init/SKILL.md` gates standards seeding on a pre-existing `context/standards/`, asks on an existing context, targets `AGENTS.md`/`CLAUDE.md` per the rule, writes the `dx:workflow` block and no rollback text (grep) — 98804f0
- [x] 6.2 `npm run lint:skills` passes — 98804f0
#### Manual
- [x] 6.3 (agent-runnable) Sandbox `/dx-init`: fresh repo seeds the three standards and writes the block to `CLAUDE.md`; a re-run leaves one block; with a deleted standard it copies nothing and asks; with `AGENTS.md` plus `CLAUDE.md` containing `@AGENTS.md` the block goes into `AGENTS.md`, `CLAUDE.md` untouched — 98804f0

### Phase 5: Docs and changeset
#### Automated
- [x] 5.1 `docs/reference/skills.md`, the two explanation pages, `initialize-a-project.md` and `DESIGN.md` mention the worktree behavior, the tags and the `.gitignore` step (grep) — ec4b558
- [x] 5.2 A tutorial and an explanation page for worktree isolation exist and are linked from `docs/README.md` — ec4b558
- [x] 5.3 One `.changeset/*.md` covers this change; `npm run lint:skills` passes — ec4b558
#### Manual
- [x] 5.4 (user-only) Docs read correctly and the in-repo `.worktrees/` trade-off is stated plainly — ticked on say-so
