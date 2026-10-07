---
topic: test-strategy-policy
kind: external
source: external test-strategy reviewer skill (reference omitted at user request)
gathered: 2026-10-06
git_commit: null
---

# Test-strategy policy — how the base skill works, and what it becomes as a policy

Fetched 2026-10-06. Section citations below (`[src: …]`) point at sections of the base skill. The fetched content contained no embedded instructions directed at the reader; it is reported here as data.

## What the base skill does

One narrow question: **does the testing strategy match the problem class of the code under test?** It explicitly does *not* review test quality — naming, structure, coverage are out of scope [src: intro]. Every recommendation is derived from a classification of the production code, never from the test alone [src: Principles 2].

### Inputs

- A path to test files/directory, or a description; if none, it asks what to review [src: Input Acquisition].
- It always reads **both** the tests and the production code they exercise — the production code is what gets classified [src: Input Acquisition].

### Step 1 — classify the production code (per tested behaviour, not per file)

| Problem class | Signals |
|---|---|
| Transformation | input→output, no state mutation, no side effects, no DB, pure computation |
| Stateful Object | identity, guards invariants, changes over time, possible concurrent access (e.g. aggregate under resource contention) |
| Integration | orchestrates components, coordinates steps, talks to external systems/modules, manages transactions |

A single file can mix classes (an application service wrapping an aggregate plus a DB); each tested behaviour is classified separately [src: Step 1].

**Confirmation gate.** The preliminary classification is always put to the user before going further, with the 2–3 signals that drove it, and options: *yes / no, it's more like X because… / it's a mix*. Rationale: the user knows things the code doesn't show — a "pure" function hiding a costly API behind a facade, an "aggregate" that is really CRUD with no invariants, an "integration" whose injected dependency is stateless and pure. The skill refuses to proceed to the comparison step until classification is confirmed [src: Step 1 › Confirm classification].

### Step 2 — classify the current test strategy (per test)

| Strategy | Recognised by |
|---|---|
| Output-based | call, assert on return/output; no mocks; no state queries between steps |
| State-based | put object in a prior state via earlier operations, act, then verify state via getter / event / read model / query |
| Interaction-based | mocks/stubs verifying what was called, how often, with what arguments |

[src: Step 2]

### Step 3 — compare against the recommended strategy

**Transformation → output-based.** Smells: mocks/stubs on intermediate steps that are themselves pure; verifying internal calls (the contract is the output); testing private decomposition separately without need. **Exception gate** before diagnosing: ask whether a mocked step is financially expensive, performance-expensive, or side-effecting. Costly step → mock is legitimate. Side-effecting step → mock is OK, but flag that the unit is not a pure transformation at all [src: Step 3 › Transformations].

**Stateful Object → output-based + indirect state-based.** Smells: only checking the return value without ever establishing a prior state ("you're testing a transformer"); mocking internal parts of the aggregate (breaks encapsulation — test it whole); never querying the resulting state. **Level gate**: ask (a) does the surrounding orchestration change often, (b) is the application service simple or complex, (c) can the effect be observed via a read model/view/query. Recommend testing at the **facade/service level** when the service is simple, stable, and the effect is observable through a read model (more realistic, user-observable outcome). Recommend staying at the **aggregate level** when orchestration churns, invariants are complex enough to deserve fast focused tests, or several services use the aggregate differently [src: Step 3 › Stateful Objects].

**Integration → interaction-based.** Smells:

- full end-to-end when you only own the orchestration (over-testing);
- output-based testing of a coordinator over many external systems (tests the externals, not your logic);
- decision logic ("what's the next step") tangled with execution ("do the step") — extract the decision as a transformation;
- mocking a **managed** dependency such as your own DB (use a real instance, verify final state);
- mocking a mid-chain wrapper instead of the last type before the external system;
- asserting interactions on **stubs** (incoming queries) — overspecification.

[src: Step 3 › Integration]

Supporting rules carried with the Integration class:

- **Managed vs unmanaged dependencies.** Managed (only your app touches it, e.g. the app DB) → real instance, verify state; mocking it couples tests to implementation and removes regression protection. Unmanaged (others observe it: bus, SMTP, external API) → mock and verify the interaction; that interaction *is* the backward-compatible contract. A DB shared with other systems splits: externally-visible tables are unmanaged, private tables managed [src: Managed vs Unmanaged].
- **Mock at the system edge.** Mock the last type in the chain (the adapter/ACL), not an intermediate abstraction — exercises more production code, verifies the real outgoing payload, and lets interfaces that exist only for mocking be deleted. Worked contrast: verifying a domain-ish `SendEmailChanged(...)` on a mid-chain bus skips the serialization layer; verifying the raw payload on the edge adapter does not [src: Where to place the mock].
- **Mock vs stub.** Mocks emulate outgoing commands/side effects — assert on them. Stubs emulate incoming queries — never assert on them [src: Mock vs Stub].
- **Two integration sub-strategies.** Contract tests for the shape on the wire (serialization, headers, schema) — "are we speaking the same language?"; interaction tests with stubs for failure/timeout/retry/partial-result handling — "what do we do when things go wrong?" [src: Two sub-strategies].
- **Separate transformation from integration.** Extract non-trivial decision logic into its own unit: decision → output-based, orchestration shell → interaction-based [src: Key insight].

