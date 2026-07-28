# `effort.md` + `roadmap.md` — schema & shape

An effort is a larger body of work that *produces* changes. It lives at `context/efforts/<effort-id>/` and is **one level above** the change — never nested inside one. It owns shared upstream artifacts (`research/`, `frame.md`, and `brainstorm.md` when created by `dx-brainstorm`) that its child changes inherit, and a `roadmap.md` that decomposes it into slices.

## `effort.md`

```yaml
---
effort_id: payments-v2
title: Rebuild payments flow
status: new                   # new → scoped → in-progress → done → archived
created: 2026-07-01
updated: 2026-07-01
archived_at: null
---

## Goal
<one paragraph — what success looks like for the whole effort>

## Notes
<free-form>
```

## `roadmap.md`

An ordered list of slices; each links to exactly one child change.

```markdown
## Roadmap
> A slice is **done** when its child change is archived (`archived_at` set) —
> derived by scanning the child, never a hand-checked box.

### Slice 1: <name>          # feature effort: end-to-end tracer (schema → api → ui)
- change: payments-schema
- why: <one line — dependency or sequencing reason this slice sits here>
- next: `/dx-new payments-v2 1`
### Slice 2: <name>          # refactor effort: one slice = one module deepening
- change: payments-api
- why: <one line>
- next: `/dx-new payments-v2 2`
```

`next` is just `/dx-new <effort-id> <slice-n>` spelled out per slice — copy-pasteable, not a new decision.

- **Feature efforts** use vertical slices — each a tracer bullet, end-to-end and demoable, not a horizontal layer.
- **Refactor efforts** (from `dx-refactor-discover`) use one slice per module deepening.

## Progress is derived, never maintained
Effort progress = for each slice, read its linked child change and count those with `archived_at` set. Done = every child change archived. There is no checkbox to flip.

## Child changes
`dx-new <effort> <slice>` creates a child change with `effort:`/`slice:` set. The child inherits the effort's `research/` + `frame.md` and jumps straight to its own `plan.md`.
