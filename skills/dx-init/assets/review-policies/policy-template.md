# Policy template — the shape every review Policy follows

A Policy defines one kind of review. `/dx-review` supplies the mechanism (resolving the Policy and the target, loading the glossary, fanning out to subagents, writing the report, offering a lesson, printing next steps). The Policy supplies the criteria: what must hold before the review runs, what it reads, what it checks, and what happens on a pass.

## Creating a Policy

- Copy this file to `context/workflow/review-policies/<policy-id>.md`. The file name is the policy ID, so `security.md` is run as `security`. Any `.md` here whose name ends in `-template.md` is not a Policy.
- Run it with `/dx-review <policy-id> [container-id | paths…] [instructions…]`, and triage a container report with `/dx-review-triage <container-id> <policy-id>`.
- You may edit a shipped Policy (such as `implementation.md`) in place. `/dx-init` copies only files that are missing, so it never overwrites your edits, and later fixes to a shipped Policy don't reach your copy either. To pick one up, compare your copy with the shipped one by hand.
- Nothing lints a Policy. This template is the only guardrail, so keep to its sections and headings.

## Frontmatter

```yaml
---
targets: container   # container | explore | both. Required.
---
```

- `container`: the review runs on a Change or an Effort, named by its ID (`context/changes/<id>/` or `context/efforts/<id>/`).
- `explore`: the review runs on the repo or on folders, with no container.
- `both`: the Policy accepts either kind of run.

A run on a target the Policy doesn't accept is refused. The refusal names the Policy and the targets it accepts. A missing or invalid `targets` value also refuses the run, naming the field.

**Output follows from the target and is never declared.** A container run always writes a report to `reviews/<policy-id>.md` in that container (see `report-template.md`). An Explore run shows its results inline as Candidates and writes no report, so a Policy that targets `explore` or `both` must carry `## Candidates`.

## Body

```markdown
<One line: what this review asks.>

## Preconditions
<What must already be true for the review to make sense. For each one: what to check, and the next command to name when it fails. A failing precondition refuses the run.>

## Load
<What to read before reviewing: container files, diff scope, and shared references (invoke `dx-references` with `<topic>`). Gate a conditional load on its trigger, e.g. "when `change.md` has `type: refactor`".>

## Dimensions
<The finding-tag form, e.g. `[<Dimension>: <Severity>]`.>

### <Dimension>
<What this dimension checks, and when it is `N/A` instead of `PASS`.>

## Extra checks
<Optional. Checks outside the dimensions, such as a gate that applies only to one change type. Findings from them carry the tag of the closest dimension.>

## Questions
<Optional. Gates the review asks the user mid-run. Each entry: the question text plus
- `after:` `scan` | `analysis` — the stage it fires at.
- `when:` the observation that triggers it.
- `blocks:` what cannot be judged until it is answered.
There is no `default:`. A gate that goes unanswered (unattended run, or the user says "skip") leaves the affected unit `unconfirmed`: reported with its assumption and no verdict. Absent means no gates.>

## Candidates
<Required for `targets: explore | both`; an Explore run is refused without it. What an Explore run presents:
- the entry fields of one Candidate (a list),
- `type:` default change type on promotion: `feature | defect | refactor | migration`; optional with `promote: off`,
- `facets:` optional fan-out hints,
- `recency: off` optional; the default is to let recent `git log` churn pull attention first,
- `promote: off` optional; the default is promotable. With it the run prints the ranked Candidates, the `Reviewed` list and the interpreted scope, then stops: no promote question, no rejection-memory read for promotion, no lesson offer.>

## On pass
<Optional. What a pass means (for example, no `Blocker` finding) and what to set when it happens.>

## Next
<Optional. `or:` lines printed after the triage line, each a command plus a short comment.>
```

Every dimension gets one line in the report's `## Verdicts`. A container run applies `## Questions` too. A section left out means that step does nothing. `## Preconditions`, `## Load` and `## Dimensions` are always present, even if a section only says "none".

## Custom instructions

Arguments resolve positionally: the container ID, else the leading tokens that are existing repo paths (the scope), and the first token that is neither starts the instructions. A container plus a path is refused as ambiguous. Instructions are e.g. `/dx-review implementation my-change focus on the migration`, and may pre-answer a `## Questions` gate. Instructions narrow or steer the run. They never skip a precondition or the target check, and a dimension they leave unchecked is reported `N/A`, not `PASS`. A run that leaves any dimension unchecked this way never applies `## On pass`.
