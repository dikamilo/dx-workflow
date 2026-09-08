---
"dx-workflow": patch
---

dx-frame: add an optional `## User cases` section to frame.md, included only for user-facing work with more than one flow worth distinguishing (who, trigger, outcome, provenance); omitted entirely for internal/structural work. For an effort, the section is a headline sketch only (slices don't exist yet at framing time); user-case questions batch a candidate list into one question rather than asking one per flow.

dx-frame: new slice mode — running `/dx-frame` on a child change whose parent effort already has a `frame.md` skips re-framing the problem/alternatives/scope and interviews only on that slice's own user cases, writing them to a small `frame.md` of its own that's additive to the parent's sketch. `dx-new`'s child-change guidance and printed `Next:` line now offer this as an optional step before `/dx-plan`.

dx-plan: reads a slice's own `frame.md` and its parent effort's as a union. When any `## User cases` section is present and the repo already has a test setup, each phase implementing a user case gets a task asserting it; never introduces a test framework to satisfy this.
