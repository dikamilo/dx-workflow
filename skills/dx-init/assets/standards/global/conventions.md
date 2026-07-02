# Conventions

Project-wide operational conventions.

## Predictable structure
Organize files and directories in a logical, navigable layout. A newcomer should be able to guess where something lives.

## Env vars over secrets
Store configuration in environment variables. Never commit secrets, API keys, or credentials to the repository.

## Minimal dependencies
Keep dependencies lean and current. Document why any major dependency was added; prefer the standard library or existing deps before reaching for a new one.

## Feature flags
Gate incomplete or risky features behind flags rather than keeping long-lived branches. Ship dark, enable when ready.

## Changelog
Record significant changes in a changelog or release notes so the "what changed and why" is discoverable without reading diffs.
