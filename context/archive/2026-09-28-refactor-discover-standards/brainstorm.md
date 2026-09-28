---
created: 2026-09-28
---

# Brainstorm — refactor-discover-standards

## The question
A target project can adopt normative rules in `context/standards/` (the motivating example: an "Architecture Building Blocks" standard that assigns every unit one DDD / ports-and-adapters / frontend role, and says "Persistence is an out-adapter only", "the domain never reads a session", "one unit, one block") that its existing code does not yet follow. Nothing in the workflow ever finds that mismatch. `dx-plan` matches standards into new work and `dx-impl-review` checks compliance, but only on a change's diff. `dx-refactor-discover` judges existing code only against universal lenses (`module-design`, `design-lenses`) and never reads `context/standards/`. Code that breaks a project rule stays invisible until some change happens to touch it, and even then only the touched lines are checked.

The reverse direction has no path either. When a run turns up many findings with one shared cause, that cause is exactly what a standard would have prevented, but nothing points at it. The findings get promoted or rejected one by one, and the cause keeps producing new ones.

Observable differences wanted:
1. On a project whose standard says "the domain never imports the database client", a `/dx-refactor-discover` run surfaces "domain modules import the DB client (N sites)" as a ranked, promotable finding, without the user having to name the standard.
2. When several findings in a run share a cause that no rule covers, the run ends with a suggested rule and the `/dx-standards-update` command to record it.

## Alternatives weighed
- **A. Both capabilities inside `dx-refactor-discover` — chosen.** Standards become a third finding source, reusing the skill's scan → rank → pick → design twice → promote pipeline and the lesson path for rejected findings. A finding from a broken standard is still a refactor candidate: it changes structure without changing behavior, and it ends up as a `type: refactor` change. Standard suggestions sit at the end of that same run, which is the only moment the whole set of findings, and so the pattern across them, is in view.
- **B. A separate check that compares the whole codebase against the standards** (like `dx-impl-review` pointed at the whole tree instead of a diff) — lost. It would be a new skill plus docs, entries in `skills.sh.json`, and a second ranking and promotion flow duplicating `dx-refactor-discover`'s. Its one advantage (checking rules and judging design are different jobs) doesn't hold up: the findings end up in the same kind of change, and the user wants a single discovery run.
- **C. Leave standard suggestions to `dx-standards-discover` / `dx-standards-update`** — lost for the suggestion half. Those skills write standards when the user runs them; neither sees a refactor run's findings, so the connection "these 7 findings share one cause" is lost the moment the run ends (findings are temporary by design). `dx-standards-update` stays the only writer, and the suggestion hands off to it.
- **Do nothing (priced)** — lost. The user passes the standard's path in the argument each run (`/dx-refactor-discover src/domain — also check context/standards/backend/architecture.md`), and spots repeating patterns by eye. Cost: one line per run, plus remembering which standards exist. The real cost falls on the rules nobody thinks to mention, whose violations stay hidden indefinitely. On a project that adopted standards after the code was written, that's most of them. The recurring-cause pattern is lost every run. The skill's `[area or path]` argument doesn't reliably carry this either, because it scopes the scan rather than the criteria. It stays usable as the cheap test (below).

## Conclusion & route
Ramp 4 — an effort. Bundling test: yes, each capability works without the other. The standards lens works with no suggestion step. Suggestions work on a project with no standards at all, fed only by design-lens findings. The user chose the effort over folding both into one change. Brainstorm's read on order (`/dx-roadmap` decides): the lens first, since it is the direct ask and lets slice 2 suggest *amendments* to existing standards, not only new ones.

