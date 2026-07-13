# Initialize a project with dx-

In this tutorial you will run `/dx-init` once against a real repo and watch it lay down the
`context/` state tree that every other dx- skill reads and writes. By the end you will have the five
workflow folders on disk, three seeded global standards, empty knowledge files ready to fill, and a
root `CLAUDE.md` that carries the workflow's safety principle — plus your very first work item.
No prior dx- experience needed.

## Prerequisites

- The dx- skills installed in Claude Code — see [the skills reference](../reference/skills.md) for the
  full list and how they install.
- A project or repository to work in. Any language, greenfield or brownfield — dx- keeps its state in a
  single `context/` folder and does not touch your source.
- Claude Code open with that project as the working directory.

That's it. `/dx-init` is the entry point, so there is nothing to run before it.

## Step 1 — Scaffold the workflow with `/dx-init`

Open Claude Code in your project and run:

```text
/dx-init
```

> **dx-init** scaffolds the `context/` tree and reports created-or-present per artifact. It is
> idempotent by contract — *create what's missing, never touch what exists* — so it is always safe to
> re-run. On a fresh repo it prints something like:
>
> ```text
> context/foundation/                     created
> context/foundation/glossary.md          created
> context/foundation/lessons.md           created
> context/foundation/research/            created
> context/standards/global/               created
> context/standards/global/coding-style.md            created
> context/standards/global/minimal-implementation.md  created
> context/standards/global/conventions.md             created
> context/standards/frontend/             created (empty)
> context/standards/backend/              created (empty)
> context/standards/testing/              created (empty)
> context/efforts/                        created
> context/changes/                        created
> context/archive/                        created
> CLAUDE.md                               updated (rollback principle added)
> ```
>
> It creates the five top-level folders (`foundation/`, `standards/`, `efforts/`, `changes/`,
> `archive/`), seeds the three global standards by copying its bundled assets, leaves
> `standards/{frontend,backend,testing}/` empty for `/dx-standards-discover` to fill, and writes a
> one-line header into each of `foundation/glossary.md` and `foundation/lessons.md`. It also ensures
> the root `CLAUDE.md` states the **user-confirmed rollback** principle: on failure, never
> auto-rollback — stop, analyze the root cause, and ask before reverting anything. Then it stops and
> prints:
>
> ```text
> Next: /dx-new <idea>   — create a change or effort and start the workflow.
> ```

dx- skills never auto-chain. Each does one job, prints a `Next:` line, and stops — you decide what
runs next. Re-running `/dx-init` now would report every artifact as `present` and change nothing.

## Step 2 — Inspect what was created

Look at the tree `/dx-init` left behind. This is the **per-project scaffold** — the state every other
skill reads and writes:

```text
context/
├── foundation/
│   ├── glossary.md          # ubiquitous language (header only for now)
│   ├── lessons.md           # accrued warnings (header only for now)
│   └── research/            # deep-dive notes land here later
├── standards/
│   ├── global/              # seeded: coding-style, minimal-implementation, conventions
│   ├── frontend/            # empty
│   ├── backend/             # empty
│   └── testing/             # empty
├── efforts/                 # large, multi-slice work
├── changes/                 # single shippable units
└── archive/                 # finished work moves here
```

For the full walk-through of what each folder is for, see
[the directory layout explanation](../explanation/directory-layout.md).

Open one of the seeded standards — it has **real content**, not a placeholder:

```text
context/standards/global/coding-style.md
```

> ```markdown
> # Coding Style
>
> Global, language-agnostic style rules. Language- or layer-specific rules live under
> `frontend/`, `backend/`, `testing/` (filled by `dx-standards-discover`).
>
> ## Naming consistency
> Follow the naming patterns already established in the codebase for variables, functions,
> types, and files. Consistency beats personal preference.
>
> ## Descriptive names
> Names state intent. Avoid cryptic abbreviations and single-letter identifiers outside
> tight loops. A reader should not need the definition to know what a name means.
> …
> ```

Now open the glossary — it is deliberately **just a header**, waiting to be filled:

```text
context/foundation/glossary.md
```

> ```markdown
> # Glossary — ubiquitous language for this project
> ```

`foundation/lessons.md` is the same: a single header line
(`# Lessons — accrued warnings and load-bearing decisions (append-only)`) and nothing else. These
knowledge files grow as you work; `/dx-init` only stamps the header so later skills have a target.

## Step 3 — (Brownfield) seed standards and domain language

If you ran `/dx-init` against an **existing** codebase, two discovery skills are the natural next move.
They mine your real code so later planning and review have project-specific context to match against.
You don't have to run them now, but they pay off early:

```text
/dx-standards-discover
```

> Mines your codebase for the conventions it already follows and writes them into
> `context/standards/frontend/`, `backend/`, and `testing/`. Walk through it in
> [Build your standards](build-standards.md).

```text
/dx-domain-discover
```

> Reads your code and docs to seed `context/foundation/glossary.md` with the project's real terms.
> Walk through it in [Build your domain language](build-domain-language.md).

On a greenfield project you can skip both — the empty files fill in naturally as you ship work and
capture terms with `/dx-domain`.

## Step 4 — Create your first work item with `/dx-new`

With the scaffold in place, start real work. `/dx-new` routes your idea to either a small **change** or
a larger **effort** — see [efforts and changes](../explanation/efforts-and-changes.md) for the
distinction. A single sign-in feature is change-sized:

```text
/dx-new "add google sign-in"
```

> **dx-new** sizes the idea as a single shippable change, derives the id `oauth-login`, scaffolds
> `context/changes/oauth-login/` with a `change.md` at `status: new`
> (`title: "Add Google sign-in"`, `type: feature`), and prints:
>
> ```text
> Next: /dx-research oauth-login <topic>   → /dx-frame oauth-login   → /dx-plan oauth-login
>   (both optional — small/clear work can go straight to /dx-plan oauth-login)
> ```

That's the whole handoff: `/dx-init` set up the workspace, `/dx-new` opened your first change. The full
change lifecycle — research, frame, plan, implement, review, archive — is its own tutorial, linked
below.

## What you built

After this session your project has, on disk:

- `context/` with its five top folders: `foundation/`, `standards/`, `efforts/`, `changes/`,
  `archive/`.
- Three seeded global standards with real content: `context/standards/global/coding-style.md`,
  `minimal-implementation.md`, and `conventions.md`.
- Empty `standards/{frontend,backend,testing}/` folders, ready for `/dx-standards-discover`.
- Header-only knowledge files: `context/foundation/glossary.md` and `context/foundation/lessons.md`.
- A root `CLAUDE.md` carrying the user-confirmed rollback principle and a pointer to the dx- workflow.
- Your first change scaffolded at `context/changes/oauth-login/` (`status: new`).

## Where to next

- [Ship a change](ship-a-change.md) — take `oauth-login` through the full lifecycle to archived. This
  is the natural next tutorial.
- [Build your standards](build-standards.md) — fill the empty `frontend/`, `backend/`, and `testing/`
  standards from your real codebase.
- [Build your domain language](build-domain-language.md) — seed and sharpen
  `context/foundation/glossary.md`.

## Related

- [Skills reference](../reference/skills.md) — every dx- command at a glance, including `/dx-init`.
- [Directory layout](../explanation/directory-layout.md) — what each folder under `context/` is for.
- [Efforts and changes](../explanation/efforts-and-changes.md) — how `/dx-new` decides which one you
  need.
- [Knowledge layer](../explanation/knowledge-layer.md) — how standards, glossary, and lessons feed
  every later skill.
