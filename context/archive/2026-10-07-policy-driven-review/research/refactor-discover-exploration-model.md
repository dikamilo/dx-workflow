---
topic: refactor-discover-exploration-model
kind: codebase
source: dx-workflow repo (skills/, DESIGN.md, context/archive/, docs/)
gathered: 2026-10-06
git_commit: a9ffe354004d6ce8e83b3c6c535a37f553bbf62f
---

# How dx-refactor-discover explores and discovers — and what the policy-driven review's repo/folder mode should take from it

The effort says a run without a container "explores the whole repo or selected folders freely, like `dx-refactor-discover`" (`effort.md` Notes; roadmap Slice 3). This note breaks that skill's behaviour into parts, marks each part as generic (it belongs to the review skill's repo/folder mode) or refactor-specific (it belongs in a Policy, or is left out), and cites the earlier decisions so they don't get re-derived.

## 1. The pipeline, step by step

`skills/dx-refactor-discover/SKILL.md` runs **load → scan → present → (design twice) → promote**:

| Step | What it does | Ref |
|---|---|---|
| Guard | Stops and points at `/dx-init` when `context/` isn't scaffolded (no `changes/` or `efforts/`). Declares Candidates **ephemeral**: there is no debt register, so anything not promoted or recorded as a lesson leaves no trace. | `SKILL.md:12` |
| §1 Load | Loads its vocabulary (`module-design`). Reads `foundation/glossary.md` for naming and `foundation/lessons.md` to **skip anything a prior run already rejected**. Matches `context/standards/` to the scope with the knowledge-layer *domain × topic* rule: a scoped run takes `global/` plus the areas the scoped code belongs to, an unscoped run takes every standard that applies anywhere. It then keeps only the rules that existing code can be checked against. | `SKILL.md:14-18` |
| §2 Scan | Takes an optional `[area or path]`; with no argument it scans the whole tree. Loads `design-lenses`. **Fans out to built-in `Explore` subagents** with no fixed count: "explore for friction, don't run rigid heuristics". Uses **recency as the default prior**: hot paths in `git log --oneline` get attention first, and the net widens when there is no hot spot. Runs per-item checks (the deletion test). Standards are a third source, with collision rules: a standard beats a lens, overlapping hits merge, and no empty layers are proposed. | `SKILL.md:20-34` |
| §3 Present | Inline markdown, **no report file**. Entries form a numbered list with fixed fields: What & where, Why, Shape before→after, Proposed + strength tag (`Strong`/`Worth exploring`/`Speculative`), Dependency category. Each broken rule gives **one Candidate, not one per site**, with a site count. "Cash out the win" bans vague benefits. Ends with a **top pick**, Standard Proposals when ≥3 Candidates share a cause, and **one question** that covers both promote and accept. | `SKILL.md:36-64` |
| §4 Design twice | Opt-in, after the pick. 3–4 `Plan` subagents run under forcing constraints. **Fan-out safeguard:** one Candidate's batch at a time; a failed agent is dropped, not retried. | `SKILL.md:66-90` |
| §5 Promote | **One** pick: the skill writes `change.md` (`type: refactor`) plus a seed `research/<topic>.md` itself. **Many** picks: it prints `/dx-new "<seed summary>"` → `/dx-roadmap`, where the seed summary is a heading naming the source skill, full entries, and a `Start with:` line. **Rejected for a load-bearing reason**: it offers `/dx-lesson` so the next run skips the item. | `SKILL.md:92-96` |
| Done when | Prints the exact next command(s) and stops without chaining. | `SKILL.md:98-123` |

## 2. Generic or refactor-specific

Generic parts carry over to any Policy's repo/folder run; they belong in the **skill**.

- **Guard and scaffolding check** (`:12`). This combines with the effort's own "unknown policy id / no policies at all → dx-init" guard.
- **Optional path scope; no argument means the whole tree** (`:22`). The review skill's input is `<policy> [container-id | paths…] [instructions]`.
- **Explore fan-out on distinct facets, friction over checklists** (`:22`). DESIGN.md `:73-75` and §14 rule 4 name built-in `Explore`/`general-purpose` as the only fan-out agents, so there are no dedicated agents.
- **Recency prior** (`:24`). It is derived at run time, not maintained (`archive/2026-08-13-refactor-discover-principles/research/refactor-skill-structure-and-process.md` §5). It suits test-strategy, which looks at code hot spots. The `sessions` Policy works on transcripts, not code, so whether to use recency should be decided per Policy (see §4).
- **Lessons as rejection memory**: read `lessons.md` before the scan to skip earlier rejections, and offer `/dx-lesson` when a rejection has a load-bearing reason (`:16`, `:96`). The rejection wording ("don't X because Y") is the only refactor-flavoured part, and a Policy can supply it.
- **Standards scoped by domain × topic** (`:18`). The *matching* is generic. *Which* rules to keep is Policy-specific: refactor keeps structural rules, test-strategy would keep the `testing/` rules.
- **Ephemeral numbered Candidates presented inline, closed by a top pick** (`:36-52`). The entry *fields* are specific to each Policy; the *list + top pick + single promote question* shape is generic.
- **One Candidate per broken rule with a site count** (`:46`). This is the anti-flood rule, validated in `archive/2026-09-28-refactor-discover-standards-lens/research/cheap-test.md` "Verdict" (GO on one codebase). Test-strategy's per-unit pairing would flood without it (`research/test-strategy-policy.md` "Tensions" #2).
- **Promotion split**: one → the skill writes the change itself (as `dx-diagnose` does, `skills/dx-diagnose/SKILL.md:43`); many → print `/dx-new "<seed summary>"` (`:94-95`). The seed heading must name the source. In refactor-discover the heading literal is `dx-new`'s parse key and was kept byte-identical (`archive/2026-09-28-refactor-discover-standards-lens/plan.md` Approach). **A new source heading probably means `dx-new` must learn to parse it.** That is a cross-skill contract to check during planning (see §4).
- **Print next and stop** (`:98-123`).

