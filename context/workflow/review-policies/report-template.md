# Report template — the shape of a review report

A container run of `/dx-review <policy-id> <container-id>` writes its report to `context/{changes|efforts}/<container-id>/reviews/<policy-id>.md`. The policy ID and the container ID are enough to find it, so the report has no frontmatter and no date in its name. `/dx-review-triage <container-id> <policy-id>` reads it.

**One file per Policy, overwritten on every re-run.** A re-review reflects the work as it stands now, and findings from a superseded review would only be noise. Findings are the file's only unit of state, tracked the way `## Progress` tracks phases: there is no sidecar file, and a resume re-scans the file.

## Shape

```markdown
# Review: <policy-id> — <container-id>

## Verdicts
- <Dimension>: PASS | WARNING | FAIL | N/A
  (one line per dimension the Policy declares, in its order)

## Findings

### F1 — <one-line title> [<tag>]
- **Location:** <plan section/phase, or file:line>
- **Detail:** <what's wrong, with evidence>
- **Why it matters:** <the concrete impact if left unaddressed>
- **Fix:** <recommended fix>
- **Resolution:** PENDING
```

- `<tag>` takes the form the Policy's `## Dimensions` declares, e.g. `Safety: Blocker`. Severity is `Blocker` or `Consider`.
- Mark a dimension `N/A` when there was nothing to check. Never report an unchecked dimension as `PASS`, because that misreports it as clean.
- With no findings, write `None.` under `## Findings`.

## Rules

- IDs are stable and sequential (F1, F2, …) in document order. Once a finding is written, it is never renumbered, deleted or reordered.
- `Resolution` starts as `PENDING`. Only `/dx-review-triage` rewrites it, to `FIXED`, `SKIPPED`, `ACCEPTED — <reason>` or `DISMISSED`, and it touches no other field on that finding.
- Resume at the first finding with `Resolution: PENDING`, in document order. This is the same rule as the first `- [ ]` in `## Progress`.
- Before a fresh review overwrites an existing report, check it for `Resolution: PENDING` findings. If there are any, say how many and confirm first: they haven't been triaged yet, and a silent overwrite would lose them.
- One edit can resolve more than one finding. Mark each finding it resolves `FIXED`, pointing at the same change, rather than forcing a redundant second edit or commit.
- Never commit the report itself. It is working state, like `plan.md`, and the user commits it on their own schedule. Only the code fixes `/dx-review-triage` applies get committed.
