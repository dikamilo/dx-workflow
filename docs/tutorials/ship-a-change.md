# Ship your first change

In this tutorial you will take one small feature — "Add Google sign-in" — from an idea all the
way to an archived, reviewed change, using nothing but dx- slash commands. By the end you will have
a real `context/changes/oauth-login/` folder that moved through every lifecycle status and then landed
in `context/archive/`. No prior dx- experience is needed.

This is the flagship walkthrough: the full change lifecycle, end to end, on the happy path. Other
tutorials branch off from here.

**The one principle to hold onto:** dx- skills never auto-chain. Each command does exactly one job,
prints a `Next:` suggestion, and **stops**. *You* run the next command. That is the whole engine —
you are the loop, the skills are the steps. Every step below ends by showing you the `Next:` line it
printed, and then you type the next command yourself.

## Prerequisites

- The dx- skills are installed (via `skills.sh`).
- You have a project to work in, opened in Claude Code.
- You have already run `/dx-init` on it, so the `context/` scaffold exists. If not, do the
  [initialize a project](./initialize-a-project.md) tutorial first — it takes a minute.

That is it. You do not need standards, a glossary, or lessons in place; the workflow uses them if they
exist and quietly skips them if they don't.

## Step 1 — Create the change

Start every piece of work with `/dx-new`. Describe the idea in plain words:

```text
/dx-new "add google sign-in"
```

> **dx-new** is the router. It sizes the work — small and clear becomes a *change*, large and
> branching becomes an *effort* — derives a kebab-case id from your idea (`Add Google sign-in` →
> `oauth-login`), and writes one identity file. This is small and clear, so it creates
> `context/changes/oauth-login/change.md` and stops. It does not research, frame, or plan — it routes.
>
> ```text
> Next: /dx-research oauth-login <topic>   → /dx-frame oauth-login   → /dx-plan oauth-login
>   (both optional — small/clear work can go straight to /dx-plan oauth-login)
> ```

The change record now on disk:

```yaml
---
change_id: oauth-login        # kebab-case, matches folder name
title: Add Google sign-in
type: feature                 # feature | defect | refactor | migration
effort: null                  # freeform change, not part of an effort
slice: null
status: new
created: 2026-07-11
updated: 2026-07-11
archived_at: null
---

## Notes
```

That `status: new` is the first stop on the lifecycle: `new → planned → implementing → implemented →
reviewed → archived`. Each skill stamps the transition it causes.

**About research and frame.** The `Next:` line offers `/dx-research` and `/dx-frame` first — both are
**optional**. Research gathers external facts you don't have yet; frame pins down scope and approach
before design. For a change this small and well-understood, we skip both and go straight to the plan.
When you *would* reach for them, see [frame and research](./frame-and-research.md).

## Step 2 — Plan it

`/dx-plan` is where the idea becomes a solution design. It is **never skipped** — it owns the
`## Progress` section that the rest of the workflow reads — but it scales down to almost nothing for
trivial work. Run it:

```text
/dx-plan oauth-login
```

Because there is no `frame.md`, `/dx-plan` first **front-loads a couple of framing questions**, then
moves on to solution design. It interviews **one question at a time**, always with a recommended
option — never a batch form.

> **dx-plan** reads `context/changes/oauth-login/change.md` (no `frame.md`, no research), so it opens
> with a framing question:
>
> **Q1.** What's the scope of "Google sign-in" for this first change?
> 1. Sign-in only — existing users authenticate with Google; account creation stays as-is **(recommended)**
> 2. Sign-in *and* just-in-time account creation on first Google login
> 3. Full account-linking UI (link/unlink Google from an existing password account)
>
> **You:** 1

> **dx-plan** records the scope and moves to solution design:
>
> **Q2.** Which OAuth flow should the server use?
> 1. Authorization Code flow with PKCE — standard for server-rendered web apps, no client secret in the browser **(recommended)**
> 2. Implicit flow — token straight to the browser (legacy, discouraged)
>
> **You:** 1

> **dx-plan** asks one more design question:
>
> **Q3.** Where should the OAuth callback route live?
> 1. `routes/auth/google/callback.ts` — matches the existing `routes/auth/` structure **(recommended)**
> 2. `api/oauth.ts` — one flat catch-all handler
>
> **You:** 1

> **dx-plan** loads `plan-failure-modes` — this change introduces an external call (Google's token
> exchange) — and asks:
>
> **Q4.** If the Google token exchange fails partway (network error, invalid code), how should the
> callback behave?
> 1. Fail closed — show a generic sign-in error and create no partial session; safe to retry **(recommended)**
> 2. Retry the exchange automatically before failing
>
> **You:** 1

> **dx-plan** then matches the knowledge layer — pulling any relevant files from
> `context/standards/` into a `## Standards to apply` checklist and any relevant `foundation/lessons.md`
> entries into `## Priors & gotchas` — writes `plan.md` with a few vertical-slice phases and a
> `## Progress` section, flips `change.md` to `status: planned`, and prints:
>
> ```text
> Plan written: context/changes/oauth-login/plan.md
> Next: /dx-plan-review oauth-login   — optional pre-implementation gate
>   or: /dx-implement oauth-login     (/dx-tdd oauth-login for defect/test-first)
> ```

