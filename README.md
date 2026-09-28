# D18 — Condo Building History

A website showcasing the history of a condominium building, built with AI using
[GitHub Spec Kit](https://github.com/github/spec-kit) (spec-driven development).

## Repository layout

| Path | Purpose |
|------|---------|
| `.specify/memory/constitution.md` | Project principles that govern all specs and plans |
| `.specify/templates/` | Spec, plan, tasks and checklist templates |
| `.specify/scripts/bash/` | Helper scripts used by the Spec Kit skills |
| `.claude/skills/speckit-*` | Spec Kit slash commands for Claude Code |
| `specs/` | Feature specs, plans and tasks (created by `/speckit-specify`) |

## Workflow

Run these in Claude Code, in order:

1. `/speckit-constitution` — define project principles
2. `/speckit-specify` — describe *what* to build and *why*
3. `/speckit-clarify` — (optional) resolve ambiguities
4. `/speckit-plan` — choose the tech stack and architecture
5. `/speckit-tasks` — break the plan into tasks
6. `/speckit-analyze` — (optional) cross-check spec, plan and tasks
7. `/speckit-implement` — build it

## Spec Kit version

Initialized with `specify-cli` v1.0.8, pinned to commit
`0cc9a6a1159471a3108b9bad718ba17006dd6039`:

```sh
uvx --from git+https://github.com/github/spec-kit.git@0cc9a6a1159471a3108b9bad718ba17006dd6039 \
  specify init --here --force --integration claude --script sh
```
