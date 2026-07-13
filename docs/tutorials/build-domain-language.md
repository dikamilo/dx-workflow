# Build and maintain your domain language

In this tutorial you will seed your project's glossary from a brownfield codebase, then keep it sharp
while you work. By the end you will have real domain terms written into `context/foundation/glossary.md`
by a deliberate extraction pass, and you will have watched the glossary sharpen itself mid-task the
moment a vague term shows up. No prior dx- experience needed.

The glossary is the project's **ubiquitous language** — the agreed names for the concepts your domain
actually uses. Every dx- skill *reads* it for naming (a one-line habit that cuts verbosity and stops
plans, code, and reviews from drifting into three different words for one thing). Only two skills ever
*write* it: `/dx-domain-discover` seeds it, and `/dx-domain` sharpens it. For how the glossary sits
alongside standards and lessons, see [the knowledge layer](../explanation/knowledge-layer.md).

## Prerequisites

- The dx- skills installed in Claude Code — see [the skills reference](../reference/skills.md) for the
  full list.
- A project with real code to mine. This tutorial assumes a brownfield repo (the examples use `payments`
  and `checkout` modules), but the discipline works on any codebase.
- [`/dx-init` already run](initialize-a-project.md), so `context/foundation/glossary.md` exists as a
  header-only file waiting to be filled. `/dx-domain-discover` refuses to run without it.

## Step 1 — Seed the glossary from a module with `/dx-domain-discover`

Point the extraction pass at one module. Scoping keeps the sweep focused and lets you grow the glossary
one area at a time:

```text
/dx-domain-discover payments
```

> **dx-domain-discover** first reads the current `context/foundation/glossary.md` so it **extends,
> never clobbers** it. Then it spawns read-only `Explore` subagents scoped to the `payments` module and
> harvests candidate terms from three places: **identifiers** (type, class, and enum names, key
> function names), **module and package names** (the boundaries the code already draws), and
> **comments and existing docs** (READMEs, ADRs, doc-comments where terms get defined in prose).
>
> It keeps only terms **specific to your domain** and drops general programming concepts — `cache`,
> `retry`, `handler`, `DTO` are not ubiquitous language, so they never reach the glossary.
>
> It is opinionated. When several names map to one concept it picks a single canonical term and lists
> the confusables under `_Avoid_`. And it **surfaces clashes rather than averaging them** — when one
> word carries two meanings, it stops and asks you to resolve it:
>
> **Clash found.** The code uses `settlement` two ways — in `SettlementBatch` it means the payout to
> the merchant, but in `SettlementService.authorize()` it means the authorization hold. Which is the
> canonical meaning of **Settlement**?
> 1. The transfer of captured funds to the merchant account — the payout **(recommended)**
> 2. The authorization hold placed at checkout
>
> **You:** 1
>
> It records your decision, writes the surviving entries, and prints a short summary — terms added,
> terms already present, clashes resolved.

Open the file it wrote. Each entry is definitional and domain-only — what the term **is**, never how it
is implemented — with confusables parked under `_Avoid_`:

```text
context/foundation/glossary.md
```

> ```markdown
> # Glossary — ubiquitous language for this project
>
> **Settlement**: the transfer of captured funds from the processor to the merchant account.  _Avoid_: Capture (the authorization step, not the payout).
>
> **Capture**: converting an authorization hold into a charge the customer will actually be billed for.  _Avoid_: Settlement (the later payout to the merchant).
>
> **Chargeback**: a forced reversal a cardholder initiates through their bank, distinct from a merchant-initiated refund.  _Avoid_: Refund (voluntary, merchant-initiated).
> ```

Then it stops and prints:

```text
Glossary seeded: foundation/glossary.md
Next: /dx-domain-discover <another-module>   — extend the sweep to another area
  or: /dx-domain                             — keep the glossary sharp as you work
```

dx- skills never auto-chain. The pass did one job — extract `payments` vocabulary — printed its `Next:`
line, and stopped. You decide what runs next.

## Step 2 — Extend the sweep to another module

The seed pass is **re-runnable and incremental**. Run it again against a different module and it reads
the glossary you already have, adds what is new, and leaves existing entries alone:

```text
/dx-domain-discover checkout
```

> **dx-domain-discover** reads the current glossary (your three `payments` terms are already there),
> sweeps the `checkout` module, and appends its new terms — `Cart`, `Basket` (folded into `Cart` under
> `_Avoid_`), `Line Item`. Terms it has seen before are reported as already present, not duplicated.
> Same `Next:` line, same full stop.

Run it once per meaningful area. There is no "finished" state to track — the glossary simply grows as
you cover more of the codebase.

