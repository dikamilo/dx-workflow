# Run the sessions retrospective

In this tutorial you will run the built-in `sessions` review on your current agent session, read the ranked report it prints, and see where each suggestion would land. By the end you will know how to read a Candidate, tell a repo fix from a user-global one, widen the run to more sessions, and why nothing is written or promoted. You won't write a Policy: `/dx-init` already seeded this one.

`sessions` is a retrospective. It reads what happened in agent sessions and asks what in the coding agent's environment (steering files, checks, tooling, installed skills) would improve its future runs. It reports and stops. Seven of its lenses come from Matt Pocock's `retro` skill. The eighth, `Skill use`, is not from retro and has no external source.

## Prerequisites

- A project where `/dx-init` has run and `context/config/review-policies/sessions.md` exists. If it doesn't (a project seeded before this Policy), re-run `/dx-init`: it adds missing files and overwrites nothing. Your copy of `review-policy.md` is not refreshed, so compare it with the shipped one by hand to see `promote: off`.
- A session worth reviewing. The current one is the default, so run this after some real work.

## Step 1 — Run it

```text
/dx-review sessions
```

There is no container and no path, but unlike `test-strategy` this Policy needs no scope to be asked for: the subject is the current session.

> **dx-review** prints the interpreted subject before reading anything:
>
> ```text
> Scope: current session (no instructions)
> ```
>
> It then locates the session transcript, and reads it through an `Explore` subagent rather than in the main context. Transcripts can be long and hold secrets, so the subagent returns evidence per lens, not transcript text.

The run asks no questions. The Policy has no gates, so it works unattended.

## Step 2 — Read the Candidates

> **dx-review** prints:
>
> ```markdown
> ## Candidates
> 1. **Automated checks** (Strong) — where: repo
>    - **Evidence:** session 1: three edits left unformatted imports, caught only at review
>    - **Suggestion:** wire the existing `lint` script into a pre-commit hook
>    - **Destination:** check
> 2. **Skill use** (Worth exploring) — where: user-global — 2 sessions
>    - **Evidence:** a documentation skill never fired for a docs edit; its description names only "user guides"
>    - **Suggestion:** add "reference pages" to the description
>    - **Destination:** skill
>
> ## Reviewed
> - Navigation — N/A (no long search for information)
> - Automated checks — Candidate 1
> - Coding standards — N/A (no reviewer miss)
> - Global AGENTS.md — OK
> - Tool economy — N/A
> - No-ops — OK
> - Information access — N/A
> - Skill use — Candidate 2
>
> Top pick: 1. A wired check removes a whole class of repeat mistakes.
> ```

Things to notice:

- Candidates are ranked by their impact on future runs first (what recurs, or costs the most context or tool calls), then by strength. A finding seen in several sessions is one Candidate with a count.
- **`where`** tells you whose environment to change. `repo` is a fix inside this project. `user-global` is yours: global `CLAUDE.md`/`AGENTS.md`, installed skills, MCP or CLI tooling, settings.
- **`destination`** (`check | standard | lesson | steering | docs | skill | tooling`) is a descriptive label for where the fix would land. It routes nothing: no skill is invoked from it.
- The `Reviewed` list names every lens, run or `N/A` with a reason. A lens is never skipped silently.
- Evidence quotes the minimum that makes it checkable. Credentials, tokens and customer content are referred to by kind and location, never reproduced.

## Step 3 — Notice what doesn't happen

The run ends at the top pick. There is no promote question, no `change.md`, no `Next:` line, and no offer to record a `/dx-lesson` or `/dx-standards-update`. This is `promote: off` in the Policy's `## Candidates`. Suggestions like these have no single change to become, so you act on the ones you agree with in the normal way: edit the hook, the skill description or your global `CLAUDE.md` yourself, or start a change with `/dx-new`.

Nothing is written to disk either, so a re-run starts from scratch and nothing is remembered about what you rejected.

## Step 4 — Widen the evidence

Custom instructions steer the run. They may name a session, the last N, or all of this project's sessions:

```text
/dx-review sessions the last 3 sessions
```

> **dx-review** states the interpreted subject (`last 3 sessions of this project`), reads them through `Explore` subagents (one per session, or one per batch), and merges the results. A pattern seen in several sessions outranks a one-off, and carries a count.

Sessions of other projects are read only when you name them. A path argument scopes the static lenses instead, for example a folder's `CLAUDE.md`. Passing a change or effort ID is refused, naming `explore`: this Policy doesn't review containers.

## Step 5 — When there is no transcript

If no session is readable (a moved config root, a fresh environment), the run says so. Only the lenses that need no transcript fire: `Global AGENTS.md`, `No-ops` and the guardrail audit under `Automated checks` (a repo with no pre-commit hook and no CI job running its lint, typecheck or test command is itself a finding). Every other lens is `N/A` in `Reviewed`, with the reason.

## What you built

Nothing on disk. The report is ephemeral by design: you now have a ranked list of environment fixes and know which ones are yours (`user-global`) and which belong to the repo.

## Where to next

- [Write a review policy](./write-a-review-policy.md) — add `promote: off` to a Policy of your own.
- [Review a folder with test-strategy](./review-a-folder-with-test-strategy.md) — the promotable Explore run, with gates.
- [Policy-driven review](../explanation/policy-driven-review.md) — why Explore runs present Candidates and when they stop short of promotion.

## Related

- [Skills reference](../reference/skills.md) — `/dx-review` and `/dx-init`, with exact reads and writes.
- [Build and maintain standards](./build-standards.md) — where a judgement rule from a Candidate belongs.
