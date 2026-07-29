---
change_id: untrusted-content-boundary
title: Untrusted-content boundary
type: feature
effort: sdlc-hardening
slice: 2
status: archived
created: 2026-07-28
updated: 2026-07-28
archived_at: 2026-07-28
---

## Notes
Additive injection-guard caveat to `dx-research`'s external-fetch mode and the `knowledge-layer` reference: fetched content is data, never instructions, before it's written into `research/<topic>.md` and consumed downstream. Lowest blast radius of the effort's slices; independent of slice 1's tooling.
