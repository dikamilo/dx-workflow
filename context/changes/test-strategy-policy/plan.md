# Plan: Repo/folder runs and the test-strategy Policy

## Approach
Extend `dx-review` with **Explore runs** (the `explore`/`both` targets slice 1's template already defines) and ship the hybrid `test-strategy` Policy, `skills/dx-init/assets/review-policies/test-strategy.md` (`targets: both`). The policy template gains the two sections that only exist from here on: `## Questions` (pre-review questions) and `## Candidates` (what an Explore run presents). **Mechanism in the skill, criteria in the Policy** stays the rule from slice 1: the skill owns how an Explore run explores, ranks and promotes, and the Policy declares only what differs.

Interview decisions (2026-10-07):
- **Questions are stage-tied gates with no silent defaults** (revised 2026-10-07 after reading the original test-strategy skill; the research had flattened it). In the original, every gate fires mid-analysis, after the code is read, is tied to something observed, and **blocks**: "Do NOT proceed to Step 3 until classification is confirmed", "only after the answer, classify as smell or legitimate exception". A Policy's `## Questions` section therefore declares each gate with `after:` (the stage it fires at: `scan` or `analysis`), `when:` (the observation that triggers it), `blocks:` (what cannot be judged until it is answered) and the question text. `dx-review` asks the gates **batched per stage, one round at a time**: a stage's triggered questions go out as one confirm-or-edit question, and nothing that the round blocks is judged until it is answered. A gate that cannot be answered (an unattended run, or the user says "skip") leaves the affected unit **`unconfirmed`**: reported with the assumption stated and **no verdict**, never silently defaulted. Custom instructions may pre-answer a gate. The only question before any reading is the original's Input Acquisition: an Explore run with no path asks what to review. This applies to container runs too.
- **Promotion: generic route.** One Candidate: `dx-review` writes `changes/<slug>/change.md` plus a seed `research/<topic>.md` itself, as `dx-refactor-discover` does. Many: it prints `/dx-new "<seed summary>"` under the heading `## <Policy> candidates (from /dx-review <policy-id>)`, and `dx-new` learns to parse any heading of that form. The Policy's `## Candidates` declares the default change `type`.
- **The skill owns the Explore mechanism:** the recency prior from `git log` (a Policy can set `recency: off`), one `Explore` fan-out per facet, one Candidate per broken rule with a site count, a ranked numbered inline list ending in a top pick, one promote question, reading `lessons.md` to skip earlier rejections, and offering `/dx-lesson` for a load-bearing rejection. The Policy's `## Candidates` declares only the entry fields, the default `type`, optional facets and `recency`. **Standard Proposals are not in this slice**: `test-strategy` doesn't need them and slice 4 (`sessions`) is the first consumer.
- **Arguments resolve positionally:** container, then existing paths, then instructions. The interpreted scope is printed before the fan-out. A container plus a path in one run is refused as ambiguous.
- **`test-strategy` has three dimensions:** `Strategy-fit` is the original skill in full: classify each tested behaviour (Transformation, Stateful Object, Integration, mixed), classify each test's strategy (output-, state-, interaction-based), compare, and apply the managed vs unmanaged, edge-mocking, mock vs stub, contract-vs-stub and separate-decision-from-orchestration rules. **The original's "level" check (aggregate vs facade for a Stateful Object) lives here**, since the original lists "tests at wrong abstraction level" among the mismatches it detects. `Frontend & e2e` (component vs integration vs e2e placement, what e2e should carry) and `Pathological tests` (assertion-free, tautological, mocks the thing under test, order-dependent, flaky, duplicated coverage) are the extensions the roadmap asks for. **Those two are written from general knowledge, not from research or the original**: no source covers them, and the Policy says so in its text. Policies are user-owned and editable, and triage's `ACCEPTED`/`DISMISSED` absorb false positives. Severity follows the research default: `Blocker` when the mismatch removes regression protection, `Consider` when it only costs stability. An earlier draft named the second dimension `Test level`, which wrongly reused the original's term for aggregate vs facade.
- **The report lists every unit reviewed, not only mismatches.** The original reports `OK | MISMATCH` per test class. Findings stay mismatch-only; the report template gains an optional `## Reviewed` section (unit, problem class, current strategy, verdict, or `unconfirmed`) and an Explore run prints the same list under its Candidates. This is my call beyond the roadmap; it is cheap and keeps the original's coverage visible.
- **`test-strategy` gates (from the original skill):** (1) *classification* — `after: scan`, for every unit: "I classify `<unit>` as `<class>` based on `<2–3 signals>`. Does this match your understanding? yes / no, more like X because… / a mix"; blocks the strategy comparison for that unit. (2) *exception* — `after: analysis`, only for a Transformation whose tests mock intermediate steps: "is any of these steps financially expensive, performance-expensive, or side-effecting?"; blocks calling the mock a smell (costly → legitimate; side-effecting → legitimate, but flag the unit as not a pure transformation). (3) *level* — `after: analysis`, only for a Stateful Object tested at the aggregate or facade level: "does the surrounding orchestration change often, is the application service simple or complex, can the effect be verified through a read model, view or query?"; blocks the level recommendation. Gates (2) and (3) go out as one batched round each, per the stage rule.
- **Container run scoping:** a Change reviews the tests it touched plus the production code they exercise; an Effort takes the union over its child changes. A container run writes `reviews/test-strategy.md` as today; an Explore run writes nothing.
- **Conflict rule:** where a project standard on testing contradicts a heuristic, the standard wins and the finding is flagged (research tension 4, Principle 1).

**Template drift.** `dx-init` copies only missing files, so a project seeded before this release keeps the old `policy-template.md` and `report-template.md` and gets `test-strategy.md`. Neither old template documents `## Questions`, `## Candidates` or `## Reviewed`, so the changeset tells users to compare both templates with the shipped ones by hand (roadmap slice 3 note).

Changeset bump: **minor**, consistent with slices 1 and 2.

## Data model
Persisted file shapes, not a database. Everything is additive; `plan.md` and `implementation.md` Policies stay valid unchanged.
- **Policy file** gains two optional sections, documented in `policy-template.md`:
  - `## Questions` — a list of gates; each entry: the question text, `after:` (`scan | analysis`), `when:` (the observation that triggers it) and `blocks:` (what cannot be judged until it is answered). There is **no `default:`**: an unanswered gate leaves its unit `unconfirmed`. Absent means no gates.
  - `## Candidates` — the Candidate entry fields (a list), `type:` (default change type for promotion, one of `feature | defect | refactor | migration`), optional `facets:` (fan-out hints) and optional `recency: off`. Required for a Policy with `targets: explore | both`; a missing section on such a Policy refuses an Explore run, naming the section. A `container`-only Policy never needs it.
- **Candidate** (ephemeral, inline, never a file unless promoted): a numbered entry with the Policy's fields, a strength tag (`Strong | Worth exploring | Speculative`) and a site count where one rule is broken in many places. No stable number and no resolution status (glossary).
- **Seed research** `<change|effort>/research/<topic>.md` written on promotion: provenance frontmatter (`topic`, `kind: codebase`, `source`, `gathered`, `git_commit`) and the Candidate entry verbatim as the body, minus its list numeral.
- **Seed summary** (printed, not persisted): `## <Policy> candidates (from /dx-review <policy-id>)`, the numbered entries, a `Type: <type>` line and a closing `Start with:` line.
- **Effort `## Notes` marker** written by `dx-new` for a generic seed: `Candidate effort — default slice type: <type>; promoted from /dx-review <policy-id>.` Slice creation reads it the way it reads the refactor marker today.
- **Report** (`report-template.md`) gains an optional `## Reviewed` section after `## Findings`: one line per unit checked (unit, problem class, current strategy, `OK | MISMATCH | unconfirmed`). Findings and the existing rules are unchanged.
- **Migration:** none. The release-note requirement for both templates is under Approach.

## API & contracts
Additive; nothing is removed.
- **`/dx-review <policy-id> [container-id | paths…] [instructions…]`.** The second token is tried as a container ID, then the leading tokens that resolve to existing repo paths become the scope, and the first token that is neither starts the instructions. No container and no paths is a whole-repo run. The interpreted scope is printed before the fan-out. A container with paths is refused as ambiguous.
- **Target guard** (changed): `container` refuses an Explore run, `explore` refuses a container run, `both` accepts either; every refusal names the Policy and the targets it accepts. The slice 1 line "Explore runs are not available yet" is removed from `dx-review` and from `policy-template.md`.
- **Input acquisition:** an Explore run with no container and no paths asks what to review before reading anything, rather than assuming the whole repo.
- **Output:** an Explore run prints Candidates inline and ends with one promote question. Units a gate could not confirm are listed as `unconfirmed`, with their assumption and no verdict. Its `Done when` prints `Promoted one: Change created …  Next: /dx-plan <slug>`, `Promote many: Next: /dx-new "<seed summary>" → /dx-roadmap <effort-id>`, and `Record a no: /dx-lesson`. It never writes `reviews/`.
- **`dx-new` seed contract** (changed): it keeps parsing `## Refactor opportunities (from /dx-refactor-discover)` byte-identically and additionally parses `## <Policy> candidates (from /dx-review <policy-id>)`, deriving the effort slug from the `Start with:` line, writing the Notes marker above and one `research/<topic>.md` per entry (`kind: codebase`). Any other argument falls through unchanged.
- **Affected callers:** typed commands, docs, and `dx-new`'s slice-creation check (reads the new marker). No skill invokes `dx-review` programmatically.

## Standards to apply
- [ ] global/skill-authoring — Edit `dx-review` and `dx-new` through `skill-creator`. Keep the read-vs-write split: `dx-review` writes only a promoted container's `change.md`/`research/`, never code or the reviewed artifact. Terse description, guard first, `## Done when`, no-op test on every added sentence, no auto-chain. **Deviation (per lesson below):** there is no eval harness, so verification uses sandboxed runs with scripted answers, as recorded under Manual.
- [ ] global/skill-authoring, shared reference rule — nothing is added to `dx-references`; the new sections live in the user-owned `policy-template.md`, and the Explore mechanism is used by one skill so it stays collocated in `dx-review`.
- [ ] CLAUDE.md (maintainer) — run `npm run lint:skills` after every edit under `skills/dx-*`; keep `docs/reference/skills.md`, tutorials and explanations in sync (documentation skill) in the same change; add a changeset. No skill directory is added or removed, so `skills.sh.json` is unchanged.

## Priors & gotchas
- **Skills ship without evals (2026-07-28):** the deviation is stated above. The untested half is the interview under an adversarial user, so the manual runs must include refused paths and a user who corrects a classification.
- **Parity is the success criterion for slices 1–2** (frame caveat): the `plan` and `implementation` Policies and container runs must behave exactly as before. Phase 1 re-runs both as a regression check.
- **Policies sit outside the lint gate** (frame caveat): nothing checks the shape of `test-strategy.md`, so the template is the only guardrail and must document the new sections explicitly.
- **Shipped Policy fixes never reach existing copies** (frame caveat), which is why the template-drift note goes in the changeset and the docs.
- **Two vocabularies:** container runs produce Findings, Explore runs Candidates. Each keeps its own; `test-strategy` must not blur them. The glossary already lists an Explore run as a Candidate source.
- **Lint check 4** resolves `dx-references` call sites in `SKILL.md` only; the new `dx-review` text must not invoke a topic that doesn't exist. Policy files are not scanned.
- **Test setup:** the repo has no test setup beyond `lint:skills`, and `context/standards/testing/` is empty, so the user cases are verified by manual sandbox runs, not automated assertions. No harness is introduced here.
- **Unsourced content:** `Frontend & e2e` and `Pathological tests` are general-knowledge heuristics (Approach). The Policy text says so, and the final report names it.

## Phases

### Phase 1: Tracer — a folder Explore run with `test-strategy`, one Candidate promoted
- Extend `skills/dx-init/assets/review-policies/report-template.md` (optional `## Reviewed`) and `skills/dx-init/assets/review-policies/policy-template.md`: `## Questions`, `## Candidates`, the `explore`/`both` target text, remove "not available yet".
- Add `skills/dx-init/assets/review-policies/test-strategy.md` (`targets: both`): the three dimensions (the original skill's Steps 1–3 as `Strategy-fit`, including the aggregate-vs-facade level), per-class smells, managed vs unmanaged, edge-mocking, mock vs stub, contract-vs-stub, severity rule, conflict rule, the three gates, the Candidate fields, `type: feature`, and the unsourced-content note. `dx-init` needs no edit (it globs `assets/review-policies/*.md`).
- Edit `skills/dx-review/SKILL.md` for Explore runs: positional argument resolution, input acquisition, the target guard, the scan → classification gate → analysis → batched gate rounds sequence with `unconfirmed` handling, the recency prior, Candidate presentation with a top pick and one promote question, lessons as rejection memory, promote-one writing `change.md` + seed `research/`, and the `Done when` variants.
- `npm run lint:skills`.

### Phase 2: Promote many — generic seed heading
- Teach `skills/dx-new/SKILL.md` the `## <Policy> candidates (from /dx-review <policy-id>)` seed (effort, Notes marker, one `research/<topic>.md` per entry) and the slice-creation read of the marker.
- `dx-review` prints the seed summary for several picks and the `Start with:` line.
- `npm run lint:skills`.

### Phase 3: Container run of `test-strategy` and regression of the built-ins
- Make `dx-review`'s container path apply a Policy's `## Questions` (same stage-tied gates) and make the `test-strategy` Load and Preconditions scope the run to a Change's touched tests or an Effort's child changes.
- Re-run `implementation` and `plan` unchanged against a sandbox change.

### Phase 4: Docs, changeset, dogfood
- Update docs with the documentation skill: `docs/reference/skills.md` (`dx-review`, `dx-new`, `dx-init`), `docs/reference/glossary.md` if Explore run or Candidate change, `docs/tutorials/write-a-review-policy.md` (new sections), `docs/tutorials/review-and-triage.md`, `docs/tutorials/find-refactors.md` if it names the seed, and `docs/explanation/policy-driven-review.md`. New tutorial: run `test-strategy` on a folder and promote.
- `DESIGN.md`: the `dx-review` / Policy sections and the §9 discovery-entry text that the Explore run joins.
- `npx changeset` (minor): names `/dx-review test-strategy`, the Explore argument grammar, the new `dx-new` seed heading, and says to compare an existing `policy-template.md` with the shipped one because `dx-init` never overwrites it.
- Re-run `/dx-init` in this repo to seed `test-strategy.md`, and refresh this repo's own `policy-template.md` and `report-template.md` by hand (they predate the new sections).
- Walk the changeset coverage: this change touches `skills/**`, so it needs its own changeset.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Tracer — a folder Explore run with `test-strategy`, one Candidate promoted
#### Automated
- [x] 1.1 `policy-template.md` documents `## Questions` (stage-tied gates, no defaults), `## Candidates`, and the `explore`/`both` targets; `report-template.md` documents optional `## Reviewed` — f2d4c07
- [x] 1.2 `test-strategy.md` added under `skills/dx-init/assets/review-policies/` in the template's shape — f2d4c07
- [x] 1.3 `skills/dx-review/SKILL.md` handles Explore runs (via skill-creator) — f2d4c07
- [x] 1.4 `npm run lint:skills` passes — f2d4c07
#### Manual
- [x] 1.5 Sandbox: `/dx-init` seeds `test-strategy.md`; a second run reports it `present` and leaves an edited copy untouched
- [x] 1.6 Sandbox: `/dx-review test-strategy <folder>` prints the interpreted scope, runs the scan, asks the classification gate as one batched round and judges nothing until it is answered, then runs analysis and asks the exception and level gates only for the units that trigger them, then presents ranked Candidates with a top pick and a `Reviewed` list including `OK` units, and writes no `reviews/` file (UC3)
- [x] 1.7 Sandbox: correcting a classification changes the Candidates; a skipped or unanswerable gate leaves the unit `unconfirmed` with its assumption stated and no verdict, never a silent default; custom instructions can pre-answer a gate; no path asks what to review
- [x] 1.8 Sandbox: picking one Candidate creates `changes/<slug>/change.md` with the Policy's default `type` and a seed `research/<topic>.md`; rejecting one with a reason offers `/dx-lesson`
- [x] 1.9 Sandbox refusals: a `container`-only Policy with no container (names the Policy and targets); `test-strategy` with a container and a path; an `explore`/`both` Policy missing `## Candidates`; an unknown ID (UC7)
- [x] 1.10 Sandbox: custom instructions narrow the run (UC8)

### Phase 2: Promote many — generic seed heading
#### Automated
- [x] 2.1 `dx-new` parses `## <Policy> candidates (from /dx-review <policy-id>)` (via skill-creator) — 77fb7cb
- [x] 2.2 `dx-review` prints the seed summary with a `Start with:` line for several picks — 77fb7cb
- [x] 2.3 `npm run lint:skills` passes — 77fb7cb
#### Manual
- [x] 2.4 Sandbox: promoting several Candidates, then running the printed `/dx-new` argument, creates an effort with the Notes marker and one `research/<topic>.md` per entry — 77fb7cb
- [x] 2.5 Sandbox: `/dx-new <effort> 1` on that effort inherits the Policy's default `type`; the refactor-discover seed heading still produces `type: refactor` unchanged — 77fb7cb

### Phase 3: Container run of `test-strategy` and regression of the built-ins
#### Automated
- [ ] 3.1 Container-run gate handling in `dx-review`; `test-strategy` Load/Preconditions scope the run (via skill-creator)
- [ ] 3.2 `npm run lint:skills` passes
#### Manual
- [ ] 3.3 Sandbox: `/dx-review test-strategy <change-id>` writes `reviews/test-strategy.md` with three Verdicts lines, compound tags and a `## Reviewed` list, scoped to the change's touched tests; `/dx-review-triage <id> test-strategy` walks it (UC3)
- [ ] 3.4 Sandbox: an effort run covers the union of its child changes
- [ ] 3.5 Sandbox regression: `/dx-review implementation <id>` and `/dx-review plan <id>` behave as before (Progress guard, `status: reviewed`, lesson offer, Verdicts)

### Phase 4: Docs, changeset, dogfood
#### Automated
- [ ] 4.1 Reference, tutorials, explanation and `DESIGN.md` updated (documentation skill); new test-strategy tutorial added
- [ ] 4.2 Changeset (minor) added with the compare-both-templates note, the argument grammar and the `dx-new` seed heading
- [ ] 4.3 `grep -rn 'not available yet' skills docs` returns nothing; `npm run lint:skills` passes
#### Manual
- [ ] 4.4 `/dx-init` re-run in this repo seeds `test-strategy.md`; this repo's `policy-template.md` and `report-template.md` refreshed by hand
- [ ] 4.5 Every child change touching `skills/**` has its own changeset (`review-policy-core`, `plan-policy`, this one)
