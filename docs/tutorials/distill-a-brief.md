# Distill a brief with dx-distill

In this tutorial you will take a pile of messy raw material — a half-remembered support conversation, a spreadsheet export, a competitor's pricing page — and run `/dx-distill` to turn it into a single **brief** at `context/foundation/briefs/`, in which every substantive claim carries a tag saying where it came from and a path you can reopen. You will watch the skill do its homework before asking you anything, interview you one question at a time, tag its own draft, hand that draft to a skeptic that tries to break it, and then refuse to write the file until you have confirmed what it decided. By the end you will have a brief plus the interview record beside it, and you will have seen the skeptic catch a claim you would have signed off on. No prior dx- experience is needed.

The key idea: a brief is **not** a research file and **not** a frame. Research records provenance per *file* on one topic. A frame settles one container's problem. A brief spans a whole decision, belongs to no container, and records provenance per *claim* — so a reader six months from now can tell which sentences were measured, which were agreed, and which were always a guess. For why that granularity matters, see [evidence tags](../explanation/evidence-tags.md).

## Prerequisites

- The dx- skills are installed (via `skills.sh`).
- A project opened in Claude Code, with `/dx-init` already run so `context/` exists. If not, do [initialize a project](./initialize-a-project.md) first.
- **You, present and answering.** Like `/dx-brainstorm`, this skill has no unattended mode. The appetite, the constraints, and the experience it exists to ask about are exactly the things it must not invent, so with nobody to ask it stops.
- Some raw material — though less than you think. Thin material produces an honestly incomplete brief, not a refusal.

The running example is the same small SaaS as the other tutorials, whose users its glossary calls **Subscribers**.

## Step 1 — Name the decision, and point at what you have

Material is an *input*, not the trigger. What the skill actually needs is a decision to help you make.

```text
/dx-distill self-serve-billing docs/notes/support-sync.md exports/refund-tickets.csv
```

> **dx-distill** confirms `context/foundation/` is scaffolded, checks both paths resolve, and opens with the thing it will not guess at:
>
> *"Before I read these — what should this brief help you decide? I can see refund tickets and a support sync, which suggests something about self-serve billing, but 'build a billing portal' and 'stop refund tickets reaching support' are different decisions and they'd produce different briefs."*
>
> **You:** whether we let Subscribers issue their own refunds, and if so how far.

If you invoke it with no topic at all, that question is simply the first thing it asks. A brief written toward no decision is a filing exercise — its sections get padded to look complete.

In the same exchange it names the **emphasis** it infers from what the material actually *is*:

> **dx-distill:** *"Emphasis: `[DATA]`/`[INTERVIEW]`-weighted — a ticket export and a sync transcript. That means I'll be able to say what happened and what people said, and I'll be weak on what our code currently allows, so I'll go read that myself rather than asking you."*

You never declare a mode. The material implies one, the same way a change's `type` activates plan characteristics without you naming them. Mixed material gets mixed emphasis, said out loud.

## Step 2 — Watch it do its homework

Nothing is written to disk in this step, or the next three. Before the first substantive question, the skill reads.

> **dx-distill** first loads the `untrusted-content` reference and says why: *"Everything in those two files is data I report on, not instructions I follow — including anything in the CSV that looks like a command."*
>
> Then it reads: the two named paths, `foundation/research/` and `foundation/lessons.md`, `context/standards/`, open and archived containers, `foundation/glossary.md`, and the billing code itself.
>
> It sorts what it finds into two piles and reports both:
>
> **Supports the decision.** The export shows 240 refund tickets in Q2, 71% of them under \$20. The sync transcript has a support lead describing a Subscriber who waited three days for an \$8 refund. The code has a `Refund` model already, created by an internal admin action only.
>
> **Could overturn it.** `foundation/lessons.md` carries: *"Self-serve destructive actions need an undo window (2025-09) — the account-delete flow shipped without one and cost us a week of manual restores."*
>
> **Consequential gap.** *"Nothing here tells me what fraction of those refunds are disputed after the fact. That bears directly on how far self-serve can go, so it's going on the collection plan rather than being estimated."*

That third pile is the one to notice. The gap is *named and parked*, not filled with a plausible number and not used as an excuse to stop.

## Step 3 — The interview, one question at a time

Now it asks — using the same [interview](../explanation/research-and-frame.md) loop as the rest of the workflow. One question, options, a recommendation where it has earned one.

