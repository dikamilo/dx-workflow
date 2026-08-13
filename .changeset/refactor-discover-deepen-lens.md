---
"dx-workflow": minor
---

Deepen the `module-design` lens and the refactor finding shape. `module-design` gains the judgment
rules its consumers were missing — leverage and locality (what depth *buys*), adapter as a role
distinct from implementation, "one adapter = hypothetical seam, two = real", internal vs external
seams, interface ⊃ type signature, a four-row `## Dependency category` feasibility axis, and a
`## Rejected framings` list that moves the anti-drift guard up out of `dx-refactor-discover` so all
five consumers get it. `dx-refactor-discover` findings now carry a dependency category alongside the
strength tag (feasibility beside desirability), a one-line `Shape: before → after`, and a cash-out
rule that requires every win be named in `module-design` terms rather than "cleaner code" — and the
promote-many seed summary carries all three. `plan-failure-modes` cross-references the new dependency
axis where the two overlap on external calls.
