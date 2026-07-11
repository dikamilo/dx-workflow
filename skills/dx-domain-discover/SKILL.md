---
name: dx-domain-discover
description: Mine a brownfield codebase for its domain vocabulary and seed the project glossary.
disable-model-invocation: true
argument-hint: [module or path]
---

# dx-domain-discover

Bootstrap `foundation/glossary.md` from an existing codebase. Mine the code for the **ubiquitous language** already living in it — the terms the domain uses — and write them down so every later skill names things consistently. This is the one-time (per-module) **extraction** pass; `/dx-domain` keeps the glossary sharp during ongoing work. Re-runnable: pass `[module or path]` to scope the sweep to one area and grow the glossary incrementally.

**Guard.** `foundation/glossary.md` must exist (seeded by `/dx-init`) — if it is missing, tell the user to run `/dx-init` first, then stop. Read the current glossary before mining so you extend it, never clobber it.

Invoke `dx-references` with `knowledge-layer` for the **glossary entry shape** and the standards/lessons/glossary distinction — this skill writes the glossary and nothing else.

## 1 — Mine the vocabulary

Spawn built-in **`Explore`** subagents (fan-out, read-only), scoped to `[module or path]` when given, else the whole repo. Harvest candidate domain terms from:
- **Identifiers** — type/class/entity names, enums, key function and method names.
- **Module and package names** — the boundaries the code already draws.
- **Comments and existing docs** — READMEs, ADRs, doc-comments where terms get defined in prose.

Keep only terms **specific to this domain**. Drop general programming concepts (cache, retry, handler, DTO) — they are not ubiquitous language.

## 2 — Resolve and write

For each surviving term, write a glossary entry in the shape from `knowledge-layer` (`**Term**: definition — domain-only, no implementation. _Avoid_: confusable term`). Be opinionated: when several names map to one concept, pick one and list the rest under `_Avoid_`.

**Surface, don't average.** When you find a **term clash** (two definitions for one word) or a **fuzzy/overloaded** term, do not guess — list it and ask the user to resolve it, then record their decision. Keep the file glossary-ONLY: no implementation detail, no rationale, no decisions (those are lessons).

## Done when

New and sharpened terms are in `foundation/glossary.md` and every clash was resolved by the user. Print a short summary — terms added, terms already present, clashes resolved — then:

```
Glossary seeded: foundation/glossary.md
Next: /dx-domain-discover <another-module>   — extend the sweep to another area
  or: /dx-domain                             — keep the glossary sharp as you work
```

Stop. Do not chain into another skill.
