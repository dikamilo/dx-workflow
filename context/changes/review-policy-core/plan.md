# Plan: Generic review skill with the implementation Policy

## Approach
Add one user-invoked skill, `dx-review`. It runs a review whose criteria come from a Policy file in the target project's `context/workflow/review-policies/`, and it replaces `dx-impl-review` outright with no alias. `dx-init` seeds three files from its assets, copying only what is missing: `implementation.md` (the built-in Policy, at parity with today's `dx-impl-review`), `policy-template.md` and `report-template.md`. All three sit side by side, and a policy ID is the file name of any `.md` in that folder that does not end in `-template.md`.

**Mechanism in the skill, criteria in the Policy** (interview, 2026-10-06). `dx-review` always handles the generic steps:
- policy resolution and its errors: no `review-policies/` → `/dx-init`; unknown ID → name it and list the available IDs
- the target guard: the run is checked against the Policy's `targets`, and a mismatch is refused, naming the Policy and the targets it accepts
- container resolution under `changes/` or `efforts/`, with archived containers refused
- the glossary read, and steering the run by the user's custom instructions
- fan-out to built-in `Explore`/`general-purpose` agents
- writing the report from `report-template.md`, after confirming before it overwrites a report that still holds PENDING findings
- invoking `dx-diagnose` directly on a regression
- the lesson offer, or an offer to graduate a lesson or amend a standard via `/dx-standards-update` when a finding repeats an existing lesson or exposes a gap in a standard (never writing `lessons.md` or `context/standards/` itself). **Scope addition beyond parity** (user's call, 2026-10-06, during Phase 1).
- print-and-stop

The Policy declares the rest: `targets`, `## Preconditions`, `## Load` (including conditional references), `## Dimensions` (with each dimension's verdict and finding tag), `## Extra checks`, `## On pass`, and `## Next`. `targets: container | explore | both` is defined in the template now. Only `container` runs in this slice; a Policy that targets `explore` or `both` is refused for a run without a container until slice 3. A container run always writes a report, and no Policy declares its output.

`dx-review-triage` takes `<container-id> [policy-id]` and resolves the report at `reviews/<policy-id>.md`. It no longer branches on the review type. Instead it **derives from each finding**: it loads what a PENDING finding's Location names, commits an applied fix only if the fix touched files outside `context/`, and never commits edits to `context/` artifacts or the report itself.

**Transition until slice 2** (this deviates from the roadmap, chosen in the interview): `review-report` stays in `dx-references`, trimmed to `dx-plan-review` and the legacy `reviews/plan-review.md` that triage still handles for `plan`. Its schema moves into `report-template.md`, and slice 2 deletes it along with `dx-plan-review`. Old `reviews/impl-review.md` files are neither migrated nor read.

Three things outside the roadmap's list are forced by removing `dx-impl-review`, so they are pulled into this slice. `dx-implement` and `dx-tdd` print `Next: /dx-impl-review`. `dx-archive` reads `reviews/impl-review.md` directly. `skill-authoring.md`, `knowledge-layer.md`, `module-design.md` and `plan-template.md` all name the removed skill. Repointing `dx-plan`'s `Next:` line stays in slice 2.

Changeset bump: **minor** (user's call, even though a command is removed).

## Data model
These are persisted file shapes, not a database. The change is additive for new projects, and existing projects get the new files on a re-run of `dx-init`.
- **Policy file** `context/workflow/review-policies/<policy-id>.md`. Its frontmatter is `targets: container | explore | both`, and that one field is required. The body has a one-line purpose, then `## Preconditions`, `## Load`, `## Dimensions` (one `###` per dimension, plus the finding-tag form), and the optional sections `## Extra checks`, `## On pass` and `## Next`. A missing optional section means nothing happens for that step. A missing or invalid `targets` value refuses the run and names the field.
- **Report** `context/{changes|efforts}/<id>/reviews/<policy-id>.md`, one file that each re-run overwrites. It has no frontmatter, because the policy ID plus the container ID locate it. It opens with `## Verdicts`, one line per dimension the Policy declares (`PASS/WARNING/FAIL/N/A`), and is followed by findings in today's `### F<n>` format with `Resolution: PENDING`. The ID, resume and overwrite rules are copied from `review-report.md`.
- **Migration:** none. A legacy `impl-review.md` is ignored, and the changeset says so (user case 7). A legacy `plan-review.md` keeps working through `dx-review-triage <id> plan` until slice 2 (user case 5).
- **Coexistence:** `dx-plan-review` and `dx-review` both write under `reviews/` with no name collision (`plan-review.md` vs `<policy-id>.md`).

## API & contracts
The change is **breaking**: a clean break with no alias, as decided in the effort frame. The changeset names every replacement.
- **New:** `/dx-review <policy-id> [container-id] [instructions…]`. The second token counts as a container only if it resolves under `context/changes/` or `context/efforts/`. Otherwise it and everything after it are instructions.
- **Removed:** `/dx-impl-review <change-id>`, replaced by `/dx-review implementation <change-id>`.
- **Changed:** `/dx-review-triage <container-id> [plan|impl]` becomes `/dx-review-triage <container-id> [policy-id]`. `impl` is gone and `implementation` takes its place. `plan` resolves `reviews/plan.md` and falls back to the legacy `reviews/plan-review.md`. Called with no policy ID, it uses the only report under `reviews/` if there is one, and asks which one if there are several.
- **Changed:** the `dx-archive` PENDING warning scans every `reviews/*.md` instead of only `impl-review.md`, and its hint names `/dx-review-triage <id> <policy-id>`.
- **Changed `Next:` lines:** `dx-implement` and `dx-tdd` print `/dx-review implementation <change-id>`. `dx-review` prints `/dx-review-triage <id> <policy-id>`, then the Policy's `## Next` lines.
- Affected callers: users' typed commands and the docs. No other skill invokes `dx-impl-review` programmatically.

## Standards to apply
- [ ] global/skill-authoring — Create `dx-review` and edit `dx-review-triage`, `dx-init`, `dx-archive`, `dx-implement` and `dx-tdd` through `skill-creator`. `dx-review` gets `disable-model-invocation: true`, a terse description, a guard clause first, and `## Done when`. Keep the read-vs-write split: `dx-review` never edits what it reviews. **Deviation (per lesson below):** there is no eval harness, so verification uses sandboxed runs with scripted answers, as recorded under Manual.
- [ ] global/skill-authoring, shared reference rule — the Policy loads `knowledge-layer`/`module-design` through `dx-references`. The templates are user-owned assets in `dx-init`, not references, because they ship to the project.
- [ ] CLAUDE.md (maintainer) — run `npm run lint:skills` after every edit under `skills/dx-*`; keep `skills.sh.json`, `docs/reference/skills.md` and the tutorials in sync in the same change; add a changeset.

## Priors & gotchas
- **Skills ship without evals (2026-07-28):** state the eval deviation (done above). The untested half is the review under an adversarial user, so the manual runs must include the refusal paths (user cases 1 and 8).
- **Parity is the success criterion** (effort frame caveat). Each of these is an explicit check in Phase 1: the Progress guard, `status: reviewed`, the lesson offer, `dx-diagnose` on a regression, conditional `module-design` for `type: refactor`, the refactor gate, per-dimension Verdicts, and `Standards: N/A` plus a `Consider` finding when `context/standards/` is missing. Losing any one of them silently counts as drift.
- **Policies sit outside the lint gate** (frame caveat). Nothing checks a Policy's shape mechanically, so the template is the only guardrail and must be explicit.
- **Shipped Policy fixes never reach existing copies** (frame caveat), so the docs must say this plainly.
- **Lint check 4** only resolves `dx-references` call sites in `SKILL.md` files. `dx-review` must not reference `review-report`, and Policy files are not scanned.
- **Test setup:** the repo has none beyond `lint:skills`, so the user cases are verified by manual sandbox runs, not automated assertions. No harness is introduced here.

## Phases

### Phase 1: Tracer — seed and run the implementation Policy end to end
- Add `skills/dx-init/assets/review-policies/{implementation,policy-template,report-template}.md`.
  - `policy-template.md` documents the Policy shape above: `targets` and the rule that output is derived from the target, the sections, and the custom-instructions note. It also says where a new Policy goes, that the file name is its ID, how to run it (`/dx-review <id> [container-id]`), and that shipped Policies are never overwritten.
  - `report-template.md` carries the report path, the overwrite rule and the full finding/Resolution schema.
  - `implementation.md` moves every check from `dx-impl-review` into Policy sections (`targets: container`).
- Extend `dx-init` to copy `assets/review-policies/*.md` into `context/workflow/review-policies/`, missing-only, and list them in its status output.
- Create `skills/dx-review/SKILL.md` (the mechanism listed in Approach), add it to `skills.sh.json` under Change lifecycle, and add a `### /dx-review` entry to `docs/reference/skills.md`. Lint requires that entry.

### Phase 2: Triage and archive by policy ID
- Rewrite `dx-review-triage` for `<container-id> [policy-id]`. It loads and commits based on each finding, and keeps the legacy fallback to `plan-review.md` for `plan`.
- `dx-archive` scans `reviews/*.md` for PENDING findings.

### Phase 3: Retire dx-impl-review
- Delete `skills/dx-impl-review/` and remove it from `skills.sh.json` and `docs/reference/skills.md`.
- Trim `review-report.md` to plan-review only, with a note that it is removed in slice 2, and update the `dx-references` description if needed.
- Repoint the `Next:` lines in `dx-implement` and `dx-tdd`, and the mentions in `knowledge-layer.md`, `module-design.md`, `plan-template.md` and `context/standards/global/skill-authoring.md`.
- Update `DESIGN.md`: §2 (gates), §3 (skill-based gates), §4 flows, §5 tree (assets plus `context/workflow/`), §7.6 table (new rows for the Policy file and report template), §8 table and mermaid, §9 diagnose lines, §12 (dx-init seeds).

### Phase 4: Docs, changeset, dogfood
- Update docs with the documentation skill:
  - `docs/reference/skills.md`: `dx-init`, `dx-implement`, `dx-tdd` and `dx-review-triage` entries
  - `docs/reference/glossary.md` (Review gate, Behavior-preserving gate)
  - tutorials `review-and-triage.md`, `ship-a-change.md`, `initialize-a-project.md`, `build-standards.md`, `build-domain-language.md`, `find-refactors.md`, `run-an-effort.md`
  - explanations `workflow-overview.md`, `directory-layout.md`, `knowledge-layer.md`, `plan-and-slices.md`
- New tutorial: "Write a review policy" (user case 9).
- New explanation page: policy-driven review. It covers mechanism vs criteria, targets, that shipped Policies are never overwritten, and that Policies sit outside lint.
- `npx changeset` (minor). It names `/dx-review implementation`, the triage argument change, re-running `/dx-init`, and that old `impl-review.md` reports are ignored and should be re-run.
- Re-run `/dx-init` in this repo so `context/workflow/review-policies/` exists here.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Tracer — seed and run the implementation Policy end to end
#### Automated
- [x] 1.1 `implementation.md`, `policy-template.md`, `report-template.md` added under `skills/dx-init/assets/review-policies/` — 0ca4c37
- [x] 1.2 `dx-init` copies them missing-only into `context/workflow/review-policies/` (via skill-creator) — 0ca4c37
- [x] 1.3 `skills/dx-review/SKILL.md` created (via skill-creator); `skills.sh.json` and `docs/reference/skills.md` entries added — 0ca4c37
- [x] 1.4 `npm run lint:skills` passes — 0ca4c37
#### Manual
- [x] 1.5 Sandbox: `/dx-init` seeds the three files; a second run reports them `present` and leaves an edited `implementation.md` untouched
- [x] 1.6 Sandbox: `/dx-review implementation <id>` on an unfinished `## Progress` is refused and points at `/dx-implement` (UC1)
- [x] 1.7 Sandbox: `/dx-review implementation` with no container is refused, naming the Policy and `targets: container` (UC8); an unknown ID is named with the available list; with no `review-policies/` it points at `/dx-init`
- [x] 1.8 Sandbox: on a finished change it writes `reviews/implementation.md` with four Verdicts, compound tags, `Standards: N/A` + Consider when `context/standards/` is absent, sets `status: reviewed` on pass, and offers a lesson (UC3)
- [x] 1.9 Sandbox: a seeded regression invokes `dx-diagnose` (UC2); a `type: refactor` change loads `module-design` and applies the refactor gate; custom instructions steer the run
- [x] 1.10 Parity read-through: every rule in the old `dx-impl-review/SKILL.md` maps to either `dx-review` or `implementation.md`
- [x] 1.11 Follow-up: a run whose custom instructions leave a dimension unchecked skips `## On pass`; the `implementation` Policy's archive hint reads "if the change passed" — sandbox re-run confirmed — 24dee8d
- [x] 1.12 Follow-up (scope addition): `dx-review` offers `/dx-standards-update` when a finding repeats a lesson (graduate) or exposes a standard gap (amend), else `/dx-lesson`. Sandbox: a seeded lesson got a graduation offer, and a contradicting standard got an amendment offer — 4924e85

### Phase 2: Triage and archive by policy ID
#### Automated
- [x] 2.1 `dx-review-triage` rewritten for `<container-id> [policy-id]` (via skill-creator) — 2baa7f4
- [x] 2.2 `dx-archive` scans `reviews/*.md` for PENDING (via skill-creator) — 2baa7f4
- [x] 2.3 `npm run lint:skills` passes — 2baa7f4
#### Manual
- [x] 2.4 Sandbox: `/dx-review-triage <id> implementation` walks the report; a code fix is committed as `fix(<id>): … (review)`, the report is not (UC4)
- [x] 2.5 Sandbox: `/dx-plan-review` still writes `plan-review.md` and `/dx-review-triage <id> plan` triages it without committing `plan.md` (UC5)
- [x] 2.6 Sandbox: a legacy `impl-review.md` is ignored by triage; `/dx-archive` warns on a PENDING finding in `reviews/implementation.md`

### Phase 3: Retire dx-impl-review
#### Automated
- [x] 3.1 `skills/dx-impl-review/` deleted; `skills.sh.json` and `docs/reference/skills.md` entries removed — 35680ac
- [x] 3.2 `review-report.md` trimmed to plan-review; `dx-implement`/`dx-tdd` `Next:` lines repointed (via skill-creator) — 35680ac
- [x] 3.3 `knowledge-layer.md`, `module-design.md`, `plan-template.md`, `context/standards/global/skill-authoring.md` repointed — 35680ac
- [x] 3.4 `DESIGN.md` §2, §3, §4, §5, §7.6, §8, §9, §12 updated — 35680ac
- [x] 3.5 `npm run lint:skills` passes; `grep -rn 'dx-impl-review\|impl-review.md' skills DESIGN.md context/standards` returns only the two intentional legacy-ignore lines in `dx-review-triage` and `dx-archive` (accepted by user, 2026-10-06) — 35680ac
#### Manual
- [x] 3.6 A fresh install of the skills doesn't install `dx-impl-review`, and `/dx-impl-review` doesn't resolve (UC6). Upgraded installs keep their stale copy until it is removed by hand, which is expected (user, 2026-10-06). Sandbox-verified.

### Phase 4: Docs, changeset, dogfood
#### Automated
- [x] 4.1 Reference, glossary, tutorials and explanations listed in Phase 4 updated (documentation skill) — 99f72be
- [x] 4.2 New tutorial "Write a review policy" and new explanation page on policy-driven review added — 99f72be
- [x] 4.3 Changeset (minor) added naming `/dx-review implementation`, the triage argument change, re-running `/dx-init`, and that old `impl-review.md` is ignored — 99f72be
- [x] 4.4 `grep -rn 'dx-impl-review' docs README.md` returns nothing; `npm run lint:skills` passes — 99f72be
#### Manual
- [x] 4.5 `/dx-init` re-run in this repo creates `context/workflow/review-policies/` and leaves `context/standards/` untouched
