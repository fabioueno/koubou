---
name: plan
description: >
  Load this skill first, before any reply, whenever the user brings new work: a
  feature, a change in behavior, a schema or API change, a refactor across
  files, a new project, or an idea phrased as "I want to", "let's add", "what if
  we" or "how should we". It holds the user's required planning procedure, so do
  not improvise one: do not propose a design or ask your own questions before
  loading it. It finds the facts in the repository, asks the user's decisions in
  rounds with a suggested option each, and writes a plan with slices,
  dependencies and parallel lanes. Skip it only for a typo or an obvious
  one-file fix with nothing to decide.
---

# workflow:plan

Building before there is a shared understanding is the most expensive mistake in
this workflow. A branch built on a misread request gets thrown away, and an
ambiguity found during review costs a rework. Planning settles what to build, in
which slices, and what can run in parallel, so that the next phases
(`workflow:coordinate` and `workflow:implement`) become mechanical.

Planning writes no code. It ends with a plan the user approved.

## When to plan

Plan anything new: a feature, a change in behavior, a schema or API change, a
refactor that touches several files, a project, or an investigation that will
lead to changes.

Skip the plan for a typo, a one-line fix, or a one-file change with nothing to
decide. Say that it is too small to plan, and continue with
`workflow:implement`. When you are not sure, plan briefly: one round of
questions and a short plan.

## 1. Find the facts yourself

Facts are your job, and decisions are the user's. Before you ask anything, read
what the project already says:

- `README.md`, `AGENTS.md`, `CLAUDE.md` and `CONTRIBUTING.md`.
- The project's docs: architecture, decisions, design system, and any existing
  plan.
- The code that the change touches, and the tests next to it.
- Design sources such as mockups, prototypes or a decisions document. Note which
  source wins when they disagree; the project usually says.
- Remembered decisions from earlier sessions.

Never ask the user something that the repository answers. Use a subagent for a
broad search, and keep only its findings. A fact that is still being looked up
blocks only the questions that depend on it.

## 2. Interview the user over a tree of decisions

Map the work as a tree of decisions: each decision branches into the decisions
that depend on it. The frontier is every open decision whose prerequisites are
settled. Ask the whole frontier in one round, then wait.

Ask only the questions whose answer changes the plan: the scope, what the user
sees and does, data shapes that are hard to undo, the order of the work, and
trade-offs that cost something. For everything else, choose a reasonable default
and record it as a named default instead of asking. The user can overturn a
named default at any time, and they would rather judge it in the running product
than answer it in the abstract.

Ask each round with the `AskUserQuestion` tool:

- One question per decision, at most four questions per call. A frontier with
  more than four decisions goes out as several calls in the same round.
- Two to four options per question, each with a short label and a description
  that says what the option means and what it costs.
- Put your recommendation first, and end its label with "(suggested)". Choose
  one: a question without a clear suggestion means the decision needs more facts
  first.
- When options differ in how something looks or reads, show each one in the
  option's preview: a small mockup, a code snippet or an example of the copy.
- Let the user's own answer come through the tool's "Other" choice. Do not add
  an "Other" option yourself.

When the tool is not available, ask the same round as text: number each
question, list its options with what each costs, and put your suggestion first
with "(suggested)" at the end of its label, as the tool would show it.

After each round, record the settled decisions, recompute the frontier and ask
the next round. A question that depends on another question in the same round
belongs to a later round.

To find every branch, walk the work through these lenses. Each one that applies
either becomes a question or a named default:

- The main path, from the first step to the result.
- Empty states, first use, and very large amounts of data.
- Errors and failures: invalid input, a failed save, a lost connection.
- Concurrency: two people, two tabs, an agent and a person at once.
- Permissions and tenancy: who may see and change what.
- Devices and access: phone, touch, keyboard, screen readers, no JavaScript.
- Data and migrations: existing data, irreversible changes, deletion.
- Performance, limits and cost.
- What is out of scope, said out loud.

The interview ends when the frontier is empty: every branch is settled, recorded
as a named default, or listed as out of scope.

## 3. Write the plan

