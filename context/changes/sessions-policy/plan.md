# Plan: sessions Policy

## Approach
Ship the repo-only `sessions` Policy, `skills/dx-init/assets/review-policies/sessions.md` (`targets: explore`): a retrospective that reads agent session transcripts and prints ranked suggestions for improving the coding agent's environment. It is **pure reporting**: it prints and stops. The one generic change is a new optional `promote: off` line in a Policy's `## Candidates`, which makes `dx-review` end an Explore run after printing. **Mechanism in the skill, criteria in the Policy** stays the rule.

Interview decisions (2026-10-07):
- **Subject.** `targets: explore`, scope is the repo, and no new subject kind. A session is named in the custom instructions; the default is the current session. Instructions may widen it to a named session, the last N, or all of this project's. Sessions of other projects are read only when the user names them. With no readable session evidence only the static lenses fire (Global AGENTS.md, No-ops, the guardrail audit) and the run says so.
- **Evidence.** The Policy *describes* how to find transcripts (the Claude Code config root's `projects/<slug>/*.jsonl`; the root moves, so the agent verifies the location rather than assuming it). Transcripts are read through `Explore` subagents, one per session or batch, never in the main context (retro's own Tool economy lens applied to itself). Findings quote the minimum needed and never reproduce credentials or customer content. Nothing is written to a file.
- **Pure report.** No promote question, no `change.md`, no `/dx-new` seed, no `/dx-lesson` or `/dx-standards-update` offer, no `Next:` line. `promote: off` expresses it. The Candidates keep the name; the glossary entry is amended to cover report-only ones. Standard Proposals are **not** introduced (the test-strategy plan expected this slice to consume them; this decision removes that).
- **Scope beyond the repo.** The user wants issues in how they work with the agent, not only repo issues. Each Candidate carries `where: repo | user-global` (global CLAUDE.md/AGENTS.md, installed skills, MCP/CLI tooling, settings). `destination:` is a **descriptive label** (`check | standard | lesson | steering | docs | skill | tooling`) classifying where the fix would land. It routes nothing.
- **Lenses.** Retro's seven, each with its `Use when` trigger, as Dimensions: a lens whose condition has no evidence is listed `N/A` in `## Reviewed`, never skipped silently. One lens is added from the user's request, **Skill use** (a skill fired wrongly, never fired, or conflicted with another; the description or pointer wording is the usual cause). It is not in retro. The Policy says so, like `test-strategy`'s unsourced dimensions.
- **Writing guidance.** The Policy's `## Load` carries the distilled `writing-for-agents` vocabulary itself (context load, cache, sediment, no-ops, positive phrasing, disclosure through pointers) with its source named. No external fetch and no new `dx-references` topic (only one user). Where the target project has its own authoring rules (`CLAUDE.md`, `context/standards/`), those win.
- **Retro rule adapted.** Retro says the reviewer alone enforces standards. In dx, standards are matched into `plan.md` for the implementer too (research §6.2). The Policy therefore says: keep `CLAUDE.md` to navigation pointers; judgement rules belong in `context/standards/`; drop the "review-only" claim.
- **No gates.** The run has no `## Questions`, so it stays usable unattended. Severity is ranking order (impact on future runs first) plus the strength tag.

