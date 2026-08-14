---
topic: principle-vocabulary-placement
kind: codebase
source: repo/codebase
gathered: 2026-08-13
git_commit: 0cf2a8f3cf2b63e4b35ec3ea38e0ae61d2b41775
---

# Where the broader design-principle vocabulary should live

Investigates the open question `change.md` leaves for framing: how much (if any) of SOLID / KISS /
YAGNI / DRY / separation of concerns / bounded contexts / composition-over-inheritance /
orthogonality / robustness principle belongs in a shared `dx-references` topic vs. named inline in
`dx-refactor-discover`, and whether `module-design` stays the primary lens.

## 1 — The house rule has a settled answer, and it points inline

The extraction bar is normative and stated twice:

> Add a reference to `dx-references/references/` only when ≥2 skills use it; otherwise collocate it
> inside its one skill. — `CLAUDE.md:21`

> Content used by exactly one skill stays collocated inside that skill instead of being
> **prematurely extracted**. — `context/standards/global/skill-authoring.md:9`

`context/archive/2026-08-06-plan-design-coverage/plan.md` (`## Approach`) is the worked precedent
applying it *both ways in a single change* — three topics used by two skills became references;
scope cohesion, used by one, did not:

> Scope cohesion stays **inline in `dx-plan-review`** rather than becoming a reference: only one
> skill uses it, and the house rule extracts a reference only at ≥2 call sites — that alone
> justifies keeping it there.

The same plan also rejected bundling into one file precisely on context-cost grounds:

> Three files rather than one `plan-design-topics.md`: a single file would be loaded whole by both
> skills regardless of which concern is live, which is the exact context cost this split exists to
> avoid.

As scoped today the principle list has **one consumer** — `dx-refactor-discover`. That fails the ≥2
bar, and the archived precedent is directly on point. See §5 for the one condition that would flip it.

## 2 — Bare, unexplained concept lists are the established house idiom

