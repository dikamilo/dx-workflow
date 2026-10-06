# Write a review policy

In this tutorial you will add a second kind of review to your project — a `security` review — by writing one Markdown file, then run it on the `oauth-login` change and triage what it finds. You won't write or install a skill: `/dx-review` runs any **Policy** it finds in `context/workflow/review-policies/`, so a new kind of review is a new file. By the end you will have a `security.md` Policy, a `reviews/security.md` report written by it, and a triaged finding.

## Prerequisites

- A project where `/dx-init` has run, so `context/workflow/review-policies/` holds `implementation.md`, `policy-template.md` and `report-template.md`. If the folder is missing (an older project), re-run `/dx-init` — it adds missing files and touches nothing else. See [initialize a project](./initialize-a-project.md).
- A change that is built: this tutorial reuses `oauth-login` from [ship a change](./ship-a-change.md), at `status: implemented` or `reviewed` but not yet archived — `/dx-review` refuses archived work. If you followed that tutorial to the end, run this one before its archive step, or use any built change of your own.
- Familiarity with one review-and-triage round. If you haven't run one yet, do [review and triage](./review-and-triage.md) first — this tutorial reuses that loop with your own criteria.

## Step 1 — Copy the template

A Policy's file name is its ID. Copy the template under the name you want to type:

```text
cp context/workflow/review-policies/policy-template.md context/workflow/review-policies/security.md
```

List the folder. `/dx-review` treats every `.md` here as a Policy except those whose name ends in `-template.md`, so you now have two Policy IDs, `implementation` and `security`:

```text
context/workflow/review-policies/
├── implementation.md
├── policy-template.md
├── report-template.md
└── security.md
```

Read `security.md` once before replacing it. Everything in it describes the shape you are about to fill in: the frontmatter, the sections, and the rules for custom instructions. Nothing lints a Policy, so this template is the only guardrail — keep to its section names.

## Step 2 — Write the Policy

Replace the contents of `security.md` with this:

```markdown
---
targets: container
---

Security review: does this change open a new way to leak credentials, bypass auth, or trust unvalidated input?

## Preconditions
- The container is a Change with a `plan.md`. Otherwise point at `/dx-plan <change-id>`.
- `change.md` has `status: implemented` or `status: reviewed`. Otherwise point at `/dx-implement <change-id>`.

## Load
- `plan.md`, especially any `## API & contracts` section.
- The diff scope: `git log`/`git diff` for the commits listed in `## Progress`.

## Dimensions
Tag findings `[<Dimension>: <Severity>]`, e.g. `[Secrets: Blocker]`.

### Secrets
Credentials, tokens or keys in code, config, logs or error messages.

### AuthZ
Every new route or handler checks who is calling before acting. `N/A` if the change adds no route or handler.

### Input
Input from outside the process is validated before it reaches a query, a shell, a file path or a redirect.

## Next
- `/dx-lesson` — record a finding worth keeping, if one was offered above
```

What each part does:

- **`targets: container`** — this review runs on a change or an effort named by its ID. It's the one required field; a missing or misspelled value makes `/dx-review` refuse the run and name the field.
- **`## Preconditions`** — checked before anything else. Each one names the command to point at when it fails.
- **`## Load`** — what the review reads. Here it is the plan and the diff; a Policy can also pull a shared reference (`invoke dx-references with <topic>`) or gate a load on the change `type`.
- **`## Dimensions`** — one `###` per dimension. Each becomes one line in the report's `## Verdicts`, and the first line sets the tag form findings carry.
- **`## Next`** — extra lines printed after the triage line.

You left out `## Extra checks` and `## On pass` on purpose: a missing optional section means that step does nothing. So this review never changes `change.md`'s status — only the `implementation` Policy's `## On pass` sets `status: reviewed`.

## Step 3 — Run it

```text
/dx-review security oauth-login
```

