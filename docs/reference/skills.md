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
- **Reads:** existing `context/` (to stay idempotent), the skill's bundled `assets/standards/global/*.md` and `assets/review-policies/*.md`, the project's root `AGENTS.md`/`CLAUDE.md` and `.gitignore`.
- **Writes:** `context/{foundation,standards,efforts,changes,archive,config/{review-policies,templates}}/` with the three global standards copied in only when `context/standards/` did not exist before the run (on an existing context it copies nothing and asks which shipped standards to add), empty `glossary.md`/`lessons.md` headers, and the review Policy files copied into `context/config/review-policies/` — the built-in `plan`, `implementation`, `test-strategy` and `sessions` Policies plus `review-policy.md` and `review-report.md`. Copies only files that are missing, so a re-run never overwrites an edited Policy or template (and never delivers a fix to a shipped one either): a project seeded before `test-strategy` or `sessions` gets that Policy on a re-run but keeps its old templates, which don't document `## Questions`, `## Candidates`, `promote: off` or `## Reviewed`, so compare them with the shipped ones by hand. Writes a one-line dx- pointer inside a managed `<!-- dx:workflow:start -->` / `<!-- dx:workflow:end -->` block in `AGENTS.md` (when it exists and `CLAUDE.md` is absent or only points at it) or `CLAUDE.md`; a re-run replaces the block in place and never adds a second one. It does not write the rollback principle. Ensures `.gitignore` lists `.worktrees/` (creates the file or appends the line, never duplicates it). Prints a created/present status per artifact, listing each review Policy file and the `.gitignore` entry.
- **Prints next:**
  ```text
  Next: /dx-new <idea>   — create a change or effort and start the workflow.
  ```

