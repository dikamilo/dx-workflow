# Find refactoring opportunities with dx-refactor-discover

In this tutorial you will start with **no concrete target** — just "find me some refactor
opportunities" — and let `/dx-refactor-discover` scan the codebase, surface a short list of
**design problems worth fixing**, and promote the ones you pick into real work. By the end you will have
seen both branches: promoting **one** finding into a `type: refactor` change, and promoting **many**
into an effort. You will use the running example `config-loader` — a wide pass-through wrapper that is
a textbook shallow module. No prior dx- experience is needed.

The key idea: refactoring is **not a separate workflow**. A refactor flows through the exact same
change lifecycle as a feature — it just carries `type: refactor`, which flips on a behavior-preserving
gate. This skill only *discovers and hands off*; it never plans or edits code. And its findings are
**ephemeral** — there is no debt register, no report file. Anything you don't promote or record as a
lesson leaves no trace. See [efforts and changes](../explanation/efforts-and-changes.md) for the model
the promoted work lands in.

## Prerequisites

- The dx- skills are installed (via `skills.sh`).
- You have a project to work in, opened in Claude Code, with some real code to scan.
- You have already run `/dx-init` on it, so the `context/` scaffold exists. If not, do the
  [initialize a project](./initialize-a-project.md) tutorial first — it takes a minute.

If `context/` isn't scaffolded (no `changes/` or `efforts/`), the skill stops and tells you to run
`/dx-init`. A glossary and lessons help but aren't required; the skill uses them if they exist.

## Step 1 — Scan for opportunities

Run the skill with no argument to sweep the whole tree, or scope it to a path to keep the scan tight:

```text
/dx-refactor-discover src/config
```

