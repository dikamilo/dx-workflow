# API & contracts — `## API & contracts`

Populates `plan.md`'s `## API & contracts` section (see `plan-template`'s conditional-sections block).

## Ask in the interview
- What's the exact shape of the new or changed endpoint, function signature, event, or message — request/response/params, stated concretely?
- Does this change what an existing caller already relies on (a removed field, a renamed param, a stricter type, a changed status code)? If so, name it as a **breaking change** rather than letting it pass as an extension.
- If breaking: who are the callers, and what's the compatibility path (versioning, a deprecation window, a dual-write period) — or is a clean break acceptable and why?

## What the section must contain
- The contract itself, concretely: the interface shape being added or changed.
- Whether it's additive or breaking — stated explicitly, never left implicit.
- For a breaking change: the affected callers and the compatibility path, or the stated reason a clean break is acceptable.
