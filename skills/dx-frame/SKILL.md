---
name: dx-frame
description: Interview to settle the problem framing and alternatives for a change or effort before planning — writes frame.md.
disable-model-invocation: true
argument-hint: [change-id or effort-id]
---

# dx-frame

Settle the **WHAT** before the **HOW**. Run a deep interview on problem framing and alternatives for a change or effort, then write `frame.md` in its folder. The interview is the cure for misalignment — a perfect plan on the wrong problem loses the day. This makes the framing half explicit and skippable, so `dx-plan` can jump straight to solution design.

**Guard.** Resolve `<id>` under `context/changes/` **or** `context/efforts/`. If it is missing, tell the user to run `/dx-new` first. If the path is under `context/archive/`, refuse — an archived container is done.

## 1 — Gather settled context

Read `change.md` (or `effort.md`) — note `type`. Read every existing `research/<topic>.md` and `diagnosis.md` if present as **settled context**; don't re-ask what research already answered. Read `foundation/glossary.md` for naming (a one-line habit — no section). Each artifact is a decision already made.

## 2 — Interview (invoke `dx-references` with `interview`)

**One question at a time, each with a recommended answer**, walking the decision tree until the framing resolves. If the codebase or a research doc can answer a question, explore instead of asking. Scale the count down by whatever upstream already settled. Stay on the **WHAT** — the real problem and the alternatives — never solution design; that is `dx-plan`'s job. Don't manufacture a reframe: "the initial framing was right" is a valid outcome.

If `change.md`'s `type` is `refactor` (or this is a refactor effort), **also invoke `dx-references` with `module-design`** and frame in its vocabulary — deep vs shallow modules, seams, the deletion test.

## 3 — Write `frame.md`

Write it in the container's folder (`context/changes/<id>/frame.md` or `context/efforts/<id>/frame.md`), capturing:

- **The real problem** — one sentence, root not surface.
- **Who / what it affects** — the users, systems, or code touched.
- **Alternatives considered** — the framings weighed, and why the chosen one wins.
- **Out of scope** — what this explicitly does not address.

Keep it tight and scannable. No solution phases, no file changes — that is planning.

## Done when

`frame.md` exists with those four sections; the container's `updated: <today>` is set. Then print and stop:

```
Frame written: context/{changes|efforts}/<id>/frame.md
Next: /dx-plan <id>       (for a change)
  or: /dx-roadmap <id>    (for an effort)
```

Stop. Do not chain into another skill.
