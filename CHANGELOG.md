# dx-workflow

## 1.6.0

### Minor Changes

- d4640e2: `context/workflow/` is now `context/config/`, and the two templates moved out of `review-policies/` into `context/config/templates/`, renamed `review-policy.md` (was `policy-template.md`) and `review-report.md` (was `report-template.md`). `review-policies/` now holds only Policies, so the rule that a `.md` ending in `-template.md` is not a Policy is removed: every `.md` there is a Policy. `/dx-init` seeds `context/config/{review-policies,templates}/` (missing files only), and `/dx-review` and `/dx-review-triage` read from the new paths. Existing projects: re-run `/dx-init` to get the new tree, then delete the old `context/workflow/` by hand — nothing is migrated, so your edited Policies are not copied over; move them into `context/config/review-policies/` yourself.
- d4640e2: The plan gate is now a Policy: run `/dx-review plan <change-id>` for the optional pre-implementation review. **Breaking:** `/dx-plan-review` is removed with no alias. The built-in `plan` Policy keeps the same four dimensions (Substance, Feasibility, Architectural fitness, Standards-fit), their sub-checks and the report-only behaviour, but the report now opens with a per-dimension Verdicts block and tags findings like `[Feasibility: Blocker]`; the single **sound / revise / rethink** verdict line is dropped. `/dx-plan` now prints `Next: /dx-review plan <change-id>`, `/dx-review-triage <id> plan` reads only `reviews/plan.md`, and the unknown-policy error tells you to re-run `/dx-init`. Existing projects: re-run `/dx-init` to seed `context/config/review-policies/plan.md` (missing files only; your edits are never overwritten). Old `reviews/plan-review.md` reports are not migrated and triage and archive ignore them, so triage any PENDING findings in them before upgrading, or re-run `/dx-review plan <change-id>` to get a report in the new shape. The `review-report` reference topic of `dx-references` is removed; `review-report.md` is the only report schema. Upgraded installs keep a stale `dx-plan-review` skill until you remove it by hand.
- d4640e2: Policy-driven review: new `/dx-review <policy-id> [container-id] [instructions…]` runs a review whose criteria come from a Policy file in `context/config/review-policies/`. **Breaking:** `/dx-impl-review` is removed with no alias — run `/dx-review implementation <change-id>` instead, which keeps the same guard, dimensions, verdicts, `status: reviewed` on pass, lesson offer and `dx-diagnose` hand-off, and now also offers `/dx-standards-update` when a finding repeats a lesson or exposes a standard gap. `/dx-review-triage` now takes `<container-id> [policy-id]` instead of `[plan|impl]` (`impl` becomes `implementation`; `plan` still triages `plan-review.md`), and `/dx-archive` warns on PENDING findings in any `reviews/*.md`. `/dx-implement` and `/dx-tdd` now print `Next: /dx-review implementation <change-id>`. Existing projects: re-run `/dx-init` to seed `implementation.md`, `review-policy.md` and `review-report.md` (missing files only; your edits are never overwritten, so later fixes to shipped Policies must be merged by hand). Old `reviews/impl-review.md` reports are not migrated and triage ignores them — re-run `/dx-review implementation <change-id>` to get a report in the new shape. Upgraded installs keep a stale `dx-impl-review` skill until you remove it by hand.
- d4640e2: New built-in review Policy: `/dx-review sessions [instructions…]` is a report-only retrospective that reads agent session transcripts (the current session by default) and prints ranked suggestions for improving the coding agent's environment, then stops. Policies gain an optional `promote: off` line in `## Candidates`: an Explore run then prints its Candidates and stops, with no promote question, no `Next:` line and no lesson offer, and `type:` becomes optional. Default behaviour, including `test-strategy`, is unchanged. Existing projects: re-run `/dx-init` to seed `sessions.md` (missing files only). `/dx-init` never overwrites your `review-policy.md` and `review-report.md`, and a fix to a shipped Policy or template never reaches an existing copy, so compare your `review-policy.md` and your review-policies with the shipped ones in the skill's `assets/config/` and merge `promote: off` by hand.
- c94fdad: `/dx-implement` auto mode now runs in its own git worktree (`.worktrees/<change-id>` on a scratch branch) and fast-forwards your work branch on success, so several changes can run at once without touching your checkout. Phases that run concurrently each get a sibling worktree, merge back in dependency order (a resolver agent handles conflicts), and the group's `(integrated)` checks run once on the merged tree; subagent notes go to `handoff.md` as each returns. Worktrees are kept on any stop and removed only on full success. `/dx-plan` tags `#### Automated` rows `(isolated)` or `(integrated)` and emits an integration phase per parallel group. A new shared `start-check` reference (used by `/dx-implement` and `/dx-tdd`) resolves the work branch, commits the change's `context/` files and stops the one-phase modes when a stopped auto run left a kept worktree. `/dx-init` adds `.worktrees/` to `.gitignore`, copies the global standards only when `context/standards/` didn't already exist (otherwise it asks which to add), and writes a one-line dx- pointer inside a managed `<!-- dx:workflow:start/end -->` block in `AGENTS.md` (when `CLAUDE.md` only points at it) or `CLAUDE.md`, no longer writing the rollback principle. Existing projects: add `.worktrees/` to `.gitignore` or re-run `/dx-init`; old rollback text in `CLAUDE.md` is left as is.
- 32f1f0d: Four fixes from the sessions review. `/dx-plan` labels every Manual check `(agent-runnable)` or `(user-only)` and aims for a plan the agent can verify end to end; `/dx-implement` and `/dx-tdd` run `agent-runnable` rows themselves and tick them on evidence, and a `user-only` row ticked on bare say-so is recorded `— ticked on say-so`. `/dx-plan` gives each phase a `Depends on:` line so independent phases can be separated, and `/dx-implement <change-id>` now runs every pending phase on subagents in dependency order by default (independent phases concurrently, the coordinator owns Progress and the per-phase commits); `--manual` restores one phase per invocation, and a fully ticked plan with a follow-up request now points at `/dx-new`. `dx-references` accepts several space-separated topics in one call, and `dx-plan`, `dx-implement` and `dx-tdd` batch the topics they always load together. `/dx-roadmap` and `/dx-frame` print the slice order and the user cases as a table before asking you to confirm.
- e3a07d9: Cut story and planning overhead found in a second sessions review. `/dx-new` now defaults to a single change and uses an effort only when slices can each ship alone or run in parallel; `/dx-roadmap` folds a slice that only hardens or extends another into a phase, and makes the lead slice the tracer (one happy path, one negative test). `/dx-plan` decides by default and asks only what truly needs a human, recording its own decisions under a new `## Assumptions` section; it reads at most one prior plan (cited as `Reuse from:`), makes phase 1 the tracer with hardening in later phases, names the affected test files per phase with one full-suite run in the final phase and one Standards checklist per plan, and warns and offers to move extras to a later change when a plan outgrows one shippable unit. `/dx-implement` runs only the test files a phase names and keeps the full run for the final phase. `dx-new` and `dx-plan` note that the next command can run in the same session (skills still never auto-chain), and `dx-references` reuses a topic already loaded in the session.
- d4640e2: `/dx-review` now runs over the repo or folders as well as a change or effort, and ships a third built-in Policy: `/dx-review test-strategy [container-id | paths…] [instructions…]` checks whether the testing strategy matches the problem class of the code under test (`Strategy-fit`, plus `Frontend & e2e` and `Pathological tests`, the latter two written from general knowledge rather than research). The new Explore-run argument grammar resolves positionally: a container ID, else the leading tokens that are existing repo paths, and the first token that is neither starts your instructions; a container plus a path is refused as ambiguous, and no container and no path asks what to review. An Explore run writes no report: it presents ranked Candidates inline and promotes one into a change, or several through a printed seed block. `/dx-new` now also parses that seed, headed `## <Policy> candidates (from /dx-review <policy-id>)`, into an effort with one `research/<topic>.md` per entry; the `## Refactor opportunities (from /dx-refactor-discover)` seed is unchanged. Policies gain optional `## Questions` (stage-tied gates asked in container and Explore runs; an unanswered gate leaves a unit `unconfirmed` with no verdict) and `## Candidates` sections, and the report template gains an optional `## Reviewed` list. Existing projects: re-run `/dx-init` to seed `test-strategy.md` (and `plan.md` if missing). `/dx-init` never overwrites your `review-policy.md` and `review-report.md`, which don't document `## Questions`, `## Candidates` or `## Reviewed`, so compare both with the shipped ones in the skill's `assets/config/` and merge the new sections by hand.

