---
name: skill-builder
description: Creates new Claude Skills following official best practices. Use when the user asks to create, build, or generate a new Agent Skill, custom skill, or wants help authoring a SKILL.md file. Handles directory structure, YAML frontmatter, progressive disclosure, and validation.
---

# Skill Builder

Creates properly structured Claude Agent Skills following Anthropic's official best practices and conventions.

## When to use this skill

Use this skill when the user wants to:
- Create a new Agent Skill from scratch
- Convert existing documentation or code into a skill
- Improve or restructure an existing skill
- Understand skill authoring best practices

## Quick start workflow

Copy this checklist and track progress:

```
Skill Creation Progress:
- [ ] Step 1: Gather requirements and understand the skill purpose
- [ ] Step 2: Create directory structure
- [ ] Step 3: Generate SKILL.md with valid frontmatter
- [ ] Step 4: Add supporting files if needed
- [ ] Step 5: Validate the skill structure
- [ ] Step 6: Test with example queries
```

## Step 1: Gather requirements

Ask the user these key questions:
1. **What should the skill do?** (specific capability or domain)
2. **When should Claude use it?** (trigger contexts, keywords)
3. **Does it need executable scripts?** (utilities, validation)
4. **Does it need reference files?** (API docs, schemas, examples)
5. **What level of freedom?** (strict procedures vs flexible guidance)

## Step 2: Create directory structure

Choose the appropriate structure based on complexity:

**Simple skill** (instructions only):
```
skill-name/
└── SKILL.md
```

**Medium skill** (with reference docs):
```
skill-name/
├── SKILL.md
└── reference/
    ├── api.md
    └── examples.md
```

**Complex skill** (with scripts and resources):
```
skill-name/
├── SKILL.md
├── reference/
│   ├── guide.md
│   └── examples.md
└── scripts/
    ├── validate.py
    └── helper.py
```

Use forward slashes (/) in all paths, never backslashes (\).

## Step 3: Generate SKILL.md

The SKILL.md file must have this structure:

```markdown
---
name: skill-name-here
description: Brief description of what the skill does and when to use it.
---

# Skill Title

[Concise overview paragraph]

## Quick start

[Simplest possible usage example]

## [Additional sections as needed]

[Progressive disclosure to detailed content]
```

### YAML Frontmatter Requirements

**Critical validation rules:**

**name field:**
- Maximum 64 characters
- MUST use lowercase letters, numbers, and hyphens only
- NO uppercase letters
- NO underscores (use hyphens instead)
- NO spaces
- NO reserved words: "anthropic", "claude"
- NO XML tags
- Use gerund form (verb + -ing): `processing-pdfs`, `analyzing-data`

**description field:**
- Maximum 1024 characters
- MUST be non-empty
- NO XML tags
- Include BOTH what it does AND when to use it
- Write in third person: "Processes files" not "I process files"
- Include key terms and trigger words

### Description Best Practices

**Good description examples:**

