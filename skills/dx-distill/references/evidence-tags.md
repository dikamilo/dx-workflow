# Evidence and claim meaning

Every substantive claim carries a tag and a source pointer in its canonical section. The tags describe **provenance** — they do not rank how well a source answers any particular question, so don't read them as a quality ladder.

## The seven tags

1. **`[INTERVIEW]`** — a real user's, stakeholder's or expert's account. Cite `<slug>.interview.md` and the date. Keep what *happened* apart from what the person predicts or says they would do.
2. **`[DATA]`** — a measurement, query or export. Cite the system, the period, and the filter; name metadata you don't have. Test data cannot support a claim about real usage.
3. **`[DOCUMENT]`** — a contract, policy, decision record, past change, or meeting decision. It supports what was **specified or agreed**. A document containing a guess about users remains a guess about users.
4. **`[PRODUCT]`** — this project's own code, design contracts, compatibility surfaces or specs, read directly. It supports what **exists or was specified**, never that anyone needs it.
5. **`[BENCHMARK]`** — a reference product checked at a cited link on a stated date. It supports **that product's** behaviour, not demand for ours.
6. **`[SYNTHETIC]`** — a model-generated walkthrough or simulated account. Confined to `## Hypotheses to test`, each with the real check that would settle it. Never supports a problem, a user, or a success criterion.
7. **`[ASSUMPTION]`** — an unverified belief or prediction. Name its origin when known and link it to its test in `## Riskiest assumptions`. **Never invent a source to complete the format.**

Material with no resolvable path is tagged normally and marked **unverifiable** — the reader has no way to check it. A path that is *named but unreachable* (a file in another repo, a system you can't query) is different and worth distinguishing: cite the path, say you couldn't open it, and tag the claim by what the source would be if read — the reader can chase it, which is exactly what "unverifiable" denies.

## The hard gate

Never invent research, user behaviour, quotes, measurements, or sources. A missing fact stays unknown or becomes a named hypothesis. A human's choice to build on an untested assumption doesn't convert it to evidence; a decision with no recorded confirmer stays `proposal`. Material the current decision needs goes on the collection plan — an unreached section needs no research task.

## Separate observations, decisions and hypotheses

Make the meaning clear in the sentence or the table context; don't add a second tag system.

- **Observation** — report only what the source supports. "One person described losing an afternoon" doesn't establish frequency across anyone else. "They said they would pay" is an account of a statement, not a purchase.
- **Decision** — name what a human chose, who chose it, and why. An accepted recommendation becomes a decision, and its origin stays visible: acceptance doesn't confirm the beliefs behind it.
- **Hypothesis** — state what's unverified, why it matters, and what would change the decision. An inferred need, cause or motive stays a hypothesis unless the source supports it; name the observation behind it and keep the interpretation separate from it. A human can accept the risk of building without a test — **the factual claim keeps its assumption status** regardless.

The split is easiest to see in one example:

> "We'll start with freelance accountants" can be a `[DOCUMENT]` **decision**.
> "Freelance accountants need this every week" stays `[ASSUMPTION]` until evidence supports it.

Separate those two sentences **even when they share a source** — the shared source is exactly what makes the second one look established.

Targets and thresholds chosen by the owner are decisions, not observed baselines. Record their origin; a threshold accepted without empirical support is a provisional target. Never invent a measurement or a round number to fill a field — a missing baseline stays unknown.

## Shape

Tag then source pointer, at the end of the claim:

```markdown
- `dx-research` records provenance per file, not per claim. `[PRODUCT]` `skills/dx-research/SKILL.md`
```

One claim per line. **Split a mixed assertion** rather than stamping it with its strongest tag — that's how an assumption smuggles itself in beside an observation. A cross-reference elsewhere needs no repeated tag.

## Counting

Coverage is arithmetic over tagged lines, so what counts has to be unambiguous:

- A tag counts **only where it immediately precedes a source pointer.** A tag name inside rule or glossary *text* is being discussed, not claimed — it doesn't count. (This departs from upstream's "use the first applicable tag" rule, which would count a rule *about* `[INTERVIEW]` as an interview claim.)
- Skip the header, `## Decision summary`, `## Hypotheses to test` and `## Collection plan` — they restate claims counted elsewhere.
- **The benchmark table is the one carve-out.** Its row shape carries no tag cell, so each populated row counts as one `[BENCHMARK]` claim on its link and checked-on date. Without this, a brief built mostly on a reference product reports `benchmark 0` — the count contradicting its own emphasis.
- `sourced = interview + data + document + product + benchmark`; `claims = sourced + synthetic + assumed`.
- Count canonical statements only. On a refresh, preserve existing entries — trim repeated explanatory prose, but never delete an id or change a decision to make the count tidier.
- `[SYNTHETIC]` lines sit outside Coverage and are reported separately as `Synthetic hypotheses outside Coverage: <k>`. In a conforming brief the in-Coverage synthetic count is therefore zero.

```text
Coverage: 33 claims — 29 sourced (interview 12, data 9, document 3, product 5, benchmark 0), 0 synthetic, 4 assumed
Synthetic hypotheses outside Coverage: 4
```

## Basis, not percentage

These are tagged-line totals, **not independent-evidence totals**. Ten lines citing one file is one file; count repeated excerpts from the same session once. Say so in `Evidence basis:` in plain language — which distinct sources, over what period, and which beliefs are still untested. Where independence can't be established, say that rather than implying a count.

Never turn tagged lines into a validation percentage, and never infer readiness from the aggregate. Readiness comes from whether *the relevant claims* have support — specifically, `## Problems` and `## Target group` need support from tags 1–5, checked against what the source actually says. `[SYNTHETIC]` and `[ASSUMPTION]` cannot carry them. An approved choice of segment, a competitor's marketing page, or an already-built screen doesn't establish that anyone has the problem. Scope, non-goals and targets may rest on human decisions; accepting a risk doesn't waive missing evidence of the problem. An honest brief may be ready only for more research.
