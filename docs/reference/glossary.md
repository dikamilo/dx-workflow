# Glossary

This glossary defines the vocabulary of the **dx- workflow itself** — the terms you meet while running the skills, reading the files under `context/`, and moving work through the lifecycle. It is *not* your project's domain glossary. Your project builds its own ubiquitous-language dictionary at `foundation/glossary.md` (defined below under **Glossary (`foundation/glossary.md`)**), and the dx- domain skills help you write it — but that file names *your* business concepts (Customer, Invoice, Cart), whereas the terms here name the *machinery* of dx-. Entries are alphabetical; each links to the page that explains it in depth.

**Archive** — the act of moving a finished change or effort folder to `context/archive/<date>-<id>/` and stamping `archived_at` in its `change.md` (status becomes `archived`). Done by `/dx-archive`. See [directory layout](../explanation/directory-layout.md).

**Behavior-preserving gate** — the extra impl-review check on a `refactor`-type change: it verifies the change altered structure only, leaving observable behavior identical. See [find refactors](../tutorials/find-refactors.md).

**Change** — one shippable unit of work, the atomic container of the workflow; its identity and metadata live in `change.md`. A change moves `new → planned → implementing → implemented → reviewed → archived`. See [efforts and changes](../explanation/efforts-and-changes.md).

**Container** — the general term for either level of work: a change or an effort. Both carry a `.md` identity file and a status lifecycle; discovery-entry skills *promote* findings into one. See [efforts and changes](../explanation/efforts-and-changes.md).

**Context (`context/`)** — the root folder that holds all file-derived workflow state in an adopting project. It has exactly five top-level folders: `foundation/`, `standards/`, `efforts/`, `changes/`, and `archive/`. See [directory layout](../explanation/directory-layout.md).

**Deep vs shallow module** — the module-design vocabulary used when hunting refactors: a module's *depth* is the functionality it hides divided by the interface it exposes. Deep is good (much hidden, narrow interface); a shallow module like `config-loader` is a wide pass-through that exposes almost as much as it hides. See [find refactors](../tutorials/find-refactors.md).

**Diagnosis (`diagnosis.md`)** — the artifact a promoted bug carries into its change: a minimised reproduction, ranked hypotheses, and a regression test. `/dx-plan` reads it the same way it reads research. See [diagnose a bug](../tutorials/diagnose-a-bug.md).

**Discovery entry** — a skill that starts work from a raw finding rather than an existing container, then *promotes* it: `/dx-diagnose` (a bug) and `/dx-refactor-discover` (a shallow module). See [skills reference](skills.md).

**Effort** — larger work that does not fit in one change; its identity lives in `effort.md`, and it decomposes into child changes via a roadmap. An effort moves `new → scoped → in-progress → done → archived`. See [efforts and changes](../explanation/efforts-and-changes.md).

**Feedback-loop-first debugging** — the discipline `/dx-diagnose` enforces: build a tight, red-capable feedback loop that reproduces the failure *before* hypothesising about causes. See [diagnose a bug](../tutorials/diagnose-a-bug.md).

**File-derived state** — the founding principle that every piece of workflow state is plain markdown on disk, and nothing is maintained that could instead be derived (lists from `ls`, status from frontmatter, progress from checkboxes). See [directory layout](../explanation/directory-layout.md).

**Foundation (`foundation/`)** — the folder of stable, long-lived reference docs for a project: its glossary, its lessons, and background research. Unlike a change folder, foundation content outlives any single unit of work. See [knowledge layer](../explanation/knowledge-layer.md).

**Frame (`frame.md`)** — the settled problem definition, the WHAT: the real problem, who it affects, the alternatives considered, and what is explicitly out of scope. Produced by `/dx-frame`; read by `/dx-plan`. See [research and frame](../explanation/research-and-frame.md).

**Glossary (`foundation/glossary.md`)** — your *project's* ubiquitous-language dictionary. It is written only by the two domain skills (`/dx-domain-discover` and `/dx-domain`) and names business concepts, not workflow machinery. (This page you are reading is the workflow glossary — a different thing.) See [knowledge layer](../explanation/knowledge-layer.md).

**Handoff scaling** — the way `/dx-plan` scales its interview down by whatever upstream steps already settled: if a `frame.md` and research exist, it asks fewer questions; from a bare `change.md` it front-loads framing. See [handoff scaling](../explanation/handoff-scaling.md).

