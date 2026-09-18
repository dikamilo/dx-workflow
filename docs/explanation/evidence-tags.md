# Evidence tags: provenance per claim

Most documents in a workflow record *what* was concluded. A brief, written by [`/dx-distill`](../reference/skills.md), also records *how each sentence came to be believed* — and it does that at the level of the individual claim, not the file. This page explains why that granularity is the whole point, what the seven tags mean, and why the arithmetic they produce is deliberately not a score.

## The problem: a document flattens its own sources

Write up a discovery conversation the ordinary way and you get prose like this:

> Freelance accountants lose about an hour a week reconciling exports by hand, so we'll start with that segment and target a 10-minute reconcile.

Three claims in one sentence, and by the time it is written down they look identical. In fact they came from three different places: someone *said* they lose an hour (an account of a statement, never measured); the segment was *chosen* in a planning meeting (a decision, not a finding); and the 10 minutes was *picked* as a target by whoever set it (no baseline behind it at all). Six weeks later a reader — or the person who wrote it — cannot tell which is which, and the whole sentence reads as established fact. That flattening is the failure the tags exist to prevent.

Note what happens in the middle claim. A *decision* about a segment is perfectly real and perfectly citable. What it cannot do is establish that the segment has the problem. When the two sit in one sentence, the decision's solidity lends itself to the belief beside it — which is precisely how an assumption gets promoted without anyone deciding to promote it.

## The unit is the claim, not the file

dx- already had provenance before briefs existed: [`/dx-research`](../explanation/research-and-frame.md) stamps each `research/<topic>.md` with frontmatter naming its topic, kind, source, and the date it was gathered. That is provenance **per file** — it tells you where the investigation came from, and it is the right granularity for an investigation, because a research file is one sweep of one topic.

A brief is a different shape. It spans a whole decision — problems, scope, rules, non-goals, risks — and the material behind it is heterogeneous by nature: part interview, part measurement, part a contract someone signed, part what the code already does, and part belief. One frontmatter block cannot honestly stamp that, because there is no single answer to "where did this come from?" So the tag moves down to the line:

```markdown
- `dx-research` records provenance per file, not per claim. `[PRODUCT]` `skills/dx-research/SKILL.md`
```

Tag, then a source pointer, at the end of the claim. One claim per line. A mixed assertion is **split** rather than stamped with its strongest tag — the split is the mechanism; the tag is just the label on it.

## The seven tags name a kind of source, not a quality

| Tag | What it is | What it can support |
|---|---|---|
| `[INTERVIEW]` | A real person's account, citing the companion `<slug>.interview.md` and the date | What that person said or described — not frequency across anyone else |
| `[DATA]` | A measurement, query, or export, citing system, period, and filter | What was measured, within that filter |
| `[DOCUMENT]` | A contract, policy, decision record, or past change | What was **specified or agreed** |
| `[PRODUCT]` | This project's own code, contracts, or compatibility surfaces, read directly | What **exists or was specified** |
| `[BENCHMARK]` | A reference product checked at a cited link on a stated date | What **that product** does |
| `[SYNTHETIC]` | A model-generated walkthrough or simulated account | Nothing, on its own — confined to `## Hypotheses to test`, each with the real check that would settle it |
| `[ASSUMPTION]` | An unverified belief or prediction | Itself, named as such, linked to its test |

The right-hand column is doing the real work, and it is why the tags are **not a quality ladder**. `[DOCUMENT]` is not "better" than `[INTERVIEW]`. They answer different questions, and each is useless outside its own lane: a document containing a guess about users is still a guess about users; an already-built screen (`[PRODUCT]`) proves the screen exists and nothing whatever about whether anyone wants it; a competitor's feature page (`[BENCHMARK]`) supports that the competitor ships it, never that we need it.

Behind all seven sits one hard gate: **never invent research, user behaviour, quotes, measurements, or sources.** A missing fact stays unknown, or becomes a named hypothesis. There is no tag for "I needed a citation here."

## Three meanings that share a source

Tags describe where a sentence came from. A second distinction — what kind of sentence it is — is carried in the prose rather than in a second tag system:

- An **observation** reports only what the source supports.
- A **decision** names what a human chose, who chose it, and why.
- A **hypothesis** states what is unverified, why it matters, and what would change the decision.

