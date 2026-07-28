# Plan: Review severity unification

## Approach
Collapse `dx-plan-review`'s `[Blocker]`/`[Consider]` tags and `dx-impl-review`'s dimension-name tags into one shared severity vocabulary (`Blocker`/`Consider`), owned by `review-report.md`. `dx-impl-review` findings keep their dimension visible via a compound tag `[<Dimension>: <Severity>]` (e.g. `[Safety: Blocker]`) rather than losing it — the dimension and the severity are two different axes, both worth keeping. The per-report top-level verdict shapes stay as they are (`plan-review.md`'s single sound/revise/rethink line; `impl-review.md`'s per-dimension PASS/WARNING/FAIL block) since those are a different, aggregate concept the effort didn't ask to unify. Add a required **Why it matters** field to the shared finding format, distinct from **Detail** (what's wrong) — closing the gap research found where impact was only ever implicit.

## Standards to apply
- [ ] `skill-authoring.md` — Skill authoring: SKILL.md edits that change behavior (not a pure copy-edit) go through `skill-creator`, not a hand-edit in isolation; run its eval pass if the tag-format change is non-trivial enough to affect triggering/behavior checks.
- [ ] `skill-authoring.md` — Token efficiency: shared content (the finding format, the severity vocabulary) stays in `dx-references/references/review-report.md`, pulled by topic — not duplicated into the two skill files.

## Priors & gotchas
- `foundation/lessons.md` does not exist yet in this repo — nothing to check.
- Research (`context/efforts/sdlc-hardening/research/sdlc-hardening.md` §5) already confirmed the exact divergence and that `review-report.md` codifies the split as a deliberate design choice, not an oversight — so the fix is editing `review-report.md` itself, not just the two skill files.
- `dx-review-triage` reads `Resolution:` only, never parses the `[<tag>]` bracket — safe to change its contents without touching `dx-review-triage/SKILL.md`.

## Phases

### Phase 1: Unify the shared finding format in `review-report.md`
End-to-end for the reference file: rewrite the finding-format block to include **Why it matters**, and rewrite the `<tag>` rule so both report types draw from one shared severity vocabulary — `Blocker` / `Consider` — with `impl-review.md` using the compound form `[<Dimension>: <Severity>]` and `plan-review.md` using the bare form `[<Severity>]`. Leave the "Per-report specifics" section's two verdict shapes (sound/revise/rethink; per-dimension PASS/WARNING/FAIL) untouched — confirm in the same pass that nothing there still refers to the old per-report tag split.

### Phase 2: Update `dx-plan-review` and `dx-impl-review` to match
Update `skills/dx-plan-review/SKILL.md`'s "Write and print the findings" section: no vocabulary change needed (it already emits `[Blocker]`/`[Consider]`) — confirm wording still matches the reference and mentions **Why it matters** is now part of the format it follows. Update `skills/dx-impl-review/SKILL.md`'s "Write and report" section: findings are now tagged `[<Dimension>: <Severity>]` instead of dimension-only; the per-dimension **Verdicts** block stays as-is. Route both edits through `skill-creator` per the matched standard, since the impl-review tag change alters observable output.

### Phase 3: Sync `docs/reference/skills.md`
Update the `/dx-impl-review` **Writes** line (currently "a per-dimension PASS/WARNING/FAIL verdicts block plus tagged findings") to name the compound `[Dimension: Severity]` tag. Check the `/dx-plan-review` **Writes** line still reads correctly (it already says "a concise `[Blocker]`/`[Consider]` findings list") — no change expected there, confirm only.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Unify the shared finding format in `review-report.md`
#### Automated
- [x] 1.1 `review-report.md` finding format includes **Why it matters**; `<tag>` rule defines one shared Blocker/Consider vocabulary with impl-review's compound form documented — 57c9be2

### Phase 2: Update `dx-plan-review` and `dx-impl-review` to match
#### Automated
- [x] 2.1 `dx-plan-review/SKILL.md` confirmed/updated to match the new finding format
- [x] 2.2 `dx-impl-review/SKILL.md` updated to emit `[<Dimension>: <Severity>]` tags

### Phase 3: Sync `docs/reference/skills.md`
#### Automated
- [ ] 3.1 `/dx-impl-review` Writes line updated to name the compound tag; `/dx-plan-review` Writes line confirmed unchanged
