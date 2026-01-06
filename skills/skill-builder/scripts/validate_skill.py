#!/usr/bin/env python3
"""
Validate Claude Agent Skill structure and content.

Usage:
    python validate_skill.py SKILL_DIR

Checks:
    - SKILL.md exists
    - YAML frontmatter is valid
    - Name follows requirements (lowercase, hyphens, 64 chars max)
    - Description meets requirements (non-empty, 1024 chars max)
    - File paths use forward slashes
    - No reserved words in name

Exit codes:
    0 - Validation passed
    1 - Validation failed
"""

import argparse
import re
import sys
from pathlib import Path


RESERVED_WORDS = ['anthropic', 'claude']
MAX_NAME_LENGTH = 64
MAX_DESCRIPTION_LENGTH = 1024


def validate_skill_directory(skill_dir):
    """
    Validate skill directory structure and SKILL.md.

    Args:
        skill_dir: Path to skill directory

    Returns:
        Tuple of (success: bool, errors: list, warnings: list)
    """
    skill_path = Path(skill_dir)
    errors = []
    warnings = []

    # Check directory exists
    if not skill_path.exists():
        errors.append(f"Directory not found: {skill_dir}")
        return False, errors, warnings

    if not skill_path.is_dir():
        errors.append(f"Not a directory: {skill_dir}")
        return False, errors, warnings

    # Check SKILL.md exists
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        errors.append(f"SKILL.md not found in {skill_dir}")
        return False, errors, warnings

    # Read SKILL.md
    try:
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        errors.append(f"Error reading SKILL.md: {e}")
        return False, errors, warnings

    # Parse frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not frontmatter_match:
        errors.append("SKILL.md must start with YAML frontmatter (---)")
        return False, errors, warnings

    frontmatter = frontmatter_match.group(1)
    body = content[frontmatter_match.end():]

    # Extract name and description
    name_match = re.search(r'^name:\s*(.+)$', frontmatter, re.MULTILINE)
    desc_match = re.search(r'^description:\s*(.+)$', frontmatter, re.MULTILINE)

    if not name_match:
        errors.append("Missing 'name' field in YAML frontmatter")
    if not desc_match:
        errors.append("Missing 'description' field in YAML frontmatter")

    if not name_match or not desc_match:
        return False, errors, warnings

    name = name_match.group(1).strip()
    description = desc_match.group(1).strip()

    # Validate name
    name_errors = validate_name(name)
    errors.extend(name_errors)

    # Validate description
    desc_errors = validate_description(description)
    errors.extend(desc_errors)

    # Check body content
    body_warnings = check_body_content(body)
    warnings.extend(body_warnings)

    # Check file paths
    path_errors = check_file_paths(skill_path)
    errors.extend(path_errors)

    # Check for common anti-patterns
    antipattern_warnings = check_antipatterns(content, skill_path)
    warnings.extend(antipattern_warnings)

    success = len(errors) == 0
    return success, errors, warnings


def validate_name(name):
    """Validate skill name field."""
    errors = []

    if not name:
        errors.append("Name cannot be empty")
        return errors

    # Check length
    if len(name) > MAX_NAME_LENGTH:
        errors.append(
            f"Name exceeds {MAX_NAME_LENGTH} characters: '{name}' ({len(name)} chars)"
        )

    # Check character set
    if not re.match(r'^[a-z0-9-]+$', name):
        errors.append(
            f"Name must contain only lowercase letters, numbers, and hyphens: '{name}'"
        )

    # Check for reserved words
    for word in RESERVED_WORDS:
        if word in name:
            errors.append(
                f"Name contains reserved word '{word}': '{name}'"
            )

    # Check for underscores (common mistake)
    if '_' in name:
        errors.append(
            f"Name contains underscores. Use hyphens instead: '{name}'"
        )

    # Check for spaces
    if ' ' in name:
        errors.append(
            f"Name contains spaces. Use hyphens instead: '{name}'"
        )

    return errors


