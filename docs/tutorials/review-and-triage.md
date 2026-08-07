# Review a plan and implementation, then triage the findings

In this tutorial you will run both of the dx- review gates on the `oauth-login` change — once on the
plan before you write code, once on the implementation after — and then use the single skill that acts
on what they find. By the end you will have two review reports on disk, each with findings that carry a
`Resolution:` line, and you will have applied real fixes to the plan and to the shipped code. No prior
dx- experience is needed.

**The one architecture to hold onto:** the two review gates, `/dx-plan-review` and `/dx-impl-review`,
are **report-only**. They read, analyze, and write a findings file — they never edit your plan or your
code. A separate skill, `/dx-review-triage`, is the *single* place that acts on a finding: it applies
fixes, one at a time, only on your confirmation. That split is deliberate. A reviewer that never
touches what it reviews stays honest and simple; the one tool that does mutate things is small and
focused. You will see the gate write, then the triage act, four times in this walkthrough.

Two more facts that make the rest click:

- A review report is **one file, always overwritten** — `reviews/plan-review.md` or
  `reviews/impl-review.md`. No dates in the name. Re-running a gate reflects the plan or code *as it
  stands now*, so a stale review would just be noise.
- **Findings are the unit of state.** Each has a stable ID (`F1`, `F2`, …) that never renumbers, and a
  `Resolution:` line that starts `PENDING`. Only `/dx-review-triage` ever rewrites that line. That is
  how work resumes: re-running triage picks up at the first `PENDING` finding in document order — the
  same rule `## Progress` uses for its first `- [ ]`.

## Prerequisites

- The dx- skills are installed and you have a project open in Claude Code with `/dx-init` already run.
  If not, start with [initialize a project](./initialize-a-project.md).
- A change that is **planned** (for Steps 1–2) and, by Steps 3–4, **implemented**. This tutorial picks
  up `oauth-login` right after [ship a change](./ship-a-change.md) has planned it — do that walkthrough
  first if you want a real plan to review. The review loop works on any change with a `plan.md`.

You do not need standards, a glossary, or lessons in place. The gates use them if they exist and note
their absence as a low-priority finding if they don't.

## Step 1 — Gate the plan before you write code

`/dx-plan-review` is the optional pre-implementation gate. Where `/dx-implement` later asks "did we
build the plan?", this asks "will this plan actually *work*?" — a flawed plan costs hours, a flawed
review costs minutes. Run it:

```text
/dx-plan-review oauth-login
```

> **dx-plan-review** reads `context/changes/oauth-login/plan.md` in full (plus the `change.md`, and any
> `frame.md`/`research/` it drew on), then reviews on four dimensions:
>
> - **Substance** — does the approach actually solve the framed problem, or could every phase pass and
>   the goal still be unmet? Folds in **reversibility** (is the undo path documented alongside the
>   execute path, when the plan touches failure modes?) and **scope cohesion** (one independently
>   deployable capability, not bundled unrelated work).
> - **Feasibility** — are the phases realistic, correctly ordered, each a testable vertical slice?
>   Folds in **failure-scenario coverage** — do external calls and migrations have documented
>   failure modes?
> - **Architectural fitness** — does it fit the existing system, or invent a new pattern where one
>   already exists? Folds in **contracts & compatibility** — is a breaking change named as one?
> - **Standards-fit** — are the plan's **Standards to apply** the right matched ones for this change's
>   domain and type?
>
> These extra checks only fire when `plan.md` was expected to carry a `## Data model`, `## API &
> contracts`, or `## Failure modes & reversibility` section — the same relevance triggers `dx-plan`
> used to decide whether to write one, so a wrongly-omitted section is caught, not just a
> present-but-wrong one.
>
> To check the plan's claims against reality — riskiest file paths, unlisted callers, whether a pattern
> already exists — it fans out built-in `Explore` subagents with focused questions rather than dumping
> the whole plan at them. It finds two things worth flagging, writes them to
> `context/changes/oauth-login/reviews/plan-review.md` (creating `reviews/`), prints the same list, and
> does **not** touch `plan.md`.

The report it wrote — note the exact finding shape, the `[Blocker]`/`[Consider]` tags, and the
single verdict line at the end:

```markdown
# Plan review: oauth-login

### F1 — Phase 2 has no rollback for the session-table migration [Blocker]
- **Location:** plan.md Phase 2
- **Detail:** Phase 2 adds a `sessions` table migration to store the OAuth session, but the phase
  lists no down-migration and no manual rollback step. An Explore check of `migrations/` confirms
  every existing migration ships a paired `down`. This one would leave the schema unrecoverable if
  Phase 2 fails partway.
- **Fix:** Add a down-migration to Phase 2 and a `## Progress` step verifying it, matching the
  paired-migration pattern already in `migrations/`.
- **Resolution:** PENDING

### F2 — "verify the email" step doesn't say which claim [Consider]
- **Location:** plan.md Phase 2, callback step
- **Detail:** The plan says "match the user by email" without specifying the *verified* email claim.
  foundation/lessons.md already records that raw addresses must never be trusted here.
