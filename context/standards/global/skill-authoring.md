# Skill authoring

## Use skill-creator for the authoring pipeline
Create or modify any `dx-<x>` skill through the `skill-creator` skill, not by hand-editing `SKILL.md` in isolation. It carries the pipeline this repo relies on for correctness: structured drafting, iteration, and — when the skill's behavior is non-trivial or its trigger phrasing is ambiguous — evals to check it actually fires and behaves as intended. Skip evals only for a pure copy-edit (typo, rewording) that changes no behavior or trigger condition.

## Token efficiency
- **Frontmatter is the invocation cost.** User-invoked skills (`disable-model-invocation: true`) get a terse, human-facing `description` — no trigger-phrase lists, since a human already knows to type the command. Model-invoked skills (no flag, e.g. `dx-diagnose`, `dx-domain`) keep rich trigger phrasing in `description` — that's the only text the router sees before deciding to fire.
- **No-op test on every sentence.** Before keeping a line in a skill body, ask: does the model already do this unprompted? If yes, delete it. Bodies stay short and principle-first, not procedural checklists.
- **Shared reference, not duplication.** Content used by ≥2 skills lives once in `dx-references/references/<topic>.md` and is pulled with `dx-references <topic>` — never copy-pasted or deep-linked across skill files. Content used by exactly one skill stays collocated inside that skill instead of being prematurely extracted.
- **Derive, don't maintain.** Prefer deriving state at read time (`ls` for a list, frontmatter for status, `git diff` for progress) over writing and maintaining a sidecar file that can drift out of sync.
- **No auto-chain.** A skill prints the next command and stops; it does not invoke the next skill in the lifecycle itself. This keeps each skill's own context small and the user in control of the sequence.

## Accuracy
- **Guard clause first.** Every skill that touches `context/` opens with a guard: resolve the id/path, and if it's missing or archived, say so and name the correct next command — don't proceed on a bad assumption.
- **Read-vs-write separation for review gates.** A skill that reports findings (`dx-plan-review`, `dx-impl-review`) never edits what it's reviewing; only `dx-review-triage` applies fixes, one finding at a time, on confirmation. Don't collapse this split for convenience — it's what keeps a reviewer's output trustworthy.
- **Naming consistency.** Skills that write or judge naming read `foundation/glossary.md` first (a one-line habit, not a section) so terminology stays consistent across the whole skill set.
- **Completion criteria for multi-step skills.** Any skill with more than one phase states a `## Done when` (or equivalent) condition, so both the model and the user can verify the skill actually finished rather than stopped early.
