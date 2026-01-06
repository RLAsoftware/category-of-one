# Executable Scripts in Skills

Guide for including and using executable scripts in Agent Skills.

## When to include scripts

Scripts provide advantages over Claude-generated code:

**Benefits:**
- **Reliability**: Pre-tested, consistent behavior
- **Token efficiency**: Execute without loading code into context
- **Speed**: No code generation time
- **Consistency**: Same result every time

**Use scripts for:**
- Validation operations
- Data transformations
- Format conversions
- File parsing
- Complex algorithms
- Quality checks

**Use text instructions for:**
- Flexible analysis tasks
- Creative operations
- Context-dependent decisions
- Simple operations Claude handles well

## Script documentation pattern

Make execution intent clear in SKILL.md:

### For execution (most common)

````markdown
## Utility scripts

**analyze_form.py**: Extract form fields from PDF

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

Output format:
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200}
}
```
````

### For reference (complex algorithms)

````markdown
## Algorithm reference

For details on the field extraction algorithm, see `scripts/analyze_form.py`.

The algorithm uses:
- Computer vision for field detection
- OCR for text recognition
- Heuristics for field type classification
````

## Script best practices

### 1. Solve problems, don't punt

Handle errors explicitly rather than failing:

**Good:**
```python
def process_file(path):
    """Process file, create if missing."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"Creating {path} with defaults")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        print(f"Cannot access {path}, using fallback")
        return get_default_content()
```

**Bad:**
```python
def process_file(path):
    # Just fail, let Claude handle it
    return open(path).read()
```

### 2. Document configuration values

Avoid "voodoo constants":

**Good:**
```python
# HTTP requests typically complete within 30 seconds
# Longer timeout accounts for slow connections
REQUEST_TIMEOUT = 30

# Three retries balances reliability vs speed
# Most intermittent failures resolve by second retry
MAX_RETRIES = 3

# Wait 2s between retries to allow transient issues to resolve
RETRY_DELAY = 2.0
```

**Bad:**
```python
TIMEOUT = 47  # Random number
RETRIES = 5   # Why 5?
DELAY = 1.3   # Unexplained
```

### 3. Provide helpful error messages

**Good:**
```python
def validate_fields(data, schema):
    errors = []

    # Check required fields
    for field in schema['required']:
        if field not in data:
            errors.append(
                f"Missing required field '{field}'. "
                f"Available fields: {', '.join(data.keys())}"
            )

    # Check field types
    for field, value in data.items():
        expected_type = schema['fields'].get(field, {}).get('type')
        if expected_type and not isinstance(value, expected_type):
            errors.append(
                f"Field '{field}' has type {type(value).__name__}, "
                f"expected {expected_type.__name__}"
            )

    if errors:
        print("Validation errors found:")
        for error in errors:
            print(f"  - {error}")
        return False

    print("Validation passed")
    return True
```

**Bad:**
```python
def validate_fields(data, schema):
    assert all(f in data for f in schema['required'])
    return True  # Cryptic assertion errors
```

### 4. Use clear argument parsing

**Good:**
```python
import argparse

def main():
    parser = argparse.ArgumentParser(
        description="Extract form fields from PDF"
    )
    parser.add_argument(
        'input_pdf',
        help="Path to input PDF file"
    )
    parser.add_argument(
        '--output', '-o',
        default='fields.json',
        help="Output JSON file (default: fields.json)"
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help="Show detailed progress"
    )

    args = parser.parse_args()
    process_pdf(args.input_pdf, args.output, args.verbose)

if __name__ == '__main__':
    main()
```

### 5. Include usage examples in docstrings

```python
def merge_pdfs(pdf_files, output_path):
    """
    Merge multiple PDF files into one.

    Args:
        pdf_files: List of paths to PDF files
        output_path: Path for merged output PDF

    Example:
        merge_pdfs(['doc1.pdf', 'doc2.pdf'], 'merged.pdf')

    Returns:
        Path to created file

    Raises:
        FileNotFoundError: If input PDF doesn't exist
        ValueError: If pdf_files is empty
    """
    if not pdf_files:
        raise ValueError("pdf_files cannot be empty")

    # Implementation...
    return output_path
```

## Verifiable intermediate outputs pattern

For complex operations, create plan files that can be validated:

### Pattern: Plan → Validate → Execute

````markdown
## Batch update workflow

1. **Analyze**: `python scripts/analyze.py input.pdf`
   Creates `fields.json` with all form fields

2. **Create plan**: Edit `updates.json` with desired changes
   ```json
   {
     "field_name": {"value": "new value"},
     "date_field": {"value": "2025-01-15"}
   }
   ```

3. **Validate plan**: `python scripts/validate_plan.py updates.json`
   Checks:
   - All fields exist
   - Values have correct types
   - No conflicting updates
   - Required fields present

4. **If validation fails**:
   - Review error messages
   - Fix issues in updates.json
   - Run validation again

5. **Execute**: `python scripts/apply_updates.py input.pdf updates.json output.pdf`
   Applies changes to create output PDF

6. **Verify**: `python scripts/verify_output.py output.pdf`
   Confirms all updates applied correctly
````

**Why this works:**
- Catches errors before applying changes
- Machine-verifiable (objective)
- Reversible planning phase
- Clear debugging path

**When to use:**
- Batch operations
- Destructive changes
- Complex validation rules
- High-stakes operations

## Script organization

### Directory structure

```
skill-name/
├── SKILL.md
├── scripts/
│   ├── __init__.py
│   ├── analyze.py       # Input analysis
│   ├── validate.py      # Validation
│   ├── process.py       # Main processing
│   ├── verify.py        # Output verification
│   └── utils/           # Shared utilities
│       ├── __init__.py
│       ├── pdf_utils.py
│       └── validators.py
└── reference/
    └── api.md
```

### Shared utilities

Extract common code to utilities:

```python
# scripts/utils/validators.py

def validate_pdf_path(path):
    """Validate PDF file path exists and is readable."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"PDF not found: {path}")
    if not path.lower().endswith('.pdf'):
        raise ValueError(f"Not a PDF file: {path}")
    if not os.access(path, os.R_OK):
        raise PermissionError(f"Cannot read: {path}")
    return path

