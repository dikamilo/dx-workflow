# Policy-driven review

`/dx-review implementation <change-id>` looks like a single command, but it is two things working together: a skill that knows *how* to run a review, and a file in your project that says *what* this review checks. This page explains that split, why the criteria live in a file you own rather than inside the skill, and what the design gives up in exchange.

## The problem: one skill per kind of review

A review gate does two jobs. One is generic machinery: find the work being reviewed, refuse it if it isn't ready, read the right files, fan the checking out to subagents, write a report in a fixed shape, and hand off to triage. The other is the actual judgement: which dimensions to look at, what counts as a failure, and what happens on a pass.

When both jobs live in one skill, every new kind of review means writing a new skill — with its own docs, its own install entry and its own release. The skill count grows with each concern a team cares about, and the criteria themselves stay out of reach. A project that wants its post-implementation review to also check accessibility, or a team that wants a security review at all, has to fork a skill.

## Mechanism in the skill, criteria in the Policy

dx- splits the two jobs along that line.

**`/dx-review` holds the mechanism.** It is the same for every review: resolving the policy ID and the target, refusing archived work, reading the glossary, applying your custom instructions, fanning out subagents, writing the report, confirming before it overwrites a report with open findings, invoking `/dx-diagnose` on a regression, offering a lesson or a standard update, and printing the next commands.

**A Policy holds the criteria.** A Policy is a Markdown file at `context/workflow/review-policies/<policy-id>.md`, and its file name is its ID. It declares which targets it accepts, its preconditions, what to load, its dimensions and the tag its findings carry, any extra checks, what a pass sets, and extra `Next:` lines. Three Policies ship built in. `plan` is the optional pre-implementation gate: it needs a Change with a `plan.md`, reviews Substance, Feasibility, Architectural fitness and Standards-fit, and sets no status. `implementation` is the post-implementation gate: its preconditions require a finished `## Progress`, its four dimensions are Plan-Drift, Safety, Patterns and Standards, its extra check is the behavior-preserving gate for `type: refactor`, and its `## On pass` sets `status: reviewed`. `test-strategy` is the hybrid: it accepts a container or a folder, and asks whether the testing strategy matches the problem class of the code under test (`Strategy-fit`, plus `Frontend & e2e` and `Pathological tests`, which are general-knowledge heuristics rather than researched rules).

So a new kind of review is a new file, not a new skill. You copy `policy-template.md`, write your dimensions, and run `/dx-review <your-id> <change-id>`. Triage needs no change either: `/dx-review-triage <container-id> <policy-id>` reads `reviews/<policy-id>.md`, and decides from each finding's location what to load and whether a fix gets committed, instead of branching on a fixed list of review types.

The split also keeps reviews honest about what they promised. Since the mechanism is shared, every Policy gets the same guarantees for free — a report in one shape, findings that never renumber, a refusal instead of a guess, and no edits to the work under review.

## Targets decide the output

A Policy's one required field is `targets`, and it takes one of three values:

- `container` — the review runs on a Change or an Effort, named by its ID.
- `explore` — the review runs over the repo or chosen folders, with no container.
- `both` — the Policy accepts either.

A Policy never declares its output. The output follows from the target: a container run always writes a durable report of numbered Findings to `reviews/<policy-id>.md`, and an Explore run presents ephemeral Candidates instead. Letting a Policy choose would let two Policies give the same kind of run different outputs, and triage could no longer rely on finding a report where the container and policy ID say it is.

A run on a target the Policy doesn't accept is refused, naming the Policy and the targets it accepts. An Explore run on a Policy with no `## Candidates` section is refused too, naming the section.

## Explore runs: Candidates, not Findings

The two kinds of run keep separate vocabularies. A container run reviews finished work and writes numbered **Findings** that triage resolves. An Explore run goes hunting with no container to anchor it, so it presents **Candidates**: ephemeral, ranked, inline, each a proposal rather than a defect, and a file only if you promote one. The mechanism for exploring lives in `/dx-review`, as with everything shared. It reads recent `git log` first unless the Policy sets `recency: off`, makes one Candidate per broken rule with a site count instead of one per site, skips what `lessons.md` records as rejected, and ends with one question about which to promote. The Policy's `## Candidates` section declares only what differs: the entry fields, the default change `type`, and optional `facets:` and `recency:`.

Promotion follows one generic route. One Candidate becomes a change with a seeded `research/` file. Several are printed as a seed block headed `## <Policy> candidates (from /dx-review <policy-id>)`, which `/dx-new` parses into an effort with one research file per entry. Standard Proposals, which `/dx-refactor-discover` makes, are not part of this route.

## Questions: gates that block

Some judgements depend on something only the user knows: whether a mocked step is expensive, or whether orchestration changes often. A Policy's optional `## Questions` section declares **gates** for those, each tied to a stage (`after: scan` or `analysis`), to the observation that triggers it (`when:`) and to what it holds back (`blocks:`). The skill asks a stage's triggered gates as one round and judges nothing they block until you answer.

There is deliberately no default answer. A gate you skip, or one nobody is present to answer, leaves its unit `unconfirmed`: reported with the assumption stated and no verdict, no Finding and no Candidate. A silent default would produce a confident verdict the review hadn't earned. Container runs and Explore runs both apply gates, and your custom instructions can pre-answer one. The report's optional `## Reviewed` section lists every unit checked, including the clean and `unconfirmed` ones, so coverage stays visible even though Findings are mismatch-only.

## Shipped once, then yours

`/dx-init` copies the built-in Policies and the two templates into your project, and only the files that are missing. From then on they are yours: edit `implementation.md`, `plan.md` or `test-strategy.md` to tighten a dimension, delete a check that doesn't apply, add Policies beside it. A re-run of `/dx-init` never overwrites them.

The other side of that is deliberate: **a fix to a shipped Policy never reaches your copy on its own.** When a dx- release improves a built-in Policy, your project keeps running the version it copied; and a project that predates a new built-in, like `plan.md` or `test-strategy.md`, doesn't have it until you re-run `/dx-init`, which seeds only the missing files. The same goes for the two templates: a project seeded before `## Questions`, `## Candidates` and `## Reviewed` existed keeps templates that don't document them, so compare `policy-template.md` and `report-template.md` with the shipped ones by hand. To pick the fix up, compare your copy with the one in the new release and merge it by hand. The alternative — updating Policies in place on upgrade — would silently discard the edits that make Policies worth owning.

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
- [Review and triage](../tutorials/review-and-triage.md) — the built-in `plan` and `implementation` reviews and the triage loop.
- [Review a folder with test-strategy](../tutorials/review-a-folder-with-test-strategy.md) — an Explore run, its gates and promotion, end to end.
- [Directory layout](directory-layout.md) — where `context/workflow/review-policies/` sits.
- [The knowledge layer](knowledge-layer.md) — why a Policy is not a Standard: a Standard is a rule your code follows, a Policy defines what one review checks.
- [Skills reference](../reference/skills.md) — `/dx-review`, `/dx-review-triage` and `/dx-init`.
