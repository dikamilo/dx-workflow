# Review report — shared by `plan-review`, `review-triage`

> Transitional: covers only `dx-plan-review`'s `plan-review.md`. Policy-driven reports (`/dx-review`) follow `context/workflow/review-policies/report-template.md` instead. This reference is removed along with `dx-plan-review` in slice 2 of `policy-driven-review`.

A plan review report (`plan-review.md`, under `context/changes/<change-id>/reviews/`) is **one file, always overwritten** — no date in the name. A re-review reflects the plan as it stands now; findings from a superseded review would just be noise. Findings are the file's only unit of state, tracked the same way `## Progress` tracks phases: no sidecar file, resume by re-scanning.

## Finding format

```
### F1 — <one-line title> [<tag>]
- **Location:** <plan section/phase>
- **Detail:** <what's wrong, with evidence>
- **Why it matters:** <the concrete impact if left unaddressed>
- **Fix:** <recommended fix>
- **Resolution:** PENDING
```

`<tag>` is the bare severity, `Blocker` or `Consider`.

## Rules

- IDs are stable and sequential (F1, F2, …) in document order. Never renumber, delete, or reorder a finding once written.
- `Resolution` starts `PENDING`. Only `/dx-review-triage` ever rewrites it — to `FIXED`, `SKIPPED`, `ACCEPTED — <reason>`, or `DISMISSED` — and touches no other field on that finding.
- Resume = the first finding with `Resolution: PENDING`, document order — identical to `## Progress`'s "first `- [ ]`" rule.
- Before overwriting an existing report with a fresh review, check it for any `Resolution: PENDING` finding. If any exist, say how many and confirm first — those haven't been triaged yet and a silent overwrite would lose them.
- One plan edit can resolve more than one finding. Mark each affected finding `FIXED`, pointing at the same underlying change — don't force a redundant second edit just to keep a 1:1 mapping between findings and edits.
- Never commit the report file itself. The report, like `plan.md`, is working state the user commits on their own schedule (docs-vs-work separation).

## Verdict

`plan-review.md` closes with a single top-level verdict line: **sound** / **revise** / **rethink**.
