---
name: dx-impl-review
description: Review a finished change against its plan — drift, safety, patterns, standards compliance — and report.
disable-model-invocation: true
argument-hint: [change-id]
---

# dx-impl-review

The post-implementation gate. Compare what was built against `context/changes/<change-id>/plan.md` and **report** — this skill reviews, it never fixes-and-hides the code it is checking. Findings land in a review file and on screen; the user decides what to do.

**Guard.** Resolve `<change-id>` under `context/changes/`. Missing → tell the user to run `/dx-new`. Under `context/archive/` → refuse; an archived change is done. If `plan.md`'s `## Progress` still has a `- [ ]`, the change isn't finished — say so and point at `/dx-implement <change-id>`.

## 1 — Load
Read `plan.md` fully (note `change.md`'s `type`), its **Standards to apply** checklist and **Priors & gotchas**, and `foundation/glossary.md` (a one-line habit — review naming against the project's terms). Get the diff scope: `git log`/`git diff` for the commits that landed this change's phases. Then invoke `dx-references` with `knowledge-layer` (how to verify standards compliance), with `review-report` (the finding-ID/`Resolution` schema and file convention shared with `plan-review` and `review-triage`), and — when `type: refactor` — also with `module-design` (depth/seam/deletion vocabulary for the pattern axis).

## 2 — Review on four dimensions
Fan out to built-in `Explore`/`general-purpose` subagents to keep the main context clean — e.g. one for drift, one for safety + standards. Each reads only the files it needs; don't pre-load 20 files here.

1. **Plan-drift** — was what's in the diff what `plan.md` planned? Flag intent mismatches, skipped items, and unplanned scope (extra files/behavior not in the plan).
2. **Safety** — data loss, destructive/irreversible ops, missing error handling at boundaries, hardcoded secrets, injection.
3. **Patterns** — sound structure judged with the `module-design` vocabulary (deep vs shallow, clean seams, does the interface leak?). Report substantive mismatches with sibling code, not style nits.
4. **Standards compliance** — did it follow the plan's matched **Standards to apply**? Cite the standard for each miss.

**Refactor gate (`type: refactor`).** Additionally verify the behavior-preserving gate: tests green **before and after**, observable behavior unchanged, and depth/locality/testability actually improved (not just "looks cleaner").

## 3 — Write and report
Write findings to `context/changes/<change-id>/reviews/impl-review.md` per the `review-report` reference's file convention. Open with the per-dimension **Verdicts** block the reference specifies (PASS/WARNING/FAIL, or `N/A` for a dimension with nothing to check — e.g. Standards when `context/standards/` doesn't exist yet; add a low-priority `Consider` finding pointing at `/dx-standards-discover` in that case rather than silently marking it PASS). Then each finding via the reference's format, tagged with its dimension. Print the same to screen. Be specific; skip style preferences that don't matter.

## 4 — Offer a lesson (don't auto-write)
If a finding is **recurring or non-obvious** — the kind a future change would trip on again — offer to capture it via `/dx-lesson`. Show the proposed one-liner; let the user confirm. Never append to `foundation/lessons.md` yourself.

## Done when
The review file exists and its findings are printed. If the change passes (no unresolved critical finding), set `change.md` `status: reviewed`, `updated: <today>`. Then print one line and stop — do not chain, do not fix:

```
Review written: context/changes/<change-id>/reviews/impl-review.md
Next: /dx-review-triage <change-id> impl   — triage findings and apply fixes
  or: /dx-lesson                           # a finding worth recording — offered above
  or: /dx-archive <change-id>              # passed — retire the change
```
