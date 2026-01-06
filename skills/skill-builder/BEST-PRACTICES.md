# Skill Authoring Best Practices

Complete reference for creating effective Claude Agent Skills.

## Core principles

### 1. Concise is key

The context window is shared by:
- System prompt
- Conversation history
- Other Skills' metadata
- The actual user request

**Only add context Claude doesn't already have.**

**Good (50 tokens):**
````markdown
## Extract PDF text

Use pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Bad (150 tokens):**
```markdown
## Extract PDF text

PDF (Portable Document Format) files are common... [lengthy explanation]
There are many libraries available... [more explanation]
First install it using pip... [unnecessary details]
```

### 2. Progressive disclosure

Skill architecture has three levels:

1. **Metadata (always loaded)**: Name and description
2. **SKILL.md (loaded when triggered)**: Overview and navigation
3. **Additional files (loaded as needed)**: Detailed docs, scripts

**Keep SKILL.md under 500 lines.** Split content into separate files when approaching this limit.

### 3. Appropriate degrees of freedom

Match specificity to task fragility:

**High freedom** - Multiple valid approaches:
```markdown
## Code review

1. Analyze structure and organization
2. Check for bugs or edge cases
3. Suggest readability improvements
```

**Medium freedom** - Preferred pattern with flexibility:
````markdown
## Generate report

Use this template, customize as needed:
```python
def generate_report(data, format="markdown"):
    # Process data
    # Generate output
```
````

**Low freedom** - Fragile operations requiring exact steps:
````markdown
## Database migration

Run exactly:
```bash
python scripts/migrate.py --verify --backup
```

Do not modify flags.
````

### 4. Test with target models

Test with all models you'll use:
- **Haiku**: Does it provide enough guidance?
- **Sonnet**: Is it clear and efficient?
- **Opus**: Does it avoid over-explaining?

## Naming conventions

Use gerund form (verb + -ing) for consistency:

**Good:**
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`

**Acceptable alternatives:**
- `pdf-processing`
- `spreadsheet-analysis`

**Avoid:**
- `helper`, `utils`, `tools` (vague)
- `documents`, `data` (too generic)
- `anthropic-helper` (reserved words)

**Technical requirements:**
- Maximum 64 characters
- Lowercase letters, numbers, hyphens only
- No underscores, spaces, or special characters
- No reserved words: "anthropic", "claude"

## Writing effective descriptions

The description enables skill discovery and must include:
1. What the skill does
2. When to use it (trigger contexts)

**Always use third person.** The description is injected into the system prompt.

**Good:**
```yaml
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

**Good:**
```yaml
description: Analyzes Excel spreadsheets, creates pivot tables, generates charts. Use when analyzing Excel files, spreadsheets, tabular data, or .xlsx files.
```

**Bad - too vague:**
```yaml
description: Helps with documents
```

**Bad - wrong POV:**
```yaml
description: I can help you process PDFs
```

**Bad - missing triggers:**
```yaml
description: Processes data files
```

**Requirements:**
- Maximum 1024 characters
- Non-empty
- No XML tags
- Include specific keywords for discovery

## Content organization

### Structure longer reference files

For files over 100 lines, add table of contents:

```markdown
# API Reference

## Contents
- Authentication and setup
- Core methods
- Advanced features
- Error handling
- Code examples

## Authentication and setup
...
```

### Avoid deeply nested references

Keep references one level deep from SKILL.md.

**Bad - too deep:**
```markdown
# SKILL.md → advanced.md → details.md → actual info
```

**Good - one level:**
```markdown
# SKILL.md
- Basic usage [in SKILL.md]
- Advanced: See advanced.md
- API: See reference/api.md
- Examples: See examples.md
```

### Domain-specific organization

For multi-domain skills, organize by domain:

```
bigquery-skill/
├── SKILL.md
└── reference/
    ├── finance.md
    ├── sales.md
    ├── product.md
    └── marketing.md
```

Claude loads only relevant domain files.

## Workflows and feedback loops

### Multi-step workflows

Provide checklists for complex tasks:

````markdown
## Research workflow

Copy and track:
```
Progress:
- [ ] Step 1: Read source documents
- [ ] Step 2: Identify themes
- [ ] Step 3: Cross-reference
- [ ] Step 4: Create summary
- [ ] Step 5: Verify citations
```

**Step 1: Read sources**
[Instructions...]
````

### Implement feedback loops

Common pattern: validate → fix → repeat

````markdown
## Document editing

1. Make edits to XML
2. **Validate**: `python scripts/validate.py`
3. If fails:
   - Review errors
   - Fix issues
   - Validate again
4. **Only proceed when passes**
5. Rebuild document
````

## Content guidelines

### Avoid time-sensitive information

**Bad:**
```markdown
If before August 2025, use old API.
After August 2025, use new API.
```

**Good:**
```markdown
## Current method

Use v2 API: `api.example.com/v2/messages`

## Old patterns

<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>

v1 used: `api.example.com/v1/messages`
No longer supported.
</details>
```

### Use consistent terminology

Choose one term and stick with it:

**Good:**
- Always "API endpoint"
- Always "field"
- Always "extract"

**Bad:**
- Mix "API endpoint", "URL", "route"
- Mix "field", "box", "element"
- Mix "extract", "pull", "get"

## Common patterns

### Template pattern

**Strict requirements:**
````markdown
## Report structure

ALWAYS use this exact format:
```markdown
# [Title]

## Executive summary
[One paragraph]

## Key findings
- Finding 1
- Finding 2
```
````

**Flexible guidance:**
````markdown
## Report structure

Default format (adapt as needed):
```markdown
# [Title]

## Summary
[Overview]

## Findings
[Sections based on analysis]
```
````