### Patch Changes

- 32f1f0d: Fix `/dx-new` not installing via `npx skills add`: its `argument-hint` frontmatter was invalid YAML, so the installer silently skipped the skill.

## 1.5.0

### Minor Changes

- bd16bf3: dx-refactor-discover: after the top pick, the skill proposes a Standard Proposal (a new rule, or an extend/tighten amendment to an existing standard) for each cause shared by at least three distinct candidates that no rule covers, and prints `/dx-standards-update` to accept it; it stays silent when no cause clears the bar and never writes `context/standards/`. knowledge-layer: an accepted Standard Proposal is a second promotion path into `context/standards/`, next to a graduating lesson.
- bd16bf3: dx-refactor-discover: the project's `context/standards/` becomes a third source of refactor candidates next to `module-design` and `design-lenses`. The skill loads `knowledge-layer` and uses its _domain × topic_ matching to pick the standards in scope. Of those, it keeps only structural rules that existing code can be checked against. Each broken rule becomes one candidate, with a site count, representative sites and a `<standard path> § <rule>` citation. The standard wins over a lens. A module that breaks a rule and trips a lens is reported once. A candidate that would add a layer with no second use is capped at `Speculative`, or dropped where a loaded standard says minimal implementation wins. Rejected "don't migrate X to rule Y because Z" lessons are skipped on later runs. A standard-driven candidate may name where things sit with the standard's roles, but its win is still stated in `module-design` terms. Promoted seeds carry an optional `Standard:` line. Discovery output is renamed from "finding" to "candidate".

  dx-new: the refactor promote-many seed parse keeps each candidate's optional `Standard:` line verbatim in its `research/<topic>.md`, alongside `Sketch:`. The seed heading and `## Notes` marker are unchanged.

