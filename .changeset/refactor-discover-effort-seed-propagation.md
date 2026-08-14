---
"dx-workflow": minor
---

Fix the propagation hop from `dx-refactor-discover`'s promote-many seed summary into `dx-new`.
`dx-new` now recognizes an argument opening with `## Refactor opportunities (from
/dx-refactor-discover)` as a multi-finding effort seed rather than a short idea to slugify: it derives
the effort slug from the seed's `Start with:` line, writes `effort.md` with a `## Notes` marker
(`Refactor effort — findings promoted from /dx-refactor-discover.`), and writes one
`research/<topic>.md` per promoted finding — provenance frontmatter plus that finding's full entry,
including its `Sketch:` line when `dx-refactor-discover`'s design-it-twice step ran for it. `dx-roadmap`
needs no edit of its own — it already decomposes "every `research/<topic>.md`" into one slice per
finding. `dx-new <effort-id> <slice-n>` now reads the concrete `## Notes` marker to stamp `type:
refactor` on each child instead of defaulting to `feature`.
