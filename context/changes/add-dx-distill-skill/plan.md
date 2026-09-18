# Plan: Add dx-distill — a foundation-layer skill that distills raw material into an evidence-tagged brief

## Approach

Add one user-invoked skill, `dx-distill`, that runs a **discovery conversation toward a decision** and writes a single evidence-tagged **Brief** to `context/foundation/briefs/<slug>.md`. It promotes nothing and creates no container — `dx-new` stays the sole router.

**Corrected 2026-09-18, during Phase 2.** This paragraph previously described the skill as material-driven: it "takes raw material the user points at… interviews to fill the gaps." Re-reading the upstream `om-discover/SKILL.md` verbatim shows that inverts the entry condition. Upstream, `{topic}` is optional ("when absent, ask what the brief is for"), raw material is an optional `--research <dir>` read *before* questioning, and the session is framed by the decision the user needs to make. Raw material is an input, never the trigger. `dx-distill` follows that: frame the decision → check the material → interview → tagged draft → skeptic → confirm → write.

The brief's shape is adapted from `om-discover`'s `brief-template.md` near-verbatim, minus the sign-off axis (`Owner`, `Definition of Ready signed by`, `Decider for scope decisions`, and the `Mode:` line), which `brainstorm.md` established is moot for a solo workflow. The `Mode:` line is replaced by an `Emphasis detected:` line, since emphasis is inferred from the material rather than declared — the same way `type` already activates plan characteristics without the user naming one.

Three mechanics carry over intact, because they are the reason this skill exists: the seven evidence tags (`[INTERVIEW]` `[DATA]` `[DOCUMENT]` `[PRODUCT]` `[BENCHMARK]` `[SYNTHETIC]` `[ASSUMPTION]`), the hard gate against inventing sources or measurements, and the coverage-arithmetic line. `[SYNTHETIC]` claims stay confined to `## Hypotheses to test` and are counted outside coverage.

Two checkpoints, not three: a **material check** before asking the user for facts (read what exists first; sort it into what supports the decision and what could overturn it; consequential gaps go on the collection plan) and a **skeptic pass** after drafting, run as a built-in `general-purpose` subagent over all 5 source checks. `om-discover`'s separate `quality-gate` is folded into the skeptic pass rather than run as a third read of the same draft. A third checkpoint survives from upstream that this plan originally missed: **confirm with the user before writing**, since a brief written past an unconfirmed decision is exactly the misalignment the interview exists to prevent.

**Corrected 2026-09-18, during Phase 2.** The material check is *not* an off-ramp. This plan called for one — "enough to distill? if not, name the gap and write nothing" — mirroring `dx-brainstorm`'s ramp 1. Upstream has no such refusal: thin material yields "an honestly incomplete brief… but must say what it cannot support yet," with the missing pieces on a collection plan. Refusing would also be the wrong borrow from `dx-brainstorm`, whose ramp 1 concludes *nothing should be built* — a different judgement from *not enough is known yet*, which is the thing a brief is for recording. The one genuine stop is **no user available**, which `dx-brainstorm` already guards the same way and which upstream states outright ("This skill is interactive, has no autonomous mode").

**Sources are paths, not copies.** The expected case is the user pointing at files already in the project, so a claim's source is that path. Pasted material has no path: it is tagged normally but flagged as unverifiable. No `.sources/` directory, no verbatim appendix.

**One exception, decided 2026-09-18 during Phase 2 (D06 supersedes D05).** The interview is recorded to a companion `context/foundation/briefs/<slug>.interview.md`, written before drafting. D05 was reasoned about copies of material that *already has a path*; an interview has none, so under D05 every `[INTERVIEW]` claim was uncheckable forever — including by the skeptic pass, whose first check is to open the cited source. The Phase 2 full-run test hit this directly and reported its own interview claims unverifiable by construction. `om-discover` persists the same record for the same reason.

### Conflicts surfaced, not averaged

- **Question batching.** `om-discover`'s `interview-rounds.md` batches "two or three independent questions per round, up to three rounds." This repo's `interview` reference mandates **exactly one question at a time**. House convention wins — `dx-distill` invokes `dx-references` with `interview` and does not carry a rounds mechanic. The source's *stopping* rule (stop when the decision has enough support, or the user says so) is compatible and kept.
- **Empty sections.** `om-discover` leaves an inapplicable section visible as "deferred"; `plan-template` mandates **omitting entirely — never `N/A` or a placeholder**. House convention wins: a brief omits sections its material doesn't reach. The collection plan is what names the gaps that block the decision, so nothing is lost by dropping "deferred".
- **Tracker, emoji, and marker conventions** in `rules.md` are cut — `DESIGN.md` §2 already excludes issue-tracker coupling, and emoji/`PR:`-style markers are not a dx convention.

