# Plan: Cross-skill format reference

## Approach
Add a new `## 7.6 Cross-skill formats — single source of truth` section to `DESIGN.md`, right after §7.5 (Research), enumerating every parsed format with more than one consumer: `## Progress` checkboxes, `Resolution: PENDING`, `change.md`/`effort.md` frontmatter, roadmap `- change:` lines, and `archived_at` derivation. For each, the catalog states its canonical source and its consumers — it's an index, not a re-definition.

Per the user's dedup direction: reference files (`change-md.md`, `effort-md.md`, `review-report.md`) stay the canonical, self-contained definitions — skills load them standalone at runtime with no guarantee `DESIGN.md` is in context, so they can't degrade to pointers. `DESIGN.md` §7.1 and §7.2 slim their existing full-schema code blocks down to a short illustrative snippet plus a pointer to the reference file. This also fixes a live inconsistency: `DESIGN.md` §7.2's roadmap example shows only `- change: <id>`, while `effort-md.md` (and every real `roadmap.md` in this repo) also carries `- why:`/`- next:` — the slimmed §7.2 pointer removes the stale, incomplete copy instead of leaving two versions to drift.

`Resolution: PENDING` is currently defined only in `review-report.md`, with zero mention in `DESIGN.md` — the catalog entry adds that pointer for the first time rather than resolving an existing duplicate.

## Standards to apply
- [ ] `skill-authoring.md` ("Shared reference, not duplication"): content used by ≥2 consumers lives once; `DESIGN.md`'s §7.1/§7.2 code blocks are the duplicate to remove, not the reference files.

## Priors & gotchas
None on file — `foundation/` doesn't exist yet in this repo (no `lessons.md`/`glossary.md`), and this is the first change run through this pipeline for this project, per the effort's own research.

## Phases

### Phase 1: Add the cross-skill format catalog and slim the duplicated schemas
End-to-end, single commit-able unit:
- Insert new `## 7.6 Cross-skill formats — single source of truth` in `DESIGN.md` after §7.5, with one entry per format:
  - `## Progress` checkboxes → canonical: `progress-format.md` (+ §7.3 keeps its illustrative block, already single-source, no change needed there).
  - `Resolution: PENDING` → canonical: `review-report.md`. New pointer, not previously in `DESIGN.md`.
  - `change.md` frontmatter → canonical: `change-md.md`.
  - `effort.md` frontmatter + roadmap `- change:` lines → canonical: `effort-md.md`.
  - `archived_at` derivation → canonical: `effort-md.md` / rule 9 (§14); cross-reference only, no new file.
- Slim `DESIGN.md` §7.1's full `change.md` YAML block to a short illustrative snippet + "see `change-md.md` for the exact current schema."
- Slim `DESIGN.md` §7.2's full `effort.md`/`roadmap.md` blocks the same way, pointing to `effort-md.md` — this also removes the stale `- change:`-only roadmap example in favor of the pointer, so there's no second copy left to fall out of sync with the fuller format already in use.
- Leave `change-md.md`, `effort-md.md`, `review-report.md`, and `DESIGN.md` §7.3/§14 rule 9 untouched — they're the canonical copies the catalog now points to.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Add the cross-skill format catalog and slim the duplicated schemas
#### Automated
- [x] 1.1 `## 7.6 Cross-skill formats` section added to `DESIGN.md`, covering all five formats with canonical-source + consumers for each — 95a43d9
- [x] 1.2 `DESIGN.md` §7.1 `change.md` block slimmed to a pointer to `change-md.md` — 95a43d9
- [x] 1.3 `DESIGN.md` §7.2 `effort.md`/`roadmap.md` blocks slimmed to a pointer to `effort-md.md` — 95a43d9
- [x] 1.4 `npm run lint:skills` still passes (no skill files touched, but confirms nothing else broke) — 95a43d9
#### Manual
- [x] 1.5 Read through the new §7.6 plus slimmed §7.1/§7.2 and confirm no schema detail was lost — only moved to its single canonical home