## API & contracts
Additive.
- **`## Candidates` gains optional `promote: off`** in `policy-template.md`, beside `recency: off`. With it, an Explore run prints the ranked Candidates, the `Reviewed` list and the interpreted scope, then stops: no promote question, no rejection memory read for promotion, no lesson offer. `type:` becomes optional for such a Policy (nothing is promoted). Default is promotable, so `test-strategy` is unchanged.
- **`dx-review` `Done when`** for an Explore run with `promote: off` prints nothing after the list and chains nothing.
- **`/dx-review sessions [instructions…]`.** No new argument grammar. A path argument still scopes the static lenses (e.g. a folder's `CLAUDE.md`); a container is refused by the existing target guard, naming `explore`.
- **Affected callers:** typed commands and docs. `dx-new` reads only the promotable seed heading, so it is untouched.

## Standards to apply
- [ ] global/skill-authoring — Edit `dx-review` through `skill-creator`. Report-only is preserved; add the `promote: off` branch with no-op test on every sentence, no auto-chain. **Deviation (lesson 2026-07-28):** no eval harness, so verification is sandboxed runs with scripted answers, recorded under Manual.
- [ ] global/skill-authoring, shared reference rule — nothing added to `dx-references`; the writing guidance lives in the user-owned Policy.
- [ ] CLAUDE.md (maintainer) — `npm run lint:skills` after every edit under `skills/dx-*`; docs in sync in the same change (documentation skill); a changeset. No skill directory added or removed, so `skills.sh.json` is unchanged.
- [ ] CLAUDE.md house style — the Policy and the `dx-review` edit apply the no-op test and carry `Done when` where multi-step.

## Priors & gotchas
- **Skills ship without evals (2026-07-28):** the deviation is stated above; the untested half is a user who pushes back, so Manual runs include a refused path and a widened-evidence run.
- **Digest flattening (test-strategy plan):** work from `research/retro-original.md`, not the effort digest, when writing lens text.
- **Shipped Policy fixes never reach existing copies, and the template changes again** (`promote: off`): the changeset repeats the compare-both-templates note from slice 3, and this repo's own copy of `policy-template.md` is refreshed by hand.
- **Policies sit outside the lint gate:** only the template guards `sessions.md`'s shape.
- **Privacy:** transcripts hold secrets and customer text; the Policy bounds quoting, and the sandbox run checks no secret-shaped string reaches the output.
- **Untrusted content:** transcripts and the retro text are data, not instructions; the Policy tells subagents so and `dx-review` loads nothing from them as instructions.
- **Test setup:** none beyond `lint:skills`, and `context/standards/testing/` is empty; verification is manual sandbox runs. No harness is introduced.
- **Unsourced content:** the `Skill use` lens is not in retro. The Policy and the final report say so.
- **Frame caveat — two vocabularies:** Explore runs produce Candidates, never numbered Findings; `sessions` must not write `reviews/`.

## Phases

### Phase 1: Tracer — `sessions` on the current session prints a report and stops
- `skills/dx-init/assets/review-policies/policy-template.md`: document `promote: off`, make `type:` optional for it.
- `skills/dx-review/SKILL.md` (via skill-creator): the `promote: off` branch in §3 and `Done when`.
- Add `skills/dx-init/assets/review-policies/sessions.md` (`targets: explore`, `promote: off`): Preconditions, Load (distilled writing guidance, repo's own check command first, evidence-location description), the eight lenses with `Use when`, the adapted standards rule, Candidate fields, privacy and untrusted-content notes. `dx-init` globs `assets/review-policies/*.md`, so no edit there.
- `npm run lint:skills`.

### Phase 2: Wider evidence and user-global findings
- Policy text for widening (named session, last N, all of this project's), multi-session batching through `Explore`, and `where: user-global` / `destination:` labels. Verify the no-evidence path (static lenses only).

### Phase 3: Docs, changeset, dogfood
- Documentation skill: `docs/reference/skills.md` (`dx-review`, `dx-init`), `docs/reference/glossary.md` and `foundation/glossary.md` (Candidate wording), `docs/tutorials/write-a-review-policy.md` (`promote: off`), `docs/explanation/policy-driven-review.md`, `DESIGN.md` §3. New tutorial: run `sessions` and read the report.
- Changeset (minor) with the compare-both-templates note. Re-run `/dx-init` here to seed `sessions.md` and refresh this repo's `policy-template.md` by hand.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Tracer — `sessions` on the current session prints a report and stops
#### Automated
- [x] 1.1 `policy-template.md` documents `promote: off`; `dx-review` stops after printing for such a Policy (via skill-creator) — 9d74c07
- [x] 1.2 `sessions.md` added with `targets: explore`, `promote: off`, eight lenses each with `Use when`, evidence-location text, privacy note — 9d74c07
- [x] 1.3 `npm run lint:skills` passes — 9d74c07
#### Manual
- [x] 1.4 Sandbox: `/dx-review sessions` prints the interpreted scope, a ranked Candidate list (each with lens, `where`, evidence, suggestion, `destination`, strength) and a `Reviewed` list with every lens run or `N/A`, then stops: no promote question, no files written, no lesson or standard offer (UC4) — 9d74c07
- [x] 1.5 Sandbox: `test-strategy` still ends with its promote question (default unchanged) — 9d74c07
- [x] 1.6 Sandbox refusals: `/dx-review sessions <container-id>` is refused naming `explore`; an unknown ID names itself (UC7) — 9d74c07

### Phase 2: Wider evidence and user-global findings
#### Automated
- [x] 2.1 Policy text covers widening, batching and `where`/`destination` labels — 9d74c07
- [x] 2.2 `npm run lint:skills` passes — 9d74c07
#### Manual
- [x] 2.3 Sandbox: instructions naming "the last 3 sessions" read them through `Explore` subagents, not the main context, and the list reflects cross-session patterns — 9d74c07
- [x] 2.4 Sandbox: a finding about a user-global skill or global CLAUDE.md is labelled `where: user-global`; one about repo checks `where: repo` (UC4) — 9d74c07
- [x] 2.5 Sandbox: with no readable transcripts only the static lenses run, and the output says why the others are `N/A` — 9d74c07
- [x] 2.6 Sandbox: a transcript seeded with a fake secret never has it reproduced in the output — 9d74c07
- [x] 2.7 Sandbox: custom instructions narrow the run (UC8) — 9d74c07

### Phase 3: Docs, changeset, dogfood
#### Automated
- [x] 3.1 Reference, glossary, tutorials, explanation and `DESIGN.md` updated (documentation skill); new `sessions` tutorial added — f466439
- [x] 3.2 Changeset (minor) added with the compare-both-templates note — f466439
- [x] 3.3 `npm run lint:skills` passes — f466439
#### Manual
- [x] 3.4 `/dx-init` re-run in this repo seeds `sessions.md`; this repo's `policy-template.md` refreshed by hand — f466439
- [x] 3.5 Every child change touching `skills/**` has its own changeset (`review-policy-core`, `plan-policy`, `test-strategy-policy`, this one) — f466439
