---
change_id: setup-changesets-skill-versioning
title: Set up Changesets for skill versioning with GitHub Actions
type: feature
effort: null
slice: null
status: planned
created: 2026-07-27
updated: 2026-07-27
archived_at: null
---

## Notes

Goal: introduce Changesets to version the skills maintained in this repo.

Scope (from user request):
- Add `@changesets/cli` config (`.changeset/`) to the repo.
- Add a GitHub Action that runs the Changesets release/version workflow (CI-driven versioning, likely via `changesets/action`).
- Update `CLAUDE.md` and `README.md` with instructions on how the changeset workflow works.
- Update agent-facing instructions so that creating a changeset file is a required step before opening a PR.
- Reset `package.json` version from `1.0.0` to `0.0.0`.
- Author the first changeset itself as part of this change, bumping `0.0.0` → `1.0.0` to mark the initial release — i.e. this change's own changeset is the "initial version" bump.

Constraint: versioning is scoped to changes under `skills/` only — a changeset (and the version bump it produces) should be required/triggered only when a PR touches `skills/**`. Changes to `context/`, `docs/`, `DESIGN.md`, or other non-skill paths should not require a changeset or bump the version. This affects: the agent instruction in CLAUDE.md/README.md (only require a changeset when skills/ changed), and possibly the GitHub Action's path filter.

Out of scope: publishing to npm (unconfirmed whether this repo publishes anywhere), per-skill independent versioning (single root package.json today).