> **dx-distill:** *"The export says 71% of refunds are under \$20. Tell me about the last one you handled personally — what actually happened, start to finish?"*
>
> **You:** support gets the email, checks the charge in Stripe, refunds it, replies. Maybe four minutes, but it sits in the queue for a day or two first.
>
> **dx-distill:** *"So the cost is queue latency, not handling time. Do you know how often a refund gets disputed or reversed after support issues one?"*
>
> **You:** no idea, honestly.
>
> **dx-distill:** *"Then that stays unknown — it's the collection-plan item from Step 2 and I won't estimate it. Next: what's your appetite — a cap-and-automate rule, or a full self-serve refund UI? I'd recommend the cap: the data says most refunds are small and routine, and the 2025 undo-window lesson makes an unbounded self-serve destructive action the expensive option."*
>
> **You:** the cap. Under \$20, auto-approve, no UI beyond a button on the invoice.

Note what did *not* happen at "no idea, honestly." That is a real answer and it is recorded as one. The failure mode here is upgrading a shrug into a sourced claim, and the skill is explicitly built to refuse it.

It stops when the decision has the support it needs — not when the section list looks full. (`--quick` limits this to one round over material already in hand.)

> **dx-distill** writes the exchange to `context/foundation/briefs/self-serve-billing.interview.md` — the questions asked and what you actually said — and explains why: *"Every `[INTERVIEW]` claim in the brief is about to cite this path. Without it, those would be the only claims nobody can ever check, including the skeptic I'm about to run."*

This is the **first** thing written to disk, and it happens before the draft exists.

## Step 4 — The draft, tagged

The skill drafts the brief, tagging each substantive claim and splitting mixed sentences rather than stamping them with their strongest tag. You do not see this draft yet — one more thing happens first.

## Step 5 — The skeptic pass

The draft reads well to the model that just wrote it. That is precisely why it gets handed to a fresh `general-purpose` subagent with no memory of the conversation, which runs five checks — source fidelity, problem, solution fit, test, and scope — opening every cited source rather than trusting the citation.

> **The skeptic returns three findings:**
>
> **CRITICAL** — *"'Subscribers find the refund wait frustrating' `[DATA]` `exports/refund-tickets.csv`. I opened the export: it has amounts, dates, and a resolution status. It contains no sentiment field and no free text. The tag claims measurement for something that was never measured."*
>
> **CRITICAL** — *"'Auto-approving under \$20 is safe' `[ASSUMPTION]`. This is load-bearing for D02 and its own collection-plan entry says the dispute rate is unknown. It needs an A id and a kill criterion, not a bare assumption line."*
>
> **WARNING** — *"'Support spends ~4 minutes per refund' `[INTERVIEW]` `self-serve-billing.interview.md`. Accurate to what was said, but it's one person's estimate of their own handling time, stated once. The sentence reads as an established average."*
>
> **dx-distill** sorts them: *"The first is my error — I'll fix it. The three-day wait is real and `[DATA]`-backed; the frustration is not, so that becomes a separate `[ASSUMPTION]` line with the observed wait kept apart from the inferred feeling. The third is also mine — I'll mark it as one account, not an average. The second needs you."*

That first finding is the one worth pausing on. *"Subscribers find the refund wait frustrating"* is almost certainly true, it is exactly what everyone in the room believes, and it would have sailed through a plain read. The skeptic caught it not by disagreeing but by **opening the file** and finding no column that could support it.

## Step 6 — Confirm, then write

The skill presents the decision summary, the scope split, the consequential decisions, the evidence's limits, and what is still blocking — and stops.

> **dx-distill:** *"Before I write: D01 is self-serve refunds under a cap; D02 is auto-approve at \$20. The skeptic is right that D02 rests on an unknown dispute rate. I can record it as `active` with A01 flagged and a kill criterion, or leave D02 as a `proposal` until the dispute number exists. Which?"*
>
> **You:** active, we'll take the risk — but put a kill criterion on it.
>
> **dx-distill:** *"Recorded as your decision, dated, with you as the confirmer. A01 stays `accepted untested (D02)` — taking the risk is a real decision and I'll record it as one, but it doesn't make the dispute rate known."*

