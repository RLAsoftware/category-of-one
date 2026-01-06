# Project Management Workflows

Step-by-step guides for common project management operations.

## Contents
- Board initialization
- Daily standup
- Sprint ceremonies
- Feature development
- Bug triage
- Release planning

## Board initialization

When starting a new project or initializing the board:

```
Board Initialization Progress:
- [ ] Step 1: Create PROJECT-BOARD.md
- [ ] Step 2: Set project metadata
- [ ] Step 3: Create initial backlog
- [ ] Step 4: Plan first sprint
- [ ] Step 5: Validate board structure
```

### Step 1: Create PROJECT-BOARD.md

Create file at project root using template from [board-format.md](board-format.md).

### Step 2: Set project metadata

```markdown
## Project Info

| Field | Value |
|-------|-------|
| Project | [Your Project Name] |
| Started | [Today's date] |
| Current Sprint | Sprint 1 |
| Task Prefix | PM |
| Next ID | 1 |
| Sprint Length | 2 weeks |
| Team | @username |
```

### Step 3: Create initial backlog

Add all known work items:

1. List all features needed for MVP
2. Identify known bugs or issues
3. Note technical setup tasks
4. Add documentation tasks
5. Assign priorities to all items

### Step 4: Plan first sprint

1. Calculate capacity (see best-practices.md)
2. Write sprint goal
3. Move high-priority items to sprint
4. Assign tasks to team members
5. Add estimates to sprint tasks

### Step 5: Validate

- All tasks have IDs
- All tasks have priority and type
- Sprint goal is clear
- Next ID is correct

## Daily standup

Quick daily board review:

```
Daily Standup Checklist:
- [ ] Review blocked items
- [ ] Update task statuses
- [ ] Check sprint progress
- [ ] Identify new blockers
- [ ] Update timestamps
```

### Review blocked items

Check each blocked task:
- Is blocker resolved?
- Can we unblock it differently?
- Should we escalate?

### Update task statuses

For each in-progress task:
- Still in progress → no change
- Ready for review → move to In Review
- Completed → move to Done, check box

### Check sprint progress

Quick assessment:
- Days remaining vs tasks remaining
- Are we on track for sprint goal?
- Any risks to flag?

## Sprint ceremonies

### Sprint planning (start of sprint)

```
Sprint Planning Progress:
- [ ] Close previous sprint
- [ ] Review backlog
- [ ] Set sprint goal
- [ ] Select sprint items
- [ ] Assign and estimate
- [ ] Update board
```

**Close previous sprint:**
1. Move incomplete tasks to backlog
2. Archive completed sprint (see board-format.md)
3. Calculate velocity

**Review backlog:**
1. Remove obsolete items
2. Reprioritize based on learnings
3. Refine task descriptions

**Set sprint goal:**
1. Identify most important outcome
2. Write one clear sentence
3. Get team alignment

**Select sprint items:**
1. Calculate capacity
2. Add highest priority items
3. Stop at 80% capacity (buffer for unknowns)

### Sprint review (end of sprint)

```
Sprint Review Progress:
- [ ] Demo completed work
- [ ] Gather feedback
- [ ] Update backlog with insights
- [ ] Celebrate wins
```

### Sprint retrospective (end of sprint)

```
Sprint Retrospective Progress:
- [ ] What went well?
- [ ] What didn't go well?
- [ ] What to try next sprint?
- [ ] Document in Notes section
- [ ] Create action items
```

## Feature development workflow

From idea to completion:

```
Feature Development Progress:
- [ ] Step 1: Create feature task
- [ ] Step 2: Add acceptance criteria
- [ ] Step 3: Break into subtasks if needed
- [ ] Step 4: Prioritize and schedule
- [ ] Step 5: Move to In Progress
- [ ] Step 6: Implement
- [ ] Step 7: Move to In Review
- [ ] Step 8: Address feedback
- [ ] Step 9: Move to Done
```

### Step 1: Create feature task

```markdown
- [ ] `PM-###` **[Feature title]** `[priority]` `feature`
```

### Step 2: Add acceptance criteria

```markdown
- [ ] `PM-025` **Add user profile page** `high` `feature`
  - **Description:** Users can view and edit their profile
  - **Acceptance criteria:**
    - [ ] Display user name and email
    - [ ] Allow editing name
    - [ ] Allow changing password
    - [ ] Show avatar with upload option
