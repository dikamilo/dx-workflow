---
targets: both
---

Does the testing strategy match the problem class of the code under test? This is not a test-quality review of naming or coverage, except for the pathological cases below. Every judgement derives from classifying the **production code**, never from the test alone. Heuristics, not dogma: a justified deviation is flagged with its trade-off, and the user decides.

## Preconditions
- A container run needs a Change or Effort whose work touched tests. Otherwise say there is nothing to review.
- An Explore run needs test files in scope. With none, say so and stop.
- Where a project standard on testing contradicts a heuristic here, the **standard wins** and the finding is flagged as such.

## Load
- Tests **and** the production code they exercise. The production code is what gets classified.
- Container run: a Change reviews the tests it touched plus the production code they exercise; an Effort takes the union over its child changes.
- Explore run: discover test files under the scope and pair each with its code under test.
- Invoke `dx-references` with `knowledge-layer` and match any testing standards.
- Rules are stack-neutral; examples are illustrative only.

## Dimensions
Tag findings `[<Dimension>: <Severity>]`, e.g. `[Strategy-fit: Blocker]`. Severity is `Blocker` when the mismatch removes regression protection (mocking a managed DB, mocking mid-chain so the real payload is never verified, a stateful object whose resulting state is never checked) and `Consider` when it only costs stability or maintenance (asserting on stubs, mocking pure intermediate steps, testing private decomposition, wrong level).

### Strategy-fit
Classify each tested **behaviour** (not file) as `Transformation` (input→output, no state, no side effects), `Stateful Object` (identity, guards invariants, changes over time) or `Integration` (orchestrates components, external systems, transactions). A mixed unit is classified per behaviour, and often earns "separate first". Then classify each test: `output-based` (call, assert on the return), `state-based` (reach a prior state, act, verify state via getter, event or query) or `interaction-based` (mocks verifying calls). Compare:
- **Transformation → output-based.** Smells: mocks on intermediate pure steps, verifying internal calls, testing private decomposition separately.
- **Stateful Object → output-based plus indirect state-based.** Smells: asserting only the return value with no prior state established, mocking parts of the aggregate, never querying the resulting state. **Level:** recommend the facade or service level when the service is simple, stable, and the effect is observable through a read model or query; stay at the aggregate level when orchestration churns, invariants are complex, or several services use the aggregate differently.
- **Integration → interaction-based.** Smells: full e2e when you own only the orchestration; output-based tests of a coordinator over many externals; decision logic tangled with execution (extract the decision as a transformation); mocking a **managed** dependency (your own DB: use a real instance and verify state); mocking a mid-chain wrapper instead of the last type before the external system; asserting on **stubs**.
- **Managed vs unmanaged.** Managed (only your app touches it) → real instance, verify state. Unmanaged (others observe it: bus, SMTP, external API) → mock and verify the interaction, which is the backward-compatible contract. A shared DB splits: externally visible tables are unmanaged.
- **Mock at the edge.** Mock the last type before the external system, not an intermediate abstraction.
- **Mock vs stub.** Mocks emulate outgoing commands, so assert on them. Stubs emulate incoming queries, so never assert on them.
- **Contract vs stub.** Contract tests cover the shape on the wire; interaction tests with stubs cover failure, timeout and retry handling.
`N/A` when no unit under test was classified.

### Frontend & e2e
Component vs integration vs e2e placement, and what e2e should carry (a few critical journeys, not logic a lower level can verify). **Written from general knowledge, not from research or the original strategy skill.** Treat as heuristics; false positives belong in triage as `DISMISSED` or `ACCEPTED`. `N/A` when no UI or e2e tests are in scope.

### Pathological tests
Assertion-free, tautological, mocks the thing under test, order-dependent, flaky, duplicated coverage. **Written from general knowledge, not from research or the original strategy skill.** `N/A` when none are in scope.

## Questions
Gates fire mid-analysis, tied to what was observed, and block. Ask each stage's triggered gates as one batched round.

- **Classification** — `after: scan`, `when:` every unit, `blocks:` the strategy comparison for that unit. "I classify `<unit>` as `<class>` based on `<2–3 signals>`. Does this match your understanding? yes / no, more like X because… / a mix"
- **Exception** — `after: analysis`, `when:` a Transformation whose tests mock intermediate steps, `blocks:` calling that mock a smell. "Is any of these steps financially expensive, performance-expensive, or side-effecting?" Costly → the mock is legitimate. Side-effecting → legitimate, but flag the unit as not a pure transformation.
- **Level** — `after: analysis`, `when:` a Stateful Object tested at the aggregate or facade level, `blocks:` the level recommendation. "Does the surrounding orchestration change often? Is the application service simple or complex? Can the effect be verified through a read model, view or query?"

## Candidates
- Fields: **what & where** (unit and test files) · **problem class and current strategy** · **mismatch** (the smell, in this Policy's terms) · **proposed change** (with a strength tag `Strong | Worth exploring | Speculative`).
- `type: feature`

## On pass
A pass means no `Blocker` finding. Nothing is set on `change.md`.

## Next
- `/dx-lesson` — record a finding worth keeping, if one was offered above
