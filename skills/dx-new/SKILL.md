---
name: dx-new
description: Start a new piece of work — creates a change or an effort and points you at the next step.
argument-hint: [idea or effort/slice]
---

# dx-new — the entry point and router

Every piece of work starts here. Your one job is to pick the **container level**, create its identity file, and print the next command. You do not research, frame, or plan — you route.

**Guard.** If `context/` isn't scaffolded (no `changes/` or `efforts/`), stop and tell the user to run `/dx-init`. Never auto-create the parent tree.

## Slice of an existing effort — read the id, don't invent one

If invoked as `dx-new <effort-id> <slice-n>`, this is a **child change** — a different path from everything below. Read `context/efforts/<effort-id>/roadmap.md` and find `### Slice <slice-n>`: its `- change: <slug>` line is the id `dx-roadmap` already assigned, and the slice name is the title. Use them as-is — do not derive a new slug from scratch, that would orphan the roadmap's link. Missing effort or slice → tell the user to run `/dx-roadmap <effort-id>` first.

Create `context/changes/<slug>/change.md` with `effort: <effort-id>`, `slice: <slice-n>`, `status: new`. Default `type: feature` unless `effort.md`'s `## Notes` carries the marker line `Refactor effort — findings promoted from /dx-refactor-discover.` (written once at effort creation — see Promoted entries), then `type: refactor`. Fill every other frontmatter field the schema defines — invoke `dx-references` with topic `change-md` for the exact shape. The child **inherits** the effort's `research/` and `frame.md` in place (nothing is copied) — its problem framing is already settled, so skip straight to `/dx-plan <slug>`. Optionally run `/dx-frame <slug>` first instead: in slice mode it adds only this slice's own `## User cases` to a small `frame.md` of its own, without reopening the inherited framing.

## Name it (change or effort, not a slice)

Derive a kebab-case slug from the idea (`Add Google sign-in` → `oauth-login`). If `foundation/glossary.md` exists, read it first and prefer its terms so the id matches the project's language. Reject a slug that collides with an existing change/effort/archive folder — ask for another.

## Pick the level

Infer from size and clarity; when it's a coin-flip, ask one question and stop.

- **Small / clear → a change.** A single shippable unit. Create `context/changes/<id>/change.md`. Set `type` (feature | defect | refactor | migration — default feature), `effort: null`, `slice: null`, `status: new`, plus every other field the schema defines. Invoke `dx-references` with topic `change-md` for the exact shape.
- **Large / decomposes into slices → an effort.** Work that *produces* changes. Create `context/efforts/<id>/effort.md` with a one-paragraph `## Goal`, `status: new`, plus every other field the schema defines. Invoke `dx-references` with topic `effort-md` for the exact shape.

Never nest a change inside a change. Large work is an effort that spawns flat child changes.

## Promoted entries

`dx-diagnose`, `dx-refactor-discover`, and `dx-brainstorm` are separate discovery skills that hand a finding here. When invoked with a pre-seeded `diagnosis.md` (bug) or refactor finding, drop it into the new change's folder as its seed research and set `type` accordingly (`defect` / `refactor`). Don't re-derive what the discovery skill already found. `dx-brainstorm` creates its own container, so when a brainstorm already ran the bundling test the change-vs-effort level is **handed over, not re-derived** — you won't be routing that work at all.

**Multi-finding effort seed.** An argument opening with the heading `## Refactor opportunities (from /dx-refactor-discover)` is `dx-refactor-discover`'s promote-many output — an effort's worth of findings, not a short idea to slugify. Derive the effort slug via **Name it**, fed a short descriptor built from the seed's closing `Start with:` line (e.g. `refactor: <top-pick module> + N other modules`), not the whole blob. Write `context/efforts/<id>/effort.md` (topic `effort-md`) with a one-sentence `## Goal` citing that `Start with:` line, plus the `## Notes` marker `Refactor effort — findings promoted from /dx-refactor-discover.` — written once; this is the fact the slice-creation check above reads. Then write one `context/efforts/<id>/research/<topic>.md` per numbered finding: provenance frontmatter (`topic`, `kind: codebase`, `source` — the file(s) from that finding's "What & where", `gathered` — today, `git_commit` — `git rev-parse HEAD`) and that finding's entry (title, What & where, Why, Shape, Proposed, Dependency category) verbatim as the body, minus its list numeral — a standalone file has nothing to be numbered against — with its `Sketch:` line kept only when the finding carries one. Slug each topic from the finding's module/file name, not its deepening verb, collision-checked the same way **Name it** checks any slug. Any other argument — including a long one — still falls through to **Name it** / **Pick the level** unchanged.

## Done when

The identity file exists with every frontmatter field filled (plus any seeded finding). Print the exact next command and **stop** — never run it:

```
Change:       Next: /dx-research <id> <topic>   → /dx-frame <id>   → /dx-plan <id>
              (both optional — small/clear work can go straight to /dx-plan <id>)
Effort:       Next: /dx-research <id> <topic>   → /dx-frame <id>   → /dx-roadmap <id>
Child change: Next: /dx-frame <slug>   → /dx-plan <slug>    (frame optional — adds this slice's own user cases)
```

Stop. Do not chain into another skill.
