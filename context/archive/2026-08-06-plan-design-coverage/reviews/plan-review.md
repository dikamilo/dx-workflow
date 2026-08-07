# Plan review — plan-design-coverage

Reviewed `plan.md` against `frame.md`, `change.md`, `plan-template`, `review-report`,
`knowledge-layer`, `context/standards/global/skill-authoring.md`, `foundation/glossary.md`, and the
real `skills/`, `docs/`, and `scripts/lint-skills.mjs`.

### F1 — Review-side conditional loading is blind to the omission it exists to catch [Blocker]
- **Location:** Approach ("Sections are silently omitted…shifts the burden onto `dx-plan-review`"); Phase 2, first bullet.
- **Detail:** The Approach makes silent omission safe by asserting the review half audits it — "without it, silence in a plan is unauditable." But Phase 2 defines the review-side trigger as loading "whichever topics the plan under review **carries a section for**". A plan that wrongly omits `## Data model` carries no such section, so the topic never loads, and the check that would ask "should this have been here?" never runs. The review can only verify sections that are already present.
- **Why it matters:** This is the change's own central claim failing on its own terms — the authoring half gets a silence license that the review half cannot actually redeem. The exact failure the frame names (a concern "skipped outright") passes review clean.
- **Fix:** Key the review-side trigger on the **change** (its diff scope, `change.md` `type`, `frame.md`'s who/what-it-affects), not on the plan's existing headers — the same relevance triggers `dx-plan` uses in step 2. Then a present-but-wrong section and a wrongly-absent one are both reachable. If the triggers are identical on both sides, that is an argument for putting them in each reference (see F6) rather than inline twice.
- **Resolution:** FIXED

### F2 — Docs-sync list misses the `dx-references` entry, which hardcodes the topic count [Blocker]
- **Location:** Standards to apply ("docs in sync"); Phase 1 last docs bullet; Phase 2 docs bullets; Phase 3.
- **Detail:** `docs/reference/skills.md:294` reads: "**Reads:** `references/<topic>.md` for one of the **nine** topics: `change-md`, … `untrusted-content`." Three new topics make that nine→twelve and the enumeration stale. The plan's docs list names only the `### /dx-plan` entry (its **Writes:** line), the `### /dx-plan-review` entry, and three prose pages. Two further lines also go stale: `/dx-plan`'s **Reads:** line (line 74 — it enumerates what `dx-plan` reads and will now read three new references) and `/dx-plan-review`'s **Reads:** line (line 86 — it enumerates `plan-template`/`knowledge-layer`/`review-report` by name).
- **Why it matters:** `lint-skills.mjs` check 5 only matches `### /dx-<name>` **headings** against skill folders — it cannot see a stale topic list or a stale Reads line. Nothing catches this, and the CLAUDE.md house rule ("a skill diff without a matching docs diff is incomplete") is exactly what it violates.
- **Fix:** Add to the Phase 1/3 docs bullets: `docs/reference/skills.md` → the `dx-references` entry's topic count and list, `/dx-plan`'s **Reads:** line, and `/dx-plan-review`'s **Reads:** line — not just `/dx-plan`'s **Writes:**.
- **Resolution:** FIXED

### F3 — The three section header names are never fixed [Blocker]
- **Location:** Approach diagram; Phase 1 (`plan-template.md` gains "the three header names"); Phase 2 (loading keyed on "a section for").
- **Detail:** The plan names the three *reference files* precisely but never states the three `plan.md` **header strings**. `## Data model` appears once, incidentally, in Phase 1's demo sentence; the API and failure-modes headers appear nowhere. Yet three separate places depend on the exact strings agreeing: the `plan-template` block, `dx-plan` step 4's authoring, and `dx-plan-review`'s section detection.
- **Why it matters:** A header the implementer invents in Phase 1 and re-invents in Phase 2 silently breaks the prompt/verify pair, and nothing mechanical checks it — check 4 resolves `dx-references` topics, not `plan.md` headers.
- **Fix:** Name all three headers verbatim in the Approach (e.g. `## Data model`, `## API & contracts`, `## Failure modes & reversibility`) and reference those strings from both phases.
- **Resolution:** FIXED

### F4 — No phase verifies the behavior each phase claims to demo [Consider]
- **Location:** Phase 1 ("End-to-end and demoable…"), Phase 2 ("Demoable: …"), and both Progress blocks.
- **Detail:** Phase 1's only gate is `npm run lint:skills`, which proves call sites resolve to files — not that `/dx-plan` asks the right questions or authors the right section. Phase 2 carries a demo sentence and **no gate line at all**; its Progress block ends at a docs checkbox. Priors names the real fallback ("a sandboxed subagent run with scripted answers"), but no phase adopts it as a step.
- **Why it matters:** Both phases can be checked off with the demoable claim never exercised, which is the "missing verification step" this reviewer's own Feasibility dimension treats as a finding. The interview half is already flagged as the less-verified one; leaving it unverified compounds that.
- **Fix:** Add the sandboxed subagent run as an explicit gate step in Phases 1 and 2 (Phase 1: a schema-touching change and a trivial one; Phase 2: a plan with a section that omits a migration path, and a plan whose silence is correct), and give Phase 2 a gate checkbox.
- **Resolution:** FIXED

### F5 — "No other skill reads these" is inaccurate; `dx-impl-review`'s status is undecided [Consider]
- **Location:** Approach ("`interview.md` untouched", the two-skill framing); `frame.md` ("no other skill reads these four topics").
- **Detail:** `plan-template` is loaded by four skills, not two — `dx-implement/SKILL.md:16` and `dx-tdd/SKILL.md:16` both pull it. So the new conditional-sections block reaches them too. More materially, `dx-impl-review` reviews **Plan-drift** against `plan.md` — a `## Data model` or `## Failure modes` section is precisely the kind of planned intent it would check the diff against, and it currently has no instruction to.
- **Why it matters:** The change closes the prompt/verify gap at planning time and leaves it open one step later: a plan documents an undo path, the implementation ships without one, and impl-review passes. Either that is deliberate scope (say so) or it is a third half of the same gap.
- **Fix:** State explicitly in the Approach that `dx-implement`/`dx-tdd` inherit the block via `plan-template` with no edit needed, and either add an impl-review bullet or record it as out of scope with a reason. Also correct `frame.md`'s "no other skill reads" line via triage.
- **Resolution:** FIXED

### F6 — Relevance criteria live in two places that can drift [Consider]
- **Location:** Approach ("the relevance gate itself stays inline as a one-line trigger per topic in each skill body"); Phase 1 ("each stating **when it is relevant**, what to ask…").
- **Detail:** Each new reference states when it is relevant, and each skill body restates the same relevance as an inline one-line trigger — in `dx-plan` and (per F1's fix) `dx-plan-review` too, so three copies of the same condition.
- **Why it matters:** The inline copy is load-bearing (it decides whether to load at all, so it cannot move into the file it gates), but the in-file copy is then a duplicate with no reader — and duplicated conditions drift. It also collides with the `no-op test` standard the plan itself lists.
- **Fix:** Keep the trigger inline and make it the single statement of relevance; the reference opens with what to ask and what a populated section must contain, not with a re-statement of when it applies.
- **Resolution:** FIXED

### F7 — The scope-cohesion rationale cites a `dx-frame` test that doesn't exist [Consider]
- **Location:** Approach ("It re-verifies at review time the bundling test `dx-frame` applies at framing time").
- **Detail:** `skills/dx-frame/SKILL.md` contains no bundling, splitting, or one-deployable-capability test — its sections are the real problem, who/what it affects, alternatives, out of scope. The nearest existing check is `dx-new`'s change-vs-effort routing ("A single shippable unit", `dx-new/SKILL.md:28`), which runs before any framing and asks a different question.
- **Why it matters:** The justification for keeping scope cohesion inline rests on it being a re-verification of an upstream check. It isn't one — it's a new check, which is fine, but the honest framing changes where it belongs and whether `dx-frame` should gain the matching upstream test.
- **Fix:** Reword to cite `dx-new`'s routing decision, or drop the upstream claim and justify the check on its own (the ≥2-call-site rule already justifies keeping it inline).
- **Resolution:** FIXED

**Verdict: revise** — the approach, the three-file split, the `plan-` naming, and the forward-only rollout are sound and well-argued; F1 and F3 are internal contradictions that would ship a half-working prompt/verify pair, and F2 a house-rule violation nothing mechanical catches.
