# Brainstorm an idea with dx-brainstorm

In this tutorial you will take a raw, unexamined idea — *"we should build a notification center"* — and run
it through `/dx-brainstorm` before anyone has decided it is worth building. You will watch the skill pull
the solution off the idea to find the problem underneath, weigh alternatives against a **priced
do-nothing**, argue against its own emerging conclusion, and finally take one of **four exit ramps**. By the
end you will have seen the idea shrink from a quarter of work to one week's change, and you will have seen
the other three ramps — including *"nothing worth building,"* which is a success. No prior dx- experience is
needed.

The key idea: every other dx- step **converges** — a frame narrows the problem, a plan narrows the
approach. `/dx-brainstorm` is the one step that **diverges** first, because it asks a question the rest of
the workflow assumes has already been answered: *should this exist at all?* Three of its four outcomes
create no work. For why the workflow needs that, see
[divergent and convergent work](../explanation/divergent-vs-convergent.md).

## Prerequisites

- The dx- skills are installed (via `skills.sh`).
- A project opened in Claude Code, with `/dx-init` already run so the `context/` scaffold exists. If not,
  do [initialize a project](./initialize-a-project.md) first — it takes a minute.
- **You, present and answering.** This is the one skill that cannot run unattended: its raw material is
  your appetite and your judgment about what the pain costs. With no one to ask, it stops rather than
  inventing those answers.

A glossary and a `lessons.md` with something in them make the run noticeably better, but neither is
required. If `context/` isn't scaffolded, the skill stops and tells you to run `/dx-init`.

The running example is a small SaaS product whose users are called **Subscribers** in its glossary.

## Step 1 — Bring the idea, not a ticket

Invoke the skill with the idea in whatever shape it arrived in. You do not need to have thought it through
— that is the point.

```text
/dx-brainstorm we should build a notification center
```

> **dx-brainstorm** confirms `context/` is scaffolded, notes there is no container yet (it runs *ahead* of
> `/dx-new`), and says it will look around before it asks you anything.

Nothing is written to disk in this step, or the next three.

## Step 2 — Watch it do its homework first

Before the first question, the skill climbs a fixed ladder of sources and stops as soon as one answers.
The rule it is following: *a question whose answer already sits in the repo is homework, not conversation.*

> **dx-brainstorm** reads, in order:
>
> - `foundation/glossary.md` — the domain word is **Subscriber**, not "user"; it will use that.
> - `foundation/lessons.md` — and finds one that matters: *"Removed in-app toasts (2025-11) — telemetry
>   showed 4% were ever opened. Don't reintroduce a passive in-app surface without evidence people check
>   it."*
> - `context/standards/` — nothing that binds this yet.
> - `context/changes/**` and `context/archive/**` — no prior notification work, open or shipped.
> - the codebase — there is already an `EventLog` table and exactly one transactional email sender.
>
> It reports the lesson back to you rather than quietly obeying it, because it cuts against the idea you
> just brought.

That lesson is why this step matters. A brainstorm that skipped it would have spent your attention
re-discovering something the project already learned and paid for.

## Step 3 — Diverge: the problem without your solution

Now it widens the field. Six moves, and the priced do-nothing is the one people skip.

> **dx-brainstorm** restates the problem with the proposed solution removed:
>
> *"Subscribers miss time-sensitive events and find out too late. 'Notification center' is one mechanism
> for that — let's price a few."*
>
> One number it needs is the one thing the ladder in Step 2 cannot supply, so it asks for it rather than
> assuming it:
>
> **dx-brainstorm:** *"Before I price the alternatives — how often does this actually bite today, and who
> absorbs it? A rough number beats none."*
>
> **You:** support fields about three tickets a week on it, and two churn conversations last quarter
> mentioned it.
>
> Now it puts three genuinely different mechanisms on the table, against the do-nothing it just costed:
>
> | Option | Mechanism | Cost |
> |---|---|---|
> | A. In-app notification center | new inbox surface, read state, per-event preferences | ~1 quarter |
> | B. Email digest | one new template off the existing sender | ~1 week |
> | C. Inline alerts | a banner on the screens where the event matters | ~1 week |
> | D. **Do nothing** | Subscribers keep finding out late | ~3 support tickets/week, absorbed by support; 2 churn conversations last quarter |
>
> And it names the riskiest assumption with the cheapest way to test it:
>
> *"Riskiest assumption: that Subscribers want a new surface to check. The 2025 toast lesson is direct
> evidence against it. Cheapest test — one afternoon reading the support tags on those ~3 tickets/week to
> see which events people actually complain about. That may be the whole answer."*
>
> Then: *"What breaks if this succeeds? A notification center becomes a place every future feature wants
> to post to, and someone owns the noise budget forever."*