- **Fix:** Name the `email_verified` claim explicitly in the Phase 2 step so the implementer can't
  match on an unverified address.
- **Resolution:** PENDING

## Verdict: revise
```

> **dx-plan-review** closes with a one-line verdict — **sound** / **revise** / **rethink** — here
> `revise`, since F1 is a blocker but the overall approach is sound. Then it prints and stops:
>
> ```text
> Plan review: context/changes/oauth-login/reviews/plan-review.md
> Next: /dx-review-triage oauth-login plan   — triage findings and apply fixes to plan.md
>   or: /dx-implement oauth-login  (/dx-tdd oauth-login for defect/test-first) — proceed as-is
> ```

Nothing changed except that one new file. The gate reported; the decision — and any edit — is yours.
The `Next:` line makes the choice explicit: triage the findings, or proceed as-is and accept them.

## Step 2 — Triage the plan-review

`/dx-review-triage` is the one skill that acts on findings. Its second argument names which report —
`plan` here, since a plan-review and an impl-review can both carry open findings on the same change at
once. Run it:

```text
/dx-review-triage oauth-login plan
```

> **dx-review-triage** loads `reviews/plan-review.md` and `plan.md` (the thing it will edit), finds the
> first `Resolution: PENDING` finding — **F1** — and offers five options, one finding at a time:
>
> **F1 — Phase 2 has no rollback for the session-table migration [Blocker]**
> 1. **Fix now** — apply the suggested fix (shows the before/after edit, applies on your confirm) **(recommended)**
> 2. **Fix differently** — tell it what you'd prefer instead
> 3. **Skip** — leave it PENDING for now, move on
> 4. **Accept risk** — leave it, record a one-line reason
> 5. **Record as lesson** — hand it to `/dx-lesson` to capture for future changes
>
> **You:** 1

> **dx-review-triage** shows the edit it will make to `plan.md` (plan-review fixes touch `plan.md`
> only — and, like `dx-plan` itself, are **not committed**):
>
> ```diff
>   ### Phase 2: Callback + session   — vertical slice
> + Add a paired down-migration for the `sessions` table (matches migrations/ convention).
>   Add `GET /auth/google/callback`: exchange the code, verify the email, match the user, issue a session.
> ```
>
> On your confirm it applies the edit and rewrites F1's line in place to `Resolution: FIXED`. It leaves
> every other field on the finding untouched, then moves to **F2**.

> **dx-review-triage** shows F2 and its five options. This one is a `Consider`, and you decide the
> implementer will read the lesson anyway:
>
> **You:** 3   *(Skip)*

> **dx-review-triage** rewrites F2 to `Resolution: SKIPPED`, reaches the end of the report, prints a
> one-line tally, and stops:
>
> ```text
> Triaged plan-review.md: 1 fixed, 1 skipped, 0 accepted, 0 dismissed
> Next: /dx-plan-review oauth-login   or  /dx-implement oauth-login   (plan-review triaged)
>   or: /dx-impl-review oauth-login   or  /dx-archive oauth-login     (impl-review triaged)
> ```

The report now records what you decided:

```markdown
### F1 — Phase 2 has no rollback for the session-table migration [Blocker]
...
- **Resolution:** FIXED

### F2 — "verify the email" step doesn't say which claim [Consider]
...
- **Resolution:** SKIPPED
```

If you had stopped partway — answered F1 and quit — that would be fine. Re-running
`/dx-review-triage oauth-login plan` resumes at the first `PENDING` finding, exactly like implement
resuming at the first `- [ ]`. Nothing is lost between runs because the resolution lines *are* the
state.

## Step 3 — Gate the implementation

Assume you have now built the change — `/dx-implement oauth-login` ran every phase and flipped
`change.md` to `status: implemented`. (If you need that part, it is Step 3 of
[ship a change](./ship-a-change.md).) Now run the post-implementation gate:

```text
/dx-impl-review oauth-login
```

> **dx-impl-review** reads `plan.md` (with its Standards and Priors), pulls the `git diff` for the
> commits that landed the change, and diffs *built-vs-plan* across four dimensions — fanning out
> `Explore` subagents to keep its own context clean:
>
> - **Plan-Drift** — is what's in the diff what the plan planned? Skipped items, intent mismatches,
>   unplanned scope.
> - **Safety** — data loss, destructive ops, missing boundary checks, hardcoded secrets, injection.
> - **Patterns** — sound structure, no leaky interfaces, consistent with sibling code.
> - **Standards-compliance** — did it follow the plan's matched **Standards to apply**?
>
> It writes `context/changes/oauth-login/reviews/impl-review.md` and prints the same to screen.

The impl-review report **opens with a per-dimension Verdicts block** (that is what distinguishes it
from a plan-review's single verdict line), then lists findings tagged by dimension name:

```markdown
## Verdicts
- Plan-Drift: PASS
- Safety: WARNING
- Patterns: PASS
- Standards: PASS

### F1 — Callback logs the raw Google ID token on error [Safety]
- **Location:** routes/auth/google/callback.ts:48
- **Detail:** The `catch` block logs the full error object, which includes the raw ID token. That
  puts a bearer credential into application logs — a data-exposure risk if logs are shipped anywhere.
