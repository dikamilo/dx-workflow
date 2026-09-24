# Skills reference

Every `dx-` skill, one entry each. The dx- workflow ships as a set of Claude Code slash commands that read and write files under your project's `context/` tree. Skills never chain: each does one job, prints a `Next:` suggestion, and stops — you run the next command.

Two skills are **model-invoked** (they auto-fire mid-task when their trigger appears): `/dx-diagnose` and `/dx-domain`. Four utility skills — `/dx-new`, `/dx-archive`, `/dx-lesson`, `/dx-standards-update` — are **user or model** invoked: you can type them, and other skills call them by name, but they never auto-fire. Every other skill is **user-invoked** — you type the slash command. One skill, `dx-references`, is internal plumbing: other skills invoke it with a topic to pull shared reference material; you never type it.

For the shape of the files these skills read and write, see [directory layout](../explanation/directory-layout.md). For how the pieces fit into one flow, see [workflow overview](../explanation/workflow-overview.md).

Each entry follows a fixed shape: **Invoke** (who fires it and the arguments), **Purpose**, **Reads**, **Writes**, and **Prints next** (the `Next:` lines it ends with, quoted).

---

## Setup & routing

### `/dx-init`
- **Invoke:** user — `/dx-init`
- **Purpose:** scaffold the `context/` state tree and seed baseline standards so the rest of the workflow has somewhere to read and write; see [initialize a project](../tutorials/initialize-a-project.md).
- **Reads:** existing `context/` (to stay idempotent), the skill's bundled `assets/standards/global/*.md`, the project's root `CLAUDE.md`.
- **Writes:** `context/{foundation,standards,efforts,changes,archive}/` with the three global standards copied in and empty `glossary.md`/`lessons.md` headers; appends the user-confirmed rollback principle to root `CLAUDE.md`.
- **Prints next:**
  ```text
  Next: /dx-new <idea>   — create a change or effort and start the workflow.
  ```

### `/dx-new`
- **Invoke:** user or model (by name, no auto-fire) — `/dx-new [idea or effort/slice] [brief…]`
- **Purpose:** the entry point and router — pick the container level (change vs effort vs a child slice) and create its identity file; see [efforts and changes](../explanation/efforts-and-changes.md).
- **Reads:** `context/` (guard that it is scaffolded), `foundation/glossary.md` for naming, and for a slice `context/efforts/<effort-id>/roadmap.md` plus that effort's `effort.md` `## Notes` (for the refactor-effort marker that decides the slice's `type`); accepts a pre-seeded `diagnosis.md` or refactor finding from a discovery skill, or (from `/dx-refactor-discover`'s promote-many path) an argument opening with `## Refactor opportunities (from /dx-refactor-discover)`, parsed as a multi-finding effort seed. A `dx-brainstorm` conclusion arrives as a container that already exists, so its change-vs-effort level is handed over rather than re-derived here. Also picks up any brief under `context/foundation/briefs/` named anywhere in the argument — a bare slug, a filename, or a full path, one or several, no flag and no fixed position — and strips those names before deriving the slug; a name that doesn't resolve is never guessed at, it lists the directory and asks.
- **Writes:** `context/changes/<id>/change.md` (`status: new`) or `context/efforts/<id>/effort.md` (`status: new`), every frontmatter field filled; for a multi-finding effort seed, also `## Notes`'s refactor-effort marker and one `context/efforts/<id>/research/<topic>.md` per promoted finding (provenance frontmatter + the finding's full entry, with its `Sketch:` line if `/dx-refactor-discover` explored it); for any brief named, one prose `Briefs: <paths>` line in the container's `## Notes` — a pointer only, nothing copied and no frontmatter field added.
- **Prints next:**
  ```text
  Change:       Next: /dx-research <id> <topic>   → /dx-frame <id>   → /dx-plan <id>
                (both optional — small/clear work can go straight to /dx-plan <id>)
  Effort:       Next: /dx-research <id> <topic>   → /dx-frame <id>   → /dx-roadmap <id>
  Child change: Next: /dx-frame <slug>   → /dx-plan <slug>    (frame optional — adds this slice's own user cases)
  ```

