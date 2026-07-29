---
created: 2026-07-28
---

# Frame — dx-brainstorm

## The real problem

The dx- SDLC has no divergent phase: every entry point assumes the work is worth doing. `dx-new` forces a change-vs-effort pick before anything has been questioned, and `dx-frame` only runs once a container already exists — so "this problem isn't real", "a cheaper path already exists", and "we shouldn't build this" have nowhere to be concluded and nothing to be recorded as. The gap is not a missing document; it is a missing **outcome**. `dx-brainstorm` closes it by owning the conversation that happens before a container: question the problem, weigh at least two alternatives plus a priced do-nothing, and converge on a routing decision — where deciding to build nothing is a first-class result, not a failure to produce work.

Verified upstream, not re-derived: `context/efforts/sdlc-hardening/research/sdlc-hardening.md` §1 confirms no "decide not to build" exit exists anywhere today; the effort's `frame.md` already settled that this belongs in this effort as its last slice.

## Who / what it affects

- **The user starting new work** — gains an optional front door. Small, clear work still skips straight to `/dx-new`; `dx-brainstorm` is never mandatory.
- **`dx-new`** — stops being the place where the change-vs-effort coin flip happens for brainstormed work. When `dx-brainstorm` runs the bundling test ("would each capability function without the other?"), it hands the level over instead of making `dx-new` re-derive it. Also gains a one-line mention in its "Promoted entries" section so its list of discovery entries isn't stale.
- **The shared `interview` reference** (`dx-references/references/interview.md`, consumed by `dx-frame`, `dx-plan`, `dx-roadmap`) — gains one missing move: *when the user answers with a solution, ask about the problem it solves before adopting it.* This is the one technique the prior art has that dx lacks, and it belongs shared, not collocated. Slice 3 of this effort already landed the challenger step in the same file; this is an independent one-line addition on top of committed work.
- **The discovery-entry group as a concept** — grows from two skills (`dx-diagnose`, `dx-refactor-discover`) to three, and for the first time one of them can route to an **effort**, a branch the glossary's "Discovery Entry" definition already sanctions but no skill implements.
- **Docs and the glossary** — `docs/reference/skills.md` (enforced bidirectionally by `npm run lint:skills`), a tutorial page, `docs/reference/glossary.md` + `context/foundation/glossary.md` (a new **Brainstorm** term, with `_Avoid_` lines against Research and Frame), `DESIGN.md`'s skill index, and a changeset.

**Deliverable boundary (the caveat worth stating in the skill body).** `DESIGN.md:463` and `context/standards/global/skill-authoring.md` forbid auto-chaining, yet this skill creates a container. The reconciliation is the one `dx-refactor-discover` §4 already states and that `dx-diagnose` follows: creating the container *is* the discovery entry's own deliverable; the no-auto-chain rule binds the step *after* that. `dx-brainstorm` must say this explicitly or review will read it as a violation.

## Alternatives considered

- **Deliverable — chosen: split by outcome.** A conclusion that is one shippable unit → `dx-brainstorm` creates `context/changes/<id>/` itself with the brainstorm as its seed. A conclusion that is an effort → it composes a seed summary and prints `/dx-new "<summary>"` for the user to run, because effort + roadmap + child changes is a multi-step flow owned by other skills. This is exactly `dx-refactor-discover`'s existing one-pick / many-pick split, so it introduces no new precedent and requires no new mechanism in `dx-new`.
  - *Rejected — routing decision only, never writes.* The prior art's choice: stay read-only and always hand `dx-new` a seed summary. One uniform rule, but it flattens a long conversation into a shell argument for the common (change) case and diverges from how both existing discovery entries behave.
  - *Rejected — always self-contained.* Creating the effort folder directly too. Most direct, but it takes over effort creation, which is deliberately owned by `dx-new` + `dx-roadmap`.
- **Exit ramps — chosen: four, no parking.** (1) Question answered / nothing worth building — no container, no artifact, no `Next:` line (`dx-diagnose`'s trivial branch is the precedent for a no-handoff terminal output). (2) Already covered by an existing or archived change — cite it and stop. (3) One shippable unit → change, created here. (4) Bundling test found ≥2 independently shippable capabilities → effort, handed off as a seed summary.
  - *Rejected — a fifth "capture for later" ramp as an empty `status: new` change.* `ls context/changes` would technically be the backlog, but a parked item becomes indistinguishable from work in flight and `status: new` stops meaning "just started". `DESIGN.md:404` already refuses durable registers for exactly this class of thing.
  - *Rejected — two ramps (build or don't).* Smallest surface, but drops "already covered" as a named outcome, which is the cheapest possible win the archive sweep can produce.
- **Adversarial check — chosen: reuse the shared `interview` challenger as-is.** The routing decision is precisely the "consequential, hard-to-reverse" case step 5 already names, and reuse satisfies the ≥2-skills rule for shared references.
  - *Rejected — collocated brainstorm-specific focus areas* (is the problem real, was build-nothing priced, is the ramp right-sized, would the artifact survive cold). Allowed by house style for single-use text, but overlaps the shared step for little gain.
  - *Rejected — a fresh-context adversarial subagent* (the prior art's strongest single idea). A cold reader catches what an in-conversation pass rationalizes, but it is a new mechanism no other dx skill has and it partially duplicates the challenger slice 3 just landed.
- **Reject the skill entirely and retrofit an "abandon" outcome onto `dx-frame`.** Already settled upstream by the effort's research (§1) and `frame.md`: `dx-frame` runs *after* a container exists, so an abandon there still leaves an orphan container — a new entry point ahead of `dx-new` is the only non-retrofit fix. Cited, not re-litigated.

## Out of scope

- **A durable brainstorm register** (`foundation/brainstorms/`, a backlog file, or any list of parked ideas). Discovery findings are ephemeral work items; they live in the container they spawn and archive with it.
- **Parking / "capture for later"** as an outcome — follows from the above.
- **A new root-level, specially-named artifact** (`brainstorm.md` beside `research/`). `diagnosis.md` had to be taught to five separate readers; a brainstorm's output lands where existing readers already look.
- **Tracker, issue, or PR integration**, sidecar config files, emoji glossaries, repo-local override mechanisms, and machine-contract regex formalism — all present in the prior art, all in direct conflict with dx's anti-ceremony/derive-don't-maintain house style (and already listed out of scope by the parent effort).
- **Auto-chaining into `/dx-plan` or `/dx-roadmap`** after the container is created.
- **Changing `dx-new`'s promotion mechanism.** The edit there is one sentence naming this skill; no argument, filename convention, or parse is being introduced.
- **A third severity vocabulary.** If any finding is ever written down, it uses `Blocker` / `Consider` per `references/review-report.md`.
- **Making `dx-brainstorm` mandatory** anywhere in the lifecycle.

*Deferred to `dx-plan`, not decided here:* the artifact's exact shape (`frame.md` vs `research/<topic>.md` vs both), the skill's invocation mode (`disable-model-invocation` vs model-invoked triggers), and the interactive-only / no-user-available guard's wording.
