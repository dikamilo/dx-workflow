# Plan: Broaden dx-refactor-discover beyond deep modules to general design principles

## Approach

Two composing halves, exactly as `frame.md` chose them: **deepen the primary lens** so a finding can
say what depth buys and whether the deepening is testable afterward, and **broaden the sweep** so
problems outside the module-depth lens get found at all. `module-design` stays the primary lens and
the sole phrasing vocabulary; the broadened sweep changes what is *found*, never how it is *said*.

Three placement decisions were open after framing; all three are now settled:

- **The new reference is `design-lenses`** — it carries both registers the frame identified
  (principles name what is wrong, known shapes name what the code could become), so
  `design-principles` under-describes it. Two consumers clear the ≥2 extraction bar:
  `dx-refactor-discover` (scan criteria) and `dx-plan` (solution design, **unconditional**).
- **The feasibility axis (dependency category) goes in `module-design.md`**, not the new file. It
  routes on seams and adapters — the vocabulary the same phase adds — and `dx-plan` already loads
  `module-design` on `type: refactor`, so the second consumer is served with no new call site.
  **Deliberately refactor-scoped:** `dx-plan:54` loads `module-design` on `refactor` *only*, so a
  `type: feature` change with a true-external dependency does not see the axis — accepted rather
  than fixed by widening the load, since the axis is written to route seams and adapters, not to
  price external calls in general. Where it does overlap `plan-failure-modes`, phase 1 makes the
  overlap explicit with a one-line cross-reference instead of leaving it accidental.
- **The two review gates stay out** — research's open question 1, ruled on here rather than left
  hanging. `dx-impl-review`'s **Patterns** dimension and `dx-plan-review`'s **Architectural fitness**
  are the vocabulary's most natural next consumers, and neither gains it in this change. Giving a
  *reviewer* a diagnosis vocabulary changes what findings it emits, not just how it phrases them —
  a separate concern with its own docs and `DESIGN.md` surface. Keeping them out also keeps phase 5
  honest: it measures the real handoff gap rather than one already patched by a call site. Noted as
  a follow-up candidate, not an oversight. (For the record, the gates are further from this
  vocabulary than the research assumed: `dx-impl-review:15` loads `module-design` only on
  `type: refactor`, and `dx-plan-review` loads it not at all.)
- **`module-design.md` does not split.** It grows 23 → ~50 lines, inside the existing reference range
  (mean ~28, max 52 — `effort-md`). Splitting would double the call site for the two skills needing
  both halves and add a fourth hand-maintained topic list for no gain.

Three process refinements research raised and the frame left unruled are **in scope**: the one-line
`Shape: before → after` per finding (frame-endorsed as the value salvaged from the rejected HTML
report), an opinionated closing top pick, and recency-weighted scan targeting. All three are caused
by the broadening — more lenses means more candidates, so prioritization and a strong read matter
more than they did with one lens.

Cited prior, not re-litigated: `context/archive/2026-08-06-plan-design-coverage/plan.md` settled both
the ≥2 extraction bar applied in each direction within one change, and the refusal to bundle
concerns into one file that every consumer loads whole. This plan follows both — `design-lenses` is
extracted because it has two consumers; the feasibility axis is *not* extracted because its consumers
already load `module-design`.

**Scope reversal, decided during planning (phase 4).** `frame.md` put the operational design-it-twice
out of scope ("belongs to `/dx-plan`; `dx-refactor-discover` explicitly does not design interfaces"),
echoing research §9. That is reversed on the user's decision: **`dx-refactor-discover:30`'s "Do not
design interfaces yet" is dropped**, and the skill gains an opt-in parallel-sub-agent exploration of
alternative interfaces. The rationale that carries it: discovery already decides *what* to refactor,
and picking well requires some sense of *how it might look* — a candidate whose alternatives all
look bad should not be promoted. The cost research named (a discover skill doing two jobs) is
contained three ways: it fires **only after the user picks**, it is **opt-in**, and it produces
interface *sketches*, not a plan — the skill still writes no `plan.md` and edits no code. It stays
**inline in `dx-refactor-discover`** with one consumer, per the ≥2 rule; `dx-plan` needs no edit,
since the sketches ride into the promoted change's seed artifact, which `dx-plan` §1 already reads as
upstream.