Two things to notice. The alternatives differ in **mechanism**, not in size — three variants of the same
inbox would have been a false choice. And the do-nothing is **priced**, not dismissed: option D has a real
number attached, so it can genuinely win. Strawmanning it is the failure mode this step exists to prevent.

Two of the six moves left no trace above. **Refusing vague framing** never had to fire — "notification
center" is at least a concrete mechanism; had you opened with *"improve notifications"*, the skill would
have pushed for an observable difference before pricing anything. And the **bundling test** runs here too;
its consequence only becomes visible in Step 5.

## Step 4 — Converge, and let it argue against itself

The divergent half is over. The skill now runs the same one-question-at-a-time
[interview](../explanation/research-and-frame.md) the rest of the workflow uses — options, a
recommendation, one question at a time.

> **dx-brainstorm** starts with the cheap test it just named, rather than guessing past it:
>
> *"That afternoon of support-tag reading is the cheapest thing on the table and it changes the answer, so
> I'd rather not route around it. Can you check — or do you already know the shape? I'd expect one of:
> (a) a small set of repeat offenders, two or three events; (b) a long tail across many event types;
> (c) essentially one event. **My guess is (a)** — you named two specific events when you described the
> problem."*
>
> **You:** checked — (a). Two events, basically: a failed billing charge, and a finished data export.
>
> **dx-brainstorm:** *"Then what's your appetite here — a week, or a quarter? I'd recommend a week: two
> known events don't justify a new surface."*
>
> **You:** a week. And no new preferences screen.

Before it presents a conclusion, the interview's **adversarial pass** attacks the conclusion it is about to
give you:

> **dx-brainstorm** raises one objection at `Consider`:
>
> *"An inline banner is still a passive in-app surface — arguably the same bet the 2025 toast lesson lost.
> The difference I'm relying on is placement: the banner sits on the screen the Subscriber is already on
> because of that event, rather than a page they'd have to visit. If you don't buy that distinction, the
> honest ramp is the email digest instead."*
>
> **You:** the placement distinction holds — billing failures already send them to the billing page.

It brings the objection back to you as a question instead of resolving it itself. Routing is expensive to
undo once a container exists, so the challenge is cheapest right here.

Then it stops. Not because everything is understood, but because everything that would change *where this
goes* is settled — **routing-sufficiency, not exhaustiveness.** The depth is `/dx-frame`'s and `/dx-plan`'s
job, and they are still ahead.

## Step 5 — The ramp: one shippable unit

It applies the **bundling test** — *would each capability function without the other?* — and answers no: a
banner with no events wired up is nothing, and the events with no surface are nothing. One change, not an
effort.

> **dx-brainstorm** proposes the id `inline-event-alerts` so you can redirect it, writes two files, prints,
> and **stops**:
>
> ```text
> Brainstorm written: context/changes/inline-event-alerts/brainstorm.md
> Next: /dx-frame inline-event-alerts    → /dx-plan inline-event-alerts       (frame optional)
>
> Caveat carried forward: the banner is still a passive in-app surface (2025 toast lesson);
> placement is the distinction being relied on.
> ```

The change record, stamped `type: feature`:

```yaml
---
change_id: inline-event-alerts
title: Inline alerts for failed billing charges and finished exports
type: feature                 # feature | defect | refactor | migration
effort: null
slice: null
status: new
created: 2026-07-28
updated: 2026-07-28
archived_at: null
---
```

And `brainstorm.md` beside it — the artifact no other step in the workflow produces:

