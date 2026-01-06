# Project Management Best Practices

World-class software project management principles and techniques.

## Contents
- Task writing guidelines
- Sprint planning
- Prioritization frameworks
- Estimation
- Managing scope
- Continuous improvement

## Task writing guidelines

### Write actionable tasks

**Good tasks:**
- Start with a verb
- Have clear completion criteria
- Are independently deliverable
- Fit within one sprint

**Examples:**

| Bad | Good |
|-----|------|
| Login | Implement email/password login form |
| Database stuff | Create users table with indexes |
| Fix bugs | Fix null pointer in checkout flow |
| UI improvements | Add loading spinner to submit button |

### INVEST criteria

Each task should be:

| Criterion | Meaning |
|-----------|---------|
| **I**ndependent | Can be completed without other tasks |
| **N**egotiable | Details can be discussed |
| **V**aluable | Delivers user or business value |
| **E**stimable | Can reasonably estimate effort |
| **S**mall | Fits in a sprint (ideally 1-3 days) |
| **T**estable | Has clear acceptance criteria |

### Acceptance criteria

Define "done" clearly:

```markdown
- [ ] `PM-015` **Implement password reset** `high` `feature`
  - **Acceptance criteria:**
    - [ ] User can request reset via email
    - [ ] Email contains secure, time-limited link
    - [ ] User can set new password
    - [ ] Old sessions are invalidated
    - [ ] Rate limiting prevents abuse
```

### Task decomposition

Break large work into smaller tasks:

**Too big:**
```markdown
- [ ] `PM-050` **Build authentication system** `high` `feature`
```

**Right-sized:**
```markdown
- [ ] `PM-050` **Create auth database schema** `high` `feature` `4h`
- [ ] `PM-051` **Implement signup endpoint** `high` `feature` `4h`
- [ ] `PM-052` **Implement login endpoint** `high` `feature` `4h`
- [ ] `PM-053` **Add JWT token generation** `high` `feature` `2h`
- [ ] `PM-054` **Create auth middleware** `high` `feature` `2h`
- [ ] `PM-055` **Build login UI component** `high` `feature` `4h`
- [ ] `PM-056` **Build signup UI component** `high` `feature` `4h`
```

## Sprint planning

### Sprint length

| Length | Best for |
|--------|----------|
| 1 week | Fast-moving projects, startups |
| 2 weeks | Most teams (recommended default) |
| 3-4 weeks | Larger teams, complex projects |

### Sprint capacity

Calculate realistically:

```
Available hours = (Working days) × (Hours per day) × (Focus factor)

Example:
- 10 working days
- 6 productive hours/day
- 0.7 focus factor (meetings, interrupts)
= 10 × 6 × 0.7 = 42 hours capacity
```

### Sprint goal

Every sprint needs one clear goal:

**Good goals:**
- "Users can sign up and log in"
- "Practice sessions are tracked with streaks"
- "PWA works offline"

**Bad goals:**
- "Make progress on various features"
- "Fix bugs and add features"

### What to include

```
Sprint work = 60% committed features
            + 20% bug fixes
            + 20% technical debt
```

### Sprint commitment

Rules for sprint scope:

1. **Never add work mid-sprint** without removing equal effort
2. **Carry over** incomplete items to next sprint
3. **Track scope changes** for retrospective
4. **Protect the sprint goal** above all else

## Prioritization frameworks

### MoSCoW method

| Category | Meaning | Sprint allocation |
|----------|---------|-------------------|
| **Must have** | Sprint fails without it | 60% |
| **Should have** | Important but not critical | 20% |
| **Could have** | Nice to have | 15% |
| **Won't have** | Explicitly excluded | 5% buffer |

### Impact vs Effort matrix

```
High Impact │ Quick Wins    │ Major Projects
            │ DO FIRST      │ PLAN CAREFULLY
────────────┼───────────────┼────────────────
Low Impact  │ Fill-ins      │ Time Sinks
            │ DO IF TIME    │ AVOID
            └───────────────┴────────────────
              Low Effort      High Effort
```

### RICE scoring

For backlog prioritization:

