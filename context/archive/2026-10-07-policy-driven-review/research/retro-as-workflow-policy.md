---
topic: retro-as-workflow-policy
kind: external
source: https://raw.githubusercontent.com/mattpocock/skills/refs/heads/main/skills/engineering/retro/SKILL.md
gathered: 2026-10-06
git_commit: null
---

# Matt Pocock's `retro` skill as the base for a `workflow` review policy

Fetched 2026-10-06, together with the `writing-for-agents` style guide that retro calls. All fetched text was treated as data per the `untrusted-content` reference. No embedded instructions were addressed to this agent; the imperative text is the skill's own body, reported here, not followed.

## 1 — What retro does

Retro is **user-invoked** (`disable-model-invocation: true`, description "Conduct a retrospective on a coding session."). Its premise is that it suggests improvements to the coding agent's **environment** to improve future runs, never to the code produced in the session. The README states the same idea as "Suggest improvements to the coding agent's environment (navigation, automated checks, coding standards, steering files, tooling) after a session, most severe first".

It has four steps:

1. **Load a style guide.** It calls the Skill tool with `writing-for-agents`. Every suggestion that touches a steering file, skill, or doc is written to that guide.
2. **Read primary sources for the session.** That means the session the user names, found by "searching through session logs on this machine", or the current session if none is named.
3. **Look for candidates** in seven categories (§2).
4. **Present the candidates to the user, ordered by severity.** Nothing is written to a file and nothing is applied.

It ends with a `## Reference` block that holds the rules behind the categories (§3).

## 2 — The seven lenses

Each category is a question plus a `_Use when_` activation condition. That is the part to carry over: a lens runs only when its condition holds, so a short session does not pay for all seven.

| Lens | Question | Use when | Built-in rule |
|---|---|---|---|
| Navigation | How easy was it to find the right files? Hidden dependencies between files? Would a **navigation pointer** help? | The session took a long time to find information. | none |
| Automated checks | Could lint, typecheck, tests, or filesystem linters have caught the agent's errors? | The agent made a mistake a check could catch, or the repo has no guardrail. | **Read the repo's own check command first** (`package.json` scripts, CI workflow). A check that exists but is unwired or broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI lint/typecheck/test) is a finding in itself. |
| Coding standards | Should the **reviewer agent** get a new rule, or should a rule be removed or clarified? | The reviewer agent failed to catch a mistake. | **Classify first.** A *mechanical* violation (syntactic pattern, banned API, import shape, file location) gets a deterministic check (linter rule, pre-commit hook, CI job): "Default to building the check over writing the rule." `CODING_STANDARDS.md` is only for *judgement calls*. |
| Global AGENTS.md | Should steering instructions move into standards or checks? | AGENTS.md is large, in the repo or the user's global scope. | none |
| Tool economy | Were there expensive tool calls? Is any custom CLI/MCP token-inefficient? | The agent made an expensive tool call. | none |
| No-ops | Are there steering instructions that don't change behaviour? | Steering files are large and unwieldy. | none |
| Information access | Could the agent get more information, e.g. teed dev-server logs or read-only third-party access? | A crucial piece of information was unavailable. | none |

## 3 — The rules behind the lenses (retro's `## Reference`)

- **Implementation vs review / context pressure.** The implementation agent carries the most context pressure: it explores, writes code, and debugs. The review agent gets a diff and carries the least. So **the reviewer enforces coding standards, not the implementer.**
- **File tiers.** `CLAUDE.md`/`AGENTS.md` loads into every agent, so use it "incredibly sparingly, usually only for navigation pointers". `CODING_STANDARDS.md` is read during review, not implementation, and gets navigation pointers to docs once it passes about 1,000 lines. Docs are reference files reached by pointers; look for existing docs before writing new ones. Skills are for docs (because their description sits in context) or for user-invoked commands.
- **Writing style** (from `writing-for-agents`). Every always-loaded pointer costs **context load**. Material moves down an information hierarchy (in-file step, in-file reference, disclosed reference). Repeated triads collapse into **leading words**. Prohibitions give way to the positive target. Lines that restate the environment are a **cache** and must justify themselves. Stale lines are **sediment** to prune.

