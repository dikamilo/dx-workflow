---
change_id: skill-auto-worktrees
title: Worktree-isolated parallel phases in dx-implement auto mode
type: feature
effort: null
slice: null
status: archived
created: 2026-10-07
updated: 2026-10-07
archived_at: 2026-10-07
---

## Notes
Follow-up to `skill-friction-fixes` (auto mode became the default, `--manual` runs one phase). Decisions from the 2026-10-07 conversation:

- **Coordinator worktree:** auto mode creates its own worktree and branch per change, so several changes can run at once without interfering.
- **Subagent worktrees:** only for phases that run concurrently, each branched from the coordinator's branch and merged back after the group finishes. Serial phases run in the coordinator's worktree.
- **Communication:** a shared handoff file in the change folder (e.g. `handoff.md`); subagents append decisions and gotchas, later phases read it. No live peer messaging.
- **Merge conflicts:** the coordinator spawns an agent to resolve them. Guardrails: the resolver touches only conflicted files, and all of the group's checks must pass afterward; otherwise stop and report, keep the worktrees (no auto-rollback).
- **Plan shapes the work for this:** `dx-plan` tags each `#### Automated` row `(isolated)` or `(integrated)`. `(isolated)` needs only the phase's own source tree (typecheck, lint, pure unit tests) and runs in the subagent's worktree. `(integrated)` needs ports, a dev server, a database, other phases' code, or e2e, and runs only on the coordinator's merged tree, including `agent-runnable` Manual rows that drive a running app. `dx-plan` emits a group-integration step per parallel group. Only the coordinator starts dev servers and kills what it started.
- **Ownership:** subagents tick nothing; the coordinator owns Progress and the per-phase commits.

Open questions (settle in `/dx-frame`):
1. Dependencies per worktree: per-worktree install, symlink to the coordinator's, or restrict `(isolated)` to checks needing nothing installed. A phase that changes dependencies is probably not parallel-safe, and the plan should say so.
2. Failure attribution when an `(integrated)` check fails after a multi-phase merge: merge and check phase by phase in dependency order (slower, pinpoints the culprit) versus one run per group then `dx-diagnose`.
3. Where the coordinator's worktree lives and how it is cleaned up on success versus on a stop.