---

## Upstream

### `/dx-distill`
- **Invoke:** user — `/dx-distill [topic] [paths to any raw material] [--quick]`
- **Purpose:** run a discovery conversation toward a decision and record the ground it stands on as a brief, where every substantive claim carries an evidence tag and a source path; see [distill a brief](../tutorials/distill-a-brief.md) and [evidence tags](../explanation/evidence-tags.md).
- **Reads:** `context/foundation/` (guard that it is scaffolded), whatever raw material you point it at (paths must resolve — an unresolvable one is asked about, never guessed at), `foundation/research/` and `foundation/lessons.md`, `context/standards/`, open and archived containers, the codebase, `foundation/glossary.md`, and the user; the `untrusted-content` reference before reading any material and the `interview` reference for the questioning loop, plus its own collocated `references/evidence-tags.md`, `skeptic-prompt.md`, and `brief-template.md`. An existing `<slug>.md` is read as a refresh, not overwritten.
- **Writes:** `context/foundation/briefs/<slug>.md` (500–900 words; header block with `Emphasis detected`, `Evidence basis`, `Coverage`, and `Sources`, then only the sections the material actually reaches) plus its companion `context/foundation/briefs/<slug>.interview.md`, the record the `[INTERVIEW]` claims cite. Nothing else — no container, no promotion, no copies of your material. A refresh supersedes rows rather than deleting or renumbering them.
- **Prints next:**
  ```text
  Brief written: context/foundation/briefs/<slug>.md
  Collection plan: <k> entries waiting for material     # omit when none
  Next: /dx-new <idea> <slug>                           # if this is worth building
    or: /dx-distill <slug> --refresh                    # once the collection plan fills
  ```

### `/dx-research`
- **Invoke:** user — `/dx-research [container-id topic [--url=…] [--kind=codebase|external]]`
- **Purpose:** investigate one topic (codebase or external doc) and record it with provenance a later plan can trust; see [research and frame](../explanation/research-and-frame.md).
- **Reads:** the container folder under `context/changes/`, `context/efforts/`, or `context/foundation/`; `foundation/glossary.md`; the codebase (via `Explore` subagents) or the web (via `WebFetch`/`WebSearch`, gated by the `untrusted-content` reference before synthesizing).
- **Writes:** `<container>/research/<topic-slug>.md` with provenance frontmatter (`topic`, `kind`, `source`, `gathered`, `git_commit`) and evidence-backed findings.
- **Prints next:**
  ```text
  Research written: <container>/research/<topic-slug>.md
  Next: /dx-research <container-id> <another-topic>   — investigate another facet
    or: /dx-frame <id>   → /dx-plan <id>       # change
    or: /dx-frame <id>   → /dx-roadmap <id>    # effort
  ```

### `/dx-frame`
- **Invoke:** user — `/dx-frame [change-id or effort-id]`
- **Purpose:** settle the WHAT before the HOW — interview on problem framing, alternatives, and (when user-facing) user cases so planning can jump straight to solution design; run again on one of an effort's slices to add just that slice's own user cases; see [research and frame](../explanation/research-and-frame.md).
- **Reads:** `change.md`/`effort.md` (notes `type` and, for a change, `effort:`), every `research/<topic>.md`, `diagnosis.md`, `brainstorm.md` (settled context — deepens its conclusion instead of reopening it), any brief the container's `## Notes` names under `foundation/briefs/` (its tagged claims are sourced evidence, not something to re-interview; its open questions and collection plan are what is still unsettled), `foundation/glossary.md`; in slice mode, also the parent effort's `frame.md` in full; may invoke `/dx-domain` on a clashing term.
- **Writes:** `context/{changes|efforts}/<id>/frame.md` (real problem, who/what it affects, alternatives, out of scope, plus an optional user cases section for user-facing work); in slice mode, a change's own smaller `frame.md` holding only `## User cases`, additive to the parent's; sets container `updated`.
- **Prints next:**
  ```text
  Frame written: context/{changes|efforts}/<id>/frame.md
  Next: /dx-plan <id>       (for a change)
    or: /dx-roadmap <id>    (for an effort)
  ```

