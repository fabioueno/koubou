<div align="center">
  <h1>Koubou (工房)</h1>

  <p>
    A Claude Code plugin marketplace. Each plugin does one job, turns on or off
    on its own, and ships with its own evals.
  </p>
</div>

---

## Plugins

| Plugin   | Provides        | What it does                                                                             |
| -------- | --------------- | ---------------------------------------------------------------------------------------- |
| `crew`   | Sidebar mod     | Shows a side panel with a card for each agent at work.                                   |
| `git`    | `git:gitignore` | Builds and updates `.gitignore` files from the official github/gitignore templates.      |
| `kanso`  | `kanso:explain` | Writes explanations in simplified technical English, as HTML pages with diagrams.        |
| `ribbon` | Prompt band mod | Shows a band above the prompt with the session's time, cost, project, branch and limits. |

## Installation

Add the marketplace, then install the plugins you want:

```text
/plugin marketplace add fabioueno/koubou
/plugin install crew@koubou
/plugin install git@koubou
/plugin install kanso@koubou
/plugin install ribbon@koubou
```

Turn a plugin off or on again without uninstalling it:

```text
/plugin disable kanso@koubou
/plugin enable kanso@koubou
```

Plugins carry no version, so each one updates when a commit changes its folder.
Run `/plugin marketplace update koubou` to fetch new commits.

## Documentation

| Document                        | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| [CONTRIBUTING.md][contributing] | Conventions, adding a plugin, and running evals. |

## License

[MIT][license]

[contributing]: CONTRIBUTING.md
[license]: LICENSE