**Bundling decided, not overlooked.** Phase 4 is independently deployable and would qualify as its own
change under the two-level model; it stays here deliberately. It edits the same two sections of the
same skill that phases 1 and 3 edit (§3's finding shape, §4's handoff) and consumes phase 1's
vocabulary directly — `Shape: before → after`, dependency category, the wide sense of interface —
so splitting it buys a second `change.md` and a second review cycle at the cost of sequencing two
containers against one file. The bundling risk is real and accepted: a problem in the sub-agent
machinery must not block phases 1–3, so phase 4 lands last and its phases are independently
committable.

**`DESIGN.md` surface, decided once.** §9's `refactor-discover` paragraph is the whole prose surface
this change moves: phase 2 breaks "scans the codebase using the `module-design` reference", phase 4
breaks "presents findings **inline**… and you pick" (a pick can now be explored first). §7.6 needs
**no** edit — the sketch rides inside the existing `research/<topic>.md` / `frame.md` seed, and that
row names only `diagnosis.md` / `brainstorm.md`. §14 **rule 4** does: it names
`Explore`/`general-purpose` as the fan-out agents, and phase 4 adds the built-in `Plan` agent.

**Caveat carried forward (visible, accepted).** `dx-plan` gains one *unconditional* reference load,
in the largest skill in the set. Justified by the frame — design principles apply to any design, not
only refactors — and it is what clears the ≥2 bar. The mitigation is that `design-lenses` stays a
bare recruitment list (~15 lines, no definitions); if it ever grows into a taxonomy, every plan run
pays. Phase 2 holds that line explicitly.

**Caveat the frame told planning to verify, not assume.** A principle-lens finding may name its
diagnosis ("SRP: changes for two unrelated reasons…") while `dx-frame` / `dx-research` /
`dx-impl-review` load only `module-design`. The cash-out rule is the mitigation. Phase 4 tests it
rather than trusting it.

## API & contracts

The contract surface here is the `dx-references` topic name, which is a string consumed across
skills and mechanically validated.

- **Added, additive:** topic `design-lenses` → `skills/dx-references/references/design-lenses.md`.
  Call sites: `dx-refactor-discover`, `dx-plan`. No existing caller changes behavior.
- **Changed, additive:** `module-design.md` gains sections. Its topic name and all five call sites
  are untouched; the three consumers that need only the shape vocabulary (`dx-frame`, `dx-research`,
  `dx-impl-review`) load ~27 more lines than before. Additive, not breaking — accepted as the cost of
  keeping one file (see Approach).