```markdown
---
created: 2026-07-28
---

# Brainstorm — inline-event-alerts

## The question
Subscribers miss time-sensitive events and find out too late. "Notification center" was one
proposed mechanism for that, not the problem.

## Alternatives weighed
- **A. In-app notification center** (~1 quarter) — lost. Two known events don't justify a new
  surface, and the 2025 toast lesson is direct evidence Subscribers don't check passive surfaces.
- **B. Email digest** (~1 week) — viable runner-up; reuses the existing sender. Lost on latency:
  a failed charge needs to be seen now, not in the next digest.
- **C. Inline alerts on the two affected screens** (~1 week) — **chosen.** Reaches the Subscriber
  on the screen the event already sends them to.
- **D. Do nothing** — priced at ~3 support tickets/week absorbed by support, plus 2 churn
  conversations last quarter. Lost because the cost is recurring and option C is one week.

## Conclusion & route
One change (`inline-event-alerts`), `type: feature`. Bundling test: no — the banner and the two
event hooks don't function without each other.
Riskiest assumption: that Subscribers want a new surface to check — narrowed by scoping to
screens they already land on. Cheapest test (reading support tags) was run during this
brainstorm and produced the two-event scope.
Standing caveat (`Consider`, from the adversarial pass): this is still a passive in-app surface;
placement is the distinction being relied on. Worth checking against telemetry after ship.
What breaks if it succeeds: nothing owns a noise budget yet — deliberately deferred by keeping
this to two events rather than a general posting surface.

## Resolved unknowns
| Question | Answer |
|---|---|
| Who is affected? | Subscribers, not admins |
| What does the pain cost today? | ~3 support tickets/week; 2 churn conversations last quarter |
| Which events actually matter? | Two — failed billing charge, finished data export (support tags) |
| Appetite? | One week, not a quarter |
| New delivery channel? | No — reuse the existing transactional sender if email is ever needed |
| Per-event preferences? | No |

## Not doing
- An inbox surface, read state, or a notification history.
- Per-event preferences or a preferences screen.
- A second delivery channel.
- A general-purpose posting API other features can write to.
```

Note the shape of that file. `## Resolved unknowns` is its **self-check** — an empty table would mean
nothing was actually settled and the ramp wasn't earned. And it records what *lost*, which is the part a
reader six months from now cannot reconstruct from the code.

The skill printed a `Next:` line and **stopped**. It did not run `/dx-frame` for you, and it did not write
a `plan.md`. No dx- skill auto-chains.

## Step 6 — See what it bought you downstream

`brainstorm.md` is read as **settled context** by `/dx-frame`, `/dx-plan`, and `/dx-roadmap` — not as a
proposal to relitigate. Run either next step and you can watch it pay off:

- **`/dx-frame inline-event-alerts`** *deepens* the conclusion instead of colliding with it. It inherits
  the alternatives table and the six resolved unknowns, so its interview goes to the problem statement
  rather than re-asking who is affected and what the appetite is. Running a frame on top of a brainstorm is
  wanted, not redundant.
- **`/dx-plan inline-event-alerts`** skips what the brainstorm settled and turns the standing caveat into
  something to plan against — the telemetry check the adversarial pass asked for becomes a real phase
  rather than a note in prose.

Everything from here is the **normal change lifecycle** — nothing about a brainstormed change is special
downstream. Follow [ship a change](./ship-a-change.md).

---

## The other three ramps

Only one of the four outcomes created work. Here are the rest, each a real success.

### Nothing worth building — the do-nothing wins

This is the ramp that makes the other three trustworthy. A skill that could only ever hand work forward
would reliably hand work forward, and its scrutiny would be theatre.

> **You:** `/dx-brainstorm we should migrate the test suite to a faster runner`
>
> **dx-brainstorm** prices the do-nothing properly instead of assuming the migration is obviously good.
> The suite takes 90 seconds and runs maybe 30 times a week — about 45 minutes of suite time a week,
> spread across the team, and **none of it blocking**, since nobody sits watching it. The migration
> touches every test file and two CI jobs: ~3 weeks.
>
> *"So the do-nothing costs roughly 45 minutes a week of machine time that nobody is waiting on. The
> alternative costs three weeks and briefly puts the project's one safety net in play. I don't think this
> is worth building — and the number that would change my mind is the suite crossing a few minutes, or
> anyone starting to block on it, not the new runner's benchmark chart."*
>
> **You:** agreed, drop it.
>
> It writes **nothing** — no container, no `brainstorm.md` — and prints just the one-line conclusion, with
> deliberately **no `Next:` line**, because there is no next step:
>
> ```text
> Nothing to build: the do-nothing costs ~45 min/week of unwatched machine time; the migration costs
> ~3 weeks and touches every test file.
> ```
>
> Then, because the rejection is load-bearing rather than a shrug, it offers:
>
> ```text
> /dx-lesson                (don't migrate the runner until suite duration crosses a few minutes)
> ```

