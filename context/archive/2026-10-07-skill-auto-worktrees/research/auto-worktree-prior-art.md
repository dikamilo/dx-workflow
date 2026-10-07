---
topic: auto-worktree-prior-art
kind: external
source: external prior art (published agent skills; unnamed by request)
gathered: 2026-10-07
---

## Topic

How do existing autonomous implement-and-PR skills isolate work in git worktrees, and what of it carries over to `dx-implement` auto mode?

## Findings

### Coordinator worktree (proven pattern)
- The primary checkout is never used for a run. If already inside a linked worktree, reuse it; otherwise create a temporary one. Never nest worktrees.
- Creation: fetch the base branch, `git worktree add --detach` off the remote base, then check out a new task branch (`feat/<slug>` or `fix/<slug>`).
- Location: a temp folder inside the repo, named `<slug>-<timestamp>`.
- Dependencies are restored per worktree from the repo's lockfile; the step is skipped when nothing needs installing.
- A `created-by-this-run` flag gates cleanup: only worktrees the run created are removed (`git worktree remove --force`, then `git worktree prune`), in a trap/finally so it runs on any exit.
- A crashed or interrupted run leaves its branch with a status marker and a progress report, so work is never stranded.

### Ownership, progress and resume
- One agent owns the branch and the progress commits at a time. A lock/ownership check over the plan file, remote branch and open PR stops two runs claiming the same slot; an explicit force flag picks a new versioned slug instead of clobbering.
- The plan lands as the first commit, before any code, so any run is resumable.
- Progress is a checkbox list with a commit SHA appended per step; the progress update is its own dedicated commit.
- Resume restarts at the first unchecked row, cross-checks the last recorded SHA against the git log, and asks the user if it is unreachable. History on the branch is never rewritten.

### Parallelism
- A thin router skill delegates all machinery to the engine skills; it adds none of its own.
- No fork/join is described: parallelism comes from separate runs, each in its own worktree. There is no per-phase subagent worktree, no merge-back step, no conflict-resolution step.
- Ports, dev servers and an isolated-versus-integrated check split are not addressed; per-worktree isolation is assumed sufficient.

## Takeaways for this change
- Adopt: never-nest/reuse-if-linked, detached create then branch, created-by-us cleanup flag, resume cross-check of the last SHA, one owner of progress and commits.
- Differ: cleanup on any exit does not fit "no auto-rollback, keep worktrees on a stop"; here worktrees are kept on a stop and cleaned only on success.
- Not covered by the prior art, so new design: subagent worktrees for concurrent phases, merge-back, conflict resolver, handoff file, `(isolated)`/`(integrated)` checks, port/dev-server ownership.
