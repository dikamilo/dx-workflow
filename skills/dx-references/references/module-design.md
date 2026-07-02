# Module design — vocabulary for refactors & structural work

Loaded by `dx-research` / `dx-frame` / `dx-plan` / `dx-refactor-discover` / `dx-impl-review` when the work is a refactor or touches structure. A shared vocabulary for judging *shape*, not a procedure.

## Deep vs shallow modules
A **module** is any unit behind an interface (function, class, file, service). Its **depth** = functionality hidden ÷ interface exposed.
- **Deep** = a lot of behavior behind a small interface. The good default: callers learn little and get much.
- **Shallow** = a wide interface over little behavior (pass-throughs, thin wrappers, config that just forwards). Shallow modules add interface cost without hiding complexity — usually a smell, occasionally deliberate (flag the reason as a lesson so it isn't re-flagged).

## Interface = the test surface
The interface is what callers — and tests — depend on. A clean, narrow interface is directly testable; a leaky one forces tests to reach into internals. When you can't test a module without knowing its implementation, the interface is too wide.

## Seams
A **seam** is a place where you can change behavior without editing around it — the natural boundary to split, substitute, or test at. Good refactors move complexity to sit behind a seam; good tests assert at one.

## The deletion test
For each piece of complexity ask: *if I deleted this, what breaks?* If nothing meaningful breaks, delete it (dead code, speculative abstraction, config nobody sets). If a lot breaks, it's load-bearing — make it a deep module behind a clean seam, don't scatter it.

## Design it twice
Before committing to a structure, sketch a second genuinely different shape. The comparison exposes which interface is actually narrow and which complexity is essential. Cheap on paper, expensive in code.

## Behavior-preserving gate (refactor changes)
A refactor must not change observable behavior: tests green **before and after**. The win is measured as *did depth / locality / testability improve?* — not "did it look cleaner?"
