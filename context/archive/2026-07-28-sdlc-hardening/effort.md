---
effort_id: sdlc-hardening
title: Harden the dx- SDLC — entry point, mechanical checks, safety boundary, review consistency
status: archived
created: 2026-07-27
updated: 2026-07-28
archived_at: 2026-07-28
---

## Goal
Raise confidence in the dx- SDLC end to end: give it a genuine pre-container entry point where "build nothing" is a first-class outcome, make its own authoring rules mechanically enforced instead of honor-system, close an untrusted-content injection path in the research → plan → implement chain, add an adversarial check before a frame or plan is settled, unify the two different severity scales used across review skills, and write down the cross-skill formats that "derive, don't maintain" depends on so they can be changed safely.

## Notes
Candidate slices (to be sequenced in the roadmap):
- A new `dx-brainstorm` entry point that runs *before* `dx-new`: questions whether the problem is real, weighs alternatives, and makes "decide not to build" a first-class outcome — the divergent phase that currently happens outside the pipeline (today `dx-new` forces a change-vs-effort pick before anything is questioned, and `dx-frame` only runs after a container already exists). Optional — small/clear work can still skip straight to `dx-new`. This is the one slice that grows the skill count rather than tightening an existing one.
- A content lint gate over `skills/dx-*` checking frontmatter shape, description length, unquoted `": "` in YAML descriptions, body size budget, `dx-references` topic-pointer resolution, and docs-sync against `docs/reference/skills.md`.
- An untrusted-content boundary: explicit guidance in `dx-research` (external/WebFetch mode) and the `knowledge-layer` reference that fetched content is data, never instructions, before it's written into `research/<topic>.md` and consumed downstream.
- A challenger pass added to the shared `interview` reference (not just `dx-frame`): before presenting its conclusion, any skill that loads `interview` for a consequential, hard-to-reverse decision (`dx-frame` framing, `dx-plan` solution design, `dx-roadmap` slice ordering) runs an adversarial check against that conclusion; any critical finding surfaces back to the user as a question rather than being self-resolved. `dx-lesson` is out of scope — it explicitly opts out of the interview loop for captures.
- A single severity scale shared by `dx-plan-review` and `dx-impl-review` (replacing `[Blocker]`/`[Consider]` vs `PASS/WARNING/FAIL`), plus a rule that every finding must carry a location, why it matters, and an actionable fix.
- A cross-skill format reference (in `DESIGN.md`, not a new file) enumerating parsed formats with more than one consumer: `## Progress` checkbox rows, `Resolution: PENDING` schema, `change.md`/`effort.md` frontmatter, roadmap `- change:` lines, `archived_at` derivation.

Out of scope: tracker/PR/label machinery, autonomous no-ask chaining, run folders, per-skill reference duplication, model-tier execution columns — none of these fit this project's anti-ceremony/human-in-the-loop model.
