---
change_id: add-dx-distill-skill
title: Add dx-distill — a foundation-layer skill that distills raw material into an evidence-tagged brief
type: feature
effort: null
slice: null
status: implementing
created: 2026-09-18
updated: 2026-09-18
archived_at: null
---

## Notes

Modeled loosely on `open-mercato/skills`' `om-discover` (researched via GitHub, not copied — see
`brainstorm.md` for source links and what was kept vs. cut). Scope is not fixed by the skill: it
scales with whatever raw material the user hands it, from a single idea up to a whole product — no
artificial ceiling. The two mechanics that earned a place are (1) distilling messy raw input (a
transcript, partial spec, discussion notes) into one structured brief, and (2) the full per-claim
evidence-tag discipline from `om-discover` — not trimmed, per user direction: observation vs.
decision vs. hypothesis, a hard gate against inventing facts or sources, a skeptic-pass check
against the draft, and a coverage-arithmetic reporting line — that nothing in this workflow
currently has at the claim level; `dx-research`'s provenance is per-file, not per-claim.

Explicitly cut from `om-discover`: tracker read integration and prototype/panel handoffs (unrelated
to the evidence discipline — see `brainstorm.md`'s Not doing). The skeptic pass and coverage
reporting stay in, since they're load-bearing parts of the same discipline, not separable ceremony.

The three named discovery *modes* were investigated directly (`references/modes.md`/`voice.md`,
raw) before dropping them, per user request. They vary on three axes — source priority, which extra
brief sections activate, and who signs the Definition of Ready. The sign-off axis doesn't apply
solo; the `own`-mode sections already exist in `dx-brainstorm`. Source priority and the
`existing`-mode sections (compat/impact-on-existing-data) are real and uncovered, so they're kept —
**not** as a user-declared `--mode` switch, but as material-driven auto-detection: `dx-distill`
inspects what the raw material actually contains (code/compat refs → weight `[PRODUCT]` tags +
surface a compat/impact check; transcript/meeting-notes shape → weight `[INTERVIEW]`/`[DOCUMENT]` +
flag conflicting asks; bare unsourced assertions → weight `[ASSUMPTION]` + lean on the
riskiest-assumption framing) the same way `type` already activates plan characteristics without the
user naming one.

**Not a discovery-entry skill.** Per user direction, `dx-distill` does not promote its output into a
change/effort container the way `diagnose`/`refactor-discover`/`brainstorm` do. It writes a durable
artifact under `context/foundation/distills/` — the tier `foundation/research/` already occupies for
durable, reusable investigations (§7.5) — and stops. `dx-new` is the sole downstream consumer: the
user optionally points it at a specific distill, and `dx-new` resolves that into seed context for
the change/effort it's creating, the same way it already inherits an effort's upstream research/
frame. This means `dx-distill` never decides change-vs-effort itself — that stays `dx-new`'s call
(§4) — and `dx-frame`/`dx-plan` likely need no direct read-logic of their own, since they'd read
whatever `dx-new` already seeded into the container (confirm during planning).

Scope touches:
- New skill `skills/dx-distill/SKILL.md`. Reads raw material the user points at (pasted text, file
  paths, a transcript), auto-detects the existing/client/own-shaped emphasis from what the material
  actually contains (no `--mode` argument) and activates the matching checklist/extra-section
  behavior, tags each substantive claim by evidence provenance, separates
  observation/decision/hypothesis, runs a skeptic-pass check against the draft before presenting it
  — all 5 of `om-discover`'s checks (source fidelity, problem, solution fit, test, scope/usability),
  each finding carrying an exact sentence + source path and a `CRITICAL`/`WARNING` severity mapped
  onto the `interview` reference's existing critical-interrupts/non-critical-caveat rule, not a
  second vocabulary (per `DESIGN.md` §3: a built-in `general-purpose`/`Explore` subagent, no
  dedicated agent), and
  writes the brief under `context/foundation/distills/` (exact shape — one file vs. a directory with
  capture-template companions — open, see `brainstorm.md`). Output contract gets a coverage-
  arithmetic line (claims tagged, sourced vs. synthetic vs. assumed) mirroring `om-discover`'s.
- `dx-new` — needs a pointer/argument to select a distill and fold it into the new container's seed
  research/frame; a new row in `DESIGN.md` §7.6's cross-skill-format table documents that hand-off.
- `DESIGN.md` — a new mention near §7.5 (research homes) introducing the `foundation/distills/` tier
  as a sibling to `foundation/research/`, and a note in §4/§6 that `dx-new` can optionally seed from
  a distill. **Not** a new §9 subsection — `dx-distill` isn't a discovery-entry skill.
- `foundation/glossary.md` — a new term for the artifact/claim-tag vocabulary (name TBD in framing;
  must not collide with the existing Research/Frame/Brainstorm _Avoid_ lists, and must be
  distinguished from Research now that both live at the same foundation tier).
- `docs/reference/skills.md` + relevant tutorial/explanation pages, per the doc-sync rule in this
  project's `CLAUDE.md`.
- A changeset (`npx changeset`) once the skill diff lands, since it touches `skills/**`.

Open questions carried into framing/planning: exact claim-tag vocabulary and its markdown shape;
what to name the artifact and its glossary term; the exact `context/foundation/distills/` shape;
and the exact `dx-new` pointer/argument syntax for selecting a distill.