Running `/dx-lesson` is the *one* durable trace this outcome can leave. It matters because Step 2 reads
`foundation/lessons.md` at the start of every future run — so the next person who brings this idea gets the
reasoning handed to them instead of re-deriving it. There is deliberately no backlog file and no brainstorm
register to park it in; see [the knowledge layer](../explanation/knowledge-layer.md).

### Already covered — cite it and stop

Sometimes Step 2's sweep of `context/changes/**` and `context/archive/**` ends the conversation before it
starts.

> **You:** `/dx-brainstorm can we let Subscribers export their data as CSV?`
>
> **dx-brainstorm** finds `context/archive/2026-05-12-csv-export/` and stops:
>
> ```text
> Covered by context/archive/2026-05-12-csv-export/change.md   (status: archived)
> ```

It writes nothing. Note the tie-breaker at work: already-shipped is **ramp 2, never ramp 1** — "nothing
worth building" would wrongly imply the idea was bad.

### Two or more capabilities — an effort

When the bundling test comes back **yes**, the conclusion is bigger than one change.

> **You:** `/dx-brainstorm self-serve onboarding — new teams shouldn't need us to set them up`
>
> After diverging, **dx-brainstorm** applies the bundling test and gets a clean yes: sign-up plus workspace
> provisioning is useful with humans still doing the invite step, and a guided first-run checklist is
> useful for teams we set up by hand. *Would each function without the other? Yes.* Two independently
> shippable capabilities.
>
> ```text
> Brainstorm written: context/efforts/self-serve-onboarding/brainstorm.md
> Next: /dx-frame self-serve-onboarding    → /dx-roadmap self-serve-onboarding    (frame optional)
> ```

It writes `effort.md` (which carries **no** `type` — that is a change-level field) plus `brainstorm.md`, and
nothing else. In particular it writes **no `roadmap.md`**: cutting slices is `/dx-roadmap`'s job, and
spawning child changes is `/dx-new`'s. Because the bundling test already decided change-vs-effort, that call
is **handed over** rather than re-derived downstream. See [run an effort](./run-an-effort.md) for what
happens next.

---

## What you built

Which artifacts exist depends on the ramp — and three of four leave the repo untouched:

- **One shippable unit:** `context/changes/inline-event-alerts/change.md` at `status: new`, plus
  `brainstorm.md` carrying the alternatives, the priced do-nothing, six resolved unknowns, one standing
  caveat, and four things explicitly not being done. Ready for `/dx-frame` or `/dx-plan`.
- **An effort:** `context/efforts/<id>/effort.md` plus its `brainstorm.md`. No roadmap yet.
- **Nothing worth building:** nothing on disk — optionally one entry in `foundation/lessons.md`.
- **Already covered:** nothing on disk; you got a path.

The conversation itself is gone. Only what routed forward, or what you recorded as a lesson, persists.

The most useful thing to take away is what the first ramp actually did: you arrived asking for a quarter's
notification center and left with a one-week change plus a written record of the quarter you did not spend.

## Where to next

- [Ship a change](./ship-a-change.md) — take `inline-event-alerts` through plan, implement, review, and
  archive.
- [Use frame and research](./frame-and-research.md) — run `/dx-frame` on top of the brainstorm and watch it
  deepen the conclusion instead of re-asking it.
- [Run a bigger effort](./run-an-effort.md) — what the effort ramp hands to `/dx-roadmap`.

## Related

- [Divergent and convergent work](../explanation/divergent-vs-convergent.md) — why the workflow needs one
  divergent phase, and why `brainstorm.md` is its own artifact rather than a `frame.md`.
- [Efforts and changes](../explanation/efforts-and-changes.md) — the two levels the bundling test picks
  between.
- [The knowledge layer](../explanation/knowledge-layer.md) — how a load-bearing rejection survives as a
  lesson when no container does.
- [Diagnose a bug](./diagnose-a-bug.md) and
  [find refactoring opportunities](./find-refactors.md) — the other two discovery entries, both of which
  always have a finding to promote.
- [Skills reference](../reference/skills.md) — `/dx-brainstorm`'s exact reads, writes, and printed
  outcomes.
