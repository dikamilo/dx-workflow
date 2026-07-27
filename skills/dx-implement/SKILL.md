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
- `foundation/glossary.md` — a one-line habit: name things with the project's established terms. If naming this phase surfaces a clash, a fuzzy term, or a term that finally resolves, invoke `dx-domain` before continuing.
- The plan's **Standards to apply** checklist and **Priors & gotchas** — these bind this phase.

## The phase
1. **Resume** = the first `- [ ]` in `## Progress`, document order. The `### Phase N:` above it is your phase. If `change.md`'s `status` is still `planned`, flip it to `implementing` (`updated: <today>`) before you start — the lifecycle field should show work underway, not just planned.

2. **Break the phase into tasks, in memory.** A phase is rarely one atomic step — sketch its sequence (files touched, order, which checks gate which edits) as a short working list. Scratch reasoning only, never written to `plan.md`.

3. **Delegate what's self-contained, do the rest yourself.** A task with its own files and its own check, that nothing later in the phase needs your reasoning about, can go to a fresh `general-purpose` subagent with write access — the task, matched standards/priors, and the check to run — reporting back what changed and the result. Keep inline anything small, or whose approach a later task's judgment call depends on. Pick the model per the `model-policy` reference (invoke `dx-references` with `model-policy`). Verify a subagent's result against its own stated check before folding it in — its "done" isn't yours to trust unchecked. If reality contradicts the plan — your own work or a subagent's report — stop and ask, don't silently improvise past it.

4. **Verify** — run the phase's `#### Automated` checks yourself, even for tasks a subagent already checked; the phase-level check is what actually gates the box. Flip a `- [ ]` to `- [x]` **only** when its check genuinely passes. **Fail loud:** if a check is red, missing, or skipped, stop and report — do not check the box. `#### Manual` boxes need a human confirmation before flipping.
5. **Commit** the phase as one Conventional Commit: `<type>(<change-id>): <phase title> (p<N>)`. Then append the short SHA to every Progress row that landed in it (` — <sha>`). A no-diff phase (manual-only) commits nothing and leaves rows SHA-less.

Do **not** renumber, delete, or duplicate Progress rows. `dx-implement` and `dx-tdd` are siblings writing this same section, so phases interleave freely — one may be TDD, the next standard.

## On failure
Never auto-rollback or revert (root `CLAUDE.md` rollback principle). Stop, report what failed and why, and let the user decide. Most failures are a small fix, not a reason to discard work. If the cause isn't obvious after a quick look — no one-line explanation, or a fix attempt didn't stick — invoke `dx-diagnose` instead of guessing further fixes.

## Completion
When every `## Progress` box is `- [x]`: set `change.md` `status: implemented`, `updated: <today>`, then suggest the review gate. Otherwise there are more phases — suggest the next one. Print one line and stop (no auto-chain):

```
Next: /dx-impl-review <change-id>          # all phases done
Next: /dx-implement <change-id>            # more phases remain — runs the next one
```
