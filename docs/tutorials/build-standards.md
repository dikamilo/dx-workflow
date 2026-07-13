# Build and maintain your standards

In this tutorial you will turn your project's real conventions into a **standards** catalog — the
rulebook dx- matches into every plan and verifies in every review. You will seed it from your existing
codebase in one command, watch a plan pick the relevant rules up, add a rule by hand, and learn the one
loop that keeps the catalog honest over time: a recurring lesson graduating into a standard. By the end
you will have populated `frontend/`, `backend/`, and `testing/` standards on disk. No prior dx-
experience needed beyond a project that has been initialized.

Standards are the project's rulebook. `/dx-init` seeds three **global** files with real content —
`context/standards/global/coding-style.md`, `minimal-implementation.md`, and `conventions.md` — but it
ships the `frontend/`, `backend/`, and `testing/` folders **empty**. Those are yours to fill from what
your code actually does. For the concepts behind standards (and how they differ from lessons and the
glossary), see [the knowledge layer](../explanation/knowledge-layer.md).

## Prerequisites

- The dx- skills installed in your project.
- A codebase with some real code and config to mine — a linter/formatter config, a `tsconfig`, CI, or a
  few components and tests. Standards are *evidenced*, so an empty repo has nothing to discover yet.
- `/dx-init` already run, so `context/standards/{global,frontend,backend,testing}/` exists. If you
  haven't, do [Initialize a project](initialize-a-project.md) first.

## Step 1 — Discover standards from your codebase

Run the discovery skill with no arguments. It mines the working tree.

```text
/dx-standards-discover
```

> **dx-standards-discover** first reads the sources that already *encode* rules — the linter and
> formatter configs, `tsconfig`/compiler settings, CI workflows, pre-commit hooks, `package.json` scripts,
> `.editorconfig` — because a rule in a linter config is enforced, not wished-for. Then it fans out one
> built-in `Explore` subagent per layer (frontend, backend, testing) to find the patterns that actually
> **recur** across the code:
>
> > A convention counts only when it recurs across several files; one example is not a standard.
>
> It groups the findings by layer and topic into concise, prescriptive files — a `##` per rule, "do
> this" phrasing — and writes them under `context/standards/`. It never touches `global/` (that was
> seeded by `/dx-init`), and where a config and the code disagree it follows the enforced config and
> flags the drift as a lesson candidate rather than averaging the two. Then it prints:
>
> ```text
> Standards discovered: 5 files under context/standards/
> Next: /dx-plan <id>   — planning now matches these standards into the plan.
> ```

Open one of the generated files. `context/standards/frontend/components.md` might read:

```markdown
# Components

## One component per file, named for the file
Every component lives in its own file under `src/components/`, and the exported
name matches the filename (`UserCard.tsx` exports `UserCard`). Matches the
existing `components/` tree.

## Props typed, no implicit any
Every component takes a typed `Props` interface. `tsconfig` has `strict: true`
and `noImplicitAny` — untyped props fail the build.

## Data fetching stays out of components
Components render props and local state. Server calls go through hooks in
`src/hooks/` (`useUser`, `useOrders`), never inline in the component body.

## Styling via CSS modules
Import a co-located `*.module.css`; no inline `style` objects. Every existing
component follows this.
```

Each rule traces to something the agent saw — a config setting or a pattern that recurred. Nothing
aspirational lands. You now have real `frontend/`, `backend/`, and `testing/` standards where `/dx-init`
left empty folders.

## Step 2 — See how standards get used

Standards are not documentation you re-read by hand — they are matched into work automatically. The next
time you plan a change, they show up in the plan.

```text
/dx-plan oauth-login
```

> **dx-plan** matches the standards catalog against this change by **domain × topic** and grows a
> `## Standards to apply` checklist in `context/changes/oauth-login/plan.md` — for a login feature that
> pulls the relevant `frontend/` and `backend/` rules, not the whole catalog. `/dx-implement` then follows
> that checklist as it writes code, and `/dx-impl-review` verifies the finished work against it.

That is the payoff of Step 1: every rule you discovered now rides along into planning, implementation, and
review without you quoting it. For how a plan is assembled and how slices inherit it, see
[plans and slices](../explanation/plan-and-slices.md).

## Step 3 — Add a rule by hand

You don't have to wait for discovery to run again. When a rule comes up in conversation, promote it on the
spot with `/dx-standards-update`. The most common entry point is "from the conversation" — you tell the
agent the rule in plain words.

```text
/dx-standards-update
```

