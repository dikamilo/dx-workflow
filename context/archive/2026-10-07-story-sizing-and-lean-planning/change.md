---
change_id: story-sizing-and-lean-planning
title: Cut story and planning overhead found in the second sessions review
type: feature
effort: null
slice: null
status: archived
created: 2026-10-07
updated: 2026-10-07
archived_at: 2026-10-07
---

## Notes
Seeded from a second `/dx-review sessions` run on a project using this workflow. The review's evidence names project-specific tools, files and story ids; those are illustrative only and must not leak into the skills — every fix below is written generically.

Evidence in brief: stories were split into 4–8 strictly serial slices, each repeating the same chain (`/dx-new` → `/dx-plan` → `/dx-implement` → sync → PR → archive) at about 1h and about 34k tokens of fixed context per session. Plan sessions re-read 3–9 sibling plans (25–70k). About 12 min per plan session, mostly interviewing. Of 411 interview questions: implementation-placement choices 49%, scope/slicing 23%, open spec or design-conflict items 13%, needless 4%; the recommended option was taken on 59–89% of known answers (overrides skewed to the open-item and design-conflict questions). Late slices hardened what slice 1 built, so they fit better as phases of one plan.

Fixes to address in the skills:

- **S1 `dx-new` / `dx-roadmap`:** default a story to one change with a phased plan. An effort only when slices are genuinely independent or parallel; slicing rule is "split only if a slice can ship alone", not "large means effort".
- **S2 `dx-plan`:** default-and-proceed interviews. The agent decides by default and asks only questions that truly need a human (user-only choices, costly-to-reverse ones nothing upstream settles). Record every self-made decision in the plan as an assumption. Generic rule: the review's OPEN/PROPOSAL, design and ticket-conflict categories are that project's noise and must not be named in the skill.
- **S3 `dx-plan`:** stop re-reading sibling plans. Read only the nearest sibling plan (or a short digest); the plan carries a "reuse from" pointer.
- **S4 `dx-implement`:** honour scoped test runs — only the affected files per phase, one full run at the end. The plan template names those files. (Full e2e ran in four of eight implement sessions despite the scoped rule.)
- **S5 session merging:** allow `/dx-new` + `/dx-plan` + `/dx-implement` in one session when context allows; cache or skip re-reading sync/integration docs already read.
- **S6 `dx-plan`:** per-slice scope cap — keep the "plan is large" warning and offer to move extras to a later change.
- **S7 `dx-review` sessions policy:** ship the metrics script (session minutes by command, question classification) so the retro needs no ad-hoc code. Optional.
- **R2 tracer-first story shape:** tell planning the first change carries one happy path and one deny/negative test, with hardening (idempotency, readback, races) as later phases. Generic judgement rule; decide in `/dx-plan` whether it lives in `dx-plan`/plan template or as a shipped standard.
- **R7 plan template:** trim per-slice mandates — fold repeated "Standards to apply" checklists, allowlist/audit lines and the unscoped full-suite run into a single check at the end of the story.

Caveats from the review: session durations include idle time; question classification was a single subagent pass with the answer unknown for 172 of 411; slice boundaries were not measured for catching real problems; R2 and R7 are provisional until the reduced story scope is tested. Overlaps with the archived `skill-friction-fixes` change — check it before planning to avoid contradicting its edits.