### `/dx-new`
- **Invoke:** user or model (by name, no auto-fire) — `/dx-new [idea or effort/slice] [brief…]`
- **Purpose:** the entry point and router — pick the container level (change vs effort vs a child slice) and create its identity file — a change is the default, an effort only when slices can each ship alone or run in parallel; see [efforts and changes](../explanation/efforts-and-changes.md).
- **Reads:** `context/` (guard that it is scaffolded), `foundation/glossary.md` for naming, and for a slice `context/efforts/<effort-id>/roadmap.md` plus that effort's `effort.md` `## Notes` (for the refactor-effort or Candidate-effort marker that decides the slice's `type`); accepts a pre-seeded `diagnosis.md` or refactor candidate from a discovery skill, or (from `/dx-refactor-discover`'s promote-many path) an argument opening with `## Refactor opportunities (from /dx-refactor-discover)`, parsed as a multi-candidate effort seed. An argument opening with `## <Policy> candidates (from /dx-review <policy-id>)` (the promote-many output of a `/dx-review` Explore run) is parsed the same way: the effort slug comes from the closing `Start with:` line. A `dx-brainstorm` conclusion arrives as a container that already exists, so its change-vs-effort level is handed over rather than re-derived here. Also picks up any brief under `context/foundation/briefs/` named anywhere in the argument — a bare slug, a filename, or a full path, one or several, no flag and no fixed position — and strips those names before deriving the slug; a name that doesn't resolve is never guessed at, it lists the directory and asks.
- **Writes:** `context/changes/<id>/change.md` (`status: new`) or `context/efforts/<id>/effort.md` (`status: new`), every frontmatter field filled; for a multi-candidate effort seed, also `## Notes`'s refactor-effort marker (or, for a `/dx-review` seed, `Candidate effort — default slice type: <type>; promoted from /dx-review <policy-id>.`, which slice creation reads the way it reads the refactor marker) and one `context/efforts/<id>/research/<topic>.md` per promoted candidate (provenance frontmatter + the candidate's full entry, with its `Standard:` line if it is standard-driven and its `Sketch:` line if `/dx-refactor-discover` explored it, both kept verbatim); for any brief named, one prose `Briefs: <paths>` line in the container's `## Notes` — a pointer only, nothing copied and no frontmatter field added.
- **Prints next:**
  ```text
  Change:       Next: /dx-research <id> <topic>   → /dx-frame <id>   → /dx-plan <id>
                (both optional — small/clear work can go straight to /dx-plan <id>)
  Effort:       Next: /dx-research <id> <topic>   → /dx-frame <id>   → /dx-roadmap <id>
  Child change: Next: /dx-frame <slug>   → /dx-plan <slug>    (frame optional — adds this slice's own user cases)
  ```
  The next command can run in this same session — no `/clear` needed.

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
- **Purpose:** settle the WHAT before the HOW — interview on problem framing, alternatives, and (when user-facing) user cases — printing the candidate user cases as a table (who, trigger, outcome, source) before asking you to confirm or edit — so planning can jump straight to solution design; run again on one of an effort's slices to add just that slice's own user cases; see [research and frame](../explanation/research-and-frame.md).
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
- **Reads:** `change.md`, all upstream `research/` (change- and effort-scoped plus `foundation/research/`; `untrusted-content` reference gates any `kind: external` one), `frame.md` (this change's own **and** the parent effort's, read as a union — a slice's `## User cases` extends rather than replaces the parent's), `diagnosis.md`, `brainstorm.md` (its resolved unknowns and rejected scope scale the interview down), every brief named in `## Notes` under `foundation/briefs/` (the parent effort's `## Notes` too when `effort:` is set — a tagged claim is cited rather than re-derived, non-goals are closed scope, and the brief's riskiest assumptions, kill criteria, and open questions carry into `## Priors & gotchas`; `untrusted-content` gates any brief carrying claims sourced from outside the repo), `context/standards/`, `foundation/lessons.md`, `foundation/glossary.md`; may `Explore` for prior decisions (research docs plus the nearest sibling plan only); always loads the `design-lenses` reference while writing the solution design; loads `plan-data-model`/`plan-api-contracts`/`plan-failure-modes` when the change touches that concern.
- **Writes:** `context/changes/<change-id>/plan.md` (matched standards, priors, an optional `## Assumptions` section recording every decision the agent took itself instead of asking, a `Reuse from:` line under `## Approach` when a prior plan was borrowed, vertical-slice phases — phase 1 a tracer with one happy path and one negative test, hardening later — each naming its affected test files so phases run scoped tests and one full run lands in the final phase, and each with a `Depends on:` line (independent, disjoint-file phases can run in parallel by default under `/dx-implement`; a phase that changes dependencies is never parallel-safe and gets a `Depends on:` that serializes it), for each parallel group one synthetic integration phase that `Depends on:` every member and holds the group's `(integrated)` rows (a serial plan gets none), a `## Progress` section with all boxes `[ ]` and every `#### Manual` row labelled `(agent-runnable)` or `(user-only)`, and, in a plan with a parallel group, every `#### Automated` row tagged `(isolated)` (needs only the phase's own source tree) or `(integrated)` (needs ports, a dev server, a database, another phase's code or e2e; run once on the merged tree) — checks pushed to Automated first, then `agent-runnable`, and — only when relevant — `## Data model`/`## API & contracts`/`## Failure modes & reversibility`); when `frame.md` has a `## User cases` section and the repo already has a test setup, adds a task per phase asserting the user case it implements (never introduces a test framework itself); flips `change.md` to `status: planned`.
- **Prints next:**
  ```text
  Plan written: context/changes/<change-id>/plan.md
  Next: /dx-review plan <change-id>   — optional pre-implementation gate
    or: /dx-implement <change-id>     (/dx-tdd <change-id> for defect/test-first)
  ```

---

## Implementation

### `/dx-implement`
- **Invoke:** user — `/dx-implement [change-id] [--manual]`
- **Purpose:** execute the pending phases of the plan, verify them, and commit — resuming from `## Progress`; by default coordinator mode runs every pending phase on subagents in dependency order, in its own git worktree rather than your checkout (subagents never commit or touch Progress; the coordinator flips boxes and commits per phase and stops on any red check); see [worktree isolation](../explanation/worktree-isolation.md), [run parallel phases in worktrees](../tutorials/run-parallel-phases-in-worktrees.md) and [implement vs TDD](../explanation/implement-vs-tdd.md).
- **Reads:** `plan.md` fully (resumes at the first `- [ ]`), its `research/`/`frame.md`/`diagnosis.md` (`untrusted-content` reference gates any `kind: external` research), the plan's Standards and Priors, `foundation/glossary.md`, the `progress-format`/`plan-template` references, and the shared `start-check` reference (run on every invocation, both modes).
- **Writes:** commits the change's uncommitted `context/` files on the work branch first (the current non-default branch, a branch you name, or it asks on the default branch; it never invents a name). In auto mode: a coordinator worktree `.worktrees/<change-id>` on scratch branch `<work-branch>--wt` (stops and points at `/dx-init` if `.gitignore` lacks `.worktrees/`), sibling worktrees `.worktrees/<change-id>--p<N>` only for phases running concurrently (merged back in dependency order, a resolver agent edits only conflicted files, then the integration phase runs once on the merged tree), subagent notes appended to `handoff.md` as each returns, and a fast-forward of the work branch on success. Worktrees are kept on any stop and removed only on full success; if the work branch moved meanwhile it stops rather than force. `--manual` runs one phase in the current checkout, no worktree, and stops if a stopped auto run left a kept worktree. The phase's code; flips its `## Progress` boxes to `- [x]` with the commit's short SHA appended; runs `(agent-runnable)` Manual rows itself and ticks them on evidence, stops at `(user-only)` rows (bare say-so ticks are recorded ` — ticked on say-so`); verifies with scoped test runs (only the test files the phase names; the one full-suite run is the final phase's, and an unscoped mid-plan run needs a stated reason in the report); flips `change.md` to `status: implementing`, then `status: implemented` when every box is done. Never auto-rollback on failure. On a fully ticked plan plus a follow-up request, points at `/dx-new` rather than improvising.
- **Prints next:** (in auto mode the line also names the work branch the commits landed on)
  ```text
  Next: /dx-review implementation <change-id>   # all phases done
  Next: /dx-implement <change-id>            # more phases remain — runs the next one
  ```

