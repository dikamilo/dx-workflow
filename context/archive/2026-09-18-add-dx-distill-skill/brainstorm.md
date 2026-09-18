---
created: 2026-09-18
---

# Brainstorm — add-dx-distill-skill

## Sources referenced
- `om-discover` skill definition: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/SKILL.md (directory: https://github.com/open-mercato/skills/tree/main/skills/om-discover)
- `references/brief-template.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/brief-template.md
- `references/evidence-tiers.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/evidence-tiers.md
- `references/context-gate.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/context-gate.md
- `references/quality-gate.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/quality-gate.md
- `references/interview-rounds.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/interview-rounds.md
- `references/modes.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/modes.md
- `references/voice.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/voice.md
- `references/skeptic-prompt.md`: https://raw.githubusercontent.com/open-mercato/skills/main/skills/om-discover/references/skeptic-prompt.md
- Full reference directory (not all individually fetched — also present: `agentic-setup.md`, `prototype-handoff.md`, `report-templates.md`, `rules.md`): https://github.com/open-mercato/skills/tree/main/skills/om-discover/references

Kept for `/dx-plan` and any future revisit of scope — this brainstorm and its brief-drafting logic
were reverse-engineered from these files, not copied; re-fetch them if the upstream skill changes.

## The question
Is there a missing capability in this workflow for turning messy raw material (a transcript,
partial spec, discussion notes) into a structured, trustworthy record that later work — `dx-new`,
`dx-frame`, `dx-plan` — can build on without re-deriving or re-guessing what it says? Scope (how
much the raw material covers — one idea, a module, or a whole product) is not fixed by the skill;
it follows whatever the user hands it.

The user's entry point was "add something like `open-mercato/skills`' `om-discover`," which is a
solution shape, not the problem — restated above without it.

## Alternatives weighed

**A. New skill (`dx-distill`), output at foundation level, not a container — chosen.** Ingests raw
material and writes an evidence-tagged brief, but **not** by promoting into a change/effort the way
`brainstorm.md` does. Instead it writes a durable, addressable artifact under
`context/foundation/distills/` (exact shape open — see caveats), the same tier `foundation/research/`
already occupies for durable, reusable investigations (§7.5). `dx-new` then optionally takes a
pointer to a specific distill and pulls it in as seed context when creating a change or effort —
mirroring how an effort's research/frame already seeds its child changes. Scope scales with
whatever raw material the user hands it — one idea, a module, or a whole product — the skill
imposes no ceiling; it's the user's input, not the skill, that decides how much ground the brief
covers. This also means **`dx-distill` never has to decide change-vs-effort itself** — that call
stays entirely `dx-new`'s (§4: "`new` is the router"), which dissolves the open question the
previous draft of this brainstorm carried about needing two promotion ramps.

**B. Extend `dx-research`.** `dx-research` already records provenance (topic, kind, source,
citation/code-ref) and already has a foundation-level durable home (`foundation/research/<topic>.md`,
§7.5) — the same tier `dx-distill`'s output now targets, which makes this alternative closer than it
first looked. Still not chosen: research's shape is one-file-per-topic, agent-driven investigation;
distillation is user-supplied raw material synthesized *across* multiple sources into one brief with
per-claim tags and a skeptic pass — a different consumption logic, the same reason this workflow
keeps standards/lessons/glossary as three separate registers despite looking like similar markdown
(§8: "look similar... do different jobs and have different lifecycles"). Living at the same tier
doesn't mean being the same artifact.

**C. Extend `dx-brainstorm`.** Fold raw-material intake and evidence tagging into brainstorm's
existing source-ladder-then-diverge flow, since it already produces a container-root artifact read
downstream. Not chosen: brainstorm's job is deciding *whether to build at all*; distillation is
about organizing evidence for something already worth building on, and conflating the two would
make brainstorm's exit ramps (including "nothing worth building") harder to reason about.

**Priced do-nothing.** Keep pasting raw material straight into `dx-brainstorm`/`dx-frame`/`dx-plan`
interviews and let the model read it ad hoc, untagged. Cost: for a solo workflow this is
moderate, not severe — `lessons.md` already catches decision+rationale, `frame.md` already catches
alternatives. The actual gap is narrower than "no product context": it's specifically that no claim
carries a provenance tag, so there's no structural check against the model treating an assumption,
a synthetic guess, or an invented source as a fact. That gap is real regardless of team size — it's
a defense against model hallucination, not a team-coordination overhead — which is why the
do-nothing loses here even though this is a personal project.

## Conclusion & route

**Route (for *this* work — building the skill): one change**, not an effort. Bundling test: would
"write the `dx-distill` skill" function without "wire `dx-new` to resolve a pointed-at distill into
seed context"? No — a distill nothing downstream reads is exactly the lost-handoff failure this
workflow already has a name for (`context/archive/2026-08-14-refactor-discover-promote-many-sketch`:
a sketch generated but not propagated is as useless as never generating it). The skill and its
read-side wiring are one shippable unit, however many files it touches. `type: feature` — new
capability, not a regression fix.

**Resolved during this round: `dx-distill` does not promote into a container, and is therefore not
a fourth discovery-entry skill in the §9 sense.** The three existing discovery entries
(`diagnose`/`refactor-discover`/`brainstorm`) all share the shape "produces a finding, then promotes
it into a standard container and gets out of the way." `dx-distill` doesn't promote anything — it
writes a durable, foundation-level artifact and stops; the container decision (change vs. effort,
if any) happens later and separately, when (and if) the user points `dx-new` at that distill. That
also means the earlier open question — "does `dx-distill` need both a change-ramp and an
effort-ramp" — dissolves: there is no ramp to choose, because `dx-distill` never creates a
container. `dx-distill` sits closer to `dx-research`'s foundation-level home and the knowledge-layer
producers (`domain-discover`, `standards-discover`) than to the three discovery entries — a
foundation-layer artifact producer, not a discovery entry.

**Riskiest assumption:** that adopting the evidence-tier discipline at full strength — including the
skeptic-subagent pass and coverage-arithmetic reporting, not just the tags — is worth its ceremony
here, given this workflow's explicit anti-ceremony bias and `DESIGN.md` §6's prior, deliberate cut of
"product-design." Reframed and accepted during convergence: the discipline's actual justification
isn't product/team coordination (om-discover's reason) but guarding against the model inventing
facts or sources — a risk present in any LLM-driven skill, independent of team size — and the
skeptic pass and coverage reporting are load-bearing *parts of that same discipline* in the original
skill, not separable ceremony on top of it, which is why the user asked for the whole process rather
than a trimmed cut of it. Cheapest test, carried into planning: before building the full skill,
hand-apply the full process (tags, skeptic pass included) to one real piece of raw material for a
change about to start, and check whether it catches something a lighter read would have missed. If
it doesn't earn its keep on a real case, that's a planning-time off-ramp, not a build-time one.

**What breaks if this succeeds:** a new foundation-level directory (`context/foundation/distills/`)
and artifact shape that `dx-new` must learn to resolve by pointer adds real surface area — a new row
in `DESIGN.md` §7.6's cross-skill-format table, a new glossary term that must not collide with
Research/Frame/Brainstorm's existing `_Avoid_` cross-references (and now must also be distinguished
from `foundation/research/`, since both live at the same tier), and doc-sync work per this project's
`CLAUDE.md`. Narrower than the earlier draft's estimate, though: because `dx-new` is the sole
consumer that needs new logic (folding a resolved distill into the new container's seed research/
frame the same way it already folds in an effort's upstream context), `dx-frame`/`dx-plan` likely
need **no** direct changes — they'd read whatever `dx-new` already seeded into the container, per
existing handoff-scaling (§7.4). Confirm that during planning rather than assuming it.

**Mode investigation (requested mid-brainstorm):** read `references/modes.md` and `references/voice.md`
directly (raw, not summarized). `om-discover`'s three modes actually vary on three separate axes,
not one: (1) **source priority** — `existing` starts from code/compat docs/usage data/support
tickets; `client` starts from stakeholder interviews/workshops/client documents; `own` starts from
team beliefs (`[ASSUMPTION]`) plus existing research; (2) **which extra brief sections activate** —
`existing` adds *What stays unchanged*/*Impact on existing data*/*Compatibility surfaces touched*;
`client` adds *Stakeholders and decider*/*Constraints and appetite*/*Systems and data*/*Rollout
plan*; `own` adds *Riskiest assumptions*/*Kill criteria*/*Primary metric*; (3) **who signs the
Definition of Ready** — product owner+compat maintainer / the client's decider / the team. Axis 3
is moot here — one person, no client decider, no separate product-owner role. Axis 2's `own`
sections already exist near-verbatim in `dx-brainstorm`'s divergence step (riskiest assumption +
cheapest test). Axes 1 and the `existing`-mode sections are the genuinely uncovered part: nothing
here currently changes what gets checked first, or flags compat/impact-on-existing-data concerns,
based on whether the raw material is about a shipped feature, a client-supplied spec, or a bare
internal idea.

**Mode-shaped behavior, without a mode switch.** Per the user's direction after this investigation:
don't reintroduce a `--mode` argument, but don't discard the substance either. `dx-distill` infers
the equivalent of a mode from what's actually *in* the raw material — code/compat references
present → weight `[PRODUCT]` tags and surface a compat/impact-on-existing-data check; a
transcript/meeting-notes shape → weight `[INTERVIEW]`/`[DOCUMENT]` tags and flag conflicting asks;
bare assertions with no traceable source → weight `[ASSUMPTION]` and lean on the riskiest-assumption
framing already shared with `dx-brainstorm`. This mirrors a pattern this workflow already has:
`type` activates plan characteristics (migration → rollback phase, refactor → behavior-preserving
gate) without the user naming a mode — material-driven activation, not a declared switch. Per
`om-discover`'s own "Choosing when it is unclear" section, multiple "modes" can already combine in
one session; auto-inferring removes the one part (a forced label) that added friction without
adding information the material didn't already carry.

**Skeptic-prompt investigation (requested mid-brainstorm):** read `references/skeptic-prompt.md`
directly (raw). It gives a fresh-context reviewer the draft, mode, current decision, and cited
source paths, and runs 5 checks: (1) source fidelity — does each claim say only what its source
supports; (2) problem — statable without naming the proposed solution; (3) solution fit — does the
chosen approach address the problem within stated constraints; (4) test — does the next experiment
actually test the risky assumption; (5) scope/usability — can a cold reader find the decision
without digging. Each finding carries the exact sentence + source path, severity `CRITICAL` (never
gets a suggested answer) or `WARNING`, and either an agent-correctable fix or a question back to a
human.

Flagged before adoption: #2–#4 are checks on problem-framing, solution choice, and experiment
design — decisions `dx-brainstorm`/`dx-frame` own, not `dx-distill`, which only organizes raw
material into a tagged brief. **User's explicit call: adopt all 5 as-is anyway.** Read charitably,
this still holds together — raw material itself often already *contains* problem/solution/test
claims (a transcript saying "we should build X to fix Y, tested by Z"), and the skeptic's job is to
check the brief represents those claims faithfully, not to originate a problem/solution/test
decision of its own. So checks #2–#4 apply to whatever the raw material already asserts, the same
way #1 does — `dx-distill` still isn't deciding anything, it's checking fidelity across all 5 axes
instead of just one. Severity vocabulary is reused, not duplicated: `CRITICAL`/`WARNING` map
directly onto the `interview` reference's existing "critical interrupts with a question / non-
critical folds in as a caveat" rule (step 5) — one canonical severity split, not two competing
ones, per §7.6's single-source-of-truth discipline.

**Caveat left standing:** the exact claim-tag vocabulary (which tags, how many, what markdown
shape), the new glossary term's name, the exact `context/foundation/distills/` shape (one file per
distill vs. a directory per distill with capture-template companions, mirroring `om-discover`'s
`interview-note`/`decision-record`/etc.), and the exact `dx-new` argument/pointer syntax for
selecting a distill are not settled here — routing-sufficient, not solution-ready; `/dx-frame`'s
interview or `/dx-plan` decides the mechanics.

## Resolved unknowns

| Question | Answer |
|---|---|
| Whole-product or per-idea scope? | Not fixed by the skill — scales with whatever raw material the user provides, from a single idea up to a whole product (user's explicit correction: don't artificially cap it) |
| New skill, or extend an existing one? | New skill, `dx-distill` — research and brainstorm each have a different job and shape |
| Is the evidence-tier discipline in scope? | Yes, full — same process as `om-discover`: all source tags (`INTERVIEW`/`DATA`/`DOCUMENT`/`PRODUCT`/`BENCHMARK`/`SYNTHETIC`/`ASSUMPTION`), the observation/decision/hypothesis split, the hard gate against invented facts, **and** the skeptic-subagent pass + coverage-arithmetic reporting that back that discipline — not trimmed (user's explicit correction). Tracker integration and the named discovery modes stay separate decisions, cut for unrelated reasons (see Not doing) |
| Single change or an effort, for *this* work (building `dx-distill`)? | Single change — the skill and its downstream read-wiring aren't independently shippable |
| Does `dx-distill` promote into a change or effort container, like `dx-brainstorm` does? | No (user's explicit correction) — it writes a durable artifact under `context/foundation/distills/` and stops; `dx-new` decides the container, later, only if and when a distill is pointed at |
| Is `dx-distill` a fourth discovery-entry skill (§9)? | No — it doesn't promote a finding into a container, so it doesn't fit that category; it's a foundation-layer artifact producer, closer to `dx-research`'s foundation home and the knowledge-layer producers |
| Should dropping `om-discover`'s mode mechanic also drop its behavior? | No — investigated `modes.md`/`voice.md` directly; source-priority and extra-section activation are real and uncovered, and survive as material-driven auto-detection (no `--mode` argument); only the sign-off axis and the explicit switch are dropped |
| Should the skeptic pass adopt all 5 of `om-discover`'s checks, or only the 2 (source fidelity, scope/usability) that look like `dx-distill`'s own job? | All 5, as-is (user's explicit call) — problem/solution-fit/test checks apply to whatever the raw material already asserts, not to a decision `dx-distill` itself makes; `CRITICAL`/`WARNING` severities map onto the existing `interview` reference's critical/non-critical rule rather than adding a second vocabulary |
| `type` to stamp? | `feature` |

## Not doing

- Promoting directly into a change/effort container, the pattern `dx-brainstorm` uses — rejected
  (user's explicit correction); `dx-distill` writes to a foundation-level, durable location instead,
  and never has to make a change-vs-effort call it has no good basis for making before `dx-new`'s
  own sizing step runs.
- `om-discover`'s three named discovery *modes* (`existing`/`client`/`own`) as a formal,
  user-selected `--mode` switch — investigated on request (see "Mode investigation" below) and
  still not adopted as an explicit argument. But the *substance* behind two of the mode's three
  axes survives as material-driven, automatic behavior — see the new "Mode-shaped behavior, without
  a mode switch" paragraph in Conclusion & route. Only the mechanic (a user-declared label) is
  dropped, not the checklist/section differences it used to gate.
- Read-only issue-tracker integration (`search-issues`, `get-issue`, etc.) — `DESIGN.md` §2 already
  lists external issue-tracker sync as deliberately excluded; not reopened here.
- Prototype/panel handoffs (om-discover's step 8) — no equivalent concept exists in this workflow
  and none was requested.
- Deciding the claim-tag vocabulary's exact shape and the glossary term's name — left for
  `/dx-frame`'s interview.
