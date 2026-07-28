---
topic: sdlc-hardening
kind: codebase
source: dx-workflow repo (skills/, DESIGN.md, CLAUDE.md)
gathered: 2026-07-27
git_commit: 6bdf243de09327a43db1769e7cbcd3435f5a569b
---

## Scope

This effort names six hardening concerns (see `context/efforts/sdlc-hardening/effort.md`). No `roadmap.md` exists yet and no prior `context/changes/**/research.md` or `plan.md` exist anywhere in the repo (this is the first work item run through the dx- pipeline in this repo), so there is no prior art to cite — every finding below is a fresh read of current skill/reference behavior. This file is the shared baseline `dx-roadmap` (or a `dx-frame`) can build slice sequencing on, so it covers all six concerns rather than picking one in isolation — narrower per-slice research can still be spawned later under each slice's own change container.

## 1 — Entry point / "build nothing" outcome

`dx-new` is pure routing and contains no divergent "should we build this" questioning: "Your one job is to pick the container level, create its identity file, and print the next command. You do not research, frame, or plan — you route." (`skills/dx-new/SKILL.md:10`). It only asks a clarifying question when the change-vs-effort *sizing* call is a coin-flip (`skills/dx-new/SKILL.md:26`) — that's a sizing question, not a build/no-build one.

`dx-frame` only runs after a container already exists — its guard requires `change.md`/`effort.md` to be present and tells the user to run `/dx-new` first if not (`skills/dx-frame/SKILL.md:12`). It weighs alternative framings but never an "abandon" framing: "the initial framing was right" is presented as the only non-reframe outcome (`skills/dx-frame/SKILL.md:22`), and its "Done when" always forwards into `/dx-plan` or `/dx-roadmap` (`skills/dx-frame/SKILL.md:39-45`). `dx-new`'s own "Done when" likewise only ever prints a forward path (`skills/dx-new/SKILL.md:37-48`).

**Conclusion:** there is currently no supported "decide not to build" outcome anywhere before or after a container is created. This matches the effort's proposed `dx-brainstorm` slice — a new entry point ahead of `dx-new` is the only way to add this without retrofitting exit ramps into every downstream skill.

## 2 — Untrusted-content boundary (research → plan → implement)

`dx-research`'s External mode section gives no data/instruction framing at all: "Use **WebFetch**/**WebSearch** (no MCP required). Synthesize a summary with **inline citations and a fetch date**." (`skills/dx-research/SKILL.md:31`) — no injection-guard language.

`skills/dx-references/references/knowledge-layer.md` is unrelated to this concern (it governs standards/lessons/glossary registers, not content trust).

Downstream, `dx-plan` treats `research.md`/`plan.md` purely as prior-decision material to cite ("cite it in the plan instead of re-litigating it", `skills/dx-plan/SKILL.md:18`) with no caveat that externally-fetched content inside it should be treated as data, not instructions. A grep for trust/untrusted/injection language across `dx-plan/SKILL.md` and `dx-implement/SKILL.md` returned nothing.

**Conclusion:** the injection path is real and unguarded end-to-end — nothing in the write path (`dx-research` external mode) or the read path (`dx-plan`, `dx-implement` consuming `research.md`) marks fetched content as inert data.

## 3 — Authoring rules: honor-system vs. mechanical

Every rule in CLAUDE.md's "Authoring rules (the house style)" section currently holds in practice but has **zero automated enforcement**:
- `package.json` has only `list-skills`/`install-skills` — no lint/test/check script.
- No `.github/` directory exists — no CI at all.
- No lint script or test file anywhere validates SKILL.md frontmatter or body content (`find` for `*lint*`/`*.test.*` returned nothing).
- Frontmatter shape (`disable-model-invocation: true` vs `user-invocable: false`), absence of unquoted `": "` in descriptions, and body-size (11-61 lines across skills, no cap) all currently conform, but only by author discipline.
- `dx-references` topic-pointer resolution: all 17 call sites across `skills/*/SKILL.md` currently resolve to one of the 8 files in `skills/dx-references/references/`, but the only safety net is `dx-references`'s own runtime "topic not found" fallback (`skills/dx-references/SKILL.md:9-10`) — a runtime degradation path, not a pre-commit check.
- `docs/reference/skills.md` (290 lines, 11 sections) currently covers all 20 skills, but nothing diffs it against `skills/` — the "Keep docs in sync" rule (CLAUDE.md:24-28) is a review expectation, not a check.

**Conclusion:** this is the effort's proposed content-lint-gate slice — a genuine gap, not a false alarm; every one of the six candidate checks (frontmatter shape, description quoting, body budget, topic resolution, docs-sync) is currently unchecked.

## 4 — Interview reference / adversarial challenger

