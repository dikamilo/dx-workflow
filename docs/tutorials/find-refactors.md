# Find refactoring opportunities with dx-refactor-discover

In this tutorial you will start with **no concrete target** — just "find me some refactor
opportunities" — and let `/dx-refactor-discover` scan the codebase, surface a short list of
**deepening opportunities**, and promote the ones you pick into real work. By the end you will have
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
> Then it fans out built-in `Explore` subagents to walk the scoped path, hunting for friction rather
> than running rigid heuristics. To each suspect it applies the **deletion test**: *would deleting this
> module concentrate complexity, or just move it?* "Concentrates" is the signal for a real deepening
> opportunity. It looks for:
>
> - **shallow modules** — the interface is nearly as wide as the implementation behind it;
> - **pass-throughs / thin wrappers** — a layer that forwards calls and adds almost nothing;
> - **pure functions extracted only for testability** — while the real bug hides in how they're called;
> - **leaky seams** — boundaries that leak their internals to callers.

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
> Then it asks which you want to promote.

Each entry carries two axes that answer different questions. The **strength tag** — `Strong`,
`Worth exploring`, or `Speculative` — is *desirability*: how confident the scan is that the deepening
is worth doing. The **dependency category** — in-process, local-substitutable, remote-but-owned, or
true-external — is *feasibility*: whether the result can actually be tested once deepened, which is
where a refactor tends to stall. Note too that no entry says "cleaner code": every win is cashed out
into a concrete consequence in `module-design` terms, so it survives the handoff into a change.
`config-loader` is the clear `Strong` one, and it's the one we'll drive from here.

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

> **dx-refactor-discover** composes the seed summary from the two findings and prints — then stops:
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
> 2. **Collapse retry-helpers** — src/net/retry.ts, backoff.ts
>    Why: pure functions extracted only for testability; the real bug is in the caller.
>         Locality: the sequencing bug gets one place to live and one place to be tested
>    Shape: 2 helpers + caller-side loop → 1 seam, 1 entry point
>    Proposed: one withRetry(fn, policy) seam that owns the loop (Worth exploring, in-process)
> ```

You then drive the handoff yourself. `/dx-new` sizes that seed as an **effort** (it's large and
branching), writes `context/efforts/<effort-id>/effort.md`, and prints its own `Next:` pointing at
`/dx-roadmap`. `/dx-roadmap` turns the numbered candidates into roadmap slices — **one slice per
module deepening** — and each slice spawns a child `type: refactor` change that inherits the effort's
frame. See [run an effort](./run-an-effort.md) for that full flow.

The skill printed the commands and **stopped**. It never ran `/dx-new` for you — no dx- skill
auto-chains.

---

## Step 3 — Record a "no" so the next run skips it

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
  `type: refactor`, plus a seeded `research/…md` (or `frame.md`) carrying the finding. Ready for
  `/dx-plan config-loader`.
- **Branch B (pick many):** nothing yet — you were handed a seed-summary argument to paste into
  `/dx-new`, which creates the effort. The effort and its roadmap slices appear only once you run those
  commands.
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
