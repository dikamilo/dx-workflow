---
created: 2026-09-28
---

# Frame — refactor-discover-standards-lens (slice 1)

Slice mode: the real problem, who it affects, the alternatives and out of scope are inherited from `context/efforts/refactor-discover-standards/frame.md` and not restated. So are its user cases 1–4 (scoped run, unscoped run, standard vs lens conflict, promote or reject).

## User cases
Additions for this slice. All four were proposed and confirmed in this interview.

5. **Minimal-implementation guard**: a structural standard requires a layer the code has no second use for yet (e.g. a Repository port with a single adapter), and the project's `minimal-implementation.md` pulls the other way. The maintainer gets either no Candidate or one tagged `Speculative`. The run never proposes building empty layers in the standard's name. *(a brainstorm caveat, turned into a user case in this interview)*
6. **Overlap merges**: one module breaks a standard and also trips a lens (e.g. the domain imports the DB client, which is also a leaky seam). The maintainer sees a single Candidate that cites the rule and states the lens win in `module-design` terms, instead of two duplicates competing for rank. *(discovered in this interview)*
7. **Rejected stays skipped**: a standard-driven Candidate that was rejected through `/dx-lesson` ("don't migrate X to rule Y because Z") does not come back on the next run over the same scope. This refines parent case 4, which covered the rejection but not the re-run. *(discovered in this interview)*
8. **Seed carries the rule**: on promote many, each standard-driven Candidate's entry in the seed handed to `/dx-new` names the standard's path and the rule it breaks, so `/dx-roadmap` and `/dx-plan` know which rule the migration serves. This holds whether the seed is printed or passed directly (see below). *(discovered in this interview)*

Not part of this slice: promote many invoking `dx-new` directly instead of printing a seed for the user to copy and paste. The user raised it here and placed it as slice 3 of the effort. It changes the handoff for every Candidate, not only standard-driven ones.
