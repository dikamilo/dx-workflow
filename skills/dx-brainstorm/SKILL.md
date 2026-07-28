---
name: dx-brainstorm
description: Think through a raw idea before committing to it — weigh alternatives, price doing nothing, and route to a change, an effort, or nothing at all.
disable-model-invocation: true
argument-hint: [idea or question]
---

# dx-brainstorm

The divergent front door, running **before** `dx-new` on an idea nobody has yet decided is worth building. Widen first, converge second, and end on one of four ramps. **Concluding that nothing should be built is a success**, not a run that failed to produce work.

**Guards.** If `context/` isn't scaffolded (no `changes/` or `efforts/`), stop and say to run `/dx-init`. This is a **conversation** — if no user is available to answer, stop and say so rather than inventing the appetite and constraints you were sent here to ask about. And the anti-implementation gate: *"this is simple enough to just do it now"* is the red flag, not the shortcut — whether it's simple enough is the brainstorm's conclusion, not its bypass.

## 1 — Sources before questions

A question whose answer already sits in the repo is homework, not conversation. Climb in order, stopping as soon as something answers: `foundation/glossary.md` + `foundation/lessons.md` → `context/standards/` → `context/changes/**` and `context/archive/**` (was this already decided, shipped, or rejected?) → the codebase → the user.

## 2 — Diverge

Before converging on anything:

- **Restate the problem without the user's proposed solution.** Ideas arrive pre-shaped as solutions, and the problem underneath is usually wider or narrower than the shape it came in.
- **At least two genuinely different alternatives, plus a *priced* do-nothing.** Different means a different mechanism, not the same idea at two sizes. Price the do-nothing honestly — what the pain costs per week and who absorbs it. **Strawmanning it is the failure mode**; a do-nothing that always loses was never actually weighed.
- **Name the riskiest assumption and the cheapest way to test it.** If a one-day spike would settle it, that spike may be the entire change.
- **Refuse vague framing.** "Improve X", "make it better" — push until there's an observable difference, or there is nothing here to build.
- **The bundling test** — *would each capability function without the other?* Yes → independently shippable, so an effort. No → one unit, so a change.
- **"What breaks if this succeeds?"** — the cost of the win, not only the win.

## 3 — Converge

Invoke `dx-references` with topic `interview`: one question at a time, and step 5's adversarial pass runs **before** the conclusion is presented — routing is consequential and hard to reverse once a container exists. A critical objection goes back to the user as a question; don't self-resolve it.

Stop when one ramp clearly fits, every unknown that would *change the routing* is resolved, and the user signals enough. The bar is routing-sufficiency, not exhaustiveness — remaining unknowns belong to `dx-frame` and `dx-plan`.

## 4 — Take one of four exit ramps

1. **Question answered / nothing worth building** — no container, no artifact, no `Next:` line. State the conclusion and why the do-nothing won. (`dx-diagnose`'s trivial branch is the precedent for a terminal outcome with no handoff.)
2. **Already covered** by an open or archived change or effort — cite its path and stop.
3. **One shippable unit** → write `context/changes/<id>/change.md` (invoke `dx-references` with topic `change-md`) and `brainstorm.md` beside it.
4. **The bundling test found ≥2 independently shippable capabilities** → write `context/efforts/<id>/effort.md` (invoke `dx-references` with topic `effort-md`) and `brainstorm.md` beside it.

Tie-breakers: **don't manufacture work to have a handoff** — ramps 1 and 2 are outcomes, not dead ends. Appetite is the user's call, never yours. And if naming the affected areas took real work, that's the signal for ramp 4 rather than 3.

## 5 — `brainstorm.md`

The brainstorm's own artifact, at the container root beside `research/` and `frame.md`. It carries what the conversation decided *and what it rejected* — the part that evaporates otherwise. `<id>` is kebab-case and space-free.

```markdown
---
created: <today>
---

# Brainstorm — <id>

## The question
<the problem restated without the proposed solution>

## Alternatives weighed
<each option, why it lost or won — including the priced do-nothing and what it cost>

## Conclusion & route
<the chosen outcome, the ramp taken, and the bundling test's verdict if it ran>

## Resolved unknowns
| Question | Answer |

## Not doing
<explicitly rejected scope, so it isn't relitigated downstream>
```

Write `none` under a heading rather than deleting it — an absent section reads as an oversight, `none` reads as a decision.

**Resolved unknowns is the run's self-check.** An empty table means the conversation settled nothing, so the route isn't earned: keep talking, or downgrade the ramp.

## Not a chain

Creating the container **is** this skill's deliverable — the reconciliation `dx-refactor-discover` §4 already states. The no-auto-chain rule binds the step *after* it: never run `/dx-plan`, `/dx-frame`, or `/dx-roadmap` yourself. Slice decomposition stays `dx-roadmap`'s job, child changes stay `dx-new`'s.

## Done when

One ramp has been taken, its artifacts (if any) written, and the outcome printed. Then **stop**:

```
Nothing to build: <one-line conclusion — why the do-nothing won>
Already covered:  Covered by <path>   (status: <status>)
One change:       Brainstorm written: context/changes/<id>/brainstorm.md
                  Next: /dx-frame <id>    → /dx-plan <id>       (frame optional)
An effort:        Brainstorm written: context/efforts/<id>/brainstorm.md
                  Next: /dx-frame <id>    → /dx-roadmap <id>    (frame optional)
```
