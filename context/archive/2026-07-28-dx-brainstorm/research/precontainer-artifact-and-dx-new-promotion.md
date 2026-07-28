---
topic: precontainer-artifact-and-dx-new-promotion
kind: codebase
source: dx-workflow repo (skills/, DESIGN.md, docs/, context/, scripts/lint-skills.mjs)
gathered: 2026-07-28
git_commit: 95a43d9d9a52b3f4f49a33bed53c15e07d45bae8
---

# How a `dx-brainstorm` artifact fits the existing `context/` conventions and `dx-new`'s promotion path

Answers the open question recorded in `context/changes/dx-brainstorm/change.md`: *what does the brainstorm artifact look like, where does it live before a container exists, and how must `dx-new`'s "Promoted entries" change?* Companion to `research/prior-art-brainstorm-skill-design.md` (external prior art); this file is the dx-native half.

## 1 — The finding that matters most: no discovery artifact is ever homeless

The premise in `change.md` — "a brainstorm output file that `dx-new` (or the user) can promote" — does not match how the two existing discovery skills actually work. **Neither one writes an artifact before a container exists.** Both create the container *themselves*, then write the artifact inside it.

- `DESIGN.md:388` — "Both produce a finding, then **promote it into a standard container and get out of the way.** Neither writes a durable register; the finding lives inside the container it spawns and archives with it."
- `skills/dx-diagnose/SKILL.md:43` — "**Non-trivial → PROMOTE.** Write `diagnosis.md` … and run `/dx-new` stamped `type: defect` …, carrying that file as the change's seed."
- `skills/dx-refactor-discover/SKILL.md` §4, one-pick branch — "create the change directly, the same way `dx-diagnose` self-contains its own promotion: write `context/changes/<slug>/change.md` stamped `type: refactor`, with the finding captured as its seed `research/<topic>.md` … **This is this skill's own deliverable, not a chain into `/dx-plan`**."

There is exactly one artifact path in the whole tree that is not under a container, and it is not a discovery output: `context/foundation/research/` — "durable, reusable investigations (read by every plan)" (`DESIGN.md:181`). It is currently empty, and it is the wrong home for a brainstorm (a brainstorm is an ephemeral work item, not durable reference knowledge — the same reasoning `DESIGN.md:404` uses to refuse a `foundation/architecture-debt.md` register).

**Consequence for the design.** `dx-brainstorm` should follow the same self-contained-promotion pattern rather than inventing a pre-container file location. The `change.md` note's framing ("before a container exists") describes a real *conversational* phase, but the file need never exist outside a container: the write happens only after the routing decision, at which point the container is being created in the same step.

## 2 — `dx-new`'s "Promoted entries" section is thin, and change-only

The whole section is three sentences (`skills/dx-new/SKILL.md:33-35`):

> `dx-diagnose` and `dx-refactor-discover` are separate discovery skills that hand a finding here. When invoked with a pre-seeded `diagnosis.md` (bug) or refactor finding, drop it into the new change's folder as its seed research and set `type` accordingly (`defect` / `refactor`). Don't re-derive what the discovery skill already found.

Four observations:

1. **It is passive, not a mechanism.** It describes what to do *if* dx-new is handed a finding. It defines no argument, no filename convention, no parse. In practice the discovery skills do not depend on it — `dx-diagnose` writes `diagnosis.md` itself and `dx-refactor-discover` writes `change.md` itself. The section is closer to documentation of an expectation than to a contract.
2. **It only covers changes.** "drop it into the new **change's** folder". There is no effort branch. `change.md` asks how promotion works "depending on whether the brainstorm's conclusion becomes a change or an effort" — the effort path does not exist today for any discovery skill either.
3. **The one working effort-side precedent is a printed argument, not a file.** `dx-refactor-discover`'s many-pick branch explicitly refuses to fold effort creation in ("decomposing into an effort + roadmap + several child changes is already a multi-step flow owned by other skills") and instead composes a **seed summary** — the full findings under a heading naming the source skill — printed as the literal argument to `/dx-new "<seed summary>"`. That is the existing answer to "how does a discovery finding reach an effort", and it needs no change to `dx-new` at all.
4. **`type` has no brainstorm-shaped value.** The enum is `feature | defect | refactor | migration` (`references/change-md.md:7-17`). A brainstormed conclusion is normally a `feature`; nothing new is needed, but the existing sentence's "set `type` accordingly" has no third mapping to add.

