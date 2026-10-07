---
name: dx-review
description: Run a review defined by a Policy in context/workflow/review-policies/ on a change or effort, and report.
disable-model-invocation: true
argument-hint: "<policy-id> [container-id | paths…] [instructions…]"
---

# dx-review

Run one review, on a container or as an **Explore run** over the repo or folders. The **Policy** at `context/workflow/review-policies/<policy-id>.md` holds the criteria: its preconditions, what to load, the dimensions and extra checks, what a pass sets, and the next steps. This skill holds the mechanism and applies the Policy as written. **Report only:** never edit what you're reviewing; an Explore run writes only a promoted Change's `change.md` and `research/`. Fixes belong to `/dx-review-triage`.

**Guard.**
- **Policy.** If `context/workflow/review-policies/` is missing, point at `/dx-init`. A policy ID is the name of any `.md` there that doesn't end in `-template.md`. If the ID is unknown, name it, list the available IDs, and note that re-running `/dx-init` seeds any built-in Policy the project is missing. If the Policy's `targets` is missing or isn't one of `container | explore | both`, refuse and name the field.
- **Arguments** resolve positionally: a container ID (`context/changes/<id>/` or `context/efforts/<id>/`), else the leading tokens that are existing repo paths, and the first token that is neither starts the custom instructions. A container ID under `context/archive/` is refused: archived work is done. A container plus a path is refused as ambiguous. No container and no paths is an **Explore run** over the whole repo.
- **Target.** `container` refuses an Explore run, `explore` refuses a container run, `both` accepts either; every refusal names the Policy and the targets it accepts. An Explore run on a Policy with no `## Candidates` is refused, naming the section.
- **Input acquisition.** An Explore run with no container and no paths asks what to review before reading anything. Print the interpreted scope before the fan-out.
- **Preconditions.** Check every precondition the Policy lists. A failing precondition refuses the run with the next command it names.

## 1 — Load
Load what the Policy's `## Load` names, with each conditional load gated on its trigger. Also load `context/workflow/review-policies/report-template.md` (missing → `/dx-init`) and `foundation/glossary.md`. The glossary is a one-line habit: judge naming against the project's terms, and if the work's naming clashes with it or settles a term, invoke `dx-domain`. Custom instructions narrow or steer the run, but they never skip a precondition, and a dimension they leave unchecked is reported `N/A`, not `PASS`.

## 2 — Review
Fan out to built-in `Explore`/`general-purpose` subagents so the main context stays clean, for example one per dimension or pair of dimensions. Give each one the Policy's text for its dimensions and let it read only the files it needs. Run the Policy's `## Extra checks` too.

If any dimension turns up a regression (behavior that used to work and now doesn't), don't just log it as a finding: invoke `dx-diagnose` on it directly.

**Questions.** If the Policy has `## Questions`, review in stages: scan, ask the `after: scan` gates that triggered as **one** confirm-or-edit round, then analyse, then ask the `after: analysis` gates the same way. Judge nothing a round `blocks:` until it is answered. A gate that can't be answered (unattended run, or the user says "skip") leaves the unit `unconfirmed`: report it with its assumption stated and **no verdict**, never a silent default. Custom instructions may pre-answer a gate.

**Explore run.** Let the paths that keep showing up in recent `git log --oneline` pull attention first, unless the Policy sets `recency: off`. Fan out one `Explore` per facet the Policy's `## Candidates` names (else per area). Read `foundation/lessons.md` and skip anything a prior run rejected. Produce one Candidate per broken rule, with a site count where it recurs, not one per site.

## 3 — Write and report
**Explore run.** Write no report and no `reviews/` file. Present a numbered, ranked list of Candidates, each with the Policy's entry fields and a strength tag (`Strong | Worth exploring | Speculative`), then the `Reviewed` list of every unit checked (including `OK` and `unconfirmed`), then a one-sentence **top pick**: the strength tag ranks confidence, not sequence. Ask one question: which to promote. Promoting **one** writes `context/changes/<slug>/change.md` (invoke `dx-references` with `change-md`; `type` is the Policy's default) and a seed `research/<topic>.md` with `kind: codebase` provenance frontmatter and the Candidate verbatim as the body. Rejecting one with a load-bearing reason offers `/dx-lesson`. Skip the rest of this section and §4.

**Container run.**
Write the report to `reviews/<policy-id>.md` in the container, following the report template, with one Verdicts line per Policy dimension and findings tagged the way the Policy declares. Follow the template's overwrite rule: if the existing report still holds `PENDING` findings, confirm before overwriting it. Print the verdicts and findings to screen. If the run passes as the Policy's `## On pass` defines, do what that section says. The exception is a run where custom instructions left a dimension unchecked: it has not passed the whole gate, so skip `## On pass` and say why.

## 4 — Offer a lesson or a standard update (don't auto-write)
Read `foundation/lessons.md`, then make at most one offer per finding:
- **It repeats an existing lesson.** That is the recurrence a standard needs, so offer to graduate that lesson via `/dx-standards-update` instead of adding a near-duplicate lesson.
- **It exposes a gap in a standard:** the standard is silent on a case its own rule plainly covers, or it contradicts what the project consistently does. Offer to amend that standard via `/dx-standards-update`.
- **Otherwise, if it is recurring or non-obvious,** the kind a future change would trip on again, offer to capture it via `/dx-lesson`. A single occurrence is not yet a rule.

Show the proposed one-liner and let the user confirm. Never write `foundation/lessons.md` or `context/standards/` yourself.

## Done when
**Explore run:** Candidates are presented and the user has chosen. Print and stop:

```
Promoted one: Change created: context/changes/<slug>/change.md   (type: <type>, seeded with the Candidate)
              Next: /dx-plan <slug>
Record a no:  /dx-lesson
```

**Container run:** The report exists, its findings are printed, and any `## On pass` effect is applied. Print the following and stop. Do not chain, and do not fix:

```
Review written: context/<changes|efforts>/<container-id>/reviews/<policy-id>.md
Next: /dx-review-triage <container-id> <policy-id>   — triage findings and apply fixes
  or: <each line of the Policy's ## Next>
```
