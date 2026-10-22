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

Pad table columns so the source stays aligned and readable. A table row or a
fenced block that cannot wrap is the only exception to the 80 column rule.

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
