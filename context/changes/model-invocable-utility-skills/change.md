---
change_id: model-invocable-utility-skills
title: Allow dx-new, dx-archive, dx-lesson, and dx-standards-update to run model-invoked
type: feature
effort: null
slice: null
status: implemented
created: 2026-09-01
updated: 2026-09-01
archived_at: null
---

## Notes

Today `dx-new`, `dx-archive`, `dx-lesson`, and `dx-standards-update` are user-invoked only
(`disable-model-invocation: true`), so skills that discover work as a side effect —
`dx-brainstorm`, `dx-diagnose`, `dx-refactor-discover`, sometimes `dx-implement` — can't
always create the container themselves. In practice this is inconsistent already: some of
these discovery skills invoke `dx-references` to look up the change/effort schema and build
the container inline, others just print an instruction for the user to run the skill by hand.
Goal: let a calling skill invoke these four directly as a side effect, closing that gap,
while still supporting direct user invocation as today.

`dx-new` is the priority — it's the router most of these discovery skills need mid-flow.
`dx-archive`, `dx-lesson`, `dx-standards-update` follow in the same change since the fix is
the same shape across all four (drop/adjust `disable-model-invocation`, confirm each skill's
body already behaves correctly when driven by a model caller rather than a human).

Scope note: this changes `disable-model-invocation` frontmatter behavior, which is exactly
the split the glossary's **Skill** entry describes (user-invoked vs model-invoked) — worth a
look at whether that definition needs updating alongside the skills themselves.