---

## Planning

### `/dx-plan`
- **Invoke:** user — `/dx-plan [change-id]`
- **Purpose:** interview and write the solution design, matching standards and priors; owns the `## Progress` section — never skipped, but scales down for trivial work; see [plans and slices](../explanation/plan-and-slices.md).
- **Reads:** `change.md`, all upstream `research/` (change- and effort-scoped plus `foundation/research/`; `untrusted-content` reference gates any `kind: external` one), `frame.md` (this change's own **and** the parent effort's, read as a union — a slice's `## User cases` extends rather than replaces the parent's), `diagnosis.md`, `brainstorm.md` (its resolved unknowns and rejected scope scale the interview down), every brief named in `## Notes` under `foundation/briefs/` (the parent effort's `## Notes` too when `effort:` is set — a tagged claim is cited rather than re-derived, non-goals are closed scope, and the brief's riskiest assumptions, kill criteria, and open questions carry into `## Priors & gotchas`; `untrusted-content` gates any brief carrying claims sourced from outside the repo), `context/standards/`, `foundation/lessons.md`, `foundation/glossary.md`; may `Explore` for prior decisions; always loads the `design-lenses` reference while writing the solution design; loads `plan-data-model`/`plan-api-contracts`/`plan-failure-modes` when the change touches that concern.
- **Writes:** `context/changes/<change-id>/plan.md` (matched standards, priors, vertical-slice phases, a `## Progress` section with all boxes `[ ]`, and — only when relevant — `## Data model`/`## API & contracts`/`## Failure modes & reversibility`); when `frame.md` has a `## User cases` section and the repo already has a test setup, adds a task per phase asserting the user case it implements (never introduces a test framework itself); flips `change.md` to `status: planned`.
- **Prints next:**
  ```text
  Plan written: context/changes/<change-id>/plan.md
  Next: /dx-plan-review <change-id>   — optional pre-implementation gate
    or: /dx-implement <change-id>     (/dx-tdd <change-id> for defect/test-first)
  ```

### `/dx-plan-review`
- **Invoke:** user — `/dx-plan-review [change-id]`
- **Purpose:** an optional pre-implementation gate asking "will this plan actually work?" across substance, feasibility, architectural fitness, and standards-fit — **report only, never edits**; see [review and triage](../tutorials/review-and-triage.md).
- **Reads:** `plan.md`, `change.md`, its `research/`/`frame.md`/`diagnosis.md`, `context/standards/`, `foundation/glossary.md`, the `plan-template`/`knowledge-layer`/`review-report` references, and — gated on the change, same triggers as `/dx-plan` — any of the `plan-data-model`/`plan-api-contracts`/`plan-failure-modes` references.
- **Writes:** `context/changes/<change-id>/reviews/plan-review.md` — a concise `[Blocker]`/`[Consider]` findings list with a **sound/revise/rethink** verdict. Leaves `plan.md` and code untouched.
- **Prints next:**
  ```text
  Plan review: context/changes/<change-id>/reviews/plan-review.md
  Next: /dx-review-triage <change-id> plan   — triage findings and apply fixes to plan.md
    or: /dx-implement <change-id>  (/dx-tdd <change-id> for defect/test-first) — proceed as-is
  ```

---

## Implementation

### `/dx-implement`
- **Invoke:** user — `/dx-implement [change-id]`
- **Purpose:** execute **one** pending phase of the plan, verify it, and commit — resuming from `## Progress`; see [implement vs TDD](../explanation/implement-vs-tdd.md).
- **Reads:** `plan.md` fully (resumes at the first `- [ ]`), its `research/`/`frame.md`/`diagnosis.md` (`untrusted-content` reference gates any `kind: external` research), the plan's Standards and Priors, `foundation/glossary.md`, and the `progress-format`/`plan-template` references.
- **Writes:** the phase's code; flips its `## Progress` boxes to `- [x]` with the commit's short SHA appended; flips `change.md` to `status: implementing`, then `status: implemented` when every box is done. Never auto-rollback on failure.
- **Prints next:**
  ```text
  Next: /dx-impl-review <change-id>          # all phases done
  Next: /dx-implement <change-id>            # more phases remain — runs the next one
  ```

