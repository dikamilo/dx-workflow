## The real problem

Auto mode runs in the user's single checkout, so two runs — two changes, or parallel phases within one — collide on shared state: working tree, index, branch and dev-server ports. Concurrency is unsafe today.

## Who / what it affects

- Developers running `/dx-implement` on one or several changes at once.
- `dx-implement` auto mode (coordinator and phase subagents), and `dx-plan`, which must shape phases for it (`(isolated)`/`(integrated)` tags, a group-integration step per parallel group).
- Not affected: `--manual` runs and `dx-tdd`.

## User cases

| # | Who | Trigger | Outcome | Source |
|---|-----|---------|---------|--------|
| 1 | Developer | `/dx-implement <id>` (auto), serial phases | Runs in its own coordinator worktree and branch; main checkout untouched | change.md Notes |
| 2 | Developer | Auto runs on two changes at once | No interference | change.md Notes |
| 3 | Developer | Plan has a parallel group | Each concurrent phase runs in its own subagent worktree; merged back, then `(integrated)` checks run on the merged tree | change.md Notes |
| 4 | Developer | Merge-back conflicts | Resolver agent touches only conflicted files; continues only if the group's checks pass, else stops and keeps worktrees | change.md Notes |
| 5 | Developer | A check goes red or the run stops | Reports, keeps worktrees, no rollback | change.md Notes |
| 6 | Developer | All phases succeed | Coordinator branch ready for review/PR; worktrees cleaned up | change.md Notes (location/cleanup open) |
| 7 | Developer | `/dx-implement <id> --manual` | One phase in the current checkout, no worktree | Discovered in this interview |
| 8 | Developer | Re-run after a stop | Reattaches to the existing coordinator worktree and resumes from `## Progress` | Discovered in this interview |

## Alternatives considered

- **Serialize everything** — safe, but gives up concurrent changes and parallel phases.
- **Branch switching in one checkout** — cannot run concurrently; doesn't address the problem.
- **Full clones per run** — full isolation, but costs disk and setup and loses the shared object store.
- **Worktrees (chosen)** — isolate tree, index and branch cheaply while sharing the git object store. Prior art (`research/auto-worktree-prior-art.md`) validates the coordinator-worktree half; the parallel-subagent half has no precedent and is new design.

## Out of scope

- Live peer messaging between subagents (decided: shared handoff file only).
- Auto-rollback.
- Worktrees for `--manual` and `dx-tdd`.
- Cross-machine or remote execution.
- Handed to `/dx-plan` as design decisions: dependencies per worktree (a phase that changes dependencies is probably not parallel-safe), failure attribution for `(integrated)` checks after a multi-phase merge, and coordinator worktree location and cleanup (prior art suggests keep on stop, clean only on success).
