# Review report — shared by `plan-review`, `impl-review`, `review-triage`

A review report (`plan-review.md` or `impl-review.md`, under `context/changes/<change-id>/reviews/`) is **one file, always overwritten** — no date in the name. A re-review reflects the plan/code as it stands now; findings from a superseded review would just be noise. Findings are the file's only unit of state, tracked the same way `## Progress` tracks phases: no sidecar file, resume by re-scanning.

## Finding format

```
### F1 — <one-line title> [<tag>]
- **Location:** <plan section/phase, or file:line>
- **Detail:** <what's wrong, with evidence>
- **Fix:** <recommended fix>
- **Resolution:** PENDING
```

`<tag>` is `Blocker`/`Consider` in `plan-review.md`, the dimension name (e.g. `Plan-Drift`, `Safety`, `Patterns`, `Standards`) in `impl-review.md`.

## Rules

- IDs are stable and sequential (F1, F2, …) in document order. Never renumber, delete, or reorder a finding once written.
- `Resolution` starts `PENDING`. Only `/dx-review-triage` ever rewrites it — to `FIXED`, `SKIPPED`, `ACCEPTED — <reason>`, or `DISMISSED` — and touches no other field on that finding.
- Resume = the first finding with `Resolution: PENDING`, document order — identical to `## Progress`'s "first `- [ ]`" rule.
- Before overwriting an existing report with a fresh review, check it for any `Resolution: PENDING` finding. If any exist, say how many and confirm first — those haven't been triaged yet and a silent overwrite would lose them.
- One code or plan edit can resolve more than one finding (e.g. wiring a missing call site closes both a Plan-Drift finding and the Safety finding it caused). Mark each affected finding `FIXED`, pointing at the same underlying change — don't force a redundant second edit or commit just to keep a 1:1 mapping between findings and edits.
- Never commit the report file itself. Only `/dx-review-triage`'s applied *code* fixes get committed — the report, like `plan.md`, is working state the user commits on their own schedule (docs-vs-work separation).

## Per-report specifics

- **`plan-review.md`** closes with a single top-level verdict line: **sound** / **revise** / **rethink**.
- **`impl-review.md`** opens with a per-dimension verdict block, before the findings:
  ```
  ## Verdicts
  - Plan-Drift: PASS/WARNING/FAIL
  - Safety: PASS/WARNING/FAIL
  - Patterns: PASS/WARNING/FAIL
  - Standards: PASS/WARNING/FAIL
  ```
  If `context/standards/` doesn't exist yet (nothing to match against), don't mark Standards `PASS` — that would misreport an unchecked dimension as a clean one. Mark it `N/A` and add a low-priority `Consider` finding suggesting `/dx-standards-discover`.