### Corrected from upstream

`brainstorm.md` assumed `dx-frame`/`dx-plan` would need no read-logic and asked that it be confirmed here. **It is not the case.** Both gather upstream from a closed, enumerated list (`research/<topic>.md`, `frame.md`, `diagnosis.md`, `brainstorm.md`, glossary); a brief recorded as `## Notes` prose falls outside it and would be seen but not read. Each needs one additive clause. Phase 3 covers it.

## API & contracts

**The brief file — new format, additive.** `context/foundation/briefs/<slug>.md`, plus the companion `<slug>.interview.md` (D06). Written only by `dx-distill`; read by `dx-new`, `dx-frame`, and `dx-plan` as settled upstream context. Header block followed by the adapted section list:

```markdown
# <slug> — brief

- Date: <YYYY-MM-DD>; Pass: full | quick
- Emphasis detected: <the tag(s) the material concentrates in>-weighted, and why
- Evidence basis: <the material and its limits; the most consequential untested belief>
- Coverage: <n> claims — <a> sourced (interview <i>, data <d>, document <c>, product <p>,
  benchmark <b>), <s> synthetic, <u> assumed
- Synthetic hypotheses outside Coverage: <k>
- Sources: <paths the claims cite>
```

Sections, in order, each omitted entirely when the material doesn't reach it: `## Decision summary`, `## Vision`, `## Target group and stakeholders`, `## Problems, with evidence`, `## Product and how it stands out`, `## Goals and success criteria`, `## Scope`, `## Domain glossary`, `## Key flows`, `## Business rules` (R-ids), `## Non-goals` (N-ids), `## Decisions` (D-ids), `## Riskiest assumptions` (A-ids), `## Kill criteria`, `## Hypotheses to test`, `## Open questions` (Q-ids), `## Collection plan`.

Canonical definition lives in `skills/dx-distill/references/brief-template.md` — **collocated, not in `dx-references`**, following the §7.6 precedent that `diagnosis.md` and `brainstorm.md` each own their own shape collocated despite having multiple readers. This adds one row to §7.6's table.

**`dx-new`'s argument — additive, non-breaking.** Brief selection is **optional, loose, and plural**: the user pastes a path, a slug, or several, anywhere in the argument, and `dx-new` picks them up. No flag, no required syntax. An unrecognized name lists `foundation/briefs/` and asks rather than guessing. Existing invocations are unaffected — no brief named means the current behavior, unchanged.

**What `dx-new` records:** a prose line in the container's `## Notes` naming the resolved brief paths. **No `change.md`/`effort.md` frontmatter change** — `change-md.md` and `effort-md.md` are untouched, so no consumer of those schemas is affected.

**`dx-frame` / `dx-plan` — additive read.** Each gains one clause adding `foundation/briefs/` (those named in `## Notes`) to its gather list. Read-only; no change to what either writes.

## Standards to apply

> Matched from `context/standards/` by domain + topic. `global/scripts.md` does not match — no script is added or changed.

- [ ] **skill-authoring — use `skill-creator`**: author `dx-distill/SKILL.md` through the `skill-creator` skill, not by hand-editing in isolation.
- [ ] **skill-authoring — evals**: the standard requires evals for non-trivial behavior. **Deviation, stated not dropped** — see Priors & gotchas; no harness exists. Verify by sandboxed subagent runs instead, and say so.
- [ ] **skill-authoring — frontmatter is the invocation cost**: `dx-distill` is user-invoked (`disable-model-invocation: true`) — investigation is a deliberate act, the same reasoning that makes `dx-research` user-invoked. Terse human-facing `description`, no trigger-phrase list.
- [ ] **skill-authoring — no-op test**: delete any sentence the model already obeys. The voice rules from `voice.md` are mostly no-ops here; keep only "reader's language over method vocabulary" (framework words stay out of the brief; the evidence tags are the deliberate exception, being contract).
- [ ] **skill-authoring — shared reference vs collocated**: brief template, evidence tags, and skeptic prompt have one consumer → collocated in `skills/dx-distill/references/`, never added to `dx-references/`.
- [ ] **skill-authoring — derive, don't maintain**: no index of briefs; `ls context/foundation/briefs/` is the list.
- [ ] **skill-authoring — no auto-chain**: print `Next:` and stop; never invoke `/dx-new`.
- [ ] **skill-authoring — guard clause first**: guard that `context/foundation/` is scaffolded, and that the named brief/material resolves, before doing anything.
- [ ] **skill-authoring — completion criteria**: `## Done when` on a multi-step skill.
- [ ] **skill-authoring — naming consistency**: read `foundation/glossary.md` as a one-line habit.
- [ ] **CLAUDE.md — docs sync**: `docs/reference/skills.md` plus a tutorial and an explanation page, in this same change.
- [ ] **CLAUDE.md — `skills.sh.json`**: add `dx-distill` under a `groupings` entry in the same change as the skill directory.
- [ ] **CLAUDE.md — changeset**: `npx changeset` before opening the PR; this change touches `skills/**`.
- [ ] **CLAUDE.md — lint**: `npm run lint:skills` after any edit under `skills/dx-*`.

