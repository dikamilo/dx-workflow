---
name: dx-domain
description: Actively sharpen the ubiquitous language in foundation/glossary.md. Use when a domain term clashes with an existing glossary definition, when the user reaches for a vague or overloaded term (an "account" that might be a Customer or a User, an "order" that might be a Cart), or when a fuzzy term finally gets pinned down during framing, planning, or implementation. Fires mid-task to capture or correct a term, then hands back.
---

# dx-domain

The **active** glossary discipline: challenge a term, sharpen it, and write it to `foundation/glossary.md` the moment it resolves. Merely *reading* the glossary for naming is a one-line habit any skill does — this skill is for **changing the model**, not consuming it. It fires on three triggers during any work:

- **Clash** — a term contradicts an existing glossary definition. Call it out at once: *"The glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"*
- **Fuzzy** — a vague or overloaded term is in play. Propose one precise canonical term: *"You said 'account' — is that the Customer or the User? Those are different things."*
- **Resolved** — a term gets nailed down during framing/design/implementation. Capture it immediately, before the moment passes.

**Guard.** Write only `foundation/glossary.md`. If `context/foundation/` doesn't exist, the project isn't scaffolded — say so and suggest `/dx-init`. Create `glossary.md` lazily on the first resolved term.

## Sharpen before you write (invoke `dx-references` with `knowledge-layer`)

Load `knowledge-layer` for the glossary entry shape and the standards/lessons/glossary distinctions. Then force precision:

- **Invent a concrete edge-case scenario** that probes the boundary between two concepts and makes the user commit. Vague terms survive in the abstract and break on specifics.
- **Cross-check the code.** If what the user says contradicts what the code does, surface it: *"Your code cancels whole Orders, but you just said partial cancellation exists — which is right?"*
- **Be opinionated.** When several words mean one thing, pick the best and list the rest under `_Avoid_`.

## Write inline, glossary-only

The moment a term resolves, add or edit its entry in `foundation/glossary.md` using the `knowledge-layer` entry shape — definitional, domain-only, one or two sentences (what it IS, not what it does). Don't batch. Skip general programming concepts (timeouts, retries, error types) — only terms unique to this project's domain belong.

The file is a **glossary and nothing else**: never a spec, a scratch pad, or a home for implementation decisions. Only `dx-domain` and `dx-domain-discover` write it.

## Done when

The resolved term is written to `foundation/glossary.md` (clash corrected, fuzzy term made canonical, or new term captured). Because this fired mid-task, **suggest returning to the interrupted work — don't silently resume it and don't auto-chain**:

```
Glossary updated: foundation/glossary.md  (<Term>)
Back to: <the task this interrupted>
```