What the adversarial pass left standing:
- **Riskiest assumption: a codebase that doesn't follow its standards yields a short list of useful findings, not a flood.** Grouping per rule is the mitigation. Cheapest test, before planning slice 1: run the current skill on one real area with a building-blocks-style standard passed by hand (the do-nothing), and see whether the per-rule findings are few and useful or noise.
- **Suggestions spamming the user.** A suggested standard on every run turns into noise and gets ignored. How many related findings, or how much repetition, justifies a suggestion is slice 2's plan question. The bar should be "several findings share one cause", not "a finding exists".
- **What breaks if this succeeds:** (1) the "module-design is the only phrasing vocabulary" rule (`SKILL.md` §2, `design-lenses.md`, `DESIGN.md` §9) gets a stated exception, since standard-driven findings may use the standard's role names. Every place that says "sole vocabulary" must be updated together or they'll contradict each other. (2) Standards written for new work (e.g. "describe a plan in building blocks") don't apply to existing code. The skill has to tell apart rules that apply to existing structure from rules about how to write plans or style, or it produces noise. (3) A project's `minimal-implementation.md` can conflict with a structural standard. The example standard handles this itself ("`minimal-implementation.md` wins wherever the two pull apart"), but the skill mustn't propose building empty layers ahead of need in a standard's name. (4) `DESIGN.md` §8's lifecycle diagram gains a new link: refactor-discover → suggests a standard → standards-update. Today the only way into standards from findings is a lesson graduating. The plan must decide whether a suggestion skips the lesson step or goes through it, and update `knowledge-layer.md`'s "that is the only promotion path" line to match.
- **Existing mismatch found along the way:** `skills/dx-references/references/knowledge-layer.md:3` and `DESIGN.md` §8 already list `dx-refactor-discover` as a consumer of `knowledge-layer`, but `SKILL.md` never loads it. Slice 1 either makes that claim true (loading `knowledge-layer` for its matching rules is a natural fit) or corrects it.
- Evals: no harness exists (`foundation/lessons.md`, 2026-07-28). State the deviation in each slice plan's `## Standards to apply` rather than dropping it.

## Resolved unknowns
| Question | Answer |
|---|---|
| Direction of "challenge"? | Code against the standard. The standard is treated as correct, and code that doesn't follow it becomes a finding. |
| How is a standard-driven finding phrased? | It cites the standard's path and rule (e.g. `backend/architecture.md` § Persistence), may use the standard's own role names for what's where, and still states the win in `module-design` terms (locality, leverage, seam). Same rule as `design-lenses`: naming a broken rule identifies the problem but isn't the payoff. |
| How are repeated violations reported? | One finding per broken rule: a few representative places plus a count ("14 sites, e.g. a.ts, b.ts"), ranked with the other findings by the usual rules (how often the code changes, strength tag). If promoted, the change plans the migration. |
| Which standards are loaded? | Only those matching the scope, using `dx-plan`'s area × topic rule: a scoped run loads the relevant `global/` + area standards, and an unscoped run loads every standard that applies somewhere in the tree. Style-only rules (formatting, naming nits) are skipped because they aren't about structure. |
| Standard vs built-in lens conflict (e.g. the standard requires a Repository out-port, while module-design's "one adapter = hypothetical seam" would call it shallow)? | The standard wins: no lens finding against code that follows a standard. When the conflict looks costly, mention it in one line under the findings so the user can decide whether to revisit the standard. |
| Should the skill suggest changes to standards? | Yes (user, added mid-brainstorm). When findings reveal a recurring cause, suggest a new rule, or an amendment to an existing one, that would prevent it in the future. |
| Who writes the standard? | Never `dx-refactor-discover`. It prints the suggested rule and the `/dx-standards-update` command, then stops (no auto-chain). `dx-standards-update` stays the only writer of `context/standards/`. |
| One change or an effort? | An effort with two independently shippable capabilities (the lens, the suggestions), chosen by the user per the bundling test. |

## Not doing
- `dx-refactor-discover` writing or editing any file under `context/standards/`. It only suggests.
- A new separate skill for checking code against the standards (alternative B).
- One finding per violating site.
- Loading the whole `context/standards/` tree regardless of scope, or loading only standards the user names.
- Writing an audit file, debt list, or a list of pending suggestions. Findings and suggestions stay temporary, as today; a rejected standard-driven finding takes the existing `/dx-lesson` path ("don't migrate X to rule Y because Z").
- Enforcing standards on new work. That remains `dx-plan` / `dx-impl-review`.
- A `roadmap.md` — cutting the slices is `/dx-roadmap`'s job.
