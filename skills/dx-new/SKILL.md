---
name: dx-new
description: Start a new piece of work — creates a change or an effort and points you at the next step.
disable-model-invocation: true
argument-hint: [idea or effort/slice]
---

# dx-new — the entry point and router

Every piece of work starts here. Your one job is to pick the **container level**, create its identity file, and print the next command. You do not research, frame, or plan — you route.

**No-op test.** If `context/` isn't scaffolded (no `changes/` or `efforts/`), stop and tell the user to run `dx-init`. Never auto-create the parent tree.

## Name it

Derive a kebab-case slug from the idea (`Add Google sign-in` → `oauth-login`). If `foundation/glossary.md` exists, read it first and prefer its terms so the id matches the project's language. Reject a slug that collides with an existing change/effort/archive folder — ask for another.

## Pick the level

Infer from size and clarity; when it's a coin-flip, ask one question and stop.

- **Small / clear → a change.** A single shippable unit. Create `context/changes/<id>/change.md`. Set `type` (feature | defect | refactor | migration — default feature), `effort: null`, `slice: null`, `status: new`. For its exact schema, invoke `dx-references` with topic `change-md`.
- **Large / decomposes into slices → an effort.** Work that *produces* changes. Create `context/efforts/<id>/effort.md` with a one-paragraph `## Goal`, `status: new`. For its exact schema, invoke `dx-references` with topic `effort-md`.
- **A slice of an existing effort** (`dx-new <effort-id> <slice-n>`) → a **child change** with `effort:`/`slice:` set. It inherits the effort's `research/` + `frame.md`, so it skips upstream steps.

Never nest a change inside a change. Large work is an effort that spawns flat child changes.

## Promoted entries

`dx-diagnose` and `dx-refactor-discover` are separate discovery skills that hand a finding here. When invoked with a pre-seeded `diagnosis.md` (bug) or refactor finding, drop it into the new change's folder as its seed research and set `type` accordingly (`defect` / `refactor`). Don't re-derive what the discovery skill already found.

## Then stop

Write only the identity file (plus any seeded finding). Print the suggested next command and **stop** — never run it.

- change: `/dx-research?` → `/dx-frame?` → `/dx-plan`  (`?` = optional; small/clear work can go straight to `/dx-plan`)
- effort: `/dx-research` → `/dx-frame` → `/dx-roadmap`
- child change of an effort: jump straight to `/dx-plan <id>` (upstream is inherited)

**Done when** the identity file exists with correct frontmatter and the next command is printed.
