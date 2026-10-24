# Contributing

Conventions that apply to work in this repository. Each section covers one kind
of material.

# Code

Comments explain why, not what or how. If a comment is needed to say what the
code does, rewrite the code instead.

# Documentation

## Prose

Documents state what is true. They do not narrate their own history. A rule that
changes is rewritten in place rather than annotated with what it used to be, and
nothing describes a question as newly settled, recently closed, or previously
open. Git holds that record.

Do not use em dashes. Use commas, semicolons, colons, or parentheses.

Wrap lines at 80 columns.

Write headings in sentence case. Use American spelling.

## Links

Use reference-style links rather than inline URLs, so prose stays readable at
80 columns.

Collect the definitions at the end of the document and sort them
alphabetically by key:

```markdown
[deferred]: ../design/deferred-decisions.md
[tradeoffs]: ../design/tradeoffs.md
```

## Tables and diagrams

Diagrams are Mermaid, in fenced blocks.

Pad table columns so the source stays aligned and readable. A table row, a
fenced block, or a line that is one unbreakable token (a long URL) is the only
exception to the 80 column rule.

# Plugins

Each plugin lives in its own folder under `plugins/`, and
`.claude-plugin/marketplace.json` lists it. The plugin name is the namespace
its skills load under, so `plugins/kanso/skills/explain/` loads as
`kanso:explain`.

```text
plugins/<name>/
├── .claude-plugin/plugin.json
├── skills/<skill>/SKILL.md
└── evals/
    ├── allow-tools          # Tool grants for the whole suite, one per line
    ├── fixtures/            # Files that scaffold scripts copy into a run
    └── <case>/              # Prompt.md, graders/, optional case.yaml
```

To add a plugin:

1. Create `plugins/<name>/.claude-plugin/plugin.json`, with a `name` that
   matches the folder.
2. Add an entry to `marketplace.json` with `"source": "./plugins/<name>"`.
3. Add its skills, agents, or commands.
4. Add at least one eval case, and list the tools the cases need in
   `evals/allow-tools`.
5. Run `claude plugin validate plugins/<name>`, then the plugin's evals as
   described below.

Plugins carry no `version`. Claude Code then versions each plugin by the
commit of its folder, so a merge updates only the plugins it touched. Add a
version only when another plugin needs a dependency range on it.

## Mods

A mod is a plugin whose `hooks/hooks.json` names TypeScript modules that change
Claude Code's interface, as `crew` does. A mod has tests instead of evals, and
keeps its own `mise.toml`, `package.json` and `Makefile` in its folder. From
that folder, `make deps` installs its tools, `make check` runs Biome, the type
check and `claude plugin validate`, and `make test` runs `claude plugin test`.

The type check reads `.claude-plugin/types/`, which Claude Code writes each
time it loads the mod and git ignores. Load the mod once, for example with
`claude --plugin-dir plugins/<name>`, before the first `make check`.

# Evals

Evals run with [`claude plugin eval`][plugin-evals]. A case is a folder with a
`prompt.md` and a `graders/` folder. A `case.yaml` can name a scaffold script
that copies fixtures into the empty workspace before the run.

A run loads only the plugin under test. Your `CLAUDE.md`, settings, other
skills, and the Artifact tool are absent, so a case must need nothing beyond
the plugin and its fixtures. Fixture content reads like real code: plausible
names and data, never placeholders.

Prefer graders that cost nothing (`regex`, `tool_used`, `file_exists`) and keep
`llm` graders for short text with concrete PASS and FAIL conditions.

## Running a plugin's evals

From the repository root, replacing `<name>` with the plugin:

```sh
claude plugin eval plugins/<name> --trust-plugin --scaffold \
  --judge-model claude-sonnet-5-5 \
  --allow-tools $(cat plugins/<name>/evals/allow-tools)
```

Each case runs three times with the plugin and three times without it, and
the report shows the difference. It is published to claude.ai, and the command
prints the link. A copy goes to `plugins/<name>/evals/results/`, which git
ignores, because each run writes a new timestamped report. Add
`--runs 1 --ablation none` for a quick check without the baseline.

Keep `--allow-tools`. A case's `allowed_tools` grants only read-only tools, so
without the grants in `evals/allow-tools` a run can write no files and every
case that writes or edits one fails. Keep the Sonnet judge too: the default
judge misread hedged answers.

# Git

Branches are named `<type>/<short-description>`, and every change goes through
a pull request; nothing is pushed to `main` directly.

Commit messages follow the conventional commit format:

```text
type(optional scope): subject
```

The type is one of `feat`, `fix`, `chore`, `refactor`, `docs`, or `test`.

Begin the subject with a verb in the imperative mood, so that it completes
the sentence "if applied, this commit will ...". Write `add` rather than
`adds` or `added`, and `fix` rather than `fixed`. Do not end the subject with
a period.

Cap the subject line at 50 characters. Wrap the body at 72 columns. Both are
tighter than the 80 column rule for Markdown, because git indents commit
messages when it displays them.

When an AI assistant wrote part of a change, credit it with a `Co-Authored-By`
trailer at the end of the message.

[plugin-evals]: https://code.claude.com/docs/en/plugin-evals