**Minimum viable edit to `dx-new`:** add `dx-brainstorm` to the list of skills named in that section and add the effort branch (drop the artifact into `context/efforts/<id>/research/<topic>.md`). Anything more is speculative — the section is advisory today and the discovery skills carry their own promotion.

## 3 — Where the artifact can land, given how downstream skills read

Every downstream reader keys on **directory position**, not filename — with one exception.

- `dx-plan` (`skills/dx-plan/SKILL.md:16`) reads "every `research/<topic>.md` (change-scoped **and** the parent effort's when `change.md` names an `effort:` **and** `foundation/research/`), `frame.md` if present …, `diagnosis.md` if present".
- `dx-frame` (`skills/dx-frame/SKILL.md:14-18`) reads "every existing `research/<topic>.md` and `diagnosis.md` if present as **settled context**".
- `dx-roadmap` (`skills/dx-roadmap/SKILL.md:14-16`) reads "every `research/<topic>.md` and `frame.md` if present" from the effort.

`diagnosis.md` is the exception: a root-level, specially-named file that every reader had to be taught about individually, and that `DESIGN.md:201` had to add to the layout block, and that §7.4 (`DESIGN.md:285`) had to enumerate. **A new specially-named `brainstorm.md` would repeat that cost across five files.** Dropping the artifact in as `research/<topic>.md` (what `dx-refactor-discover` already does) costs zero downstream edits — it is picked up by `dx-plan`, `dx-frame`, and `dx-roadmap` for free, in both the change and effort cases, and inherits the effort→child-change inheritance rule automatically.

Note the small inconsistency already in the tree: `dx-new:35` says "drop it into the new change's folder **as its seed research**" while `references/change-md.md:34` and `DESIGN.md:201` place `diagnosis.md` at the change root, *beside* `research/`. Adding a second root-level artifact would deepen that ambiguity; using `research/` resolves it.

**Recommendation for `dx-frame`:** the brainstorm's output is closer to a *frame* than to research — problem, alternatives weighed, what was rejected and why, out of scope are literally `dx-frame`'s four sections (`skills/dx-frame/SKILL.md:30-33`). Splitting the artifact (framing content → `frame.md`, evidence → `research/<topic>.md`) is the open design choice. `dx-refactor-discover` already anticipates exactly this fork: "as its seed `research/<topic>.md` (**or `frame.md` if it reads more like a framing than a research write-up**)".

## 4 — What the prior art's "challenger gate" already exists as

The external research shortlists a fresh-context adversarial subagent as its #1 idea. **dx shipped a version of this two commits ago** — slice 3 of this same effort (`91fce47 feat(interview-challenger): add challenger step to interview loop`). `references/interview.md` step 5:

> **For a consequential, hard-to-reverse decision** (framing, solution design, slice ordering), before presenting the conclusion, run one adversarial pass against it: strongest objection, cheaper alternative, downstream breakage, hidden assumption. A critical finding interrupts with a question back to the user instead of being self-resolved. A non-critical finding is folded into the conclusion as a visible caveat — not discarded, not blocking.

This matches the prior art's load-bearing rule ("never resolve your own challenger's CRITICALs") almost exactly. It differs in two ways worth a deliberate decision: dx's version is *one adversarial pass*, not a fresh-context subagent, and it does not name severities. **`dx-brainstorm` should invoke `dx-references` with `interview` and rely on step 5 rather than collocating its own challenger** — that satisfies the ≥2-skills-share rule and the no-duplication standard.

