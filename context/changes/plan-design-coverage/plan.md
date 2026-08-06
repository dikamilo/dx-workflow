# Plan: Close the plan/plan-review design-coverage gap

## Approach

Add three **atomic, independently-loadable** reference topics — one per design concern the current
`plan.md` has no home for — and wire them into both ends of the gap: `dx-plan` loads the ones a
change actually touches (to ask about them, then author the matching section), and `dx-plan-review`
loads the ones **that change** touches — not the ones the plan happens to carry — so a wrongly-absent
section is as reachable as a present-but-wrong one. The relevance gate is the same inline one-line
trigger per topic on both sides, so a change that touches nothing loads nothing.

Relevance is stated **once**, inline in the skill bodies — the trigger is load-bearing there (it
decides whether to load at all, so it cannot live inside the file it gates). The reference files
therefore open with what to ask and what a populated section must contain, never with a restated
"when this applies" — that copy would have no reader and would drift from the two that do.

```
skills/dx-references/references/
  plan-data-model.md      NEW   → `## Data model`
  plan-api-contracts.md   NEW   → `## API & contracts`
  plan-failure-modes.md   NEW   → `## Failure modes & reversibility`
  plan-template.md        += "Conditional sections by relevance" (header names + omit rule)
  interview.md            untouched
```

Those three header strings are fixed here and used verbatim in three places that must agree: the
`plan-template` block, `dx-plan` step 4's authoring, and `dx-plan-review`'s checks. Nothing
mechanical verifies them — check 4 resolves `dx-references` topics, not `plan.md` headers.

The `plan-` prefix is load-bearing naming, not decoration: it sorts the four `plan.md`-shaping
references together in a flat directory and says at a glance what a topic is *for*, so a bare
`api-contracts` can't be mistaken for general API guidance. It follows `change-md`/`effort-md`'s
existing "named after the artifact it shapes" convention.

Three files rather than one `plan-design-topics.md`: a single file would be loaded whole by both
skills regardless of which concern is live, which is the exact context cost this split exists to
avoid.

`interview.md` stays untouched — **verified, not assumed**: it holds only loop mechanics (the
five-step loop, the scaling table, the framing-vs-solution split), and all four callers
(`dx-frame`, `dx-plan`, `dx-brainstorm`, `dx-roadmap`) already keep their own question topics
collocated in their skill bodies. There is no per-skill topic content in it to extract, and adding
solution-space topics would push them onto three skills that must not ask them. Framing topics
likewise stay inline in `dx-frame`: one caller, so the house rule keeps them collocated.

**Sections are silently omitted when the concern doesn't apply** — never an `N/A` placeholder,
exactly mirroring the existing `type`-conditional phase characteristics. That keeps trivial plans
thin, and it deliberately shifts the "was this considered, or forgotten?" burden onto
`dx-plan-review`, which is why the review half is not optional to this change: without it, silence
in a plan is unauditable.

`dx-plan-review` gains four checks folded into its **existing four dimensions** — no fifth dimension,
so the "four dimensions" phrasing across `docs/` and `review-report.md` stays true and
`review-report.md` needs no edit (`plan-review.md` findings carry bare `[Blocker]`/`[Consider]` tags
with no per-dimension list, unlike `impl-review.md`). Mapping:

| Check | Dimension |
|---|---|
| Reversibility — is the undo path documented alongside the execute path? | Substance |
| Contracts & compatibility — is a breaking change named as one? | Architectural fitness |
| Failure-scenario coverage — do external calls and migrations have documented failure modes? | Feasibility |
| Scope cohesion — one independently deployable capability per plan? | Substance |

Scope cohesion stays **inline in `dx-plan-review`** rather than becoming a reference: only one skill
uses it, and the house rule extracts a reference only at ≥2 call sites — that alone justifies keeping
it there. It is a **new** check, not a re-verification: `dx-frame` applies no bundling test (its
sections are the real problem, who/what it affects, alternatives, out of scope). The nearest upstream
check is `dx-new`'s change-vs-effort routing (`dx-new/SKILL.md:28`, "a single shippable unit"), which
runs before framing and asks a different question — whether the work is one change or an effort, not
whether the resulting plan is one deployable capability.

`plan-template` has **four** readers, not two — `dx-plan`, `dx-plan-review`, `dx-implement/SKILL.md:16`
and `dx-tdd/SKILL.md:16` both pull it for the phase shape. `dx-implement` and `dx-tdd` therefore
inherit the conditional-sections block automatically and need **no edit**: they consume `plan.md`'s
shape, they don't author or audit it.

`dx-impl-review` is a different case and **is in scope**. Its Plan-drift dimension asks "was what's in
the diff what `plan.md` planned?" — and a `## Failure modes & reversibility` section is exactly the
planned intent a diff can quietly fail to honor. Without it the gap just moves one step later: a plan
documents an undo path, the implementation ships without one, and impl-review passes clean. It gains
one Plan-drift instruction — no new dimension.

