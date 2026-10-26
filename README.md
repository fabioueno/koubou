<div align="center">
  <h1>Koubou (工房)</h1>

  <p>
    Koubou is a Claude Code plugin marketplace. Each plugin does one job, and
    you can enable or disable each one on its own. Each plugin has its own
    evals, or its own tests when it is a mod.
  </p>
</div>

---

## Plugins

| Plugin     | Provides           | What it does                                                                             |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `crew`     | Sidebar mod        | Shows a side panel with a card for each agent at work.                                   |
| `ember`    | Background mod     | Keeps the prompt cache warm while you are away, and warns when a resumed one went cold.  |
| `git`      | `git:gitignore`    | Builds and updates `.gitignore` files from the official github/gitignore templates.      |
| `kanso`    | Two skills, a hook | Sets one writing style for all text, and turns substantial answers into pages.           |
| `ribbon`   | Prompt band mod    | Shows a band above the prompt with the session's time, cost, project, branch and limits. |
| `workflow` | Five skills        | Plans, coordinates, builds test first, reviews and opens pull requests. Needs `kanso`.   |

## Installation

Add the marketplace, then install the plugins you want:

```text
/plugin marketplace add fabioueno/koubou
/plugin install crew@koubou
/plugin install ember@koubou
/plugin install git@koubou
/plugin install kanso@koubou
/plugin install ribbon@koubou
/plugin install workflow@koubou
```

Disable a plugin, or enable it again, without uninstalling it:

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
