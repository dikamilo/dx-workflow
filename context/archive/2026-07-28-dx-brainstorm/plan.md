# Plan: dx-brainstorm entry point

## Approach

Add `dx-brainstorm` as a third **discovery entry** — a user-invoked, interactive-only conversation that runs *before* `dx-new`, questions whether the problem is real, weighs ≥2 alternatives plus a priced do-nothing, and converges on one of four exit ramps. Deciding to build nothing is a terminal outcome that writes nothing.

Its output is a dedicated **`brainstorm.md`** at the container root — a fourth artifact kind alongside `research/`, `frame.md`, and `diagnosis.md`. The skill self-contains its own promotion: a one-shippable-unit conclusion writes `context/changes/<id>/change.md` + `brainstorm.md`; a bundling-test-says-effort conclusion writes `context/efforts/<id>/effort.md` + `brainstorm.md`. In both cases it writes only the identity file and its own artifact, then prints the next command and stops — slice decomposition stays owned by `dx-roadmap`, child changes by `dx-new`.

**Two deliberate reversals of `frame.md`, recorded so they don't read as drift:**

1. **`frame.md` ruled a root-level `brainstorm.md` out of scope** ("`diagnosis.md` had to be taught to five separate readers") in favour of reusing `frame.md` as the artifact. Reversed. The frame's cost argument is real but bounded (~6 additive one-line reader edits); what it missed is decisive: if `dx-brainstorm` writes `frame.md`, then `/dx-frame <id>` afterwards either refuses on its guard or overwrites the brainstorm's conclusion. Running `dx-frame` on top of a brainstorm is wanted behaviour, and the frame-shaped artifact makes it structurally impossible. Secondarily, a brainstorm is a distinct kind — a divergent conversation carrying *what was rejected and why building nothing lost* — which neither Research (investigation-with-provenance) nor Frame (problem framing) has a home for; the glossary already separates Diagnosis from Research on exactly this axis. A second root-level discovery artifact turns `diagnosis.md` from a lone exception into a pattern.
2. **`frame.md` chose the `dx-refactor-discover` seed-summary pattern for the effort route** (print `/dx-new "<summary>"`, write nothing). Softened: `dx-brainstorm` writes `effort.md` + `brainstorm.md` directly. That choice was sound when the output was a summary blob; a structured five-section `brainstorm.md` flattened into a shell argument would either be mangled or written twice, and `dx-new` has no mechanism to reconstitute it. Writing the identity file is symmetric with the change route and takes over nothing — `frame.md`'s rejection of "always self-contained" was aimed at taking over *roadmap + child changes*, which this does not do.

Everything else in `frame.md` stands: four exit ramps with no parking, no durable brainstorm register, the shared `interview` challenger reused as-is rather than a bespoke adversarial subagent, and no auto-chaining past the container.

**Caveats carried forward (from the adversarial pass, not blocking):**

- Adding a `brainstorm.md` row to `DESIGN.md` §7.6 while `diagnosis.md` is still absent from that catalog would be incoherent, so Phase 3 adds **one row covering both** seed artifacts. This is a hair beyond the strict change boundary; it is a single table row and the catalog's whole purpose is completeness.
- `foundation/lessons.md` is empty beyond its header, so `## Priors & gotchas` below draws on the settled prior decisions catalogued in `research/precontainer-artifact-and-dx-new-promotion.md` §6 instead.

## Standards to apply

> Matched from `context/standards/global/` — `backend/`, `frontend/`, and `testing/` are empty and no code ships here.

