---
name: gitignore
description: >
  Create or update .gitignore files using the official github/gitignore
  templates as the source of truth. ALWAYS use this skill: never write
  .gitignore patterns from memory. Invoke proactively without waiting for the
  user to ask: (1) whenever a new project or repo is being set up, even if
  .gitignore has not been mentioned; (2) when git init is run or a new project
  is scaffolded; (3) when the user asks to create or update a .gitignore; (4)
  when the user says "I don't want to commit X" or asks what to ignore for a
  language or framework. Do not wait for an explicit request. If you are
  initializing a project and there is no .gitignore, create one using this
  skill.
argument-hint: "[languages/frameworks to ignore]"
allowed-tools: Read, Write, Edit, Glob, WebFetch
model: haiku
---

# git:gitignore

Always fetch templates from the official https://github.com/github/gitignore
repo instead of writing patterns from memory. The templates there are maintained
by the community and cover edge cases you'd miss otherwise.

## Workflow

### 1. Identify what's needed

Determine which templates to include based on the project context:

- **Languages and runtimes**: look for `go.mod`, `Cargo.toml`, `package.json`,
  `pyproject.toml`, `requirements.txt`, etc.
- **OS**: include the user's OS. macOS is almost always worth including for dev
  machines.
- **Editor/IDE**: check for editor artifacts in the project directory
  (`.vscode/` → VS Code, `.idea/` → JetBrains, `.cursor/` → Cursor) before
  assuming. Only include an IDE template if there's evidence it's in use: either
  a detected artifact or explicit mention from the user. Don't include IDE
  templates speculatively.

If the project already has a `.gitignore`, read it first.

If anything is ambiguous (which languages are in use, which IDE, whether to
include a particular tool), ask. A short clarifying question upfront is better
than generating a `.gitignore` with wrong or missing sections. Don't assume.

### 2. Fetch templates from the official repo

Templates live at predictable raw URLs:

- **Language/framework**:
  `https://raw.githubusercontent.com/github/gitignore/main/<Name>.gitignore`
  - Examples: `Python.gitignore`, `Node.gitignore`, `Rust.gitignore`,
    `Go.gitignore`
- **Global (OS/editor)**:
  `https://raw.githubusercontent.com/github/gitignore/main/Global/<Name>.gitignore`
  - Examples: `Global/macOS.gitignore`, `Global/Windows.gitignore`,
    `Global/JetBrains.gitignore`, `Global/VisualStudioCode.gitignore`

Use WebFetch to retrieve each template. Fetch all needed templates in parallel.

If you're not sure whether a template exists, check:
`https://raw.githubusercontent.com/github/gitignore/main/README.md`

### 3. Prune to what's relevant

Official templates are comprehensive by design. They cover every framework and
tool that might use that language. Most projects only use a fraction of them.
After fetching, remove lines and comment-blocks that clearly don't apply to this
project.

What to keep:

- Core build artifacts and binaries for the language/tool
- Patterns for tools explicitly present in the project (check lock files, config
  files, `package.json` scripts, etc.)
- OS patterns: keep common developer artifacts (`.DS_Store`, resource forks,
  `.Spotlight-V100`, `.Trashes`, `.TemporaryItems`). Keep editor artifacts for
  editors confirmed to be in use.

What to drop:

- Template-level meta-comments: introductory comment blocks that describe the
  template itself rather than patterns. Examples: "If you prefer the allow list
  template instead of the deny list, see community template: https://..." (Go
  template), "Covers JetBrains IDEs: IntelliJ, GoLand..." and "Reference:
  https://intellij-support.jetbrains.com/..." (JetBrains template). These are
  documentation for template maintainers, not useful in a project `.gitignore`.
- Framework-specific sections for frameworks not in use (e.g. Gatsby/Next/Nuxt
  sections from the Node template when the project isn't using them)
- Tool-specific patterns for tools that aren't in the project (e.g. Firebase,
  DynamoDB, Serverless entries when there's no sign of those tools)
- Comments that reference tools not in the project
- From global OS templates: volume-management artifacts (AFP shares, disk
  labels, volume icons), legacy OS entries (Mac OS 6-9 artifacts), TimeMachine
  paths, and quota system files. These belong in a user-level
  `~/.gitignore_global`, not in a project `.gitignore`.

If you're unsure whether something applies, ask rather than guess. Don't prune
core language patterns, only clearly-inapplicable framework noise.

### 4. Compose the .gitignore

Combine the (pruned) templates into a single file using this format:

**Section header**: `### <Name>` (exactly three `#` symbols, one space, then the
template name without the `.gitignore` extension)

**Spacing**: exactly two blank lines between sections

**Sort order**:

1. Language/framework templates first (alphabetically)
2. Global templates second (alphabetically within this group)
3. Community templates (rarely needed)
4. `### App Specific` (always the final section)

Example structure:

```
### Go
<pruned Go content>


### Python
<pruned Python content>


### JetBrains
<JetBrains content>


### macOS
<macOS content>


### App Specific
<project-specific patterns not covered by any template>
```

### 5. Write or update the file

- **New project**: write `.gitignore` to the repo root
- **Updating existing**: replace sections in place or append in sorted order. If
  a section already exists, replace it with freshly fetched (and pruned)
  content. Preserve any `### App Specific` section at the bottom.

After writing, briefly tell the user which templates you included and note any
judgment calls (e.g. "I left out the Gatsby/Firebase sections since you're not
using those").

## Tips

- Patterns not covered by any fetched template go in `### App Specific`: always
  the last section. Only add these when the user explicitly asks or the project
  clearly needs them (e.g., a custom build output directory)
- If the user's custom entries already exist in a fetched template, point that
  out but don't silently remove them
- The two-blank-line separator between sections is load-bearing. Tools like
  `gitignore.io` and various editors rely on this format for parsing