> **dx-refactor-discover** starts with no concrete target. First it loads its vocabulary — it invokes
> `dx-references` with topic `module-design` so every finding is phrased in those terms (**deep vs
> shallow** modules, **seams**, **leverage and locality**, **adapters**, **dependency category**, the
> **deletion test**), not vague "component / service / boundary" talk — that reference's
> **rejected framings** list says which words stay out. It reads `foundation/glossary.md` for naming, and it reads
> `foundation/lessons.md` so it **skips anything a prior run already rejected** ("don't re-deepen X
> because Y").
>
> Then it loads a second reference, `design-lenses`, before scanning. Module depth is the primary lens
> but not the only one, and a problem nothing is looking for goes unfound — so this one names the
> principles to sweep for (SRP and the rest of SOLID, KISS, YAGNI, DRY, separation of concerns,
> coupling, orthogonality) with no definitions attached, because they don't need any.
>
> Then it fans out built-in `Explore` subagents to walk the scoped path, hunting for friction rather
> than running rigid heuristics — walking back a stretch of `git log --oneline` first, so the paths
> that keep changing get looked at hardest. To each suspect it applies the **deletion test**: *would
> deleting this module concentrate complexity, or just move it?* "Concentrates" is the signal for a
> real deepening opportunity. It looks for:
>
> - **shallow modules** — the interface is nearly as wide as the implementation behind it;
> - **pass-throughs / thin wrappers** — a layer that forwards calls and adds almost nothing;
> - **pure functions extracted only for testability** — while the real bug hides in how they're called;
> - **leaky seams** — boundaries that leak their internals to callers;
> - **what the wider lenses catch** — knowledge duplicated across modules, one module changing for two
>   unrelated reasons, coupling that makes a single edit ripple.

The two lenses do different jobs, and it's worth being clear which is which. `design-lenses` decides
what gets **found**; `module-design` decides how it gets **said**. Every finding is written in module
terms no matter which lens turned it up — you will see a single-responsibility problem reported as
"this module changes for two unrelated reasons; the seam belongs between them", never as "violates
SRP". A principle name is a diagnosis, and a diagnosis is not a win: it tells you the lens, not the
cost. It also keeps the handoff honest, since `/dx-plan` and `/dx-frame` downstream load
`module-design` and not `design-lenses`.

That `git log` read is a **prior, not a filter** — it decides what gets looked at first, not what is
allowed to be found. Recent churn is where a deepening pays back soonest, so it earns the first pass;
if the log turns out to be scattered with no clear hot spot, the skill widens the net instead.
Nothing is maintained for this — the ordering is derived from the log at run time.

Nothing is written to disk yet. The scan produces a set of candidate findings, which it presents
inline in the next step.

## Step 2 — Read the findings

The skill presents its findings **inline as markdown** — no HTML, no report file, no clipboard. A
concise numbered list, one tight entry per candidate. Crucially, it does **not** design interfaces
yet — that's a job for planning. Each entry gives you just enough to decide.

> **dx-refactor-discover** found three candidates and printed:
>
> **Refactor opportunities in `src/config`**
>
> **1. Deepen `config-loader`**  ·  `Strong`
> - **What & where** — `src/config/loader.ts`, `src/config/env.ts`, `src/config/paths.ts`
> - **Why it's shallow** — a wide pass-through wrapper: the public interface exposes nearly one method
>   per underlying call (`readEnv`, `readFile`, `resolvePath`, `parse`, `merge`…). Deleting `loader.ts`
>   would *concentrate* the config-assembly logic that's currently smeared across three files — the
>   deletion test says "yes."
> - **Shape: before → after** — 3 files + 5 exported steps → 1 module, 1 method
> - **Proposed deepening** — a single deep loader behind a narrow interface: `loadConfig(): Config`.
>   Callers stop orchestrating steps; the module owns the whole read-parse-merge pipeline.
>   Leverage: one interface replaces five learned at 14 call sites.
> - **Dependency category** — local-substitutable (reads the filesystem; the in-memory FS stand-in
>   already used elsewhere covers it), so the seam stays internal and no port is needed.
>
> **2. Collapse `retry-helpers`**  ·  `Worth exploring`
> - **What & where** — `src/net/retry.ts`, `src/net/backoff.ts`
> - **Why it's tangled** — two pure functions extracted only so they could be unit-tested, but the real
>   sequencing bug lives in the caller that wires them together, which no test covers.
> - **Shape: before → after** — 2 helpers + caller-side loop → 1 seam, 1 entry point
> - **Proposed deepening** — fold both into a single `withRetry(fn, policy)` seam that owns the loop, so
>   the tested surface is the behavior callers actually depend on. Locality: the sequencing bug now has
>   one place to live and one place to be tested.
> - **Dependency category** — in-process (pure computation plus a clock), so it's testable through the
>   new interface with no adapter.
>
> **3. Narrow the `Cache` seam**  ·  `Speculative`
> - **What & where** — `src/cache/index.ts`
> - **Why it's leaky** — the interface hands callers the raw store handle, so eviction logic leaks out.
> - **Shape: before → after** — store handle + 6 exports → 3 methods
> - **Proposed deepening** — hide the store; expose `get`/`set`/`invalidate` only. Lower confidence —
>   only two callers touch it today.
> - **Dependency category** — remote-but-owned (the store is a Redis you run), so the deepening needs a
>   port at the seam: real transport in prod, in-memory adapter in tests. Two adapters, so the seam is real.
>
> **Start with #1** — `config-loader` sits in the busiest part of the tree and needs no adapter work,
> so it pays back fastest; the `Cache` seam can wait until a second backend actually exists.
>
> Then it asks which you want to promote.

Each entry carries two axes that answer different questions. The **strength tag** — `Strong`,
`Worth exploring`, or `Speculative` — is *desirability*: how confident the scan is that the deepening
is worth doing. The **dependency category** — in-process, local-substitutable, remote-but-owned, or
true-external — is *feasibility*: whether the result can actually be tested once deepened, which is
where a refactor tends to stall. Note too that no entry says "cleaner code": every win is cashed out
into a concrete consequence in `module-design` terms, so it survives the handoff into a change.

Neither axis is a running order, which is why the list closes with a one-sentence **top pick**. A
`Strong` finding in a file nobody has touched in a year is worth less than a `Worth exploring` one in
a hot path, so the skill ends with a read rather than a menu. Here it picks `config-loader`, and
that's the one we'll drive from here.

---

## Step 3 — Design the pick twice (optional)

Once you've picked, the skill offers one more thing before promoting: exploring three or four
genuinely different interfaces for the candidate. It's opt-in — decline it and you go straight to
promotion. Take it when the right shape isn't obvious, because this is the moment the context is
freshest, and whatever you choose is carried into the change rather than re-derived by `/dx-plan`.

> **You:** yes, explore config-loader before promoting

> **dx-refactor-discover** first frames the problem space back to you — the constraints any new
> interface has to satisfy, the dependencies and their category, and a rough code sketch to make
> those constraints concrete. That sketch is an illustration, not a proposal.
>
> Then it **doesn't wait for your reply**. It spawns three built-in `Plan` subagents in parallel,
> each under a different forcing constraint, so you read and think while they work:
>
> ```text
> A. collapse to 1–3 entry points  — everything else pushed behind them
> B. move contract out of the       — into structure or config the caller
>    interface                        declares rather than calls
> C. split the seam by caller       — common and rare callers reach
>                                     different entry points
> ```
>
> A fourth, **ports & adapters**, is spawned only when the dependency category is *remote-but-owned*
> or *true-external* — `config-loader` is local-substitutable, so it isn't.

Notice what those constraints have in common: each names **where the seam goes**, not a value to
maximize. That distinction is load-bearing. "Minimize the interface" and "make the default case
trivial" sound like two different briefs, but on a module with one dominant caller they have the same
optimum — the smallest surface already *is* the best default case — and two agents hand you back the
same interface with a parameter renamed. Seam placements can't coincide that way.

Each agent also gets its own **technical brief** — file paths, coupling detail, dependency category,
what sits behind the seam — because a subagent starts cold. The structure is written in
`module-design` terms; the domain in `foundation/glossary.md` terms when the candidate has a domain at
all. Infrastructure and tooling often doesn't, and forcing glossary words onto a build script buys
nothing.

All three return the same five things, which is what makes them comparable: the **interface** (types,
methods, params — plus invariants, ordering and error modes), a **usage example** from the caller's
side, **what the implementation hides behind the seam**, the **dependency strategy and adapters**, and
the **trade-offs** — where leverage is high and where it's thin.

> **dx-refactor-discover** presents them one at a time, compares them on **depth, locality, and seam
> placement**, and closes:
>
> **I'd take A, with one thing borrowed from B** — a single `loadConfig(): Config` gives the best
> leverage per entry point, and B's idea of declaring the search path in config rather than passing it
> costs no extra interface. C's split entry points are a seam with one caller — indirection nobody
> uses yet.

If two of them come back as the same entry point with a policy toggled, you're told that plainly
rather than shown a padded list of three. That's the constraint failing to bite, and an honest two is
worth more than a third design that's really the first one again.

Two things can go wrong here, and both are handled rather than papered over. An agent that returns
nothing or comes back unusable is **dropped, not retried** — you're told plainly that fewer than three
came back, so you know how wide the comparison actually was. And if your reply to the framing
**contradicts** the constraints the briefs were built on, the in-flight sketches are discarded and the
agents re-spawned; reconciling designs built on a superseded framing produces a shape nobody chose.

Note what this step still doesn't do: it writes no `plan.md` and edits no code. It produces interface
*sketches* for one candidate you already chose. Designing across all five findings before you'd picked
would be the waste — which is why the scan itself stops at `Shape: before → after`.

Now the two branches. What you type next depends on whether you pick **one** finding or **many**.

---

## Branch A — Pick one → a `type: refactor` change

You decide `config-loader` is the single thing worth doing now.

> **You:** promote #1, config-loader

> **dx-refactor-discover** creates the change **directly** — this is its own deliverable, not a chain
> into `/dx-plan`. It invokes `dx-references` with `change-md` for the exact schema, writes
> `context/changes/config-loader/change.md` stamped `type: refactor`, and captures the finding as the
> change's seed research write-up (or `frame.md` if it reads more like a framing than research). Then
> it prints — and stops:
>
> ```text
> Change created: context/changes/config-loader/change.md   (type: refactor, seeded with the finding)
> Next: /dx-plan config-loader
> ```

The change record now on disk:

```yaml
---
change_id: config-loader
title: Deepen config-loader behind a narrow interface
type: refactor                # feature | defect | refactor | migration
effort: null
slice: null
status: new
created: 2026-07-11
updated: 2026-07-11
archived_at: null
---

## Notes
```

And the finding it captured, seeded so `/dx-plan` inherits the full context instead of a bare slug:

```markdown
# Research: config-loader is a shallow pass-through

**What & where** — src/config/loader.ts, env.ts, paths.ts.
**Why it's shallow** — wide pass-through wrapper; interface nearly as wide as the implementation.
Deletion test: removing loader.ts concentrates the read-parse-merge logic rather than moving it.
**Shape: before → after** — 3 files + 5 exported steps → 1 module, 1 method.
**Proposed deepening** — one deep `loadConfig(): Config` behind a narrow interface.
Leverage: one interface replaces five learned at 14 call sites.
**Dependency category** — local-substitutable; the seam stays internal, no port needed.
**Chosen interface (design-it-twice)** — `loadConfig(): Config`, one entry point; env resolution and
merge order are invariants of the module, not parameters. Defaults `NODE_ENV` for the common caller.
Rejected: extension hooks (a seam with one adapter — indirection nobody uses yet).
```

That `type: refactor` stamp is what makes this a refactor rather than a feature. When you run
`/dx-plan config-loader`, the type activates a **behavior-preserving gate**: the plan requires the
test suite green *before* and *after*, so the deepening can't silently change behavior. `/dx-plan` also
loads `module-design`, so the interview reasons about the new seam in the right vocabulary. See
[the plan and its slices](../explanation/plan-and-slices.md) for how that gate shapes the phases.

From here it is the **normal change lifecycle** — nothing about refactor work is special downstream.
Follow [ship a change](./ship-a-change.md) from its plan step onward: `/dx-plan` → optional
`/dx-plan-review` → `/dx-implement` → `/dx-impl-review` → `/dx-archive`.

---

## Branch B — Pick many → an effort

Instead, suppose you want to tackle **several** modules as a coordinated push. Decomposing into an
effort, a roadmap, and one child change per module is a multi-step flow owned by other skills — so the
skill does **not** fold all of that in here. But it won't make you re-type what you just picked. It
composes a **seed summary** — the full entry for each finding you promoted — and prints it as the
literal argument to hand to `/dx-new`, so the handoff carries the detail, not just a slug.

> **You:** promote #1 and #2

Because you picked more than one, the skill doesn't repeat Step 3's yes/no per finding. It asks a
single batched question first:

> **dx-refactor-discover:** sketch any of these before promoting? *none* / *all* / *specific ones* —
> recommending just #1, `config-loader` (it's the top pick, and its alternatives are the least obvious
> of the two).

