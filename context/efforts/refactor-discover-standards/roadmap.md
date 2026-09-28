# Roadmap — refactor-discover-standards

Tie-break bias: riskiest assumption first. Lead slice: the standards lens.

## Roadmap
> A slice is **done** when its child change is archived (`archived_at` set) — derived by scanning the child, never a hand-checked box.

### Slice 1: Standards lens
- change: refactor-discover-standards-lens
- why: Carries the riskiest assumption (a flood of Candidates vs a short, useful list) and loads the in-scope standards that slice 2 amends. Run the frame's cheap test before planning it: today's skill on one real area, with a building-blocks-style standard passed by hand.
- next: `/dx-new refactor-discover-standards 1`

### Slice 2: Standard Proposals
- change: refactor-discover-standard-proposals
- why: Builds on slice 1's standard loading for amendments (case 6) and on the full Candidate set, lens and standard-driven, to spot a shared cause no rule covers.
- next: `/dx-new refactor-discover-standards 2`
