# Run parallel phases in worktrees

In this tutorial you will run `/dx-implement` on a plan with two independent phases and watch it work in its own git worktrees instead of your checkout. By the end you will have seen the coordinator and phase worktrees appear, the group merge back, your work branch fast-forward, and how a stopped run is kept and resumed. You need a project already set up with `/dx-init` and a change with a plan; the running example is a `search-filters` change.

## Prerequisites

- A project initialized with [`/dx-init`](initialize-a-project.md), so `.gitignore` lists `.worktrees/`. If it doesn't, `/dx-implement` stops and tells you to run `/dx-init`.
- A change with a `plan.md`, for example `context/changes/search-filters/plan.md`, made as in [Ship your first change](ship-a-change.md).
- A git repository with at least one commit, and a feature branch checked out (or a name in mind for one).

## Step 1 — Plan with a parallel group

Run:

```text
/dx-plan search-filters
```

When two phases touch disjoint files, `/dx-plan` marks them as independent and shapes the plan for parallel work:

> Phases 1 (backend filter query) and 2 (filter chips UI) are independent: `Depends on: none`. Added an integration phase 3 that depends on both.

Open `plan.md` and look at `## Progress`. You will see:

```markdown
### Phase 1: Backend filter query
#### Automated
- [ ] 1.1 (isolated) unit tests for the filter parser pass
### Phase 2: Filter chips UI
#### Automated
- [ ] 2.1 (isolated) typecheck and lint pass
### Phase 3: Integration
Depends on: 1, 2
#### Automated
- [ ] 3.1 (integrated) e2e: selecting a chip filters the results
```

Members carry only `(isolated)` rows. Anything that needs a running app or both phases' code sits in the integration phase. Why that split exists: [worktree isolation](../explanation/worktree-isolation.md).

## Step 2 — Start the run

On your feature branch, run:

```text
/dx-implement search-filters
```

> **dx-implement** runs the start check first. You are on `search-filters-work`, not the default branch, so that is the work branch. It commits the change's uncommitted `context/` files there before anything else.

If you were on the default branch, it would ask which branch to use. It never invents a name.

## Step 3 — Watch the worktrees appear

While it runs, list your worktrees from another terminal:

```text
git worktree list
```

You will see the coordinator and one sibling per concurrent phase:

```text
/path/to/repo                                   abc1234 [search-filters-work]
/path/to/repo/.worktrees/search-filters         abc1234 [search-filters-work--wt]
/path/to/repo/.worktrees/search-filters--p1     abc1234 [search-filters-work--p1]
/path/to/repo/.worktrees/search-filters--p2     abc1234 [search-filters-work--p2]
```

Your own checkout is untouched apart from `context/`. Keep editing there if you like.

## Step 4 — See the group merge and the result

When both `(isolated)` checks pass, the coordinator commits each phase, merges them back in dependency order, then runs the integration phase once on the merged tree. Subagent notes land in `context/changes/search-filters/handoff.md` as each one returns.

On success the run fast-forwards your work branch, removes the `.worktrees/search-filters*` folders and the scratch branches, and prints:

```text
Next: /dx-review implementation search-filters   # all phases done
```

Check that the result is on your branch:

```text
git log --oneline -5
git worktree list
```

You will see one commit per phase on `search-filters-work`, and only your own checkout in the worktree list.

## Step 5 — Stop and resume

Now the other path. Suppose the integration check goes red. The run stops and reports; it does not roll anything back:

> Check 3.1 is red. Worktrees `.worktrees/search-filters*` and the scratch branches are kept, boxes are unticked from 3.1 onward. Cause isn't obvious, so I'm handing this to `/dx-diagnose`.

Everything is still there, so you can inspect the merged tree in `.worktrees/search-filters`. Fix the problem, then run the same command:

```text
/dx-implement search-filters
```

It reattaches to the kept coordinator worktree, cross-checks the last SHA recorded in Progress against that worktree's log, and resumes at the first unticked row.

While a kept worktree exists, `/dx-tdd` and `/dx-implement --manual` refuse to run and point you at `/dx-implement`. Their phases would run on your work branch, which doesn't yet hold the commits of the phases already ticked.

If you decide to abandon the run, delete the leftovers yourself. Nothing else touches them:

```text
git worktree remove --force .worktrees/search-filters
git branch -D search-filters-work--wt
```

## What you built

- A plan with a parallel group, `(isolated)` and `(integrated)` rows, and an integration phase.
- A run that never touched your checkout, merged two phases, and fast-forwarded your branch.
- A feel for the stop path: everything is kept, and a re-run resumes.

One thing to remember: `.worktrees/` sits inside your repository. Git ignores it, but linters, globs and test runners may still walk into it. If one does, exclude `.worktrees/` in that tool's config.

## Where to next

- [Worktree isolation](../explanation/worktree-isolation.md) — why it works this way and the trade-offs.
- [Plans and slices](../explanation/plan-and-slices.md) — how phases and tags are planned.
- [Implement vs TDD](../explanation/implement-vs-tdd.md) — the one-phase siblings.
- [Review and triage](review-and-triage.md) — the gate that follows implementation.
