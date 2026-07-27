---
topic: changesets-setup
kind: codebase
source: repo/codebase
gathered: 2026-07-27
git_commit: 41d0577156fc177bf750ab67c661694d04f64394
---

## Topic

What does the repo currently look like with respect to package management, CI, and
docs, that a plan to introduce Changesets (versioning `skills/**`, gated by
GitHub Actions) needs to account for?

## Findings

### Package/npm state
- `package.json` (repo root, `/Users/dikamilo/Projects/di-labs/dx-workflow/package.json`):
  `name: dx-workflow`, `version: "1.0.0"`, `private: true`, `packageManager: npm@10.9.4`.
  Only two scripts today: `list-skills` and `install-skills`, both `npx skills ...`
  one-shot invocations — there is **no existing build/test/lint script**, and no
  `devDependencies` block at all.
- No lockfile (`package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, `pnpm-lock.yaml`)
  and no `node_modules/` exist in the working tree. `.gitignore` (3 lines) ignores
  `.idea/`, `node_modules/`, `tmp/`. Nothing currently installs dependencies locally —
  the repo has never run `npm install`. Introducing `@changesets/cli` as a devDependency
  will be the first time this repo gets a lockfile; that lockfile will need to be
  committed (not gitignored) for `changesets/action` in CI to use `npm ci`/frozen installs.
- `git log --oneline -- package.json` shows exactly one commit touching it
  (`12dae49 Add dx-workflow project scaffolding and docs`) — it has never been
  version-bumped since scaffolding.

### CI / GitHub Actions state
- **No `.github/` directory exists anywhere in the repo** (`find . -maxdepth 1 -iname ".github"`
  returned nothing). There is no existing workflow to extend — the Changesets GH Action
  will be a first workflow file, not an addition to an existing pipeline.
- A stray, unrelated example lives at
  `/Users/dikamilo/Projects/di-labs/dx-workflow/tmp/10x-impl-review-ci/references/workflow-template.yml`.
  `tmp/` is gitignored and this file belongs to a different toolkit
  (`10x-impl-review-ci` / `@przeprogramowani/10x-toolkit`, unrelated `dx-*` skills)
  that appears to be scratch material left from investigating another project's
  CI pattern — it is not part of this repo's own conventions and should not be
  treated as a style precedent, only noted as present.
- `git remote -v` confirms a real GitHub remote: `git@github.com:/dikamilo/dx-workflow.git`
  (owner `dikamilo`, repo `dx-workflow`) — GH Actions and `changesets/action` (which
  needs `contents: write` / `pull-requests: write` to open its "Version Packages" PR)
  are viable against this remote.

### Skills layout (what "scoped to skills/" must match)
- `skills/` contains 20 skill directories, each `dx-<name>/SKILL.md`, listed in
  `skills.sh.json`'s `groupings` (5 groups: Change lifecycle, Effort, Knowledge,
  Discovery, Plumbing). `skills.sh.json` has no version fields of its own — it's
  purely a display/grouping manifest for the `skills` CLI, not something Changesets
  needs to touch.
- No skill currently carries its own version — versioning today is only the root
  `package.json`'s `1.0.0`, i.e. single-package versioning for the whole repo, not
  per-skill. This matches the change's stated out-of-scope note ("per-skill
  independent versioning (single root package.json today)").

### Docs/instructions that will need the new contributor rule
- `CLAUDE.md` (root maintainer orientation) has a "Keep docs in sync" section and a
  "Skill index" section but **no existing PR/CI/contribution process section** —
  the new "changeset required before PR" rule has no existing section to slot into;
  it will need its own subsection (e.g. alongside "Keep docs in sync").
- `README.md` documents only end-user install/usage (`npx skills add`, `npm run
  install-skills` / `list-skills`) — no contributor-facing section exists yet either;
  the changeset workflow explanation is new content, not an edit to an existing block.
- Neither file currently mentions "version," "release," "changeset," or "bump"
  anywhere (`grep -i version DESIGN.md` and repo-wide `changeset` grep were empty
  except the change.md itself) — this confirms there is no competing/legacy
  versioning-instructions convention to reconcile; the plan is greenfield here.

### Prior art
- No prior research or plan under `context/changes/**` or `context/archive/**`
  mentions Changesets or versioning (repo-wide grep for "changeset" only matched
  this change's own `change.md`). No `context/efforts/` exist. This is the first
  investigation of this topic in the workflow's history.

## Implications for planning

- The plan must add, from scratch: `.changeset/config.json` (+ `.changeset/README.md`
  if using the standard `changeset init` scaffold), a first `.github/workflows/*.yml`,
  a `devDependencies`/lockfile addition to `package.json`, and new contributor-facing
  sections in both `CLAUDE.md` and `README.md` — none of these have any existing
  structure to merge into.
- Path-scoping ("only require/trigger a changeset when `skills/**` changed") has two
  independent levers to wire consistently: the GitHub Action's `on.pull_request.paths`
  (or a path-filter step) for the CI gate, and the agent-facing instruction text in
  CLAUDE.md/README.md for the human/agent contribution rule. Nothing in the repo
  today does path-filtered CI, so this is new, not a pattern to copy locally.
- Since there's no lockfile yet, adding `@changesets/cli` means the very first
  `npm install` this repo has ever run in CI — the workflow needs a Node setup step
  (version pinned somewhere, e.g. `actionlint`/`actions/setup-node`) that doesn't
  exist as precedent anywhere else in this repo.
