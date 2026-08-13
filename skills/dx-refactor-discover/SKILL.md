---
name: dx-refactor-discover
description: Hunt the codebase for refactor opportunities, present them inline, and promote the ones you pick into changes.
disable-model-invocation: true
argument-hint: [area or path]
---

# dx-refactor-discover

Start with no concrete target — "find me refactor opportunities." Scan the codebase for **design problems worth fixing** — shallow modules to turn deep, plus whatever the wider design lenses surface — present them **inline as markdown**, and promote whichever the user picks into a normal container. This skill discovers and hands off; it does not plan or edit code.

**Guard.** If `context/` isn't scaffolded (no `changes/` or `efforts/`), stop and tell the user to run `/dx-init`. The findings this run produces are **ephemeral** — there is no debt register; anything not promoted or recorded as a lesson leaves no trace.

## 1 — Load the vocabulary

Invoke `dx-references` with topic `module-design` — its terms (deep vs shallow, seam, leverage and locality, adapter, dependency category, the deletion test) are how every finding is phrased, and its `## Rejected framings` says which words stay out. Read `foundation/glossary.md` for naming (a one-line habit — no section) and `foundation/lessons.md` so you **skip anything a prior run already rejected** ("don't re-deepen X because Y").

## 2 — Scan

Optionally scoped by `[area or path]`; unscoped means the whole tree. Invoke `dx-references` with `design-lenses` — module depth is the primary lens, not the only one, and problems outside it go unfound if nothing else is looking. Fan out to built-in `Explore` subagents to walk it — explore for friction, don't run rigid heuristics.

**Recency is the default prior.** Walk back a stretch of `git log --oneline` and let the paths that keep showing up pull attention first — churn is where a deepening pays back soonest. If the log is scattered with no clear hot spot, widen the net instead.

Look for: understanding one concept that means bouncing between many small modules; shallow modules (interface nearly as wide as the implementation); pure functions extracted only for testability while the real bug hides in how they're called; seams that leak; and what the other lenses catch — knowledge duplicated across modules, one module changing for unrelated reasons, coupling that makes a single edit ripple. Apply the **deletion test** to each suspect: would deleting it concentrate complexity, or just move it? "Concentrates" is the signal.

**Whichever lens found it, `module-design` is still how it's said.** A layering violation reports as "this module reaches through two interfaces to the store; the seam belongs at X" — not as the principle it violates.

## 3 — Present findings inline

Markdown only — no HTML, no report file, no clipboard. A concise numbered list; each candidate one tight entry:

- **What & where** — the module and files.
- **Why it's shallow / tangled** — in `module-design` terms.
- **Shape: before → after** — one line (`4 wrappers + handler → 1 module, 2 methods`).
- **Proposed deepening** — the move, plus a strength tag (`Strong` | `Worth exploring` | `Speculative`).
- **Dependency category** — in-process / local-substitutable / remote-but-owned / true-external. The strength tag says whether the deepening is worth doing; this says whether the result can be tested afterwards, which is where a refactor actually stalls.

**Cash out the win.** Name it in `module-design` terms — "locality: bugs concentrate in one module", "leverage: one interface, 12 call sites", "two adapters justify the seam: HTTP in prod, in-memory in tests". "Cleaner code" and "easier to maintain" give the reader nothing to check and nothing to carry into the change.

Do **not** design interfaces yet.

**Close with a top pick** — one sentence: which candidate to tackle first and why. The strength tag ranks confidence, not sequence; a `Strong` finding in a file nobody touches is worth less than a `Worth exploring` one in a hot path. Then ask which the user wants to promote.

## 4 — Promote the pick

- **One** → create the change directly, the same way `dx-diagnose` self-contains its own promotion: write `context/changes/<slug>/change.md` stamped `type: refactor`, with the finding captured as its seed `research/<topic>.md` (or `frame.md` if it reads more like a framing than a research write-up). Invoke `dx-references` with `change-md` for the exact schema. This is this skill's own deliverable, not a chain into `/dx-plan` — that stays the printed next command.
- **Many** → decomposing into an effort + roadmap + several child changes is already a multi-step flow owned by other skills (`dx-new` for the effort, `dx-roadmap` for the slices, `dx-new` again per slice) — print the commands and let the user drive it, don't fold all of that in here. But don't make the user re-type what they just picked: compose a **seed summary**, the full entry (what & where, why, shape, proposed deepening, strength tag, dependency category) for each promoted finding, under a heading that names `/dx-refactor-discover` as the source. Print it as the literal argument to hand to `/dx-new` so the handoff carries the detail, not just a slug. Carry the top pick into it as a closing line — `/dx-roadmap` sequences the slices, and the read on which one goes first is the thing it can't re-derive.
- **Rejected with a load-bearing reason** → offer `/dx-lesson` to record "don't re-deepen X because Y" so the next run skips it. Rejected ephemerally or selected → no durable trace.

## Done when

Findings have been presented inline and the user has chosen. For a single promoted change, the container now exists — print what was created and the next command. For everything else, print the exact command and **stop** — never run it:

```
Promoted one: Change created: context/changes/<slug>/change.md   (type: refactor, seeded with the finding)
              Next: /dx-plan <slug>

Promote many: Next: /dx-new "<seed summary>"   →  /dx-roadmap <effort-id>

              Where <seed summary> is:
              ## Refactor opportunities (from /dx-refactor-discover)
              1. **<title>** — <module/files>
                 Why: <shallow/tangled reason + the cashed-out win, in module-design terms>
                 Shape: <before → after>
                 Proposed: <the move> (<Strong|Worth exploring|Speculative>, <dependency category>)
              2. ...
              Start with: <which one first, and why>

Record a no:  /dx-lesson                (don't re-deepen X because Y)
```

Stop. Do not chain into another skill.
