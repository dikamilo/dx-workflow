---
"dx-workflow": minor
---

dx-refactor-discover: the project's `context/standards/` becomes a third source of refactor candidates next to `module-design` and `design-lenses`. The skill loads `knowledge-layer` and uses its *domain × topic* matching to pick the standards in scope. Of those, it keeps only structural rules that existing code can be checked against. Each broken rule becomes one candidate, with a site count, representative sites and a `<standard path> § <rule>` citation. The standard wins over a lens. A module that breaks a rule and trips a lens is reported once. A candidate that would add a layer with no second use is capped at `Speculative`, or dropped where a loaded standard says minimal implementation wins. Rejected "don't migrate X to rule Y because Z" lessons are skipped on later runs. A standard-driven candidate may name where things sit with the standard's roles, but its win is still stated in `module-design` terms. Promoted seeds carry an optional `Standard:` line. Discovery output is renamed from "finding" to "candidate".

dx-new: the refactor promote-many seed parse keeps each candidate's optional `Standard:` line verbatim in its `research/<topic>.md`, alongside `Sketch:`. The seed heading and `## Notes` marker are unchanged.