def validate_json_schema(data, schema):
    """Validate data against JSON schema."""
    # Implementation...
    pass
```

## Testing scripts

Include tests in your skill:

```
skill-name/
├── SKILL.md
├── scripts/
│   ├── analyze.py
│   └── validate.py
├── tests/
│   ├── test_analyze.py
│   ├── test_validate.py
│   └── fixtures/
│       ├── sample.pdf
│       └── expected.json
└── README.md
```

## Package dependencies

List required packages and verify availability:

````markdown
## Requirements

This skill requires these packages (all pre-installed):
- Python 3.8+
- pdfplumber
- Pillow
- pandas

Verify availability in [code execution docs](https://docs.anthropic.com/en/agents-and-tools/tool-use/code-execution-tool).

If package missing in API environment:
- Note limitation in skill documentation
- Consider alternative approaches
- Use API availability only if network needed
````

## Visual analysis pattern

For visual layouts, convert to images:

````markdown
## Form layout analysis

1. **Convert to images**: `python scripts/pdf_to_images.py form.pdf`
   Creates `form_page_1.png`, `form_page_2.png`, etc.

2. **Analyze visually**: Claude can see:
   - Field locations and alignment
   - Visual structure and grouping
   - Layout patterns
   - Form boundaries

3. **Extract field data**: Based on visual analysis
````

## Example: Complete script set

### analyze_form.py
```python
#!/usr/bin/env python3
"""Extract form fields from PDF."""

import json
import sys
import pdfplumber
from pathlib import Path

def analyze_form(pdf_path):
    """
    Analyze PDF form and extract field information.

    Returns dict of fields with positions and types.
    """
    fields = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            # Extract form fields
            if hasattr(page, 'annots') and page.annots:
                for annot in page.annots:
                    field_name = annot.get('T', f'field_{len(fields)}')
                    fields[field_name] = {
                        'page': page_num,
                        'type': annot.get('FT', 'unknown'),
                        'x': annot.get('Rect', [0,0,0,0])[0],
                        'y': annot.get('Rect', [0,0,0,0])[1],
                    }

    return fields

def main():
    if len(sys.argv) != 2:
        print("Usage: python analyze_form.py INPUT.pdf")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    fields = analyze_form(pdf_path)
    print(json.dumps(fields, indent=2))

if __name__ == '__main__':
    main()
```

### validate_plan.py
```python
#!/usr/bin/env python3
"""Validate update plan against form fields."""

import json
import sys
from pathlib import Path

def validate_plan(plan_path, fields_path):
    """Validate update plan against available fields."""

    # Load plan
    with open(plan_path) as f:
        plan = json.load(f)

    # Load fields
    with open(fields_path) as f:
        fields = json.load(f)

    errors = []

    # Check each planned update
    for field_name, update in plan.items():
        if field_name not in fields:
            available = ', '.join(sorted(fields.keys()))
            errors.append(
                f"Field '{field_name}' not found. "
                f"Available: {available}"
            )
            continue

        # Validate value type
        field_type = fields[field_name]['type']
        value = update.get('value')

        if field_type == 'text' and not isinstance(value, str):
            errors.append(
                f"Field '{field_name}' expects text, "
                f"got {type(value).__name__}"
            )

    if errors:
        print("Validation errors:")
        for error in errors:
            print(f"  ✗ {error}")
        return False

    print(f"✓ Validation passed ({len(plan)} fields)")
    return True

def main():
    if len(sys.argv) != 3:
        print("Usage: validate_plan.py PLAN.json FIELDS.json")
        sys.exit(1)

    success = validate_plan(
        Path(sys.argv[1]),
        Path(sys.argv[2])
    )
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
```

## Summary

**Key takeaways:**

1. Scripts save tokens and ensure reliability
2. Handle errors explicitly, don't punt
3. Document all configuration values
4. Provide helpful error messages
5. Use plan-validate-execute for complex ops
6. Make execution intent clear in SKILL.md
7. Test scripts with real inputs
8. Verify package availability
