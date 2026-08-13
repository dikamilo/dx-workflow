# Verification 2.9 — the principle-lens finding kept for phase 5.3

Produced by the sandboxed `/dx-refactor-discover` run on this repo after phase 2 landed (`a262f7b`).
Kept because **5.3 reads this finding back with only `module-design` loaded** to test whether the
cash-out rule survives the handoff. Not a research artifact; delete when the change is archived.

The finding below came from a **DRY / separation-of-concerns** lens, not from module depth — no module
involved is shallow, so the pre-change scan would not have surfaced it.

---

**The container guard is restated in nineteen skills** — every `skills/dx-*/SKILL.md` line 12

- **Why it's tangled** — "resolve `<id>` under `context/changes/`; missing → point at `/dx-new`; under
  `context/archive/` → refuse" appears with small wording variations across `dx-plan`, `dx-frame`,
  `dx-roadmap`, `dx-plan-review`, `dx-impl-review`, `dx-review-triage`, `dx-implement`, `dx-tdd`,
  `dx-archive` and more. The lifecycle rule it encodes lives nowhere; each skill holds a copy. Adding a
  status, or changing where archived work lives, is a nineteen-file edit with no mechanical check that
  any of them agree — and they already don't (`dx-implement` says "refuse: the change is archived",
  `dx-plan` says "refuse — an archived change is done").
- **Shape: before → after** — `19 hand-written guards → 1 stated guard + 19 one-line invocations`.
- **Proposed** — a `container-guard` reference topic stating resolution, the missing-container
  redirect, and the archived refusal once; each skill's line 12 becomes an invocation plus only its
  skill-specific extra. **Worth exploring** — it opposes the house preference for skills that read
  standalone with zero indirection, and the guard is the first thing a skill must obey.
- **Dependency category** — in-process.
- **Win** — locality: the archived/missing policy gets one place to be right, instead of nineteen
  places to be nearly right.

---

## What 5.3 must check

Read the entry above as `dx-frame` / `dx-research` / `dx-impl-review` would, with **only**
`module-design` loaded. No principle name appears in it — the diagnosis is stated as a copy with no
single home, cashed out as locality. If that reads whole with no lens knowledge, the cash-out rule
holds and phase 6 stays closed.

## 5.3 result — not lossy, phase 6 stays closed

Every term the finding leans on resolves inside `module-design.md`:

- *Dependency category — in-process* → row 1 of the `## Dependency category` table (`:41`), and it
  carries its own consequence ("always deepenable; test through the new interface, no adapter").
- *Win — locality* → defined at `:13` ("where change, bugs and verification concentrate"). The
  finding's phrasing — "one place to be right, instead of nineteen places to be nearly right" — is
  that definition instantiated, so a reader gets the payoff without the reference.
- *Shape: before → after* → self-carrying; `19 hand-written guards → 1 stated guard + 19 one-line
  invocations` needs no vocabulary at all.
- The **Why it's tangled** paragraph names no principle. It states the mechanism (one rule, nineteen
  copies, already disagreeing, a nineteen-file edit with no mechanical check) — which is the evidence
  a DRY/separation-of-concerns label would have compressed away. A reader with only `module-design`
  loses nothing; a reader who knows the principle can still name it themselves.
- The one term that is not `module-design`'s is the **Worth exploring** strength tag, which predates
  this change and is defined by the seed summary's own legend.

Residual gap: none found. The cash-out rule did the work it was written to do — the lens that *found*
the problem left no trace the downstream reader needed. Phase 6 is not opened.
