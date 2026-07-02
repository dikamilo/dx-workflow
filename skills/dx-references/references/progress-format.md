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
- [ ] 1.2 Feature works in UI
```

## Rules
- **Resume** = the first `- [ ]` in document order.
- **Completion** = `count([x]) / count([ ] + [x])`.
- Each phase should be a **vertical slice** where practical — end-to-end and demoable, not a horizontal layer pass.
- `#### Automated` = agent-verifiable (tests, build, migration). `#### Manual` = needs a human check.
- When a step lands, flip the box and append the short SHA of the commit that landed it. Per-phase Conventional Commit: `<type>(<change-id>): <phase title> (p<N>)`. The SHA can only be known once that commit exists, so this edit happens *after* committing and is itself left **uncommitted** — don't spend a second commit just to record it. It rides into the repo with whatever commits next (the following phase, a review fix, or the user's own commit); if this was the plan's last phase, it's fine for it to simply sit as harmless uncommitted state.
- Never delete or renumber landed steps; add follow-ups as new boxes.