```yaml
description: Extracts text and tables from PDF files, fills forms, and merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

```yaml
description: Analyzes Excel spreadsheets, creates pivot tables, and generates charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.
```

**Bad descriptions (avoid):**
- "Helps with documents" (too vague)
- "I can process PDFs" (wrong POV)
- "Utility for files" (no trigger words)

## Step 4: Content organization

### Keep SKILL.md concise

**Core principle:** The context window is a public good.

- Keep SKILL.md body under 500 lines
- Only include what Claude doesn't already know
- Challenge every explanation: "Does Claude really need this?"
- Use progressive disclosure for detailed content

### Progressive disclosure pattern

SKILL.md is an overview that points to detailed materials:

````markdown
# Skill Overview

## Quick start
[Simple example here]

## Advanced features

**Feature A**: See [FEATURE-A.md](FEATURE-A.md)
**Feature B**: See [FEATURE-B.md](FEATURE-B.md)
**API Reference**: See [reference/api.md](reference/api.md)

## Quick search

Find specific topics:
```bash
grep -i "topic" reference/*.md
```
````

**Important:** Keep references one level deep from SKILL.md. Avoid nested references (file → file → file).

### Set appropriate degrees of freedom

**High freedom** (flexible guidance):
```markdown
## Code review process

1. Analyze code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability
4. Verify adherence to conventions
```

**Low freedom** (specific scripts):
````markdown
## Database migration

Run exactly this script:
```bash
python scripts/migrate.py --verify --backup
```

Do not modify the command.
````

### Workflows for complex tasks

For multi-step operations, provide clear checklists:

````markdown
## Data analysis workflow

Copy and track:
```
Analysis Progress:
- [ ] Step 1: Load and validate data
- [ ] Step 2: Clean and transform
- [ ] Step 3: Run analysis
- [ ] Step 4: Validate results
- [ ] Step 5: Generate report
```

**Step 1: Load and validate data**
[Instructions...]
````

### Include feedback loops

For quality-critical operations:

```markdown
## Document creation process

1. Generate initial draft
2. **Validate**: Check against style guide
3. If validation fails:
   - Note specific issues
   - Revise the content
   - Validate again
4. Only proceed when validation passes
5. Finalize output
```

## Step 5: Validation

Before finalizing, validate the skill:

**Run validation script:**
```bash
python scripts/validate_skill.py skill-name/
```

**Manual checklist:**
- [ ] name: lowercase, hyphens, under 64 chars
- [ ] description: includes what + when, under 1024 chars
- [ ] All file paths use forward slashes (/)
- [ ] No time-sensitive information
- [ ] Consistent terminology throughout
- [ ] Progressive disclosure used appropriately
- [ ] SKILL.md body under 500 lines
- [ ] References are one level deep

## Step 6: Test the skill

Create example queries to test:

1. **Skill triggers correctly**: Does the description have right keywords?
2. **Instructions are clear**: Can Claude follow them?
3. **References work**: Can Claude find and read linked files?
4. **Scripts execute**: Do utility scripts run correctly?

## Advanced features

### Executable scripts

See [SCRIPTS.md](SCRIPTS.md) for guidance on:
- When to include scripts vs text instructions
- Error handling patterns
- Script documentation

### Templates

See [templates/](templates/) for pre-built patterns:
- Simple instruction-only skill
- Skill with reference docs
- Skill with executable scripts
- Domain-specific organization

### Best practices reference

See [BEST-PRACTICES.md](BEST-PRACTICES.md) for complete authoring guidelines.

## Common patterns

### Template pattern

Provide output templates when format matters:

````markdown
## Report structure

Use this template:
```markdown
# [Title]

## Executive summary
[One paragraph]

## Key findings
- Finding 1
- Finding 2

## Recommendations
1. Action 1
2. Action 2
```
````

### Examples pattern

Show input/output pairs:

````markdown
## Commit message format

**Example 1:**
Input: Added user authentication
Output:
```
feat(auth): implement JWT authentication

Add login endpoint and token validation
```
````

### Conditional workflow

Guide through decision points:

```markdown
## Workflow

1. Determine task type:
   - **Creating new?** → Follow creation workflow
   - **Editing existing?** → Follow editing workflow

2. Creation workflow: [steps...]
3. Editing workflow: [steps...]
```

## Anti-patterns to avoid

- ❌ Windows-style paths (use `/` not `\`)
- ❌ Too many options ("Use pypdf or pdfplumber or...")
- ❌ Time-sensitive info ("Before August 2025...")
- ❌ Inconsistent terminology (mixing "API endpoint", "URL", "route")
- ❌ Deeply nested references (file → file → file)
- ❌ Over-explaining what Claude already knows
- ❌ Vague names ("helper", "utils")
- ❌ First-person descriptions ("I can help...")
- ❌ Missing trigger words in description

## Output format

When creating a skill, generate:

1. **Directory structure** (create all directories)
2. **SKILL.md** (with valid frontmatter)
3. **Supporting files** (reference docs, scripts)
4. **Validation report** (run validation script)
5. **Test queries** (suggested prompts to test the skill)

## Notes

- Skills run in code execution environment with bash access
- No network access in API environment
- Pre-installed packages only (see code execution docs)
- Skill files are read on-demand (progressive disclosure)
- Scripts can be executed without loading into context
