# Frame — refactor-discover-principles

## The real problem

`dx-refactor-discover` finds too little and says too little about what it finds: its single lens is
also too thin to phrase a finding well, and every finding it produces states desirability without
feasibility.

The surface complaint in `change.md` was breadth-only ("the lens is too narrow"). Research showed
that is half the defect. The scan's vocabulary (`module-design`, six concepts) has no word for what
depth *buys*, no distinction between adapter and implementation, and no rule for when a seam is
justified at all — so a finding's "why it matters" has nothing to land on and degrades into "cleaner
code." Separately, a finding carries only a strength tag (`Strong | Worth exploring | Speculative`),
which is confidence, never whether the deepening can actually be tested afterward. Both halves are
in scope: deepen the primary lens *and* broaden the sweep.

The breadth half has two registers, and the scan currently has neither. **Principles** name what is
wrong (SRP, DRY, coupling). **Known shapes** — design patterns, architectural styles, and domain
archetypes — name what the code could become. A scanner that never asks "does a known shape fit
here?" will describe friction accurately and still miss the move that resolves it.

## Who / what it affects

- **`skills/dx-refactor-discover/SKILL.md`** — the scan (§2), the finding shape (§3), and the
  anti-drift clause (§1, which moves out).
- **`skills/dx-references/references/module-design.md`** — gains the missing judgment rules and a
  `## Rejected framings` section. Loaded by five skills, so every addition pays back at five call
  sites and clears the extraction bar automatically.
- **A new shared reference** (working name `design-principles.md`) — the named principle vocabulary
  plus the one-line prompt to consider known shapes. Two consumers: `dx-refactor-discover` (scan
  criteria) and `dx-plan` (**unconditionally**, in solution design — these apply to any design, not
  only refactors). That second consumer is what clears the ≥2 bar; without it this would stay inline
  per the house rule. *Naming note for planning:* the file now carries more than principles, so
  `design-principles` under-describes it; the house convention is to name a reference after the
  concept it shapes.
- **`skills/dx-plan/SKILL.md`** — one new unconditional reference load in §2.
- **Downstream promotion path** — `dx-frame`, `dx-research`, `dx-impl-review` load `module-design`
  only, on `type: refactor`. See the caveat below.
- **Docs** (`docs/reference/skills.md` incl. the hardcoded topic count, `docs/tutorials/find-refactors.md`,
  `docs/explanation/research-and-frame.md`) and a changeset — both mandatory per `CLAUDE.md`.
- **`context/foundation/glossary.md`** — unchanged. See "bounded context" below.

## Alternatives considered

**Deepen the one lens only** (the research's own recommendation, and the option with worked prior
art). Rejected: it answers the finding-quality defect but leaves the original complaint standing.
Nothing in the deepening makes a duplication or coupling problem findable.

**Broaden to a twelve-principle sweep only** (the original `change.md` framing). Rejected: the
mature comparable practice studied in research deliberately does *not* build a principle taxonomy,
investing in judgment rules, a feasibility axis, and anti-drift machinery instead. Breadth alone
would widen the net while leaving every catch under-described.

**Chosen: both.** They are separable slices and they compose — the deepening supplies the vocabulary
that the broadened sweep's findings must be cashed out into.

**Principle vocabulary inline in `dx-refactor-discover`** (one consumer, the house default, and the
cheapest edit). Rejected in favour of a shared reference once `dx-plan` was identified as a genuine
second consumer: design principles are applied during solution design, not only during discovery.

**Appending the principles to `module-design.md`** instead of a sibling file. Rejected: it would
force all five `module-design` consumers to load the breadth vocabulary whether or not it is live,
which is the exact context cost the reference split exists to avoid.

**`bounded context` in the principle list.** Dropped. `Seam` already owns this territory in the
glossary (`_Avoid_: Boundary`), and the prior art bans the term for precisely that collision. It is
a strategic model-ownership concept, not a code-shape scan criterion. No glossary change results, so
no `dx-domain` trigger fires.

**Enumerating design patterns** (a catalogue of pattern smells: switch-on-type → Strategy, manual
fan-out → Observer). Rejected. These are pretrained concepts; a catalogue is the sentence class the
no-op test deletes, and a checklist of patterns to satisfy is the canonical over-engineering failure
— it would pull directly against KISS and YAGNI standing in the same list. **Chosen instead:** a
single sentence encouraging the scan to consider whether a known design pattern, architectural style,
or domain archetype names the shape, when one genuinely fits. Recruitment, not a taxonomy.