- **Fix:** Log the error message and a redacted token id only; never the raw token.
- **Resolution:** PENDING
```

> **dx-impl-review** finds no blocker, so it sets `change.md` to `status: reviewed`. Because the
> token-logging mistake is the kind of thing a future change would trip on again, it **offers** — never
> auto-writes — to record it as a lesson via `/dx-lesson`, showing the proposed one-liner for you to
> confirm. Then it prints and stops:
>
> ```text
> Review written: context/changes/oauth-login/reviews/impl-review.md
> Next: /dx-review-triage oauth-login impl   — triage findings and apply fixes
>   or: /dx-lesson                           # a finding worth recording — offered above
>   or: /dx-archive oauth-login              # passed — retire the change
> ```

Same shape as Step 1: the gate wrote one file and changed nothing else. The `WARNING` on Safety is a
finding you will want to act on, so triage is next.

## Step 4 — Triage the impl-review

Same skill, same five options — but with one important difference: **impl-review fixes touch shipped
code, so each applied fix gets committed.** Run it:

```text
/dx-review-triage oauth-login impl
```

> **dx-review-triage** loads `reviews/impl-review.md` and the diff scope it reviews, finds the first
> `PENDING` finding — **F1**, the Safety WARNING — and offers the same five options:
>
> **F1 — Callback logs the raw Google ID token on error [Safety]**
> 1. **Fix now** — apply the suggested fix (shows before/after) **(recommended)**
> 2. **Fix differently**
> 3. **Skip**
> 4. **Accept risk** — record a one-line reason
> 5. **Record as lesson**
>
> **You:** 1

> **dx-review-triage** shows the edit to `routes/auth/google/callback.ts`:
>
> ```diff
> - logger.error("oauth callback failed", err);
> + logger.error("oauth callback failed", { message: err.message, tokenId: redact(token) });
> ```
>
> On your confirm it applies the fix and — because this is shipped code — **commits it on its own**,
> using the same Conventional Commit shape `dx-implement` uses, tagged `(review)`:
>
> ```text
> fix(oauth-login): Callback logs the raw Google ID token on error (review)
> ```
>
> It rewrites F1 to `Resolution: FIXED`, reaches the end, and prints:
>
> ```text
> Triaged impl-review.md: 1 fixed, 0 skipped, 0 accepted, 0 dismissed
> Next: /dx-plan-review oauth-login   or  /dx-implement oauth-login   (plan-review triaged)
>   or: /dx-impl-review oauth-login   or  /dx-archive oauth-login     (impl-review triaged)
> ```

Two things to note. The applied *code* fix was committed; **the report file itself is never
committed** — like `plan.md`, it is working state you commit on your own schedule. And if a fix would
contradict something the plan or a standard states elsewhere, triage **stops and says so** rather than
silently picking a side — you resolve the conflict, not the tool.

## Step 5 — Close the change

With the findings resolved, retire the change:

```text
/dx-archive oauth-login
```

> **dx-archive** first checks `reviews/impl-review.md` for any finding still marked
> `Resolution: PENDING` — if one were, it names the count and asks whether to archive anyway. Here F1 is
> `FIXED`, so it stamps the record `status: archived` and `git mv`s the folder into `context/archive/`.

That `PENDING` check is why triage matters before archive: the gate can pass a change to `reviewed`
while individual findings still sit open, and archive is your last prompt to deal with them.

## What you built

On disk, the `oauth-login` change now carries its full review history:

- `context/changes/oauth-login/reviews/plan-review.md` — two findings, `F1: FIXED` and `F2: SKIPPED`,
  closing with a `revise` verdict.
- `.../reviews/impl-review.md` — a four-dimension Verdicts block (Safety `WARNING`) and its one
  finding, `F1: FIXED`.
- An edited `plan.md` (Phase 2 rollback added, not committed) and one extra commit in git history:
  `fix(oauth-login): Callback logs the raw Google ID token on error (review)`.

You saw the same rhythm twice: a **report-only gate writes findings**, then **triage acts on them one
at a time**. The gates never touched your code or plan; triage was the only skill that did — and only
on your confirmation.

## Where to next

- [Build standards](./build-standards.md) — a finding you keep re-triaging is a missing standard.
  Promote it once and every future plan-review checks against it automatically.
- [Ship a change](./ship-a-change.md) — the full change lifecycle these two gates sit inside; return
  to it to see where review fits end to end.

## Related

- [Ship a change](./ship-a-change.md) — the flagship lifecycle walkthrough; review is Steps 4 onward there.
- [Understanding the plan and its slices](../explanation/plan-and-slices.md) — what plan-review checks
  the plan *against*: vertical slices and `## Progress`.
- [The knowledge layer](../explanation/knowledge-layer.md) — standards and lessons, the catalog both
  gates match findings against and where triage can promote one.
- [Diagnose a bug](./diagnose-a-bug.md) — where an impl-review that surfaces a real regression hands off.
- [Skills reference](../reference/skills.md) — the exact Reads/Writes/Prints of `/dx-plan-review`,
  `/dx-impl-review`, and `/dx-review-triage`.
