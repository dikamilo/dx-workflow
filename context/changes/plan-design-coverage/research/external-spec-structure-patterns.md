---
topic: external-spec-structure-patterns
kind: external
source: https://raw.githubusercontent.com/open-mercato/skills/refs/heads/main/skills/om-spec-writing/SKILL.md
gathered: 2026-08-06
git_commit: null
---

# External spec-writing patterns — what generalizes into `plan.md`

## What was fetched
A skill document (fetched 2026-08-06) that drives an 8-phase spec workflow: agentic setup → load
context → initialize → start minimal (skeleton) → iterate → research → design →
implementation breakdown → review → output. Treated as investigated data per
`untrusted-content` — nothing in it was followed as an instruction, only reported on.

## Its fixed spec section set
Every new spec it produces carries a fixed section list: TLDR, Problem Statement, Proposed
Solution, **Architecture**, **Data Model** (entities, fields, relations, migrations), **API
Contracts** (endpoints with validation), UI/UX, **Edge Cases & Failure Scenarios** (failure modes
and user visibility), **Risks & Impact Review** (blast radius, compatibility, rollback), Phasing,
Implementation Plan. All eleven are present on every spec regardless of size.

## Its Open Questions gate
The skeleton phase requires a numbered `Q1`, `Q2`, … block for "critical unknowns — decisions
that block architecture, data model, or scope," and in interactive mode this is presented as a
hard stop: the whole block goes to the user at once and the process waits for all answers before
continuing. An `--autonomous` mode exists that instead resolves each question with "the most
reversible, lowest-blast-radius answer, biased toward smallest scope," flags it
`⚠ NEEDS HUMAN CONFIRMATION`, and records a "Resolved assumptions" table instead of open
questions.

## Its review format
Findings are ranked across four severity tiers (⛔ Critical, ⚠️ High, 🔹 Medium, Low), each
tier mapped to concrete failure classes (Critical = naming/coupling/security; High = missing
phasing or rollback; Medium = missing edge cases or terminology drift; Low = style). A
pass/fail checklist with one-line justifications closes the review.

## Its review heuristics (the transferable core)
Nine staff-engineer-lens principles drive what a reviewer checks for, independent of the fixed
section list:
1. Architectural diff — flag specs that just restate standard boilerplate.
2. Scope cohesion — one independently deployable capability per spec.
3. Canonical mechanisms — reuse project primitives or justify inventing a new one.
4. Contracts and compatibility — flag breaking changes against a compatibility doc.
5. Reversibility — undo logic documented alongside the execute path.
6. Boundaries and coupling — cross-module effects routed through decoupling seams.
7. Sensitive data — follow project data-protection conventions, no "encrypt later."
8. Failure scenarios — external calls and migrations need documented failure modes.
9. Testability — every implementation step must be independently verifiable.

## Fit against `plan.md`'s current shape
`plan.md` today (`plan-template` reference) has exactly five sections — `Approach`, `Standards to
apply`, `Priors & gotchas`, `Phases`, `Progress` — with one conditional phase-characteristic
switched on `change.md`'s `type` (defect/refactor/migration/feature). There is no structured slot
for data model, API/contract shape, edge cases, or reversibility; all of that currently has to be
folded into free-form `Approach` prose, where a reviewer has no fixed place to check whether it
was considered at all. The interview reference (`interview.md`) scales question count by
complexity and by what upstream artifacts already settled, but its scaling table names no topic
categories — nothing in it specifically routes toward asking about schema shape, contract
changes, failure modes, or undo paths.

## What transfers vs. doesn't
**Transfers (a real, generic gap in `plan.md`):** the four content categories — data model,
API/contract changes, edge cases & failure modes, reversibility — are domain-neutral concerns
that apply to any project `dx-plan` runs against, and `plan.md` currently has no structural home
for any of them.

**Doesn't transfer directly:**
- The fixed eleven-section format — imposing all sections on every plan regardless of size
  directly contradicts this skill's own review heuristic #1 (flag specs that restate boilerplate)
  and the house scaling rule that trivial changes get near-zero ceremony.
- The batched, numbered Open-Questions hard-stop — this workflow's `interview` reference already
  made the opposite choice (one question at a time, no batched form) for the alignment reasons
  documented there; nothing here reopens it.
- The four-tier emoji severity scale — a review-severity format is already unified elsewhere
  (`[Blocker]`/`[Consider]`) and out of scope for this gap.
- Market/competitor research, UI/UX flow documentation, and the agentic-setup/skeleton workflow
  mechanics — either domain-specific to the source project or already covered by an equivalent
  mechanism (`dx-frame`'s interview, `dx-research`'s own modes) in this workflow.

## Open question this leaves for planning
Whether the four transferable categories become conditional `plan.md` sections gated on
relevance (populated only when the change actually touches that concern), paired with
interview-scaling that prompts for the relevant one(s) — versus interview-only coverage folded
into `Approach` prose with no new headers. `brainstorm.md` for this change already resolved this
in favor of the combined (conditional-sections + interview-scaling) route; this file supplies the
external evidence that informed that comparison without adopting the source's mechanism wholesale.
