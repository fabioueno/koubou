---
type: regex
target:
  source: file
  path: .gitignore
pattern: '^### Node$[\s\S]*^### Rust$[\s\S]*^### JetBrains$[\s\S]*^### macOS$'
flags: m
---
