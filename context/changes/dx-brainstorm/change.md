---
change_id: dx-brainstorm
title: dx-brainstorm entry point
type: feature
effort: sdlc-hardening
slice: 6
status: implementing
created: 2026-07-28
updated: 2026-07-28
archived_at: null
---

## Notes
Slice 6 of the `sdlc-hardening` effort — a new pre-container entry point that runs *before* `dx-new`: questions whether the problem is real, weighs alternatives, and makes "decide not to build" a first-class outcome. Optional; small/clear work can still skip straight to `dx-new`.

User-supplied design considerations to carry into research/frame:
- Design how the skill integrates with the existing `context/` workflow directory conventions (identity files, derive-don't-maintain).
- `dx-diagnose` and `dx-refactor-discover` are existing discovery-phase skills that run before `dx-new` and hand off a finding. `dx-diagnose` produces a `diagnosis.md` artifact that `dx-new` promotes into a change's seed research (see `dx-new`'s "Promoted entries" section).
- `dx-brainstorm` likely needs an analogous artifact — a brainstorm output file that `dx-new` (or the user) can promote into a change's or effort's seed research, depending on whether the brainstorm's conclusion becomes a change or an effort.
- Open question for research/frame: what does that artifact look like (shape, filename, where it lives before a container exists), and how does `dx-new`'s "Promoted entries" section need to change to recognize it alongside `diagnosis.md` / refactor findings.
