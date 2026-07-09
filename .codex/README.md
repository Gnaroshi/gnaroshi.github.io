# Codex Project Notes

This directory contains safe, project-scoped guidance for future Codex and MCP-assisted development.

## Context Sources

Codex sessions should use:

- `AGENTS.md` for working rules, commands, project structure, and guardrails.
- `docs/` for product, design, architecture, content model, paper reading, deployment, and phased task context.
- `README.md` for user-facing setup and editing instructions.

## MCP Configuration

MCP configuration can be project-scoped, but real secrets must not be committed.

Safe to commit:

- `.codex/README.md`
- `.codex/config.example.toml`

Do not commit:

- `.codex/config.toml`
- tokens
- API keys
- OAuth client secrets
- personal access tokens
- local credential files
- browser profile credentials

If MCP servers are needed, configure them locally by copying `.codex/config.example.toml` to one of:

```text
~/.codex/config.toml
.codex/config.toml
```

The local `.codex/config.toml` path is ignored by git.

## Rule Of Thumb

Examples and documentation belong in this directory. Real credentials and machine-specific MCP settings do not.

