---
name: dx-frame
description: Interview to settle the problem framing, alternatives, and user cases for a change or effort before planning — writes frame.md. Run again on one of an effort's slices to add that slice's own user cases.
disable-model-invocation: true
argument-hint: [change-id or effort-id]
---

# dx-frame

Settle the **WHAT** before the **HOW**. Run a deep interview on problem framing and alternatives for a change or effort, then write `frame.md` in its folder. The interview is the cure for misalignment — a perfect plan on the wrong problem loses the day. This makes the framing half explicit and skippable, so `dx-plan` can jump straight to solution design.

**Guard.** Resolve `<id>` under `context/changes/` **or** `context/efforts/`. If it is missing, tell the user to run `/dx-new` first. If the path is under `context/archive/`, refuse — an archived container is done.

**Slice mode.** If `<id>` is a change with `effort: <effort-id>` set **and** that effort's `frame.md` already exists, this run is scoped to user cases only: the four core sections (real problem, who/what it affects, alternatives, out of scope) are already settled at the effort level — don't re-ask or rewrite them. Interview and write only this slice's own `## User cases`, additive to the parent's. If the parent effort has no `frame.md` yet, there is nothing to inherit — fall through to full framing below.

## 1 — Gather settled context

Read `change.md` (or `effort.md`) — note `type` and, for a change, `effort:`. Read every existing `research/<topic>.md`, and `diagnosis.md` and `brainstorm.md` if present, as **settled context**; don't re-ask what research already answered. A `brainstorm.md` already chose the route and priced the do-nothing — deepen its `## Conclusion & route` into a full framing rather than reopening it, and treat its `## Not doing` as out of scope already decided. In slice mode, also read the parent effort's `frame.md` in full, including its `## User cases` if present — those flows are already covered. Read `foundation/glossary.md` for naming (a one-line habit — no section). Each artifact is a decision already made.

If the interview below surfaces a term that clashes with the glossary, is vague/overloaded, or finally gets pinned down, invoke `dx-domain` right then — don't just note it and keep talking.

## 2 — Interview (invoke `dx-references` with `interview`)

**One question at a time, each offering a few concrete options with one recommended**, walking the decision tree until the framing resolves. If the codebase or a research doc can answer a question, explore instead of asking. Scale the count down by whatever upstream already settled. Stay on the **WHAT** — the real problem, the alternatives, and (when the work is user-facing) the concrete user cases it must cover — never solution design; that is `dx-plan`'s job. Don't manufacture a reframe: "the initial framing was right" is a valid outcome.

**User cases scale by batching, not by one question per flow.** Propose the candidate list as a single question (confirm or edit), then spend extra questions only on flows still ambiguous after that. For an **effort**, keep the list to headline flows that matter for slicing — a sketch, not exhaustive, since slices don't exist yet. In **slice mode**, propose only this slice's candidate additions — flows the parent's sketch didn't name or under-specified for this slice — never re-list what the parent already settled.

If `change.md`'s `type` is `refactor` (or this is a refactor effort), **also invoke `dx-references` with `module-design`** and frame in its vocabulary — deep vs shallow modules, seams, the deletion test.

## 3 — Write `frame.md`

**Slice mode** writes only `## User cases` to this change's own `frame.md` — this slice's additional or refined flows. Don't restate the parent's list or touch its file.

Otherwise, write the full frame in the container's folder (`context/changes/<id>/frame.md` or `context/efforts/<id>/frame.md`), capturing:

- **The real problem** — one sentence, root not surface.
- **Who / what it affects** — the users, systems, or code touched.
- **Alternatives considered** — the framings weighed, and why the chosen one wins.
- **Out of scope** — what this explicitly does not address.

**User cases** — an optional fifth section, inserted after "Who / what it affects": include it only when the work is user-facing (a UI flow, an API surface, a CLI command) and has more than one flow worth distinguishing. One line each: who, triggered by what, to reach what outcome; note where each came from (already documented upstream, or discovered in this interview) so a reader knows what was newly settled. Omit the section entirely for internal/structural work (a pure refactor, infra, a schema-only migration) — never write it empty or "N/A".

Keep it tight and scannable. No solution phases, no file changes — that is planning.

## Done when

**Slice mode:** this change's `frame.md` exists with `## User cases`. **Otherwise:** `frame.md` exists with the four core sections above, plus `## User cases` when it applies. Either way, the container's `updated: <today>` is set. Then print and stop:

```
Frame written: context/{changes|efforts}/<id>/frame.md
Next: /dx-plan <id>       (for a change)
  or: /dx-roadmap <id>    (for an effort)
```

Stop. Do not chain into another skill.
