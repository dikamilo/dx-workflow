---
created: 2026-07-27
---

# Frame — sdlc-hardening

## The real problem

The dx- SDLC currently runs on unverified trust at several boundaries it should instead enforce mechanically: no divergent "should we build this" gate before a container exists, no marked trust boundary between fetched external content and instructions in the research → plan → implement chain, no automated check on its own authoring rules (frontmatter shape, description quoting, body budget, `dx-references` topic resolution, docs-sync), no adversarial challenge step before a frame/plan is accepted, two incompatible severity vocabularies across its two review gates, and no single documented list of the cross-skill formats "derive, don't maintain" depends on. Research (`context/efforts/sdlc-hardening/research/sdlc-hardening.md`) independently verified all six as real, currently-unhandled gaps — none were already covered.

## Who / what it affects

- **Skill authors / maintainers of this repo** — the six gaps determine how safely `skills/dx-*` can be edited and extended going forward.
- **The pipeline's own control-flow skills**: `dx-new` (routing, no build/no-build exit), `dx-frame` (no "abandon" outcome), `dx-research` (external-mode fetch has no data/instruction framing), `dx-plan`/`dx-implement` (consume `research.md`/`plan.md` with no trust caveat), `dx-plan-review`/`dx-impl-review` (diverging severity scales), and `dx-roadmap` (slice-ordering decisions currently unchallenged).
- **Shared references consumed by multiple skills**: `dx-references/references/interview.md` (no challenger step), `review-report.md` (codifies the severity split), `DESIGN.md` (no cross-skill format catalog; `change.md`/`effort.md` frontmatter is defined twice — in DESIGN.md and in the reference files).
- **Repo infrastructure**: no CI (`.github/`) and no lint/test script in `package.json` today — slice 2 (content lint gate) is net-new tooling, not a tightening of an existing check.
- **Downstream consumers** who install these skills via `skills.sh` inherit whichever of these gaps remain open.

## Alternatives considered

- **Split slice 2 (content lint gate) into its own effort**, since it's the only slice requiring new tooling from scratch rather than editing existing docs/references. Rejected: the user's guidance is to sequence it *first*, not separate it — its output (a mechanical check) makes the later doc-editing slices safer to land, and splitting it into a second effort would just relabel a sequencing decision as a scoping one.
- **Split slice 1 (`dx-brainstorm`) into its own effort**, since it's the only slice that grows the skill count rather than tightening an existing one. Rejected: the user's guidance is to sequence it *last*, for the same reason — it's the highest-novelty, lowest-urgency change, not out of scope.
- **Keep as one effort, six slices, sequenced by risk/dependency rather than split** (chosen). User-directed sequencing for `dx-roadmap`: content-lint-gate first (slice 2), then the doc/reference-editing slices (untrusted-content boundary, interview challenger, severity unification, format reference — slices 3–6), then `dx-brainstorm` last (slice 1). This matches research's own observation that slices 3–4 are the lowest-blast-radius edits and slice 2 is the highest-effort/novel-infra slice, while giving the mechanical check (slice 2) a chance to guard the doc edits that follow it.

## Out of scope

- Tracker/PR/label machinery.
- Autonomous no-ask chaining.
- Run folders.
- Per-skill reference duplication (shared references stay in `dx-references`, pulled by topic).
- Model-tier execution columns.
