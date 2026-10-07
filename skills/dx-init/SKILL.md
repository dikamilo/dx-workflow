---
name: dx-init
description: Scaffold the dx- SDLC state tree (context/) in this project and seed the baseline standards and review Policies.
disable-model-invocation: true
---

# dx-init

Set up the `context/` tree the dx- workflow reads and writes. **Idempotent by contract:** create what's missing, never touch what exists. Re-running is safe.

## Scaffold

Create (only if absent) under `context/`:

```
foundation/    glossary.md, lessons.md, research/
standards/     global/, frontend/, backend/, testing/
efforts/  changes/  archive/
config/        review-policies/, templates/
```

- **Standards:** decide first whether `context/standards/` existed before this run.
  - **Absent (fresh context):** seed the three global standards by copying `${CLAUDE_SKILL_DIR}/assets/standards/global/*.md` into `context/standards/global/`.
  - **Present:** copy nothing — a project removes and replaces the shipped standards, and re-seeding resurrects what it deleted. List the shipped standards that aren't in `context/standards/global/` and ask which, if any, to copy. Copy only the ones the user names; never overwrite an existing file.
- **Seed the review Policies and templates** by copying `${CLAUDE_SKILL_DIR}/assets/config/` into `context/config/` (`review-policies/*.md` and `templates/*.md`), missing files only. They are user-owned from then on: `/dx-review` reads them, and a project may edit or add to them.
- `standards/{frontend,backend,testing}/` ship **empty** — `dx-standards-discover` fills them per-project from the real codebase.
- `foundation/glossary.md` and `foundation/lessons.md` get a one-line header each and nothing more (e.g. `# Glossary — ubiquitous language for this project` / `# Lessons — accrued warnings and load-bearing decisions (append-only)`). They stay empty; `dx-domain-discover` and `dx-lesson` fill them.

## Agent instructions file

Write to the project's root `AGENTS.md` when it exists and `CLAUDE.md` is absent or holds only a pointer to it (e.g. `@AGENTS.md`); otherwise write to `CLAUDE.md`, creating it if absent. Keep everything dx- owns inside one managed block, so later injections edit only that block and the rest of the file stays the user's:

```markdown
<!-- dx:workflow:start -->
This project uses the dx- SDLC framework; workflow state lives under `context/`.
<!-- dx:workflow:end -->
```

No block yet: append it. Block present: replace its contents in place, never add a second one.

## .gitignore

Ensure the project's `.gitignore` lists `.worktrees/` — where `/dx-implement` auto mode keeps its worktrees. Create the file if absent, else append the line if missing; never duplicate an existing entry.

## Done when

The tree above exists, the review Policy and template files are in place, the global standards are seeded (fresh context) or the user was asked about additions (existing context), the agent instructions file carries the managed `dx:workflow` block, and `.gitignore` ignores `.worktrees/`. Print a short created/present status per artifact, listing each review Policy and template file and the `.gitignore` entry, then:

```
Next: /dx-new <idea>   — create a change or effort and start the workflow.
```

Stop. Do not chain into another skill.
