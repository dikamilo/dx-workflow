---
name: dx-review-triage
description: Triage findings from a plan-review or impl-review report and apply the fixes you choose.
disable-model-invocation: true
argument-hint: "[change-id] [plan|impl]"
---

# dx-review-triage

Turn a review report's findings into decisions — and, when you say so, into edits. `dx-plan-review` and `dx-impl-review` only analyze and report; this is the one place that **acts** on a finding, editing `plan.md` or the code it reviewed, one finding at a time, only on your confirmation. That split keeps both review gates pure: a reviewer that never fixes what it checks doesn't need to graduate into a tool-restricted agent.

**Guard.** Resolve `<change-id>` under `context/changes/`. `reviews/` must contain `plan-review.md` or `impl-review.md` — if the directory is missing or empty, point at `/dx-plan-review` or `/dx-impl-review` instead. If the path is under `context/archive/`, refuse: archived work is done.

## Load first
The `review-report` reference (invoke `dx-references` with `review-report`) — the finding-ID/`Resolution` schema, the resume rule, and the file conventions this skill reads and writes.

## 1 — Resolve which report

Each type has exactly one file — `reviews/plan-review.md` or `reviews/impl-review.md` — always the current review, since re-running `dx-plan-review`/`dx-impl-review` overwrites rather than dating a new file. A second argument names the type (`plan` or `impl`) directly. No argument: exactly one file present → use it; both present → ask which, since a plan-review and an impl-review can each carry open findings on the same change at once.

## 2 — Load what the fix touches

- **plan-review** → `plan.md` in full — this is what gets edited.
- **impl-review** → the same diff scope `dx-impl-review` used to review: `git log`/`git diff` for the commits that landed this change's phases, plus the specific files each pending finding names. Don't reload files findings you're skipping don't touch.

## 3 — Walk findings in order

Resume per the `review-report` reference: the first finding with `Resolution: PENDING`, document order. For each, show its title, location, detail, and suggested fix, then ask:

- **Fix now** — apply the suggested fix (or a variant you propose); show the before/after edit first, apply on confirmation.
- **Fix differently** — ask what they'd prefer instead, apply that.
- **Skip** — leave it for now, move on.
- **Accept risk** — leave it, record the one-line reason.
- **Record as lesson** — hand the finding's title and detail to `/dx-lesson`'s entry shape and tell the user to confirm there. Never append to `foundation/lessons.md` yourself — that file has exactly one writer.

Immediately rewrite that finding's `Resolution:` line in place per the reference's rules. If an edit you already applied for an earlier finding also resolves a later one (one fix closing both a Plan-Drift and the Safety finding it caused, say), mark the later finding `FIXED` too, pointing at the same edit — don't manufacture a redundant second edit or commit just to keep one fix per finding.

## 4 — Commit code fixes, not plan fixes, never the report

- **impl-review fixes** touch shipped code — commit each applied fix on its own, same Conventional Commit shape `dx-implement` uses: `fix(<change-id>): <finding title> (review)`.
- **plan-review fixes** touch `plan.md` only. `dx-plan` never commits the plan itself, so neither does this.
- **Never commit the report file itself** (`plan-review.md`/`impl-review.md`), in either case — it's working state like `plan.md`, not a deliverable; the user commits it on their own schedule.

## On disagreement

If applying a fix would contradict something the plan or a standard states elsewhere, stop and say so — don't silently pick a side.

## Done when

Every finding in the resolved report has a `Resolution:` other than `PENDING` — or you've stopped partway, which is fine, since re-running resumes from the next pending one. Print a one-line tally and stop, no auto-chain:

```
Triaged <report file>: <n> fixed, <n> skipped, <n> accepted, <n> dismissed
Next: /dx-plan-review <change-id>   or  /dx-implement <change-id>   (plan-review triaged)
  or: /dx-impl-review <change-id>   or  /dx-archive <change-id>     (impl-review triaged)
```
