---
topic: proposal-verification
kind: codebase
source: a sample app (clean clone of main) — apps/web/src/{quota,app/api} and context/standards/
gathered: 2026-09-28
git_commit: n/a (external test bed)
---

# Phase 1 manual checks: new-rule Standard Proposals on the slice 1 bed

## The runs

- **Skill:** `skills/dx-refactor-discover/SKILL.md` and `skills/dx-references/references/knowledge-layer.md` at `b9eaeea` (this repo), read directly. The installed copies are the pre-change versions, so they were not used. `/dx-standards-update` was followed from `skills/dx-standards-update/SKILL.md` (unchanged), loading the `b9eaeea` `knowledge-layer.md`.
- **Invocation:** `/dx-refactor-discover apps/web/src` (the quota use cases plus the `app/api` routes that call them).
- **Candidate input:** the quota candidates #1–#5 are the ones slice 1 found on this bed (`refactor-discover-standards-lens/research/lens-verification.md`); Phase 1 changes only the end of §3, §1's lessons skip, §5 and `Done when`, so the scan of `quota/` was not redone. The `app/api` routes were scanned fresh for this run.
- **Beds:** Bed 1 is the clean clone with its full standards. Bed 3 is the clone with the whole `context/standards/` tree moved out. Bed 2 is the same clone with `global/architecture-building-blocks.md` moved out, which removes the rule behind candidates #1 and #2 while every other standard stays loaded. Everything written to the bed was removed afterwards, and `git status` on the bed is clean.
- **Deviations:** run inline by the implementing agent, which also wrote the skill change and so knew every case being checked. As in slice 1, these runs show the text *can* produce the behavior, not that a cold session *will*. Proposal quality is the judgment part the plan's priors flag, and the same agent is the judge here. Case 7 (1.6) first ran as a paper run, because the permission classifier refused emptying the bed's standards tree. After the user authorized the move, it was re-run on a real empty `context/standards/` (Bed 3).

## Bed 1: full standards

§1 kept the same structural rules as slice 1 for `quota/`, plus `backend/errors.md` § Keep the catalogue as machine-readable data, `backend/authorization.md` § Check in this order and `backend/contracts.md` § Validate at the process edge for `app/api`.

Candidates (condensed; quota entries as in slice 1):

