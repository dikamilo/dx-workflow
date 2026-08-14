# Plan review — refactor-discover-principles

Reviewed `plan.md` against `change.md` (`type: feature`), `frame.md`, both research docs, the
`plan-template` / `plan-api-contracts` / `knowledge-layer` / `review-report` references,
`context/standards/global/`, and the real codebase.

The plan is unusually well-grounded: every load-bearing factual claim I spot-checked holds —
`module-design.md` is 23 lines with exactly five consumers (`dx-plan:54`, `dx-research:23`,
`dx-frame:24`, `dx-impl-review:15`, `dx-refactor-discover:16`); the reference range is mean ~28 /
max 52 (`effort-md`); `docs/reference/skills.md:294` really does hardcode "twelve"; there really are
twelve reference files; `lint-skills.mjs:97` accepts lowercase-kebab topics and only prints body
sizes without gating on them; `skills.sh.json` really does list directories only;
`dx-refactor-discover:30` is "Do not design interfaces yet"; `dx-plan:16` already reads the seed
`research/`/`frame.md` as upstream. The findings below are gaps, not corrections.

### F1 — `DESIGN.md` is the stated source of truth for behavior and no phase touches it [Blocker]
- **Location:** Phases 1–5 (every "Docs in the same phase" line); `## Standards to apply` → "CLAUDE.md / docs sync"
- **Detail:** `CLAUDE.md` opens with "`DESIGN.md` is the source of truth for behavior." `DESIGN.md`
  §9 describes this skill's behavior directly — "Scans the codebase using the `module-design`
  reference (loaded via `dx-references`; deep vs shallow modules, seams, deletion test), presents
  findings **inline**… and you pick" — and §7.6's seed-artifact row covers what a promoted container
  carries. This change broadens the scan past `module-design`, changes what a finding contains, and
  (phase 4) makes the skill produce interface sketches that ride into the seed artifact. Every
  phase's docs list names only `docs/**`; `DESIGN.md` appears nowhere in the plan or the Progress
  checkboxes. `lint-skills.mjs` checks docs *headings*, not `DESIGN.md`, so nothing catches this.
- **Why it matters:** the repo's own authority document would describe a skill that no longer exists,
  and the next change that reasons from `DESIGN.md` §9 (or §7.6) would plan against stale behavior —
  exactly the drift the docs-sync rule exists to prevent, just aimed at the one file the rule's
  wording happens not to name.
- **Fix:** add `DESIGN.md` §9 (`refactor-discover`) to phase 2's doc list and §9 + §7.6 to phase 4's,
  with matching Progress boxes. Decide once, in the Approach, whether `DESIGN.md` §14/§7.6 need the
  phase-4 seed widening or whether §9's prose is the whole surface.
- **Resolution:** FIXED

### F2 — Moving the anti-drift clause up collides with `plan-api-contracts` inside `dx-plan` [Blocker]
- **Location:** Phase 1, `## Rejected framings` bullet ("*API / signature* → too narrow, say interface")
- **Detail:** the clause is being promoted out of `dx-refactor-discover:16` into `module-design.md`
  precisely so all five consumers inherit it. One of those five is `dx-plan`, which loads
  `module-design` on `type: refactor` (`dx-plan:54`) *and* loads `plan-api-contracts` whenever the
  change touches a caller-visible contract (`dx-plan:26-27`) — writing a section literally titled
  `## API & contracts` whose own reference says "endpoint, function signature, event, or message".
  A refactor change that changes a signature would have `module-design` telling it not to say
  *API* or *signature* while `plan-api-contracts` requires exactly those words. The research that
  proposed the move (§2) only ever considered the clause in a discovery context.
- **Why it matters:** this plan's own `## API & contracts` section is a working demonstration of the
  vocabulary the clause would ban. Shipping the contradiction means every refactor plan with a
  contract surface has to silently pick a side, and `dx-impl-review` (also a consumer) inherits the
  same ambiguity when judging that plan.
- **Fix:** scope the ban in `module-design.md` — state that it governs how a module's *shape* is
  described, and that `## API & contracts` / `plan-api-contracts` vocabulary is exempt. One clause,
  and it keeps the guard's five-consumer reach.
- **Resolution:** FIXED

### F3 — Phase 5 declares no `skills/**` diff but step 5.3 can produce one, uncovered [Blocker]
- **Location:** Phase 5 header ("No `skills/**` diff of its own") vs. Progress 5.3
- **Detail:** 5.3 permits applying the frame's narrowest relaxation — "allow a named shape inside the
  `Shape: before → after` line only" — which is an edit to `dx-refactor-discover/SKILL.md` §3 and/or
  `module-design.md`. Phase 5 has no changeset step (contrast phases 1–4, which each end in one) and
  its own 5.2 is the per-phase changeset audit. As the plan itself notes and `CLAUDE.md` warns, CI's
  gate only checks that *some* `.changeset/*.md` exists, so this would pass green.
