---
topic: lens-verification
kind: codebase
source: a sample app (clean clone of main) — apps/web/src/quota/ and the full context/standards/ tree
gathered: 2026-09-28
git_commit: n/a (external test bed)
---

# Phase 2 manual checks: the modified `/dx-refactor-discover` on the Phase 1 bed

## The run

- **Skill:** `skills/dx-refactor-discover/SKILL.md` at `7903fd8` (this repo), read directly. The installed copy was still the pre-change version, so it was not used.
- **Invocation:** `/dx-refactor-discover apps/web/src/quota`. No standard named.
- **Deviations:** run inline by the implementing agent, which also wrote the skill change, so it knew every case being checked. That bias is stronger than in Phase 1. Stopped at the pick; nothing promoted. Case 2 (unscoped) covers standards selection and rule classification only. No full-tree scan was run.

## §1: standards matched and rules kept (scope `quota/`)

Domain × topic for `quota/` (backend use cases: persistence, config, tenancy, authorization) → `global/` + `backend/`. `frontend/` did not match. `testing/` matched only for test-layer rules, and none of those bears on the production files.

Kept as structural rules (where a unit lives, what it may depend on, one unit per role):
- `global/architecture-building-blocks.md` § One unit, one block · § Rule / Policy · § Application service · § Repository · § Configuration · § Persistence · § Security
- `global/minimal-implementation.md` § Build what's called · § Leave no dead code (also the guard for empty layers)
- `backend/workspace-layout.md` § Cross-domain access goes through the domain's public port
- `backend/tenant-isolation.md` § Touch an RLS table only through `inScopedTransaction`
- `backend/data-and-migrations.md` § One writer per aggregate
- `backend/configuration-and-environment.md` § Validate env at the app boundary

Dropped:
- Plan-authoring: building-blocks § Design in building blocks.
- Naming/style: building-blocks § Name units after their block, all of `global/coding-style.md`, workspace-layout § English names.
- Process: `global/changesets.md`.
- Behavioral rules, not structural: `backend/{idempotency-and-concurrency,errors,async-work,events-and-webhooks,authorization}.md`, the rest of `tenant-isolation.md`.

## Output (as the skill printed it)

1. **Quota remaining has no single home**, 4 sites: `allocate.ts` (inline arithmetic, twice: main counter and parallel-jobs counter), `settle.ts` + `cancel.ts` (`quotaSnapshot`, copied verbatim), with the pure `remainingAmount`/`fitsInQuota` in `limits.ts` called only by `limits.test.ts`. Standard: `global/architecture-building-blocks.md` § Rule / Policy.
   Why: the quota invariant is the business decision this area exists to protect. Its pure *Rule* exists and is tested, but no write path calls it, so the tests prove a function production doesn't use while three untested copies decide. The same code also trips two lenses: knowledge duplicated across modules, and a pure function extracted only for testability. Win: locality, because an invariant fix lands once and the `limits.ts` tests start covering the path that actually decides.
   Shape: 3 SQL-sum copies + 1 unused pure fn → 1 quota-ledger read (`remaining(tx, quotaId)`) whose arithmetic is the tested rule.
   Proposed: extract the read, route the arithmetic through `remainingAmount`, delete the copies (Strong, local-substitutable).

2. **Permit validity decided inline**, 4 sites: `quota/allocate.ts:170`, plus the same predicate outside the scope in `access/auth.ts:20`, `app/api/audit/route.ts:104`, `app/api/permits/check/route.ts:113`. Standard: `global/architecture-building-blocks.md` § Rule / Policy.
   Why: the core of "is this permit valid" (not revoked, not expired at `now`) is one authorization decision restated at four call sites, each wrapped with its own extra (tenant in `allocate.ts`, scope in `access/auth.ts`, role version plus a reason in the check route). `allocateQuota` reads the permit row itself to make it. A change to revocation or expiry semantics is four edits. Win: locality; a single pure core gets one test for the boundary case at `expiresAt == now`, and each caller keeps its own extra check.
   Shape: 4 inline predicates → 1 pure policy core, 4 callers adding their own axis.
   Proposed: extract the policy (Worth exploring, in-process).

3. **The use cases read the environment**, 5 entry points (`allocateQuota`, `auditHeaderRefusal`, `settleQuota`, `cancelQuota`, `extendQuota`), each opening its own connection from `env.DATABASE_URL`; `allocate.ts` and `extend.ts` also read `env.HOLD_TTL_SECONDS` inline. Standard: `global/architecture-building-blocks.md` § Configuration.
   Why: no use case runs without the live environment, and the connection open/close is a shallow wrapper repeated five times. Win: locality for the lifecycle (one place opens and closes), and the use cases take `tx` plus typed config, so a test can call them without `env`.
   Shape: 5× `createDb(env…)`/`client.end()` + 2 env reads → 1 edge helper that hands a tenant `tx` in, with lease seconds passed as a value.
   Proposed: move the lifecycle and config reads to the edge (Worth exploring, local-substitutable).

4. **Leak-safe context check copied across three use cases**: `settle.ts`, `cancel.ts`, `extend.ts`.
   Why: loading the hold, then checking tenant *before* workspace, then checking app is an ordering invariant (reading the workspace first leaks existence). Two of the three copies carry it only as "see settle.ts". Win: locality, since the next use case can't get the order wrong.
   Shape: 3 inline preambles → 1 `loadHoldInScope(tx, id, context)`.
   Proposed: extract (Strong, local-substitutable).

