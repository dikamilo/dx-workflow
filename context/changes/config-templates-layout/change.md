---
change_id: config-templates-layout
title: Move context/workflow to context/config and split out templates
type: refactor
effort: policy-driven-review
slice: null
status: implementing
created: 2026-10-07
updated: 2026-10-07
archived_at: null
---

## Notes
Follow-up to the slices of `policy-driven-review`, not a roadmap slice. Behavior-preserving restructure:
- `context/workflow/` → `context/config/`.
- New `context/config/templates/` holds `review-policy.md` (was `policy-template.md`) and `review-report.md` (was `report-template.md`); `review-policies/` keeps only policies. More templates will land there later.
- Mirror in `skills/dx-init` assets, then update skills, `DESIGN.md`, docs and changesets.
- No migration for existing installs (decided 2026-10-07).
