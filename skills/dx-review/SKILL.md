---
name: dx-review
description: Run a review defined by a Policy in context/workflow/review-policies/ on a change or effort, and report.
disable-model-invocation: true
argument-hint: "<policy-id> [container-id] [instructions…]"
---

# dx-review

Run one review. The **Policy** at `context/workflow/review-policies/<policy-id>.md` holds the criteria: its preconditions, what to load, the dimensions and extra checks, what a pass sets, and the next steps. This skill holds the mechanism and applies the Policy as written. **Report only:** never edit what you're reviewing. Fixes belong to `/dx-review-triage`.

**Guard.**
- **Policy.** If `context/workflow/review-policies/` is missing, point at `/dx-init`. A policy ID is the name of any `.md` there that doesn't end in `-template.md`. If the ID is unknown, name it and list the available IDs. If the Policy's `targets` is missing or isn't one of `container | explore | both`, refuse and name the field.
- **Target.** The second argument counts as a container only if it resolves to `context/changes/<id>/` or `context/efforts/<id>/`. Otherwise it and everything after it are custom instructions. If it resolves under `context/archive/` instead, refuse: archived work is done. With no container, refuse, naming the Policy and the targets it accepts. Repo and folder (Explore) runs are not available yet, and if the second argument looked like an ID, say it didn't resolve.
- **Preconditions.** Check every precondition the Policy lists. A failing precondition refuses the run with the next command it names.

## 1 — Load
Load what the Policy's `## Load` names, with each conditional load gated on its trigger. Also load `context/workflow/review-policies/report-template.md` (missing → `/dx-init`) and `foundation/glossary.md`. The glossary is a one-line habit: judge naming against the project's terms, and if the work's naming clashes with it or settles a term, invoke `dx-domain`. Custom instructions narrow or steer the run, but they never skip a precondition, and a dimension they leave unchecked is reported `N/A`, not `PASS`.

## 2 — Review
Fan out to built-in `Explore`/`general-purpose` subagents so the main context stays clean, for example one per dimension or pair of dimensions. Give each one the Policy's text for its dimensions and let it read only the files it needs. Run the Policy's `## Extra checks` too.

If any dimension turns up a regression (behavior that used to work and now doesn't), don't just log it as a finding: invoke `dx-diagnose` on it directly.

## 3 — Write and report
Write the report to `reviews/<policy-id>.md` in the container, following the report template, with one Verdicts line per Policy dimension and findings tagged the way the Policy declares. Follow the template's overwrite rule: if the existing report still holds `PENDING` findings, confirm before overwriting it. Print the verdicts and findings to screen. If the run passes as the Policy's `## On pass` defines, do what that section says.

## 4 — Offer a lesson (don't auto-write)
If a finding is **recurring or non-obvious**, the kind a future change would trip on again, offer to capture it via `/dx-lesson`. Show the proposed one-liner and let the user confirm. Never append to `foundation/lessons.md` yourself.

## Done when
The report exists, its findings are printed, and any `## On pass` effect is applied. Print the following and stop. Do not chain, and do not fix:

```
Review written: context/<changes|efforts>/<container-id>/reviews/<policy-id>.md
Next: /dx-review-triage <container-id> <policy-id>   — triage findings and apply fixes
  or: <each line of the Policy's ## Next>
```