- [ ] **skill-authoring — use `skill-creator`**: draft `skills/dx-brainstorm/SKILL.md` through the `skill-creator` skill, not by hand.
- [ ] **skill-authoring — evals**: *stated deviation.* No eval harness exists in this repo (`package.json` has only `lint:skills`), and the "does it fire" half is moot for a user-invoked skill. Skipping the harness; Phase 4 records the gap via `/dx-lesson` so it is visible rather than silently dropped, and names eval infra as a candidate future slice of `sdlc-hardening`.
- [ ] **skill-authoring — token efficiency**: `disable-model-invocation: true` with a terse human-facing description (no trigger lists). No-op test every body sentence; body stays principle-first.
  - *Clarified during Phase 1 (user's call).* "Comparable in size to `dx-refactor-discover`" is an **illustration, not a threshold** — sibling sizes show what a lean skill tends to look like, they don't cap this one. The real bar is instructions an agent can execute clearly and accurately; length that buys accuracy is fine. Don't report or gate on size-vs-siblings.
- [ ] **skill-authoring — shared vs collocated**: the challenger and question discipline are pulled from the shared `interview` reference (≥2 consumers). Brainstorm-only text — the exit-ramp table, the divergence moves — stays **collocated** in `SKILL.md`; do not extract a new `dx-references` topic.
  - *Refined during Phase 1 (user's call).* The `brainstorm.md` template moved out of `SKILL.md` into the skill's **own** bundled `skills/dx-brainstorm/references/brainstorm-md.md`, read via `${CLAUDE_SKILL_DIR}` on the two writing ramps only. Still collocated — no new shared `dx-references` topic, so the ≥2-consumers rule is untouched — and the two terminal ramps — the outcomes where nothing is built — never load the template at all. That lazy-load win is the point; the body's absolute size is not a target either way. Precedent: `dx-init` already loads `${CLAUDE_SKILL_DIR}/assets/standards/global/*.md` the same way. Consequence for Phase 2: readers are taught `brainstorm.md`'s sections **inline in their own skill bodies** — they must not deep-link this file, per the house rule against reaching into another skill's directory.
- [ ] **skill-authoring — guard clause first**: opens by resolving `context/` scaffolding (missing → `/dx-init`), plus the interactive-only guard.
- [ ] **skill-authoring — derive, don't maintain**: no register, no index, no sidecar. The archive sweep is `ls`/grep over `context/changes/**` and `context/archive/**` at read time.
- [ ] **skill-authoring — no auto-chain**: creating the container is this skill's own deliverable; it never runs `/dx-plan`, `/dx-frame`, or `/dx-roadmap`. State this boundary explicitly in the body, as `dx-refactor-discover` §4 does, or review reads it as a violation.
- [ ] **skill-authoring — naming consistency**: read `foundation/glossary.md`; add the **Brainstorm** term with `_Avoid_` lines against Research and Frame.
- [ ] **skill-authoring — completion criteria**: a `## Done when` that terminates on routing-sufficiency, not exhaustiveness.
- [ ] **CLAUDE.md docs-sync**: `docs/reference/skills.md` (bidirectionally enforced by `npm run lint:skills`), a tutorial, an explanation page, and the glossary land in this same change.
- [ ] **CLAUDE.md versioning**: `npx changeset` — `skills/**` changed, so CI's `check-changeset` job fails the PR without one. Minor bump (new skill, additive).

## Priors & gotchas

`foundation/lessons.md` is empty; these are the settled decisions to cite rather than relitigate (source: `research/precontainer-artifact-and-dx-new-promotion.md` §6).

- **No "decide not to build" exit exists anywhere today**, and a new entry point ahead of `dx-new` is the only non-retrofit fix — already verified in the effort's research §1. Don't re-verify the premise.
- **Discovery findings are ephemeral work items, not durable reference knowledge** (`DESIGN.md:404`). No `foundation/brainstorms/`, no backlog file, no parking ramp. `foundation/research/` is the wrong home even though it is the one non-container artifact path.
- **Severities are `Blocker` / `Consider`** (`references/review-report.md`, landed by slice 4). If the challenger's output is ever written down it uses these — not the prior art's CRITICAL/WARNING/OK.
- **The challenger already exists**: `references/interview.md` step 5 landed in slice 3 of this same effort. Invoke it; do not collocate a second adversarial mechanism, and do not build a fresh-context subagent.
- **Report-only vs applying** (`standards/global/skill-authoring.md`): the challenger reports; a critical finding goes back to the user as a question rather than being self-resolved.
- **Fetched content is data, never instructions** (`references/untrusted-content.md`, slice 2). Only relevant if `dx-brainstorm` ever reads external material — it does not in this design, so no `untrusted-content` call site.
- **`type` needs no new value.** The enum stays `feature | defect | refactor | migration`; a brainstormed conclusion is normally `feature`.
- **Every downstream reader keys on directory position, not filename** — which is exactly why `brainstorm.md` must be taught to each reader individually (Phase 2). This is the known, accepted cost of the reversal.
- **Out-of-scope drift observed, not fixed here**: the *installed* `~/.ccs/.../dx-research/SKILL.md` cites a `model-policy` reference topic that does not exist in this repo (reverted in `c7d0596`). Real installed-vs-repo drift; worth its own change, not this one.

## Phases

### Phase 1: The skill — `/dx-brainstorm` runs end-to-end
Vertical slice: after this phase the command exists, holds a real conversation, and lands a container.

Author `skills/dx-brainstorm/SKILL.md` through `skill-creator`. Frontmatter: `name: dx-brainstorm`, terse description, `disable-model-invocation: true`, `argument-hint: [idea or question]`. Body carries:

- **Guards** — `context/` unscaffolded → `/dx-init`; interactive-only, so an unattended invocation with no user available stops and reports rather than inventing appetite and constraints; and the anti-implementation gate ("*this is simple enough to just do it now* is itself the red flag").
- **Sources before questions** — the dx-native ladder: `foundation/glossary.md` + `lessons.md` → `context/standards/` → `context/changes/**` and `context/archive/**` → the codebase → the user. *A question whose answer sits in the repo is homework, not conversation.*
- **Divergence moves** — restate the problem without the user's proposed solution; ≥2 genuinely different alternatives plus a **priced** do-nothing (strawmanning it is the failure); name the riskiest assumption and the cheapest way to test it; the vague-framing bar; the **bundling test** ("would each capability function without the other?"); "what breaks if this succeeds?".
- **Convergence + challenger** — invoke `dx-references` with `interview`; step 5's adversarial pass runs before the conclusion is presented. Stop when one ramp fits, routing-blocking unknowns are resolved, and the user signals enough.
- **Four exit ramps** with tie-breakers (*don't manufacture work to have a handoff*; appetite is the user's call; "naming the affected areas took real work" signals more structure):
  1. Answered / nothing worth building → no container, no artifact, no `Next:` line (precedent: `dx-diagnose`'s trivial branch).
  2. Already covered by an existing or archived change → cite it, stop.
  3. One shippable unit → write `context/changes/<id>/change.md` (invoke `dx-references` with `change-md`) + `brainstorm.md`.
  4. Bundling test found ≥2 independently shippable capabilities → write `context/efforts/<id>/effort.md` (invoke `dx-references` with `effort-md`) + `brainstorm.md`.
- **The `brainstorm.md` template**, collocated: `## The question` · `## Alternatives weighed` (incl. the priced do-nothing and why it lost) · `## Conclusion & route` · `## Resolved unknowns` (a question/answer table — an **empty** table means the chosen route is wrong; keep talking or downgrade the ramp) · `## Not doing`. Write `none` rather than deleting a heading. Path stays kebab-case and space-free.
- **The no-auto-chain boundary**, stated explicitly: creating the container is this skill's deliverable; the rule binds the step *after* it.
- **`## Done when`** + the printed outcomes, in the same shape as sibling skills.

Add the `### \`/dx-brainstorm\`` entry to `docs/reference/skills.md` in this phase — `lint:skills` check 5 fails on a skill folder without one. Follow the fixed entry shape: **Invoke** / **Purpose** (with tutorial link) / **Reads** / **Writes** / **Prints next** (fenced `text` block, verbatim). Add the changeset (`npx changeset`, minor).

Verify: `npm run lint:skills` green; a real `/dx-brainstorm` run lands each of the four ramps correctly.

### Phase 2: Teach the readers — `brainstorm.md` is consumed
Additive one-line edits; no reader's existing behavior changes.

- `dx-plan` §1 — add `brainstorm.md if present` to the upstream read list, beside `diagnosis.md`.
- `dx-frame` — read `brainstorm.md` as **settled context** (beside `diagnosis.md`). This is what makes "run `/dx-frame` on top of a brainstorm" work: the frame deepens the brainstorm's conclusion instead of colliding with it.
- `dx-roadmap` — read the effort's `brainstorm.md` alongside `research/` and `frame.md`; it carries the bundling test's capability split, which is the roadmap's raw material.
- `dx-new` "Promoted entries" — name `dx-brainstorm` as the third discovery skill, and note that when a brainstorm has already run the bundling test the change-vs-effort level is **handed over**, not re-derived. One sentence; no argument, filename convention, or parse is being introduced.
- `references/interview.md` — two additions: (a) the one missing move, *when the user answers with a solution, ask about the problem it solves before adopting it*, into the loop; (b) a `+ brainstorm.md` row in the question-scaling table (skip "is this worth building" questions; problem framing still open unless a `frame.md` also exists).
- `references/change-md.md` and `references/effort-md.md` — show `brainstorm.md` in the container layout beside `diagnosis.md`.

Verify: `npm run lint:skills` green; every `dx-references` call site still resolves.

### Phase 3: `DESIGN.md` — the spec catches up
`DESIGN.md` is the authority; a skill that exists only in `skills/` is half-landed.

- §5 layout block (~:201) — `brainstorm.md` under both `changes/<change-id>/` and `efforts/<effort-id>/`.
- §6 skill inventory table + count (19 → 20), and the `skills/` tree block (~:139).
- §7.4 — add `brainstorm.md` to the list of upstream `plan` reads as gathered context.
- §7.6 — **one row** for seed artifacts promoted by a discovery entry (`diagnosis.md`, `brainstorm.md`), canonical source `dx-diagnose` / `dx-brainstorm`, consumers `plan`, `frame`, `roadmap`. Closes the pre-existing `diagnosis.md` gap in the same row.
- §9 — retitle to cover three discovery entries and add the `dx-brainstorm` subsection; it is the first one that can route to an **effort**, a branch the glossary's "Discovery Entry" definition already sanctions.
- §13 — invocation-mode list stays "two model-invoked"; confirm `dx-brainstorm` is listed user-invoked.
- Line 114-118 entry-path block — add the brainstorm path.
- `context/foundation/glossary.md` **and** `docs/reference/glossary.md` — add **Brainstorm** (`_Avoid_`: Research, Frame). Invoke `dx-domain` rather than hand-editing.

Verify: no stale skill count or list; `npm run lint:skills` green.

### Phase 4: User docs + the recorded deviation
- New `docs/tutorials/brainstorm-an-idea.md`, following the `diagnose-a-bug.md` / `find-refactors.md` pattern — walk one idea through to a routing decision, and show the "nothing worth building" ramp as a real success, not a failure. Use the `documentation` skill (Diátaxis).
- New explanation page (`docs/explanation/divergent-vs-convergent.md` or equivalent) — why the SDLC needs a divergent phase, and why "decide not to build" is a first-class outcome. `CLAUDE.md` requires an explanation page for a new idea the workflow introduces.
- Update the explanation/reference pages that enumerate the discovery entries: `docs/explanation/workflow-overview.md`, `efforts-and-changes.md`, `research-and-frame.md`, `directory-layout.md`, `docs/README.md`.
- `/dx-lesson` — record the evals deviation: *authored `dx-brainstorm` through `skill-creator` without evals because no harness exists in this repo; eval infra is a candidate future slice of `sdlc-hardening`.*

Verify: `npm run lint:skills` green; every page naming the discovery entries names three.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: The skill — `/dx-brainstorm` runs end-to-end
#### Automated
- [x] 1.1 `skills/dx-brainstorm/SKILL.md` drafted via `skill-creator`, frontmatter as specified — 9703efe
- [x] 1.2 Body carries guards, source ladder, divergence moves, challenger, four ramps, `brainstorm.md` template, no-auto-chain boundary, `## Done when` — 9703efe
- [x] 1.3 `docs/reference/skills.md` entry added in the fixed shape — 9703efe
- [x] 1.4 Changeset added (`npx changeset`, minor) — 9703efe
- [x] 1.5 `npm run lint:skills` green — 9703efe
#### Manual
> 1.6–1.9 verified by sandboxed runs, **not** a live interactive session: five `general-purpose` agents each
> executed `SKILL.md` against its own throwaway `context/` scaffold under the scratchpad, with the user's
> answers supplied as a scripted bundle. 30/30 structural assertions passed on the revised skill
> (iteration 2). This tests routing judgment given good answers — it does **not** test the interview
> under pushback, and no `without_skill` baseline was run. Iteration 3 re-ran ramps 1/3/4 after the
> template moved to the skill's bundled reference: 22/22, and it verified the lazy-load claim directly —
> ramp 1 never opened the file, ramps 3 and 4 both did, and both reported the artifact would have been
> materially worse without it (no `## Not doing`, no unknowns table, empty headings deleted rather than
> `none`). Unverified by any run: the no-op trim, the shape pointer moving inside the ramp bullets, and
> the "efforts carry no `type`" clause — all landed after iteration 3.
- [x] 1.6 A real `/dx-brainstorm` run reaches ramp 1 (nothing worth building) with no container and no `Next:` line — 66b5d73
- [x] 1.7 A real run reaches ramp 3 and lands `changes/<id>/change.md` + `brainstorm.md` — 66b5d73
- [x] 1.8 A real run reaches ramp 4 and lands `efforts/<id>/effort.md` + `brainstorm.md` — 66b5d73
- [x] 1.9 A run reaches ramp 2 (already covered, cites the path) and an unattended run stops on the interactive-only guard, both writing nothing — 66b5d73

### Phase 2: Teach the readers — `brainstorm.md` is consumed
#### Automated
- [x] 2.1 `dx-plan`, `dx-frame`, `dx-roadmap` read `brainstorm.md` — a5b474f
- [x] 2.2 `dx-new` "Promoted entries" names `dx-brainstorm` + the handed-over level — a5b474f
- [x] 2.3 `references/interview.md`: solution-as-answer move + `+ brainstorm.md` scaling row — a5b474f
- [x] 2.4 `references/change-md.md` and `effort-md.md` show `brainstorm.md` in the layout — a5b474f
- [x] 2.5 `npm run lint:skills` green — a5b474f
- [x] 2.5a Docs-sync (not in the phase list, required by `CLAUDE.md`): the `Reads` lines for `dx-new`, `dx-frame`, `dx-plan`, `dx-roadmap` in `docs/reference/skills.md` name `brainstorm.md` — a5b474f
#### Manual
> 2.6–2.7 verified by a `skill-creator` eval, **not** a live interactive session: a throwaway project
> (own glossary/lessons/standards) with one change holding a realistic `brainstorm.md` — three
> alternatives plus a priced do-nothing, six resolved unknowns, four items not being done, one standing
> caveat. Baseline was the **pre-edit** skill at `HEAD~1` with `HEAD~1` references, isolating the Phase 2
> diff as the only variable. The scripted user bundle deliberately answered nothing in the resolved-unknowns
> table, so a re-ask surfaced as an invented answer. Results: 2.6 scored 6/6 vs the baseline's 4/6 — the
> baseline never opened `brainstorm.md` (the old step 1 doesn't list it), asked 12 questions vs 6, re-asked
> the settled opt-out model and invented the *opposite* answer (a new default-off `Preference` vs "reuse the
> existing record"), which then propagated into its `frame.md`; it also re-derived the alternatives table,
> dropping the priced do-nothing. That is exactly the collision reversal #1 predicts. 2.7 tied 7/7 vs 7/7:
> the plan baseline found `brainstorm.md` opportunistically via `ls` + `change.md`'s Notes pointer, so the
> assertion was **non-discriminating** — it shows `dx-plan` does skip settled material, not that the edit was
> load-bearing for it (that agent's own counterfactual: a literal reader "would have re-asked ~8-9
> already-settled framing questions"). Sole qualitative delta: the with-edit plan made the brainstorm's named
> cheapest test a gating no-code Phase 1; the baseline left it as prose. A control assertion (standards +
> lessons matching) passed in both, so the harness isn't leaking credit. Untested by any run: the interview
> under a user who pushes back — a scripted user only tests reading discipline. Workspace:
> `scratchpad/dx-brainstorm-readers-workspace/iteration-1/`.
- [x] 2.6 `/dx-frame` on a brainstormed change deepens rather than collides — a5b474f
- [x] 2.7 `/dx-plan` on a brainstormed change skips what `brainstorm.md` settled — a5b474f

### Phase 3: `DESIGN.md` — the spec catches up
#### Automated
- [x] 3.1 §5 layout, §6 inventory + count (19→20) + `skills/` tree, §7.4, line-114 entry paths — 390bc51
- [x] 3.2 §7.6 seed-artifact row (covers `diagnosis.md` + `brainstorm.md`) — 390bc51
- [x] 3.3 §9 covers three discovery entries incl. the effort branch; §13 unchanged at two model-invoked — 390bc51
- [x] 3.4 **Brainstorm** term added to both glossaries via `dx-domain` — 390bc51
- [x] 3.4a Docs-sync (not in the phase list, caused by this change): `docs/reference/glossary.md`'s
  **Discovery entry** entry and `CLAUDE.md`'s skill index both named only two entries — now three — 390bc51
- [x] 3.5 `npm run lint:skills` green — 390bc51
#### Manual
> §15 "Build order (when we scaffold)" step 5 still lists two discovery entries. Left alone deliberately:
> that section is the frozen original bootstrap plan and was never updated for `dx-review-triage` either.
> Observed, not fixed.
- [x] 3.6 No stale skill count or two-discovery-entry phrasing left in `DESIGN.md` — 390bc51

### Phase 4: User docs + the recorded deviation
#### Automated
- [x] 4.1 `docs/tutorials/brainstorm-an-idea.md` written via the `documentation` skill — c87df11
- [x] 4.2 Explanation page on the divergent phase written (`docs/explanation/divergent-vs-convergent.md`) — c87df11
- [x] 4.3 `workflow-overview.md`, `efforts-and-changes.md`, `research-and-frame.md`, `directory-layout.md`, `docs/README.md` updated — c87df11
- [x] 4.3a Docs-sync (not in the phase list, same enumeration): `knowledge-layer.md` said "Two discovery
  entries also feed the layer" — now three, with `dx-brainstorm`'s `/dx-lesson` offer — c87df11
- [x] 4.4 `npm run lint:skills` green; every relative `.md` link across `docs/` resolves — c87df11
#### Manual
> 4.5 was performed **by hand, not by invoking `/dx-lesson`** — the skill is `disable-model-invocation:
> true`, so the Skill tool refuses it. Its body was followed literally instead (guard, `knowledge-layer`
> entry shape, append-only). Consequence: the append is unverified by the skill itself. The entry is also
> flagged as a **promotion candidate** — it will recur on every skill change until an eval harness exists,
> which is `/dx-standards-update`'s trigger, not this change's.
>
> 4.6 verified by a sandboxed run, **not** a live interactive session: one `general-purpose` agent (Opus)
> built a throwaway scaffold matching the tutorial's prerequisites — glossary with **Subscriber**, the 2025
> toast lesson, two non-binding standards, an archived `csv-export` change, a fake tree with an `EventLog`
> table and one email sender — then executed `SKILL.md` four times, once per ramp, with the tutorial's
> answers supplied as a scripted bundle and instructions to derive behavior from `SKILL.md` *before*
> comparing to the tutorial. All 10 behavioral claims PASS and there were **no "skill wrong" findings**:
> across four runs it never printed a `Next:` line on a terminal ramp, never wrote a `roadmap.md`, never
> stamped `type` on an effort, never opened the bundled reference on ramps 1–2, and its ramp-3/4 output was
> byte-identical to `SKILL.md` and `docs/reference/skills.md`. Eleven divergences were against the
> **tutorial**; six were fixed in this commit: a literally wrong printed string on ramp 2 (`Already
> covered:` is the left-hand *label*, so the payload is `Covered by <path>`, and it contradicted
> `docs/reference/skills.md:240`), a do-nothing price and a completed cheap test that both materialised
> without the turns that produce them, a first interview question with no options set or recommendation
> (breaking the `interview` rule the same step cites), "four moves" for §2's six with the bundling test
> relocated, a missing `Nothing to build:` outcome line, and ramp-1 arithmetic that read 90s × 30 as
> ~4 min/dev/week while also saying nobody waits. Five were left as scripted-example latitude (row counts,
> the `change-md` schema comment — which `find-refactors.md` also ships — and invented `Caveat carried
> forward:` labelling). Untested: the interview under a user who pushes back, since a scripted user only
> tests reading and routing discipline. Workspace: `scratchpad/tutorial-walkthrough/`.
- [x] 4.5 `/dx-lesson` records the evals deviation — c87df11
- [x] 4.6 Tutorial walked end-to-end against the real skill — c87df11