## 1.4.0

### Minor Changes

- f26ebcc: dx-distill: new user-invoked skill. Runs a discovery conversation toward a decision and writes one brief to `context/foundation/briefs/<slug>.md`, in which every substantive claim carries one of seven evidence tags (`[INTERVIEW]` `[DATA]` `[DOCUMENT]` `[PRODUCT]` `[BENCHMARK]` `[SYNTHETIC]` `[ASSUMPTION]`) and a source path — provenance per claim, where `dx-research` records it per file. Frames the decision first (material is an input, never the trigger) and infers emphasis from what the material actually is, the way `type` already activates plan characteristics. Checks existing material before asking the user for facts; thin material yields an honestly incomplete brief with a collection plan, not a refusal. Drafts, then hands the draft to a `general-purpose` subagent running five source checks before the user sees it, then waits for confirmation before writing. Reports a Coverage arithmetic line, with `[SYNTHETIC]` claims confined to `## Hypotheses to test` and counted outside it. Records the exchange to a companion `<slug>.interview.md` so `[INTERVIEW]` claims cite a checkable path. Promotes nothing and creates no container — `dx-new` stays the sole router. Brief shape, evidence tags, and the skeptic prompt are collocated references, not shared ones.

  dx-new: accepts optional, loose, plural brief references — a bare slug, a filename, or a full path, anywhere in the argument, no flag and no fixed position. Those names are stripped before deriving the slug, and the resolved paths are recorded as one prose `Briefs:` line in the container's `## Notes`. An unrecognized name lists `context/foundation/briefs/` and asks rather than guessing. No brief named leaves existing behavior unchanged; `change.md`/`effort.md` frontmatter is untouched.

  dx-frame, dx-plan: each gathers any brief named in the container's `## Notes` (for `dx-plan`, the parent effort's `## Notes` too when `effort:` is set) as settled upstream context — a tagged claim is cited rather than re-derived, active non-goals are closed scope, and in `dx-plan` the brief's riskiest assumptions, kill criteria, and bearing open questions carry into `## Priors & gotchas`. `untrusted-content` now also gates a brief carrying claims sourced from outside the repo. Read-only; neither skill's output shape changes.

## 1.3.3

### Patch Changes

- 463fdc8: Prompt-audit cleanup: fix the prior-work search glob in dx-plan and dx-research (it pointed at `research.md` files that never exist; research lives at `research/<topic>.md`, including efforts); drop the maintainer-only "Minimalist fallback" aside from the `knowledge-layer` reference; replace dx-plan-review's anti-formatting prohibitions with the `review-report` format they duplicated; restate dx-diagnose's loop emphasis without pressure language and group its description's trigger synonyms into categories; make the `interview` reference's cold-start question count qualitative instead of numeric tiers; and remove small leftovers (dx-refactor-discover's "no clipboard" and maintainer-only rationale, dx-impl-review's redundant "be specific" line, dx-review-triage's architecture aside).

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
