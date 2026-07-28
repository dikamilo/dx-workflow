# Plan: Content lint gate for skills/dx-*

## Approach
Add a Node script (`scripts/lint-skills.mjs`) that mechanically enforces the checks in `context/standards/global/skill-authoring.md` / `CLAUDE.md`'s authoring rules over every `skills/dx-*/SKILL.md`:

1. **Frontmatter shape** — required keys present (`name`, `description`), `name` matches the folder (`dx-<x>`), and the `disable-model-invocation: true` / `user-invocable: false` / model-invoked (neither flag) shapes are each internally consistent (e.g. a skill can't set both).
2. **Description quoting** — the `description:` frontmatter value must not contain an unquoted `": "` (colon-space), which breaks YAML plain-scalar parsing, unless the whole value is quoted.
3. **Body size** — count body lines (below the frontmatter). No hard cap exists yet, so this is **advisory only**: printed as a warning, never fails the job.
4. **`dx-references` topic resolution** — every `dx-references <topic>` (or `dx-references` invoked with `topic`) call site across `skills/*/SKILL.md` must resolve to an existing `skills/dx-references/references/<topic>.md`. Forward-only (unresolved topic → fail); an unused reference file is not flagged.
5. **Docs-sync** — every `skills/dx-*` folder must have a matching heading in `docs/reference/skills.md` (a `### /dx-<name>` heading), and vice versa — no heading survives for a skill that no longer exists.

Checks 1, 2, 4, 5 fail the script (non-zero exit); check 3 only prints a warning. The script is exposed as `npm run lint:skills` (`"lint:skills": "node scripts/lint-skills.mjs"`) and wired into CI as a second job (`lint-skills`) in the existing `.github/workflows/changeset-gate.yml`, alongside the current changeset-check job — same PR trigger, one workflow file for "PR checks on skills/".

No new dependency: frontmatter is a flat `key: value` block (the only free-text field, `description`, never contains a top-level `key:` of its own), so the script parses it directly by splitting on the `---` delimiters and reading lines, rather than pulling in a YAML parser.

## Standards to apply
- [ ] `context/standards/global/skill-authoring.md` — "Token efficiency" and "Accuracy" sections enumerate exactly the five properties this gate checks; the script's checks map 1:1 to that file's bullets so it's enforcing a documented standard, not inventing new rules.

## Priors & gotchas
None recorded in `foundation/lessons.md` (empty) — this is the first tooling built in this repo.

## Phases

### Phase 1: Lint script, local and green against current repo
Write `scripts/lint-skills.mjs` implementing all five checks above. Add `"lint:skills": "node scripts/lint-skills.mjs"` to `package.json` scripts. Run it locally against the current `skills/` tree — per `context/efforts/sdlc-hardening/research/sdlc-hardening.md` (§3), every skill currently conforms by author discipline, so a correct script must exit 0 clean (plus zero body-size warnings, since current max is 61 lines). Also hand-verify each check actually catches its violation: temporarily mutate a copy of one SKILL.md per check (missing required key, unquoted `": "` in description, a `dx-references` call to a nonexistent topic, a skill folder with no docs heading) and confirm the script fails with a clear message, then revert.

### Phase 2: Wire into CI as a required gate
Add a `lint-skills` job to `.github/workflows/changeset-gate.yml` (checkout, setup-node via `.nvmrc`, `npm ci`, `npm run lint:skills`) alongside the existing `check-changeset` job. Confirm the workflow YAML is valid (`actionlint` if available, else a structural read-through) and that the job runs on the same `pull_request` → `main` trigger as `check-changeset`. Note in the change's notes that turning this into a required branch-protection check (like the existing changeset gate) is a manual GitHub Settings follow-up, matching how `CLAUDE.md` already describes the changeset gate.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Lint script, local and green against current repo
#### Automated
- [x] 1.1 `scripts/lint-skills.mjs` implements all five checks and exits 0 clean on current `skills/` tree — 60e51db
- [x] 1.2 `npm run lint:skills` added to `package.json` and runs the script — 60e51db
- [x] 1.3 Each check verified to fail on a deliberately broken temporary mutation, then reverted — 60e51db

### Phase 2: Wire into CI as a required gate
#### Automated
- [x] 2.1 `lint-skills` job added to `.github/workflows/changeset-gate.yml`, mirrors `check-changeset`'s checkout/setup-node/npm-ci steps
#### Manual
- [x] 2.2 Workflow YAML reviewed for validity (no PR exists yet to trigger a live run)