> **You:** Make it a standard that all API handlers validate input with zod.
>
> **dx-standards-update** loads the knowledge-layer contract to confirm this belongs in standards, not
> lessons — the test is whether the rule is *recurring and generalized* rather than a one-off (a one-off
> stays a lesson). This is a project-wide "how we do it," so it qualifies. It places the rule by
> **layer × topic** — backend, input handling — and finds the existing `context/standards/backend/api.md`
> rather than creating a new file. Standards are a catalog, so it edits **in place**, adding a heading:
>
> ```markdown
> ## Input validation
> Every API handler validates its input with a zod schema at the top of the
> handler, before any business logic. Parse, don't hand-check — reject on the
> schema's error, never trust the raw request body.
> ```
>
> Then it prints:
>
> ```text
> Standard updated: context/standards/backend/api.md — added zod input-validation rule for all handlers
> Next: /dx-plan <change-id>   — the checklist will now match this standard
> ```

From now on any plan that touches an API handler pulls this rule into its `## Standards to apply`
checklist. One prescriptive heading, edited into the right file — no append-only log, no ceremony.

## Step 4 — Promote a recurring lesson into a standard

This is the maintenance loop that keeps standards alive. A **lesson** in `foundation/lessons.md` records
something that happened once — a scar, a decision. Most lessons stay lessons. But when the same lesson
keeps recurring, it has stopped being "this one time" and become "how we do it here." That is the moment
it graduates into a standard — and **lesson → standard is the only promotion path in dx-.**

Say `foundation/lessons.md` has an entry that keeps biting you:

```markdown
## 2026-05-02 — Timeouts must be explicit on outbound calls
A background job hung for 40 minutes because an outbound HTTP call had no
timeout. Set an explicit timeout on every external call.
(Recurred again 2026-06-18 in the webhook retry path.)
```

Run the update skill, pointing it at that graduated lesson:

```text
/dx-standards-update
```

> **You:** The explicit-timeout lesson in `foundation/lessons.md` keeps recurring — promote it to a
> standard.
>
> **dx-standards-update** reads the lesson, confirms via the knowledge-layer contract that it is now
> recurring and generalized, and carries its rule forward into `context/standards/backend/` under a
> prescriptive heading:
>
> ```markdown
> ## Explicit timeouts on every outbound call
> Every external HTTP or network call sets an explicit timeout. No call inherits
> an unbounded default.
> ```
>
> Because lessons are **append-only**, it does not delete the original entry — it adds a one-line note
> that the lesson graduated, so the history stays intact:
>
> ```markdown
> (Graduated → context/standards/backend/api.md on 2026-07-11.)
> ```
>
> Then it prints:
>
> ```text
> Standard updated: context/standards/backend/api.md — promoted recurring timeout lesson to a standard
> Next: /dx-plan <change-id>   — the checklist will now match this standard
> ```

Lessons are where knowledge is *born* — `/dx-lesson` records them, and reviews and diagnosis surface them
(see [Review and triage](review-and-triage.md) and [Diagnose a bug](diagnose-a-bug.md)). Standards are
where the durable ones *settle*. Note that this promotion path is only for lessons: growing the glossary is
a separate activity covered in [Build your domain language](build-domain-language.md), not a promotion into
standards. For the full picture of how the three knowledge artifacts relate, read
[the knowledge layer](../explanation/knowledge-layer.md).

## What you built

On disk you now have:

- Discovered standards under `context/standards/frontend/`, `backend/`, and `testing/` — grouped files
  like `frontend/components.md`, `backend/api.md`, and `testing/test-writing.md`, each tracing to real
  config or a recurring pattern.
- The seeded `context/standards/global/` files left untouched by discovery.
- A hand-added rule (`## Input validation` in `context/standards/backend/api.md`), edited in place.
- A promoted rule graduated from `foundation/lessons.md`, with the original lesson entry marked as
  graduated.

Every one of these is matched by domain × topic into future plans and checked in review — automatically.

## Where to next

- [Build your domain language](build-domain-language.md) — do the same seed-then-grow move for
  `foundation/glossary.md`, the project's shared vocabulary.
- [Ship a change](ship-a-change.md) — take `oauth-login` through the lifecycle and watch the
  `## Standards to apply` checklist drive implementation and review.
- [Review and triage](review-and-triage.md) — where reviews surface new lessons, some of which will
  later graduate here.

## Related

- [Knowledge layer](../explanation/knowledge-layer.md) — why standards, lessons, and the glossary are
  three separate artifacts, and how each feeds a change.
- [Plans and slices](../explanation/plan-and-slices.md) — how a plan matches standards into its
  `## Standards to apply` checklist.
- [Skills reference](../reference/skills.md) — `/dx-standards-discover`, `/dx-standards-update`, and
  `/dx-lesson` at a glance.
- [Initialize a project](initialize-a-project.md) — the `/dx-init` step that seeds `global/` and leaves
  the other layers empty for you to fill.
