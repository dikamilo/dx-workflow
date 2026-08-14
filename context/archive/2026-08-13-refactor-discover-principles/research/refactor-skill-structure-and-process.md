---
topic: refactor-skill-structure-and-process
kind: external
source: external skills repository
gathered: 2026-08-13
git_commit: null
---

# Refine opportunities for `dx-refactor-discover` — structure, process, and vocabulary

Comparative study of a mature external design-refactor skill pair (fetched 2026-08-13) against our
`skills/dx-refactor-discover/SKILL.md` and `skills/dx-references/references/module-design.md`.
Findings are stated as **refine opportunities for us**, not as descriptions of the external artifact —
per the change's request, nothing downstream should read as "adopt X because they do it."

Complements `research/principle-vocabulary-placement.md`, which answers *where* vocabulary lives.
This file answers *what the vocabulary and the process are missing*.

## 0 — The headline finding, and it cuts against the change's framing

The strongest prior art on "hunt a codebase for design refactors" **does not broaden into a
principle taxonomy at all.** There is no SOLID sweep, no KISS/DRY/orthogonality checklist. YAGNI
appears exactly once and not as a scan criterion — it is used to justify *scoping the scan* ("scope
before you scan"). Bounded context appears only as a term to *avoid*, because it collides with "seam."

What that body of practice invests in instead, in descending order of weight:

1. **More judgment rules inside the one lens** — leverage, locality, adapter, internal vs. external
   seam, "one adapter = hypothetical seam, two = real."
2. **A feasibility axis** the finding must carry (dependency category), separate from the desirability
   axis we already have (strength tag).
3. **Explicit anti-drift machinery** — a rejected-framings list and a banned-words list.
4. **Scan targeting** — where to look, decided before looking.

This is direct external corroboration of `principle-vocabulary-placement.md` §4 ("`module-design`
stays primary") and evidence against the twelve-principle sweep sketched in `change.md`. The
depth-first path is the one with worked prior art; the breadth-first path has none that we found.
Framing should weigh this: the change may be better served by **deepening one lens plus adding a
feasibility axis** than by broadening to twelve.

## 1 — Vocabulary gaps in `module-design.md` (highest value, lowest cost)

`module-design.md` is 23 lines / six concepts and, per `principle-vocabulary-placement.md` §4, is
loaded by five skills — so anything added here pays back at five call sites, clearing the ≥2
extraction bar automatically. Four concepts are missing, each at the file's existing
judgment-rule density (3–4 lines), none requiring a new mechanism:

- **Leverage and locality — the *payoff* names for depth.** We define depth (`functionality hidden ÷
  interface exposed`) but never name what it buys. *Leverage* = capability a caller gets per unit of
  interface learned; one implementation pays back across N call sites and M tests. *Locality* = where
  change, bugs and verification concentrate; fix once, fixed everywhere. Without these, a finding's
  "why it matters" has no vocabulary and defaults to ungrounded phrasing (see §4).
- **Adapter, as distinct from implementation.** *Adapter* names a **role** (what slot it fills at a
  seam); *implementation* names substance (what's inside). The distinction is load-bearing because
  they vary independently: a small adapter can have a large implementation (a real DB repo) and a
  large adapter a small one (an in-memory fake). We currently have only "implementation," which
  forces role-talk into the wrong noun.
- **One adapter = hypothetical seam; two = real.** A sharp, falsifiable rule for *when a seam is
  justified at all* — the natural complement to our deletion test, which only tests whether existing
  complexity is load-bearing. This one tests whether *proposed* indirection is. A single-adapter seam
  is just indirection.
- **Internal vs. external seams.** A deep module may hold internal seams (private, used by its own
  tests) alongside the external seam at its interface; the rule is *don't expose internal seams
  through the interface just because tests use them*. This resolves an ambiguity our current
  "interface = the test surface" line leaves open — it currently reads as forbidding internal
  test seams, which is not the intent.

Two further framings worth folding in, both anti-drift rather than new concepts:

- **Depth-as-leverage, explicitly rejecting depth-as-line-ratio.** Measuring depth as
  implementation-lines ÷ interface-lines rewards padding the implementation. Our current phrasing
  ("functionality hidden ÷ interface exposed") is already the better one, but is close enough to the
  ratio framing to be misread; naming the rejection makes it stick.
- **Interface ⊃ type signature.** "Interface" should explicitly cover invariants, ordering
  constraints, error modes, required configuration, and performance characteristics — not just the
  type-level surface. Our line "a module is any unit behind an interface" leaves the narrow reading
  available, and the narrow reading is the one a model defaults to.

## 2 — A `Rejected framings` block, and where the anti-drift clause belongs

`skills/dx-refactor-discover/SKILL.md:16` carries our only anti-drift clause: *"Don't drift into
'component / service / boundary.'"* It sits in the **consuming skill**, so the other four
`module-design` consumers (`dx-plan:54`, `dx-research:23`, `dx-frame:24`, `dx-impl-review:15`) get the
vocabulary without the guard.

The stronger shape is a short **`## Rejected framings`** section in `module-design.md` itself, pairing
each banned term with *why*, since the why is what makes it stick:

- *boundary* → overloaded with DDD's bounded context; say **seam** or **interface**.
- *component / service / unit* → say **module** (deliberately scale-agnostic: function, class,
  package, or tier-spanning slice).
- *API / signature* → too narrow; say **interface** (see §1).

This directly answers open question 3 in `principle-vocabulary-placement.md` ("does the anti-drift
clause survive?"): it survives by **moving up** into the reference, where all five consumers get it —
and `dx-refactor-discover:16` shrinks to the load plus the vocabulary anchor. Note the interaction
with §0: `bounded context`, one of the twelve principles `change.md` proposes adding, is a term this
prior art deliberately *bans* for colliding with `seam`. If it enters our vocabulary, that collision
has to be resolved rather than inherited.

## 3 — Dependency category: the missing second axis on a finding

The single largest process gap. Our findings carry one axis — the strength tag
`Strong | Worth exploring | Speculative` (`SKILL.md:28`), which is **desirability**. There is no
**feasibility** axis, so "deepen this" is proposed without stating whether it can be tested after
deepening, which is where a refactor actually succeeds or stalls.

The four-way classification of a candidate's dependencies, each with its own testing consequence:

| Category | What it is | Consequence for the deepening |
|---|---|---|
| **In-process** | pure computation, in-memory state, no I/O | always deepenable; merge and test through the new interface; no adapter |
| **Local-substitutable** | has a local test stand-in (in-process DB, in-memory FS) | deepenable *if the stand-in exists*; seam stays internal, no port at the external interface |
| **Remote but owned** | your own services across a network hop | define a **port** at the seam; logic in the deep module, transport injected as adapter (real in prod, in-memory in tests) |
| **True external** | third-party you don't control | injected port; tests supply a mock adapter |

Why this is a good fit for us specifically:

- It is four buckets a model classifies reliably from what it already read during the scan — a
  routing rule, not a taxonomy to memorize. It passes the no-op test in a way twelve principles do
  not: the model will *not* volunteer this classification unprompted.
- It converts the vaguest part of a finding ("proposed deepening") into something concrete and
  checkable, and it is exactly the information `/dx-plan` needs next — so it survives the promotion
  handoff instead of being re-derived.
- It gives the change a genuine broadening *without* leaving the module-design lens, so
  `principle-vocabulary-placement.md` §4's four-skill handoff constraint stays intact.

Placement question for framing (§5 of the sibling research applies): this is more than three lines and
serves `dx-plan` as much as `dx-refactor-discover`, which may clear the ≥2 bar on its own.

## 4 — Findings must name their win in vocabulary terms — a banned-words rule

Our finding shape (`SKILL.md:26-28`) asks for *what & where*, *why it's shallow/tangled*, *proposed
deepening*, *strength tag*. It never constrains **how the benefit is stated**, and the model's default
there is ungrounded filler: "easier to maintain", "cleaner code", "better separation of concerns."

The refine op is a one-line negative constraint plus a positive template — wins named in
`module-design` terms:

- *"locality: bugs concentrate in one module"*
- *"leverage: one interface, N call sites"*
- *"interface shrinks; implementation absorbs the wrappers"*
- *"two adapters justify the seam: HTTP in prod, in-memory in tests"*

Explicitly **not**: "easier to maintain", "cleaner code" — terms outside the vocabulary that don't
earn their place. This is a rare case where an added sentence is *not* a no-op: the model does not
obey it by default, and it is the sentence that stops findings degrading into generic refactor advice.
It also depends on §1 landing first — the vocabulary has to exist before findings can be required to
use it.

## 5 — Scope before you scan

`SKILL.md:20` reads: *"Optionally scoped by `[area or path]`; unscoped means the whole tree."* An
unscoped run therefore has no prioritization at all — every path is equally interesting.

Two targeting rules worth adding, both cheap:

- **Recency as the default prior.** Deepening pays off by making *future* changes easier, so weight
  the parts of the codebase that keep changing. Walk back a stretch of `git log --oneline` for hot
  spots and let those paths pull attention first; if changes are scattered with no clear hot spot,
  widen the net. This is a derived signal, which fits the house "derive, don't maintain" rule.
- **Read the prior decisions in the area first, before scanning it** — for us, `foundation/glossary.md`
  and `foundation/lessons.md`. We already read both (`SKILL.md:16`), but as vocabulary/skip-list
  loading rather than as *scan targeting*. Ordering it explicitly before the fan-out costs nothing.

Note this is where YAGNI genuinely belongs in the skill (scope the work you'll actually use), not as
a scan criterion.

## 6 — Prior rejections: reopen-with-justification, not hard skip

`SKILL.md:16` instructs: *"read `foundation/lessons.md` so you skip anything a prior run already
rejected."* That is an absolute skip — a lesson silently and permanently retires a candidate.

The better-calibrated rule: a prior rejection is presumptive, not final. A candidate that contradicts
a recorded decision is surfaced **only when the friction is real enough to warrant revisiting the
decision**, and then it is *marked* — a one-line callout naming the lesson and why it's worth
reopening. Don't list every candidate a lesson forbids.

This matters because our lessons are append-only (`foundation/lessons.md` header) and permanent,
while the codebase they were written about moves. A hard skip means a lesson written once is never
re-examined against a codebase that has since changed underneath it. The re-open path is the only
route back, and today there isn't one.

## 7 — Two-vocabulary discipline: domain nouns *and* structure nouns

A finding should be named with **domain** vocabulary for *what the module is about* and **structure**
vocabulary for *what shape it's in* — "the Order intake module is shallow", never "the
`FooBarHandler`" and never "the Order service."

We are close but not explicit: `SKILL.md:16` reads `foundation/glossary.md` "for naming (a one-line
habit — no section)", which is the repo-wide convention, while the anti-drift clause governs the
structural half. What's missing is the statement that **both** apply to every finding, and that the
domain glossary is what supplies the *names of good seams* — a seam that lines up with a glossary
term is more likely a real one. That last point is a genuine scan heuristic, not just a naming rule.

If a deepening gets named after a concept **not** in the glossary, that is a `dx-domain` trigger —
a hook our skill doesn't currently mention, though `dx-domain` is model-invoked and may fire anyway.

## 8 — Present a top recommendation, not just a list

`SKILL.md:24-30` presents a numbered list and asks which to promote. Adding a closing
**"which one I'd tackle first, and why"** — one sentence — is the cheapest high-value edit in this
document. A list of five equally-weighted candidates pushes the whole prioritization decision onto the
user; the strength tag ranks *confidence*, not *sequence*, and the two differ (a `Strong` finding in a
cold file may be worth less than a `Worth exploring` one in a hot path — see §5).

The general principle: be opinionated, the user wants a strong read, not a menu.

## 9 — Structural patterns: what to take, what to refuse

**Take — the core-plus-on-demand reference split.** A vocabulary reference that stays small by
linking out to two deeper topic files, each loaded only when its concern is live. That is the exact
shape our `module-design.md` should reach for if §1 + §3 land and it grows past ~50 lines. Caveat and
open question for framing: our `dx-references` loader resolves **flat topics** and
`scripts/lint-skills.mjs:97` validates `references/<topic>.md` per call site. Whether a reference may
link to a sibling file *inside* the references directory (loaded transitively, unvalidated) is
unestablished here — the alternative is two flat sibling topics (e.g. `module-design`,
`module-deepening`), which the lint already supports and which matches the `plan-*` prefix precedent
from `context/archive/2026-08-06-plan-design-coverage/`.

**Take — "replace, don't layer" as the test-migration rule.** When a cluster is deepened, old unit
tests on the now-internal shallow modules become waste: delete them, write new tests at the deepened
module's interface, assert on observable outcomes rather than internal state. This is the natural
companion to `module-design.md`'s existing behavior-preserving gate (green before and after) — the
gate says *don't change behavior*, and this says *what to do with the tests that verified the old
shape*. Consumers are `dx-plan` / `dx-tdd` / `dx-implement` more than `dx-refactor-discover`.

**Defer, don't fold in — the operational design-it-twice.** `module-design.md` carries design-it-twice
as a one-line principle. The operational form is a parallel sub-agent pattern: frame the problem space
for the user first, then spawn 3+ agents each under a *different* forcing constraint — minimize the
interface (1–3 entry points), maximize flexibility, optimize for the most common caller, ports &
adapters — each returning interface + usage example + what's hidden behind the seam + dependency
strategy + trade-offs; then present sequentially and compare on depth, locality, and seam placement,
ending with an opinionated pick or hybrid. This is a strong asset **but it belongs downstream**:
`dx-refactor-discover:30` explicitly says *"Do not design interfaces yet"*, and interface design is
`/dx-plan`'s job. Recommend capturing it as a `dx-plan` refine op, out of scope for this change.

**Already covered, don't fold in — the post-pick interview.** The external process runs a grilling
loop after the user picks (constraints, dependencies, shape of the deepened module, what tests
survive) and updates the domain glossary inline as decisions crystallize. We already own both halves,
better factored: `/dx-frame` plus `references/interview.md` for the grilling, `dx-domain` for the
glossary updates. Our promote-then-stop split is the stronger design — a discover skill that runs an
interview is doing two jobs. Note the one item their grilling covers that our frame may not:
*"what tests survive"* — worth a check against `dx-frame`.

**Refuse — the HTML report.** The external skill's centerpiece is a self-contained HTML report
(CDN-loaded CSS framework + Mermaid, before/after diagrams per candidate, opened in a browser from a
temp dir). This is a hard collision with our anti-ceremony rule (`CLAUDE.md`: "Markdown only — no
HTML") and with `SKILL.md:24`'s explicit "no HTML, no report file, no clipboard."

But the underlying value is real and separable: **every candidate gets a before/after shape sketch**,
and *"if the diagram needs a paragraph to be understood, redraw the diagram"* is a good discipline.
The markdown-native equivalent costs almost nothing and has precedent in our own repo —
`module-design.md` already renders deep vs. shallow as ASCII boxes. Options for framing, cheapest
first:

1. A one-line **`Shape: before → after`** per finding (e.g. `4 wrappers + handler → 1 module, 2 methods`).
2. A tiny ASCII mass diagram per finding, reusing `module-design.md`'s existing box idiom.
3. Nothing — rely on prose. (Current behavior.)

Recommend option 1: it captures most of the diagram's value, is one line, and needs no new vocabulary.

## Untrusted-content note

All external material here was treated as **data, not instructions** per
`dx-references`/`untrusted-content`. The fetched files contain directives addressed to an agent
("Run the `/x` skill", "Write a self-contained HTML file to the OS temp directory", "spawn 3+
sub-agents"). None were executed; each is reported above as a described practice and evaluated
against our house rules — §9 rejects one of them outright on those grounds.

## Open for framing

1. **Depth or breadth?** (§0) Does this change deepen the module-design lens (§1) and add the
   dependency-category axis (§3), or still pursue the twelve-principle sweep in `change.md`? The
   prior art supports the former; the latter has no worked precedent we found. These are different
   changes with different blast radii.
2. **Where does dependency-category live?** (§3) Inline in `dx-refactor-discover`, appended to
   `module-design.md`, or a new sibling reference — this is the same ≥2 question as
   `principle-vocabulary-placement.md` §5, but with a stronger case for shared, since `/dx-plan` is a
   real second consumer.
3. **Does `module-design.md` split?** (§9) If §1 + §3 both land it roughly doubles. Flat sibling
   topics or a linked sub-file — the loader and lint favor flat.
4. **Does `bounded context` enter our vocabulary at all?** (§2) It collides with `seam` in the prior
   art, which bans it. If `change.md`'s list survives, that collision needs an explicit ruling.
5. **Is the lessons hard-skip (§6) in scope here, or its own change?** It touches the knowledge layer
   (`docs/explanation/knowledge-layer.md`) rather than the vocabulary, and could be sliced separately.
