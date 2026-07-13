# Use frame and research to prepare a change

In this tutorial you will take a vague request — "let users sign in with their existing accounts" — and turn it into a change that is ready to plan. You will gather facts you don't have with `/dx-research`, settle a fuzzy problem with `/dx-frame`, and watch the payoff: `/dx-plan` skips every framing question and interviews only on solution design. By the end you will have research files and a `frame.md` on disk. No prior dx- experience needed.

Both steps are **optional**. Reach for them by this rule:

- **Skip both** when the work is small and the problem is already clear. Go straight to planning — see [Ship a change](ship-a-change.md).
- **Use `/dx-research`** when you need **facts you don't have** — how the current code works, what an external API requires. Research answers *what is true*.
- **Use `/dx-frame`** when the **problem itself is fuzzy** — you can't yet say in one sentence what you're solving or why this shape over another. Framing answers *what we're really doing and why*.

"Let users sign in with their existing accounts" hits both. Is that Google OAuth? Enterprise SAML? Magic links? You don't know how auth works in the codebase today, and you don't yet know which problem you're actually solving. That is exactly the case these two steps exist for. For the reasoning behind splitting the WHAT from the HOW, see [Research and frame](../explanation/research-and-frame.md).

## Prerequisites

- The dx- skills installed and `/dx-init` already run in your project — see [Initialize a project](initialize-a-project.md).
- A change created with `/dx-new` — see [Ship a change](ship-a-change.md) for the full lifecycle. This tutorial assumes you ran `/dx-new` and answered with title "Add Google sign-in", so `context/changes/oauth-login/change.md` exists with `status: new`.

> Note: the change is named `oauth-login` and titled "Add Google sign-in" *after* the fact — that title is the conclusion framing reaches, not where you started. You began with the ambiguous request. Follow the steps and watch it resolve.

## Step 1 — Research the codebase

You don't know how sign-in works in this project today. Ask for the facts before deciding anything. One invocation investigates **one topic**.

```text
/dx-research oauth-login existing-auth
```

> **dx-research** resolves the `oauth-login` container, then fans out read-only **Explore** subagents — each on a distinct facet of existing auth (session handling, the user model, route structure, any prior auth work in past changes). It waits for them to return `file:line` evidence, synthesizes the findings, captures the current HEAD sha, and writes one provenance-stamped file:
>
> ```text
> Research written: context/changes/oauth-login/research/existing-auth.md
> Next: /dx-research oauth-login <another-topic>   — investigate another facet
>   or: /dx-frame oauth-login   → /dx-plan oauth-login       # change
>   or: /dx-frame oauth-login   → /dx-roadmap oauth-login    # effort
>   (foundation: no owning container — read automatically by future plans)
> ```

The file opens with frontmatter that stamps where the facts came from, so a later step can trust it without re-deriving:

```markdown
---
topic: existing-auth
kind: codebase
source: repo/codebase
gathered: 2026-07-11
git_commit: a1b9f4c2e77d3b0e5c8a1f620d4e9b3a7c112f88
---

## What exists today

- Sessions are cookie-based, signed in `lib/session.ts:14`. No token/JWT path.
- The `User` model has `email` + `password_hash` only (`db/models/user.ts:9`) —
  no `provider` or external-id column.
- Login routes live under `routes/auth/*` (`routes/auth/login.ts:1`); there is
  no callback route.
- No prior auth change found under `context/changes/**` or `context/archive/**`.
```

The `git_commit` sha pins these facts to a point in the codebase — if the code moves, you can tell the research went stale. This first research doc has no callback route and no provider column, which already tells you the real work is bigger than a button.

## Step 2 — Research the external options

Now the facts you're missing live *outside* the repo: what do the sign-in providers actually require? Same skill, different mode — pass a `--kind` and a URL and it switches to external research.

```text
/dx-research oauth-login oauth-providers --kind=external --url=https://developers.google.com/identity/protocols/oauth2
```

> **dx-research** sees the URL and `--kind=external`, so instead of Explore subagents it uses **WebFetch**/**WebSearch**, synthesizes a summary with inline citations and a fetch date, and writes a second topic file — `git_commit` is `null` because there's no repo revision behind web facts:
>
> ```text
> Research written: context/changes/oauth-login/research/oauth-providers.md
> Next: /dx-research oauth-login <another-topic>   — investigate another facet
>   or: /dx-frame oauth-login   → /dx-plan oauth-login       # change
>   or: /dx-frame oauth-login   → /dx-roadmap oauth-login    # effort
>   (foundation: no owning container — read automatically by future plans)
> ```

```markdown
---
topic: oauth-providers
kind: external
source: https://developers.google.com/identity/protocols/oauth2
gathered: 2026-07-11
git_commit: null
---

## Provider comparison (fetched 2026-07-11)

- **Google OAuth 2.0** — redirect + callback flow; needs client id/secret and a
  registered callback URL. Covers any Google account. [1]
- **SAML** — enterprise SSO; needs an IdP metadata exchange per customer. Heavy
  setup, aimed at orgs, not consumers. [2]
- **Magic links** — email a one-time link; no third-party, but adds an email-
  delivery dependency and a slower sign-in.

[1] https://developers.google.com/identity/protocols/oauth2
[2] https://learn.microsoft.com/entra/identity/saml-protocol-reference
```

