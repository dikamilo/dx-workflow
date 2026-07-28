---
topic: prior-art-brainstorm-skill-design
kind: external
source: comparable open-source brainstorm skill (identifying details withheld at requester's instruction)
gathered: 2026-07-28
git_commit: null
---

# Prior art: how another SDLC skill set designs its pre-container brainstorm step

Fetched 2026-07-28. One skill body plus seven reference files (agentic setup, brief template, challenger prompt, conversation guide, exit ramps, report templates, shared rules) — roughly 22 KB total, of which the skill body is ~6 KB and the rest is pulled in per-step. **Inspiration only**; several of its choices conflict with dx house style and are flagged as such.

## 1. What the skill is, in its own framing

It positions itself as "the step before any artifact exists": a conversation that questions the problem, explores alternatives including building nothing, and converges on *which skill runs next*. Two properties define it:

- **Read-only on the repository**, with exactly one permitted write — a single handoff brief, and only after the user confirms the routing.
- **Its output is a routing decision**, not a document. The document exists only to carry the conversation's resolved unknowns forward.

That maps closely onto the dx-brainstorm intent in `change.md` (slice 6): decide whether to build, then hand off to `dx-new`.

## 2. Ideas worth adopting

### 2.1 A hard gate stated as a single blocking sentence

The skill opens with an explicit gate forbidding edits, code, specs, issues, or any mutating skill invocation during the conversation — and closes it with the line: *"'This is simple enough to just do it now' is itself the red flag."* One sentence that names the exact failure mode the gate exists to stop.

**Adoptable:** dx skills already avoid ceremony, but a brainstorm is uniquely prone to sliding into implementation. A one-line named-failure-mode guard is cheap and passes the no-op test (the model does *not* already obey this — it defaults to helpfulness).

### 2.2 "Build nothing" as a mandatory, priced option

Not a suggestion — a requirement at two points: the exploration step must always put "at least two alternatives plus build nothing" on the table, and the technique reference insists the do-nothing option be *priced with its real consequences*, explicitly calling out strawmanning it as the failure.

**Adoptable directly.** The `change.md` note already wants "decide not to build" as a first-class outcome; the pricing requirement is what makes that real rather than decorative.

### 2.3 A "sources before questions" ladder

The exploration technique orders information sources: repository (code, agent instruction files) → docs and existing specs → tracker → *then* the user. The rule that lands it: **"A question whose answer sits in the repo is homework, not conversation."** The user is asked only what has no other source — motivation, priorities, appetite, constraints, taste.

**Adoptable, with a dx-native ladder:** `context/foundation/glossary.md` + `lessons.md` → `context/standards/` → existing `context/changes/**` and `context/archive/**` (is this already decided, already tried, already shipped?) → the codebase → the user. The archive sweep is the dx analogue of its "reality-check the tracker" step and is arguably stronger, since dx already stores past decisions locally.

### 2.4 Question discipline: one at a time, never a numbered wall

Explicit rules: ask one open question, listen, let the next question come from the answer; batch only *trivially closed and mutually independent* questions; "never present a numbered wall of questions — that is a form, not a conversation." Plus: **when the user answers with a solution, ask about the problem it solves before adopting it.**

**Adoptable.** dx already has an `interview` shared reference (`dx-references` topic `interview`) — this is the same family of guidance, and the "solution-as-answer" move is a good candidate addition there rather than duplication inside dx-brainstorm.

### 2.5 A named set of divergence moves

Short, memorable, each one a concrete conversational action:

- Restate the problem **without** the user's proposed solution in it. If the problem disappears, the proposal *was* the problem.
- Generate two or three genuinely different alternatives, plus priced do-nothing.
- Name the riskiest assumption in the current favorite and the cheapest way to test it.
- **Kill vague framing** with a stated bar: *"admin manages team" is vague; "admin invites by email and assigns a role; cannot delete users" is ready.*
- **The bundling test:** does the idea contain more than one independently deployable capability (would each function without the other)? A bundle routes as its first slice; the rest become separate briefs.
- Ask what breaks or gets worse **if this succeeds** (second-order effects: load, support, workflow collisions).

**Adoptable, especially the bundling test** — it is precisely the change-vs-effort routing question dx-new has to answer. A brainstorm that runs the bundling test hands `dx-new` the answer instead of making it re-derive one.

### 2.6 An explicit convergence checklist (when to stop talking)

Stop when all three hold: (a) one conclusion type fits better than the others; (b) the unknowns that *block routing* are resolved; (c) the user signals enough — "depth of exploration is their call, not the skill's."

**Adoptable.** This is a well-shaped `Done when` for a conversational skill: it terminates on routing-sufficiency, not on exhaustiveness.

### 2.7 The challenger gate — a fresh-context adversarial subagent

Before presenting the conclusion as final, it dispatches **one** fresh-context subagent with a summary of the conversation and a skeptical-reviewer prompt. The prompt has five focus areas: is the problem real (evidence, and does it survive being restated without the solution); was build-nothing seriously weighed (cheaper path: existing feature, config, process, docs); is the ramp right-sized (spec for a small change? bundle routed as one?); what was never tested (riskiest unchallenged assumption, cheapest falsifying experiment); would the brief survive cold (could someone who never saw the conversation act on it — is anything load-bearing still only in the chat).

Output is three severity buckets: CRITICAL (routing is wrong / brief unusable), WARNING, OK. The load-bearing rule: **CRITICAL findings go back to the user as questions — the skill never resolves its own challenger's CRITICALs.** WARNINGs may be resolved inline only when the answer already exists in the conversation or repo.

**Adoptable, and it is the strongest single idea here.** It rhymes with dx's report-only review gates plus `dx-review-triage`: the gate finds, a separate act decides. Two dx-native adaptations to consider: (a) severity vocabulary should reuse dx's existing unified review severities rather than importing CRITICAL/WARNING/OK; (b) per the `model-policy` reference this is a judgment call, not mechanical search, so it should not be pushed onto the cheapest model.

### 2.8 A cold-readable handoff brief with named, load-bearing sections

The brief template is prescriptive: one-line goal; date; category; priority signal + one-line why; risk signal + one-line why; routing line verbatim; then **Problem** (2–5 sentences in the user's sharpened words, plus evidence it matters), **Agreed direction** (what to pursue *and what was explicitly rejected, including why build-nothing lost*), **Resolved unknowns** (a question/answer table), **Non-goals** ("so nobody gold-plates"), **Affected areas** (only what the conversation established — never guessed).

Two rules give the template teeth:

- *"Write 'none' rather than deleting a heading — humans and downstream skills key on the structure."*
- **Resolved unknowns is declared the load-bearing section**, and it doubles as a routing self-check: an *empty* table means the chosen route is wrong. It downgrades to the co-design route or keeps talking.

**Adoptable.** `change.md` already asks what the dx-brainstorm artifact looks like. "Rejected alternatives + why build-nothing lost" and "Resolved unknowns" are exactly what would otherwise be lost between brainstorm and `dx-frame`, and an empty-table-means-wrong-route check is a free consistency test.

### 2.9 Brief lifecycle: the brainstorm's write is deliberately non-durable

The brief is written **uncommitted** into the invoking checkout; making it durable is the *routed* skill's job — copy it into the worktree and commit it, commit it beside the spec, or embed its content into the issue body. The stated invariant: the resolved-unknowns table must end up inside a committed or tracker-held artifact so a resume from another machine never depends on the local file. It also warns that ingestion must happen *before* any worktree is created, since a worktree branched from origin will not contain the file.

**Relevant but structurally different for dx.** dx's `context/` tree is committed by design, so durability is not the same problem. The transferable half is the **ownership rule**: the brainstorm writes a seed artifact, and the *next* skill (`dx-new`) is responsible for promoting it into the container — which is already how `dx-diagnose` → `dx-new` "Promoted entries" works. This is direct confirmation that the dx-brainstorm artifact should follow the `diagnosis.md` promotion pattern rather than inventing a new one.

### 2.10 A routing table with explicit tie-breaker guidance

Six conclusions, each with a next-skill invocation: (1) question answered / nothing worth building → no handoff, the answer *is* the report; (2) worth capturing, not now → file an issue; (3) feature, unknowns resolved → autonomous spec; (4) feature, user wants to co-design → interactive spec; (5) small well-understood change → straight to a PR; (6) already tracked → route to the existing item.

The compact table lives in the skill body; a reference file carries the *tie-breakers*, which is where the value is:

- Ramp 1 vs anything: *"If the deliverable of the conversation is understanding, stop. Do not manufacture work to have a handoff."*
- Park vs start now: "the question is appetite, and it belongs to the user — ask it plainly."
- Autonomous vs co-design: pick co-design when the user wants to stay in the loop, **not out of caution alone — that is what the challenger gate is for.**
- Small-change vs spec: route small "when a reviewer would not want a design to react to"; and *"if naming the affected areas took real work in the conversation, it probably deserves a spec."*
- Already-tracked outranks file-a-new-one.

**Adoptable in shape, not in content.** A dx exit-ramp table would be smaller and dx-native — roughly: answered/not worth building (no container); worth capturing but not now; a change (`dx-new <id>`); an effort (`dx-new` as effort, because the bundling test found ≥2 independently shippable slices); already covered by an existing or archived change (cite it, stop). The heuristics worth stealing verbatim: *don't manufacture work to have a handoff*, *appetite is the user's call*, and *"took real work to name the affected areas" as the signal for more structure*.

### 2.11 A machine-parsed output contract

The final report ends with exact, undecorated, line-anchored markers — `Next: none` | `Next: <skill> <args>`, plus `Brief: <path>` only when a brief was written. Consumers parse specific regexes; shared rules forbid renaming, translating, omitting, or decorating them, and require the brief path be space-free (kebab-case slug) because it is parsed as `\S+`. The rationale given: an orchestrator can then run the chosen next step autonomously.

**Partially adoptable.** dx already prints a `Next:` line at the end of every skill, so the pattern exists — this is a reminder to keep dx-brainstorm's terminal line in the same exact shape as its siblings, and to make the artifact path space-free. The full machine-contract formalism (regex documentation, legacy-marker acceptance) is more ceremony than dx wants.

### 2.12 Explicitly interactive, with a no-user failure mode

Stated twice: the skill has no autonomous mode, must never be driven by an automated caller, and *"invoked unattended with no user available → stop and report instead of inventing answers."*

**Adoptable as one line.** A brainstorm that fabricates the user's appetite and constraints produces a confidently wrong routing decision — worse than no decision.

### 2.13 Never run the routed skill yourself

"Emit the contract lines and hand control back — the user or the orchestrator executes them."

**Already dx house style** ("No auto-chain: print the next command and stop"), so this is confirmation rather than a new idea — but it is notable that a *conversational* skill, where chaining feels most natural, still holds the line.

## 3. How it structures its references (the packaging lesson)

The skill body stays ~6 KB and principle-first: guard, arguments, seven numbered workflow steps, a compact routing table, an output contract, and a short rules list. Everything expandable lives in separate reference files pulled per step:

| Reference | Role                                                                     | Pulled at |
|---|--------------------------------------------------------------------------|---|
| agentic setup | config/preflight contract                                                | step 0 |
| conversation guide | technique (question discipline, divergence moves, convergence checklist) | steps 1–2, 4 |
| challenger prompt | the verbatim adversarial subagent prompt                                 | step 4 |
| exit ramps | routing tie-breakers, constraints, artifact lifecycle                    | steps 4–5 |
| brief template | the artifact's exact shape, metadata, one line goal, problem section, agreed direction, resolved unknows table, non goals, afected areas                                             | step 6 |
| report templates | final-report shapes                                                      | step 7 |
| shared rules | collection-wide rules                                                    | always |

The split is consistent: **the body carries contracts and decisions; the references carry technique, templates, and tie-breakers.** The conversation guide states this explicitly — "the hard rules live in the skill body — this file is technique."

**Adoptable as a principle, not as a file count.** dx's rule is that a reference is shared only when ≥2 skills use it, otherwise it is collocated inside its one skill. Applied here: the challenger prompt, the artifact template, and the exit-ramp tie-breakers are dx-brainstorm-only and would collocate; question-discipline technique belongs in the existing shared `interview` reference; severity vocabulary belongs to the existing unified review-severity reference.

## 4. Where its design conflicts with dx house style — do not copy

- **Volume.** ~22 KB across eight files for one conversational skill, with noticeable repetition (the read-only/one-write rule is restated in the body, the setup reference, and the shared rules; the tracker read-only subset is stated three times). dx's no-op test would delete a large fraction of this.
- **Mandated verbosity.** Its shared rules require filling report templates "exactly and expand with detail" and forbid "terser variants", and prescribe an emoji glossary for user-facing output (🎯 goal, 🔍 review, ⚠️ needs-human, …). dx is markdown-only, anti-ceremony, and terse-by-default; the emoji glossary in particular is a direct conflict.
- **Sidecar JSON config.** It resolves paths from a config file with a repo-local override contract and defaults. dx derives instead — containers are found by `ls`, status from frontmatter. No config file.
- **Tracker coupling.** A conditional read-only tracker check with degrade-silently semantics. dx's equivalent is a local sweep of `context/changes/**` and `context/archive/**`, which is simpler and needs no descriptor, capability negotiation, or degradation path.
- **Untrusted-content boundary / prompt-injection section.** Sensible for a skill that reads issue bodies from a public tracker; not proportionate for a local-context sweep.
- **Repo-local extension mechanism.** An `@`-importable override file with a "specifics win but can never relax safety" contract. Configurability that dx has not asked for.
- **Severity vocabulary drift.** CRITICAL/WARNING/OK is a third vocabulary; dx has already unified review severities and dx-brainstorm's challenger should use that existing scale.

## 5. Shortlist for `dx-frame`

Ranked by value-to-cost for a dx-native brainstorm skill:

1. **Challenger gate** — one fresh-context adversarial subagent at convergence; findings return to the user as questions, never self-resolved. Reuse dx's existing severity vocabulary.
2. **Priced "build nothing"** plus a mandatory ≥2 alternatives, with "nothing worth building" as a real exit that writes no artifact.
3. **A seed artifact with named sections** — problem, agreed direction *including what was rejected and why nothing lost*, resolved-unknowns table, non-goals, affected areas — promoted by `dx-new` exactly like `diagnosis.md`, keeping the empty-resolved-unknowns-means-wrong-route self-check.
4. **The bundling test** — "would each capability function without the other" — as the change-vs-effort routing signal handed to `dx-new`.
5. **Exit-ramp table** with tie-breakers, sized to dx: answered / capture-for-later / change / effort / already covered by an existing or archived change.
6. **Sources-before-questions ladder**, dx-native: foundation → standards → existing and archived changes → codebase → user. Plus the "homework, not conversation" line.
7. **Hard gate** against sliding into implementation, with the "this is simple enough to just do it now is itself the red flag" framing.
8. **Convergence checklist** as the `Done when`: one ramp fits, routing-blocking unknowns resolved, user signals enough.
9. **Vague-framing bar** and the second-order-effects question ("what breaks if this succeeds") as two named divergence moves.
10. **Interactive-only** with an explicit stop-and-report when no user is available.