1. **Quota remaining has no single home**, 4 sites. Standard: `global/architecture-building-blocks.md` § Rule / Policy. (Strong)
2. **Permit validity decided inline**, 4 sites (`quota/allocate.ts`, `access/auth.ts`, `app/api/audit/route.ts`, `app/api/permits/check/route.ts`). Standard: building-blocks § Rule / Policy. (Worth exploring)
3. **The use cases read the environment**, 5 entry points. Standard: building-blocks § Configuration. (Worth exploring)
4. **Leak-safe context check copied across three use cases.** Lens. (Strong)
5. **Audit envelope assembled by hand at six sites.** Lens. (Worth exploring)
6. **Error metadata re-declared in every route**, 8 route files, e.g. `quota/allocate/route.ts`, `quota/settle/route.ts`, `apps/route.ts`: each hand-copies code, class, `retry_condition` and status (~70 `retry_condition` literals) from `packages/api/errors.json`, which no route reads. Standard: `backend/errors.md` § Keep the catalogue as machine-readable data. Win: locality, since a catalogue edit stops being eight edits. (Strong, in-process)
7. **Edge admission hand-rolled in every handler**, 9 handlers: version header, service token, scope token, region, Idempotency-Key and body checks, each in its own try/catch returning a refusal body. The order differs per route, and two routes defer the version header on purpose so the refusal can be audited. Lens: one concept spread over nine handlers. No rule covers the order of these edge checks (`authorization.md`'s order starts after identity). (Worth exploring, in-process)

Top pick #1. No `revisit` line.

**Proposal step.** Causes shared by candidates: #1, #2, #3 and #6 are each already stated by a loaded rule. The uncovered candidates are #4, #5 and #7. Three distinct candidates, but the only thing they share is "per-entry-point plumbing copied instead of one helper", which is the duplication lens restated, not a project rule. Their specific causes differ (check order, envelope shape, admission order). **No Proposal and no "none found" line were printed.**

## Bed 2: `architecture-building-blocks.md` removed

§1 loads every other standard, including `global/minimal-implementation.md`. The same scan yields the same seven entries with these differences: #1, #2 and #3 lose their `Standard:` line and become lens candidates (#1: duplication plus a pure function extracted only for testability; #2: duplication; #3: shallow wrapper repeated five times, and `configuration-and-environment.md` § Validate env at the app boundary is followed, since the values come from `env.ts`). The repository-port candidate is still dropped by `minimal-implementation.md`.

**Proposal step.** Uncovered candidates: #1, #2, #3, #4, #5, #7. #1, #2 and #4 share a cause: a decision more than one caller needs (does it fit the quota, is the permit valid, does this hold belong to the caller's scope) is re-derived from raw rows at each site, with comments like "see settle.ts" pointing at the other copy. No loaded rule covers it. #5 and #7 share only the duplication lens as above. #3 stands alone. Printed after the top pick:

```
Standard Proposal — new rule in backend/domain-rules.md
  Rule: A business decision more than one caller needs lives in one named function in the owning domain module, pure where its inputs allow; callers invoke it and never restate its predicate or check order.
  Cause: each use case and route re-derives the decision it needs from raw rows — Candidates 1, 2, 4
```

Then it asked which candidates to promote and which proposals to accept, in one question.

## Per case

- **1.5 Case 5 (recurring cause).** Bed 2: one Proposal citing candidates 1, 2 and 4, with the `/dx-standards-update` command. Following `/dx-standards-update` in the same session: §1 took the rule from the conversation. §2's check against `knowledge-layer.md` found the recurrence evidence in the promotion section ("A Standard Proposal is accepted … those candidates are the recurrence"), so there was no "one-off, keep it as a lesson" pushback. §3 found no existing backend topic that fits (errors, authorization, contracts don't) and created `context/standards/backend/domain-rules.md` with one `## One function per shared business decision` entry. The rule also comes out close to the removed building-blocks § Rule / Policy, which suggests it is the kind of rule this team writes, not a lens restated. **Holds.**
- **1.6 Case 7 (no standards).** Bed 3 (real empty `context/standards/`, after the user authorized the move): §1 matched no standards, so there were no standard-driven candidates and no `revisit` line. The scan returned the same seven sites, all as lens candidates. #6 is now "knowledge duplicated across modules": `errors.json` is mirrored by hand into 8 routes. With no Persistence rule, nothing asks for a repository port, so that candidate doesn't appear. This corrects the earlier paper run, which had it capped at `Speculative`. The only cause shared by 3+ uncovered candidates that isn't a lens restated is again #1, #2 and #4, giving one new-rule Proposal (`backend/domain-rules.md`, Candidates 1, 2, 4) fed only by lens candidates. #5 and #7 share only the duplication lens, and #3 and #6 stand alone. The tree was restored and the bed is clean. **Holds.**
- **1.7 Case A (quiet run).** Bed 1: candidates only, no Proposal, no "none found" line. Three uncovered candidates existed but shared only the duplication lens, so the "not a lens restated" guard held back what would otherwise have been a noise Proposal. **Holds.**
- **1.8 Case E (one candidate, many sites).** Bed 1: #7 (9 handlers) and #5 (6 sites) are each one uncovered candidate with many sites. Neither produced a Proposal. **Holds.**
- **1.9 Case C (declined with a reason).** Bed 2: declining the Proposal with "each caller's inline check, in its own order, is the audit evidence reviewers trace per contract" was offered `/dx-lesson` with the "don't propose rule X because Z" phrasing. With that lesson temporarily appended to the bed's `foundation/lessons.md`, the re-run's §1 lessons skip matched it: candidates 1, 2 and 4 were still listed, and no Proposal was printed. The lesson was then removed. **Holds**, with the runner's bias at its strongest, since the runner wrote both the lesson and the rule that reads it.
- **1.10 Case D (promotion and Proposal together).** Bed 2: "promote #1, and accept the proposal". §5's promote-one path wrote `context/changes/quota-remaining/change.md` (`type: refactor`) and its seed `research/quota-remaining.md`, then printed both commands, running neither:
  ```
  Change created: context/changes/quota-remaining/change.md   (type: refactor, seeded with the candidate)
  Next: /dx-plan quota-remaining
  Next: /dx-standards-update   (run in this session)
  ```
  **Holds.**

## Verdict

