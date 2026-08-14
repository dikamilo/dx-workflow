---
"dx-workflow": minor
---

Let `dx-refactor-discover` design the pick twice before promoting it. The scan itself still stops at
`Shape: before → after` — designing interfaces across N candidates spends the effort before the user
has said which one matters — but once a candidate is picked, the skill offers an **opt-in** parallel
exploration: it frames the constraints and dependency category back to the user, then immediately
spawns 3–4 built-in `Plan` subagents, each under a forcing constraint stated as *where the seam goes*
rather than as a value to maximize (collapse to 1–3 entry points · move part of the contract out of
the interface · split the seam so common and rare callers reach different entry points · ports &
adapters, gated on the dependency category). Two values can share an optimum — on a single-caller
module "smallest surface" and "trivial default case" are the same lever — and then two agents return
the same interface with a parameter renamed; seam placements can't coincide that way. Two designs
sharing an entry point are reported as one, rather than padding the comparison to three. Each agent
gets its own technical brief, written in `module-design` terms for structure and
`foundation/glossary.md` terms for the domain when the candidate has one — infrastructure often
doesn't — and returns the same five
things (interface, usage example, what's hidden behind the seam, dependency strategy, trade-offs), so
the results are comparable. Survivors are compared on depth, locality, and seam placement and closed
with an opinionated pick or hybrid; an agent that comes back unusable is dropped rather than retried,
and a user reply that contradicts the framing re-spawns rather than reconciles. The chosen sketch
rides into the promoted change's seed artifact — and into the seed summary on the promote-many path —
so `/dx-plan` inherits the exploration instead of re-deriving it. The skill still writes no `plan.md`
and edits no code.
