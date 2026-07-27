# Plan: Set up Changesets for skill versioning with GitHub Actions

## Approach

Introduce `@changesets/cli` as the versioning mechanism for `skills/**`, gated and released via GitHub Actions. Two independent workflow jobs, both new (no existing `.github/` to extend):

1. **Gate job** (runs on every PR, always) — diffs the PR against its base branch; if any path under `skills/` changed and no `.changeset/*.md` file was added, the job fails. If nothing under `skills/` changed, it no-ops and passes. An always-run-with-internal-check design, not a `paths:`-filtered trigger — a path-filtered required check would never run (and so permanently block merge) for PRs that don't touch `skills/`.
2. **Release job** (runs on push to `main` only) — uses `changesets/action` to run `changeset version` and open/update a "Version Packages" PR with the bumped `package.json` + generated `CHANGELOG.md`. `npm publish` is explicitly out of scope, so the action's publish step is omitted; merging the Version Packages PR is the actual release point (a repo/git-visible version bump + tag-worthy commit, not an npm release).

Because `package.json` is `private: true`, `.changeset/config.json` must set `"privatePackages": { "version": true, "tag": true }` — otherwise Changesets' default private-package behavior skips both version bumps and git tags, which would make the release job a no-op.

Node is pinned via a new `.nvmrc` (first Node-version precedent in this repo) read by `actions/setup-node` in both jobs, rather than a hardcoded version string in the workflow YAML.

`package.json`'s `version` resets `1.0.0` → `0.0.0`, and this change carries its own `.changeset/*.md` with a `major` bump ("Initial release") — so merging this change's own PR is what produces the `0.0.0` → `1.0.0` jump the user asked for, via the same mechanism being introduced.

`CLAUDE.md` gets a new `## Versioning` section (after "Keep docs in sync", same tier as other process rules) and `README.md` gets a new `## Contributing` section (after "Install") — both new content, no existing section to merge into. Both explain: a changeset is required before opening a PR that touches `skills/`, how to author one (`npx changeset`), and that non-`skills/` changes (context/docs/DESIGN.md) don't need one.

Turning the gate job into a GitHub branch-protection "required status check" is a live repo Settings change, not a file in this diff — out of scope; the docs will note it as a manual follow-up for a maintainer.

## Standards to apply
> None matched — `context/standards/` is empty; no prior CI, versioning, or docs-process standards exist yet.

## Priors & gotchas
> None matched — `foundation/lessons.md` is empty; this is the repo's first CI/versioning work.

## Phases

### Phase 1: Changesets scaffold + version reset
End-to-end: `@changesets/cli` installed and configured, `package.json` version reset, first lockfile committed. Demoable via `npx changeset status` running cleanly against the repo.
- Add `@changesets/cli` as a `devDependency` in `package.json`; run `npm install` to generate and commit `package-lock.json` (first lockfile in the repo).
- Run `npx changeset init` → `.changeset/config.json` + `.changeset/README.md`, with `baseBranch: "main"`, `access: "restricted"` (matches `private: true`), default changelog generator, and `"privatePackages": { "version": true, "tag": true }` — required because `package.json` is `private: true`; without this, Changesets skips version bumps and git tags for private packages by default, which would silently defeat the whole mechanism since this repo never publishes to npm.
- Reset `package.json`'s `"version"` from `"1.0.0"` to `"0.0.0"`.
- Add `.nvmrc` pinning Node to the current LTS line.

### Phase 2: GitHub Actions — gate + release workflows
End-to-end: opening a PR that touches `skills/` without a changeset fails CI; opening one with a changeset (or touching only non-`skills/` paths) passes; merging to `main` triggers the release job. Demoable by pushing a throwaway branch through both paths.
- Add `.github/workflows/changeset-gate.yml`: triggers on `pull_request`; `actions/setup-node` reading `.nvmrc`; `npm ci`; a step that diffs `git diff --name-only origin/${{ base }}...HEAD` for `skills/` paths and checks for added `.changeset/*.md` files, failing with a clear message if the former is non-empty and the latter is empty.
- Add `.github/workflows/release.yml`: triggers on `push` to `main`; `actions/setup-node` reading `.nvmrc`; `npm ci`; `changesets/action` with `version: npx changeset version` and no `publish` command, `permissions: contents: write, pull-requests: write`.

### Phase 3: Docs + initial changeset
End-to-end: contributor-facing instructions exist in both docs, and this change's own PR carries the changeset that will bump `0.0.0` → `1.0.0` on merge.
- `CLAUDE.md`: new `## Versioning` section after "Keep docs in sync" — explains the changeset-required-for-`skills/**` rule, `npx changeset` usage, and that it's CI-enforced (agent instruction: authoring a changeset is a required step before opening a PR touching `skills/`).
- `README.md`: new `## Contributing` section after "Install" — same rule, phrased for a human contributor audience, plus a note that `docs/` isn't installed via the CLI so it needs no changeset.
- Add `.changeset/initial-release.md` (or `npx changeset` generated name) with `"dx-workflow": major` and summary "Initial release" — this is the changeset for this change's own PR.
- Note in `CLAUDE.md`'s new section (one line) that making the gate job a required branch-protection check is a manual follow-up in GitHub Settings, not something this change configures.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Changesets scaffold + version reset
#### Automated
- [x] 1.1 `@changesets/cli` added as devDependency, `package-lock.json` committed — c5a8d47
- [x] 1.2 `.changeset/config.json` + `.changeset/README.md` scaffolded via `changeset init`, with `privatePackages.version`/`.tag` set to `true` — c5a8d47
- [x] 1.3 `package.json` version reset to `0.0.0` — c5a8d47
- [x] 1.4 `.nvmrc` added — c5a8d47
#### Manual
- [x] 1.5 `npx changeset status` runs cleanly locally (note: currently fails with "no changesets found" — expected until Phase 3 adds the initial-release changeset; re-check after Phase 3) — re-checked 2026-07-27: passes, shows `dx-workflow` bumping at major; confirmed by user

### Phase 2: GitHub Actions — gate + release workflows
#### Automated
- [x] 2.1 `.github/workflows/changeset-gate.yml` added — 0ccf603
- [x] 2.2 `.github/workflows/release.yml` added — 0ccf603
#### Manual
- [ ] 2.3 Push a throwaway branch touching `skills/` with no changeset — gate job fails
- [x] 2.4 Push a throwaway branch touching only `context/` — gate job passes — verified live via PR #3 (this change's own PR, touches no `skills/` paths): `check-changeset` passed in 9s (run 30272575404)
- [ ] 2.5 Confirm release job triggers on push to `main` (or dry-run via `act`/inspection if not mergeable yet)

### Phase 3: Docs + initial changeset
#### Automated
- [x] 3.1 `CLAUDE.md` `## Versioning` section added — 8a342a2
- [x] 3.2 `README.md` `## Contributing` section added — 8a342a2
- [x] 3.3 `.changeset/*.md` initial-release changeset added (`major`, "Initial release") — 8a342a2
#### Manual
- [x] 3.4 Docs read coherently end-to-end (human pass) — confirmed by user
