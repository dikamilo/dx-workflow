# Design lenses — what to look at besides module depth

Loaded by `dx-refactor-discover` (scan criteria) and `dx-plan` (solution design). `module-design` stays the primary lens and the only phrasing vocabulary; these lenses widen what gets **found**, never how it gets **said**.

## Principles to sweep for

Names, not definitions — these are pretrained, and a gloss here would be a line the model already obeys.

Single responsibility · open/closed · Liskov substitution · interface segregation · dependency inversion · KISS · YAGNI · DRY · separation of concerns · encapsulation · minimise coupling · composition over inheritance · robustness principle · orthogonality.

## Known shapes

Consider whether a known design pattern, architectural style, or domain archetype names the shape the code could become — when one genuinely fits. There is deliberately no catalogue here to work through.

## A principle name is a diagnosis, never a win

"Violates SRP" is as empty as "cleaner code" — it names the lens, not the consequence. Say what it costs: *changes for two unrelated reasons, so every pricing edit risks the tax path.* This is what keeps a finding legible downstream, where the skills reading it load `module-design` and not this file.