The plan it wrote, trimmed:

```markdown
# Plan: Add Google sign-in

## Approach
Add "Sign in with Google" using the OAuth 2.0 Authorization Code flow with PKCE. A new
`routes/auth/google/` pair — one route to start the flow, one callback — exchanges the code for a
profile, matches it to an existing user by verified email, and issues the app's normal session. No
account creation in this change (scope decided in the interview).

## Failure modes & reversibility
- Google's token exchange can fail or time out; the callback fails closed with a generic sign-in
  error and creates no partial session — safe to retry.
- Undo path: this is an additive new route, so removal is a plain revert — no data or state to
  unwind.

## Standards to apply
> Matched from context/standards/ by domain + topic. A checklist the implementer follows and impl-review verifies.
- [ ] auth/sessions: reuse the existing session issuer — never mint a parallel token path
- [ ] coding-style: route handlers stay thin; provider calls live in a service module

## Priors & gotchas
> From foundation/lessons.md — decisions already made and scar tissue not to relitigate.
- Always match Google identities on the *verified* email claim, never the raw address

## Phases
### Phase 1: OAuth service + start route   — vertical slice
Add the Google OAuth client/config and the `GET /auth/google` route that redirects to Google with a
PKCE challenge. Demoable: hitting the route lands you on Google's consent screen.

### Phase 2: Callback + session   — vertical slice
Add `GET /auth/google/callback`: exchange the code, verify the email, match the user, issue a session.
Demoable: a real Google login ends with an authenticated session.

## Progress
> `- [ ]` pending, `- [x]` done. Append ` — <short-sha>` when a step lands in a commit.

### Phase 1: OAuth service + start route
#### Automated
- [ ] 1.1 Unit tests for the OAuth client config pass
- [ ] 1.2 `GET /auth/google` redirects with a valid PKCE challenge (integration test)
#### Manual
- [ ] 1.3 Hitting /auth/google in a browser reaches Google's consent screen

### Phase 2: Callback + session
#### Automated
- [ ] 2.1 Callback exchanges code and issues a session (integration test)
- [ ] 2.2 Existing-user email match is covered by tests
#### Manual
- [ ] 2.3 End-to-end Google login lands on an authenticated page
```

Each phase is a **vertical slice** — something demoable end to end, not a horizontal "all the routes,
then all the tests" layer. `## Progress` is the execution single source of truth: `dx-implement` will
resume from the first `- [ ]` and flip boxes as work lands. For why plans are shaped this way, see
[the plan and its slices](../explanation/plan-and-slices.md); for why the interview front-loads framing
when no `frame.md` exists, see [handoff scaling](../explanation/handoff-scaling.md).

> **Optional gate.** The `Next:` line offers `/dx-plan-review` — a report-only second opinion on the
> plan *before* you write code. It is worth it for risky or expensive work. This change is small, so we
> go straight to implementation.

## Step 3 — Implement it, one phase at a time

`/dx-implement` runs **exactly one phase per invocation** — never the whole plan. It resumes from the
first `- [ ]` in `## Progress`, does that phase, verifies it, and commits. Run it:

```text
/dx-implement oauth-login
```

> **dx-implement** sees `change.md` at `status: planned` and flips it to `implementing`. The first
> `- [ ]` is `1.1`, so **Phase 1** is its target. It builds the OAuth client config and the
> `GET /auth/google` start route, following the plan's **Standards to apply** and **Priors & gotchas**.
> It runs the phase's `#### Automated` checks; each one that genuinely passes flips `- [ ]` to `- [x]`.
> (`#### Manual` boxes wait for a human to confirm.) It commits the phase as one Conventional Commit —
> `feat(oauth-login): OAuth service + start route (p1)` — then appends that commit's short SHA to every
> row that landed. More phases remain, so it prints:
>
> ```text
> Next: /dx-implement oauth-login            # more phases remain — runs the next one
> ```

Progress after Phase 1 — the automated boxes are ticked and SHA-stamped, the manual box still awaits you:

```markdown
### Phase 1: OAuth service + start route
#### Automated
- [x] 1.1 Unit tests for the OAuth client config pass — a1b2c3d
- [x] 1.2 `GET /auth/google` redirects with a valid PKCE challenge (integration test) — a1b2c3d
#### Manual
- [ ] 1.3 Hitting /auth/google in a browser reaches Google's consent screen
```

Nothing chained. You run the command again to do the next phase:

```text
/dx-implement oauth-login
```

> **dx-implement** resumes at the first remaining `- [ ]` — Phase 1's manual box `1.3`, which you
> confirm, and then **Phase 2**. It adds the callback route, the code exchange, the verified-email
> match, and session issuance, flips Phase 2's automated boxes, and commits
> `feat(oauth-login): Callback + session (p2)`. With every box now `- [x]`, it sets `change.md` to
> `status: implemented` and prints:
>
> ```text
> Next: /dx-impl-review oauth-login          # all phases done
> ```

