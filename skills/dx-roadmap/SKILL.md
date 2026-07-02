---
name: dx-roadmap
description: Decompose an effort into an ordered list of vertical slices and write roadmap.md.
disable-model-invocation: true
argument-hint: [effort-id]
---

# dx-roadmap

Turn a researched, framed effort into an ordered sequence of **vertical slices** at `context/efforts/<effort-id>/roadmap.md`. Each slice is a tracer bullet — end-to-end and demoable, not a horizontal layer — and maps to exactly one child change. This skill decomposes; it does **not** create the child changes (that is `dx-new`).

**Guard.** Resolve `<effort-id>` under `context/efforts/`. If it is missing, tell the user to run `/dx-new` first. If the path is under `context/archive/`, refuse — an archived effort is done. If `roadmap.md` already exists, show it and ask before overwriting.

## 1 — Gather what upstream settled

Read `effort.md` (note its `## Goal`). Then read the effort's shared upstream as context: every `research/<topic>.md` and `frame.md` if present. Read `foundation/glossary.md` for naming (a one-line habit — no section). These are decisions already made; slice within them, don't re-litigate them.

## 2 — Slice into tracer bullets (invoke `dx-references` with `effort-md`)

Follow that reference's `roadmap.md` shape. Decompose the goal into the **smallest ordered set** of slices that each ships something demoable:

- **Feature effort** — each slice cuts end-to-end through every layer it touches (schema → api → ui), narrow but complete. Not "all the schema, then all the api."
- **Refactor effort** (from `dx-refactor-discover`) — one slice per module deepening.
- Order by dependency: the earliest slice a later one needs comes first. Prefer a thin walking-skeleton slice first.

Don't pad the count — a two-slice effort is fine. If it wants only one slice, it should have been a plain change; say so.

## 3 — Write `roadmap.md`

Write the ordered slices in the `effort-md` shape, each naming exactly one child change id (the id `dx-new` will create — e.g. `payments-schema`, using glossary vocabulary). Do **not** write a maintained checklist: effort progress is **derived** by scanning each child change for `archived_at`, never a hand-checked box. There is nothing to flip here.

## Done when

`roadmap.md` exists with an ordered list of vertical slices, each linked to one child change id; `effort.md` is set to `status: scoped` and `updated: <today>`. Then print and stop:

```
Roadmap written: context/efforts/<effort-id>/roadmap.md — <n> slices
Next: /dx-new <effort-id> 1   — create the first slice's child change
```

Stop. Do not create the child changes and do not chain into another skill.
