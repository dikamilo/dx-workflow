---
name: dx-implement
description: Execute the next pending phase of a change's plan, verify it, and commit.
disable-model-invocation: true
argument-hint: [change-id]
---

# dx-implement

Execute **one phase** of `context/changes/<change-id>/plan.md` per invocation — never the whole plan. `## Progress` in the plan is the single source of truth; you resume from it and write back to it.

**Guard.** If `plan.md` has no `- [ ]` in `## Progress`, everything is done — don't implement, jump to *Completion*. If the path is under `context/archive/`, refuse: the change is archived. If there is no `plan.md`, stop and say to run `/dx-plan <change-id>` first.

## Load first
- The plan fully, plus any `research/`, `frame.md`, `diagnosis.md` it references.
- The `progress-format` and `plan-template` references (invoke `dx-references` with each topic).
- `foundation/glossary.md` — a one-line habit: name things with the project's established terms.
- The plan's **Standards to apply** checklist and **Priors & gotchas** — these bind this phase.

## The phase
1. **Resume** = the first `- [ ]` in `## Progress`, document order. The `### Phase N:` above it is your phase. If `change.md`'s `status` is still `planned`, flip it to `implementing` (`updated: <today>`) before you start — the lifecycle field should show work underway, not just planned. Do that phase, following the plan's intent and its matched standards. If reality contradicts the plan, stop and ask — don't silently improvise.
2. **Verify** — run the phase's `#### Automated` checks. Flip a `- [ ]` to `- [x]` **only** when its check genuinely passes. **Fail loud:** if a check is red, missing, or skipped, stop and report — do not check the box. `#### Manual` boxes need a human confirmation before flipping.
3. **Commit** the phase as one Conventional Commit: `<type>(<change-id>): <phase title> (p<N>)`. Then append the short SHA to every Progress row that landed in it (` — <sha>`). A no-diff phase (manual-only) commits nothing and leaves rows SHA-less.

Do **not** renumber, delete, or duplicate Progress rows. `dx-implement` and `dx-tdd` are siblings writing this same section, so phases interleave freely — one may be TDD, the next standard.

## On failure
Never auto-rollback or revert (root `CLAUDE.md` rollback principle). Stop, report what failed and why, and let the user decide. Most failures are a small fix, not a reason to discard work.

## Completion
When every `## Progress` box is `- [x]`: set `change.md` `status: implemented`, `updated: <today>`, then suggest the review gate. Otherwise there are more phases — suggest the next one. Print one line and stop (no auto-chain):

```
Next: /dx-impl-review <change-id>          # all phases done
Next: /dx-implement <change-id>            # more phases remain — runs the next one
```