**Interview** — the one-question-at-a-time alignment loop the skills use to reach agreement. Each question offers 2–4 options with one marked recommended; never a batch form. See [research and frame](../explanation/research-and-frame.md).

**Lesson (`foundation/lessons.md`)** — an append-only note capturing a cautionary or decisional insight from real work. It is the anteroom to a standard: repeated or hardened lessons graduate into prescriptive rules. See [knowledge layer](../explanation/knowledge-layer.md).

**Model-invoked skill** — a skill that can auto-fire from context without you typing its command. Only two are model-invoked: `/dx-diagnose` and `/dx-domain`. See [skills reference](skills.md).

**No auto-chain** — the rule that skills never call one another. Each does exactly one job, prints a `Next:` suggestion, and stops; you run the next command. (And failure never auto-rolls-back — you confirm first.) See [skills reference](skills.md).

**Phase** — one section of a `plan.md`, ideally shaped as a vertical slice so completing it produces a demoable increment rather than a half-finished layer. See [plan and slices](../explanation/plan-and-slices.md).

**Plan (`plan.md`)** — the solution design, the HOW: the phased approach to building a change, plus the `## Progress` section it owns. Written by `/dx-plan`, flipping the change to `status: planned`. See [plan and slices](../explanation/plan-and-slices.md).

**Priors & gotchas** — the section of a `plan.md` fed by matched lessons: the known traps and hard-won cautions relevant to this change, surfaced before you start building. See [plan and slices](../explanation/plan-and-slices.md).

**Progress (`## Progress`)** — the checkbox section inside `plan.md` that is the single source of truth for execution state: `- [ ]` pending, `- [x]` done with ` — <short-sha>` appended when a step lands. Resume is the first `- [ ]` in document order. See [plan and slices](../explanation/plan-and-slices.md).

**Promote** — what a discovery-entry skill does when it turns a finding into a proper change or effort container, giving it an identity file and a lifecycle. See [skills reference](skills.md).

**Research (`research/<topic>.md`)** — gathered, provenance-stamped evidence — from the codebase or external sources — that informs framing and planning. Produced by `/dx-research`. See [research and frame](../explanation/research-and-frame.md).

**Review gate** — a report-only quality checkpoint: `/dx-plan-review` before implementation and `/dx-impl-review` after. Gates only *report* findings; they never edit or act on them. See [skills reference](skills.md).

**Review triage** — the step, run via `/dx-review-triage`, that decides what to do with each review finding (fix now, defer to a lesson, or dismiss). It is the sole skill that acts on a plan-review or impl-review finding. See [review and triage](../tutorials/review-and-triage.md).

**Roadmap (`roadmap.md`)** — an effort's ordered list of vertical slices, each mapping to exactly one child change. Produced by `/dx-roadmap`. See [efforts and changes](../explanation/efforts-and-changes.md).

**Slice** — one item on an effort's roadmap: a vertical, end-to-end tracer bullet that becomes a single child change (e.g. `payments-schema`, `payments-api`, `payments-ui`). See [efforts and changes](../explanation/efforts-and-changes.md).

**Standard** — a prescriptive, project-wide rule living under `context/standards/` (e.g. `context/standards/global/coding-style.md`). Standards are matched into every plan and enforced. See [knowledge layer](../explanation/knowledge-layer.md).

**Standards to apply** — the checklist inside a `plan.md` listing the specific standards matched to this change, so the build conforms to them. See [plan and slices](../explanation/plan-and-slices.md).

**Tracer bullet / vertical slice** — an end-to-end, demoable increment that cuts through every layer (schema → api → ui) rather than completing one horizontal layer at a time. The shape a good phase or slice takes. See [plan and slices](../explanation/plan-and-slices.md).

**Type (change `type`)** — the `type` field in `change.md`: `feature | defect | refactor | migration`. It activates conditional characteristics in the plan (e.g. a defect wants a failing test first; a refactor wants a behavior-preserving gate). See [efforts and changes](../explanation/efforts-and-changes.md).

**User-invoked skill** — a skill reachable only by typing its slash command; it contributes zero context load until called. Every dx- skill except the two model-invoked ones is user-invoked. See [skills reference](skills.md).

## Related

- [Docs home](../README.md) — the map of the whole dx- documentation set.
- [Skills reference](skills.md) — every skill's command, inputs, and outputs, for the terms that name skills.
- [Workflow overview](../explanation/workflow-overview.md) — how these terms fit together into one lifecycle.
