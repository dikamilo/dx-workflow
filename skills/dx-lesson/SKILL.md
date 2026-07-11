---
name: dx-lesson
description: Record one finding — a warning or a decision-with-rationale — as an append-only entry in foundation/lessons.md.
disable-model-invocation: true
argument-hint: [the finding]
---

# dx-lesson

Capture **one** finding so a future change re-reads it instead of relitigating it. A lesson is scar tissue or a load-bearing decision — **a rule, not a story**. Two flavors, both belong here: **cautionary** ("this broke because…") and **decisional** ("we chose X over Y because Z", including a rejected refactor: "don't re-deepen X — it's shallow on purpose because Y"). This is the anteroom to a standard, not an ADR — the framework has no separate decision register.

**Guard.** `foundation/lessons.md` must exist (it does after `/dx-init`). If it is missing, tell the user to run `/dx-init` first. Read `foundation/glossary.md` for naming — a one-line habit, no section.

## 1 — Get the finding

Take the finding from the argument. If nothing was passed, ask what broke or what was decided, and why it matters — one question, then proceed. Don't turn a capture into an interview.

## 2 — Load the entry shape (invoke `dx-references` with `knowledge-layer`)

Use it for the lesson entry shape and to judge whether this is a lesson at all (a one-off finding is fine here; a *recurring* one is a promotion candidate — see step 4).

## 3 — Append (never rewrite)

Append to the end of `foundation/lessons.md`. **Never** edit, reorder, dedupe, or reformat existing entries — the file is append-only; that friction is the point. One entry, this shape:

```markdown
## <short title> — <YYYY-MM-DD>
<what happened / what was decided>. **Why:** <the reason it matters>. **How to apply:** <the rule going forward>.
```

Keep it tight — the title is what future skills scan first.

## 4 — Flag for promotion if it will recur

If the finding looks like it will keep coming up across changes, note it — that is the trigger for graduating it into a standard via `/dx-standards-update`. Don't promote here; lessons are the append-only home.

## Done when

The entry is the last section of `foundation/lessons.md` and existing entries are untouched. Then print and stop:

```
Lesson recorded: foundation/lessons.md — ## <short title>
Next: /dx-standards-update   — only if this will recur across changes (promote it to a standard)
```

Stop. Do not chain into another skill. One capture per invocation — batching invites half-written entries.
