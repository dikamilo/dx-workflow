# Divergent and convergent work

Every other step in the dx- workflow **converges**. `/dx-frame` narrows a fuzzy problem to one sentence.
`/dx-plan` narrows a settled problem to one approach with phases. `/dx-implement` narrows a plan to code.
Each step takes something open and closes it, and each assumes the step before it was worth taking.

That assumption is the gap `/dx-brainstorm` fills. Before the funnel starts, someone has to ask whether
the idea belongs in the funnel at all — and that question is **divergent**: it needs more options on the
table, not fewer. This page explains why the workflow needs one divergent phase, why "decide not to build
it" is a first-class outcome rather than a wasted session, and why the brainstorm gets its own artifact
instead of reusing `frame.md`.

## The failure mode: a perfect plan for work nobody needed

dx- already guards against building the *wrong solution* — that is what the interview is for. It did not,
until now, guard against building a **thing that shouldn't exist**. Nothing in the lifecycle asked "is this
worth doing?", because `/dx-new` starts by creating a container: the moment you type it, the answer is
already yes.

That is a real cost, and it compounds in the wrong direction. A container is cheap to create and
expensive to abandon — once `change.md` exists, the work has a name, a status, and a slot in `ls
context/changes/`, and every subsequent skill is built to move it *forward*. There is no step whose job is
to conclude "actually, no."

The cure is not another gate inside the lifecycle. It is one step that runs **before** the lifecycle, whose
legitimate outcomes include producing nothing at all.

## Diverging first: what the skill actually widens

`/dx-brainstorm` deliberately resists the shape the idea arrives in. Ideas show up pre-solved — "we should
add a caching layer" is a solution wearing a problem's clothes — so the skill pulls the solution off and
looks at what is underneath:

- **Restate the problem without the proposed solution.** The problem underneath is usually wider or
  narrower than the thing you asked for.
- **At least two genuinely different alternatives.** Different *mechanism*, not the same idea at two sizes.
  Two variants of the same approach is a false choice.
- **A priced do-nothing.** What does the pain cost per week, and who absorbs it? This is the option that
  makes the others comparable — and **strawmanning it is the failure mode**, because a do-nothing nobody
  argued for cannot win.
- **The riskiest assumption, and the cheapest test of it.** Sometimes a one-day spike settles the whole
  question, and *that spike* is the work — not the thing you were about to commit a quarter to.
- **"What breaks if this succeeds?"** Success has costs too, and they are easiest to see before you start.

Only then does it converge, running the same one-question-at-a-time [interview](research-and-frame.md) the
rest of the workflow uses — including the interview's adversarial pass, which argues against the emerging
conclusion *before* it is presented to you. Routing is hard to reverse once a container exists, so the
objection is cheapest here.

Crucially, it stops at **routing-sufficiency, not exhaustiveness**. The bar is "every unknown that would
change *where this goes* is resolved" — not "everything is understood." Deeper understanding is what
`/dx-frame` and `/dx-plan` are for, and they are still ahead.

## Why "build nothing" is a success

Three of the four ways a brainstorm can end produce no container, and only one produces a plan-able unit:

| Outcome | What lands on disk |
|---|---|
| Nothing worth building — the do-nothing won | nothing; no `Next:` line either |
| Already covered by an open or archived container | nothing; it cites the path |
| One shippable unit | `context/changes/<id>/change.md` + `brainstorm.md` |
| Two or more independently shippable capabilities | `context/efforts/<id>/effort.md` + `brainstorm.md` |

A tool that only ever hands work forward is a tool that manufactures work. If the sole way to finish a
brainstorm were to create a container, the skill would reliably create one — and its scrutiny would be
theatre. So the terminal outcomes are named as **ramps, not failures**, and the skill is explicitly told
not to manufacture a handoff to feel productive.

This is also why there is no fifth "park it for later" ramp. A parking lot is a backlog, a backlog is a
register, and a register would need maintaining — which fights the workflow's
[derive-don't-maintain](directory-layout.md) grain and would fill up with entries nobody revisits. If a
rejection is load-bearing — *we decided against this, for a reason that will still apply next quarter* —
it becomes a [lesson](knowledge-layer.md), which future work actually reads. If it isn't load-bearing, it
leaves no trace, and that is correct.

## Why the brainstorm gets its own artifact

The obvious economy would be to write the conclusion into `frame.md` and add no new artifact kind. It was
considered and rejected, for two reasons worth knowing as a user.

**It would collide with `/dx-frame`.** Running `/dx-frame` *after* a brainstorm is wanted behaviour — the
brainstorm settles whether and roughly what, the frame goes deep on the problem statement. If the
brainstorm's conclusion lived in `frame.md`, then `/dx-frame` would either refuse (a `frame.md` already
exists) or overwrite the conclusion it should have been building on. A separate file makes the
deepen-don't-collide relationship structurally possible instead of merely intended.