- **No breaking change, so no compatibility path is needed.** Nothing is renamed or removed.
- **Four hand-maintained lists must move together** with the new topic (none is derived):
  1. `skills/dx-references/references/design-lenses.md` — the file itself.
  2. `skills/dx-references/SKILL.md:3` — the topic list hardcoded in the frontmatter `description`.
  3. `docs/reference/skills.md:294` — lists the topics **and hardcodes the count** ("the **twelve**
     topics" → thirteen).
  4. `docs/reference/skills.md` — the **Reads:** line of every consuming skill (`dx-refactor-discover`
     at :262, `dx-plan`).
- **Enforcement:** `scripts/lint-skills.mjs:97` resolves every `` dx-references` with [topic ]`<topic>` ``
  call site against `references/<topic>.md` — a hard FAIL if the file is missing. Topic names must be
  lowercase kebab; `design-lenses` is valid. `skills.sh.json` needs no edit (skill directories only).

## Standards to apply

- [ ] **skill-authoring / Use skill-creator**: author every `SKILL.md` edit through `skill-creator`,
      not by hand-editing in isolation.
- [ ] **skill-authoring / evals — deviation, stated not dropped**: the standard requires evals for
      non-trivial behavior changes. No eval harness exists in this repo (`package.json` ships only
      `lint:skills`), and both edited skills are `disable-model-invocation: true`, so the "does it
      fire" half is moot. Verification falls back to sandboxed subagent runs of
      `/dx-refactor-discover` against this repo. Declared here per the 2026-07-28 lesson rather than
      silently skipped.
- [ ] **skill-authoring / No-op test on every sentence**: every added line must be one the model does
      *not* already obey. The dependency-category routing and the banned-words cash-out rule pass
      (research §3, §4 argue this explicitly); a definition of SOLID would not, and is banned.
- [ ] **skill-authoring / Shared reference, not duplication**: `design-lenses` is extracted only
      because it has two consumers; nothing is copy-pasted or deep-linked between skills.
- [ ] **skill-authoring / Frontmatter is the invocation cost**: `dx-references`'s `description` grows
      by exactly one topic name — no prose.
- [ ] **skill-authoring / Derive, don't maintain**: scan targeting reads `git log` at run time; no
      maintained hot-path list.
- [ ] **skill-authoring / No auto-chain**: unchanged — both skills still print the next command and stop.
- [ ] **skill-authoring / Completion criteria**: `dx-refactor-discover`'s `## Done when` stays accurate
      as its finding shape changes.
- [ ] **CLAUDE.md / docs sync**: no `skills/` diff ships without its `docs/` **and `DESIGN.md`** diff
      in the same phase (`DESIGN.md` is the stated behavior authority; nothing lints it).
- [ ] **CLAUDE.md / changesets**: one changeset per phase touching `skills/**` (phases 1–4, plus 6 if triggered).

## Priors & gotchas

- **Skills ship without evals — no harness exists (2026-07-28).** Directly in play: this change
  modifies two skills' behavior. Applied above as a stated deviation in `## Standards to apply`, per
  the lesson's own "how to apply". Do not silently skip it, and do not build eval infra here — that
  remains a candidate slice of `sdlc-hardening`.
- **No length gate exists, and prior art forbids inventing one** (`plan.md` of
  `2026-07-28-dx-brainstorm`: "length that buys accuracy is fine. Don't report or gate on
  size-vs-siblings"). `change.md`'s "token-efficient" constraint is therefore the **no-op test**, a
  doctrine constraint — not a line budget. Do not trim an accurate line to hit a size target.

## Phases

### Phase 1: Deepen the lens — `module-design` vocabulary + the finding shape
End-to-end and demoable: after this phase a `/dx-refactor-discover` run produces findings that state
the payoff of depth, whether the deepening is testable, and the before→after shape — with no
broadening yet.

- `skills/dx-references/references/module-design.md` gains, at the file's existing judgment-rule
  density (3–4 lines each, rules not definitions):
  - **Leverage and locality** — what depth *buys*. Leverage = capability per unit of interface
    learned; locality = where change, bugs and verification concentrate.
  - **Adapter vs implementation** — adapter is a *role* at a seam, implementation is substance; they
    vary independently.
  - **One adapter = hypothetical seam, two = real** — the falsifiable rule for when proposed
    indirection is justified, complementing the deletion test (which judges *existing* complexity).
  - **Internal vs external seams** — a deep module may hold private seams its own tests use; don't
    expose them through the interface. Resolves the ambiguity in "interface = the test surface".
  - **Interface ⊃ type signature** — invariants, ordering, error modes, required config, performance.
  - **`## Dependency category`** — the four-row feasibility axis (in-process / local-substitutable /
    remote-but-owned / true-external) with each row's testing consequence.
  - **`## Rejected framings`** — scoped to how a module's *shape* is described; the contract
    vocabulary `plan-api-contracts` requires inside a plan's `## API & contracts` section is exempt
    (both references reach `dx-plan` on a `type: refactor` change that touches a signature). Each
    banned term paired with *why*: *boundary* (collides with DDD's bounded context) → say seam or
    interface; *component / service / unit* → say module (deliberately scale-agnostic);
    *API / signature* → too narrow for a module's shape, say interface. Plus
    depth-as-leverage explicitly rejecting depth-as-line-ratio, which rewards padding the
    implementation.
- `skills/dx-references/references/plan-failure-modes.md` gains a one-line cross-reference to
  `module-design`'s `## Dependency category` — the two overlap on external calls, and neither file
  currently names the other.
- `skills/dx-refactor-discover/SKILL.md` §1 shrinks to the load plus the vocabulary anchor — the
  anti-drift clause moves *up* into the reference, so all five consumers get the guard, not just this
  skill.
- §3 finding shape gains: a **dependency category** per finding (the feasibility axis, distinct from
  the strength tag's desirability), a one-line **`Shape: before → after`**, and the **cash-out rule** —
  every win named in `module-design` terms ("locality: bugs concentrate in one module"; "two adapters
  justify the seam: HTTP in prod, in-memory in tests"), never "cleaner code" or "easier to maintain".
- §4's seed-summary block in `## Done when` carries the new lines, so the promote-many handoff isn't
  lossier than the inline finding.
- Docs in the same phase: `docs/reference/skills.md` `/dx-refactor-discover` **Reads/Writes**;
  `docs/tutorials/find-refactors.md` (`:35-37`, `:145` narrate the vocabulary load verbatim);
  `docs/reference/glossary.md:17` if its module-design description goes stale.
- Changeset (`npx changeset`, minor).

### Phase 2: Broaden the sweep — the `design-lenses` reference
End-to-end: the scan now finds duplication, coupling, and single-responsibility problems it was
previously blind to, and `dx-plan` reasons with the same lenses during solution design.

- New `skills/dx-references/references/design-lenses.md`, deliberately **bare recruitment, not a
  taxonomy** — named principles with no definitions, per the house idiom (`dx-diagnose:15` names nine
  techniques with zero gloss):
  - Principles: SRP and the rest of SOLID, KISS, YAGNI, DRY, separation of concerns, encapsulation,
    minimise coupling, composition over inheritance, robustness principle, orthogonality.
    **`bounded context` is excluded** — the frame dropped it; `seam` already owns that territory and
    the glossary lists `Boundary` under `_Avoid_`.
  - **One sentence** recruiting known shapes: consider whether a known design pattern, architectural
    style, or domain archetype names the shape, when one genuinely fits. **No catalogue, no
    smell→pattern table, no GoF list** — an enumeration is the sentence class the no-op test deletes,
    and a checklist of patterns to satisfy pulls directly against KISS and YAGNI standing in the same
    file.
  - **A principle name is a diagnosis, never a win.** "Violates SRP" is banned exactly as "cleaner
    code" is; the required shape is "changes for two unrelated reasons, so every pricing edit risks
    the tax path". This is the clause that makes the handoff survivable.
- `skills/dx-references/SKILL.md:3` — add `design-lenses` to the hardcoded topic list.
- `skills/dx-refactor-discover/SKILL.md` §2 — the broadened scan criteria plus the known-shape
  sentence. `module-design` stays primary; **every finding is still reported in `module-design`
  terms regardless of which lens found it**, so a layering violation is stated as "this module
  reaches through two interfaces to the store; the seam belongs at X."
- `skills/dx-plan/SKILL.md` **§4** (`Write plan.md`) — one unconditional `design-lenses` load, its own
  line directly under the heading, alongside the existing `plan-template` load. **Not §2**: that
  step's reference block is explicitly conditional ("load only the topics that apply… a change
  touching none of these loads none of them"), so an unconditional load there breaks its invariant.
  §4 is where solution design is actually written and where the sibling `module-design` load already
  sits (`dx-plan:54`); no sentence of §2 changes. Hold the reference to ~15 lines — this is the load
  every plan run pays for.
- The skill's frontmatter `description` and `docs/reference/skills.md:262` **Purpose** both go stale
  *here*, not at phase 4 — each still says depth-only ("deepening opportunities (shallow modules to
  turn deep)"). Widen both now; phase 4 makes a second pass for the interface-sketch wording.
  `lint-skills.mjs` checks the description's shape, never its accuracy, so nothing catches this.
- Docs in the same phase: `DESIGN.md` §9 (`refactor-discover` no longer scans with `module-design`
  alone); `docs/reference/skills.md:294` topic list **and the hardcoded count**
  (twelve → thirteen); `/dx-refactor-discover` and `/dx-plan` **Reads:** lines;
  `docs/explanation/research-and-frame.md:167-174` ("The refactor twist") since the handoff story now
  has two lenses feeding one vocabulary; `docs/explanation/plan-and-slices.md:174` if `dx-plan`'s
  described reference loads change; `docs/tutorials/find-refactors.md`.
- Changeset.

### Phase 3: Scan targeting and an opinionated read
End-to-end: a broadened scan that prioritizes where deepening actually pays and ends with a
recommendation rather than a menu.

- `skills/dx-refactor-discover/SKILL.md` §2 — **recency as the default prior**: walk back a stretch
  of `git log --oneline` for hot spots and let those paths pull attention first; if changes are
  scattered with no clear hot spot, widen the net. Derived at run time, nothing maintained.
  (Research §5's "order the `glossary.md` / `lessons.md` read before the fan-out" is **dropped** —
  §1 already precedes §2's fan-out, so the sentence states existing document order and fails this
  plan's own no-op test. The reads stay in §1.)
- §3/§4 — a closing **one-sentence top pick**: which candidate to tackle first and why. The strength
  tag ranks confidence, not sequence, and the two differ (a `Strong` finding in a cold file is worth
  less than a `Worth exploring` one in a hot path).
- Docs: `docs/tutorials/find-refactors.md` walkthrough, `docs/reference/skills.md` Purpose/Reads.
- Changeset.

### Phase 4: Design it twice — alternative interfaces for the pick
End-to-end: the user picks a candidate, optionally explores three or four genuinely different
interfaces for it in parallel, and the promoted change carries the winning sketch as upstream context.

- **`skills/dx-refactor-discover/SKILL.md` §3 — drop "Do not design interfaces yet."** Replace it with
  the narrower scoping rule it becomes: the *scan* stays at shape level (`Shape: before → after`) —
  interface design happens only after a pick, never across N candidates.
- The skill's opening line ("discovers and hands off; it does not plan or edit code") gets a matching
  correction: it now sketches interfaces for a pick, and still writes no `plan.md` and edits no code.
- **§4 gains an opt-in step, before promotion:** offer to explore alternative interfaces for the
  picked candidate. Three moves, in order:
  1. **Frame the problem space to the user first** — the constraints any new interface must satisfy,
     the dependencies and their category, and a rough illustrative code sketch to make the
     constraints concrete (*not* a proposal). Show it and **proceed immediately**: the user reads and
     thinks while the sub-agents work. The parallelism is the point; don't block on a reply.
  2. **Spawn 3–4 sub-agents in parallel**, each under one **differing forcing constraint** —
     minimize the interface (1–3 entry points, maximum leverage per entry point) · maximize
     flexibility and extension · optimize for the most common caller, make the default case trivial ·
     ports & adapters, spawned when the dependency category is *remote-but-owned* or *true-external*.
     The differing constraint is the whole mechanism; each design must be **radically different**,
     since unconstrained agents converge on the same shape.
  3. Each gets a **technical brief of its own** — file paths, coupling details, dependency category,
     what sits behind the seam — separate from the user-facing framing in (1), because a sub-agent
     starts cold. The brief carries **both vocabularies**: `module-design` terms for structure and
     `foundation/glossary.md` terms for the domain, so the returning designs name things consistently
     and comparably.
- **Two rules for the concurrent path**, since it is the one place partial failure is likely:
  an agent that returns nothing, errors, or comes back unusable is **dropped, not retried** —
  compare the survivors and say plainly that fewer than three came back. And if the user's reply to
  the framing **contradicts the constraints the briefs were built from**, discard the in-flight
  sketches and re-spawn; don't reconcile designs built on a superseded framing.
- Each agent returns the same five things, so they're comparable: **interface** (types, methods,
  params — plus invariants, ordering, error modes, i.e. the wide sense of interface phase 1 pins
  down) · **usage example** from a caller's side · **what the implementation hides behind the seam** ·
  **dependency strategy and adapters** · **trade-offs — where leverage is high and where it's thin.**
- Present them **sequentially**, compare on **depth, locality, and seam placement** — the
  `module-design` axes, so this stays inside the one vocabulary — and close with an **opinionated pick
  or hybrid**, matching the top-pick discipline from phase 3.
- **The chosen sketch rides into the promoted change** as part of its seed `research/<topic>.md` (or
  `frame.md`), so `/dx-plan` reads it as upstream and doesn't re-derive it. This is what makes the
  reversal pay: the exploration happens once, at the moment the information is freshest. On the
  promote-many path, the seed summary carries it per finding explored.
- **Not** a second reference: one consumer, so it stays inline per the ≥2 rule. `module-design.md`'s
  existing one-line "Design it twice" principle is untouched — it stays a vocabulary file, not a
  procedure, and the other four consumers load no sub-agent machinery. Nor is it a second *file*
  inside the skill: the external material this is drawn from splits the pattern across linked
  sidecar files, which our flat `dx-references` loader and lint don't support.
- Sub-agent type: the built-in architect/`Plan` agent, **not** `Explore` — `Explore` is a read-only
  search agent, and this is design work. `Explore` stays what the §2 scan fans out to.
- Don't re-teach the idea. "Design it twice" and "your first idea is unlikely to be the best" are
  pretrained and already in `module-design.md`; the no-op test deletes them here. What earns its place
  is the operational machinery — differing constraints, the shared return shape, framing before
  spawning.
- **Provenance:** the operational detail above comes from external material supplied by the user
  mid-planning, handled per `untrusted-content` — its embedded agent directives were read as a
  described practice and evaluated against house rules, never executed. Same treatment as
  `research/refactor-skill-structure-and-process.md`.
- Docs in the same phase: `DESIGN.md` §9 (a pick can be explored before promotion) and §14 rule 4
  (the built-in `Plan` agent joins `Explore`/`general-purpose` as a named fan-out agent);
  `docs/reference/skills.md` `/dx-refactor-discover` **Purpose/Writes** (the
  seed artifact now carries interface alternatives); `docs/tutorials/find-refactors.md` gains the
  walkthrough section; `docs/explanation/research-and-frame.md` if the seed artifact's described
  content widens.
- Changeset.

### Phase 5: Verify the handoff, then release hygiene
No `skills/**` diff of its own — this is the gate the frame asked for by name.

- **Test the frame's live caveat, don't assume it.** Take a principle-lens finding (e.g. an SRP
  diagnosis) through promotion into a `type: refactor` change and read it as `dx-frame` /
  `dx-research` / `dx-impl-review` would, with **only** `module-design` loaded. If the cash-out rule
  holds, nothing is lost and the residual gap is closed. If it is lossy, **stop and open phase 6** —
  the relaxation is a `skills/**` edit and phase 5 carries no changeset, so it does not land here.
- `npm run lint:skills` clean (it re-checks every call site and the docs-heading sync).
- Walk **each phase's diff individually** and confirm every phase touching `skills/**` has its own
  changeset. CI's gate only checks that *some* `.changeset/*.md` exists, so a multi-slice branch can
  pass while phases 2 and 3 go uncovered.

### Phase 6 (conditional): apply the narrowest relaxation
Runs **only if phase 5's read-back came back lossy.** Skipped entirely otherwise — the whole point of
5.3 is that this phase should not be needed.

- Apply the frame's named narrowest relaxation — allow a named shape inside the
  `Shape: before → after` line only — to `dx-refactor-discover/SKILL.md` §3 and/or
  `module-design.md`. Do **not** loosen the anti-drift clause itself; that is the wider relaxation
  the frame ruled out.
- Docs + `DESIGN.md` in the same phase, per the standard: the finding shape changed again.
- Its own changeset — this is why the relaxation gets a phase instead of riding phase 5, whose 5.2
  audit runs before it and could not have covered it.
- Re-run 5.2's per-phase audit over this phase.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Deepen the lens
#### Automated
- [x] 1.1 `module-design.md` carries leverage/locality, adapter-vs-implementation, one-vs-two adapters, internal-vs-external seams, interface ⊃ signature, `## Dependency category`, `## Rejected framings` (scoped to module shape, with the `## API & contracts` exemption stated) — e8df4c0
- [x] 1.2 `plan-failure-modes.md` cross-references `module-design`'s `## Dependency category`; `dx-refactor-discover` §1 reduced to load + anchor; anti-drift clause no longer duplicated in the skill — e8df4c0
- [x] 1.3 §3 finding shape carries dependency category, `Shape: before → after`, and the cash-out rule; §4 seed summary matches — e8df4c0
- [x] 1.4 `docs/reference/skills.md` + `docs/tutorials/find-refactors.md` (+ `docs/reference/glossary.md:17` if stale) updated — e8df4c0
- [x] 1.5 `npm run lint:skills` passes — e8df4c0
- [x] 1.6 Changeset added — e8df4c0
#### Manual
- [x] 1.7 Sandboxed `/dx-refactor-discover` run on this repo yields findings with a dependency category and a non-generic win (standing in for the absent eval harness)

### Phase 2: Broaden the sweep
#### Automated
- [x] 2.1 `references/design-lenses.md` created — bare principles, no `bounded context`, one known-shape sentence, no catalogue, the diagnosis-is-never-a-win clause — a262f7b
- [x] 2.2 `dx-references/SKILL.md:3` topic list includes `design-lenses` — a262f7b
- [x] 2.3 `dx-refactor-discover` §2 broadened; all findings still phrased in `module-design` terms — a262f7b
- [x] 2.4 `dx-plan` **§4** loads `design-lenses` unconditionally (not §2 — its block is conditional by design); §2 untouched — a262f7b
- [x] 2.5 `dx-refactor-discover` frontmatter `description` and `docs/reference/skills.md:262` **Purpose** no longer say depth-only; `DESIGN.md` §9 no longer says the scan uses `module-design` alone; `docs/reference/skills.md` topic list **and count** (twelve → thirteen) + both Reads lines; `research-and-frame.md`, `plan-and-slices.md`, `find-refactors.md` updated — a262f7b
- [x] 2.6 `npm run lint:skills` passes — a262f7b
- [x] 2.7 Changeset added — a262f7b
#### Manual
- [x] 2.8 `design-lenses.md` re-read against the no-op test — no line defines a principle the model already knows; file still ~15 lines
- [x] 2.9 Sandboxed `/dx-refactor-discover` run on this repo yields ≥1 finding whose diagnosis is non-module-depth (coupling, duplication, SRP), cashed out in `module-design` terms — the broadening demonstrably finds what the pre-change scan was blind to. Keep this finding: it is 5.3's input

### Phase 3: Scan targeting and an opinionated read
#### Automated
- [x] 3.1 §2 carries recency-weighted targeting (glossary/lessons reads stay in §1 — no ordering sentence added) — 1a789b2
- [x] 3.2 §3/§4 close with a one-sentence top pick — 1a789b2
- [x] 3.3 Docs updated (`find-refactors.md`, `skills.md`) — 1a789b2
- [x] 3.4 `npm run lint:skills` passes — 1a789b2
- [x] 3.5 Changeset added — 1a789b2

### Phase 4: Design it twice
#### Automated
- [ ] 4.1 §3's "Do not design interfaces yet" replaced by the scan-stays-at-shape-level rule; the skill's opening line corrected
- [ ] 4.2 §4 carries the opt-in step: frame the problem space → spawn 3–4 constrained sub-agents (ports & adapters one gated on dependency category) → compare on depth/locality/seam placement → opinionated pick or hybrid
- [ ] 4.3 Failure/reconciliation rules stated: drop non-returning agents and say so; re-spawn rather than reconcile if the user's reply contradicts the framing
- [ ] 4.4 Per-agent brief specified: own technical brief, both vocabularies, the five-part return shape
- [ ] 4.5 Chosen sketch is carried into the promoted change's seed artifact (and into the seed summary on the promote-many path)
- [ ] 4.6 `DESIGN.md` §9 (pick can be explored before promotion) + §14 rule 4 (`Plan` agent named); docs updated (`skills.md` Purpose/Writes, `find-refactors.md`, `research-and-frame.md` if the seed content widens)
- [ ] 4.7 `npm run lint:skills` passes
- [ ] 4.8 Changeset added
#### Manual
- [ ] 4.9 Sandboxed run: the three designs come back genuinely different, not three phrasings of one shape — if they converge, the constraints aren't biting and need sharpening
- [ ] 4.10 `## Done when` still accurate now that a pick can be explored before promotion

### Phase 5: Verify the handoff, then release hygiene
#### Automated
- [ ] 5.1 `npm run lint:skills` clean on the full branch
- [ ] 5.2 Per-phase diff walk confirms every `skills/**`-touching phase has its own changeset
#### Manual
- [ ] 5.3 The principle-lens finding from 2.9 read back with only `module-design` loaded — cash-out rule holds, or the read-back is recorded as lossy and phase 6 opens

### Phase 6 (conditional — only if 5.3 came back lossy)
#### Automated
- [ ] 6.1 Narrowest relaxation (named shape inside the `Shape:` line only) applied to `dx-refactor-discover` §3 / `module-design.md`; anti-drift clause itself untouched
- [ ] 6.2 Docs + `DESIGN.md` §9 updated for the changed finding shape
- [ ] 6.3 `npm run lint:skills` passes
- [ ] 6.4 Changeset added
- [ ] 6.5 5.2's per-phase changeset audit re-run over phase 6