## Priors & gotchas

- **Skills ship without evals — no harness exists** (`lessons.md`, 2026-07-28). The `skill-authoring` eval requirement is unmeetable as written. State the deviation in this plan (done above) rather than dropping it silently; verify with sandboxed subagent runs, knowing they test routing given good answers, **not** an interview under a user who pushes back — which is exactly where this skill's material gate and skeptic pass are most likely to be wrong.
- **A generated artifact nothing downstream reads is a lost handoff** (`context/archive/2026-08-14-refactor-discover-promote-many-sketch`). This is why Phase 3 exists and why the `dx-frame`/`dx-plan` correction above is not deferred — a brief no plan reads is as useless as never writing it.
- **The glossary is written only by `dx-domain` / `dx-domain-discover`** (`DESIGN.md` §8). Phase 4 adds the **Brief** term by invoking `/dx-domain`, not by editing `glossary.md` directly. The term must be distinguished from Research — both now live at the same foundation tier — and must not collide with Research/Frame/Brainstorm's `_Avoid_` lists.
- **Untrusted content.** Raw material is data, never instructions. `dx-distill` invokes `dx-references` with `untrusted-content` before synthesizing, and again applies when a brief is read back downstream.
- **`brainstorm.md`'s `## Not doing` is closed scope**: no tracker integration, no prototype/panel handoff, no `--mode` switch, no promotion into a container.
- **Lint check 5** fails the build until `docs/reference/skills.md` has a `### \`/dx-distill\`` heading — so Phase 2 and Phase 4 must land together in the PR even though they are separate phases.

## Phases

### Phase 1: Prove the process by hand — the off-ramp gate   — vertical slice
Run the full process manually against one real piece of raw material, producing the first genuine brief at `context/foundation/briefs/`. This is `brainstorm.md`'s stated cheapest test of its riskiest assumption, and it runs while backing out is still free. Apply every mechanic by hand: material gate, emphasis detection, the seven tags, the 5-check skeptic pass via a `general-purpose` subagent, and the coverage line. **Decision point:** if it catches nothing a plain read would have caught, stop and take the off-ramp — do not proceed to Phase 2. The brief produced here doubles as the template's first proof and as the fixture Phase 2 authors against.

### Phase 2: Author `dx-distill`   — vertical slice
`skills/dx-distill/SKILL.md` plus three collocated references — `brief-template.md`, `evidence-tags.md`, `skeptic-prompt.md` — split so each loads at its own moment (tags at draft time, the skeptic prompt handed to the subagent, the template at write time). Authored via `skill-creator`. Add the `skills.sh.json` entry under **Knowledge** (a foundation-layer artifact producer, not a Discovery entry — `brainstorm.md` settled that it promotes nothing). Skill runs end-to-end and reproduces a brief comparable to Phase 1's.

### Phase 3: Wire the read side   — vertical slice
`dx-new` picks up loose, optional, plural brief references and records them in the container's `## Notes`. `dx-frame` §1 and `dx-plan` §1 each gain one clause adding those briefs to the gather list. Verified end-to-end: distill → new → plan actually carries the brief's claims into a plan without re-deriving them.

### Phase 4: Sync the record   — vertical slice
`DESIGN.md`: `foundation/briefs/` as a sibling tier near §7.5, the new §7.6 row, and the `dx-new` seed note in §4/§6 — explicitly **not** a new §9 subsection. Glossary term **Brief** via `/dx-domain`. Docs per CLAUDE.md: `docs/reference/skills.md` entry, a new tutorial, a new explanation page for the evidence-tag idea, plus `docs/reference/glossary.md` and `docs/explanation/directory-layout.md` — written with the `documentation` skill. Changeset via `npx changeset`.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands.

