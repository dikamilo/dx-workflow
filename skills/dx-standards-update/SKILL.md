---
name: dx-standards-update
description: Create, edit, or promote a standard in context/standards/ — from the conversation, a graduated lesson, or another project.
disable-model-invocation: true
argument-hint: [--from=PATH]
---

# dx-standards-update

Land a rule in the right `context/standards/<layer>/<topic>.md`. Standards are the rulebook — prescriptive, project-wide, stable, and **edited in place** (a catalog, not an append-only log). Read `foundation/glossary.md` for naming (a one-line habit — no section).

**Guard.** `context/standards/` must exist. If it is missing, tell the user to run `/dx-init` first.

## 1 — Get the rule (three entry points)

- **From the conversation** (no argument) — the user said "make this a standard." Lift the rule from what was just discussed; if it is fuzzy, ask one clarifying question, no more.
- **From a graduated lesson** — a `foundation/lessons.md` entry that has stopped being "this one time" and become "how we do it here." Read it and carry its rule forward.
- **From `--from=PATH`** — read the named file (e.g. a graduated lesson, or another project's `context/standards/…`) and take the rule from it.

## 2 — Load the contract (invoke `dx-references` with `knowledge-layer`)

Use it for the standards-vs-lessons distinction, the standard entry shape, and the promotion criteria — confirm this rule is *recurring and generalized*, not a one-off (a one-off stays a lesson).

## 3 — Place it: layer × topic

Pick the file by **layer** (`global` / `frontend` / `backend` / `testing`) × **topic** (the existing filename it belongs in, e.g. `coding-style.md`, `error-handling.md`). Prefer an existing file; create a new `<topic>.md` only when nothing fits.

## 4 — Edit in place

Append the rule or refine an existing entry — a `## <heading>` plus one to a few prescriptive lines ("do this"), matching the shape and tone of the neighbours. No preamble, no rationale essays. If you are **promoting** a lesson, add a one-line note to that `foundation/lessons.md` entry that it graduated (leave the entry — lessons are append-only).

## Done when

The rule lives in one `context/standards/` file, prescriptive and concise; any promoted lesson is marked graduated. Then print what changed and stop:

```
Standard updated: context/standards/<layer>/<topic>.md — <one-line what changed>
Next: /dx-plan <change-id>   — the checklist will now match this standard
```

Stop. Do not chain into another skill.
