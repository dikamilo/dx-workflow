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

- **One** → create the change directly, the same way `dx-diagnose` self-contains its own promotion: write `context/changes/<slug>/change.md` stamped `type: refactor`, with the finding captured as its seed `research/<topic>.md` (or `frame.md` if it reads more like a framing than a research write-up). Invoke `dx-references` with `change-md` for the exact schema. This is this skill's own deliverable, not a chain into `/dx-plan` — that stays the printed next command.
- **Many** → decomposing into an effort + roadmap + several child changes is already a multi-step flow owned by other skills (`dx-new` for the effort, `dx-roadmap` for the slices, `dx-new` again per slice) — print the commands and let the user drive it, don't fold all of that in here.
- **Rejected with a load-bearing reason** → offer `/dx-lesson` to record "don't re-deepen X because Y" so the next run skips it. Rejected ephemerally or selected → no durable trace.

## Done when

Findings have been presented inline and the user has chosen. For a single promoted change, the container now exists — print what was created and the next command. For everything else, print the exact command and **stop** — never run it:

```
Promoted one: Change created: context/changes/<slug>/change.md   (type: refactor, seeded with the finding)
              Next: /dx-plan <slug>
Promote many: /dx-new <effort-slug>  →  /dx-roadmap <effort-id>
Record a no:  /dx-lesson                (don't re-deepen X because Y)
```

Stop. Do not chain into another skill.