> **You:** just #1

The skill runs Step 3's frame → spawn → compare → stop-and-ask once for `config-loader`, waits for
your reply, and only then — never before that reply lands — would it move on to a second selected
finding. Here there's only one to sketch, so it composes the seed summary next:
>
> ```text
> Next: /dx-new "<seed summary>"   →  /dx-roadmap <effort-id>
> ```
>
> where `<seed summary>` is:
>
> ```text
> ## Refactor opportunities (from /dx-refactor-discover)
> 1. **Deepen config-loader** — src/config/*
>    Why: wide pass-through wrapper; interface nearly as wide as implementation.
>         Leverage: one interface replaces five learned at 14 call sites
>    Shape: 3 files + 5 exported steps → 1 module, 1 method
>    Proposed: a single deep loader behind a narrow interface (Strong, local-substitutable)
>    Sketch: loadConfig(): Config — one entry point; merge order is an invariant, not a parameter
> 2. **Collapse retry-helpers** — src/net/retry.ts, backoff.ts
>    Why: pure functions extracted only for testability; the real bug is in the caller.
>         Locality: the sequencing bug gets one place to live and one place to be tested
>    Shape: 2 helpers + caller-side loop → 1 seam, 1 entry point
>    Proposed: one withRetry(fn, policy) seam that owns the loop (Worth exploring, in-process)
> Start with: config-loader — hottest path in the tree and no adapter work needed.
> ```