> **dx-review** resolves `security` to `context/workflow/review-policies/security.md`, reads `targets: container`, and resolves `oauth-login` to `context/changes/oauth-login/`. Both preconditions hold — there is a `plan.md`, and the change is `reviewed`. It loads the plan and the diff, plus `report-template.md` and the glossary, which it always reads. Then it fans out subagents over your three dimensions and writes `context/changes/oauth-login/reviews/security.md`:
>
> ```markdown
> # Review: security — oauth-login
>
> ## Verdicts
> - Secrets: PASS
> - AuthZ: PASS
> - Input: WARNING
>
> ## Findings
>
> ### F1 — `returnTo` redirect target is not checked against an allow-list [Input: Blocker]
> - **Location:** routes/auth/google/start.ts:12
> - **Detail:** The start route stores `req.query.returnTo` and the callback redirects to it unchanged.
> - **Why it matters:** Any site can send a user through Google sign-in and land them on an attacker's page — an open redirect.
> - **Fix:** Accept only relative paths, and fall back to `/` otherwise.
> - **Resolution:** PENDING
> ```
>
> It prints the verdicts and the finding, then:
>
> ```text
> Review written: context/changes/oauth-login/reviews/security.md
> Next: /dx-review-triage oauth-login security   — triage findings and apply fixes
>   or: /dx-lesson — record a finding worth keeping, if one was offered above
> ```

Notice the last line: that is your Policy's `## Next`, printed after the triage line every review gets. The `implementation` report from the earlier tutorial is untouched — each Policy writes its own `reviews/<policy-id>.md`, so the two sit side by side.

## Step 4 — Triage the finding

Triage works the same for every Policy. You give it the change ID and the policy ID:

```text
/dx-review-triage oauth-login security
```

> **dx-review-triage** opens `reviews/security.md`, stops at F1 (the first `PENDING` finding), loads `start.ts` from its Location, and offers Fix now / Fix differently / Skip / Accept risk / Record as lesson.
>
> **You:** Fix now
>
> It shows the edit, applies it on your confirm, and — because the fix touched a file outside `context/` — commits it as `fix(oauth-login): returnTo redirect target is not checked against an allow-list (review)`. It rewrites F1 to `Resolution: FIXED` and prints:
>
> ```text
> Triaged security.md: 1 fixed, 0 skipped, 0 accepted, 0 dismissed
> Next: /dx-review security oauth-login   — re-review after fixes
>   or: /dx-lesson — record a finding worth keeping, if one was offered above
> ```

## Step 5 — See the guardrails

Two quick runs show how `/dx-review` protects a Policy from being run the wrong way. First, leave out the change:

```text
/dx-review security
```

> **dx-review** refuses: the `security` Policy accepts `targets: container`, and no change or effort was named.

Then mistype the ID:

```text
/dx-review secruity oauth-login
```

> **dx-review** refuses: there is no `secruity` Policy. It lists the available IDs — `implementation`, `security`.

Neither run wrote anything. A run you want to narrow rather than refuse takes a custom instruction after the change ID, as in `/dx-review security oauth-login only the callback route`. An instruction never skips a precondition, and a dimension it leaves unchecked is reported `N/A`.

## What you built

- `context/workflow/review-policies/security.md` — a Policy with three dimensions, run as `/dx-review security <container-id>`.
- `context/changes/oauth-login/reviews/security.md` — its report, with F1 `FIXED`, next to the `implementation` report.
- One commit, `fix(oauth-login): returnTo redirect target is not checked against an allow-list (review)`.

The Policy is yours: edit it whenever your security bar changes, and the next run follows the new text. `/dx-init` never overwrites it.

## Where to next

- [Policy-driven review](../explanation/policy-driven-review.md) — why the review criteria live in a file you own, and what that trades away.
- [Build standards](./build-standards.md) — when a security finding keeps coming back, it belongs in a standard that every plan matches.

## Related

- [Review and triage](./review-and-triage.md) — the built-in `implementation` review and the triage loop, step by step.
- [Skills reference](../reference/skills.md) — `/dx-review`, `/dx-review-triage` and `/dx-init`, with exact reads, writes and `Next:` lines.
- [Directory layout](../explanation/directory-layout.md) — where `context/workflow/` sits among the other folders.
