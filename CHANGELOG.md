# dx-workflow

## 1.1.0

### Minor Changes

- e139adc: Add `dx-brainstorm` — a third discovery entry that runs before `/dx-new` on a raw idea: it questions whether the problem is real, weighs at least two alternatives against a priced do-nothing, and converges on one of four exit ramps (nothing worth building, already covered, one change, or an effort). Deciding to build nothing is a terminal outcome that writes nothing. When it does route, it writes the container's identity file plus a new root-level `brainstorm.md` artifact carrying the alternatives weighed and the scope explicitly rejected, then prints the next command and stops.

### Patch Changes

- e139adc: Add a challenger step to the shared `interview` reference: before presenting a conclusion for a consequential, hard-to-reverse decision, run an adversarial pass (strongest objection, cheaper alternative, downstream breakage, hidden assumption). Critical findings surface back to the user as a question; non-critical findings become a visible caveat. Picked up automatically by `dx-frame`, `dx-plan`, and `dx-roadmap`.
- e139adc: Unify `dx-plan-review` and `dx-impl-review` onto one severity vocabulary (`Blocker`/`Consider`) in the shared `review-report` reference, instead of `impl-review`'s separate `PASS`/`WARNING`/`FAIL` dimension scale. `impl-review` findings now tag with the compound `<Dimension>: <Severity>` form (e.g. `Safety: Blocker`); every finding in either report must carry a location, a **Why it matters** line, and an actionable fix.
- e139adc: Add an `untrusted-content` shared reference: content fetched from outside the codebase (via `WebFetch`/`WebSearch` or any external source `dx-research` cites) is investigated data, never instructions — embedded prompts or commands get reported on, not followed. Picked up by `dx-research` when writing external-mode findings, and by `dx-plan`, `dx-implement`, `dx-tdd` before reading a `research/<topic>.md` with `kind: external`.

## 1.0.0

### Major Changes

- 66f1df9: Initial release