You then drive the handoff yourself. `/dx-new` recognizes the `## Refactor opportunities` heading, so
it doesn't slugify the whole blob as a short idea — it sizes the seed as an **effort**, writes
`context/efforts/<effort-id>/effort.md` with a `## Goal` citing the `Start with:` line and a `## Notes`
marker (`Refactor effort — findings promoted from /dx-refactor-discover.`), and then writes one
`research/<topic>.md` per numbered finding — provenance frontmatter plus that finding's full entry,
`Sketch:` line included only where Step 3 ran. It prints its own `Next:` pointing at `/dx-roadmap`.
`/dx-roadmap` turns those research files into roadmap slices — **one slice per module deepening** —
with no edit of its own, since it already reads "every `research/<topic>.md`" as candidate material.
Each slice's child change comes from `/dx-new <effort-id> <slice-n>`, which reads the effort's `## Notes`
marker and stamps `type: refactor` instead of the default `feature`, then inherits the whole
`research/` set — including sibling findings' files, not just its own. The `Start with:` line rides
along for `/dx-roadmap`'s sequencing: it has to put the slices in some order, and which one goes first
is the one judgement it can't re-derive from the findings. See [run an effort](./run-an-effort.md) for
that full flow.

The skill printed the commands and **stopped**. It never ran `/dx-new` for you — no dx- skill
auto-chains.

