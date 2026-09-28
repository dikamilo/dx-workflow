---
created: 2026-09-28
---

# Frame — refactor-discover-standards

Deepens `brainstorm.md`'s `## Conclusion & route`. The alternatives, the priced do-nothing and the route were settled there and are summarized here, not reopened.

## The real problem
The workflow compares code with the project's standards only at the edge of a change (a plan's checklist, a diff's review) and never across existing code, so drift between the two goes unseen in both directions: code that breaks a rule stays hidden until a change happens to touch it, and a missing rule whose absence keeps producing Candidates is lost when the run ends.

## Who / what it affects
- **Maintainers of a target project** that adopted `context/standards/` after its code was written. On such a project most rules are broken somewhere, and nothing reports it.
- **`dx-refactor-discover`**: its criteria today are only the universal lenses (`module-design`, `design-lenses`). It never reads `context/standards/`, even though `knowledge-layer.md:3` and `DESIGN.md` §8 already list it as a `knowledge-layer` consumer (an existing mismatch that slice 1 either makes true or corrects).
- **The knowledge layer's promotion paths**: today the only route into `context/standards/` is a Lesson graduating (`knowledge-layer.md` "the only promotion path", `DESIGN.md` §8 lifecycle). A Standard Proposal adds a second entry point, and `dx-standards-update` stays the only writer.
- **The "module-design is the only vocabulary" rule** (`SKILL.md` §2, `design-lenses.md`, `DESIGN.md` §9): standard-driven Candidates may name things with the standard's roles. Every place that says "sole vocabulary" has to change together.
- **Naming**: this frame settled **Candidate** (a discovery item, as opposed to a review **Finding**) and **Standard Proposal** in the glossary. `DESIGN.md:288` and `dx-refactor-discover/SKILL.md` still say "finding" for discovery output, which is drift for the slices to reconcile.

## User cases
All seven were proposed from the brainstorm and confirmed in this interview. This is a sketch of the headline flows, not an exhaustive list.

1. **Scoped run with standards**: a maintainer runs `/dx-refactor-discover src/domain` and gets standard-driven Candidates (one per broken rule, with a count and representative sites), ranked with the lens Candidates, without naming the standard. *(brainstorm, observable #1)*
2. **Unscoped run**: `/dx-refactor-discover` with no argument loads every standard that applies somewhere in the tree. Style-only and plan-authoring rules produce nothing. *(brainstorm, resolved unknowns)*
3. **Standard vs lens conflict**: code follows a standard that a lens would call shallow, so no lens Candidate is raised. At most a one-line "revisit this standard?" note appears under the Candidates. *(brainstorm)*
4. **Promote or reject**: a standard-driven Candidate is promoted like any other (a `type: refactor` change that plans the migration), or rejected through `/dx-lesson` ("don't migrate X to rule Y because Z"). *(brainstorm)*
5. **Recurring cause**: several Candidates share a cause that no rule covers, so the run ends with a Standard Proposal and the `/dx-standards-update` command, then stops. *(brainstorm, observable #2)*
6. **Amendment**: the shared cause sits next to an existing standard, so the Proposal amends that standard instead of adding a new one. *(brainstorm conclusion)*
7. **No standards at all**: a project with an empty `context/standards/` still gets Standard Proposals, fed only by lens Candidates. *(brainstorm bundling test)*

Cases 1–4 belong to the standards lens and 5–7 to the proposals. That is the bundling test's split, but `/dx-roadmap` decides the slices.

## Alternatives considered
- **Both capabilities inside `dx-refactor-discover` (chosen).** Standards become a third source of Candidates on the existing scan → rank → pick → design twice → promote pipeline. Proposals sit at the end of that same run, the only moment the whole set of Candidates, and so the pattern across them, is in view.
- **A separate whole-tree standards check** (like `dx-impl-review` without a diff): lost. It would be a new skill with duplicate ranking and promotion, and its Candidates end up as the same kind of change anyway.
- **Leave proposals to `dx-standards-discover` / `-update`**: lost. Neither sees a refactor run's Candidates, so the shared cause is gone by the time they run.
- **Do nothing** (pass the standard's path by hand each run, spot patterns by eye): lost. The rules nobody thinks to name stay hidden for good, and the argument scopes *where* the run looks, not *what it checks against*. It survives as the cheap pre-plan test below.

**Caveats carried forward** (from the brainstorm's adversarial pass, still open):
- *Riskiest assumption:* a codebase that doesn't follow its standards gives a short list of useful Candidates rather than a flood. Grouping one Candidate per rule is the mitigation. Cheapest test before planning slice 1: run today's skill on one real area with a building-blocks-style standard passed by hand, and see whether the output is useful.
- *Proposal spam:* the bar is "several Candidates share one cause", not "a Candidate exists". Slice 2's plan sets the threshold.
- *Graduation path:* whether a Proposal skips the Lesson step or goes through it is a plan decision, and `knowledge-layer.md`'s "only promotion path" line must follow it.
- *`minimal-implementation.md` vs structural standards:* the skill must never propose building empty layers ahead of need in a standard's name.
- *Evals:* there is no harness (`foundation/lessons.md`, 2026-07-28). Each slice plan states this deviation in `## Standards to apply`.

## Out of scope
- `dx-refactor-discover` writing or editing anything under `context/standards/`. It only proposes, and `dx-standards-update` writes.
- A separate standards-check skill.
- One Candidate per violating site.
- Loading the whole standards tree regardless of scope, or only the standards the user names.
- Any persisted audit file, debt register, or backlog of pending Proposals. Candidates and Proposals stay ephemeral.
- Enforcing standards on new work. That stays with `dx-plan` / `dx-impl-review`.
- Cutting the slices or writing `roadmap.md`. That's `/dx-roadmap`.