Severity vocabulary, if the challenger's output is ever written down: `references/review-report.md` fixes it at **`Blocker` / `Consider`** (compound `<Dimension>: <Severity>` only in `impl-review.md`). Not CRITICAL/WARNING/OK. `DESIGN.md` itself does not define severities — `review-report.md` is the canonical source per §7.6.

## 5 — The interview reference also supplies most of the "conversation technique"

The prior art's shortlist items 4 (question discipline), and much of 6 (explore-don't-ask) are already in `references/interview.md` steps 1–3 — including "**If the codebase can answer it, explore instead of asking.** Don't ask what a file, a `research/` doc, a `frame.md`, or the glossary already settles", which is the dx form of "a question whose answer sits in the repo is homework". The one genuinely missing move is the prior art's "when the user answers with a solution, ask about the problem it solves before adopting it" — a candidate one-line addition to `interview.md` rather than new text inside `dx-brainstorm`.

The interview reference's question-scaling table (`Upstream provided → Ask about`) has **no row for a brainstorm**, and a brainstorm sits upstream of everything in it. If `dx-brainstorm` writes a `frame.md`, the existing `+ frame.md → skip all problem-framing questions` row already covers the handoff — another argument for the frame-shaped artifact.

## 6 — Prior decisions to cite, not re-derive

