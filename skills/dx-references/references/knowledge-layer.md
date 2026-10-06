# Knowledge layer — standards, lessons & glossary

Three markdown artifacts that look alike (rules/terms) but do different jobs and have different lifecycles. Loaded by `dx-plan`, the `implementation` review Policy (via `dx-review`), `dx-standards-update`, `dx-lesson`, `dx-domain`, `dx-refactor-discover`. **No ADR register** — a decision-with-rationale is a lesson; a rule everyone follows is a standard.

| | **Standards** (`context/standards/`) | **Lessons** (`foundation/lessons.md`) | **Glossary** (`foundation/glossary.md`) |
|---|---|---|---|
| Job | Normative baseline — the rulebook | Scar tissue + load-bearing decisions | Ubiquitous language — the terms |
| Tone | "do this" | "this broke" / "we chose X over Y because Z" | "X means Y" |
| Scope | Project-wide, stable | Specific finding, append-only | Project-wide, grows as terms crystallize |
| Origin | `dx-standards-discover/-update` | `dx-review`, `dx-diagnose`, rejected refactor, recorded decision | `dx-domain-discover`, `dx-domain` |
| Lifecycle | Catalog, edited in place | Append-only; recurring ones **graduate** to a standard | Glossary-only, edited in place |
| In a plan | Matched → "Standards to apply" checklist | Surfaced → "Priors & gotchas" | Read for naming (one-line habit) |

## Matching heuristics (how `dx-plan` selects)
- **Standards** by *domain × topic*: the change's area (frontend/backend/testing/global) and what it touches (api, migrations, css, error-handling…). Pull only matching files into the plan's checklist; don't dump the whole tree.
- **Lessons** by whether the lesson's actual warned-about scenario is in play in this change — shared vocabulary with the change's title or module isn't enough. A lesson about module A only bears on a change touching module B if the change actually crosses into A's territory (calls it, depends on it, risks re-introducing the coupling); otherwise leave it out, even if both mention the same subsystem name.
- **Glossary**: read for naming and to cut verbosity — a one-line habit, not a section.

## Lesson entry shape (append-only)
```markdown
## <short title> — <date>
<what happened / what was decided>. **Why:** <the reason it matters>. **How to apply:** <the rule going forward>.
```
Two flavors: **cautionary** ("this broke because…") and **decisional** ("we chose X over Y because Z", incl. a rejected refactor: "don't re-deepen X — it's shallow on purpose because Y"). Both live here; there is no separate decision register.

## Promotion into a standard
A rule enters `context/standards/` through `dx-standards-update`, once it is "how we do it here" and not "this one time". There are two paths, and each carries its own recurrence evidence:
- **A lesson graduates.** It recurs across changes.
- **A Standard Proposal is accepted.** `dx-refactor-discover` drew it from a cause shared by at least three distinct candidates, and those candidates are the recurrence. It goes straight to `dx-standards-update` without becoming a lesson first.

## Glossary entry shape
```markdown
**<Term>**: <definition, domain-only, no implementation>.  _Avoid_: <term it's often confused with>.
```
The glossary is **never** a spec, scratch pad, or home for implementation decisions. Every skill **reads** it; only `dx-domain-discover` and `dx-domain` **write** it.
