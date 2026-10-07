# Review a folder with test-strategy

In this tutorial you will run the built-in `test-strategy` review over a folder with no change involved, answer the questions it asks, and promote one of its Candidates into a real change. By the end you will have a `changes/<slug>/change.md` seeded with the Candidate, and you will have seen the other branches: promoting several Candidates, skipping a gate, and recording a rejection. You won't write a Policy: `/dx-init` already seeded this one.

`test-strategy` asks whether the testing strategy matches the problem class of the code under test. A pure calculation is best tested by its output, a stateful object by the state it ends in, and an orchestrator by the calls it makes to the outside world. A mismatch costs you regression protection or test stability.

## Prerequisites

- A project where `/dx-init` has run and `context/workflow/review-policies/test-strategy.md` exists. If it doesn't (a project seeded before this Policy), re-run `/dx-init`: it adds missing files and overwrites nothing. Your copies of `policy-template.md` and `report-template.md` are not refreshed, so compare them with the shipped ones by hand.
- A folder with tests in it. This tutorial uses `src/billing`, which holds a `price.ts` calculation, an `Invoice` class and their tests.
- Familiarity with [review and triage](./review-and-triage.md) helps but isn't required: an Explore run has no report to triage.

## Step 1 — Run it on a folder

```text
/dx-review test-strategy src/billing
```

Arguments resolve left to right. The second token is tried as a container ID, then the leading tokens that are existing paths become the scope, and the first token that is neither starts your instructions. Here `src/billing` is a path, so there is no container and this is an **Explore run**.

> **dx-review** reads `targets: both` in `test-strategy.md`, so it accepts a folder as well as a change. It prints the interpreted scope before doing anything else:
>
> ```text
> Scope: src/billing (no container, no instructions)
> ```
>
> It lets the paths that keep showing up in recent `git log` pull its attention first, then scans the tests and pairs each with the code it exercises.

Had you typed `/dx-review test-strategy` alone, it would ask what to review before reading anything, instead of assuming the whole repo. Had you typed a change ID and a path together, it would refuse the run as ambiguous.

## Step 2 — Answer the classification round

Before it compares any strategy, the Policy's first gate fires, tied to what the scan observed.

> **dx-review** asks, as one round:
>
> ```text
> I classify:
> 1. price.ts — Transformation (pure function, no state, no I/O)
> 2. Invoice — Stateful Object (identity, guards a "paid invoices are immutable" invariant, mutated by pay() and void())
> Does this match your understanding? yes / no, more like X because… / a mix
> ```

Nothing in these units is judged until you answer. Tell it where it is wrong:

```text
1 yes. 2 is more of a mix: pay() is stateful but total() is a pure calculation.
```

> **dx-review** records `Invoice.total()` as a Transformation and `Invoice.pay()` as a Stateful Object, and continues.

Your correction changes what comes out. The same code classified differently yields different Candidates, so this is the question worth taking time on.

If you can't or won't answer a gate, say "skip". The affected units are reported `unconfirmed` with the assumption stated and no verdict. A gate is never silently defaulted.

## Step 3 — Answer the analysis gates

The scan found something that triggers a second kind of gate: `price.test.ts` mocks two intermediate helpers.

> **dx-review** asks:
>
> ```text
> price.test.ts mocks roundToCents() and applyTax(). Is any of these steps financially expensive, performance-expensive, or side-effecting?
> ```

```text
no, both are pure
```

> Then the mock is a smell, not a legitimate exception. It carries on to the level question for `Invoice.pay()`, which is tested through the aggregate directly:
>
> ```text
> Does the surrounding orchestration change often? Is the application service simple or complex? Can the effect be verified through a read model, view or query?
> ```

```text
Orchestration is stable and the service is thin. The effect is queryable.
```

Each gate is asked only for the units that trigger it, and each stage's questions go out together as one round. You can also pre-answer a gate in your instructions, as in `/dx-review test-strategy src/billing classify price.ts as a Transformation`, and it won't ask.

## Step 4 — Read the Candidates

An Explore run writes no report and no `reviews/` file. It prints ranked, numbered Candidates and a list of everything it checked.

