---
name: dx-diagnose
description: Feedback-loop-first diagnosis for bugs and performance regressions. Use when something misbehaves (errors, crashes, hangs, wrong output), got slower or flaky, or regressed — or when the user asks to debug or find the root cause of a defect or perf problem.
argument-hint: [symptom]
---

# dx-diagnose

Find the cause of a bug or perf regression, then either fix it inline or **promote** it into a change. Feedback-loop-first: **no red-capable loop, no hypothesising.** Read `foundation/glossary.md` if present (one-line habit — name the symptom in the project's terms).

Ad-hoc by default: this runs on a raw symptom with no container. If invoked **mid-task** (e.g. during `/dx-implement`), finish diagnosing this bug, then suggest the next step — don't silently resume the interrupted skill.

## Phase 1 — Build a tight, red-capable loop *(this is the skill)*

Name **one command** — a failing test, curl, CLI diff, headless-browser script, trace replay, throwaway harness, fuzz/property loop, `git bisect run`, or differential run — that you have **already run once** (paste invocation + output) and that:

- **goes red on THIS bug** — drives the real code path and asserts the user's exact symptom (not "runs without erroring");
- is **deterministic** (flaky bugs: raise the reproduction rate until debuggable) and **fast** (seconds).

Spend your effort here — once a tight loop exists, most of the fix follows. If you genuinely cannot build one, stop and say so — list what you tried, ask for an environment/artifact/instrumentation. **Done when** that command exists and goes red. Catching yourself theorising before it exists is the exact failure this prevents.

## Phase 2 — Reproduce + minimise

Run the loop red. Confirm it is the **user's** symptom, not a nearby one. Then shrink to the smallest scenario that still goes red — cut inputs/callers/config **one at a time**, re-running each cut. **Done when** every remaining element is load-bearing.

## Phase 3 — Hypothesise (3–5, ranked, falsifiable)

Generate 3–5 hypotheses **before testing any** — single-hypothesis anchors on the first plausible idea. Each states its prediction: "if X is the cause, changing Y flips the verdict." No prediction → it's a vibe; sharpen or drop it. **Show the ranked list to the user before instrumenting** (they may re-rank instantly); proceed on your ranking if they're AFK.

## Phase 4 — Instrument (one variable at a time)

Each probe maps to one Phase-3 prediction. Prefer a debugger/REPL over logs; **tag every debug log** with a unique prefix (`[DEBUG-a4f2]`) so cleanup is one grep. For perf: measure a baseline first (profiler / timing / query plan), then bisect — never "log everything".

## Phase 5 — Fix + regression test

Write the regression test **first if a correct seam exists** — one exercising the real bug pattern at its call site. If the only seam is too shallow to catch it, **that absence is itself the finding** — note it. Fix, watch red→green, then re-run the Phase 1 loop against the original un-minimised scenario.

## Phase 6 — Cleanup + outcome

Original repro gone, regression test green (or missing-seam documented), all `[DEBUG-…]` removed, throwaway harnesses deleted. State the winning hypothesis. Then decide:

- **Trivial → ad-hoc, no container.** Fix stays inline, regression test stays. No artifacts. Never auto-rollback.
- **Non-trivial → PROMOTE.** Write `diagnosis.md` (minimised repro + ranked hypotheses + regression test) and run `/dx-new` stamped `type: defect` (which activates the TDD gate in `/dx-plan`), carrying that file as the change's seed. For the change's schema, invoke `dx-references` with topic `change-md`. `/dx-plan` reads `diagnosis.md` the way it reads research.

## Done when

Print the outcome and the next command, then **stop**:

```
Trivial:  Fixed inline: <one-line cause>. Regression test: <path>.
Promoted: Diagnosis written: context/changes/<id>/diagnosis.md
          Next: /dx-plan <id>   (defect → TDD gate)
```

Never chain into the next skill; never roll back without the user.