def validate_description(description):
    """Validate skill description field."""
    errors = []

    if not description:
        errors.append("Description cannot be empty")
        return errors

    # Check length
    if len(description) > MAX_DESCRIPTION_LENGTH:
        errors.append(
            f"Description exceeds {MAX_DESCRIPTION_LENGTH} characters "
            f"({len(description)} chars)"
        )

    # Check for XML tags
    if '<' in description or '>' in description:
        errors.append("Description contains XML tags (< or >)")

    # Check for first-person language (common mistake)
    first_person_patterns = [
        r'\bI can\b',
        r'\bI will\b',
        r'\bI help\b',
        r'\bmy\b',
    ]
    for pattern in first_person_patterns:
        if re.search(pattern, description, re.IGNORECASE):
            errors.append(
                "Description should use third person, not first person "
                f"(found: {pattern})"
            )

    # Check for second-person language
    second_person_patterns = [
        r'\byou can\b',
        r'\byou will\b',
        r'\byour\b',
    ]
    for pattern in second_person_patterns:
        if re.search(pattern, description, re.IGNORECASE):
            errors.append(
                "Description should use third person, not second person "
                f"(found: {pattern})"
            )

    return errors


def check_body_content(body):
    """Check SKILL.md body for potential issues."""
    warnings = []

    # Check length
    line_count = len(body.split('\n'))
    if line_count > 500:
        warnings.append(
            f"SKILL.md body has {line_count} lines (recommended: under 500). "
            "Consider splitting into reference files."
        )

    # Check for time-sensitive information
    time_patterns = [
        r'\b20\d{2}\b',  # Years like 2025
        r'\bbefore \w+ 20\d{2}\b',
        r'\bafter \w+ 20\d{2}\b',
        r'\bcurrently\b',
        r'\bright now\b',
    ]
    for pattern in time_patterns:
        matches = re.findall(pattern, body, re.IGNORECASE)
        if matches:
            warnings.append(
                f"Possible time-sensitive content: {matches[0]}. "
                "Consider using 'old patterns' section."
            )
            break  # Only warn once

    return warnings


def check_file_paths(skill_path):
    """Check for Windows-style paths in all files."""
    errors = []

    for file_path in skill_path.rglob('*.md'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Look for Windows-style paths
            if re.search(r'[a-zA-Z]:\\', content):
                errors.append(
                    f"Windows-style path found in {file_path.relative_to(skill_path)}: "
                    "Use forward slashes (/) instead"
                )
            elif re.search(r'\w+\\\w+', content):
                # Less strict check for backslashes
                rel_path = file_path.relative_to(skill_path)
                errors.append(
                    f"Possible Windows-style path in {rel_path}: "
                    "Use forward slashes (/) for file paths"
                )
        except Exception:
            # Skip files that can't be read
            pass

    return errors


def check_antipatterns(content, skill_path):
    """Check for common anti-patterns."""
    warnings = []

    # Check for excessive explanation
    verbose_indicators = [
        'As you may know',
        'It is important to understand',
        'Let me explain',
        'For example, this means',
    ]
    for indicator in verbose_indicators:
        if indicator in content:
            warnings.append(
                f"Possible verbose explanation: '{indicator}'. "
                "Keep content concise."
            )

    # Check for vague language in name
    skill_md = skill_path / "SKILL.md"
    with open(skill_md, 'r', encoding='utf-8') as f:
        name_match = re.search(r'^name:\s*(.+)$', f.read(), re.MULTILINE)
        if name_match:
            name = name_match.group(1).strip()
            vague_words = ['helper', 'utils', 'tools', 'utility']
            for word in vague_words:
                if word in name:
                    warnings.append(
                        f"Vague name component: '{word}'. "
                        "Use descriptive, specific names."
                    )

    return warnings


def main():
    parser = argparse.ArgumentParser(
        description='Validate Claude Agent Skill structure'
    )
    parser.add_argument(
        'skill_dir',
        help='Path to skill directory containing SKILL.md'
    )
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Show detailed output'
    )

    args = parser.parse_args()

    if args.verbose:
        print(f"Validating skill: {args.skill_dir}\n")

    success, errors, warnings = validate_skill_directory(args.skill_dir)

    # Print results
    if errors:
        print("❌ Validation failed\n")
        print("Errors:")
        for error in errors:
            print(f"  ✗ {error}")
        print()

    if warnings:
        print("Warnings:")
        for warning in warnings:
            print(f"  ⚠️  {warning}")
        print()

    if success and not warnings:
        print("✅ Validation passed - skill structure looks good!")
    elif success:
        print("✅ Validation passed (with warnings)")
    else:
        print(f"\nFound {len(errors)} error(s) and {len(warnings)} warning(s)")

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