### Phase 1: Prove the process by hand — the off-ramp gate
#### Automated
- [x] 1.1 `context/foundation/briefs/` exists and holds one real brief with a valid header block — 3290935
- [x] 1.2 Coverage line arithmetic checks out: `sourced = interview+data+document+product+benchmark`, `claims = sourced+synthetic+assumed`, synthetic hypotheses counted separately — 3290935
#### Manual
- [x] 1.3 Material gate applied by hand — enough material, or the gap named — 3290935
- [x] 1.4 Every substantive claim carries one of the seven tags and a resolvable source path (pasted material flagged unverifiable) — counting convention stated post hoc, tracked as Q04 — 3290935
- [x] 1.5 Skeptic pass run via a `general-purpose` subagent over all 5 checks; findings carry exact sentence + source path + CRITICAL/WARNING — 4 CRITICAL, 11 WARNING — 3290935
- [x] 1.6 **Off-ramp decision:** it caught something a lighter read would have missed — confirmed with the user before Phase 2 starts; cleared on the benchmark-emphasis (Q01) and unopened-`rules.md` findings, with A02 noted untested — 3290935

### Phase 2: Author `dx-distill`
#### Automated
- [x] 2.1 `skills/dx-distill/SKILL.md` exists with `disable-model-invocation: true` and a terse description — 91e2cc8
- [x] 2.2 Three references exist under `skills/dx-distill/references/` — 91e2cc8
- [x] 2.3 `dx-distill` added to `skills.sh.json` under Knowledge — 91e2cc8
- [x] 2.4 `npm run lint:skills` passes — checks 1–4 clean; **check 5 still red** as this row anticipated (no `docs/reference/skills.md` heading), clears at 4.3 — 91e2cc8
#### Manual
- [x] 2.5 Skill authored via `skill-creator` — its drafting guidance applied; its eval-harness loop skipped per 2.8 — 91e2cc8
- [x] 2.6 Sandboxed subagent run: thin material yields an honestly incomplete brief with a collection plan — **not** a refusal (row rewritten 2026-09-18; it previously asserted an off-ramp, see §Approach's correction). Verified: no "we don't know" answer was upgraded to a sourced claim — 91e2cc8
- [x] 2.7 Sandboxed subagent run: full run on Phase 1's material reproduces a comparable brief — 899 words, Coverage arithmetic holds, skeptic returned 2 CRITICAL + 1 WARNING — 91e2cc8
- [x] 2.8 Eval deviation stated to the user, not silently skipped — 91e2cc8
- [x] 2.9 Third run verifying the post-test fixes: interview note written as a record, `[INTERVIEW]` claims cite it, the confirmation gate held and absorbed the user's change before the write, and `Confirmed by` correctly refused a skeptic push to mark a decision confirmed from an interview remark (row added 2026-09-18 — five fixes landed after 2.6/2.7 ran, so those runs didn't cover them) — 91e2cc8

