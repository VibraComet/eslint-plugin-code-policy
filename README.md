<div align="center">

<h1>eslint-plugin-code-policy</h1>

<p><strong>Architectural linting for TypeScript projects.</strong><br />
Enforce atomic files, explicit public APIs, clean runtime boundaries, and framework-safe module structure — automatically.</p>

[![npm version](https://img.shields.io/npm/v/eslint-plugin-code-policy?color=2563eb&label=npm&style=flat-square)](https://www.npmjs.com/package/eslint-plugin-code-policy)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![ESLint](https://img.shields.io/badge/ESLint-v9%2B%20flat%20config-8b5cf6?style=flat-square)](https://eslint.org/docs/latest/use/configure/configuration-files-new)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4%2B-3b82f6?style=flat-square)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-f59e0b?style=flat-square)](https://pnpm.io)

</div>

---

## Why?

Modern TypeScript projects — especially those using AI-assisted development — accumulate hidden complexity: god-files, circular dependencies, business logic bleeding into views, and internal module APIs being imported directly. Code review catches some of it. This plugin catches all of it at lint time.

`eslint-plugin-code-policy` encodes a strict, battle-tested architectural philosophy into ESLint rules:

- **One exported unit per file.** No helper functions hiding at the bottom. No internal utilities sharing a file with a component.
- **Public APIs are boundaries, not suggestions.** You cannot bypass a module's index by importing from its internals.
- **Views are views.** React components cannot own state, effects, or inline handlers — that logic lives in custom hooks.
- **Types are not inline.** Every type alias and interface lives in its own dedicated file.

---

## Packages

| Package                                                             | Description                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`eslint-plugin-code-policy`](./packages/eslint-plugin-code-policy) | The core ESLint plugin — rules, configs, and TypeScript types |

---

## Quick Start

```bash
npm install -D eslint-plugin-code-policy
# or
pnpm add -D eslint-plugin-code-policy
```

In your `eslint.config.mjs`:

```js
import codePolicy from 'eslint-plugin-code-policy'

export default [codePolicy.configs.recommended]
```

For Next.js projects:

```js
import codePolicy from 'eslint-plugin-code-policy'

export default [codePolicy.configs.next]
```

---

## Rules

| Rule                                                                                                              | Description                                                              | Recommended |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | :---------: |
| [`atomic-file`](./packages/eslint-plugin-code-policy/docs/rules/atomic-file.md)                                   | Enforce exactly one top-level declaration per file                       |     ✅      |
| [`no-inline-types`](./packages/eslint-plugin-code-policy/docs/rules/no-inline-types.md)                           | Enforce that type aliases and interfaces live in their own files         |     ✅      |
| [`public-api-imports`](./packages/eslint-plugin-code-policy/docs/rules/public-api-imports.md)                     | Prevent importing directly from internal module subpaths                 |     ✅      |
| [`no-cross-module-deep-imports`](./packages/eslint-plugin-code-policy/docs/rules/no-cross-module-deep-imports.md) | Prevent relative imports that bypass another module's public API         |     ✅      |
| [`view-logic-separation`](./packages/eslint-plugin-code-policy/docs/rules/view-logic-separation.md)               | Prevent state, effects, and inline handlers inside React view components |     ✅      |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE) © Cristian Deluxe