- **Why it matters:** the one phase whose job is release hygiene is the one that can ship an
  unversioned skill edit, and 5.2 auditing 5.3 in the same phase is the weakest possible ordering.
- **Fix:** either state that a triggered relaxation opens a new phase (6) carrying its own changeset
  and docs sync, or add a conditional changeset + docs step to phase 5 and run 5.2 last.
- **Resolution:** FIXED

### F4 — Phase 4 is a second capability bundled into one change [Consider]
- **Location:** Phase 4; `frame.md` "Out of scope" (struck through); `change.md` (`effort: null`)
- **Detail:** phases 1–3 are one coherent capability — broaden and sharpen what the scan finds and
  how it says it. Phase 4 changes the skill's stated identity ("it does not plan or edit code" →
  it sketches interfaces), adds parallel sub-agent orchestration, widens the seed artifact, and was
  explicitly out of scope in the frame until reversed mid-planning. It is independently deployable
  and independently valuable, and the repo has the two-level model (effort ⊃ change) for exactly
  this. Precedent cuts both ways: `2026-08-06-plan-design-coverage` did ship multiple phases as one
  change, but they were facets of a single concern.
- **Why it matters:** bundled, phase 4 shares one `change.md` and one review cycle with work that
  has nothing to do with it, and a problem in the sub-agent machinery blocks the vocabulary
  broadening that is the change's actual stated goal.
- **Fix:** split phase 4 into its own `type: feature` change seeded from this plan's phase-4 text
  (phases 1–3 + 5 stand alone and still meet `change.md`'s goal), or — if keeping it — record the
  bundling decision and its reason explicitly in `## Approach` so triage isn't re-litigating it.
- **Resolution:** FIXED

### F5 — No step verifies the broadening actually finds anything new [Consider]
- **Location:** Phase 2 Progress (2.1–2.8)
- **Detail:** phase 2 is the phase that delivers `change.md`'s stated goal, and its only manual check
  (2.8) is a no-op-test re-read of `design-lenses.md` — a check on the *file*, not on the scan.
  Phase 1's 1.7 verifies finding *shape*; phase 5's 5.3 verifies the *handoff* of a principle-lens
  finding, presupposing one was produced. Nothing anywhere asserts that a run surfaces a
  duplication / coupling / single-responsibility candidate the pre-change scan was blind to.
- **Why it matters:** every phase can pass and the original complaint ("the lens is too narrow") can
  still stand — the exact last-mile gap this dimension exists to catch. A bare recruitment list is
  the *cheapest* intervention to under-deliver silently, since nothing about it fails loudly.
- **Fix:** add a manual step to phase 2: a sandboxed `/dx-refactor-discover` run on this repo yields
  at least one finding whose diagnosis is non-module-depth (coupling, duplication, SRP), correctly
  cashed out into `module-design` terms. That also supplies 5.3's input.
- **Resolution:** FIXED

### F6 — "`dx-plan` §2, unconditional" lands inside the block that says the opposite [Consider]
- **Location:** Phase 2, `dx-plan/SKILL.md` §2 bullet; Progress 2.4
- **Detail:** `dx-plan` §2 is the interview step. Its reference-loading block reads "Before
  interviewing, check relevance and **load only the topics that apply**" and closes with "A change
  touching none of these loads none of them." Dropping an unconditional load there contradicts both
  sentences. Separately, the plan's own rationale places the load "in solution design" — which in
  `dx-plan` is §4 (`Write plan.md`), not §2.
- **Why it matters:** an implementer following 2.4 literally either breaks the conditional block's
  invariant or has to invent a placement mid-phase; the frame carried the same `§2` shorthand, so
  neither upstream doc resolves it.
- **Fix:** name the exact insertion point — either a standalone line in §2 *above* the "check
  relevance" block, or §4 alongside the `plan-template` load — and say which sentence, if any, of
  the conditional block gets reworded.
- **Resolution:** FIXED

### F7 — The skill's `description` and docs **Purpose** go stale at phase 2, not phase 4 [Consider]
- **Location:** Phase 2 and phase 4 doc lists; Progress 2.5, 4.1, 4.5
- **Detail:** `dx-refactor-discover`'s frontmatter reads "Hunt the codebase for refactor
  opportunities…" and `docs/reference/skills.md:262`'s Purpose narrows it further to "deepening
  opportunities (shallow modules to turn deep)". Phase 2 makes both inaccurate (the scan is no
  longer depth-only) but its doc list covers only the topic list, count, Reads lines, and three
  narrative pages. Phase 4 corrects the SKILL.md *body* opening line (4.1) and docs Purpose (4.5)
  but never the frontmatter `description`. `lint-skills.mjs` validates the description's *shape*,
  never its accuracy.
- **Why it matters:** the description is the only text a user sees in the `/` menu, and Purpose is
  the reference doc's headline — both would describe a narrower skill than the one that ships, and
  if phase 4 is split off (F4) the correction leaves with it.
