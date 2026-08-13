---
change_id: refactor-discover-principles
title: Broaden dx-refactor-discover beyond deep modules to general design principles
type: feature
effort: null
slice: null
status: archived
created: 2026-08-13
updated: 2026-08-13
archived_at: 2026-08-13
---

## Notes

`dx-refactor-discover` currently hunts for one thing only: shallow modules to deepen. Its whole
vocabulary comes from the `module-design` reference (deep vs shallow, seam, deletion test), so
findings outside that lens go unnamed and unfound.

Extend the scan to the broader body of design practice the user named: SOLID, KISS, YAGNI,
separation of concerns, single responsibility, bounded contexts, encapsulation, DRY, minimise
coupling, composition over inheritance, robustness principle, orthogonality.

Constraint carried from the request: **token-efficient and accurate**. These are pretrained
concepts — the skill should recruit them by name, not re-teach them. Loading a taxonomy of twelve
principles into every run would violate the house anti-ceremony rule and dilute accuracy. Open
question for framing/planning: how much (if any) of this belongs in a shared reference vs. named
inline in the skill, and whether `module-design` stays the primary lens with the rest as a
secondary sweep.

Scope touches: `skills/dx-refactor-discover/SKILL.md`, possibly
`skills/dx-references/references/module-design.md` (or a new sibling reference), `docs/` per the
sync rule, plus a changeset.