The `interview` reference is invoked by `dx-frame` (`skills/dx-frame/SKILL.md:20`), `dx-plan` (`skills/dx-plan/SKILL.md:20`), and `dx-roadmap` (`skills/dx-roadmap/SKILL.md:28`). `skills/dx-references/references/interview.md` (27 lines) defines a 4-step ask/offer-options/explore/resolve loop with a question-scaling table — entirely about eliciting user answers. **No adversarial/challenger/self-critique step exists in it.** The closest thing to a challenge mechanism is `dx-plan-review`/`dx-impl-review`, but those are separate, optional, post-hoc skills, not part of the interview loop itself.

`dx-lesson` correctly does not invoke `interview` at all — it invokes `knowledge-layer` only (`skills/dx-lesson/SKILL.md:18`) and is explicitly anti-interview ("Don't turn a capture into an interview," `skills/dx-lesson/SKILL.md:14`), matching the effort's stated out-of-scope note.

**Conclusion:** adding a challenger pass to `interview.md` is additive and clean — no existing structure conflicts with it, and `dx-lesson`'s non-use of `interview` means it's automatically excluded without special-casing.

## 5 — Review severity scales

Confirmed exact divergence: `dx-plan-review` tags findings `[Blocker]`/`[Consider]` and closes with a `sound`/`revise`/`rethink` verdict (`skills/dx-plan-review/SKILL.md:32`); `dx-impl-review` opens with a `PASS`/`WARNING`/`FAIL` (or `N/A`) **Verdicts** block per dimension and tags findings by dimension name instead (`skills/dx-impl-review/SKILL.md:30`).

The shared `review-report` reference does **not** unify these — it explicitly codifies the split: `` `<tag>` is `Blocker`/`Consider` in `plan-review.md`, the dimension name... in `impl-review.md` `` (`skills/dx-references/references/review-report.md:15`). So the divergence is a documented design choice, not an oversight — but it is exactly the two-scale duplication the effort wants collapsed.

The shared finding format (`review-report.md:7-13`) does mandate **Location** and **Fix** for every finding; "why it matters" is only implicit inside the **Detail** field ("what's wrong, with evidence") — not a distinct required field in either skill.

**Conclusion:** unifying the scale means editing `review-report.md`'s own codified split (not just the two skill files), and adding an explicit why-it-matters field is a genuinely new requirement, not a tightening of an existing one.

## 6 — Cross-skill "derive, don't maintain" formats

No section in DESIGN.md currently enumerates "formats with more than one consumer" — only the principle exists (§14 rule 9, `DESIGN.md:492`; rule 1, `DESIGN.md:484`). Per format:

- **`## Progress` checkboxes** — defined once authoritatively (§7.3, `DESIGN.md:295-306`, plus `skills/dx-references/references/progress-format.md`); consumed by `dx-plan`, `dx-implement`, `dx-tdd`, `dx-impl-review`, `plan-template.md`. Clean — single source, no duplication risk found.
- **`Resolution: PENDING`** — defined only in `skills/dx-references/references/review-report.md:3,21-22`; **absent from DESIGN.md entirely**. Consumed by `dx-review-triage` and `dx-archive`.
- **`change.md`/`effort.md` frontmatter** (`status`, `archived_at`) — defined in *both* DESIGN.md §7.1/§7.2 *and* `change-md.md`/`effort-md.md` reference files — two authoritative-looking copies of the same schema, not a single source deferring to the reference.
- **Roadmap `- change:` lines** — defined in DESIGN.md §7.2 and mirrored in `effort-md.md`; consumed by `dx-roadmap`, `dx-new`, `dx-archive`.
- **`archived_at` derivation** — defined in DESIGN.md §7.2 and rule 9; consumed by `dx-archive`, `dx-roadmap`, `effort-md.md`.

**Conclusion:** the effort's planned "cross-skill format reference in DESIGN.md" is genuinely new content, not a consolidation of an existing-but-scattered list. It should also resolve the DESIGN.md/reference-file duplication for `change.md`/`effort.md` frontmatter (currently defined twice) and pull `Resolution: PENDING` into DESIGN.md, which today has zero mention of it.

## Cross-cutting observations for `dx-roadmap`

- All six concerns are independently verified as real gaps — none turned out to be already handled, so the effort's slice list in `effort.md` needn't be trimmed on evidence grounds.
- Slice 3 (untrusted-content boundary) and slice 4 (challenger pass in `interview`) are the two lowest-blast-radius edits — both are additive documentation changes to existing reference files (`dx-research/SKILL.md` + a new caveat; `interview.md` + a new step) with no schema/format changes elsewhere.
- Slice 5 (severity unification) and slice 6 (format reference) both require editing `review-report.md`/DESIGN.md, which are shared by every review/lifecycle skill — sequence these with care since they touch load-bearing shared references multiple skills already depend on.
- Slice 2 (content lint gate) is the only slice needing new tooling (no CI or lint infra exists at all today) — it's the highest-effort slice, not just a rule tightening.