Rollout is **forward-only** (settled in framing): no `context/changes/**/plan.md` or `reviews/`
written before this ships gets retrofitted, matching how the `type`-conditional phase pattern rolled
out with no history migration.

## Standards to apply

> Matched from `context/standards/` by domain + topic. `global/scripts.md` does not match — this
> change adds no `/scripts` code.

- [ ] **skill-authoring — use `skill-creator`**: route every `SKILL.md` and reference edit through
      `skill-creator` rather than hand-editing in isolation. **Deviation, stated not skipped:** the
      standard's eval requirement is unmeetable — this repo ships no eval harness (see Priors).
- [ ] **skill-authoring — frontmatter is the invocation cost**: `dx-references`' `description`
      enumerates available topics; add the three new names there and nowhere else. No skill
      frontmatter changes (`dx-plan`/`dx-plan-review` stay `disable-model-invocation: true` with
      their terse human-facing descriptions).
- [ ] **skill-authoring — no-op test on every sentence**: each new reference earns its lines by
      saying what the model would *not* do unprompted. Delete anything else.
- [ ] **skill-authoring — shared reference, not duplication**: the three topics are used by exactly
      two skills → references. Scope cohesion is used by one → stays collocated. Never deep-link a
      reference file from a skill body; always `dx-references` with the topic.
- [ ] **skill-authoring — completion criteria**: both skills already carry `## Done when`; keep them
      accurate as steps change.
- [ ] **CLAUDE.md house rule — docs in sync**: `docs/reference/skills.md` plus every tutorial and
      explanation page naming `dx-plan`/`dx-plan-review` updates in this same change.
- [ ] **CLAUDE.md house rule — changeset**: this branch touches `skills/**`, so `npx changeset`
      before the PR. Single change, so a single changeset covers it.
- [ ] **CLAUDE.md house rule — `npm run lint:skills`** after any `skills/dx-*` edit.

## Priors & gotchas

- **Skills ship without evals — no harness exists** (`lessons.md`, 2026-07-28). The
  `skill-authoring` standard's eval requirement cannot be met here; state the deviation in this plan
  (done above) rather than dropping it silently. Verification falls back to a sandboxed subagent run
  with scripted answers — which tests routing given good answers, **not** the interview under a user
  who pushes back. Treat the interview-side change as the less-verified half.
- **Severity vocabulary is already unified** to `[Blocker]`/`[Consider]` (archived
  `review-severity-unification`) — the source material's four-tier emoji scale is closed scope, not
  a live option.
- **`lint-skills.mjs` check 4** mechanically resolves every `` dx-references` with `<topic>` ``
  call site against `references/<topic>.md`. Write the new call sites in exactly that backticked
  form so they are checked; a looser phrasing silently skips the check.
- **`lint-skills.mjs` check 5** requires a `### /dx-<name>` heading in `docs/reference/skills.md`
  per skill folder — no new skill folders here, so this check is unaffected.
- **Glossary**: use the established terms — *Plan*, *Plan-review*, *Finding*, *Change*, *Standard*.
  New vocabulary introduced by this change (the three topic names) is skill-authoring vocabulary,
  not domain language; no glossary entry unless a term turns out to be overloaded mid-implementation,
  in which case invoke `dx-domain` then.

## Phases

### Phase 1: Authoring side — the three topics reach `plan.md`
End-to-end and demoable: running `/dx-plan` on a change that touches a schema produces a populated
`## Data model` section, and one that touches nothing produces no new headers at all.
- Create `references/plan-data-model.md`, `plan-api-contracts.md`, `plan-failure-modes.md` — each
  stating what to ask in the interview and what a populated section must contain, and **not**
  restating when it is relevant (that lives inline in the skill bodies, once).
  `plan-failure-modes.md` covers reversibility (the undo path) per the framing decision to
  fold it in.
- `plan-template.md` gains a `## Conditional sections by relevance` block: the three header strings
  verbatim from the Approach (`## Data model`, `## API & contracts`,
  `## Failure modes & reversibility`), where they sit relative to `## Approach`, and the
  **omit-entirely, never `N/A`** rule.
- `dx-plan` step 2 gains the one-line relevance triggers and loads only the matching topic(s) before
  interviewing; step 4 authors the matching section(s).
- `dx-references` frontmatter `description` lists the three new topics.
- Docs: `docs/reference/skills.md` — the `### /dx-plan` entry's **Writes:** *and* **Reads:** lines
  (the latter enumerates what `dx-plan` reads), and the `### dx-references` entry's topic count and
  list ("one of the **nine** topics" → twelve, plus the three new names). `lint-skills.mjs` sees
  neither, so nothing catches these if missed.
