# Plan: Standards lens

## Approach
`dx-refactor-discover` gains the project's `context/standards/` as a third source of Candidates, next to `module-design` and `design-lenses`, on the unchanged scan → rank → pick → design twice → promote pipeline. The skill loads `knowledge-layer` in §1 and reuses its *domain × topic* matching rule to pick only the standards that bear on the scope (a scoped run gets `global/` plus the areas the scoped code belongs to, an unscoped run gets every standard that applies somewhere in the tree). That also makes true the existing claim in `knowledge-layer.md:3` and `DESIGN.md` §8 that the skill is a `knowledge-layer` consumer. From the loaded standards it keeps only **structural rules that existing code can be checked against** (where a unit lives, what it may depend on, one unit/one role). It skips style nits and rules about how to write plans or new work. Each broken rule becomes **one** Candidate with a site count and a few representative sites. The Candidate cites `<standard path> § <rule>`, may use the standard's role names for what sits where, and still states the win in `module-design` terms. It is ranked with the lens Candidates by the usual churn + strength-tag rules.

Four guards come from upstream. **Standard wins over a lens:** code that follows a standard gets no lens Candidate, and at most one "revisit this standard?" line under the list when the conflict looks costly (parent case 3). **Overlap merges:** a module that breaks a rule and also trips a lens yields one standard-driven Candidate that carries the lens win (case 6). **Minimal-implementation guard:** a Candidate whose after-shape adds a layer with no second use (e.g. a port with one adapter) is capped at `Speculative` with the deletion-test result stated. It is dropped outright when a loaded standard says minimal implementation wins (case 5). **Rejected stays skipped:** §1's lessons skip also covers "don't migrate X to rule Y because Z" (case 7).

On promote, each standard-driven Candidate carries a `Standard:` line, both in the single-promote seed `research/<topic>.md` and in the promote-many seed summary that `dx-new` copies per Candidate (case 8, parent case 4).

Decided in the interview:
- **Cheap test first, inside the plan.** The roadmap's pre-plan test was not run, so Phase 1 is a go/no-go run of today's skill with a building-blocks-style standard passed by hand, before any skill edit.
- **Full finding → Candidate rename in this slice.** The rename covers discovery output in `dx-refactor-discover`, the `dx-new` seed paragraph, `DESIGN.md` §9 and the docs. The seed heading literal `## Refactor opportunities (from /dx-refactor-discover)` stays byte-identical because it is `dx-new`'s parse key. Review **Findings** (`dx-*-review`, `dx-review-triage`) are a different glossary term and stay as they are.

Settled here without a question (recommendation taken, upstream leaves one sensible answer):
- **Load `knowledge-layer`, don't correct the claim.** Its matching heuristic is exactly the scoping rule the brainstorm resolved.
- **The "sole vocabulary" exception is stated once per place that claims it:** `dx-refactor-discover/SKILL.md` §2, `design-lenses.md:3`, `DESIGN.md` §9, `docs/explanation/research-and-frame.md` (~l.190–195), `docs/reference/skills.md`. The exception text: a standard-driven Candidate may name *where things sit* with the standard's roles, while its *win* is still said in `module-design` terms.
- **`knowledge-layer.md`'s "only promotion path" line is untouched.** Proposals and their graduation path are slice 2.

## API & contracts
The contract is the per-Candidate entry of the promote-many seed summary, which `dx-new` parses into one `context/efforts/<id>/research/<topic>.md` per Candidate.

```
1. **<title>** — <module/files>
   Why: <reason + the cashed-out win, in module-design terms>
   Shape: <before → after>
   Proposed: <the move> (<Strong|Worth exploring|Speculative>, <dependency category>)
   Standard: <context/standards/… path> § <rule it breaks>   (only on a standard-driven Candidate)
   Sketch: <the chosen interface and why it won>              (only if §4 explored this one)
```

- **Additive.** The heading literal, the numbered entry, every existing line and the closing `Start with:` line are unchanged. `Standard:` is optional, like `Sketch:`. `dx-new` keeps it verbatim when present, alongside `Sketch:`, in the research file body.
- **Version skew.** Skills ship standalone via skills.sh, so a new `dx-refactor-discover` can meet an old `dx-new`. The old `dx-new` drops the `Standard:` line (it copies a fixed list of lines). The degradation is soft: the Candidate's title and `Why:` still name the rule. Both skills bump in the same changeset release; no compatibility shim.
- The single-promote seed (`research/<topic>.md` written by `dx-refactor-discover` itself) carries the same `Standard:` line. It is internal to the skill, with no other caller.

