---
"dx-workflow": patch
---

`dx-new`, `dx-archive`, `dx-lesson`, and `dx-standards-update` drop `disable-model-invocation:
true`, so a calling skill (`dx-brainstorm`, `dx-diagnose`, `dx-refactor-discover`, and future
callers) can reach them by explicit named invocation — the same mechanism `dx-references` already
relies on. Descriptions stay untouched (terse, human-facing), so nothing changes about how or when
they fire from raw user chat; this only opens a previously-closed path for a calling skill's
instructions to invoke them directly. Direct `/dx-new`, `/dx-archive`, `/dx-lesson`,
`/dx-standards-update` typed-command usage is unchanged.