```

### Step 3: Break into subtasks

If feature > 1 day, split it:

```markdown
- [ ] `PM-025` **Create profile page layout** `high` `feature` `4h`
- [ ] `PM-026` **Add profile edit form** `high` `feature` `4h`
- [ ] `PM-027` **Implement avatar upload** `high` `feature` `4h`
- [ ] `PM-028` **Add password change flow** `high` `feature` `4h`
```

### Step 4: Prioritize and schedule

Place in appropriate backlog section or sprint.

### Step 5-9: Execute

Update board as work progresses through stages.

## Bug triage workflow

When a bug is reported:

```
Bug Triage Progress:
- [ ] Step 1: Create bug task
- [ ] Step 2: Add reproduction steps
- [ ] Step 3: Assess severity
- [ ] Step 4: Prioritize
- [ ] Step 5: Schedule fix
```

### Step 1: Create bug task

```markdown
- [ ] `PM-###` **[Bug title]** `[priority]` `bug`
```

### Step 2: Add reproduction steps

```markdown
- [ ] `PM-030` **Login fails with special characters** `high` `bug`
  - **Reported by:** User feedback
  - **Steps to reproduce:**
    1. Go to login page
    2. Enter email with + sign (test+user@email.com)
    3. Enter any password
    4. Click login
  - **Expected:** Login succeeds
  - **Actual:** Shows "Invalid email" error
  - **Environment:** Production, Chrome 120
```

### Step 3: Assess severity

| Severity | Criteria | Priority |
|----------|----------|----------|
| Critical | Production down, data loss | `critical` |
| High | Feature broken for many users | `high` |
| Medium | Feature degraded, workaround exists | `medium` |
| Low | Cosmetic, edge case | `low` |

### Step 4: Prioritize

- Critical → Immediate sprint addition
- High → Top of backlog, next sprint
- Medium → Backlog, normal prioritization
- Low → Backlog, low priority

### Step 5: Schedule

Add to appropriate sprint or backlog section.

## Release planning workflow

For major releases:

```
Release Planning Progress:
- [ ] Step 1: Define release scope
- [ ] Step 2: Create milestone tasks
- [ ] Step 3: Identify dependencies
- [ ] Step 4: Plan sprints
- [ ] Step 5: Track progress
- [ ] Step 6: Execute release
```

### Step 1: Define release scope

Add release section to Notes:

```markdown
## Notes

### Release: v1.0 MVP
**Target:** Sprint 4 completion
**Theme:** Core practice functionality

**Must have:**
- User authentication
- Practice session tracking
- Basic progress stats

**Should have:**
- Streak tracking
- Exercise library

**Won't have:**
- Social features
- Offline mode
```

### Step 2: Create milestone tasks

Create all tasks needed for release features.

### Step 3: Identify dependencies

```markdown
- [ ] `PM-040` **Setup CI/CD pipeline** `high` `chore`
  - **Blocks:** All deployment tasks
```

### Step 4: Plan sprints

Distribute work across sprints to hit release target.

### Step 5: Track progress

Add release tracking to board:

```markdown
### Release Progress: v1.0 MVP
| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| Features | 12 | 8 | 4 |
| Bugs | 5 | 3 | 2 |
| Chores | 3 | 3 | 0 |
```

### Step 6: Execute release

```
Release Execution Progress:
- [ ] All sprint tasks complete
- [ ] All tests passing
- [ ] Staging verified
- [ ] Release notes written
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Announce release
```

## Handling interruptions

When urgent work appears mid-sprint:

```
Interruption Handling Progress:
- [ ] Step 1: Assess urgency
- [ ] Step 2: Document impact
- [ ] Step 3: Make trade-off
- [ ] Step 4: Update board
- [ ] Step 5: Communicate change
```

### Decision tree

```
Is it production-breaking?
    Yes → Add immediately, notify team
    No ↓
Can it wait until next sprint?
    Yes → Add to backlog, prioritize high
    No ↓
What can we remove to make room?
    → Identify equal-effort task
    → Move removed task to backlog
    → Add urgent task to sprint
    → Document scope change
```

### Document scope changes

Track in sprint notes:

```markdown
### Sprint 3 Scope Changes
- **Added:** PM-045 (critical bug) +4h
- **Removed:** PM-038 (can defer) -4h
- **Reason:** Production checkout was broken
```

## End of day workflow

Before ending work:

```
End of Day Checklist:
- [ ] Update in-progress tasks with status
- [ ] Move completed tasks to Done
- [ ] Note any blockers discovered
- [ ] Update estimates if needed
- [ ] Plan tomorrow's focus
```

Update task with current state:

```markdown
- [ ] `PM-035` **Implement search** @derick `high` `feature` `4h`
  - **Status (Jan 8):** Basic search working, need to add filters
  - **Remaining:** ~2h for filters and edge cases
```
