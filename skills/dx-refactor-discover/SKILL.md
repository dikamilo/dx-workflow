---
name: dx-refactor-discover
description: Hunt the codebase for refactor opportunities, present them inline, and promote the ones you pick into changes.
disable-model-invocation: true
argument-hint: [area or path]
---

# dx-refactor-discover

Start with no concrete target — "find me refactor opportunities." Scan the codebase for **deepening opportunities** (shallow modules to turn deep), present them **inline as markdown**, and promote whichever the user picks into a normal container. This skill discovers and hands off; it does not plan or edit code.

**Guard.** If `context/` isn't scaffolded (no `changes/` or `efforts/`), stop and tell the user to run `/dx-init`. The findings this run produces are **ephemeral** — there is no debt register; anything not promoted or recorded as a lesson leaves no trace.

## 1 — Load the vocabulary

Invoke `dx-references` with topic `module-design` — its terms (deep vs shallow, seam, the deletion test, "the interface is the test surface") are how every finding is phrased. Don't drift into "component / service / boundary." Read `foundation/glossary.md` for naming (a one-line habit — no section) and `foundation/lessons.md` so you **skip anything a prior run already rejected** ("don't re-deepen X because Y").

## 2 — Scan

Optionally scoped by `[area or path]`; unscoped means the whole tree. Fan out to built-in `Explore` subagents to walk it — explore for friction, don't run rigid heuristics. Look for: understanding one concept that means bouncing between many small modules; shallow modules (interface nearly as wide as the implementation); pure functions extracted only for testability while the real bug hides in how they're called; seams that leak. Apply the **deletion test** to each suspect: would deleting it concentrate complexity, or just move it? "Concentrates" is the signal.

## 3 — Present findings inline

Markdown only — no HTML, no report file, no clipboard. A concise numbered list; each candidate one tight entry:

- **What & where** — the module and files.
- **Why it's shallow / tangled** — in `module-design` terms.
- **Proposed deepening** — the shape after, plus a strength tag (`Strong` | `Worth exploring` | `Speculative`).

Do **not** design interfaces yet. Then ask which the user wants to promote.

## 4 — Promote the pick

- **One** → spawn a single change: `/dx-new <slug>` stamped `type: refactor`, seeded with that finding as its research/frame. `dx-new` drops the finding into the change folder; `dx-plan` will load `module-design` and the behavior-preserving gate.
- **Many** → spawn one effort via `/dx-new`, then `/dx-roadmap <effort-id>` with the selected candidates as slices — each becomes a child refactor-change.
- **Rejected with a load-bearing reason** → offer `/dx-lesson` to record "don't re-deepen X because Y" so the next run skips it. Rejected ephemerally or selected → no durable trace.

## Done when

Findings have been presented inline and the user has chosen. Print the exact promotion command and **stop** — never run it:

```
Promote one:  /dx-new <slug>            (type: refactor, seeded with the finding)
Promote many: /dx-new <effort-slug>  →  /dx-roadmap <effort-id>
Record a no:  /dx-lesson                (don't re-deepen X because Y)
```

Stop. Do not chain into another skill.
