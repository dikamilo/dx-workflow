# `change.md` — schema & lifecycle

A change is one shippable unit of work, living at `context/changes/<change-id>/`. `change.md` is its identity: minimal frontmatter + free-form notes. **Record-only** — status is written by skills, never enforced. Everything else is derived (`ls` for artifacts, `## Progress` for execution state).

## Frontmatter

```yaml
---
change_id: oauth-login        # kebab-case, matches folder name
title: Add Google sign-in
type: feature                 # feature | defect | refactor | migration
effort: null                  # parent effort-id, or null for a freeform change
slice: null                   # index within the effort roadmap, or null
status: new                   # see lifecycle below
created: 2026-07-01
updated: 2026-07-01
archived_at: null
---

## Notes
<free-form>
```

## `type` activates plan characteristics
The type is set at `dx-new` and read by `dx-plan` to activate conditional phases (see `plan-template`):
- `defect` → TDD gate (write the failing test first).
- `refactor` → behavior-preserving gate + load `module-design`.
- `migration` → rollback phase.
- `feature` → no extra characteristic.

## Lifecycle (record-only)
`new → planned → implementing → implemented → reviewed → archived`

Skills stamp the transition they cause; nothing blocks on it. A change may also carry optional siblings in its folder: `research/<topic>.md`, `frame.md`, `diagnosis.md` (when promoted from `dx-diagnose`), `brainstorm.md` (when created by `dx-brainstorm`), `plan.md` (owns `## Progress`), `reviews/`.

## Effort linkage
A change spawned from an effort sets `effort: <effort-id>` and `slice: <n>`, and **inherits the effort's `research/` and `frame.md`** — so it skips effort-level framing and jumps to its own plan (handoff scaling). No change ever nests inside another change.