## Step 3 — Keep it sharp mid-work with `/dx-domain`

Extraction gets you a starting vocabulary. Keeping it sharp is a live discipline, and it belongs to
`/dx-domain` — one of only **two model-invoked skills** in the set (the other is `/dx-diagnose`; see
[the skills reference](../reference/skills.md)). Model-invoked means it **auto-fires** — you do not type
it. It interrupts whatever skill is running the instant a domain term gets slippery.

Set the scene. You are mid-interview in a [`/dx-plan` for the `payments-v2` effort](run-an-effort.md),
and you tell the planner: *"When the customer cancels the account, we should refund any open
authorizations."* The word **account** is doing too much work, and the planner's code cancels *Orders*,
not accounts. `/dx-domain` fires:

> **dx-domain** (fires mid-task): "You said 'account' — is that the Customer or the User? Those are
> different things. Give me the concrete case: a customer closes their profile but keeps one order
> in-flight — does that order still settle, or does closing the account cancel it too?"
>
> **You:** The order still settles. "Account" here means the Customer's billing relationship, not their
> login.
>
> **dx-domain** cross-checks the code and pushes back where it disagrees: "Your `AccountService` operates
> on `User` records — login identities — so 'cancel the account' in code today means *deactivate the
> login*, which is the opposite of what you just described. I'll make **Customer** the canonical term for
> the billing relationship and flag **Account** as ambiguous." It writes the resolved entry to the
> glossary and prints:
>
> ```text
> Glossary updated: foundation/glossary.md  (Customer)
> Back to: /dx-plan payments-v2 interview
> ```

Notice what it did **not** do: it did not silently resume the plan. It fired, resolved one term, wrote
it, and **suggested returning** — you decide when to step back into the interview. That hand-back is
deliberate, so a naming fix never quietly hijacks the task it interrupted.

`/dx-domain` fires on exactly three triggers. Learn to recognize them, since the skill is reacting to
your words in real time:

- **Clash** — what you mean contradicts an existing glossary definition. *"The glossary defines
  'cancellation' as voiding an authorization, but you seem to mean refunding a settled charge — which
  is it?"*
- **Fuzzy** — a vague or overloaded term is in play, like the `account` above that might be a Customer
  or a User. It proposes one precise canonical name and makes you commit with a concrete edge case.
- **Resolved** — a term finally gets nailed down during framing, design, or implementation. It captures
  the term immediately, before the moment passes and the precision is lost.

Like every dx- skill it writes only the glossary — never a spec, never an implementation decision (that
would be a lesson). And it never auto-chains.

## Step 4 — See the payoff

You do not need to run anything for this step — it is what the earlier work bought you. Because the
glossary is now populated, every later skill that reads it for naming pulls from the same vocabulary:

- `/dx-plan` writes a plan that says **Settlement** and **Capture** where they belong, instead of
  inventing "payout" and "charge step".
- `/dx-implement` and `/dx-tdd` name types and functions with the canonical terms, so the code matches
  the plan.
- `/dx-impl-review` reads the same glossary and flags naming that drifts from it.

One extraction pass plus a live discipline, and plans, code, and reviews all speak the same language.
That consistency is the whole point — see [the knowledge layer](../explanation/knowledge-layer.md) for
how the glossary feeds these skills alongside standards and lessons.

## What you built

After this session your project has, on disk:

- A populated `context/foundation/glossary.md` — real domain terms harvested from `payments` and
  `checkout`, each an entry in the canonical shape (`**Term**: definition. _Avoid_: confusable.`).
- Every clash resolved by your decision, not guessed — one canonical name per concept, confusables
  parked under `_Avoid_`.
- A live sharpening discipline: `/dx-domain` armed to fire on any **clash**, **fuzzy**, or **resolved**
  term the next time you plan or implement.

## Where to next

- [Build your standards](build-standards.md) — the sibling discovery pass: mine the same codebase for
  the conventions it already follows and fill the `standards/` tree.
- [Ship a change](ship-a-change.md) — take a change through the full lifecycle and watch the glossary
  feed naming in the plan, the code, and the review.

## Related

- [Knowledge layer](../explanation/knowledge-layer.md) — how the glossary sits alongside standards and
  lessons, and why only the two domain skills write it.
- [Skills reference](../reference/skills.md) — `/dx-domain-discover` and `/dx-domain` at a glance, plus
  which skills are model-invoked.
- [Run an effort](run-an-effort.md) — the `payments-v2` planning session where `/dx-domain` fired
  mid-interview.
- [Initialize a project](initialize-a-project.md) — runs `/dx-init`, which seeds the empty glossary this
  tutorial fills.