> **TDD variant.** For a defect or any test-first phase you would run `/dx-tdd oauth-login` instead —
> it writes the failing test first, then the fix, and writes back to the same `## Progress` section, so
> the two interleave freely across phases. See [implement vs TDD](../explanation/implement-vs-tdd.md).

## Step 4 — Review what you built

`/dx-impl-review` is the post-implementation gate. It compares what was actually built against the plan
and **reports** — it reviews, it never quietly fixes the code it is checking. Run it:

```text
/dx-impl-review oauth-login
```

> **dx-impl-review** reads `plan.md` (with its Standards and Priors), pulls the diff for the commits
> that landed the change, and reviews on four dimensions — **plan-drift** (did we build what we
> planned?), **safety** (data loss, secrets, missing boundary checks), **patterns** (sound structure,
> no leaky interfaces), and **standards compliance**. It writes
> `context/changes/oauth-login/reviews/impl-review.md`, opening with a per-dimension verdict block, and
> prints the same to screen.

The review file it wrote:

```markdown
## Verdicts
- Plan-Drift: PASS
- Safety: PASS
- Patterns: PASS
- Standards: WARNING

### F1 — Provider call reaches slightly past the service seam [Standards]
- **Location:** routes/auth/google/callback.ts
- **Detail:** The callback decodes the Google ID token inline instead of going through the
  OAuth service module, so a little provider logic leaks into the route handler.
- **Fix:** Move the token-decode into the service; keep the handler thin per coding-style.
- **Resolution:** PENDING
```

> **dx-impl-review** finds no blocker — the change does what the plan intended and is safe — so it sets
> `change.md` to `status: reviewed`. It also offers to record the leaky-seam observation as a lesson
> for future changes. Then it prints:
>
> ```text
> Review written: context/changes/oauth-login/reviews/impl-review.md
> Next: /dx-review-triage oauth-login impl   — triage findings and apply fixes
>   or: /dx-lesson                           # a finding worth recording — offered above
>   or: /dx-archive oauth-login              # passed — retire the change
> ```

The verdict is a pass with a single low-severity `Consider`. If it had turned up findings you wanted to
act on, you would run `/dx-review-triage oauth-login impl` — the one skill that rewrites a finding's
`Resolution` and applies the fix. See [review and triage](./review-and-triage.md) for that loop. Here
we accept the minor note as-is and move on to archive.

## Step 5 — Archive it

The change is reviewed and done. `/dx-archive` retires it — there is no registry, the archive is simply
where finished work lives:

```text
/dx-archive oauth-login
```

> **dx-archive** resolves `oauth-login` to a change, checks `reviews/impl-review.md` for any finding
> still marked `Resolution: PENDING` (F1 is, so it names the count and asks whether to archive anyway —
> you confirm), then stamps the record `status: archived` with `archived_at: 2026-07-11` and `git mv`s
> the whole folder to `context/archive/2026-07-11-oauth-login/` so history follows. It prints:
>
> ```text
> ✓ Archived oauth-login → context/archive/2026-07-11-oauth-login/
> ```

That is the full lifecycle. Notice again: at no point did a skill run the next one for you. You typed
five commands, and between each one the workflow stopped and waited.

## What you built

On disk, one change moved cleanly through every status and came to rest in the archive:

- `context/archive/2026-07-11-oauth-login/change.md` — `status: archived`, `archived_at` set, having
  passed through `new → planned → implementing → implemented → reviewed → archived`.
- `.../plan.md` — the solution design, its `## Progress` boxes all `- [x]` with commit SHAs.
- `.../reviews/impl-review.md` — the four-dimension verdict and its one finding.
- Two Conventional Commits in your git history: `feat(oauth-login): OAuth service + start route (p1)`
  and `feat(oauth-login): Callback + session (p2)`.

You drove the whole thing by hand — that hand-off between steps *is* the workflow.

## Where to next

- [Run an effort](./run-an-effort.md) — when work is too big for a single change, `payments-v2` shows
  how an effort decomposes into slices, each spawning a change that reuses this same lifecycle.
- [Diagnose a bug](./diagnose-a-bug.md) — the defect entry point: `/dx-diagnose` finds a root cause and
  hands it to `/dx-new` as a `type: defect` change that plans test-first.
- [Review and triage](./review-and-triage.md) — when a review *does* surface findings you want to fix,
  the triage loop that acts on them.

## Related

- [Understanding the plan and its slices](../explanation/plan-and-slices.md) — why phases are vertical
  slices and how `## Progress` works.
- [Implement vs TDD](../explanation/implement-vs-tdd.md) — the two implementers and when to pick each.
- [Efforts and changes](../explanation/efforts-and-changes.md) — the two-level model this change sits in.
- [Frame and research](./frame-and-research.md) — the optional upstream steps we skipped in Step 1.
- [Workflow overview](../explanation/workflow-overview.md) — the whole skill set and how the steps connect.
