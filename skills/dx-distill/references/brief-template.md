# `briefs/<slug>.md` — shape

`context/foundation/briefs/<slug>.md`, beside `research/`. Written only by `dx-distill`; read by `dx-new`, `dx-frame`, and `dx-plan` as settled upstream context.

One companion file: **`<slug>.interview.md`**, the record of the exchange the `[INTERVIEW]` claims cite. It holds the questions asked and what was answered — not a synthesis, and not a second brief. It exists so an interview claim is as checkable as a file reference, and it's listed in `Sources:` like any other path. No other sidecar: material already in the project is cited by path, never copied.

**500–900 words at most, shorter when the material is thin.** Don't fill space to meet a length. Write each substantive claim once, in its canonical section, with its tag and source pointer; everywhere else cross-refer to it. The Decision summary is a reading path, not a second copy of every rule — it adds no claims of its own and carries no tags.

A section the material doesn't reach is **omitted entirely** — no `N/A`, no placeholder, no "deferred" stub. (This departs from the upstream template, which keeps a one-line deferral; `plan-template`'s rule wins here.) A gap that actually blocks the decision goes on the `## Collection plan` instead; an unreached section needs no entry there.

Ids (`D01`, `R01`, `N01`, `A01`, `Q01`) are stable forever. On a refresh, preserve existing rows and history — **supersede, never delete or renumber**. `Status` is `active`, `proposal`, or `superseded`.

`Confirmed by` records that someone agreed to this choice **at the confirmation gate, with the choice and its consequences in front of them** — not that they mentioned it in passing during the interview. In a solo workflow the name is nearly always the same person who supplied the `[INTERVIEW]` source on that row, so the name is not the point: the point is that a decision reaches `active` by being read back and agreed to, and stays `proposal` otherwise. Record the date alongside it.

```markdown
# <slug> — brief

- Date: <today>; Pass: full | quick
- Emphasis detected: <the tag(s) the material concentrates in>-weighted, and why
- Evidence basis: <the independent source material and its limits; observations kept apart from
  decisions; the most consequential untested belief>
- Coverage: <n> claims — <a> sourced (interview <i>, data <d>, document <c>, product <p>,
  benchmark <b>), <s> synthetic, <u> assumed
- Synthetic hypotheses outside Coverage: <k>
- Sources: <the paths the claims cite — no excerpts>

## Decision summary

<The current decision, and whether it is agreed or still proposed.>
<Who has the problem, what was observed, and the present workaround — link to Problems.>
<What was chosen for now and why, citing the D/R/N ids.>
<The uncertainty most likely to overturn that choice, including any gap between the observed
 need and the proposed solution — link to the A/Q ids.>
<The next action, what it will tell us, and who owns it. An unavailable date stays open.>

## Vision

<For whom, and what should change, in one plain sentence. Name it as intended direction, not a
 demonstrated benefit.> `[tag]` <source>

## Target group and stakeholders

- Customer (pays): <observed or chosen role — say which> `[tag]` <source>
- User (uses): <the observed situation; don't generalize past what supports it> `[tag]` <source>
- Stakeholders (decides, blocks, operates): <only roles this decision touches> `[tag]` <source>

## Problems, with evidence

- <The observed problem, who hit it, the present workaround, its cost or frequency. Say so when
  only one account supports it.> `[tag]` <source>
- <Keep an inferred cause separate from the observed event; link consequential interpretations to
  an A id. When the direction is open, state person, situation and desired outcome — not a feature.>

## Product and how it stands out

- What it is: <one sentence, deferring to Scope> `[tag]` <source>
- What makes it different: <only sourced comparisons, or an explicit hypothesis with an A id>

| reference | what it does well | where it falls short for us | checked on | link |
|---|---|---|---|---|

<Populate a benchmark row only when it informs the decision and was actually checked.>

## Goals and success criteria

- Goal: <the chosen target and its rationale, citing the decision id>
- User outcome: <observable result answering the sourced problem> `[tag]` <source>
- Primary metric, baseline today, threshold: <keep a measured baseline distinct from a chosen
  target; unknowns stay explicit>
- What must not get worse: <real constraints only, each linked to its source or rule>

## Scope

- **Now:** <one complete job, or a bounded experiment — cite rules and decisions, don't restate them>
- **Later:** <deferred work and the relevant decision ids>
- **Not doing:** see Non-goals

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|

<Ambiguous terms needed to understand the current scope. Not a duplicate specification.>

## Key flows

- Current state: <observed steps and where they chafe> `[tag]` <source>
- Future state: <only the steps needed to understand Now; cite decided steps, label proposed ones
  as assumptions, refer to rule ids>

## Business rules

| Id | Rule | Applies to | Source | Status |
|---|---|---|---|---|
| R01 | <one rule, in full, once> | … | `[tag]` <source or linked decision> | active |

## Non-goals

| Id | We are not building | Why | Source | Status |
|---|---|---|---|---|
| N01 | … | … | `[tag]` <source> | active |

## Decisions

| Id | Date | Decision | Why | Source | Confirmed by | Status |
|---|---|---|---|---|---|---|
| D01 | … | <the choice, or adoption of a rule id> | <reason, plus an alternative actually weighed
  when the approach was open> | `[tag]` <source> | <name, or not recorded> | active / proposal |

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Result |
|---|---|---|---|---|---|---|
| A01 | … `[ASSUMPTION]` <origin, or no material> | high / medium / low | <what is observed, with
  references; beliefs kept separate> | <which decision changes> | <the learning question, the
  action, and what you'd observe> | untested / accepted untested (D<nn>) / held / refuted |

<A recorded acceptance is permission to take the risk — never evidence that the assumption held.>

## Kill criteria

<What result prompts stopping or reconsidering, when, and who decides. Keep an observed outcome
 distinct from a stated intention. Undecided → name that gap.>

## Hypotheses to test

<Canonical `[SYNTHETIC]` claims only, each with the real interview or measurement that would check
 it. Excluded from Coverage, counted separately in the header.>

## Open questions

| Id | Question | Blocking | Status |
|---|---|---|---|
| Q01 | … | <yes/no, and the specific decision or work blocked> | open |

## Collection plan

<Per gap: what decision needs it, who can answer, how, and by when. Only actual material requests
 the current decision or an explicit follow-up needs — an omitted section is not an entry, and
 neither is a general open question.>
```

## Voice

Reader's language over method vocabulary — framework words stay out of the brief. The evidence tags are the deliberate exception, being contract. Write for a cold reader months from now, not as conversation notes.

## Reading rules for the skills downstream

`dx-new`, `dx-frame`, and `dx-plan` read a brief as **settled context**, not a proposal to relitigate — following the ids rather than trusting the summary to be complete. Active `## Non-goals`, `## Business rules`, and `## Decisions` are the contract: reopening one needs a reason the brief didn't have. A claim the brief marks unsupported stays an open question downstream even where the user chose to proceed on it, and readiness is never inferred from the Coverage count.