## Standards to apply
> Matched from context/standards/ by domain + topic. A checklist the implementer follows and impl-review verifies.
- [ ] `global/skill-authoring.md` § skill-creator pipeline: edit `dx-refactor-discover/SKILL.md` and `dx-new/SKILL.md` through `skill-creator`, not hand-edits in isolation. **Deviation, stated rather than dropped:** no evals. This repo has no eval harness (lesson 2026-07-28). Verification is the Phase 1 run plus the Manual sandboxed runs in Phases 2–3.
- [ ] `global/skill-authoring.md` § token efficiency / no-op test: the new §1/§2/§3 text is principle-first, with no procedural rule-classification checklist. Delete any sentence the model already obeys.
- [ ] `global/skill-authoring.md` § shared reference: the matching rule lives once in `knowledge-layer.md` and the skill invokes it by topic. It is not copied into `SKILL.md`.
- [ ] `global/skill-authoring.md` § no auto-chain / Done when: the printed `Next:` block keeps its shape, and `## Done when` still holds (updated for the rename only).
- [ ] `global/skill-authoring.md` § naming consistency: the glossary's **Candidate**, **Finding** and **Standard** are used exactly as defined. Also check "standard-driven Candidate" against the glossary (invoke `dx-domain` if it needs pinning).

## Priors & gotchas
> From foundation/lessons.md, brainstorm and frame caveats: decisions already made, risks not to relitigate.
- **Skills ship without evals (lesson 2026-07-28).** Subagent runs with scripted answers check routing, not behavior under pushback. Treat the Manual checks as the real gate.
- **Riskiest assumption:** a codebase that doesn't follow its standards yields a short, useful list, not a flood. Grouping per rule is the mitigation, and Phase 1 is the kill point. A flood there means stop and revisit the effort, not tune the prompt until it passes.
- **Rules for new work don't apply to old code.** A standard like "describe a plan in building blocks" must produce nothing. Rule classification is where noise comes from; check it explicitly in the verification runs.
- **Never build empty layers in a standard's name.** A project's `minimal-implementation.md` can pull against a structural standard, and the example building-blocks standard itself says minimal implementation wins.
- **"Sole vocabulary" appears in several places.** Change every place in the same phase, or they contradict each other.
- **`dx-new`'s seed heading is a parse key.** The rename must not touch `## Refactor opportunities (from /dx-refactor-discover)` or the `## Notes` marker text `dx-new` writes and reads for slice typing.
- **Changeset coverage.** This slice touches `skills/**`, so it needs its own `.changeset/*.md`. Slice 2 needs another; CI's gate job won't notice a missing one.
- **Test setup gap:** the repo has no test harness for skill behavior, only `npm run lint:skills`. The user cases (parent 1–4, slice 5–8) are asserted by Manual sandboxed runs below. No harness is introduced here.

## Phases

### Phase 1: Cheap test (go/no-go)
Run **today's** `/dx-refactor-discover` on one real area of a target project (the user picks it). Use a building-blocks-style structural standard present in that project's `context/standards/` and pass it by hand in the argument (the priced do-nothing). Judge the output: are the rule-driven observations few (on the order of one per broken rule, not one per site) and each useful enough to promote? Record the run and the verdict in `context/changes/refactor-discover-standards-lens/research/cheap-test.md` (`kind: codebase`, source = the target project + area, with the representative output and the verdict). **No-go** means stop the slice and take the evidence back to the effort (`/dx-brainstorm` or amend the frame); don't proceed to Phase 2. The same target and area are reused as the verification bed in Phases 2–3.

### Phase 2: Standards lens in the scan (parent cases 1–3, slice cases 5–7)
Through `skill-creator`, update `dx-refactor-discover/SKILL.md`:
- §1 loads `knowledge-layer`, picks the in-scope standards and keeps only their structural rules.
- §1 widens the lessons skip to rejected migrations.
- §2 adds standards as a source, with the standard-wins-over-lens rule, the overlap merge, the minimal-implementation guard and the vocabulary exception.
- §3 adds the per-rule Candidate shape (count + representative sites + `<path> § <rule>` citation) and the one-line "revisit this standard?" note.
- The finding → Candidate rename runs across the whole skill.

Update `design-lenses.md:3` with the exception. Update the docs this phase touches: `docs/reference/skills.md` (`/dx-refactor-discover` Reads/Writes plus the vocabulary wording) and `docs/tutorials/find-refactors.md` (a section showing a standards-driven Candidate on a scoped run, and the rename). Demoable: the modified skill run on the Phase 1 bed now surfaces the standard-driven Candidate without the path being passed.

### Phase 3: Standard rides into the seed (parent case 4, slice case 8)
- In `dx-refactor-discover/SKILL.md` §5 and the `Done when` seed template, add the optional `Standard:` line to the single-promote research seed and the promote-many seed summary.
- Through `skill-creator`, make `dx-new/SKILL.md`'s multi-Candidate seed paragraph keep `Standard:` verbatim like `Sketch:`, and apply the rename there.
- Update `docs/reference/skills.md` (`/dx-new` Writes) and the promote-many example in `docs/tutorials/find-refactors.md`.