### Phase 3: Wire the read side
#### Automated
- [x] 3.1 `dx-new` resolves loose/plural brief references and writes them into `## Notes` — verified in 3 sandboxed runs; two forms of the same brief (bare slug + full path, on either side of the idea) deduplicated to one `Briefs:` line, slug derived from the idea text only — 19ccd93
- [x] 3.2 `dx-frame` §1 gather list includes briefs named in `## Notes` — **verified by inspection only**; no sandboxed run exercised `dx-frame` (the two end-to-end runs went new → plan) — 19ccd93
- [x] 3.3 `dx-plan` §1 gather list includes briefs named in `## Notes` — both end-to-end runs opened the brief; the widened `untrusted-content` trigger fired on its external `[BENCHMARK]` claims — 19ccd93
- [x] 3.4 `change-md.md` and `effort-md.md` unchanged — confirmed by diff: the phase diff is 3 files, all `skills/dx-{new,frame,plan}/SKILL.md` — 19ccd93
- [x] 3.5 `npm run lint:skills` passes — checks 1–4 clean; **check 5 still red** (no `docs/reference/skills.md` heading for `dx-distill`), the same known Phase-4 blocker row 2.4 recorded; clears at 4.3. No new failure introduced by this phase — 19ccd93
#### Manual
- [x] 3.6 `/dx-new` with no brief behaves exactly as before — baseline run created its container with `## Notes` left as the bare `<free-form>` placeholder, no brief line — 19ccd93
- [x] 3.7 Unrecognized brief name lists `foundation/briefs/` and asks instead of guessing — did not guess, despite the one existing brief being thematically close enough to tempt a match — 19ccd93
- [x] 3.8 End-to-end: distill → new → plan carries the brief's claims into the plan — verified on a change the brief actually governs: 19 carry-through citations (D01–D04, D06, N01–N04 as closed scope, R01–R06, R09, Q01, Q04), zero re-asks, the single interview question landing on the one question the brief itself marks `open` — 19ccd93
- [x] 3.9 Two post-test wording fixes to `dx-plan` §1 (row added 2026-09-18, after 3.8's runs): the widened `untrusted-content` gate reworded to fix a circular read-order, and the brief's risk sections given `## Priors & gotchas` as an explicit destination — both runs had read those sections and dropped them. **The second fix is itself untested** — it landed after the last run — 19ccd93

### Phase 4: Sync the record
#### Automated
- [x] 4.1 `DESIGN.md` §7.5 names `foundation/briefs/`; §7.6 has the brief-format row; §4/§6 note the `dx-new` seed — §7.5 gained a sibling-tier paragraph, §7.6 a Brief row, §4 an "Optional brief seed" paragraph under the router, §6 one clause marking `distill` user-invoked and explicitly not a discovery entry — 9d53934
- [x] 4.2 **Brief** term in `foundation/glossary.md`, added via `/dx-domain`, distinguished from Research — plus **Evidence Tag**; Research's `_Avoid_` list gained the reciprocal pointer, matching the file's existing pairing convention — 9d53934
- [x] 4.3 `docs/reference/skills.md` has a `### \`/dx-distill\`` entry in the fixed shape — filed under **Upstream** (not Discovery entries — it promotes nothing); `/dx-new`, `/dx-frame`, `/dx-plan` entries also updated to match what Phase 3 actually landed, which the Phase 3 commit had left undocumented — 9d53934
- [x] 4.4 New tutorial and new explanation page exist — `docs/tutorials/distill-a-brief.md` and `docs/explanation/evidence-tags.md`; both indexed in `docs/README.md` (tables + reading-order diagram). All relative links verified to resolve — 9d53934
- [x] 4.5 `docs/reference/glossary.md` and `docs/explanation/directory-layout.md` updated — glossary gained **Brief** and **Evidence tag** and a per-file/per-claim contrast on **Research**; directory-layout gained `briefs/` in the scaffold tree and the `foundation/` row, noting `/dx-init` does **not** create it (verified: no `briefs` reference in `dx-init`) — 9d53934
- [x] 4.6 A `.changeset/*.md` covers the `skills/**` diff — `.changeset/dx-distill-evidence-tagged-briefs.md`, `minor`, three paragraphs covering all three `skills/**` slices (dx-distill; dx-new; dx-frame/dx-plan). **Written by hand, not via `npx changeset`** — that command is interactive and unsupported in this environment; format matches the existing changesets in history — 9d53934
- [x] 4.7 `npm run lint:skills` passes clean — all 5 checks green; **check 5 is now green**, closing the known blocker rows 2.4 and 3.5 recorded — 9d53934
- [x] 4.10 Phase 1's hand-made brief moved out of `foundation/briefs/` (row added 2026-09-18, user's call after Phase 4 landed). `evidence-discipline.md` → `context/changes/add-dx-distill-skill/` via `git mv`, leaving `foundation/briefs/` absent — correct, since `ls` is the list and no conforming brief exists yet. **Why:** it is a Phase 1 fixture, not a model output — 3,260 words against the template's 500–900 cap, and no `<slug>.interview.md` companion, since it predates D06. That companion cannot be reconstructed: the session is gone, and writing one now would invent a source, which is the hard gate the skill enforces. It is also referenced by nothing in the repo. **Cost accepted:** it now archives with the change, so the `om-discover` rationale and A01 stop being durable foundation memory. Rows 1.1/1.2/1.4/1.5/1.6 are left as landed — the artifact they cite still exists, at a new path
#### Manual
- [ ] 4.8 Docs written with the `documentation` skill
- [x] 4.9 No §9 discovery-entry subsection was added — verified by diff: `DESIGN.md`'s heading set is unchanged (no `^[+-]#` lines), and §9 still holds exactly `diagnose`/`refactor-discover`/`brainstorm` — 9d53934
