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

## 2 — Draft candidate slices

Decompose the goal into candidate slices — don't order or write them yet, just name and scope each:

- **Feature effort** — each slice cuts end-to-end through every layer it touches (schema → api → ui), narrow but complete. Not "all the schema, then all the api."
- **Refactor effort** (from `dx-refactor-discover`) — one slice per module deepening.
- For each candidate, note its dependencies: which other candidates (if any) it needs in place first.

Don't pad the count — a two-slice effort is fine. If it wants only one slice, it should have been a plain change; say so.

## 3 — Anchor interview (invoke `dx-references` with `interview`)

Dependency alone rarely picks a unique order — several candidates are often equally free to go first. Two questions settle the ties that matter; ask them one at a time, each with a recommendation, per the interview loop:

1. **Tie-break bias.** What should decide between equally-eligible slices: surface the riskiest assumption first, ship the smallest demoable thing first, or follow strict dependency order with no further bias? Ground the recommendation in `frame.md`'s alternatives/risks if present.
2. **Lead slice.** Among the candidates with no unmet dependency, which should ship first? Skip this question if only one candidate qualifies.

Skip either question outright if `frame.md` or `effort.md`'s `## Goal` already states the answer unambiguously — say what you inferred instead of asking.

## 4 — Order, confirm, then write

Topologically sort candidates by dependency, then use the tie-break bias to order same-eligibility slices, placing the chosen lead slice first among them. Show the resulting numbered list (name → one-line why-here) and ask the user to confirm before writing — proceed / reorder or edit (free text) / cancel.

Once confirmed, write `roadmap.md` in the `effort-md` shape (invoke `dx-references` with `effort-md`): each slice names exactly one child change id (the id `dx-new` will create, e.g. `payments-schema`, using glossary vocabulary), its one-line `why`, and a `next` line spelling out `` `/dx-new <effort-id> <slice-n>` `` verbatim so it can be copy-pasted straight from the file. Do **not** write a maintained checklist: effort progress is **derived** by scanning each child change for `archived_at`, never a hand-checked box. There is nothing to flip here.

Before printing the summary, sanity-check the written order: every slice's dependency appears earlier in the list, and the lead slice sits as early as its dependencies allow. Fix and rewrite if not.

## Done when

`roadmap.md` exists with an ordered list of vertical slices, each linked to one child change id; `effort.md` is set to `status: scoped` and `updated: <today>`. Then print and stop:

```
Roadmap written: context/efforts/<effort-id>/roadmap.md — <n> slices
Next: /dx-new <effort-id> 1   — create the first slice's child change (also in roadmap.md's Slice 1 `next` line)
```

Stop. Do not create the child changes and do not chain into another skill.
