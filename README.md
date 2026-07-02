# dx — a software-development workflow

A lean, file-derived software-development workflow shipped as a set of **skills** under the `dx-` prefix. No dedicated agents, no orchestrators, no dashboards — the user is the workflow engine; each skill does one job, writes markdown to `context/`, prints the suggested next command, and stops.

Built around a few core decisions: file-derived state (`context/`, `change.md`, the `## Progress` contract), a standards layer with a docs-vs-work split and never-auto-rollback safety, and a domain glossary with feedback-loop-first debugging and terse skill-authoring discipline. See `DESIGN.md` for the full rationale.

## Install

Per skill via the [skills CLI](https://www.skills.sh):

```
npx skills add <owner>/<repo>/dx-init
```

Or install the whole set at once with the bundled scripts (via `npx skills`):

```
npm run install-skills   # install every dx- skill globally for Claude Code
npm run list-skills      # list the skills in this repo
```

Then, in any project: run `/dx-init` once to scaffold `context/`, and `/dx-new <idea>` to start work.

## The model

Two container levels under `context/`, never nested:

- **change** — one shippable unit. Identity `change.md`; plan `plan.md` (owns `## Progress`).
- **effort** — larger work that decomposes into vertical slices, each spawning a child change. Identity `effort.md`; decomposition `roadmap.md`.

`dx-new` is the router that picks the level. Everything else hangs off these two.

## Skills

### User-invoked (typed as `/dx-…`)

| Skill | Purpose |
|---|---|
| `dx-init` | Scaffold `context/` and seed the baseline standards. |
| `dx-new` | Router: create a change or an effort; point at the next step. |
| `dx-research` | Research one topic → `research/<topic>.md` (codebase via `Explore`, or external via web). |
| `dx-frame` | Deep interview on problem framing + alternatives → `frame.md`. |
| `dx-plan` | Upstream-aware interview → `plan.md`; matches standards, surfaces priors, owns `## Progress`. |
| `dx-plan-review` | Optional pre-implementation gate (report-only). |
| `dx-implement` | Execute one plan phase, verify, commit; writes shared `## Progress`. |
| `dx-tdd` | Red-green sibling of implement; same `## Progress`, vertical slices. |
| `dx-impl-review` | Post-implementation gate: drift + safety + patterns + standards; offers to record a lesson. |
| `dx-review-triage` | Triage a plan-review/impl-review report's findings and apply the fixes you choose. |
| `dx-roadmap` | Effort-level: decompose into vertical slices → child changes. |
| `dx-refactor-discover` | Scan for deepening opportunities; promote a selection to a change or effort. |
| `dx-standards-discover` | Mine standards from config + code + docs → `context/standards/`. |
| `dx-standards-update` | Create/edit/promote standards (incl. a graduated lesson). |
| `dx-domain-discover` | Brownfield glossary bootstrap from identifiers/docs. |
| `dx-lesson` | Capture one finding → `foundation/lessons.md`. |
| `dx-archive` | Move a change or effort → `context/archive/<date>-<id>/`. |

### Model-invoked (fire automatically on triggers)

| Skill | Fires when |
|---|---|
| `dx-diagnose` | Something is broken / slow / throwing / failing — feedback-loop-first diagnosis; promotes non-trivial fixes to a `defect` change. |
| `dx-domain` | A term clashes, is fuzzy, or gets resolved mid-work — sharpens `foundation/glossary.md`. |

### Plumbing

| Skill | Purpose |
|---|---|
| `dx-references` | Loader (hidden from the `/` menu). Other skills invoke it with a topic to pull shared reference docs. |

## Conventions

- **State is markdown**, never a sidecar file. Lists come from `ls`; status from frontmatter; effort progress from child changes.
- **No auto-chain.** A skill prints the next command and stops — you decide what runs.
- **Never auto-rollback** on failure. `dx-init` writes this principle into the project's `CLAUDE.md`.
