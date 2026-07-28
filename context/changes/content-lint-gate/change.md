---
change_id: content-lint-gate
title: Content lint gate for skills/dx-*
type: feature
effort: sdlc-hardening
slice: 1
status: implementing
created: 2026-07-28
updated: 2026-07-28
archived_at: null
---

## Notes
Slice 1 of the `sdlc-hardening` effort. Mechanically enforce the authoring rules in `CLAUDE.md`'s "Authoring rules" section over `skills/dx-*`: frontmatter shape, description quoting (no unquoted `": "` in YAML descriptions), body size budget, `dx-references` topic-pointer resolution, and docs-sync against `docs/reference/skills.md`.

No CI or lint infra exists yet in this repo — this is the highest-effort, most novel slice, and its checks guard every doc/reference edit that follows it in the effort.

Inherits research/frame from `sdlc-hardening` effort (none yet present — effort is still at `scoped`, research/frame optional).
