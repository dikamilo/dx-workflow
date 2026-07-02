---
name: dx-research
description: Investigate one topic — codebase or external doc — and write it down with provenance for a plan to lean on.
disable-model-invocation: true
argument-hint: "[container-id topic [--url=…] [--kind=codebase|external]]"
---

# dx-research

Investigate **one topic** and record it as a durable, provenance-stamped artifact a later `dx-frame`/`dx-plan` can trust without re-deriving. Research is a **deliberate act you initiate** — one invocation, one topic, one mode. Read `foundation/glossary.md` for naming (a one-line habit — no section).

**Guard.** Resolve `<container-id>` first:
- A change → `context/changes/<id>/`; an effort → `context/efforts/<id>/`; the literal `foundation` → `context/foundation/` (durable, reusable investigations — the natural home for external-doc research read by every plan).
- Missing container → tell the user to run `/dx-new` first, then stop. Under `context/archive/` → refuse; an archived container is done.

The file lands at `<container>/research/<topic-slug>.md`. No index — `ls research/` derives the list. If the file already exists this is a **refresh**: re-run and re-stamp its frontmatter.

## 1 — Pick the mode from the input

- **External** when a `--url=`, `--kind=external`, or a bare URL is present → §3.
- **Codebase** otherwise (default) → §2.

If the topic is a refactor investigation (or the container is a `type: refactor` change/effort), invoke `dx-references` with `module-design` and use its vocabulary — deep modules, seams, the deletion test.

## 2 — Codebase mode

Spawn built-in **`Explore`** subagents (fan-out, read-only — no dedicated agents), each on a distinct facet of the topic; request **`file:line`** references, not just definitions. Wait for all to return, then synthesize: answer the topic with concrete evidence and the patterns that connect the findings. Capture the current HEAD sha (`git rev-parse HEAD`) for `git_commit`.

## 3 — External mode

Use **`WebFetch`**/**`WebSearch`** (no MCP required). Synthesize a summary with **inline citations and a fetch date**. `source` is the URL; `git_commit` is `null`.

## 4 — Write the research file

Open with provenance frontmatter exactly:

```yaml
---
topic: <topic-slug>
kind: codebase          # codebase | external
source: <repo/codebase, or the URL>
gathered: <today>
git_commit: <HEAD sha>  # codebase mode only; null in external mode
---
```

Then the synthesized findings in markdown — no HTML, no sidecar state. One file = one topic = one mode; keep separate topics in separate files.

## Done when

The file exists at `<container>/research/<topic-slug>.md` with correct provenance and evidence-backed findings. Then print and stop — show only the line matching the container type you resolved in the Guard, an effort never goes straight to `/dx-plan`:

```
Research written: <container>/research/<topic-slug>.md
Next: /dx-research <container-id> <another-topic>   — investigate another facet
  or: /dx-frame <id>   → /dx-plan <id>       # change
  or: /dx-frame <id>   → /dx-roadmap <id>    # effort
  (foundation: no owning container — read automatically by future plans)
```

Stop. Do not chain into another skill.
