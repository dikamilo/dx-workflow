---
name: dx-init
description: Scaffold the dx- SDLC state tree (context/) in this project and seed the baseline standards.
disable-model-invocation: true
effort: low
---

# dx-init

Set up the `context/` tree the dx- workflow reads and writes. **Idempotent by contract:** create what's missing, never touch what exists. Re-running is safe.

## Scaffold

Create (only if absent) under `context/`:

```
foundation/    glossary.md, lessons.md, research/
standards/     global/, frontend/, backend/, testing/
efforts/  changes/  archive/
```

- **Seed the three global standards** by copying `${CLAUDE_SKILL_DIR}/assets/standards/global/*.md` into `context/standards/global/`. If a target file already exists, leave it — a project may have edited it.
- `standards/{frontend,backend,testing}/` ship **empty** — `dx-standards-discover` fills them per-project from the real codebase.
- `foundation/glossary.md` and `foundation/lessons.md` get a one-line header each and nothing more (e.g. `# Glossary — ubiquitous language for this project` / `# Lessons — accrued warnings and load-bearing decisions (append-only)`). They stay empty; `dx-domain-discover` and `dx-lesson` fill them.

## Root CLAUDE.md

Ensure the project's root `CLAUDE.md` (create if absent, else append a short section — don't duplicate if already present) states:

- **User-confirmed rollback:** on failure, never auto-rollback or revert. Stop, analyze the root cause, and ask the user before reverting anything — most failures are simple fixes and auto-rollback discards valid work and hides causes.
- A one-line pointer: this project uses the dx- SDLC framework; workflow state lives under `context/`.

## Done when

The tree above exists, the three global standards are in place, and root `CLAUDE.md` carries the rollback principle. Print a short created/present status per artifact, then:

```
Next: /dx-new <idea>   — create a change or effort and start the workflow.
```

Stop. Do not chain into another skill.
