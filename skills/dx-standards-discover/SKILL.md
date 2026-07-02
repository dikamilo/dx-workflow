---
name: dx-standards-discover
description: Mine the project's real conventions from tooling, code, and docs and write them into the standards layer.
disable-model-invocation: true
argument-hint: [--from=PATH]
---

# dx-standards-discover

Mine this project's **actual** conventions — from tooling, recurring code, and existing docs — and write them as prescriptive standard files under `context/standards/`. Record only what the codebase genuinely evidences: no inherited opinions, no aspirational rules. This fills the `frontend/`, `backend/`, `testing/` layers `dx-init` left empty.

**Guard.** `context/standards/{frontend,backend,testing}/` must exist. If it is missing, tell the user to run `/dx-init` first. Never overwrite `global/` — `dx-init` seeded it; only *append* a global file if a genuinely new project-wide rule surfaces that none of the seeds cover. With `--from=PATH`, mine that external codebase instead of the working tree.

## 1 — Read the fixed sources
Read the config that already encodes rules: linter + formatter configs, `tsconfig`/compiler settings, CI workflows, pre-commit hooks, `package.json`/build scripts, `.editorconfig`. Then read `README`s and any `docs/` that state conventions. These are the strongest evidence — a rule in a linter config is enforced, not wished-for. Read `foundation/glossary.md` for naming (a one-line habit — no section).

## 2 — Mine code patterns by layer
Fan out one built-in `Explore` subagent per layer present (frontend, backend, testing). Each reports the **recurring** patterns actually in the code — component/module structure, API shape and error handling, state and data access, test structure and naming, file layout. A convention counts only when it recurs across several files; one example is not a standard. Skip any layer the project doesn't have.

## 3 — Write the standard files
Group findings by layer + topic into concise, prescriptive files (~20–30 lines each) — e.g. `frontend/components.md`, `backend/api.md`, `testing/test-writing.md`. Match the seeded style: a `##` per rule, "do this" phrasing, a short example only when it clarifies. Every rule must trace to something you saw — name the config or pattern in a few words, and drop anything you can't back. Where config and code disagree, follow the enforced config and flag the drift as a lesson candidate — don't average the two.

## Done when
The evidenced standards exist under `context/standards/`, and `global/` is untouched (or minimally appended). Print a one-line-per-file summary of what was written (created/updated · layer/topic · what it captures), then:

```
Standards discovered: <n> files under context/standards/
Next: /dx-plan <id>   — planning now matches these standards into the plan.
```

Stop. Do not chain into another skill.
