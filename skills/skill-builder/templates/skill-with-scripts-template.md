# Skill with Scripts Template

Use this template for skills that include executable Python scripts.

## Directory structure

```
skill-name/
├── SKILL.md              # Main instructions
├── scripts/              # Executable scripts
│   ├── analyze.py       # Input analysis
│   ├── validate.py      # Validation
│   ├── process.py       # Main processing
│   └── utils/           # Shared utilities
│       ├── __init__.py
│       └── helpers.py
├── reference/            # Optional: detailed docs
│   └── api.md
└── tests/               # Optional: test files
    ├── test_analyze.py
    └── fixtures/
        └── sample.pdf
```

## SKILL.md template

````markdown
---
name: your-skill-name
description: What this skill does and when to use it. Mention key operations and file types.
---

# Skill Title

[Overview of what this skill does, emphasizing that it includes utility scripts]

## Quick start

[Simplest usage showing script execution]

```bash
python scripts/process.py input.ext output.ext
```

## Workflow

Copy and track:

```
Task Progress:
- [ ] Step 1: Analyze input
- [ ] Step 2: Validate data
- [ ] Step 3: Process
- [ ] Step 4: Verify output
```

### Step 1: Analyze input

Run analysis script:

```bash
python scripts/analyze.py input.ext > analysis.json
```

Output format:
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### Step 2: Validate data

**Critical: Always validate before processing**

```bash
python scripts/validate.py analysis.json
```

If validation fails:
- Review error messages carefully
- Fix identified issues
- Run validation again
- Only proceed when validation passes

### Step 3: Process

Run main processing:

```bash
python scripts/process.py input.ext output.ext
```

### Step 4: Verify output

Confirm results:

```bash
python scripts/verify.py output.ext
```

## Utility scripts reference

### analyze.py

**Purpose**: Extract metadata and structure from input

**Usage:**
```bash
python scripts/analyze.py INPUT [--verbose]
```

**Arguments:**
- `INPUT`: Path to input file
- `--verbose, -v`: Show detailed progress

**Output**: JSON to stdout

### validate.py

**Purpose**: Validate data against schema and rules

**Usage:**
```bash
python scripts/validate.py DATA_FILE
```

**Exit codes:**
- 0: Validation passed
- 1: Validation failed

**Output**: Error messages if validation fails

### process.py

**Purpose**: Main processing operation

**Usage:**
```bash
python scripts/process.py INPUT OUTPUT [OPTIONS]
```

**Arguments:**
- `INPUT`: Source file path
- `OUTPUT`: Destination file path
- `--format`: Output format (default: auto-detect)

### verify.py

**Purpose**: Verify output correctness

**Usage:**
```bash
python scripts/verify.py OUTPUT_FILE
```

**Output**: Verification report

## Requirements

This skill requires:
- Python 3.8+
- [package1] (pre-installed in code execution)
- [package2] (pre-installed in code execution)

Verify availability in [code execution docs](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool).

## Error handling

Common errors and solutions:

**"File not found":**
- Check file path is correct
- Verify file exists: `ls -la input.ext`

**"Validation failed":**
- Read error messages carefully
- Check data format matches expected schema
- See [reference/troubleshooting.md](reference/troubleshooting.md)

## Notes

- Always run validation before processing
- Scripts output to stdout, can redirect to files
- Use `--verbose` flag for debugging
- All scripts handle errors gracefully
````

## Script template: analyze.py

```python
#!/usr/bin/env python3
"""
Analyze input file and extract metadata.

Usage:
    python analyze.py INPUT [-v|--verbose]

Example:
    python analyze.py document.pdf > analysis.json
"""

import argparse
import json
import sys
from pathlib import Path

def analyze_file(file_path, verbose=False):
    """
    Analyze file and extract metadata.

    Args:
        file_path: Path to input file
        verbose: Show detailed progress

    Returns:
        Dict of extracted metadata

    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If file format invalid
    """
    if verbose:
        print(f"Analyzing {file_path}...", file=sys.stderr)

    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    # Perform analysis
    metadata = {
        'filename': path.name,
        'size': path.stat().st_size,
        # Add more extracted data...
    }

    if verbose:
        print(f"Extracted {len(metadata)} fields", file=sys.stderr)

    return metadata

def main():
    parser = argparse.ArgumentParser(
        description='Analyze input file and extract metadata'
    )
    parser.add_argument(
        'input',
        help='Input file path'
    )
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Show detailed progress'
    )

    args = parser.parse_args()

    try:
        metadata = analyze_file(args.input, args.verbose)
        print(json.dumps(metadata, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
```

## Script template: validate.py

```python
#!/usr/bin/env python3
"""
Validate data against schema and rules.

Usage:
    python validate.py DATA_FILE

Exit codes:
    0 - Validation passed
    1 - Validation failed
"""

import argparse
import json
import sys
from pathlib import Path

def validate_data(data_path):
    """
    Validate data file.

    Args:
        data_path: Path to JSON data file

    Returns:
        Tuple of (success: bool, errors: list)
    """
    # Load data
    with open(data_path) as f:
        data = json.load(f)

    errors = []

    # Validation checks
    required_fields = ['field1', 'field2']
    for field in required_fields:
        if field not in data:
            errors.append(
                f"Missing required field '{field}'. "
                f"Available: {', '.join(data.keys())}"
            )

    # Type checks
    if 'field1' in data and not isinstance(data['field1'], str):
        errors.append(
            f"Field 'field1' must be string, "
            f"got {type(data['field1']).__name__}"
        )

    # Business logic checks
    # Add domain-specific validation...

    return len(errors) == 0, errors

def main():
    parser = argparse.ArgumentParser(
        description='Validate data file'
    )
    parser.add_argument(
        'data_file',
        help='Path to JSON data file'
    )

    args = parser.parse_args()

    # Check file exists
    if not Path(args.data_file).exists():
        print(f"Error: File not found: {args.data_file}")
        sys.exit(1)

    # Run validation
    success, errors = validate_data(args.data_file)

    if success:
        print(f"✓ Validation passed")
        sys.exit(0)
    else:
        print(f"✗ Validation failed:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)

if __name__ == '__main__':
    main()
```

