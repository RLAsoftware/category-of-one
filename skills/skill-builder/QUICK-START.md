# Quick Start Guide

Get started building Claude Skills in 5 minutes.

## Step 1: Understand the basics

A Claude Skill is a directory containing:
- **SKILL.md**: Main file with YAML frontmatter + instructions
- **Optional**: Reference files, scripts, resources

## Step 2: Choose your pattern

**Simple skill** - Just instructions:
```
skill-name/
└── SKILL.md
```

**With references** - Organized docs:
```
skill-name/
├── SKILL.md
└── reference/
    ├── guide.md
    └── examples.md
```

**With scripts** - Executable utilities:
```
skill-name/
├── SKILL.md
└── scripts/
    ├── analyze.py
    └── process.py
```

## Step 3: Create SKILL.md

Every skill needs a SKILL.md with this structure:

```markdown
---
name: your-skill-name
description: What it does and when to use it. Include trigger keywords.
---

# Skill Title

[Overview paragraph]

## Quick start

[Simplest usage example]

## [More sections as needed]

[Additional content]
```

## Step 4: Follow naming rules

**name field:**
- ✅ `processing-pdfs` (lowercase, hyphens)
- ✅ `analyzing-data` (gerund form recommended)
- ❌ `Processing_PDFs` (no uppercase, no underscores)
- ❌ `pdf helper` (no spaces)
- ❌ `anthropic-tool` (no reserved words)

**description field:**
- ✅ "Processes PDFs and extracts text. Use when working with PDF files."
- ❌ "I can help you process PDFs" (wrong POV)
- ❌ "PDF tool" (too vague, no trigger words)

## Step 5: Validate

Run validation:

```bash
python3 scripts/validate_skill.py /path/to/your-skill/
```

Fix any errors before using the skill.

## Example: Creating a simple skill

Let's create a skill for code reviews:

### 1. Create directory and file

```bash
mkdir code-reviewer
touch code-reviewer/SKILL.md
```

### 2. Write SKILL.md

````markdown
---
name: reviewing-code
description: Performs systematic code reviews checking for bugs, security, and best practices. Use when the user asks to review code or wants feedback on code quality.
---

# Code Review

Systematic code review following industry standards.

## Quick start

When asked to review:
1. Read complete code first
2. Check security, correctness, quality
3. Provide specific, actionable feedback

## Review areas

**Security:**
- Input validation
- SQL injection
- XSS vulnerabilities

**Correctness:**
- Logic errors
- Edge cases
- Error handling

**Quality:**
- Code organization
- Naming clarity
- Documentation

## Output format

```markdown
# Code Review

## Critical Issues
- [Issue with line reference]

## Suggestions
- [Improvement ideas]
```

## Notes

- Be specific with line references
- Explain why issues matter
- Provide concrete fixes
````

### 3. Validate

```bash
python3 skill-builder/scripts/validate_skill.py code-reviewer/
```

Expected output:
```
✅ Validation passed - skill structure looks good!
```

### 4. Use the skill

In Claude Code or via API, the skill will trigger when users say:
- "Review this code"
- "Check my code for issues"
- "Give me feedback on this function"

## Common mistakes to avoid

### Wrong name format

```yaml
# ❌ Wrong
name: Code_Reviewer
name: code reviewer
name: anthropic-code-review

# ✅ Correct
name: reviewing-code
name: code-reviewer
```

### Wrong description POV

```yaml
# ❌ Wrong
description: I can help you review code

# ✅ Correct
description: Performs systematic code reviews
```

### Missing trigger words

```yaml
# ❌ Vague
description: Code quality tool

# ✅ Specific with triggers
description: Reviews code for bugs and security. Use when reviewing code, checking quality, or analyzing functions.
```

## Using templates

Copy from templates directory:

```bash
# Simple skill
cp skill-builder/templates/simple-skill-template.md my-skill/SKILL.md

# With references
mkdir -p my-skill/reference
cp skill-builder/templates/skill-with-references-template.md my-skill/SKILL.md

# With scripts
mkdir -p my-skill/scripts
cp skill-builder/templates/skill-with-scripts-template.md my-skill/SKILL.md
```

Then customize the template for your use case.

## Next steps

1. **Read BEST-PRACTICES.md** for detailed authoring guidelines
2. **Check templates/** for pattern examples
3. **Run validation** on your skills
4. **Test thoroughly** with real queries

## Getting help

When using the skill-builder skill with Claude:

```
Create a skill for [your use case]
```

Claude will:
1. Ask clarifying questions
2. Choose appropriate structure
3. Generate all files
4. Validate the result
5. Suggest test queries

## Resources

- [SKILL.md](SKILL.md) - Full skill builder instructions
- [BEST-PRACTICES.md](BEST-PRACTICES.md) - Complete authoring guide
- [templates/](templates/) - Ready-to-use templates
- [Official Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