### `/dx-tdd`
- **Invoke:** user — `/dx-tdd [change-id]`
- **Purpose:** the red-green sibling of `/dx-implement` — execute one phase test-first (failing test before code), then commit; see [implement vs TDD](../explanation/implement-vs-tdd.md).
- **Reads:** same as `/dx-implement` — `plan.md`, its upstream, Standards and Priors, `foundation/glossary.md`, the `progress-format`/`plan-template` references.
- **Writes:** failing test then minimal production code per behavior; flips `## Progress` boxes with SHA; sets `change.md` `status: implementing` → `implemented`. Hands pure-scaffolding phases to `/dx-implement`.
- **Prints next:**
  ```text
  Next: /dx-impl-review <change-id>          # all phases done
  Next: /dx-tdd <change-id>                  # more phases remain — next one test-first
  Next: /dx-implement <change-id>            # ...or drive the next phase standard
  ```

---

## Review & triage

### `/dx-impl-review`
- **Invoke:** user — `/dx-impl-review [change-id]`
- **Purpose:** the post-implementation gate — compare what was built against the plan across plan-drift (including any conditional `plan.md` sections), safety, patterns, and standards compliance, and **report**; see [review and triage](../tutorials/review-and-triage.md).
- **Reads:** `plan.md` (with Standards and Priors, and any `## Data model`/`## API & contracts`/`## Failure modes & reversibility` sections), `change.md` `type`, the `git log`/`git diff` for the change's phases, `foundation/glossary.md`, and the `knowledge-layer`/`review-report`/`module-design` references.
- **Writes:** `context/changes/<change-id>/reviews/impl-review.md` — a per-dimension PASS/WARNING/FAIL verdicts block plus findings tagged `[<Dimension>: <Severity>]`; sets `change.md` `status: reviewed` if it passes. Never fixes the code.
- **Prints next:**
  ```text
  Review written: context/changes/<change-id>/reviews/impl-review.md
  Next: /dx-review-triage <change-id> impl   — triage findings and apply fixes
    or: /dx-lesson                           # a finding worth recording — offered above
    or: /dx-archive <change-id>              # passed — retire the change
  ```

### `/dx-review-triage`
- **Invoke:** user — `/dx-review-triage [change-id] [plan|impl]`
- **Purpose:** the sole skill that **acts** on a review finding — walk a plan-review or impl-review report finding by finding and apply the fixes you confirm; see [review and triage](../tutorials/review-and-triage.md).
- **Reads:** the `review-report` reference, `reviews/plan-review.md` **or** `reviews/impl-review.md` (resumes at the first `Resolution: PENDING`), and for impl the diff scope plus the files each pending finding names; for plan, `plan.md`.
- **Writes:** edits to `plan.md` (plan-review) or the shipped code (impl-review), each finding's `Resolution:` line updated in place; commits code fixes as `fix(<change-id>): <finding title> (review)`. Never commits the report file.
- **Prints next:**
  ```text
  Triaged <report file>: <n> fixed, <n> skipped, <n> accepted, <n> dismissed
  Next: /dx-plan-review <change-id>   or  /dx-implement <change-id>   (plan-review triaged)
    or: /dx-impl-review <change-id>   or  /dx-archive <change-id>     (impl-review triaged)
  ```

---

## Effort level

### `/dx-roadmap`
- **Invoke:** user — `/dx-roadmap [effort-id]`
- **Purpose:** decompose an effort into an ordered list of vertical slices, each mapping to one child change — decomposes but does not create the changes; see [efforts and changes](../explanation/efforts-and-changes.md) and [run an effort](../tutorials/run-an-effort.md).
- **Reads:** `effort.md` (its `## Goal`), the effort's `research/`, `frame.md`, and `brainstorm.md` (its capability split is raw material for the slices), `foundation/glossary.md`; runs a short anchor interview to settle slice ordering.
- **Writes:** `context/efforts/<effort-id>/roadmap.md` — numbered slices, each naming one child change id, a one-line `why`, and a verbatim `/dx-new <effort-id> <slice-n>` line; flips `effort.md` to `status: scoped`. No maintained checklist — progress is derived.
- **Prints next:**
  ```text
  Roadmap written: context/efforts/<effort-id>/roadmap.md — <n> slices
  Next: /dx-new <effort-id> 1   — create the first slice's child change (also in roadmap.md's Slice 1 `next` line)
  ```

