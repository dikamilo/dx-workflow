# Plan: Loop Design it twice through dx-refactor-discover's multi-promote path

## Approach

Two composing halves, exactly as `change.md` scoped them (bundling test: neither is useful alone —
sketches generated but lost before reaching `/dx-plan` are as useless as never generating them):
**loop the §4 offer** so a multi-select promote gets the same chance to sketch alternatives as a
single pick, and **fix the propagation hop** so those sketches (and the unsketched findings alongside
them) actually reach each child change's `/dx-plan` run instead of dead-ending in a printed string.

**Framing inherited from `brainstorm.md`, not re-interviewed.** No `frame.md` exists, and the interview
loop's own rule 3 ("if a file already settles it, explore instead of asking") applies to
`brainstorm.md` here: its `## The question` is the real problem, `## Alternatives weighed` is the
alternatives section, `## Not doing` is out-of-scope, and who/what it affects is derivable —
`dx-refactor-discover`, `dx-new`, and anyone running a promote-many refactor push. Re-asking any of
that would fail the no-op test. Front-loading the framing interview happened by reading, not asking.

**Correction to the brainstorm's own premise (surfaced, not silently applied).** The brainstorm's
"cheapest test" says to trace what `dx-new`'s Promoted-entries section already does for a
single-change promotion and mirror that shape. Tracing it: `dx-refactor-discover`'s own **"One"**
case does not call `dx-new` at all — it says "create the change directly, the same way `dx-diagnose`
self-contains its own promotion" and then writes `change.md` itself. But `dx-diagnose` does not
self-contain either — its own text is "run `/dx-new` stamped `type: defect`... carrying that file as
the change's seed." So `dx-refactor-discover`'s comment is stale, and `dx-new`'s Promoted-entries
section is, as written today, exercised only by `dx-diagnose`. `dx-brainstorm` doesn't call `dx-new`
either (it "creates its own container"). **The template phase 2 mirrors is `dx-diagnose`'s actual
pattern** (hand seed content to `dx-new`, which places it and stamps `type`), not
`dx-refactor-discover`'s inaccurate comment. Not fixing that stale comment here — it isn't required
for either of the two things this change bundles, and touching it would be an unrelated edit in a
section phase 1 already has open for a different reason. Noted for a future cleanup pass.

**Loop mechanics (interview, user confirmed): batched pick, then sequential per-finding.** After the
user names which findings to promote, one question ("sketch any of these first? none / all /
specific ones," recommending just the top pick) replaces today's single yes/no when more than one
candidate was picked. Then §4's existing single-finding mechanics (frame → spawn 3–4 → compare →
stop-and-ask) run once per selected finding, sequentially — never starting the next finding's agents
before the current one's sketch is confirmed. This **is** the fan-out safeguard the brainstorm named:
concurrent sub-agents stay bounded to one finding's batch (3–4) no matter how many findings total, with
no arbitrary numeric cap to invent or maintain. `N = 1` (today's case) skips the batched question
entirely and keeps the plain yes/no — no behavior change for the existing single-pick path.

**§5's "Many" bullet needs no edit.** Its seed-summary wording is already plural-ready — "plus the
chosen sketch for any finding §4 explored" — written for exactly this case even before the loop
existed to feed it. The gap was only that nothing looped the offer to produce more than one sketch,
which phase 1 fixes.

**Effort-level seed shape, decided from what's already load-bearing, not re-derived:**
- `effort.md` deliberately carries **no `type:` field** — `dx-brainstorm`'s own comment says so
  ("Efforts carry no `type`; don't invent one"). So the "refactor effort" signal `dx-new`'s
  child-creation step already promises to read ("marks it a refactor effort") can't be a frontmatter
  field; it's a one-line marker in `effort.md`'s `## Notes`, written once at effort creation and read
  once per child — not a maintained checklist, the same shape as any other frontmatter fact.
- Each promoted finding becomes its **own** `research/<topic>.md` at the effort root — mirroring the
  single-change case, where one finding = one seed research file — rather than one blob file. This is
  what lets `dx-roadmap` §2's existing "one slice per module deepening" rule do its job with zero edits
  of its own: it already reads "every `research/<topic>.md`" as candidate material (§1), so one file per
  finding **is** one candidate per finding, with no new instruction needed in `dx-roadmap`. Confirms
  `change.md`'s "possibly `dx-roadmap`" scope note the other way — it needs no edit.
- Every promoted finding gets a research file regardless of whether §4 sketched it — `dx-roadmap` needs
  the shape of *all* candidates to decompose, not just the explored ones. Only the `Sketch:` line is
  conditional on §4 having run for that finding, matching §5's own "(only if §4 explored this one)."
- A child change still **inherits the whole effort's `research/` in place** (existing, unchanged
  mechanic — `effort-md.md`: "nothing is copied"). A slice-2 `/dx-plan` run will see slice-1's finding
  too. This is accepted, not fixed: it's the same multi-topic-research shape §7.5 already documents for
  every other effort, the noise is one extra research file per sibling finding (not the whole
  multi-finding blob collapsed into one), and `/dx-plan` already treats each research file as a
  separate, possibly-irrelevant topic rather than something it must all use. Filtering research per
  slice would be new mechanics the brainstorm's own routing test asked planning to avoid inventing.