5. **Audit envelope assembled by hand at six sites**: `allocate.ts` ×3, `settle.ts`, `cancel.ts`, `extend.ts`.
   Why: `schema_version`, `producer`, `attempt` and the context→actor mapping are repeated literals, so a schema bump is six edits. Win: locality for the envelope shape.
   Shape: 6 × ~18-line literals → 1 `quotaAuditEntry(context, overrides)`.
   Proposed: extract (Worth exploring, in-process).

**Top pick:** #1. It is in the hottest file, it is the business invariant, and its tests currently prove the wrong function.

## Per case

- **2.6 Case 1 (scoped, standard not named).** The standard was picked up by §1 without being named. Three standard-driven candidates (#1–#3), each one per rule with a site count, sites and a `<path> § <rule>` citation, ranked with the two lens candidates (#4, #5) by churn and strength. #2 is new compared with the Phase 1 run. **Holds.**
- **2.7 Case 2 (unscoped).** Selection over the full tree: all four areas apply somewhere (`frontend/` via `src/app`/`src/components`, `testing/` via the test suites). Per-file classification kept the structural rules (for example contracts § The contracts package imports nothing from the app or the SDK, module-ui § A module UI package imports only the generated client, test-layers § Keep the layer boundaries). It dropped all of `acceptance-criteria.md` (plan-authoring), `evidence-and-status.md` and `ci.md` (process), `theme-and-components.md` (tooling/style), and the UX rules in `accessibility-and-interaction.md`, `screen-states.md` and `forms-and-lists.md`. On the scoped run, the plan-authoring rule (§ Design in building blocks) and the style rules produced nothing. **Selection holds; a full-tree scan was not run.**
- **2.8 Case 3 (standard beats lens).** `limits.ts` `evaluateLimits` is a 5-line pure function called from one site, which a lens would flag as "extracted only for testability". It is exactly what building-blocks § Rule / Policy asks for, so it got no candidate. No revisit line: the conflict costs nothing here. **Holds.**
- **2.9 Case 5 (no empty layers).** The same 5 entry points break § Persistence ("application services never import the database client or the schema"). Its move is a repository out-port per aggregate, with one adapter (Drizzle, and the tests use real Postgres). The deletion test says complexity moves rather than concentrates. The building-blocks standard itself says `minimal-implementation.md` wins, and minimal-implementation § No speculative abstractions applies, so the candidate was dropped rather than capped. Phase 1's runner kept it as a sub-note of #3; the modified skill leaves it out entirely. **Holds.**
- **2.10 Case 6 (overlap merges).** #1 breaks § Rule / Policy and trips two lenses. It appears once, cites the rule, and states the lens win (locality). **Holds.**
- **2.11 Case 7 (rejected stays skipped).** With a temporary lesson "don't migrate quota/ config reads to building-blocks § Configuration because the per-path connection is the isolation evidence" appended to the bed's `lessons.md`, the re-run dropped #3 and kept #1, #2, #4 and #5 unchanged. The lesson was then removed, and the bed is clean. **Holds**, but with the runner's bias at its strongest: the runner wrote both the lesson and the rule that reads it.

## Verdict

All six cases behave as planned on this bed. The main caveat is that the runner wrote the skill change, so these runs show the text *can* produce the behavior, not that a cold session *will*. Case 2 is verified at the selection level only.

# Phase 3 manual checks: the `Standard:` line through promotion

## The run

- **Skills:** `skills/dx-refactor-discover/SKILL.md` §5 and `skills/dx-new/SKILL.md` at `4b392c5` (this repo), read directly. The installed copies are still the pre-change versions.
- **Bed:** the same clean clone. The Phase 2 candidate list above was the input: no fresh scan, since Phase 3 changes only the promote paths.
- **Deviations:** run inline by the implementing agent, which also wrote both skill changes, so the same bias as Phase 2 applies. `dx-new`'s parse was carried out by hand-following its text (a small script copying the entries), not by a cold session. §4 (design it twice) was skipped, so no `Sketch:` line was exercised alongside `Standard:`. All bed artifacts were removed afterwards, and the bed is clean.

## Per case

- **3.5 promote one (case 4 / 8).** Picked #3. Wrote `context/changes/quota-env-at-edge/change.md` (`type: refactor`) and seed `research/quota-env-reads.md`, whose body ends `**Standard:** context/standards/global/architecture-building-blocks.md § Configuration`. **Holds.**
- **3.5 promote many (case 4 / 8).** Picked #1, #2, #3. The seed summary carried a `Standard:` line on all three (between `Proposed:` and where `Sketch:` would sit). `/dx-new "<seed>"` produced `context/efforts/refactor-quota-remaining/` with `effort.md` (`## Notes` marker byte-identical to the string `dx-new`'s slice path checks) and `research/{quota-remaining,permit-validity,quota-env-reads}.md`, each keeping its `Standard:` line verbatim. **Holds.**
- **3.6 reject (case 4).** Rejecting #2 with a load-bearing reason offered `/dx-lesson` phrased "don't migrate permit-validity checks to building-blocks § Rule / Policy because each caller's extra axis is separate audit evidence". The skip itself was already shown by Phase 2 case 7. **Holds.**

## Verdict

Both promote paths carry the rule through to `research/<topic>.md`, and the rejection offer uses the migrate phrasing. The caveat: these runs show the text produces the behavior when followed. A cold `dx-new` session parsing the seed was not run.