### Examples pattern

````markdown
## Commit messages

**Example 1:**
Input: Added user authentication
Output:
```
feat(auth): implement JWT authentication

Add login endpoint and validation
```

**Example 2:**
Input: Fixed date bug
Output:
```
fix(reports): correct date formatting

Use UTC consistently
```
````

### Conditional workflow

```markdown
## Workflow

1. Determine type:
   - **Creating new?** → Creation workflow
   - **Editing existing?** → Editing workflow

2. Creation: [steps...]
3. Editing: [steps...]
```

## Executable scripts

### When to include scripts

**Benefits:**
- More reliable than generated code
- Save tokens (no code in context)
- Save time (no generation)
- Ensure consistency

**Make intent clear:**
- "Run `script.py`" (execute)
- "See `script.py` for algorithm" (reference)

### Script best practices

**Solve, don't punt:**

**Good:**
```python
def process_file(path):
    try:
        return open(path).read()
    except FileNotFoundError:
        print(f"Creating {path}")
        open(path, 'w').write('')
        return ''
```

**Bad:**
```python
def process_file(path):
    # Just fail, let Claude figure it out
    return open(path).read()
```

**Document configuration:**

**Good:**
```python
# HTTP requests complete within 30s
# Longer timeout for slow connections
REQUEST_TIMEOUT = 30
```

**Bad:**
```python
TIMEOUT = 47  # Why?
```

### Create verifiable outputs

Plan-validate-execute pattern:

```markdown
## Batch update workflow

1. Analyze: `python analyze.py` → fields.json
2. Create plan: Edit updates.json
3. **Validate plan**: `python validate_plan.py`
4. If validation fails:
   - Review errors
   - Fix plan
   - Validate again
5. Execute: `python apply_updates.py`
6. Verify: `python verify_results.py`
```

### Package dependencies

List required packages and verify they're available in code execution environment.

**Check:** [Code execution tool docs](https://docs.anthropic.com/en/agents-and-tools/tool-use/code-execution-tool)

```markdown
## Requirements

This skill requires:
- Python 3.8+
- pdfplumber (pre-installed in code execution)
- Pillow (pre-installed)

If missing, note limitation.
```

## Evaluation and iteration

### Build evaluations first

1. **Identify gaps**: Run Claude without skill, note failures
2. **Create scenarios**: 3+ test cases
3. **Establish baseline**: Measure without skill
4. **Write minimal instructions**: Address gaps only
5. **Iterate**: Compare against baseline

**Evaluation structure:**
```json
{
  "skills": ["pdf-processing"],
  "query": "Extract text from PDF to output.txt",
  "files": ["test.pdf"],
  "expected_behavior": [
    "Read PDF with appropriate library",
    "Extract all pages without missing content",
    "Save to output.txt in readable format"
  ]
}
```

### Develop iteratively with Claude

**Creating new skills:**

1. Complete task with Claude A (helper instance)
2. Identify reusable pattern
3. Ask Claude A to create skill
4. Review for conciseness
5. Improve information architecture
6. Test with Claude B (fresh instance)
7. Iterate based on Claude B's behavior

**Improving existing skills:**

1. Use skill with Claude B in real workflows
2. Observe where it struggles or succeeds
3. Return to Claude A with observations
4. Review and apply refinements
5. Test changes with Claude B
6. Repeat based on usage

### Observe Claude's navigation

Watch for:
- Unexpected exploration paths
- Missed connections to important files
- Overreliance on certain sections
- Ignored content

Iterate based on observations, not assumptions.

## Anti-patterns

### Avoid Windows-style paths

✓ **Good:** `scripts/helper.py`, `reference/guide.md`
✗ **Bad:** `scripts\helper.py`, `reference\guide.md`

Unix-style works everywhere, Windows-style fails on Unix.

### Avoid offering too many options

**Bad:**
"Use pypdf, or pdfplumber, or PyMuPDF, or pdf2image..."

**Good:**
````markdown
Use pdfplumber:
```python
import pdfplumber
```

For scanned PDFs with OCR, use pdf2image with pytesseract.
````

### Don't assume packages are installed

**Bad:**
"Use the pdf library"

**Good:**
````markdown
Install required package: `pip install pypdf`

Then:
```python
from pypdf import PdfReader
```
````

## MCP tool references

Use fully qualified names: `ServerName:tool_name`

```markdown
Use BigQuery:bigquery_schema tool to retrieve schemas.
Use GitHub:create_issue tool to create issues.
```

## Validation checklist

Before finalizing:

### Core quality
- [ ] Description includes what + when
- [ ] Name: lowercase, hyphens, under 64 chars
- [ ] SKILL.md under 500 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Examples are concrete
- [ ] References one level deep
- [ ] Progressive disclosure used

### Code and scripts
- [ ] Scripts solve, don't punt
- [ ] Error handling explicit
- [ ] Configuration documented
- [ ] Required packages listed
- [ ] Scripts documented
- [ ] Forward slashes only
- [ ] Validation for critical ops
- [ ] Feedback loops included

### Testing
- [ ] 3+ evaluations created
- [ ] Tested with target models
- [ ] Real usage scenarios tested
- [ ] Team feedback incorporated

## Runtime environment

Skills run in code execution with:
- Filesystem access
- Bash commands
- Code execution
- No network (API environment)
- Pre-installed packages only

**How Claude accesses skills:**

1. Metadata pre-loaded (name, description)
2. Files read on-demand via bash
3. Scripts executed without loading content
4. No context penalty until accessed

**Authoring implications:**
- File paths matter (forward slashes)
- Descriptive filenames
- Organize for discovery
- Bundle comprehensive resources
- Make execution intent clear
- Test file access patterns