Cases 5, 7, A, E, C and D behave as planned on this bed. The "not a lens restated" guard carried the quiet-run case: without it, Bed 1 would have printed a duplication Proposal. That guard is the part most worth watching in a cold session.

# Phase 2 manual checks: amendments and existing rules

## The runs

- **Skill:** `skills/dx-refactor-discover/SKILL.md` at `104e1fa` (this repo), read directly. Phase 2 changes only §3's Proposal step (read the target, new vs amendment, extend or tighten only).
- **Candidate input:** Phase 1's Bed 1 candidates #1–#7, reused as the scan is unchanged. Each bed's standard changes were re-applied to that set.
- **Beds:** Bed 1 is the clean clone. Bed 4 is the clone with only the `- **Rule / Policy**` bullet removed from `global/architecture-building-blocks.md`. Bed 5 is the clone with a **planted** rule, `## Open a fresh client per operation`, added to `backend/tenant-isolation.md`. The code already follows it at 13 request-path `createDb` sites (`max: 1`, ended in `finally`). Beds 4 and 5 were edited with the user's authorization (the permission classifier refused the first attempt) and restored with `git checkout`. `git status` on the bed is clean.
- **Deviations:** as in Phase 1, run inline by the agent that wrote the change, so these runs show the text *can* produce the behavior. Bed 5's rule was not written by the team, so case F is tested against a rule planted for the check. The out-of-scope branch of "read the target" (a target file a scoped run didn't load) was not exercised: every plausible target for this code (`global/`, `backend/`) is always loaded.

## Per case

- **2.5 Case B (already covered), Bed 1.** Phase 1's Bed 2 Proposal cause (a decision re-derived at each site, Candidates 1, 2, 4) was checked against its target, `architecture-building-blocks.md`. § Rule / Policy ("one named business decision, as a pure function of its inputs") already states it, so there was no Proposal. #1 and #2 appear only as their standard-driven candidates. #4 (tenant-before-app check order) and #7 (edge admission order) share a topic next to `authorization.md` § Check in this order, but that is 2 Candidates, below the bar. #5 stands alone. No Proposal and no "none found" line. **Holds.**
- **2.4 Case 6 (amendment), Bed 4.** With § Rule / Policy gone, #1 is still standard-driven: `allocate.ts`, `settle.ts` and `cancel.ts` restate `limit − open − settled` inline, while `limits.ts:34` holds the pure version. That breaks § Application service ("no business rules"). #2 and #4 are authorization checks, which § Application service allows, so they become lens candidates. The shared cause across 1, 2 and 4 isn't stated: § Start simple says *when* to extract ("logic repeats") but names no home for a shared decision. The cause falls within the Domain role list's topic, so it becomes an amendment, where Bed 2 (file absent) gave `new rule in backend/domain-rules.md`:
  ```
  Standard Proposal — amend global/architecture-building-blocks.md § Domain (DDD)
    Rule: A decision more than one caller needs (does it fit the quota, is the permit valid, does this hold belong to the caller's scope) is one named pure function; application services and routes call it and never restate its predicate or check order.
    Cause: each use case and route re-derives the decision it needs from raw rows — Candidates 1, 2, 4
  ```
  It adds a role and loosens nothing. It also comes out close to the deleted bullet. **Holds.**
- **2.6 Case F (revisit stays separate), Bed 5.** A lens would flag the connection lifecycle copied at 13 request-path sites (a handshake on every request, two on `GET /api/audit`). The code follows the planted rule, so it gets no candidate, and the cost earns the single line `revisit backend/tenant-isolation.md § Open a fresh client per operation? — every request pays a new connection handshake at 13 sites (two on GET /api/audit)`. Code the rule shields produces no candidates, so no cause involving it can reach the bar. A "share a pooled client" amendment would loosen it and is excluded anyway. #3 is still compatible with the rule. The rest matches Bed 1: no Proposal. **Holds.** Caveat: with a planted rule, this mostly checks the routing (shielded code → revisit line, never a Proposal) rather than judgment.

## Verdict

Cases 6, B and F behave as planned on this bed. Two things are left unexercised: the out-of-scope read, and a case F against a rule the team actually wrote. Bed 4 also showed that removing one rule can move a candidate to another rule (#1 to § Application service) instead of making it a lens candidate. The skill handled that, but Phase 1's Bed 2 notes assumed the lens fallback.
