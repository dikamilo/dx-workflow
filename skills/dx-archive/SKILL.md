---
name: dx-archive
description: Archive a completed change or effort — move its folder to context/archive/ and stamp it archived.
argument-hint: [change-id or effort-id]
---

# dx-archive

Retire a finished container. One id in, one folder moved, one stamp written. No registry — the archive is just where done work lives.

**Guard.** If the id resolves to nothing, or the folder can't move cleanly, do nothing and say why. Never half-move.

## Resolve

The argument is one id. Find its home:

- `context/changes/<id>/` → it's a **change**.
- `context/efforts/<id>/` → it's an **effort**.
- Neither, or both → **fail loud**: print what you looked for and stop. (Already under `context/archive/`? Say it's already archived.)

## Effort gate — children first

An effort is done only when **every child change is already archived**. Before moving an effort, read its `roadmap.md`, and for each linked child change check for `archived_at` (derive it — scan the child's `change.md`, don't trust a checkbox). If any child is still open, **list them and ask** before continuing. The user may override.

## Review gate — unresolved findings

For a **change**, check `reviews/impl-review.md`. If it has any finding with `Resolution: PENDING`, warn — "N unresolved impl-review finding(s) — /dx-review-triage <change-id> impl to address them first" — and ask whether to archive anyway. The user may override.

## Move and stamp

1. Destination: `context/archive/<today>-<id>/` where `<today>` is `date +%F`. If it already exists, fail loud and stop.
2. Stamp the moved container's `change.md` (or `effort.md`): set `status: archived` and `archived_at:` to today's date (`date +%F`, same format as `created`/`updated` — no other field in the schema carries a finer timestamp); bump `updated:`. Leave every other field alone. For the exact schema, invoke `dx-references` with topic `change-md` (a change) or `effort-md` (an effort).
3. Move the whole folder: prefer `git mv` so history follows; fall back to `mv` (warn) if git is unavailable. Confirm the source is gone and the destination exists — if not, print a diagnostic and stop.

## Done when

The folder lives at `context/archive/<today>-<id>/`, its identity file reads `status: archived` with `archived_at` set, and nothing remains under the old path. Print:

```
✓ Archived <id> → context/archive/<today>-<id>/
```

If it was an effort, add one line noting how many child changes it closed. Then suggest a next step (`/dx-new <idea>` to start fresh) and stop. Do not chain.
