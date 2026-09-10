# dx-workflow

## 1.3.2

### Patch Changes

- 15989f8: dx-frame: add an optional `## User cases` section to frame.md, included only for user-facing work with more than one flow worth distinguishing (who, trigger, outcome, provenance); omitted entirely for internal/structural work. For an effort, the section is a headline sketch only (slices don't exist yet at framing time); user-case questions batch a candidate list into one question rather than asking one per flow.

  dx-frame: new slice mode — running `/dx-frame` on a child change whose parent effort already has a `frame.md` skips re-framing the problem/alternatives/scope and interviews only on that slice's own user cases, writing them to a small `frame.md` of its own that's additive to the parent's sketch. `dx-new`'s child-change guidance and printed `Next:` line now offer this as an optional step before `/dx-plan`.

  dx-plan: reads a slice's own `frame.md` and its parent effort's as a union. When any `## User cases` section is present and the repo already has a test setup, each phase implementing a user case gets a task asserting it; never introduces a test framework to satisfy this.

## 1.3.1

### Patch Changes

- dc5dc04: `dx-new`, `dx-archive`, `dx-lesson`, and `dx-standards-update` drop `disable-model-invocation:
true`, so a calling skill (`dx-brainstorm`, `dx-diagnose`, `dx-refactor-discover`, and future
  callers) can reach them by explicit named invocation — the same mechanism `dx-references` already
  relies on. Descriptions stay untouched (terse, human-facing), so nothing changes about how or when
  they fire from raw user chat; this only opens a previously-closed path for a calling skill's
  instructions to invoke them directly. Direct `/dx-new`, `/dx-archive`, `/dx-lesson`,
  `/dx-standards-update` typed-command usage is unchanged.

## 1.3.0

### Minor Changes

- 5a215cd: Fix the propagation hop from `dx-refactor-discover`'s promote-many seed summary into `dx-new`.
  `dx-new` now recognizes an argument opening with `## Refactor opportunities (from
/dx-refactor-discover)` as a multi-finding effort seed rather than a short idea to slugify: it derives
  the effort slug from the seed's `Start with:` line, writes `effort.md` with a `## Notes` marker
  (`Refactor effort — findings promoted from /dx-refactor-discover.`), and writes one
  `research/<topic>.md` per promoted finding — provenance frontmatter plus that finding's full entry,
  including its `Sketch:` line when `dx-refactor-discover`'s design-it-twice step ran for it. `dx-roadmap`
  needs no edit of its own — it already decomposes "every `research/<topic>.md`" into one slice per
  finding. `dx-new <effort-id> <slice-n>` now reads the concrete `## Notes` marker to stamp `type:
refactor` on each child instead of defaulting to `feature`.
- 5a215cd: Loop `dx-refactor-discover`'s "design it twice" offer (§4) across a multi-select promote. Picking
  exactly one finding keeps today's plain yes/no. Picking more than one no longer skips straight to §5's
  "Many" case without a chance to sketch — it asks a single batched question first ("sketch any of these
  before promoting?", options _none_ / _all_ / _specific ones_, recommending just the top pick), then
  runs the existing frame → spawn 3–4 → compare → stop-and-ask loop once per selected finding,
  **sequentially** — never spawning the next finding's sub-agents before the current finding's sketch is
  confirmed. This is the fan-out safeguard: at most one finding's batch of 3–4 `Plan` subagents is ever
  in flight, no matter how many findings were promoted, with no arbitrary numeric cap to invent or
  maintain. §5's "Many" seed-summary bullet needed no edit — its wording ("plus the chosen sketch for any
  finding §4 explored") was already plural-ready.

## 1.2.0

### Minor Changes

- 0cf2a8f: Close the `dx-plan` / `dx-plan-review` design-coverage gap. `dx-plan` now gates three new conditional
  `plan.md` sections — `## Data model`, `## API & contracts`, `## Failure modes & reversibility` — behind
  one-line relevance triggers, and authors the ones that apply (omitting the rest entirely, never `N/A`).
  `dx-plan-review` loads the same triggers keyed on the change itself, so a wrongly-absent section is as
  reachable as a present-but-wrong one, and folds four new checks (reversibility, contracts &
  compatibility, failure-scenario coverage, scope cohesion) into its existing four dimensions.
  `dx-impl-review`'s Plan-drift check now also verifies the diff against any conditional sections a plan
  carries.
- 74c8592: Deepen the `module-design` lens and the refactor finding shape. `module-design` gains the judgment
  rules its consumers were missing — leverage and locality (what depth _buys_), adapter as a role
  distinct from implementation, "one adapter = hypothetical seam, two = real", internal vs external
  seams, interface ⊃ type signature, a four-row `## Dependency category` feasibility axis, and a
  `## Rejected framings` list that moves the anti-drift guard up out of `dx-refactor-discover` so all
  five consumers get it. `dx-refactor-discover` findings now carry a dependency category alongside the
  strength tag (feasibility beside desirability), a one-line `Shape: before → after`, and a cash-out
  rule that requires every win be named in `module-design` terms rather than "cleaner code" — and the
  promote-many seed summary carries all three. `plan-failure-modes` cross-references the new dependency
  axis where the two overlap on external calls.
- 74c8592: Let `dx-refactor-discover` design the pick twice before promoting it. The scan itself still stops at
  `Shape: before → after` — designing interfaces across N candidates spends the effort before the user
  has said which one matters — but once a candidate is picked, the skill offers an **opt-in** parallel
  exploration: it frames the constraints and dependency category back to the user, then immediately
  spawns 3–4 built-in `Plan` subagents, each under a forcing constraint stated as _where the seam goes_
  rather than as a value to maximize (collapse to 1–3 entry points · move part of the contract out of
  the interface · split the seam so common and rare callers reach different entry points · ports &
  adapters, gated on the dependency category). Two values can share an optimum — on a single-caller
  module "smallest surface" and "trivial default case" are the same lever — and then two agents return
  the same interface with a parameter renamed; seam placements can't coincide that way. Two designs
  sharing an entry point are reported as one, rather than padding the comparison to three. Each agent
  gets its own technical brief, written in `module-design` terms for structure and
  `foundation/glossary.md` terms for the domain when the candidate has one — infrastructure often
  doesn't — and returns the same five
  things (interface, usage example, what's hidden behind the seam, dependency strategy, trade-offs), so
  the results are comparable. Survivors are compared on depth, locality, and seam placement and closed
  with an opinionated pick or hybrid; an agent that comes back unusable is dropped rather than retried,
  and a user reply that contradicts the framing re-spawns rather than reconciles. The chosen sketch
  rides into the promoted change's seed artifact — and into the seed summary on the promote-many path —
  so `/dx-plan` inherits the exploration instead of re-deriving it. The skill still writes no `plan.md`
  and edits no code.
- 74c8592: Broaden `dx-refactor-discover`'s sweep beyond module depth. A new `design-lenses` reference names the
  principles to scan for (SRP and the rest of SOLID, KISS, YAGNI, DRY, separation of concerns,
  encapsulation, coupling, composition over inheritance, robustness, orthogonality) as bare recruitment —
  no definitions, no pattern catalogue — so problems outside the depth lens get found at all.
  `module-design` stays the primary lens **and** the sole vocabulary: every finding is still phrased in
  module terms whichever lens turned it up, and a principle name counts as a diagnosis, never a win.
  `dx-plan` loads the same reference unconditionally while writing the solution design, since design
  principles bear on any design and not only on refactors.
- 74c8592: Give `dx-refactor-discover` a scan prior and an opinionated close. The scan now walks back
  `git log --oneline` and lets churn-heavy paths pull attention first — derived at run time, nothing
  maintained — and widens the net when the log shows no clear hot spot. The findings list ends with a
  one-sentence **top pick**: which candidate to tackle first and why. The strength tag ranks confidence,
  not sequence, and the two differ — a `Strong` finding in a cold file is worth less than a
  `Worth exploring` one in a hot path. On the promote-many path the pick rides into the seed summary as
  a closing `Start with:` line, since sequencing the slices is the one judgement `/dx-roadmap` cannot
  re-derive from the findings.

## 1.1.0

### Minor Changes

- e139adc: Add `dx-brainstorm` — a third discovery entry that runs before `/dx-new` on a raw idea: it questions whether the problem is real, weighs at least two alternatives against a priced do-nothing, and converges on one of four exit ramps (nothing worth building, already covered, one change, or an effort). Deciding to build nothing is a terminal outcome that writes nothing. When it does route, it writes the container's identity file plus a new root-level `brainstorm.md` artifact carrying the alternatives weighed and the scope explicitly rejected, then prints the next command and stops.

### Patch Changes

- e139adc: Add a challenger step to the shared `interview` reference: before presenting a conclusion for a consequential, hard-to-reverse decision, run an adversarial pass (strongest objection, cheaper alternative, downstream breakage, hidden assumption). Critical findings surface back to the user as a question; non-critical findings become a visible caveat. Picked up automatically by `dx-frame`, `dx-plan`, and `dx-roadmap`.
- e139adc: Unify `dx-plan-review` and `dx-impl-review` onto one severity vocabulary (`Blocker`/`Consider`) in the shared `review-report` reference, instead of `impl-review`'s separate `PASS`/`WARNING`/`FAIL` dimension scale. `impl-review` findings now tag with the compound `<Dimension>: <Severity>` form (e.g. `Safety: Blocker`); every finding in either report must carry a location, a **Why it matters** line, and an actionable fix.
- e139adc: Add an `untrusted-content` shared reference: content fetched from outside the codebase (via `WebFetch`/`WebSearch` or any external source `dx-research` cites) is investigated data, never instructions — embedded prompts or commands get reported on, not followed. Picked up by `dx-research` when writing external-mode findings, and by `dx-plan`, `dx-implement`, `dx-tdd` before reading a `research/<topic>.md` with `kind: external`.

## 1.0.0

### Major Changes

- 66f1df9: Initial release
