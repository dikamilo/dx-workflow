# Plan: Standard Proposals

## Approach
At the end of a `/dx-refactor-discover` run, after the top pick and slice 1's optional `revisit` line, the skill looks across the **whole presented Candidate set** (lens and standard-driven) for a cause shared by **at least 3 distinct Candidates** that no rule covers. Each cause that clears the bar becomes one **Standard Proposal**: a prescriptive one-line rule, its target (a new rule in `<layer>/<topic>.md`, or an amendment to `<existing path> § <rule>`), and the Candidates it is drawn from. The user accepts or declines Proposals alongside picking Candidates. Accepting one prints `/dx-standards-update` to run in the same session, and the skill stops there. It never writes `context/standards/`.

The bar and its guards, from the slice's cases:
- **Quiet by default (case A).** No cause clears the bar → nothing is printed. No Proposal, no "none found" line.
- **Distinct Candidates, not sites (case E).** One Candidate with many sites counts once. Candidates the lessons skip removed are not in the set and don't count.
- **Already covered (case B).** Before proposing, read the target standard file (and any loaded standard in that layer). If a rule there already states the cause, there is no Proposal. Its violations are already standard-driven Candidates (slice 1).
- **New vs amendment (cases 5, 6, 7).** If the cause sits within an existing standard's topic, the Proposal amends that standard. Otherwise it proposes a new rule in the best-fit `<layer>/<topic>.md`. With an empty `context/standards/`, every Proposal is a new rule, fed only by lens Candidates.
- **Amendments only extend or tighten (case F).** An amendment never loosens a rule. A standard that protects code at a cost still gets only slice 1's `revisit <standard> § <rule>?` line, which stays a separate thing.
- **A project rule, not a lens restated.** A Proposal names something checkable in this codebase (where a unit lives, what it may depend on, how a recurring job is done). "Keep modules deep" is already the lens's job. A Proposal also never mandates a layer with no second use (the `minimal-implementation` guard slice 1 applies to Candidates).
- **Declined with a reason (case C).** Offer `/dx-lesson` ("don't propose rule X because Z"). §1's lessons skip covers it, so the next run doesn't propose it again.
- **Proposal and promotion together (case D).** The Done-when output prints every applicable next command (the promotion's and `/dx-standards-update`) and runs none of them.

Decided in the interview:
- **Direct graduation.** An accepted Proposal goes straight to `/dx-standards-update`. It does not go through a Lesson first, because 3+ Candidates are already the recurrence evidence a lesson exists to build up. So a Proposal becomes a **second promotion path** into `context/standards/`, next to a Lesson graduating. `knowledge-layer.md`'s "That is the only promotion path" line, `DESIGN.md` §8 (text and lifecycle diagram) and the docs change to name both. The promotion criterion in `knowledge-layer.md` also changes, so that `dx-standards-update`'s "recurring, not a one-off" check accepts a Proposal's recurrence across Candidates.
- **Bar: ≥3 distinct Candidates.** On a typical run of 5 to 8 Candidates that allows at most about 2 Proposals, so no separate per-run cap is needed.
- **Handoff through the conversation.** The printed command is a plain `/dx-standards-update`, run in the same session. That is its existing "from the conversation" entry point, so `dx-standards-update/SKILL.md` is **not** changed. A `/clear` in between loses the Proposal, which is consistent with Proposals being ephemeral (the frame puts any backlog of pending Proposals out of scope).

Settled here without a question:
- **Placement: §3, under the top pick and the revisit line.** That is the only point where the whole Candidate set is in view, and it is before the user answers, so one reply covers both the picks and the Proposals.
- **Proposal shape (inline, markdown):**
  ```
  Standard Proposal — new rule in <layer>/<topic>.md        (or: amend <path> § <rule>)
    Rule: <one prescriptive line, "do this">
    Cause: <the shared cause> — Candidates <n>, <n>, <n>
  ```

## Standards to apply
> Matched from context/standards/ by domain + topic. A checklist the implementer follows and impl-review verifies.
- [ ] `global/skill-authoring.md` § skill-creator pipeline: edit `dx-refactor-discover/SKILL.md` through `skill-creator`. **Deviation, stated rather than dropped:** no evals. This repo has no eval harness (lesson 2026-07-28), and the Manual sandboxed runs in Phases 1–2 are the verification.
- [ ] `global/skill-authoring.md` § no-op test: the Proposal text in §3 is principle-first. The bar, the guards and the shape, with no procedural clustering algorithm.
- [ ] `global/skill-authoring.md` § shared reference: the promotion-path contract lives once in `knowledge-layer.md`. `dx-refactor-discover` doesn't restate it.
- [ ] `global/skill-authoring.md` § no auto-chain / Done when: `/dx-standards-update` is printed, never invoked, and `## Done when` names the Proposal outcome.
- [ ] `global/skill-authoring.md` § naming consistency: use the glossary's **Standard Proposal**, **Candidate** and **Standard** exactly. A review **Finding** stays out of this vocabulary.

## Priors & gotchas
> From foundation/lessons.md, brainstorm and frame caveats: decisions already made, risks not to relitigate.
- **Skills ship without evals (lesson 2026-07-28).** Scripted subagent runs check routing, not judgment. Proposal quality (spam vs signal) is exactly the judgment part, so the Manual checks are the real gate.
- **Proposal spam (frame caveat).** A Proposal on every run gets ignored. Case A's silence and the ≥3 bar are the mitigation. In verification, a run that proposes something on a codebase with no real pattern is a failure, even if the Proposal reads well.
- **Scoped runs load only in-scope standards.** A Proposal's target file may not be loaded, so read it before proposing, or case B breaks and the run proposes a rule that already exists.
- **"Never proposes changing it" (`docs/explanation/knowledge-layer.md:188`)** is slice 1's wording about the standards lens. It becomes wrong once amendments exist. Reword it to: the lens never loosens a standard, while a Proposal may extend one.
- **"Only promotion path" appears in several places** (`knowledge-layer.md:27`, `docs/tutorials/build-standards.md:135`, `DESIGN.md` §8 prose and diagram, `docs/explanation/knowledge-layer.md` diagram and prose). Change them together, or they contradict each other.
- **No empty layers in a standard's name.** This applies to Proposals just as it does to Candidates.
- **Changeset coverage.** This slice touches `skills/**` (`dx-refactor-discover`, `dx-references/references/knowledge-layer.md`) and needs its own `.changeset/*.md`, separate from slice 1's.
- **Test setup gap:** the repo has no harness for skill behavior, only `npm run lint:skills`. The user cases (parent 5–7, slice A–F) are asserted by Manual sandboxed runs. No harness is introduced here.

## Phases

### Phase 1: New-rule Proposal end to end (parent cases 5, 7; slice A, C, D, E)
Through `skill-creator`, update `dx-refactor-discover/SKILL.md`:
- §3: after the top pick and revisit line, the ≥3-distinct-Candidates bar, silence when no cause clears it, the Proposal shape, and the "project rule, not a lens restated / no empty layers" guards.
- §1: the lessons skip also covers "don't propose rule X because Z".
- §5: a declined Proposal with a reason offers `/dx-lesson`.
- `Done when`: a `Propose a rule: /dx-standards-update` line (run in this session), printed alongside any promotion command.
- The opening paragraph mentions that the skill proposes but never writes a standard.

Update `knowledge-layer.md`'s promotion section: two paths, and a Proposal's recurrence across Candidates meets the "recurring" criterion. Update `docs/reference/skills.md` (`/dx-refactor-discover` Writes and Prints next) and `docs/tutorials/find-refactors.md` (a section showing a new-rule Proposal after the candidates, then `/dx-standards-update` accepting it). Demoable: a run on a bed with three Candidates sharing an uncovered cause ends with one Proposal, and `/dx-standards-update` in the same session writes the rule.

### Phase 2: Amendments and existing rules (parent case 6; slice B, F)
Through `skill-creator`, extend §3: the covered-rule check (read the target file even when it is out of scope), new vs amendment by topic, and amendments that only extend or tighten, never loosen, with the revisit line kept separate. Add an amendment example to `docs/tutorials/find-refactors.md`. Demoable: on the slice 1 bed (Phase 1 of `refactor-discover-standards-lens`), a cause next to an existing standard yields `amend <path> § <rule>`, and a cause the standard already states yields no Proposal.

### Phase 3: Second promotion path in the design doc and explanation pages, changeset
- `DESIGN.md` §8: the distinction prose (l.247) and the lifecycle diagram gain `refactor-discover -- "Standard Proposal (≥3 Candidates)" --> standards-update`.
- `DESIGN.md` §9: the `refactor-discover` paragraph covers Proposals.
- `docs/explanation/knowledge-layer.md`: the flow diagram, the prose, and the l.188 rewording.
- `docs/tutorials/build-standards.md:135`: "only promotion path" → two paths.
- Add a `minor` changeset for Standard Proposals.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: New-rule Proposal end to end
#### Automated
- [x] 1.1 `dx-refactor-discover/SKILL.md` §1/§3/§5/`Done when` updated via `skill-creator` (≥3 bar, silence, Proposal shape, guards, decline → lesson, lessons skip, printed `/dx-standards-update`) — c897948
- [x] 1.2 `knowledge-layer.md` promotion section names both paths, and the recurrence criterion accepts a Proposal — c897948
- [x] 1.3 `docs/reference/skills.md` and `docs/tutorials/find-refactors.md` updated for new-rule Proposals — c897948
- [x] 1.4 `npm run lint:skills` passes — c897948
#### Manual
- [x] 1.5 Case 5: three Candidates sharing an uncovered cause → one Proposal citing them plus the `/dx-standards-update` command; running it in the same session writes the rule without pushback that it is "a one-off"
- [x] 1.6 Case 7: on a project with an empty `context/standards/`, lens Candidates alone yield a new-rule Proposal
- [x] 1.7 Case A: a run with no shared cause prints Candidates only, with no Proposal and no "none found" line
- [x] 1.8 Case E: one Candidate with many sites and an uncovered cause → no Proposal
- [x] 1.9 Case C: declining with a reason offers `/dx-lesson`; with that lesson recorded, the re-run does not propose it
- [x] 1.10 Case D: promoting Candidates and accepting a Proposal prints both next commands and runs neither

### Phase 2: Amendments and existing rules
#### Automated
- [x] 2.1 `dx-refactor-discover/SKILL.md` §3 extended via `skill-creator` (covered-rule check incl. out-of-scope target file, new vs amendment, extend/tighten only) — 60ee316
- [x] 2.2 Amendment example added to `docs/tutorials/find-refactors.md` — 60ee316
- [x] 2.3 `npm run lint:skills` passes — 60ee316
#### Manual
- [x] 2.4 Case 6: a cause next to an existing standard yields `amend <path> § <rule>`, not a new rule
- [x] 2.5 Case B: a cause an in-scope standard already states surfaces only as a standard-driven Candidate, with no Proposal
- [x] 2.6 Case F: a standard protecting code at a cost still gets only the `revisit` line, and no loosening amendment is proposed

### Phase 3: Second promotion path in the design doc and explanation pages, changeset
#### Automated
- [x] 3.1 `DESIGN.md` §8 (prose + lifecycle diagram) and §9 updated — c800626
- [x] 3.2 `docs/explanation/knowledge-layer.md` (diagram, prose, l.188) and `docs/tutorials/build-standards.md:135` updated — c800626
- [x] 3.3 No remaining "only promotion path" claim (grep over `skills/`, `DESIGN.md`, `docs/`) — c800626
- [x] 3.4 `.changeset/*.md` added (`minor`, one-line summary of Standard Proposals) — c800626
- [x] 3.5 `npm run lint:skills` passes — c800626
