# Model policy — picking a model and effort level for a subagent

**Skill-level frontmatter** (`model`, `effort`, `context: fork`, `agent`) fixes what the *whole invocation* of a skill runs at, decided once in that skill's own file. **Body-level fan-out** — this reference's subject — is finer-grained: a skill, running normally or already inside a fork, spawns its own `Explore`/`general-purpose` subagents ad hoc for one sub-task (search, verify-a-claim, one self-contained implementation task), and picks that subagent's model each time it does.

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

**Never delegate an interactive step.** Anything mid-interview or mid-confirmation stays in the main thread.

**Push a reference load into the subagent that actually uses it**, not the orchestrator — e.g. a subagent judging pattern depth invokes `dx-references` with `module-design` itself, rather than the orchestrator loading it first and re-explaining it in the prompt. Load once, where it's used.

## Write-capable delegation

Not all delegation is read-only. A phase-style task list can be delegated per task:

- **Delegate** a task that's self-contained (own files, a check to point the subagent at, nothing later needs your reasoning about it) — give it write access, the check to run, and have it report what it did and the result.
- **Keep inline** a task that's small, or whose approach shapes a judgment call a later task depends on.
- **Verify before trusting.** A write-capable subagent's mistake is a real edit, not a wasted read — check its report against its own stated check before folding it in.

## Picking the model

Default **Sonnet**. Drop to **Haiku** for mechanical, easy-to-verify asks. Escalate to **Opus** for genuine judgment calls where a wrong verdict is costly (architectural fitness, a hypothesis rank that resisted the first pass, a subtle pattern verdict). Fable stays off in every case above.

Size the prompt to match: narrow and fully-specified for a Haiku run (it isn't asked to exercise judgment it doesn't have); full context for an Opus run (truncating it defeats the point of paying for intelligence).

**Set the parameter, not just the judgment.** Deciding "this is mechanical, cheapest model" only has an effect if it lands on the actual call: pass the Agent tool's `model` field explicitly — `"haiku"`, `"sonnet"`, `"opus"`, or `"fable"` — every time, for both `Explore` and `general-purpose`. Leaving `model` unset is not neutral: the subagent inherits whatever model is currently running the orchestrator, which silently defeats this whole policy the instant the orchestrator itself is on Sonnet or Opus — the fan-out never actually gets cheaper no matter how clearly the skill body argues it should.

**Escalate, don't average.** If a cheaper model's output doesn't clear the bar — thin, hallucinated, missed something asked for, misses an obvious cross-reference — rerun on a smarter model rather than hand-patch or accept it. A redo costs less than work built on a mediocre pass. Never silently downgrade correctness to save cost, and say plainly when a result is a redo, not the first pass.