**Caveat carried forward, visible not silent.** The seed summary still crosses a session boundary as a
printed string the user re-types as `/dx-new "<seed summary>"`'s literal argument — `dx-new` recovers
structure by matching the heading `## Refactor opportunities (from /dx-refactor-discover)` and
re-parsing the numbered list back into data. A self-contained design (`dx-refactor-discover` writing
`effort.md` + research files itself, the way it already self-contains the "One" case and the way
`dx-brainstorm` self-contains both its ramps) would avoid this print-then-reparse round trip entirely
and is the more robust shape on its own merits. **Rejected for this change**: `change.md` explicitly
preserves the existing division of labor ("already a multi-step flow owned by other skills... don't
fold all of that in here"), and reopening it is not one of the two things this change bundles. Flagged
here as a real trade-off, not assumed away.

**Adversarial pass (interview rule 5, run before finalizing).** Strongest objection — is a
heading-match parse too fragile a contract for `dx-new` to build real logic on? Mitigated: the same
literal heading string is already `dx-refactor-discover`'s own committed "Done when" text (unchanged by
this plan), and the false-positive risk (a hand-typed `/dx-new "..."` idea that happens to start with
that exact heading) is no worse than the profile `dx-diagnose`'s existing `diagnosis.md` detection
already accepts. Hidden assumption — that the CLI can pass a multi-line quoted string as one argument
intact; this predates this change (the `Next: /dx-new "<seed summary>"` line already exists on `main`)
and isn't newly introduced, but is worth a first-run check, not a first-principles fix.

## Data model

New persisted shape: one `research/<topic>.md` per promoted finding at the **effort** root, plus a
marker line in `effort.md`'s `## Notes` — both additive, nothing existing reshaped.

- **Research file** — the existing `research-and-frame` provenance frontmatter (`topic`, `kind:
  codebase`, `source`, `gathered`, `git_commit`), stamped by `dx-new` at write time (`git rev-parse
  HEAD` for `git_commit`, today's date for `gathered`, the file(s) named in the finding's "What &
  where" for `source`). Body = that finding's full entry verbatim (What & where / Why / Shape /
  Proposed / Dependency category / `Sketch:` line if §4 explored it). Topic slug: kebab-case from the
  finding's module/file name (not its deepening verb), collision-checked the way `dx-new`'s "Name it"
  step already checks any slug.
- **`effort.md` `## Notes` marker** — one line, `Refactor effort — findings promoted from
  /dx-refactor-discover.`, written once at effort creation, read once by `dx-new`'s child-creation
  step. Not a frontmatter field (effort.md carries no `type:`, by existing design) and not a
  maintained checklist — a fact stamped once, same shape as any other frontmatter value.
- **Migration path:** none needed — every existing effort/change shape is untouched; this only adds a
  new *kind* of `research/<topic>.md` content (still just markdown + the existing provenance schema)
  and a new line inside `## Notes`, a section already free-form. Old and new `dx-new` behavior coexist
  trivially: an effort created before this change simply has no marker line, and its children default
  to `type: feature` exactly as today.

## API & contracts

Two contract surfaces change, both additive — no existing caller's behavior changes.

- **`/dx-new "<seed summary>"` argument shape, extended.** Today `dx-new` treats its argument as a
  short idea to slugify. This adds a **recognized shape**: an argument opening with the heading
  `## Refactor opportunities (from /dx-refactor-discover)` is parsed as a multi-finding effort seed
  instead. Any other argument (including one that happens to be long) falls through to the existing
  "Name it" / "Pick the level" flow unchanged — additive, not breaking.
- **`effort.md` `## Notes` marker, a new informal contract between `dx-new` (effort creation, writer)
  and `dx-new` (child creation, reader).** `dx-new`'s own child-creation text already promised this
  check ("unless the effort's research/frame marks it a refactor effort") without saying how; this
  plan is what makes that promise concrete. No other skill reads it, so no external compatibility
  path is needed — but if it's ever renamed, both call sites are in the same file and move together.
- **No breaking change** — nothing is renamed or removed; `dx-roadmap` needs no edit because it
  already consumes "every `research/<topic>.md`" generically (see Approach).

