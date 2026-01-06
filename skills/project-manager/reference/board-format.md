# Board Format Reference

Complete specification for the PROJECT-BOARD.md file structure.

## Contents
- Full board template
- Task format
- Sprint structure
- Metadata section
- Status columns

## Full board template

Use this exact structure when initializing a new board:

```markdown
# Project Board

> Last updated: YYYY-MM-DD HH:MM

## Project Info

| Field | Value |
|-------|-------|
| Project | [Project Name] |
| Started | YYYY-MM-DD |
| Current Sprint | Sprint N |
| Task Prefix | PM |
| Next ID | 1 |

---

## Current Sprint: Sprint N (MMM DD - MMM DD)

**Sprint Goal:** [One sentence describing sprint objective]

### Blocked
<!-- Tasks that cannot proceed -->

### In Progress
<!-- Tasks actively being worked on -->

### In Review
<!-- Tasks awaiting review or QA -->

### Done
<!-- Completed tasks this sprint -->

---

## Backlog

### High Priority
<!-- Critical and high priority items -->

### Medium Priority
<!-- Medium priority items -->

### Low Priority
<!-- Low priority and nice-to-haves -->

---

## Icebox

<!-- Ideas and future considerations, not committed -->

---

## Completed Sprints

<!-- Archive of closed sprints with metrics -->

---

## Notes

<!-- Project-wide notes, decisions, links -->
```

## Task format

Each task follows this format:

```markdown
- [ ] `PM-###` **Task title** @assignee `priority` `type` `estimate`
```

### Fields

| Field | Format | Required | Example |
|-------|--------|----------|---------|
| Checkbox | `- [ ]` or `- [x]` | Yes | `- [ ]` |
| ID | `PM-###` | Yes | `PM-042` |
| Title | **Bold text** | Yes | **Implement login** |
| Assignee | @username | No | @derick |
| Priority | backtick priority | Yes | `high` |
| Type | backtick type | Yes | `feature` |
| Estimate | backtick estimate | No | `2h`, `1d`, `3d` |

### Priority levels

| Priority | Use when |
|----------|----------|
| `critical` | Production down, security issues, data loss |
| `high` | Sprint commitment, blocking other work |
| `medium` | Important but not blocking |
| `low` | Nice-to-have, can defer |

### Task types

| Type | Description |
|------|-------------|
| `feature` | New functionality |
| `bug` | Defect fix |
| `chore` | Technical debt, refactoring, maintenance |
| `spike` | Research, investigation, proof of concept |
| `docs` | Documentation |

### Estimate conventions

| Format | Meaning |
|--------|---------|
| `1h`, `2h`, `4h` | Hours |
| `1d`, `2d`, `3d` | Days (1 day = 6 hours) |
| `1w` | Week (5 days) |

## Extended task format

For tasks needing more detail, use a nested structure:

```markdown
- [ ] `PM-015` **Implement OAuth login** @derick `high` `feature` `3d`
  - **Description:** Add Google and GitHub OAuth providers
  - **Acceptance criteria:**
    - [ ] Google login works
    - [ ] GitHub login works
    - [ ] Existing users can link accounts
  - **Blocked by:** PM-012
  - **Notes:** Use next-auth library
```

## Sprint structure

### Sprint header

```markdown
## Current Sprint: Sprint N (MMM DD - MMM DD)

**Sprint Goal:** [Goal statement]
```

### Sprint columns

Maintain these columns in order:

1. **Blocked** - Cannot proceed (include reason)
2. **In Progress** - Actively being worked
3. **In Review** - Awaiting review/QA
4. **Done** - Completed this sprint

### Blocked tasks

Include blocking reason:

```markdown
### Blocked

- [ ] `PM-018` **Deploy to production** @derick `high` `chore`
  - **Blocked:** Waiting for AWS credentials from ops team
  - **Blocked since:** 2025-01-08
```

## Backlog structure

Organize backlog by priority:

```markdown
## Backlog

### High Priority
- [ ] `PM-020` **Critical feature** `high` `feature`

### Medium Priority
- [ ] `PM-021` **Regular feature** `medium` `feature`

### Low Priority
- [ ] `PM-022` **Nice to have** `low` `feature`
```

## Completed sprint archive

When closing a sprint, move to archive:

```markdown
## Completed Sprints

<details>
<summary>Sprint 2 (Dec 23 - Jan 3) - 12 tasks completed</summary>

**Sprint Goal:** Launch MVP authentication

**Metrics:**
| Metric | Value |
|--------|-------|
| Planned | 15 |
| Completed | 12 |
| Carried over | 3 |
| Velocity | 12 |
| Blocked time | 2 days |

**Completed:**
- [x] `PM-001` **Setup project structure** @derick `high` `chore`
- [x] `PM-002` **Create database schema** @derick `high` `feature`
[...]

**Carried over to Sprint 3:**
- PM-010 (in progress)
- PM-011 (blocked)
- PM-012 (not started)

</details>
```

## Metadata section

Track project-level data:

```markdown
## Project Info

| Field | Value |
|-------|-------|
| Project | Rebound Drumming App |
| Started | 2024-12-01 |
| Current Sprint | Sprint 3 |
| Task Prefix | PM |
| Next ID | 25 |
| Sprint Length | 2 weeks |
| Team | @derick |
```

## ID management

### Rules

1. IDs are never reused
2. IDs increment sequentially
3. Update "Next ID" after creating tasks
4. Format: `{PREFIX}-{NUMBER}` (e.g., `PM-042`)

### Bulk creation

When adding multiple tasks:

```markdown
<!-- Before: Next ID = 25 -->

- [ ] `PM-025` **Task one** `medium` `feature`
- [ ] `PM-026` **Task two** `medium` `feature`
- [ ] `PM-027` **Task three** `medium` `feature`

<!-- After: Next ID = 28 -->
```

## Notes section

Track decisions and links:

```markdown
## Notes

### Architecture Decisions
- 2025-01-05: Chose Supabase for auth (faster than custom)
- 2025-01-03: Using Next.js App Router

### Useful Links
- [Figma Designs](https://figma.com/...)
- [API Documentation](./docs/api.md)

### Team Agreements
- Daily standups at 9am
- PRs require 1 approval
- Deploy on Wednesdays
```

## Validation rules

Before saving board:

1. All tasks have unique IDs
2. All tasks have priority and type
3. Checkbox format is correct (`- [ ]` or `- [x]`)
4. Sprint dates don't overlap
5. Next ID is higher than all existing IDs
6. No orphaned subtasks
