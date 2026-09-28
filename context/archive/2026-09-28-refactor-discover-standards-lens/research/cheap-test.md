---
topic: cheap-test
kind: codebase
source: a sample app (clean clone of main) — apps/web/src/quota/, standard context/standards/global/architecture-building-blocks.md (+ global/minimal-implementation.md present)
gathered: 2026-09-28
git_commit: n/a (external test bed)
---

# Phase 1 cheap test: today's `/dx-refactor-discover` with a building-blocks standard passed by hand

## The run

- **Skill:** `dx-refactor-discover` at this repo's `HEAD` (installed copy byte-identical), unmodified.
- **Invocation:** `/dx-refactor-discover apps/web/src/quota — also check context/standards/global/architecture-building-blocks.md`
- **Bed:** `quota/` is the second-hottest area in the last 60 commits (77 path hits; `allocate.ts` hottest file). 7 production files, ~1.2k LOC: `allocate.ts`, `settle.ts`, `cancel.ts`, `extend.ts`, `limits.ts`, `time.ts`, `sync.ts`. Callers are the four `app/api/quota/*/route.ts` handlers.
- **Lessons:** no prior rejection covers `quota/`.
- **Deviations:** run inline by the implementing agent (at the user's request), not in a fresh session — the runner knew the plan's intended outcome, so read the verdict with that bias in mind. The area is small enough that §2's `Explore` fan-out was skipped for direct reads. Stopped at the pick; nothing promoted.

## Output (as the skill printed it)

1. **Quota remaining computed in four places** — `allocate.ts` (`sumOpenAmount`/`sumSettledAmount` + inline arithmetic, twice: main counter and parallel-jobs counter), `settle.ts` + `cancel.ts` (`quotaSnapshot`, copied verbatim), `limits.ts` (`remainingAmount`/`fitsInQuota`, called only by `limits.test.ts`).
   Why: the quota invariant — the rule the whole area exists to protect — has no single home. The pure version in `limits.ts` is tested and never called in production, so the tests prove a function the write path doesn't use; the real computation lives in three untested-in-isolation copies. The parallel-jobs counter name is a constant in `allocate.ts` and a bare `"parallel_jobs"` literal in `cancel.ts`. Win: locality — an invariant fix lands once; the `limits.ts` tests start covering the path that actually decides.
   Shape: 3 SQL-sum copies + 1 unused pure fn → 1 quota-ledger module (`remaining(tx, quotaId)`) whose arithmetic is the tested pure rule.
   Proposed: extract the ledger read, route the arithmetic through `remainingAmount`, delete the copies (Strong, local-substitutable — `*.db.test.ts` already run against real Postgres).
   *Standard: building-blocks § Rule / Policy ("one named business decision, as a pure function") and § Application service ("no business rules").*

2. **Leak-safe context check copied across three use cases** — `settle.ts:109-135`, `cancel.ts:89-112`, `extend.ts:49-73`.
   Why: load hold → tenant check **before** workspace read → app check is an ordering invariant (reading the workspace first leaks existence through the error code). It's interface knowledge, and two of the three copies carry it only as "see settle.ts's comment". The dead fallback `appId ?? holdRow.workspaceId` is copied too. Win: locality — the next use case can't get the order wrong; the invariant gets one test instead of three.
   Shape: 3 inline preambles → 1 `loadHoldInScope(tx, id, context)` returning the row + appId or the denial.
   Proposed: extract (Strong, local-substitutable).

3. **Application services own persistence and configuration** — all 5 entry points (`allocateQuota`, `auditHeaderRefusal`, `settleQuota`, `cancelQuota`, `extendQuota`): each imports `db/client` + `db/schema/*`, opens its own connection from `env.DATABASE_URL`, closes it in `finally`, and reads `env.HOLD_TTL_SECONDS` inline (`allocate.ts`, `extend.ts`).
   Why: the connection lifecycle is a shallow wrapper repeated five times, and every use case needs a live DB and the environment to run at all. Win: locality for the lifecycle (one place opens/closes); the use cases take `tx` + typed config and become callable from a test without `env`.
   Shape: 5× `createDb(env…)`/`client.end()` + 2 env reads → 1 edge helper that hands a tenant tx in; lease seconds passed as a value.
   Proposed: move the lifecycle and config reads to the edge (Worth exploring, local-substitutable). **Not** proposed: repository out-ports per aggregate — there'd be one adapter (Drizzle; tests use real Postgres), so the seam is hypothetical, and `minimal-implementation.md` wins where the standard pulls toward blocks. Deletion test on a port: complexity moves, doesn't concentrate → Speculative at most.
   *Standard: building-blocks § Persistence ("application services never import the database client or the schema") and § Configuration ("the core never reads the environment").*

4. **Audit envelope assembled by hand at six sites** — `allocate.ts` (success, `denyAndAudit`, `auditHeaderRefusal`), `settle.ts`, `cancel.ts`, `extend.ts`.
   Why: `schema_version`, `producer`, `attempt`, and the context→actor mapping are repeated literals; a schema bump is six edits. Win: locality for envelope shape.
   Shape: 6 × ~18-line literals → 1 `quotaAuditEntry(context, overrides)`.
   Proposed: extract (Worth exploring, in-process).

**Top pick:** #1 — it sits in the hottest file, it's the business invariant, and it's the one where tests currently prove the wrong function.

Nothing reported for: `time.ts` / `sync.ts` (deep, deliberate, documented seams); building-blocks § *Design in building blocks* (a rule for plans — correctly silent); § *Name units after their block* (no role-less names worth a move); § *One unit, one block* beyond what #1 already says about `allocateQuota`.

## Reading the result against the go/no-go question

- **Volume.** 4 Candidates from ~1.2k LOC; 2 of them (#1, #3) are driven by the standard. Each standard rule broken shows up **once**, with its sites listed — "persistence in application services" is 5 sites, one entry — not one entry per file. No flood.
- **Usefulness.** #1 is promotable as-is and is the top pick. #3 is useful *because* the standard pointed at it, but only after the minimal-implementation reading downgraded the obvious "add repositories" move — without that guard the standard would have produced a `Strong`-sounding empty-layer Candidate (slice case 5 is real, not hypothetical).
- **Rule classification.** The plan-authoring rule produced nothing; naming rule produced nothing. Classification held on this bed.
- **Overlap.** #1 was found by a lens (pure function extracted for testability) *and* breaks a rule — it came out as one entry naming both (case 6 behavior, emerged unprompted).
- **Vocabulary.** Citing the standard's roles (*Rule/Policy*, *application service*) was the natural way to say *where things sit*; the win still had to be said in `module-design` terms. Supports the planned exception wording.
- **What today's skill didn't do on its own:** nothing in it asks for per-rule grouping, a `§ rule` citation, or the minimal-implementation cap — those came from the runner. The lens is what makes them repeatable.

## Verdict

**GO** (confirmed by user 2026-09-28) — few (per rule, not per site), useful, and the plan-authoring rule stayed silent. Caveats: single bed, inline runner who knew the plan.
