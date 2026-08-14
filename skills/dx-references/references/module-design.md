# Module design — vocabulary for refactors & structural work

Loaded by `dx-research` / `dx-frame` / `dx-plan` / `dx-refactor-discover` / `dx-impl-review` when the work is a refactor or touches structure. A shared vocabulary for judging *shape*, not a procedure.

## Deep vs shallow modules
A **module** is any unit behind an interface (function, class, file, service). Its **depth** = functionality hidden ÷ interface exposed.
- **Deep** = a lot of behavior behind a small interface. The good default: callers learn little and get much.
- **Shallow** = a wide interface over little behavior (pass-throughs, thin wrappers, config that just forwards). Shallow modules add interface cost without hiding complexity — usually a smell, occasionally deliberate (flag the reason as a lesson so it isn't re-flagged).

## Leverage and locality
What depth *buys* — a finding names which one it buys, never just "cleaner".
- **Leverage** = capability a caller gets per unit of interface learned. One implementation pays back across N call sites and M tests.
- **Locality** = where change, bugs and verification concentrate. Fix once, fixed everywhere; a change that touches five modules has none.

## Interface ⊃ type signature
The interface is everything a caller must know to use the module correctly: invariants, ordering constraints, error modes, required configuration, performance characteristics — not just types and method names. Complexity pushed out of the signature into "you must call `init` first" is still interface, and still paid for.

## Interface = the test surface
The interface is what callers — and tests — depend on. A clean, narrow interface is directly testable; a leaky one forces tests to reach into internals. When you can't test a module without knowing its implementation, the interface is too wide.

## Seams
A **seam** is a place where you can change behavior without editing around it — the natural boundary to split, substitute, or test at. Good refactors move complexity to sit behind a seam; good tests assert at one.

## Internal vs external seams
A deep module may hold **internal** seams — private, used by its own tests — alongside the **external** seam at its interface. That's fine. What isn't: widening the interface because a test reached for an internal seam. A test-only entry point is interface cost paid forever.

## Adapter vs implementation
**Adapter** is a *role* — the slot a thing fills at a seam. **Implementation** is substance — what's inside. They vary independently: a small adapter can front a large implementation (a real DB repository), a large adapter a small one (an in-memory fake). Say adapter when you mean the role.

## One adapter = hypothetical seam, two = real
The deletion test judges *existing* complexity; this judges *proposed* indirection. A seam with one adapter is indirection you paid for and nobody uses. Two real adapters justify it — HTTP in prod and in-memory in tests counts.

## The deletion test
For each piece of complexity ask: *if I deleted this, what breaks?* If nothing meaningful breaks, delete it (dead code, speculative abstraction, config nobody sets). If a lot breaks, it's load-bearing — make it a deep module behind a clean seam, don't scatter it.

## Dependency category
Whether a deepening is *desirable* and whether it can be *tested afterwards* are different questions. Classify the candidate's dependencies:

| Category | What it is | Consequence for the deepening |
|---|---|---|
| **In-process** | pure computation, in-memory state, no I/O | always deepenable; test through the new interface, no adapter |
| **Local-substitutable** | a local stand-in exists (in-process DB, in-memory FS) | deepenable *if* the stand-in exists; the seam stays internal, no port at the interface |
| **Remote but owned** | your own services across a network hop | port at the seam; logic in the module, transport injected as adapter |
| **True external** | third-party you don't control | injected port; tests supply a mock adapter |

## Design it twice
Before committing to a structure, sketch a second genuinely different shape. The comparison exposes which interface is actually narrow and which complexity is essential. Cheap on paper, expensive in code.

## Behavior-preserving gate (refactor changes)
A refactor must not change observable behavior: tests green **before and after**. The win is measured as *did depth / locality / testability improve?* — not "did it look cleaner?"

## Rejected framings
How a module's *shape* is described. (A plan's `## API & contracts` section is exempt — `plan-api-contracts` requires contract vocabulary there.)
- *boundary* → collides with DDD's bounded context; say **seam** or **interface**.
- *component / service / unit* → say **module**, which is deliberately scale-agnostic: function, class, package, or tier-spanning slice.
- *API / signature* → too narrow for a module's shape; say **interface**.
- *depth as implementation-lines ÷ interface-lines* → rewards padding the implementation. Depth is leverage: functionality hidden per unit of interface exposed.