---

## Step 4 — Record a "no" so the next run skips it

Not every candidate should be deepened, and some *shouldn't be re-suggested ever*. If you reject a
finding with a **load-bearing reason** — the module is shallow *on purpose* — the skill offers to
record it as a lesson, so the next scan skips it instead of resurfacing it.

Say you reject #3, the `Cache` seam, because that thinness is deliberate:

> **You:** skip #3 — the Cache seam is intentionally thin; we swap the backing store there.

> **dx-refactor-discover** recognizes that as a load-bearing reason (not just an ephemeral "not now")
> and offers:
>
> ```text
> /dx-lesson                (don't re-deepen X because Y)
> ```

Running `/dx-lesson` records "don't re-deepen `Cache` — shallow on purpose; we swap backends there" in
`foundation/lessons.md`. Because Step 1 reads that file at the start of every scan, the next
`/dx-refactor-discover` run will skip `Cache` automatically. A rejection *without* a durable reason —
"not now" — leaves no trace, exactly like an unpromoted finding. See
[the knowledge layer](../explanation/knowledge-layer.md) for how lessons feed back into future runs.

## What you built

Which artifacts exist on disk depends on the branch you took — the scan itself writes nothing:

- **Branch A (pick one):** `context/changes/config-loader/change.md` at `status: new`, stamped
  `type: refactor`, plus a seeded `research/…md` (or `frame.md`) carrying the finding — and, if you
  took Step 3, the chosen interface sketch alongside it. Ready for `/dx-plan config-loader`.
- **Branch B (pick many):** nothing yet — you were handed a seed-summary argument to paste into
  `/dx-new`, which creates the effort, its `## Notes` refactor-effort marker, and one
  `research/<topic>.md` per finding. The roadmap slices and child changes appear only once you run
  `/dx-roadmap` and `/dx-new <effort-id> <slice-n>`.
- **Either branch, if you recorded a no:** one new entry in `foundation/lessons.md` that keeps future
  scans from re-suggesting the rejected module.

The findings list itself is gone — ephemeral by design. Only what you promoted or recorded persists.

## Where to next

- [Ship a change](./ship-a-change.md) — Branch A's `config-loader` change now rides the normal
  lifecycle; this is the end-to-end walkthrough of it, from plan to archive.
- [Run an effort](./run-an-effort.md) — Branch B's multi-module push, decomposed into roadmap slices
  that each spawn a child refactor change.

## Related

- [Efforts and changes](../explanation/efforts-and-changes.md) — the two-level model both branches feed
  into; why a refactor is just a change with a different `type`.
- [The plan and its slices](../explanation/plan-and-slices.md) — how `type: refactor` activates the
  behavior-preserving gate and loads module-design in the plan.
- [The knowledge layer](../explanation/knowledge-layer.md) — how a recorded lesson stops the next scan
  from re-suggesting a rejected module.
- [Diagnose a bug](./diagnose-a-bug.md) — the other discovery entry point: `/dx-diagnose` self-contains
  its promotion into a `type: defect` change, the same way this skill promotes a refactor.
