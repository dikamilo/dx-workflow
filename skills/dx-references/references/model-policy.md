# Model policy — picking a model and effort level for a subagent

Two levers, not mutually exclusive:

1. **Skill-level frontmatter** (`model`, `effort`, `context: fork`, `agent`) — fixes what the *whole invocation* of a skill runs at. `context: fork` additionally isolates it into a subagent with no conversation history, just the skill body as its prompt; `model`/`effort` can be set alongside a fork to pin what that forked run uses, or set alone with no isolation. `context: fork` only fits a skill with **zero mid-run interaction** — a fork returns one final result, it can't hold a one-question-at-a-time loop. `dx-research`, `dx-plan-review`, `dx-impl-review`, `dx-standards-discover` fork (`agent: general-purpose`): argument in, file(s) out, nothing asked mid-run. Interview/confirm-loop skills (`dx-plan`, `dx-frame`, `dx-roadmap`, `dx-review-triage`) never fork for that reason; skills whose behavior depends on knowing what the conversation was doing before they fired (`dx-domain`, mid-task `dx-diagnose`) can't either — forking drops exactly the context they need.
2. **Body-level fan-out** — a skill, running normally or already inside a fork, spawns its own `Explore`/`general-purpose` subagents ad hoc for one sub-task (search, verify-a-claim, one self-contained implementation task). Finer-grained, and what the rest of this reference is about.

## The four models

| Model | Cost | Intelligence | Speed | Use for |
|---|---|---|---|---|
| **Haiku** | lowest | lowest | fastest | mechanical, high-volume, low-judgment: grep-shaped search, file:line refs, applying an already-fully-specified fix |
| **Sonnet** | mid | mid–high | mid | default for most fan-out and synthesis — matches the orchestrating skill's own judgment level |
| **Opus** | high | highest | slowest | judgment calls where being wrong is expensive to catch later (plan-review's architectural fitness, ranking hypotheses on a bug that resisted the first pass) |
| **Fable** | highest (API-only, no subscription) | — | — | **not a default for anything.** Explicit user request or a stakes level Opus can't meet only. Never auto-selected. |

Relative, not absolute — the ordering matters (Haiku ≤ Sonnet ≤ Opus ≤ Fable on cost), not a number that will go stale.

## Whether to delegate at all

Two justifications: the work is genuinely disposable fan-out (search, verification-against-reality, a well-scoped write with its own check), or it would dump a large volume of reference material into the main thread that the orchestrator doesn't itself need to reason over. Delegating for its own sake isn't one.

**Never delegate an interactive step.** Anything mid-interview or mid-confirmation (`dx-review-triage` walking findings one at a time) stays in the main thread.

**Push a reference load into the subagent that actually uses it**, not the orchestrator — e.g. a subagent judging pattern depth invokes `dx-references` with `module-design` itself, rather than the orchestrator loading it first and re-explaining it in the prompt. Load once, where it's used.

## Write-capable delegation

Not all delegation is read-only. `dx-implement`/`dx-tdd` run one phase per invocation, but a phase is usually a short sequence, not one atomic step — sketch it as an in-memory task list first (scratch reasoning, never written to `plan.md`), then decide per task:

- **Delegate** a task that's self-contained (own files, a check to point the subagent at, nothing later needs your reasoning about it) — give it write access, the check to run, and have it report what it did and the result.
- **Keep inline** a task that's small, or whose approach shapes a judgment call a later task depends on.
- **Verify before trusting.** A write-capable subagent's mistake is a real edit, not a wasted read — check its report against its own stated check before folding it in.

## Picking the model

Default **Sonnet**. Drop to **Haiku** for mechanical, easy-to-verify asks; if the result comes back thin or misses an obvious cross-reference, don't patch it — rerun on Sonnet. Escalate to **Opus** for genuine judgment calls where a wrong verdict is costly (architectural fitness, a hypothesis rank that resisted the first pass, a subtle pattern verdict). Fable stays off in every case above.

State the model explicitly in the call rather than leaving it to default, and size the prompt to match: narrow and fully-specified for a Haiku run (it isn't asked to exercise judgment it doesn't have); full context for an Opus run (truncating it defeats the point of paying for intelligence).

## Escalate, don't average

If a cheaper model's output doesn't clear the bar — thin, hallucinated, missed something asked for — rerun on a smarter model rather than hand-patch or accept it. A redo costs less than work built on a mediocre pass. Never silently downgrade correctness to save cost, and say plainly when a result is a redo, not the first pass.

## Skill-level `effort:`

Only set the frontmatter `effort` (`low`/`medium`/`high`/`xhigh`/`max`) when a skill's whole job sits at one uniform tier — most dx- skills mix a cheap step with a judgment-heavy one and should just inherit the session's effort. `dx-archive`, `dx-lesson`, `dx-new`, `dx-init` set `effort: low`: each is one mechanical action, start to finish, with no step that benefits from more. Don't set it on `dx-plan-review`/`dx-impl-review` just because "review matters" — those fork instead, and the judgment-heavy dimensions already get escalated at the body-level fan-out, which is the more precise lever.
