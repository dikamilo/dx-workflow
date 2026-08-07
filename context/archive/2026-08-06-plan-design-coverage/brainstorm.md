---
created: 2026-08-06
---

# Brainstorm — plan-design-coverage

## The question
Does `dx-plan` capture enough of a change's design before implementation, or does its current
shape (`Approach` + `Phases`) let architecturally-important decisions — data model, API/contract
changes, edge cases, reversibility — go unrecorded because nothing prompts for them?

## Alternatives weighed
- **Do nothing** — priced at: a plan reviewer (or a future implementer) has no structural place
  to check "did we think about the schema / the failure modes / how this gets undone", so gaps
  surface during implementation or review instead of during planning, costing a plan-review
  round-trip or a mid-implementation replan. Lost: the gap is real and cheap to close.
- **Copy the external skill's full section set wholesale** (Architecture, Data Model, API
  Contracts, UI/UX, Edge Cases, Risks, Phasing, Implementation Plan as fixed headers on every
  plan) — lost: that skill's own review heuristic #1 ("is the spec wasting space documenting
  standard CRUD?") is the exact failure mode this would create for dx — every trivial change
  would carry five empty/N/A headers, directly violating dx's scaling rule ("a trivial change
  gets a thin, single-phase plan with near-zero questions").
- **B — Interview coverage only, no new template headers** — extend the `interview` reference's
  question-scaling so relevant topics get asked, answers fold into freeform `Approach` prose.
  Lost as the sole approach: keeps the template lean but coverage becomes unauditable — nothing
  in the artifact itself lets a reviewer confirm the topic was actually considered.
- **A — Conditional template sections only, no interview change** — lost as the sole approach:
  a header with no prompt behind it risks going in empty/boilerplate because nobody was asked,
  reintroducing the ceremony problem from a different angle.
- **A + B combined — won.** Conditional `plan.md` sections (present only when the change
  actually touches that concern) plus interview-scaling that prompts for the topic when
  relevant, so the header is populated because it was asked, not filled with "N/A". Mirrors the
  pattern dx already uses for `type`-conditional phases (defect/refactor/migration), so it's a
  house-consistent mechanism, not a new one.

Also considered and explicitly rejected (mechanisms from the external skill that don't transfer):
- Batched, numbered Open-Questions gate — dx already made this choice the other way (`interview`
  reference: *avoid batched questionnaire*), for good reason; not relitigated here.
- Research against market leaders — product/domain-specific, doesn't generalize across the
  arbitrary projects dx-plan runs in.
- Emoji-decorated headings, 4-tier severity review format — dx already unified review severity
  to `[Blocker]`/`[Consider]` (see archived `review-severity-unification`); emoji headings
  conflict with the anti-ceremony house rule.

## Conclusion & route
Route: one change (bundling test: yes — this is a single capability, "plan.md captures
design decisions the current template omits, prompted only when relevant," not several
independently shippable pieces). Riskiest assumption: that gating on "only when relevant" is
enough to prevent the new sections becoming boilerplate over time — the cheapest test of that
is watching the next few real plans `dx-plan` produces after this ships. What breaks if this
succeeds: plans get longer for changes that do touch data/contracts/edge cases — intentional,
since that's exactly the gap being closed; the failure mode to watch for is scope creep back
toward mandatory-everywhere sections, which the "only when relevant" gate exists to prevent.

## Added consideration — the review side
The external skill's document also carries a nine-principle staff-engineer review heuristic
(architectural diff, scope cohesion, canonical mechanisms, contracts/compatibility,
reversibility, boundaries/coupling, sensitive data, failure scenarios, testability). Checked
against `dx-plan-review`'s current four dimensions (Substance, Feasibility, Architectural
fitness, Standards-fit):

- **Already covered, no change needed:** canonical mechanisms and boundaries/coupling fold into
  "Architectural fitness"; testability folds into "Feasibility".
- **Doesn't fit, rejected for the same reasons as above:** the four-tier emoji severity scale
  (already unified to `[Blocker]`/`[Consider]`); a hardcoded "sensitive data" dimension (too
  project-specific — better left to Standards-fit flagging a missing data-protection standard
  than a fixed dimension every project must have an opinion on).
- **Real gap, adopted:** reversibility, contracts/compatibility, and failure-scenario coverage
  have no review-time check today outside the `migration`-type rollback-phase gate and the
  `defect`-type TDD gate — i.e. exactly the same three concerns (plus data model) the authoring
  side is gaining structured sections for. Without a matching review check, a new conditional
  section could be present-but-wrong and pass review anyway. Scope cohesion (one independently
  deployable capability per plan) is also unchecked at review time today — closest existing
  analog is the bundling test `dx-frame` applies at framing time, never re-verified at review.

This folds into the same change rather than spinning out a second one: it's the review-time
mirror of the same underlying gap ("plan.md captures these decisions" is incomplete without
"and review catches it when one is missing or wrong"), not an independently shippable capability
per the bundling test.

## Resolved unknowns
| Question | Answer |
|---|---|
| Copy the external skill's full fixed section set, or something narrower? | Narrower: conditional sections (data model / API-contract changes / edge cases & failure modes), gated on relevance — not a fixed set present on every plan. |
| Template-only fix, or interview-only fix? | Both — conditional headers *and* interview-scaling to elicit them, combined. |
| Adopt its batched Open-Questions gate? | No — dx's one-at-a-time interview stays; not revisited. |
| Adopt competitor/market-leader research step? | No — doesn't generalize across dx's arbitrary target projects. |
| Adopt emoji/4-tier severity review format? | No — dx already unified severity to `[Blocker]`/`[Consider]`. |
| Does reversibility/failure-mode coverage need its own change? | No — folded into the same "edge cases & failure modes" conditional section; same underlying gap. |
| Does `dx-plan-review` need a matching check for the new sections, or is the authoring-side template fix enough on its own? | Both, one change — add reversibility/contracts/failure-scenario (and scope-cohesion) coverage to `dx-plan-review`'s review dimensions so the new conditional sections are actually checked, not just present. |
| Adopt a hardcoded "sensitive data" review dimension? | No — too project-specific; leave it to Standards-fit flagging a missing data-protection standard instead of a fixed dimension. |

## Not doing
- Copying the external skill's fixed 8-section spec format wholesale.
- Adding a batched/numbered Open-Questions gate to `dx-plan`.
- Adding a market-leader/competitive-research step to `dx-plan`.
- Adopting emoji-decorated headings or a 4-tier (Critical/High/Medium/Low) review severity scale.
- Adding a fixed "sensitive data" dimension to `dx-plan-review` — left to Standards-fit instead.
