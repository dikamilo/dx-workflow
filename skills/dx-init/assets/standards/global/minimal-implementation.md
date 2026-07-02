# Minimal Implementation

Build the minimum that solves the problem. Nothing speculative. This is the "no over-engineering" baseline the whole framework leans on.

## Build what's called
Create only the methods, classes, and functions that something actually calls. Every unit either has a caller or earns its place by making code readable.

## No future stubs
No empty methods, placeholder functions, or interfaces added "for future extensibility." Add them when a real caller arrives, not before.

## No speculative abstractions
Skip factories, strategies, adapters, and config knobs until there is an immediate, concrete need. A single use case does not warrant an abstraction.

## Delete exploration artifacts
Remove helpers and scaffolding created while figuring things out that ended up unused. The commit ships the solution, not the search for it.

## Unused code is debt
Dead code confuses readers and adds maintenance burden for zero value. Before finishing, verify every new unit has a caller or a clear readability purpose.
