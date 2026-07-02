# dx — maintainer orientation

This repo authors the `dx-` skill set. `DESIGN.md` is the source of truth for behavior; this file orients anyone working **on** the skills. (It is not installed with the skills — each skill ships standalone via skills.sh. The workflow's own rollback principle is written into each *target project's* `CLAUDE.md` by `dx-init`.)

## Layout

```
skills/
├── dx-references/        # loader (user-invocable:false) + references/*.md (shared docs)
└── dx-<skill>/SKILL.md   # one directory per skill
DESIGN.md                 # the design spec — authority
package.json              # install-skills / list-skills scripts (npx skills)
```

## Authoring rules (the house style)

- **Frontmatter.** `name: dx-<x>`. User-invoked skills set `disable-model-invocation: true` and get a terse human-facing description (no trigger lists → zero context load). The two model-invoked skills — `dx-diagnose`, `dx-domain` — omit that flag and keep rich trigger phrasing. `dx-references` uses `user-invocable: false` (hidden from the `/` menu, still model-reachable).
- **Body.** Short and principle-first. Leading words that recruit pretrained concepts (*tight*, *red-capable*, *tracer bullet*, *deep module*). Apply the no-op test: delete any sentence the model already obeys. Multi-step skills carry a `Done when` completion criterion.
- **Shared references** are pulled by invoking `dx-references` with a topic — never deep-link another skill's files. Add a reference to `dx-references/references/` only when ≥2 skills use it; otherwise collocate it inside its one skill.
- **Anti-ceremony.** Markdown only — no HTML, no sidecar `*.yml` state. No auto-chain: print the next command and stop. Derive, don't maintain — lists from `ls`, status from frontmatter, effort progress from child changes.

## The two-level model

`effort` ⊃ `change`, never nested. A change is one shippable unit (`change.md` + `plan.md`/`## Progress`). An effort is larger work (`effort.md` + `roadmap.md`) that decomposes into vertical slices, each spawning a flat child change that inherits the effort's research + frame. `dx-new` routes; the change lifecycle is the same either way.

## Skill index

Lifecycle: `dx-init` → `dx-new` → `dx-research?` → `dx-frame?` → `dx-plan` → `dx-plan-review?` → `dx-review-triage?` → `dx-implement`/`dx-tdd` → `dx-impl-review` → `dx-review-triage?` → `dx-archive`.
Effort: `dx-roadmap` (+ `dx-new <effort> <slice>` per slice).
Knowledge: `dx-standards-discover`, `dx-standards-update`, `dx-domain-discover`, `dx-domain`, `dx-lesson`.
Review: `dx-review-triage` — the sole skill that acts on a `plan-review`/`impl-review` finding; the gates themselves stay report-only.
Discovery entries: `dx-diagnose`, `dx-refactor-discover`.
Plumbing: `dx-references`.
