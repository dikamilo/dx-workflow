---
created: 2026-07-29
---

# Brainstorm — trim-design-doc

## The question
`DESIGN.md` (501 lines) is edited on nearly every effort that touches `skills/` — most recently
`sdlc-hardening`, which had to update it across several slices — on top of the `docs/` sync `CLAUDE.md`
already requires. Is that recurring edit cost paying for something unique, or is `DESIGN.md` now largely
restating state that already lives (and is kept current) elsewhere?

## Alternatives weighed
- **Do nothing.** Cost: every skill-touching effort keeps paying a second doc-sync tax on top of the
  mandatory `docs/` update — confirmed recurring (this project's own `git log` shows `DESIGN.md` edited in
  the `dx-brainstorm` and `sdlc-hardening` efforts alongside their `docs/` updates). Benefit: one coherent
  single-file read of the whole design. Lost — the benefit doesn't require the redundant sections, only the
  rationale ones.
- **Delete `DESIGN.md` entirely, migrate content into `docs/` + `context/standards/`.** Rejected: `DESIGN.md`'s
  audience is people *authoring* this skillset; `docs/` is Diátaxis content for people *using* the workflow
  in their own project — `CLAUDE.md` already draws this exact split ("It is not installed with the skills").
  Folding authoring rationale (why no dedicated agents, why no ADR register, the anti-ceremony rules) into
  user-facing tutorials/explanations would blur that split, and nothing in `docs/` or `standards/` currently
  hosts that rationale — it would need a new home, not just deletion.
- **Trim, don't delete (chosen).** Keep only what has no other home: the design thesis and rationale
  (§1 thesis, §3 why-no-agents, §6 knowledge-layer distinctions/minimalist fallback, §9 discovery-entry
  rationale, §13 user/model-invoked doctrine, §14 anti-ceremony rules). Cut or shrink what verifiably
  duplicates a maintained doc elsewhere: §5 directory layout (mirrored in
  `docs/explanation/directory-layout.md`, 149 lines), §6 full skill inventory table (mirrored and kept more
  current in `docs/reference/skills.md`, 305 lines, checked and confirmed to list all 21 current skills),
  and §15 "build order" (purely historical — the build already happened). This is the only option that
  removes the routine edit surface (adding a skill no longer means adding a table row and a directory-tree
  line in *two* places) while keeping the one thing genuinely homeless outside `DESIGN.md`.

## Conclusion & route
Trim `DESIGN.md` to design-thesis-and-rationale content; delete/shrink the sections that duplicate
`docs/reference/skills.md` and `docs/explanation/directory-layout.md`; drop the now-purely-historical build
order. Routed as **one shippable unit** (ramp 3, a change) — this is a single documentation restructuring,
not independently-shippable capabilities, so no effort/roadmap.

**Caveat (non-critical, left standing):** several *archived* records (`context/archive/2026-07-28-dx-brainstorm/**`,
`context/archive/2026-07-28-sdlc-hardening/**`) cite specific `DESIGN.md:<line>` / `§<n>` anchors that will
shift or disappear once trimmed. These are frozen historical artifacts, not live pointers — nothing under
`skills/` or the current `context/` tree references a `DESIGN.md` line number — so this is left as-is
rather than back-patched. `dx-plan` should still re-check for any exact-schema pointers (`CLAUDE.md`'s "§4"
reference, `dx-references/references/*.md`'s "see DESIGN.md for exact schema" lines) that need retargeting
if section numbers move.

**What breaks if this succeeds:** the next skill addition risks documenting only in `docs/` and skipping
`DESIGN.md` rationale updates silently, if the trimmed doc's remaining scope ("rationale only") isn't made
explicit enough at its own top. The plan should state that boundary in `DESIGN.md`'s own header so a future
editor doesn't re-add derivable content out of habit.

## Resolved unknowns
| Question | Answer |
|---|---|
| Delete entirely, or trim? | Trim — the rationale content has no other home; full deletion would strand it. |
| Does `docs/` already cover the sections being cut? | Yes, confirmed: `docs/reference/skills.md` (skill inventory, more current) and `docs/explanation/directory-layout.md` (directory layout) both exist and are actively maintained per `CLAUDE.md`'s "Keep docs in sync" rule. |
| Does this need a changeset? | No — `CLAUDE.md` exempts changes to `DESIGN.md` (a non-`skills/` path) from the changeset requirement. |
| Effort or change? | Change — one shippable unit, not independently-shippable capabilities. |

## Not doing
- Not deleting `DESIGN.md` outright.
- Not moving authoring rationale into `docs/` (wrong audience) or into `context/standards/` (rationale, not
  a prescriptive rule).
- Not back-patching line/section references inside archived (`context/archive/**`) records.
- Not touching `skills/` — this change is documentation-only.
