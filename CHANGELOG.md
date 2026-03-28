# Changelog

All notable changes to `eslint-plugin-code-policy` will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `atomic-file` — enforce exactly one top-level declaration per file
- `no-inline-types` — enforce that type aliases and interfaces live in their own files
- `public-api-imports` — prevent deep imports from absolute/alias module paths
- `no-cross-module-deep-imports` — prevent relative imports that bypass another module's public API in a monorepo
- `view-logic-separation` — prevent state, effects, and inline handlers inside React view components
- Shareable flat configs: `recommended`, `strict`, `react`, `next`

---

## [0.1.0] — 2026-03-28

Initial release.