### `/dx-tdd`
- **Invoke:** user — `/dx-tdd [change-id]`
- **Purpose:** the red-green sibling of `/dx-implement` — execute one phase test-first (failing test before code), then commit; see [implement vs TDD](../explanation/implement-vs-tdd.md).
- **Reads:** same as `/dx-implement` — `plan.md`, its upstream, Standards and Priors, `foundation/glossary.md`, the `progress-format`/`plan-template` references. Runs the shared `start-check` (work branch, context commit, stopped-run guard) before the phase; no worktree, it always works in the current checkout, and it stops and points at `/dx-implement` if a stopped auto run left a kept worktree.
- **Writes:** failing test then minimal production code per behavior; flips `## Progress` boxes with SHA; sets `change.md` `status: implementing` → `implemented`. Applies the same Manual-row label rule as `/dx-implement`. Hands pure-scaffolding phases to `/dx-implement`.
- **Prints next:**
  ```text
  Next: /dx-review implementation <change-id>   # all phases done
  Next: /dx-tdd <change-id>                  # more phases remain — next one test-first
  Next: /dx-implement <change-id>            # ...or drive the next phase standard
  ```

---

## Review & triage

### `/dx-review`
- **Invoke:** user — `/dx-review <policy-id> [container-id | paths…] [instructions…]`
- **Purpose:** run the review a **Policy** defines, and **report**. On a change or effort it is a container run that writes a report; over the repo or folders it is an **Explore run** that presents Candidates. The Policy file holds the criteria (preconditions, what to load, dimensions, extra checks, what a pass sets, next steps), and the skill holds the mechanism. `/dx-review plan <change-id>` is the optional pre-implementation gate (substance, feasibility, architectural fitness, standards-fit) and `/dx-review implementation <change-id>` the post-implementation gate. `/dx-review test-strategy <container-id | folder>` checks whether the testing strategy matches the problem class of the code under test. `/dx-review sessions [instructions…]` is a report-only retrospective over agent session transcripts (see below). Arguments resolve positionally: a container ID, else the leading tokens that are existing repo paths, and the first token that is neither starts the custom instructions, which steer the run and may pre-answer a gate. A container plus a path is refused as ambiguous, and no container and no path asks what to review. See [policy-driven review](../explanation/policy-driven-review.md) and [write a review policy](../tutorials/write-a-review-policy.md).
- **Reads:** the Policy at `context/config/review-policies/<policy-id>.md` and `review-report.md` beside it (both seeded by `/dx-init`), whatever the Policy's `## Load` names, `foundation/glossary.md`, and `foundation/lessons.md` when deciding what to offer for a recurring finding. It refuses an unknown policy ID (listing the available IDs and noting that re-running `/dx-init` seeds any missing built-in Policy), a run with no `review-policies/` (pointing at `/dx-init`), a target the Policy doesn't accept, an Explore run on a Policy with no `## Candidates`, an archived container, and a failing Policy precondition. When the Policy has `## Questions`, a run (container or Explore) works in stages and asks each stage's triggered gates as one confirm-or-edit round, judging nothing a round `blocks:` until it is answered; a skipped or unanswerable gate leaves the unit `unconfirmed`, reported with its assumption and no verdict. Explore runs also read `git log` (recency prior, unless the Policy sets `recency: off`).
- **Writes:** a container run writes `context/{changes|efforts}/<container-id>/reviews/<policy-id>.md`; an Explore run writes no report, and a Policy with `promote: off` writes nothing at all. Promoting **one** Candidate writes `context/changes/<slug>/change.md` (the Policy's default `type`) and a seed `research/<topic>.md`; promoting **several** prints a seed block headed `## <Policy> candidates (from /dx-review <policy-id>)` for `/dx-new`. The report file is overwritten on each re-run after a confirmation if it still holds PENDING findings. The report has one verdict line per Policy dimension, findings tagged as the Policy declares, and an optional `## Reviewed` list of every unit checked (`OK | MISMATCH | unconfirmed`). On a pass it applies the Policy's `## On pass` (`implementation` sets `change.md` `status: reviewed`), except when custom instructions left a dimension unchecked. It invokes `/dx-diagnose` on a regression and never fixes the work it reviews. For a recurring or non-obvious finding it offers `/dx-lesson`, or `/dx-standards-update` when the finding repeats an existing lesson or exposes a gap in a standard. It never writes either itself.
- **Prints next:**
  ```text
  Review written: context/<changes|efforts>/<container-id>/reviews/<policy-id>.md
  Next: /dx-review-triage <container-id> <policy-id>   — triage findings and apply fixes
    or: <each line of the Policy's ## Next>
  ```
  An Explore run prints instead:
  ```text
  Promoted one: Change created: context/changes/<slug>/change.md   (type: <type>, seeded with the Candidate)
                Next: /dx-plan <slug>
  Promote many: Next: /dx-new "<the printed seed block, heading through Start with:, verbatim>" → /dx-roadmap <effort-id>
  Record a no:  /dx-lesson
  ```
  An Explore run on a Policy with `## Candidates` `promote: off` (the built-in `sessions`) prints the ranked Candidates, the `Reviewed` list and a top pick, then stops: no promote question, no `Next:` line, no `/dx-lesson` or `/dx-standards-update` offer, no rejection-memory read.
- **`sessions` Policy:** `targets: explore`, `promote: off`. It reads agent session transcripts (the current session by default; instructions may name a session, the last N, or all of this project's) only through `Explore` subagents, and runs eight lenses (Navigation, Automated checks, Coding standards, Global AGENTS.md, Tool economy, No-ops, Information access, Skill use), each with a `Use when` trigger; a lens with no evidence is `N/A` in `Reviewed`. Each Candidate carries `where: repo | user-global` and a descriptive `destination:` label that routes nothing. With no readable transcript only the static lenses run. Credentials and customer content are never reproduced. Seven lenses come from Matt Pocock's `retro`; `Skill use` is not from retro and is unsourced. See [run the sessions retrospective](../tutorials/run-sessions-retrospective.md).

### `/dx-review-triage`
- **Invoke:** user — `/dx-review-triage <container-id> [policy-id]`
- **Purpose:** the sole skill that **acts** on a review finding — walk one review report finding by finding and apply the fixes you confirm; see [review and triage](../tutorials/review-and-triage.md).
- **Reads:** the report at `reviews/<policy-id>.md` in the change or effort (resumes at the first `Resolution: PENDING`). With no policy ID it uses the only report there, or asks which one when there are several. A legacy `reviews/plan-review.md` or `reviews/impl-review.md` is never read — it points at `/dx-review plan <container-id>` or `/dx-review implementation <container-id>` instead. Loads the report schema from `context/config/templates/review-report.md`, and for each pending finding only what its **Location** names — a plan section, or a `file:line` plus enough surrounding code to judge the fix. Refuses an archived container.
- **Writes:** the fixes you confirm, and each finding's `Resolution:` line updated in place. A fix that touched files outside `context/` is committed on its own as `fix(<container-id>): <finding title> (review)`; a fix that touched only `context/` artifacts (such as `plan.md`) is left uncommitted. Never commits the report file.
- **Prints next:**
  ```text
  Triaged <report file>: <n> fixed, <n> skipped, <n> accepted, <n> dismissed
  Next: /dx-review <policy-id> <container-id>   — re-review after fixes
    or: <each line of the Policy's ## Next>
  ```

---

## Effort level

### `/dx-roadmap`
- **Invoke:** user — `/dx-roadmap [effort-id]`
- **Purpose:** decompose an effort into an ordered list of vertical slices, each mapping to one child change and able to ship alone (a candidate that only hardens or extends another is folded in as a phase, and the lead slice is the tracer: one happy path and one negative test end to end) — decomposes but does not create the changes; see [efforts and changes](../explanation/efforts-and-changes.md) and [run an effort](../tutorials/run-an-effort.md).
- **Reads:** `effort.md` (its `## Goal`), the effort's `research/`, `frame.md`, and `brainstorm.md` (its capability split is raw material for the slices), `foundation/glossary.md`; runs a short anchor interview to settle slice ordering, then prints the ordered slices as a table (`#`, change id, why-here, depends on) before asking you to confirm.
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
- **Purpose:** hunt the codebase for design problems worth fixing — shallow modules to turn deep, what the wider design lenses surface (duplication, coupling, single-responsibility), and code that breaks the project's own structural standards — present them inline with an opinionated top pick, optionally design each pick twice before committing to it, and promote the ones you pick; see [find refactors](../tutorials/find-refactors.md).
- **Reads:** the `module-design` reference for its vocabulary (deep vs shallow, seams, leverage and locality, adapters, dependency category, the deletion test, and the rejected framings that keep words like "component / service / boundary" out), the `design-lenses` reference for what to scan *for* beyond module depth, the `knowledge-layer` reference and the `context/standards/` files its *domain × topic* rule matches to the scope (a scoped run: `global/` plus the scoped code's areas; unscoped: every standard that applies somewhere in the tree) — of which only structural rules existing code can be checked against count, never plan-authoring or style rules — `foundation/glossary.md`, `foundation/lessons.md` (to skip prior rejections, including "don't migrate X to rule Y because Z" and "don't propose rule X because Z"), `git log --oneline` (recency as the default scan prior — churn pulls attention first), the codebase (via `Explore` subagents scoped to `[area or path]`).
- **Writes:** candidates inline as markdown — each carrying a one-line `Shape: before → after`, a strength tag (desirability), a dependency category (feasibility), and a win cashed out in `module-design` terms rather than "cleaner code"; `module-design` is the sole phrasing vocabulary except that a standard-driven candidate may name *where things sit* with the standard's roles. A standard-driven candidate is one per broken rule, not per site — a site count, a few representative sites, and a `<standard path> § <rule>` citation — ranked with the lens candidates on the same terms. The standard beats a lens (code that follows a standard gets no lens candidate, at most one `revisit <standard> § <rule>?` line under the list), a module that breaks a rule and trips a lens is one candidate, and a candidate that would add a layer with no second use is capped at `Speculative` (dropped where a loaded standard says minimal implementation wins). The list closes with a one-sentence **top pick** (which to tackle first and why, since the strength tag ranks confidence, not sequence). Under the top pick and any `revisit` line come zero or more **Standard Proposals**, one for each cause shared by at least three distinct candidates (counted as candidates, not sites) that no rule covers. Each proposal gives a prescriptive one-line `Rule:`, a target (`new rule in <layer>/<topic>.md`, or `amend <path> § <rule>` when the cause falls within an existing standard's topic) and a `Cause:` citing the candidates it comes from. Before proposing, the skill reads the target standard file even when a scoped run didn't load it; a cause a rule already states gets no proposal, since its violations are already standard-driven candidates. An amendment only extends or tightens a rule, never loosens one, and the `revisit` line stays separate. A proposal is a project rule checkable in this code, never a lens restated and never a layer with no second use. When no cause clears the bar, nothing is printed, not even a "none found" line. The user accepts proposals in the same reply as the picks. An accepted proposal goes straight to `/dx-standards-update` as the second promotion path (see the `knowledge-layer` reference), and a proposal declined with a reason is offered to `/dx-lesson`. Candidates and proposals are both ephemeral: there is no debt register. After the pick, an **opt-in "design it twice"** step offers per-candidate exploration: one pick gets a plain yes/no, more than one gets a single batched pick (*none* / *all* / *specific ones*, recommending the top pick) followed by the same exploration run once per selected candidate, sequentially — never spawning the next candidate's sub-agents before the current one's sketch is confirmed. Each run spawns 3–4 built-in `Plan` subagents in parallel, each under a forcing constraint stated as *where the seam goes* rather than a value to maximize (collapse to 1–3 entry points · move part of the contract out of the interface · split the seam so common and rare callers reach different entry points · ports & adapters, gated on the dependency category), each returning interface + usage example + what's hidden behind the seam + dependency strategy + trade-offs; the survivors are compared on depth, locality, and seam placement and closed with an opinionated pick or hybrid. For a single pick, `context/changes/<slug>/change.md` stamped `type: refactor` with the candidate — its `Standard: <path> § <rule>` line if standard-driven, and the chosen sketch, if the step ran — as its seed `research/`/`frame.md`, so `/dx-plan` reads it as upstream instead of re-deriving it. Many picks are handed to `/dx-new` as a seed summary that carries the `Standard:` line for each standard-driven candidate, the chosen sketch for each explored candidate, and the top pick as its closing `Start with:` line. Still writes no `plan.md`, edits no code, and never writes `context/standards/`.
- **Prints next:**
  ```text
  Promoted one: Change created: context/changes/<slug>/change.md   (type: refactor, seeded with the candidate)
                Next: /dx-plan <slug>
  Promote many: Next: /dx-new "<seed summary>"   →  /dx-roadmap <effort-id>
  Propose a rule: Next: /dx-standards-update   (run in this session; printed alongside any promotion command)
  Record a no:  /dx-lesson                (don't re-deepen X because Y / don't migrate X to rule Y because Z / don't propose rule X because Z)
  ```

---

## Lifecycle close

### `/dx-archive`
- **Invoke:** user or model (by name, no auto-fire) — `/dx-archive [change-id or effort-id]`
- **Purpose:** retire a finished change or effort — move its folder to `context/archive/` and stamp it archived. No registry; the archive is just where done work lives; see [ship a change](../tutorials/ship-a-change.md).
- **Reads:** the container folder; for an effort, `roadmap.md` and each child change's `archived_at` (children must all be archived first); for a change, every `reviews/*.md` report except the legacy `impl-review.md` and `plan-review.md` (warns on any `Resolution: PENDING`, naming `/dx-review-triage <id> <policy-id>`, and asks whether to archive anyway); the `change-md`/`effort-md` reference for the schema.
- **Writes:** moves the folder to `context/archive/<today>-<id>/` (prefers `git mv`); stamps the identity file `status: archived` with `archived_at` set and `updated` bumped.
- **Prints next:**
  ```text
  ✓ Archived <id> → context/archive/<today>-<id>/
  ```
  Then suggests `/dx-new <idea>` to start fresh.

---

## Plumbing

### `dx-references`
- **Invoke:** internal (`user-invocable: false`) — invoked by other skills as `dx-references <topic> [<topic>...]`, **not** a slash command you type.
- **Purpose:** load one or more shared reference documents by topic (several in one call; any unknown topic is reported with the available list) so several skills read one canonical copy instead of deep-linking each other's files.
- **Reads:** `references/<topic>.md` for each named topic, from the twelve: `change-md`, `effort-md`, `progress-format`, `plan-template`, `plan-data-model`, `plan-api-contracts`, `plan-failure-modes`, `interview`, `module-design`, `design-lenses`, `knowledge-layer`, `untrusted-content`. (There is no `model-policy` topic.)
- **Writes:** nothing — it returns the reference content to the calling skill.
- **Prints next:** nothing — it has no `Next:` line; control returns to whichever skill invoked it.

---

## Related
- [Documentation home](../README.md) — the map of all dx- docs.
- [Glossary](glossary.md) — the terms these skills use, defined.
- [Workflow overview](../explanation/workflow-overview.md) — how these skills fit into one lifecycle.
- [Efforts and changes](../explanation/efforts-and-changes.md) — the two-level model `/dx-new` and `/dx-roadmap` route.
- [Directory layout](../explanation/directory-layout.md) — the `context/` files every skill reads and writes.
