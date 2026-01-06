# Skill with References Template

Use this template for skills that need separate reference documentation files.

## Directory structure

```
skill-name/
├── SKILL.md              # Main overview and navigation
├── reference/            # Detailed documentation
│   ├── api.md           # API reference
│   ├── examples.md      # Detailed examples
│   └── patterns.md      # Common patterns
└── README.md            # Optional: skill documentation
```

## SKILL.md template

````markdown
---
name: your-skill-name
description: What this skill does and when to use it. Include trigger keywords and contexts.
---

# Skill Title

[Concise overview paragraph]

## Quick start

[Simplest usage example - copy-paste ready]

## Core workflow

[High-level steps for common use case]

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Reference documentation

Detailed information organized by topic:

**[Topic A]**: See [reference/topic-a.md](reference/topic-a.md)
**[Topic B]**: See [reference/topic-b.md](reference/topic-b.md)
**[Topic C]**: See [reference/topic-c.md](reference/topic-c.md)

## Quick search

Find specific information:

```bash
grep -i "keyword" reference/*.md
```

## Common patterns

[Brief overview of 2-3 most common patterns, link to examples.md for more]

See [reference/examples.md](reference/examples.md) for complete examples.

## Notes

[Important limitations, caveats, or tips]
````

## Reference file template

````markdown
# [Reference Topic]

[Brief introduction to this reference area]

## Contents
- [Section 1]
- [Section 2]
- [Section 3]

## [Section 1]

[Detailed information]

### [Subsection]

[More details]

#### Example

[Concrete example showing this feature]

## [Section 2]

[Continue organizing content...]
````

## Example: API integration skill

### skill-name/SKILL.md

````markdown
---
name: integrating-bigquery
description: Query and analyze BigQuery data with company-specific schemas and conventions. Use when analyzing BigQuery data, running SQL queries, or accessing company datasets.
---

# BigQuery Integration

Query company BigQuery datasets following data conventions and best practices.

## Quick start

```sql
-- Query sales data
SELECT
  date,
  SUM(revenue) as total_revenue
FROM `company.sales.transactions`
WHERE date >= '2025-01-01'
  AND is_test_account = FALSE
GROUP BY date
ORDER BY date
```

## Core workflow

1. Identify the dataset and table needed
2. Check schema reference for available fields
3. Write query following conventions
4. Apply standard filters (exclude test accounts)
5. Run query and analyze results

## Reference documentation

**Dataset schemas**: See [reference/schemas.md](reference/schemas.md)
- Sales tables and fields
- User tables and metrics
- Product tables and attributes

**Query conventions**: See [reference/conventions.md](reference/conventions.md)
- Naming standards
- Required filters
- Performance tips

**Common queries**: See [reference/examples.md](reference/examples.md)
- Revenue analysis
- User cohorts
- Product usage

## Quick search

Find specific tables or fields:

```bash
grep -i "revenue" reference/schemas.md
grep -i "user_id" reference/*.md
```

## Standard filters

Always apply these filters:

```sql
WHERE is_test_account = FALSE
  AND is_deleted = FALSE
```

## Notes

- All timestamps are in UTC
- Revenue values in USD cents
- User IDs are UUIDs
- Test accounts must be excluded
````

### skill-name/reference/schemas.md

````markdown
# BigQuery Schemas

Complete reference for company BigQuery tables and fields.

## Contents
- Sales tables
- User tables
- Product tables

## Sales tables

### `company.sales.transactions`

Transaction-level sales data.

**Key fields:**
- `transaction_id` (STRING): Unique transaction identifier
- `user_id` (STRING): User UUID
- `date` (DATE): Transaction date (UTC)
- `revenue` (INTEGER): Revenue in USD cents
- `is_test_account` (BOOLEAN): Test account flag
- `product_id` (STRING): Product identifier

**Standard query:**
```sql
SELECT
  date,
  COUNT(DISTINCT transaction_id) as transaction_count,
  SUM(revenue) / 100.0 as total_revenue_usd
FROM `company.sales.transactions`
WHERE date >= '2025-01-01'
  AND is_test_account = FALSE
GROUP BY date
```

### `company.sales.subscriptions`

Subscription-level recurring revenue.