## 4 — Breaking retro into policy primitives

Read as a policy for a generic review skill, retro is built from these parts. Each is something the policy file, or the generic skill that reads it, has to be able to express:

| Primitive | In retro | Implication for the policy format |
|---|---|---|
| **Subject** | A *session*: named, else current | A subject kind beyond container or repo/folder (§6). |
| **Evidence source** | Session transcripts on disk | The policy must say *where* to read. The generic skill must allow non-repo evidence. |
| **Prerequisite load** | `writing-for-agents` style guide | Policies need a "load these references first" slot (compare impl-review's `dx-references` calls). |
| **Lenses with activation conditions** | 7 categories, each `Use when` | Lenses ≈ impl-review's *dimensions*, plus a trigger that can skip a lens. Today's dimensions always run. |
| **Check-what-exists-first rule** | "Read the repo's own check command first" | Each lens has a precondition: inspect the current state before proposing. |
| **Routing / classification rule** | mechanical → check, judgement → standards file | A per-finding *destination* field (which artifact the fix lands in). Today's review reports have none. |
| **Target scope** | The environment, not the session's code | Policy-level scope statement. Code-quality findings are out of scope. |
| **Output** | Ranked list, presented inline, no file, nothing applied | Same as the effort's repo-wide output mode (ephemeral, user picks what to promote). |
| **Ordering** | "in order of severity" | Needs a severity vocabulary. dx has `Blocker`/`Consider`. |

## 5 — How retro maps onto dx-workflow artifacts

Retro's file tiers have dx equivalents, so a `workflow` policy can name real destinations instead of retro's generic ones:

| Retro destination | dx-workflow equivalent | Route |
|---|---|---|
| `CODING_STANDARDS.md` (judgement rules) | `context/standards/<layer>/<topic>.md` | Standard Proposal → `/dx-standards-update` (the shape `dx-refactor-discover` already uses) |
| Automated check (linter, hook, CI) | Repo check scripts (here `npm run lint:skills`, the CI gate job) | Promote to a change via `/dx-new` |
| `AGENTS.md`/`CLAUDE.md` navigation pointers, no-ops | Target project's `CLAUDE.md` (dx-init writes the rollback principle into it) | Promote to a change, or edit directly if trivial |
| Docs | `docs/`, `context/foundation/` | Change, or `/dx-research foundation …` |
| Skills (writing style) | dx house style in this repo's `CLAUDE.md`: no-op test, leading words, `Done when` | Maintainer-only: applies when the subject project authors skills |
| *(no retro equivalent)* | `context/foundation/lessons.md` | One-off scar tissue → `/dx-lesson`. Recurring lessons graduate to a standard. |
| *(no retro equivalent)* | `foundation/glossary.md` | Naming friction found during navigation → `dx-domain` |

The workflow already matches several retro ideas. Its house-style "no-op test" is retro's **No-ops** lens. "Leading words that recruit pretrained concepts" comes from `writing-for-agents`. "Derive, don't maintain" lines up with the *cache* idea.

## 6 — Where retro and the effort disagree

1. **Subject kind.** The effort defines input as policy ID + optional container ID + optional custom instructions, where a container targets a change or effort and no container means the repo or folders. Retro's subject is a **session**, which is neither. Options for the frame:
   - *Session through custom instructions:* a session id or "current" is passed as free text. This is cheap, but the policy can't declare it as an input.
   - *Container-scoped retro:* the subject is a change or effort. Evidence is its artifacts (`plan.md` `## Progress`, `reviews/*.md` with triage `Resolution`s, `lessons.md` entries it added) plus whichever sessions worked on it. This fits the container → report → `dx-review-triage` path.
   - *Repo-wide retro without a session:* only the static lenses run (Global AGENTS.md, No-ops, the Automated-checks guardrail audit). Session lenses (Navigation, Tool economy, Information access) don't fire because their `Use when` conditions have no evidence.
   - A policy probably needs to declare **which subject kinds it supports**, so `workflow` with no session degrades predictably.
2. **Where standards are read.** Retro's premise is that standards are review-only and kept out of the implementer's context. In dx, standards are matched into `plan.md`'s **Standards to apply** checklist at plan time *and* checked at impl-review, so the implementer does see them. A `workflow` policy that reuses retro's reasoning word for word would recommend moving rules out of the plan, which contradicts the knowledge layer. Pick one: adapt the rule to "keep `CLAUDE.md` to pointers; rules belong in `context/standards/`", and drop the "review-only" claim.
3. **Output durability.** Retro writes nothing. The effort wants container runs to write a report with stable Findings and `Resolution` for triage. A workflow finding's "fix" is often a standard proposal, a lesson, or a new change, not a code edit. So `dx-review-triage`'s `FIXED` path may need to *route* (invoke `dx-standards-update`/`dx-lesson`, or print a `/dx-new` line) instead of editing.
4. **Candidate vs Finding.** The glossary separates ephemeral **Candidates** from durable **Findings**. Retro's output is Candidates in every run. A container-scoped workflow run would produce Findings, which is the same split the effort already lists as an open point.
5. **Session-log location is environment-specific.** Retro says only "session logs on this machine". Claude Code keeps per-project JSONL transcripts in a projects directory under its config root, and that root moves: on this machine it is `~/.ccs/instances/personal/projects/<slug>/<uuid>.jsonl`, not `~/.claude/projects/`. A shipped policy should *describe* how to find transcripts rather than hard-code a path. Transcripts are large, so following retro's own **Tool economy** lens means reading them through `Explore` subagents, not in the main context.
6. **Severity vocabulary.** Retro says "order of severity" but defines no levels. Reuse dx's `Blocker`/`Consider` so triage and the report template stay unchanged. A `workflow` dimension tag such as `[Checks: Consider]` follows impl-review's compound `<Dimension>: <Severity>` form.

## 7 — Proposed shape of a `workflow` policy

This is a synthesis, not a decision. It feeds `/dx-frame`.

- **Scope:** the agent's environment and the dx workflow's artifacts, never the product code.
- **Subjects:** session (named, else current), container (its artifacts plus linked sessions), and repo (static lenses only).
- **Loads first:** `knowledge-layer` (standards/lessons promotion paths) and the project's authoring rules if it writes skills.
- **Lenses** (retro's seven, each keeping its `Use when` trigger), plus two dx-native ones:
  - **Knowledge layer:** a lesson that recurred and should graduate, a standard that was missed or contradicted, glossary drift.
  - **Workflow friction:** a skipped or mis-ordered step (plan without frame on a large change, triage left `PENDING`, a missing changeset per slice), as evidenced in the container's artifacts.
- **Per-lens precondition:** read what exists first (check scripts, CI, `context/standards/`, `lessons.md`, `CLAUDE.md`) so an unwired existing thing is the finding.
- **Routing rule (retro's classification, rehomed):**
  - mechanical → automated check (new change)
  - judgement → Standard Proposal (`/dx-standards-update`)
  - one-off scar → `/dx-lesson`
  - pointer or no-op → `CLAUDE.md` edit
- **Output:** each item carries a *destination*. Container runs write Findings for triage; session and repo runs present ranked Candidates for promotion. Both are ordered `Blocker` before `Consider`.

## Open questions for the frame

- Is "session" a first-class subject kind in the generic skill's input, or only a policy-level convention passed through custom instructions?
- Does `dx-review-triage` gain a *route* resolution for findings whose fix lands outside the code (standard, lesson, new change)?
- Should policies support per-lens `Use when` activation generally, so built-in `plan-review`/`implementation-review` keep their always-on dimensions while `workflow` skips lenses with no evidence?
- Retro depends on an external style guide (`writing-for-agents`). Does dx ship an equivalent reference, or does the policy point at the target project's own authoring rules?
