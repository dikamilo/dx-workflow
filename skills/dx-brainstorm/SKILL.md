---
name: dx-brainstorm
description: Think through a raw idea before committing to it — weigh alternatives, price doing nothing, and route to a change, an effort, or nothing at all.
disable-model-invocation: true
argument-hint: [idea or question]
---

# dx-brainstorm

Runs **before** `dx-new` on an idea nobody has yet decided is worth building. **Concluding that nothing should be built is a success**, not a run that failed to produce work.

**Guards.** `context/` unscaffolded (`changes/` and `efforts/` absent — empty is normal) → stop, say to run `/dx-init`. No user available to answer → stop; don't invent the appetite and constraints you came here to ask about. And *"this is simple enough to just do it now"* is the red flag, not the shortcut — whether it's simple enough is the conclusion, not the bypass.

## 1 — Sources before questions

A question whose answer already sits in the repo is homework, not conversation. Climb in order, stopping as soon as something answers: `foundation/glossary.md` + `lessons.md` → `context/standards/` → `context/changes/**` and `context/archive/**` (already decided, shipped, or rejected?) → the codebase → the user.

## 2 — Diverge

Before converging — unless §1 found this already shipped, which settles the ramp:

- **Restate the problem without the user's proposed solution.** It arrives pre-shaped; the problem underneath is usually wider or narrower.
- **≥2 genuinely different alternatives, plus a *priced* do-nothing.** Different mechanism, not the same idea at two sizes. Price what the pain costs per week and who absorbs it. **Strawmanning it is the failure mode.**
- **The riskiest assumption and the cheapest test of it.** If a one-day spike settles it, that spike may be the whole change.
- **Refuse vague framing.** "Improve X" — push to an observable difference, or there's nothing to build.
- **The bundling test** — *would each capability function without the other?* Yes → effort. No → change. It only decides ramps 3 vs 4.
- **"What breaks if this succeeds?"**

## 3 — Converge

Invoke `dx-references` with topic `interview` — one question at a time, and run step 5's adversarial pass **before** presenting the conclusion, since routing is hard to reverse once a container exists. A critical objection goes back to the user as a question; don't self-resolve it.

Stop when one ramp fits, every unknown that would *change the routing* is resolved, and the user signals enough. Routing-sufficiency, not exhaustiveness — the rest belongs to `dx-frame` and `dx-plan`.

## 4 — Take one of four exit ramps

1. **Nothing worth building** — no container, no artifact, no `Next:` line. State the conclusion and why the do-nothing won.
2. **Already covered** by an open or archived container — cite its path and stop.
3. **One shippable unit** → `context/changes/<id>/change.md` (invoke `dx-references` with topic `change-md`) + `brainstorm.md`, whose shape is `${CLAUDE_SKILL_DIR}/references/brainstorm-md.md` — read it before writing. Stamp `type` — normally `feature`; it gates the plan's characteristics, so decide it rather than leaving it to be guessed.
4. **≥2 independently shippable capabilities** → `context/efforts/<id>/effort.md` (invoke `dx-references` with topic `effort-md`) + `brainstorm.md`, same shape. Identity file only — **no `roadmap.md`**, though the reference describes one, because the slices aren't yours to cut. Efforts carry no `type`; don't invent one.

**Ramps 1–2** write nothing and never load that reference; when the rejection is load-bearing, offer `/dx-lesson` — the one durable trace either leaves. **Ramps 3–4**: propose the `<id>` so the user can redirect it (kebab-case, space-free).

Tie-breakers: **don't manufacture work to have a handoff.** Already shipped → ramp 2, never ramp 1. Appetite is the user's call. If naming the affected areas took real work, that's ramp 4 over 3.

## Not a chain

Creating the container **is** this skill's deliverable; the no-auto-chain rule binds the step *after* it. Never run `/dx-plan`, `/dx-frame`, or `/dx-roadmap`. Slices stay `dx-roadmap`'s, child changes `dx-new`'s.

## Done when

One ramp taken, its artifacts (if any) written, the outcome printed. The left-hand label selects the case — print only what follows it, plus any caveat the adversarial pass left standing. Then **stop**:

```
No user:          <what couldn't be asked — and that no appetite or constraint was invented>
Nothing to build: <one-line conclusion — why the do-nothing won>
Already covered:  Covered by <path>   (status: <status>)
One change:       Brainstorm written: context/changes/<id>/brainstorm.md
                  Next: /dx-frame <id>    → /dx-plan <id>       (frame optional)
An effort:        Brainstorm written: context/efforts/<id>/brainstorm.md
                  Next: /dx-frame <id>    → /dx-roadmap <id>    (frame optional)
```