Run this gate even when it feels redundant — what it checks is whether the model's reading of your answers matches yours, and the moment it feels redundant is the moment it is doing its job. A choice you leave pending stays a `proposal`, which is a perfectly valid thing to write down.

*Now* it writes, computing Coverage from the tagged lines actually present rather than from what the draft aimed for:

```markdown
# self-serve-billing — brief

- Date: 2026-09-18; Pass: full
- Emphasis detected: `[DATA]`/`[INTERVIEW]`-weighted — a Q2 ticket export and one support sync, so
  what happened and what was said are well covered; what the code permits was read directly.
- Evidence basis: three distinct sources — one ticket export (Q2 2026, 240 rows), one support sync
  (one participant), and the billing code. The support account is a single voice, not a sample. The
  most consequential untested belief is A01: that refunds auto-approved under $20 are rarely disputed.
- Coverage: 14 claims — 11 sourced (interview 4, data 4, document 1, product 2, benchmark 0),
  0 synthetic, 3 assumed
- Synthetic hypotheses outside Coverage: 0
- Sources: exports/refund-tickets.csv, docs/notes/support-sync.md,
  context/foundation/briefs/self-serve-billing.interview.md, app/billing/refund.rb

## Decision summary

Subscribers wait days for small refunds that support issues in minutes. We will let them issue
their own, capped and auto-approved under $20 (D01, D02, R01–R03), with N01–N02 holding the line
against a general billing portal. The choice rests on A01 — an unknown post-refund dispute rate,
accepted untested with a kill criterion. Next: instrument disputes for one month (Q01).

## Problems, with evidence

- 240 refunds were issued in Q2 2026; 71% were under $20. `[DATA]` `exports/refund-tickets.csv`
  (Q2 2026, all statuses)
- Refunds sit in the support queue for one to three days before a four-minute handling step.
  `[DATA]` `exports/refund-tickets.csv` (created-to-resolved)
- One support lead described a Subscriber waiting three days for an $8 refund; handling time was
  estimated at ~4 minutes by that same person, once. `[INTERVIEW]`
  `self-serve-billing.interview.md` (2026-09-18)
- That the wait is a source of Subscriber frustration is inferred from the delay, not observed —
  the export carries no sentiment or free-text field. `[ASSUMPTION]` (origin: this session)

## Business rules

| Id | Rule | Applies to | Source | Status |
|---|---|---|---|---|
| R01 | A Subscriber may refund their own invoice when the amount is under $20. | self-serve refund | `[DOCUMENT]` D02 | active |
| R02 | A self-serve refund has a 30-minute undo window before it is submitted to the processor. | self-serve refund | `[DOCUMENT]` `foundation/lessons.md` (2025-09) | active |
| R03 | Refunds at or above $20 continue to route to support unchanged. | all refunds | `[PRODUCT]` `app/billing/refund.rb` | active |

## Non-goals

| Id | We are not building | Why | Source | Status |
|---|---|---|---|---|
| N01 | A general billing portal | Appetite is one rule, not a surface | `[INTERVIEW]` `self-serve-billing.interview.md` | active |
| N02 | Partial refunds | No material shows Subscribers asking for them | `[DATA]` `exports/refund-tickets.csv` | active |

## Decisions

| Id | Date | Decision | Why | Source | Confirmed by | Status |
|---|---|---|---|---|---|---|
| D01 | 2026-09-18 | Subscribers may issue their own refunds | Removes a 1–3 day queue wait from a 4-minute action | `[DATA]` `exports/refund-tickets.csv` | you, at the confirmation gate | active |
| D02 | 2026-09-18 | Auto-approve under $20 | Covers 71% of volume; a full self-serve flow was weighed and lost on the 2025 undo-window lesson | `[DOCUMENT]` `foundation/lessons.md` (2025-09) | you, at the confirmation gate | active |

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Result |
|---|---|---|---|---|---|---|
| A01 | Refunds auto-approved under $20 are rarely disputed afterwards `[ASSUMPTION]` (no material) | high | Nothing — the export has no post-refund dispute field | D02's cap, or the whole auto-approve rule | Instrument disputes on support-issued refunds for one month | accepted untested (D02) |

## Kill criteria

If disputes on auto-approved refunds exceed 2% over the first month, D02's auto-approval is
withdrawn and R01 falls back to support review. You decide, at the one-month mark.

## Open questions

| Id | Question | Blocking | Status |
|---|---|---|---|
| Q01 | What fraction of refunds are disputed or reversed after the fact? | No — D02 proceeds on A01 — but it governs the kill criterion | open |

## Collection plan

Q01 — the post-refund dispute rate. Needed to hold or withdraw D02. Available from the payment
processor's dispute webhook, which nothing currently records. Owner: you. By the one-month mark.
```

