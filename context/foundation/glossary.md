# Glossary — ubiquitous language for this project

**Change**: A single shippable unit of work, carrying an identity and its own execution state. _Avoid_: Effort, Slice.

**Effort**: A larger body of work that decomposes into vertical slices, each becoming its own child Change. _Avoid_: Change, Project.

**Slice** (Vertical Slice): An end-to-end, demoable segment of an Effort's roadmap that cuts through every layer it touches, rather than one horizontal layer; each slice spawns one child Change. _Avoid_: Phase (a step within a Plan, not within an Effort).

**Progress**: The single source of truth for execution state. Two senses share the name, disambiguated by context: within a Change, it's the checkbox section in the Plan (resume at the first unchecked box); at the Effort level, it's the derived completion ratio across child Changes' archived status. _Avoid_: Status (the `status:` frontmatter field, a separate concept).

**Plan**: The solution design document for a Change — the chosen approach, matched Standards, surfaced Lessons, and phases — and owner of Progress. Answers "what is the right solution?" _Avoid_: Frame, Research.

**Frame**: The problem-framing document for a Change or Effort — the real problem, who/what it affects, alternatives considered, and what's out of scope. Answers "what is the right problem?", not the solution. Optional; a Change may skip it, never skips a Plan. _Avoid_: Plan, Research.

**Research**: An investigation recorded with provenance (topic, kind, source, and either a code reference or a citation), one file per topic. A deliberate act, not something auto-produced by another skill. _Avoid_: Frame, Diagnosis.

**Diagnosis**: A feedback-loop-first bug investigation — build a reproducing loop first, then hypothesize, instrument, and fix; when non-trivial, promotes into a defect-type Change. _Avoid_: Research (investigation without a symptom to chase).

**Brainstorm**: A divergent conversation about whether an idea is worth building at all, held before any container exists and recorded at a Change or Effort root — the alternatives weighed, the priced do-nothing and why it lost, the routing conclusion, and what is explicitly not being done. Deciding to build nothing is one of its valid terminal outcomes. _Avoid_: Research (an investigation recorded with provenance, not a divergent conversation), Frame (frames the problem for work already deemed worth doing).

**Standard**: A normative, prescriptive rule that is project-wide and stable, matched into a Plan's checklist by domain and topic. _Avoid_: Lesson, Glossary.

**Lesson**: An append-only record of scar tissue ("this broke") or a load-bearing decision ("we chose X over Y because Z"); recurring Lessons graduate into a Standard. _Avoid_: Standard (prescriptive, not cautionary/decisional), ADR (a decision-with-rationale is a Lesson here, not a separate register).

**Glossary**: The ubiquitous-language document itself — domain terms and their definitions only, never a spec, rationale, or implementation detail. _Avoid_: Standard, Lesson.

**Interview**: The one-question-at-a-time questioning discipline that walks a decision tree with concrete options until every branch resolves, used during Framing and solution design. _Avoid_: Form, batched questionnaire.

**Plan-review**: The optional pre-implementation gate that reports findings on a Plan's substance, feasibility, architectural fit, and Standards-fit; never edits the Plan itself. _Avoid_: Impl-review, Review-triage.

**Impl-review**: The post-implementation gate that reports findings on plan-drift, safety, patterns, and Standards compliance against finished work; never edits code itself. _Avoid_: Plan-review, Review-triage.

**Review-triage**: The sole skill that acts on a Finding from Plan-review or Impl-review — fix, skip, accept, or record as a Lesson. _Avoid_: Plan-review, Impl-review (both stay report-only).

**Finding**: A discrete, stably-numbered item in a review report, carrying a location, detail, recommended fix, and resolution status; never renumbered or deleted. _Avoid_: Issue, Bug.

**Deep Module**: A unit with a lot of functionality hidden behind a small interface — the good default for design. _Avoid_: Shallow Module.

**Shallow Module**: A unit with a wide interface over little behavior — usually a smell, occasionally a deliberate, flagged exception. _Avoid_: Deep Module.

**Seam**: A place where behavior can be changed without editing around it — the natural boundary to split, substitute, or test at. _Avoid_: Boundary, Interface.

**Deletion Test**: The question "if this were deleted, what would break?" — used to tell load-bearing complexity from speculative complexity. _Avoid_: Impact analysis.

**TDD Gate**: The Plan characteristic for a defect-type Change — the first phase writes a failing regression test before the fix. _Avoid_: Behavior-preserving Gate, Rollback Phase.

**Behavior-preserving Gate**: The Plan characteristic for a refactor-type Change — tests are green before and after, and observable behavior is unchanged even as structure improves. _Avoid_: TDD Gate, Rollback Phase.

**Rollback Phase**: The Plan characteristic for a migration-type Change — an explicit, separate, user-confirmed rollback step; never an automatic rollback. _Avoid_: TDD Gate, Behavior-preserving Gate.

**Skill**: A discrete, invokable unit of the workflow, named `dx-<x>`, one of three invocation shapes: user-invoked (runs only when typed), model-invoked (fires when its trigger is recognized), or user-invoked *and* explicitly model-callable by another skill's instruction (named invocation, never opportunistically auto-fired). _Avoid_: Command, Agent.

**Discovery Entry**: A Skill that starts from a symptom rather than a request, produces a Finding, and promotes it into a Change or Effort rather than keeping its own durable register. _Avoid_: Entry point, Bootstrap.

**Changeset**: A `@changesets/cli` artifact — a markdown file under `.changeset/` recording an intended semver bump and its rationale for a pending PR touching `skills/`; consumed by CI to version-and-release, unrelated to the dx workflow's own Change. _Avoid_: Change (the dx workflow's shippable unit — same root word, different concept).
