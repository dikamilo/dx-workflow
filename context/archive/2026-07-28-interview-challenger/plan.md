# Plan: Interview challenger pass

## Approach
Add a challenger pass as **Step 5** of the existing 4-step loop in `skills/dx-references/references/interview.md`: after the last branch resolves (step 4) and before the conclusion is presented, run one adversarial pass against that conclusion using a small fixed checklist (strongest objection, cheaper alternative, downstream breakage, hidden assumption). Critical findings interrupt with a question back to the user instead of being self-resolved; non-critical findings get folded into the conclusion as a visible caveat, not discarded and not blocking. Because the step lives inside the shared loop itself, every consumer (`dx-frame`, `dx-plan`, `dx-roadmap`) picks it up automatically with no SKILL.md call-site changes. `dx-lesson` stays excluded — it never invokes `interview`.

## Standards to apply
None matched — this is a documentation-only edit to a shared reference file; no code/test/style standard applies.

## Priors & gotchas
None in `foundation/lessons.md` (file does not exist yet in this repo).

## Phases
### Phase 1: Add the challenger step to `interview.md`
End-to-end and demoable: read the current file, append Step 5 to "The loop" section with the fixed checklist and the critical/non-critical handling rule, keep the file's existing terse/enumerated style. Verify by re-reading the file and confirming `dx-frame`, `dx-plan`, `dx-roadmap` need no edits (all three already load `interview` for a consequential, hard-to-reverse decision per the effort's research).

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: Add the challenger step to `interview.md`
#### Automated
- [x] 1.1 Step 5 added to `skills/dx-references/references/interview.md`'s loop with checklist + critical/non-critical handling, style matches existing file — 91fce47
- [x] 1.2 Confirmed no edits needed in `dx-frame`, `dx-plan`, `dx-roadmap` SKILL.md (they inherit the step via the shared reference) — 91fce47
