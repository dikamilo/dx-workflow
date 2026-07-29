---
name: dx-plan-review
description: Review a change's plan before implementation — substance, feasibility, fit, and standards match.
disable-model-invocation: true
argument-hint: [change-id]
---

# dx-plan-review

An **optional pre-implementation gate**. Where `dx-implement` asks "did we build the plan?", this asks "will this plan actually work?" — a flawed plan costs hours, a flawed review costs minutes. **Report only:** you analyze and recommend, you never edit `plan.md` or the code it describes. Fixes are for the user or `dx-plan` to apply.

**Guard.** Resolve `<change-id>` under `context/changes/`; its `plan.md` must exist — if not, tell the user to run `/dx-plan <change-id>` first. If the path is under `context/archive/`, refuse: an archived change is done.

## Load first
- `plan.md` fully, plus the `change.md` (note `type`) and any `research/`, `frame.md`, `diagnosis.md` it draws on.
- The `plan-template` reference (invoke `dx-references` with `plan-template`) — so you know the shape a sound plan should have.
- `context/standards/` and the `knowledge-layer` reference (invoke `dx-references` with `knowledge-layer`) — you need the matching heuristic and the real catalog yourself to catch a standard the plan's own checklist missed, not just re-check what it already listed.
- The `review-report` reference (invoke `dx-references` with `review-report`) — the finding-ID/`Resolution` schema and file convention shared with `impl-review` and `review-triage`.
- `foundation/glossary.md` — a one-line habit: judge naming against the project's established terms.

## Review on four dimensions
Read the plan against itself first (the cheapest, highest-value pass), then against reality.

- **Substance** — does the approach actually solve the framed problem? Could every phase pass and the goal still be unmet? Any last-mile gap.
- **Feasibility** — are phases realistic, correctly ordered, each a testable vertical slice? Vague "refactor as needed", TBDs, or missing verification steps are findings.
- **Architectural fitness** — does it fit the existing system? New patterns where one already exists, wrong dependency direction, wide blast radius.
- **Standards-fit** — are the plan's **Standards to apply** the right *matched* ones for this change's domain and type? Flag gaps (an applicable standard the plan missed) and mismatches.

To check claims against the real codebase — riskiest file paths, unlisted callers, whether a pattern already exists — fan out to built-in `Explore` subagents with targeted questions. Don't dump the whole plan; a focused prompt finds more.

## Write and print the findings
Compile a **concise markdown list** — no tables, no box-drawing, no severity matrix. Follow the `review-report` reference's finding format (each finding needs a **Why it matters** line, not just **Detail**), tagging each with `[Blocker]` or `[Consider]`. If the plan is sound, say so in a line — don't manufacture findings. If `context/standards/` doesn't exist yet, don't fault the plan for "no standards matched" as if the dimension were checked clean — flag it as a low-priority `Consider` finding pointing at `/dx-standards-discover` instead. Close with a one-line verdict: **sound** / **revise** / **rethink**.

Write it to `context/changes/<change-id>/reviews/plan-review.md` (create `reviews/` if absent) per the reference's file convention, and print the same list to the user. Do **not** touch `plan.md`.

## Done when
The findings file exists and is printed, and `plan.md` and the code are unchanged. Then print the next command and stop — no auto-chain:

```
Plan review: context/changes/<change-id>/reviews/plan-review.md
Next: /dx-review-triage <change-id> plan   — triage findings and apply fixes to plan.md
  or: /dx-implement <change-id>  (/dx-tdd <change-id> for defect/test-first) — proceed as-is
```