The plan is a durable artifact that the later phases read and update. Its value
is that it is specific: each decision, scenario and slice names the real things
in this project. Make the plan richer by adding concrete items, never by making
items longer. Each item stays one or two short sentences, written with the
`kanso:explain` skill's writing rules.

Build the artifact from this skill's template, `assets/plan.html`. Copy the file
to where the project keeps plans with a shell copy, such as `cp`, rather than
reading it and writing it out again, and then edit only its `PLAN` object.
Without a shell, write it out unchanged apart from `PLAN`. Do not restyle or
restructure it: the template replaces the page design steps of `kanso:explain`,
while its writing rules still apply to every word. Publish the filled file with
the `Artifact` tool, and give the artifact's link and the file's path. To update
the plan, publish the same file again, so the link stays the same. If the
project has no place for plans, add that to the first round of the interview as
a question with options, such as a `docs/plans/` folder, and your suggestion
first.

Fill in the `PLAN` object like this:

- `title` is a claim about the approach in one sentence, not a label. `lede`
  gives the problem, the outcome and the approach in up to three sentences.
  `revision` and `date` change with every update.
- `decided.rows` are `[topic, choice and its reason, who]`. `who` is the user
  with the date, as in "Yours, 25 Oct", or "default" for a named default. Give
  the section a title that says what it means, such as "What the plan stands
  on".
- `open.rows` are the decisions left for a later slice: the question (`q`), the
  options and what each costs (`o`), and when it gets decided (`d`).
- `agreements.rows` are `[name, rule]` cards for how every slice is built in
  this project: what each slice shows, how it is tested, and how data and
  migrations change. Take them from the interview and the project's rules.
- `sections` has one entry for each cross-cutting concern that the interview
  surfaced, and no more. Use kind `table` for rules with notes, `list` for named
  items, and `columns` to compare two things side by side. Each entry has an
  `id`, an `eyebrow`, a title that makes a claim, and an optional `sub`.
- `gaps.rows` are `[where the sources are thin or disagree, the resolution]`.
- `lanes.svg` is an inline diagram of the slices and their dependencies that
  shows the parallel lanes. Draw it with the diagram rules of `kanso:explain`.
  Its `sub` names what parallel lanes would share and how they avoid each other.
- `phases` groups the slices. A phase has a `name`, an `intro` and an optional
  milestone, `mile`: `[name, what the user can now do]`. A slice has a `title`;
  an `outcome` that says what the user can see or try, with real names ("Open
  Weekly groceries and tick off milk"); `verify`, the tests and the manual
  check; a `size` of S, M or L; `stop` set to true for a design stop; its
  `lane`; a `status` of `todo`, `wip` or `done`; and its `pr` once merged.
- `risks.rows` are `[risk, the early signal]`, and `out.rows` are `[item, why it
  is out of scope]`.

Leave a part empty when the work has nothing for it, and the template hides it.
A small plan stays small.

Cut the slices with these rules:

- Each slice delivers something the user can see or test. A backend change lands
  together with the screen that shows it.
- Tests and docs belong inside the slice that needs them. There is no slice that
  is only tests or only docs.
- A part that is hard to undo (a schema, a migration, an API shape) gets a
  design stop: a short design the user approves before it is built.
- A slice is small enough to review in one sitting. Split one that is not.
- Order the slices so that independent lanes can start early.

## 4. Decide how to run it

Recommend one of these for each slice or lane, record it in the plan as a
`sections` table titled after the choice, and let the user decide:

- **This session**, with `workflow:implement`, when the work is one small slice,
  touches few files and has no parallel lanes.
- **Separate sessions coordinated from this one**, with `workflow:coordinate`,
  when there are several slices or parallel lanes. Each slice goes to a fresh
  session that the user can see and talk to. Subagents are not used for this:
  their work cannot be reviewed or steered while it runs.

## 5. Hand off

End with the plan's link and path, the slice or slices that can start now, which
ones can run in parallel, and the recommendation from step 4. Ask the user to
approve the plan. Write no code until they do.

## Keep the plan alive

The plan is the source of truth while the work runs. When a decision changes,
update the decisions table with the new date and the reason. When a slice
merges, mark it done with its pull request. When a slice is folded into another
or deferred, say so in its entry. The session that coordinates the work owns
these updates.
