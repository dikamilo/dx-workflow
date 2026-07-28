## Roadmap
> A slice is **done** when its child change is archived (`archived_at` set) —
> derived by scanning the child, never a hand-checked box.

### Slice 1: Content lint gate
- change: content-lint-gate
- why: No CI or lint infra exists yet in this repo; this is the highest-effort, most novel slice and its mechanical checks (frontmatter shape, description quoting, body budget, `dx-references` topic resolution, docs-sync) guard every doc/reference edit that follows it.
- next: `/dx-new sdlc-hardening 1`
### Slice 2: Untrusted-content boundary
- change: untrusted-content-boundary
- why: Additive injection-guard caveat to `dx-research`'s external-fetch mode and downstream consumers; lowest blast radius, independent of slice 1's tooling.
- next: `/dx-new sdlc-hardening 2`
### Slice 3: Interview challenger pass
- change: interview-challenger
- why: Additive adversarial-check step in the shared `interview` reference; low blast radius, independent of slice 2.
- next: `/dx-new sdlc-hardening 3`
### Slice 4: Review severity unification
- change: review-severity-unification
- why: Edits the shared `review-report.md`, consumed by both `dx-plan-review` and `dx-impl-review` — higher blast radius than slices 2-3, sequenced after the lower-risk additive edits.
- next: `/dx-new sdlc-hardening 4`
### Slice 5: Cross-skill format reference
- change: cross-skill-format-reference
- why: Adds the format catalog to `DESIGN.md` and resolves its duplication with `review-report.md`/`effort-md.md`/`change-md.md`; sequenced right after slice 4 since both touch the same load-bearing shared references.
- next: `/dx-new sdlc-hardening 5`
### Slice 6: dx-brainstorm entry point
- change: dx-brainstorm
- why: The one slice that grows the skill count rather than tightening an existing one — highest novelty, lowest urgency; goes last, and benefits from slice 1's lint gate already existing to validate its own SKILL.md frontmatter.
- next: `/dx-new sdlc-hardening 6`