Refactor-specific parts belong in a Policy, if they are kept at all.

- The `module-design` vocabulary, `design-lenses`, the deletion test, strength tags *as worded*, and the dependency category.
- The standard-vs-lens collision rules (`:28-34`).
- **Standard Proposals** (≥3 Candidates sharing a cause, `:54-62`). This mechanism is generic in principle, and `research/retro-as-workflow-policy.md` §5 wants it for `sessions`. Whether the skill offers it or a Policy turns it on is open (see §4).
- **Design it twice** (`:66-90`). Prior work put it in this skill only because it had a single consumer (`archive/2026-08-13-refactor-discover-principles/plan.md` Approach). No shipped Policy needs it, so leave it out.

## 3. What the other discover and review skills show

- `dx-standards-discover` and `dx-domain-discover` share only the guard, the Explore fan-out and the glossary read with refactor-discover. They are **register producers**: they write files directly and have no Candidates, ranking or promotion (`skills/dx-standards-discover/SKILL.md:18-21`, `skills/dx-domain-discover/SKILL.md:18-27`). **refactor-discover is the only model for the "candidates → promote" shape.**
- DESIGN.md §9 "Discovery-entry skills" (`DESIGN.md:287-320`, refactor-discover at `:299-307`) holds the rule the repo/folder mode inherits: *produce a candidate, promote it into a standard container, write no durable register* (`:289`). Earlier research agrees: discovery skills never write an artifact before a container exists (`archive/2026-07-28-dx-brainstorm/research/precontainer-artifact-and-dx-new-promotion.md` §1).
- The current review skills are the opposite mode: a targeted fan-out over a known subject, then a durable report file and triage. `dx-plan-review` says "don't dump the whole plan" (`skills/dx-plan-review/SKILL.md:44`). `dx-impl-review` suggests one agent per dimension, e.g. drift vs safety+standards (`skills/dx-impl-review/SKILL.md:18`). The one overlap with discover is the lesson offer (`dx-impl-review:32-33`).
- So the review skill has **two exploration styles**:
  - Container mode: a targeted fan-out, one agent per dimension, over a known diff or plan. This is today's review behaviour.
  - Repo/folder mode: a friction-driven fan-out, one agent per facet or area, with recency as the prior. This is refactor-discover's behaviour.
  - The Policy decides *what* to look for. The mode decides *how* to explore. This matches the frame's caveat that each mode keeps its own vocabulary: Findings vs Candidates (`frame.md` Caveats).

## 4. Open points for frame/plan

1. **Glossary mismatch.** `Candidate` is defined as something a *Discovery Entry* presents (`foundation/glossary.md:45`, `:63`). Now a review skill would emit Candidates too. Widen the definition through `dx-domain`.
2. **dx-new seed contract.** Can `dx-new` accept a generic seed heading (`## <Policy> candidates (from /<review-skill> <policy>)`), or does each Policy need its own literal? Check `dx-new`'s parse before Slice 3's plan.
3. **What a Policy declares for repo mode.** Candidates: supported targets (already in glossary `:39`, and `research/retro-as-workflow-policy.md` §6.1), the Candidate entry fields, the standards filter, whether to use the recency prior, the fan-out facets, the rejection-lesson wording, and whether Standard Proposals are on. Each one is a field the policy template must document.
4. **Promotion type.** refactor-discover stamps `type: refactor`. A review Candidate's change type differs by Policy (test-strategy → `feature`/`refactor`?, sessions → non-code changes routed to a destination, `research/retro-as-workflow-policy.md` §7). Either the Policy declares a default, or the type is asked at promotion.
5. **Batch confirmation.** Per-unit questions don't scale on a repo run. Batch them, or state assumptions in the output and let the promote pick filter (`research/test-strategy-policy.md` "Tensions" #2; `interview.md:26-27` "batch a candidate list as one confirm/edit question").
6. **Reference header drift (aside).** `skills/dx-references/references/knowledge-layer.md:3` doesn't list `dx-plan-review` or `dx-domain-discover` among the skills that load it. Anything that still ships after this effort should get that fixed.
