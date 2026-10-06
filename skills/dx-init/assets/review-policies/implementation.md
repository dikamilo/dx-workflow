---
targets: container
---

The post-implementation gate: was what got built what `plan.md` planned, and is it safe, well-structured and standards-compliant?

## Preconditions
- The container is a Change (under `context/changes/`) with a `plan.md`. Otherwise point at `/dx-plan <change-id>`.
- `plan.md`'s `## Progress` has no `- [ ]` left. Otherwise the change isn't finished: say so and point at `/dx-implement <change-id>`.

## Load
- `plan.md` in full, especially its **Standards to apply** checklist, its **Priors & gotchas**, and any `## Data model`, `## API & contracts` or `## Failure modes & reversibility` section. Note the `type` field in `change.md`.
- The diff scope: `git log`/`git diff` for the commits that landed this change's phases (their SHAs are in `## Progress`).
- Invoke `dx-references` with `knowledge-layer`, which explains how to verify standards compliance.
- When `type: refactor`, also invoke `dx-references` with `module-design` for the depth, seam and deletion vocabulary.

## Dimensions
Tag findings `[<Dimension>: <Severity>]`, e.g. `[Safety: Blocker]`. The dimension and the severity are separate axes, and both should stay visible.

### Plan-Drift
Does the diff match what `plan.md` planned? Flag intent mismatches, skipped items and unplanned scope (extra files or behavior the plan didn't name). Check the diff against every conditional section the plan carries (`## Data model`, `## API & contracts`, `## Failure modes & reversibility`). A documented undo path or migration that was never shipped is Plan-Drift.

### Safety
Look for data loss, destructive or irreversible operations, missing error handling at boundaries, hardcoded secrets and injection.

### Patterns
Is the structure sound, judged with the `module-design` vocabulary? Deep or shallow modules, clean seams, an interface that leaks. Report substantive mismatches with sibling code, not style nits.

### Standards
Did the change follow the plan's matched **Standards to apply**? Cite the standard for each miss. If `context/standards/` doesn't exist yet, mark this `N/A`, not `PASS`, and add a `Consider` finding that points at `/dx-standards-discover`.

## Extra checks
**Refactor gate (`type: refactor`).** Verify the behavior-preserving gate. Tests must be green before and after, observable behavior must be unchanged, and depth, locality or testability must actually improve, not just look cleaner.

## On pass
A pass means no unresolved `Blocker` finding. On a pass, set `change.md` `status: reviewed` and `updated: <today>`.

## Next
- `/dx-lesson` — record a finding worth keeping, if one was offered above
- `/dx-archive <change-id>` — the change passed, so retire it