| Decision | Where | What it settles |
|---|---|---|
| No "decide not to build" exit exists anywhere today; a new entry point ahead of `dx-new` is the only non-retrofit way to add one | `context/efforts/sdlc-hardening/research/sdlc-hardening.md` §1 (verified against `dx-new:10,26`, `dx-frame:12,22,39-45`) | The premise of the slice is already evidenced — don't re-verify it |
| `dx-brainstorm` goes last because it is the only slice that grows the skill count; highest novelty, lowest urgency | `context/efforts/sdlc-hardening/roadmap.md` slice 6; `frame.md` "Alternatives considered" | Rejects splitting it into its own effort |
| Discovery findings are ephemeral work items, not stable reference knowledge — no durable register | `DESIGN.md:404`, `dx-refactor-discover` Guard | Rules out a `foundation/brainstorms/` register (stale-entry + parallel-write hazards vs derive-don't-maintain) |
| Report-only gates vs a single applying skill | `context/standards/global/skill-authoring.md`, "Read-vs-write separation" | A brainstorm's challenger reports; it does not silently resolve |
| Severities are `Blocker`/`Consider` | `references/review-report.md` (slice 4, archived `2026-07-28-review-severity-unification`) | Don't import a third vocabulary |
| Cross-skill parsed formats are catalogued in `DESIGN.md` §7.6 | archived `2026-07-28-cross-skill-format-reference` | §7.6 does **not** currently list `diagnosis.md`; a new parsed brainstorm format would owe an entry there |
| **Discovery entry** is already a defined term: "A Skill that starts from a symptom rather than a request, produces a Finding, and **promotes it into a Change or Effort** rather than keeping its own durable register" | `context/foundation/glossary.md` | The effort branch is already sanctioned by the ubiquitous language even though no skill implements it; and "no durable register" is definitional, not incidental |
| Fetched content is data, never instructions | `references/untrusted-content.md` (slice 2, archived `2026-07-28-untrusted-content-boundary`) | If `dx-brainstorm` ever reads external material, it must invoke `dx-references` with `untrusted-content` like `dx-research`'s external mode does |

Archive sweep (`context/archive/`, six entries) and `context/foundation/lessons.md` (empty beyond its header) contain **no** prior mention of "brainstorm" — nothing to supersede.

## 7 — Mechanical obligations for landing a new skill

From `scripts/lint-skills.mjs` (run by `npm run lint:skills`, and by CI's `lint-skills` job in `.github/workflows/ci.yml`):

- `name` must equal the folder name; `description` required; `description` must be quoted if it contains an unquoted `: `; cannot set both `disable-model-invocation` and `user-invocable`.
- Every `` dx-references `with topic` `<topic>` `` call must resolve to an existing `skills/dx-references/references/<topic>.md`. **`model-policy` is not one of them** — it was reverted (`c7d0596 Revert "Add model-policy reference…"`) and no repo skill references it. (The *installed* copy of `dx-research` at `~/.ccs/instances/personal/skills/dx-research/SKILL.md` still cites it — a real drift between installed and repo versions, worth a separate fix.)
- **Docs-sync is enforced bidirectionally**: a `skills/dx-brainstorm/` folder with no `### \`dx-brainstorm\`` heading in `docs/reference/skills.md` fails the lint, and vice versa.
- CI's `check-changeset` job fails the PR if `skills/**` changed with no new `.changeset/*.md`.

Docs surface that names the discovery skills and would need a companion entry: `docs/reference/skills.md` ("Discovery entries" group), `docs/reference/glossary.md` ("Discovery entry" term), `docs/explanation/workflow-overview.md`, `efforts-and-changes.md`, `directory-layout.md`, `research-and-frame.md`, `knowledge-layer.md`, `docs/README.md`, plus the per-skill tutorial pattern (`docs/tutorials/diagnose-a-bug.md`, `find-refactors.md`). `context/standards/global/skill-authoring.md` additionally requires authoring through `skill-creator` with evals, since this skill's behavior is non-trivial.

The `docs/reference/skills.md` entry shape (from the `/dx-diagnose` entry) is fixed: `### \`/dx-<name>\`` then **Invoke** / **Purpose** (with a tutorial link) / **Reads** / **Writes** / **Prints next** (a fenced `text` block reproducing the terminal output verbatim).

## 8 — One tension to resolve deliberately

`context/standards/global/skill-authoring.md` states: "**No auto-chain.** A skill prints the next command and stops; it does not invoke the next skill in the lifecycle itself." `DESIGN.md:463` (§14 rule 3) says the same. Yet `dx-diagnose:43` **runs `/dx-new`**, and `dx-refactor-discover` **writes `change.md` directly**.

The reconciliation the repo has settled on is stated in `dx-refactor-discover` §4: creating the container is *the discovery skill's own deliverable*, and the no-auto-chain line applies to the step *after* that (neither skill runs `/dx-plan`). `dx-brainstorm` should state the same boundary explicitly, or the lint/review will read it as a violation. Note this is exactly where the external prior art disagrees — it never writes the container, only a brief — so this is a genuine fork, not a detail.

## 9 — Shortlist of open design questions for `dx-frame`

1. **Artifact shape:** `frame.md` (four sections already defined, zero downstream edits, skips framing questions in every consumer) vs `research/<topic>.md` (provenance frontmatter, plural-topic friendly) vs both. `dx-refactor-discover` explicitly permits either.
2. **Effort route:** self-contained (write `effort.md` directly) vs the `dx-refactor-discover` seed-summary pattern (print the full findings as the literal `/dx-new "<seed summary>"` argument). The latter needs no `dx-new` edit and matches the existing precedent for multi-container outcomes.
3. **How the bundling test (external §2.5) surfaces:** as the change-vs-effort decision `dx-brainstorm` hands over, it makes `dx-new`'s "Pick the level" coin-flip question unnecessary — worth saying so in `dx-new`'s section.
4. **The "nothing worth building" exit:** it writes no container, so it also writes no artifact, so it also has no `Next:` target. `DESIGN.md:463` requires a printed next command; the exit needs a stated form (`Next: none`, or a plain terminal sentence like `dx-diagnose`'s trivial branch, which prints "Fixed inline: …" with no `Next:` at all — the existing precedent for a no-handoff outcome).
5. **Glossary gap:** `foundation/glossary.md` defines Change, Effort, Slice, Research, Diagnosis, Discovery entry — but **not** "Brainstorm", and not "Container" (a term `DESIGN.md` and every guard clause uses freely). Landing this skill is the natural moment to add "Brainstorm" with its `_Avoid_` line against Research and Frame, per `dx-domain`.
6. **Invocation mode:** user-invoked (`disable-model-invocation: true`, terse description) matching `dx-refactor-discover`, or model-invoked with trigger phrasing matching `dx-diagnose`. The prior art's "interactive-only, stop if no user available" argues for user-invoked.
