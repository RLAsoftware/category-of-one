# Skill Builder

A Claude Agent Skill that creates new Claude Skills following Anthropic's official best practices.

## What is this?

This skill helps Claude build properly structured Agent Skills with:
- Valid YAML frontmatter
- Appropriate file organization
- Progressive disclosure patterns
- Executable scripts when needed
- Validation and testing guidance

## Quick start

When using this skill with Claude, ask:

```
Create a skill for [your use case]
```

Claude will:
1. Ask clarifying questions about requirements
2. Choose appropriate structure (simple/with references/with scripts)
3. Generate all necessary files
4. Validate the skill structure
5. Provide test queries

## What's included

### Core files

- **SKILL.md**: Main instructions for building skills
- **BEST-PRACTICES.md**: Complete authoring reference
- **SCRIPTS.md**: Guide for executable scripts in skills

### Templates

- **simple-skill-template.md**: For instruction-only skills
- **skill-with-references-template.md**: For skills with reference docs
- **skill-with-scripts-template.md**: For skills with executable Python scripts

### Scripts

- **validate_skill.py**: Validates skill structure and frontmatter

## Using the skill

### Example 1: Simple skill

```
User: Create a skill for reviewing pull requests

Claude will:
1. Ask about review criteria and workflows
2. Generate a simple skill with review checklist
3. Validate the structure
4. Suggest test queries like "Review this PR"
```

### Example 2: Skill with references

```
User: Create a skill for querying our BigQuery datasets

Claude will:
1. Ask about datasets, schemas, conventions
2. Generate skill with separate reference files
3. Organize schemas by domain (sales, users, etc.)
4. Include query conventions and examples
5. Validate and provide test queries
```

### Example 3: Skill with scripts

```
User: Create a skill for filling PDF forms

Claude will:
1. Ask about validation requirements
2. Generate skill with Python utility scripts
3. Include analyze, validate, process, verify scripts
4. Create workflow with feedback loops
5. Validate and provide test queries
```

## Validation

Run validation on any skill:

```bash
python scripts/validate_skill.py /path/to/skill-directory/
```

Checks:
- SKILL.md exists and is valid
- Name: lowercase, hyphens, under 64 chars, no reserved words
- Description: non-empty, under 1024 chars, third person
- No Windows-style paths
- No first/second person in description

## Skill structure patterns

### Simple (instructions only)

```
skill-name/
└── SKILL.md
```

### With references (organized content)

```
skill-name/
├── SKILL.md
└── reference/
    ├── guide.md
    └── examples.md
```

### With scripts (executable utilities)

```
skill-name/
├── SKILL.md
├── reference/
│   └── api.md
└── scripts/
    ├── analyze.py
    ├── validate.py
    └── process.py
```

## Key principles

### 1. Concise is key

Only include what Claude doesn't already know. Challenge every explanation.

### 2. Progressive disclosure

- Level 1: Metadata (name, description)
- Level 2: SKILL.md (overview, navigation)
- Level 3: Additional files (detailed content)

### 3. Appropriate degrees of freedom

- **High freedom**: Flexible guidance for analysis tasks
- **Low freedom**: Strict scripts for fragile operations

### 4. Test thoroughly

Create evaluations and test with target models (Haiku, Sonnet, Opus).

## YAML frontmatter requirements

**name:**
- Max 64 characters
- Lowercase letters, numbers, hyphens only
- No underscores, spaces, or reserved words
- Recommended: gerund form (processing-pdfs, analyzing-data)

**description:**
- Max 1024 characters
- Non-empty, no XML tags
- Third person only (not "I can" or "You can")
- Include BOTH what it does AND when to use it
- Include trigger keywords

## Common patterns

### Template pattern

Provide output templates for consistent formatting.

### Examples pattern

Show input/output pairs for clarity.

### Conditional workflow

Guide through decision points with clear branches.

### Feedback loops

Validate → fix → repeat for quality-critical operations.

## Anti-patterns to avoid

- ❌ Windows-style paths (`\` instead of `/`)
- ❌ Too many options (confusing choices)
- ❌ Time-sensitive information
- ❌ Inconsistent terminology
- ❌ Deeply nested references
- ❌ Vague names (helper, utils, tools)
- ❌ First-person descriptions

## Resources

- [Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Best Practices Guide](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Quickstart Tutorial](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [Skills API Reference](https://platform.claude.com/docs/en/api/skills/create-skill)

## License

This skill is designed to help you create your own Claude Agent Skills following Anthropic's official guidelines and best practices.

## Version

Version: 1.0.0
Created: 2025-01-16
Compatible with: Claude Code and Claude API (skills-2025-10-02 beta)
