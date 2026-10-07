# Plan: Move context/workflow to context/config and split out templates

## Approach
Behavior-preserving restructure of where shipped review files live. `context/workflow/` becomes `context/config/`; the two templates leave `review-policies/` for a new sibling `context/config/templates/` and take shorter names (`policy-template.md` → `review-policy.md`, `report-template.md` → `review-report.md`), so `review-policies/` holds Policies only and later template kinds (plan, change, …) have a home. The `dx-init` assets mirror the target tree under `assets/config/{review-policies,templates}/`, and `dx-init` copies `assets/config/` into `context/config/`, missing files only (interview, 2026-10-07).

Decisions already made: new change inside `policy-driven-review` (not a reopened slice); **no migration** for projects seeded at `context/workflow/` — `dx-init` neither detects nor moves anything, and the new changeset just states the new paths.

Consequence worth naming: the "a `.md` whose name ends in `-template.md` is not a Policy" rule exists only because templates sat beside Policies. With templates in their own folder it is dead, so it is deleted from `dx-review` and from the policy template — every `.md` in `review-policies/` is a Policy.

Scope boundary: the plan/change records of the other slices under `context/changes/` and everything under `context/archive/` are history and keep the old paths. The three pending changesets from this effort are unreleased, so their paths and file names are corrected in place — released notes saying `context/workflow` would be wrong.

## Standards to apply
- [ ] global/skill-authoring — Edit `dx-init`, `dx-review` and `dx-review-triage` through `skill-creator`; this is a path/name copy-edit that changes no behavior or trigger, so evals are skipped (the standard allows that).
- [ ] global/skill-authoring, shared reference rule — the templates stay user-owned assets in `dx-init`, not `dx-references` topics, because they ship into the project.
- [ ] CLAUDE.md (maintainer) — run `npm run lint:skills` after the edits under `skills/dx-*`; update `docs/reference/skills.md` and every tutorial/explanation page that names these paths in the same change (documentation skill); add a changeset for this change.
- [ ] CLAUDE.md (maintainer) — no skill directory is added or removed, so `skills.sh.json` is unchanged.

## Priors & gotchas
- Re-running `dx-init` never overwrites user files (decided in `review-policy-core`), so an already-seeded project gets a second, fresh copy at the new path and keeps the old folder. That is the accepted cost of "no migration"; don't add detection code.
- This repo dogfoods its own seeded tree: `context/workflow/review-policies/` is byte-identical to the shipped assets today. Move it with `git mv` so history follows, and confirm it still matches the assets afterwards.
- `docs/reference/glossary.md` states `context/` has exactly six top-level folders, naming `workflow/`. The count stays six; only the name changes.

## Phases
### Phase 1: Move the shipped files and repoint the skills
Delivers a working end-to-end seed: running `dx-init` creates `context/config/{review-policies,templates}/` with the renamed templates, and `dx-review`/`dx-review-triage` read from them.
- `git mv skills/dx-init/assets/review-policies skills/dx-init/assets/config/review-policies`; move the two templates into `skills/dx-init/assets/config/templates/` as `review-policy.md` and `review-report.md`.
- `git mv context/workflow context/config`, and the same split of the two templates for the dogfood copy.
- `dx-init`: scaffold list shows `config/  review-policies/, templates/`; the seeding bullet copies `assets/config/**` into `context/config/` missing-only; Done-when wording follows.
- `dx-review`: Policy folder is `context/config/review-policies/`, the report schema is `context/config/templates/review-report.md`, delete the `-template.md` exclusion. `dx-review-triage`: report schema path.
- Inside the templates: fix `context/config/...` paths and cross-references (`report-template.md` → `review-report.md`), the "Creating a Policy" bullet (copy from `context/config/templates/review-policy.md`), and delete the `-template.md` sentence; retitle the headings to match the new file names.
- `DESIGN.md` §2 (line 39), §5 tree (line 135), and the artifact table and `init` paragraph (lines 225–227, 367).

### Phase 2: Docs and changesets
Delivers docs and release notes that name only the new paths, via the `documentation` skill.
- `docs/reference/skills.md` (`dx-init`, `dx-review`, `dx-review-triage` entries), `docs/reference/glossary.md` (Context, Policy).
- `docs/explanation/{directory-layout,policy-driven-review,workflow-overview}.md` — including the layout diagram, the folder-table row (now two seeded areas: Policies and templates), and the "one more folder" note.
- Tutorials: `initialize-a-project`, `write-a-review-policy`, `review-and-triage`, `ship-a-change`, `review-a-folder-with-test-strategy`, `run-sessions-retrospective`.
- Correct paths and template names in the three unreleased changesets (`review-policy-core`, `plan-policy`, `test-strategy-policy`, `sessions-policy` — whichever still mention the old ones), and add a new `.changeset/config-templates-layout.md` (minor): `context/workflow/` is now `context/config/`, templates moved to `context/config/templates/` as `review-policy.md` / `review-report.md`, `-template.md` naming rule removed; existing projects re-run `/dx-init` to get the new tree and delete the old `context/workflow/` by hand — their edited Policies are not copied over.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Move the shipped files and repoint the skills
#### Automated
- [x] 1.1 `skills/dx-init/assets/config/{review-policies,templates}/` exist with the renamed templates; `skills/dx-init/assets/review-policies/` is gone — 42fcea4
- [x] 1.2 `context/config/` mirrors the assets (`diff -r` against `skills/dx-init/assets/config` is empty) and `context/workflow/` is gone — 42fcea4
- [x] 1.3 `grep -rn 'context/workflow\|policy-template\|report-template\|-template.md' skills DESIGN.md context/config` returns nothing — 42fcea4
- [x] 1.4 `npm run lint:skills` passes — 42fcea4
#### Manual
- [x] 1.5 Sandbox: `/dx-init` on an empty project creates `context/config/review-policies/` (four built-in Policies plus any shipped ones) and `context/config/templates/{review-policy,review-report}.md`; a second run reports them present and leaves an edited file untouched
- [x] 1.6 Sandbox: `/dx-review implementation <id>` still resolves the Policy and writes a report in the template's shape; a `review-policy.md` left in `review-policies/` is treated as a Policy, not skipped

### Phase 2: Docs and changesets
#### Automated
- [x] 2.1 `grep -rIn 'context/workflow\|policy-template\|report-template' docs .changeset` returns only the new changeset's migration sentence — 8444236
- [x] 2.2 `.changeset/config-templates-layout.md` exists (minor) and names the new paths — 8444236
- [x] 2.3 `npm run lint:skills` still passes — 8444236
#### Manual
- [x] 2.4 Read-through: the `directory-layout` diagram and table, and the `initialize-a-project` tutorial's printed status lines, match what `/dx-init` actually prints in the sandbox — 8444236
