# Policy-driven review

`/dx-review implementation <change-id>` looks like a single command, but it is two things working together: a skill that knows *how* to run a review, and a file in your project that says *what* this review checks. This page explains that split, why the criteria live in a file you own rather than inside the skill, and what the design gives up in exchange.

## The problem: one skill per kind of review

A review gate does two jobs. One is generic machinery: find the work being reviewed, refuse it if it isn't ready, read the right files, fan the checking out to subagents, write a report in a fixed shape, and hand off to triage. The other is the actual judgement: which dimensions to look at, what counts as a failure, and what happens on a pass.

When both jobs live in one skill, every new kind of review means writing a new skill — with its own docs, its own install entry and its own release. The skill count grows with each concern a team cares about, and the criteria themselves stay out of reach. A project that wants its post-implementation review to also check accessibility, or a team that wants a security review at all, has to fork a skill.

## Mechanism in the skill, criteria in the Policy

dx- splits the two jobs along that line.

**`/dx-review` holds the mechanism.** It is the same for every review: resolving the policy ID and the target, refusing archived work, reading the glossary, applying your custom instructions, fanning out subagents, writing the report, confirming before it overwrites a report with open findings, invoking `/dx-diagnose` on a regression, offering a lesson or a standard update, and printing the next commands.

**A Policy holds the criteria.** A Policy is a Markdown file at `context/workflow/review-policies/<policy-id>.md`, and its file name is its ID. It declares which targets it accepts, its preconditions, what to load, its dimensions and the tag its findings carry, any extra checks, what a pass sets, and extra `Next:` lines. The built-in `implementation` Policy is the post-implementation gate: its preconditions require a finished `## Progress`, its four dimensions are Plan-Drift, Safety, Patterns and Standards, its extra check is the behavior-preserving gate for `type: refactor`, and its `## On pass` sets `status: reviewed`.

So a new kind of review is a new file, not a new skill. You copy `policy-template.md`, write your dimensions, and run `/dx-review <your-id> <change-id>`. Triage needs no change either: `/dx-review-triage <container-id> <policy-id>` reads `reviews/<policy-id>.md`, and decides from each finding's location what to load and whether a fix gets committed, instead of branching on a fixed list of review types.

The split also keeps reviews honest about what they promised. Since the mechanism is shared, every Policy gets the same guarantees for free — a report in one shape, findings that never renumber, a refusal instead of a guess, and no edits to the work under review.

## Targets decide the output

A Policy's one required field is `targets`, and it takes one of three values:

- `container` — the review runs on a Change or an Effort, named by its ID.
- `explore` — the review runs over the repo or chosen folders, with no container.
- `both` — the Policy accepts either.

A Policy never declares its output. The output follows from the target: a container run always writes a durable report of numbered Findings to `reviews/<policy-id>.md`, and an Explore run presents ephemeral Candidates instead. Letting a Policy choose would let two Policies give the same kind of run different outputs, and triage could no longer rely on finding a report where the container and policy ID say it is.

Today only container runs exist. The `explore` and `both` values are already part of the template so Policies can be written against the final shape, but a run with no container is refused, naming the Policy and the targets it accepts.

## Shipped once, then yours

`/dx-init` copies the built-in Policy and the two templates into your project, and only the files that are missing. From then on they are yours: edit `implementation.md` to tighten a dimension, delete a check that doesn't apply, add Policies beside it. A re-run of `/dx-init` never overwrites them.

The other side of that is deliberate: **a fix to a shipped Policy never reaches your copy on its own.** When a dx- release improves `implementation.md`, your project keeps running the version it copied. To pick the fix up, compare your copy with the one in the new release and merge it by hand. The alternative — updating Policies in place on upgrade — would silently discard the edits that make Policies worth owning.

## Nothing lints a Policy

The skills themselves pass through a lint gate before every release. Policies don't: they are files in your project, not part of the skill set, so nothing checks their shape mechanically. `policy-template.md` is the only guardrail, which is why it spells out every section and heading.

`/dx-review` still refuses the cases it can see — a missing or invalid `targets`, an unknown ID, a failing precondition. A Policy that is well-formed but vague, though, simply produces a vague review. When a review starts missing things, read the Policy before you suspect the skill.

## What it costs

- **Upgrades are manual for Policies.** You trade automatic fixes for edits that stick.
- **No mechanical check of your Policies.** The template carries the shape; you carry its correctness.
- **One more folder.** `context/workflow/` exists only to hold review Policies and their templates, alongside `foundation/` and `standards/`.

In exchange, the set of reviews grows with your project rather than with the skill set, and the criteria for every review sit in a file you can read, diff and change.

## Related

- [Write a review policy](../tutorials/write-a-review-policy.md) — add a `security` Policy and run it end to end.
- [Review and triage](../tutorials/review-and-triage.md) — the built-in `implementation` review and the triage loop.
- [Directory layout](directory-layout.md) — where `context/workflow/review-policies/` sits.
- [The knowledge layer](knowledge-layer.md) — why a Policy is not a Standard: a Standard is a rule your code follows, a Policy defines what one review checks.
- [Skills reference](../reference/skills.md) — `/dx-review`, `/dx-review-triage` and `/dx-init`.