**Patterns as discovery-only or planning-only.** Rejected both. They are considered during the scan
(that is where the opportunity is spotted) and named freely during solution design in `dx-plan`
(that is where the interface is actually designed). `dx-refactor-discover:30`'s "do not design
interfaces yet" survives untouched, because consideration is not design.

**Loosening the anti-drift clause** so style findings could use their natural words (ports, layers,
services). Rejected. The banned generic nouns stay banned **unconditionally**, and every finding is
reported in `module-design` terms regardless of which lens found it — a layering violation is stated
as "this module reaches through two interfaces to the store; the seam belongs at X." This is the
strongest promotion handoff available: downstream skills load `module-design` and nothing is lost.
It also resolves the `Adapter` name collision — with ports-and-adapters in scope, `module-design`'s
adapter *is* that sense, and GoF's Adapter is never named because nothing is enumerated.

**Per-lens win phrasing** (a finding states its benefit in whichever lens found it). Rejected for
losing fidelity at promotion. **Chosen instead:** a principle name is a diagnosis, never a win — every
finding must cash its principle out into a concrete consequence. "Violates SRP" is banned exactly as
"cleaner code" is; "changes for two unrelated reasons, so every pricing edit risks the tax path" is
the required shape.

### Caveats carried forward

**Handoff.** Narrowed, not closed. `dx-plan` will load the new reference, but `dx-frame`,
`dx-research`, and `dx-impl-review` still load `module-design` alone. The strict phrasing rule closes
this entirely for pattern/style/archetype findings, which arrive already in `module-design` terms.
The residual gap is only the principle lens, where a finding may name its diagnosis ("SRP: changes
for two unrelated reasons…"). The cash-out rule is the mitigation — a win stated as a concrete
consequence stays legible without the principle vocabulary loaded. Planning should verify this rather
than assume it.

**Strict phrasing has a real cost.** Considering a known shape improves what the scan *finds*, but
the finding cannot say so in the shape's own words. The value is therefore in detection, not
communication, and a reader will not see why the proposal takes the form it does. Accepted
deliberately in exchange for the clean handoff; if it proves too lossy in practice, the narrowest
relaxation is to allow a named shape inside the `Shape: before → after` line only.

## Out of scope

- **The lessons hard-skip.** `SKILL.md:16` retires a rejected candidate permanently; the
  better-calibrated rule is reopen-with-justification. This touches the knowledge layer rather than
  the vocabulary and is its own change.
- ~~**The operational design-it-twice** (parallel sub-agents under differing forcing constraints).
  Belongs to `/dx-plan`, and `dx-refactor-discover` explicitly does not design interfaces. Capture as
  a `dx-plan` refine op.~~ **Reversed during planning (2026-08-13), on the user's decision:** it lands
  in `dx-refactor-discover`, and `SKILL.md:30`'s "Do not design interfaces yet" is dropped — picking
  what to refactor requires some sense of how it might look. Opt-in, after the pick only. See
  `plan.md` Phase 4.
- **"Replace, don't layer"** test-migration guidance. Its consumers are `dx-plan` / `dx-tdd` /
  `dx-implement`, not this skill.
- **Unifying the strength tag with the repo's `Blocker`/`Consider` review severity.** No prior
  document proposes it, and the `plan-design-coverage` precedent rejected importing an external
  severity scheme.
- **Any HTML or report-file output.** Hard collision with the anti-ceremony rule; the separable value
  is captured by the one-line `Shape: before → after`.
- **Splitting `module-design.md`.** Only if it actually outgrows its purpose — a planning judgment,
  not a committed deliverable.
- **A pattern, style, or archetype catalogue.** No enumeration, no smell→pattern mapping table, no
  GoF list. One sentence of recruitment is the whole deliverable for this half.
- **New glossary entries.** Nothing in the surviving principle list — nor *pattern*, *architectural
  style*, or *domain archetype* — is domain vocabulary for this repo's own workflow. They describe
  the code of target projects, not the dx workflow, and the glossary is never a spec. "Archetype" was
  ambiguous and is pinned here in framing instead: it covers **both** whole-system architectural
  styles (layered, ports-and-adapters, event-driven, pipeline) **and** recurring domain-model shapes
  (Party/Role, Account, Transaction).
