---
effort_id: policy-driven-review
title: Policy-driven review skill
status: scoped
created: 2026-10-06
updated: 2026-10-06
archived_at: null
---

## Goal
Replace `dx-plan-review` and `dx-impl-review` with one generic review skill whose behaviour is driven by a user-editable **policy** file, so a new kind of review (test-strategy, security, retro) is a new policy rather than a new skill. Policies and templates live in the workflow context, shipped by a re-runnable `dx-init` that only copies what is missing; the built-in `plan` and `implementation` policies reproduce today's behaviour unchanged; container runs write a report for `dx-review-triage`, repo-wide/folder runs print findings for promotion into a new change or effort.

## Notes
Source idea, as given:

- **One skill, removed predecessors.** The generic review skill replaces the plan-review and implementation-review skills outright — no aliases. What differs between review types moves into a policy.
- **Input**: a policy ID, an optional container ID (change or effort), optional custom instructions. With a container ID the review targets it; without one it explores the whole repo or selected folders freely, like `dx-refactor-discover`.
- **Policies and templates live in the workflow context, not the skill**, so users can edit and extend them. The policy ID is the file name. Built-in `plan` and `implementation` policies carry today's behaviour unchanged. Two user-customizable templates ship: one for writing new policies, and one for the policy report — the current `review-report` reference moved out of `dx-references` and renamed.
- **`dx-init` ships them** from its assets folder, next to the standards: a policies directory (review and any other policies) and a templates directory (policy template, report template). `dx-init` becomes re-runnable: copies only what is missing, never overwrites user files — later updates to shipped policies never reach existing copies.
- **Output mode**: container runs write a report artifact for triage; repo-wide/folder runs print findings and the user picks which to promote (all or selected) to a new change or effort.
- **Triage takes the policy ID** plus the container ID when a report exists. That pair locates the report and names the policy, so no report field is needed. A frontmatter field is the fallback if triage must run without being told.
- **Missing policy**: the skill names the unknown ID; if no policies exist at all, it says to run `dx-init`.

Open points to settle in frame/roadmap:
- The idea says `dx-triage`; the existing skill is `dx-review-triage` — decide whether it is renamed or the idea meant the current skill.
- New domain term **Policy** (and whether Plan-review / Impl-review / Review-triage glossary entries become policies of a generic Review) — run through `dx-domain`.
- Repo-wide runs produce ephemeral items (glossary: Candidate), container runs produce durable Findings — confirm the two vocabularies are intended.
- Docs, `skills.sh.json`, `DESIGN.md`, and changesets must follow the skill removals/addition.