## Script template: process.py

```python
#!/usr/bin/env python3
"""
Main processing script.

Usage:
    python process.py INPUT OUTPUT [OPTIONS]

Example:
    python process.py input.pdf output.pdf --format enhanced
"""

import argparse
import sys
from pathlib import Path

def process_file(input_path, output_path, format='auto'):
    """
    Process input file and create output.

    Args:
        input_path: Source file path
        output_path: Destination file path
        format: Output format

    Returns:
        Path to created output file

    Raises:
        FileNotFoundError: If input doesn't exist
        ValueError: If format invalid
    """
    # Validate input
    input_file = Path(input_path)
    if not input_file.exists():
        raise FileNotFoundError(f"Input not found: {input_path}")

    # Process
    print(f"Processing {input_path}...")

    # Perform processing operations
    # ...

    # Write output
    output_file = Path(output_path)
    # ...

    print(f"Created {output_path}")
    return output_file

def main():
    parser = argparse.ArgumentParser(
        description='Process file with specified options'
    )
    parser.add_argument(
        'input',
        help='Input file path'
    )
    parser.add_argument(
        'output',
        help='Output file path'
    )
    parser.add_argument(
        '--format',
        default='auto',
        choices=['auto', 'standard', 'enhanced'],
        help='Output format (default: auto)'
    )

    args = parser.parse_args()

    try:
        process_file(args.input, args.output, args.format)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
```

## Example: PDF form filling skill

### SKILL.md

````markdown
---
name: filling-pdf-forms
description: Fills PDF form fields with data, validates forms, and verifies output. Use when filling out PDF forms, populating form fields, or batch-processing PDF documents.
---

# PDF Form Filling

Fill PDF forms reliably with validation and verification.

## Quick start

```bash
python scripts/fill_form.py template.pdf data.json output.pdf
```

## Workflow

Copy and track:

```
Form Filling Progress:
- [ ] Step 1: Analyze form structure
- [ ] Step 2: Prepare field data
- [ ] Step 3: Validate field data
- [ ] Step 4: Fill the form
- [ ] Step 5: Verify output
```

### Step 1: Analyze form structure

Extract all form fields:

```bash
python scripts/analyze_form.py template.pdf > fields.json
```

Output shows available fields:
```json
{
  "customer_name": {
    "type": "text",
    "required": true,
    "page": 0
  },
  "signature_date": {
    "type": "text",
    "required": true,
    "page": 0
  }
}
```

### Step 2: Prepare field data

Create `data.json` with values:

```json
{
  "customer_name": "John Smith",
  "signature_date": "2025-01-15"
}
```

### Step 3: Validate field data

**Critical: Validate before filling**

```bash
python scripts/validate_data.py data.json fields.json
```

Checks:
- All required fields present
- No unknown fields
- Values match expected types

If validation fails:
- Review error messages
- Fix issues in data.json
- Validate again

### Step 4: Fill the form

```bash
python scripts/fill_form.py template.pdf data.json output.pdf
```

### Step 5: Verify output

```bash
python scripts/verify_form.py output.pdf data.json
```

Confirms all fields filled correctly.

## Utility scripts

### analyze_form.py

Extract form structure:
```bash
python scripts/analyze_form.py INPUT.pdf
```

Outputs JSON with field definitions.

### validate_data.py

Validate data against form schema:
```bash
python scripts/validate_data.py DATA.json FIELDS.json
```

Exit 0 if valid, 1 if invalid.

### fill_form.py

Fill form with data:
```bash
python scripts/fill_form.py TEMPLATE.pdf DATA.json OUTPUT.pdf
```

### verify_form.py

Verify filled form:
```bash
python scripts/verify_form.py OUTPUT.pdf DATA.json
```

## Requirements

- Python 3.8+
- pdfplumber (pre-installed)
- PyPDF2 (pre-installed)

## Notes

- Always validate before filling
- Keep template PDF unchanged
- Use ISO date format: YYYY-MM-DD
- Run verification after filling
````

## When to use this template

Use scripts template when:
- Operations are fragile or error-prone
- Consistency is critical
- Complex algorithms needed
- Validation is important
- Token efficiency matters (execute vs generate)

## Benefits

1. **Reliability**: Pre-tested, consistent behavior
2. **Efficiency**: Execute without loading code into context
3. **Maintainability**: Update scripts independently
4. **Validation**: Enforce correctness programmatically
5. **Reusability**: Scripts work across similar tasks

## Tips

1. **Document clearly**: Explain what each script does
2. **Provide examples**: Show actual usage
3. **Handle errors**: Graceful error messages
4. **Validate early**: Catch issues before processing
5. **Test thoroughly**: Verify scripts with real inputs
