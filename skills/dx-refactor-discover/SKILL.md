---
name: dx-refactor-discover
description: Hunt the codebase for refactor opportunities, present them inline, and promote the ones you pick into changes.
disable-model-invocation: true
argument-hint: [area or path]
---

# dx-refactor-discover

Start with no concrete target — "find me refactor opportunities." Scan the codebase for **design problems worth fixing** — shallow modules to turn deep, whatever the wider design lenses surface, and code that breaks the project's own structural standards — present them **inline as markdown**, and promote whichever the user picks into a normal container. This skill discovers and hands off — it can sketch alternative interfaces for whichever candidates the user picks, but it writes no `plan.md` and edits no code.

**Guard.** If `context/` isn't scaffolded (no `changes/` or `efforts/`), stop and tell the user to run `/dx-init`. The candidates this run produces are **ephemeral** — there is no debt register; anything not promoted or recorded as a lesson leaves no trace.

## 1 — Load the vocabulary and the rulebook

Invoke `dx-references` with topic `module-design` — its terms (deep vs shallow, seam, leverage and locality, adapter, dependency category, the deletion test) are how every candidate is phrased, and its `## Rejected framings` says which words stay out. Read `foundation/glossary.md` for naming (a one-line habit — no section) and `foundation/lessons.md` so you **skip anything a prior run already rejected** — "don't re-deepen X because Y" and "don't migrate X to rule Y because Z" alike.

Invoke `dx-references` with `knowledge-layer` and match `context/standards/` to the scope by its *domain × topic* rule: a scoped run takes `global/` plus the areas the scoped code belongs to; an unscoped run takes every standard that applies somewhere in the tree. From those, keep only the **structural rules existing code can be checked against** — where a unit lives, what it may depend on, one unit per role. A rule about how to write plans or new work, or a style nit, has nothing to find in old code.

## 2 — Scan

Optionally scoped by `[area or path]`; unscoped means the whole tree. Invoke `dx-references` with `design-lenses` — module depth is the primary lens, not the only one, and problems outside it go unfound if nothing else is looking. Fan out to built-in `Explore` subagents to walk it — explore for friction, don't run rigid heuristics.

**Recency is the default prior.** Walk back a stretch of `git log --oneline` and let the paths that keep showing up pull attention first — churn is where a deepening pays back soonest. If the log is scattered with no clear hot spot, widen the net instead.

Look for: understanding one concept that means bouncing between many small modules; shallow modules (interface nearly as wide as the implementation); pure functions extracted only for testability while the real bug hides in how they're called; seams that leak; and what the other lenses catch — knowledge duplicated across modules, one module changing for unrelated reasons, coupling that makes a single edit ripple. Apply the **deletion test** to each suspect: would deleting it concentrate complexity, or just move it? "Concentrates" is the signal.

**The kept standards are a third source.** The standard is taken as correct: the code is checked against the rule, never the rule against the code. That settles the collisions with the lenses:

- **The standard beats a lens.** Code that follows a standard gets no lens candidate, even where a lens would call it shallow. If the conflict looks costly, it earns one line under the list (§3) — the standard itself is the user's call.
- **Overlap merges.** A module that breaks a rule and trips a lens is one candidate — the standard-driven one, carrying the lens's win — not two competing for rank.
- **No empty layers in a standard's name.** A candidate whose after-shape adds a layer with no second use (a port with one adapter) is capped at `Speculative`, with its deletion-test result stated. Where a loaded standard says minimal implementation wins, drop it.

**Whichever source found it, `module-design` is still how it's said.** A layering violation reports as "this module reaches through two interfaces to the store; the seam belongs at X" — not as the principle it violates. One exception: a standard-driven candidate may name *where things sit* with the standard's roles ("the application service imports the schema"); its *win* is still said in `module-design` terms.

## 3 — Present candidates inline

Markdown only — no HTML, no report file. A concise numbered list; each candidate one tight entry:

- **What & where** — the module and files.
- **Why it's shallow / tangled** — in `module-design` terms.
- **Shape: before → after** — one line (`4 wrappers + handler → 1 module, 2 methods`).
- **Proposed deepening** — the move, plus a strength tag (`Strong` | `Worth exploring` | `Speculative`).
- **Dependency category** — in-process / local-substitutable / remote-but-owned / true-external. The strength tag says whether the deepening is worth doing; this says whether the result can be tested afterwards, which is where a refactor actually stalls.

**One candidate per broken rule, not per site.** A standard-driven entry gives a site count with a few representative sites (`5 sites, e.g. reserve.ts, commit.ts`) and cites `<standard path> § <rule>`; it ranks with the lens candidates on the same terms.

**Cash out the win.** Name it in `module-design` terms — "locality: bugs concentrate in one module", "leverage: one interface, 12 call sites", "two adapters justify the seam: HTTP in prod, in-memory in tests". "Cleaner code" and "easier to maintain" give the reader nothing to check and nothing to carry into the change.

**The scan stays at shape level.** `Shape: before → after` is as far as a candidate goes here. Designing interfaces across N candidates spends the effort before the user has said which one matters; that happens after the pick, in §4.

**Close with a top pick** — one sentence: which candidate to tackle first and why. The strength tag ranks confidence, not sequence; a `Strong` candidate in a file nobody touches is worth less than a `Worth exploring` one in a hot path. Under it, at most one `revisit <standard path> § <rule>?` line when a standard shielded code at a cost that looks real. Then ask which the user wants to promote.

## 4 — Design it twice for the pick (opt-in)

Offer this once the user has picked, before promoting. Skipping it is fine and goes straight to §5 — but the scan only ranked candidates on the shape they have, and a candidate whose alternatives all look bad shouldn't be promoted. Exploring here is cheap: the context is freshest at the moment of the pick, and the winning sketch rides into the change so `/dx-plan` doesn't re-derive it.

**One candidate picked** → ask the plain yes/no ("explore `<candidate>` before promoting?") and, if yes, run steps 1–3 below once for it.

**More than one candidate picked** → don't repeat the yes/no per candidate. Ask one batched question first: "sketch any of these before promoting?" — options *none* / *all* / *specific ones*, recommending just the top pick (2–4 concrete options with a recommendation, the `interview` reference's shape). Then run steps 1–3 below, plus the stop-and-ask that closes this section, **once per selected candidate, sequentially** — never spawn the next candidate's sub-agents before the current candidate's sketch is confirmed. This is the fan-out safeguard: at most one candidate's batch (3–4 agents) is ever in flight, no matter how many candidates total.

1. **Frame the problem space to the user** — the constraints any new interface has to satisfy, the dependencies and their category, and a rough code sketch to make the constraints concrete (an illustration, not a proposal). Show it and **start the sub-agents immediately**: the user reads and thinks while the agents work, which is the whole point of doing this in parallel. Don't block on a reply.
2. **Spawn 3–4 built-in `Plan` sub-agents in parallel**, each under a different **forcing constraint**. State each constraint as **where it puts the seam**, not as a value to maximize — two values can share an optimum, and then two agents hand back the same interface:
   - **Collapse to 1–3 entry points**, everything else pushed behind them.
   - **Move part of the contract out of the interface** — into structure, config, or something the caller declares rather than calls.
   - **Split the seam** so the common caller and the rare caller reach different entry points.
   - **Ports & adapters** — only when the dependency category is *remote-but-owned* or *true-external*.

   On a module with one dominant caller the first and third collapse — the smallest surface already *is* the best default case — so pick one and spend the freed agent elsewhere. Use `Plan`, not `Explore`: `Explore` is read-only search, which is what §2 fans out to; this is design work.
3. **Write each agent its own technical brief.** A sub-agent starts cold, so the brief carries file paths, the coupling detail, the dependency category, what sits behind the seam, and its one constraint — separate from the user-facing framing in (1). Write the structure in `module-design` terms, and the domain in `foundation/glossary.md` terms **when the candidate has a domain** — infrastructure and tooling often doesn't, and forcing glossary words onto a build script buys nothing. Designs that name things the same way are the only ones worth comparing side by side.

