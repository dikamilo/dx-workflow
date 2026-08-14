---
created: 2026-08-14
---

# Brainstorm — refactor-discover-promote-many-sketch

## The question

When `/dx-refactor-discover` promotes multiple findings at once, does the interface-exploration
step ("Design it twice") ever run, and does its output reach the `/dx-plan` run for each resulting
slice — or does that path skip the exploration entirely, leaving `/dx-plan` to design refactor
interfaces from a bare one-line shape description with no comparison of alternatives?

## Alternatives weighed

**Loop the offer inside `dx-refactor-discover`, fix the propagation hop (chosen).** Offer §4 per
finding (or as a batch pick) before composing the §5 "Many" seed summary, and trace/fix how that
seed summary's sketches survive `dx-new` (effort creation) → `dx-roadmap` → `dx-new <effort-id>
<slice-n>` (child creation) so the right sketch lands with the right slice. Keeps the sub-agent
exploration machinery single-consumer, matching the prior change's explicit decision
(`context/archive/2026-08-13-refactor-discover-principles/plan.md`: *"Not a second reference: one
consumer... the other four consumers load no sub-agent machinery"*). Surgical — the gap is a missing
loop and an unverified hop, not a missing capability.

**Give `dx-plan` its own fallback exploration.** Extract the forcing-constraint sub-agent pattern
into a shared reference so `/dx-plan` can run it itself on any `type: refactor` change lacking an
upstream sketch — would also cover refactors that never went through `dx-refactor-discover` at all.
Rejected: reopens a decision the prior change closed on purpose, adds a second reference and a bigger
blast radius (`DESIGN.md`, docs, every refactor-type plan run now carries the machinery), and doesn't
fit the actual complaint — the complaint is a broken handoff on one known path, not a missing
capability on all paths.

**Do nothing, record a lesson only (priced).** The gap only bites the multi-select (effort) path —
arguably the higher-surface-area case `Design it twice` was built to protect most, since an effort
promotes several deepenings at once. Cost lands later as rework once `/dx-plan` commits to a shape
picked off a bare `Shape: before → after` line and it turns out wrong mid-implementation. Rejected:
the user is hitting this on live work now, not hypothetically, and the fix is scoped to one path in
one skill plus a propagation check — not expensive enough to defer.

## Conclusion & route

**Route: one change** (bundling test: would "loop the offer" function without "fix the propagation
hop"? No — sketches generated but lost before reaching `/dx-plan` are as useless as never generating
them; and fixing the hop with nothing to propagate is a no-op). `type: feature` — this extends
behavior down a path that was never wired, not a regression from something that previously worked.

**Riskiest assumption:** that `dx-roadmap` / `dx-new <effort-id> <slice-n>`'s child-creation flow can
route one specific finding's sketch to the one child change it belongs to, without duplicating the
seed-research mechanism `dx-new` already has for single promotions. Cheapest test: during planning,
read exactly what `dx-new`'s "Promoted entries" section does today for a single-change promotion and
mirror that shape for the effort path rather than inventing new mechanics.

**What breaks if this succeeds:** an unbounded multi-select could now ask §4 to spawn 3–4 sub-agents
*per finding*, in parallel, for every finding the user opts to explore. Needs an explicit safeguard
(sequential-per-finding, a cap, or a narrower explore-some/skip-some choice) so a large promote-many
batch doesn't fan out uncontrolled — carried into `change.md` as a design risk for planning to size.

**Caveat left standing:** whether the loop should be a per-finding prompt (sequential) or one batched
"pick which of these to sketch" question is not settled here — routing-sufficient, not solution-ready;
`/dx-frame` or `/dx-plan`'s interview decides the mechanics.

## Resolved unknowns

| Question | Answer |
|---|---|
| Which direction should the fix take? | Loop the Design-it-twice offer inside `dx-refactor-discover`; do not extract the sub-agent machinery into a shared reference for `dx-plan` |
| Is `dx-plan`'s reference loading (design-lenses, module-design) still broken? | No — already fixed on `main` (PR #12, `74c8592`); out of scope here |
| Single change or an effort? | Single change — the loop fix and the propagation fix aren't independently shippable |
| `type` to stamp? | `feature` |

## Not doing

- Extracting the forcing-constraint sub-agent pattern into a shared `dx-references` topic so `dx-plan`
  can run its own fallback exploration — reopens the prior change's deliberate single-consumer
  decision; not what the reported gap actually needs.
- Any change to `dx-plan`'s reference loading (`design-lenses`, `module-design`) — already correct.
- Widening `dx-impl-review` / `dx-plan-review` to load the design-principle vocabulary — out of scope
  per the prior change (`2026-08-13-refactor-discover-principles/frame.md`), still stands, not
  reopened here.
- Deciding the exact loop mechanics (sequential-per-finding vs. one batched pick) and the sub-agent
  fan-out safeguard — named as an open risk, left for `/dx-frame` or `/dx-plan`'s interview.
