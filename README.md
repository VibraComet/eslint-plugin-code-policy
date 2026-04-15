<div align="center">

<h1>eslint-plugin-code-policy</h1>

<p><strong>Architectural linting for TypeScript projects.</strong><br />
Enforce atomic files, explicit public APIs, clean runtime boundaries, and framework-safe module structure — automatically.</p>

[![npm version](https://img.shields.io/npm/v/eslint-plugin-code-policy?color=2563eb&label=npm&style=flat-square)](https://www.npmjs.com/package/eslint-plugin-code-policy)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![ESLint](https://img.shields.io/badge/ESLint-v9%2B%20flat%20config-8b5cf6?style=flat-square)](https://eslint.org/docs/latest/use/configure/configuration-files-new)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4%2B-3b82f6?style=flat-square)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-f59e0b?style=flat-square)](https://pnpm.io)
[![llms.txt](https://img.shields.io/badge/llms.txt-AI%20ready-f59e0b?style=flat-square)](https://vibracomet.github.io/eslint-plugin-code-policy/llms.txt)

</div>

---

## Why?

Modern TypeScript projects — especially those using AI-assisted development — accumulate hidden complexity: god-files, circular dependencies, business logic bleeding into views, and internal module APIs being imported directly. Code review catches some of it. This plugin catches all of it at lint time.

`eslint-plugin-code-policy` encodes a strict, battle-tested architectural philosophy into ESLint rules:

- **One exported unit per file.** No helper functions hiding at the bottom. No internal utilities sharing a file with a component.
- **No hidden declarations.** Every top-level symbol must be exported. Private helpers have no place at module scope.
- **Public APIs are boundaries, not suggestions.** You cannot bypass a module's `index` by importing from its internals.
- **Types are not inline.** Every type alias and interface in a runtime file must live in its own dedicated file.
- **Barrel files are pure.** An `index.*` file is either a re-export hub or a declaration file — never both.
- **Views are views.** React components cannot own state, effects, or inline handlers — that logic lives in custom hooks.
- **Files live where they belong.** Hooks go in `hooks/`, formatters in `formatters/`, etc. Generic `utils/` folders are banned.

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

### Available configs

| Config                           | Use when                                                |
| -------------------------------- | ------------------------------------------------------- |
| `codePolicy.configs.recommended` | Any TypeScript project — the baseline                   |
| `codePolicy.configs.strict`      | Same as recommended (stricter overrides coming)         |
| `codePolicy.configs.react`       | React projects (warns on view/logic violations)         |
| `codePolicy.configs.next`        | Next.js App Router — aware of reserved exports & routes |

```js
// Next.js
import codePolicy from 'eslint-plugin-code-policy'
export default [codePolicy.configs.next]

// React (non-Next)
import codePolicy from 'eslint-plugin-code-policy'
export default [codePolicy.configs.react]
```

---

## Rules

### Active rules

| Rule                                                                    | Description                                                                   | Recommended | Severity |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- | :---------: | :------: |
| [`one-primary-unit`](#one-primary-unit)                                 | A file must export exactly one primary top-level unit                         |     ✅      |  error   |
| [`no-hidden-top-level-declarations`](#no-hidden-top-level-declarations) | Every top-level declaration must be exported                                  |     ✅      |  error   |
| [`no-inline-types-in-runtime-files`](#no-inline-types-in-runtime-files) | Type aliases and interfaces must not live inside runtime files                |     ✅      |  error   |
| [`file-kind-placement`](#file-kind-placement)                           | Atomic units must reside in their expected semantic folder                    |     ✅      |  error   |
| [`no-mixed-barrel`](#no-mixed-barrel)                                   | Barrel files must be pure re-export hubs or pure declaration files            |     ✅      |  error   |
| [`public-api-imports`](#public-api-imports)                             | Cross-module imports must target a module's public API, not `/src/` internals |     ✅      |  error   |
| [`no-cross-module-deep-imports`](#no-cross-module-deep-imports)         | Relative imports must not bypass another monorepo module's public API         |     ✅      |  error   |
| [`view-logic-separation`](#view-logic-separation)                       | React view files (`.tsx`) must not contain state, effects, or inline handlers |     ✅      |   warn   |

### Legacy rules (off by default)

| Rule              | Status                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `atomic-file`     | Replaced by `one-primary-unit` + `no-hidden-top-level-declarations` |
| `no-inline-types` | Replaced by `no-inline-types-in-runtime-files`                      |

---

## Rule Reference

### `one-primary-unit`

A file must export **exactly one** primary top-level unit. A "primary unit" is a `function`, `class`, `const`, `type`, `interface`, or `enum` that is directly exported (named or default).

Exempt: `*.config.*`, `*.d.ts`, `index.*`, `proxy.ts`, and Next.js reserved exports (`default`, `generateMetadata`, HTTP methods in route files, etc.).

```ts
// ❌ Two exports in one file
export function parseDate() { ... }
export function formatDate() { ... }

// ✅ One export per file
export function parseDate() { ... }
```

---

### `no-hidden-top-level-declarations`

Every top-level declaration at module scope must be exported. Private helpers cannot hide inside a file — extract them into their own file and import them explicitly.

Exempt: `*.config.*`, `*.d.ts`, `proxy.ts`.

```ts
// ❌ Unexported helper at module scope
function isValid(x: string) {
  return x.length > 0
}
export function validate(x: string) {
  return isValid(x)
}

// ✅ Helper extracted to its own file
import { isValid } from './isValid.js'
export function validate(x: string) {
  return isValid(x)
}
```

---

### `no-inline-types-in-runtime-files`

`interface` and `type` declarations are forbidden inside a runtime file when the file also contains runtime code (functions, classes, constants). Extract the type to its own dedicated file.

Exempt: `*.config.*`, `*.d.ts`, `proxy.ts`, and files that are _only_ type declarations.

```ts
// ❌ Type mixed with runtime code
interface UserProps { id: string }
export function getUser(props: UserProps) { ... }

// ✅ Type lives in its own file (UserProps.ts)
import type { UserProps } from './UserProps.js'
export function getUser(props: UserProps) { ... }
```

---

### `file-kind-placement`

Atomic units must live in the semantic folder that matches their kind. Generic folder names (`utils/`, `helpers/`) are banned entirely.

| Detected by                                                           | Expected folder  |
| --------------------------------------------------------------------- | ---------------- |
| filename starts with `use`                                            | `hooks/`         |
| filename starts with `format` or ends with `Formatter.ts`             | `formatters/`    |
| filename starts with `validate` or ends with `Validator.ts`           | `validators/`    |
| filename starts with `map`, ends with `Mapper.ts` or `Transformer.ts` | `mappers/`       |
| filename starts with `select` or ends with `Selector.ts`              | `selectors/`     |
| parent folder is `utils` or `helpers`                                 | ❌ always banned |

```
// ❌ Hook outside hooks/
src/auth/useSession.ts

// ✅ Hook inside hooks/
src/auth/hooks/useSession.ts

// ❌ Generic folder
src/utils/formatCurrency.ts

// ✅ Semantic folder
src/formatters/formatCurrency.ts
```

---

### `no-mixed-barrel`

Barrel files (`index.ts`, `index.tsx`, `index.js`) must be **either** pure re-export hubs **or** pure declaration files. Mixing `export { X } from '...'` re-exports with inline `export function` / `export const` declarations is forbidden.

```ts
// ❌ Mixed: re-exports + inline declaration
export { Button } from './Button.js'
export { Input } from './Input.js'

export const DEFAULT_SIZE = 'md' // ← inline declaration alongside re-exports

// ✅ Pure barrel
export { Button } from './Button.js'
export { Input } from './Input.js'

// ✅ Pure declaration file (no re-exports)
export const DEFAULT_SIZE = 'md'
```

---

### `public-api-imports`

Cross-package (absolute/alias) imports must not reach into a package's `/src/` directory or other banned internal subpaths. Always import from the package's published public API.

**Options**

```js
// eslint.config.mjs
'code-policy/public-api-imports': ['error', {
  bannedSubpaths: ['/src/'],  // default
}]
```

```ts
// ❌ Reaching into src/
import { helper } from '@myorg/core/src/utils/helper'

// ✅ Public API
import { helper } from '@myorg/core'
```

---

### `no-cross-module-deep-imports`

Relative imports that traverse two or more `../` levels and then descend into an internal directory (e.g. `src/`) are forbidden. This prevents sibling packages in a monorepo from bypassing each other's public API.

**Options**

```js
// eslint.config.mjs
'code-policy/no-cross-module-deep-imports': ['error', {
  minParentTraversals: 2,   // default: 2 — how many `../` before the check triggers
  internalDirs: ['src'],    // default: ['src'] — dirs that signal internal code
}]
```

```ts
// ❌ Deep import across package boundary
import { helper } from '../../core/src/utils/helper'

// ✅ Through the public API
import { helper } from '@myorg/core'
```

---

### `view-logic-separation`

Applies only to `.tsx` files. React view components must not contain:

- `useState`, `useEffect`, `useReducer`, `useCallback`, `useMemo`, `useRef`, and other React hooks
- Inline function or handler declarations defined inside the component body

All logic must be extracted to a custom hook.

```tsx
// ❌ View with state and handler
export function UserCard() {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen(true)
  return <button onClick={handleClick}>...</button>
}

// ✅ Logic in a hook, view is pure JSX
// useUserCard.ts
export function useUserCard() {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen(true)
  return { open, handleClick }
}

// UserCard.tsx
export function UserCard() {
  const { open, handleClick } = useUserCard()
  return <button onClick={handleClick}>...</button>
}
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE) © Cristian Deluxe