**Key fields:**
- `subscription_id` (STRING): Unique subscription ID
- `user_id` (STRING): User UUID
- `plan_name` (STRING): Subscription plan
- `mrr` (INTEGER): Monthly recurring revenue (USD cents)
- `start_date` (DATE): Subscription start
- `end_date` (DATE): Subscription end (NULL if active)
- `is_test_account` (BOOLEAN): Test account flag

**Active subscriptions:**
```sql
SELECT
  plan_name,
  COUNT(*) as subscription_count,
  SUM(mrr) / 100.0 as total_mrr_usd
FROM `company.sales.subscriptions`
WHERE end_date IS NULL
  AND is_test_account = FALSE
GROUP BY plan_name
```

## User tables

### `company.users.accounts`

User account information.

**Key fields:**
- `user_id` (STRING): User UUID (primary key)
- `email` (STRING): User email
- `created_at` (TIMESTAMP): Account creation
- `is_test_account` (BOOLEAN): Test account flag
- `is_deleted` (BOOLEAN): Soft delete flag
- `signup_source` (STRING): Acquisition channel

**New users by month:**
```sql
SELECT
  DATE_TRUNC(created_at, MONTH) as month,
  COUNT(*) as new_users
FROM `company.users.accounts`
WHERE is_test_account = FALSE
  AND is_deleted = FALSE
GROUP BY month
ORDER BY month
```

[Continue with other tables...]
````

### skill-name/reference/conventions.md

````markdown
# Query Conventions

Standards and best practices for BigQuery queries.

## Naming conventions

**Tables:**
- Use fully qualified names: `project.dataset.table`
- Format: `company.domain.entity`

**Fields:**
- Use snake_case: `user_id`, `created_at`
- Boolean fields: prefix with `is_`: `is_test_account`
- Timestamps: suffix with `_at`: `created_at`
- Dates: suffix with `_date`: `start_date`

**Aggregations:**
- Descriptive names: `total_revenue`, `user_count`
- Include unit when relevant: `total_revenue_usd`

## Required filters

**Always exclude:**
```sql
WHERE is_test_account = FALSE
  AND is_deleted = FALSE
```

**Date ranges:**
- Use inclusive start, exclusive end
- Always specify timezone context

```sql
WHERE date >= '2025-01-01'
  AND date < '2025-02-01'
```

## Performance tips

**Partition filtering:**
- Always filter on partitioned columns (usually `date`)
- Put partition filters early in WHERE clause

**Column selection:**
- Select only needed columns
- Avoid `SELECT *` on large tables

**Aggregations:**
- Use approximate aggregations for large datasets:
  - `APPROX_COUNT_DISTINCT()` instead of `COUNT(DISTINCT)`
  - When precision isn't critical

## Example query structure

```sql
-- Good query structure
SELECT
  -- Date/dimension fields first
  date,
  product_id,

  -- Aggregations second
  COUNT(DISTINCT user_id) as user_count,
  SUM(revenue) / 100.0 as total_revenue_usd,
  ROUND(AVG(revenue) / 100.0, 2) as avg_revenue_usd

FROM `company.sales.transactions`

WHERE
  -- Partition filter first
  date >= '2025-01-01'
  AND date < '2025-02-01'

  -- Standard filters
  AND is_test_account = FALSE
  AND is_deleted = FALSE

  -- Additional filters
  AND revenue > 0

GROUP BY
  date,
  product_id

ORDER BY
  date DESC,
  total_revenue_usd DESC

LIMIT 1000
```
````

## When to use this template

Use reference-based template when:
- Skill documentation exceeds ~300 lines
- Multiple distinct topics or domains
- Detailed API or schema documentation
- Content updates independently
- Users may need different subsets of information

## Benefits of this pattern

1. **Progressive disclosure**: Claude loads only needed sections
2. **Maintainability**: Update docs without touching main file
3. **Organization**: Clear separation of concerns
4. **Searchability**: grep makes finding specific info easy
5. **Scalability**: Easy to add new reference sections

## Tips

1. **Keep SKILL.md as navigation**: Overview + links to details
2. **Organize by domain**: Group related info together
3. **Add table of contents**: Especially for long reference files
4. **Use consistent structure**: Similar format across reference files
5. **Make files searchable**: Use descriptive headings and terms