```
Score = (Reach × Impact × Confidence) / Effort

Reach: How many users affected (1-10)
Impact: How much value (0.25, 0.5, 1, 2, 3)
Confidence: How sure are we (0.5, 0.8, 1.0)
Effort: Person-days of work
```

### Priority decision tree

```
Is production down? → CRITICAL
Is it blocking others? → HIGH
Is it sprint committed? → HIGH
Does user notice? → MEDIUM
Is it nice to have? → LOW
```

## Estimation

### Estimation techniques

**T-shirt sizing:**
| Size | Hours | Days |
|------|-------|------|
| XS | 1-2 | < 0.5 |
| S | 2-4 | 0.5 |
| M | 4-8 | 1 |
| L | 8-16 | 2 |
| XL | 16-24 | 3-4 |
| XXL | 24+ | > 4 (split it) |

**Fibonacci hours:**
1, 2, 3, 5, 8, 13, 21 hours

Use larger numbers to signal uncertainty.

### Estimation tips

1. **Add buffer**: Multiply estimates by 1.5
2. **Decompose first**: Estimate parts, sum them
3. **Compare**: "Is this bigger than task X?"
4. **Track actuals**: Learn from past estimates
5. **Timebound spikes**: Cap research tasks

### When estimates are wrong

If task exceeds estimate by 50%:

1. Stop and reassess
2. Document why it took longer
3. Split remaining work into new tasks
4. Update sprint capacity for next time

## Managing scope

### Scope creep prevention

1. **Write it down**: If not on board, it doesn't exist
2. **Link to goal**: Every task maps to sprint goal
3. **Trade, don't add**: New work requires removing work
4. **Question "quick adds"**: They never are

### Handling new requests

```
New request arrives
        ↓
Is it critical/blocking? → Yes → Add to sprint, remove equal effort
        ↓ No
Add to backlog, prioritize
        ↓
Consider for next sprint
```

### Technical debt management

Track debt explicitly:

```markdown
## Backlog

### Technical Debt
- [ ] `PM-100` **Refactor auth module** `medium` `chore` `1d`
  - **Debt type:** Code complexity
  - **Risk if ignored:** Hard to add OAuth
- [ ] `PM-101` **Add missing indexes** `high` `chore` `2h`
  - **Debt type:** Performance
  - **Risk if ignored:** Slow queries at scale
```

## Continuous improvement

### Sprint retrospective

End each sprint with:

1. **What went well?** (Keep doing)
2. **What didn't go well?** (Stop doing)
3. **What to try?** (Start doing)

Document in notes section:

```markdown
## Notes

### Retrospective - Sprint 3
**Keep:**
- Small, focused PRs
- Daily board updates

**Stop:**
- Starting tasks without acceptance criteria
- Skipping estimates

**Try:**
- Pair programming on complex tasks
- Automated testing before PR
```

### Velocity tracking

Track sprint-over-sprint:

```markdown
| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 1 | 10 | 8 | 8 |
| Sprint 2 | 12 | 10 | 10 |
| Sprint 3 | 11 | 11 | 11 |
```

Use velocity to plan realistic sprints.

### Blocked time analysis

Track and minimize:

```markdown
| Sprint | Total Blocked Hours | Top Cause |
|--------|--------------------| ----------|
| Sprint 1 | 16 | Waiting for design |
| Sprint 2 | 8 | Environment issues |
| Sprint 3 | 4 | Code review delays |
```

### Definition of Done

Establish and enforce:

```markdown
### Definition of Done
- [ ] Code compiles without warnings
- [ ] All tests pass
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner accepted
```

## Common anti-patterns

### Avoid these

| Anti-pattern | Problem | Solution |
|--------------|---------|----------|
| Zombie tasks | Never complete | Split or kill them |
| Gold plating | Over-engineering | Define "done" clearly |
| Hero culture | One person does all | Distribute and document |
| Invisible work | Undocumented effort | Track everything |
| Moving targets | Changing requirements | Lock sprint scope |
| Estimate inflation | Padding estimates | Track actuals, calibrate |

### Warning signs

- Same task "in progress" for days
- Many tasks carried over
- Sprint scope changes frequently
- No tasks ever blocked (means not tracking)
- Velocity varies wildly
