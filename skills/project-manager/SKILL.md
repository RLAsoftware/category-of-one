---
name: project-manager
description: Manages software projects using a markdown-based kanban board. Use when the user mentions project management, tasks, sprints, backlog, issues, tickets, or wants to track work items. Simulates Linear/Jira-style project tracking in a PROJECT-BOARD.md file.
---

# Project Manager

Manages software development projects using a markdown-based kanban board that simulates professional project management tools like Linear or Jira.

## Quick start

**Initialize a new project board:**
```
/project-manager init
```

**View current sprint:**
```
/project-manager status
```

**Add a new task:**
```
/project-manager add "Implement user authentication"
```

## Core workflow

1. **Read the board**: Always read `PROJECT-BOARD.md` before making changes
2. **Understand context**: Review current sprint, priorities, and blockers
3. **Make atomic updates**: Update one section at a time
4. **Preserve structure**: Maintain the board format exactly

## Board location

The project board lives at:
```
PROJECT-BOARD.md
```

If it doesn't exist, create it using the template in [reference/board-format.md](reference/board-format.md).

## Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize a new PROJECT-BOARD.md |
| `status` | Show current sprint status and metrics |
| `add <title>` | Add a new task to backlog |
| `start <id>` | Move task to In Progress |
| `done <id>` | Mark task as completed |
| `block <id> <reason>` | Mark task as blocked |
| `sprint new` | Start a new sprint |
| `sprint close` | Close current sprint |
| `prioritize` | Re-order backlog by priority |

## Task lifecycle

```
Backlog → In Progress → In Review → Done
              ↓
           Blocked
```

## Reference documentation

**Board format**: See [reference/board-format.md](reference/board-format.md)
- Complete markdown structure
- Task format and fields
- Sprint organization

**Best practices**: See [reference/best-practices.md](reference/best-practices.md)
- Task writing guidelines
- Sprint planning
- Prioritization frameworks

**Workflows**: See [reference/workflows.md](reference/workflows.md)
- Sprint ceremonies
- Bug triage
- Feature development

## Quick search

Find tasks or information:
```bash
grep -i "keyword" PROJECT-BOARD.md
grep -i "topic" skills/project-manager/reference/*.md
```

## Example board structure

```markdown
# Project Board

## Current Sprint: Sprint 3 (Jan 6 - Jan 17)

### In Progress
- [ ] `PM-012` **Implement login form** @derick `high` `feature`

### In Review
- [ ] `PM-011` **Add password validation** @derick `high` `feature`

### Done
- [x] `PM-010` **Setup auth middleware** @derick `high` `feature`

## Backlog
- [ ] `PM-013` **Add OAuth providers** `medium` `feature`
```

## Rules

1. **Always read before writing**: Load PROJECT-BOARD.md first
2. **Atomic updates**: One operation per edit
3. **Preserve IDs**: Never change existing task IDs
4. **Sequential IDs**: New tasks get next available ID
5. **Update timestamps**: Track when tasks change state
6. **Sprint integrity**: Don't modify closed sprints

## Metrics tracked

- Sprint velocity (tasks completed)
- Cycle time (start → done)
- Blocked time
- Scope changes per sprint

## Notes

- All dates use ISO 8601 format (YYYY-MM-DD)
- Task IDs use prefix format: `PM-###`
- Priorities: `critical`, `high`, `medium`, `low`
- Types: `feature`, `bug`, `chore`, `spike`