### Step 4 — report (per test file/class)

Fields: test class, production class under test, problem class (`Transformation | Stateful Object | Integration | Mixed`), current strategy, recommended strategy, verdict `OK | MISMATCH`, and — on MISMATCH — what to change and why, with a concrete suggestion [src: Step 4].

### Principles

1. **No dogma** — heuristics; a justified deviation is flagged with its trade-off, and the user decides.
2. **Problem class drives strategy** — never recommend without classifying first.
3. **Separation enables better strategies** — mixed code often gets "separate first" as the advice.
4. **Test stability is the goal** — a test that breaks on internal refactors with an unchanged contract has the wrong strategy.
5. **Mocks cost coupling** — recommend them only when the real thing can't or shouldn't run.

[src: Principles]

## Mapping onto a policy for the generic review skill

The base skill decomposes cleanly into the parts a policy file would carry. What follows is synthesis, not source content.

| Base-skill element | Policy counterpart |
|---|---|
| Single scoping question + explicit out-of-scope list | Policy purpose / scope section — keeps it from drifting into general test-quality review |
| "Read tests **and** production code" | Policy's target-acquisition rule. Container run: tests touched by the change plus the production code they exercise. Repo/folder run: discover test files under the given folders, pair each with its SUT |
| Problem-class table, strategy table | Policy's classification vocabulary (the two axes every finding is expressed in) |
| Per-class smell tables + managed/unmanaged, edge-mocking, mock-vs-stub rules | Policy's checks — the body of the review |
| Confirmation gate, exception gate, level gate | Policy-declared **questions** — see tension 1 |
| `OK / MISMATCH` per test class | Dimensions/verdicts block in the report template (dimension = problem class, or one `Test-Strategy` dimension) |
| "Explain what to change and why, concrete suggestion" | Maps directly onto Finding's `Detail` / `Why it matters` / `Fix` fields |
| No-dogma principle | A user's justified deviation becomes `ACCEPTED — <reason>` at triage, not a suppressed finding |

### Severity

The base skill has a binary verdict and no severity. Mapping onto the existing `Blocker`/`Consider` vocabulary needs a rule. A defensible default: **Blocker** when the mismatch removes regression protection (mocking a managed DB; mocking mid-chain so the real payload is never verified; stateful object whose resulting state is never checked); **Consider** when it costs stability/maintenance but not protection (asserting on stubs, mocking pure intermediate steps, testing private decomposition, wrong test level).

### Tensions to settle when writing the policy

1. **Interactive gates vs a report-producing review.** The base skill blocks on the user three times (classification, cost/side-effect exceptions, test level). Today's review skills run to a report without interviewing. Options: (a) the policy declares the gates and the generic skill asks them up front before reviewing; (b) the review states its classification assumption in each finding and lets triage carry the correction (`DISMISSED` / `ACCEPTED`); (c) a hybrid — ask the classification gate once per reviewed unit, push the exception and level questions into findings as conditional fixes. Whatever is chosen is a generic-skill capability ("a policy may declare pre-review questions"), not something test-strategy-specific — which matters for the policy template.
2. **Repo-wide runs scale badly with per-unit confirmation.** Confirming classification for every class across a repo is impractical; repo/folder mode likely needs batched confirmation or assumption-stated output, with the user filtering at promotion time.
3. **Granularity.** Findings are per test class in the base skill, but classification is per tested behaviour. A Mixed SUT may yield one "separate first" finding rather than several per-behaviour mismatches (Principle 3).
4. **Overlap with existing reviews.** The implementation-review `Patterns` and `Standards` dimensions may already flag some mocking practices; a project standard on testing could contradict a heuristic here. The policy should say which wins (Principle 1 suggests the project standard, flagged).
5. **Language neutrality.** The source examples are C#/Moq-flavoured (`Verify(x => …)`, `IMessageBus`); the policy should state the rules in stack-neutral terms and let examples be illustrative only.
6. **Vocabulary.** "Stateful Object", "Transformation", "Integration", "managed/unmanaged dependency", "mock vs stub" are candidate domain terms; whether they belong in the project glossary or stay inside the policy (they describe *target* code, not the workflow) is a `dx-domain` call.
