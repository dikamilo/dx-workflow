# Coding Style

Global, language-agnostic style rules. Language- or layer-specific rules live under `frontend/`, `backend/`, `testing/` (filled by `dx-standards-discover`).

## Naming consistency
Follow the naming patterns already established in the codebase for variables, functions, types, and files. Consistency beats personal preference.

## Descriptive names
Names state intent. Avoid cryptic abbreviations and single-letter identifiers outside tight loops. A reader should not need the definition to know what a name means.

## Automatic formatting
Let the project's formatter own indentation, spacing, and line breaks. Don't hand-format; don't fight the tool.

## Focused functions
A function does one thing. Smaller units are easier to read, test, and change. When a function needs a paragraph to explain, it is doing too much.

## No dead code
Remove unused imports, commented-out blocks, and orphaned functions rather than leaving them behind. Version control is the history.

## DRY
Extract genuinely repeated logic into one place. Don't abstract coincidental duplication — two things that look alike today but change for different reasons are not duplication.
