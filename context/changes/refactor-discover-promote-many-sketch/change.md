---
change_id: refactor-discover-promote-many-sketch
title: Loop Design it twice through dx-refactor-discover's multi-promote path
type: feature
effort: null
slice: null
status: implementing
created: 2026-08-14
updated: 2026-08-14
archived_at: null
---

## Notes

`dx-refactor-discover` §4 ("Design it twice") is written to fire once, "after the pick" — singular.
When the user promotes **multiple** findings at once, the flow goes straight from §3 to §5's "Many"
case and §4 never runs for any of them, even though §5's own bullet text already expects a per-finding
sketch ("plus the chosen sketch for any finding §4 explored"). The data shape anticipates it; nothing
loops the offer to produce it.

Confirmed via `/dx-brainstorm`, direction chosen: **loop it in `dx-refactor-discover`**, not extract
the sub-agent exploration into a shared reference `dx-plan` could also use. The prior change
(`context/archive/2026-08-13-refactor-discover-principles/`) deliberately kept that machinery
single-consumer ("Not a second reference: one consumer, so it stays inline per the ≥2 rule... the
other four consumers load no sub-agent machinery") — this change doesn't reopen that.

Two things have to land together, since neither is useful alone (bundling test: no):

1. **Loop the §4 offer for a multi-select promote** — before composing the §5 "Many" seed summary,
   offer the exploration per finding (or as a batch pick across the selected findings), not just for
   a single pick.
2. **Verify/fix the propagation hop** — the seed summary (with any chosen sketches) is printed as the
   literal argument to `/dx-new "<seed summary>"`, which creates an **effort**. `dx-new`'s "Promoted
   entries" section only describes seeding *the new change's folder* for a single promotion; it says
   nothing about persisting seed research at the **effort** level for `dx-roadmap` to read, or about
   routing one specific finding's sketch to the one slice/child change it belongs to (not the whole
   multi-finding blob) when `dx-new <effort-id> <slice-n>` creates each child. Trace what the
   single-promotion path already does in `dx-new` and mirror that shape rather than inventing new
   mechanics.

**Explicitly not changing:** `dx-plan`'s reference loading. `skills/dx-plan/SKILL.md:48` already loads
`design-lenses` unconditionally and `:56` already loads `module-design` on `type: refactor` — this
shipped in PR #12 (`74c8592`) and is already correct on `main`.

**Design risk to plan against:** an unbounded multi-select could ask §4 to spawn 3–4 sub-agents *per
finding* in parallel — needs a safeguard (sequential-per-finding, a cap, or an explicit
skip-some/explore-some choice) so a large promote-many batch doesn't fan out uncontrolled.

Scope touches: `skills/dx-refactor-discover/SKILL.md` (§3/§4/§5), `skills/dx-new/SKILL.md`
("Promoted entries" / effort creation), possibly `skills/dx-roadmap/SKILL.md` if slice-to-finding
routing needs an explicit hook there, `DESIGN.md` §9 if the handoff description changes, `docs/`
per the sync rule, plus a changeset per phase touching `skills/**`.
