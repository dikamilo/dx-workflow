---
topic: sessions-review-candidates
kind: codebase
source: /dx-review sessions
gathered: 2026-10-07
git_commit: d4640e279b387d13863685cf1cbdb48e09f07d4f
---

**1. `dx-implement` "one phase per invocation" clashes with how it is actually used** · Strong
- lens: Skill use · where: repo · destination: skill
- evidence: 4 of 7 sessions had the user ask for a coordinator run over the whole plan or on subagents, overriding the rule in the args each time. The skill says "Execute **one phase** … never the whole plan" (`skills/dx-implement/SKILL.md:10`). `934382bf` ran both phases anyway; `cda0d4d7` spawned subagents per phase. `e26651c7`/`9b5a1a37`: `/dx-implement` was pointed at an already-implemented change with a follow-up refactor and the agent improvised `dx-new` then `dx-plan`.
- suggestion: name an explicit coordinator mode where the user's args may widen the scope and phases run on subagents; state the route when the plan is already fully ticked (point at `/dx-new`).

**2. Manual and sandbox Progress boxes: ambiguous owner, and ticked on trust** · Strong
- lens: Skill use / Automated checks · where: repo · destination: skill, tooling
- evidence: `64eb3ab9` stopped with 1.5–1.10 open until the user said "do manual sandbox tests yourself". `934382bf`: the user said "tick 1.5 and 1.6" and the agent ticked them while noting "haven't run either". `fd743cd1`: box 4.4 cost an extra `AskUserQuestion` and a "mark 4.4" turn. Every session ran the sandbox recipe from a personal memory file (`sandbox-skill-runs.md`), not from the repo.
- suggestion: tag each manual box `agent-runnable` or `user-only`; record the sandbox recipe (`--setting-sources project,local`, never a global `install-skills`) in a repo doc or script; let the agent run `agent-runnable` boxes itself; record a user tick without evidence as "ticked on say-so".

**4. `dx-references` loader costs a round trip per topic, and over-loads** · Worth exploring
- lens: Tool economy / Skill use · where: repo · destination: skill
- evidence: `9b5a1a37`: 6 sequential `dx-references` calls, then a fallback to one batched `cat` (17.5KB). `e26651c7`: 8 calls, including `plan-api-contracts` and `plan-data-model`, which the change did not need. `64eb3ab9` and `fd743cd1`: a Skill call followed by a direct Read of the same file.
- suggestion: let the loader take several topics per call; have `dx-plan` gate the optional references (api-contracts, data-model) on the change type.

**8. Heavy front-loaded reads when planning** · Speculative
- lens: Navigation / Tool economy · where: repo · destination: skill
- evidence: `e26651c7`: four 17–28KB `cat` dumps (research files, `dx-review/SKILL.md`, `dx-refactor-discover/SKILL.md`). `64eb3ab9`: a 28KB `cat`. `cda0d4d7`: two 17KB dumps. `skills/dx-refactor-discover/SKILL.md` is 17KB, over twice the size of the next skill.
- suggestion: point the plan at sections (`sed -n`) and consider splitting `dx-refactor-discover` through pointers.
