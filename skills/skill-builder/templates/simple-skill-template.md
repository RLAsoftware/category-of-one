# Simple Skill Template

Use this template for skills that only need instructions (no reference docs or scripts).

## Template

```markdown
---
name: your-skill-name
description: Brief description of what this skill does and when to use it. Include key trigger words.
---

# Skill Title

[One paragraph overview of what this skill does]

## Quick start

[Simplest possible usage example - 3-5 lines showing the basic pattern]

## [Main section heading]

[Core instructions for using the skill]

### [Subsection if needed]

[Additional details organized logically]

## Examples

[Show 2-3 concrete examples with input/output pairs if applicable]

**Example 1:**
Input: [What the user provides]
Output: [What should be generated]

## Common patterns

[Document frequently-used patterns or variations]

## Notes

[Any important caveats, limitations, or tips]
```

## Example: Code review skill

````markdown
---
name: reviewing-code
description: Performs systematic code reviews checking for bugs, security issues, and best practices. Use when the user asks to review code, check for issues, or wants feedback on code quality.
---

# Code Review

Performs systematic, thorough code reviews following industry best practices.

## Quick start

When asked to review code:
1. Read the complete code first
2. Analyze structure, logic, and patterns
3. Identify issues by severity (critical, moderate, minor)
4. Provide specific, actionable recommendations

## Review checklist

Cover these areas:

**Security:**
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization
- Sensitive data handling

**Correctness:**
- Logic errors
- Edge cases
- Error handling
- Resource management
- Async/concurrency issues

**Quality:**
- Code organization
- Naming clarity
- Function complexity
- Duplication
- Documentation

## Output format

Structure findings:

```markdown
# Code Review: [File/Component]

## Critical Issues
- [Issue with line reference]

## Moderate Issues
- [Issue with line reference]

## Minor Suggestions
- [Improvement idea]

## Positive Notes
- [What's done well]
```

## Examples

**Example 1: Security issue**

Code:
```python
query = f"SELECT * FROM users WHERE id = {user_id}"
```

Finding:
```markdown
## Critical Issues
- **SQL Injection Risk (line 42)**: Using string formatting creates SQL injection vulnerability.
  Replace with parameterized query:
  ```python
  query = "SELECT * FROM users WHERE id = ?"
  cursor.execute(query, (user_id,))
  ```
```

**Example 2: Logic error**

Code:
```python
if user.age > 18:
    return "adult"
```

Finding:
```markdown
## Moderate Issues
- **Off-by-one error (line 15)**: Should use >= 18 for adult classification.
  Users exactly 18 years old are incorrectly excluded.
```

## Notes

- Be specific with line references
- Explain why issues matter
- Provide concrete fixes
- Balance criticism with positive feedback
- Prioritize by severity
````

## When to use this template

Use simple template when:
- Skill is straightforward
- All instructions fit comfortably in one file (under 500 lines)
- No need for domain-specific sub-documents
- No executable scripts required
- Instructions are mostly procedural guidance

## Customization tips

1. **Keep it concise**: Only include what Claude doesn't already know
2. **Use examples**: Show don't tell when possible
3. **Structure clearly**: Use headings to organize content
4. **Be specific**: Include concrete patterns and formats
5. **Test thoroughly**: Verify Claude can follow the instructions
