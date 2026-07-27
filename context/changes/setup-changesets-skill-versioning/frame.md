# Frame — setup-changesets-skill-versioning

## The real problem

The skills under `skills/` change over time with no versioning signal for anyone consuming them via `npx skills add` or a git pull — there's no changelog, no way to tell what revision you got, and no enforced discipline forcing contributors (human or agent) to record intent when a skill changes. The repo needs a lightweight, CI-enforced record-and-release mechanism scoped to `skills/**` so the version number is a real, trustworthy signal for consumers rather than a static `1.0.0` that's never moved.

## Who / what it affects

- **Consumers installing via `npx skills add` or by pulling this repo directly** — the primary audience for the version number, even with no npm publish. This is the deciding factor for the mechanism: it must produce a human-readable version/changelog trail visible in the repo itself (git tags, root `package.json` version, release notes), not something that only makes sense inside an npm registry.
- **Contributors (human and agent) opening PRs that touch `skills/`** — gain a new required step (author a changeset file) enforced by CI, not just documented convention.
- **Contributors touching `context/`, `docs/`, `DESIGN.md`, or other non-skill paths** — explicitly unaffected; no changeset requirement, no CI gate, no version bump triggers on these paths.
- **CI/CD** — gains its first `.github/workflows/*.yml` and its first `npm install`/lockfile in the repo's history (per research: no `.github/` dir, no lockfile exist today).
- **`CLAUDE.md` and `README.md`** — gain new contributor-facing sections; neither currently has a PR/CI/contribution-process section to slot into.

## Alternatives considered

- **Changesets (`@changesets/cli` + `changesets/action`) — chosen.** Explicit per-PR markdown files are legible without an npm registry (they read as changelog entries in the repo itself) and give the mechanism something concrete to gate on: "does `.changeset/*.md` exist" is a simple, deterministic CI check. This is also the mechanism the user requested directly.
- **`semantic-release` (commit-message-driven versioning) — rejected.** Infers bumps from conventional-commit message parsing rather than an explicit artifact; doesn't give agents/contributors a discrete "required step before PR" to satisfy, and produces a weaker changelog trail for a non-npm audience.
- **Manual/ad-hoc version bumps in `package.json` — rejected (status quo).** This is what's happening today (`1.0.0` set once at scaffolding, never touched since) — no changelog, no signal, no discipline. The whole point of this change is to leave this state.
- **Enforcement: hard CI gate that blocks the PR — chosen**, over a documented-but-unenforced convention. A convention-only approach was rejected because the repo has no other contribution-process precedent to lean on, and the point of "required step" is that it's actually required, not aspirational.

## Out of scope

- Publishing to npm (unconfirmed whether this repo publishes anywhere; the version number's audience is repo/git consumers, not a registry).
- Per-skill independent versioning — this stays single-package versioning via the root `package.json`, matching today's model.
- Any versioning trigger for `context/`, `docs/`, `DESIGN.md`, or other non-`skills/` paths.
