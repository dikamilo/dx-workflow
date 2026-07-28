---
"dx-workflow": minor
---

Add `dx-brainstorm` — a third discovery entry that runs before `/dx-new` on a raw idea: it questions whether the problem is real, weighs at least two alternatives against a priced do-nothing, and converges on one of four exit ramps (nothing worth building, already covered, one change, or an effort). Deciding to build nothing is a terminal outcome that writes nothing. When it does route, it writes the container's identity file plus a new root-level `brainstorm.md` artifact carrying the alternatives weighed and the scope explicitly rejected, then prints the next command and stops.
