# Plan: Trim DESIGN.md to rationale-only

## Approach
`DESIGN.md` currently mixes design rationale (which has no other home) with content that duplicates
maintained docs elsewhere (`docs/reference/skills.md`, `docs/explanation/directory-layout.md`,
`docs/explanation/research-and-frame.md`) or duplicates other reference material already loaded via
`dx-references` (`interview.md`'s question-scaling table, `module-design.md`'s refactor vocabulary,
`plan-template.md`'s conditional-phase list). Per the brainstorm, we keep the rationale and cut/shrink
the verified duplicates, leaving pointers instead. The extended audit (this plan) additionally caught two
duplicates the brainstorm didn't name: §7.4's handoff-scaling table (stale — missing the `+ brainstorm.md`
row that `interview.md`'s table already has) and §7.5's research provenance schema (verbatim-covered by
`docs/explanation/research-and-frame.md`).

No section is deleted except §15 (purely historical, no replacement). All other cuts are content trims
*within* existing sections, so section numbers 1–14 are unaffected — `CLAUDE.md`'s "see DESIGN.md §4"
pointer stays valid without edits.

### Edits
1. **Top blockquote** — add one line stating the doc's new scope: rationale only; skill inventory and
   directory layout live in `docs/`; don't re-add them here out of habit (the brainstorm's "what breaks"
   caveat).
2. **§5 Directory layout** — cut only the per-project `context/` tree (verified duplicate of
   `docs/explanation/directory-layout.md`); keep the plugin-root `skills/dx-*/` tree and the "why
   references are an invocable loader skill" rationale + YAML (authoring-only content, no home in
   `docs/`). Replace the cut tree with a one-line pointer.
3. **§6 Skill inventory** — drop the header's stale count ("20 workflow skills, 0 agents, 0
   orchestrators" → "0 agents, 0 orchestrators" stays as a durable invariant, the growing count doesn't)
   and drop the full per-skill table (verified duplicate of `docs/reference/skills.md`, which is kept
   more current). Replace the table with a one-line pointer. Keep the "Model-invoked (2)" and
   "Deliberately not included" paragraphs — they're rationale, not inventory.
4. **§7.4 Handoff scaling** — trim to the one-line principle ("every artifact passed in is a decision
   already made") + a pointer to `interview.md`'s question-scaling table (more current — it already has
   the `+ brainstorm.md` row DESIGN's copy lacks). Resolves a stale-duplicate conflict per the "surface
   conflicts, don't average them" rule: `interview.md` is the more-current, more-read copy, so it wins.
5. **§7.5 Research** — trim to a short paragraph (multi-topic, multi-mode, one file per topic) + a
   pointer to `docs/explanation/research-and-frame.md`, which already covers the two modes and the
   provenance frontmatter schema verbatim. Keep the "two research homes" one-liner (not covered there).
6. **§11 Refactor as change-type** — keep the opening rationale (why refactor is a `type`, not a separate
   workflow) and the closing paragraph (single change vs. effort+roadmap). Cut the restated
   characteristics list (module-design reference, behavior-preserving gate) — it's a verbatim duplicate of
   `plan-template.md`'s "Conditional phases by type" and `module-design.md`'s own content; replace with a
   pointer to both.
7. **§15 Build order** — delete entirely. Purely historical (the build already happened); nothing reads
   it going forward.

§7 (7.1–7.3, 7.6), §12 (standards seed) were audited and left untouched: 7.1/7.2 already follow the
brief-plus-pointer pattern; 7.3 is `progress-format.md`'s exact contract inlined for at-a-glance authoring
and is short enough not to be worth trimming; 7.6 is a meta-index by design, not a duplicate; §12's
three-file description matches `skills/dx-init/assets/standards/global/*.md` exactly and isn't documented
elsewhere.

## Standards to apply
None matched — `context/standards/global/` holds only `skill-authoring.md` and `scripts.md`, neither of
which applies to a `DESIGN.md`-only edit (not a skill, not a script).

## Priors & gotchas
None from `foundation/lessons.md` bear on this change (its one entry concerns skill eval coverage).

## Phases

### Phase 1: Trim and add pointers
Apply edits 1–7 above to `DESIGN.md` in one pass.

### Phase 2: Verify no stale references
Confirm nothing broke: `CLAUDE.md`'s `DESIGN.md §4` pointer still lands on the two-level model section;
`docs/README.md`'s link to `../DESIGN.md` still resolves; the doc reads coherently top to bottom after the
cuts. No code path depends on `DESIGN.md`'s content, so this is a manual read-through, not an automated
check.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Trim and add pointers
#### Automated
- [x] 1.1 Top blockquote carries the new scope-boundary line
- [x] 1.2 §5 keeps plugin-root tree + loader rationale, drops the per-project `context/` tree, adds pointer
- [x] 1.3 §6 header count dropped, table replaced with pointer to `docs/reference/skills.md`
- [x] 1.4 §7.4 trimmed to principle + pointer to `interview.md`
- [x] 1.5 §7.5 trimmed to short paragraph + pointer to `docs/explanation/research-and-frame.md`
- [x] 1.6 §11 keeps rationale paragraphs, drops restated characteristics list, adds pointer
- [x] 1.7 §15 deleted entirely
#### Manual
- [ ] 1.8 Full read-through: doc is coherent, no orphaned cross-references

### Phase 2: Verify no stale references
#### Manual
- [ ] 2.1 `CLAUDE.md`'s `DESIGN.md §4` pointer still correct
- [ ] 2.2 `docs/README.md`'s `../DESIGN.md` link still resolves