- Gate: `npm run lint:skills` passes — proves each new call site resolves.
- Gate: sandboxed subagent run of `/dx-plan` with scripted answers, two cases — a schema-touching
  change (expect a populated `## Data model`) and a trivial one (expect no new headers). Per Priors
  this tests routing given good answers, not the interview under pushback.

### Phase 2: Review side — the sections get verified
Demoable: `/dx-plan-review` on a plan with a `## Data model` section that omits a migration path
raises a finding; on a plan whose silence is correct, it stays quiet.
- `dx-plan-review` "Load first" gains conditional loading keyed on the **change**, using the same
  one-line relevance triggers as `dx-plan` step 2 (diff scope, `change.md` `type`, `frame.md`'s
  who/what-it-affects) — never on which headers `plan.md` already has, or a wrongly-omitted section
  would never load its own check.
- The four checks land under their existing dimensions per the Approach mapping; scope cohesion goes
  in inline.
- `dx-impl-review` Plan-drift (`SKILL.md:20`) gains one line: when `plan.md` carries any of the three
  conditional sections, check the diff against what it planned — a documented undo path or migration
  that the implementation never shipped is Plan-drift, not a new dimension.
- `review-report.md` is **read and confirmed unchanged** — an explicit verification step, not a
  no-op: if the new checks turn out to need dimension-tagged findings, that assumption breaks and
  this is where it surfaces.
- Docs: `docs/reference/skills.md` `### /dx-plan-review` entry — including its **Reads:** line,
  which enumerates `plan-template`/`knowledge-layer`/`review-report` by name — the
  `### /dx-impl-review` entry (its **Reads:** line names what it reads from `plan.md`), and
  `docs/tutorials/review-and-triage.md` (its four-dimension walkthrough at ~line 48).
- Gate: sandboxed subagent run of `/dx-plan-review` with scripted answers, two cases — a plan whose
  `## Data model` section omits a migration path (expect a finding) and a plan whose silence is
  correct (expect quiet). Same limits as Phase 1's run.

### Phase 3: Cross-cutting docs, changeset, gate
- `docs/explanation/plan-and-slices.md` — the `plan.md` anatomy walkthrough (~lines 35–56) gains the
  conditional sections and the reason they are conditional.
- `docs/tutorials/ship-a-change.md` — the worked `plan.md` example (~lines 111–137): show at most one
  conditional section, and only if the tutorial's OAuth change genuinely touches that concern.
  Adding all three would model the boilerplate this change exists to prevent.
- `npx changeset` — minor bump, one line summarizing the capability.
- Final `npm run lint:skills` and a read-through of every touched file against the no-op test.

## Progress

### Phase 1: Authoring side — the three topics reach `plan.md`
- [ ] `references/plan-data-model.md` written
- [ ] `references/plan-api-contracts.md` written
- [ ] `references/plan-failure-modes.md` written (covers reversibility)
- [ ] `plan-template.md` — conditional-sections block added
- [ ] `dx-plan/SKILL.md` — steps 2 and 4 updated with relevance triggers and conditional loading
- [ ] `dx-references/SKILL.md` — description lists the three new topics
- [ ] `docs/reference/skills.md` — `/dx-plan` entry (Writes + Reads) and `dx-references` entry
      (topic count + list) updated
- [ ] `npm run lint:skills` passes
- [ ] sandboxed `/dx-plan` run — schema-touching change and trivial change behave as specified

### Phase 2: Review side — the sections get verified
- [ ] `dx-plan-review/SKILL.md` — conditional topic loading in "Load first"
- [ ] `dx-plan-review/SKILL.md` — four checks folded into the existing four dimensions
- [ ] `dx-impl-review/SKILL.md` — Plan-drift checks the diff against the conditional sections
- [ ] `review-report.md` read and confirmed unchanged (or the assumption break recorded)
- [ ] `docs/reference/skills.md` — `/dx-plan-review` and `/dx-impl-review` entries updated (including
      their Reads lines)
- [ ] `docs/tutorials/review-and-triage.md` — four-dimension walkthrough updated
- [ ] sandboxed `/dx-plan-review` run — omitted-migration plan raises a finding, correct-silence plan
      stays quiet

### Phase 3: Cross-cutting docs, changeset, gate
- [ ] `docs/explanation/plan-and-slices.md` — `plan.md` anatomy updated
- [ ] `docs/tutorials/ship-a-change.md` — worked example updated (at most one conditional section)
- [ ] `npx changeset` written
- [ ] `npm run lint:skills` passes and every touched file re-read against the no-op test