- **Fix:** add the frontmatter `description` and `skills.md:262` Purpose to phase 2's doc list and
  Progress; leave phase 4's own Purpose/Writes edit as the second pass.
- **Resolution:** FIXED

### F8 — Research's open question 1 (impl-review / plan-review as consumers) is never ruled on [Consider]
- **Location:** `## Approach`, placement decisions; `frame.md` "Who / what it affects"
- **Detail:** `principle-vocabulary-placement.md`'s "Open for framing" Q1 asks whether the principle
  vocabulary serves only `dx-refactor-discover` or also `dx-impl-review` (its **Patterns** dimension)
  and `dx-plan-review` (its **Architectural fitness** dimension). The frame answered the ≥2 bar with
  `dx-plan` and moved on; the plan settles three other placement questions by name but not this one,
  and neither doc lists it as out of scope.
- **Why it matters:** both review gates judge design quality with `module-design` alone. Once
  `design-lenses` exists, they are its most natural consumers, and their absence is a direct cause of
  the residual handoff gap phase 5 is built to test — so phase 5 may be measuring a gap that a
  one-line call site would have closed.
- **Fix:** rule on it in `## Approach` — either add the load (a one-line edit per skill, with docs)
  or state why the reviewers stay on `module-design` only. Either way phase 5's test gets a clearer
  hypothesis.
- **Resolution:** FIXED

### F9 — Dependency category reaches `dx-plan` only on `type: refactor` [Consider]
- **Location:** `## Approach`, second placement decision
- **Detail:** the stated justification is "`dx-plan` already loads `module-design` on `type:
  refactor`, so the second consumer is served with no new call site." True but partial —
  `dx-plan:54` loads it *only* on `refactor`. The four-row axis (in-process / local-substitutable /
  remote-but-owned / true-external, each with a testing consequence) is most valuable exactly where
  `plan-failure-modes` fires: any change with an external call, whatever its `type`. Research §3
  flagged this ("serves `dx-plan` as much as `dx-refactor-discover`, which may clear the ≥2 bar on
  its own") and the plan resolves it on the narrower reading.
- **Why it matters:** a `type: feature` change with a true-external dependency gets none of this
  vocabulary, and the axis partly overlaps `plan-failure-modes`'s territory without either file
  referencing the other — a latent duplication in the reference set.
- **Fix:** state in `## Approach` that the axis is deliberately refactor-scoped for now, or add a
  one-line cross-reference from `plan-failure-modes` so the overlap is visible rather than
  accidental.
- **Resolution:** FIXED

### F10 — Phase 4's sub-agent step has no failure or reconciliation path [Consider]
- **Location:** Phase 4, moves 1–3; Progress 4.8
- **Detail:** the step spawns 3–4 parallel design agents and deliberately does *not* block on the
  user's reply to the framing ("proceed immediately; the parallelism is the point"). Two unhandled
  cases: an agent that returns nothing, errors, or produces an unusable sketch — is the comparison
  run on the survivors, or retried? — and a user reply that contradicts the framing after the agents
  are already in flight, since the framing is what their briefs were built from. 4.8 covers only the
  convergence case (three phrasings of one shape).
- **Why it matters:** this is the plan's only genuinely concurrent machinery, and the one place where
  partial failure is likely; without a stated rule the skill will improvise differently every run,
  which is what `## Done when` criteria exist to prevent.
- **Fix:** one line each — proceed with whatever returns and say so if fewer than three come back;
  and if the user's reply changes the constraints, discard and re-spawn rather than reconciling
  sketches built on the old framing.
- **Resolution:** FIXED

### F11 — Phase 3's glossary/lessons ordering may be a no-op against the plan's own standard [Consider]
- **Location:** Phase 3, second half of the §2 bullet; Progress 3.1
- **Detail:** the change is "order the `glossary.md` / `lessons.md` read explicitly *before* the
  fan-out." Those reads already sit in §1, which already precedes §2's fan-out — research §5 itself
  says "ordering it explicitly before the fan-out costs nothing." Unless the intent is to *move* the
  reads from §1 into §2 as scan targeting (which phase 1's "§1 shrinks to the load plus the
  vocabulary anchor" does not say), the added sentence restates existing document order.
- **Why it matters:** the plan lists "skill-authoring / No-op test on every sentence" as a standard
  to apply, and this is the one added line most likely to fail it — an implementer will add a
  sentence rather than question whether it earns its place.
- **Fix:** say explicitly whether the reads *move* into §2 (making it a real change) or whether this
  bullet is dropped as already-satisfied. Recency targeting, the other half of 3.1, is unaffected.
- **Resolution:** FIXED

## Verdict

**revise** — the analysis is sound and the placement decisions are well-argued; three concrete gaps
(a stale behavior source of truth, a vocabulary collision the clause's promotion creates, and a
release-hygiene phase that can ship uncovered) should be closed before implementing.
