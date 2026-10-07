---
"dx-workflow": minor
---

`context/workflow/` is now `context/config/`, and the two templates moved out of `review-policies/` into `context/config/templates/`, renamed `review-policy.md` (was `policy-template.md`) and `review-report.md` (was `report-template.md`). `review-policies/` now holds only Policies, so the rule that a `.md` ending in `-template.md` is not a Policy is removed: every `.md` there is a Policy. `/dx-init` seeds `context/config/{review-policies,templates}/` (missing files only), and `/dx-review` and `/dx-review-triage` read from the new paths. Existing projects: re-run `/dx-init` to get the new tree, then delete the old `context/workflow/` by hand — nothing is migrated, so your edited Policies are not copied over; move them into `context/config/review-policies/` yourself.
