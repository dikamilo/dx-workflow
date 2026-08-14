---
"dx-workflow": minor
---

Broaden `dx-refactor-discover`'s sweep beyond module depth. A new `design-lenses` reference names the
principles to scan for (SRP and the rest of SOLID, KISS, YAGNI, DRY, separation of concerns,
encapsulation, coupling, composition over inheritance, robustness, orthogonality) as bare recruitment —
no definitions, no pattern catalogue — so problems outside the depth lens get found at all.
`module-design` stays the primary lens **and** the sole vocabulary: every finding is still phrased in
module terms whichever lens turned it up, and a principle name counts as a diagnosis, never a win.
`dx-plan` loads the same reference unconditionally while writing the solution design, since design
principles bear on any design and not only on refactors.
