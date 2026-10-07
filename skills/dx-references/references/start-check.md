# Start check

Run before any phase work, in every mode of `dx-implement` and in `dx-tdd`. Three steps, in order. Never name a branch yourself: the user's naming convention is theirs.

## 1. Work branch
Resolve it, first match wins:
1. The current branch, if it isn't the default branch (covers an existing branch and a checked-out PR branch).
2. A branch the user names: check it out if it exists, else create it from the current HEAD.
3. On the default branch with none named: **ask**. Never commit to the default branch unprompted.

A named branch that can't be checked out: stop and ask.

## 2. Context commit
Commit uncommitted files under `context/` that this change reads (its change folder, parent effort, foundation, standards) on the work branch, before anything else. Nothing to commit: skip silently.

## 3. Stopped-run guard
A kept `.worktrees/<change-id>*` worktree or a scratch branch `<work-branch>--wt` / `<work-branch>--p<N>` means a stopped auto run left commits that aren't on the work branch yet.
- `--manual` and `dx-tdd`: stop and point at `/dx-implement <change-id>`. Resuming here would run on a branch missing the ticked phases' code.
- Auto mode: reattach instead.