`CLAUDE.md:20` states the style ("Leading words that recruit pretrained concepts … Apply the no-op
test: delete any sentence the model already obeys"), and skills already execute it. The strongest
precedent is nine named techniques with zero definition:

> Name **one command** — a failing test, curl, CLI diff, headless-browser script, trace replay,
> throwaway harness, fuzz/property loop, `git bisect run`, or differential run — …
> — `skills/dx-diagnose/SKILL.md:15`

Others: `skills/dx-impl-review/SKILL.md:21` (`data loss, destructive/irreversible ops, missing error
handling at boundaries, hardcoded secrets, injection`), `skills/dx-standards-discover/SKILL.md:18`,
`skills/dx-brainstorm/SKILL.md:22-27` (`the bundling test`, `priced do-nothing`, `strawmanning`),
`skills/dx-roadmap/SKILL.md:10` (`tracer bullet`, glossed in four words).

The no-op test is the accuracy argument, not just the token argument: a reference defining SOLID
would be twelve paragraphs the model already obeys unprompted. That is the sentence class the
standard says to delete.

## 3 — `dx-refactor-discover` already demonstrates the hybrid shape

The skill loads the reference **and** names its terms inline in the same sentence, with an explicit
anti-drift clause:

> Invoke `dx-references` with topic `module-design` — its terms (deep vs shallow, seam, the deletion
> test, "the interface is the test surface") are how every finding is phrased. Don't drift into
> "component / service / boundary." — `skills/dx-refactor-discover/SKILL.md:16`

That is the structural answer in miniature: **the reference carries judgment rules, the inline naming
carries the vocabulary anchor.** A broadened scan can reuse the pattern — keep the `module-design`
load, append a named principle sweep inline — without inventing a new mechanism.

Note also that the current inline heuristics at `SKILL.md:20` are *already* an unexplained list of
four friction signals, filtered by the deletion test. Adding named principles extends an existing
shape rather than introducing one.

## 4 — `module-design` is load-bearing and should stay primary

Five skills load it — `dx-refactor-discover:16` (the only unconditional one), `dx-plan:54`,
`dx-research:23`, `dx-frame:24`, `dx-impl-review:15` — all four of the others conditional on
`type: refactor`. `docs/explanation/research-and-frame.md:167-174` ("The refactor twist") names the
handoff this creates:

> So a shallow module like `config-loader` gets described and framed with the same words
> `/dx-refactor-discover` used to find it, and nothing is lost in the handoff.

**This is the strongest constraint on the change.** Findings phrased in a vocabulary the downstream
`/dx-plan`, `/dx-frame`, `/dx-research` and `/dx-impl-review` don't load will lose fidelity at the
handoff. Demoting `module-design` from primary lens would break that chain in four places; extending
the scan *alongside* it does not. Framing should treat "module-design stays primary" as near-settled
and spend its budget on how a non-module-design finding survives promotion into a `type: refactor`
change.

Size context: `module-design.md` is 23 lines covering six concepts (~3-4 lines each), and each entry
is a *judgment rule*, not a definition. It is the only pure-vocabulary file among the twelve
references (mean ~28 lines, max 52 — `effort-md.md`). A twelve-principle reference at that density
lands ~45-50 lines, the largest in the directory, and would be mostly definition.

## 5 — The one condition that flips the answer to "reference"

The ≥2 bar is met if the principle vocabulary is also meant to serve either:

- `skills/dx-impl-review/SKILL.md:22` — the **Patterns** review dimension, or
- `skills/dx-plan-review/SKILL.md:38` — **Architectural fitness**.

Both are plausible consumers of "is this SOLID/DRY/orthogonal?" reasoning. This is a real framing
decision, not a detail: it changes the deliverable from a ~5-line edit to one skill into a new
reference plus edits at three call sites. Framing should decide it explicitly rather than let it
default.

Prior art on how boundaries/coupling were handled last time this came up — they were judged
*already covered*, needing no new machinery
(`context/archive/2026-08-06-plan-design-coverage/brainstorm.md`):

> **Already covered, no change needed:** canonical mechanisms and boundaries/coupling fold into
> [existing dimensions]

## 6 — Cost of adding a reference (if §5 flips it)

Four hand-maintained lists, none derived:

1. `skills/dx-references/references/<topic>.md` — the new file.
2. `skills/dx-references/SKILL.md:3` — the topic list is hardcoded in the frontmatter description.
3. `docs/reference/skills.md:294` — hand-lists the topics **and hardcodes the count**: "one of the
   **twelve** topics". Adding one makes that word wrong.
4. `docs/reference/skills.md:262` — `dx-refactor-discover`'s **Reads:** line, plus the Reads line of
   any other consuming skill.

Lint constraint: `scripts/lint-skills.mjs:97` resolves every call site matching
``dx-references` with [topic ]`<topic>` `` against `references/<topic>.md` — a hard FAIL if missing.
Topic names must be lowercase kebab (`[a-z][a-z-]*`), so `design-principles` is valid,
`SOLID` is not. Naming convention per the plan-design-coverage precedent: references are "named after
the artifact [or concept] it shapes", and shared prefixes are load-bearing for flat-directory sorting.

`skills.sh.json` needs **no** edit — it lists skill directories only, not reference files.

## 7 — No length gate exists, and prior art forbids inventing one

`scripts/lint-skills.mjs:128-129` prints body size **advisory only — no cap**, a deliberate decision
from `context/archive/2026-07-28-content-lint-gate/plan.md`:

> No hard cap exists yet, so this is **advisory only**: printed as a warning, never fails the job.

And `context/archive/2026-07-28-dx-brainstorm/plan.md:28` explicitly refuses size-vs-siblings gating:

> "Comparable in size to `dx-refactor-discover`" is an **illustration, not a threshold** … The real
> bar is instructions an agent can execute clearly and accurately; **length that buys accuracy is
> fine. Don't report or gate on size-vs-siblings.**

`dx-refactor-discover` is currently 51 body lines / ~1072 est. tokens, 5th largest of 21 (`dx-plan`
tops out at 65 / 1244). An inline principle list breaks no mechanical rule. **The change.md's
token-efficiency constraint is therefore a doctrine constraint (the no-op test), not a budget
constraint** — worth stating plainly in framing so it isn't mis-read as "keep it short at any cost".

## 8 — Adjacent decisions framing will hit

- **Finding taxonomy.** The skill has no severity scale; its only axis is a strength tag
  `Strong | Worth exploring | Speculative` (`SKILL.md:28`), deliberately *not* the repo's
  `Blocker`/`Consider` vocabulary owned by `review-report.md:16`. No prior document discusses
  unifying them. If broadened findings tempt a "which principle did this violate?" tag, note the
  precedent: `plan-design-coverage` **rejected** an external four-tier severity scheme and folded the
  checks into existing dimensions instead, keeping "four dimensions" true across docs.
- **Glossary.** `context/foundation/glossary.md` defines exactly Deep Module, Shallow Module, Seam,
  Deletion Test. Nothing from the new principle list is there. Whether SOLID/DRY/etc. enter the
  glossary is a separate `dx-domain` question — and DESIGN.md §8 warns the glossary is "*never* a
  spec".
- **Nothing in `context/` or `DESIGN.md` names SOLID, KISS, YAGNI, bounded context, or
  orthogonality** (verified by grep). This vocabulary is genuinely new to the repo; the closest
  existing normative content is DESIGN.md §12's standards seed (`coding-style.md` mentions DRY,
  `minimal-implementation.md` covers "no speculative abstractions") — and **those two files ship into
  target projects via `dx-init`; they do not exist in this repo.**

## Docs sync surface (per `CLAUDE.md:24-29`)

Any behavior change here must also touch:

- `docs/reference/skills.md:259-274` — the fixed-shape entry (Invoke / Purpose / Reads / Writes /
  Prints next). `lint-skills.mjs:111-126` enforces the heading's existence, not its accuracy.
- `docs/tutorials/find-refactors.md` — the dedicated ~248-line walkthrough; `:35-37` and `:145`
  narrate the `module-design`-only vocabulary load verbatim.
- `docs/explanation/research-and-frame.md:167-174` — "The refactor twist", if the handoff vocabulary
  widens.
- `docs/explanation/knowledge-layer.md:181-198` — if the lesson/rejection path changes.
- `docs/reference/glossary.md:7,17,21,71` — if new vocabulary becomes canonical.
- A changeset (`npx changeset`), since `skills/**` is touched.

## Open for framing

1. Does the principle vocabulary serve only `dx-refactor-discover`, or also `dx-impl-review`
   (Patterns) / `dx-plan-review` (Architectural fitness)? — decides inline vs. reference (§5).
2. How does a finding phrased outside `module-design` terms survive promotion into a `type: refactor`
   change whose four downstream skills load only `module-design`? (§4)
3. Does the `Don't drift into "component / service / boundary"` anti-drift clause at `SKILL.md:16`
   survive, get scoped to module findings, or get dropped?