Demoable: promote one and promote many on the bed, and the rule reaches `research/<topic>.md`.

### Phase 4: Design doc, explanation pages, changeset
- `DESIGN.md` §8 (the consumer line is now true; no new lifecycle link, that is slice 2).
- `DESIGN.md` §9: standards as a source, the vocabulary exception, the rename at l.119/123/288/299.
- `docs/explanation/research-and-frame.md` (vocabulary paragraph), `docs/explanation/knowledge-layer.md` (standards are also read by refactor discovery, not only matched into plans), `docs/explanation/efforts-and-changes.md` (rename in the path-D line).
- Add a `minor` changeset for the lens.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Cheap test (go/no-go)
#### Manual
- [x] 1.1 User picks a target project + area with a building-blocks-style structural standard in its `context/standards/` — 4572222
- [x] 1.2 Today's `/dx-refactor-discover <area> — also check <standard path>` run; output captured — 4572222
- [x] 1.3 Verdict recorded in `research/cheap-test.md`: go (few, useful, per-rule) or no-go (flood / noise → stop the slice, revisit the effort) — 4572222

### Phase 2: Standards lens in the scan
#### Automated
- [x] 2.1 `dx-refactor-discover/SKILL.md` §1–§3 updated via `skill-creator` (knowledge-layer load, structural-rule filter, per-rule Candidate, standard-wins, overlap merge, minimal-implementation guard, rejected-migration skip, vocabulary exception) — 7903fd8
- [x] 2.2 finding → Candidate rename across `dx-refactor-discover/SKILL.md`; seed heading literal unchanged (grep confirms) — 7903fd8
- [x] 2.3 `design-lenses.md:3` states the exception — 7903fd8
- [x] 2.4 `docs/reference/skills.md` and `docs/tutorials/find-refactors.md` updated for the lens and the rename — 7903fd8
- [x] 2.5 `npm run lint:skills` passes — 7903fd8
#### Manual
- [x] 2.6 Case 1: scoped run on the Phase 1 bed, standard **not** named, surfaces one Candidate per broken rule with a count + representative sites + `<path> § <rule>`, ranked with lens Candidates
- [x] 2.7 Case 2: unscoped run loads applicable standards only; a plan-authoring or style-only rule produces nothing
- [x] 2.8 Case 3: code that follows a standard a lens would call shallow gets no lens Candidate (at most the one-line revisit note)
- [x] 2.9 Case 5: a rule requiring a single-adapter layer yields no Candidate or a `Speculative` one, never a "build the layer" `Strong`
- [x] 2.10 Case 6: a module both breaking a rule and tripping a lens appears once, citing the rule and stating the lens win
- [x] 2.11 Case 7: with a "don't migrate X to rule Y because Z" lesson in `lessons.md`, the re-run skips it

### Phase 3: Standard rides into the seed
#### Automated
- [x] 3.1 `dx-refactor-discover/SKILL.md` §5 + `Done when` template carry the optional `Standard:` line — 4b392c5
- [x] 3.2 `dx-new/SKILL.md` keeps `Standard:` verbatim in the per-Candidate research file (via `skill-creator`); rename applied; heading literal and `## Notes` marker unchanged — 4b392c5
- [x] 3.3 `docs/reference/skills.md` (`/dx-new`) and the promote-many example in `docs/tutorials/find-refactors.md` updated — 4b392c5
- [x] 3.4 `npm run lint:skills` passes — 4b392c5
#### Manual
- [x] 3.5 Case 4 / 8: promote one → seed `research/<topic>.md` names the standard path + rule; promote many → `/dx-new "<seed>"` writes each standard-driven Candidate's research file with its `Standard:` line
- [x] 3.6 Case 4: rejecting a standard-driven Candidate with a reason offers `/dx-lesson` with the "don't migrate X to rule Y because Z" phrasing

### Phase 4: Design doc, explanation pages, changeset
#### Automated
- [x] 4.1 `DESIGN.md` §8/§9 updated (consumer line true, standards source, vocabulary exception, finding → Candidate) — 04a4b4c
- [x] 4.2 `docs/explanation/{research-and-frame,knowledge-layer,efforts-and-changes}.md` updated — 04a4b4c
- [x] 4.3 No remaining "sole vocabulary" / "only phrasing vocabulary" claim without the exception (grep over `skills/`, `DESIGN.md`, `docs/`) — 04a4b4c
- [x] 4.4 `.changeset/*.md` added (`minor`, one-line summary of the standards lens) — 04a4b4c
- [x] 4.5 `npm run lint:skills` passes — 04a4b4c
