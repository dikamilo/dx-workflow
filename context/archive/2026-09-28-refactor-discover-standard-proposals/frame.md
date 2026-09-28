---
created: 2026-09-28
---

# Frame — refactor-discover-standard-proposals

Slice 2 of `refactor-discover-standards`. The real problem, who it affects, the alternatives and what's out of scope are settled in the effort's `frame.md` and are not restated here. The parent's cases 5 (recurring cause), 6 (amendment) and 7 (no standards) are this slice's headline flows. The cases below add to or pin down those three.

## User cases
All six were discovered in this interview and refine or bound the parent's cases 5–7.

- **A. Quiet run**: a maintainer runs `/dx-refactor-discover` and no shared cause meets the bar. The run ends with Candidates only, with no Proposal and no "none found" line. *(pins down the parent's proposal-spam caveat)*
- **B. Already covered**: the shared cause is a rule that an in-scope standard already states. It surfaces as a standard-driven Candidate (slice 1) and never as a Proposal for a rule that already exists.
- **C. Declined Proposal**: the user rejects a Proposal and gives a load-bearing reason. They are offered `/dx-lesson` ("don't propose rule X because Z"), and the next run skips that Proposal, the same way rejected Candidates are skipped.
- **D. Proposal and promotion in one run**: the user promotes one or more Candidates and also accepts a Proposal. The Done-when output prints both next commands (the promotion's and `/dx-standards-update`'s) and runs neither.
- **E. One Candidate with many sites**: a single lens Candidate spans many sites and no rule covers its cause (e.g. the cheap test's "audit envelope assembled by hand at six sites"). No Proposal is made, because the bar is a cause shared across several distinct Candidates. The exact number is left to the plan.
- **F. Revisit line stays separate**: a standard protects code at a real cost. Slice 1's single `revisit <standard> § <rule>?` line still appears, and it is not turned into an amendment Proposal. Amendments (case 6) only extend or tighten a rule to cover a recurring cause, never loosen one, because the code is checked against the rule and never the rule against the code.