## Standards to apply

- [ ] **skill-authoring / Use skill-creator**: author both `SKILL.md` edits (`dx-refactor-discover`,
      `dx-new`) through `skill-creator`, not by hand-editing in isolation.
- [ ] **skill-authoring / evals — deviation, stated not dropped**: no eval harness exists in this repo
      (`package.json` ships only `lint:skills`); both edited skills are `disable-model-invocation:
      true`, so the "does it fire" half is moot. Verification falls back to a sandboxed run of the
      full promote-many → `dx-new` → `dx-roadmap` → `dx-new <effort> <slice>` chain (phase 3). Declared
      per the 2026-07-28 lesson rather than silently skipped.
- [ ] **skill-authoring / No-op test**: the batched-pick question, the per-finding research split, and
      the `## Notes` marker are all lines the model does not already do unprompted — each earns its
      place. Re-stating "your first idea is unlikely to be the best" would not; not added.
- [ ] **skill-authoring / Shared reference, not duplication**: no new `dx-references` topic — the
      research file shape reuses the existing provenance schema (§7.5) already documented once in
      `docs/explanation/research-and-frame.md`; nothing copy-pasted.
- [ ] **skill-authoring / Derive, don't maintain**: the `## Notes` marker is a one-time stamp (written
      once, read once), not a maintained list — addressed explicitly in Approach since it brushes
      against this rule.
- [ ] **skill-authoring / No auto-chain**: unchanged — both skills still print the next command and
      stop.
- [ ] **skill-authoring / Completion criteria**: `dx-refactor-discover`'s `## Done when` stays accurate
      once a multi-select promote can loop the offer.
- [ ] **CLAUDE.md / docs sync**: no `skills/` diff ships without its `docs/` and `DESIGN.md` diff in
      the same phase.
- [ ] **CLAUDE.md / changesets**: one changeset per phase touching `skills/**` (phases 1–2).

## Priors & gotchas

- **Skills ship without evals — no harness exists (2026-07-28).** In play here exactly as above:
  applied as a stated deviation rather than silently skipped, verification substitutes a sandboxed
  end-to-end run.

## Phases

### Phase 1: Loop the §4 offer across a multi-select promote
End-to-end and demoable: promoting 2+ findings at once triggers one batched pick (recommending the top
pick), then runs §4's existing frame → spawn → compare → stop-and-ask once per selected finding,
sequentially, with each finding's chosen sketch (or its absence) correctly reflected in the printed
seed summary. Promoting exactly one finding is unchanged — still the plain yes/no.

- `skills/dx-refactor-discover/SKILL.md` §4 — reframe the opening from "offer this once the user has
  picked" (singular) to branch on how many were picked: `N = 1` keeps today's yes/no; `N > 1` asks one
  batched question first ("sketch any of these before promoting?" — options: none / all / specific
  ones — recommending just the top pick, per the interview reference's 2–4-options-with-a-recommendation
  rule), then loops steps 1–3 and the existing stop-and-ask **once per selected finding, sequentially**
  — never spawning the next finding's sub-agents before the current finding's sketch is confirmed.
- §5's "Many" bullet — **no edit**; already plural-ready (see Approach). Confirm this by reading it
  again once §4's loop lands, not by assuming.
- `dx-refactor-discover`'s frontmatter `description` and opening line — check they still describe a
  single "the pick" correctly now that a promote-many run can sketch several; widen only if they
  actually say "the pick" in a way that reads as singular-only.
- Docs in the same phase: `docs/tutorials/find-refactors.md` Branch B (the batched-pick step, before
  the seed summary is composed); `docs/reference/skills.md` `/dx-refactor-discover` **Purpose**/
  **Writes** (the offer now loops); `DESIGN.md` §9 `refactor-discover` paragraph (the "design it
  twice" sentence currently reads singular — "the pick can optionally be designed twice" — extend it
  to name the batched, sequential loop for a multi-select promote).
- Changeset (`npx changeset`).

### Phase 2: Fix the propagation hop — effort-level seeding in `dx-new`
End-to-end and demoable: running `/dx-new "<seed summary>"` on a promote-many seed (produced by phase
1) creates `effort.md` carrying the refactor-effort marker plus one `research/<topic>.md` per finding
(with any chosen sketch inline); `/dx-roadmap` on that effort decomposes one slice per finding with no
edit of its own; `/dx-new <effort-id> <slice-n>` on any slice defaults `type: refactor` by reading the
marker.