> **dx-review** presents:
>
> ```markdown
> ## Candidates
> 1. **price.ts / price.test.ts** (Strong)
>    - **Problem class and strategy:** Transformation, tested interaction-based
>    - **Mismatch:** mocks `roundToCents()` and `applyTax()`, so the real payload is never verified [Strategy-fit: Blocker]
>    - **Proposed change:** assert on the returned total for real inputs; drop both mocks
> 2. **Invoice.pay() / invoice.test.ts** (Worth exploring) — 3 sites
>    - **Problem class and strategy:** Stateful Object, return value asserted with no prior state
>    - **Mismatch:** never queries the resulting state [Strategy-fit: Consider]
>    - **Proposed change:** reach a prior state, act, then verify through `Invoice.status()`
>
> ## Reviewed
> - price.ts — Transformation — interaction-based — MISMATCH
> - Invoice.pay() — Stateful Object — return-only — MISMATCH
> - Invoice.total() — Transformation — output-based — OK
>
> Top pick: 1. The mocks hide any regression in the calculation itself, and the fix is a few lines.
> ```
>
> Which do you want to promote?

Three things to notice. There is one Candidate per broken rule, with a site count where it recurs, not one per site. The `Reviewed` list includes the `OK` unit, so you can see what was checked and found fine. And the strength tag ranks confidence, not sequence, which is why the top pick is stated separately.

Severity follows a fixed rule: `Blocker` when the mismatch removes regression protection, `Consider` when it only costs stability.

Two of the Policy's dimensions, `Frontend & e2e` and `Pathological tests` (assertion-free, tautological or order-dependent tests, duplicated coverage), are written from general knowledge and not from research or the original strategy skill. Treat their findings as heuristics. This run had no UI or e2e tests in scope, so the first was `N/A`.

## Step 5 — Promote one

```text
1
```

> **dx-review** writes a change with the Policy's default `type: feature`, and a seed research file holding the Candidate verbatim:
>
> ```text
> Promoted one: Change created: context/changes/price-test-strategy/change.md   (type: feature, seeded with the Candidate)
>               Next: /dx-plan price-test-strategy
> ```

Look at `context/changes/price-test-strategy/research/`. The seed's frontmatter records `kind: codebase`, the `/dx-review` command it came from and the git commit, so `/dx-plan` reads it as upstream instead of re-deriving it. Run `/dx-plan price-test-strategy` and carry on with the normal lifecycle from [ship a change](./ship-a-change.md).

## Step 6 — Or promote several

Had you answered `1 and 2`, the skill would print a seed block and stop, because one change per Candidate is the wrong shape for several:

```text
## test-strategy candidates (from /dx-review test-strategy)
1. price.ts / price.test.ts — Transformation tested with mocks (Strong)
2. Invoice.pay() / invoice.test.ts — Stateful Object, return-only asserts (Worth exploring)
Type: feature
Start with: 1
```

and then:

```text
Next: /dx-new "<the printed seed block, heading through Start with:, verbatim>" → /dx-roadmap <effort-id>
```

Paste the block as the `/dx-new` argument. `/dx-new` recognises the `## <Policy> candidates (from /dx-review <policy-id>)` heading, creates an effort, writes one `research/<topic>.md` per entry and records the default slice type in the effort's `## Notes`. `/dx-roadmap` then decomposes the entries into slices.

## Step 7 — Record a rejection

Say you reject Candidate 2 because `Invoice` is deliberately tested at the aggregate level while the billing module is rewritten. A reason like that is load-bearing, so the skill offers `/dx-lesson` with a one-line entry for you to confirm. The next Explore run reads `lessons.md` and skips it. Rejecting without a reason, or just not picking it, leaves no trace.

## Run it on a change

The same Policy runs on a container: `/dx-review test-strategy oauth-login`. The run is scoped to the tests the change touched plus the production code they exercise. An effort takes the union over its child changes. The gates are asked the same way. It writes `reviews/test-strategy.md` with one Verdicts line per dimension, findings tagged `[<Dimension>: <Severity>]` and a `## Reviewed` list, and you triage it with `/dx-review-triage oauth-login test-strategy`. Where a project standard on testing contradicts a heuristic, the standard wins and the finding says so.

## What you built

- `context/changes/price-test-strategy/change.md` (`type: feature`) with a seeded `research/` file, or an effort and its research files if you promoted several.
- Nothing else. The Candidate list is ephemeral by design.

## Where to next

- [Write a review policy](./write-a-review-policy.md) — add `## Questions` and `## Candidates` to a Policy of your own.
- [Find refactoring opportunities](./find-refactors.md) — the other Explore-style discovery, with the same promote-one and promote-many shape.
- [Policy-driven review](../explanation/policy-driven-review.md) — why Explore runs show Candidates while container runs write Findings.

## Related

- [Skills reference](../reference/skills.md) — `/dx-review`, `/dx-new` and `/dx-init`, with exact reads, writes and `Next:` lines.
- [Review and triage](./review-and-triage.md) — the container-run loop that `test-strategy` also feeds.
