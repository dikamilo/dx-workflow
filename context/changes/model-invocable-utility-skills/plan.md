# Plan: Allow dx-new, dx-archive, dx-lesson, and dx-standards-update to run model-invoked

## Approach
Drop `disable-model-invocation: true` from all four skills so a calling skill (`dx-brainstorm`,
`dx-diagnose`, `dx-refactor-discover`, and future callers) can reach them by explicit named
invocation — the same mechanism `dx-references` already relies on (DESIGN.md §13/line 154:
"model-invocation stays enabled... so a skill can reach the loader when instructed"). Leave every
`description` untouched: these four stay in the terse, human-facing style, not rewritten with rich
trigger phrasing. The goal is "callable by name from inside another skill," not "auto-fires from
raw user chat" — that auto-fire doctrine stays reserved for `dx-diagnose`/`dx-domain` per DESIGN
§13. This produces a third, previously-undocumented invocation shape (user-invoked **and**
explicitly model-callable, never opportunistically auto-fired) that the glossary and
`docs/reference/skills.md` need a line for, since both currently only describe the user/model-auto
binary.

Reviewed all four skill bodies against "does this break when a calling skill drives it instead of
a human typing the command": none do. Every interactive point (`dx-new`'s coin-flip/slug-collision
questions, `dx-archive`'s effort/review gates, `dx-lesson`'s missing-argument prompt,
`dx-standards-update`'s conversation-lift) still resolves correctly because an invoked skill shares
the same conversation and the same user — asking mid-flow just interrupts the calling skill, which
is the intended alignment-over-smoothness trade-off elsewhere in this workflow. No skill body needs
a behavior change; the fix is frontmatter plus the docs that describe it.

Out of scope: rewiring `dx-brainstorm`, `dx-diagnose`, or `dx-refactor-discover` to actually call
these four instead of inlining container creation. `change.md` bounds the fix to "drop/adjust
`disable-model-invocation`, confirm each skill's body" — this change unlocks the capability; wiring
up callers is separate follow-on work.

## Standards to apply
- [ ] `skill-authoring.md` — "Use skill-creator for the authoring pipeline": this is a behavior/trigger-condition change (not a pure copy-edit), so route it through `skill-creator` rather than hand-editing `SKILL.md` frontmatter directly.
- [ ] `skill-authoring.md` — "Frontmatter is the invocation cost": confirm the four descriptions stay terse/human-facing (no trigger-phrase additions) — this is the deviation from the strict user-invoked/model-invoked binary the standard states in prose; call it out in commit/PR description rather than leaving it implicit.

## Priors & gotchas
- `foundation/lessons.md` — "Skills ship without evals — no harness exists" (2026-07-28): this repo has no eval harness, so `skill-creator`'s eval step is unmeetable here too. State that deviation explicitly (as that lesson's "How to apply" prescribes) instead of silently skipping evals.

## API & contracts
- **Contract added:** four skills (`dx-new`, `dx-archive`, `dx-lesson`, `dx-standards-update`) become reachable via explicit named invocation from another skill's instructions (e.g. "invoke `dx-new` stamped `type: defect`"), in addition to their existing `/dx-<x>` typed-command path. Mechanism: remove `disable-model-invocation: true`; no other frontmatter or body change.
- **Additive, not breaking.** Direct user invocation (`/dx-new`, `/dx-archive`, `/dx-lesson`, `/dx-standards-update`) is unchanged — same arguments, same behavior, same printed output. No existing caller loses anything.
- **New callers, no compatibility path needed.** No caller exists yet that relies on the old (invocation-blocked) state, so there's nothing to migrate — this purely opens a previously-closed path.

## Phases

### Phase 1: Drop `disable-model-invocation` on all four skills
Remove the `disable-model-invocation: true` line from `dx-new/SKILL.md`, `dx-archive/SKILL.md`,
`dx-lesson/SKILL.md`, and `dx-standards-update/SKILL.md`. No other frontmatter or body edit.
Route through `skill-creator` per the standard above (skip its scaffolding for new-skill setup —
this is a frontmatter edit to four existing skills, not a new skill). Verify with
`npm run lint:skills` and a quick check that each skill's `/`-typed path still works unchanged
(descriptions untouched, so nothing else to verify there).

### Phase 2: Document the new invocation pattern
Update `foundation/glossary.md`'s **Skill** entry to name the third shape — user-invoked *and*
explicitly model-callable by another skill's instruction, never auto-fired from free text —
alongside the existing user-invoked/model-invoked (auto-fires) pair. Add a matching `Invoke:` line
convention in `docs/reference/skills.md` for the four entries (`dx-new`, `dx-archive`, `dx-lesson`,
`dx-standards-update`), distinct from today's `user` and `**model** (auto-fires)` conventions —
e.g. `user or model (by name, no auto-fire)`.

### Phase 3: Versioning
Run `npx changeset` for this slice (touches `skills/**`) — pick the bump type (patch: no behavior
change to existing invocation paths, only a new one opened) and write a one-line summary.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Drop `disable-model-invocation` on all four skills
#### Automated
- [x] 1.1 `disable-model-invocation: true` removed from all four `SKILL.md` files — af691b8
- [x] 1.2 `npm run lint:skills` passes — af691b8
#### Manual
- [x] 1.3 Confirm `skill-creator`'s eval step is skipped with the stated reason (no harness — see Priors), not silently — af691b8

### Phase 2: Document the new invocation pattern
#### Automated
- [x] 2.1 `foundation/glossary.md` Skill entry updated with the third invocation shape — a8bb5ee
- [x] 2.2 `docs/reference/skills.md` `Invoke:` lines updated for the four skills — a8bb5ee

### Phase 3: Versioning
#### Automated
- [ ] 3.1 `.changeset/*.md` added covering this slice