- `skills/dx-new/SKILL.md` **Promoted entries** — add the effort-level branch: an argument opening with
  `## Refactor opportunities (from /dx-refactor-discover)` is a multi-finding seed, not a short idea.
  Derive the effort slug via the existing, unchanged "Name it" step, fed a short descriptor built from
  the seed's `Start with:` line (e.g. `refactor: <top-pick module> + N other modules`) rather than the
  whole blob. Write `effort.md` with a one-sentence `## Goal` citing the `Start with:` line and the
  `## Notes` marker (Data model). Then write one `research/<topic>.md` per numbered finding, per the
  Data model section's shape.
- `skills/dx-new/SKILL.md` **Slice of an existing effort** — concretize "the effort's research/frame
  marks it a refactor effort" into the actual check: `type: feature` unless `effort.md`'s `## Notes`
  carries the marker line, then `type: refactor`.
- Docs in the same phase: `docs/reference/skills.md` `/dx-new` **Reads**/**Writes** (accepts an
  effort-level seed summary, writes per-finding research + the marker); `docs/tutorials/find-refactors.md`
  Branch B (`dx-new`'s actual behavior — per-finding research files and the marker, not just "sizes it
  as an effort"); `docs/explanation/research-and-frame.md` "The refactor twist" (the sketch can now ride
  into effort-level research, not only a single change's); `DESIGN.md` §9 `refactor-discover`
  "many" bullet (name the per-finding research + marker instead of the current one-line summary) and
  `DESIGN.md` §7.6 (new row: effort-level refactor seed → canonical source `dx-new` (writes) → consumers
  `dx-roadmap`, `dx-new` child-creation).
- Changeset (`npx changeset`).

### Phase 3: Verify the handoff end-to-end, then release hygiene
No `skills/**` diff of its own.

- Sandboxed run of the full chain: `/dx-refactor-discover` on this repo → promote 2+ findings →
  confirm the batched pick fires and sketches land correctly per finding → `/dx-new "<seed summary>"`
  → confirm `effort.md`'s marker and one `research/<topic>.md` per finding, each with the right
  `Sketch:` presence/absence → `/dx-roadmap <effort-id>` → confirm one slice per finding with no
  `dx-roadmap` edit needed → `/dx-new <effort-id> 1` → confirm `type: refactor` is stamped from the
  marker and the child inherits the full `research/` set.
- `npm run lint:skills` clean.
- Walk phases 1–2 individually and confirm each has its own changeset (CI's gate only checks that
  *some* `.changeset/*.md` exists).

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Loop the §4 offer
#### Automated
- [x] 1.1 §4 branches on pick count: `N=1` unchanged yes/no; `N>1` asks the batched pick (recommending
      the top pick) then loops frame → spawn → compare → stop-and-ask per selected finding, sequentially
- [x] 1.2 §5 re-read and confirmed to need no edit (plural-ready already)
- [x] 1.3 Frontmatter `description` / opening line checked, widened only if actually singular-only
- [x] 1.4 Docs updated: `find-refactors.md` Branch B, `skills.md` Purpose/Writes, `DESIGN.md` §9
- [x] 1.5 `npm run lint:skills` passes
- [x] 1.6 Changeset added
#### Manual
- [x] 1.7 Sandboxed promote-many run: batched pick fires only when >1 promoted, sub-agents for finding
      2 don't start before finding 1's sketch is confirmed

### Phase 2: Fix the propagation hop
#### Automated
- [x] 2.1 `dx-new` Promoted-entries gains the heading-detection branch: effort slug via existing
      "Name it," `effort.md` `## Goal` + `## Notes` marker written — c70384e
- [x] 2.2 One `research/<topic>.md` per finding written with provenance frontmatter + full entry body,
      `Sketch:` line present only when §4 explored that finding — c70384e
- [x] 2.3 Child-creation's `type: refactor` check reads the concrete `## Notes` marker — c70384e
- [x] 2.4 Docs updated: `skills.md` `/dx-new` Reads/Writes, `find-refactors.md` Branch B,
      `research-and-frame.md` refactor twist, `DESIGN.md` §9 + §7.6 — c70384e
- [x] 2.5 `npm run lint:skills` passes — c70384e
- [x] 2.6 Changeset added — c70384e
#### Manual
- [x] 2.7 Sandboxed run: `dx-roadmap` on the resulting effort produces one slice per finding with zero
      edits to `dx-roadmap` itself
- [x] 2.8 Sandboxed run: `/dx-new <effort-id> <slice-n>` stamps `type: refactor` from the marker

### Phase 3: Verify end-to-end + release hygiene
#### Automated
- [x] 3.1 `npm run lint:skills` clean on the full branch
- [x] 3.2 Per-phase diff walk confirms phases 1 and 2 each have their own changeset
#### Manual
- [x] 3.3 Full chain sandboxed run (promote-many → `dx-new` → `dx-roadmap` → `dx-new` child) completes
      with the right `type`, the right per-finding research, and the right sketches attached
