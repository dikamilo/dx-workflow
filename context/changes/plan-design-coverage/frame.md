---
created: 2026-08-06
---

# Frame — plan-design-coverage

## The real problem
`plan.md` has no structural home for four domain-neutral design concerns — data model, API/contract
changes, edge cases & failure modes, and reversibility — so they either get buried in free-form
`Approach` prose (unauditable) or skipped outright, because nothing in the interview specifically
prompts for them. The same gap exists one step later: `dx-plan-review`'s four dimensions
(Substance, Feasibility, Architectural fitness, Standards-fit) have no check that would catch a
populated-but-wrong version of one of these sections, or a plan that bundles more than one
independently deployable capability. Root cause is the same on both sides — the workflow has no
structural prompt-and-verify pair for these concerns; it currently relies on the planner and
reviewer happening to think of them unprompted.

## Who / what it affects
- **`skills/dx-plan/SKILL.md`** — gains interview-scaling toward the four topics (step 2) and
  activates the new conditional `plan.md` sections (step 4).
- **`skills/dx-references/references/plan-template.md`** — gains the conditional section shapes,
  mirroring the existing `type`-conditional phase-characteristic pattern.
- **`skills/dx-references/references/interview.md`** — its question-scaling guidance names these
  topic categories so both `dx-frame`-front-loaded and `dx-plan`-native interviews route toward them
  when relevant.
- **`skills/dx-plan-review/SKILL.md`** — gains review-time checks for reversibility,
  contracts/compatibility, failure-scenario coverage, and scope cohesion (one independently
  deployable capability per plan), against its existing four dimensions.
- **`skills/dx-references/references/review-report.md`** — checked, not necessarily changed:
  `plan-review.md`'s finding format uses bare `[Blocker]`/`[Consider]` tags with no per-dimension
  tag list (unlike `impl-review.md`), so this file only needs touching if `dx-plan` decides the new
  checks warrant naming dimensions in the report — a solution-design call, not a framing one.
- **Docs** — per this repo's own house rule, `docs/reference/skills.md` and any tutorial/explanation
  page naming `dx-plan` or `dx-plan-review` need the matching update in the same change.
- **Not touched:** any plan or review already written before this ships (see below) — this reaches
  only the two skills and their two shared references; no other skill reads these four topics.

## Alternatives considered
Full comparison lives in `brainstorm.md`. Summary of the resolved route:
- **Do nothing** — rejected: the gap is real and cheap to close; leaving it means gaps surface
  during implementation or review instead of during planning.
- **Copy the external skill's fixed 8-section format wholesale** — rejected: imposes five
  empty/N/A headers on every trivial plan, violating both the external skill's own "flag
  boilerplate" review heuristic and this workflow's scaling rule.
- **Interview coverage only, no template sections (B alone)** — rejected as the sole fix: keeps
  the template lean but makes coverage unauditable — nothing in the artifact itself proves the
  topic was considered.
- **Template sections only, no interview change (A alone)** — rejected as the sole fix: a header
  with no prompt behind it risks going in empty, reintroducing the ceremony problem from the other
  direction.
- **A + B combined (won)** — conditional `plan.md` sections, present only when the change actually
  touches that concern, paired with interview-scaling that prompts for the topic when relevant.
  Mirrors the existing `type`-conditional phase-characteristic mechanism, so it's a
  house-consistent pattern rather than a new one. Bundled with the matching `dx-plan-review`
  dimension-check for the same four concerns (plus scope cohesion) in the same change, since a
  populated section nobody re-checks at review time is the same underlying gap from the other end.
- **Forward-only vs. backfilling in-flight plans** — resolved during framing: forward-only. The new
  sections and checks apply to plans/reviews authored after this ships; no retrofit of any
  `context/changes/**/plan.md` or `reviews/` already written, matching how the existing
  `type`-conditional phase pattern was rolled out with no history migration.

## Out of scope
- A fixed, always-present section set on every plan (the boilerplate failure mode this change is
  explicitly designed to avoid).
- A batched, numbered Open-Questions gate — `dx`'s one-at-a-time interview discipline stands.
- Market/competitor research as a `dx-plan` step — domain-specific, doesn't generalize.
- Emoji-decorated headings or a 4-tier severity review scale — severity stays `[Blocker]`/`[Consider]`.
- A hardcoded "sensitive data" `dx-plan-review` dimension — left to `Standards-fit` flagging a
  missing data-protection standard instead.
- Backfilling any plan or plan-review written before this change ships.