Two invocations, two files: **one invocation = one topic = one mode**. Keeping topics in separate files means a later plan can cite exactly the one it needs. If this provider comparison were reusable across many future changes — not specific to `oauth-login` — you could research it into `foundation/` instead (`/dx-research foundation oauth-providers …`); foundation research has no owning container and is read automatically by every future plan.

## Step 3 — Frame the problem

You now have the facts. What you still lack is a decision: *which* problem are you solving, and *why* that shape? That's framing.

```text
/dx-frame oauth-login
```

> **dx-frame** reads `change.md` and both `research/*.md` files as **settled context** — it will not re-ask anything research already answered. Then it runs a deep interview on the WHAT, one question at a time, each with concrete options and one recommended:
>
> **Q1.** What's the real goal here — which pulls harder?
> 1. Reduce signup friction for consumers, so people stop bouncing at "create a password" **(recommended)**
> 2. Support enterprise SSO so organizations can mandate their identity provider
>
> **You:** 1
>
> **Q2.** Given consumer friction is the goal, which sign-in method fits?
> 1. Google OAuth — one click, no password, covers most consumer accounts **(recommended)**
> 2. SAML — solves enterprise SSO, not consumer friction; heavy per-customer setup
> 3. Magic links — no third party, but adds an email round-trip and an email-delivery dependency
>
> **You:** 1
>
> **dx-frame** writes `frame.md` with four sections, sets `updated: 2026-07-11` on `change.md`, and prints:
>
> ```text
> Frame written: context/changes/oauth-login/frame.md
> Next: /dx-plan oauth-login       (for a change)
>   or: /dx-roadmap oauth-login    (for an effort)
> ```

The interview leaned on the research — it never asked "how does auth work today" or "what does Google require," because those were already on disk. It asked only the questions research *can't* answer: what matters and why. The resulting `frame.md`:

```markdown
# Frame — Add Google sign-in

## The real problem
Consumers abandon signup at the "create a password" step; we need a
one-click sign-in that removes the password entirely.

## Who / what it affects
New and returning consumer users at the login/signup surface; the `User`
model (needs a provider identity), and `routes/auth/*` (needs a callback route).

## Alternatives considered
- **Google OAuth** — one click, no password, covers most consumer accounts. **Chosen.**
- **SAML** — solves enterprise SSO, a different problem; heavy per-customer IdP
  setup and no consumer benefit. Rejected.
- **Magic links** — removes the password but adds an email round-trip and an
  email-delivery dependency; slower than one-click. Rejected for now.

## Out of scope
Enterprise SSO, multiple OAuth providers, account linking for existing
password users. Ship Google-only first.
```

That is why the change ends up named `oauth-login`, titled "Add Google sign-in": framing collapsed the ambiguous request into one problem and one chosen shape, with the roads-not-taken written down.

## Step 4 — See the payoff in planning

Now plan the change and watch what framing bought you.

```text
/dx-plan oauth-login
```

> **dx-plan** reads `change.md`, both research files, **and `frame.md`**. Because the frame already settled the WHAT — the problem, the chosen approach, the scope — it asks **no** framing questions. It jumps straight to solution design:
>
> **Q1.** Where should the OAuth callback route live?
> 1. `routes/auth/callback.ts` — matches the existing `routes/auth/*` structure the research found **(recommended)**
> 2. `api/oauth.ts` — one flat handler
>
> **You:** 1
>
> **dx-plan** writes `plan.md` with a `## Progress` section, flips `change.md` to `status: planned`, and prints its own `Next:` line.

Compare that to planning *without* a frame. When `frame.md` is absent, `/dx-plan` has to front-load the framing questions itself — "is this Google OAuth or SAML?", "who is this for?" — *and then* interview on design, in one longer sitting. Framing up front means the WHAT is decided once, in writing, and every later step inherits it instead of re-litigating it. That is [handoff scaling](../explanation/handoff-scaling.md) in action: each artifact is a decision made once that the next step trusts. For the full plan-to-ship walkthrough, see [Ship a change](ship-a-change.md).

## What you built

On disk under `context/changes/oauth-login/`:

- `research/existing-auth.md` — codebase facts with a `git_commit` sha pinning them to a revision.
- `research/oauth-providers.md` — external provider comparison with citations and a fetch date (`git_commit: null`).
- `frame.md` — the real problem, who it affects, alternatives considered, and out-of-scope, in four scannable sections.
- `change.md` — now `status: planned` with `updated` bumped, ready for the rest of the lifecycle.

Each is a decision recorded once. The research and the frame are why the plan interview was short.

## Where to next

- [Ship a change](ship-a-change.md) — take the planned `oauth-login` through `/dx-plan` → `/dx-implement` → `/dx-archive`.
- [Run an effort](run-an-effort.md) — when the work is too big for one change, frame and research feed `/dx-roadmap` and its slices instead of a single plan.

## Related

- [Research and frame](../explanation/research-and-frame.md) — why dx- splits gathering facts from settling the problem, and when each earns its keep.
- [Handoff scaling](../explanation/handoff-scaling.md) — how writing a decision once lets every later step skip re-deciding it.
- [Ship a change](ship-a-change.md) — the baseline change lifecycle these two steps sit in front of.
- [Initialize a project](initialize-a-project.md) — get `/dx-init` and the `context/` scaffold in place first.