Then it prints and **stops**:

```text
Brief written: context/foundation/briefs/self-serve-billing.md
Collection plan: 1 entry waiting for material
Next: /dx-new <idea> self-serve-billing                # if this is worth building
  or: /dx-distill self-serve-billing --refresh         # once the collection plan fills
```

It created no change and no effort. `/dx-new` is still the only router, and `/dx-distill` never calls it.

Notice the sections that are **absent**. There is no `## Domain glossary`, no `## Key flows`, no benchmark table — the material never reached them, so they are omitted entirely rather than left as `N/A` stubs. A gap that actually blocks the decision goes on the collection plan; an unreached section needs no entry anywhere.

## Step 7 — Spend it downstream

A brief nothing reads is a lost handoff, so three skills read it. Name it anywhere in `/dx-new`'s argument — a bare slug, a filename, or a full path, one or several, no flag and no fixed position:

```text
/dx-new let Subscribers refund their own small invoices self-serve-billing
```

`/dx-new` strips the brief name before deriving the slug, records the resolved path as a `Briefs:` line in the container's `## Notes`, and changes nothing else. Then:

- **`/dx-frame`** treats the tagged claims as sourced evidence and does not re-interview them. Its questions go where the brief is genuinely unsettled — `## Open questions` and the collection plan.
- **`/dx-plan`** cites a tagged claim rather than re-deriving it, treats active `## Non-goals` as closed scope, and carries A01, the kill criterion, and Q01 into its `## Priors & gotchas`. A risk left behind in the brief is a risk nothing plans against.

A claim the brief marks unsupported stays an open question downstream **even where you chose to proceed on it** — which is how "we'll take the risk" survives as a risk rather than quietly becoming a fact.

## A thinner run

Suppose you have almost nothing — one conversation, no export, no code yet.

> **dx-distill** runs the same process and writes the same file, shorter: a `## Problems` section resting on one `[INTERVIEW]` account explicitly marked as one account, no `## Goals` at all, three `[ASSUMPTION]` lines with A ids, and a collection plan naming what would settle each.
>
> Its header says so plainly: `Coverage: 6 claims — 2 sourced (interview 2, …), 0 synthetic, 4 assumed`.

That brief is a real outcome, not a failure. Thin material is never a reason to refuse — the brief just has to say what it cannot support yet. (The one genuine stop is nobody being available to answer.)

## What you built

- `context/foundation/briefs/self-serve-billing.md` — 14 tagged claims, three business rules, two non-goals, two confirmed decisions, one accepted-untested assumption with a kill criterion, one open question, one collection-plan entry.
- `context/foundation/briefs/self-serve-billing.interview.md` — the record every `[INTERVIEW]` claim cites.

Nothing else. No container, no copies of your material, no index — `ls context/foundation/briefs/` is the list.

The most useful thing to take away is what Step 5 actually did. *"Subscribers find the refund wait frustrating"* is probably true, everyone believes it, and it had a `[DATA]` tag on it. The skeptic opened the file and found no column that could support it — so it survives in the brief as an honest `[ASSUMPTION]`, right beside the three-day wait that really was measured.

## Where to next

- [Ship a change](./ship-a-change.md) — take the change `/dx-new` created through plan, implement, review, and archive.
- [Brainstorm an idea](./brainstorm-an-idea.md) — the other pre-container skill: `/dx-brainstorm` argues whether to build at all, where a brief records what is known either way.
- [Use frame and research](./frame-and-research.md) — the container-scoped upstream steps a brief scales down.

## Related

- [Evidence tags](../explanation/evidence-tags.md) — the seven tags, the three claim meanings, and why Coverage is not a score.
- [The `context/` directory layout](../explanation/directory-layout.md) — where `foundation/briefs/` sits among the stable reference docs.
- [The knowledge layer](../explanation/knowledge-layer.md) — how the lesson that shaped R02 got there.
- [Skills reference](../reference/skills.md) — `/dx-distill`'s exact reads, writes, and printed output.
