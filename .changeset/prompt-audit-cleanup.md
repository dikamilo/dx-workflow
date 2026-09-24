---
"dx-workflow": patch
---

Prompt-audit cleanup: fix the prior-work search glob in dx-plan and dx-research (it pointed at `research.md` files that never exist; research lives at `research/<topic>.md`, including efforts); drop the maintainer-only "Minimalist fallback" aside from the `knowledge-layer` reference; replace dx-plan-review's anti-formatting prohibitions with the `review-report` format they duplicated; restate dx-diagnose's loop emphasis without pressure language and group its description's trigger synonyms into categories; make the `interview` reference's cold-start question count qualitative instead of numeric tiers; and remove small leftovers (dx-refactor-discover's "no clipboard" and maintainer-only rationale, dx-impl-review's redundant "be specific" line, dx-review-triage's architecture aside).
