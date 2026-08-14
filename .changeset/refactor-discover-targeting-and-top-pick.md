---
"dx-workflow": minor
---

Give `dx-refactor-discover` a scan prior and an opinionated close. The scan now walks back
`git log --oneline` and lets churn-heavy paths pull attention first — derived at run time, nothing
maintained — and widens the net when the log shows no clear hot spot. The findings list ends with a
one-sentence **top pick**: which candidate to tackle first and why. The strength tag ranks confidence,
not sequence, and the two differ — a `Strong` finding in a cold file is worth less than a
`Worth exploring` one in a hot path. On the promote-many path the pick rides into the seed summary as
a closing `Start with:` line, since sequencing the slices is the one judgement `/dx-roadmap` cannot
re-derive from the findings.