Ask each for the same five things, so the answers line up: **interface** (types, methods, params — and the invariants, ordering and error modes that are just as much interface) · **usage example** from the caller's side · **what the implementation hides behind the seam** · **dependency strategy and adapters** · **trade-offs**, naming where leverage is high and where it's thin.

**When it goes wrong.** An agent that returns nothing, errors, or comes back unusable is **dropped, not retried** — compare the survivors and say plainly that fewer than three came back, so the user knows how wide the comparison actually was. And if the user's reply to the framing **contradicts the constraints the briefs were built from**, discard the in-flight sketches and re-spawn. Reconciling designs built on a superseded framing produces a shape nobody chose.

Present the survivors **sequentially**, compare them on **depth, locality, and seam placement** — the `module-design` axes, so this stays inside the one vocabulary — and close with an **opinionated pick or hybrid**, the same discipline as the top pick in §3. Two designs that share an entry point and differ only in policy are **one** design: say the constraint didn't bite rather than presenting them as two, because a comparison padded to three is worth less than an honest two.

**Stop here and ask which sketch to carry forward.** The pick is a recommendation, not a decision — §5 writes files, and a file written on the wrong sketch is a redo, not an edit. Don't promote on your own ranking the way §3 permits when the user is AFK; wait for the reply. For a multi-select promote, this reply is what unblocks the next selected candidate — don't spawn its sub-agents until it lands.

## 5 — Promote the pick

- **One** → create the change directly, the same way `dx-diagnose` self-contains its own promotion: write `context/changes/<slug>/change.md` stamped `type: refactor`, with the candidate captured as its seed `research/<topic>.md` (or `frame.md` if it reads more like a framing than a research write-up). If §4 ran, wait for the user's reply to the stop-and-ask before writing anything — the sketch that goes into the seed, with the trade-offs that decided it, is the one the user confirmed, not the opinionated pick on its own. That confirmed sketch is what stops the exploration being thrown away; `/dx-plan` reads it as upstream context. Invoke `dx-references` with `change-md` for the exact schema. This is this skill's own deliverable, not a chain into `/dx-plan` — that stays the printed next command.
- **Many** → decomposing into an effort + roadmap + several child changes is already a multi-step flow owned by other skills (`dx-new` for the effort, `dx-roadmap` for the slices, `dx-new` again per slice) — print the commands and let the user drive it, don't fold all of that in here. But don't make the user re-type what they just picked: compose a **seed summary**, the full entry (what & where, why, shape, proposed deepening, strength tag, dependency category) for each promoted candidate — plus the chosen sketch for any candidate §4 explored — under a heading that names `/dx-refactor-discover` as the source. Print it as the literal argument to hand to `/dx-new` so the handoff carries the detail, not just a slug. Carry the top pick into it as a closing line — `/dx-roadmap` sequences the slices, and the read on which one goes first is the thing it can't re-derive.
- **Rejected with a load-bearing reason** → offer `/dx-lesson` to record "don't re-deepen X because Y" so the next run skips it. Rejected ephemerally or selected → no durable trace.

## Done when

Candidates have been presented inline, the user has chosen, and — if they took the §4 offer — the alternatives have been compared and one picked. For a single promoted change, the container now exists — print what was created and the next command. For everything else, print the exact command and **stop** — never run it:

```
Promoted one: Change created: context/changes/<slug>/change.md   (type: refactor, seeded with the candidate)
              Next: /dx-plan <slug>

Promote many: Next: /dx-new "<seed summary>"   →  /dx-roadmap <effort-id>

              Where <seed summary> is:
              ## Refactor opportunities (from /dx-refactor-discover)
              1. **<title>** — <module/files>
                 Why: <shallow/tangled reason + the cashed-out win, in module-design terms>
                 Shape: <before → after>
                 Proposed: <the move> (<Strong|Worth exploring|Speculative>, <dependency category>)
                 Sketch: <the chosen interface and why it won>   (only if §4 explored this one)
              2. ...
              Start with: <which one first, and why>

Record a no:  /dx-lesson                (don't re-deepen X because Y)
```

Stop. Do not chain into another skill.
