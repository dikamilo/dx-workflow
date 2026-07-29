# dx — a software-development workflow

A lean, file-derived software-development workflow shipped as a set of **skills** under the `dx-` prefix (`dx` for *developer experience* — it's just the naming prefix for this skill set, not a product name). No dedicated agents, no orchestrators, no dashboards — the user is the workflow engine; each skill does one job, writes markdown to `context/`, prints the suggested next command, and stops.

Built around a few core decisions: file-derived state (`context/`, `change.md`, the `## Progress` contract), a standards layer with a docs-vs-work split and never-auto-rollback safety, and a domain glossary with feedback-loop-first debugging and terse skill-authoring discipline. See `DESIGN.md` for the full rationale.

## Documentation

**Start at [`docs/README.md`](docs/README.md)** — the entry point for tutorials, explanations, and reference.

- **New here?** [Understanding the dx- workflow](docs/explanation/workflow-overview.md) → [Initialize a project](docs/tutorials/initialize-a-project.md) → [Ship your first change](docs/tutorials/ship-a-change.md)
- **Look something up:** [Skill reference](docs/reference/skills.md) · [Glossary](docs/reference/glossary.md)
- **Working *on* the skills, not just using them:** [`DESIGN.md`](DESIGN.md)

## Install

Via the [skills CLI](https://www.skills.sh):

```
npx skills add <owner>/<repo>/          # Interactively select skills
npx skills add <owner>/<repo>/dx-init   # Install a single skill
```

Or install the whole set at once with the bundled scripts (via `npx skills`):

```
npm run install-skills   # install every dx- skill globally for Claude Code
npm run list-skills      # list the skills in this repo
```

Then, in any project: run `/dx-init` once to scaffold `context/`, and `/dx-new <idea>` to start work.

## Contributing

PRs that touch `skills/` must include a changeset: run `npx changeset`, pick a bump type, write a summary, and commit the generated `.changeset/*.md` file alongside your change. CI checks for this on every PR touching `skills/` and fails if it's missing. Changes to `docs/` or other non-`skills/` paths (docs aren't installed via the CLI) don't need one.
