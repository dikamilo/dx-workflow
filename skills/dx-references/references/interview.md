# Interview — the alignment loop

Misalignment is the dominant failure mode. The cure is an interview: **one question at a time**, walking a decision tree until every branch resolves. Loaded by `dx-frame` (framing) and `dx-plan` (solution design).

## The loop
1. Ask **exactly one** question. Never batch a form.
2. Offer **2-4 concrete options**, one marked as the **recommendation** with a one-line rationale — never a single suggestion dressed as a question. A lone "recommended answer" hides the actual trade-off and gives the user nothing to redirect to but "no"; a short option set makes the alternatives visible and lets them accept the recommendation with a word or pick another with just as little friction.
3. **If the codebase can answer it, explore instead of asking.** Don't ask what a file, a `research/` doc, a `frame.md`, or the glossary already settles.
4. Take the answer, resolve that branch, and let it determine the next question. Stop when no open branch remains.

## Question scaling
The *expected* number of questions scales with complexity, then scales **down** by what upstream artifacts already settled:

| Upstream provided | Ask about |
|---|---|
| Task description only | full — trivial 0–2 / low 4–6 / medium 7–10 / high 11–15 |
| + research | skip what any research file already answers |
| + frame.md | skip all problem-framing questions |
| + frame + research | solution-design only |
| + parent effort's research + frame | solution-design only (effort-level upstream inherited) |

Every artifact passed in — including a parent effort's — is a decision already made; don't re-ask it.

## Framing vs solution design
- **`dx-frame`** runs the deep interview on *problem framing + alternatives* → `frame.md`.
- **`dx-plan`** interviews on *solution design*. When no `frame.md` exists, it front-loads the framing questions `dx-frame` would have asked, then continues into solution design. So the interview always happens; `dx-frame` just makes the framing half explicit and skippable.
