---
name: dx-tdd
description: Execute the next pending phase of a change's plan test-first — red, green, refactor — and commit.
disable-model-invocation: true
argument-hint: [change-id]
---

# dx-tdd

Execute **one phase** of `context/changes/<change-id>/plan.md` per invocation, test-first — never the whole plan. `## Progress` in the plan is the single source of truth; you resume from it and write back to it. This is the **red-green sibling of `dx-implement`**: same section, same rows, same commit ritual — the only difference is ordering, the failing test comes before the code.

**Guard.** If `plan.md` has no `- [ ]` in `## Progress`, everything is done — jump to *Completion*. If the path is under `context/archive/`, refuse: the change is archived. If there is no `plan.md`, stop and say to run `/dx-plan <change-id>` first.

## Load first
- The plan fully, plus any `research/`, `frame.md`, `diagnosis.md` it references.
- The `progress-format` reference (invoke `dx-references`); `plan-template` for the phase's shape.
- `foundation/glossary.md` — a one-line habit: name tests and interfaces with the project's established terms. If naming this phase surfaces a clash, a fuzzy term, or a term that finally resolves, invoke `dx-domain` before continuing.
- The plan's **Standards to apply** checklist and **Priors & gotchas** — these bind this phase.

## The phase
1. **Resume** = the first `- [ ]` in `## Progress`, document order. The `### Phase N:` above it is your phase, and it is a **vertical slice** — end-to-end and demoable, not a horizontal layer. If `change.md`'s `status` is still `planned`, flip it to `implementing` (`updated: <today>`) before you start — the lifecycle field should show work underway, not just planned. If the phase genuinely can't be driven by a failing test (pure scaffolding, config, infra wiring), say so and hand it to `/dx-implement` — don't fake a test.

   The phase's `#### Automated` rows are already a task breakdown — one row, one behavior, one red-green-refactor trip. Decide per row: a behavior with its own test, that no earlier row's design choice shapes, can go to a fresh `general-purpose` subagent (the behavior, matched standards/priors, this file's red/green/refactor steps) to report back the test it wrote and why the red was for the right reason. Keep inline a row that depends on, or decides, a design choice the rest of the phase follows. Pick the model per the `model-policy` reference (invoke `dx-references` with `model-policy`) — judging whether a test fails *for the right reason* is the judgment-heavy part, so don't drop a tier just because the test looks simple. Verify a subagent's "it's green" against the row's actual check before trusting it.
2. **Red → green → refactor**, behavior by behavior — each `#### Automated` row is one trip round the loop:
   - **Red:** write **one** failing test for the next behavior; run it; confirm it fails for the *right* reason (a real assertion or "not implemented", not a broken import). Never `skip`/`xit` to fake a pass — red is the point.
   - **Green:** write the **minimal** production code to pass. One test → one slice of code; never write all the tests up front.
   - **Refactor:** clean up with the test staying green. Skip when there's nothing to clean.
   Flip a `- [ ]` to `- [x]` **only** when its check genuinely passes on a green full suite. **Fail loud:** if a check is red, missing, or skipped, stop and report — do not check the box. `#### Manual` boxes need a human confirmation before flipping.
3. **Commit** the phase as one Conventional Commit: `<type>(<change-id>): <phase title> (p<N>)` (prefer `test`/`feat`). Then append the short SHA to every Progress row that landed in it (` — <sha>`).

**Done when** every `#### Automated` row in the phase is `- [x]` on a green suite and the slice is demoable. Do **not** renumber, delete, or duplicate Progress rows. `dx-tdd` and `dx-implement` are siblings writing this same section, so phases interleave freely — one may be TDD, the next standard.

## On failure
Never auto-rollback or revert (root `CLAUDE.md` rollback principle). A red test at commit time means the code isn't done, not that work should be discarded — fix the code (never the test) until green, or stop and report and let the user decide. If the cause isn't obvious after a quick look — no one-line explanation, or a fix attempt didn't stick — invoke `dx-diagnose` instead of guessing further fixes.

## Completion
When every `## Progress` box is `- [x]`: set `change.md` `status: implemented`, `updated: <today>`, then suggest the review gate. Otherwise there are more phases — suggest the next one. Print one line and stop (no auto-chain):

```
Next: /dx-impl-review <change-id>          # all phases done
Next: /dx-tdd <change-id>                  # more phases remain — next one test-first
Next: /dx-implement <change-id>            # ...or drive the next phase standard
```