**A brainstorm is a different kind of thing.** The workflow already separates its upstream artifacts by
what question they answer, and a brainstorm answers a fourth one:

| Artifact | Answers | Carries |
|---|---|---|
| `research/<topic>.md` | *What is true?* | investigation with provenance — sources, `file:line`, a fetch date |
| `diagnosis.md` | *Why is this broken?* | a reproducing loop, ranked hypotheses, the confirmed cause |
| `frame.md` | *What is the right problem?* | the real problem, who it affects, framings weighed, out of scope |
| `brainstorm.md` | *Is this worth building at all?* | alternatives weighed, the priced do-nothing and why it lost, the routing conclusion, what is explicitly not being done |

Nothing else has a home for *what was rejected and why the do-nothing lost*. That is the part a cold
reader six months later cannot reconstruct from the code, and the part that stops the same idea being
relitigated from scratch.

`brainstorm.md` therefore sits at the container root beside `frame.md` and `diagnosis.md`, and
`/dx-frame`, `/dx-plan`, and `/dx-roadmap` all read it as **settled context** — its resolved-unknowns table
is a list of questions they will not ask you again, and its "not doing" list is scope they will not reopen
without a new reason. The cost of a new artifact kind is that each of those readers had to be taught about
it individually; the benefit is that they can then trust it rather than re-deriving it.

## One skill that routes to either level

`/dx-brainstorm` is the only discovery entry that can land at **either** container level, because the
question it asks is the one that decides the level. Its **bundling test** — *would each capability function
without the other?* — is exactly the change-vs-effort distinction:

- **No** — the pieces only make sense together → one change.
- **Yes** — two or more things ship independently → an effort, whose slices `/dx-roadmap` will cut.

Because that test has already run, the level is **handed over** rather than re-derived: `/dx-brainstorm`
writes the identity file itself, and `/dx-new` is not asked to re-litigate a call the brainstorm already
made with more context than a one-line argument could carry. See
[efforts and changes](efforts-and-changes.md) for the two levels themselves.

What it does *not* do is keep going. Writing the container is the whole deliverable — it never cuts slices
(that is `/dx-roadmap`'s job) and never spawns child changes (`/dx-new`'s). Like every dx- skill, it prints
the next command and stops.

## Trade-offs and what was deliberately left out

**It is optional, and skipping it is normal.** Most work does not need a divergent phase. If you already
know the thing is worth building, `/dx-new` is the right front door and always was. The guard against
skipping it too eagerly is small but pointed: *"this is simple enough to just do it now"* is treated as the
red flag, not the shortcut — whether it is simple enough is the conclusion of a brainstorm, not a reason to
bypass one.

**It cannot run unattended.** A brainstorm's raw material is your appetite, your constraints, and your
judgment about what the pain costs. With no user available to answer, the skill stops rather than inventing
those inputs — an invented appetite would produce a confident conclusion built on nothing. This is the one
place in the workflow where "no answer available" means stop, not proceed with a default.

**No new adversarial machinery.** The challenge that runs before the conclusion is the existing interview's
own adversarial pass, not a bespoke critic. One questioning discipline, used everywhere, beats two that
drift apart.

**No brainstorm register, no report file.** Consistent with refactor findings, discovery output is an
ephemeral work item, not durable reference knowledge. What survives is a container, a lesson, or nothing.

## Related

- [Research and frame](research-and-frame.md) — the two upstream artifacts `brainstorm.md` joins, and the
  interview discipline all three share.
- [Efforts and changes](efforts-and-changes.md) — the two container levels the bundling test chooses
  between, and the five entry shapes.
- [The knowledge layer](knowledge-layer.md) — where a load-bearing rejection goes when no container does.
- [Understanding the dx- workflow](workflow-overview.md) — the convergent lifecycle this phase runs ahead
  of.
- [Brainstorm an idea](../tutorials/brainstorm-an-idea.md) — a hands-on walkthrough of all four ramps.