---

## Knowledge layer

See [the knowledge layer](../explanation/knowledge-layer.md) for how standards, lessons, and the glossary relate.

### `/dx-standards-discover`
- **Invoke:** user — `/dx-standards-discover [--from=PATH]`
- **Purpose:** mine the project's actual conventions from tooling, recurring code, and docs, and write them into the standards layer — filling the `frontend/`/`backend/`/`testing/` folders `/dx-init` left empty; see [build standards](../tutorials/build-standards.md).
- **Reads:** linter/formatter/`tsconfig`/CI/hook configs, `README`s and `docs/`, recurring code patterns (via `Explore` subagents per layer), `foundation/glossary.md`.
- **Writes:** concise prescriptive files under `context/standards/{frontend,backend,testing}/` (e.g. `backend/api.md`); leaves `global/` untouched (minimal append only).
- **Prints next:**
  ```text
  Standards discovered: <n> files under context/standards/
  Next: /dx-plan <id>   — planning now matches these standards into the plan.
  ```

### `/dx-standards-update`
- **Invoke:** user or model (by name, no auto-fire) — `/dx-standards-update [--from=PATH]`
- **Purpose:** create, edit, or promote a single standard — edited in place, from the conversation, a graduated lesson, or another project; see [the knowledge layer](../explanation/knowledge-layer.md).
- **Reads:** the rule's source (conversation, a `foundation/lessons.md` entry, or `--from=PATH`), the `knowledge-layer` reference for the promotion criteria, `foundation/glossary.md`.
- **Writes:** the matching `context/standards/<layer>/<topic>.md` (append or refine one entry); marks a promoted `foundation/lessons.md` entry as graduated.
- **Prints next:**
  ```text
  Standard updated: context/standards/<layer>/<topic>.md — <one-line what changed>
  Next: /dx-plan <change-id>   — the checklist will now match this standard
  ```

### `/dx-lesson`
- **Invoke:** user or model (by name, no auto-fire) — `/dx-lesson [the finding]`
- **Purpose:** record one finding — a warning or a decision-with-rationale — as an append-only lesson, the anteroom to a standard; see [the knowledge layer](../explanation/knowledge-layer.md).
- **Reads:** the finding (argument or one clarifying question), the `knowledge-layer` reference for the entry shape, `foundation/glossary.md`.
- **Writes:** appends one `## <short title> — <YYYY-MM-DD>` entry to `foundation/lessons.md`; never edits existing entries.
- **Prints next:**
  ```text
  Lesson recorded: foundation/lessons.md — ## <short title>
  Next: /dx-standards-update   — only if this will recur across changes (promote it to a standard)
  ```

### `/dx-domain-discover`
- **Invoke:** user — `/dx-domain-discover [module or path]`
- **Purpose:** the one-time (per-module) extraction pass — mine a brownfield codebase for its domain vocabulary and seed the glossary; see [build a domain language](../tutorials/build-domain-language.md).
- **Reads:** the current `foundation/glossary.md` (to extend, not clobber), identifiers/module names/comments/docs (via `Explore` subagents scoped to `[module or path]`), the `knowledge-layer` reference for the entry shape.
- **Writes:** new and sharpened domain-only entries in `foundation/glossary.md`; asks the user to resolve any term clash.
- **Prints next:**
  ```text
  Glossary seeded: foundation/glossary.md
  Next: /dx-domain-discover <another-module>   — extend the sweep to another area
    or: /dx-domain                             — keep the glossary sharp as you work
  ```

