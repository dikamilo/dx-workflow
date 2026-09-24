# Skeptic prompt — the fresh-context read

The author of a draft is its worst reader: they know what they *meant*, so they see support that isn't on the page. The cure is a reader with none of that context.

Spawn a built-in **`general-purpose`** subagent (no dedicated agent). Give it the draft, the detected emphasis, the decision the brief supports, and the cited source paths — including `<slug>.interview.md`, so the interview claims are checkable too. Pass the sources as **paths, not inlined content** — a reviewer handed your excerpt is checking your transcription, not the source, which defeats the point. It should open what it needs and not wander into unrelated research. Under `--quick`, run the same checks inline and state plainly that there was no independent reading.

## The prompt

```text
Read this brief as a researcher helping decide what to do next. Open the cited sources. Check:

1. Source fidelity: does each claim say only what its source supports? Keep observed behaviour,
   stated preference, a human's decision, and an untested hypothesis apart. Check quotes, numbers,
   whether sources are actually independent of each other, and provenance.
2. Problem: can it be stated without naming the proposed solution? Whose real situation supports
   it? Are inferred motives and causes distinguished from the account itself? What is still
   unknown about its frequency or cost?
3. Solution fit: would the Now scope address that problem under the conditions in the material?
   Where the approach was open, is the choice over a relevant alternative explained? Respect
   settled scope. Expose mismatches in timing, access or effort. Do not shrink the observed need
   to fit the proposal.
4. Test: does the next experiment test the assumption that could actually change the decision, or
   a safer one standing in for it? Name the observed result that would settle it. A statement of
   intent is not a purchase. Do not invent a numerical target.
5. Scope and usability: does Now complete the stated job, or is it plainly an experiment? Are
   consequential blockers visible in the Decision summary? Can a new reader find the decision, its
   basis and the next action without digging?

Use the emphasis only to focus the checks: material about an existing product may hide overlooked
users or compatibility risk; a client's or stakeholder's material may hide competing deciders or
requested features with no stated reason; a bare internal idea may have no evidence beyond the
team's own belief. Don't demand rollout detail for an experiment that touches no live users or data.

For each finding, return:
- The exact sentence or row, and the relevant source path.
- Severity: CRITICAL when it misstates evidence or changes scope or readiness; WARNING otherwise.
- Resolution: either a correction you can support from the cited material, or a missing fact or
  human decision.
- The correction itself, or one plain question about the unknown. Never recommend an answer to a
  question about someone's experience or evidence.

If the brief holds, say briefly why. Do not add praise, or findings invented to fill a report.
```

Checks 2–4 apply to whatever the **raw material already asserts** — the skeptic checks that the brief represents those claims faithfully; it doesn't originate a problem, a solution, or a test of its own.

## Handling what comes back

`CRITICAL` / `WARNING` map onto the `interview` reference's existing split, so there's one severity vocabulary rather than two: a critical finding interrupts with a question to the user; a non-critical one folds into the brief as a visible caveat.

Correct the skeptic's own errors from the sources, and disclose any material correction. A correction that would change an already-agreed decision is **surfaced to the user, not applied** — the decision stands until they move it. Recheck anything you changed before writing.

The pass is fallible in one specific way worth stating: its checklist shares a lineage with the brief's own rules, so agreement between the two is weak evidence. Report what it found, never that it approved.
