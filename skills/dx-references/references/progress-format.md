# `## Progress` — the execution single-source-of-truth

`plan.md` owns one `## Progress` section. It is the **only** record of execution state — no sidecar file, no status flags. Resume by scanning it; completion is counted from it. `dx-implement` and `dx-tdd` write it identically, so they interleave freely across phases.

## Format

```markdown
## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: <name>
#### Automated
- [x] 1.1 Migration applies cleanly — abc1234
#### Manual
- [ ] 1.2 (agent-runnable) Feature works in UI
- [ ] 1.3 (user-only) Copy reads well
```

## Rules
- **Resume** = the first `- [ ]` in document order.
- **Completion** = `count([x]) / count([ ] + [x])`.
- Each phase should be a **vertical slice** where practical — end-to-end and demoable, not a horizontal layer pass.
- `#### Automated` = agent-verifiable (tests, build, migration). `#### Manual` = not a test run, each row labelled `(agent-runnable)` (the agent can drive and observe it — sandbox run, CLI, browser) or `(user-only)` (needs a human's eyes or judgment). The implementer runs `agent-runnable` rows itself and ticks them on evidence; a `user-only` row ticked on the user's bare say-so gets ` — ticked on say-so`.
- When a step lands, flip the box and append the short SHA of the commit that landed it. Per-phase Conventional Commit: `<type>(<change-id>): <phase title> (p<N>)`. The SHA can only be known once that commit exists, so this edit happens *after* committing and is itself left **uncommitted** — don't spend a second commit just to record it. It rides into the repo with whatever commits next (the following phase, a review fix, or the user's own commit); if this was the plan's last phase, it's fine for it to simply sit as harmless uncommitted state.
- Never delete or renumber landed steps; add follow-ups as new boxes.
