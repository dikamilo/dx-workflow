---
name: dx-review-triage
description: Triage findings from a review report and apply the fixes you choose.
disable-model-invocation: true
argument-hint: "<container-id> [policy-id]"
---

# dx-review-triage

Turn a review report's findings into decisions — and, when you say so, into edits. Every review (`dx-review`) only analyzes and reports; this is the one place that **acts** on a finding, one finding at a time, only on your confirmation.

**Guard.** Resolve `<container-id>` under `context/changes/` or `context/efforts/`. If it resolves under `context/archive/` instead, refuse: archived work is done. If `reviews/` is missing or holds no report, point at `/dx-review <policy-id> <container-id>`.

## 1 — Resolve which report

A report lives at `reviews/<policy-id>.md`, one per Policy, always the current review because a re-run overwrites it.
- **A policy ID given** → `reviews/<policy-id>.md`. If the file is missing, name it and list the reports that exist.
- **No policy ID** → exactly one report → use it; several → ask which, since each can carry open findings at once.

A legacy `reviews/impl-review.md` or `reviews/plan-review.md` is never read and doesn't count as a report: if one is all there is, say it's superseded and point at `/dx-review implementation <container-id>` or `/dx-review plan <container-id>` respectively.

## Load first
The report's schema — the finding/`Resolution` format, the resume rule, the never-commit rule — is `context/config/templates/review-report.md` (missing → `/dx-init`).

## 2 — Walk findings in order

Resume at the first finding with `Resolution: PENDING`, document order. Load what that finding's **Location** names — a plan section → `plan.md`; a `file:line` → that file plus enough surrounding code or `git log` to judge the fix — and nothing for findings you skip. Show its title, location, detail, and suggested fix, then ask:

- **Fix now** — apply the suggested fix (or a variant you propose); show the before/after edit first, apply on confirmation.
- **Fix differently** — ask what they'd prefer instead, apply that.
- **Skip** — leave it for now, move on.
- **Accept risk** — leave it, record the one-line reason.
- **Record as lesson** — hand the finding's title and detail to `/dx-lesson`'s entry shape and tell the user to confirm there. Never append to `foundation/lessons.md` yourself — that file has exactly one writer.

Immediately rewrite that finding's `Resolution:` line in place per the schema. If an edit you already applied for an earlier finding also resolves a later one, mark the later finding `FIXED` too, pointing at the same edit — don't manufacture a redundant second edit or commit.

## 3 — Commit what the fix touched, never the report

Decide per applied fix, from the files it changed:
- **Touched files outside `context/`** (shipped code, docs, config) → commit that fix on its own, the Conventional Commit shape `dx-implement` uses: `fix(<container-id>): <finding title> (review)`. Stage only those files.
- **Touched only `context/` artifacts** (`plan.md`, `frame.md`, …) → don't commit. Those are working state the user commits on their own schedule.
- **The report itself** is never committed.

## On disagreement

If applying a fix would contradict something the plan or a standard states elsewhere, stop and say so — don't silently pick a side.

## Done when

Every finding in the resolved report has a `Resolution:` other than `PENDING` — or you've stopped partway, which is fine, since re-running resumes from the next pending one. Print a one-line tally and stop, no auto-chain:

```
Triaged <report file>: <n> fixed, <n> skipped, <n> accepted, <n> dismissed
Next: /dx-review <policy-id> <container-id>   — re-review after fixes
  or: <each line of the Policy's ## Next>
```
