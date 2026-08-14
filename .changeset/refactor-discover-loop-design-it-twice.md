---
"dx-workflow": minor
---

Loop `dx-refactor-discover`'s "design it twice" offer (§4) across a multi-select promote. Picking
exactly one finding keeps today's plain yes/no. Picking more than one no longer skips straight to §5's
"Many" case without a chance to sketch — it asks a single batched question first ("sketch any of these
before promoting?", options *none* / *all* / *specific ones*, recommending just the top pick), then
runs the existing frame → spawn 3–4 → compare → stop-and-ask loop once per selected finding,
**sequentially** — never spawning the next finding's sub-agents before the current finding's sketch is
confirmed. This is the fan-out safeguard: at most one finding's batch of 3–4 `Plan` subagents is ever
in flight, no matter how many findings were promoted, with no arbitrary numeric cap to invent or
maintain. §5's "Many" seed-summary bullet needed no edit — its wording ("plus the chosen sketch for any
finding §4 explored") was already plural-ready.