### `/dx-domain`
- **Invoke:** **model** (auto-fires) — `/dx-domain`
- **Purpose:** the active glossary discipline — fires the instant a domain term clashes, is vague/overloaded, or finally gets pinned down mid-task; sharpens it and hands back; see [build a domain language](../tutorials/build-domain-language.md).
- **Reads:** `foundation/glossary.md`, the `knowledge-layer` reference for the entry shape, and the code (to cross-check the user's claim).
- **Writes:** the resolved term's entry in `foundation/glossary.md` — inline, glossary-only, one term at a time. Only `/dx-domain` and `/dx-domain-discover` write this file.
- **Prints next:**
  ```text
  Glossary updated: foundation/glossary.md  (<Term>)
  Back to: <the task this interrupted>
  ```

---

## Discovery entries

### `/dx-brainstorm`
- **Invoke:** user — `/dx-brainstorm [idea or question]`
- **Purpose:** the divergent front door that runs before `/dx-new` — question whether the problem is real, weigh at least two alternatives against a priced do-nothing, and route to a change, an effort, or nothing at all; see [brainstorm an idea](../tutorials/brainstorm-an-idea.md).
- **Reads:** `context/` (guard that it is scaffolded), `foundation/glossary.md` and `foundation/lessons.md`, `context/standards/`, `context/changes/**` and `context/archive/**` (to spot work already decided or shipped), the codebase, and the user; the `interview` reference for the questioning loop and its adversarial pass, plus `change-md` or `effort-md` when writing a container, and its own bundled `references/brainstorm-md.md` for the artifact's shape (loaded only on a ramp that writes one).
- **Writes:** nothing when the conclusion is "not worth building" or "already covered"; otherwise `context/changes/<id>/change.md` **or** `context/efforts/<id>/effort.md` plus a `brainstorm.md` beside it (the question, alternatives weighed incl. the priced do-nothing, conclusion & route, resolved unknowns, not doing). Never decomposes slices or creates child changes.
- **Prints next:**
  ```text
  Nothing to build: <one-line conclusion — why the do-nothing won>
  Already covered:  Covered by <path>   (status: <status>)
  One change:       Brainstorm written: context/changes/<id>/brainstorm.md
                    Next: /dx-frame <id>    → /dx-plan <id>       (frame optional)
  An effort:        Brainstorm written: context/efforts/<id>/brainstorm.md
                    Next: /dx-frame <id>    → /dx-roadmap <id>    (frame optional)
  ```

### `/dx-diagnose`
- **Invoke:** **model** (auto-fires) — `/dx-diagnose [symptom]`
- **Purpose:** feedback-loop-first diagnosis for a bug or perf regression — build a red-capable loop, find the cause, then fix inline or promote it to a change; see [diagnose a bug](../tutorials/diagnose-a-bug.md).
- **Reads:** the symptom, the codebase (to build a tight reproducing loop), `foundation/glossary.md`; the `change-md` reference when promoting.
- **Writes:** for a trivial bug, the inline fix plus a regression test, no artifacts; for a non-trivial bug, `context/changes/<id>/diagnosis.md` (minimised repro, ranked hypotheses, regression test) then runs `/dx-new` stamped `type: defect`. Never auto-rollback.
- **Prints next:**
  ```text
  Trivial:  Fixed inline: <one-line cause>. Regression test: <path>.
  Promoted: Diagnosis written: context/changes/<id>/diagnosis.md
            Next: /dx-plan <id>   (defect → TDD gate)
  ```

### `/dx-refactor-discover`
- **Invoke:** user — `/dx-refactor-discover [area or path]`
- **Purpose:** hunt the codebase for design problems worth fixing — shallow modules to turn deep, plus what the wider design lenses surface (duplication, coupling, single-responsibility) — present them inline with an opinionated top pick, optionally design each pick twice before committing to it, and promote the ones you pick; see [find refactors](../tutorials/find-refactors.md).
- **Reads:** the `module-design` reference for its vocabulary (deep vs shallow, seams, leverage and locality, adapters, dependency category, the deletion test, and the rejected framings that keep words like "component / service / boundary" out), the `design-lenses` reference for what to scan *for* beyond module depth, `foundation/glossary.md`, `foundation/lessons.md` (to skip prior rejections), `git log --oneline` (recency as the default scan prior — churn pulls attention first), the codebase (via `Explore` subagents scoped to `[area or path]`).
- **Writes:** findings inline as markdown — each carrying a one-line `Shape: before → after`, a strength tag (desirability), a dependency category (feasibility), and a win cashed out in `module-design` terms rather than "cleaner code" — closing with a one-sentence **top pick** (which to tackle first and why, since the strength tag ranks confidence, not sequence); ephemeral, no debt register. After the pick, an **opt-in "design it twice"** step offers per-finding exploration: one pick gets a plain yes/no, more than one gets a single batched pick (*none* / *all* / *specific ones*, recommending the top pick) followed by the same exploration run once per selected finding, sequentially — never spawning the next finding's sub-agents before the current one's sketch is confirmed. Each run spawns 3–4 built-in `Plan` subagents in parallel, each under a forcing constraint stated as *where the seam goes* rather than a value to maximize (collapse to 1–3 entry points · move part of the contract out of the interface · split the seam so common and rare callers reach different entry points · ports & adapters, gated on the dependency category), each returning interface + usage example + what's hidden behind the seam + dependency strategy + trade-offs; the survivors are compared on depth, locality, and seam placement and closed with an opinionated pick or hybrid. For a single pick, `context/changes/<slug>/change.md` stamped `type: refactor` with the finding — and the chosen sketch, if the step ran — as its seed `research/`/`frame.md`, so `/dx-plan` reads it as upstream instead of re-deriving it. Many picks are handed to `/dx-new` as a seed summary that carries the chosen sketch for each explored finding and the top pick as its closing `Start with:` line. Still writes no `plan.md` and edits no code.
- **Prints next:**
  ```text
  Promoted one: Change created: context/changes/<slug>/change.md   (type: refactor, seeded with the finding)
                Next: /dx-plan <slug>
  Promote many: Next: /dx-new "<seed summary>"   →  /dx-roadmap <effort-id>
  Record a no:  /dx-lesson                (don't re-deepen X because Y)
  ```

---

## Lifecycle close

### `/dx-archive`
- **Invoke:** user or model (by name, no auto-fire) — `/dx-archive [change-id or effort-id]`
- **Purpose:** retire a finished change or effort — move its folder to `context/archive/` and stamp it archived. No registry; the archive is just where done work lives; see [ship a change](../tutorials/ship-a-change.md).
- **Reads:** the container folder; for an effort, `roadmap.md` and each child change's `archived_at` (children must all be archived first); for a change, `reviews/impl-review.md` (warns on any `Resolution: PENDING`); the `change-md`/`effort-md` reference for the schema.
- **Writes:** moves the folder to `context/archive/<today>-<id>/` (prefers `git mv`); stamps the identity file `status: archived` with `archived_at` set and `updated` bumped.
- **Prints next:**
  ```text
  ✓ Archived <id> → context/archive/<today>-<id>/
  ```
  Then suggests `/dx-new <idea>` to start fresh.

---

## Plumbing

### `dx-references`
- **Invoke:** internal (`user-invocable: false`) — invoked by other skills as `dx-references <topic>`, **not** a slash command you type.
- **Purpose:** load a shared reference document by topic so several skills read one canonical copy instead of deep-linking each other's files.
- **Reads:** `references/<topic>.md` for one of the thirteen topics: `change-md`, `effort-md`, `progress-format`, `plan-template`, `plan-data-model`, `plan-api-contracts`, `plan-failure-modes`, `interview`, `module-design`, `design-lenses`, `knowledge-layer`, `review-report`, `untrusted-content`. (There is no `model-policy` topic.)
- **Writes:** nothing — it returns the reference content to the calling skill.
- **Prints next:** nothing — it has no `Next:` line; control returns to whichever skill invoked it.

---

## Related
- [Documentation home](../README.md) — the map of all dx- docs.
- [Glossary](glossary.md) — the terms these skills use, defined.
- [Workflow overview](../explanation/workflow-overview.md) — how these skills fit into one lifecycle.
- [Efforts and changes](../explanation/efforts-and-changes.md) — the two-level model `/dx-new` and `/dx-roadmap` route.
- [Directory layout](../explanation/directory-layout.md) — the `context/` files every skill reads and writes.