These regularly share one source, and that is exactly when they need separating:

> "We'll start with freelance accountants" can be a `[DOCUMENT]` **decision**.
> "Freelance accountants need this every week" stays `[ASSUMPTION]` until evidence supports it.

Both may trace to the same meeting note. The shared source is what makes the second sentence look established — so the split has to be deliberate.

One consequence is worth stating plainly, because it is the rule people most want to bend: **a human's choice to build on an untested assumption does not convert it into evidence.** Accepting a risk is a legitimate, recordable decision. It changes what happens next; it does not change what is known. The factual claim keeps its `[ASSUMPTION]` tag either way, and a decision with no recorded confirmer stays a `proposal` rather than becoming `active`. Targets work the same way: a threshold chosen without empirical support is a provisional target, not an observed baseline, and a missing baseline stays missing rather than being filled with a plausible round number.

## Coverage is arithmetic, not a score

Because every tag sits on a countable line, a brief can report its own composition:

```text
Coverage: 33 claims — 29 sourced (interview 12, data 9, document 3, product 5, benchmark 0), 0 synthetic, 4 assumed
Synthetic hypotheses outside Coverage: 4
```

with `sourced = interview + data + document + product + benchmark` and `claims = sourced + synthetic + assumed`. `[SYNTHETIC]` lines are reported *outside* Coverage, so in a conforming brief the in-Coverage synthetic count is zero — simulated material is quarantined where it cannot be mistaken for a finding.

The temptation is immediate and the design refuses it: **29/33 is not 88% validated.** Two reasons.

First, these are tagged-line totals, not independent-evidence totals. Ten lines citing one file is still one file. That is what the separate `Evidence basis:` line is for — which distinct sources, over what period, which beliefs remain untested, said in plain language, including an honest "independence can't be established here" when that is the truth.

Second, and more important: readiness is never an aggregate. It comes from whether *the relevant* claims have support. `## Problems` and `## Target group` need backing from the first five tags specifically — `[SYNTHETIC]` and `[ASSUMPTION]` cannot carry them, no matter how high the overall ratio climbs. Scope, non-goals, and targets, by contrast, may legitimately rest on human decisions. A brief can be 90% "sourced" and still establish nothing about whether the problem is real, if the sourced part is all `[PRODUCT]` and `[DOCUMENT]` describing what was already built and agreed.

So the number is a **prompt to look**, not a verdict. Its job is to make a thin spot visible — `interview 0` under a brief that claims to know what users do is a question, and the answer might be "yes, and that's fine, this is a compatibility decision." Reading it as a grade would recreate, one level up, the exact flattening the per-claim tags were introduced to break.

## What it costs

None of this is free.

Splitting mixed sentences makes a brief blunter and slightly longer to write; the cap of 500–900 words exists partly to keep that cost bounded, and partly because a brief padded to look complete is a different failure. Tagging is also manual judgment — nothing verifies that a `[DATA]` line really cites a query, which is why `/dx-distill` runs a [skeptic pass](../reference/skills.md) whose first move is to open each cited source. And `[INTERVIEW]` claims would be uncheckable by construction if the conversation vanished, which is why the interview is persisted beside the brief as `<slug>.interview.md`: an interview claim should be as chaseable as a file reference. Writing that record documents where a belief came from — it does not make the belief true.

The payoff is narrow and specific. Six months later, a reader can tell which sentences would survive contact with reality and which were always someone's guess — and `/dx-frame` and `/dx-plan`, reading the brief downstream, can cite a tagged claim instead of re-deriving it while treating an assumption as a risk to plan against rather than a fact to build on.

## Related

- [Skills reference](../reference/skills.md) — `/dx-distill`'s exact reads, writes, and printed output.
- [Distill a brief](../tutorials/distill-a-brief.md) — the hands-on run that produces one.
- [Research and frame](./research-and-frame.md) — per-file provenance, the other half of the picture.
- [The `context/` directory layout](./directory-layout.md) — where `foundation/briefs/` sits.
- [Divergent and convergent work](./divergent-vs-convergent.md) — `/dx-brainstorm` asks whether to build; a brief records what is known either way.
